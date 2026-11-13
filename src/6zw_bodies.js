// ================= v4.4: ESTRUCTURAS DE CUERPO Y CABEZA =================
// 4 estructuras por sexo (la 0 es la de siempre). Cada una cambia proporciones (torso, piernas, brazos, cabeza),
// forma de la mandíbula, ojos, boca y silueta del torso. Todo lo demás (ropa, armaduras, cosméticos, pelo, armas)
// se dibuja con las mismas medidas, así que se adapta solo. Los NPCs y los enemigos humanos reciben una estructura
// fija según su aspecto, para que haya variedad.
// Campos: tw/sw ancho del torso de frente/de lado, th alto del torso, lh piernas, lw ancho de pierna, al/aw brazos,
// hrx/hry radios de la cabeza, jaw mandíbula (2 = redonda, más = cuadrada), eye estilo de ojos, eg separación extra,
// ey/mo/bang/lift/vol cara (ver FACE), mw boca de 1 px, lip labios, blush 0 sin rubor, taper espalda en V,
// belly barriga, hips caderas, waist 0 sin cintura / 2 cintura marcada.
const BODY_T = {
  m: [
    { n: ['Clásico', 'Classic'] },
    { n: ['Héroe', 'Hero'], tw: 11, sw: 9, th: 9, lh: 6, hrx: 8, hry: 8, jaw: 2.8, eye: 'hero', eg: 0, ey: 2, mo: 3, bang: 0.6, mw: 1, mtone: 1, blush: 0 },   // idéntico a la referencia de Sergio
    { n: ['Atlético', 'Athletic'], tw: 12, sw: 9, th: 9, lh: 9, aw: 3, al: 7, hrx: 7.5, hry: 7.6, jaw: 2.8, eye: 'sharp', ey: 2, mo: 4, mw: 1, blush: 0, taper: 1 },
    { n: ['Robusto', 'Sturdy'], tw: 12, sw: 10, th: 9, lh: 7, lw: 4, aw: 3, al: 6, hrx: 8.2, hry: 7.8, jaw: 2.6, eye: 'soft', ey: 3, mo: 4, blush: 0, belly: 1 },
  ],
  f: [
    { n: ['Clásica', 'Classic'], bust: 2 },
    { n: ['Esbelta', 'Slender'], bust: 1, tw: 8, sw: 7, th: 8, lh: 9, al: 7, hry: 7.8, eye: 'lash' },
    { n: ['Curvas', 'Curvy'], tw: 10, sw: 8, th: 8, lh: 8, eye: 'lash', waist: 2, hips: 1, lip: 1, bust: 3 },
    { n: ['Menuda', 'Petite'], tw: 8, sw: 7, th: 7, lh: 6, al: 5, hry: 8.4, eye: 'big', ey: 3, mo: 4, bang: 3, bust: 1 },
  ],
};
function bodySpec(g, bt) { const T = BODY_T[g === 'm' ? 'm' : 'f']; bt = bt | 0; return bt > 0 && T[bt] ? T[bt] : null; }
function bodyName(g, bt) { const S = BODY_T[g === 'm' ? 'm' : 'f'][bt | 0] || BODY_T.f[0]; return LANG_EN ? S.n[1] : S.n[0]; }

