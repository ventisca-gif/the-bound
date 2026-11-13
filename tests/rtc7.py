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
    for pg in (A,B): pg.evaluate("(window.hurtPlayer=()=>{}, G.P.lv=80, calcStats(G.P), (()=>{ const M=makeDeep(); G.P.inside='mina_profunda'; G.P.retX=G.P.x; G.P.retY=G.P.y; setMap(M, 32*16, 5*16, 'down'); })(), 1)")
    A.wait_for_timeout(1500)
    print('A dig', A.evaluate("(()=>{ G.P.dir='down'; G.P.x=32*16; G.P.y=6*16+8; const out=[]; for (let k=0;k<4;k++){ const t=interactTarget(); if(t&&t.kind==='deepdig'){ G.P.busy=0; deepDig(t.tx,t.ty); out.push(G.map.I(t.tx,t.ty)); G.P.y+=16; } } window._dug=out; return out; })()"))
    A.wait_for_timeout(3000)
    idx=A.evaluate("window._dug")
    print('B sees', B.evaluate("(idx=>idx.map(i=>G.maps.mina_profunda.lvl[i]))(%s)" % idx))
    B.evaluate("(()=>{ G.P.dir='right'; G.P.x=33*16; G.P.y=4*16+8; for (let k=0;k<3;k++){ const t=interactTarget(); if(t&&t.kind==='deepdig'){ G.P.busy=0; deepDig(t.tx,t.ty); G.P.x+=16; } } window._dug=[...G.map.dug]; return 1; })()")
    B.wait_for_timeout(3000)
    print('A has B tunnels', A.evaluate("(idx=>idx.every(i=>G.maps.mina_profunda.lvl[i]===0))(%s)" % B.evaluate("window._dug")))
    A.screenshot(path=out.replace('.png','_A.png')); B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
