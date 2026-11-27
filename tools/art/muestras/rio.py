# Fotografía la muestra de Río (tools/art/muestras/muestra_rio.js) con el motor: python3 tools/art/muestras/rio.py file://$PWD/dist/test.html salida.png
import sys, os
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 900, 'height': 500}, device_scale_factor=2); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Muestra'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=3000)
    except Exception: pass
    pg.add_script_tag(path=os.path.join(os.path.dirname(__file__), 'muestra_rio.js'))
    pg.evaluate("(()=>{ SETTINGS.tips=0; G.time=12*60; const M=rioMuestra(); G.P.inside=M.id; setMap(M, 8*16, 14*16, 'right'); rioGente(M); document.querySelectorAll('#tipbox,#mgHud,#toasts').forEach(e=>e.hidden=true); })()")
    pg.wait_for_timeout(2500); pg.screenshot(path=out.replace('.png', '_1.png'))
    pg.evaluate("(()=>{ G.P.x=48*16; G.P.y=17*16; document.querySelectorAll('#tipbox,#toasts').forEach(e=>e.hidden=true); })()"); pg.wait_for_timeout(1500); pg.screenshot(path=out.replace('.png', '_2.png'))
    pg.evaluate("(()=>{ G.P.x=15*16+8; G.P.y=22*16; G.P.dir='down'; })()"); pg.wait_for_timeout(1500); pg.screenshot(path=out.replace('.png', '_3.png'))
    print(errs); b.close()
