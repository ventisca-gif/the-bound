"""6.30 · Recorta las hojas de sprites de Sergio (infancia de Luffy, Dadan, Shimotsuki) y genera src/6zzzzzs_inf_sprites.js.
Uso: python3 tools/dev/inf_pack.py [carpeta_salida_vista_previa]
Hojas en tools/art/ref/infancia/. Cada personaje sale como una tira de 4 filas (abajo, izquierda, derecha, arriba)
× 6 columnas (reposo, paso 1-4, hablar) de CW×CH, pies en FOOT y cuerpo centrado en CX, más su retrato (64×64).
Necesita numpy, Pillow y scipy."""
import sys, io, base64, json, pathlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = pathlib.Path(__file__).resolve().parents[2]
REF = ROOT / 'tools/art/ref/infancia'
OUT = ROOT / 'src/6zzzzzs_inf_sprites.js'
CW, CH, FOOT, CX = 96, 96, 92, 48

def fgmask(a, white=False, dark=False):
    """Máscara del dibujo dentro de un recorte. Los dibujos tienen contorno negro: se toma el contorno (negro neutro,
    no el azul marino del fondo), se cierran sus huecos y se rellena por dentro. En fondo blanco basta con lo no blanco."""
    rgb = a[..., :3].astype(int)
    if white:
        m = rgb.min(2) < 228
        m = ndi.binary_fill_holes(ndi.binary_closing(m, iterations=2))
    else:
        mx = rgb.max(2); blue = rgb[..., 2] - rgb[..., 0]
        edge0 = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]); bg0 = np.median(edge0, axis=0)
        lum = rgb @ [0.3, 0.59, 0.11]
        line = (mx < 48) & (blue < 16)
        if dark: line |= (np.sqrt(((rgb - bg0) ** 2).sum(2)) > 40) & (lum < 80)   # contorno de color (pelo verde de Zoro)
        line[0, :] = True          # si el sombrero toca el borde de arriba del recorte, el borde cierra el contorno
        m = ndi.binary_closing(line, iterations=5)
        m = ndi.binary_fill_holes(m)
        m[:2, :] = False
        # el cierre tapa huecos del contorno, pero también rincones de fondo (entre las piernas): se quitan los
        # píxeles del color del fondo que se comunican con el fondo de fuera
        edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]); bgc = np.median(edge, axis=0)
        bgl = np.sqrt(((rgb - bgc) ** 2).sum(2)) < 10
        lab, n = ndi.label(bgl)
        outside = np.unique(lab[bgl & ~m]); outside = outside[outside > 0]
        m &= ~np.isin(lab, outside)
        m = ndi.binary_opening(m, iterations=2)
    lab, n = ndi.label(m)
    if not n: return m
    sz = ndi.sum(m, lab, range(1, n + 1)); big = sz.max()
    keep = np.zeros(n + 1, bool); keep[1:] = sz >= big * 0.03
    return keep[lab]

def runs(mask, gap=10, minw=30):
    """Separa los dibujos de una fila por columnas vacías."""
    col = mask.sum(0) > 2; out = []; x = 0; W = len(col)
    while x < W:
        if not col[x]: x += 1; continue
        x0 = x
        while x < W:
            if col[x]: x += 1; continue
            g = x
            while g < W and not col[g] and g - x < gap: g += 1
            if g < W and col[g] and g - x < gap: x = g; continue
            break
        if x - x0 >= minw: out.append((x0, x))
    return out

def sprites_in(im, box, n, white=False, flip=False, dark=False):
    x0, y0, x1, y1 = box
    a = np.array(im.crop(box).convert('RGBA'))
    m = fgmask(a, white, dark)
    rs = runs(m)
    rs = sorted(sorted(rs, key=lambda r: -(m[:, r[0]:r[1]].sum()))[:n])
    if len(rs) != n: raise SystemExit(f'{box}: esperaba {n} dibujos y encontré {len(rs)}')
    out = []
    for (a0, a1) in rs:
        sub = a[:, a0:a1].copy(); mm = m[:, a0:a1]
        sub[..., 3] = np.where(mm, 255, 0)
        sp = Image.fromarray(sub); bb = sp.getbbox(); sp = sp.crop(bb)
        if flip: sp = sp.transpose(Image.FLIP_LEFT_RIGHT)
        out.append(sp)
    return out

