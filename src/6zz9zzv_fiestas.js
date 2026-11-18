// ================= v5.19: FIESTAS Y TRABAJOS EN MÉXICO, PERÚ Y ESPAÑA =================
// Ropa típica mexicana (Adelita, Jalisco, Chiapaneca, charro con sarape, camiseta del calendario) y traje de flamenca,
// Ballet Folklórico en Guadalajara (oficio «folklorico», baile Jarabe Tapatío), lotería en el Zócalo, piñata en
// Cuernavaca, vendedor ambulante en Gamarra (oficio «ambulante»: carrito, clientes que llegan, regateo y serenazgo),
// concurso de marinera en la Plaza de Armas de Lima, tablao flamenco en Sevilla y la Tomatina en Valencia.
// Sellos culturales: la primera vez que trabajas en un oficio de estos países o ganas uno de estos eventos, +0,5 % de
// daño para siempre (no cuenta en los duelos PvP). P.cul = { clave: 1 }.

// ---------- ropa ----------
const MXP = { blanco: IDP.blanco, negro: IDP.negro, rojo: IDP.rojo, rosa: IDP.rosa, azul: IDP.azul, naranja: IDP.naranja, morado: IDP.violeta, oro: IDP.oro,
  verde: P5(['#0a3a1a', '#146a2e', '#1e9a44', '#4ac46a', '#9ae8a8']), amarillo: P5(['#6a5a0a', '#b09a1a', '#e8cc2a', '#ffe860', '#fff6b0']), turquesa: P5(['#0a4a4a', '#147a7a', '#22b0b0', '#5ad8d0', '#b0f4ee']),
  negro2: P5(['#08070c', '#12111a', '#1d1c28', '#2b2a38', '#3f3e4e']), rojo2: P5(['#4a0a12', '#8a1422', '#c22232', '#e2424a', '#ff7c7c']), naranja2: P5(['#6a2a0c', '#b0521c', '#e88232', '#ffb262', '#ffe0b2']),
  cafe: P5(['#2a1a0e', '#4a2e1a', '#6a4428', '#8a5e3a', '#b08058']), tul: P5(['#101014', '#1c1c22', '#2e2e38', '#4a4a58', '#6a6a7a']) };
const MX_RIB = [MXP.rosa, MXP.naranja, MXP.amarillo, MXP.verde, MXP.turquesa, MXP.azul, MXP.morado, MXP.rojo];
const fsDot = (x, y) => y % 3 === 0 && (x + ((y / 3) % 2 ? 2 : 0)) % 4 === 0;
// blusa de hombros caídos con volante; cintas de colores (Jalisco), flores bordadas (Chiapas), lunares (flamenca) y faja
idK('body', 'mx_blusa', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, m = s.m, r = s.r || m;
  idBare(p, A, m, tx0 - 2, ty, R + 2, ty);
  const vy = ty + 1, x0 = side ? tx0 : tx0 - 1, x1 = side ? R : R + 1; for (let x = x0; x <= x1; x++) { p.set(x, vy, r[3]); p.set(x, vy + 1, x === x0 || x === x1 ? r[2] : r[4]); }
  if (!side) { p.set(x0, vy + 2, r[2]); p.set(x1, vy + 2, r[2]); }
  const low = ty + th - (s.cint ? 3 : 1);
  if (s.rib) s.rib.forEach((c, k) => { const y = vy + 3 + k; if (y >= low) return; for (let x = tx0; x <= R; x++) p.set(x, y, c[x === tx0 ? 3 : x === R ? 1 : 2]); });
  if (s.fl && !up) for (let y = vy + 3; y < low; y += 2) for (let x = tx0 + ((y >> 1) % 2); x < R; x += 3) { const c = s.fl[(x + y) % s.fl.length]; p.set(x, y, c[3]); p.set(x + 1, y, c[2]); }
  if (s.dots) for (let y = vy + 3; y < low; y++) for (let x = tx0; x <= R; x++) if (fsDot(x, y)) p.set(x, y, s.dots[4]);
  if (s.cint) { const c = s.cint; for (let x = tx0; x <= R; x++) { p.set(x, ty + th - 3, c[3]); p.set(x, ty + th - 2, c[2]); } if (!up) { const kx = side ? cx - d * 2 : R - 1; p.set(kx, ty + th - 1, c[2]); p.set(kx, ty + th, c[1]); } } });
// falda larga de vuelo hasta los tobillos: cintas (Adelita), bandas de colores con encaje (Jalisco), flores (Chiapas), lunares (flamenca)
idK('legs', 'mx_falda', (p, A, s) => { const m = s.m, hem = idHem(A, s.long || 0.84), H = Math.max(1, hem - A.legTop); idLegsBelow(p, A, m, hem, 99, null, 0, null);
  const bandAt = y => { for (const [o, c] of s.hb || []) if (y === hem - o) return c; return null; };
  { const R_ = A.tx0 + A.tw - 1, y = A.legTop - 1; for (let x = A.side ? A.cx - 4 : A.tx0; x <= (A.side ? A.cx + 3 : R_); x++) if (!uA(p.get(x, y))) p.set(x, y, m[1]); }   // pretina: une la falda al torso también en la caminata
  idSkirtShape(p, A, hem, A.side ? 3 : 5, (x, y, l, r, h) => { const t = (y - A.legTop) / H;
    if (h) return s.lace ? s.lace[(x % 2) ? 4 : 3] : m[1];
    if (s.multi) { const k = Math.min(s.multi.length - 1, Math.floor(t * s.multi.length)), P_ = s.multi[k], top = Math.floor(k * H / s.multi.length) + A.legTop; if (y === top && k && s.lace) return s.lace[4]; return l ? P_[3] : r ? P_[1] : P_[2]; }
    const b = bandAt(y); if (b) return b;
    if (s.fl && (t > 0.4 && t < 0.62 || t > 0.72) && (y - A.legTop) % 3 !== 2) { if ((x + (y >> 1) * 3) % 5 < 2) { const c = s.fl[((x >> 1) + (y >> 1)) % s.fl.length]; return c[(x + y) % 2 ? 3 : 2]; } }
    if (s.dots && fsDot(x, y)) return s.dots[4];
    if (s.ruf && t > 0.62 && (y - A.legTop) % 3 === 0) return s.ruf[2];
    return l ? m[3] : r ? m[1] : m[2]; }); });
// flor en el pelo (rosa) o corona de flores (Chiapas)
fitKind('head', 'mx_flor', (p, A, s) => { const { hx, hrx, hry, headTop, side, up, d } = A, lf = MXP.verde;
  const rose = (x, y, c) => { p.set(x, y, c[3]); p.set(x + 1, y, c[2]); p.set(x - 1, y, c[2]); p.set(x, y + 1, c[2]); p.set(x + 1, y + 1, c[1]); p.set(x - 1, y + 1, c[1]); p.set(x, y - 1, c[4]); p.set(x + 1, y - 1, c[3]); };
  if (s.crown) { for (let k = -3; k <= 3; k++) { if (side && k * d < -1) continue; const x = Math.round(hx + k * hrx / 3.3), y = Math.round(headTop + 1 + Math.abs(k) * 0.7); p.set(x, y + 2, lf[2]); rose(x, y, s.crown[(k + 3) % s.crown.length]); } return; }
  const x = Math.round(side ? hx - d * (hrx - 3) : (up ? hx - hrx + 3 : hx + hrx - 3)), y = Math.round(headTop + hry * 0.5); p.set(x + 2, y + 2, lf[3]); p.set(x - 2, y + 2, lf[2]); rose(x, y, s.m); if (s.mono) { p.set(x - 2, y, s.mono[3]); p.set(x + 2, y, s.mono[3]); } });
// sombrero de charro: ala muy ancha con ribete y copa alta
fitKind('head', 'mx_sombrero', (p, A, s) => { const { hx, hy } = A, m = s.m, t = s.t, by = Math.round(hy - 4);
  for (let x = hx - 14; x <= hx + 14; x++) { const e = Math.abs(x - hx), lift = e > 11 ? 1 : 0, y = by - lift; p.set(x, y, e > 13 ? t[3] : m[3]); p.set(x, y + 1, e > 12 ? t[2] : m[2]); if (e < 12) p.set(x, y + 2, m[1]); if (e > 3 && e < 13 && x % 3 === 0) p.set(x, y, t[4]); }
  for (let y = by - 9; y < by; y++) { const hw = y < by - 8 ? 2 : y < by - 6 ? 4 : 5; for (let x = hx - hw; x <= hx + hw; x++) p.set(x, y, x < hx - hw + 2 ? m[4] : x > hx + hw - 2 ? m[2] : m[3]); }
  for (let x = hx - 5; x <= hx + 5; x++) p.set(x, by - 2, t[(x % 2) ? 3 : 4]); });
// sarape (jorongo) de rayas en V con flecos
fitKind('body', 'mx_sarape', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up, d, legTop } = A, R = tx0 + tw - 1, cols = s.rib, x0 = side ? cx - 5 : tx0 - 3, x1 = side ? cx + 4 : R + 3, bot = legTop + 2, mid = side ? cx - 0.5 - d : cx - 0.5;
  for (let y = ty + 1; y <= bot; y++) for (let x = x0; x <= x1; x++) { const vd = Math.abs(x - mid); if (y > bot - Math.round(vd * 0.45)) continue; const k = ((Math.floor(y - ty + vd * 0.7) % cols.length) + cols.length) % cols.length, c = cols[k];
    p.set(x, y, x === x0 ? c[3] : x === x1 ? c[1] : c[2]); if (y === bot - Math.round(vd * 0.45)) p.set(x, y + 1, s.m[x % 2 ? 2 : 3]); }
  if (!up && !side) { p.set(cx - 1, ty + 1, s.m[3]); p.set(cx, ty + 1, s.m[3]); } });
