from pathlib import Path
s=Path('browser-inventory29-round-8.js').read_text(encoding='utf-8');at=s.rfind('}');s=s[:at]+'''
 const phase=await page.locator('#game').getAttribute('data-transition');if(!['entering','tunnel'].includes(phase))throw Error('Missing portal transition '+phase);await page.screenshot({path:'output/playwright/portal30-tunnel.png'});
 await page.keyboard.press('Enter');if((await state()).round!==8)throw Error('Enter skipped the required transition');await wait(1400);if(!await page.locator('#win').isVisible())throw Error('Completion overlay did not appear');await page.keyboard.press('Space');await wait(250);const next=await state();if(next.round!==0||next.won)throw Error('Space failed to continue');await wait(450);if(Math.abs((await state()).heroes[0].vy)>1)throw Error('Space leaked into next level jump');
 return {transition:phase,spaceContinues:next.round,noLeakedJump:true};
}''';Path('browser-portal30-space.js').write_text(s,encoding='utf-8')
# Pub route for Enter continuation, using current local build.
s=Path('browser-explore21-route.js').read_text(encoding='utf-8').replace('https://united-marsh-6ppd.here.now/?explore=21','http://127.0.0.1:3000/?portal=30');at=s.rfind('}');s=s[:at]+'''
 await wait(1900);if(!await page.locator('#win').isVisible())throw Error('Missing ready screen');await page.keyboard.press('Enter');await wait(400);const next=await state();if(next.round!==1||next.won)throw Error('Enter failed to continue');return {enterContinues:next.round};
}''';Path('browser-portal30-enter.js').write_text(s,encoding='utf-8')
