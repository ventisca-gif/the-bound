"""Prueba del actualizador interno (v4.3) con un servidor local que hace de GitHub.

python3 tests/upd.py file://$PWD/dist/test.html out.png

Crea una versión falsa más nueva a partir de dist/test.html, la sirve con CORS y comprueba:
aviso en el título, descarga con verificación, reinicio en la versión nueva (en un iframe con la misma partida),
novedades, botón atrás de Android, rollback si la versión descargada no arranca, descarga dañada y aviso de APK nuevo.
Chromium se abre sin --allow-file-access-from-files, como el WebView de Android.
"""
import hashlib, http.server, json, os, re, shutil, sys, tempfile, threading
from playwright.sync_api import sync_playwright

url, out = sys.argv[1], sys.argv[2]
base_html = open(url.replace('file://', ''), 'rb').read()
cur = int(re.search(rb'GAME_BUILD\s*=\s*(\d+)', base_html).group(1))
NEW = cur + 1
tmp = tempfile.mkdtemp()
srv_dir = os.path.join(tmp, 'srv'); os.makedirs(srv_dir)
page = os.path.join(tmp, 'apk.html'); open(page, 'wb').write(base_html)


def make(build, ver, broken=False, min_apk=0, bad_sha=False):
    h = re.sub(rb"GAME_VER = '[^']+', GAME_BUILD = \d+", ("GAME_VER = '%s', GAME_BUILD = %d" % (ver, build)).encode(), base_html, 1)
    h = h.replace(b'<div class="tfoot">', b'<div class="tfoot">TEST ' + ver.encode() + b' | ', 1)
    if broken:   # nunca llega al título
        h = h.replace(b'function boot(hot) {', b'function boot(hot) { throw new Error("roto");', 1)
    open(os.path.join(srv_dir, 'thebound.html'), 'wb').write(h)
    info = {'build': build, 'ver': ver, 'date': '2026-11-20', 'file': 'thebound.html', 'size': len(h),
            'sha256': hashlib.sha256(h + (b'x' if bad_sha else b'')).hexdigest(), 'minApk': min_apk,
            'apk': 'https://github.com/ventisca-gif/the-bound/releases/latest',
            'notes': {'es': ['Novedad de prueba ' + ver, 'Otra novedad'], 'en': ['Test change ' + ver]}}
    open(os.path.join(srv_dir, 'version.json'), 'w').write(json.dumps(info))


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=srv_dir, **k)
    def end_headers(s): s.send_header('Access-Control-Allow-Origin', '*'); s.send_header('Cache-Control', 'no-store'); super().end_headers()
    def log_message(s, *a): pass


srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
U = 'file://' + page + '?upd=' + 'http://127.0.0.1:%d/' % port
res = {}
shot_i = [0]


def shot(pg):
    nm = out.replace('.png', '_%d.png' % shot_i[0]); pg.screenshot(path=nm); shot_i[0] += 1; print('shot', nm)


