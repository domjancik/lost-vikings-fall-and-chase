import json, subprocess
from pathlib import Path

root=Path(__file__).resolve().parents[2]/'output'/'overview-60'
shots=json.loads((root/'shot-list.json').read_text(encoding='utf8'))
timeline=shots['shots']
file=root/shots['video']
required={'Visual progress','Mechanics in motion','Under the hood'}
chapters=[s for s in timeline if s['source'] in required]
assert [s['source'] for s in chapters]==['Visual progress','Mechanics in motion','Under the hood']
metadata=';FFMETADATA1\ntitle=Lost Vikings - Development Overview\n'
for i,s in enumerate(chapters):
    start=0 if i==0 else round(s['start']*1000)
    end=round((chapters[i+1]['start'] if i+1<len(chapters) else shots['duration'])*1000)
    metadata+=f'[CHAPTER]\nTIMEBASE=1/1000\nSTART={start}\nEND={end}\ntitle={s["source"]}\n'
meta=root/'chapters.ffmeta';meta.write_text(metadata,encoding='utf8')
temp=root/'chapter-mux.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(file),'-i',str(meta),'-map','0','-map_metadata','1','-map_chapters','1','-c','copy','-movflags','+faststart',str(temp)],check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-show_chapters','-of','json',str(temp)]))
video=next(s for s in probe['streams'] if s['codec_type']=='video')
assert (video['width'],video['height'],video['avg_frame_rate'])==(1920,1080,'60/1')
assert int(video['nb_frames'])==round(shots['duration']*60)
assert len(probe['chapters'])==3
subprocess.run(['ffmpeg','-hide_banner','-v','error','-xerror','-i',str(temp),'-f','null','-'],check=True)
temp.replace(file)
print(json.dumps({'file':file.name,'durationSeconds':shots['duration'],'frames':video['nb_frames'],'fps':60,'chapters':[c['tags']['title'] for c in probe['chapters']],'bytes':file.stat().st_size}))
