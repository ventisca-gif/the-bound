"""Builds dist/TheBound.apk: hand-made manifest/dex/arsc + the game page as an asset, signed with jarsigner (v1)."""
import os, sys, subprocess, zipfile, struct, zlib, io
sys.path.insert(0, os.path.dirname(__file__))
import mkdex, mkres

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TOOLS = os.path.dirname(os.path.abspath(__file__))
PKG = 'com.thebound.game'
KS = os.environ.get('THEBOUND_KEYSTORE', os.path.join(TOOLS, 'thebound.jks'))
ALIAS = 'thebound'
# versión del APK = versión del juego (GAME_BUILD/GAME_VER en src/6zv_update.js)
def _game_version():
    import re
    src = open(os.path.join(ROOT, 'src', '6zv_update.js'), encoding='utf-8').read()
    return int(re.search(r"GAME_BUILD\s*=\s*(\d+)", src).group(1)), re.search(r"GAME_VER\s*=\s*'([^']+)'", src).group(1)
VERSION = _game_version()


def aligned_zip(entries, out):
    """entries: list of (name, bytes, stored). Writes a zip whose stored entries start on 4-byte boundaries."""
    buf = io.BytesIO()
    cd = []
    for (name, data, stored) in entries:
        nb = name.encode()
        crc = zlib.crc32(data) & 0xffffffff
        if stored:
            comp, method = data, 0
        else:
            co = zlib.compressobj(9, zlib.DEFLATED, -15)
            comp, method = co.compress(data) + co.flush(), 8
        off = buf.tell()
        extra = b''
        if stored:
            pad = (-(off + 30 + len(nb))) % 4
            if pad:
                L = pad
                while L < 6:
                    L += 4
                extra = struct.pack('<HHH', 0xD935, L - 4, 4) + b'\0' * (L - 6)
        hdr = struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0x0800, method, 0, 0x21, crc, len(comp), len(data), len(nb), len(extra))
        buf.write(hdr + nb + extra + comp)
        if stored:
            assert (off + 30 + len(nb) + len(extra)) % 4 == 0, name
        cd.append((nb, method, crc, len(comp), len(data), off))
    cdo = buf.tell()
    for (nb, method, crc, cs, us, off) in cd:
        buf.write(struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0x0800, method, 0, 0x21, crc, cs, us, len(nb), 0, 0, 0, 0, 0, off) + nb)
    cde = buf.tell()
    buf.write(struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, len(cd), len(cd), cde - cdo, cdo, 0))
    open(out, 'wb').write(buf.getvalue())


def main():
    html = open(os.path.join(ROOT, 'dist', 'test.html'), 'rb').read().replace(b'initial-scale=1,viewport-fit=cover', b'initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover', 1)
    assert b'user-scalable=no' in html
    icon = open(os.path.join(TOOLS, 'icon.png'), 'rb').read()
    dex = mkdex.build()
    man = mkres.manifest(PKG, 'The Bound', VERSION[0], VERSION[1], 21, 29, PKG + '.MainActivity', 0xfb0)
    res = mkres.arsc(PKG, 'res/drawable/icon.png')
    os.makedirs(os.path.join(ROOT, 'dist', 'apk'), exist_ok=True)
    for n, d in (('AndroidManifest.xml', man), ('classes.dex', dex), ('resources.arsc', res)):
        open(os.path.join(ROOT, 'dist', 'apk', n), 'wb').write(d)
    unsigned = os.path.join(ROOT, 'dist', 'apk', 'unsigned.apk')
    signed = os.path.join(ROOT, 'dist', 'apk', 'signed.apk')
    final = os.path.join(ROOT, 'dist', 'TheBound.apk')
    aligned_zip([('AndroidManifest.xml', man, False), ('classes.dex', dex, False), ('resources.arsc', res, True),
                 ('res/drawable/icon.png', icon, True), ('assets/index.html', html, False)], unsigned)
    if not os.path.isfile(KS) or not os.environ.get('THEBOUND_SIGNING_PASSWORD'):
        raise SystemExit('Configura THEBOUND_KEYSTORE y THEBOUND_SIGNING_PASSWORD con la clave existente.')
    subprocess.run(['jarsigner', '-keystore', KS, '-storepass:env', 'THEBOUND_SIGNING_PASSWORD',
                    '-keypass:env', 'THEBOUND_SIGNING_PASSWORD', '-sigalg', 'SHA256withRSA',
                    '-digestalg', 'SHA-256', '-signedjar', signed, unsigned, ALIAS], check=True)
    # re-pack with alignment (v1 signatures cover entry contents, not the zip layout)
    z = zipfile.ZipFile(signed)
    names = z.namelist()
    meta = [n for n in names if n.startswith('META-INF/')]
    rest = [n for n in names if not n.startswith('META-INF/')]
    stored = {'resources.arsc', 'res/drawable/icon.png'}
    meta.sort(key=lambda n: (n != 'META-INF/MANIFEST.MF', n))
    aligned_zip([(n, z.read(n), n in stored) for n in meta + rest], final)
    v = subprocess.run(['jarsigner', '-verify', final], capture_output=True, text=True)
    print(v.stdout.strip().splitlines()[-1] if v.stdout else v.stderr)
    print('apk', final, os.path.getsize(final))


if __name__ == '__main__':
    main()
