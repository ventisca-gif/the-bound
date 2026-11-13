"""Binary AndroidManifest.xml (AXML) and resources.arsc writers for The Bound's Android shell."""
import struct

ANDROID_NS = 'http://schemas.android.com/apk/res/android'
RID = {'label': 0x01010001, 'icon': 0x01010002, 'name': 0x01010003, 'exported': 0x01010010,
       'configChanges': 0x0101001f, 'minSdkVersion': 0x0101020c, 'versionCode': 0x0101021b,
       'versionName': 0x0101021c, 'targetSdkVersion': 0x01010270}
T_REF, T_STR, T_DEC, T_HEX, T_BOOL = 0x01, 0x03, 0x10, 0x11, 0x12


def pool(strings):
    """ResStringPool (UTF-16)."""
    offs, blob = [], bytearray()
    for s in strings:
        offs.append(len(blob))
        u = s.encode('utf-16-le')
        blob += struct.pack('<H', len(s)) + u + b'\0\0'
    while len(blob) % 4:
        blob += b'\0'
    hsz = 28
    start = hsz + 4 * len(strings)
    size = start + len(blob)
    return struct.pack('<HHIIIIII', 0x0001, hsz, size, len(strings), 0, 0, start, 0) + b''.join(struct.pack('<I', o) for o in offs) + bytes(blob)


def manifest(pkg, label, version_code, version_name, min_sdk, target_sdk, activity, config_changes):
    # Element tree: (name, [(attrName, type, value)], children)
    app_attrs = [('label', T_STR, label), ('icon', T_REF, 0x7f010000)]
    act_attrs = [('label', T_STR, label), ('name', T_STR, activity), ('exported', T_BOOL, True), ('configChanges', T_HEX, config_changes)]
    tree = ('manifest', [('package', T_STR, pkg), ('versionCode', T_DEC, version_code), ('versionName', T_STR, version_name)], [
        ('uses-sdk', [('minSdkVersion', T_DEC, min_sdk), ('targetSdkVersion', T_DEC, target_sdk)], []),
        ('uses-permission', [('name', T_STR, 'android.permission.INTERNET')], []),
        ('uses-permission', [('name', T_STR, 'android.permission.ACCESS_NETWORK_STATE')], []),
        ('application', app_attrs, [
            ('activity', act_attrs, [
                ('intent-filter', [], [
                    ('action', [('name', T_STR, 'android.intent.action.MAIN')], []),
                    ('category', [('name', T_STR, 'android.intent.category.LAUNCHER')], []),
                ])])])])
    # string pool: resource-mapped attribute names first (in resource-map order)
    used = []

    def walk(e):
        for (n, t, v) in e[1]:
            if n in RID and n not in used:
                used.append(n)
        for c in e[2]:
            walk(c)
    walk(tree)
    used.sort(key=lambda n: RID[n])
    strings = list(used)

    def S(s):
        if s not in strings:
            strings.append(s)
        return strings.index(s)
    S('android'); S(ANDROID_NS)

    def collect(e):
        S(e[0])
        for (n, t, v) in e[1]:
            S(n)
            if t == T_STR:
                S(v)
        for c in e[2]:
            collect(c)
    collect(tree)
    chunks = bytearray()
    line = [1]

    def node(e):
        name, attrs, kids = e
        attrs = sorted(attrs, key=lambda a: RID.get(a[0], 0))
        ab = bytearray()
        for (n, t, v) in attrs:
            ns = S(ANDROID_NS) if n in RID else 0xffffffff
            if t == T_STR:
                raw, data = S(v), S(v)
            elif t == T_BOOL:
                raw, data = 0xffffffff, 0xffffffff if v else 0
            else:
                raw, data = 0xffffffff, v
            ab += struct.pack('<IIIHBBI', ns, S(n), raw, 8, 0, t, data)
        chunks.extend(struct.pack('<HHIII', 0x0102, 16, 36 + len(ab), line[0], 0xffffffff))
        chunks.extend(struct.pack('<IIHHHHHH', 0xffffffff, S(name), 20, 20, len(attrs), 0, 0, 0) + ab)
        line[0] += 1
        for k in kids:
            node(k)
        chunks.extend(struct.pack('<HHIIIII', 0x0103, 16, 24, line[0], 0xffffffff, 0xffffffff, S(name)))
        line[0] += 1
    chunks.extend(struct.pack('<HHIIIII', 0x0100, 16, 24, 1, 0xffffffff, S('android'), S(ANDROID_NS)))
    node(tree)
    chunks.extend(struct.pack('<HHIIIII', 0x0101, 16, 24, line[0], 0xffffffff, S('android'), S(ANDROID_NS)))
    sp = pool(strings)
    rm = struct.pack('<HHI', 0x0180, 8, 8 + 4 * len(used)) + b''.join(struct.pack('<I', RID[n]) for n in used)
    body = sp + rm + bytes(chunks)
    return struct.pack('<HHI', 0x0003, 8, 8 + len(body)) + body


def arsc(pkg, icon_path):
    gpool = pool([icon_path])
    tpool = pool(['drawable'])
    kpool = pool(['icon'])
    spec = struct.pack('<HHIBBHI', 0x0202, 16, 16 + 4, 1, 0, 0, 1) + struct.pack('<I', 0)
    cfg = struct.pack('<I', 64) + b'\0' * 60
    hsz = 20 + len(cfg)
    entries = struct.pack('<HHI', 8, 0, 0) + struct.pack('<HBBI', 8, 0, 0x03, 0)
    typ = struct.pack('<HHIBBHII', 0x0201, hsz, hsz + 4 + len(entries), 1, 0, 0, 1, hsz + 4) + cfg + struct.pack('<I', 0) + entries
    name = pkg.encode('utf-16-le')
    name = name + b'\0' * (256 - len(name))
    phsz = 288
    type_off = phsz
    key_off = phsz + len(tpool)
    pkg_body = tpool + kpool + spec + typ
    pk = struct.pack('<HHII', 0x0200, phsz, phsz + len(pkg_body), 0x7f) + name + struct.pack('<IIIII', type_off, 1, key_off, 1, 0) + pkg_body
    body = gpool + pk
    return struct.pack('<HHII', 0x0002, 12, 12 + len(body), 1) + body
