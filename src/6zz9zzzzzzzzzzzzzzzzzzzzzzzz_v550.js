// ================= v5.50: ÁRBOL DE PODERES CON ATAQUES · PESCA EN HIELO · DIARIO DE VIAJE · MASCOTAS QUE EVOLUCIONAN =================
// Sergio: «agrega árbol de poderes en Atajos para las formas, y los poderes nuevos que tengan sprites de ataque».

// =====================================================================================
// ÁRBOL DE PODERES (▦ Atajos › 🌳)
// =====================================================================================
// Puntos de cada forma = maestría − 2 (maestría 12 → 10 puntos, justo para completar el árbol).
//  · Los 3 poderes de la forma suben a nivel 2 y 3 (×1,5 y ×2 de su efecto): 1 punto cada nivel.
//  · Poder de ataque (con su propio dibujo): nivel 1 = 2 puntos, niveles 2 y 3 = 1 punto. Salta solo al golpear.
SAVEKEYS.push('ptree');
const PT_KEYS = ['lobo', 'fantasma', 'vampiro', 'dragon', 'alado', 'eco', 'hielo', 'fusion'];
const FORM_ATK = {
  lobo: ['claw', L2('Garras de la Luna', 'Moon Claws'), L2('Tres zarpazos de luz de luna sobre el enemigo.', 'Three moonlight slashes on the enemy.')],
  fantasma: ['chain', L2('Cadenas del Velo', 'Veil Chains'), L2('Cadenas de almas salen del suelo y atrapan (aturde 1 s).', 'Soul chains rise from the ground and bind (1 s stun).')],
  vampiro: ['bats', L2('Enjambre de Murciélagos', 'Bat Swarm'), L2('Seis murciélagos muerden y te devuelven vida.', 'Six bats bite and give you back HP.')],
  dragon: ['breath', L2('Aliento de Brasa', 'Ember Breath'), L2('Un cono de fuego delante de ti.', 'A cone of fire in front of you.')],
  alado: ['spear', L2('Lanza del Alba', 'Dawn Spear'), L2('Una lanza de luz cae del cielo sobre el enemigo.', 'A spear of light falls from the sky onto the enemy.')],
  eco: ['ink', L2('Trazo Final', 'Final Stroke'), L2('Una pincelada de tinta gigante que atraviesa todo.', 'A giant ink brushstroke that cuts through everything.')],
  hielo: ['spikes', L2('Estacas de Hielo', 'Ice Stakes'), L2('Estacas de hielo brotan en línea hasta el enemigo y ralentizan.', 'Ice stakes erupt in a line to the enemy and slow.')],
  fusion: ['frost', L2('Aliento Glacial', 'Glacial Breath'), L2('Un aliento de dragón helado con esquirlas: daño en cono y ralentiza.', 'An icy dragon breath with shards: cone damage and slows.')] };