// camiseta verde con el calendario en relieve (diseño propio, sin escudo ni marca)
{ const J0 = FITK.body.jersey; fitKind('body', 'mx_azteca', (p, A, s) => { if (J0) J0.draw(p, A, s); if (A.up || A.side) return; const { tx0, tw, torsoTop: ty, th } = A, ccx = tx0 + (tw - 1) / 2, ccy = ty + th * 0.5, m = s.m;
  for (let y = ty + 2; y < ty + th - 1; y++) for (let x = tx0 + 1; x < tx0 + tw - 1; x++) { const r = Math.hypot(x - ccx, (y - ccy) * 1.1); if (Math.abs(r - 2) < 0.5 || Math.abs(r - 4.2) < 0.45) p.set(x, y, m[1]); else if (r < 1) p.set(x, y, m[1]); } }); }
const FS_COS = [
  ['c_mx_adelita_blusa', L2('Adelita · blusa blanca con faja roja', 'Adelita · white blouse with red sash'), 'body', () => ({ k: 'mx_blusa', m: MXP.blanco, r: MXP.blanco, cint: MXP.rojo, sl: 'puff' }), 3500],
  ['c_mx_adelita_falda', L2('Adelita · falda negra de cintas', 'Adelita · black ribbon skirt'), 'legs', () => ({ k: 'mx_falda', m: MXP.negro2, hb: [[1, MXP.verde[3]], [2, MXP.blanco[4]], [3, MXP.rojo[3]], [5, MXP.blanco[3]]] }), 4500],
  ['c_mx_adelita_flor', L2('Adelita · rosa roja en el pelo', 'Adelita · red rose in the hair'), 'head', () => ({ k: 'mx_flor', m: MXP.rojo }), 1200],
  ['c_mx_jalisco_blusa', L2('Jalisco · blusa de cintas', 'Jalisco · ribbon blouse'), 'body', () => ({ k: 'mx_blusa', m: MXP.naranja, r: MXP.blanco, rib: [MXP.rosa, MXP.amarillo, MXP.verde, MXP.azul], sl: 'puff' }), 4000],
  ['c_mx_jalisco_falda', L2('Jalisco · falda de vuelo de colores', 'Jalisco · colourful full skirt'), 'legs', () => ({ k: 'mx_falda', m: MXP.naranja2, multi: [MXP.rosa, MXP.naranja, MXP.amarillo, MXP.verde, MXP.turquesa, MXP.morado], lace: MXP.blanco }), 6000],
  ['c_mx_jalisco_mono', L2('Jalisco · moño de listón', 'Jalisco · ribbon bow'), 'head', () => ({ k: 'mx_flor', m: MXP.rosa, mono: MXP.blanco }), 1200],
  ['c_mx_chiapas_blusa', L2('Chiapaneca · blusa bordada', 'Chiapaneca · embroidered blouse'), 'body', () => ({ k: 'mx_blusa', m: MXP.negro, r: MXP.tul, fl: [MXP.rosa, MXP.amarillo, MXP.azul, MXP.rojo, MXP.morado, MXP.verde], sl: 'puff' }), 4500],
  ['c_mx_chiapas_falda', L2('Chiapaneca · falda de flores bordadas', 'Chiapaneca · embroidered flower skirt'), 'legs', () => ({ k: 'mx_falda', m: MXP.negro2, fl: [MXP.rosa, MXP.amarillo, MXP.azul, MXP.rojo, MXP.morado, MXP.naranja], lace: MXP.tul }), 7000],
  ['c_mx_chiapas_corona', L2('Chiapaneca · corona de flores', 'Chiapaneca · flower crown'), 'head', () => ({ k: 'mx_flor', crown: [MXP.rojo, MXP.amarillo, MXP.rosa, MXP.naranja, MXP.morado] }), 2000],
  ['c_mx_charro_sombrero', L2('Sombrero de charro rojo', 'Red charro sombrero'), 'head', () => ({ k: 'mx_sombrero', m: MXP.rojo, t: MXP.blanco }), 3000],
  ['c_mx_sarape', L2('Sarape de colores', 'Colourful sarape'), 'body', () => ({ k: 'mx_sarape', m: MXP.blanco, rib: [MXP.verde, MXP.blanco, MXP.amarillo, MXP.naranja, MXP.rojo, MXP.azul, MXP.turquesa, MXP.rosa] }), 4000],
  ['c_mx_charro_pantalon', L2('Pantalón de manta café', 'Brown cotton trousers'), 'legs', () => ({ k: 'pants', m: MXP.cafe }), 1500],
  ['c_mx_zapatos_baile', L2('Zapatos de baile negros', 'Black dance shoes'), 'feet', () => ({ k: 'shoes', m: MXP.negro }), 1500],
  ['c_mx_camiseta_calendario', L2('Camiseta de México (calendario)', 'Mexico shirt (calendar)'), 'body', () => ({ k: 'mx_azteca', m: MXP.verde, s: MXP.verde, b: MXP.blanco, c: [C('#1a7a3a'), C('#ffffff'), C('#c81e2a')] }), 3000],
  ['c_es_flamenca_blusa', L2('Flamenca · cuerpo de lunares', 'Flamenca · polka-dot bodice'), 'body', () => ({ k: 'mx_blusa', m: MXP.rojo, r: MXP.rojo, dots: MXP.blanco, sl: 'puff' }), 4000],
  ['c_es_flamenca_falda', L2('Flamenca · falda de volantes', 'Flamenca · ruffled skirt'), 'legs', () => ({ k: 'mx_falda', m: MXP.rojo2, dots: MXP.blanco, ruf: MXP.rojo2, lace: MXP.negro2, long: 0.88 }), 6000],
  ['c_es_flamenca_flor', L2('Flamenca · flor roja', 'Flamenca · red flower'), 'head', () => ({ k: 'mx_flor', m: MXP.rojo }), 1200]];
for (const [id, n, slot, vis, price] of FS_COS) { cosm(id, n, slot, vis, { src: id.startsWith('c_es_') ? L2('Tablao de Sevilla (España)', 'Seville tablao (Spain)') : L2('Trajes Típicos de Guadalajara (México)', 'Guadalajara Folk Costumes (Mexico)') });
  it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 3, d: L2('Ropa típica. Solo cambia el aspecto. Con ella bailas mejor en el baile de su país.', 'Traditional clothing. Appearance only. You dance better in its country\'s dance with it on.') }); COS_SHOP.push(id); }
const FS_TRAJE = { mx: new Set(FS_COS.filter(c => c[0].startsWith('c_mx_') && c[0] !== 'c_mx_camiseta_calendario').map(c => c[0])), es: new Set(FS_COS.filter(c => c[0].startsWith('c_es_')).map(c => c[0])) };
const fsWearing = k => { const P = G.P, c = (P && P.cos) || {}; return Object.values(c).some(v => FS_TRAJE[k].has(v)); };

// ---------- sellos culturales: +0,5 % de daño por cada uno ----------
SAVEKEYS.push('cul');
const CUL = { taquero: '🌮 ' + L2('Taquero', 'Taco cook'), taxista: '🚕 ' + L2('Taxista de vocho', 'Beetle taxi'), folklorico: '💃 ' + L2('Ballet Folklórico', 'Folk Ballet'), loteria: '🎴 ' + L2('Lotería mexicana', 'Mexican lotería'), pinata: '🪅 ' + L2('Piñata', 'Piñata'),
  chofer: '🚐 ' + L2('Chofer de combi', 'Minibus driver'), mototaxi: '🛺 ' + L2('Mototaxista', 'Mototaxi'), cajero: '🛒 ' + L2('Cajero', 'Cashier'), ambulante: '🛍 ' + L2('Vendedor ambulante', 'Street vendor'), marinera: '🤍 ' + L2('Marinera', 'Marinera'),
  futbolista: '⚽ ' + L2('Futbolista', 'Footballer'), flamenco: '👏 ' + L2('Tablao flamenco', 'Flamenco tablao'), tomatina: '🍅 ' + L2('La Tomatina', 'La Tomatina') };
const culN = () => { const c = (G.P && G.P.cul) || {}; return Object.keys(CUL).filter(k => c[k]).length; };
function culGain(k) { const P = G.P; if (!P || !CUL[k]) return; P.cul = P.cul || {}; if (P.cul[k]) return; P.cul[k] = 1; calcStats(P); sfx('level'); banner(L2('Sello cultural', 'Cultural seal') + ': ' + CUL[k], L2('+0,5 % de daño para siempre · total +', '+0.5% damage forever · total +') + (culN() * 0.5).toFixed(1).replace('.', L2(',', '.')) + ' %'); markDirty(true); }
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs(P, ...a); if (!P || !S || !P.cul || (typeof pvpOn === 'function' && pvpOn())) return S; const n = Object.keys(CUL).filter(k => P.cul[k]).length; if (n) S.atk = Math.round(S.atk * (1 + 0.005 * n)); return S; }; }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { const r = _gj.apply(this, arguments); if (CUL[job]) culGain(job); return r; }; }

