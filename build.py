import glob, os, re, sys
src = sorted(glob.glob('src/*.js'))
js = '\n'.join(open(f, encoding='utf-8').read() for f in src)
# ---- idioma inglés (v3.6): cada texto traducible se convierte en (LANG_EN ? "inglés" : "español") con tools/i18n/tr.js ----
import json, shutil, subprocess, tempfile
EN = 'tools/i18n/en.json'
if os.path.exists(EN) and shutil.which('node'):
    with tempfile.TemporaryDirectory() as td:
        a, b = os.path.join(td, 'in.js'), os.path.join(td, 'out.js'); open(a, 'w', encoding='utf-8').write(js)
        r = subprocess.run(['node', 'tools/i18n/tr.js', 'apply', a, EN, b], capture_output=True, text=True)
        if r.returncode: print(r.stderr); raise SystemExit('fallo al traducir')
        js = open(b, encoding='utf-8').read(); print(r.stdout.strip())
        tpl_en = subprocess.run(['node', 'tools/i18n/tr.js', 'html', EN, 'template.html'], capture_output=True, text=True).stdout or '{}'
else:
    print('AVISO: sin tools/i18n/en.json o sin node -> el juego se compila solo en español'); tpl_en = '{}'
pre = ("const LANG_EN = (() => { try { if (/[?&]lang=en\\b/.test(location.search)) return true; if (/[?&]lang=es\\b/.test(location.search)) return false; return localStorage.getItem('thebound.lang') === 'en'; } catch (e) { return false; } })();\n"
       "const I18N_TPL = " + tpl_en + ";\n")
bufandin = ''.join(open('assets/bufandin.b64', encoding='ascii').read().split())
js = pre + js.replace('__BUFANDIN_PNG__', bufandin)
assert '</script' not in js.lower(), 'script close tag inside js'
tpl = open('template.html', encoding='utf-8').read()
# fuente Pixelify Sans (SIL OFL, assets/PixelifySans-OFL.txt) incrustada para que la APK sin internet se vea igual que el artefacto
FONT_SYS = '/mnt/skills/examples/canvas-design/canvas-fonts/PixelifySans-Medium.ttf'
if not os.path.exists('assets/pixelify.b64') and os.path.exists(FONT_SYS):
    import base64; os.makedirs('assets', exist_ok=True); open('assets/pixelify.b64', 'w').write(base64.b64encode(open(FONT_SYS, 'rb').read()).decode())
fnt = open('assets/pixelify.b64').read().strip() if os.path.exists('assets/pixelify.b64') else ''
tpl = tpl.replace('/*__FONT__*/', ("@font-face{font-family:'Pixelify Sans';src:url(data:font/ttf;base64," + fnt + ") format('truetype');font-weight:400 700;font-display:block}") if fnt else '')
land = open('assets/ui_land.b64').read().strip() if os.path.exists('assets/ui_land.b64') else ''
if land: tpl = tpl.replace('--land:none;', '--land:url(data:image/png;base64,' + land + ');', 1)
out = tpl.replace('/*__GAME__*/', js)
# Photon Realtime SDK (online por internet) solo en la APK/test: el artefacto de claude.ai bloquea servidores externos
SDK = 'vendor/photon-realtime-4.3.2.js'  # npm photon-realtime 4.3.2 (Exit Games) sin el final para Node (require('ws')/module.exports)
sdk = open(SDK, encoding='utf-8').read() if os.path.exists(SDK) else ''
if not sdk: print('AVISO: falta', SDK, '-> la APK se compila SIN online por internet (pide el archivo a Sergio)')
assert '</script' not in sdk.lower()
os.makedirs('dist', exist_ok=True)
open('dist/thebound.html', 'w', encoding='utf-8').write(out.replace('<!--__PHOTON__-->', ''))
out = out.replace('<!--__PHOTON__-->', ('<script>' + sdk + '</script>') if sdk else '')
# test page with doctype wrapper (simulating the artifact skeleton)
test = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + out + '</body></html>'
open('dist/test.html', 'w', encoding='utf-8').write(test)
print('files', len(src), 'js bytes', len(js), 'html bytes', len(out))
