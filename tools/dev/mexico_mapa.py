"""Mapa de México para el panel de mapas (v5.15).

Uso: python3 -I tools/dev/mexico_mapa.py tools/dev/mexico_ref/mapa_mexico.jpg salida.png
Igual que peru_mapa.py: clasifica mar, países vecinos y estados (quita los nombres escritos), reduce a la mitad
y repinta con los colores del juego. Se guarda en base64 en src/6zz9zzm0_mexico_data.js (MX_MAP_PNG).
"""
from PIL import Image, ImageFilter
from collections import Counter
import sys
im = Image.open(sys.argv[1]).convert('RGB').filter(ImageFilter.MedianFilter(3))
W, H = im.size; px = im.load()
PAL = {'yel': ((240, 224, 112), (236, 206, 92)), 'blu': ((144, 160, 200), (130, 120, 210)), 'grn': ((128, 192, 128), (110, 186, 96)), 'red': ((240, 128, 112), (222, 98, 104)), 'ora': ((240, 160, 96), (236, 146, 70)), 'pal': ((224, 224, 160), (210, 196, 120))}
cls = [[None] * W for _ in range(H)]
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]; S = max(r, g, b) - min(r, g, b); L = (r + g + b) / 3
        if b > 190 and r < 140: c = 'sea'
        elif S < 24 and L > 205: c = 'land'
        elif L < 120: c = 'line'
        else: c = min(PAL, key=lambda k: sum((PAL[k][0][i] - (r, g, b)[i]) ** 2 for i in range(3)))
        cls[y][x] = c
def nb(c, x, y, r): return [c[yy][xx] for yy in range(max(0, y - r), min(H, y + r + 1)) for xx in range(max(0, x - r), min(W, x + r + 1))]
for it in range(4):
    n = [row[:] for row in cls]
    for y in range(H):
        for x in range(W):
            if cls[y][x] == 'line':
                cnt = Counter(v for v in nb(cls, x, y, 2) if v != 'line')
                if cnt: n[y][x] = cnt.most_common(1)[0][0]
    cls = n
W2, H2 = W // 2, H // 2
c2 = [[Counter(cls[y * 2 + j][x * 2 + i] for j in (0, 1) for i in (0, 1)).most_common(1)[0][0] for x in range(W2)] for y in range(H2)]
out = Image.new('RGB', (W2, H2)); o = out.load()
for y in range(H2):
    for x in range(W2):
        c = c2[y][x]
        if c == 'sea': o[x, y] = (40, 96, 170) if (x * 3 + y) % 11 else (64, 128, 200)
        elif c == 'land': o[x, y] = (168, 156, 132) if (x + y * 2) % 13 else (156, 144, 120)
        else:
            col = PAL[c][1]; ed = any(0 <= x + dx < W2 and 0 <= y + dy < H2 and c2[y + dy][x + dx] != c for dx, dy in ((1, 0), (0, 1)))
            if ed: col = (70, 40, 30) if any(0 <= x + dx < W2 and 0 <= y + dy < H2 and c2[y + dy][x + dx] in ('sea', 'land') for dx, dy in ((1, 0), (0, 1), (-1, 0), (0, -1))) else tuple(int(v * 0.62) for v in col)
            o[x, y] = col
out.save(sys.argv[2])