// ---------- bailes nuevos (se aprenden en cada evento) ----------
Object.assign(DANCES, {
  jarabe: { n: L2('Jarabe Tapatío', 'Jarabe Tapatío'), walk: 1, pose: (ps, f) => { ps.lax = -4; ps.rax = 4; ps.lay = 1; ps.ray = 1; ps.bob = f % 2 ? -1 : 0; ps.lfx = f === 1 ? -1 : 0; ps.rfx = f === 3 ? 1 : 0; } },
  marinera: { n: L2('Marinera', 'Marinera'), walk: 1, pose: (ps, f) => { if (f < 2) { ps.ray = -9; ps.rax = 2; } else { ps.lay = -9; ps.lax = -2; } ps.bob = f % 2 ? -1 : 0; } },
  flamenco: { n: L2('Flamenco', 'Flamenco'), pose: (ps, f) => { ps.lay = -8; ps.ray = -8; ps.lax = f % 2 ? -3 : -1; ps.rax = f % 2 ? 1 : 3; ps.crouch = f % 2; ps.lfx = f === 0 ? -1 : 0; ps.rfx = f === 2 ? 1 : 0; } } });
for (const k of ['jarabe', 'marinera', 'flamenco']) ANIMS['dz_' + k] = [0, 4];
function fsLearn(k) { const P = G.P; P.dances = P.dances || ['clasico']; if (P.dances.includes(k)) return; P.dances.push(k); toast('💃 ' + L2('Nuevo baile: ', 'New dance: ') + DANCES[k].n, 'quest', 3); markDirty(); }

// ---------- juego de ritmo (ballet folklórico, marinera, flamenco) ----------
function fsRhythm(o) {
  const n = o.n || 16, step = o.step || 600, seq = Array.from({ length: n }, () => Math.floor(Math.random() * 4)), AR = ['←', '↑', '↓', '→'], t0 = performance.now() + 1400; let hit = 0, idx = 0, done = false, combo = 0, best = 0;
  openModal(`<h2>${o.t}</h2><p class="hint">${o.h}</p><canvas id="fsrc" width="240" height="200" style="width:100%;max-width:360px;image-rendering:pixelated;background:${o.bg || '#140a10'};border-radius:.5em"></canvas><div class="row">${AR.map((a, i) => `<button class="btn" data-fr="${i}" style="font-size:1.4em;min-width:2.4em">${a}</button>`).join('')}</div><p class="hint" id="fsrs">0</p>`, 'party');
  const cv = $('#fsrc'), x = cv.getContext('2d'), cols = o.cols || ['#ff6a8a', '#8ad8ff', '#9aff6a', '#ffd040'];
  const press = i => { if (done) return; const now = performance.now(); let bi = -1, bd = 1e9; seq.forEach((s, k) => { if (k < idx) return; const d = Math.abs(now - (t0 + k * step)); if (d < bd) { bd = d; bi = k; } });
    if (bi >= 0 && seq[bi] === i && bd < 230) { hit += bd < 100 ? 2 : 1; idx = bi + 1; combo++; best = Math.max(best, combo); sfx('coin'); } else { combo = 0; sfx('hurt'); } const sc = $('#fsrs'); if (sc) sc.textContent = hit + (combo > 2 ? ' · ' + L2('racha ', 'streak ') + combo : ''); };
  $$('#modal [data-fr]').forEach(b => b.onpointerdown = e => { e.preventDefault(); press(+b.dataset.fr); });
  const key = e => { const m = { ArrowLeft: 0, ArrowUp: 1, ArrowDown: 2, ArrowRight: 3 }[e.code]; if (m !== undefined) { e.preventDefault(); press(m); } }; window.addEventListener('keydown', key);
  const loop = () => { if (done || !document.body.contains(cv)) { window.removeEventListener('keydown', key); return; } const now = performance.now(); x.clearRect(0, 0, 240, 200);
    if (o.deco) o.deco(x, now); x.fillStyle = '#ffd040'; x.fillRect(0, 160, 240, 3); x.font = '22px sans-serif'; x.textAlign = 'center';
    seq.forEach((s, k) => { if (k < idx) return; const y = 160 - (t0 + k * step - now) / 6; if (y < -20 || y > 210) return; x.fillStyle = cols[s]; x.fillText(AR[s], 30 + s * 60, y); });
    if (now > t0 + n * step + 400) { done = true; window.removeEventListener('keydown', key); closeModal(); o.onEnd(hit / (n * 2), best); return; } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
const fsPct = p => Math.round(p * 100) + '%';
function fsBanner(pct, a) { banner(a + ': ' + fsPct(pct), pct > 0.8 ? L2('¡El público se pone de pie!', 'The crowd is on its feet!') : pct > 0.5 ? L2('¡Buen ritmo!', 'Nice rhythm!') : L2('Hay que ensayar más…', 'More practice needed…')); }
// papel picado / mantón: adornos que caen detrás de las notas
const fsDecoPicado = (x, now) => { const cs = ['#ff4a8a', '#ffd040', '#4ad06a', '#4aa8ff', '#ff8a2a', '#b06aff']; for (let k = 0; k < 12; k++) { const px = k * 20 + 2, sw = Math.sin(now / 400 + k) * 2; x.fillStyle = cs[k % cs.length]; x.globalAlpha = 0.5; x.fillRect(px + sw, 4, 16, 12); x.globalAlpha = 1; } };

// ---------- NPCs nuevos ----------
const FS_LOOK = {}; // id -> [país, índice de aspecto, cosméticos]
const fsLi = (L, g, k) => { const v = []; L.forEach((l, i) => { if (l[0] === g) v.push(i); }); return v[k % v.length] || 0; };
function fsNpc(id, n, t, base, g, k, line, cos) { NPCS[id] = { n, title: t, look: LK({ g }), lines: [line], quests: [], hat: null }; FS_LOOK[id] = [base, fsLi(base === 'mx' ? MX_LOOKS : base === 'pe' ? PE_LOOKS : ES_LOOKS, g, k), cos || null]; }
{ const _na = npcAtlas; npcAtlas = function (id) { const F = FS_LOOK[id]; if (F) return getAtlas('FSN' + id, () => { const [b, li, cos] = F, [a, c0] = (b === 'mx' ? mxApp : b === 'pe' ? peApp : esApp)(li), L = heroLook('guerrero', a, { weapon: 0 }, cos || c0 || {}, {}); L.weapon = null; L.back = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }
const MX_FOLK_F = { body: 'c_mx_jalisco_blusa', legs: 'c_mx_jalisco_falda', head: 'c_mx_jalisco_mono', feet: 'c_mx_zapatos_baile' }, MX_FOLK_A = { body: 'c_mx_adelita_blusa', legs: 'c_mx_adelita_falda', head: 'c_mx_adelita_flor', feet: 'c_mx_zapatos_baile' }, MX_FOLK_C = { body: 'c_mx_chiapas_blusa', legs: 'c_mx_chiapas_falda', head: 'c_mx_chiapas_corona', feet: 'c_mx_zapatos_baile' }, MX_FOLK_M = { head: 'c_mx_charro_sombrero', body: 'c_mx_sarape', legs: 'c_mx_charro_pantalon', feet: 'c_mx_zapatos_baile' }, ES_FLA = { body: 'c_es_flamenca_blusa', legs: 'c_es_flamenca_falda', head: 'c_es_flamenca_flor', feet: 'c_mx_zapatos_baile' };
fsNpc('mx_folk_maestra', L2('Maestra Lupita (Ballet Folklórico)', 'Teacher Lupita (Folk Ballet)'), 'Guadalajara', 'mx', 'f', 1, L2('¡Arriba ese zapateado! En Jalisco el Jarabe Tapatío se baila con el alma. ¿Te subes a la tarima?', 'Up with that footwork! In Jalisco the Jarabe Tapatío is danced with the soul. Will you get on stage?'), MX_FOLK_F);
fsNpc('mx_trajes', L2('Doña Chayo (Trajes Típicos)', 'Doña Chayo (Folk Costumes)'), 'Guadalajara', 'mx', 'f', 3, L2('Adelita, jalisciense, chiapaneca o de charro con su sarape. ¡Con traje se baila mejor, mija!', 'Adelita, Jalisco, Chiapas or charro with a sarape. You dance better in costume, dear!'), MX_FOLK_C);
for (let k = 1; k <= 6; k++) fsNpc('mx_folk_' + k, L2('Bailarín folklórico', 'Folk dancer'), 'Guadalajara', 'mx', k % 3 === 0 ? 'm' : 'f', k + 4, L2('¡Ajúa! ¡Que viva Jalisco!', 'Ajúa! Long live Jalisco!'), k % 3 === 0 ? MX_FOLK_M : [MX_FOLK_F, MX_FOLK_A, null, MX_FOLK_C, MX_FOLK_F][k % 5] || MX_FOLK_A);
fsNpc('mx_loteria', L2('Don Chencho, el gritón de lotería', 'Don Chencho, the lotería caller'), L2('Zócalo', 'Zócalo'), 'mx', 'm', 2, L2('¡Se va y se corre con la vieja del Sol! ¿Le entras a una tabla?', 'Here we go! Want to play a board?'), { head: 'c_mx_charro_sombrero', body: 'c_mx_sarape' });
fsNpc('mx_pinata', L2('Doña Mary (fiesta de la piñata)', 'Doña Mary (piñata party)'), 'Cuernavaca', 'mx', 'f', 6, L2('¡Dale, dale, dale, no pierdas el tino! ¿Le pegas a la piñata?', 'Hit it, hit it, hit it, don\'t lose your aim! Will you hit the piñata?'));
fsNpc('pe_mayorista', L2('Doña Rosa (mayorista de Gamarra)', 'Doña Rosa (Gamarra wholesaler)'), 'Gamarra', 'pe', 'f', 2, L2('¿Quieres trabajar de ambulante, caserito? Te alquilo el carrito y la mercadería. Lo que vendas es tuyo.', 'Want to work as a street vendor? I rent you the cart and the goods. What you sell is yours.'));
fsNpc('pe_marinera', L2('Profesora Milagros (marinera)', 'Teacher Milagros (marinera)'), L2('Plaza de Armas', 'Plaza de Armas'), 'pe', 'f', 4, L2('La marinera se baila con pañuelo, coqueteo y elegancia. ¡Hoy hay concurso en la plaza!', 'The marinera is danced with a handkerchief, flirting and elegance. There is a contest in the square today!'));
fsNpc('pe_marinero', L2('Bailarín de marinera', 'Marinera dancer'), L2('Plaza de Armas', 'Plaza de Armas'), 'pe', 'm', 3, L2('¡Jajajá! ¡Que suene la jarana!', 'Ha! Let the jarana play!'));
fsNpc('es_tablao', L2('Rocío, bailaora del tablao', 'Rocío, tablao dancer'), 'Sevilla', 'es', 'f', 2, L2('Palmas, zapateado y mucho arte. ¿Te atreves con unas sevillanas en el tablao?', 'Clapping, footwork and lots of art. Dare to dance on the tablao?'), ES_FLA);
fsNpc('es_bailaora', L2('Bailaora', 'Flamenco dancer'), 'Sevilla', 'es', 'f', 5, L2('¡Olé! ¡Arsa!', 'Olé!'), ES_FLA);
fsNpc('es_tomatina', L2('Pepe, organizador de la Tomatina', 'Pepe, Tomatina organiser'), 'Valencia', 'es', 'm', 1, L2('¡Tomates a mansalva! Media hora de guerra de tomates y luego todos a la ducha. ¿Te apuntas?', 'Tomatoes galore! Half an hour of tomato fight and then everyone to the showers. Are you in?'));
PE_SELL.mx_trajes = FS_COS.filter(c => c[0].startsWith('c_mx_')).map(c => 'cosi_' + c[0]); PE_SELL.es_tablao = FS_COS.filter(c => c[0].startsWith('c_es_')).map(c => 'cosi_' + c[0]).concat(['cosi_c_mx_zapatos_baile']);
const FS_DANCERS = new Set(['mx_folk_1', 'mx_folk_2', 'mx_folk_3', 'mx_folk_4', 'mx_folk_5', 'mx_folk_6', 'pe_marinera', 'pe_marinero', 'es_bailaora']);
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e && e.type === 'npc' && FS_DANCERS.has(e.id) && !e.talking) { const a0 = e.anim, f0 = e.af, d0 = e.dir, ph = G.t * 6 + (e.x % 7), f = Math.floor(ph) % 4, b = f % 2 ? 1 : 0;
    e.anim = 'walk'; e.af = f; e.dir = ['down', 'left', 'down', 'right', 'up', 'down'][Math.floor(G.t / 1.2 + e.x / 16) % 6]; try { return _de.call(this, e, cx, cy - b); } finally { e.anim = a0; e.af = f0; e.dir = d0; } } return _de.apply(this, arguments); }; }

// ---------- tarimas: dibujo en el suelo y papel picado ----------
const FS_STG = {}; // mapa -> [{x0, y0, x1, y1, k}]
const FS_POI = {}; // mapa -> [{c, x, y, t}]
function fsFree(M, x, y, r) { for (let d = 0; d <= r; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue; const X = x + dx, Y = y + dy; if (X < 1 || Y < 1 || X >= M.w - 1 || Y >= M.h - 1) continue; const i = M.I(X, Y); if (M.objAt[i] >= 0 || SOLID_T[M.ter[i]]) continue; if (M.lg && (M.lg[i] === LM_G.SEA || M.lg[i] === LM_G.ROAD)) continue; return [X, Y]; } return [x, y]; }
function fsSp(M, id, x, y, o) { const [X, Y] = fsFree(M, x, y, 10); return spawnNPC(id, X * 16 + 8, Y * 16 + 8, M.id, Object.assign({ face: 'down' }, o || {})); }
function fsGround(M, cx, cy) { for (const S of FS_STG[M.id] || []) { const x0 = S.x0 * 16 - cx, y0 = S.y0 * 16 - cy, w = (S.x1 - S.x0 + 1) * 16, h = (S.y1 - S.y0 + 1) * 16; if (x0 > VW || y0 > VH || x0 + w < 0 || y0 + h < 0) continue;
  const wood = S.k === 'tablao' ? ['#4a2a18', '#5e3820', '#3a2010'] : ['#8a5a32', '#9a6a3c', '#6a4022'];
  ctx.fillStyle = wood[0]; ctx.fillRect(x0, y0, w, h); ctx.fillStyle = wood[1]; for (let y = 0; y < h; y += 6) ctx.fillRect(x0, y0 + y, w, 3); ctx.fillStyle = wood[2]; for (let y = 5; y < h; y += 6) ctx.fillRect(x0, y0 + y, w, 1); ctx.fillRect(x0, y0 + h - 4, w, 4); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x0, y0, w, 1); } }
WORLD_DRAW.push((cx, cy) => { const M = G.map; for (const S of FS_STG[M.id] || []) { const x0 = S.x0 * 16 - cx, y0 = S.y0 * 16 - cy - 40, w = (S.x1 - S.x0 + 1) * 16; if (x0 > VW || x0 + w < 0 || y0 > VH || y0 < -60) continue;
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + w / 2, y0 + 8, x0 + w, y0); ctx.stroke();
  const cs = S.k === 'tablao' ? ['#c81e2a', '#ffffff', '#1a1a1e'] : S.k === 'marinera' ? ['#ffffff', '#d8202a'] : ['#ff4a8a', '#ffd040', '#4ad06a', '#4aa8ff', '#ff8a2a', '#b06aff'];
  for (let k = 0; k * 10 < w; k++) { const t = (k * 10 + 5) / w, yy = y0 + 8 * 4 * t * (1 - t) + Math.sin(G.t * 2 + k) * 0.8; ctx.fillStyle = cs[k % cs.length]; ctx.fillRect(Math.round(x0 + k * 10 + 1), Math.round(yy), 8, 7); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(Math.round(x0 + k * 10 + 3), Math.round(yy + 2), 2, 2); } } });
