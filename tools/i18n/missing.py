# missing.py: lista los textos en español que aún no tienen traducción en en.json (para traducir lo nuevo de cada versión)
# uso: python3 tools/i18n/missing.py   → escribe /tmp/i18n_keys.json y /tmp/i18n_missing.txt ("índice<TAB>texto")
import json, os, glob, subprocess, tempfile
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(R, 'src', '*.js'))))
td = tempfile.mkdtemp(); a = os.path.join(td, 'g.js'); o = os.path.join(td, 'runs.json'); open(a, 'w', encoding='utf-8').write(js)
subprocess.run(['node', os.path.join(R, 'tools/i18n/tr.js'), 'extract', a, os.path.join(R, 'template.html'), o], check=True)
d = json.load(open(o, encoding='utf-8')); ks = list(d['js']) + [k for k in d['html'] if k not in d['js']]
D = json.load(open(os.path.join(R, 'tools/i18n/en.json'), encoding='utf-8')) if os.path.exists(os.path.join(R, 'tools/i18n/en.json')) else {}
json.dump(ks, open('/tmp/i18n_keys.json', 'w', encoding='utf-8'), ensure_ascii=False)
with open('/tmp/i18n_missing.txt', 'w', encoding='utf-8') as f:
    for i, k in enumerate(ks):
        if k not in D: f.write(f"{i}\t{k.replace(chr(10), '⏎')}\n")
print('keys', len(ks), 'missing', sum(1 for k in ks if k not in D), '(muchos son nombres propios o ids que no se traducen)')
