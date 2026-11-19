// ================= v5.51: FUSIONES BOCETO DE FUEGO Y ÁNGEL DE NIEBLA · FURIA DE LOS ENEMIGOS 400-500 ·
// =================        FORMAS DE LOS CAZADORES DE PORTALES · UNA FORMA PARA CADA HIJO =================
// Sergio aprobó dos muestras (tools/art/muestras/muestra_fusiones2.js): Boceto de Fuego (eco + dragón, 1 % más fuerte que
// el Dragón de Hielo y 2 pasivas más) y Ángel de Niebla (alado + fantasma, igual que el Dragón de Hielo). Cada fusión
// tiene su propia maestría (rango 1-12), su árbol de poderes y su poder de ataque dibujado.
// Van en P.fus2 ('bf' | 'an'); el Dragón de Hielo sigue en P.fus. Solo una a la vez.

// ---------- definición ----------
SAVEKEYS.push('fus2', 'fusX');
const FUS2 = {
  bf: { a: 'eco', b: 'dragon', base: 'dragon', ic: '🖌🐉', n: L2('Boceto de Fuego', 'Fire Sketch'), hair: pal(['#7a1a06', '#c8401a', '#ff7a2a', '#ffc860']),
    st: [1.11, 1.25, 1.35, 1.43], txt: () => L2('El dragón dibujado a tinta sobre papel, con las llamas en naranja. Mitad +11 %, Híbrida +25 %, 2.0 +35 %, Plena +43 % de ataque: un 1 % más que el Dragón de Hielo. Pelo de fuego fijo. 5 poderes.', 'The dragon drawn in ink on paper, with the flames in orange. Half +11%, Hybrid +25%, 2.0 +35%, Full +43% attack: 1% more than the Ice Dragon. Fixed fire hair. 5 powers.') },
  an: { a: 'alado', b: 'fantasma', base: 'alado', ic: '🪽👻', n: L2('Ángel de Niebla', 'Mist Angel'), hair: pal(['#6a7a92', '#9aa8c0', '#c8d2e4', '#eef2fa']),
    st: [1.10, 1.30, 1.42], txt: () => L2('Alas de plumas pálidas, aureola rota y cuerpo de niebla sin piernas. Mitad +10 %, Forma +30 %, Plena +42 % de ataque (como el Dragón de Hielo). Pelo de niebla fijo.', 'Pale feathered wings, a broken halo and a mist body with no legs. Half +10%, Form +30%, Full +42% attack (like the Ice Dragon). Fixed mist hair.') } };
const fusOwnRank = k => { const P = G.P, key = k === 'fusion' ? 'dh' : String(k).replace(/^fus_/, ''); const x = ((P && P.fusX) || {})[key] || 0; return Math.min(12, 1 + Math.floor(x / 150)); };
const fus2Ok = k => { const P = G.P, D = FUS2[k]; return !!(P && D && P.lv >= FUS_LV && srOwned().includes(D.a) && srOwned().includes(D.b) && fusRank(D.a) >= FUS_RANK && fusRank(D.b) >= FUS_RANK); };
const fus2On = () => { const P = G.P; return P && P.fus2 && FUS2[P.fus2] && P.sr === FUS2[P.fus2].base ? P.fus2 : null; };
function fusTreeList() { const L = []; if (typeof fusOk === 'function' && fusOk()) L.push('fusion'); for (const k in FUS2) if (fus2Ok(k)) L.push('fus_' + k); return L; }
function fusTreeName(x) { if (x === 'fusion') return '🐉❄ ' + L2('Dragón de Hielo', 'Ice Dragon'); if (/^fus_/.test(x)) { const D = FUS2[x.slice(4)]; return D ? D.ic + ' ' + D.n : x; } return SR[x] ? SR[x].ic + ' ' + SR[x].n : x; }
// cada fusión sube su propia maestría (2 por monstruo, 4 por élite, 15 por jefe)
{ const _km = killMob; killMob = function (m) { const P = G.P, key = P && P.srF && m && !m.dying ? (fus2On() || (P.fus && P.sr === 'dragon' ? 'dh' : null)) : null, r0 = key ? fusOwnRank(key === 'dh' ? 'fusion' : 'fus_' + key) : 0; const r = _km.apply(this, arguments);
  try { if (key) { P.fusX = P.fusX || {}; P.fusX[key] = (P.fusX[key] || 0) + (m.boss ? 15 : m.elite ? 4 : 2); const r1 = fusOwnRank(key === 'dh' ? 'fusion' : 'fus_' + key); if (r1 > r0) { toast((key === 'dh' ? '🐉❄ ' + L2('Dragón de Hielo', 'Ice Dragon') : FUS2[key].ic + ' ' + FUS2[key].n) + L2(': maestría ', ': mastery ') + r1 + '/12', 'quest', 4); sfx('level'); } } } catch (e) { } return r; }; }