// 5.26: se envuelve una sola vez por mapa (antes otro gancho lo re-envolvía cada fotograma y el suelo se dibujaba miles de veces: lag creciente)
V33_TICKS.push(() => { const M = G.map; if (!M || !FS_STG[M.id] || M._fsw) return; M._fsw = 1; const prev = M.drawExtra, f = (cx, cy) => { if (prev) prev(cx, cy); fsGround(M, cx, cy); }; f.fs = 1; M.drawExtra = f; if (M._bde && M._bde === prev) M._bde = f; });
function fsStage(M, cx, cy, w, h, k) { const S = { x0: cx - (w >> 1), y0: cy - (h >> 1), x1: cx - (w >> 1) + w - 1, y1: cy - (h >> 1) + h - 1, k }; (FS_STG[M.id] = FS_STG[M.id] || []).push(S); return S; }
const fsPoi = (M, c, x, y, t) => (FS_POI[M.id] = FS_POI[M.id] || []).push({ c, x, y, t });
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (M && FS_POI[M.id]) for (const q of FS_POI[M.id]) out.push(Object.assign({}, q)); return out; }; }

// México: Guadalajara (tarima, maestra, 6 bailarines, tienda de trajes), Zócalo (lotería) y Cuernavaca (piñata)
{ const _b = mxBuild; mxBuild = function (M) { _b.apply(this, arguments); try { const GD = MX_GDL, S = fsStage(M, GD.cx, GD.y0 + 12, 13, 5, 'tarima');
  for (let k = 1; k <= 6; k++) spawnNPC('mx_folk_' + k, (S.x0 + 1 + (k - 1) * 2) * 16 + 8, (S.y0 + 1 + (k % 2) * 2) * 16 + 8, 'mexico', { face: 'down' });
  fsSp(M, 'mx_folk_maestra', S.x0 - 2, S.y1 + 1); fsSp(M, 'mx_trajes', S.x1 + 3, S.y1 + 1);
  fsPoi(M, 'pejob', S.x0, S.y0, L2('Ballet Folklórico (oficio: baila el Jarabe Tapatío)', 'Folk Ballet (job: dance the Jarabe Tapatío)')); fsPoi(M, 'peshop', S.x1 + 3, S.y1 + 1, L2('Trajes Típicos de Doña Chayo', 'Doña Chayo\'s Folk Costumes'));
  const Z = MX_ZOCALO; fsSp(M, 'mx_loteria', Z.cx - 6, Z.cy + 6); fsPoi(M, 'pefun', Z.cx - 6, Z.cy + 6, L2('Lotería mexicana (evento)', 'Mexican lotería (event)'));
  fsSp(M, 'mx_pinata', 572, 396); fsPoi(M, 'pefun', 572, 396, L2('Piñata en Cuernavaca (evento)', 'Piñata in Cuernavaca (event)')); } catch (e) { console.warn('fiestas mx', e); } }; }
