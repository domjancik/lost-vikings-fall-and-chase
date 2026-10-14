from pathlib import Path
p=Path('tools/art/pixel/rebuild-pixel-assets.py');s=p.read_text(encoding='utf-8-sig').replace("parser.add_argument('--only');args=parser.parse_args()","parser.add_argument('--only');parser.add_argument('--check',action='store_true');args=parser.parse_args()")
a=s.index(' report=[];staging=');s=s[:a]+''' if args.check:
  for spec,source in prepared:
   image=Image.open(source).convert('RGBA');fixed=Image.open(ROOT/spec['target']).convert('RGBA')
   if list(fixed.size)!=spec['size']:raise ValueError('Changed atlas dimensions: '+spec['target'])
   if not set(np.unique(np.array(fixed)[:,:,3])).issubset({0,255}):raise ValueError('Nonbinary alpha: '+spec['target'])
   if 'pieces' in spec:
    invalid=0
    for part in spec['pieces']:
     x,y=part['at'];w,h=part['size'];invalid+=out_of_range(np.array(image.crop(tuple(part['crop']))),np.array(fixed.crop((x,y,x+w,y+h))))
   else:
    if 'crop' in spec:image=image.crop(tuple(spec['crop']))
    invalid=out_of_range(np.array(image),np.array(fixed))
   if invalid:raise ValueError(f"{spec['target']}: {invalid} colors outside source cells")
  print(f'Checked {len(prepared)} published assets: zero colors outside source cells; dimensions and alpha valid')
  return
'''+s[a:];p.write_text(s,encoding='utf-8')
