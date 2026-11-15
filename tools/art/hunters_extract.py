# Extrae los cazadores de la referencia de Sergio (docs/ref) a sprites HD del juego.
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGB')).astype(float)
bg = a[5, 5]
d = np.abs(a - bg).sum(2)
fg = d > 40
lab, n = ndimage.label(ndimage.binary_dilation(fg, iterations=6))
bx = [(s[0].start, s[0].stop, s[1].start, s[1].stop) for s in ndimage.find_objects(lab) if s[0].stop - s[0].start > 60]
bx.sort(key=lambda b: (b[0] // 200, b[2]))
S = 74 / 262.0   # alto HD ~74 px
sprites = []
for (y0, y1, x0, x1) in bx:
    y0 -= 4; x0 -= 4; y1 += 4; x1 += 4
    c = a[y0:y1, x0:x1]; dd = d[y0:y1, x0:x1]
    # fondo = conectado al borde y parecido al fondo
    near = dd < 34
    l2, _ = ndimage.label(near)
    border = set(np.unique(np.concatenate([l2[0], l2[-1], l2[:, 0], l2[:, -1]]))) - {0}
    bgm = np.isin(l2, list(border))
    alpha = (~bgm).astype(float)
    H, W = alpha.shape
    nh, nw = max(1, round(H * S)), max(1, round(W * S))
    rgba = np.dstack([c * alpha[..., None], alpha * 255])
    im = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA')
    # reducción por área (premultiplicado)
    pre = np.array(im.resize((nw, nh), Image.BOX)).astype(float)
    al = pre[..., 3] / 255
    rgb = np.where(al[..., None] > 0.01, pre[..., :3] / np.maximum(al[..., None], 1e-3), 0)
    # contraste suave para recuperar el borde de píxel
    rgb = np.clip((rgb - 128) * 1.12 + 128, 0, 255)
    A = (al > 0.45).astype(np.uint8) * 255
    o = np.dstack([rgb, A]).astype(np.uint8)
    sprites.append(o)
# hoja: celdas 96x96, pies en y=88
cell = 96
sheet = np.zeros((cell, cell * len(sprites), 4), np.uint8)
for i, s in enumerate(sprites):
    h, w = s.shape[:2]
    ys = np.where(s[..., 3].any(1))[0]; xs = np.where(s[..., 3].any(0))[0]
    s = s[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]; h, w = s.shape[:2]
    oy = 89 - h; ox = i * cell + (cell - w) // 2
    sheet[max(0, oy):oy + h, ox:ox + w] = s[max(0, -oy):]
Image.fromarray(sheet, 'RGBA').save(out)
print(len(sprites), sheet.shape)
