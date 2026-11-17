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
    for pg in (A,B): pg.evaluate("closeModal(); window.hurtPlayer=()=>{}; G.P.lv=120; G.P.gold=50000; calcStats(G.P)")
    A.evaluate("(giveItem('ofp_tablas',6), ofx().mk=[['ofp_tablas',6,999]], netPresence(true), 1)")
    A.wait_for_timeout(1500)
    print('B ve ofertas', B.evaluate("JSON.stringify([...G.remote.values()].map(r=>r.mk))"))
    print('A antes', A.evaluate("[G.P.gold, countItem('ofp_tablas')]"), 'B antes', B.evaluate("[G.P.gold, countItem('ofp_tablas')]"))
    B.evaluate("(openMarket(), document.querySelector('#modal [data-mkb]').click(), 1)")
    B.wait_for_timeout(3000)
    print('A despues', A.evaluate("[G.P.gold, countItem('ofp_tablas'), JSON.stringify(ofx().mk)]"), 'B despues', B.evaluate("[G.P.gold, countItem('ofp_tablas'), !!MKT.pend]"))
    # segunda compra de una oferta que ya no existe: devuelve el oro
    B.evaluate("(()=>{const r=[...G.remote.values()][0]; r.mk=[['ofp_tablas',6,999]]; openMarket(); document.querySelector('#modal [data-mkb]').click(); return 1;})()")
    B.wait_for_timeout(3000)
    print('B reembolso', B.evaluate("[G.P.gold, countItem('ofp_tablas'), !!MKT.pend]"))
    A.evaluate("(ofx().tor={d:calDay(),j:torJob(),b:17}, netPresence(true), 1)"); A.wait_for_timeout(1500)
    print('B torneo', B.evaluate("JSON.stringify([...G.remote.values()].map(r=>r.tor))"))
    for l in logs[:30]: print(l)
    b.close()
