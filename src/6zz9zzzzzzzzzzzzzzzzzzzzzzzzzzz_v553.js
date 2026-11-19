// ================= v5.52: FORMA «TEJEDOR PRIMORDIAL» (NIVEL 1000 · AÚN NO SE PUEDE CONSEGUIR) =================
// Sergio mandó una imagen de referencia; es un personaje conocido, así que se hace una forma ORIGINAL de nuestro lore:
// el cuerpo se vuelve negro como el Lienzo antes del primer color, el pelo es hilo blanco que flota como una nube,
// sonrisa blanca enorme, faja de tela al viento y la rueca de los Tejedores girando delante como escudo.
// Sale en 🌀 Transformaciones bloqueada: «Nivel 1000 · aún no se puede conseguir».
const TEJ_LV = 1000;
function tejDraw(p, L, dir, anim, f, F) { const m = p.meta; if (!m || m.hrx === undefined) return;
  const HAIR = new Set(Array.from(L.hair || []).map(c => typeof c === 'string' ? C(c) : c)), ink = [C('#0c0a12'), C('#16141e'), C('#22202c')], wh = [C('#c8c0b0'), C('#e4ddcf'), C('#f6f2ea'), C('#ffffff')];
  const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), top = Math.round(m.headTop), ey = Math.round(m.ey), cx = Math.round(m.cx), empty = (x, y) => !uA(p.get(x, y));
  // 1) todo el cuerpo y la ropa → negro de lienzo; el pelo → hilo blanco
  for (let i = 0; i < p.d.length; i++) { const c = p.d[i]; if (!uA(c)) continue; const l = (uR(c) * 0.3 + uG(c) * 0.59 + uB(c) * 0.11) / 255;
    if (HAIR.has(c)) p.d[i] = l < 0.12 ? wh[1] : l < 0.3 ? wh[2] : wh[3]; else p.d[i] = l < 0.3 ? ink[0] : l < 0.55 ? ink[1] : ink[2]; }
  // 2) el pelo flota como una nube (mechones hacia atrás y hacia arriba)
  const sway = Math.sin((f || 0) * 1.6) * 1.5;
  for (let k = 0; k < (F === 2 ? 9 : 6); k++) { const a = -2.6 + k * 0.42, r = Math.round(m.hrx) + 2 + (k % 3), bx = Math.round(hx + Math.cos(a) * r + (side ? -d * 3 : 0) + sway), by = Math.round(top + 4 + Math.sin(a) * (r * 0.7)) - (k % 2);
    for (let yy = -2; yy <= 2; yy++) for (let xx = -2; xx <= 2; xx++) { if (xx * xx + yy * yy > 5) continue; const x = bx + xx, y = by + yy; if (empty(x, y) || HAIR.has(p.get(x, y))) p.set(x, y, yy < 0 ? wh[3] : xx > 0 ? wh[1] : wh[2]); } }
  // 3) cara: ojos cerrados de alegría (^ ^) y sonrisa blanca enorme
  if (!up) { const eyes = m.eyes || []; for (const ex of eyes) { p.set(ex, ey, wh[3]); p.set(ex + (side ? 0 : 1), ey - 1, wh[3]); if (!side) p.set(ex + 2, ey, wh[3]); }
    const my = Math.round(m.hy) + FACE.ey + FACE.mouth + 1, w = side ? 3 : 6, x0 = side ? hx + d * 2 - (d < 0 ? w : 0) : hx - 3;
    for (let x = x0; x < x0 + w; x++) { p.set(x, my, wh[3]); p.set(x, my + 1, (x - x0) % 2 ? wh[2] : wh[3]); } p.set(x0 - 1, my - 1, wh[3]); p.set(x0 + w, my - 1, wh[3]); }
  // 4) faja de tela blanca en la cintura, con la cola al viento
  if (m.waistY !== undefined) { const wy = Math.round(m.waistY), tx0 = Math.round(m.tx0), tw = Math.round(m.tw || 10); for (let x = tx0; x < tx0 + tw; x++) for (let y = wy; y <= wy + 1; y++) if (uA(p.get(x, y))) p.set(x, y, y === wy ? wh[3] : wh[1]);
    const s = side ? -d : 1, flap = Math.sin((f || 0) * 1.4) * 2; for (let k = 0; k < 9; k++) { const x = (side ? cx - d * 3 : tx0 + tw) + s * k, y = wy + 1 + Math.round(k * 0.4 + Math.sin(k / 2 + flap) * 1.2); if (up || empty(x, y)) { p.set(x, y, wh[2]); if (empty(x, y + 1)) p.set(x, y + 1, wh[0]); } } }
  // 5) plena: la rueca de los Tejedores gira delante como escudo (detrás si va de espaldas)
  if (F === 2) { const r = 7, wx = side ? cx + d * 5 : cx, wy = Math.round(m.torsoTop + (m.th || 8) * 0.5) + 1, rot = (f || 0) * 0.5, G1 = C('#d8b848'), G2 = C('#f4e08a');
    const put = (x, y, c) => { if (up ? empty(x, y) : true) p.set(x, y, c); };
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const dd = Math.hypot(x, y * (side ? 1.15 : 1)); if (dd > r + 0.3) continue; put(wx + x, wy + y, dd > r - 1.3 ? wh[3] : dd > r - 2.2 ? wh[0] : wh[2]); }
    for (let k = 0; k < 6; k++) { const a = rot + k * Math.PI / 3; for (let t = 1.5; t < r - 1.5; t += 0.7) put(Math.round(wx + Math.cos(a) * t), Math.round(wy + Math.sin(a) * t), t > r - 2.6 ? G2 : G1); }
    put(wx, wy, G2); put(wx + 1, wy, G1); put(wx, wy + 1, G1); put(wx - 1, wy, G1); put(wx, wy - 1, G1);
    // el hilo sale de la rueca hacia la mano
    if (!up) for (let k = 0; k < 6; k++) put(wx + (side ? -d : 1) * (r + k), wy - 2 - Math.round(k * 0.6), k % 2 ? wh[3] : wh[1]); } }
