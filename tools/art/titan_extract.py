# Recorta el Titán Carmesí de la referencia de Sergio (fondo de mazmorra) y lo reduce a sprite HD.
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, out, W = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGB'); a = np.array(im).astype(float) / 255
hsv = np.array(im.convert('HSV')).astype(float) / 255
h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
red = ((h < 62) | (h > 318)) & (s > 0.3) & (v > 0.1)
tan = (h > 20) & (h < 60) & (s > 0.12) & (v > 0.45)
m = red | tan
H, Wd = m.shape
m[:, :60] = False; m[:, -60:] = False; m[:70] = False; m[996:] = False
m = ndimage.binary_closing(m, iterations=3)
lab, n = ndimage.label(m)
sz = ndimage.sum(m, lab, range(1, n + 1)); body = np.zeros_like(m)
for i, sl in enumerate(ndimage.find_objects(lab)):
    if sz[i] < 1500: continue
    yy, xx = sl
    if yy.stop < 340 and (xx.start > 1150 or xx.stop < 330): continue   # estandartes del fondo
    body |= lab == i + 1
body = ndimage.binary_fill_holes(body)
# contornos oscuros dentro del cuerpo
body = ndimage.binary_closing(body, iterations=9); body = ndimage.binary_fill_holes(body)
bgl = ((h > 215) & (h < 312) & (s > 0.22) & (v > 0.12)) | ((h > 75) & (h < 175) & (s > 0.25))
body &= ~bgl
body = ndimage.binary_opening(body, iterations=2)
lab2, n2 = ndimage.label(body); sz2 = ndimage.sum(body, lab2, range(1, n2 + 1))
for i in range(n2):
    if sz2[i] < 3000: body[lab2 == i + 1] = False
body = ndimage.binary_fill_holes(body)
# simetría: lo que falta en un lado (zonas en sombra) se toma del contorno del otro lado
cxm = 726; mir = np.zeros_like(body); w2 = min(cxm, Wd - cxm - 1)
mir[:, cxm - w2:cxm + w2 + 1] = body[:, cxm - w2:cxm + w2 + 1][:, ::-1]
dark = (v < 0.5) & ~(((h > 75) & (h < 175)) & (s > 0.25))
body |= mir & dark
body = ndimage.binary_closing(body, iterations=3); body = ndimage.binary_fill_holes(body)
body = ndimage.binary_opening(body, iterations=2)
ys, xs = np.nonzero(body); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
print('bbox', y0, y1, x0, x1)
pur = body & (h > 200) & (h < 318)
lv = a[..., 0] * .3 + a[..., 1] * .59 + a[..., 2] * .11
a[pur] = np.stack([lv[pur] * 1.25 + .03, lv[pur] * 0.35, lv[pur] * 0.45], -1).clip(0, 1)
crop = a[y0:y1, x0:x1]; al = body[y0:y1, x0:x1].astype(float)
# cortar el resplandor amarillo del suelo: debajo de y~0.93 solo lo muy saturado rojo
pre = np.dstack([crop * al[..., None], al])
img = Image.fromarray((pre * 255).astype(np.uint8), 'RGBA')
nh = round((y1 - y0) * W / (x1 - x0))
r = np.array(img.resize((W, nh), Image.BOX)).astype(float)
A = r[..., 3:4] / 255
rgb = np.where(A > 0.01, r[..., :3] / np.maximum(A, 1e-3), 0)
rgb = np.clip((rgb - 128) * 1.08 + 128, 0, 255)
alpha = (A[..., 0] > 0.5)
o = np.dstack([rgb, alpha * 255]).astype(np.uint8)
# contorno oscuro de 1 px
er = ndimage.binary_erosion(alpha)
edge = alpha & ~er
o[edge, :3] = (o[edge, :3] * 0.45).astype(np.uint8)
Image.fromarray(o, 'RGBA').save(out)
print(o.shape)
