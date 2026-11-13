// ================= v4.5: AJUSTE AUTOMÁTICO DE PRENDAS A TODAS LAS ESTRUCTURAS =================
// Para que armaduras, cosméticos, ropa y alas nuevas se adapten solos a las 8 estructuras de cuerpo y cabeza:
//
// 1) CABEZA (cascos, sombreros, coronas, orejas, cuernos...): se dibujan como si la cabeza fuera la clásica
//    (radios 7.5 × 8) y luego se escalan solos a la cabeza de cada estructura (fitHeadLayer). Lo que va pegado a
//    la cara (gafas, máscaras) no se escala: usa la línea de los ojos (A.ey, A.eyes).
// 2) CUERPO, PIERNAS, PIES y ESPALDA: los tipos que ya existen usan las medidas de cada estructura. Un cosmético
//    nuevo que reutiliza un tipo (cosm(..., () => ({ k: 'plate', m: paleta }))) se adapta sin hacer nada más.
// 3) TIPOS NUEVOS: regístralos con fitKind(slot, k, draw, opts). draw(p, A, spec) recibe los puntos de anclaje A
//    de ese fotograma. Dibuja siempre en función de A (nunca con números fijos de píxel) y se verá bien en todas:
//      A.cx, A.base          centro del cuerpo y suelo
//      A.hx, A.hy, A.hrx, A.hry, A.headTop, A.chin      cabeza
//      A.ey, A.eyes[]        fila y columnas de los ojos (gafas, antifaces)
//      A.tx0, A.tw, A.torsoTop, A.th, A.waistY, A.hipY   torso
//      A.shL, A.shR, A.shY   hombros
//      A.legTop, A.lw        piernas
//      A.dir, A.side, A.up, A.d (1 derecha / -1 izquierda), A.fem, A.anim, A.f, A.bt
//    Ejemplo: fitKind('head', 'diadema', (p, A, s) => { const y = Math.round(A.headTop + A.hry * 0.4);
//               p.hl(Math.round(A.hx - A.hrx), y, Math.round(A.hrx * 2) + 1, s.m[3]); });
//             cosm('c_diadema', 'Diadema', 'head', () => ({ k: 'diadema', m: GOLD }), { src: 'Tienda' });
//    opts: { face: true } para lo que va pegado a la cara (no se escala con la cabeza), { float: true } para lo que
//    flota a propósito (aureolas), { skin: true } para prendas que dejan piel a la vista a propósito.
// 4) REVISOR: python3 tools/dev/fitcheck.py URL out_dir prueba cada armadura y cosmético en las 8 estructuras,
//    4 direcciones y la caminata, y avisa si tapa los ojos, se sale del cuadro, flota, deja piel al aire,
//    no escala con la cabeza o cambia de golpe entre fotogramas.
const FITK = { head: {}, body: {}, legs: {}, feet: {}, back: {} };
const FIT_HEAD = { hrx: 7.5, hry: 8 };
const FIT_FACE = new Set(['shades']), FIT_FLOAT = new Set(['halo']), FIT_SKIN = new Set(['swim', 'warpaint', 'hawaii', 'shorts', 'skirt']);
function fitKind(slot, k, draw, opts) {
  if (!FITK[slot]) throw new Error('fitKind: ranura desconocida ' + slot);
  opts = opts || {}; FITK[slot][k] = Object.assign({ draw }, opts);
  if (opts.face) FIT_FACE.add(k); if (opts.float) FIT_FLOAT.add(k); if (opts.skin) FIT_SKIN.add(k);
}
// puntos de anclaje del fotograma (se añaden a p.meta, que también usa el detalle HD)
function fitMeta(p, L, B, BTS) {
  const m = p.meta; if (!m) return;
  const eg = (BTS && BTS.eg) || 0, ey = Math.round(m.hy) + FACE.ey;
  m.hrx = B.hrx; m.hry = B.hry; m.headTop = m.hy - B.hry; m.chin = m.hy + B.hry; m.ey = ey; m.eg = eg;
  m.eyes = m.side ? [m.dir === 'left' ? m.hx - 5 : m.hx + 3] : [m.hx - 4 - eg, m.hx + 3 + eg];
  m.shY = m.torsoTop + 1; m.shL = m.side ? m.cx - 1 : m.tx0 - B.aw; m.shR = m.side ? m.cx - 1 : m.tx0 + m.tw;
  m.waistY = m.torsoTop + m.th - 3; m.hipY = m.legTop; m.lw = B.lw; m.al = B.al; m.aw = B.aw; m.bt = (L && L.bt) || 0;
}
// dibuja la capa de la cabeza para la cabeza clásica y la escala a la cabeza real alrededor de su centro
function fitHeadLayer(p, B, hx, hy, HD, draw) {
  if (!HD) return draw();
  const sx = B.hrx / FIT_HEAD.hrx, sy = B.hry / FIT_HEAD.hry;
  if ((Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02) || FIT_FACE.has(HD.k) || HD.fit === 'face') return draw();
  const W = p.w, H = p.h, D0 = p.d, T0 = p.t, tmp = new Uint32Array(W * H).fill(1), tmpT = T0 ? new Uint8Array(W * H) : null;
  const ox = B.hrx, oy = B.hry; p.d = tmp; if (T0) p.t = tmpT; B.hrx = FIT_HEAD.hrx; B.hry = FIT_HEAD.hry;
  try { draw(); } finally { B.hrx = ox; B.hry = oy; p.d = D0; p.t = T0; }
  let x0 = W, x1 = -1, y0 = H, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (tmp[y * W + x] !== 1) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return;
  const X0 = Math.max(0, Math.floor(hx + (x0 - hx) * sx) - 1), X1 = Math.min(W - 1, Math.ceil(hx + (x1 + 1 - hx) * sx) + 1);
  // lo que sube por encima de la cabeza (sombreros altos) se encoge si no cabe en el cuadro
  const topRaw = hy + (y0 - hy) * sy, yH = hy - B.hry, yHs = hy - FIT_HEAD.hry, squash = topRaw < 1 && y0 < yHs && yH > 2;
  const Y0 = squash ? 1 : Math.max(0, Math.floor(topRaw) - 1), Y1 = Math.min(H - 1, Math.ceil(hy + (y1 + 1 - hy) * sy) + 1);
  for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
    const qx = Math.floor(hx + (x + 0.5 - hx) / sx), qy = squash && y + 0.5 < yH ? Math.floor(yHs - (yH - (y + 0.5)) * (yHs - y0) / (yH - 1)) : Math.floor(hy + (y + 0.5 - hy) / sy);
    if (qx < 0 || qy < 0 || qx >= W || qy >= H) continue; const si = qy * W + qx, v = tmp[si]; if (v === 1) continue;
    const di = y * W + x; D0[di] = v; if (T0) T0[di] = tmpT[si];
  }
}