// Lima: marinera en la Plaza de Armas y Doña Rosa en Gamarra
{ const _b2 = lmBuild2; lmBuild2 = function (M, H) { _b2.apply(this, arguments); if (M.id !== 'lima') return; try { const Pz = LM_PLAZA, S = fsStage(M, Pz.cx, Pz.y1 - 4, 7, 3, 'marinera');
  spawnNPC('pe_marinera', (S.x0 + 2) * 16 + 8, (S.y0 + 1) * 16 + 8, 'lima', { face: 'down' }); spawnNPC('pe_marinero', (S.x1 - 2) * 16 + 8, (S.y0 + 1) * 16 + 8, 'lima', { face: 'down' });
  fsPoi(M, 'pefun', S.x0, S.y0, L2('Concurso de marinera (evento)', 'Marinera contest (event)'));
  const g = fsSp(M, 'pe_mayorista', 512, 62); if (g) fsPoi(M, 'pejob', Math.round(g.x / 16), Math.round(g.y / 16), L2('Vendedor ambulante en Gamarra (oficio)', 'Street vendor in Gamarra (job)')); } catch (e) { console.warn('fiestas pe', e); } }; }
// España: tablao en Sevilla y la Tomatina en Valencia
{ const _b = esBuild; esBuild = function (M) { _b.apply(this, arguments); try { const SV = ES_SEV, [sx, sy] = fsFree(M, SV.cx, SV.cy - 10, 12), S = fsStage(M, sx, sy, 7, 3, 'tablao');
  spawnNPC('es_bailaora', (S.x0 + 2) * 16 + 8, (S.y0 + 1) * 16 + 8, 'espana', { face: 'down' }); fsSp(M, 'es_tablao', S.x1 + 2, S.y1);
  fsPoi(M, 'pefun', S.x0, S.y0, L2('Tablao flamenco (evento)', 'Flamenco tablao (event)'));
  const t = fsSp(M, 'es_tomatina', 878, 432); if (t) fsPoi(M, 'pefun', Math.round(t.x / 16), Math.round(t.y / 16), L2('La Tomatina (evento)', 'La Tomatina (event)')); } catch (e) { console.warn('fiestas es', e); } }; }

// ---------- oficio: Ballet Folklórico ----------
addJob('folklorico', L2('Bailarín folklórico', 'Folk dancer'), 'run', L2('Baila el Jarabe Tapatío en la tarima de Guadalajara con el Ballet Folklórico.', 'Dance the Jarabe Tapatío on the Guadalajara stage with the Folk Ballet.'),
  { how: [L2('Habla con la Maestra Lupita en la plaza de la catedral de Guadalajara y elige «Bailar en la tarima». Pulsa las flechas cuando lleguen a la línea dorada. Con ropa típica mexicana ganas un 50 % más.', 'Talk to Teacher Lupita in the Guadalajara cathedral square and choose «Dance on stage». Tap the arrows when they reach the golden line. In traditional Mexican clothing you earn 50% more.'), ''], ben: [L2('Oro y aplausos. Sello cultural: +0,5 % de daño la primera vez.', 'Gold and applause. Cultural seal: +0.5% damage the first time.'), ''], find: () => ({ loc: [MX_GDL.cx, MX_GDL.y0 + 12], t: L2('Tarima de Guadalajara', 'Guadalajara stage'), m: 'mexico' }) },
  [[5, '+10 % de propina', '+10% tips', { fkG: 10 }], [15, '+15 % de propina', '+15% tips', { fkG: 15 }], [30, 'Primera bailarina del ballet', 'Principal dancer of the ballet', { fkG: 25 }]], ['run', '#ff4a8a']);
function fsFolk() { const tr = fsWearing('mx'); fsRhythm({ t: '💃 ' + L2('Ballet Folklórico · Jarabe Tapatío', 'Folk Ballet · Jarabe Tapatío'), h: (tr ? '👗 ' + L2('¡Vas de traje típico: +50 %! ', 'You are in costume: +50%! ') : L2('Con ropa típica ganas un 50 % más. ', 'Traditional clothing earns 50% more. ')) + L2('Zapatea cuando la flecha llegue a la línea dorada.', 'Stamp when the arrow reaches the golden line.'), n: 18, step: 560, bg: '#2a0a18', deco: fsDecoPicado,
  onEnd: (pct, best) => { const P = G.P, g = Math.round((150 + pct * 900) * (tr ? 1.5 : 1) * (1 + jobPerkSum('fkG') / 100)); P.gold += g; gainJobXp('folklorico', 25 + Math.round(pct * 60)); fsLearn('jarabe'); sfx('coin'); fsBanner(pct, L2('Jarabe Tapatío', 'Jarabe Tapatío')); toast('💃 +' + g + L2(' de oro', ' gold') + (best > 5 ? ' · ' + L2('racha ', 'streak ') + best : ''), 'quest', 3); markDirty(); } }); }

// ---------- evento: lotería mexicana ----------
const LOT_CARDS = [['🐓', L2('El Gallo', 'The Rooster')], ['😈', L2('El Diablito', 'The Little Devil')], ['👗', L2('La Dama', 'The Lady')], ['🎩', L2('El Catrín', 'The Dandy')], ['☂️', L2('El Paraguas', 'The Umbrella')], ['🧜', L2('La Sirena', 'The Mermaid')], ['🪜', L2('La Escalera', 'The Ladder')], ['🍾', L2('La Botella', 'The Bottle')],
  ['🛢️', L2('El Barril', 'The Barrel')], ['🌳', L2('El Árbol', 'The Tree')], ['🍈', L2('El Melón', 'The Melon')], ['🧢', L2('El Gorrito', 'The Little Cap')], ['💀', L2('La Muerte', 'Death')], ['🍐', L2('La Pera', 'The Pear')], ['🚩', L2('La Bandera', 'The Flag')], ['🎸', L2('El Bandolón', 'The Mandolin')],
  ['🎻', L2('El Violoncello', 'The Cello')], ['🐦', L2('El Pájaro', 'The Bird')], ['✋', L2('La Mano', 'The Hand')], ['👢', L2('La Bota', 'The Boot')], ['🌙', L2('La Luna', 'The Moon')], ['🦜', L2('El Cotorro', 'The Parrot')], ['❤️', L2('El Corazón', 'The Heart')], ['🍉', L2('La Sandía', 'The Watermelon')],
  ['🥁', L2('El Tambor', 'The Drum')], ['🦐', L2('El Camarón', 'The Shrimp')], ['🏹', L2('Las Jaras', 'The Arrows')], ['🎺', L2('El Músico', 'The Musician')], ['🕷️', L2('La Araña', 'The Spider')], ['⭐', L2('La Estrella', 'The Star')], ['🌍', L2('El Mundo', 'The World')], ['🌵', L2('El Nopal', 'The Cactus')],
  ['🦂', L2('El Alacrán', 'The Scorpion')], ['🌹', L2('La Rosa', 'The Rose')], ['🔔', L2('La Campana', 'The Bell')], ['🏺', L2('El Cantarito', 'The Little Jug')], ['🦌', L2('El Venado', 'The Deer')], ['☀️', L2('El Sol', 'The Sun')], ['👑', L2('La Corona', 'The Crown')], ['🛶', L2('La Chalupa', 'The Canoe')],
  ['🌲', L2('El Pino', 'The Pine')], ['🐟', L2('El Pescado', 'The Fish')], ['🌴', L2('La Palma', 'The Palm')], ['🪴', L2('La Maceta', 'The Flowerpot')], ['🪕', L2('El Arpa', 'The Harp')], ['🐸', L2('La Rana', 'The Frog')]];
const LOT_LINES = (() => { const L = []; for (let i = 0; i < 4; i++) { L.push([0, 1, 2, 3].map(j => i * 4 + j)); L.push([0, 1, 2, 3].map(j => j * 4 + i)); } L.push([0, 5, 10, 15], [3, 6, 9, 12]); return L; })();
function fsLoteria() { const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const tab = () => shuffle(LOT_CARDS.map((c, i) => i)).slice(0, 16), me = tab(), mk = new Set(), riv = [L2('Doña Cuca', 'Doña Cuca'), L2('El Güero', 'Güero'), L2('Tía Lencha', 'Aunt Lencha')].map(n => ({ n, t: tab(), m: new Set() })), deck = shuffle(LOT_CARDS.map((c, i) => i)), called = new Set(); let di = 0, over = false, tm = 0;
  const line = (t, m) => LOT_LINES.some(L => L.every(k => m.has(t[k])));
  const draw = () => { const c = deck[di - 1], cc = c !== undefined ? LOT_CARDS[c] : null; openModal(`<h2>🎴 ${L2('Lotería mexicana', 'Mexican lotería')}</h2><div style="display:flex;gap:.8em;align-items:center;flex-wrap:wrap"><div style="min-width:6.5em;text-align:center;padding:.4em;border:2px solid #ffd040;border-radius:.5em;background:#2a1a10"><div style="font-size:2.2em;line-height:1.1">${cc ? cc[0] : '🎴'}</div><b style="font-size:.85em">${cc ? esc(cc[1]) : L2('¡Ya va!', 'Here we go!')}</b><br><small>${di}/${deck.length}</small></div>
    <div style="display:grid;grid-template-columns:repeat(4,3.1em);gap:.25em">${me.map(i => `<button class="btn sm ${mk.has(i) ? 'gold' : ''}" data-lt="${i}" style="height:3.1em;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1"><span style="font-size:1.3em">${mk.has(i) ? '🫘' : LOT_CARDS[i][0]}</span><small style="font-size:.5em">${esc(LOT_CARDS[i][1].replace(/^(El|La|Las|Los|The) /, ''))}</small></button>`).join('')}</div></div>
    <p class="hint">${L2('Pon tu frijolito 🫘 en la carta que cante Don Chencho. Gana el primero que llene una fila, una columna o una diagonal.', 'Put your bean 🫘 on the card Don Chencho calls. The first to fill a row, column or diagonal wins.')}</p><p class="hint">${riv.map(r => esc(r.n) + ': ' + r.m.size).join(' · ')}</p><div class="row"><button class="btn" id="ltX">${L2('Retirarse', 'Leave')}</button></div>`, 'party');
    $('#ltX').onclick = () => { over = true; clearInterval(tm); closeModal(); };
    $$('#modal [data-lt]').forEach(b => b.onclick = () => { const i = +b.dataset.lt; if (over || mk.has(i)) return; if (!called.has(i)) { toast('🎴 ' + L2('¡Esa no la han cantado!', 'That one has not been called!'), 'warn'); return; } mk.add(i); sfx('coin'); if (line(me, mk)) end(true); else draw(); }); };
  const end = win => { over = true; clearInterval(tm); closeModal(); const P = G.P; if (win) { const g = 900; P.gold += g; culGain('loteria'); sfx('level'); banner('¡' + L2('Lotería', 'Lotería') + '!', L2('Ganaste la tabla: +', 'You won the board: +') + g + L2(' de oro', ' gold')); } else { banner(L2('¡Lotería!', 'Lotería!'), (win === false ? riv.find(r => line(r.t, r.m)).n : '') + L2(' llenó su tabla primero. ¡Otra vez será!', ' filled their board first. Next time!')); P.gold += 80; } markDirty(); };
  const tick = () => { if (over) return; if (!$('#modal') || $('#modal').hidden) { over = true; clearInterval(tm); return; } if (di >= deck.length) { end(null); return; } const c = deck[di++]; called.add(c); sfx('ui');
    for (const r of riv) if (r.t.includes(c) && Math.random() < 0.8) r.m.add(c); if (riv.some(r => line(r.t, r.m))) { draw(); setTimeout(() => { if (!over) end(false); }, 900); return; } draw(); };
  draw(); tm = setInterval(tick, 2600); }

