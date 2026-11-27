"""Reuse successful regression only when all regression inputs are identical.
Only release version, changelog and footer text are normalized; updater tests always rerun.
"""
import re, subprocess, sys
base=sys.argv[1]
paths=['src','template.html','assets','vendor','tools','tests']
changed=subprocess.check_output(['git','diff','--name-only',base,'HEAD','--',*paths],text=True).splitlines()
allowed={'src/6zv_update.js','template.html','tests/upd.py','tools/dev/reverse_inputs.py'}
if set(changed)-allowed: raise SystemExit(1)
def old(path): return subprocess.check_output(['git','show',base+':'+path],text=True)
def normalize(path,s):
    if path=='src/6zv_update.js':
        s=re.sub(r"const GAME_VER = '[^']+', GAME_BUILD = \d+;",'RELEASE_VERSION',s,count=1)
        s=re.sub(r'/\*CL\*/.*?/\*CL_END\*/','RELEASE_CHANGELOG',s,count=1,flags=re.S)
    else:
        s=re.sub(r'(<div class="tfoot">).*?(</div>)',r'\1RELEASE_FOOTER\2',s,count=1,flags=re.S)
    return s
for path in ['src/6zv_update.js','template.html']:
    if normalize(path,old(path))!=normalize(path,open(path).read()):raise SystemExit(1)
print('Regression inputs match validated 04f6693; only release metadata/updater harness differ.')
