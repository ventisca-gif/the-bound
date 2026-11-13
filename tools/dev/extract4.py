# extract4.py (v3.9): recorta las 2 hojas de espadas especiales (celestiales y legendarias)
# uso: cd <carpeta de trabajo con meta.json de extract2> && python3 extract4.py <carpeta de adjuntos>
import sys, json, numpy as np
from PIL import Image
sys.path.insert(0, __import__('os').path.dirname(__file__))
A = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
src = open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'extract2.py')).read()
key = None; exec(src[src.index('def key('):src.index('def iconbox(')])   # reutiliza el recorte con transparencia de extract2
S = {
 '6363fd6d': [(111, 204, 'w_guerrero_18'), (222, 314, 'w_guerrero_19'), (332, 422, 'w_guerrero_20'), (441, 532, 'ws_albasagrada'), (551, 640, 'ws_juicio'), (658, 748, 'ws_penumbra'), (769, 863, 'w_guerrero_21'), (885, 987, 'ws_solmayor')],
 '9f5dc242': [(112, 205, 'ws_cosmica'), (224, 315, 'ws_abismo'), (334, 425, 'ws_hambrienta'), (443, 533, 'ws_eclipse'), (552, 640, 'ws_rosa'), (660, 750, 'lw_guerrero'), (769, 861, 'ws_runa'), (882, 979, 'w_guerrero_16')],
}
XW = {'prep': (380, 570), 'a1': (588, 822), 'a2': (826, 1072), 'a3': (1074, 1314), 'hit': (1316, 1522)}   # columnas de estas hojas (distintas a las de v3.6)
meta = json.load(open('meta.json'))
for sh, rows in S.items():
    im = np.asarray(Image.open(A + sh + '-image.png').convert('RGB')).astype(float)
    for (y0, y1, iid) in rows:
        for ck, (x0, x1) in XW.items():
            k = key(im[y0:y1, x0:x1], t0=48, t1=130, edge=5)
            if k is None: print('EMPTY', sh, iid, ck); continue
            # recentrado igual que extract2: ancho fijo alrededor del centro de la ventana
            w = x1 - x0; pad = np.zeros((k.shape[0], w, 4), np.uint8)
            Image.fromarray(k, 'RGBA').save(f'raw_{iid}_{ck}.png')
        k = key(im[y0 + 2:y1 - 2, 26:136], t0=48, t1=130, edge=5)
        Image.fromarray(k, 'RGBA').save(f'raw_{iid}_icon.png'); meta[iid] = sh
json.dump(meta, open('meta.json', 'w')); print('ok', len(meta))
