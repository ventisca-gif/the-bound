"""Independent structural checks for the hand-built APK parts: AXML -> XML text, ARSC dump, DEX parse + disassembly."""
import sys, struct, zlib, hashlib, zipfile


def rd_pool(b, o):
    typ, hsz, size, n, ns, flags, s_start, st_start = struct.unpack_from('<HHIIIIII', b, o)
    assert typ == 1, 'not a string pool'
    utf8 = flags & 0x100
    out = []
    for i in range(n):
        so = struct.unpack_from('<I', b, o + hsz + 4 * i)[0]
        p = o + s_start + so
        if utf8:
            raise SystemExit('utf8 pool not expected')
        ln = struct.unpack_from('<H', b, p)[0]
        out.append(b[p + 2:p + 2 + 2 * ln].decode('utf-16-le'))
        assert b[p + 2 + 2 * ln:p + 4 + 2 * ln] == b'\0\0'
    return out, size


def axml(b):
    typ, hsz, size = struct.unpack_from('<HHI', b, 0)
    assert typ == 3 and hsz == 8 and size == len(b), (typ, hsz, size, len(b))
    o = 8
    strs, sz = rd_pool(b, o); o += sz
    typ, hsz, size = struct.unpack_from('<HHI', b, o)
    assert typ == 0x180
    rmap = [struct.unpack_from('<I', b, o + 8 + 4 * i)[0] for i in range((size - 8) // 4)]
    o += size
    lines, depth, nsmap = [], 0, {}
    while o < len(b):
        typ, hsz, size = struct.unpack_from('<HHI', b, o)
        assert hsz == 16
        if typ == 0x100:
            pfx, uri = struct.unpack_from('<II', b, o + 16); nsmap[strs[uri]] = strs[pfx]
        elif typ == 0x102:
            ns, name, ast, asz, cnt = struct.unpack_from('<IIHHH', b, o + 16)
            assert ast == 20 and asz == 20 and size == 36 + 20 * cnt
            attrs, prev = [], -1
            for i in range(cnt):
                a_ns, a_name, raw, vs, r0, dt, data = struct.unpack_from('<IIIHBBI', b, o + 36 + 20 * i)
                rid = rmap[a_name] if a_name < len(rmap) else 0
                assert rid >= prev, 'attributes not sorted by resource id'
                prev = rid
                pre = (nsmap.get(strs[a_ns], '?') + ':') if a_ns != 0xffffffff else ''
                val = strs[data] if dt == 3 else ('@0x%08x' % data if dt == 1 else ('0x%x' % data if dt == 0x11 else ('true' if data else 'false') if dt == 0x12 else str(data)))
                if dt == 3:
                    assert raw == data
                attrs.append('%s%s="%s"%s' % (pre, strs[a_name], val, ' (0x%08x)' % rid if rid else ''))
            lines.append('  ' * depth + '<' + strs[name] + (' ' + ' '.join(attrs) if attrs else '') + '>')
            depth += 1
        elif typ == 0x103:
            depth -= 1
            lines.append('  ' * depth + '</' + strs[struct.unpack_from('<II', b, o + 16)[1]] + '>')
        elif typ == 0x101:
            pass
        else:
            raise SystemExit('bad chunk %x' % typ)
        o += size
    assert depth == 0
    return '\n'.join(lines)


def arsc(b):
    typ, hsz, size, npk = struct.unpack_from('<HHII', b, 0)
    assert typ == 2 and hsz == 12 and size == len(b) and npk == 1
    o = 12
    g, sz = rd_pool(b, o); o += sz
    typ, phsz, psize, pid = struct.unpack_from('<HHII', b, o)
    assert typ == 0x200 and phsz == 288 and o + psize == len(b)
    name = b[o + 12:o + 12 + 256].decode('utf-16-le').rstrip('\0')
    t_off, lpt, k_off, lpk = struct.unpack_from('<IIII', b, o + 268)
    types, _ = rd_pool(b, o + t_off)
    keys, _ = rd_pool(b, o + k_off)
    q = o + phsz
    q += struct.unpack_from('<I', b, o + t_off + 4)[0] + struct.unpack_from('<I', b, o + k_off + 4)[0]
    out = ['package 0x%02x %s types=%s keys=%s strings=%s' % (pid, name, types, keys, g)]
    while q < o + psize:
        typ, hsz, size = struct.unpack_from('<HHI', b, q)
        if typ == 0x202:
            tid, _, _, n = struct.unpack_from('<BBHI', b, q + 8)
            out.append(' typeSpec id=%d entries=%d' % (tid, n))
        elif typ == 0x201:
            tid, fl, _, n, est = struct.unpack_from('<BBHII', b, q + 8)
            cfgsz = struct.unpack_from('<I', b, q + 20)[0]
            assert hsz == 20 + cfgsz and est == hsz + 4 * n
            for i in range(n):
                eo = struct.unpack_from('<I', b, q + hsz + 4 * i)[0]
                esz, efl, key = struct.unpack_from('<HHI', b, q + est + eo)
                vsz, _, dt, data = struct.unpack_from('<HBBI', b, q + est + eo + esz)
                out.append(' type id=%d cfgsize=%d entry 0x%02x%02x%04x %s/%s -> dt=%d %r' % (tid, cfgsz, pid, tid, i, types[tid - 1], keys[key], dt, g[data] if dt == 3 else data))
        q += size
    return '\n'.join(out)


def uleb(b, p):
    r = s = 0
    while True:
        x = b[p]; p += 1; r |= (x & 0x7f) << s; s += 7
        if not x & 0x80:
            return r, p


def dex(b):
    assert b[:8] == b'dex\n035\0'
    assert struct.unpack_from('<I', b, 8)[0] == zlib.adler32(b[12:]) & 0xffffffff, 'checksum'
    assert b[12:32] == hashlib.sha1(b[32:]).digest(), 'signature'
    (fsz, hsz, endian, lsz, loff, moff, nS, oS, nT, oT, nP, oP, nF, oF, nM, oM, nC, oC, dsz, doff) = struct.unpack_from('<20I', b, 32)
    assert fsz == len(b) and hsz == 0x70 and endian == 0x12345678 and doff + dsz == len(b)
    S = []
    for i in range(nS):
        so = struct.unpack_from('<I', b, oS + 4 * i)[0]
        ln, p = uleb(b, so)
        e = b.index(b'\0', p)
        S.append(b[p:e].decode())
        assert len(S[-1]) == ln
    assert S == sorted(S), 'strings unsorted'
    T = [S[struct.unpack_from('<I', b, oT + 4 * i)[0]] for i in range(nT)]
    Ti = [struct.unpack_from('<I', b, oT + 4 * i)[0] for i in range(nT)]
    assert Ti == sorted(Ti)
    P = []
    for i in range(nP):
        sh, rt, po = struct.unpack_from('<III', b, oP + 12 * i)
        params = []
        if po:
            assert po % 4 == 0
            n = struct.unpack_from('<I', b, po)[0]
            params = [struct.unpack_from('<H', b, po + 4 + 2 * k)[0] for k in range(n)]
        short = (lambda t: 'L' if t[0] in 'L[' else t)
        assert S[sh] == short(T[rt]) + ''.join(short(T[x]) for x in params), ('shorty', S[sh])
        P.append((rt, params))
    assert P == sorted(P, key=lambda x: (x[0], x[1]))
    Fl = [struct.unpack_from('<HHI', b, oF + 8 * i) for i in range(nF)]
    assert Fl == sorted(Fl, key=lambda f: (f[0], f[2], f[1]))
    Ml = [struct.unpack_from('<HHI', b, oM + 8 * i) for i in range(nM)]
    assert Ml == sorted(Ml, key=lambda m: (m[0], m[2], m[1]))

    def msig(i):
        c, p, n = Ml[i]
        rt, ps = P[p]
        return '%s->%s(%s)%s' % (T[c], S[n], ''.join(T[x] for x in ps), T[rt])

    def nargs(i):
        rt, ps = P[Ml[i][1]]
        return sum(2 if T[x] in ('J', 'D') else 1 for x in ps)
    out = []
    # map list
    n = struct.unpack_from('<I', b, moff)[0]
    items = [struct.unpack_from('<HHII', b, moff + 4 + 12 * i) for i in range(n)]
    offs = [it[3] for it in items]
    assert offs == sorted(offs) and items[0][0] == 0 and items[0][3] == 0
    out.append('map: ' + ', '.join('%04x x%d @%d' % (t, c, o) for (t, _, c, o) in items))
    for ci in range(nC):
        cls, acc, sup, ifo, src, ann, cdo, sv = struct.unpack_from('<8I', b, oC + 32 * ci)
        out.append('class %s extends %s flags=0x%x' % (T[cls], T[sup], acc))
        p = cdo
        sf, p = uleb(b, p); inf, p = uleb(b, p); dm, p = uleb(b, p); vm, p = uleb(b, p)
        fi = 0
        for k in range(inf):
            d, p = uleb(b, p); a, p = uleb(b, p); fi += d
            out.append('  field %s %s flags=0x%x' % (S[Fl[fi][2]], T[Fl[fi][1]], a))
        for group, cnt in (('direct', dm), ('virtual', vm)):
            mi = 0
            for k in range(cnt):
                d, p = uleb(b, p); a, p = uleb(b, p); co, p = uleb(b, p); mi += d
                regs, ins, outs, tries, dbg, nins = struct.unpack_from('<HHHHII', b, co)
                assert co % 4 == 0 and tries == 0
                rt, ps = P[Ml[mi][1]]
                exp_ins = 1 + sum(2 if T[x] in ('J', 'D') else 1 for x in ps)
                assert ins == exp_ins, (msig(mi), ins, exp_ins)
                out.append('  %s %s flags=0x%x regs=%d ins=%d outs=%d' % (group, msig(mi), a, regs, ins, outs))
                u = [struct.unpack_from('<H', b, co + 16 + 2 * j)[0] for j in range(nins)]
                j = 0
                maxout = 0
                while j < nins:
                    op = u[j] & 0xff
                    if op in (0x6e, 0x6f, 0x70):
                        A = u[j] >> 12; G = (u[j] >> 8) & 0xf; idx = u[j + 1]; w = u[j + 2]
                        rr = [w & 0xf, (w >> 4) & 0xf, (w >> 8) & 0xf, (w >> 12) & 0xf, G][:A]
                        assert all(r < regs for r in rr)
                        need = nargs(idx) + 1
                        assert A == need, ('argcount', msig(idx), A, need)
                        maxout = max(maxout, A)
                        out.append('    %04x %s {%s} %s' % (j, {0x6e: 'invoke-virtual', 0x6f: 'invoke-super', 0x70: 'invoke-direct'}[op], ', '.join('v%d' % r for r in rr), msig(idx)))
                        j += 3
                    elif op == 0x0e:
                        out.append('    %04x return-void' % j); j += 1
                    elif op == 0x12:
                        a = (u[j] >> 8) & 0xf; v = u[j] >> 12; v = v - 16 if v > 7 else v
                        assert a < regs; out.append('    %04x const/4 v%d, %d' % (j, a, v)); j += 1
                    elif op == 0x13:
                        a = u[j] >> 8; assert a < regs; out.append('    %04x const/16 v%d, 0x%x' % (j, a, u[j + 1])); j += 2
                    elif op == 0x15:
                        a = u[j] >> 8; assert a < regs; out.append('    %04x const/high16 v%d, 0x%x0000' % (j, a, u[j + 1])); j += 2
                    elif op == 0x0c:
                        a = u[j] >> 8; assert a < regs; out.append('    %04x move-result-object v%d' % (j, a)); j += 1
                    elif op == 0x22:
                        a = u[j] >> 8; assert a < regs; out.append('    %04x new-instance v%d, %s' % (j, a, T[u[j + 1]])); j += 2
                    elif op in (0x5b, 0x54):
                        a = (u[j] >> 8) & 0xf; bb = u[j] >> 12; f = Fl[u[j + 1]]
                        assert a < regs and bb < regs
                        out.append('    %04x %s v%d, v%d, %s->%s:%s' % (j, 'iput-object' if op == 0x5b else 'iget-object', a, bb, T[f[0]], S[f[2]], T[f[1]])); j += 2
                    elif op == 0x1a:
                        a = u[j] >> 8; assert a < regs; out.append('    %04x const-string v%d, "%s"' % (j, a, S[u[j + 1]])); j += 2
                    elif op == 0x38:
                        a = u[j] >> 8; off = u[j + 1]; off = off - 65536 if off > 32767 else off
                        assert a < regs and 0 <= j + off < nins and u[j + off] & 0xff == 0x0e
                        out.append('    %04x if-eqz v%d, +%d -> %04x' % (j, a, off, j + off)); j += 2
                    else:
                        raise SystemExit('unknown opcode %02x' % op)
                assert u[-1] == 0x0e
                assert maxout <= outs, ('outs', msig(mi), maxout, outs)
    return '\n'.join(out)


if __name__ == '__main__':
    z = zipfile.ZipFile(sys.argv[1])
    print(axml(z.read('AndroidManifest.xml')))
    print(arsc(z.read('resources.arsc')))
    print(dex(z.read('classes.dex')))
    for i in z.infolist():
        if i.compress_type == 0:
            # data offset = header offset + 30 + name + extra (local)
            raw = open(sys.argv[1], 'rb').read()
            nlen, elen = struct.unpack_from('<HH', raw, i.header_offset + 26)
            print('stored %s data@%d aligned=%s' % (i.filename, i.header_offset + 30 + nlen + elen, (i.header_offset + 30 + nlen + elen) % 4 == 0))
    print('ALL CHECKS PASSED')
