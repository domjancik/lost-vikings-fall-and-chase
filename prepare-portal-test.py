from pathlib import Path
q=Path('game.js');s=q.read_text(encoding='utf-8').replace("if(s.won){e.preventDefault();if(canContinue", "if(s.won){if(['Enter',' ','r'].includes(k))e.preventDefault();if(canContinue");q.write_text(s,encoding='utf-8')
q=Path('style.css');q.write_text(q.read_text(encoding='utf-8')+'\n.portal-travel .game-top,.portal-travel .below,.portal-travel .mobile-controls,.portal-travel .game-bottom{visibility:hidden}\n',encoding='utf-8')
# Normal-control route finishes the heist; inspect transition and continue, then complete pub and continue with the other key.
base=Path('browser-inventory29-round-8.js').read_text(encoding='utf-8');at=base.index("await page.screenshot({path:'output/playwright/portal30-round-8.png'})") if "await page.screenshot({path:'output/playwright/portal30-round-8.png'})" in base else -1
print(base[-450:])
