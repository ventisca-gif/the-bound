# Dos teléfonos por WiFi (WebRTC real): A se equipa armadura/peinado/cosmético y B compara lo que ve.
import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]; cfg=sys.argv[3] if len(sys.argv)>3 else "{}"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pages=[]; logs=[]
    for i,(nm,cl) in enumerate([('Ana','guerrero'),('Beto','bardo')]):
        ctx=b.new_context(viewport={'width':844,'height':390},device_scale_factor=2,has_touch=True)
        pg=ctx.new_page(); pg.on('pageerror',lambda e,i=i: logs.append(f'{i} PAGEERROR: {e}'))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName',nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A,B=pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code=A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans=B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A,B): pg.evaluate("closeModal(); window.hurtPlayer=()=>{}")
    A.evaluate("(G.P.jp=G.P.jp||{}, G.P.jp.idol={fans:60000,cd:0,n:3}, fanT=0, 1)")
    B.evaluate("(()=>{const r=[...G.remote.values()][0]; G.P.x=r.x+40; G.P.y=r.y; })()")
    A.wait_for_timeout(14000)
    print('A fans', A.evaluate("FANS.filter(f=>f.local).length"), 'B ve', B.evaluate("[[...G.remote.values()][0].fan, FANS.filter(f=>!f.local).length]"))
    for l in logs[:30]: print(l)
    b.close()
