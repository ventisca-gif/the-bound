#!/bin/sh
# Regenera src/6zyzx0_art_hd.js desde las referencias de Sergio (tools/art/ref).
set -e; T=$(mktemp -d)
python3 tools/art/hunters_extract.py tools/art/ref/cazadores_sergio.png $T/front.png
python3 tools/art/hunters_views.py $T/front.png $T/hn_sheet.png
python3 tools/art/titan_extract.py tools/art/ref/titan_sergio.png $T/titan.png 260
python3 - "$T" <<'PY'
import base64, sys
T = sys.argv[1]
b = lambda p: 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
open('src/6zyzx0_art_hd.js', 'w').write('// v4.46: sprites HD sacados de las referencias de Sergio (tools/art/make_hd.sh; originales en tools/art/ref)\n'
  "const HN_ART_SRC = '" + b(T + '/hn_sheet.png') + "';\nconst TITAN_ART_SRC = '" + b(T + '/titan.png') + "';\n")
PY
echo ok
