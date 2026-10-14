import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

export const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

export function safeRelative(file) {
  if (typeof file !== 'string' || !file || file.includes('\\') || /[:?#\0]/.test(file) || file.startsWith('/') || file.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`Unsafe manifest path: ${file}`);
  }
  return file;
}

export function validateManifest(manifest) {
  if (manifest?.version !== 1 || !['entrypoints','modules','files','assets'].every(key => Array.isArray(manifest[key]))) throw new Error('Invalid release manifest schema');
  const outputs = new Set(['release-manifest.json']);
  const sources = new Set();
  const entries = [...manifest.modules.map(item => ({...item,kind:'module'})), ...manifest.files.map(item => ({...item,kind:'file'})), ...manifest.assets.map(source => ({source,output:source,kind:'asset'}))];
  for (const item of entries) {
    safeRelative(item.source); safeRelative(item.output);
    // Case-insensitive collisions would overwrite files on Windows.
    const outputKey = item.output.toLowerCase();
    if (outputs.has(outputKey)) throw new Error(`Duplicate output: ${item.output}`);
    if (sources.has(item.source)) throw new Error(`Duplicate source: ${item.source}`);
    outputs.add(outputKey); sources.add(item.source);
    if (item.kind === 'asset' && !item.source.startsWith('assets/')) throw new Error(`Asset path must be inside assets: ${item.source}`);
  }
  for (const entry of manifest.entrypoints) {
    safeRelative(entry);
    if (!manifest.files.some(item => item.source === entry)) throw new Error(`Missing entrypoint: ${entry}`);
  }
  return entries;
}

export async function readManifest(root = repositoryRoot) {
  const manifest = JSON.parse(await fs.readFile(path.join(root,'config/release-manifest.json'),'utf8'));
  validateManifest(manifest);
  return manifest;
}

// Token positions let us replace only ESM specifier strings, preserving comments,
// other strings, and version suffixes rather than globally replacing filenames.
function tokens(source) {
  const result = [];
  const parentheses = [];
  const expressionPrefixes = new Set(['(','[','{',',',';',':','=','!','?','&','|','+','-','*','%','~','<','>','return','throw','case','delete','typeof','void','yield','await','in','of','else','do']);
  const controlConditions = new Set(['if','while','for','with','switch','catch']);
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (/\s/.test(c)) { i++; continue; }
    if (source.startsWith('//',i)) { const end=source.indexOf('\n',i+2); i=end<0?source.length:end+1; continue; }
    if (source.startsWith('/*',i)) { const end=source.indexOf('*/',i+2); if(end<0)throw new Error('Unclosed module comment'); i=end+2; continue; }
    const previous=result.at(-1);
    // A slash begins a regular expression only where an expression can start.
    // Closing a control condition starts a statement; closing a call does not.
    if(c==='/' && (!previous || previous.regexAfter || expressionPrefixes.has(previous.value))) {
      const start=i++;
      let characterClass=false,closed=false;
      while(i<source.length) {
        const current=source[i++];
        if(current==='\\') { i++; continue; }
        if(current==='[')characterClass=true;
        else if(current===']')characterClass=false;
        else if(current==='/' && !characterClass) { closed=true; break; }
        else if(current==='\n' || current==='\r')break;
      }
      if(!closed)throw new Error('Unclosed module regular expression');
      while(i<source.length && /[A-Za-z]/.test(source[i]))i++;
      result.push({type:'regex',value:source.slice(start,i)});
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const start=i++, quote=c;
      while(i<source.length && source[i]!==quote) { if(source[i]==='\\')i++; i++; }
      if(i>=source.length)throw new Error('Unclosed module string');
      i++;
      result.push({type:quote==='`'?'template':'string',value:source.slice(start+1,i-1),start:start+1,end:i-1});
      continue;
    }
    const word = /^[A-Za-z_$][\w$]*/.exec(source.slice(i));
    if(word) { result.push({type:'word',value:word[0]}); i+=word[0].length; }
    else {
      if(c==='(')parentheses.push(controlConditions.has(previous?.value));
      const regexAfter=c===')' && parentheses.pop()===true;
      result.push({type:'punctuation',value:c,regexAfter}); i++;
    }
  }
  return result;
}

// Closure supports static ESM and import('quoted literal') only. Computed,
// template, or concatenated dynamic imports are rejected rather than omitted.
// import.meta is metadata and does not declare a dependency.
export function moduleSpecifiers(source) {
  const stream=tokens(source), result=[];
  for(let i=0;i<stream.length;i++) {
    const token=stream[i];
    if(token.type!=='word' || stream[i-1]?.value==='.')continue;
    if(token.value==='import') {
      const next=stream[i+1];
      if(next?.value==='.')continue; // import.meta
      if(next?.type==='string') { result.push(next); continue; }
      if(next?.value==='(') {
        if(stream[i+2]?.type!=='string' || stream[i+3]?.value!==')')throw new Error('Dynamic import must use a single quoted literal to validate dependency closure');
        result.push(stream[i+2]); continue;
      }
    } else if(token.value!=='export' || !['*','{'].includes(stream[i+1]?.value))continue;
    for(let j=i+1;j<stream.length && stream[j].value!==';';j++) {
      if(stream[j].value==='from' && stream[j+1]?.type==='string') { result.push(stream[j+1]); break; }
      if(j>i+1 && ['import','export'].includes(stream[j].value))break;
    }
  }
  return result;
}

