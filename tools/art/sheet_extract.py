# Recorta figuras de una hoja con fondo oscuro liso (referencias de Sergio) y las reduce a sprites HD.
import numpy as np
from PIL import Image
from scipy import ndimage

def load(p):
    return np.array(Image.open(p).convert('RGB')).astype(float)

def find(a, region, min_h=40, dil=5, thr=40, bg=None):
    x0, y0, x1, y1 = region
    sub = a[y0:y1, x0:x1]
    if bg is None: bg = np.median(np.concatenate([sub[:4].reshape(-1, 3), sub[-4:].reshape(-1, 3)]), 0)
    fg = np.abs(sub - bg).sum(2) > thr
    lab, n = ndimage.label(ndimage.binary_dilation(fg, iterations=dil))
    out = []
    for s in ndimage.find_objects(lab):
        if s[0].stop - s[0].start >= min_h:
            out.append((x0 + s[1].start, y0 + s[0].start, x0 + s[1].stop, y0 + s[0].stop))
    out.sort(key=lambda b: b[0])
    return out

def cut(a, box, tol=30, pad=3, bg=None, keep_largest=True):
    x0, y0, x1, y1 = box
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad
    c = a[y0:y1, x0:x1]
    if bg is None: bg = np.median(np.concatenate([c[0], c[-1], c[:, 0], c[:, -1]]), 0)
    near = np.abs(c - bg).sum(2) < tol
    l2, _ = ndimage.label(near)
    border = set(np.unique(np.concatenate([l2[0], l2[-1], l2[:, 0], l2[:, -1]]))) - {0}
    m = ~np.isin(l2, list(border))
    m = ndimage.binary_opening(m, iterations=1)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n > 1:
        sz = ndimage.sum(m, lab, range(1, n + 1))
        keep = [i + 1 for i in range(n) if sz[i] >= max(30, sz.max() * (0.5 if keep_largest == 'one' else 0.02))]
        m = np.isin(lab, keep)
    return c, m

def shrink(c, m, s, contrast=1.1, edge_dark=0.55):
    H, W = m.shape
    nh, nw = max(1, round(H * s)), max(1, round(W * s))
    al = m.astype(float)
    rgba = np.dstack([c * al[..., None], al * 255])
    im = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), 'RGBA').resize((nw, nh), Image.BOX if s < 1 else Image.NEAREST)
    q = np.array(im).astype(float)
    A = q[..., 3:4] / 255
    rgb = np.where(A > 0.01, q[..., :3] / np.maximum(A, 1e-3), 0)
    rgb = np.clip((rgb - 128) * contrast + 128, 0, 255)
    alpha = A[..., 0] > 0.45
    if edge_dark:
        er = ndimage.binary_erosion(alpha)
        edge = alpha & ~er
        rgb[edge] = rgb[edge] * edge_dark
    o = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.nonzero(alpha)
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def pack(cells, cw, ch, cols=None, foot=2):
    """Pone cada sprite en una celda cw x ch, centrado y con los pies abajo."""
    cols = cols or len(cells)
    rows = (len(cells) + cols - 1) // cols
    sheet = np.zeros((ch * rows, cw * cols, 4), np.uint8)
    for i, s in enumerate(cells):
        if s is None: continue
        h, w = s.shape[:2]
        if h > ch or w > cw:
            k = min(ch / h, cw / w); s = np.array(Image.fromarray(s).resize((max(1, int(w * k)), max(1, int(h * k))), Image.BOX)); h, w = s.shape[:2]
        r, cc = divmod(i, cols)
        oy = r * ch + ch - foot - h; ox = cc * cw + (cw - w) // 2
        sheet[oy:oy + h, ox:ox + w] = s
    return sheet
