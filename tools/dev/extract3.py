# extract3.py (v3.6): recorta las 3 hojas de fondo negro (Tempestad/Vacío/Rúnico/Estelares, Primordiales, Divinas)
# uso: cd <carpeta de trabajo con meta.json de extract2> && python3 extract3.py <carpeta de adjuntos>
import sys, json, numpy as np
from PIL import Image
sys.path.insert(0, __import__('os').path.dirname(__file__))
A = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
src = open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'extract2.py')).read()
key = None; exec(src[src.index('def key('):src.index('def iconbox(')])   # reutiliza el recorte con transparencia de extract2
S = {
 'cc635a99': [(98, 178, 'lw_arquero'), (282, 356, 'lw_asesino'), (461, 535, 'ws_runa'), (636, 700, 'w_guerrero_16'), (710, 772, 'w_mago_16'), (783, 845, 'w_arquero_16'), (856, 920, 'w_asesino_16'), (928, 1002, 'w_bardo_16')],
 '1c107848': [(131, 208, 'w_pez_16'), (331, 413, 'w_guerrero_17'), (422, 504, 'w_mago_17'), (513, 597, 'w_arquero_17'), (607, 688, 'w_asesino_17'), (698, 778, 'w_bardo_17'), (789, 876, 'w_invocador_17'), (886, 975, 'w_pez_17')],
 '64e4ce6e': [(119, 211, 'w_guerrero_18'), (224, 316, 'w_mago_18'), (330, 417, 'w_arquero_18'), (430, 515, 'w_asesino_18'), (529, 612, 'w_bardo_18'), (626, 709, 'w_invocador_18'), (855, 964, 'w_pez_18')],
}
XW = {'prep': (420, 640), 'a1': (640, 862), 'a2': (862, 1088), 'a3': (1088, 1325), 'hit': (1328, 1526)}
meta = json.load(open('meta.json'))
for sh, rows in S.items():
    im = np.asarray(Image.open(A + sh + '-image.png').convert('RGB')).astype(float)
    for (y0, y1, iid) in rows:
        for ck, (x0, x1) in XW.items():
            k = key(im[y0:y1, x0:x1], t0=30, t1=120, edge=5)
            if k is None: print('EMPTY', sh, iid, ck); continue
            # recentrado igual que extract2: ancho fijo alrededor del centro de la ventana
            w = x1 - x0; pad = np.zeros((k.shape[0], w, 4), np.uint8)
            Image.fromarray(k, 'RGBA').save(f'raw_{iid}_{ck}.png')
        k = key(im[y0 + 2:y1 - 2, 26:136], t0=30, t1=120, edge=5)
        Image.fromarray(k, 'RGBA').save(f'raw_{iid}_icon.png'); meta[iid] = sh
json.dump(meta, open('meta.json', 'w')); print('ok', len(meta))
