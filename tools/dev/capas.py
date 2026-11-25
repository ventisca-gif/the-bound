"""Capas apiladas (6.12): cuenta cuántas veces se envuelve cada función global (`nombre = function`) y cuántos
ganchos tiene (`hookBefore/After/Around('nombre', ...)`, src/00h_hooks.js).

Uso:  python3 tools/dev/capas.py            → informe y aviso si alguna función tiene MÁS envolturas que la referencia
      python3 tools/dev/capas.py --guardar  → guarda las cifras actuales como referencia (tools/dev/capas_ref.json)

Regla desde la 6.12: lo nuevo usa ganchos. Una envoltura nueva de una función que ya está en la referencia es un aviso.
"""
import glob, json, os, re, sys
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
REF = os.path.join(os.path.dirname(__file__), 'capas_ref.json')
wrap, hooks = {}, {}
for f in sorted(glob.glob(os.path.join(ROOT, 'src', '*.js'))):
    s = open(f, encoding='utf-8').read()
    if re.search(r'^[A-Za-z0-9+/=]{500}', s, re.M) or f.endswith('00h_hooks.js'): continue  # datos (imágenes, sonidos) y la propia definición
    for m in re.finditer(r'(?<![.\w])([A-Za-z_]\w*) = function\b', s): wrap[m.group(1)] = wrap.get(m.group(1), 0) + 1
    for m in re.finditer(r"hook(?:Before|After|Around)\('(\w+)'", s): hooks[m.group(1)] = hooks.get(m.group(1), 0) + 1
if '--guardar' in sys.argv:
    json.dump(wrap, open(REF, 'w'), indent=0, sort_keys=True); print('referencia guardada:', len(wrap), 'funciones'); sys.exit(0)
ref = json.load(open(REF)) if os.path.exists(REF) else {}
print('Más envueltas:', ', '.join('%s %d' % kv for kv in sorted(wrap.items(), key=lambda kv: -kv[1])[:12]))
print('Ganchos (una sola capa por función):', ', '.join('%s %d' % kv for kv in sorted(hooks.items())) or 'ninguno')
grew = [(k, ref.get(k, 0), v) for k, v in wrap.items() if k in ref and v > ref[k]]
if grew:
    print('AVISO: envolturas nuevas (usa hookBefore/hookAfter/hookAround de src/00h_hooks.js):')
    for k, a, b in grew: print('  %s: %d → %d' % (k, a, b))
else: print('Capas: 0 envolturas nuevas sobre la referencia.')
