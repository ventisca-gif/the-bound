"""Enemigos y jefes de los portales 400-600 (v6.03) desde el bestiario de Sergio (tools/dev/portales_ref/bestiario.png).

Uso:  python3 tools/dev/portales.py [--debug]   -> escribe src/6zzzzr_v603_portales_data.js

La hoja tiene 17 filas (12 enemigos y 5 jefes, en el orden de DG2_MOBS y DG2_BOSS) x 7 vistas, el mismo orden que la hoja
que le mandó el juego: frente, perfil izquierdo, perfil derecho, espalda, frente andando, frente atacando y ataque especial.
Cada vista se recorta (fondo quitado por relleno desde el borde, como tools/dev/tejidas.py), se reduce al tamaño del juego
y se monta el atlas de monstruo de 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1) x 4 filas (abajo, izquierda,
derecha, arriba).
"""
import base64, io, json, os, sys, importlib.util
import numpy as np
from PIL import Image

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
spec = importlib.util.spec_from_file_location('tejidas', os.path.join(HERE, 'tejidas.py')); TJ = importlib.util.module_from_spec(spec); spec.loader.exec_module(TJ)
DBG = '--debug' in sys.argv
OUTD = '/tmp/portales_dbg'

# bordes de las 17 filas en la hoja (y) y zona de los dibujos (x)
ROWY = [69, 150, 230, 313, 388, 465, 541, 622, 698, 784, 861, 941, 1021, 1111, 1193, 1280, 1394, 1505]
X0, X1, NCOL = 225, 925, 7
# clave del juego y alto (vista de frente) en píxeles del juego
ROWS = [('centinela_obsidiana', 32), ('espadachin_portal', 30), ('arana_cristal_negro', 24), ('lagarto_cristal', 24), ('espectro_hundido', 28),
        ('sapo_hundido', 22), ('cangrejo_hundido', 22), ('escarabajo_forja', 24), ('golem_forja', 34), ('cazador_sombra', 30), ('arpia_trono', 30),
        ('guardian_trono', 36), ('castellano_obsidiana', 62), ('reina_cristal', 52), ('leviatan_hundido', 54), ('dios_forja', 70), ('ultimo_portador', 60)]


def cells(r):
    y0, y1 = ROWY[r] + 3, ROWY[r + 1] - 3; w = (X1 - X0) / NCOL
    return [(int(X0 + i * w) + 2, y0, int(X0 + (i + 1) * w) - 2, y1) for i in range(NCOL)]


def sheet(views):
    # views: frente, perfil izq., perfil der., espalda, frente andando, frente atacando, ataque especial (PIL RGBA)
    fr, lf, rt, up, wk, at, at2 = views
    fw = max(v.width for v in views) + 8; fh = max(v.height for v in views) + 8
    S = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    seq = {'down': [fr, fr, fr, wk, fr, wk, fr, at, at2, fr], 'left': [lf] * 10, 'right': [rt] * 10, 'up': [up] * 10}
    bobs = [0, 1, 0, -1, 0, -1, 0, -1, 0, 0]; lean = [0, 0, 0, 1, 0, 1, 0, 2, 3, 0]
    for row, dirn in enumerate(['down', 'left', 'right', 'up']):
        for col in range(10):
            im = seq[dirn][col]
            if col == 9: im = Image.fromarray((np.array(im).astype(float) * [0.6, 0.6, 0.6, 1] + [110, 100, 100, 0]).clip(0, 255).astype(np.uint8), 'RGBA')
            if dirn == 'up' and col in (3, 5): im = im.transpose(Image.FLIP_LEFT_RIGHT)   # paso alterno de espaldas
            dx = 0 if dirn in ('down', 'up') else (-lean[col] if dirn == 'left' else lean[col])
            dy = bobs[col] + (-lean[col] if dirn in ('down', 'up') and col in (7, 8) else 0)
            x = col * fw + (fw - im.width) // 2 + dx; y = row * fh + (fh - 3) - im.height + dy
            S.alpha_composite(im, (max(col * fw, x), max(row * fh, y)))
    return S, [fw, fh]


def main():
    os.makedirs(OUTD, exist_ok=True)
    a = np.array(Image.open(os.path.join(HERE, 'portales_ref', 'bestiario.png')).convert('RGB')).astype(float)
    out, sizes = {}, {}
    for r, (k, H) in enumerate(ROWS):
        raw = [TJ.cut(a, b, 30, True) for b in cells(r)]; f = H / raw[0].shape[0]   # True: solo la pieza principal y lo pegado (fuera restos de la columna vecina)
        views = [TJ.shrink(v, f, 28) for v in raw]
        S, sz = sheet(views); out[k] = TJ.b64(S); sizes[k] = sz
        if DBG: S.resize((S.width * 3, S.height * 3), Image.NEAREST).save(os.path.join(OUTD, k + '.png')); print(k, sz, [v.size for v in views])
    p = os.path.join(ROOT, 'src', '6zzzzr_v603_portales_data.js')
    open(p, 'w').write('// Generado por tools/dev/portales.py desde el bestiario de Sergio (v6.03). No editar a mano.\nconst PORT_SIZE = ' + json.dumps(sizes) + ';\nconst PORT_SHEET = ' + json.dumps(out) + ';\n')
    print('escrito', p, os.path.getsize(p))


if __name__ == '__main__':
    main()
