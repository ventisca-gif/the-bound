"""Lanzas, hachas, mazas y mascotas espectrales (v4.21) a partir de la hoja de Sergio.

Uso:  python3 tools/dev/velo4.py [--preview=/ruta/vista.png]   -> escribe src/6zyv_velo4_data.js

Entrada: tools/dev/velo4_ref/hoja.png (su imagen tal cual: 3 filas de 8 armas y una fila de 6 criaturas sobre fondo
morado oscuro). Cada pieza se recorta por su silueta contra el fondo (sin redibujar) y se reduce a la resolución del
juego con la misma función que las demás armas (tools/dev/armas.py).

Salida:
  AV_ICON / AV_HAND / AV_HD / AV_PIV16 / AV_PIV32 ['lanza_0'..'maza_7']  como las armas normales
  AV_ATLAS   atlas de ataque al doble: 24 filas (lanzas, hachas, mazas) x 5 columnas (prep, a1, a2, a3, impacto)
  PETV_SHEET / PETV_SIZE ['sapo', 'babosa', 'buho', 'polilla', 'lobo', 'rape']  atlas de mascota (10 x 4)
"""
import io, json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import armas as A

REF = os.path.join(os.path.dirname(__file__), 'velo4_ref')
ROOT = A.ROOT
BG = np.array([13, 0, 24.])
# cajas (y0, y1, x0, x1) de cada pieza en la hoja; la columna 8 de hachas y mazas venía unida y se corta en y=515
COLS = [(60, 215), (222, 405), (415, 570), (580, 725), (740, 905), (908, 1062), (1072, 1222), (1226, 1420)]
ROWS = {'lanza': (0, 292), 'hacha': (292, 515), 'maza': (515, 762)}
PETS = [('sapo', 31, 239, True), ('babosa', 249, 484, True), ('buho', 502, 686, False), ('polilla', 679, 905, False), ('lobo', 920, 1162, False), ('rape', 1180, 1421, False)]   # True: en la hoja mira a la derecha
PET_Y = (775, 1020)
# agarre (fracción del alto del recorte, desde arriba) y giro para que el eje apunte arriba a la derecha
GRIP = {'lanza': 0.74, 'hacha': 0.86, 'maza': 0.86}


def cut(a, y0, y1, x0, x1, thr=42):
    sub = a[y0:y1, x0:x1]
    d = np.sqrt(((sub - BG) ** 2).sum(2))
    m = d > thr
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=3))
    if n > 1:   # la pieza más grande (y lo que la toca); fuera motas de la vecina
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.08]
        m = m & np.isin(lab, keep)
    o = np.zeros(sub.shape[:2] + (4,), np.uint8)
    o[..., :3] = np.clip(sub, 0, 255)
    o[..., 3] = np.where(m, 255, 0)
    ys, xs = np.where(o[..., 3] > 0)
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def hand(n, kind):
    H, W = n.shape[:2]
    # el mango: columna con más píxeles cerca de la fila de agarre
    gy = int(H * GRIP[kind])
    row = np.where(n[max(0, gy - 2):gy + 3, :, 3].max(0) > 0)[0]
    gx = float(np.median(row)) if len(row) else W / 2
    a, p = A.transform(n, (gx, gy), None, False, -45)
    k = min(32 / max(a.shape[:2]), 0.95)
    a32 = A.down(a, k)
    p32 = (p[0] * k, p[1] * k)
    a16 = A.down(a32, 0.5)
    return a32, p32, a16, (p32[0] / 2, p32[1] / 2)


def tint_fx(fx, pal):
    """El tajo de cobre del guerrero con los colores del arma (de oscuro a claro)."""
    o = fx.copy()
    al = o[..., 3] > 0
    L = o[..., :3].astype(float) @ [0.3, 0.59, 0.11]
    lo, hi = L[al].min(), L[al].max()
    t = np.clip((L - lo) / max(1, hi - lo), 0, 0.999) * 3
    P = np.array(pal, float)
    j = t.astype(int)
    f = (t - j)[..., None]
    o[..., :3] = np.where(al[..., None], (P[j] * (1 - f) + P[np.minimum(j + 1, 3)] * f), 0).astype(np.uint8)
    return o


