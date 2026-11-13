import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
    pages=[]; logs=[]
    for i,(nm,cl) in enumerate([('Ana','invocador'),('Beto','bardo')]):
        ctx=b.new_context(viewport={'width':844,'height':390},device_scale_factor=1,has_touch=True)
        pg=ctx.new_page(); pg.on('pageerror',lambda e,i=i: logs.append(f'{i} PAGEERROR: {e}')); pg.on('console',lambda m,i=i: logs.append(f'{i} {m.type}: {m.text}') if m.type in('error',) else None)
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName',nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A,B=pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code=A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans=B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A,B): pg.evaluate("closeModal()")
    A.wait_for_timeout(1500)
    for pg in (A,B): pg.evaluate("(window.hurtPlayer=()=>{}, G.P.lv=60, calcStats(G.P), 1)")
    A.evaluate("(()=>{ G.P.partner='greta'; rel('greta').a=900; giveItem('anillo_boda',1); const n=G.ents.find(e=>e.id==='greta'); G.P.x=n.x+20; G.P.y=n.y; startWedding(n, wedTownOf(G.P)); return 1; })()")
    B.evaluate("(()=>{ const t=TOWNS.find(t=>t.k==='albor'); G.P.x=(t.x0+t.x1)*8; G.P.y=(t.y0+t.y1)*8+60; return 1; })()")
    A.wait_for_timeout(6000)
    print('B remote weds', B.evaluate("[WED_REMOTE.size, WGROUND.length, G.ents.filter(e=>e.wedTmp).map(e=>e.id)]"))
    A.wait_for_timeout(24000)
    print('A after', A.evaluate("[G.P.spouse, !!WED]"), 'B inv', B.evaluate("G.P.inv.map(s=>s.id).filter(i=>i==='pastel'||i==='ramo')"))
    B.screenshot(path=out.replace('.png','_wedB.png'))
    A.screenshot(path=out.replace('.png','_A.png')); B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
