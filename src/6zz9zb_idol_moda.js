// ================= v4.84: ROPA DE IDOL (8 trajes de las referencias de Sergio) =================
// Tipos nuevos con fitKind (se adaptan solos a las 8 estructuras de cuerpo): uniforme escolar de idol, vestido blanco de
// volantes, chaqueta peluda, diva virtual (colores propios: violeta), top de estrella, conjunto rosa peluche, idol robot y
// maid de estrellas. Mangas: después de dibujar al héroe se retocan los brazos según spec.sl (abullonadas, sueltas o sin
// mangas) y spec.gl (guantes), usando las capas p.t (3 = brazo) o, sin capas, los colores de la prenda fuera del torso.
// Se compran a la estilista Mio en la sala STELLA☆LINK (Akihabara).

const IDP = { blanco: P5(['#8a8a9a', '#b8b8c8', '#dcdce8', '#f0f0f8', '#ffffff']), negro: P5(['#07070b', '#111118', '#1c1c26', '#2a2a36', '#3e3e4c']), marino: P5(['#0a1230', '#142050', '#1e2e6e', '#2c4088', '#4058a8']),
  rojo: P5(['#4a0a10', '#8a1420', '#c02030', '#e04048', '#ff7a7a']), azul: P5(['#0a3a5a', '#1a6a9a', '#3aa0d8', '#7ad0f8', '#c8f0ff']), rosa: P5(['#7a2a4a', '#c04a7a', '#f080b0', '#ffb0d0', '#ffe0ee']),
  lila: P5(['#3a1a5a', '#6a3a9a', '#9a6ad0', '#c8a0f0', '#ece0ff']), gris: P5(['#3a3e48', '#5a606c', '#868c98', '#b0b6c0', '#d8dce4']), violeta: P5(['#3a0a5a', '#6a1a9a', '#a040e0', '#c880ff', '#f0d0ff']),
  plata: P5(['#5a5e6a', '#8a909c', '#bcc2cc', '#e0e4ea', '#ffffff']), oro: P5(['#6a4a0a', '#a8781a', '#e0a830', '#ffd860', '#fff4c0']), naranja: P5(['#6a2a0a', '#b0501a', '#e88030', '#ffb060', '#ffe0b0']) };
const ID_KINDS = new Set();
const idSkin = (A, i) => A.sk[[0, 0, 1, 2, 3][Math.max(0, Math.min(4, i))]];
// pinta de piel lo que sea de la prenda (colores de m) en un rectángulo
function idBare(p, A, m, x0, y0, x1, y1) { const ix = new Map(m.map((c, i) => [c, i])); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = ix.get(p.get(x, y)); if (i !== undefined) p.set(x, y, idSkin(A, i)); } }
function idK(slot, k, draw) { ID_KINDS.add(k); fitKind(slot, k, draw, { skin: true }); }

// ----- cuerpos -----
idK('body', 'id_uniforme', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, v = s.v, a = s.a, m = s.m;
  if (up) { for (let y = ty + 1; y < ty + th - 1; y++) for (let x = tx0; x <= R; x++) p.set(x, y, v[x === tx0 ? 3 : x === R ? 1 : 2]); p.hl(tx0, ty, tw, m[4]); return; }
  for (let y = ty + 1; y < ty + th - 1; y++) { if (side) { const x0 = d > 0 ? tx0 : cx; for (let x = x0; x < x0 + (tw >> 1); x++) p.set(x, y, v[2]); } else { p.set(tx0, y, v[3]); p.set(tx0 + 1, y, v[2]); p.set(R, y, v[1]); p.set(R - 1, y, v[2]); } }
  p.hl(tx0, ty + th - 2, tw, (ty + th) % 2 ? a[2] : a[1]); for (let x = tx0; x <= R; x += 2) p.set(x, ty + th - 2, a[3]);
  if (side) { p.set(cx + d, ty + 1, a[2]); p.set(cx + d, ty + 2, a[3]); return; }
  p.set(cx - 2, ty, m[4]); p.set(cx + 1, ty, m[4]); p.set(cx - 1, ty + 1, a[1]); p.set(cx, ty + 1, a[1]);
  for (let y = ty + 2; y < ty + Math.min(th - 2, 7); y++) { p.set(cx - 1, y, (y % 2) ? a[2] : a[3]); p.set(cx, y, (y % 2) ? a[3] : s.y[3]); }
  p.set(tx0 + 1, ty + 2, s.y[3]); p.set(R - 1, ty + 2, s.y[3]); });
