"""Recomprime SIN PÉRDIDA las imágenes PNG incrustadas (data:image/png;base64,...) en src/*.js.

Uso:  python3 tools/dev/png_sin_perdida.py [--dry]

- Usa oxipng (pip install pyoxipng). Solo cambia la compresión: cada imagen se decodifica antes y después y se
  comprueba que todos los píxeles (RGBA) son idénticos; si no, se deja la original.
- Solo sustituye si el PNG nuevo es más pequeño. Se puede volver a pasar tras crear sprites nuevos con las
  herramientas de extracción (pack.py, lienzo.py, …), que generan PNG sin optimizar.
- 6.56/6.57: 564 imágenes, 14,0 → 11,4 MB (−20 %).
"""
import base64, io, os, re, sys

import oxipng
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'src')
PNG = re.compile(r'data:image/png;base64,([A-Za-z0-9+/=]+)')


def pixels(b):
    im = Image.open(io.BytesIO(b))
    return im.size, im.convert('RGBA').tobytes()


def main():
    dry = '--dry' in sys.argv
    tot = new = n = changed = kept = 0
    for f in sorted(os.listdir(SRC)):
        if not f.endswith('.js'):
            continue
        p = os.path.join(SRC, f)
        t = open(p, encoding='utf-8').read()
        if 'data:image/png;base64,' not in t:
            continue
        fc = [0]

        def rep(m):
            nonlocal tot, new, n, changed, kept
            b = base64.b64decode(m.group(1)); n += 1; tot += len(b)
            o = oxipng.optimize_from_memory(b, level=4, strip=oxipng.StripChunks.safe())
            if len(o) >= len(b) or pixels(o) != pixels(b):
                kept += 1; new += len(b); return m.group(0)
            new += len(o); changed += 1; fc[0] += 1
            return 'data:image/png;base64,' + base64.b64encode(o).decode()

        t2 = PNG.sub(rep, t)
        if fc[0] and not dry:
            open(p, 'w', encoding='utf-8').write(t2)
    print(f'imágenes {n} · recomprimidas {changed} · iguales {kept} · {tot // 1024} KB → {new // 1024} KB'
          f' ({100 - 100 * new // max(tot, 1)} % menos){" (sin escribir)" if dry else ""}')


if __name__ == '__main__':
    main()
