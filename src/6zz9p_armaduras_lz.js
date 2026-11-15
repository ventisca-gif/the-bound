// ================= v4.72: ARMADURAS DE LAS TIERRAS SIN PINTAR (conceptos de Sergio, tiers 27-30) =================
// Un traje por clase como en la hoja de conceptos: crema, morado, negro y oro. Se dibujan con fitKind y las medidas del
// cuerpo (tx0, tw, torsoTop, th, legTop, base…), así se ajustan solas a las 8 estructuras. Cada tier cambia el tono:
// 27 tiza, 28 trazo (lila), 29 cal (crema cálida), 30 lienzo (blanco con morado vivo y oro).
// - Bardo: abrigo largo crema, bufanda morada, centro negro, clave de sol en la espalda, cinturón dorado con bolsa.
// - Mago: túnica larga crema abierta sobre negro con ribetes de oro, colgante de cristal morado, círculo en la espalda.
// - Guerrero: placas de cal agrietadas con vetas moradas, hombreras grandes, faldones y capa morada hecha jirones.
// - Pez: manto de escamas lila con cuello de pelo blanco y perla. Ninja (asesino): negro, correas cruzadas y bufanda morada.
// - Invocador: capa crema sobre túnica negra con el círculo morado y talismanes colgando. Arquero (no estaba): túnica crema.
// La cabeza va descubierta como en los conceptos (se ve el peinado).
const LZA = {
  27: { c: P5(['#5a5464', '#8a8496', '#bab4c6', '#e2dcec', '#fbf8ff']), s: P5(['#2a1440', '#4a2470', '#6a3aa0', '#9a6ad0', '#d0b0ff']) },
  28: { c: P5(['#4a4060', '#7a6e96', '#aaa0c8', '#d8d0ec', '#f8f4ff']), s: P5(['#24103a', '#3e1a66', '#5e2c98', '#8e58cc', '#c8a0ff']) },
  29: { c: P5(['#5a5444', '#8a8470', '#bab4a0', '#e4dece', '#fffcf2']), s: P5(['#2a1238', '#4a2066', '#6e3496', '#9c62c8', '#d4b2f4']) },
  30: { c: P5(['#605a70', '#9890a8', '#c8c0d8', '#ece8f6', '#ffffff']), s: P5(['#300a50', '#5a1890', '#8a30d0', '#b868f0', '#e8c8ff']) },
};
const LZ_DARK = P5(['#0e0a14', '#1a1424', '#2a2236', '#3a3048', '#4e4460']);
const lzp = s => LZA[s.t] || LZA[27];
const lzScarf = (p, A, S, tail) => { const { tx0, tw, torsoTop: ty, cx, side, up, d } = A, R = tx0 + tw - 1;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, S[x & 1 ? 3 : 2]); p.set(x, ty, S[x & 1 ? 2 : 1]); }
  if (!tail) return; if (side) { for (let k = 0; k < 6; k++) p.set(cx - d * (2 + (k >> 1)), ty + 1 + k, S[k & 1 ? 1 : 2]); return; }
  const sx = up ? R : tx0; for (let k = 0; k < 5; k++) { p.set(sx, ty + 1 + k, S[k & 1 ? 1 : 3]); p.set(sx + (up ? -1 : 1), ty + 1 + k, S[2]); } };
const lzTails = (p, A, col, inner) => { const { tx0, tw, torsoTop: ty, th, legTop, base, side, up, cx, d } = A, R = tx0 + tw - 1, y1 = Math.min(base - 2, legTop + 6);
  for (let y = ty + th - 1; y < y1; y++) { if (up) { for (let x = tx0; x <= R; x++) p.set(x, y, col[(x + y) % 5 ? 2 : 1]); continue; }
    if (side) { for (let i = 0; i < 3; i++) p.set(cx - d * (1 + i), y, col[i === 0 ? 3 : 2]); continue; }
    for (const x of [tx0, tx0 + 1, R - 1, R]) p.set(x, y, col[x === tx0 || x === R ? 2 : 3]); if (inner) for (let x = tx0 + 2; x <= R - 2; x++) p.set(x, y, inner[(x + y) % 4 ? 2 : 1]); } };
const lzShoulders = (p, A, col, r) => { const { tx0, tw, torsoTop: ty, cx, side, d } = A; if (side) { p.ball(cx - 1 - d, ty + 1.5, r, r * 0.8, col.slice(1)); return; } for (const sx of [tx0 - 1, tx0 + tw]) p.ball(sx, ty + 1.5, r, r * 0.8, col.slice(1)); };