const ptKey = () => { const P = G.P; return !P || !P.sr ? null : P.fus2 ? 'fus_' + P.fus2 : P.sr === 'dragon' && P.fus ? 'fusion' : P.sr; };
const ptRank = k => k === 'fusion' || /^fus_/.test(k) ? fusOwnRank(k) : fusRank(k);
const ptT = k => { const P = G.P; P.ptree = P.ptree || {}; const T = P.ptree[k] = P.ptree[k] || { s: [1, 1, 1], a: 0 }; const n = (FORM_POW[k] || []).length; while (T.s.length < n) T.s.push(1); return T; };
const ptCost = T => T.s.reduce((a, l) => a + (l - 1), 0) + (T.a ? 2 + (T.a - 1) : 0);
const ptPts = k => Math.max(0, ptRank(k) - 2);
const ptFree = k => ptPts(k) - ptCost(ptT(k));
// los poderes suben con el árbol
powNow = function () { const P = G.P; if (!P || !P.sr || !P.srF || !srOk()) return []; const k = ptKey(), L = FORM_POW[k] || [], T = ptT(k); return L.map((p, i) => [p[0], p[1] * [1, 1.5, 2][(T.s[i] || 1) - 1], p[2], p[3]]); };
// ---------- poderes de ataque: efectos dibujados ----------
const PFX = [];
let ptCd = 0;
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); try { const P = G.P; if (src && src.pfx) return d; if (P && P.srF && srOk() && m && d > 0 && ptCd <= G.t) { const k = ptKey(), T = k && ptT(k); if (T && T.a && Math.random() < [0, 0.08, 0.12, 0.16][T.a]) { ptCd = G.t + 5; pfxCast(k, m, T.a); } } } catch (e) { } return d; }; }
function pfxCast(k, m, lv) { const P = G.P, A = FORM_ATK[k]; if (!A) return; const dmg = P.S.atk * [0, 2.2, 2.8, 3.5][lv] * (1 + (P.S.skillP || 0) / 100), ang = Math.atan2(m.y - P.y, m.x - P.x), src = { pfx: 1 };
  const fx = { k: A[0], x: P.x, y: P.y - 10, tx: m.x, ty: m.y - 10, ang, t: 0, dur: 0.7, hit: 0 }; PFX.push(fx); floatText(P.x, P.y - 46, A[1], '#fff4b0'); sfx(A[0] === 'breath' || A[0] === 'frost' ? 'fire' : A[0] === 'spikes' ? 'ice' : 'slash2');
  const at = (t, f) => delayAct(t, f);
  if (A[0] === 'claw') { fx.dur = 0.5; at(0.15, () => hitCircle(m.x, m.y, 40, dmg, src)); }
  else if (A[0] === 'chain') { fx.dur = 0.8; at(0.25, () => hitCircle(m.x, m.y, 45, dmg, Object.assign({ stun: 1 }, src))); }
  else if (A[0] === 'bats') { fx.dur = 0.8; fx.b = [0, 1, 2, 3, 4, 5].map(i => ({ o: (i - 2.5) * 0.35, s: 0.8 + Math.random() * 0.4 })); at(0.45, () => { const n = hitCircle(m.x, m.y, 45, dmg, src); P.hp = Math.min(P.S.maxhp, P.hp + Math.round(P.S.maxhp * 0.05)); floatText(P.x, P.y - 40, '+5%', '#ff6a8a'); }); }
  else if (A[0] === 'breath' || A[0] === 'frost') { fx.dur = 0.7; at(0.1, () => hitArc(P.x, P.y, ang, 115, 1.0, dmg, A[0] === 'frost' ? Object.assign({ slow: 2 }, src) : src)); }
  else if (A[0] === 'spear') { fx.dur = 0.6; at(0.3, () => { hitCircle(m.x, m.y, 50, dmg, src); G.shake = 3; }); }
  else if (A[0] === 'ink') { fx.dur = 0.7; at(0.2, () => { for (let i = 0; i <= 4; i++) hitCircle(P.x + Math.cos(ang) * i * 30, P.y + Math.sin(ang) * i * 30, 26, dmg * 0.5, src, true); }); }
  else if (A[0] === 'spikes') { fx.dur = 0.8; for (let i = 1; i <= 5; i++) at(0.08 * i, () => hitCircle(P.x + Math.cos(ang) * i * 24, P.y + Math.sin(ang) * i * 24, 20, dmg * 0.45, Object.assign({ slow: 2 }, src), true)); } }
