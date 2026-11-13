# pack2.py: empaqueta los sprites extraídos por extract2.py (tiers 7-15, espadas con estilo y legendarias) en src/6zg_wspr_data2.js
# uso: cd <carpeta con raw_<item>_<col>.png y meta.json> && python3 pack2.py <carpeta raws viejos tiers 1-6 (para el laúd de oro)>
from PIL import Image
import numpy as np, base64, io, json, sys, collections
COLS = ['prep', 'a1', 'a2', 'a3', 'hit']; CW, CH = 68, 32
OLD = sys.argv[1] if len(sys.argv) > 1 else '../wspr'
meta = json.load(open('meta.json'))

def bbsz(im):
    a = np.asarray(im)[:, :, 3] > 80; ys, xs = np.nonzero(a)
    return max(xs.max() - xs.min() + 1, ys.max() - ys.min() + 1) if len(xs) else 1

def tint(im, col, k=1.0):
    a = np.asarray(im).astype(float); lum = (a[:, :, :3] @ [0.3, 0.59, 0.11]) / 255.
    t = np.array(col, float) / 255.; rgb = np.clip(lum[:, :, None] * t * 1.35 + lum[:, :, None] ** 3 * 0.35, 0, 1) * 255
    rgb = a[:, :, :3] * (1 - k) + rgb * k
    return Image.fromarray(np.dstack([rgb, a[:, :, 3]]).astype(np.uint8), 'RGBA')

def trim_icon(im):
    a = np.asarray(im).copy(); h = a.shape[0]
    for y in list(range(0, 5)) + list(range(h - 5, h)):
        if (a[y, :, 3] > 80).mean() > 0.5: a[y, :, 3] = 0
    im = Image.fromarray(a, 'RGBA'); a2 = np.asarray(im)[:, :, 3] > 60; ys, xs = np.nonzero(a2)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)) if len(xs) else im

def icon16(im):
    s = 16 / max(im.size); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    sm = im.resize((w, h), Image.LANCZOS); a = np.asarray(sm).copy(); a[:, :, 3] = np.where(a[:, :, 3] > 110, 255, 0)
    op = a[:, :, 3] > 0; nb = np.zeros(op.shape, int)   # quita píxeles sueltos (restos del brillo de la caja)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy or dx: nb += np.roll(np.roll(op, dy, 0), dx, 1)
    a[:, :, 3] = np.where(op & (nb >= 2), 255, 0)
    out = Image.new('RGBA', (16, 16)); out.paste(Image.fromarray(a, 'RGBA'), ((16 - w) // 2, (16 - h) // 2)); return out

def raw(item, c):
    if item == 'w_pez_9': return tint(raw('w_pez_8', c), (176, 96, 236), 0.85)   # aletas rúnicas: derivadas de las de adamantita
    if item == 'w_invocador_16': return tint(raw('w_invocador_17', c), (96, 150, 255), 0.9)  # guadaña estelar: de la primordial en azul
    if item == 'w_bardo_11': return tint(Image.open(f'{OLD}/raw_oro_4_{c}.png').convert('RGBA'), (255, 196, 70), 0.55)  # laúd del vínculo: del laúd de oro
    im = Image.open(f'raw_{item}_{c}.png').convert('RGBA')
    a = np.asarray(im)[:, :, 3] > 60; ys, xs = np.nonzero(a)   # quita restos tenues de los bordes
    return im.crop((max(0, xs.min() - 1), max(0, ys.min() - 1), xs.max() + 2, ys.max() + 2)) if len(xs) else im

groups = collections.OrderedDict()
for item, sh in meta.items(): groups.setdefault(sh, []).append(item)
groups['der'] = ['w_pez_9']; groups['der2'] = ['w_bardo_11']; groups['der3'] = ['w_invocador_16']
icons, atl, rows, scales = {}, {}, {}, {}
for g, items in groups.items():
    med = np.median([bbsz(raw(i, 'prep')) for i in items]); s = 0.25 * 88 / med; scales[g] = round(s, 3)
    A = Image.new('RGBA', (CW * len(COLS), CH * len(items)))
    for r, item in enumerate(items):
        ic = icon16(trim_icon(raw(item, 'icon'))); icons[item] = base64.b64encode(ic.tobytes()).decode()
        ic.resize((64, 64), Image.NEAREST).save(f'ic_{item}.png')
        rows[item] = [g, r]
        for ci, c in enumerate(COLS):
            im = raw(item, c); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
            fr = im.resize((w, h), Image.LANCZOS)
            if w > CW or h > CH:   # recorta el margen transparente sobrante; si aún no cabe, reduce
                a = np.asarray(fr)[:, :, 3] > 20; ys, xs = np.nonzero(a)
                cx, cy = w / 2, h / 2
                bx0, bx1, by0, by1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
                hw = max(cx - bx0, bx1 - cx); hh = max(cy - by0, by1 - cy)
                if hw * 2 > CW or hh * 2 > CH:
                    k = min(CW / (hw * 2), CH / (hh * 2)); fr = fr.resize((max(1, int(w * k)), max(1, int(h * k))), Image.LANCZOS); w, h = fr.size
            cell = Image.new('RGBA', (CW, CH)); cell.paste(fr, ((CW - w) // 2, (CH - h) // 2), fr); A.paste(cell, (ci * CW, r * CH))
    b = io.BytesIO(); A.save(b, 'PNG', optimize=True); atl[g] = 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode(); A.save(f'atlas2_{g}.png')
js = '// Generado por tools/dev/pack2.py desde las hojas de sprites de Sergio (v3.5-3.6): tiers 7-18, espadas con estilo y legendarias\n'
js += '// WSPR2_ICON[item] = icono 16x16 RGBA; WSPR2_ROW[item] = [atlas, fila]; WSPR2_ATLAS[atlas] = PNG con columnas prep, a1, a2, a3, impacto (celdas 68x32)\n'
js += 'const WSPR2_ICON = %s;\n' % json.dumps(icons)
js += 'const WSPR2_ROW = %s;\n' % json.dumps(rows)
js += 'const WSPR2_ATLAS = %s;\n' % json.dumps(atl)
open('/home/claude/thebound/src/6zg_wspr_data2.js', 'w').write(js)
print(len(js), len(icons), scales)