idK('body', 'id_volantes', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, a = s.a;
  for (const y of [ty + 3, ty + th - 3]) for (let x = tx0; x <= R; x++) p.set(x, y, (x + y) % 2 ? m[4] : m[1]); p.hl(tx0, ty, tw, a[3]);
  if (up) { p.set(cx - 1, ty + th - 2, a[2]); p.set(cx, ty + th - 2, a[2]); p.set(cx - 2, ty + th - 1, a[1]); p.set(cx + 1, ty + th - 1, a[1]); return; }
  if (side) { p.set(cx, ty + 2, a[3]); p.set(cx, ty + 1, a[2]); return; }
  p.set(cx - 2, ty + 1, a[3]); p.set(cx - 3, ty + 2, a[2]); p.set(cx - 1, ty + 2, a[1]); p.set(cx, ty + 2, a[1]); p.set(cx + 1, ty + 1, a[3]); p.set(cx + 2, ty + 2, a[2]); p.set(cx - 1, ty + 3, a[2]); p.set(cx, ty + 4, a[2]); });
idK('body', 'id_peluche', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, c = s.c, a = s.a;
  for (let y = ty; y < ty + th; y++) for (let x = tx0 - 1; x <= R + 1; x++) { const col = p.get(x, y); if (m.includes(col) && ((x * 5 + y * 3) % 4 === 0)) p.set(x, y, m[4]); }
  if (!side && !up) for (let x = tx0 - 1; x <= R + 1; x += 2) p.set(x, ty + th - 1, m[4]);
  if (up) return; const x0 = side ? (d > 0 ? cx : cx - 2) : cx - 2, x1 = side ? x0 + 1 : cx + 1;
  for (let y = ty + 1; y < ty + th - 1; y++) for (let x = x0; x <= x1; x++) p.set(x, y, (x + y) % 3 ? c[2] : c[3]); if (!side) { p.set(cx - 1, ty + 3, c[4]); p.set(cx, ty + 4, c[4]); p.set(cx - 1, ty + 5, m[3]); }
  if (!side) { for (let k = 0; k < 3; k++) { p.set(cx - 2 + k, ty + 1 + (k === 1 ? 1 : 0), a[3]); p.set(cx + 1 - k, ty + 1 + (k === 1 ? 1 : 0), a[3]); } p.set(cx - 1, ty + 3, a[4]); p.set(cx, ty + 2, a[4]); } });
idK('body', 'id_diva', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, a = s.a, k = s.k;
  p.hl(tx0, ty + th - 2, tw, k[2]); p.hl(tx0, ty + th - 1, tw, a[2]);
  if (up) { p.hl(tx0 + 1, ty, tw - 2, m[3]); return; }
  if (side) { p.set(cx + d, ty, m[4]); p.set(cx + d, ty + 1, a[3]); p.set(cx + d, ty + 2, a[2]); return; }
  p.set(cx - 2, ty, m[4]); p.set(cx + 1, ty, m[4]); p.set(cx - 2, ty + 1, m[3]); p.set(cx + 1, ty + 1, m[3]);
  p.set(cx - 1, ty + 1, a[2]); p.set(cx, ty + 1, a[2]); for (let y = ty + 2; y < ty + th - 2; y++) { p.set(cx - 1, y, a[3]); p.set(cx, y, a[2]); } p.set(cx - 1, ty + th - 3, a[4]);
  p.set(tx0 + 1, ty + 3, a[4]); p.set(tx0 + 2, ty + 3, a[3]); });
idK('body', 'id_estrella', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, w = s.w;
  idBare(p, A, m, tx0 - 1, ty, R + 1, ty + th - 1); if (up) { p.hl(tx0, ty + 3, tw, w[3]); p.vl(cx - 1, ty, 3, w[3]); return; }
  const top = ty + 2, bot = ty + Math.min(th - 3, 6), w0 = side ? cx - 2 + (d > 0 ? 0 : -1) : tx0, w1 = side ? cx + 1 + (d > 0 ? 1 : 0) : R;
  for (let y = top; y <= bot; y++) { const t = (y - top) / Math.max(1, bot - top), inset = Math.round(t * (w1 - w0) / 2.2); for (let x = w0 + inset; x <= w1 - inset; x++) p.set(x, y, ((x * 3 + y) % 4 === 0) ? w[4] : ((x + y) % 3 ? w[2] : w[3])); }
  if (!side) { p.set(tx0 - 1, top, w[3]); p.set(R + 1, top, w[3]); p.set(cx - 2, ty, w[2]); p.set(cx + 1, ty, w[2]); p.set(cx - 2, ty + 1, w[2]); p.set(cx + 1, ty + 1, w[2]); } });