fitKind('body', 'lz_bardo', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  if (!up && !side) for (let y = ty + 1; y < ty + th - 2; y++) { p.set(cx - 1, y, LZ_DARK[2]); p.set(cx, y, LZ_DARK[1]); }
  lzTails(p, A, Cc, up ? null : LZ_DARK); lzScarf(p, A, S, true);
  p.hl(tx0, ty + th - 2, tw, GOLD[2]); if (!up && !side) { p.set(cx, ty + th - 2, GOLD[4]); p.rect(R - 2, ty + th - 1, 2, 2, C('#6a4a2a')); }
  if (up) { const y0 = ty + th; p.vl(cx, y0, 4, LZ_DARK[1]); p.set(cx + 1, y0, LZ_DARK[1]); p.set(cx - 1, y0 + 2, LZ_DARK[1]); p.set(cx + 1, y0 + 3, LZ_DARK[1]); } });
fitKind('body', 'lz_mago', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  if (!up && !side) for (let y = ty; y < ty + th; y++) { for (let x = cx - 2; x <= cx + 1; x++) p.set(x, y, LZ_DARK[x === cx - 2 || x === cx + 1 ? 2 : 1]); p.set(cx - 3, y, GOLD[3]); p.set(cx + 2, y, GOLD[3]); }
  lzTails(p, A, Cc, up ? null : LZ_DARK);
  if (!up && !side) { const yb = Math.min(A.base - 3, A.legTop + 5); for (let y = ty + th; y < yb; y++) { p.set(cx - 3, y, GOLD[2]); p.set(cx + 2, y, GOLD[2]); } p.ball(cx - 0.5, ty + 3, 1.2, 1.5, S.slice(2)); p.set(cx, ty + 2, C('#ffffff')); }
  if (up) p.ball(cx - 0.5, ty + th + 1, 2.5, 2.5, [LZ_DARK[1], LZ_DARK[1], Cc[3], Cc[3]]);
  p.hl(tx0, ty + th - 2, tw, LZ_DARK[1]); if (!side && !up) p.set(cx, ty + th - 2, GOLD[4]); for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty - 1, Cc[x & 1 ? 3 : 4]); });
fitKind('body', 'lz_guerrero', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  lzShoulders(p, A, Cc, 3.3);
  if (!side) for (const sx of [tx0 - 2, R + 2]) { p.set(sx, ty + 1, S[3]); p.set(sx + (sx < cx ? 1 : -1), ty + 2, S[2]); }
  for (let y = ty + 1; y < ty + th - 2; y++) { const x = tx0 + 1 + ((y * 3) % Math.max(2, tw - 2)); p.set(x, y, S[3]); if (y % 2) p.set(x + 1, y, S[2]); }
  if (!up && !side) { p.set(cx - 1, ty + 2, Cc[4]); p.set(cx, ty + 2, Cc[4]); p.set(cx - 1, ty + 3, S[4]); }
  p.hl(tx0, ty + th - 2, tw, LZ_DARK[1]); if (!side) p.set(cx, ty + th - 2, GOLD[4]);
  for (let x = tx0; x <= R; x++) { const n = 2 + ((x * 5) % 3); for (let k = 0; k < n; k++) if (!side || x % 2) p.set(x, ty + th - 1 + k, S[k === n - 1 ? 1 : 2]); } });
fitKind('body', 'lz_pez', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  const scale = (x, y) => ((x + (y >> 1)) % 3 === 0) ? S[3] : ((x + y) & 1) ? Cc[3] : Cc[2];
  for (let y = ty; y < ty + th; y++) for (let x = tx0; x <= R; x++) { const edge = x <= tx0 + 1 || x >= R - 1; if (up || side || edge) p.set(x, y, scale(x, y)); }
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, x & 1 ? C('#ffffff') : Cc[4]); p.set(x, ty, Cc[4]); }
  lzTails(p, A, [S[0], S[1], S[2], S[3], S[4]], null);
  if (!up && !side) { p.ball(cx - 0.5, ty + 3, 1.2, 1.2, [C('#c8c0d8'), C('#e8e4f0'), C('#ffffff'), C('#ffffff')]); p.set(R - 1, ty + 2, C('#ff8a8a')); p.set(R - 1, ty + 3, C('#e06a6a')); } });
fitKind('body', 'lz_ninja', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1, G2 = C('#8a8494'), G3 = C('#b8b2c4');
  if (!side) { p.line(tx0, ty + 1, R, ty + th - 3, G2); p.line(R, ty + 1, tx0, ty + th - 3, G2); if (!up) p.set(cx, ty + Math.round((th - 4) / 2) + 1, G3); }
  p.hl(tx0, ty + th - 2, tw, G2); if (!side && !up) p.set(cx - 1, ty + th - 2, G3); lzScarf(p, A, S, true); });