// ---------- aspecto (y online: viaja como f2) ----------
{ const _gt = gearTiers; gearTiers = function (P) { const g = _gt.apply(this, arguments); if (P && P === G.P && fus2On()) g.f2 = P.fus2; return g; }; }
{ const _lg = lkGear; lkGear = function (g) { const o = _lg.apply(this, arguments); if (o && g && typeof g.f2 === 'string' && FUS2[g.f2] && o.sr === FUS2[g.f2].base) o.f2 = g.f2; return o; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, ...a) { const L = _hl.call(this, cls, app, gear, ...a); if (L && gear && gear.f2 && FUS2[gear.f2] && L.sr === FUS2[gear.f2].base) { const D = FUS2[gear.f2]; L.fus2 = gear.f2; L.hair = D.hair; L.hair2 = null; if (gear.f2 === 'bf') { L.eyes = 'dorado'; L.eyes2 = null; } else { L.eyes = 'celeste'; L.eyes2 = null; } } return L; }; }
function f2Sketch(p, L) { const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), ink = C('#1a1a24'), paper = [C('#d8d4cc'), C('#ecebe6'), C('#fbfaf6')];
  for (let i = 0; i < p.d.length; i++) { const c = p.d[i]; if (!uA(c)) continue; const r = uR(c), g = uG(c), b = uB(c);
    if (SKN.has(c)) { const l = (r + g + b) / 765; p.d[i] = l > 0.62 ? paper[2] : l > 0.5 ? paper[1] : paper[0]; continue; }
    if (r > 190 && b < 110 && g > 60 && g < 215) { p.d[i] = uMix(c, C('#ff8a2a'), 0.35) | 0xff000000; continue; }
    const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255; p.d[i] = l < 0.22 ? ink : l < 0.45 ? C('#6a6a74') : l < 0.7 ? C('#b8b6b0') : paper[2]; }
  const q = new Uint32Array(p.d); for (let y = 1; y < p.h - 1; y++) for (let x = 1; x < p.w - 1; x++) { if (uA(q[y * p.w + x])) continue; if (uA(q[y * p.w + x + 1]) || uA(q[y * p.w + x - 1]) || uA(q[(y + 1) * p.w + x]) || uA(q[(y - 1) * p.w + x])) p.set(x, y, ink); } }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (!L || !L.fus2) return r; try { const tg = p.tg; if (p.t) p.tg = 5; const F = L.srF | 0;
    if (L.fus2 === 'bf' && L.sr === 'dragon') f2Sketch(p, L);
    if (L.fus2 === 'an' && L.sr === 'alado') srOverlay(p, Object.assign({}, L, { sr: 'fantasma', srF: F ? 1 : 0 }), dir, anim, f);
    p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('fus2', e); } return r; }; }
{ const _da = dragonAtlas; dragonAtlas = function (L) { const A = _da.apply(this, arguments); if (L && L.fus2 === 'bf' && A && A.img && !A._bf) { A._bf = 1; const c = A.img, x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), p = new Pix(c.width, c.height); p.d = new Uint32Array(im.data.buffer); f2Sketch(p, { skin: [] }); x.putImageData(im, 0, 0); } return A; }; }
// el HD del ángel también sale pálido (como el fantasma)
{ const _hb = hdBuild; hdBuild = function (A, col, row) { _hb(A, col, row); const L = A.hdL; if (!L || L.fus2 !== 'an' || !A.hdX) return; const W = A.fw * 2, H = A.fh * 2, X = A.hdX, im = X.getImageData(col * W, row * H, W, H), q = new Pix(W, H); q.d = new Uint32Array(im.data.buffer); srTintPix(q); X.putImageData(im, col * W, row * H); }; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const an = (e.type === 'player' && fus2On() === 'an') || (e.type === 'remote' && e.gear && e.gear.f2 === 'an'); if (an && !e.dying) { ctx.save(); ctx.globalAlpha = 0.8; try { return _de.apply(this, arguments); } finally { ctx.restore(); } } return _de.apply(this, arguments); }; }