idK('body', 'id_rosa', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, f = s.f;
  idBare(p, A, m, tx0 - 1, ty, R + 1, ty + 1); idBare(p, A, m, tx0 - 1, ty + th - 2, R + 1, ty + th - 1);
  for (let x = tx0; x <= R; x++) { p.set(x, ty + 2, (x % 2) ? f[4] : f[3]); } if (!up && !side) { p.set(cx - 1, ty, f[3]); p.set(cx, ty, f[3]); p.set(cx - 1, ty + 1, f[4]); p.set(cx, ty + 1, f[4]); for (let y = ty + 3; y < ty + th - 2; y++) p.set((y % 2) ? cx - 1 : cx, y, f[4]); }
  if (up) for (let y = ty + 3; y < ty + th - 2; y++) { p.set(cx - 1, y, f[4]); p.set(cx, y, (y % 2) ? f[3] : m[1]); } });
idK('body', 'id_robot', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, k = s.k, a = s.a;
  idBare(p, A, m, tx0 - 1, ty + th - 3, R + 1, ty + th - 2); p.hl(tx0, ty + th - 1, tw, k[2]); p.set(cx, ty + th - 1, a[3]);
  p.hl(tx0, ty + th - 4, tw, m[1]); for (let x = tx0; x <= R; x += 3) p.set(x, ty + 2, m[1]);
  if (!side) { for (const sx of [tx0 - 1, R + 1]) { p.set(sx, ty, m[4]); p.set(sx, ty + 1, m[3]); p.set(sx, ty + 2, m[1]); } }
  if (!up && !side) { p.hl(cx - 2, ty, 4, k[3]); p.set(cx - 1, ty + 1, k[2]); p.set(cx, ty + 1, k[2]); p.set(cx - 1, ty + 3, a[3]); } });
idK('body', 'id_maid', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, w = s.w, o = s.o;
  for (let x = tx0; x <= R; x++) { p.set(x, ty, w[(x % 2) ? 4 : 3]); } if (!side) { p.set(tx0 - 1, ty, w[3]); p.set(R + 1, ty, w[3]); p.set(tx0 - 1, ty + 1, w[2]); p.set(R + 1, ty + 1, w[2]); }
  if (up) { const h = Math.max(2, th - 4); for (let y = ty + 1; y < ty + 1 + h; y++) { const hw = Math.max(0, Math.round(1.5 - Math.abs(y - (ty + 1 + h / 2)) / h * 2)); for (let x = cx - 1 - hw; x <= cx + hw; x++) p.set(x, y, idSkin(A, 2 + (x === cx - 1 - hw ? -1 : 0))); } return; }
  if (side) { p.set(cx + d, ty + 1, o[3]); return; }
  p.hl(cx - 2, ty + 1, 4, w[4]); p.set(cx - 2, ty + 2, o[3]); p.set(cx + 1, ty + 2, o[3]); p.set(cx - 1, ty + 2, o[2]); p.set(cx, ty + 2, o[2]); p.set(cx - 1, ty + 3, o[1]); p.set(cx, ty + 3, o[1]);
  p.hl(tx0, ty + th - 2, tw, w[3]); for (let x = tx0; x <= R; x += 3) p.set(x, ty + th - 2, s.g[3]); });

// ----- piernas (faldas, medias y botas largas) -----
// recolorea lo que quede de pierna (colores de m) bajo el dobladillo: hueco de piel y luego medias o botas
const idHem = (A, fr) => A.legTop + Math.max(2, Math.round((A.base - A.legTop) * fr));
function idLegsBelow(p, A, m, hem, gap, sock, bootFrom, boot) { const ix = new Map(m.map((c, i) => [c, i])), bot = A.base - 2;
  for (let y = hem + 1; y <= bot; y++) for (let x = 0; x < p.w; x++) { const i = ix.get(p.get(x, y)); if (i === undefined) continue; const k = y - hem - 1;
    if (k < gap) p.set(x, y, idSkin(A, i)); else if (boot && y >= bootFrom) p.set(x, y, boot[Math.min(4, i + 1)]); else if (sock) p.set(x, y, sock[i]); else p.set(x, y, idSkin(A, i)); } }