fitKind('body', 'lz_invocador', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  for (let y = ty; y < ty + th; y++) if (!side) { p.set(tx0, y, Cc[3]); p.set(R, y, Cc[2]); }
  for (let x = tx0 - 1; x <= R + 1; x++) p.set(x, ty - 1, Cc[x & 1 ? 3 : 4]);
  lzTails(p, A, Cc, up ? null : LZ_DARK);
  const em = (x0, y0, r) => { for (let a = 0; a < 12; a++) p.set(Math.round(x0 + Math.cos(a / 12 * 6.28) * r), Math.round(y0 + Math.sin(a / 12 * 6.28) * r), S[3]); p.set(Math.round(x0), Math.round(y0), S[4]); };
  if (!side) em(cx - 0.5, up ? ty + th + 1 : ty + th - 4, up ? 2.6 : 1.8);
  p.hl(tx0, ty + th - 2, tw, GOLD[2]); if (!up && !side) for (const tx of [tx0 + 1, R - 1]) { p.set(tx, ty + th - 1, Cc[4]); p.set(tx, ty + th, Cc[3]); p.set(tx, ty + th + 1, LZ_DARK[1]); } });
fitKind('body', 'lz_arquero', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, { c: Cc, s: S } = lzp(s), R = tx0 + tw - 1;
  if (!side) { p.line(tx0, ty, R, ty + th - 3, C('#6a4a2a')); p.line(tx0 + 1, ty, R, ty + th - 4, C('#8a6a3a')); }
  p.hl(tx0, ty + th - 2, tw, LZ_DARK[1]); if (!up && !side) p.set(cx, ty + th - 2, GOLD[4]); lzScarf(p, A, S, false); });
fitKind('legs', 'lz_wrap', (p, A, s) => { const cols = new Set(s.m); for (let y = A.legTop + 2; y < A.base - 2; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; if ((y - A.legTop) % 3 === 0) p.set(x, y, C('#8a8494')); } });

const LZA_CLS = { bardo: 'lz_bardo', mago: 'lz_mago', guerrero: 'lz_guerrero', pez: 'lz_pez', asesino: 'lz_ninja', invocador: 'lz_invocador', arquero: 'lz_arquero' };
function lzaVis(cls, slot, t) { const V = LZA[t]; if (!V) return null; const k = LZA_CLS[cls] || 'lz_arquero';
  if (slot === 'body') return { k, m: k === 'lz_ninja' || k === 'lz_invocador' || k === 'lz_pez' ? LZ_DARK : V.c, s: V.s, t };
  if (slot === 'legs') return cls === 'guerrero' ? { k: 'greaves', m: V.c, s: V.s } : { k: 'lz_wrap', m: LZ_DARK, s: V.s };
  if (slot === 'feet') return cls === 'guerrero' ? { k: 'sabatons', m: V.c } : { k: 'boots', m: LZ_DARK };
  if (slot === 'head') return null;
  return null; }
{ const _gv = gearVis; gearVis = function (cls, slot, t) { if (t >= 27 && t <= 30) { const v = lzaVis(cls, slot, t); if (v || slot === 'head') return v; } return _gv(cls, slot, t); }; }
// capa morada hecha jirones (guerrero) y bufanda morada (asesino) con la armadura del Lienzo
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments); const t = gear && gear.body; if (!(t >= 27 && t <= 30) || !L) return L; const V = LZA[t]; cos = cos || {};
    const evo = app && app.evo && typeof EVO !== 'undefined' && EVO[app.evo];
    if (!(cos.back && COSM[cos.back]) && !evo) L.back = cls === 'guerrero' ? { k: 'cape', o: V.s, i: LZ_DARK, tr: V.s } : cls === 'asesino' ? null : { k: 'cape', o: V.c, i: V.s, tr: GOLD.slice(1) };   // sin el manto celeste de Celestia
    if (cls === 'asesino' && !(cos.back && COSM[cos.back])) L.scarf = V.s;
    return L; }; }
// el revisor de ajuste también prueba los tiers nuevos
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); const cls = ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez'];
    for (const c of cls) for (const t of [27, 28, 29, 30]) for (const slot of ['head', 'body', 'legs', 'feet']) { const it = { id: `${c}:${slot}:${t}`, kind: 'gear', cls: c, slot, t }; if (!only || it.id.includes(only)) out.push(it); } return out; }; }