// ---------- fuerza ----------
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs.call(this, P, ...a); const k = P === G.P && fus2On(); if (!k || !S || !srOk()) return S; const D = FUS2[k], F = P.srF || 0;
  let base, tgt; if (k === 'bf') { const i = F === 2 ? 3 : F === 3 ? 2 : F === 1 ? 1 : 0; base = [1.06, 1.16, 1.26, 1.32][i]; tgt = D.st[i]; } else { const i = F === 2 ? 2 : F ? 1 : 0; base = [1.05, 1.24, 1.30][i]; tgt = D.st[i]; }
  S.atk = Math.round(S.atk * tgt / base); S.maxhp = Math.round(S.maxhp * 1.05); S.def = Math.round(S.def * 1.05); if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); P.S = S; return S; }; }
{ const _me = myElem; myElem = function () { if (fus2On() === 'bf' && G.P.srF) return 'fire'; return _me.apply(this, arguments); }; }

// ---------- usar / separar ----------
function fus2Use(k, on) { const P = G.P; if (!P) return; if (on && !fus2Ok(k)) { const D = FUS2[k]; toast(L2('Primero sube ', 'First raise ') + SR[D.a].n + L2(' y ', ' and ') + SR[D.b].n + L2(' a maestría 12 (nivel 500).', ' to mastery 12 (level 500).'), 'warn'); return; }
  if (on) { const D = FUS2[k]; if (P.fus) { P.fus = 0; } if (P.sr !== D.base) { P._fusUse = 1; try { P.srTT = 0; srUse(D.base); } finally { P._fusUse = 0; } } P.fus2 = k;
    addFx({ type: 'ring', x: P.x, y: P.y, r: 50, dur: 0.7, col: k === 'bf' ? '#ff7a2a' : '#e8f0ff' }); burst(P.x, P.y - 14, 40, { sp: 100, up: 60, g: 20, life: 0.9, c: k === 'bf' ? ['#1a1a24', '#ff7a2a', '#ffffff'] : ['#ffffff', '#c8d8f0', '#fff4b0'] }); banner(D.ic + ' ' + L2('Fusión: ', 'Fusion: ') + D.n, L2('Toca ', 'Tap ') + SR[D.base].ic + L2(' para transformarte.', ' to transform.')); sfx('boss'); }
  else { P.fus2 = null; banner(L2('Fusión separada', 'Fusion split'), ''); }
  calcStats(P); refreshLook(); markDirty(true); uiDirty.hud = true; }
{ const _su = srUse; srUse = function (k) { const P = G.P, keep = P && P._fusUse; const r = _su.apply(this, arguments); if (P && !keep && P.fus2) { P.fus2 = null; calcStats(P); refreshLook(); } return r; }; }
{ const _fu = fusUse; fusUse = function (on) { const P = G.P; if (on && P && P.fus2 && fusOk()) P.fus2 = null; return _fu.apply(this, arguments); }; }
V33_TICKS.push(() => { const P = G.P; if (P && P.fus2 && (!FUS2[P.fus2] || P.sr !== FUS2[P.fus2].base || !fus2Ok(P.fus2))) { P.fus2 = null; calcStats(P); refreshLook(); } });
V33_TICKS.push(() => { const P = G.P, t = $('#bTrans'), k = fus2On(); if (P && t && k) { const ic = FUS2[k].ic + (P.srF ? '✓' : ''); if (t.textContent !== ic) t.textContent = ic; } });
const f2Banner = () => { const P = G.P, k = fus2On(); if (!k || !P.srF) return; const D = FUS2[k], F = P.srF, i = k === 'bf' ? (F === 2 ? 3 : F === 3 ? 2 : 1) : (F === 2 ? 2 : 1); banner(D.ic + ' ' + D.n + ' · ' + (k === 'bf' ? ['', L2('Híbrida', 'Hybrid'), '2.0', L2('Plena', 'Full')] : ['', L2('Forma', 'Form'), L2('Plena', 'Full')])[i], '+' + Math.round((D.st[i] - 1) * 100) + L2(' % de ataque', '% attack')); };
{ const _ts = transSet; transSet = function () { const r = _ts.apply(this, arguments); f2Banner(); return r; }; }
{ const _st = srToggle; srToggle = function () { const r = _st.apply(this, arguments); f2Banner(); return r; }; }
// 🌀 Transformaciones › Fusiones: las dos nuevas
{ const _to = transOpen; transOpen = function () { const r = _to.apply(this, arguments); try { const P = G.P, anchor = document.querySelector('#modal #fusCard'); if (!anchor) return r; let html = '';
  for (const k in FUS2) { const D = FUS2[k], ok = fus2Ok(k), on = fus2On() === k, has = srOwned().includes(D.a) && srOwned().includes(D.b), id = 'fusCard_' + k;
    const req = `<small class="trwhy">${L2('Necesitas: ', 'You need: ')}${has ? '' : L2('las dos formas · ', 'both forms · ')}${SR[D.a].ic} ${L2('maestría ', 'mastery ')}${fusRank(D.a)}/12 · ${SR[D.b].ic} ${L2('maestría ', 'mastery ')}${fusRank(D.b)}/12 · ${L2('nivel ', 'level ')}${Math.min(P.lv, FUS_LV)}/${FUS_LV}</small>`;
    const forms = k === 'bf' ? [[0, L2('Normal', 'Normal')], [1, L2('Híbrida', 'Hybrid')], [3, '2.0'], [2, L2('Plena', 'Full')]] : [[0, L2('Normal', 'Normal')], [1, L2('Forma', 'Form')], [2, L2('Plena', 'Full')]];
    html += !ok ? `<div class="gsrc trlock" id="${id}"><span><b>🔒 ${D.ic} ${esc(D.n)}</b><br><small>${esc(D.txt())}</small><br>${req}</span></div>`
      : !on ? `<div class="gsrc" id="${id}"><span><b>${D.ic} ${esc(D.n)}</b> <small>· ${L2('maestría ', 'mastery ')}${fusOwnRank('fus_' + k)}/12</small><br><small>${esc(D.txt())}</small></span><div class="row wrap"><button class="btn sm gold" data-f2on="${k}">${L2('Usar la fusión', 'Use the fusion')}</button></div></div>`
      : `<div class="gsrc" id="${id}"><span><b>${D.ic} ${esc(D.n)}</b> <small>· ${L2('la usas ahora', 'in use')} · ${L2('maestría ', 'mastery ')}${fusOwnRank('fus_' + k)}/12</small><br><small>${esc(D.txt())}</small></span><div class="row wrap">${forms.map(([f, n]) => `<button class="btn sm ${(P.srF || 0) === f ? 'gold' : ''}" data-f2tf="${f}">${esc(n)}</button>`).join('')}<button class="btn sm" data-f2off="${k}">${L2('Separar', 'Split')}</button></div></div>`; }
  anchor.insertAdjacentHTML('afterend', html);
  $$('#modal [data-f2on]').forEach(b => b.onclick = () => { fus2Use(b.dataset.f2on, true); transOpen(); }); $$('#modal [data-f2off]').forEach(b => b.onclick = () => { fus2Use(b.dataset.f2off, false); transOpen(); });
  $$('#modal [data-f2tf]').forEach(b => b.onclick = () => { const f = +b.dataset.f2tf; if (f === 3 && !drg2Ok()) return; transSet(f); closeModal(); }); } catch (e) { console.warn(e); } return r; }; }