def attack_row(W, pal, kind, seed):
    CW, CH, S = A.CW, A.CH, A.S
    cells = [Image.new('RGBA', (CW * S, CH * S), (0, 0, 0, 0)) for _ in range(5)]
    FX = A.scale_img(tint_fx(A.load('nat_fx_guerrero.png'), pal), S)
    wx, wy, ex, ey = 26 * S, 26 * S, 52 * S, 24 * S
    if kind == 'lanza':     # estocada: la lanza avanza en horizontal y deja una estela que se afina
        Wr = A.rot(A.scale_img(W, 1.4), 90)
        L_ = 26 * S
        streak = np.zeros((7 * S, L_, 4), np.uint8)
        for x in range(L_):
            half = max(1, round((1 - x / L_) * 3 * S))
            for y in range(7 * S // 2 - half, 7 * S // 2 + half):
                c = pal[3] if abs(y - 7 * S // 2) < half / 2 else pal[2] if abs(y - 7 * S // 2) < half - 1 else pal[1]
                streak[y, L_ - 1 - x, :3] = c
                streak[y, L_ - 1 - x, 3] = 255
        for i, (dx, tt) in enumerate(zip([-14, -2, 8, 14], [0, 0.45, 0.85, 1])):
            cxw = wx + dx * S
            if i:
                st = A.reveal(streak, tt, 'rx')
                cells[i].alpha_composite(Image.fromarray(st), (int(cxw + Wr.shape[1] / 2 - 6 * S), int(wy - 2 * S - 7 * S / 2)))
            A.paste(cells[i], Wr, cxw, wy - 2 * S)
    elif kind == 'hacha':   # tajo amplio de arriba abajo
        for i, (ang, tt) in enumerate(zip([-95, -45, 10, 55], [0, 0.4, 0.75, 1])):
            if i:
                A.paste(cells[i], A.reveal(A.scale_img(FX, 1.15), tt, 'y'), ex, ey)
            A.paste(cells[i], A.rot(W, ang), wx, wy)
    else:                   # maza: golpe hacia el suelo y onda
        for i, (ang, tt) in enumerate(zip([-80, -20, 40, 80], [0, 0.3, 0.6, 1])):
            if i >= 2:
                A.paste(cells[i], A.reveal(FX, tt, 'c'), ex, ey + 4 * S)
            A.paste(cells[i], A.rot(W, ang), wx, wy)
    A.paste(cells[4], A.scale_img(A.burst(pal, 33, seed), S), CW * S / 2, CH * S / 2)
    row = Image.new('RGBA', (CW * S * 5, CH * S), (0, 0, 0, 0))
    for i in range(5):
        row.alpha_composite(cells[i], (i * CW * S, 0))
    return row


def pet_sheet(spr, face_right):
    """Atlas de mascota (reposo 2, caminata 4, ataque 3, golpe 1) x (abajo, izquierda, derecha, arriba)."""
    F = Image.fromarray(spr)
    L_ = F.transpose(Image.FLIP_LEFT_RIGHT) if face_right else F   # vista de perfil mirando a la izquierda
    fw, fh = F.width + 6, F.height + 8
    fw, fh = fw + fw % 2, fh + fh % 2   # pares: el atlas va al doble
    sheet = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    bobs = [0, 1, 0, 2, 3, 2, -1, -3, 0, 0]
    lean = [0, 0, 1, 0, -1, 0, 2, 5, 2, -1]
    for row, dirn in enumerate(['down', 'left', 'right', 'up']):
        src = F if dirn in ('down', 'up') else (L_ if dirn == 'left' else L_.transpose(Image.FLIP_LEFT_RIGHT))
        for col in range(10):
            dx = 0 if dirn in ('down', 'up') else (-lean[col] if dirn == 'left' else lean[col])
            x = col * fw + (fw - src.width) // 2 + dx
            y = row * fh + (fh - 4) - src.height - bobs[col]
            sheet.alpha_composite(src, (x, y))
    return sheet, [fw, fh]


def main():
    a = np.array(Image.open(os.path.join(REF, 'hoja.png')).convert('RGB')).astype(float)
    ICON, HAND, HD, PIV16, PIV32, NAT = {}, {}, {}, {}, {}, {}
    rows = []
    for kind, (y0, y1) in ROWS.items():
        for j, (x0, x1) in enumerate(COLS):
            n = cut(a, y0, y1, x0, x1)
            Image.fromarray(n).save(os.path.join(REF, f'{kind}_{j}.png'))
            nat = A.down(n, 64 / max(n.shape[:2]))
            key = f'{kind}_{j}'
            NAT[key] = nat
            a32, p32, a16, p16 = hand(nat, kind)
            ICON[key] = A.b64raw(A.pad16(A.fit(nat, 16)))
            c16 = np.zeros((16, 16, 4), np.uint8)
            c16[:min(16, a16.shape[0]), :min(16, a16.shape[1])] = a16[:16, :16]
            HAND[key] = A.b64raw(c16)
            HD[key] = A.b64png(a32)
            PIV16[key] = [round(p16[0], 2), round(p16[1], 2)]
            PIV32[key] = [round(p32[0], 2), round(p32[1], 2)]
            W = A.fit(nat, 32)
            rows.append(attack_row(W, A.pal_of(nat), kind, j + 3))
    atl = Image.new('RGBA', (rows[0].width, rows[0].height * len(rows)), (0, 0, 0, 0))
    for i, r in enumerate(rows):
        atl.alpha_composite(r, (0, i * r.height))
    PSHEET, PSIZE = {}, {}
    for k, x0, x1, fr in PETS:
        n = cut(a, PET_Y[0], PET_Y[1], x0, x1, thr=38)
        Image.fromarray(n).save(os.path.join(REF, f'pet_{k}.png'))
        spr = A.down(n, 46 / max(n.shape[:2]))   # al doble: 23 px de juego
        sh, sz = pet_sheet(spr, fr)
        PSHEET[k] = A.b64png(sh)
        PSIZE[k] = sz
    js = ['// Generado por tools/dev/velo4.py desde la hoja de Sergio (v4.21). No editar a mano.',
          'const AV_ICON = ' + json.dumps(ICON) + ';', 'const AV_HAND = ' + json.dumps(HAND) + ';',
          'const AV_PIV16 = ' + json.dumps(PIV16) + ', AV_PIV32 = ' + json.dumps(PIV32) + ';',
          'const AV_HD = ' + json.dumps(HD) + ';', 'const AV_ATLAS = ' + json.dumps(A.b64png(atl)) + ';',
          'const PETV_SIZE = ' + json.dumps(PSIZE) + ';', 'const PETV_SHEET = ' + json.dumps(PSHEET) + ';']
    out = os.path.join(ROOT, 'src', '6zyv_velo4_data.js')
    open(out, 'w').write('\n'.join(js) + '\n')
    print('escrito', out, os.path.getsize(out))
    prev = next((x.split('=', 1)[1] for x in sys.argv if x.startswith('--preview=')), None)
    if prev:
        import base64
        sheet = Image.new('RGBA', (8 * 150, 3 * 150 + 120 + 380), (40, 30, 50, 255))
        for i, kind in enumerate(ROWS):
            for j in range(8):
                im = Image.open(io.BytesIO(base64.b64decode(HD[f'{kind}_{j}'].split(',')[1])))
                sheet.alpha_composite(im.resize((im.width * 4, im.height * 4), Image.NEAREST), (j * 150 + 4, i * 150 + 4))
        for j, (k, *_r) in enumerate(PETS):
            im = Image.open(io.BytesIO(base64.b64decode(PSHEET[k].split(',')[1])))
            fw, fh = PSIZE[k]
            c = im.crop((0, 0, fw, fh * 2))
            sheet.alpha_composite(c.resize((fw * 3, fh * 6), Image.NEAREST), (j * 200 + 4, 460))
        atl.crop((0, 0, atl.width, atl.height // 24 * 6)).save(prev.replace('.png', '_atk.png'))
        sheet.save(prev)


if __name__ == '__main__':
    main()
