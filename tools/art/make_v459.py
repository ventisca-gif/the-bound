# v4.59: Devorador Carmesí desde la imagen de Sergio. Vistas: frente, perfil (izq/der) y espalda (sin cara).
import sys, os, io, base64
sys.path.insert(0, os.path.dirname(__file__))
from sheet_extract import *
from scipy import ndimage
a = load('tools/art/ref/devorador_sergio.png')
box = find(a, (20, 20, a.shape[1] - 20, a.shape[0] - 20), min_h=300, dil=4)[0]
c, m = cut(a, box, tol=30)
S = float(sys.argv[1]) if len(sys.argv) > 1 else 0.24
def back_of(img):
    o = img.astype(float).copy(); al = o[..., 3] > 0; H, W = al.shape
    yy, xx = np.mgrid[0:H, 0:W]
    P = np.array([[38, 4, 12], [84, 12, 24], [130, 22, 36], [176, 36, 50], [214, 70, 82], [240, 120, 128]], float)
    out = o.copy()
    for (cx, cy, rx, ry) in [(0.5, 0.64, 0.30, 0.27), (0.5, 0.27, 0.25, 0.24)]:
        cx *= W; cy *= H; rx *= W; ry *= H
        nx = (xx - cx) / rx; ny = (yy - cy) / ry; d = nx * nx + ny * ny; inside = d <= 1
        light = np.clip(1 - np.sqrt(np.maximum(0, (nx + 0.35) ** 2 + (ny + 0.45) ** 2)) * 0.75, 0, 1)
        lv = np.clip(light * 0.85 + (1 - d) * 0.25, 0, 1)
        idx = np.clip((lv * 5.2).astype(int), 0, 5)
        rnd = (xx * 7 + yy * 13 + (xx * yy) % 5) % 9
        idx = np.clip(idx - (rnd == 0) - (rnd == 4) + (rnd == 7), 0, 5)
        col = P[idx]
        rim = inside & (d > 0.86)
        col[rim] = P[0]
        spine = inside & (np.abs(xx - cx) < 1.2) & ~rim
        col[spine] = P[1]
        knobs = inside & (np.abs(xx - cx) < 2.5) & ((yy % 12) < 2) & (d < 0.75)
        col[knobs] = P[4]
        out[inside, :3] = col[inside]; out[inside, 3] = 255
    return out[:, ::-1].clip(0, 255).astype(np.uint8)
def noshadow(img):
    o = img.copy(); H = o.shape[0]; r, g, b = [o[..., k].astype(int) for k in range(3)]
    sh = (np.arange(H)[:, None] > H * 0.8) & (r + g + b < 170) & (r < g * 1.6 + 30)
    o[sh, 3] = 0
    ys, xs = np.nonzero(o[..., 3]); return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
def side_of(img):
    h, w = img.shape[:2]; nw = int(w * 0.72)
    pre = img.astype(float); A = pre[..., 3:4] / 255; pre[..., :3] *= A
    q = np.array(Image.fromarray(pre.clip(0, 255).astype(np.uint8), 'RGBA').resize((nw, h), Image.BOX)).astype(float); A = q[..., 3:4] / 255
    q[..., :3] = np.where(A > 0.01, q[..., :3] / np.maximum(A, 1e-3), 0); q[..., 3] = (q[..., 3] > 110) * 255
    return q.astype(np.uint8)
front = noshadow(shrink(c, m, S, contrast=1.06, edge_dark=0.55))
side = side_of(front)
views = [front, side, side[:, ::-1].copy(), back_of(front)]
cw = max(v.shape[1] for v in views) + 4; ch = max(v.shape[0] for v in views) + 4
sheet = pack(views, cw, ch, cols=4)
bio = io.BytesIO(); Image.fromarray(sheet, 'RGBA').save(bio, 'PNG', optimize=True)
open('src/6zz5a_art_v459.js', 'w').write('// v4.59: Devorador Carmesí (tools/art/make_v459.py; original en tools/art/ref)\n' + f"const ART59_DEVO = {{ src: 'data:image/png;base64,{base64.b64encode(bio.getvalue()).decode()}', cw: {cw}, ch: {ch} }};\n")
Image.fromarray(sheet, 'RGBA').save('/tmp/devo_sheet.png'); print(box, sheet.shape, cw, ch)