// ---------- poderes (Boceto de Fuego: 5; Ángel de Niebla: 3) y poderes de ataque ----------
FORM_POW.fus_bf = [['crit', 6, L2('Trazo ardiente', 'Burning stroke'), L2('+6 de crítico', '+6 crit')], ['slow', 1, L2('Tinta que quema', 'Burning ink'), L2('tus golpes ralentizan', 'your hits slow')], ['low', 12, L2('Furia de papel', 'Paper fury'), L2('+12 % de daño con menos de la mitad de vida', '+12% damage below half HP')], ['gold', 15, L2('Boceto del tesoro', 'Treasure sketch'), L2('+15 % de oro de monstruos', '+15% monster gold')], ['xp', 10, L2('Copia del vencido', 'Copy of the vanquished'), L2('+10 % de experiencia de monstruos', '+10% monster experience')]];
FORM_POW.fus_an = [['dr', 12, L2('Cuerpo de niebla alada', 'Winged mist body'), L2('−12 % de daño recibido', '−12% damage taken')], ['regen', 1.5, L2('Canción del Velo', 'Song of the Veil'), L2('recuperas 1,5 % de vida cada 3 s', 'recover 1.5% HP every 3 s')], ['dodge', 10, L2('Paso de niebla', 'Mist step'), L2('+10 de esquiva', '+10 dodge')]];
FORM_ATK.fus_bf = ['inkfire', L2('Trazo de Fuego', 'Fire Stroke'), L2('Una pincelada de tinta que arde: daño en línea y llamas.', 'A burning ink brushstroke: line damage and flames.')];
FORM_ATK.fus_an = ['mist', L2('Diluvio de Plumas', 'Feather Deluge'), L2('Plumas de luz y almas de niebla caen alrededor del enemigo y lo ralentizan.', 'Light feathers and mist souls fall around the enemy and slow it.')];
PT_KEYS.push('fus_bf', 'fus_an');
{ const _pc = pfxCast; pfxCast = function (k, m, lv) { const A = FORM_ATK[k]; if (!A || (A[0] !== 'inkfire' && A[0] !== 'mist')) return _pc.apply(this, arguments); const P = G.P, dmg = P.S.atk * [0, 2.2, 2.8, 3.5][lv] * (1 + (P.S.skillP || 0) / 100), ang = Math.atan2(m.y - P.y, m.x - P.x), src = { pfx: 1 };
  PFX.push({ k: A[0], x: P.x, y: P.y - 10, tx: m.x, ty: m.y - 10, ang, t: 0, dur: 0.8 }); floatText(P.x, P.y - 46, A[1], '#fff4b0'); sfx(A[0] === 'inkfire' ? 'fire' : 'buff');
  if (A[0] === 'inkfire') delayAct(0.2, () => { for (let i = 0; i <= 5; i++) hitCircle(P.x + Math.cos(ang) * i * 28, P.y + Math.sin(ang) * i * 28, 26, dmg * 0.48, src, true); });
  else delayAct(0.35, () => hitCircle(m.x, m.y, 62, dmg, Object.assign({ slow: 2 }, src))); }; }
{ const _pd = pfxDraw; pfxDraw = function (g, f, cx, cy) { if (f.k !== 'inkfire' && f.k !== 'mist') return _pd.apply(this, arguments); const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }, u = f.t / f.dur, X = f.tx - cx, Y = f.ty - cy, x0 = f.x - cx, y0 = f.y - cy;
  if (f.k === 'inkfire') { const len = 160 * Math.min(1, u * 2.2); g.globalAlpha = 1 - Math.max(0, (u - 0.7) / 0.3); for (let s = 0; s < len; s += 2) { const px = x0 + Math.cos(f.ang) * s - Math.sin(f.ang) * Math.sin(s / 14) * 6, py = y0 + Math.sin(f.ang) * s + Math.cos(f.ang) * Math.sin(s / 14) * 6, w = 6 - Math.abs(s / len - 0.4) * 6; R(px - w / 2, py - w / 2, Math.max(2, w), Math.max(2, w), '#1a1a24');
      if (s % 10 === 0) { const fh = 4 + ((s * 7) % 9) * Math.min(1, u * 3); for (let k = 0; k < fh; k++) R(px - 1 + Math.sin(k + G.t * 20) , py - 4 - k, 2, 1, k > fh - 3 ? '#fff4b0' : k > fh / 2 ? '#ffc040' : '#ff7a2a'); } } g.globalAlpha = 1; }
  else { g.globalAlpha = 1 - Math.max(0, (u - 0.75) / 0.25); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28 + u * 2, r = 54 * (1 - u * 0.4), fx = X + Math.cos(a) * r * ((i % 3) / 3 + 0.4), fy = Y - 90 * Math.max(0, 1 - u * 1.6 - (i % 4) * 0.08) + Math.sin(a) * r * 0.4;
      if (i % 2) { R(fx - 1, fy - 4, 2, 8, '#ffffff'); R(fx - 2, fy - 2, 1, 5, '#e8f0ff'); R(fx + 1, fy - 2, 1, 5, '#c8d8f0'); } else { R(fx - 2, fy - 2, 5, 5, 'rgba(220,232,255,0.7)'); R(fx - 1, fy + 3, 3, 3, 'rgba(200,216,240,0.5)'); R(fx, fy, 1, 1, '#5a6a8a'); } }
    if (u > 0.4) { g.strokeStyle = 'rgba(232,240,255,' + (1 - u) + ')'; g.lineWidth = 2; g.beginPath(); g.ellipse(X, Y + 10, 62 * u, 26 * u, 0, 0, 7); g.stroke(); g.lineWidth = 1; } g.globalAlpha = 1; } }; }