def place(sheet, sp, c, r, scale):
    w, h = max(1, round(sp.width * scale)), max(1, round(sp.height * scale))
    s = sp.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA')
    q = np.array(s); q[..., 3] = np.where(q[..., 3] >= 110, 255, 0); s = Image.fromarray(q)
    tile = Image.new('RGBA', (CW, CH)); tile.alpha_composite(s, (max(0, CX - w // 2), max(0, FOOT - h)))
    sheet.alpha_composite(tile, (c * CW, r * CH))

# [archivo, alto en celdas HD, fondo blanco, filas {fila: (caja, n, voltear)}, reposo/hablar, retrato]
# Filas del atlas: 0 abajo, 1 izquierda, 2 derecha, 3 arriba.
DARK = {
  'luffy': ('luffy_nino.webp', 54, {0: (500, 8, 1500, 192), 3: (500, 196, 1500, 368), 1: (500, 374, 1500, 528), 2: (500, 534, 1500, 690)},
            {'idle': ((400, 735, 700, 965), 2), 'talk': ((845, 735, 1515, 965), 4)}, (40, 625, 252, 882)),
  'ace': ('ace_nino.webp', 56, {0: (520, 20, 1510, 192), 3: (520, 196, 1510, 368), 1: (520, 374, 1510, 528), 2: (520, 534, 1510, 692)},
          {'idle': ((405, 740, 712, 965), 2), 'talk': ((855, 740, 1515, 965), 4)}, (42, 622, 258, 876)),
  'sabo': ('sabo_nino.webp', 60, {0: (490, 20, 1515, 190), 3: (490, 194, 1515, 362), 1: (490, 366, 1515, 522), 2: (490, 528, 1515, 688)},
           {'idle': ((375, 735, 690, 965), 2), 'talk': ((840, 735, 1515, 965), 4)}, (30, 625, 233, 880)),
  'zoro': ('zoro_nino.webp', 55, {0: (805, 56, 1420, 200), 3: (805, 205, 1420, 350), 1: (805, 360, 1420, 496), 2: (805, 502, 1420, 640)},
           {'idle': ((40, 765, 535, 1022), 2), 'talk': ((580, 765, 1420, 1008), 4)}, (382, 145, 585, 368)),
  'kuina': ('kuina.webp', 56, {0: (412, 92, 935, 285), 3: (955, 92, 1515, 285), 1: (412, 388, 935, 580), 2: (955, 388, 1515, 580)},
            {'idle': ((410, 690, 830, 940), 2), 'talk': ((860, 700, 1515, 945), 4)}, (36, 696, 366, 996)),
}

DARKLINE = {'zoro'}
# fotogramas que se ven mal aunque pasen el control automático: (personaje, fila, paso) → paso que se copia
FIX = {('luffy', 2, 3): 1}

# Fotogramas sueltos con fondo transparente que mandó Sergio (tools/art/ref/infancia/transparentes/<NN_Nombre>/).
# [carpeta, alto en celdas HD, pasos por dirección]
TRANSP = {'dadan': ('01_Dadan', 84, 3), 'garp': ('02_Garp', 80, 4), 'ace': ('03_Ace', 56, 4), 'luffy': ('04_Luffy', 54, 4),
          'sabo': ('05_Sabo', 60, 4), 'kuina': ('06_Kuina', 58, 4), 'zoro': ('07_Zoro', 55, 4)}
DIRS = {0: 'frente', 1: 'izquierda', 2: 'derecha', 3: 'atras'}

def load(path, halo=True):
    im = Image.open(path).convert('RGBA'); a = np.pad(np.array(im), ((2, 2), (2, 2), (0, 0)))
    a[..., 3] = np.where(a[..., 3] >= 200, 255, 0)      # fuera restos de borde semitransparentes
    # halo marrón y sombra gris pegados por fuera del contorno negro: se quitan rellenando desde lo transparente por los
    # píxeles grisáceos (poco color, ni negros ni claros); el contorno negro los frena
    rgb = a[..., :3].astype(int); lum = rgb @ [0.3, 0.59, 0.11]; sat = rgb.max(2) - rgb.min(2)
    soft = halo & (a[..., 3] > 0) & (lum > 24) & (lum < 140) & (sat < 64)
    lab0, _ = ndi.label(soft | (a[..., 3] == 0))
    outside = np.unique(lab0[a[..., 3] == 0]); outside = outside[outside > 0]
    a[..., 3] = np.where(np.isin(lab0, outside) & soft, 0, a[..., 3])
    m = ndi.binary_opening(a[..., 3] > 0, iterations=1); lab, n = ndi.label(m)
    if n:
        sz = ndi.sum(m, lab, range(1, n + 1)); keep = np.zeros(n + 1, bool); keep[1:] = sz >= sz.max() * 0.02; a[..., 3] = np.where(keep[lab], 255, 0)
    im = Image.fromarray(a); return im.crop(im.getbbox())

def build():
    data, prev = {}, []
    T = REF / 'transparentes'
    for k, (folder, hgt, n) in TRANSP.items():
        d = T / folder
        hl = k != 'garp'   # el forro lila de la capa de Garp no es halo
        walk = {r: [load(d / f'caminar_{name}_{i:02d}.png', hl) for i in range(1, n + 1)] for r, name in DIRS.items()}
        idle = [load(d / f'parado_{i:02d}.png', hl) for i in (1, 2)]
        talk = sorted(d.glob('dialogo_*.png')); talk = load(talk[1] if len(talk) > 1 else talk[0], hl)
        scale = hgt / np.median([s.height for s in walk[0]])
        sheet = Image.new('RGBA', (CW * 6, CH * 4))
        for r, fr in walk.items():
            seq = fr if n == 4 else [fr[0], fr[1], fr[0], fr[2]]
            sc_r = scale * (np.median([s.height for s in walk[0]]) / np.median([s.height for s in fr]) if r in (1, 2) else 1)
            if r in (0, 3): place(sheet, idle[0 if r == 0 else 1], 0, r, hgt / idle[0 if r == 0 else 1].height)
            else: place(sheet, fr[0], 0, r, sc_r)
            for c in range(4): place(sheet, seq[c], 1 + c, r, sc_r)
            if r == 0: place(sheet, talk, 5, r, hgt / talk.height)
            elif r == 3: place(sheet, idle[1], 5, r, hgt / idle[1].height)
            else: place(sheet, fr[0], 5, r, sc_r)
        data[k] = sheet; prev.append(sheet)
    # retratos: los de las hojas con marco (niños) y la cabeza del diálogo (Dadan, Garp)
    for k, (fn, hgt, rows, extra, pbox) in DARK.items():
        im = Image.open(REF / fn).convert('RGBA'); data[k + '_por'] = im.crop(pbox).convert('RGB').resize((64, 64), Image.LANCZOS)
    for k, folder, fx in (('dadan', '01_Dadan', 0.62), ('garp', '02_Garp', 0.5)):
        b0 = load(T / folder / 'dialogo_01.png', k != 'garp'); w = b0.width; side = int(w * fx); x0 = (w - side) // 2
        head = b0.crop((x0, 0, x0 + side, side)); bg = Image.new('RGBA', head.size, (58, 78, 120, 255)); bg.alpha_composite(head)
        data[k + '_por'] = bg.convert('RGB').resize((64, 64), Image.LANCZOS)
    return data, prev

def b64(im, fmt='PNG'):
    bio = io.BytesIO(); im.save(bio, fmt, optimize=True); return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()

def main():
    data, prev = build()
    js = ['// Generado por tools/dev/inf_pack.py con las hojas de Sergio (6.30). No editar a mano.',
          f'const INF_CELL={{w:{CW},h:{CH}}};',
          'const INF_IMAGES=' + json.dumps({k: b64(v) for k, v in data.items()}) + ';', '']
    OUT.write_text('\n'.join(js))
    if len(sys.argv) > 1:
        d = pathlib.Path(sys.argv[1]); d.mkdir(parents=True, exist_ok=True)
        for k, v in data.items():
            bg = Image.new('RGBA', v.size, (90, 140, 80, 255)); bg.alpha_composite(v.convert('RGBA')); bg.convert('RGB').resize((v.width * (1 if v.width > 200 else 3), v.height * (1 if v.width > 200 else 3)), Image.NEAREST).save(d / f'{k}.png')
    print('ok', OUT, round(OUT.stat().st_size / 1024), 'KB')

if __name__ == '__main__':
    main()
