"""Muestra: Ilvaine, la Hechicera del Ojo, en pixel art más detallado (72x88, estructura chibi del juego).
Uso: python3 tools/dev/muestras/ilvaine_hd.py salida.png"""
import math, sys
from PIL import Image

W, H = 72, 92
img = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = img.load()
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (255,)
def put(x, y, c):
    x, y = int(round(x)), int(round(y))
    if 0 <= x < W and 0 <= y < H: px[x, y] = hx(c) if isinstance(c, str) else c
def get(x, y): return px[x, y] if 0 <= x < W and 0 <= y < H else (0, 0, 0, 0)
def hsh(x, y, s=1): v = math.sin(x * 12.9898 + y * 78.233 + s * 37.7) * 43758.5453; return v - math.floor(v)
def ramp(P, t): t = max(0, min(0.999, t)); return P[int(t * len(P))]
def ell(cx, cy, rx, ry, P, light=(-0.5, -0.6), only=None):
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            dx, dy = (x + .5 - cx) / rx, (y + .5 - cy) / ry
            if dx * dx + dy * dy > 1: continue
            if only and not only(x, y): continue
            sh = 0.55 - (dx * light[0] + dy * light[1]) * 0.45 + (dx * dx + dy * dy) * 0.25
            put(x, y, ramp(P[::-1], sh))
def poly(pts, fn):
    ys = [p[1] for p in pts]
    for y in range(int(min(ys)), int(max(ys)) + 1):
        xs = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            if (y0 <= y + .5 < y1) or (y1 <= y + .5 < y0): xs.append(x0 + (y + .5 - y0) * (x1 - x0) / (y1 - y0))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            for x in range(int(round(a)), int(round(b))): fn(x, y)

SKIN = ['#2e3060', '#4e5490', '#767cbc', '#a0a6dc', '#c8ccf0', '#e8eaff']
CLK = ['#08060a', '#140e10', '#221a18', '#362a22', '#56442e', '#8a7048', '#b89a66']
HAIR = ['#050409', '#0d0b16', '#1a1828', '#2c2a44', '#4a4a70']
SIL = ['#4a4e62', '#8a90a8', '#c8ccdc', '#f4f6ff']
cx = 36

# ---- capa (cuerpo) con estampado dorado en espiral ----
def cloak(x, y, base=0):
    t = (y - 40) / 52
    sw = math.sin(x * 0.9 + math.sin(y * 0.55) * 2.2) + math.sin(y * 0.7 - x * 0.35)
    shade = 0.25 + 0.5 * abs((x - cx) / 30) + t * 0.15
    k = 1 + int((1 - shade) * 2.2)
    if sw > 1.15 and hsh(x, y) > 0.25: k = 4 + (1 if sw > 1.6 else 0) - (1 if abs(x - cx) > 18 else 0)
    elif sw < -1.4 and hsh(x, y, 2) > 0.5: k = 3
    put(x, y, CLK[max(0, min(6, k + base))])
poly([(17, 34), (55, 34), (64, 90), (8, 90)], cloak)
# brazos/mangas hacia el libro
for s in (-1, 1): ell(cx + s * 16, 60, 7, 9, CLK[1:5])

# ---- capucha ----
ell(cx, 28, 19, 20, CLK[1:6])
poly([(cx - 3, 4), (cx + 6, 6), (cx + 12, 14), (cx - 10, 12)], cloak)
poly([(17, 30), (55, 30), (62, 46), (10, 46)], cloak)
for y in range(8, 46):            # estampado en la capucha
    for x in range(14, 59):
        c = get(x, y)
        if c[3] and (x - cx) ** 2 / 361 + (y - 28) ** 2 / 400 <= 1 and math.sin(x * 1.1 + math.cos(y * 0.6) * 2) + math.sin(y * 0.9) > 1.3 and hsh(x, y, 3) > 0.3:
            put(x, y, CLK[4] if x > cx - 6 else CLK[3])
ell(cx, 31, 14.5, 16, ['#030204', '#07050a', '#0c0a12'])     # hueco oscuro de la capucha
# ---- pelo detrás de la cara (mechones largos hasta el pecho) ----
for s in (-1, 1):
    for k in range(6):
        x0 = cx + s * (8 + k * 1.1)
        for y in range(20, 64 - k * 2):
            sway = math.sin(y * 0.25 + k) * 0.8
            col = HAIR[1 + (k % 2)] if (y + k) % 7 else HAIR[3]
            put(x0 + sway, y, col)
            if k == 2 and y % 5 == 0: put(x0 + sway, y, HAIR[4])