// ---------- evento: piñata ----------
function fsPinata() { let hits = 0, tries = 0, done = false, ang = 0, sp = 1.6, flash = 0; const N = 3, MAXT = 7, t0 = performance.now(); let last = t0, cand = [];
  openModal(`<h2>🪅 ${L2('¡Dale, dale, dale!', 'Hit it, hit it!')}</h2><p class="hint">${L2('Pégale a la piñata cuando pase por el centro (la zona dorada). Tres golpes buenos la rompen. Tienes 7 intentos.', 'Hit the piñata when it passes the centre (golden zone). Three good hits break it. You have 7 tries.')}</p><canvas id="pnc" width="240" height="170" style="width:100%;max-width:360px;background:#1a2a4a;border-radius:.5em"></canvas><div class="row"><button class="btn gold" id="pnHit" style="font-size:1.2em">🏏 ${L2('¡Pégale!', 'Hit!')}</button></div><p class="hint" id="pnS">0/${N}</p>`, 'party');
  const cv = $('#pnc'), x = cv.getContext('2d');
  const px = () => 120 + Math.sin(ang) * 90;
  const hit = () => { if (done) return; tries++; const d = Math.abs(px() - 120); if (d < 16) { hits++; flash = 1; sfx('hit'); sp *= 1.25; } else sfx('hurt'); $('#pnS').textContent = hits + '/' + N + ' · ' + L2('intentos ', 'tries ') + tries + '/' + MAXT;
    if (hits >= N) { done = true; for (let k = 0; k < 40; k++) cand.push({ x: 120, y: 80, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 5, c: ['#ff4a8a', '#ffd040', '#4ad06a', '#4aa8ff', '#ffffff'][k % 5] }); setTimeout(() => { closeModal(); const P = G.P, g = 500 + (MAXT - tries) * 60; P.gold += g; culGain('pinata'); banner('🪅 ' + L2('¡Rompiste la piñata!', 'You broke the piñata!'), L2('Dulces para todos · +', 'Candy for everyone · +') + g + L2(' de oro', ' gold')); sfx('level'); markDirty(); }, 1400); }
    else if (tries >= MAXT) { done = true; setTimeout(() => { closeModal(); banner('🪅 ' + L2('La piñata aguantó', 'The piñata held up'), L2('¡Otro intento! Que no se te vaya el tino.', 'Try again! Keep your aim.')); }, 500); } };
  $('#pnHit').onpointerdown = e => { e.preventDefault(); hit(); }; const key = e => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); hit(); } }; window.addEventListener('keydown', key);
  const loop = now => { if (!document.body.contains(cv)) { window.removeEventListener('keydown', key); return; } const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!done || cand.length) ang += dt * sp; x.clearRect(0, 0, 240, 170);
    x.fillStyle = 'rgba(255,208,64,0.25)'; x.fillRect(104, 40, 32, 100); x.strokeStyle = '#d8c8a0'; x.beginPath(); x.moveTo(0, 12); x.lineTo(240, 12); x.stroke();
    const X = px(), Y = 78; x.beginPath(); x.moveTo(120, 12); x.lineTo(X, Y - 26); x.stroke();
    if (hits < N) { const cs = ['#ff4a8a', '#ffd040', '#4ad06a', '#4aa8ff', '#ff8a2a', '#b06aff', '#ffffff']; x.save(); x.translate(X, Y); x.rotate(Math.sin(ang * 2) * 0.2); x.fillStyle = flash > 0 ? '#ffffff' : '#ff8a2a'; x.beginPath(); x.arc(0, 0, 18, 0, 7); x.fill();
      for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; x.fillStyle = cs[k]; x.beginPath(); x.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); x.lineTo(Math.cos(a - 0.25) * 17, Math.sin(a - 0.25) * 17); x.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); x.lineTo(Math.cos(a + 0.25) * 17, Math.sin(a + 0.25) * 17); x.fill(); } x.restore(); }
    flash = Math.max(0, flash - dt * 4); for (const c of cand) { c.x += c.vx; c.y += c.vy; c.vy += 0.2; x.fillStyle = c.c; x.fillRect(c.x, c.y, 4, 3); } cand = cand.filter(c => c.y < 180);
    requestAnimationFrame(loop); }; requestAnimationFrame(loop); }

// ---------- oficio: vendedor ambulante en Gamarra ----------
addJob('ambulante', L2('Vendedor ambulante', 'Street vendor'), 'coin', L2('Pon tu carrito en las veredas de Gamarra y véndele a la gente que pasa: ropa o comida, con regateo y cuidado con el serenazgo.', 'Set up your cart on the Gamarra sidewalks and sell to passers-by: clothes or food, with haggling and watch out for the inspectors.'),
  { how: [L2('Habla con Doña Rosa en Gamarra y alquila un carrito de ropa o de comida. La gente se acerca a tu puesto: dale lo que pide y elige el precio. Si gritan «¡serenazgo!», recoge rápido. No te alejes del carrito.', 'Talk to Doña Rosa in Gamarra and rent a clothes or food cart. People come to your stall: give them what they ask for and pick the price. If someone shouts «inspectors!», pack up fast. Do not leave your cart.'), ''], ben: [L2('Oro de las ventas. Sello cultural: +0,5 % de daño la primera vez.', 'Gold from sales. Cultural seal: +0.5% damage the first time.'), ''], find: () => ({ loc: [512, 62], t: L2('Doña Rosa, Gamarra', 'Doña Rosa, Gamarra'), m: 'lima' }) },
  [[5, '+10 % de ganancia', '+10% profit', { amG: 10 }], [15, '+15 % de ganancia', '+15% profit', { amG: 15 }], [30, 'Caseritos fieles', 'Loyal regulars', { amG: 25 }]], ['coin', '#ffd040']);
const AMB_GOODS = { ropa: [['👕', L2('Polo', 'T-shirt'), 10], ['👖', L2('Jean', 'Jeans'), 25], ['🧥', L2('Casaca', 'Jacket'), 35], ['🧢', L2('Gorra', 'Cap'), 8], ['🧦', L2('Medias (3 pares)', 'Socks (3 pairs)'), 5]],
  comida: [['🥤', L2('Emoliente', 'Emoliente'), 2], ['🍢', L2('Anticucho', 'Anticucho'), 6], ['🍩', L2('Picarones', 'Picarones'), 5], ['🥔', L2('Papa rellena', 'Stuffed potato'), 3], ['🌽', L2('Choclo con queso', 'Corn with cheese'), 4]] };
const AMB_WHO = [[L2('Casera apurada', 'Hurried customer'), 'apurado'], [L2('Señor regateador', 'Haggling man'), 'regateo'], [L2('Estudiante', 'Student'), 'normal'], [L2('Mamá con su hijito', 'Mum with her kid'), 'normal'], [L2('Turista', 'Tourist'), 'apurado'], [L2('Caserita del mercado', 'Market regular'), 'regateo']];
let AMB = null, ambSpr = {};
function ambCart(k) { if (!ambSpr[k]) { try { ambSpr[k] = XSPR[k === 'ropa' ? 'lm_manta1' : 'lm_carrito_emoliente'](); } catch (e) { ambSpr[k] = null; } } return ambSpr[k]; }
function ambStart(k) { const P = G.P, M = G.map; if (AMB) return; if (!M || M.id !== 'lima' || P.x / 16 < 480 || P.y / 16 > 152) { toast(L2('El puesto va en las veredas de Gamarra.', 'The stall goes on the Gamarra sidewalks.'), 'warn'); return; } if (P.gold < 50) { toast(L2('El alquiler del carrito cuesta 50 de oro.', 'Renting the cart costs 50 gold.'), 'warn'); return; }
  P.gold -= 50; if (P.mount) { P.mount = null; calcStats(P); mountBtn(); } AMB = { k, x: P.x - 22, y: P.y, n: 0, sold: 0, g: 0, cur: null, next: G.t + 2, ser: 3 + Math.floor(Math.random() * 3), serT: 0 };
  banner(k === 'ropa' ? L2('¡Polos, jeans, casacas!', 'T-shirts, jeans, jackets!') : L2('¡Emoliente calientito!', 'Hot emoliente!'), L2('Atiende a 8 clientes. No te alejes del carrito.', 'Serve 8 customers. Do not leave your cart.')); ambHud(); markDirty(); }