function idSkirtShape(p, A, hem, flare, col) { const { tx0, tw, cx, side, legTop } = A, R = tx0 + tw - 1; for (let y = legTop; y <= hem; y++) { const e = Math.round((y - legTop) * flare / Math.max(1, hem - legTop)), x0 = (side ? cx - 4 : tx0 - 1) - e, x1 = (side ? cx + 3 : R + 1) + e; for (let x = x0; x <= x1; x++) p.set(x, y, col(x, y, x === x0, x === x1, y === hem)); } }
idK('legs', 'id_plaid', (p, A, s) => { const m = s.m, a = s.a, y_ = s.y, hem = idHem(A, 0.4); idLegsBelow(p, A, m, hem, 2, s.k, 0, null);
  idSkirtShape(p, A, hem, A.side ? 1 : 2, (x, y, l, r, h) => h ? a[0] : ((x % 4 === 0) ? y_[3] : (y % 3 === 0) ? a[1] : l ? a[3] : r ? a[1] : ((x + y) % 2 ? a[2] : a[3]))); });
idK('legs', 'id_volantes_f', (p, A, s) => { const m = s.m, a = s.a, hem = idHem(A, 0.45); idLegsBelow(p, A, m, hem, 99, null, 0, null);
  idSkirtShape(p, A, hem, A.side ? 2 : 3, (x, y, l, r, h) => h ? ((x % 2) ? a[3] : a[2]) : (y === A.legTop + 2) ? ((x % 2) ? m[4] : m[1]) : l ? m[4] : r ? m[1] : ((x + y) % 3 === 0 ? m[2] : m[3])); });
idK('legs', 'id_diva_f', (p, A, s) => { const m = s.m, a = s.a, k = s.k, hem = idHem(A, 0.4); idLegsBelow(p, A, m, hem, 2, k, 0, null);
  idSkirtShape(p, A, hem, A.side ? 1 : 2, (x, y, l, r, h) => h ? a[3] : (x % 2 && y > A.legTop) ? k[1] : l ? k[3] : k[2]); });
idK('legs', 'id_mini', (p, A, s) => { const m = s.m, a = s.a || s.m, hem = idHem(A, 0.3); idLegsBelow(p, A, m, hem, 99, null, 0, null);
  idSkirtShape(p, A, hem, 1, (x, y, l, r, h) => y === A.legTop ? a[1] : h ? m[1] : l ? m[3] : r ? m[1] : m[2]); if (!A.side && !A.up) p.set(A.cx, A.legTop, a[4]); });
idK('legs', 'id_rosa_f', (p, A, s) => { const m = s.m, f = s.f, hem = idHem(A, 0.3), wf = A.base - Math.round((A.base - hem) * 0.55);
  idLegsBelow(p, A, m, hem, 99, null, 0, null);
  for (let y = wf; y <= A.base - 3; y++) { const xs = []; for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (A.sk.includes(c)) xs.push(x); } for (const x of xs) { p.set(x, y, f[(x + y) % 3 ? 3 : 4]); if (!xs.includes(x - 1) && x - 1 >= 0 && !uA(p.get(x - 1, y))) p.set(x - 1, y, f[2]); if (!xs.includes(x + 1) && x + 1 < p.w && !uA(p.get(x + 1, y))) p.set(x + 1, y, f[2]); } }
  idSkirtShape(p, A, hem, 1, (x, y, l, r, h) => y === A.legTop ? f[4] : h ? m[1] : (x % 3 === 0 ? m[3] : m[2])); });
idK('legs', 'id_cuadros', (p, A, s) => { const m = s.m, k = s.k, w = s.w, hem = idHem(A, 0.4), bf = A.base - Math.round((A.base - hem) * 0.5); idLegsBelow(p, A, m, hem, 0, k, bf, w);
  idSkirtShape(p, A, hem, A.side ? 1 : 2, (x, y, l, r, h) => y === A.legTop ? k[1] : (((x >> 1) + y) % 2 ? w[4] : k[1])); });