// =====================================================================================
// FURIA DE LOS ENEMIGOS DE NIVEL 400-500: con poca vida se transforman (aura roja, más fuertes)
// =====================================================================================
// Sergio: «con las transformaciones muchos enemigos se quedan atrás; los de nivel 400 a 500 tienen que poder hacerles frente».
// Monstruos de nivel 400+: al bajar de la mitad de vida, Furia (+35 % de ataque, +25 % de defensa, +12 % de velocidad).
// Jefes 400+: al 60 %, Furia (+40 % de ataque, +30 % de defensa) y recuperan un 10 % de vida. Una vez por combate.
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); try { if (m && !m.dying && !m.furia && !m.duel && m.lv >= 400 && m.maxhp && m.hp > 0 && m.hp < m.maxhp * (m.boss ? 0.6 : 0.5)) mobFuria(m); } catch (e) { } return d; }; }
function mobFuria(m) { m.furia = 1; const b = !!m.boss; m.atk = Math.round(m.atk * (b ? 1.4 : 1.35)); m.df = Math.round(m.df * (b ? 1.3 : 1.25)); m.spd = (m.spd || 40) * 1.12; if (b) m.hp = Math.min(m.maxhp, m.hp + Math.round(m.maxhp * 0.1));
  m.name = (m.name || '').startsWith('🔥') ? m.name : '🔥 ' + m.name; floatText(m.x, m.y - 50, L2('¡FURIA!', 'FURY!'), '#ff3a2a'); burst(m.x, m.y - 14, 26, { sp: 90, up: 60, g: 30, life: 0.8, c: ['#ff2a1a', '#ff8a2a', '#1a0404'] }); if (b) { banner('🔥 ' + m.def.n, L2('¡Entra en Furia!', 'Enters Fury!')); G.shake = 5; } sfx('boss'); }
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M) return; for (const m of G.ents) { if (m.type !== 'mob' || !m.furia || m.dying || m.map !== M.id) continue; const x = m.x - cx, y = m.y - cy, s = (m.scale || 1) * (m.boss ? 1.6 : 1);
  ctx.fillStyle = 'rgba(255,40,20,' + (0.22 + Math.sin(G.t * 8 + m.x) * 0.08) + ')'; ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 6 * s, 0, 0, 7); ctx.fill(); if (Math.random() < 0.35) part(m.x + (Math.random() - 0.5) * 18 * s, m.y - Math.random() * 20 * s, { vz: 22, g: -10, life: 0.6, c: Math.random() < 0.5 ? '#ff3a1a' : '#ff8a2a', s: 2 }); } });

