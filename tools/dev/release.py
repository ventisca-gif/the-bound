"""Prepara una versión nueva para el actualizador interno del juego.

Uso:  python3 tools/dev/release.py [--no-build]

1. Compila el juego (python3 build.py) salvo con --no-build.
2. Lee GAME_VER, GAME_BUILD, UPD_MIN_APK y CHANGELOG de src/6zv_update.js.
3. Escribe update/thebound.html (la misma página que va dentro del APK) y update/version.json
   (versión, tamaño, SHA-256 y novedades).

Después hay que subir la carpeta update/ a la rama main de GitHub: los teléfonos leen
https://raw.githubusercontent.com/<repo>/main/update/version.json.
El APK se compila aparte con tools/apk/build_apk.py y la clave de siempre.
"""
import hashlib, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'src', '6zv_update.js')
OUT = os.path.join(ROOT, 'update')


def game_info():
    s = open(SRC, encoding='utf-8').read()
    build = int(re.search(r"GAME_BUILD\s*=\s*(\d+)", s).group(1))
    ver = re.search(r"GAME_VER\s*=\s*'([^']+)'", s).group(1)
    min_apk = int(re.search(r"UPD_MIN_APK\s*=\s*(\d+)", s).group(1))
    cl = json.loads(s.split('/*CL*/', 1)[1].split('/*CL_END*/', 1)[0])
    return build, ver, min_apk, cl


def main():
    if '--no-build' not in sys.argv:
        subprocess.run([sys.executable, 'build.py'], cwd=ROOT, check=True)
    build, ver, min_apk, cl = game_info()
    entry = cl[0]
    if entry.get('v') != ver or entry.get('b') != build:
        raise SystemExit(f'La primera entrada de CHANGELOG ({entry.get("v")}, {entry.get("b")}) no coincide con GAME_VER/GAME_BUILD ({ver}, {build}).')
    html = open(os.path.join(ROOT, 'dist', 'test.html'), 'rb').read()
    # igual que la página del APK (tools/apk/build_apk.py)
    html = html.replace(b'initial-scale=1,viewport-fit=cover', b'initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover', 1)
    found = re.search(rb'GAME_BUILD\s*=\s*(\d+)', html)
    if not found or int(found.group(1)) != build:
        raise SystemExit('dist/test.html no tiene GAME_BUILD = %d: vuelve a compilar.' % build)
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, 'thebound.html'), 'wb').write(html)
    info = {
        'build': build, 'ver': ver, 'date': entry.get('d', ''), 'file': 'thebound.html',
        'size': len(html), 'sha256': hashlib.sha256(html).hexdigest(), 'minApk': min_apk,
        'apk': 'https://github.com/ventisca-gif/the-bound/releases/latest',
        'notes': {'es': entry.get('es', []), 'en': entry.get('en', [])},
    }
    open(os.path.join(OUT, 'version.json'), 'w', encoding='utf-8').write(json.dumps(info, ensure_ascii=False, indent=1) + '\n')
    print('update', ver, 'build', build, 'bytes', len(html), 'sha256', info['sha256'][:16] + '…')


if __name__ == '__main__':
    main()
