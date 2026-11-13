"""Revisor automático de ajuste de prendas (v4.5).

Prueba cada cosmético y cada armadura de clase (tiers 1-21) en las 8 estructuras de cuerpo, en las 4 direcciones
y en la caminata, y avisa si algo tapa los ojos, se sale del cuadro, flota, deja piel al aire, no escala con la
cabeza o cambia de golpe entre fotogramas.

Uso:  python3 tools/dev/fitcheck.py file://$PWD/dist/test.html out_dir [filtro] [--strict]
  filtro   solo las prendas cuyo id contenga ese texto (p. ej. c_corona o guerrero:head)
  --strict sale con código 1 si hay avisos (para usarlo en la regresión)

Escribe out_dir/fit_report.json, out_dir/fit_report.txt y out_dir/fit_<id>.png con la prenda en la estructura
clásica y en las estructuras con aviso (frente, lado y espalda).
"""
import json, os, sys
from collections import defaultdict
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
url, out = args[0], args[1]
only = args[2] if len(args) > 2 else ''
strict = '--strict' in sys.argv
os.makedirs(out, exist_ok=True)

SHEET = r"""(([it, bodies]) => { const S = 4, CW = 40, CH = 44, X0 = 4, Y0 = 2, dirs = ['down', 'left', 'up'];
const c = document.createElement('canvas'); c.id = 'fitsheet'; c.width = 150 + dirs.length * CW * S; c.height = bodies.length * (CH * S + 4) + 6; const x = c.getContext('2d');
x.fillStyle = '#4a7a3a'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false; x.font = 'bold 14px sans-serif';
const item = fitItems().find(o => o.id === it);
bodies.forEach(([g, bt], r) => { const L = fitLook(item, g, bt, true); x.fillStyle = '#fff'; x.fillText((g === 'm' ? 'H' : 'M') + bt + ' ' + bodyName(g, bt), 6, r * (CH * S + 4) + CH * S / 2);
  dirs.forEach((d, k) => { const p = fitDraw(L, d, 'idle', 0); p.outline(OUTL, false); const cv = p.canvas(); x.drawImage(cv, X0, Y0, CW, CH, 150 + k * CW * S, r * (CH * S + 4) + 4, CW * S, CH * S); }); });
document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(c); return 1; })"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1400, 'height': 1000})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(3000)
    res = pg.evaluate('(o => fitCheck(o))(%s)' % json.dumps(only))
    issues = res['issues']
    by = defaultdict(list)
    for i in issues: by[i['id']].append(i)
    new = [i for i in issues if not i['base']]
    by = defaultdict(list)
    for i in new: by[i['id']].append(i)
    baseids = sorted({i['id'] for i in issues if i['base']})
    lines = ['Revisión de ajuste: %d prendas, %d dibujos.' % (res['stats']['items'], res['stats']['draws']),
             'Avisos solo en estructuras nuevas: %d en %d prendas.' % (len(new), len(by)),
             'Avisos que también tiene la estructura clásica (diseño de la prenda): %d en %d prendas%s' % (len(issues) - len(new), len(baseids), (': ' + ', '.join(baseids[:30])) if baseids else '.')]
    for iid, lst in sorted(by.items()):
        kinds = defaultdict(set)
        for i in lst: kinds[i['issue']].add(i['tag'].split(' · ')[0] + ' ' + i['dir'])
        lines.append('- %s' % iid)
        for k, where in kinds.items(): lines.append('    %s: %s' % (k, ', '.join(sorted(where))[:300]))
    open(os.path.join(out, 'fit_report.json'), 'w').write(json.dumps(res, ensure_ascii=False, indent=1))
    open(os.path.join(out, 'fit_report.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines[:80]))
    for iid, lst in list(sorted(by.items()))[:40]:
        bodies = sorted({tuple(i['body']) for i in lst})
        g0 = bodies[0][0]
        rows = [[g0, 0]] + [list(t) for t in bodies if t[1] != 0]
        pg.evaluate('(a => (' + SHEET + ')(a))(%s)' % json.dumps([iid, rows]))
        pg.locator('#fitsheet').screenshot(path=os.path.join(out, 'fit_%s.png' % iid.replace(':', '_')))
    if errs: print('ERRORES DE PÁGINA:', errs[:5])
    b.close()
sys.exit(1 if strict and (new or errs) else 0)