// =====================================================================================
// FORMAS DE LOS CAZADORES DE PORTALES (en los duelos, al 60 % de vida, como el lobo y el dragón: +32 %)
// =====================================================================================
const HN_FORM = { fuego: [L2('Furia Desatada', 'Unleashed Fury'), '#ff2a1a', '#ff8a2a'], hielo: [L2('Forma Glacial', 'Glacial Form'), '#8ad8ff', '#ffffff'], roca: [L2('Forma Rocosa', 'Rock Form'), '#8a7a5a', '#c8b08a'], aire: [L2('Forma Ciclón', 'Cyclone Form'), '#c8f0e0', '#ffffff'],
  agua: [L2('Forma Marea', 'Tide Form'), '#2a7ad8', '#9ad8ff'], mente: [L2('Forma Maga', 'Mage Form'), '#c040ff', '#ff9aff'], sombra: [L2('Forma Sombría', 'Shadow Form'), '#3a1a6a', '#8a5aff'], rayo: [L2('Forma Tormenta', 'Storm Form'), '#ffe040', '#ffffff'] };
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); try { if (m && m.duel && !m.hform && !m.dying && typeof DUEL !== 'undefined' && DUEL && m.hp > 0 && m.hp < m.maxhp * 0.6) { const pw = DUEL.o && DUEL.o.pw; if (pw && HN_FORM[pw]) hnFormOn(m, pw); } } catch (e) { } return d; }; }
function hnFormOn(m, pw) { const F = HN_FORM[pw]; m.hform = pw; m.atk = Math.round(m.atk * 1.32); m.df = Math.round(m.df * 1.15); m.spd = (m.spd || 60) * (pw === 'aire' || pw === 'rayo' ? 1.2 : 1.08); m.hp = Math.min(m.maxhp, m.hp + Math.round(m.maxhp * 0.12));
  banner((DUEL.o.name || '') + ': ' + F[0], L2('¡El cazador se transforma!', 'The hunter transforms!')); addFx({ type: 'ring', x: m.x, y: m.y, r: 60, dur: 0.8, col: F[1] }); burst(m.x, m.y - 16, 40, { sp: 110, up: 70, g: 30, life: 1, c: [F[1], F[2], '#ffffff'] }); G.shake = 4; sfx('boss'); }
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M) return; for (const m of G.ents) { if (m.type !== 'mob' || !m.hform || m.dying || m.map !== M.id) continue; const F = HN_FORM[m.hform], x = m.x - cx, y = m.y - cy, t = G.t;
  ctx.fillStyle = F[1] + '55'; ctx.beginPath(); ctx.ellipse(x, y, 20, 7, 0, 0, 7); ctx.fill();
  if (m.hform === 'roca') for (let i = 0; i < 5; i++) { const a = t * 2 + i * 1.26; ctx.fillStyle = i % 2 ? '#8a7a5a' : '#c8b08a'; ctx.fillRect(Math.round(x + Math.cos(a) * 18 - 3), Math.round(y - 18 + Math.sin(a) * 7 - 3), 6, 5); }
  else if (m.hform === 'mente') { ctx.strokeStyle = '#ff9aff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 2, 18, 6, 0, 0, 7); ctx.stroke(); for (let i = 0; i < 6; i++) { const a = -t * 1.5 + i * 1.05; ctx.fillStyle = '#e070ff'; ctx.fillRect(Math.round(x + Math.cos(a) * 18) - 1, Math.round(y - 2 + Math.sin(a) * 6) - 1, 3, 3); } }
  else if (m.hform === 'rayo' && Math.random() < 0.3) { ctx.strokeStyle = '#fff4a0'; ctx.beginPath(); let px = x + (Math.random() - 0.5) * 20, py = y - 40; ctx.moveTo(px, py); for (let k = 0; k < 4; k++) { px += (Math.random() - 0.5) * 10; py += 9; ctx.lineTo(px, py); } ctx.stroke(); }
  if (Math.random() < 0.45) part(m.x + (Math.random() - 0.5) * 22, m.y - Math.random() * 34, { vz: 24, g: -12, life: 0.7, c: Math.random() < 0.5 ? F[1] : F[2], s: 2 }); } });