// ---------------- revisor automático (lo usa tools/dev/fitcheck.py) ----------------
const FIT_BODIES = [['m', 0], ['m', 1], ['m', 2], ['m', 3], ['f', 0], ['f', 1], ['f', 2], ['f', 3]];
const FIT_FRAMES = [['idle', 0], ['walk', 0], ['walk', 1], ['walk', 2], ['walk', 3]];
function fitDraw(L, dir, an, f) { const p = new Pix(48, 48); drawHero(p, L, dir, an, f); return p; }
function fitItems(only) {
  const out = [];
  for (const id in COSM) out.push({ id, kind: 'cos', slot: COSM[id].slot });
  const cls = ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez'];
  for (const c of cls) for (const t of [1, 3, 6, 9, 12, 15, 18, 21, 22, 23, 24, 25, 26]) for (const slot of ['head', 'body', 'legs', 'feet']) out.push({ id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t });
  return only ? out.filter(it => it.id.includes(only)) : out;
}
function fitLook(it, g, bt, withItem) {
  const app = { g, bt, hs: g === 'm' ? 14 : 6, hair: 'negro', eyes: 'verde', skin: 0, top: [0, 'gris'], bot: [0, 'gris'], shoe: [0, 'marron'] };
  if (it.kind === 'cos') { const cos = withItem ? { [it.slot]: it.id } : {}; const L = heroLook('guerrero', app, { weapon: 0 }, cos, {}); L.weapon = null; if (!withItem && it.slot === 'back') L.back = null; if (it.slot !== 'back' && !cos.back) L.back = null; L.scarf = null; return L; }
  const gear = { weapon: 0 }; if (withItem) gear[it.slot] = it.t;
  const L = heroLook(it.cls, app, gear, {}, {}); L.weapon = null; L.back = null; L.scarf = null; if (!withItem) L.mask = null; return L;
}
function fitCheck(only, limit) {
  const items = fitItems(only).slice(0, limit || 9999), issues = [], stats = { items: items.length, draws: 0 };
  const isSkin = (c, SK) => SK.some(s => s === c);
  for (const it of items) {
    let ref = null;   // medidas en la estructura clásica del mismo sexo para comparar
    for (const [g, bt] of FIT_BODIES) {
      const Lw = fitLook(it, g, bt, true), Lo = fitLook(it, g, bt, false), SK = Lw.skin || SKINS[0];
      const k = it.slot === 'head' ? Lw.head && Lw.head.k : it.slot === 'body' ? Lw.top && Lw.top.k : it.slot === 'legs' ? Lw.bot && Lw.bot.k : it.slot === 'feet' ? Lw.feet && Lw.feet.k : Lw.back && Lw.back.k;
      if (!k) continue;
      const counts = {};
      for (const dir of ['down', 'left', 'up']) for (const [an, f] of FIT_FRAMES) {
        const pw = fitDraw(Lw, dir, an, f), po = fitDraw(Lo, dir, an, f), M = pw.meta; stats.draws += 2;
        let n = 0, bx0 = 99, bx1 = -1, by0 = 99, by1 = -1, edge = 0, eyeHit = 0, loose = 0; const mask = new Uint8Array(48 * 48);
        for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
          const a = pw.d[y * 48 + x], b = po.d[y * 48 + x]; if (a === b || !uA(a)) continue;
          n++; if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
          if (x === 0 || x === 47 || y === 0) edge++;
          if (it.slot === 'head' && !M.up && y >= M.ey && y <= M.ey + 1 && M.eyes.some(ex => x >= ex && x <= ex + 1)) eyeHit++;
          mask[y * 48 + x] = 1;
        }
        // suelto: trozos de la prenda (píxeles conectados) que no tocan el cuerpo dibujado sin ella
        for (let i0 = 0; i0 < 48 * 48; i0++) if (mask[i0] === 1) {
          const st = [i0], comp = []; mask[i0] = 2; let touch = false;
          while (st.length) { const i = st.pop(), x = i % 48, y = (i / 48) | 0; comp.push(i);
            for (let j = -1; j <= 1; j++) for (let k2 = -1; k2 <= 1; k2++) { const xx = x + k2, yy = y + j; if (xx < 0 || yy < 0 || xx >= 48 || yy >= 48) continue; const q = yy * 48 + xx; if (mask[q] === 1) { mask[q] = 2; st.push(q); } else if (!mask[q] && uA(po.d[q])) touch = true; } }
          if (!touch && comp.length > 2) loose += comp.length;
        }
        const key = dir + ':' + an + f; counts[key] = n;
        const tag = `${g === 'm' ? 'H' : 'M'}${bt} ${bodyName(g, bt)} · ${dir} ${an}${f}`;
        if (edge > 2) issues.push({ id: it.id, body: [g, bt], dir, an, f, issue: 'se sale del cuadro', n: edge, tag });
        if (eyeHit && !FIT_FACE.has(k)) issues.push({ id: it.id, body: [g, bt], dir, an, f, issue: 'tapa los ojos', n: eyeHit, tag });
        if (loose > 2 && !FIT_FLOAT.has(k)) issues.push({ id: it.id, body: [g, bt], dir, an, f, issue: 'flota separado del cuerpo', n: loose, tag });
        if ((it.slot === 'body' || it.slot === 'legs') && !FIT_SKIN.has(k) && (an === 'idle')) {
          // piel al aire dentro del torso (cuerpo) o de las piernas por encima del calzado
          let skin = 0, tot = 0; const yA = it.slot === 'body' ? M.torsoTop + 1 : M.legTop + 1, yB = it.slot === 'body' ? M.torsoTop + M.th - 2 : M.base - 4;
          for (let y = yA; y <= yB; y++) for (let x = M.tx0 + 1; x < M.tx0 + M.tw - 1; x++) { tot++; if (isSkin(pw.get(x, y), SK)) skin++; }
          const fr = tot ? skin / tot : 0;
          if (bt === 0) { ref = ref || {}; ref[it.slot + g + dir] = fr; }
          else if (ref && ref[it.slot + g + dir] != null && fr > ref[it.slot + g + dir] + 0.12) issues.push({ id: it.id, body: [g, bt], dir, an, f, issue: 'deja piel al aire', n: Math.round(fr * 100), tag });
        }
        if (it.slot === 'head' && an === 'idle' && dir === 'down' && n) {
          const w = (bx1 - bx0 + 1) / (2 * M.hrx);
          if (bt === 0) { ref = ref || {}; ref['hw' + g] = w; }
          else if (ref && ref['hw' + g] && Math.abs(w - ref['hw' + g]) > 0.18 && !FIT_FACE.has(k)) issues.push({ id: it.id, body: [g, bt], dir, an, f, issue: 'no escala con la cabeza', n: Math.round(w * 100), tag });
        }
      }
      if (it.slot !== 'legs' && it.slot !== 'feet') for (const dir of ['down', 'left', 'up']) { const a = [0, 1, 2, 3].map(f => counts[dir + ':walk' + f]).filter(v => v != null); const mx = Math.max(...a), mn = Math.min(...a); if (mx > 12 && mn < mx * 0.45) issues.push({ id: it.id, body: [g, bt], dir, an: 'walk', f: -1, issue: 'cambia de golpe al caminar', n: mx - mn, tag: `${g === 'm' ? 'H' : 'M'}${bt} ${bodyName(g, bt)} · ${dir} walk` }); }
    }
  }
  // un aviso que también sale en la estructura clásica del mismo sexo es del diseño original de la prenda
  const key = i => [i.id, i.body[0], i.issue, i.dir, i.an, i.f].join('|'), base = new Set(issues.filter(i => i.body[1] === 0).map(key));
  for (const i of issues) i.base = i.body[1] === 0 || base.has(key(i));
  return { stats, issues };
}
