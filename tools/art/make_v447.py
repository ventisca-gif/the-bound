# v4.47: enemigos de mazmorra, jefes (Alfa Nocturno, Señor de las Tormentas) y góticos desde las referencias de Sergio.
# Uso: python3 tools/art/make_v447.py  -> escribe src/6zyzy0_art_v447.js
import sys, base64, io, os
sys.path.insert(0, os.path.dirname(__file__))
from sheet_extract import *
R = 'tools/art/ref/'
def b64(arr):
    bio = io.BytesIO(); Image.fromarray(arr, 'RGBA').save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()
out = {}
# --- 12 enemigos (solo frente) ---
a = load(R + 'enemigos_mazmorra_sergio.png')
MOBS = [('golem_rojo', (14, 117, 206, 281)), ('elemental_roca', (219, 112, 383, 279)), ('arana_portal', (385, 136, 573, 280)), ('lobo_nocturno', (594, 137, 731, 281)),
        ('cazador_corrupto', (746, 99, 902, 284)), ('lagarto_igneo', (922, 120, 1055, 279)), ('elemental_fuego', (29, 392, 144, 540)), ('elemental_hielo', (182, 399, 285, 539)),
        ('escarabajo_acero', (306, 403, 477, 550)), ('sapo_abisal', (499, 413, 662, 544)), ('espectro_portal', (695, 396, 795, 541)), ('golem_vacio', (827, 373, 1046, 556))]
cells = []
for k, box in MOBS:
    c, m = cut(a, box, tol=34)
    cells.append(shrink(c, m, 0.42, contrast=1.08, edge_dark=0.5))
out['MOB'] = (pack(cells, 96, 84), [k for k, _ in MOBS], 96, 84)
# --- jefes: 4 direcciones (abajo, izquierda, derecha, arriba) de las 5 vistas ---
b = load(R + 'jefes_alfa_tormentas_sergio.png')
for key, reg in (('ALFA', (430, 255, 1010, 430)), ('TORM', (430, 890, 1010, 1095))):
    v = find(b, reg, min_h=60, dil=3)
    sel = [v[0], v[2], v[4], v[3]]
    cells = []
    for box in sel:
        c, m = cut(b, box, tol=26)
        cells.append(shrink(c, m, 1.0, contrast=1.06, edge_dark=0.6))
    out[key] = (pack(cells, 124, 192), None, 124, 192)
# --- góticos: 5 personajes x 4 direcciones ---
g = load(R + 'goticas_sergio.png')
v1 = find(g, (20, 70, 1740, 325), min_h=120, dil=3); v2 = find(g, (20, 440, 1230, 728), min_h=120, dil=3)
chars = {'goth_morwenna': v1[0:5], 'goth_lilith': v1[5:10], 'goth_nyx': v1[10:14], 'goth_raven': v2[0:5], 'goth_dorian': v2[5:10]}
cells = []; names = []
for k, vs in chars.items():
    sel = [vs[0], vs[1], vs[3], vs[2]] if len(vs) == 4 else [vs[0], vs[2], vs[4], vs[3]]
    for box in sel:
        c, m = cut(g, box, tol=14)
        cells.append(shrink(c, m, 0.37, contrast=1.08, edge_dark=0.55))
    names.append(k)
out['GOTH'] = (pack(cells, 66, 108, cols=4), names, 66, 108)
with open('src/6zyzy0_art_v447.js', 'w') as f:
    f.write('// v4.47: sprites sacados de las referencias de Sergio (tools/art/make_v447.py; originales en tools/art/ref)\n')
    for k, (arr, names, cw, ch) in out.items():
        f.write(f"const ART47_{k} = {{ src: '{b64(arr)}', cw: {cw}, ch: {ch}" + (f", ids: {names!r}".replace("'", '"') if names else '') + " };\n")
        Image.fromarray(arr, 'RGBA').save(f'/tmp/art47_{k}.png')
print('ok', {k: v[0].shape for k, v in out.items()})