# ---- cara ----
ell(cx, 31, 11.5, 12.5, SKIN[1:], light=(0.55, -0.5))
for y in range(38, 45):           # barbilla en punta
    w = int(9 - (y - 38) * 1.3)
    for x in range(cx - w, cx + w): put(x, y, ramp(SKIN[2:][::-1], 0.3 + abs(x - cx) / 14 + (y - 38) * 0.04) if get(x, y)[3] or w > 0 else None)
# sombra verdosa a la izquierda, como en la imagen
for y in range(22, 44):
    for x in range(cx - 11, cx - 5):
        c = get(x, y)
        if c[3] and c[:3] in [hx(q)[:3] for q in SKIN] and x < cx - 8 and hsh(x, y) > 2: put(x, y, '#5a6a8a' if y < 34 else '#56707a')
# flequillo en cortina: raya al medio, deja la frente en triángulo
for y in range(16, 46):
    for x in range(cx - 14, cx + 14):
        lim = 3.2 + max(0, y - 18) * 0.62 if y < 34 else 10.5
        if abs(x + .5 - cx) > lim and (x + .5 - cx) ** 2 / 182 + (y - 31) ** 2 / 200 <= 1.25:
            put(x, y, HAIR[3] if (x * 2 + y // 3) % 7 == 0 else HAIR[2] if (x + y // 4) % 3 == 0 else HAIR[1])
for y in range(16, 20):
    for x in range(cx - 3, cx + 3): put(x, y, HAIR[1] if x != cx - 1 else HAIR[0])
# ---- tercer ojo en la frente ----
INK = '#120820'; ex, ey = cx - 1, 23
for dx, hh in zip(range(-3, 4), (1, 2, 2, 2, 2, 2, 1)):
    for dy in range(-hh, hh + 1):
        edge = abs(dy) == hh
        put(ex + dx, ey + dy, INK if edge else ('#e8e8ff' if dy < 0 else '#c8c8ee'))
put(ex - 4, ey, INK); put(ex + 4, ey, INK)
put(ex, ey, '#05020a'); put(ex - 1, ey, '#6a2aa0'); put(ex + 1, ey, '#6a2aa0'); put(ex, ey - 1, '#8a4ac8'); put(ex - 1, ey - 1, '#ffffff')
for dx in (-3, 0, 3): put(ex + dx, ey - 4 + (abs(dx) > 0), INK)
put(ex, ey + 3, INK); put(ex, ey + 4, '#3a2a50')
# ---- ojos cerrados con sombra oscura, pestañas y rabillo ----
for s in (-1, 1):
    x0 = cx + s * 5 - (0 if s > 0 else 0)
    for dx in range(-3, 4):
        for dy in range(-2, 1): put(x0 + dx, 31 + dy, '#3a2a52' if dy < 0 else '#241634')
    for dx in range(-3, 4): put(x0 + dx, 32 + (1 if abs(dx) < 2 else 0), '#0a0610')
    put(x0 + s * 4, 31, '#0a0610'); put(x0 + s * 5, 30, '#0a0610')       # rabillo
    for dx in (-2, 0, 2): put(x0 + dx, 34 + (dx == 0), '#0a0610')         # pestañas
    put(x0 - s * 1, 29, '#56467a')                                         # brillo del párpado
# lágrima de rímel bajo el ojo derecho (como en la imagen)
for y in range(35, 39): put(cx + 4, y, '#1a1028')
# nariz
put(cx, 36, SKIN[2]); put(cx - 1, 37, SKIN[1]); put(cx + 1, 37, SKIN[2])
# labios negros
for dx in range(-3, 3): put(cx + dx, 40, '#1a0c18')
for dx in range(-2, 2): put(cx + dx, 41, '#2a1424')
put(cx - 1, 41, '#5a3a58'); put(cx - 4, 40, '#3a2a48'); put(cx + 3, 40, '#3a2a48')
# ---- aretes de plata ----
for s in (-1, 1):
    ax = cx + s * 11.5
    for a in range(0, 360, 30): put(ax + math.cos(math.radians(a)) * 2.4, 39 + math.sin(math.radians(a)) * 2.6, SIL[2] if a < 180 else SIL[1])
    put(ax, 42, SIL[3]); put(ax, 43, SIL[1]); put(ax, 44, SIL[2]); put(ax, 39, SIL[3])
# collar
for dx in range(-6, 7): put(cx + dx, 47 + abs(dx) // 3, SIL[1 + (dx % 2)])
put(cx, 50, SIL[3]); put(cx, 51, SIL[1])

# ---- libro abierto que gotea ----
def book(x, y):
    left = x < cx + 2
    if left:
        t = (cx + 2 - x) / 22
        c = '#d4c4a0' if (y + int(t * 3)) % 3 else '#8a7454'
        if y > 66: c = '#6a5434'
        put(x, y, c)
    else:
        k = math.sin(x * 1.3) * math.sin(y * 1.1)
        c = '#3a1c10' if k > 0.3 else '#5a2e18' if k > -0.3 else '#7a4422'
        if abs(x - 47) + abs(y - 62) in (5, 6): c = '#c8a050'
        if abs(x - 47) + abs(y - 62) < 3: c = '#4a8a8a' if (x + y) % 2 else '#2a5a5a'
        put(x, y, c)
poly([(12, 56), (cx + 2, 60), (cx + 2, 69), (13, 66)], book)
poly([(cx + 2, 60), (60, 54), (61, 66), (cx + 2, 69)], book)
for x in range(13, cx + 2): put(x, 56 + (x - 12) * 4 / 26 - 1, '#efe6cc')
for x in range(15, cx, 3): put(x, 62 + (x % 2), '#5a4a36')
# gotas de agua
for i, x in enumerate(range(14, 60, 3)):
    L = 2 + int(hsh(x, 1) * 7)
    y0 = 67 if x < cx + 2 else 66
    for y in range(y0, y0 + L): put(x, y, '#9ab0e8' if y < y0 + L - 1 else '#e0ecff')
# mano con uñas largas plateadas y anillos (abajo a la derecha del libro)
for f in range(4):
    fx = 44 + f * 2.2
    for y in range(66, 71 + (f == 1)): put(fx, y, SKIN[3] if y < 70 else SKIN[2])
    put(fx, 72 + (f == 1), SIL[2]); put(fx, 73 + (f == 1), SIL[3]); put(fx + 0.4, 74 + (f == 1), SIL[1])
put(46, 68, SIL[3]); put(48, 68, SIL[2]); put(46, 69, SIL[1])

# ---- contorno ----
src = img.copy(); sp = src.load()
for y in range(H):
    for x in range(W):
        if sp[x, y][3]: continue
        if any(0 <= x + dx < W and 0 <= y + dy < H and sp[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): px[x, y] = hx('#030205')

# ---- escena: agua oscura con brillos y velas flotando ----
S = 6
scene = Image.new('RGBA', (W * S + 300, H * S + 120), hx('#0a0e22'))
sc = scene.load()
for y in range(scene.height):
    for x in range(scene.width):
        if y > 360:
            v = math.sin(x * 0.05 + math.sin(y * 0.09) * 3) * math.sin(y * 0.11)
            sc[x, y] = hx('#c8d8ff') if v > 0.82 else hx('#2a3a7a') if v > 0.3 else hx('#141c44') if y > 420 else hx('#0e1430')
        elif (x // 60 + y // 90) % 2 == 0 and 40 < y < 340 and (x < 120 or x > scene.width - 120): sc[x, y] = hx('#1a1410') if (y // 12) % 2 else hx('#3a2a1e')
def candle(x, y, s):
    for yy in range(int(26 * s)):
        for xx in range(int(12 * s)):
            scene.putpixel((x + xx, y + yy), hx('#d8c8b0') if xx > 3 * s else hx('#a89880'))
    for yy in range(int(10 * s)):
        w = int((10 * s - yy) / 3)
        for xx in range(-w, w + 1): scene.putpixel((x + int(6 * s) + xx, y - yy - 2), hx('#fff4c0') if abs(xx) < w / 2 else hx('#ffb040'))
for cxx, cyy, s in ((40, 400, 1.6), (scene.width - 110, 380, 1.3), (scene.width - 60, 470, 2.2), (90, 490, 1.0)): candle(cxx, cyy, s)
big = img.resize((W * S, H * S), Image.NEAREST)
scene.alpha_composite(big, (150, 40))
# a tamaño de juego (abajo a la izquierda)
scene.alpha_composite(img.resize((W, H), Image.NEAREST), (20, 20))
scene.save(sys.argv[1] if len(sys.argv) > 1 else 'ilvaine_hd.png')
img.save((sys.argv[1] if len(sys.argv) > 1 else 'ilvaine_hd.png').replace('.png', '_sprite.png'))
print('ok')
