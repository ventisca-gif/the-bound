# Rebuilds the The Bound project from the files of the backup artifact.
# usage: python3 restore.py <folder_with_downloaded_files> <project_dir>
import sys, os, json, base64, shutil
src, dst = sys.argv[1], sys.argv[2]
man = json.load(open(os.path.join(src, 'manifest.json')))
for pub, rel in man.items():
    p = os.path.join(src, pub)
    if not os.path.exists(p): print('missing', pub); continue
    if rel.endswith('#base64'):
        rel = rel[:-7]; os.makedirs(os.path.dirname(os.path.join(dst, rel)), exist_ok=True)
        open(os.path.join(dst, rel), 'wb').write(base64.b64decode(open(p).read())); continue
    os.makedirs(os.path.dirname(os.path.join(dst, rel)) or dst, exist_ok=True); shutil.copy(p, os.path.join(dst, rel))
os.makedirs(os.path.join(dst, 'dist'), exist_ok=True); print('restored', len(man), 'files into', dst)
