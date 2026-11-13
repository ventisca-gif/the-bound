"""Hand-assembled classes.dex (format 035) for The Bound's Android shell.

com.thebound.game.MainActivity extends android.app.Activity:
  onCreate: fullscreen + keep screen on, WebView (JS, DOM storage, autoplay audio) loading file:///android_asset/index.html
  onWindowFocusChanged: sticky immersive mode
  onBackPressed: forwards to window.onAndroidBack() in the page (never quits by accident)
  onPause/onResume: pause/resume the WebView (the page saves and mutes itself)
"""
import struct, hashlib, zlib

CLS = 'Lcom/thebound/game/MainActivity;'
ACT = 'Landroid/app/Activity;'
WV = 'Landroid/webkit/WebView;'
WS = 'Landroid/webkit/WebSettings;'
WVC = 'Landroid/webkit/WebViewClient;'
WIN = 'Landroid/view/Window;'
VIEW = 'Landroid/view/View;'
BUNDLE = 'Landroid/os/Bundle;'
CTX = 'Landroid/content/Context;'
STR = 'Ljava/lang/String;'
VCB = 'Landroid/webkit/ValueCallback;'
URL = 'file:///android_asset/index.html'
JS_BACK = 'window.onAndroidBack&&window.onAndroidBack()'

# (class, name, return, params)
METHODS = [
    (ACT, '<init>', 'V', []), (ACT, 'onCreate', 'V', [BUNDLE]), (ACT, 'requestWindowFeature', 'Z', ['I']),
    (ACT, 'getWindow', WIN, []), (ACT, 'setContentView', 'V', [VIEW]), (ACT, 'onWindowFocusChanged', 'V', ['Z']),
    (ACT, 'onPause', 'V', []), (ACT, 'onResume', 'V', []),
    (WIN, 'addFlags', 'V', ['I']), (WIN, 'getDecorView', VIEW, []), (VIEW, 'setSystemUiVisibility', 'V', ['I']),
    (WV, '<init>', 'V', [CTX]), (WV, 'getSettings', WS, []), (WV, 'loadUrl', 'V', [STR]),
    (WV, 'evaluateJavascript', 'V', [STR, VCB]), (WV, 'onPause', 'V', []), (WV, 'onResume', 'V', []),
    (WV, 'setBackgroundColor', 'V', ['I']), (WV, 'setWebViewClient', 'V', [WVC]),
    (WVC, '<init>', 'V', []),
    (WS, 'setJavaScriptEnabled', 'V', ['Z']), (WS, 'setDomStorageEnabled', 'V', ['Z']), (WS, 'setDatabaseEnabled', 'V', ['Z']),
    (WS, 'setAllowFileAccess', 'V', ['Z']), (WS, 'setMediaPlaybackRequiresUserGesture', 'V', ['Z']), (WS, 'setTextZoom', 'V', ['I']),
    (CLS, '<init>', 'V', []), (CLS, 'onCreate', 'V', [BUNDLE]), (CLS, 'onWindowFocusChanged', 'V', ['Z']),
    (CLS, 'onBackPressed', 'V', []), (CLS, 'onPause', 'V', []), (CLS, 'onResume', 'V', []),
]
FIELDS = [(CLS, 'w', WV)]


def shorty(t):
    return 'L' if t[0] in 'L[' else t


def uleb(n):
    out = bytearray()
    while True:
        b = n & 0x7f
        n >>= 7
        if n:
            out.append(b | 0x80)
        else:
            out.append(b)
            return bytes(out)


def mutf8(s):
    out = bytearray()
    for ch in s:
        c = ord(ch)
        if c == 0:
            out += b'\xc0\x80'
        elif c < 0x80:
            out.append(c)
        elif c < 0x800:
            out += bytes([0xc0 | (c >> 6), 0x80 | (c & 0x3f)])
        else:
            out += bytes([0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)])
    return bytes(out)