idK('legs', 'id_maid_f', (p, A, s) => { const m = s.m, w = s.w, g = s.g, hem = idHem(A, 0.45); idLegsBelow(p, A, m, hem, 1, s.k, 0, null);
  idSkirtShape(p, A, hem, A.side ? 2 : 3, (x, y, l, r, h) => h ? w[(x % 2) ? 4 : 3] : (y === hem - 1) ? ((x % 4 === 1) ? g[4] : w[2]) : (y === A.legTop + 2 && (x * 3) % 7 === 0) ? g[3] : l ? m[3] : r ? m[1] : m[2]); });
// ----- cabeza: horquillas de estrella -----
fitKind('head', 'id_horquillas', (p, A, s) => { const g = s.m, y = Math.round(A.headTop + A.hry * 0.55); for (const sx of A.side ? [A.hx + (A.d > 0 ? -A.hrx + 1 : A.hrx - 1)] : [A.hx - A.hrx + 1, A.hx + A.hrx - 1]) { const x = Math.round(sx); p.set(x, y, g[4]); p.set(x - 1, y, g[3]); p.set(x + 1, y, g[3]); p.set(x, y - 1, g[3]); p.set(x, y + 1, g[2]); } });

// ----- mangas: abullonadas, sueltas (de diva), sin mangas; guantes -----
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const T_ = L && L.top, M = p.meta; if (!T_ || !M || !ID_KINDS.has(T_.k) || !T_.sl) return r;
  const ix = new Map(T_.m.map((c, i) => [c, i])), A = M, groups = [[], []];
  if (p.t) { for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const i = y * p.w + x; if (p.t[i] === 3 && uA(p.d[i])) groups[M.side ? 0 : (x < M.cx ? 0 : 1)].push([x, y]); } }
  else if (!M.side) { const R = M.tx0 + M.tw - 1, y1 = M.torsoTop + M.th + (M.al || 7); for (let y = M.torsoTop; y <= y1; y++) for (let x = 0; x < p.w; x++) { if (x >= M.tx0 && x <= R) continue; if (uA(p.get(x, y)) && (ix.has(p.get(x, y)) || M.sk.includes(p.get(x, y)))) groups[x < M.cx ? 0 : 1].push([x, y]); } }
  for (const G_ of groups) { if (!G_.length) continue; let ya = 1e9, yb = -1; for (const [, y] of G_) { if (y < ya) ya = y; if (y > yb) yb = y; } const H = Math.max(1, yb - ya);
    for (const [x, y] of G_) { const t = (y - ya) / H, c = p.get(x, y), i = ix.get(c); let keep = true;
      if (T_.sl === 'bare') keep = false; else if (T_.sl === 'puff') keep = t < 0.3; else if (T_.sl === 'det') keep = t >= 0.4;
      if (i !== undefined && !keep) p.set(x, y, idSkin(A, i)); if (T_.sl === 'det' && i !== undefined && Math.abs(t - 0.4) < 0.08 && T_.a) p.set(x, y, T_.a[3]);
      if (T_.gl && y >= yb - 2 && y < yb) p.set(x, y, T_.gl[2 + (x % 2)]); }
    if (T_.sl === 'puff' && !M.side) { for (const [x, y] of G_) if (y === ya + 1) { const o = x < M.cx ? x - 1 : x + 1; if (o >= 0 && o < p.w && !uA(p.get(o, y))) p.set(o, y, T_.m[4]); } } } } catch (e) { } return r; }; }