V33_TICKS.push(dt => { dt = Math.min(0.05, dt || 0.016); for (const f of PFX) f.t += dt; for (let i = PFX.length - 1; i >= 0; i--) if (PFX[i].t >= PFX[i].dur) PFX.splice(i, 1); });
const R_ = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
function pfxDraw(g, f, cx, cy) { const R_ = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }, ctx = g; { const u = f.t / f.dur, X = f.tx - cx, Y = f.ty - cy, x0 = f.x - cx, y0 = f.y - cy;
  if (f.k === 'claw') { for (let s = 0; s < 3; s++) { const st = s * 0.15; if (u < st) continue; const v = Math.min(1, (u - st) / 0.3), a = 1 - Math.max(0, (u - st - 0.3) / 0.4); ctx.globalAlpha = Math.max(0, a); for (let i = 0; i < 12 * v; i++) { const px = X - 14 + s * 8 + i * 2, py = Y - 16 + i * 2.4 + Math.sin(i / 3) * 2; R_(px, py, 3, 2, i % 3 ? '#e8f0ff' : '#ffffff'); R_(px + 1, py + 2, 2, 1, '#9ab0ff'); } } ctx.globalAlpha = 1; }
  else if (f.k === 'chain') { const h = 34 * Math.min(1, u * 2); ctx.globalAlpha = 1 - Math.max(0, (u - 0.6) / 0.4); for (const ox of [-14, -5, 5, 14]) for (let yy = 0; yy < h; yy += 5) { const sx = X + ox + Math.sin(yy / 6 + u * 10 + ox) * 3, sy = Y + 12 - yy; R_(sx - 2, sy, 4, 3, '#9ab8e0'); R_(sx - 1, sy + 1, 2, 1, '#2a3a5a'); } R_(X - 18, Y + 12, 36, 2, '#c8e0ff'); ctx.globalAlpha = 1; }
  else if (f.k === 'bats') { for (const b of f.b) { const v = Math.min(1, u * 1.6 * b.s), bx = x0 + (X - x0) * v + Math.sin(v * 9 + b.o * 5) * 10 * (1 - v), by = y0 + (Y - y0) * v + b.o * 20 * (1 - v), w = Math.sin(G.t * 30 + b.o * 9) > 0 ? 3 : 1; R_(bx - 1, by, 3, 2, '#1a0a1a'); R_(bx - 5, by - w + 1, 4, 1, '#2a0e2a'); R_(bx + 2, by - w + 1, 4, 1, '#2a0e2a'); R_(bx, by, 1, 1, '#ff3a3a'); } }
  else if (f.k === 'breath' || f.k === 'frost') { const ice = f.k === 'frost', cols = ice ? ['#ffffff', '#e0f8ff', '#a8e0ff', '#6aa8d8'] : ['#fff4b0', '#ffc040', '#ff7a2a', '#c8301a']; const n = 46; for (let i = 0; i < n; i++) { const r = ((i * 37) % 100) / 100 * 110 * Math.min(1, u * 2.5), a = f.ang + (((i * 53) % 100) / 100 - 0.5) * 0.9 * (r / 110 + 0.2), px = x0 + Math.cos(a) * r, py = y0 + Math.sin(a) * r * 0.8; if (u > 0.8 && i % 2) continue; const sz = 2 + (r / 40 | 0); R_(px, py, sz, sz, cols[Math.min(3, (r / 30) | 0)]); if (ice && i % 7 === 0) { R_(px, py - 3, 1, 7, '#ffffff'); R_(px - 3, py, 7, 1, '#ffffff'); } } }
  else if (f.k === 'spear') { const v = Math.min(1, u / 0.5), sy = Y - 120 * (1 - v); R_(X - 1, sy - 30, 3, 30, '#fff4b0'); R_(X, sy - 34, 1, 4, '#ffffff'); R_(X - 3, sy - 4, 7, 2, '#ffd040'); R_(X - 2, sy - 2, 5, 3, '#ffffff'); if (u > 0.5) { const rr = (u - 0.5) * 120; ctx.strokeStyle = 'rgba(255,240,170,' + (1 - (u - 0.5) * 2) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(X, Y + 10, rr, rr * 0.45, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 1; } }
  else if (f.k === 'ink') { const len = 150 * Math.min(1, u * 2.2); ctx.globalAlpha = 1 - Math.max(0, (u - 0.7) / 0.3); for (let s = 0; s < len; s += 2) { const px = x0 + Math.cos(f.ang) * s - Math.sin(f.ang) * Math.sin(s / 14) * 6, py = y0 + Math.sin(f.ang) * s + Math.cos(f.ang) * Math.sin(s / 14) * 6, w = 6 - Math.abs(s / len - 0.4) * 6; R_(px - w / 2, py - w / 2, Math.max(2, w), Math.max(2, w), '#1a1a24'); if (s % 22 === 0) R_(px + 4, py + 6, 2, 3, '#1a1a24'); } ctx.globalAlpha = 1; }
  else if (f.k === 'spikes') { for (let i = 1; i <= 5; i++) { const st = 0.1 * i; if (u < st) continue; const v = Math.min(1, (u - st) / 0.15), px = x0 + Math.cos(f.ang) * i * 24, py = y0 + 10 + Math.sin(f.ang) * i * 24, h = 18 * v * (u > 0.7 ? (1 - u) / 0.3 : 1); for (let k = 0; k < h; k++) { const w = Math.max(1, Math.round((h - k) / 3)); R_(px - w, py - k, w * 2, 1, k > h - 3 ? '#ffffff' : k % 3 ? '#a8e0ff' : '#e0f8ff'); } R_(px - 5, py, 10, 2, '#6aa8d8'); } } } }