// ---- ojos de cada estructura (misma posición que los ojos chibi: ex..ex+1, filas ey-1..ey+2) ----
function bodyEye(p, style, ex, ey, outer, ec, brow, dark) {
  const W = C('#ffffff'), ed = uMul(ec, 0.5), pup = uMix(ed, dark, 0.5), ref = uMix(ec, W, 0.4);
  if (style === 'hero') {   // igual que la referencia: ceja de 3 px color pelo (sale 1 px hacia fuera), 1 fila de piel, ojo 2x2 con brillo arriba a la izquierda
    const bx = outer < ex ? ex - 1 : ex; p.hl(bx, ey - 2, 3, brow);
    p.set(ex, ey, uMix(W, ec, 0.12)); p.set(ex + 1, ey, ec); p.set(ex, ey + 1, uMix(ec, dark, 0.18)); p.set(ex + 1, ey + 1, uMix(ec, dark, 0.32));
  } else if (style === 'sharp') {   // mirada afilada: párpado inclinado, ojo estrecho
    p.set(outer, ey - 2, dark); p.set(ex, ey - 1, dark); p.set(ex + 1, ey - 1, dark); p.set(outer, ey - 1, dark);
    p.set(ex, ey, ec); p.set(ex + 1, ey, pup); p.set(ex, ey + 1, ed); p.set(ex + 1, ey + 1, uMix(ed, ec, 0.5));
  } else if (style === 'soft') {   // mirada amable: cejas gruesas arriba, ojo 2x2 con brillo
    p.set(ex, ey - 2, brow); p.set(ex + 1, ey - 2, brow);
    p.set(ex, ey, W); p.set(ex + 1, ey, pup); p.set(ex, ey + 1, ec); p.set(ex + 1, ey + 1, ed);
  } else {   // 'lash' y 'big': ojos chibi 2x3 con pestañas largas
    p.set(ex, ey - 1, dark); p.set(ex + 1, ey - 1, dark); p.set(outer, ey - 1, dark); p.set(outer, ey, dark);
    p.set(ex, ey, W); p.set(ex + 1, ey, ed); p.set(ex, ey + 1, ec); p.set(ex + 1, ey + 1, pup); p.set(ex, ey + 2, ref); p.set(ex + 1, ey + 2, ec);
    if (style === 'big') { p.set(outer, ey - 2, dark); p.set(ex + 1, ey + 1, uMix(pup, W, 0.25)); p.set(outer, ey + 2, uMix(ec, dark, 0.6)); }
  }
}
// ---- silueta del torso: espalda en V, barriga, caderas, cintura marcada ----
function bodyTorsoShape(p, S, o) {
  const { tx0, ty, tw, th, side, up, fem, d, m } = o, R = tx0 + tw - 1;
  if (S.taper && !side) for (let y = ty + 4; y < ty + th; y++) { p.set(tx0, y, 0); p.set(R, y, 0); }
  if (S.belly) { if (!side) { for (let y = ty + 3; y < ty + th - 1; y++) { p.set(tx0 - 1, y, m[3]); p.set(R + 1, y, m[1]); } } else { const x = d > 0 ? R + 1 : tx0 - 1; for (let y = ty + 3; y < ty + th - 1; y++) p.set(x, y, m[2]); } }
  if (S.hips) { if (!side) { for (let y = ty + th - 2; y < ty + th; y++) { p.set(tx0 - 1, y, m[3]); p.set(R + 1, y, m[1]); } } else { const x = d > 0 ? tx0 - 1 : R + 1; for (let y = ty + th - 2; y < ty + th; y++) p.set(x, y, m[1]); } }
  if (S.waist === 2 && fem && !side) { for (const yy of [ty + th - 5, ty + th - 4, ty + th - 3]) { p.set(tx0, yy, 0); p.set(R, yy, 0); } if (!up) { p.set(tx0 + 1, ty + th - 4, m[1]); p.set(R - 1, ty + th - 4, m[1]); } }
}
// ---- busto (solo cuerpos femeninos): se sombrea sobre lo que ya lleva puesto el torso, así sirve para cualquier prenda ----
// bust 1 pequeño, 2 medio, 3 grande. De frente: brillo arriba, sombra debajo y escote; de lado: sale 1 px hacia delante.
let BUST_ON = true;
function bodyBust(p, S, o) {
  const { tx0, ty, tw, th, side, up, d } = o, n = (S && S.bust) || 2; if (!BUST_ON || up || th < 6) return;
  const K = C('#140c14'), Wt = C('#ffffff'), lit = (x, y, t) => { const c = p.get(x, y); if (c) p.set(x, y, uMix(c, Wt, t)); }, dk = (x, y, t) => { const c = p.get(x, y); if (c) p.set(x, y, uMix(c, K, t)); };
  const y0 = ty + 2, yb = y0 + (n >= 2 ? 2 : 1);   // fila del brillo y fila de la sombra de abajo
  if (side) {
    const fx = d > 0 ? tx0 + tw : tx0 - 1, ex = d > 0 ? tx0 + tw - 1 : tx0, rows = n >= 2 ? 2 : 1;
    for (let i = 0; i < rows; i++) { const y = y0 + i, c = p.get(ex, y); if (!c) continue; p.set(fx, y, i === 0 ? uMix(c, Wt, 0.12) : uMix(c, K, 0.12)); }
    if (n >= 3) { const c = p.get(ex, y0 + 1); if (c) p.set(fx + d, y0 + 1, uMix(c, K, 0.18)); }
    lit(ex, y0, 0.14); dk(ex, yb, 0.22); dk(ex - d, yb, 0.14); if (n >= 3) dk(fx, yb, 0.3);
    return;
  }
  // copas de 3 px a cada lado del eje; con ancho impar la columna central es el escote
  const odd = tw & 1, mid = tx0 + (tw >> 1), cw = n >= 2 ? 3 : 2;
  const Lb = odd ? mid - 1 : mid - 1, Ra = odd ? mid + 1 : mid, cups = [[Lb - cw + 1, Lb], [Ra, Ra + cw - 1]];
  const rows = n >= 3 ? 3 : 2, yu = y0 + rows - 1;   // fila de la curva de abajo
  for (const [a, b] of cups) {
    const inner = a === cups[0][0] ? b : a, outer = a === cups[0][0] ? a : b;
    for (let x = a; x <= b; x++) {
      lit(x, y0, x === outer ? 0.12 : 0.26);                     // brillo de la parte alta
      if (rows >= 3) lit(x, y0 + 1, x === outer ? 0.04 : 0.12);
      dk(x, yu + 1, x === outer ? 0.3 : 0.48);                   // sombra curva bajo cada copa
    }
    dk(outer, yu, 0.22); dk(inner, yu, 0.14);                    // laterales redondeados
  }
  if (odd) for (let y = y0; y <= yu; y++) dk(mid, y, y === y0 ? 0.3 : 0.42);   // escote
  else { dk(cups[0][1], yu, 0.2); dk(cups[1][0], yu, 0.2); }
}
// ---- dibujo: las medidas de la estructura se aplican solo mientras se dibuja ese fotograma ----
const BODY_KB = ['th', 'lh', 'lw', 'al', 'aw', 'hrx', 'hry'], BODY_KF = [['ey', 'ey'], ['mo', 'mouth'], ['bang', 'bang'], ['lift', 'lift'], ['vol', 'vol']];
function bodyWith(S, tw, fn) {
  if (!S) return fn();
  const B = BODYP.normal, sb = {}, sf = {};
  for (const k of BODY_KB) if (S[k] != null) { sb[k] = B[k]; B[k] = S[k]; }
  if (tw && S.tw != null) { sb.tw = B.tw; B.tw = S.tw; }
  for (const [k, f] of BODY_KF) if (S[k] != null) { sf[f] = FACE[f]; FACE[f] = S[k]; }
  try { return fn(); } finally { Object.assign(B, sb); Object.assign(FACE, sf); }
}
{ const _dh = drawHero; drawHero = function (p, L, ...a) { return bodyWith(L && L.btS, false, () => _dh(p, L, ...a)); }; }
{ const _dm = drawHumanoid; drawHumanoid = function (p, L, ...a) { return bodyWith(L && (!L.body || L.body === 'normal') ? L.btS : null, true, () => _dm(p, L, ...a)); }; }
// ---- apariencia del jugador: app.bt (0-3) viaja con la partida y en multijugador ----
{ const _na = normApp; normApp = function (a) { const o = _na(a); const bt = a ? a.bt | 0 : 0; if (bt > 0 && bt < BODY_T.m.length) o.bt = bt; return o; }; }
{ const _hl = heroLook; heroLook = function (cls, app, ...a) { const L = _hl(cls, app, ...a); const n = normApp(app), S = bodySpec(n.g, n.bt); if (S) { L.bt = n.bt; L.btS = S; } return L; }; }
// ---- NPCs y enemigos humanos: estructura fija según su aspecto (no cambia al cambiarse de ropa) ----
const BODY_NPC_OF = new Set(['tunic', 'ranger', 'apron', 'smith', 'sailor', 'rogue', 'knight', 'guard', 'darkknight', 'robe', 'royal', 'elder', 'dress', 'witch']);
function bodyHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function npcBodyFor(L) {
  if (L.bt === 0 || (L.body && L.body !== 'normal') || !BODY_NPC_OF.has(L.outfit || 'tunic') || L.mono) return null;
  const fem = L.g === 'f' || L.outfit === 'dress' || L.outfit === 'witch' || (L.g !== 'm' && L.hairStyle === 'long' && !L.beard);
  const key = JSON.stringify([L.skin && L.skin[2], L.hair && L.hair[2], L.hairStyle, L.eyes, fem, L.beard ? 1 : 0, L.ponytail ? 1 : 0]);
  return bodySpec(fem ? 'f' : 'm', bodyHash(key) % 4);
}
{ const _ba = buildAtlas; buildAtlas = function (L, set, draw) { if (L && (!draw || draw === drawHumanoid) && L.btS === undefined) { const S = npcBodyFor(L); if (S) L.btS = S; } return draw ? _ba(L, set, draw) : _ba(L, set); }; }
// ---- editor (creación y peluquería): fila «Estructura» bajo el sexo ----
{ const _ae = appEditorHTML; appEditorHTML = function (app, tabs) {
  let h = _ae(app, tabs); if (edTab !== 'cuerpo') return h;
  const n = normApp(app), T = BODY_T[n.g === 'm' ? 'm' : 'f'];
  const row = `<h4>${L2('Estructura', 'Build')} <small>${esc(bodyName(n.g, n.bt))}</small></h4><div class="chips">${T.map((S, i) => `<button class="chip ${(n.bt | 0) === i ? 'on' : ''}" data-ek="bt" data-ev="${i}">${esc(LANG_EN ? S.n[1] : S.n[0])}</button>`).join('')}</div>`;
  const i = h.indexOf('</div>', h.indexOf('data-ek="g"')); return i < 0 ? h : h.slice(0, i + 6) + row + h.slice(i + 6);
}; }
{ const _be = bindAppEditor; bindAppEditor = function (root, app, onChange) { _be(root, app, onChange); $$('[data-ek="bt"]', root).forEach(b => { const f = b.onclick; b.onclick = e => { f && f(e); const v = +b.dataset.ev; if (v > 0) app.bt = v; else delete app.bt; }; }); }; }