SR.tejedor = { n: L2('Tejedor Primordial', 'Primordial Weaver'), f: L2('Forma del Primer Hilo', 'First Thread Form'), ic: '🧵', col: '#f6f2ea', cost: [['esencia_nihil', 99]], lv: TEJ_LV,
  pas: L2('NIVEL 1000 · aún no se puede conseguir. El cuerpo se vuelve negro como el Lienzo antes del primer color, el pelo es hilo blanco que flota como una nube, sonrisa blanca enorme y faja al viento. Plena: la rueca de los Tejedores gira delante como escudo. Es lo que el hilo vacío aprende cuando entiende a los propios Tejedores.', 'LEVEL 1000 · cannot be obtained yet. The body turns black like the Canvas before the first colour, the hair is white thread floating like a cloud, a huge white grin and a sash in the wind. Full: the Weavers\' spinning wheel turns in front as a shield. It is what the empty thread learns when it understands the Weavers themselves.'),
  forms: () => [[1, L2('Forma del Primer Hilo', 'First Thread Form')], [2, L2('Forma plena', 'Full form')]], why: () => `<b>${L2('Nivel 1000', 'Level 1000')}</b> · ${L2('aún no se puede conseguir.', 'cannot be obtained yet.')}` };
SRSK.tejedor = ['srd1', 'srd2', 'srd3', 'srd4'];
// el ritual no la ofrece todavía
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const b = document.querySelector('#modal [data-sr="tejedor"]'); if (b) { b.disabled = true; b.textContent = '🔒 ' + L2('Nivel 1000', 'Level 1000'); b.onclick = null; } } catch (e) { } return r; }; }
{ const _su = srUse; srUse = function (k) { if (k === 'tejedor' && (G.P.lv || 0) < TEJ_LV) { toast(L2('Nivel 1000: aún no se puede conseguir.', 'Level 1000: cannot be obtained yet.'), 'warn'); return; } return _su.apply(this, arguments); }; }
V33_TICKS.push(() => { const P = G.P; if (P && P.srOwn && P.srOwn.includes('tejedor') && P.lv < TEJ_LV && !P._tejTest) { P.srOwn = P.srOwn.filter(k => k !== 'tejedor'); if (P.sr === 'tejedor') { P.sr = null; P.srF = 0; calcStats(P); refreshLook(); } } });
if (typeof FORM_POW !== 'undefined') FORM_POW.tejedor = [['dr', 15, L2('Lienzo vivo', 'Living canvas'), L2('−15 % de daño recibido', '−15% damage taken')], ['regen', 2, L2('Hilo que se renueva', 'Renewing thread'), L2('recuperas 2 % de vida cada 3 s', 'recover 2% HP every 3 s')], ['spd', 15, L2('Paso libre', 'Free step'), L2('+15 % de velocidad', '+15% speed')]];
if (typeof KID_FORMS !== 'undefined') { const i = KID_FORMS.indexOf('tejedor'); if (i >= 0) KID_FORMS.splice(i, 1); }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.sr === 'tejedor') try { const tg = p.tg; if (p.t) p.tg = 5; if (L.srF) tejDraw(p, L, dir, anim, f, L.srF | 0); p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('tej', e); } return r; }; }
// el HD también se vuelve negro y blanco
{ const _hb = hdBuild; hdBuild = function (A, col, row) { _hb(A, col, row); const L = A.hdL; if (!L || L.sr !== 'tejedor' || !L.srF || !A.hdX) return; const W = A.fw * 2, H = A.fh * 2, X = A.hdX, im = X.getImageData(col * W, row * H, W, H), D = new Uint32Array(im.data.buffer);
  for (let i = 0; i < D.length; i++) { const c = D[i]; if (!uA(c)) continue; const r = uR(c), g = uG(c), b = uB(c), l = (r * 0.3 + g * 0.59 + b * 0.11) / 255; if (l > 0.7 && Math.abs(r - b) < 40) continue; if (r > 200 && g > 160 && b < 120) continue; D[i] = (l < 0.3 ? C('#0c0a12') : l < 0.6 ? C('#16141e') : C('#22202c')) | 0xff000000; } X.putImageData(im, col * W, row * H); }; }
