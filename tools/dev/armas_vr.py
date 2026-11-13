"""Armas de los tiers 22-26 (Continente del Velo Roto, v4.18) a partir de la hoja dark fantasy de Sergio.

Uso:  python3 tools/dev/armas_vr.py   -> escribe src/6zyq_armas_vr_data.js

Entrada: tools/dev/armas_vr_ref/dk_<arma>.png (recortadas de su imagen). Cada clase tiene su arma base y los demás
tiers cambian el tono de las partes de color (carmesí → esmeralda, violeta, escarcha u oro); el hueso, la plata y el
oro viejo se quedan. Tipos nuevos: el guerrero usa mandoble (24-25) y la Espada de la Dama (26); el bardo, violín;
el invocador, la guadaña lunar (24-25). Usa las funciones de tools/dev/armas.py (manos, iconos y atlas de ataque).
"""
import base64, colorsys, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
import armas as A

REF = os.path.join(os.path.dirname(__file__), 'armas_vr_ref')
ROOT = A.ROOT
TIERS = [22, 23, 24, 25, 26]
HUE = {22: 0, 23: 140, 24: 280, 25: 200, 26: 40}            # giro de tono por tier (22 es el original)
# arma base por clase y tier
BASE = {
    'guerrero': {22: 'espada', 23: 'espada', 24: 'mandoble', 25: 'mandoble', 26: 'dama'},
    'asesino': {t: 'dagas' for t in TIERS}, 'mago': {t: 'baculo' for t in TIERS}, 'arquero': {t: 'arco' for t in TIERS},
    'bardo': {t: 'violin' for t in TIERS}, 'invocador': {22: 'guadana', 23: 'guadana', 24: 'guadana_luna', 25: 'guadana_luna', 26: 'guadana'},
}
# cómo se sostiene (fracciones del recorte): agarre, giro (grados, sentido antihorario) y espejo
HOLDV = {
    'espada': dict(f=(0.5, 0.12), rot=135), 'mandoble': dict(f=(0.5, 0.1), rot=135), 'dama': dict(f=(0.5, 0.12), rot=135),
    'dagas': dict(f=(0.82, 0.14), rot=180, crop=(0.5, 0, 1, 1)), 'baculo': dict(f=(0.5, 0.72), rot=-45), 'arco': dict(f=(0.3, 0.5), rot=45, flipx=True),
    'violin': dict(f=(0.5, 0.62), rot=-45), 'guadana': dict(f=(0.27, 0.75), rot=-45), 'guadana_luna': dict(f=(0.28, 0.75), rot=-45),
}


def shift(a, deg, protect=True):
    if not deg:
        return a.copy()
    o = a.copy()
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y, x, 3] < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255))
            hd = h * 360
            if s < 0.28 or (protect and 25 < hd < 60 and s < 0.6):   # hueso, plata y oro viejo se quedan
                continue
            r, g, b = colorsys.hsv_to_rgb(((hd + deg) % 360) / 360, s, v)
            o[y, x, :3] = [int(r * 255), int(g * 255), int(b * 255)]
    return o


def native(name):
    a = np.array(Image.open(os.path.join(REF, 'dk_' + name + '.png')).convert('RGBA'))
    return A.down(a, 64 / max(a.shape[:2]))   # a resolución de juego antes de girar y reducir


def hand(n, name):
    h = HOLDV[name]
    if h.get('crop'):
        x0, y0, x1, y1 = h['crop']
        H, W = n.shape[:2]
        n = n[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    H, W = n.shape[:2]
    piv = (h['f'][0] * W if not h.get('crop') else (h['f'][0] - h['crop'][0]) / (h['crop'][2] - h['crop'][0]) * W, h['f'][1] * H)
    piv = (min(W - 1, max(0, piv[0])), min(H - 1, max(0, piv[1])))
    a, p = A.transform(n, piv, None, h.get('flipx', False), h['rot'])
    k = min(32 / max(a.shape[:2]), 0.95)
    a32 = A.down(a, k)
    p32 = (p[0] * k, p[1] * k)
    a16 = A.down(a32, 0.5)
    return a32, p32, a16, (p32[0] / 2, p32[1] / 2)


def main():
    ICON, HAND, HD, PIV16, PIV32, ATL = {}, {}, {}, {}, {}, {}
    nat = {k: native(k) for k in HOLDV}
    fins = A.load('nat_w_pez.png')
    for t in TIERS:
        for c in A.CLS:
            if c == 'pez':
                n = A.recolor(fins, 3)
                n = shift(n, HUE[t] + 300)
                a32, p32, a16, p16 = A.hand_sprite(n, 'pez')
                icon = A.fit(n, 16)
            else:
                name = BASE[c][t]
                n = shift(nat[name], HUE[t])
                a32, p32, a16, p16 = hand(n, name)
                icon = A.fit(n, 16)
            key = f'{c}_{t}'
            ICON[key] = A.b64raw(A.pad16(icon))
            c16 = np.zeros((16, 16, 4), np.uint8)
            c16[:min(16, a16.shape[0]), :min(16, a16.shape[1])] = a16[:16, :16]
            HAND[key] = A.b64raw(c16)
            HD[key] = A.b64png(a32)
            PIV16[key] = [round(p16[0], 2), round(p16[1], 2)]
            PIV32[key] = [round(p32[0], 2), round(p32[1], 2)]
        # atlas de ataque: el arma nueva y los efectos de cobre con el tono del tier (más oscuros)
        orig = A.load

        def load(name, t=t):
            if name.startswith('nat_w_'):
                c = name[6:-4]
                return shift(nat[BASE[c][t]], HUE[t]) if c != 'pez' else shift(A.recolor(fins, 3), HUE[t] + 300)
            fx = orig(name)
            fx = shift(fx, (HUE[t] + 330) % 360, protect=False)
            fx[..., :3] = (fx[..., :3].astype(float) * 0.92).astype(np.uint8)
            return fx
        A.load = load
        try:
            ATL[t] = A.b64png(A.atlas_for(2))
        finally:
            A.load = orig
        print('tier', t, 'ok')
    js = ['// Generado por tools/dev/armas_vr.py desde la hoja dark fantasy de Sergio (v4.18). No editar a mano.',
          'const ARMV_ICON = ' + json.dumps(ICON) + ';', 'const ARMV_HAND = ' + json.dumps(HAND) + ';',
          'const ARMV_PIV16 = ' + json.dumps(PIV16) + ', ARMV_PIV32 = ' + json.dumps(PIV32) + ';',
          'const ARMV_HD = ' + json.dumps(HD) + ';', 'const ARMV_ATLAS = ' + json.dumps(ATL) + ';']
    out = os.path.join(ROOT, 'src', '6zyq_armas_vr_data.js')
    open(out, 'w').write('\n'.join(js) + '\n')
    print('escrito', out, os.path.getsize(out))
    prev = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--preview=')), None)
    if prev:
        sheet = Image.new('RGBA', (len(A.CLS) * 140, len(TIERS) * 140), (40, 30, 50, 255))
        for i, t in enumerate(TIERS):
            for j, c in enumerate(A.CLS):
                import io
                im = Image.open(io.BytesIO(base64.b64decode(HD[f'{c}_{t}'].split(',')[1])))
                sheet.alpha_composite(im.resize((im.width * 4, im.height * 4), Image.NEAREST), (j * 140 + 4, i * 140 + 4))
        sheet.save(prev)


if __name__ == '__main__':
    main()