def build():
    protos = sorted({(r, tuple(p)) for (_, _, r, p) in METHODS})
    types = set([CLS, ACT, WV, WS, WVC, WIN, VIEW, BUNDLE, CTX, STR, VCB, 'V', 'Z', 'I'])
    for (c, n, r, p) in METHODS:
        types.add(c); types.add(r); types.update(p)
    strings = set(types) | {URL, JS_BACK, 'w'}
    for (c, n, r, p) in METHODS:
        strings.add(n)
    for (r, p) in protos:
        strings.add(shorty(r) + ''.join(shorty(x) for x in p))
    strings = sorted(strings, key=lambda s: [ord(c) for c in s])  # ASCII only: code point order == UTF-16 order
    S = {s: i for i, s in enumerate(strings)}
    types = sorted(types, key=lambda t: S[t])
    T = {t: i for i, t in enumerate(types)}
    # protos sorted by return type idx then param type idx lists
    protos = sorted(protos, key=lambda pr: (T[pr[0]], [T[x] for x in pr[1]]))
    PR = {pr: i for i, pr in enumerate(protos)}
    fields = sorted(FIELDS, key=lambda f: (T[f[0]], S[f[1]], T[f[2]]))
    F = {f: i for i, f in enumerate(fields)}
    meths = sorted(METHODS, key=lambda m: (T[m[0]], S[m[1]], PR[(m[2], tuple(m[3]))]))
    M = {(m[0], m[1], m[2], tuple(m[3])): i for i, m in enumerate(meths)}

    def mi(c, n, r, p=()):
        return M[(c, n, r, tuple(p))]

    fw = F[(CLS, 'w', WV)]

    # ---------- bytecode ----------
    def inv(op, idx, regs):
        a = len(regs)
        rr = list(regs) + [0] * (5 - a)
        return [(a << 12) | (rr[4] << 8) | op, idx, (rr[3] << 12) | (rr[2] << 8) | (rr[1] << 4) | rr[0]]
    IV, IS, ID = 0x6e, 0x6f, 0x70

    def const4(a, v): return [((v & 0xf) << 12) | (a << 8) | 0x12]
    def const16(a, v): return [(a << 8) | 0x13, v & 0xffff]
    def high16(a, v): return [(a << 8) | 0x15, v & 0xffff]
    def mro(a): return [(a << 8) | 0x0c]
    def newi(a, t): return [(a << 8) | 0x22, T[t]]
    def iput_o(a, b, f): return [(b << 12) | (a << 8) | 0x5b, f]
    def iget_o(a, b, f): return [(b << 12) | (a << 8) | 0x54, f]
    def cstr(a, s): return [(a << 8) | 0x1a, S[s]]
    def ifeqz(a, off): return [(a << 8) | 0x38, off & 0xffff]
    RET = [0x000e]

    codes = {}
    # <init>: regs p0=v0
    codes[(CLS, '<init>')] = (1, 1, 1, inv(ID, mi(ACT, '<init>', 'V'), [0]) + RET)
    # onCreate(Bundle): v0 v1 v2 | p0=v3 p1=v4
    p0, p1 = 3, 4
    c = []
    c += inv(IS, mi(ACT, 'onCreate', 'V', [BUNDLE]), [p0, p1])
    c += const4(0, 1) + inv(IV, mi(ACT, 'requestWindowFeature', 'Z', ['I']), [p0, 0])
    c += inv(IV, mi(ACT, 'getWindow', WIN), [p0]) + mro(0)
    c += const16(1, 0x480) + inv(IV, mi(WIN, 'addFlags', 'V', ['I']), [0, 1])
    c += newi(0, WV) + inv(ID, mi(WV, '<init>', 'V', [CTX]), [0, p0]) + iput_o(0, p0, fw)
    c += high16(1, 0xff00) + inv(IV, mi(WV, 'setBackgroundColor', 'V', ['I']), [0, 1])
    c += newi(1, WVC) + inv(ID, mi(WVC, '<init>', 'V'), [1]) + inv(IV, mi(WV, 'setWebViewClient', 'V', [WVC]), [0, 1])
    c += inv(IV, mi(WV, 'getSettings', WS), [0]) + mro(1)
    c += const4(2, 1)
    for n in ('setJavaScriptEnabled', 'setDomStorageEnabled', 'setDatabaseEnabled', 'setAllowFileAccess'):
        c += inv(IV, mi(WS, n, 'V', ['Z']), [1, 2])
    c += const4(2, 0) + inv(IV, mi(WS, 'setMediaPlaybackRequiresUserGesture', 'V', ['Z']), [1, 2])
    c += const16(2, 100) + inv(IV, mi(WS, 'setTextZoom', 'V', ['I']), [1, 2])
    c += inv(IV, mi(ACT, 'setContentView', 'V', [VIEW]), [p0, 0])
    c += cstr(1, URL) + inv(IV, mi(WV, 'loadUrl', 'V', [STR]), [0, 1])
    c += RET
    codes[(CLS, 'onCreate')] = (5, 2, 2, c)
    # onWindowFocusChanged(Z): v0 v1 | p0=v2 p1=v3
    p0, p1 = 2, 3
    head = inv(IS, mi(ACT, 'onWindowFocusChanged', 'V', ['Z']), [p0, p1])
    body = inv(IV, mi(ACT, 'getWindow', WIN), [p0]) + mro(0) + inv(IV, mi(WIN, 'getDecorView', VIEW), [0]) + mro(0) + const16(1, 0x1706) + inv(IV, mi(VIEW, 'setSystemUiVisibility', 'V', ['I']), [0, 1])
    c = head + ifeqz(p1, 2 + len(body)) + body + RET
    codes[(CLS, 'onWindowFocusChanged')] = (4, 2, 2, c)
    # onBackPressed(): v0 v1 v2 | p0=v3
    p0 = 3
    body = inv(IV, mi(WV, 'evaluateJavascript', 'V', [STR, VCB]), [0, 1, 2])
    c = iget_o(0, p0, fw) + ifeqz(0, 2 + 2 + 1 + len(body)) + cstr(1, JS_BACK) + const4(2, 0) + body + RET
    codes[(CLS, 'onBackPressed')] = (4, 1, 3, c)
    # onPause(): v0 | p0=v1
    body = inv(IV, mi(WV, 'onPause', 'V'), [0])
    c = inv(IS, mi(ACT, 'onPause', 'V'), [1]) + iget_o(0, 1, fw) + ifeqz(0, 2 + len(body)) + body + RET
    codes[(CLS, 'onPause')] = (2, 1, 1, c)
    body = inv(IV, mi(WV, 'onResume', 'V'), [0])
    c = inv(IS, mi(ACT, 'onResume', 'V'), [1]) + iget_o(0, 1, fw) + ifeqz(0, 2 + len(body)) + body + RET
    codes[(CLS, 'onResume')] = (2, 1, 1, c)

    # ---------- layout ----------
    n_str, n_typ, n_pro, n_fld, n_met = len(strings), len(types), len(protos), len(fields), len(meths)
    off = 0x70
    str_ids_off = off; off += 4 * n_str
    typ_ids_off = off; off += 4 * n_typ
    pro_ids_off = off; off += 12 * n_pro
    fld_ids_off = off; off += 8 * n_fld
    met_ids_off = off; off += 8 * n_met
    cls_defs_off = off; off += 32
    data_off = off
    data = bytearray()

    def pad4():
        while (data_off + len(data)) % 4:
            data.append(0)
    # code items (4-aligned)
    pad4()
    code_off = {}
    code_start = data_off + len(data)
    order = [(CLS, '<init>'), (CLS, 'onBackPressed'), (CLS, 'onCreate'), (CLS, 'onPause'), (CLS, 'onResume'), (CLS, 'onWindowFocusChanged')]
    for k in order:
        pad4()
        regs, ins, outs, insns = codes[k]
        code_off[k] = data_off + len(data)
        data += struct.pack('<HHHHII', regs, ins, outs, 0, 0, len(insns))
        data += b''.join(struct.pack('<H', u) for u in insns)
    n_code = len(order)
    # type lists (4-aligned)
    tl_off = {}
    pad4()
    tl_start = data_off + len(data)
    plists = sorted({pr[1] for pr in protos if pr[1]}, key=lambda p: [T[x] for x in p])
    for p in plists:
        pad4()
        tl_off[p] = data_off + len(data)
        data += struct.pack('<I', len(p)) + b''.join(struct.pack('<H', T[x]) for x in p)
    # string data
    sd_start = data_off + len(data)
    sd_off = []
    for s in strings:
        sd_off.append(data_off + len(data))
        data += uleb(len(s)) + mutf8(s) + b'\0'
    # class data
    cd_off = data_off + len(data)
    direct = sorted([mi(CLS, '<init>', 'V')])
    virt = sorted([(mi(CLS, n, 'V', p), n) for (n, p) in [('onCreate', [BUNDLE]), ('onWindowFocusChanged', ['Z']), ('onBackPressed', []), ('onPause', []), ('onResume', [])]])
    cd = uleb(0) + uleb(1) + uleb(1) + uleb(len(virt))
    cd += uleb(fw) + uleb(0x2)  # private WebView w
    cd += uleb(direct[0]) + uleb(0x10001) + uleb(code_off[(CLS, '<init>')])
    prev = 0
    for (idx, n) in virt:
        cd += uleb(idx - prev) + uleb(0x1) + uleb(code_off[(CLS, n)])
        prev = idx
    data += cd
    # map list
    pad4()
    map_off = data_off + len(data)
    items = [(0x0000, 1, 0), (0x0001, n_str, str_ids_off), (0x0002, n_typ, typ_ids_off), (0x0003, n_pro, pro_ids_off),
             (0x0004, n_fld, fld_ids_off), (0x0005, n_met, met_ids_off), (0x0006, 1, cls_defs_off),
             (0x2001, n_code, code_start), (0x1001, len(plists), tl_start), (0x2002, n_str, sd_start), (0x2000, 1, cd_off), (0x1000, 1, map_off)]
    items.sort(key=lambda x: x[2])
    data += struct.pack('<I', len(items)) + b''.join(struct.pack('<HHII', t, 0, n, o) for (t, n, o) in items)
    file_size = data_off + len(data)

    # ---------- id sections ----------
    ids = bytearray()
    ids += b''.join(struct.pack('<I', o) for o in sd_off)
    ids += b''.join(struct.pack('<I', S[t]) for t in types)
    for (r, p) in protos:
        sh = shorty(r) + ''.join(shorty(x) for x in p)
        ids += struct.pack('<III', S[sh], T[r], tl_off[p] if p else 0)
    for (c, n, t) in fields:
        ids += struct.pack('<HHI', T[c], T[t], S[n])
    for (c, n, r, p) in meths:
        ids += struct.pack('<HHI', T[c], PR[(r, tuple(p))], S[n])
    ids += struct.pack('<IIIIIIII', T[CLS], 0x1, T[ACT], 0, 0xffffffff, 0, cd_off, 0)
    assert 0x70 + len(ids) == data_off
    body = bytearray(ids) + data
    hdr = bytearray(b'dex\n035\0') + b'\0' * 24
    hdr += struct.pack('<IIIIII', file_size, 0x70, 0x12345678, 0, 0, map_off)
    hdr += struct.pack('<IIIIIIIIIIII', n_str, str_ids_off, n_typ, typ_ids_off, n_pro, pro_ids_off, n_fld, fld_ids_off, n_met, met_ids_off, 1, cls_defs_off)
    hdr += struct.pack('<II', len(data), data_off)
    assert len(hdr) == 0x70
    dex = hdr + body
    dex[12:32] = hashlib.sha1(bytes(dex[32:])).digest()
    dex[8:12] = struct.pack('<I', zlib.adler32(bytes(dex[12:])) & 0xffffffff)
    return bytes(dex)


if __name__ == '__main__':
    import sys
    d = build()
    open(sys.argv[1], 'wb').write(d)
    print('dex', len(d))
