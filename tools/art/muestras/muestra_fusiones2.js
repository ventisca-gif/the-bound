// MUESTRA TEMPORAL (no se publica): tres fusiones nuevas.
//  · Lobo de Sombra (lobo + vampiro): pelaje negro-violeta, ojos rojos, colmillos y alas de murciélago.
//  · Ángel de Niebla (alado + fantasma): alas de plumas pálidas, aureola rota, cuerpo de niebla sin piernas.
//  · Boceto de Fuego (eco + dragón): el dragón dibujado a tinta sobre papel, con las llamas en naranja.
// G._fx = 'ls' | 'an' | 'bf' mientras se construye el aspecto.
const FX_SHADOW = pal(['#0c0612', '#1e1028', '#36204a', '#5a3a78']), FX_FIRE = pal(['#7a1a06', '#c8401a', '#ff7a2a', '#ffc860']);
{ const _hk = heroKey; heroKey = function () { const k = _hk.apply(this, arguments); return G._fx ? k + '|fx' + G._fx : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, ...a) { const L = _hl.call(this, cls, app, gear, ...a); if (L && G._fx) { L.fx = G._fx;
    if (G._fx === 'ls') { L.srFur = FX_SHADOW; L.hair = FX_SHADOW; L.hair2 = null; L.eyes = 'brillo'; L.eyes2 = null; }
    if (G._fx === 'bf') { L.hair = FX_FIRE; L.hair2 = null; }
    if (G._fx === 'an') { L.srFur = null; } } return L; }; }
function fxSketch(p, L, keepFire) { const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), ink = C('#1a1a24'), paper = [C('#d8d4cc'), C('#ecebe6'), C('#fbfaf6')];
  for (let i = 0; i < p.d.length; i++) { const c = p.d[i]; if (!uA(c)) continue; const r = uR(c), g = uG(c), b = uB(c);
    if (SKN.has(c)) { const l = (r + g + b) / 765; p.d[i] = l > 0.62 ? paper[2] : l > 0.5 ? paper[1] : paper[0]; continue; }
    if (keepFire && r > 190 && b < 110 && g > 60 && g < 215) { p.d[i] = uMix(c, C('#ff8a2a'), 0.35) | 0xff000000; continue; }
    const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255; p.d[i] = l < 0.22 ? ink : l < 0.45 ? C('#6a6a74') : l < 0.7 ? C('#b8b6b0') : paper[2]; }
  const q = new Uint32Array(p.d); for (let y = 1; y < p.h - 1; y++) for (let x = 1; x < p.w - 1; x++) { if (uA(q[y * p.w + x])) continue; if (uA(q[y * p.w + x + 1]) || uA(q[y * p.w + x - 1]) || uA(q[(y + 1) * p.w + x]) || uA(q[(y - 1) * p.w + x])) p.set(x, y, ink); } }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (!L || !L.fx) return r; try { const tg = p.tg; if (p.t) p.tg = 5; const F = L.srF | 0;
    if (L.fx === 'ls' && L.sr === 'lobo') { srOverlay(p, Object.assign({}, L, { sr: 'vampiro', srF: F ? 1 : 0 }), dir, anim, f); const m = p.meta; if (m && !m.up) for (const ex of m.eyes || []) { const ey = Math.round(m.ey); p.set(ex, ey, C('#ff2a2a')); p.set(ex + (m.side ? 0 : 1), ey, C('#ff8a8a')); } }
    if (L.fx === 'an' && L.sr === 'alado') { srOverlay(p, Object.assign({}, L, { sr: 'fantasma', srF: F ? 1 : 0 }), dir, anim, f); }
    if (L.fx === 'bf' && L.sr === 'dragon') fxSketch(p, L, true);
    p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
// los atlas de cuatro patas: el lobo ya sale con el pelaje de sombra; el dragón se pasa a boceto con llamas
{ const _da = dragonAtlas; dragonAtlas = function (L) { const A = _da.apply(this, arguments); if (L && L.fx === 'bf' && A && A.img) { const c = A.img, x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), p = new Pix(c.width, c.height); p.d = new Uint32Array(im.data.buffer); fxSketch(p, { skin: [] }, true); x.putImageData(im, 0, 0); } return A; }; }
