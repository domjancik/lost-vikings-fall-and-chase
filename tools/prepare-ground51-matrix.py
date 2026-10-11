from pathlib import Path
for chapter in [1,2,6,7]:
 source=Path(f'browser-campaign46-{chapter}.js').read_text(encoding='utf-8')
 source=source.replace('campaignCapture','ground51MatrixCapture').replace(f'campaign46-{chapter+1}-',f'ground51-matrix-{chapter+1}-').replace('arc=46','ground=51')
 old='const use=async id=>{select(id);await tick({interact:true},.1);};'
 new="""let useCount=0;const use=async id=>{select(id);const h=read().heroes[id];if((round===1&&Math.abs(h.x-700)<10)||(round===2&&[690,1500].some(x=>Math.abs(h.x-x)<10))||(round===6&&Math.abs(h.x-1300)<10)||(round===7&&Math.abs(h.x-1200)<10))await move(id,h.x-50);const label='use-'+(++useCount);await capture(label+'-before');await tick({interact:true},.1);if(!read().won){await capture(label+'-moving');await tick({},.5);await capture(label+'-after');}};"""
 assert old in source;source=source.replace(old,new)
 source=source.replace("if(read().machine.work!==1)throw Error('Protected stroke');","if(read().machine.work!==1)throw Error('Protected stroke');await capture('work-done');")
 source=source.replace("await tick({},5.3);for(const [id,x]", "await tick({},5.3);await capture('reset-done');for(const [id,x]")
 if chapter==6:
  source=source.replace("await move(2,950);await item(2,'archive');", "await move(2,900);await capture('archive-before');await item(2,'archive');await capture('archive-moving');await tick({},.6);await capture('archive-after');")
 Path(f'browser-ground51-matrix-{chapter}.js').write_text(source,encoding='utf-8')
