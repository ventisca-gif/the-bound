"""6.16 · Recorta las hojas de sprites de Loguetown (Sergio) y genera src/6zzzzzc_logue_sprites.js.
Uso: python3 tools/dev/logue_pack.py <carpeta_con_pngs>
Cada hoja: 4 filas (frente, izquierda, derecha, espalda) y 3 columnas (reposo, paso A, paso B);
smoker_atk: 4 columnas (reposo, preparación, golpe, recuperación).
Salida por personaje: tira 200×144 por celda (HD), pies en y=139, cuerpo centrado en x=100."""
import sys, io, base64, json, pathlib
from PIL import Image
import numpy as np
SRC = {'alvida': 'alvida.png', 'merchant': 'ipponmatsu.png', 'smoker': 'smoker.png', 'smoker_atk': 'smoker_atk.png', 'roger': 'roger.png', 'bart': 'bartolomeo.png'}
HGT = {'alvida': 120, 'merchant': 106, 'smoker': 116, 'roger': 120, 'bart': 114}
CW, CH, FOOT, CX = 240, 144, 139, 120

def label(m):
    h, w = m.shape; lab = np.zeros((h, w), np.int32); comps = [None]; n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]: continue
        n += 1; st = [(y0, x0)]; lab[y0, x0] = n; s = 0; sx = 0
        while st:
            y, x = st.pop(); s += 1; sx += x
            for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
                if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not lab[yy, xx]: lab[yy, xx] = n; st.append((yy, xx))
        comps.append((s, sx / s))
    return lab, comps

def cells(path, cols):
    """Etiqueta cada fila entera: una pieza (p. ej. la porra de Smoker) que invade la celda vecina
    se queda con el personaje al que pertenece (su centro cae en la columna de ese personaje)."""
    im = Image.open(path).convert('RGBA'); W, H = im.size; out = []
    for r in range(4):
        strip = np.array(im.crop((0, round(r*H/4), W, round((r+1)*H/4))))
        lab, comps = label(strip[:, :, 3] >= 128); big = max(c[0] for c in comps[1:])
        row = []
        for c in range(cols):
            lo, hi = c*W/cols, (c+1)*W/cols
            keep = np.array([False] + [cs >= big*0.02 and lo <= cx < hi for cs, cx in comps[1:]])
            a = strip.copy(); a[:, :, 3] = np.where(keep[lab], 255, 0)
            # el ancla horizontal de la celda se mide relativa al inicio de su columna
            row.append((Image.fromarray(a), lo))
        out.append(row)
    return out

def pack(rows, scale):
    cols = len(rows[0]); sheet = Image.new('RGBA', (CW*cols, CH*4))
    for r, row in enumerate(rows):
        b0 = row[0][0].getbbox(); ax = (b0[0] + b0[2]) / 2 - row[0][1]   # el reposo de cada fila fija el centro del cuerpo
        for c, (cl, lo) in enumerate(row):
            b = cl.getbbox()
            if not b: continue
            sm = cl.crop((0, 0, cl.width, b[3])).convert('RGBa')
            sw, sh = max(1, round(sm.width*scale)), max(1, round(sm.height*scale))
            sm = sm.resize((sw, sh), Image.LANCZOS).convert('RGBA')
            a = np.array(sm); a[:, :, 3] = np.where(a[:, :, 3] >= 110, 255, 0); sm = Image.fromarray(a)
            px, py = round(CX - (ax + lo)*scale), FOOT - sh
            tile = Image.new('RGBA', (CW, CH)); tile.alpha_composite(sm, (max(0, px), max(0, py)), (max(0, -px), max(0, -py)))
            sheet.alpha_composite(tile, (c*CW, r*CH))
    return sheet

def main(folder, outjs, preview=None):
    folder = pathlib.Path(folder); data = {}; prev = []
    scales = {}
    for k in ['alvida', 'merchant', 'smoker', 'roger', 'bart', 'smoker_atk']:
        rows = cells(folder/SRC[k], 4 if k == 'smoker_atk' else 3)
        if k == 'smoker_atk': s = scales['smoker'] * 1.0
        else:
            b = rows[0][0][0].getbbox(); s = HGT[k] / (b[3]-b[1])
        scales[k] = s
        sh = pack(rows, s); prev.append(sh)
        buf = io.BytesIO(); sh.save(buf, 'PNG', optimize=True)
        data[k] = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
    js = '// Generado por tools/dev/logue_pack.py con las hojas de Sergio (6.16). No editar a mano.\n'
    js += 'const LOGUE_CELL={w:%d,h:%d};\nconst LOGUE_IMAGES=%s;\n' % (CW, CH, json.dumps(data, separators=(',', ':')))
    pathlib.Path(outjs).write_text(js)
    if preview:
        W = max(p.width for p in prev); P = Image.new('RGBA', (W, sum(p.height for p in prev)), (40, 60, 50, 255)); y = 0
        for p in prev: P.alpha_composite(p, (0, y)); y += p.height
        P.save(preview)
    print({k: round(v, 3) for k, v in scales.items()}, len(js))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'src/6zzzzzc_logue_sprites.js', sys.argv[3] if len(sys.argv) > 3 else None)