// ----- los 8 trajes -----
const IDOL_SETS = [
  { k: 'escolar', n: L2('Uniforme Escolar de Idol', 'Idol School Uniform'), price: 26000, body: () => ({ k: 'id_uniforme', m: IDP.blanco, v: IDP.marino, a: IDP.rojo, y: IDP.oro, sl: 'puff', gl: IDP.negro }), legs: () => ({ k: 'id_plaid', m: IDP.rojo, a: IDP.rojo, y: IDP.oro }), feet: () => ({ k: 'boots', m: IDP.negro }) },
  { k: 'escenario', n: L2('Vestido Blanco de Escenario', 'White Stage Dress'), price: 30000, body: () => ({ k: 'id_volantes', m: IDP.blanco, a: IDP.azul, sl: 'puff', gl: IDP.blanco }), legs: () => ({ k: 'id_volantes_f', m: IDP.blanco, a: IDP.azul }), feet: () => ({ k: 'boots', m: IDP.blanco }) },
  { k: 'peluche', n: L2('Chaqueta Peluda de Pop', 'Fluffy Pop Jacket'), price: 28000, body: () => ({ k: 'id_peluche', m: IDP.rosa, c: IDP.lila, a: IDP.plata, cuff: IDP.blanco }), legs: () => ({ k: 'id_mini', m: IDP.negro, a: IDP.plata }), feet: () => ({ k: 'boots', m: IDP.negro }) },
  { k: 'diva', n: L2('Traje de Diva Virtual', 'Virtual Diva Outfit'), price: 32000, body: () => ({ k: 'id_diva', m: IDP.gris, a: IDP.violeta, sl: 'det' }), legs: () => ({ k: 'id_diva_f', m: IDP.negro, a: IDP.violeta }), feet: () => ({ k: 'boots', m: IDP.negro }) },
  { k: 'estrella', n: L2('Top de Estrella Plateada', 'Silver Star Top'), price: 24000, body: () => ({ k: 'id_estrella', m: IDP.blanco, w: IDP.plata, sl: 'bare' }), legs: () => ({ k: 'id_mini', m: IDP.rosa, a: IDP.plata }), feet: () => ({ k: 'boots', m: IDP.blanco }), head: () => ({ k: 'id_horquillas', m: IDP.plata }) },
  { k: 'rosa', n: L2('Conjunto Rosa Peluche', 'Pink Fluffy Set'), price: 28000, body: () => ({ k: 'id_rosa', m: IDP.rosa, f: IDP.blanco, sl: 'bare' }), legs: () => ({ k: 'id_rosa_f', m: IDP.rosa, f: IDP.rosa }), feet: () => ({ k: 'boots', m: IDP.negro }) },
  { k: 'robot', n: L2('Armadura de Idol Robot', 'Robot Idol Armour'), price: 34000, body: () => ({ k: 'id_robot', m: IDP.blanco, a: IDP.azul, sl: 'bare', gl: IDP.blanco }), legs: () => ({ k: 'id_cuadros', m: IDP.negro, w: IDP.blanco }), feet: () => ({ k: 'boots', m: IDP.blanco }) },
  { k: 'maid', n: L2('Vestido Maid de Estrellas', 'Starry Maid Dress'), price: 32000, body: () => ({ k: 'id_maid', m: IDP.negro, w: IDP.blanco, o: IDP.naranja, g: IDP.oro, cuff: IDP.blanco }), legs: () => ({ k: 'id_maid_f', m: IDP.negro, w: IDP.blanco, g: IDP.oro }), feet: () => ({ k: 'boots', m: IDP.negro }) }];
const ID_BLACK = { id_plaid: 1, id_diva_f: 1, id_diva: 1, id_robot: 1, id_cuadros: 1, id_maid_f: 1 };
for (const S of IDOL_SETS) { const src = { src: L2('Estilista Mio, sala STELLA☆LINK (Akihabara, Japón)', 'Stylist Mio, STELLA☆LINK hall (Akihabara, Japan)') };
  for (const [slot, part] of [['body', 'v'], ['legs', 'f'], ['feet', 'b'], ['head', 'h']]) { const fn = S[slot === 'body' ? 'body' : slot]; if (!fn) continue; const id = 'c_idol_' + S.k + '_' + part, nm = S.n + ' · ' + { v: L2('parte de arriba', 'top'), f: L2('falda', 'skirt'), b: L2('botas', 'boots'), h: L2('horquillas', 'hair clips') }[part];
    cosm(id, nm, slot, fn, src); it('cosi_' + id, { n: nm, t: 'cos', cos: id, price: Math.round(S.price / 3), icon: ['hanger'], rar: 3 }); } }
// la paleta negra de los tipos que la usan va en s.k (se añade al pedir el aspecto)
for (const k of Object.keys(ID_BLACK)) { const F0 = FITK[k === 'id_diva' || k === 'id_robot' ? 'body' : 'legs'][k], d0 = F0.draw; F0.draw = (p, A, s) => d0(p, A, Object.assign({}, s, { k: IDP.negro })); }

