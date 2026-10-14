from pathlib import Path
import json,shutil
folder=Path('assets/loom98/evidence');folder.mkdir(parents=True,exist_ok=True)
for name in ['route','offset-route','miss-route']:
 data=json.loads(Path('output/loom98/'+name+'.json').read_text())
 for shot in data['shots']:
  old=Path(shot['file']);new=folder/old.name;shutil.copyfile(old,new);shot['file']=new.as_posix()
 (folder/(name+'.json')).write_text(json.dumps(data,indent=2))
