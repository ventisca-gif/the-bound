# Rebuilds the staging folder of the private backup artifact from the project.
# usage: python3 tools/dev/backup.py <staging_dir> <version>
# then publish <staging_dir>/index.html to the backup artifact URL with files = <staging_dir>/files.json map (root = staging_dir)
import sys, os, glob, json, base64, shutil, html
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out, ver = sys.argv[1], sys.argv[2]
shutil.rmtree(os.path.join(out, 'f'), ignore_errors=True); os.makedirs(os.path.join(out, 'f'))
rels = sorted(set(
    [os.path.relpath(p, ROOT) for pat in ('src/*.js', 'tools/apk/*.py', 'tools/apk/icon.png', 'tools/dev/*', 'tests/*.py', 'tests/*.txt', 'assets/ui_land.b64', 'tools/i18n/*.js', 'tools/i18n/*.py', 'tools/i18n/*.json') for p in glob.glob(os.path.join(ROOT, pat))]
    + ['template.html', 'build.py']))
man = {}
for rel in rels:
    name = rel.replace('/', '__')
    if rel == 'tools/dev/restore.py': name = 'restore.py'
    if not name.endswith(('.js', '.png', '.txt')): name += '.txt'
    shutil.copy(os.path.join(ROOT, rel), os.path.join(out, 'f', name)); man['f/' + name] = rel
open(os.path.join(out, 'f', 'thebound.jks.b64.txt'), 'w').write(base64.b64encode(open(os.path.join(ROOT, 'tools/apk/thebound.jks'), 'rb').read()).decode())
man['f/thebound.jks.b64.txt'] = 'tools/apk/thebound.jks#base64'
json.dump(man, open(os.path.join(out, 'manifest.json'), 'w'), indent=0)
files = {k: k for k in man}; files['manifest.json'] = 'manifest.json'
json.dump(files, open(os.path.join(out, 'files.json'), 'w'))
lis = ''.join(f'<li><code>{html.escape(r)}</code></li>' for r in sorted(man.values()))
page = open(os.path.join(out, 'index.html'), encoding='utf-8').read()
import re
page = re.sub(r'\(versión [^)]*\): los \d+ archivos', f'(versión {ver}): los {len(man)} archivos', page)
page = re.sub(r'<ul>.*</ul>', '<ul>' + lis + '</ul>', page, flags=re.S)
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(page)
print('staged', len(man), 'files, version', ver)