function resolveDependency(specifier, source, mapping) {
  const index=specifier.search(/[?#]/),file=index<0?specifier:specifier.slice(0,index),suffix=index<0?'':specifier.slice(index);
  if (!file.startsWith('.') && !file.startsWith('/')) throw new Error(`Unsupported import ${specifier} in ${source}`);
  const dependency = path.posix.normalize(file.startsWith('/')?file.slice(1):path.posix.join(path.posix.dirname(source),file));
  const target = mapping.get(dependency);
  if (!target) throw new Error(`Missing import dependency ${specifier} in ${source}`);
  let relative = path.posix.relative(path.posix.dirname(mapping.get(source)),target);
  if (!relative.startsWith('.')) relative='./'+relative;
  return relative+suffix;
}

export function rewriteModule(source, filename, mapping) {
  const edits=moduleSpecifiers(source).map(token => ({...token,replacement:resolveDependency(token.value,filename,mapping)}));
  for(const edit of edits.reverse())source=source.slice(0,edit.start)+edit.replacement+source.slice(edit.end);
  return source;
}

export function rewriteHTML(html, filename, mapping) {
  html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,(match,attributes,body) => {
    if(!/\btype\s*=\s*(?:"module"|'module'|module(?=\s|$))/i.test(attributes))return match;
    return `<script${attributes}>${rewriteModule(body,filename,mapping)}</script>`;
  });
  return html.replace(/\b(src|href)\s*=\s*(["'])([^"']+)\2/gi,(match,attribute,quote,url) => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url))return match;
    const index=url.search(/[?#]/), file=index<0?url:url.slice(0,index), suffix=index<0?'':url.slice(index);
    const dependency=path.posix.normalize(file.startsWith('/')?file.slice(1):path.posix.join(path.posix.dirname(filename),file));
    const target=mapping.get(dependency);
    if(!target) {
      if(/\.js$/i.test(file))throw new Error(`Missing HTML module dependency ${url} in ${filename}`);
      return match;
    }
    return `${attribute}=${quote}${path.posix.relative(path.posix.dirname(mapping.get(filename)),target)}${suffix}${quote}`;
  });
}

async function inputBytes(root, source) {
  let filename=root;
  for(const part of source.split('/')) {
    filename=path.join(filename,part);
    if((await fs.lstat(filename)).isSymbolicLink())throw new Error(`Input path must not contain symbolic links: ${source}`);
  }
  if(!(await fs.stat(filename)).isFile())throw new Error(`Input is not a file: ${source}`);
  return fs.readFile(filename);
}

export async function build({root=repositoryRoot,outDir} = {}) {
  root=path.resolve(root);
  const rootStat=await fs.lstat(root);
  if(!rootStat.isDirectory() || rootStat.isSymbolicLink())throw new Error('Repository root must be a directory without a symbolic link');
  const dist=path.resolve(root,'dist');
  if(outDir!==undefined && path.resolve(root,outDir)!==dist)throw new Error('Output directory must be the repository dist directory');
  const manifest=await readManifest(root),entries=validateManifest(manifest);
  const mapping=new Map(entries.map(item=>[item.source,item.output]));
  const prepared=[];
  // Validate and prepare all bytes before removing any previous build.
  for(const item of entries) {
    let bytes=await inputBytes(root,item.source);
    const sourceSha256=createHash('sha256').update(bytes).digest('hex');
    if(item.kind==='module')bytes=Buffer.from(rewriteModule(bytes.toString('utf8'),item.source,mapping));
    else if(/\.html$/i.test(item.source))bytes=Buffer.from(rewriteHTML(bytes.toString('utf8'),item.source,mapping));
    prepared.push({...item,bytes,sourceSha256});
  }
  try {
    if((await fs.lstat(dist)).isSymbolicLink())throw new Error('Output dist must not be a symbolic link');
  } catch(error) { if(error.code!=='ENOENT')throw error; }
  // The exact absolute target has been checked above; no arbitrary output cleanup.
  await fs.rm(dist,{recursive:true,force:true});
  await fs.mkdir(dist,{recursive:true});
  const result={version:1,entrypoints:manifest.entrypoints.map(source=>mapping.get(source)),files:[]};
  for(const item of prepared) {
    const target=path.join(dist,item.output);
    await fs.mkdir(path.dirname(target),{recursive:true});
    await fs.writeFile(target,item.bytes);
    result.files.push({path:item.output,source:item.source,size:item.bytes.length,sourceSha256:item.sourceSha256,sha256:createHash('sha256').update(item.bytes).digest('hex')});
  }
  result.files.sort((a,b)=>a.path.localeCompare(b.path));
  await fs.writeFile(path.join(dist,'release-manifest.json'),JSON.stringify(result,null,2)+'\n');
  return result;
}