WORLD_DRAW.push((cx, cy) => { for (const f of PFX) pfxDraw(ctx, f, cx, cy); });
// ---------- ventana del árbol ----------
let ptTab = null;
function ptOpen(k) { const P = G.P; const own = srOwned().filter(x => FORM_POW[x]).concat(fusTreeList()); if (!own.length) { toast(L2('Primero consigue una transformación.', 'Get a transformation first.'), 'warn'); return; }
  k = k || ptTab || ptKey() || own[0]; if (!own.includes(k)) k = own[0]; ptTab = k; const T = ptT(k), free = ptFree(k), nm = x => fusTreeName(x), A = FORM_ATK[k];
  const dots = (l, mx) => '●'.repeat(l) + '○'.repeat(mx - l);
  openModal(`<div class="frame ptree"><h3>🌳 ${L2('Árbol de poderes', 'Power tree')}</h3><div class="row wrap">${own.map(x => `<button class="btn sm ${x === k ? 'gold' : ''}" data-ptk="${x}">${esc(nm(x))}</button>`).join('')}</div>
    <p class="hint">${L2('Maestría ', 'Mastery ')}${ptRank(k)}/12 · ${L2('Puntos libres: ', 'Free points: ')}<b>${free}</b> / ${ptPts(k)}. ${L2('Cada rango de maestría desde el 3 da un punto. Funciona solo transformado.', 'Each mastery rank from 3 gives a point. Works only while transformed.')}</p>
    ${FORM_POW[k].map((p, i) => { const l = T.s[i] || 1, v = p[1] * [1, 1.5, 2][l - 1]; return `<div class="gsrc"><span><b>⚡ ${esc(p[2])}</b> <small>${dots(l, 3)}</small><br><small>${esc(p[3])} → ${L2('ahora ×', 'now ×')}${[1, 1.5, 2][l - 1]} (${Math.round(v * 10) / 10})</small></span>${l < 3 ? `<button class="btn sm gold" data-pts="${i}" ${free < 1 ? 'disabled' : ''}>+1 (1 ★)</button>` : '<b>MAX</b>'}</div>`; }).join('')}
    <div class="gsrc ptatk"><span><b>💥 ${esc(A[1])}</b> <small>${dots(T.a, 3)}</small><br><small>${esc(A[2])} ${L2('Salta solo al golpear: ', 'Triggers on hit: ')}${[8, 12, 16][Math.max(0, T.a - 1)]} % · ${L2('daño ', 'damage ')}${[220, 280, 350][Math.max(0, T.a - 1)]} %</small></span>${T.a < 3 ? `<button class="btn sm gold" data-pta="1" ${free < (T.a ? 1 : 2) ? 'disabled' : ''}>${T.a ? '+1 (1 ★)' : L2('Aprender (2 ★)', 'Learn (2 ★)')}</button>` : '<b>MAX</b>'}</div>
    <canvas id="ptPrev" width="220" height="90" style="width:100%;max-width:330px;image-rendering:pixelated;background:#1a2a1a;border-radius:.4em;display:block;margin:.3em auto"></canvas>
    <div class="row"><button class="btn sm" id="ptR">${L2('Reiniciar puntos', 'Reset points')}</button><button class="btn" id="ptX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#ptX').onclick = closeModal; $('#ptR').onclick = () => { P.ptree[k] = { s: [1, 1, 1], a: 0 }; calcStats(P); markDirty(); ptOpen(k); };
  $$('#modal [data-ptk]').forEach(b => b.onclick = () => ptOpen(b.dataset.ptk));
  $$('#modal [data-pts]').forEach(b => b.onclick = () => { const i = +b.dataset.pts; if (ptFree(k) < 1 || T.s[i] >= 3) return; T.s[i]++; calcStats(P); markDirty(true); sfx('level'); ptOpen(k); });
  const ba = $('#modal [data-pta]'); if (ba) ba.onclick = () => { const c = T.a ? 1 : 2; if (ptFree(k) < c || T.a >= 3) return; T.a++; markDirty(true); sfx('level'); ptOpen(k); };
  ptPreview(k); }
// vista previa del ataque en la propia ventana
function ptPreview(k) { const cv = $('#ptPrev'); if (!cv) return; const g = cv.getContext('2d'), kind = FORM_ATK[k][0]; let t0 = performance.now();
  const loop = () => { if (!document.body.contains(cv)) return; const u = ((performance.now() - t0) / 1000) % 1.4, f = { k: kind, x: 40, y: 50, tx: 170, ty: 50, ang: 0, t: Math.min(u, 0.8), dur: 0.8, b: [0, 1, 2, 3, 4, 5].map(i => ({ o: (i - 2.5) * 0.35, s: 1 })) };
    g.clearRect(0, 0, cv.width, cv.height); g.fillStyle = '#2a4a2a'; g.fillRect(0, 62, cv.width, 28); g.fillStyle = '#c84a3a'; g.fillRect(162, 40, 16, 22); g.fillStyle = '#ffd8b0'; g.fillRect(32, 36, 14, 26);
    pfxDraw(g, f, 0, 0); requestAnimationFrame(loop); }; loop(); }
V33_TICKS.push(() => { const row = $('#tr .trbtns'); if (!row || !G.P) return; if (!$('#bTree')) { const b = document.createElement('button'); b.className = 'mini'; b.id = 'bTree'; b.title = L2('Árbol de poderes', 'Power tree'); b.setAttribute('aria-label', b.title); b.textContent = '🌳'; b.onclick = () => ptOpen(); row.appendChild(b); } });

// =====================================================================================
// PESCA EN HIELO (Picos Helados)
// =====================================================================================
const ICEF = [['ph_bacalao', L2('Bacalao ártico', 'Arctic cod'), 40, '#8aa8c8', 900], ['ph_salvelino', L2('Salvelino', 'Char'), 28, '#c87a5a', 1600], ['ph_cristal', L2('Pez Cristal', 'Crystal fish'), 16, '#bfe8ff', 3500], ['ph_aurora', L2('Pez Aurora', 'Aurora fish'), 9, '#9aff9a', 7000], ['ph_rey', L2('Rey del Lago Helado', 'Frozen Lake King'), 5, '#e0f8ff', 15000], ['ph_dorado', L2('Pez Escarcha Dorado', 'Golden Frost Fish'), 2, '#ffd040', 40000]];
for (const [id, n, w, col, pr] of ICEF) it(id, { n, t: 'mat', fish: true, stack: true, tier: 6, price: pr, icon: ['fish', col], rar: w <= 5 ? 4 : w <= 16 ? 2 : 1, d: L2('Pescado en un hoyo del lago helado de los Picos Helados. Se vende bien.', 'Caught in a hole in the frozen lake of the Frozen Peaks. Sells well.') });
XSPR.hielo_hoyo = () => { const [c, g] = XC(34, 22); g.fillStyle = '#dcf0ff'; g.beginPath(); g.ellipse(17, 12, 16, 9, 0, 0, 7); g.fill(); g.fillStyle = '#8ac0e8'; g.beginPath(); g.ellipse(17, 12, 11, 6, 0, 0, 7); g.fill(); g.fillStyle = '#1a3a5a'; g.beginPath(); g.ellipse(17, 12, 8, 4, 0, 0, 7); g.fill(); g.fillStyle = '#5a3a1e'; g.fillRect(29, 2, 2, 12); g.fillStyle = '#c8a050'; g.fillRect(26, 1, 8, 2); return { c, ax: 17, ay: 20 }; };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); try { for (const [x, y] of [[190, 33], [196, 30]]) { const [hx, hy] = freeTileNear(W, x, y); addObj(W, 'furn', hx, hy, { f: 'hielo_hoyo', fp: [[0, 0]], solid: false, xact: 'icefish' }); } } catch (e) { console.warn(e); } }; }
XACT.icefish = [() => '🎣 ' + L2('Pescar en el hielo', 'Ice fishing'), 'fish', o => icefStart(o)];
function icefStart(o) { if (actBusy()) return; const P = G.P; P.x = o.px; P.y = o.py + 16; P.dir = 'up';
  Object.assign(ACT, { k: 'icefish', o, casts: 0, got: [], ph: 'wait', t: 1.5 + Math.random() * 2.5, bar: 0, bv: 1.4, hits: 0, onAtk: () => { icefAtk(); return true; } });
  banner('🎣 ' + L2('Pesca en el hielo', 'Ice fishing'), L2('Cuando el corcho se hunda, toca ⚔. Luego toca ⚔ con la marca en la zona verde (3 veces). Mueve el joystick para irte.', 'When the float sinks, tap ⚔. Then tap ⚔ with the marker in the green zone (3 times). Move the joystick to leave.')); }
function icefPick() { const tot = ICEF.reduce((a, f) => a + f[2], 0); let r = Math.random() * tot; for (const f of ICEF) { r -= f[2]; if (r <= 0) return f; } return ICEF[0]; }
function icefAtk() { const B = ACT; const held = G.t - (B.lastAtk || -9) < 0.25; B.lastAtk = G.t; if (held) return; // 5.97: mantener ⚔ pulsado repite el ataque cada fotograma: solo cuenta el primer toque
  if (B.ph === 'wait') { floatText(G.P.x, G.P.y - 40, L2('¡Muy pronto!', 'Too early!'), '#c8c8c8'); B.t = Math.min(B.t + 0.5, 4); return; }
  if (B.ph === 'bite') { B.ph = 'reel'; B.fish = icefPick(); B.bar = 0; B.bv = 1.2 + ICEF.indexOf(B.fish) * 0.25; B.hits = 0; B.zone = 0.25 + Math.random() * 0.4; sfx('ui'); return; }
  if (B.ph === 'reel') { const ok = Math.abs(B.bar - B.zone) < 0.1; if (ok) { B.hits++; sfx('coin'); B.zone = 0.15 + Math.random() * 0.7; if (B.hits >= 3) { giveItem(B.fish[0], 1, true); B.got.push(B.fish[1]); floatText(G.P.x, G.P.y - 44, B.fish[1], B.fish[3]); gainJobXp('pesca', 12 + ICEF.indexOf(B.fish) * 10); icefNext(); } } else { floatText(G.P.x, G.P.y - 40, L2('¡Se escapó!', 'It got away!'), '#ff8a8a'); sfx('hurt'); icefNext(); } } }
function icefNext() { const B = ACT; B.casts++; if (B.casts >= 5) { banner('🎣 ' + L2('Pesca en el hielo', 'Ice fishing'), B.got.length ? B.got.join(', ') : L2('Hoy no picaron…', 'Nothing bit today…')); actEnd(); markDirty(); return; } B.ph = 'wait'; B.t = 1.5 + Math.random() * 2.5; }
V33_TICKS.push(dt => { if (ACT.k !== 'icefish') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P; P.x = B.o.px; P.y = B.o.py + 16;
  try { const [mx, my] = moveInput(); B.leave = Math.hypot(mx, my) > 0.5 ? (B.leave || 0) + dt : 0; } catch (e) { } // 5.97: mover el joystick 0,6 s = dejar de pescar
  if (B.leave > 0.6 || P.dead) { banner('🎣 ' + L2('Dejas de pescar', 'You stop fishing'), B.got.length ? B.got.join(', ') : L2('Sin capturas', 'No catch')); actEnd(); P.y += 10; markDirty(); return; }
  if (B.ph === 'wait') { B.t -= dt; if (B.t <= 0) { B.ph = 'bite'; B.t = 1.4; sfx('quest'); floatText(P.x, P.y - 46, L2('¡PICA! ⚔', 'BITE! ⚔'), '#ffe08a', true); vibrate(40); } } else if (B.ph === 'bite') { B.t -= dt; if (B.t <= 0) { floatText(P.x, P.y - 40, L2('Se fue…', 'Gone…'), '#c8c8c8'); icefNext(); } }
  else if (B.ph === 'reel') { B.bar += B.bv * dt; if (B.bar > 1) { B.bar = 1; B.bv = -Math.abs(B.bv); } if (B.bar < 0) { B.bar = 0; B.bv = Math.abs(B.bv); } }
  mgHud(`🎣 ${B.casts + 1}/5 · ${B.ph === 'wait' ? L2('esperando…', 'waiting…') : B.ph === 'bite' ? L2('¡PICA! ⚔', 'BITE! ⚔') : '✓ ' + B.hits + '/3'}`); });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'icefish') return; const B = ACT, x = B.o.px - cx, y = B.o.py - cy - 2, dip = B.ph === 'bite' ? 3 + Math.sin(G.t * 30) * 2 : Math.sin(G.t * 3);
  ctx.strokeStyle = '#e8e8e8'; ctx.beginPath(); ctx.moveTo(x + 13, y - 10); ctx.lineTo(x, y + dip); ctx.stroke(); R_(x - 2, y - 2 + dip, 4, 3, '#ff3a3a'); R_(x - 2, y - 3 + dip, 4, 1, '#ffffff');
  if (B.ph === 'reel') { const bx = x - 40, by = y - 46; R_(bx, by, 80, 8, '#1a1a1e'); R_(bx + 80 * (B.zone - 0.1), by, 16, 8, '#4ac84a'); R_(bx + 80 * B.bar - 1, by - 3, 3, 14, '#ffffff'); drawTxt(B.fish ? '🐟' : '', bx + 88, by + 7, '#fff', 9); } });

// =====================================================================================
// DIARIO DE VIAJE (Bitácora › 🗺 Diario): una postal por país y premio al completarlo
// =====================================================================================
SAVEKEYS.push('diaryDone');
[['m_peru', L2('Perú', 'Peru'), '#d8201e', 'Pe'], ['m_mexico', L2('México', 'Mexico'), '#1a8a3a', 'Mx'], ['m_espana', L2('España', 'Spain'), '#e8b020', 'Es']].forEach(s => { if (!STAMPS.some(x => x[0] === s[0])) STAMPS.push(s); });
V33_TICKS.push(() => { const id = G.map && G.map.id; if (!id) return; if (/^(lima|lima_norte|trujillo|cusco|machupicchu|bus_pe)/.test(id)) stampAdd('m_peru'); if (/^mexico|acapulco/.test(id)) stampAdd('m_mexico'); if (/^espana/.test(id)) stampAdd('m_espana'); });
const DIARY = [['m_japon', 'torii', L2('Japón', 'Japan')], ['m_peru', 'mp', L2('Perú', 'Peru')], ['m_mexico', 'pyr', L2('México', 'Mexico')], ['m_espana', 'castle', L2('España', 'Spain')], ['m_cielo', 'isle', 'Altavela'], ['m_velo', 'moon', L2('Velo Roto', 'Broken Veil')], ['m_archi', 'palm', L2('Archipiélago', 'Archipelago')], ['m_sinpintar', 'sketch', L2('Tierras sin Pintar', 'Unpainted Lands')]];
const POSTC = {};
function postcard(kind, on) { const key = kind + on; if (POSTC[key]) return POSTC[key]; const c = document.createElement('canvas'); c.width = 96; c.height = 60; const g = c.getContext('2d'), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const sky = { torii: ['#ffb0c8', '#ffe0ea'], mp: ['#6ab0e8', '#c8e8ff'], pyr: ['#ffb040', '#ffe0a0'], castle: ['#4a8ae8', '#bfe0ff'], isle: ['#8ad0ff', '#ffffff'], moon: ['#1a0a2a', '#4a2a6a'], palm: ['#3ac8e8', '#bff4ff'], sketch: ['#d8d4cc', '#fbfaf6'] }[kind];
  const gr = g.createLinearGradient(0, 0, 0, 60); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(0, 0, 96, 60);
  if (kind === 'torii') { R(0, 44, 96, 16, '#5a9a4a'); R(30, 18, 36, 4, '#c8202a'); R(28, 16, 40, 3, '#1a1a1a'); R(34, 26, 28, 3, '#c8202a'); R(36, 22, 4, 24, '#c8202a'); R(56, 22, 4, 24, '#c8202a'); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(70, 44); g.lineTo(86, 16); g.lineTo(96, 44); g.fill(); }
  if (kind === 'mp') { g.fillStyle = '#3a6a3a'; g.beginPath(); g.moveTo(40, 50); g.lineTo(62, 10); g.lineTo(84, 50); g.fill(); g.fillStyle = '#4a7a3a'; g.beginPath(); g.moveTo(0, 50); g.lineTo(20, 26); g.lineTo(44, 50); g.fill(); R(0, 46, 96, 14, '#7a9a5a'); for (let i = 0; i < 6; i++) R(12 + i * 9, 40 - (i % 2) * 3, 7, 6, '#a8a298'); R(70, 42, 6, 5, '#f4ece0'); R(75, 39, 2, 4, '#f4ece0'); }
  if (kind === 'pyr') { R(0, 46, 96, 14, '#d8b070'); for (let i = 0; i < 6; i++) R(22 + i * 4, 18 + i * 5, 52 - i * 8, 5, i % 2 ? '#a87a4a' : '#c8945a'); R(44, 14, 8, 6, '#8a5a2a'); g.fillStyle = '#3a8a3a'; R(80, 30, 4, 16, '#3a8a3a'); R(76, 34, 4, 3, '#3a8a3a'); R(84, 36, 4, 3, '#3a8a3a'); }
  if (kind === 'castle') { R(0, 48, 96, 12, '#c8a050'); R(24, 22, 48, 26, '#e8d0a0'); for (const x of [20, 44, 68]) { R(x, 14, 10, 34, '#d8c090'); R(x - 1, 12, 12, 3, '#a87a4a'); } for (let x = 24; x < 72; x += 6) R(x, 20, 3, 3, '#e8d0a0'); R(44, 36, 8, 12, '#5a3a1e'); }
  if (kind === 'isle') { g.fillStyle = '#ffffff'; for (const [x, y] of [[10, 44], [30, 48], [60, 46], [84, 44]]) { g.beginPath(); g.ellipse(x, y, 16, 6, 0, 0, 7); g.fill(); } g.fillStyle = '#5a9a4a'; g.beginPath(); g.ellipse(48, 26, 24, 6, 0, 0, 7); g.fill(); g.fillStyle = '#7a5a3a'; g.beginPath(); g.moveTo(26, 27); g.lineTo(48, 44); g.lineTo(70, 27); g.fill(); R(42, 12, 12, 14, '#f4f4f8'); R(40, 10, 16, 3, '#ffd040'); }
  if (kind === 'moon') { g.fillStyle = '#f4f0d8'; g.beginPath(); g.arc(70, 18, 10, 0, 7); g.fill(); g.fillStyle = '#1a0a2a'; g.beginPath(); g.arc(74, 16, 9, 0, 7); g.fill(); R(0, 46, 96, 14, '#2a1a3a'); R(22, 14, 12, 32, '#3a2a4a'); R(24, 10, 8, 5, '#3a2a4a'); R(26, 22, 4, 5, '#ffd040'); for (let i = 0; i < 12; i++) R((i * 37) % 96, (i * 13) % 30, 1, 1, '#ffffff'); }
  if (kind === 'palm') { R(0, 44, 96, 16, '#2a8ab0'); g.fillStyle = '#f0d890'; g.beginPath(); g.ellipse(36, 44, 22, 6, 0, 0, 7); g.fill(); R(38, 20, 3, 24, '#8a5a2a'); g.fillStyle = '#3aa04a'; for (const a of [-2.6, -2, -1.2, -0.6, 0]) { g.beginPath(); g.ellipse(40 + Math.cos(a) * 9, 20 + Math.sin(a) * 4, 10, 3, a, 0, 7); g.fill(); } g.fillStyle = '#f0d890'; g.beginPath(); g.ellipse(80, 46, 10, 3, 0, 0, 7); g.fill(); }
  if (kind === 'sketch') { g.strokeStyle = '#1a1a24'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 46); for (let x = 0; x <= 96; x += 6) g.lineTo(x, 46 + Math.sin(x / 9) * 3); g.stroke(); g.beginPath(); g.moveTo(20, 46); g.lineTo(40, 18); g.lineTo(58, 46); g.stroke(); g.beginPath(); g.arc(76, 16, 6, 0, 7); g.stroke(); for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(8 + i * 11, 54); g.lineTo(12 + i * 11, 50); g.stroke(); } }
  if (!on) { g.fillStyle = 'rgba(30,24,20,0.82)'; g.fillRect(0, 0, 96, 60); g.fillStyle = '#c8b8a0'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'; g.fillText('?', 48, 38); }
  g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, 93, 57); return POSTC[key] = c.toDataURL(); }
BIT_TABS.splice(5, 0, ['diario', '🗺', L2('Diario', 'Diary')]); if (typeof LASTW_IC !== 'undefined') LASTW_IC.diario = '🗺';
BIT_RENDER.diario = () => { const b = BIT(), got = b.stamps || {}, n = DIARY.filter(d => got[d[0]]).length;
  return `<p class="hint">${L2('Una postal por cada país y mundo que visitas. Completa el diario para un premio: título «Trotamundos», marco «Postal» y 1.000.000 de oro. ', 'One postcard for each country and world you visit. Complete the diary for a prize: «Globetrotter» title, «Postcard» frame and 1,000,000 gold. ')}<b>${n}/${DIARY.length}</b></p>
    <div class="bdiary">${DIARY.map(([k, kind, name]) => `<div class="bpost"><img src="${postcard(kind, !!got[k])}" alt=""><small>${got[k] ? esc(name) + ' · ' + esc(String(got[k])) : '???'}</small></div>`).join('')}</div>`; };
{ const st = document.createElement('style'); st.textContent = `.bdiary{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.5em,1fr));gap:.5em}.bpost{text-align:center}.bpost img{width:100%;image-rendering:pixelated;border-radius:.2em;box-shadow:0 2px 6px rgba(0,0,0,.5);transform:rotate(-1deg)}.bpost:nth-child(2n) img{transform:rotate(1.2deg)}
.pframe.fr-postal,.bfrb.fr-postal i{box-shadow:0 0 0 2px #fff,0 0 0 4px #c8202a,0 0 0 6px #fff,0 0 0 8px #2a5ad8!important}`; document.head.appendChild(st); }
Object.assign(BIT_FR, { postal: [L2('Postal', 'Postcard'), '#2a5ad8'] });
{ const cat = (TITLES.find(t => t[0] === 't_artesano') || [0, 0, 'natural'])[2]; const t = ['t_trotamundos', L2('Trotamundos', 'Globetrotter'), cat, P => !!P.diaryDone, L2('Completa el Diario de viaje.', 'Complete the Travel diary.')]; TITLES.push(t); TIT_ID[t[0]] = t; }
V33_TICKS.push(() => { const P = G.P; if (!P || P.diaryDone) return; const got = (BIT().stamps || {}); if (!DIARY.every(d => got[d[0]])) return; P.diaryDone = 1; P.gold += 1000000; const b = BIT(); if (!b.fr.includes('postal')) b.fr.push('postal'); banner('🗺 ' + L2('¡Diario de viaje completo!', 'Travel diary complete!'), L2('Título «Trotamundos», marco «Postal» y 1.000.000 de oro.', '«Globetrotter» title, «Postcard» frame and 1,000,000 gold.')); sfx('level'); markDirty(true); });

// =====================================================================================
// MASCOTAS QUE EVOLUCIONAN: ya existían Cría → Adulto → Legendario (vínculo 100 y 300). Se añade la 4.ª, Mítico (600):
// aura dorada, corona y +3 % más de ataque y vida (el vínculo sube al pelear juntos).
// =====================================================================================
PET_EVO.push([600, L2('Mítico', 'Mythic'), 1.7]);
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e.type !== 'pet' || !G.P || e.pid !== G.P.pet || petEvo(e.pid) < 3) return _de.apply(this, arguments);
  const x = Math.round(e.x - cx), y = Math.round(e.y - cy), s = e.scale || 1.7; ctx.fillStyle = 'rgba(255,210,80,' + (0.25 + Math.sin(G.t * 4) * 0.08) + ')'; ctx.beginPath(); ctx.ellipse(x, y, 14 * s, 5 * s, 0, 0, 7); ctx.fill();
  const r = _de.apply(this, arguments); const hy = y - 18 * s - (e.z || 0); R_(x - 4, hy, 9, 2, '#ffd040'); R_(x - 4, hy - 2, 1, 2, '#ffd040'); R_(x, hy - 3, 1, 3, '#ffd040'); R_(x + 4, hy - 2, 1, 2, '#ffd040'); R_(x, hy - 3, 1, 1, '#ff4a4a');
  if (Math.random() < 0.25) part(e.x + (Math.random() - 0.5) * 20, e.y - 8 - Math.random() * 14, { vz: 12, life: 0.6, c: '#ffe080', s: 1 }); return r; }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['v550', '🌳 ' + L2('Árbol de poderes y novedades 5.50', 'Power tree and 5.50 news'), () => [
  L2('🌳 Árbol de poderes (▦ Atajos › 🌳): cada rango de maestría desde el 3 da un punto. Sube los 3 poderes de cada forma (×1,5 y ×2) y aprende su poder de ataque, que salta solo al golpear y tiene su propio dibujo: ', '🌳 Power tree (▦ Shortcuts › 🌳): each mastery rank from 3 gives a point. Raise each form\'s 3 powers (×1.5 and ×2) and learn its attack power, which triggers on hit and has its own drawing: ') + PT_KEYS.map(k => FORM_ATK[k][1]).join(', ') + '.',
  L2('🎣 Pesca en el hielo: hoyos en el lago helado de los Picos Helados. Corcho que se hunde → ⚔, y luego ⚔ con la marca en verde 3 veces. 6 peces, el Pez Escarcha Dorado es muy raro.', '🎣 Ice fishing: holes in the frozen lake of the Frozen Peaks. Float sinks → ⚔, then ⚔ with the marker on green 3 times. 6 fish; the Golden Frost Fish is very rare.'),
  L2('🗺 Diario de viaje (Bitácora › Diario): una postal por país y mundo. Al completarlo: título «Trotamundos», marco «Postal» y 1.000.000 de oro.', '🗺 Travel diary (Logbook › Diary): one postcard per country and world. Complete it: «Globetrotter» title, «Postcard» frame and 1,000,000 gold.'),
  L2('✨ Mascotas: nueva evolución Mítico (vínculo 600) tras Cría, Adulto y Legendario: más grande, aura dorada, corona y +9 % de ataque y vida en total. El vínculo sube al pelear y recolectar juntos.', '✨ Pets: new Mythic evolution (bond 600) after Baby, Adult and Legendary: bigger, golden aura, crown and +9% attack and HP in total. Bond grows by fighting and gathering together.')], () => null]);
