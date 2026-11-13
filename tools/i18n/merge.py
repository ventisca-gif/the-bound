# merge.py: une las traducciones "índice<TAB>inglés" (tsv/*.tsv) con la lista de claves extraída (keys.json) en en.json
# uso: python3 tools/i18n/merge.py <keys.json> [--fresh]
#   keys.json = lista de textos en español en el orden de tr.js extract (ver missing.py). Las claves que ya están en en.json se conservan.
import json, glob, os, sys
H = os.path.dirname(os.path.abspath(__file__)); EN = os.path.join(H, 'en.json')
keys = json.load(open(sys.argv[1], encoding='utf-8'))
D = {} if '--fresh' in sys.argv or not os.path.exists(EN) else json.load(open(EN, encoding='utf-8'))
n = 0
for f in sorted(glob.glob(os.path.join(H, 'tsv', '*.tsv'))):
    for line in open(f, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip(): continue
        i, en = line.split('\t', 1); k = keys[int(i)].replace('⏎', '\n'); en = en.replace('⏎', '\n')
        # las variables {n} tienen que coincidir
        import re
        if sorted(re.findall(r'\{\d+\}', k)) != sorted(re.findall(r'\{\d+\}', en)): print('PLACEHOLDER MISMATCH', i, repr(k), repr(en)); continue
        D[k] = en; n += 1
json.dump(D, open(EN, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
print('entries', len(D), 'from tsv', n)