// ----- estilista Mio en la sala de conciertos -----
NPCS.jp_moda = { n: L2('Estilista Mio', 'Stylist Mio'), title: L2('Ropa de idol', 'Idol fashion'), look: LK({ g: 'f' }), lines: [jlTxt(['かわいい衣装、あるよ！', 'Kawaii ishō, aru yo!', '¡Tengo trajes de idol monísimos! Valen para cualquier figura.', 'I have super cute idol outfits! They fit any figure.'])], quests: [] }; JP_NPC_LOOK.jp_moda = 4;
{ const _ml = makeLive; makeLive = function () { const had = G.maps.jp_live_in, M = _ml.apply(this, arguments); if (!had) spawnNPC('jp_moda', 26 * 16 + 8, 19 * 16 + 8, M.id, { face: 'left' }); return M; }; }
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!P || npc.id !== 'jp_moda') return;
  for (const S of IDOL_SETS.slice().reverse()) opts.unshift({ label: '👗 ' + S.n + ' · ' + S.price.toLocaleString() + L2(' oro', ' gold'), icon: ['hanger'], fn: () => { if (P.gold < S.price) { typeText(L2('No te llega el oro.', 'Not enough gold.')); return; } P.gold -= S.price; sfx('coin');
    for (const part of ['v', 'f', 'b', 'h']) if (COSM['c_idol_' + S.k + '_' + part]) giveItem('cosi_c_idol_' + S.k + '_' + part, 1); markDirty();
    typeText(L2('¡Aquí tienes el ', 'Here is the ') + S.n + L2('! Ya está en tu armario.', '! It is already in your wardrobe.')); } }); });

if (typeof GSIS !== 'undefined') GSIS.push(['jp_moda', '👗 ' + L2('Japón: ropa de idol', 'Japan: idol clothes'), () => [
  L2('La estilista Mio, en la sala de conciertos STELLA☆LINK de Akihabara (junto a la salida), vende 8 trajes de idol. Cada traje trae la parte de arriba, la falda y las botas (y el de estrella, unas horquillas). Van directos a tu armario (Vestuario).', 'Stylist Mio, in the STELLA☆LINK concert hall in Akihabara (by the exit), sells 8 idol outfits. Each one includes the top, the skirt and the boots (and the star one, hair clips). They go straight to your wardrobe.'),
  L2('Trajes: Uniforme Escolar de Idol (camisa, chaleco, corbata y falda de cuadros, guantes), Vestido Blanco de Escenario (volantes y lazos azules), Chaqueta Peluda de Pop, Traje de Diva Virtual (violeta, mangas sueltas), Top de Estrella Plateada, Conjunto Rosa Peluche (calentadores), Armadura de Idol Robot (falda de cuadros) y Vestido Maid de Estrellas.', 'Outfits: Idol School Uniform (shirt, vest, tie and plaid skirt, gloves), White Stage Dress (frills and blue bows), Fluffy Pop Jacket, Virtual Diva Outfit (violet, detached sleeves), Silver Star Top, Pink Fluffy Set (leg warmers), Robot Idol Armour (checkered skirt) and Starry Maid Dress.'),
  L2('Se adaptan a todas las estructuras de cuerpo, de chica y de chico. Precio: de 24.000 a 34.000 de oro.', 'They fit every body structure, female and male. Price: 24,000 to 34,000 gold.')],
  () => ({ loc: [161, 77], t: L2('Sala STELLA☆LINK', 'STELLA☆LINK hall'), m: 'japon' })],
  ['jp_ideas', '💡 ' + L2('Japón: ideas para las próximas versiones', 'Japan: ideas for upcoming versions'), () => [
  L2('Ideas propuestas para seguir ampliando Japón (pídelas cuando quieras):', 'Ideas proposed to keep expanding Japan (ask for them whenever you like):'),
  L2('· Más sitios en los que entrar: un onsen (baños termales), un café de gatos y una tienda de kimonos.', '· More places to enter: an onsen (hot springs), a cat café and a kimono shop.'),
  L2('· Historia propia de las idols STELLA☆LINK (misiones con cada una).', '· A story of their own for the STELLA☆LINK idols (quests with each one).'),
  L2('· Romance con las idols (enamorarlas como a otras parejas del juego).', '· Romance with the idols (woo them like other partners in the game).')],
  () => null]);
