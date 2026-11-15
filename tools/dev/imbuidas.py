"""Auras de espada imbuida (v4.65) desde la imagen de Sergio (tools/dev/nihil_ref/espadas.png).

Uso: python3 tools/dev/imbuidas.py -> escribe src/6zz9b_imbue_data.js
Cuatro columnas: fuego, hielo, rayo, agua. Se queda solo con el efecto (saturado o muy claro), sin la hoja gris ni la
empuñadura, y se reduce a pixel art de 30 px de alto con 10 colores. Se dibuja encima del arma en la mano.
"""
import base64, io, json, os
import numpy as np
from PIL import Image

D = os.path.join(os.path.dirname(__file__), 'nihil_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
COLS = {'fire': (20, 305), 'ice': (330, 548), 'shock': (548, 835), 'wet': (865, 1060)}
H = 30


def main():
    a = np.array(Image.open(os.path.join(D, 'espadas.png')).convert('RGB')).astype(float)
    out, sizes = {}, {}
    for k, (x0, x1) in COLS.items():
        sub = a[20:785, x0:x1]
        mx, mn = sub.max(2), sub.min(2); sat = (mx - mn) / (mx + 1)
        al = (((sat > 0.32) & (mx > 90)) | (mx > 205)).astype(float)
        rgba = np.dstack([sub, al * 255]).astype(np.uint8)
        ys, xs = np.where(al > 0); rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        im = Image.fromarray(rgba, 'RGBA')
        w = max(6, round(im.width * H / im.height))
        # premultiplicado para que el fondo no ensucie el color al reducir
        arr = np.array(im).astype(float); arr[..., :3] *= arr[..., 3:] / 255
        sm = Image.fromarray(arr.astype(np.uint8), 'RGBA').resize((w, H), Image.BOX)
        s = np.array(sm).astype(float); A = s[..., 3:]
        s[..., :3] = np.where(A > 0, s[..., :3] * 255 / np.maximum(A, 1), 0)
        s[..., 3] = np.where(A[..., 0] > 70, 255, 0)
        q = Image.fromarray(s.clip(0, 255).astype(np.uint8)[..., :3]).quantize(10).convert('RGB')
        o = np.dstack([np.array(q), s[..., 3].astype(np.uint8)])
        bio = io.BytesIO(); Image.fromarray(o, 'RGBA').save(bio, 'PNG', optimize=True)
        out[k] = 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode(); sizes[k] = [w, H]
        Image.fromarray(o, 'RGBA').resize((w * 6, H * 6), Image.NEAREST).save('/tmp/imb_' + k + '.png')
    p = os.path.join(ROOT, 'src', '6zz9b_imbue_data.js')
    open(p, 'w').write('// Generado por tools/dev/imbuidas.py desde la imagen de Sergio (v4.65). No editar a mano.\nconst IMB_SIZE = ' + json.dumps(sizes) + ';\nconst IMB_IMG = ' + json.dumps(out) + ';\n')
    print('escrito', p, sizes)


if __name__ == '__main__':
    main()
