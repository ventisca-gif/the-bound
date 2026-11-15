"""Lienya, la Diosa sin Pintar (v4.75): forma verdadera y efectos de sus ataques desde la hoja de Sergio.

Uso:  python3 tools/dev/diosa.py [--debug]   -> escribe src/6zz9s_diosa_data.js

Entrada: tools/dev/lienzo_ref/diosa_hoja.png (lienzo_ref/diosa.png es la referencia grande de su forma).
- Sprites de movimiento: 4 direcciones (frente, derecha, espalda, izquierda) x 2 poses. Atlas con el formato de los
  monstruos: 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1) x 4 filas (abajo, izquierda, derecha, arriba).
- Efectos de ataque (solo el efecto, sin la diosa): Ráfaga del Vacío (2), Círculo de Olvido (3), Tentáculos Incoloros (3),
  Lluvia Sin Color (4) y Desvanecer (3). Una fila por ataque, alineados abajo.
Usa cut/shrink de tools/dev/lienzo.py (la hoja no tiene cuadrícula de píxel uniforme).
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
import lienzo as LZ

ROOT = LZ.ROOT
H_BOSS = 92
DIRS = {  # (pose 1, pose 2)
    'down': ((458, 193, 548, 332), (458, 333, 548, 476)), 'right': ((578, 193, 668, 332), (578, 333, 668, 476)),
    'up': ((698, 193, 788, 332), (698, 333, 788, 476)), 'left': ((828, 193, 914, 332), (828, 333, 914, 476)),
}
FX = [  # (nombre, alto en el juego, cajas)
    ('rafaga', 26, [(827, 625, 937, 702), (958, 618, 1152, 708)]),
    ('circulo', 40, [(658, 728, 755, 840), (771, 728, 895, 840), (911, 728, 1150, 840)]),
    ('tentaculos', 44, [(725, 856, 829, 966), (845, 856, 969, 966), (991, 856, 1150, 966)]),
    ('lluvia', 46, [(618, 984, 709, 1100), (725, 984, 829, 1100), (845, 984, 969, 1100), (991, 984, 1150, 1100)]),
    ('desvanecer', 52, [(691, 1115, 802, 1260), (818, 1115, 962, 1260), (965, 1115, 1150, 1260)]),
]


def b64(im):
    bio = io.BytesIO(); im.save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()


def main():
    dbg = '--debug' in sys.argv
    poses = {d: [LZ.shrink(LZ.cut('diosa_hoja', b, []), H_BOSS) for b in bx] for d, bx in DIRS.items()}
    fw = max(im.width for v in poses.values() for im in v) + 10; fh = H_BOSS + 10
    S = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    seq = [0, 1, 0, 1, 0, 1, 0, 1, 1, 0]                 # reposo 2, caminata 4, ataque 3, golpe 1
    bobs = [0, -1, -1, -2, -1, 0, 1, 2, 1, 0]
    for row, d in enumerate(['down', 'left', 'right', 'up']):
        for col in range(10):
            im = poses[d][seq[col]]
            if col in (6, 7, 8):
                sc = 1 + 0.04 * (col - 5); im = im.resize((int(im.width * sc), int(im.height * sc)), Image.NEAREST)
            if col == 9:
                a = np.array(im).astype(float); a[..., :3] = a[..., :3] * 0.6 + 100; im = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
            x = col * fw + (fw - im.width) // 2; y = row * fh + (fh - 4) - im.height + bobs[col]
            S.alpha_composite(im, (x, max(row * fh, y)))
    fx_rows = [[LZ.shrink(LZ.cut('diosa_hoja', b, []), h) for b in bx] for (_, h, bx) in FX]
    cw = max(im.width for r in fx_rows for im in r) + 2; ch = max(im.height for r in fx_rows for im in r) + 2
    F = Image.new('RGBA', (cw * 4, ch * len(FX)), (0, 0, 0, 0))
    for r, row in enumerate(fx_rows):
        for c, im in enumerate(row): F.alpha_composite(im, (c * cw + (cw - im.width) // 2, r * ch + (ch - im.height)))
    if dbg:
        S.save('/tmp/diosa_sheet.png'); F.save('/tmp/diosa_fx.png')
    p = os.path.join(ROOT, 'src', '6zz9s_diosa_data.js')
    open(p, 'w').write('// Generado por tools/dev/diosa.py desde la hoja de Sergio (v4.75). No editar a mano.\n'
                       'const LNY_SIZE = ' + json.dumps([fw, fh]) + ';\nconst LNY_SHEET = ' + json.dumps(b64(S)) + ';\n'
                       'const LNY_FXSIZE = ' + json.dumps([cw, ch]) + ';\nconst LNY_FXN = ' + json.dumps([f[0] for f in FX]) + ';\nconst LNY_FXC = ' + json.dumps([len(f[2]) for f in FX]) + ';\nconst LNY_FX = ' + json.dumps(b64(F)) + ';\n')
    print('escrito', p, os.path.getsize(p), 'frame', [fw, fh], 'fx', [cw, ch])


if __name__ == '__main__':
    main()