function ambHud() { if (!AMB) { mgHud(null); return; } mgHud('🛍 ' + L2('Puesto ', 'Stall ') + AMB.n + '/8 · ' + AMB.g + L2(' oro', ' gold') + (AMB.serT ? ` <button class="btn sm gold" onclick="ambHide()">🏃 ${L2('¡Recoger!', 'Pack up!')}</button>` : '')); }
function ambEnd(why) { const A = AMB, P = G.P; if (!A) return; AMB = null; if (A.cur && A.cur.e) A.cur.e.remove = true; G.ents = G.ents.filter(e => !e.remove); mgHud(null);
  if (why === 'left') { toast(L2('Dejaste el puesto solo. ¡Doña Rosa se llevó el carrito!', 'You left the stall alone. Doña Rosa took the cart back!'), 'warn'); return; }
  const g = Math.round(A.g * (1 + jobPerkSum('amG') / 100)); P.gold += g; gainJobXp('ambulante', 30 + A.sold * 12); sfx('coin'); xMsg('🛍 ' + L2('Fin del día en Gamarra', 'End of the day in Gamarra'), L2('Vendiste a ', 'You sold to ') + A.sold + L2(' de 8 clientes. Ganaste ', ' of 8 customers. You earned ') + g + L2(' de oro.', ' gold.'), [[L2('¡Bien!', 'Great!'), closeModal]]); markDirty(); }
function ambHide() { if (!AMB || !AMB.serT) return; AMB.serT = 0; sfx('ui'); toast('🏃 ' + L2('¡Recogiste a tiempo! El serenazgo pasó de largo.', 'You packed up in time! The inspectors walked past.'), 'info'); ambHud(); }
function ambServe(c) { const A = AMB, G_ = AMB_GOODS[A.k], want = Math.floor(Math.random() * G_.length), opts = [want, (want + 1 + Math.floor(Math.random() * (G_.length - 1))) % G_.length].sort(() => Math.random() - 0.5), [ic, nm, base] = G_[want], who = c.who;
  const done = (ok, g) => { if (c.fin) return; c.fin = 1; A.n++; if (ok) { A.sold++; A.g += g; } c.e.remove = true; G.ents = G.ents.filter(e => !e.remove); A.cur = null; A.next = G.t + 2 + Math.random() * 2; ambHud(); if (A.n >= 8) ambEnd(); }; c.done = done;
  xMsg('🛍 ' + esc(who[0]), '«' + L2('¿Tiene ', 'Do you have ') + ic + ' ' + esc(nm.toLowerCase()) + '?' + (who[1] === 'regateo' ? L2(' ¿A cuánto me lo deja?', ' How much will you let it go for?') : who[1] === 'apurado' ? L2(' ¡Rápido, que me deja el bus!', ' Quick, my bus is leaving!') : '') + '»', opts.map(o => [G_[o][0] + ' ' + G_[o][1], () => {
    if (o !== want) { toast('😕 ' + L2('«Eso no pedí…» y se fue.', '«That is not what I asked for…» and they left.'), 'warn'); closeModal(); done(false, 0); return; }
    const per = Math.round(base * 9 + 40), prices = [[L2('Precio justo · ', 'Fair price · ') + base, 1, 'ok'], [L2('Le hago rebaja · ', 'Discount · ') + Math.max(1, Math.round(base * 0.8)), 0.85, 'reb'], [L2('Precio de turista · ', 'Tourist price · ') + Math.round(base * 1.5), 1.5, 'caro']];
    xMsg('💰 ' + L2('¿A cuánto?', 'How much?'), L2('Precio en soles (cada sol del puesto vale oro de verdad).', 'Price in soles (each stall sol is worth real gold).'), prices.map(([lb, mul, t]) => [lb, () => { closeModal(); const r = Math.random(), acc = who[1] === 'apurado' ? true : who[1] === 'regateo' ? t === 'reb' || (t === 'ok' && r < 0.4) : t !== 'caro' || r < 0.3;
      if (!acc) { toast('🙅 ' + (t === 'caro' ? L2('«¡Uy, carísimo!» y se fue.', '«Way too expensive!» and they left.') : L2('«Más barato en el otro puesto…»', '«Cheaper at the next stall…»')), 'warn'); done(false, 0); return; }
      const g = Math.round(per * mul); sfx('coin'); toast('😊 ' + L2('«¡Gracias, casero!» ', '«Thanks!» ') + '+' + g + L2(' oro', ' gold'), 'info'); done(true, g); }])); }])); }
V33_TICKS.push(dt => { const A = AMB, P = G.P, M = G.map; if (!A || !P) return; if (!M || M.id !== 'lima') { ambEnd('left'); return; } if (Math.hypot(P.x - A.x, P.y - A.y) > 72) { ambEnd('left'); return; }
  if (A.serT && G.t > A.serT) { A.serT = 0; const lost = Math.round(A.g * 0.3); A.g -= lost; toast('👮 ' + L2('¡El serenazgo te pilló! Pierdes ', 'The inspectors caught you! You lose ') + lost + L2(' de oro.', ' gold.'), 'warn'); ambHud(); }
  if (A.n === A.ser && !A.serDone && !A.cur) { A.serDone = 1; A.serT = G.t + 4; sfx('hurt'); banner('👮 ' + L2('¡Serenazgo!', 'Inspectors!'), L2('¡Toca «Recoger» rápido!', 'Tap «Pack up» fast!')); ambHud(); return; }
  if (!A.cur && !A.serT && G.t > A.next) { const id = 'pe_' + (1 + Math.floor(Math.random() * 120)), a = Math.random() * 6.283, sx = A.x + Math.cos(a) * 150, sy = A.y + Math.abs(Math.sin(a)) * 90 + 20; if (!NPCS[id]) return;
    const e = spawnNPC(id, sx, sy, 'lima', { face: 'up' }); if (!e) return; e.scene = 1; e.amb = 1; A.cur = { e, who: AMB_WHO[Math.floor(Math.random() * AMB_WHO.length)], arr: false }; }
  const c = A.cur; if (c && c.arr && c.done && $('#modal').hidden) { toast(L2('El cliente se cansó de esperar.', 'The customer got tired of waiting.'), 'warn'); c.done(false, 0); return; }
  if (c && !c.arr) { const e = c.e, tx = A.x + 4, ty = A.y + 22, dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy); if (d < 3) { c.arr = true; e.anim = 'idle'; e.dir = 'up'; if (!G.paused) ambServe(c); else c.arr = false; return; }
    const v = Math.min(d, 55 * (dt || 0.016)); e.x += dx / d * v; e.y += dy / d * v; e.anim = 'walk'; e.af = Math.floor(G.t * 8) % 4; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } });
WORLD_DRAW.push((cx, cy) => { const A = AMB; if (!A || G.map.id !== 'lima') return; const S = ambCart(A.k); if (!S) return; ctx.drawImage(S.c, Math.round(A.x - S.ax - cx), Math.round(A.y + 10 - S.ay - cy)); });

// ---------- evento: concurso de marinera (Lima) y tablao flamenco (Sevilla) ----------
function fsMarinera() { fsRhythm({ t: '🤍 ' + L2('Concurso de marinera', 'Marinera contest'), h: L2('Agita el pañuelo con elegancia: pulsa las flechas cuando lleguen a la línea dorada.', 'Wave the handkerchief with elegance: tap the arrows when they reach the golden line.'), n: 18, step: 620, bg: '#2a0a10', cols: ['#ffffff', '#ff4a5a', '#ffffff', '#ff4a5a'],
  deco: (x, now) => { x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(0, 0, 240, 200); x.fillStyle = 'rgba(216,32,42,0.35)'; x.fillRect(80, 0, 80, 200); },
  onEnd: pct => { const P = G.P; fsBanner(pct, L2('Marinera', 'Marinera')); fsLearn('marinera'); const g = Math.round(120 + pct * 700); P.gold += g; if (pct >= 0.6) { culGain('marinera'); toast('🏆 ' + L2('¡Ganaste el concurso de marinera! +', 'You won the marinera contest! +') + g + L2(' oro', ' gold'), 'quest', 3); } else toast(L2('Necesitas un 60 % para ganar el concurso. +', 'You need 60% to win the contest. +') + g + L2(' oro', ' gold'), 'info'); markDirty(); } }); }
function fsFlamenco() { const tr = fsWearing('es'); fsRhythm({ t: '👏 ' + L2('Tablao flamenco', 'Flamenco tablao'), h: (tr ? '💃 ' + L2('¡Con traje de flamenca: +50 %! ', 'In flamenca dress: +50%! ') : '') + L2('Palmas y zapateado al compás: pulsa cuando lleguen a la línea dorada.', 'Clapping and footwork to the beat: tap when they reach the golden line.'), n: 20, step: 520, bg: '#1a0606', cols: ['#ff3a3a', '#ffd040', '#ff3a3a', '#ffd040'],
  deco: (x, now) => { const b = Math.floor(now / 520) % 12; x.fillStyle = [0, 3, 6, 8, 10].includes(b) ? 'rgba(255,58,58,0.25)' : 'rgba(255,58,58,0.06)'; x.fillRect(0, 0, 240, 200); },
  onEnd: pct => { const P = G.P; fsBanner(pct, L2('Flamenco', 'Flamenco')); fsLearn('flamenco'); const g = Math.round((120 + pct * 750) * (tr ? 1.5 : 1)); P.gold += g; if (pct >= 0.6) { culGain('flamenco'); toast('🌹 ' + L2('¡Olé! Te ganaste el aplauso del tablao. +', 'Olé! You won the tablao\'s applause. +') + g + L2(' oro', ' gold'), 'quest', 3); } else toast(L2('Necesitas un 60 % para el sello del tablao. +', 'You need 60% for the tablao seal. +') + g + L2(' oro', ' gold'), 'info'); markDirty(); } }); }