def child(pg):
    f = pg.frame_locator('#otaFrame'); return f, (pg.frames[1] if len(pg.frames) > 1 else None)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 900, 'height': 500}, device_scale_factor=1, has_touch=True)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    make(NEW, '9.%d' % NEW)
    # 1) partida nueva en la versión del APK
    pg.goto(U); pg.wait_for_timeout(2500)
    pg.evaluate("localStorage.setItem('thebound.seen', String(GAME_BUILD))")
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1200); pg.click('#introOk'); pg.wait_for_timeout(300)
    pg.evaluate("(G.P.gold = 4321, saveGame(true))")
    res['apk_build'] = pg.evaluate('GAME_BUILD')
    # ajustes: sección de actualizaciones
    pg.evaluate("openPanel('opts')"); pg.wait_for_timeout(300)
    res['opts_has_upd'] = pg.evaluate("!!document.getElementById('oUpd')"); shot(pg)
    pg.evaluate("closePanel()")
    # 2) volver al título: busca solo y avisa
    pg.goto(U); pg.wait_for_timeout(5500)
    res['modal_after_check'] = pg.evaluate("!document.getElementById('modal').hidden && !!document.getElementById('updGo')")
    res['title_msg'] = pg.evaluate("document.getElementById('tUpdMsg').textContent"); shot(pg)
    pg.click('#updGo'); pg.wait_for_timeout(4000)
    # 3) se reinició en la versión nueva
    res['frame'] = pg.evaluate("!!document.getElementById('otaFrame')")
    fr = pg.frames[1] if len(pg.frames) > 1 else None
    pg.wait_for_timeout(3500)
    res['child_build'] = fr.evaluate('GAME_BUILD') if fr else None
    res['child_ota'] = fr.evaluate('window.__TB_OTA') if fr else None
    res['child_footer'] = fr.evaluate("document.querySelector('.tfoot').textContent") if fr else None
    res['child_news_open'] = fr.evaluate("!document.getElementById('modal').hidden && !!document.querySelector('.newsm')") if fr else None
    res['meta'] = pg.evaluate("JSON.parse(localStorage.getItem('thebound.ota'))")
    shot(pg)
    if fr:
        fr.evaluate("closeModal()")
        fr.click('[data-slot]'); pg.wait_for_timeout(1500)
        res['child_gold'] = fr.evaluate('G.P.gold')
        pg.evaluate('window.onAndroidBack()'); pg.wait_for_timeout(300)
        res['back_opens_menu'] = fr.evaluate("!document.getElementById('panel').hidden")
        res['child_opts_ver'] = fr.evaluate("document.getElementById('oUpd') && document.getElementById('oUpd').nextElementSibling.textContent")
        shot(pg)
    # 4) relanzar: sigue en la versión nueva y ya no avisa
    pg.goto(U); pg.wait_for_timeout(6500)
    fr = pg.frames[1] if len(pg.frames) > 1 else None
    res['relaunch_build'] = fr.evaluate('GAME_BUILD') if fr else None
    res['relaunch_msg'] = fr.evaluate("document.getElementById('tUpdMsg').textContent") if fr else None
    # 5) descarga dañada
    make(NEW + 1, '9.%d' % (NEW + 1), bad_sha=True)
    if fr:
        fr.evaluate("updRun(true)"); pg.wait_for_timeout(1500)
        fr.click('#updGo'); pg.wait_for_timeout(2500)
        res['bad_sha_msg'] = fr.evaluate("document.getElementById('updMsg').textContent")
        res['bad_sha_still'] = pg.evaluate("JSON.parse(localStorage.getItem('thebound.ota')).b")
    # 6) versión que necesita APK nuevo
    make(NEW + 1, '9.%d' % (NEW + 1), min_apk=999)
    if fr:
        fr.evaluate("closeModal(); updRun(true)"); pg.wait_for_timeout(1500)
        res['needs_apk'] = fr.evaluate("!!document.getElementById('updCopy')"); shot(pg)
    # 7) versión rota: rollback a la del APK
    make(NEW + 1, '9.%d' % (NEW + 1), broken=True)
    if fr:
        fr.evaluate("closeModal(); updRun(true)"); pg.wait_for_timeout(1500)
        fr.click('#updGo'); pg.wait_for_timeout(3000)
    for i in range(2):   # dos arranques fallidos
        pg.goto(U); pg.wait_for_timeout(3000)
    res['fails_meta'] = pg.evaluate("JSON.parse(localStorage.getItem('thebound.ota'))")
    pg.goto(U); pg.wait_for_timeout(4000)
    res['rollback_frame'] = pg.evaluate("!!document.getElementById('otaFrame')")
    res['rollback_build'] = pg.evaluate('GAME_BUILD')
    res['rollback_meta'] = pg.evaluate("JSON.parse(localStorage.getItem('thebound.ota'))")
    res['rollback_slot'] = pg.evaluate("document.querySelectorAll('[data-slot]').length")
    shot(pg)
    # 8) rollback dentro de la misma sesión (60 s sin llegar al título)
    make(NEW + 2, '9.%d' % (NEW + 2), broken=True)
    pg.evaluate("closeModal(); updRun(true)"); pg.wait_for_timeout(1500)
    pg.click('#updGo'); pg.wait_for_timeout(2500)
    pg.wait_for_timeout(64000)
    res['timeout_frame'] = pg.evaluate("!!document.getElementById('otaFrame')")
    res['timeout_title'] = pg.evaluate("!document.getElementById('title').hidden")
    res['timeout_meta'] = pg.evaluate("JSON.parse(localStorage.getItem('thebound.ota'))")
    pg.screenshot(path=out)
    res['errs'] = [e for e in errs if 'roto' not in e]
    b.close()
srv.shutdown(); shutil.rmtree(tmp)
print(json.dumps(res, ensure_ascii=False, indent=1))
