// MUESTRA TEMPORAL (no se publica): «Conjunto de Pirata de Paja» (sombrero de paja, chaleco rojo abierto sin mangas,
// faja amarilla, pantalón corto azul con dobladillo vuelto y sandalias). Para todas las clases.
const PP = { rojo: P5(['#4a0a0c', '#8a1418', '#c0222a', '#e04a44', '#f4847a']), azul: P5(['#0e1e46', '#1a3470', '#2a50a0', '#4a78c8', '#8ab0e8']), amar: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']) };
// tono de piel: se toma de la cara ya dibujada (debajo de los ojos), así vale para cualquier piel
function ppSkin(p, A) { if (A.up) return null; const c = p.get(Math.round(A.side ? A.hx - A.d * 2 : A.hx), Math.round(A.ey) + 3); return uA(c) ? [uMix(c, C('#000000'), 0.35), uMix(c, C('#000000'), 0.16), c, uMix(c, C('#ffffff'), 0.25)] : null; }
fitKind('body', 'pp_chaleco', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, S = s.sk || (s.m && s.m.sk);
  if (S) {
    // chaleco abierto: pecho a la vista
    if (!up && !side) for (let y = ty + 1; y < ty + th - 2; y++) { const w = 1 + Math.floor((y - ty) / 4); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, x === Math.round(cx - w) ? S[1] : S[Math.min(S.length - 1, 2 + ((y - ty) > 3 ? 0 : 1))]); p.set(Math.round(cx - w) - 1, y, PP.rojo[4]); p.set(Math.round(cx + w), y, PP.rojo[1]); }
    if (side) for (let y = ty + 2; y < ty + th - 3; y++) p.set(Math.round(cx + d * (tw / 2 - 1)), y, S[2]); }
  // cuello del chaleco
  for (let x = tx0; x <= R; x++) p.set(x, ty, x === tx0 || x === R ? PP.rojo[1] : PP.rojo[3]);
  // faja amarilla con el nudo a un lado
  const wy = ty + th - 2; for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, wy, PP.amar[(x & 1) ? 3 : 2]); p.set(x, wy + 1, PP.amar[1]); }
  const kx = side ? Math.round(cx - d * 2) : up ? R - 1 : tx0 + 1; if (!up || side) { p.set(kx, wy, PP.amar[4]); for (let k = 0; k < 4; k++) { p.set(kx + (side ? -d : -1) * (k >> 1), wy + 2 + k, PP.amar[k & 1 ? 2 : 3]); } } }, { skin: true });
fitKind('legs', 'pp_corto', (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m), S = s.sk || (s.m && s.m.sk);
  const knee = legTop + Math.max(1, Math.round((base - legTop) * 0.25));
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = s.m.indexOf(c);
    if (y > knee && S) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k))]); else if (y >= knee) p.set(x, y, y === knee ? s.m[4] : s.m[3]); } }, { skin: true });
// sin mangas: al final del dibujo, los brazos (capa 3) del color del chaleco pasan a piel
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { if (L && L.top && L.top.k === 'pp_chaleco' && L.top.sk && p.t) { const S = L.top.sk, M = PP.rojo;
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const k = M.indexOf(p.d[i]); if (k >= 0) p.d[i] = S[Math.min(S.length - 1, Math.max(0, k))]; } } } catch (e) { } return r; }; }
function ppLook(cls, app) { const L = heroLook(cls, app, { weapon: 43, head: 0, body: 0, legs: 0, feet: 0 }, {}, {});
  L.head = { k: 'dawn_hat', dawn: 'straw', cover: 'hat' }; const SK = Array.from(L.skin).map(c => typeof c === 'string' ? C(c) : c); const mR = PP.rojo.slice(), mB = PP.azul.slice(); mR.sk = SK; mB.sk = SK; L.top = { k: 'pp_chaleco', m: mR, sk: SK }; L.bot = { k: 'pp_corto', m: mB, sk: SK }; L.feet = { k: 'sandals', m: PP.cuero }; L.back = null; if (cls === 'asesino') L.scarf = null; return L; }
