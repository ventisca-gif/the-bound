"""Peinados de la lámina de Sergio (tools/art/ref/lamina_peinados.png), sacados píxel a píxel (v4.97).

Uso:  python3 tools/dev/lamina.py file://$PWD/dist/test.html [--debug]   -> escribe src/6zz9zs_lamina_data.js

La lámina está dibujada con los cuerpos del propio juego (8 filas: peinado sobre un cuerpo; 4 columnas: frente,
izquierda, derecha, espalda), pero ampliada y suavizada. Para cada celda:
1) el juego dibuja ese mismo cuerpo calvo (mismo sexo, estructura y dirección);
2) se busca la escala y el desplazamiento que mejor encajan el cuerpo de la lámina con el calvo (parte de abajo);
3) se reduce la celda al tamaño real del sprite tomando el color del centro de cada píxel;
4) el pelo (y sus accesorios) es lo que cambia respecto al calvo en la mitad de arriba o fuera de la silueta;
5) se guarda con su posición relativa al centro de la cabeza (hx, hy) y las medidas de esa cabeza (hrx, hry), para
   que el juego lo ajuste a las demás estructuras y lo mueva con la cabeza al caminar. Los colores quedan fijos.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

D = os.path.dirname(__file__); ROOT = os.path.abspath(os.path.join(D, '..', '..'))
ROWS = [('lam_diadema', 'f', 0), ('lam_cuernos', 'f', 1), ('lam_coletas', 'f', 2), ('lam_menta', 'f', 3), ('lam_capas', 'm', 0), ('lam_plata', 'm', 1), ('lam_cinta', 'm', 2), ('lam_cobriza', 'm', 3)]
DIRS = ['down', 'left', 'right', 'up']
COLX = [355, 585, 815, 1045]; ROWY = [172, 315, 457, 600, 742, 883, 1025, 1170]   # centros aproximados de cada celda


def render_bald(url):
    JS = r"""(rows) => { const bald = { n: 'calvo', cap: 'bald', bang: 'none', side: 0, back: 0 }; HS_F.push(bald); HS_M.push(bald); const out = [];
      for (const [k, g, bt] of rows) { const H = g === 'f' ? HS_F : HS_M, a = { g, bt, skin: 0, hair: 'negro', hs: H.length - 1, eyes: 'verde', top: [1, 'negro'], bot: [0, 'negro'], shoe: [1, 'negro'] };
        const L = heroLook('guerrero', a, { weapon: 0 }, {}, {}); L.weapon = null; const row = {};
        const FW = BODYP.normal.fw, FH = BODYP.normal.fh;
        for (const dir of ['down', 'left', 'right', 'up']) { const p = new Pix(FW, FH); drawHero(p, L, dir === 'right' ? 'left' : dir, 'idle', 0); const M = Object.assign({}, p.meta); if (dir === 'right') { p.flipX(); M.hx = FW - 1 - M.hx; } p.outline(OUTL, false);
          const c = document.createElement('canvas'); c.width = FW; c.height = FH; const x = c.getContext('2d'); p.toCtx(x, 0, 0); const d = x.getImageData(0, 0, FW, FH).data; row[dir] = { w: FW, h: FH, d: Array.from(d), hx: M.hx, hy: M.hy, hrx: M.hrx, hry: M.hry, top: M.headTop }; }
        out.push(row); } return out; }"""
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(2500)
        r = pg.evaluate(JS, ROWS); b.close(); return r


def main():
    url = sys.argv[1]; dbg = '--debug' in sys.argv
    sheet = np.array(Image.open(os.path.join(ROOT, 'tools', 'art', 'ref', 'lamina_peinados.png')).convert('RGB')).astype(float)
    bg = np.array([45, 29, 59.0]); bald = render_bald(url); out = {}; prev = []
    for ri, (key, g, bt) in enumerate(ROWS):
        out[key] = {}
        for di, dn in enumerate(DIRS):
            B = bald[ri][dn]; W, H = B['w'], B['h']; ref = np.array(B['d'], float).reshape(H, W, 4); ra = ref[..., 3] > 0
            ys, xs = np.where(ra); by1 = ys.max(); bcx = (xs.min() + xs.max()) / 2
            cy, cx = ROWY[ri], COLX[di]; crop = sheet[cy - 66:cy + 64, cx - 70:cx + 70]; bg = np.median(np.concatenate([crop[:3].reshape(-1, 3), crop[-3:].reshape(-1, 3), crop[:, :3].reshape(-1, 3), crop[:, -3:].reshape(-1, 3)]), 0); cm = np.sqrt(((crop - bg) ** 2).sum(2)) > 32
            yy, xx = np.where(cm); sy1 = yy.max()
            gm = (crop[..., 1] > crop[..., 0] + 35) & (crop[..., 1] > crop[..., 2] + 10) & (crop[..., 1] > 90)
            rg = (ref[..., 1] > ref[..., 0] + 35) & (ref[..., 1] > ref[..., 2] + 10) & ra
            gy, gx = np.where(gm); ey, ex = np.where(rg)
            if len(gy) and len(ey):
                s_ = (sy1 + 0.5 - gy.mean()) / (by1 + 1 - (ey.mean() + 0.5)); sx_ = cx - 70 + gx.mean(); exm = ex.mean() + 0.5
            else:
                s_ = 2.9; sx_ = cx - 70 + crop.shape[1] / 2; exm = bcx + 0.5
            best = None
            low = cm[int(sy1 - 30):int(sy1)]; lx = np.where(low.any(0))[0]; sx_ = cx - 70 + (lx.min() + lx.max() + 1) / 2 if len(lx) else sx_; exm = bcx + 0.5
            for s in [2.78]:
                for dx in np.arange(-5, 5.1, 0.5):
                    for dy in np.arange(-3, 3.1, 0.5):
                        ox = sx_ - exm * s + dx; oy = cy - 66 + sy1 + 0.5 - (by1 + 1) * s + dy
                        lower = ys > by1 - 14; err = 0; n = 0
                        for (y, x) in zip(ys[lower], xs[lower]):
                            X = int(ox + (x + 0.5) * s); Y = int(oy + (y + 0.5) * s)
                            if 0 <= Y < sheet.shape[0] and 0 <= X < sheet.shape[1]: err += np.abs(sheet[Y, X] - ref[y, x, :3]).sum(); n += 1
                        e = err / max(1, n)
                        if best is None or e < best[0]: best = (e, s, ox, oy)
            e, s, ox, oy = best
            # reducir la celda al sprite y comparar con el calvo
            layer = np.zeros((H, W, 4), np.uint8)
            for y in range(H):
                for x in range(W):
                    X = int(ox + (x + 0.5) * s); Y = int(oy + (y + 0.5) * s)
                    if not (0 <= Y < sheet.shape[0] and 0 <= X < sheet.shape[1]): continue
                    blk = sheet[max(0, Y - 1):Y + 1, max(0, X - 1):X + 1].reshape(-1, 3); c = np.median(blk, 0)
                    isbg = np.sqrt(((c - bg) ** 2).sum()) < 32
                    if isbg: continue
                    headz = y <= B['hy'] + B['hry'] and not (dn != 'up' and abs(x - B['hx']) < B['hrx'] - 0.5 and y >= B['hy'] - 1)
                    if ra[y, x] and np.abs(c - ref[y, x, :3]).sum() < 60 and not headz: continue
                    if y >= by1 - 1 and c.mean() < 90: continue
                    if y > B['hy'] + B['hry'] + 6 and ra[y, x] and np.abs(c - ref[y, x, :3]).sum() < 120: continue
                    layer[y, x, :3] = c.clip(0, 255).astype(np.uint8); layer[y, x, 3] = 255
            # limpieza: fuera piel, ojos y cuerpo; dentro lo que se parece a los colores del pelo y accesorios
            hy, hx, hry, hrx = B['hy'], B['hx'], B['hry'], B['hrx']; neck = hy + hry
            from scipy import ndimage
            sil = ndimage.binary_dilation(ra, iterations=1)
            pal = layer[:max(1, int(hy - 2))][layer[:max(1, int(hy - 2)), :, 3] > 0][:, :3].astype(float)
            if len(pal) > 400: pal = pal[np.random.RandomState(1).choice(len(pal), 400, replace=False)]
            def near(c, lim=48): return len(pal) and np.sqrt(((pal - c) ** 2).sum(1)).min() < lim
            for y in range(H):
                for x in range(W):
                    if not layer[y, x, 3]: continue
                    c = layer[y, x, :3].astype(float); r_, g_, b_ = c; lum = c.mean()
                    face = abs(x - hx) < hrx - 0.5 and hy - 1 <= y <= neck and dn != 'up'
                    skin = face and r_ > 170 and g_ > 120 and b_ > 95 and r_ > g_ > b_ and r_ - b_ > 35 and not near(c, 30)
                    green = g_ > r_ + 35 and g_ > b_ + 10
                    drop = skin or (face and green and key != 'lam_menta') or (face and lum < 70 and not near(c, 30)) or (face and green and key == 'lam_menta' and y > hy)
                    if not drop and y > neck: drop = ra[y, x] and (not near(c, 26) or lum < 95 or key == 'lam_capas') or (sil[y, x] and lum < 70)
                    if not drop and y > neck + 6 and (sil[y, x] or (x > 0 and sil[y, x - 1]) or (x + 1 < W and sil[y, x + 1])) and not near(c, 22): drop = True
                    if drop: layer[y, x] = 0
            # píxeles sueltos
            al = layer[..., 3] > 0; lab, n = ndimage.label(al, structure=np.ones((3, 3)))
            for i in range(1, n + 1):
                if (lab == i).sum() < 3: layer[lab == i] = 0
            ys2, xs2 = np.where(layer[..., 3] > 0)
            if not len(ys2): out[key][dn] = None; continue
            x0, x1, y0, y1 = xs2.min(), xs2.max(), ys2.min(), ys2.max(); L = layer[y0:y1 + 1, x0:x1 + 1]
            out[key][dn] = {'w': int(L.shape[1]), 'h': int(L.shape[0]), 'ox': int(x0) - B['hx'], 'oy': int(y0) - B['hy'], 'hrx': B['hrx'], 'hry': B['hry'], 'raw': base64.b64encode(np.ascontiguousarray(L).tobytes()).decode()}
            prev.append((key, dn, L, s, e))
            print(key, dn, 'escala %.2f error %.0f' % (s, e), L.shape[:2])
    if dbg:
        W = 64; S = Image.new('RGBA', (W * 4 * 4, W * 4 * 8), (40, 30, 60, 255))
        for i, (k, dn, L, s, e) in enumerate(prev): im = Image.fromarray(L, 'RGBA').resize((L.shape[1] * 4, L.shape[0] * 4), Image.NEAREST); S.alpha_composite(im, ((i % 4) * W * 4, (i // 4) * W * 4))
        S.save('/tmp/claude-0/lam/capas.png')
    p = os.path.join(ROOT, 'src', '6zz9zs_lamina_data.js')
    open(p, 'w').write('// Generado por tools/dev/lamina.py desde la lámina de Sergio (v4.97). No editar a mano.\nconst LAM_DATA = ' + json.dumps(out) + ';\n')
    print('escrito', p)


if __name__ == '__main__':
    main()
