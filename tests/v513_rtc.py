# 5.13: dos jugadores por WebRTC en Lima: se ven en el mismo mapa (plaza y Larcomar) y el parapente se ve en el otro.
import sys, os
from playwright.sync_api import sync_playwright
url = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'rtc.png'
exe = '/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=['--no-sandbox', '--allow-file-access-from-files'])
    pages = []; logs = []
    for i, (nm, cl) in enumerate([('Ana', 'guerrero'), ('Beto', 'bardo')]):
        ctx = b.new_context(viewport={'width': 844, 'height': 390}, device_scale_factor=1, has_touch=True)
        pg = ctx.new_page(); pg.on('pageerror', lambda e, i=i: logs.append(f'{i} PAGEERROR: {e}'))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName', nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(500)
        pages.append(pg)
    A, B = pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code = A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans = B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A, B): pg.evaluate("(closeModal(), G.P.gold=5000, goLima(), 1)")
    A.wait_for_timeout(3000)
    A.evaluate("(G.P.x=325*16, G.P.y=100*16, 1)"); B.evaluate("(G.P.x=328*16, G.P.y=100*16, 1)"); A.wait_for_timeout(3000)
    print('B ve a A en Lima', B.evaluate("[...G.remote.values()].map(r=>[r.name, r.map, Math.round(r.x/16), Math.round(r.y/16)])"))
    A.evaluate("(()=>{ const c=lmCoast(190); G.P.x=190*16+8; G.P.y=(c-3)*16+8; XACT.lm_parapente[2]({}); return 1; })()")
    B.evaluate("(()=>{ const c=lmCoast(200); G.P.x=200*16; G.P.y=(c-3)*16; return 1; })()"); A.wait_for_timeout(5000)
    print('B ve el parapente de A', B.evaluate("[...G.remote.values()].map(r=>[r.map, !!r.pg])"))
    B.screenshot(path=out.replace('.png', '_pg.png'))
    A.wait_for_timeout(21000)
    A.evaluate("(XACT.lm_larcomar[2]({}), 1)"); B.evaluate("(XACT.lm_larcomar[2]({}), 1)"); A.wait_for_timeout(4000)
    print('Larcomar', A.evaluate("[G.map.id, [...G.remote.values()].map(r=>r.map)]"), B.evaluate("[G.map.id, [...G.remote.values()].map(r=>r.map)]"))
    B.screenshot(path=out)
    for l in logs: print(l)
    b.close()