// ---------- evento: la Tomatina (Valencia) ----------
function fsTomatina() { const D = 30000, t0 = performance.now() + 800; let hits = 0, miss = 0, done = false, tg = [], spl = [], nextT = t0;
  openModal(`<h2>🍅 ${L2('¡La Tomatina!', 'La Tomatina!')}</h2><p class="hint">${L2('Toca a la gente cuando asome para lanzarle un tomate. 30 segundos.', 'Tap people when they pop up to throw a tomato. 30 seconds.')}</p><canvas id="tmc" width="240" height="180" style="width:100%;max-width:380px;background:#e8d8b8;border-radius:.5em;touch-action:none"></canvas><p class="hint" id="tmS">0</p>`, 'party');
  const cv = $('#tmc'), x = cv.getContext('2d'), cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push([20 + c * 60, 30 + r * 55]);
  cv.onpointerdown = e => { if (done) return; e.preventDefault(); const R = cv.getBoundingClientRect(), mx = (e.clientX - R.left) * 240 / R.width, my = (e.clientY - R.top) * 180 / R.height; let ok = false;
    for (const t of tg) if (!t.hit && Math.abs(mx - t.x - 10) < 18 && Math.abs(my - t.y - 8) < 22) { t.hit = performance.now(); hits++; ok = true; sfx('hit'); spl.push({ x: t.x + 10, y: t.y + 6, t: performance.now() }); break; }
    if (!ok) { miss++; spl.push({ x: mx, y: my, t: performance.now(), m: 1 }); } $('#tmS').textContent = '🍅 ' + hits; };
  const loop = now => { if (!document.body.contains(cv)) return; x.clearRect(0, 0, 240, 180);
    for (const [cx, cy] of cells) { x.fillStyle = '#c8a878'; x.fillRect(cx - 2, cy - 4, 24, 30); x.fillStyle = '#5a3a20'; x.fillRect(cx, cy - 2, 20, 26); }
    if (!done && now > nextT && now < t0 + D) { const free = cells.filter(([cx, cy]) => !tg.some(t => t.x === cx && t.y === cy)); if (free.length) { const [cx, cy] = free[Math.floor(Math.random() * free.length)]; tg.push({ x: cx, y: cy, t: now, life: 900 - Math.min(400, (now - t0) / 60) }); } nextT = now + 380 + Math.random() * 300; }
    tg = tg.filter(t => now - t.t < t.life + (t.hit ? 300 : 0)); for (const t of tg) { const up = Math.min(1, (now - t.t) / 120); x.fillStyle = t.hit ? '#e83a2a' : '#f0c090'; x.beginPath(); x.arc(t.x + 10, t.y + 8 + (1 - up) * 14, 8, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.fillRect(t.x + 4, t.y + 18, 12, 6); if (!t.hit) { x.fillStyle = '#2a1a10'; x.fillRect(t.x + 6, t.y + 6, 2, 2); x.fillRect(t.x + 12, t.y + 6, 2, 2); x.fillRect(t.x + 8, t.y + 11, 4, 1); } }
    spl = spl.filter(s => now - s.t < 1500); for (const s of spl) { x.fillStyle = s.m ? 'rgba(200,40,30,0.45)' : 'rgba(230,40,30,0.85)'; x.beginPath(); x.arc(s.x, s.y, s.m ? 5 : 8, 0, 7); x.fill(); }
    const left = Math.max(0, Math.ceil((t0 + D - now) / 1000)); x.fillStyle = 'rgba(0,0,0,0.55)'; x.fillRect(80, 2, 80, 14); x.fillStyle = '#ffd040'; x.font = 'bold 11px sans-serif'; x.textAlign = 'center'; x.fillText(left + ' s · 🍅 ' + hits, 120, 13);
    if (!done && now > t0 + D) { done = true; setTimeout(() => { closeModal(); const P = G.P, g = 100 + hits * 30; P.gold += g; if (hits >= 15) culGain('tomatina'); banner('🍅 ' + L2('Fin de la Tomatina', 'End of La Tomatina'), hits + L2(' tomatazos · +', ' tomato hits · +') + g + L2(' de oro', ' gold') + (hits < 15 ? ' · ' + L2('(15 para el sello)', '(15 for the seal)') : '')); sfx('coin'); markDirty(); }, 400); }
    requestAnimationFrame(loop); }; requestAnimationFrame(loop); }

// ---------- diálogos ----------
DLG_HOOKS.push((npc, opts) => { const add = (label, icon, fn) => opts.unshift({ label, icon, fn: () => { closeDialog(); fn(); } });
  if (npc.id === 'mx_folk_maestra') add('💃 ' + L2('Bailar en la tarima (oficio)', 'Dance on stage (job)'), ['run'], fsFolk);
  if (npc.id === 'mx_loteria') add('🎴 ' + L2('Jugar una tabla de lotería', 'Play a lotería board'), ['coin'], fsLoteria);
  if (npc.id === 'mx_pinata') add('🪅 ' + L2('Pegarle a la piñata', 'Hit the piñata'), ['run'], fsPinata);
  if (npc.id === 'pe_mayorista') { if (AMB) add('🛑 ' + L2('Terminar el día', 'End the day'), ['coin'], () => ambEnd()); else { add('🍢 ' + L2('Alquilar carrito de comida (50 oro)', 'Rent a food cart (50 gold)'), ['coin'], () => ambStart('comida')); add('👕 ' + L2('Alquilar puesto de ropa (50 oro)', 'Rent a clothes stall (50 gold)'), ['coin'], () => ambStart('ropa')); } }
  if (npc.id === 'pe_marinera') add('🤍 ' + L2('Concursar en la marinera', 'Enter the marinera contest'), ['run'], fsMarinera);
  if (npc.id === 'es_tablao') add('👏 ' + L2('Subir al tablao', 'Get on the tablao'), ['run'], fsFlamenco);
  if (npc.id === 'es_tomatina') add('🍅 ' + L2('¡A la Tomatina!', 'To La Tomatina!'), ['run'], fsTomatina); });

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['fiestas', '🎉 ' + L2('Fiestas y trabajos (México, Perú, España)', 'Festivals and jobs (Mexico, Peru, Spain)'), () => [
  L2('Sellos culturales: la primera vez que trabajas en un oficio de México, Perú o España, o ganas uno de sus eventos, ganas +0,5 % de daño para siempre (no cuenta en duelos). Llevas ', 'Cultural seals: the first time you work a job in Mexico, Peru or Spain, or win one of their events, you get +0.5% damage forever (not in duels). You have ') + culN() + '/' + Object.keys(CUL).length + ' (+' + (culN() * 0.5) + ' %): ' + Object.keys(CUL).map(k => ((G.P && G.P.cul && G.P.cul[k]) ? '✅ ' : '⬜ ') + CUL[k]).join(' · '),
  L2('México: Ballet Folklórico en la plaza de la catedral de Guadalajara (oficio, baile Jarabe Tapatío; con ropa típica ganas un 50 % más). Trajes Típicos de Doña Chayo: Adelita, Jalisco, Chiapaneca, charro con sarape y camiseta del calendario. Lotería con Don Chencho en el Zócalo. Piñata con Doña Mary en Cuernavaca.', 'Mexico: Folk Ballet in the Guadalajara cathedral square (job, Jarabe Tapatío dance; in traditional clothing you earn 50% more). Doña Chayo\'s Folk Costumes: Adelita, Jalisco, Chiapaneca, charro with sarape and the calendar shirt. Lotería with Don Chencho in the Zócalo. Piñata with Doña Mary in Cuernavaca.'),
  L2('Perú: vendedor ambulante en Gamarra (oficio): alquila a Doña Rosa un puesto de ropa o un carrito de comida, atiende a 8 clientes, regatea y recoge cuando llegue el serenazgo. Concurso de marinera en la Plaza de Armas (baile Marinera).', 'Peru: street vendor in Gamarra (job): rent a clothes stall or food cart from Doña Rosa, serve 8 customers, haggle and pack up when the inspectors come. Marinera contest in the Plaza de Armas (Marinera dance).'),
  L2('España: tablao flamenco en la Plaza de España de Sevilla (baile Flamenco, traje de flamenca a la venta) y la Tomatina en Valencia.', 'Spain: flamenco tablao in Seville\'s Plaza de España (Flamenco dance, flamenca dress for sale) and La Tomatina in Valencia.')],
  () => G.P && G.P.map === 'lima' ? { loc: [512, 62], t: L2('Doña Rosa, Gamarra', 'Doña Rosa, Gamarra'), m: 'lima' } : G.P && G.P.map === 'espana' ? { loc: [ES_SEV.cx, ES_SEV.cy - 10], t: L2('Tablao de Sevilla', 'Seville tablao'), m: 'espana' } : { loc: [MX_GDL.cx, MX_GDL.y0 + 12], t: L2('Tarima de Guadalajara', 'Guadalajara stage'), m: 'mexico' }]);
