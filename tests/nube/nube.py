"""6.22 · Partida en la nube con código corto (Supabase). Un «móvil» crea un héroe y lo sube; otro móvil (contexto
nuevo, sin datos) baja con el código desde la pantalla de título. Necesita red hacia el proyecto de Supabase.
Uso: python3 tests/nube/nube.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, os, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/nube/out'); OUT.mkdir(parents=True, exist_ok=True)
px = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files'], proxy={'server': px} if px else None)
    errs = []
    def page():
        ctx = b.new_context(viewport={'width': 960, 'height': 540}, ignore_https_errors=True); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(URL); pg.wait_for_timeout(2500); return pg
    # móvil A: crea héroe, sube desde Opciones
    a = page(); a.click('#tNew'); a.wait_for_timeout(400); a.fill('#ccName', 'Nubecita'); a.click('#ccGo'); a.wait_for_selector('#introOk:visible', timeout=60000); a.click('#introOk'); a.wait_for_timeout(800)
    a.evaluate("()=>{G.P.gold=777777;G.P.lv=42;saveGame(true);openPanel('opts')}"); a.wait_for_timeout(800)
    has_btn = a.evaluate("()=>!!document.querySelector('#oNube')")
    a.click('#oNube'); a.wait_for_function("()=>/K|código|code|conectar|reach/i.test(document.querySelector('#oMsg').textContent)&&!NUBE.busy", timeout=30000)
    up_msg = a.evaluate("()=>document.querySelector('#oMsg').textContent"); a.screenshot(path=str(OUT / '1_subido.png'))
    code = a.evaluate("()=>nubeGet()&&nubeGet().code")
    # segunda subida: mismo código (actualiza)
    again = a.evaluate("async()=>{const c=await nubeUpload();return c.code}")
    # móvil B: título, ☁ Nube, escribe el código y baja
    bb = page(); bb.click('#nubeOpen'); bb.wait_for_timeout(300); bb.screenshot(path=str(OUT / '2_titulo_nube.png'))
    bb.fill('#nubeC', 'zzzz-zzzz'); bb.click('#nubeDown'); bb.wait_for_function("()=>!NUBE.busy", timeout=30000); bad = bb.evaluate("()=>document.querySelector('#accMsg').textContent")
    bb.fill('#nubeC', code[:4].lower() + '-' + code[4:].lower()); bb.click('#nubeDown'); bb.wait_for_function("()=>!NUBE.busy", timeout=30000); bb.wait_for_timeout(800)
    got = bb.evaluate("()=>{const o=loadLocal(0);return o&&{name:o.name,gold:o.gold,lv:o.lv}}")
    bb.screenshot(path=str(OUT / '3_bajado.png'))
    out = {'button': has_btn, 'upMsg': up_msg, 'code': code, 'sameCode': again == code, 'badMsg': bad, 'got': got, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert has_btn and code and again == code and got and got['name'] == 'Nubecita' and got['gold'] == 777777 and ('ninguna' in bad.lower() or 'no save' in bad.lower()), out
    assert not errs, errs
    print('OK'); b.close()