// =====================================================================================
// UNA FORMA PARA CADA HIJO (y nietos, bisnietos…): la eligen ellos al hacerse mayores
// =====================================================================================
const KID_FORMS = ['lobo', 'fantasma', 'vampiro', 'dragon', 'alado', 'eco', 'hielo'];
V33_TICKS.push(() => { const P = G.P; if (!P || !P.kids || !P.kids.length) return; for (const k of P.kids) { if (k.form || kidStage(k) < 2 || (typeof kidWolf === 'function' && kidWolf(k))) continue;
  k.form = KID_FORMS[Math.floor(Math.random() * KID_FORMS.length)]; refreshKidAtlas(k); toast('👪 ' + (k.n || k.name || L2('Tu hijo', 'Your child')) + L2(' eligió su forma: ', ' chose their form: ') + SR[k.form].ic + ' ' + SR[k.form].n, 'quest', 5); markDirty(); } });
{ const _kg = kidGear; kidGear = function (k) { const g = _kg.apply(this, arguments); if (k && k.form && SR[k.form] && !(typeof kidWolf === 'function' && kidWolf(k))) { g.sr = k.form; g.sf = k.ft ? 1 : 0; } return g; }; }
let kidFT = 0; V33_TICKS.push(dt => { kidFT -= dt || 0.016; if (kidFT > 0) return; kidFT = 0.6; for (const e of G.ents) { if (e.type !== 'kid' || !e.kid || !e.kid.form || e.map !== (G.map && G.map.id)) continue; const k = e.kid, want = k.follow && nearestMob(e.x, e.y, 150) ? 1 : 0; if (want !== (k.ft || 0)) { k.ft = want; e.atlas = kidAtlas(k); if (want) burst(e.x, e.y - 10, 14, { sp: 60, up: 40, life: 0.6, c: [SR[k.form].col, '#ffffff'] }); } } });
{ const _sp = spawnProj; spawnProj = function (owner, x, y, ang, o) { if (o && o.kidShot) { const e = G.ents.find(q => q.type === 'kid' && q.kid && q.kid.ft && Math.abs(q.x - x) < 3 && Math.abs(q.y - 8 - y) < 3); if (e) o = Object.assign({}, o, { dmg: (o.dmg || 0) * 1.25 }); } return _sp.call(this, owner, x, y, ang, o); }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['v552', '🖌🐉🪽👻 ' + L2('Fusiones nuevas, furia y formas de cazadores', 'New fusions, fury and hunter forms'), () => [
  L2('🖌🐉 Boceto de Fuego (eco + dragón): +11 / +25 / +35 / +43 % de ataque, 5 poderes, ataque «Trazo de Fuego». 🪽👻 Ángel de Niebla (alado + fantasma): +10 / +30 / +42 %, ataque «Diluvio de Plumas». Las dos piden las formas en maestría 12 y nivel 500; cada fusión tiene su propia maestría y su árbol (▦ Atajos › 🌳).', '🖌🐉 Fire Sketch (echo + dragon): +11 / +25 / +35 / +43% attack, 5 powers, «Fire Stroke» attack. 🪽👻 Mist Angel (winged + ghost): +10 / +30 / +42%, «Feather Deluge» attack. Both need the forms at mastery 12 and level 500; each fusion has its own mastery and tree (▦ Shortcuts › 🌳).'),
  L2('🔥 Furia: los enemigos de nivel 400 o más se transforman al bajar de la mitad de vida (los jefes al 60 %): aura roja, +35-40 % de ataque y +25-30 % de defensa.', '🔥 Fury: level 400+ enemies transform when below half HP (bosses at 60%): red aura, +35-40% attack and +25-30% defence.'),
  L2('⚔ Cazadores de portales: en los duelos se transforman al 60 % de vida (Furia Desatada, Forma Rocosa, Forma Maga, Glacial, Ciclón, Marea, Sombría o Tormenta según su poder).', '⚔ Portal hunters: in duels they transform at 60% HP (Unleashed Fury, Rock Form, Mage Form, Glacial, Cyclone, Tide, Shadow or Storm depending on their power).'),
  L2('👪 Cada hijo (y nieto, bisnieto…) elige una forma al hacerse mayor y se transforma cuando pelea a tu lado (+25 % de daño).', '👪 Each child (and grandchild, great-grandchild…) chooses a form when they grow up and transforms when fighting beside you (+25% damage).')], () => null]);
