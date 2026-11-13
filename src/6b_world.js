// ================= LIVING WORLD: calendar, seasons, weather, world events =================
const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const SEASON_OF = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 0];
const SEASONS = ['Invierno', 'Primavera', 'Verano', 'Otoño'];
const WX = {
  clear: { n: 'Soleado', w: [25, 40, 40, 25] }, cloudy: { n: 'Nublado', w: [25, 20, 8, 25], dark: 0.08 },
  rain: { n: 'Lluvia', w: [0, 30, 6, 22], dark: 0.16 }, storm: { n: 'Tormenta', w: [0, 6, 14, 6], dark: 0.28 },
  snow: { n: 'Nieve', w: [42, 0, 0, 0], dark: 0.05 }, hot: { n: 'Caluroso', w: [0, 4, 30, 0] },
  fog: { n: 'Niebla', w: [8, 5, 0, 6], dark: 0.06 }, wind: { n: 'Viento de otoño', w: [0, 0, 0, 22] },
};
function cal() { const P = G.P; if (!P || !P.cal) return { y0: 1, m0: 2, dpm: 7, d: 0 }; return P.cal; }
function calDay() { return cal().d; }
function calDate(d) { const C = cal(); d = d === undefined ? C.d : d; const dpm = C.dpm || 7, mi = C.m0 + Math.floor(d / dpm), m = ((mi % 12) + 12) % 12, y = C.y0 + Math.floor(mi / 12);
  return { wd: WEEKDAYS[d % 7], day: d % dpm + 1, m, mon: MONTHS[m], y, season: SEASON_OF[m], sn: SEASONS[SEASON_OF[m]] }; }
function calShort() { const D = calDate(); return D.wd.slice(0, 3) + ' ' + D.day + ' ' + D.mon.slice(0, 3); }
function calLong() { const D = calDate(); return `${D.wd}, ${D.day} de ${D.mon} del año ${D.y} · ${D.sn}`; }
function initWorldState(P) {
  if (!P.cal) P.cal = { y0: 1, m0: 2, dpm: 7, d: 0 }; P.cal.dpm = 7;
  P.wstate = P.wstate || {}; const W = P.wstate; W.towns = W.towns || {}; W.ev = W.ev || []; W.news = W.news || []; W.wx = W.wx || 'clear'; W.wxT = W.wxT || 0;
  if (SETTINGS.events === undefined) SETTINGS.events = true; if (SETTINGS.weather === undefined) SETTINGS.weather = true;
}
// ---------- day tick (called when the clock passes midnight) ----------
function newDay() {
  const P = G.P; if (!P || P.ghost) return; P.cal.d++; const D = calDate();
  if (P.cal.d % (P.cal.dpm || 7) === 0) toast('Comienza ' + D.mon + (SEASON_OF[D.m] !== SEASON_OF[(D.m + 11) % 12] ? ' · ¡Llega el ' + D.sn.toLowerCase() + '!' : ''), 'quest', 5);
  for (const k of P.kids || []) { const st = kidStage(k), prev = k.st || 0; if (st > prev) { k.st = st; toast(k.name + ' ha crecido: ahora es ' + (st === 2 ? 'joven y puede luchar contigo' : kidStName(k, st).toLowerCase()), 'quest', 5); refreshKidAtlas(k); } }
  if (SETTINGS.events) maybeEvent();
  uiDirty.hud = true; markDirty();
}
// ---------- weather ----------
let wxParts = [], wxFlash = 0, wxNextBolt = 8, wxIntensity = 0;
function regionWx(w) { const P = G.P; if (!G.map || !G.map.isWorld) return null; const r = regionAt(Math.floor(P.x / 16), Math.floor(P.y / 16)); const k = r && r.k || ''; if (k === 'eclipse') return 'cloudy'; if (k === 'desierto' || k === 'sahrim') return w === 'snow' || w === 'rain' ? 'hot' : w === 'storm' ? 'wind' : w; if (k === 'volcan') return w === 'snow' ? 'hot' : w; return w; }
function curWx() { if (!SETTINGS.weather || !G.P || !G.P.wstate) return 'clear'; return regionWx(G.P.wstate.wx) || 'clear'; }
function weatherTick(dt) {
  const P = G.P, W = P.wstate; W.wxT -= dt;
  if (W.wxT <= 0) { const s = calDate().season, ks = Object.keys(WX), tot = ks.reduce((a, k) => a + WX[k].w[s], 0); let r = Math.random() * tot, nx = 'clear'; for (const k of ks) { r -= WX[k].w[s]; if (r <= 0) { nx = k; break; } }
    if (nx !== W.wx) { W.wx = nx; if (G.map.isWorld && SETTINGS.weather) toast('Clima: ' + WX[curWx()].n, 'info'); } W.wxT = 90 + Math.random() * 240; }
  const w = curWx(), target = w === 'clear' || w === 'cloudy' ? 0 : 1; wxIntensity += (target - wxIntensity) * Math.min(1, dt * 0.6);
  if (w === 'storm' && G.map.isWorld) { wxNextBolt -= dt; if (wxNextBolt <= 0) { wxNextBolt = 6 + Math.random() * 12; wxFlash = 1; setTimeout(() => sfx('boom'), 300 + Math.random() * 700); } }
  wxFlash = Math.max(0, wxFlash - dt * 3);
}
function wxDark() { if (!G.P || !G.P.wstate || !G.map || !G.map.isWorld || !SETTINGS.weather) return 0; const w = WX[curWx()]; return (w.dark || 0) * (w === WX.cloudy ? 1 : wxIntensity); }
function drawWeather(cx, cy, after) {
  if (!G.map || !G.map.isWorld || !SETTINGS.weather || !G.P || G.P.ghost) return; const w = curWx(), I = wxIntensity, s = calDate().season;
  if (after && bloodMoon()) { ctx.fillStyle = 'rgba(170,0,10,0.24)'; ctx.fillRect(0, 0, VW, VH); const g = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.3, VW / 2, VH / 2, VW * 0.7); g.addColorStop(0, 'rgba(120,0,0,0)'); g.addColorStop(1, 'rgba(90,0,0,0.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); }
  if (after) { if (wxFlash > 0) { ctx.fillStyle = `rgba(230,240,255,${(wxFlash * 0.55).toFixed(3)})`; ctx.fillRect(0, 0, VW, VH); } return; }
  // season & weather tints
  if (s === 0 || w === 'snow') { ctx.fillStyle = `rgba(232,242,255,${(w === 'snow' ? 0.2 + 0.08 * I : 0.08).toFixed(3)})`; ctx.fillRect(0, 0, VW, VH); }
  if (s === 3) { ctx.fillStyle = 'rgba(200,110,30,0.06)'; ctx.fillRect(0, 0, VW, VH); }
  if (w === 'hot') { ctx.fillStyle = `rgba(255,150,40,${(0.09 * I).toFixed(3)})`; ctx.fillRect(0, 0, VW, VH); }
  if (w === 'rain' || w === 'storm') { ctx.fillStyle = `rgba(20,30,60,${(0.12 * I).toFixed(3)})`; ctx.fillRect(0, 0, VW, VH); }
  if (w === 'fog') { for (let k = 0; k < 3; k++) { const g = ctx.createLinearGradient(0, 0, VW, 0), o = ((G.t * 6 + k * 120) % VW); g.addColorStop(0, 'rgba(230,235,240,0)'); g.addColorStop(0.5, `rgba(230,235,240,${(0.16 * I).toFixed(3)})`); g.addColorStop(1, 'rgba(230,235,240,0)'); ctx.fillStyle = g; ctx.fillRect(o - VW / 2, VH * (0.2 + k * 0.25), VW, VH * 0.3); } }
  // particles (screen space with slight camera parallax)
  const want = w === 'rain' ? 140 : w === 'storm' ? 220 : w === 'snow' ? 170 : w === 'wind' ? 60 : w === 'hot' ? 18 : s === 3 ? 14 : s === 1 && w === 'clear' ? 10 : 0;
  const n = Math.round(want * I + (w === 'clear' ? want : 0));
  while (wxParts.length < n) wxParts.push({ x: Math.random() * VW, y: Math.random() * VH, v: 0.5 + Math.random(), p: Math.random() * 6 });
  if (wxParts.length > n) wxParts.length = n;
  const dt = 1 / 60;
  for (const q of wxParts) {
    if (w === 'rain' || w === 'storm') { q.y += 420 * q.v * dt; q.x -= (w === 'storm' ? 140 : 70) * q.v * dt; ctx.strokeStyle = 'rgba(180,200,255,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x + (w === 'storm' ? 4 : 2), q.y - 9); ctx.stroke(); if (q.y > VH) { if (Math.random() < 0.3) { ctx.fillStyle = 'rgba(200,220,255,0.5)'; ctx.fillRect(q.x, VH - Math.random() * VH * 0.9, 2, 1); } q.y = -10; q.x = Math.random() * (VW + 80); } }
    else if (w === 'snow') { q.y += 28 * q.v * dt; q.x += Math.sin(G.t * 1.5 + q.p) * 12 * dt; ctx.fillStyle = 'rgba(255,255,255,0.95)'; const fs = q.v > 1.2 ? 3 : 2; ctx.fillRect(Math.round(q.x), Math.round(q.y), fs, fs); if (q.y > VH) { q.y = -4; q.x = Math.random() * VW; } }
    else if (w === 'hot') { q.y -= 14 * q.v * dt; q.x += Math.sin(G.t + q.p) * 6 * dt; ctx.fillStyle = 'rgba(255,220,140,0.35)'; ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 2); if (q.y < 0) { q.y = VH; q.x = Math.random() * VW; } }
    else { // leaves (autumn / wind) and petals (spring)
      const spd = w === 'wind' ? 90 : 25; q.x += spd * q.v * dt; q.y += (14 + Math.sin(G.t * 2 + q.p) * 18) * dt; ctx.fillStyle = s === 1 ? (q.p > 3 ? '#ffc0d8' : '#ffffff') : (q.p > 4 ? '#e8743a' : q.p > 2 ? '#c8a030' : '#a0401a'); ctx.fillRect(Math.round(q.x), Math.round(q.y), 3, Math.sin(G.t * 4 + q.p) > 0 ? 3 : 2); if (q.x > VW + 4 || q.y > VH) { q.x = -4; q.y = Math.random() * VH * 0.8; } }
  }
}
// ---------- world events ----------
const TOWN_LV = { albor: 4, puerto: 18, arxar: 42, sahrim: 98, yarakai: 110 };
const EVDEF = {
  asalto: { bad: 1, n: t => 'Bandidos asaltan ' + t, d: 'Unos bandidos están robando la tienda. Si no los detienes antes de mañana, tomarán el pueblo.' },
  horda: { bad: 1, n: t => 'Horda de monstruos cerca de ' + t, d: 'Monstruos rodean el pueblo. Derrótalos para que el comercio no se resienta.' },
  festival: { n: t => 'Festival en ' + t, d: 'Las tiendas del pueblo hacen un 25% de descuento durante dos días.' },
  mercader: { n: t => 'Mercader ambulante en ' + t, d: 'Un mercader de tierras lejanas vende objetos raros hoy.' },
  estrellas: { n: () => 'Lluvia de estrellas', d: 'Esta noche los enemigos sueltan botín raro con más frecuencia.' },
  bendicion: { n: () => 'Bendición del Vínculo', d: '+50% de experiencia durante todo el día.' },
  cosecha: { n: () => 'Cosecha abundante', d: 'Los cultivos crecen el doble de rápido hoy.' },
  lunasangre: { bad: 1, n: () => 'Luna de Sangre', d: 'Esta noche todos los enemigos son el doble de fuertes... pero dan el doble de experiencia y botín.' },
};
function townName(k) { const t = TOWNS.find(t => t.k === k); return t ? t.n : k; }
function townRuled(k) { const W = G.P && G.P.wstate; return W && W.towns[k] && W.towns[k].ruled; }
function evActive(type, town) { const W = G.P.wstate; return W.ev.find(e => e.type === type && (!town || e.town === town)); }
function news(txt, kind) { const W = G.P.wstate; W.news.unshift({ d: calDay(), txt, kind }); W.news = W.news.slice(0, 20); toast(txt, kind === 'bad' ? 'warn' : 'quest', 6); sfx(kind === 'bad' ? 'hurt' : 'quest'); }
function maybeEvent() {
  const P = G.P, W = P.wstate; // expire old events
  for (const e of W.ev.slice()) if (calDay() >= e.end) endEvent(e, false);
  if (W.ev.length >= 2 || Math.random() > 0.6) return;
  const towns = TOWNS.filter(t => (TOWN_LV[t.k] || 0) <= P.lv + 10 && (t.k !== 'sahrim' && t.k !== 'yarakai' || P.ws.sahrim)).map(t => t.k);
  const free = towns.filter(k => !townRuled(k) && !W.ev.some(e => e.town === k));
  const types = Object.keys(EVDEF).filter(k => !W.ev.some(e => e.type === k));
  const type = pick(types.filter(k => (k !== 'asalto' && k !== 'horda' && k !== 'festival' && k !== 'mercader') || free.length)); if (!type) return;
  const town = ['asalto', 'horda', 'festival', 'mercader'].includes(type) ? pick(free) : null;
  startEvent(type, town);
}
function startEvent(type, town) {
  const P = G.P, W = P.wstate, E = EVDEF[type], ev = { id: Date.now().toString(36) + type, type, town, start: calDay(), end: calDay() + (type === 'festival' ? 2 : 1), left: 0 };
  W.ev.push(ev); news('¡Evento! ' + E.n(town ? townName(town) : '') + '. ' + E.d, E.bad ? 'bad' : 'good');
  if (G.map && G.map.isWorld) spawnEventMobs(ev);
  markDirty(true); return ev;
}
function endEvent(ev, won) {
  const P = G.P, W = P.wstate; W.ev = W.ev.filter(e => e !== ev); for (const m of G.ents) if (m.ev === ev.id) m.remove = true;
  if (ev.type === 'asalto') { if (won) { news('¡Has salvado ' + townName(ev.town) + ' de los bandidos! El pueblo te lo agradece.', 'good'); eventReward(ev, 1); W.towns[ev.town] = { happy: calDay() + 2 }; }
    else { W.towns[ev.town] = { ruled: 'bandidos', since: calDay() }; news(townName(ev.town) + ' ha caído en manos de los bandidos. Nuevo régimen: precios más altos y bandidos por las calles. Derrota a su jefe para liberarlo.', 'bad'); if (G.map && G.map.isWorld) spawnRegime(ev.town); } }
  else if (ev.type === 'horda') { if (won) { news('Has repelido la horda de ' + townName(ev.town) + '.', 'good'); eventReward(ev, 0.7); } else { W.towns[ev.town] = { sad: calDay() + 2 }; news('La horda dañó el comercio de ' + townName(ev.town) + ': precios +20% durante dos días.', 'bad'); } }
  else if (ev.type === 'mercader') { for (const e of G.ents) if (e.evNpc === ev.id) e.remove = true; }
  markDirty(true);
}
function eventReward(ev, k) { const P = G.P, g = Math.round((60 + P.lv * P.lv * 2.2) * k), xp = Math.round(xpToNext(P.lv) * 0.06 * k); P.gold += g; gainXp(xp); floatText(P.x, P.y - 44, '+' + fmt(g) + ' ORO', '#ffd040', true); if (Math.random() < 0.5) giveItem(P.lv >= 100 ? 'piedra2' : 'piedra1', 2); }
function evLevel(town) { return Math.max(TOWN_LV[town] || 1, Math.min(MAXLV, G.P.lv - 2)); }
function townCenter(k) { const t = TOWNS.find(t => t.k === k); return { x: (t.x0 + t.x1) / 2, y: (t.y0 + t.y1) / 2 }; }
function freeSpot(cx, cy, r) { const W = G.world; for (let k = 0; k < 40; k++) { const x = Math.round(cx + (Math.random() - 0.5) * r * 2), y = Math.round(cy + (Math.random() - 0.5) * r * 2); if (!blockedFor(W, x, y, W.lvl[W.I(x, y)])) return { x: x * 16 + 8, y: y * 16 + 8, L: W.lvl[W.I(x, y)] }; } return null; }
function spawnEventMobs(ev) {
  if (G.ents.some(m => m.ev === ev.id)) return; const lv = evLevel(ev.town || 'albor');
  if (ev.type === 'asalto' || ev.type === 'horda') { const c = townCenter(ev.town), n = ev.type === 'asalto' ? 6 : 8, mid = ev.type === 'asalto' ? 'bandido' : pick(['orco', 'goblin']);
    ev.left = ev.left || n; for (let i = 0; i < ev.left; i++) { const s = freeSpot(c.x, c.y, 7); if (!s) continue; const m = spawnMob(mid, lv, s.x, s.y, s.L, null, false); m.ev = ev.id; m.aggroR = 120; m.evMob = 1; m.noSafe = 1; } }
  if (ev.type === 'mercader') { const c = townCenter(ev.town), s = freeSpot(c.x, c.y, 4); if (s) { const e = spawnNPC('mercader_amb', s.x, s.y + 4, 'world', { wander: 1, L: s.L }); if (e) e.evNpc = ev.id; } }
}
function spawnRegime(town) {
  const R = G.P.wstate.towns[town]; if (!R || !R.ruled || G.ents.some(m => m.regime === town)) return; const c = townCenter(town), lv = evLevel(town) + 2;
  for (let i = 0; i < 5; i++) { const s = freeSpot(c.x, c.y, 9); if (!s) continue; const m = spawnMob('bandido', lv, s.x, s.y, s.L, null, false); m.regime = town; m.noSafe = 1; m.aggroR = 110; }
  const s = freeSpot(c.x, c.y, 3); if (s) { const b = spawnMob('bandido', lv + 3, s.x, s.y, s.L, null, false); b.regime = town; b.noSafe = 1; b.elite = 1; b.chief = town; b.name = 'Jefe Bandido'; b.maxhp = b.hp = b.hp * 8; b.atk = Math.round(b.atk * 1.6); b.aggroR = 130; }
}
function worldEventKill(m) {
  const P = G.P, W = P.wstate;
  if (m.ev) { const ev = W.ev.find(e => e.id === m.ev); if (ev) { ev.left = Math.max(0, (ev.left || 1) - 1); if (ev.left === 0) endEvent(ev, true); else floatText(m.x, m.y - 50, 'Quedan ' + ev.left, '#ffb070'); } }
  if (m.chief) { const t = m.chief; delete W.towns[t]; for (const e of G.ents) if (e.regime === t) e.remove = true; news('¡Has liberado ' + townName(t) + '! Los vecinos celebran un festival.', 'good'); eventReward({}, 2); startEvent('festival', t); }
}
function townPriceMul(town) { const W = G.P && G.P.wstate; if (!W || !town) return 1; const T_ = W.towns[town] || {}; let k = 1; if (T_.ruled) k *= 1.5; if (T_.sad > calDay()) k *= 1.2; if (T_.happy > calDay()) k *= 0.85; if (evActive('festival', town)) k *= 0.75; return k; }
function xpEventMul() { const W = G.P && G.P.wstate; return W && evActive('bendicion') ? 1.5 : 1; }
function isNight() { const h = (G.time / 60) % 24; return h >= 19 || h < 6; }
function bloodMoon() { return !!(G.P && G.P.wstate && evActive('lunasangre') && isNight() && SETTINGS.events !== false); }
function bloodApply(m) { if (m.blood || m.ghost || !bloodMoon()) return; m.blood = 1; m.maxhp *= 2; m.hp *= 2; m.atk = Math.round(m.atk * 2); m.xp = Math.round((m.xp || 0) * 2); m.gold = Math.round((m.gold || 0) * 2); }
function dropEventMul() { if (bloodMoon()) return 2; const h = (G.time / 60) % 24; return evActive('estrellas') && (h >= 19 || h < 6) ? 1.5 : 1; }
function cropEventMul() { return G.P && G.P.wstate && evActive('cosecha') ? 2 : 1; }
// periodic: make sure event mobs / regimes exist when the player is in the world
let wEvT = 0;
function worldTick(dt) {
  if (!G.P || G.P.ghost || !G.P.wstate) return; weatherTick(dt); wEvT += dt; if (wEvT < 2) return; wEvT = 0; if (!G.map.isWorld) return; const W = G.P.wstate;
  for (const ev of W.ev) if (ev.type === 'asalto' || ev.type === 'horda' || ev.type === 'mercader') spawnEventMobs(ev);
  for (const t in W.towns) if (W.towns[t].ruled) spawnRegime(t);
  const bm = bloodMoon(); if (bm) for (const m of G.ents) if (m.type === 'mob' && !m.dying) bloodApply(m); if (bm && !W.bmAnn) { W.bmAnn = 1; news('La Luna de Sangre se alza... ¡los enemigos son el doble de fuertes!', 'bad'); setMusic && setMusic('boss'); } if (!bm && W.bmAnn) { W.bmAnn = 0; for (const m of G.ents) if (m.blood) { m.blood = 0; m.maxhp /= 2; m.hp = Math.min(m.hp, m.maxhp); m.atk = Math.round(m.atk / 2); } setMusic && setMusic(null); }
  if (evActive('estrellas') && dropEventMul() > 1 && Math.random() < 0.5) addFx({ type: 'bolt', x: G.cam.x + Math.random() * VW, y: G.cam.y - 10, x2: G.cam.x + Math.random() * VW + 60, y2: G.cam.y + 80, dur: 0.5, col: '#fff4c0' });
}
// wandering merchant
NPCS.mercader_amb = { n: 'Zoltan el Errante', title: 'Mercader ambulante', look: LK({ hat: 'hood', hatC: P5(['#3a0c3a', '#5e1a5e', '#842a84', '#ac44ac', '#d070d0']), hair: HAIRS.blanco, beard: HAIRS.blanco, outfit: 'robe', main: P5(['#3a0c3a', '#5e1a5e', '#842a84', '#ac44ac', '#d070d0']), sec: GOLD.slice(1) }), shop: 'store', lines: ['Traigo maravillas de más allá del mar...', 'Solo estoy de paso. ¡Compra mientras puedas!'] };
SHOPS.store.wander = ['pergamino_xp', 'tonico_fuerza', 'tonico_hierro', 'piedra2', 'piedra3', 'diamante', 'opalo', 'colgante_amor', 'ramo', 'pastel', 'cosi_c_capa_estelar', 'cosi_c_halo'].filter(id => ITEMS[id]);
// ---------- "Mundo" tab ----------
function renderWorldTab(B) {
  const P = G.P, W = P.wstate, C = P.cal;
  const evs = W.ev.map(e => `<div class="srow"><div class="sn"><b class="${EVDEF[e.type].bad ? 'bad' : 'ok2'}">${esc(EVDEF[e.type].n(e.town ? townName(e.town) : ''))}</b><small>${esc(EVDEF[e.type].d)}${e.left ? ' · Quedan ' + e.left : ''} · termina el ${esc(calDate(e.end).wd)} ${calDate(e.end).day}</small></div></div>`).join('') || '<p class="hint">Ahora mismo todo está tranquilo.</p>';
  const towns = TOWNS.map(t => { const S = W.towns[t.k] || {}; return `<div class="srow"><div class="sn"><b>${esc(t.n)}</b><small>${S.ruled ? '<span class="bad">Gobernado por bandidos · precios +50% · derrota al Jefe Bandido</span>' : S.happy > calDay() ? '<span class="ok2">Agradecido · precios -15%</span>' : S.sad > calDay() ? '<span class="bad">Comercio dañado · precios +20%</span>' : evActive('festival', t.k) ? '<span class="ok2">¡De festival! precios -25%</span>' : 'En paz'}</small></div></div>`; }).join('');
  const nw = W.news.slice(0, 8).map(n => `<div class="news ${n.kind}"><small>${esc(calDate(n.d).wd.slice(0, 3))} ${calDate(n.d).day} ${esc(calDate(n.d).mon.slice(0, 3))}</small> ${esc(n.txt)}</div>`).join('') || '<p class="hint">Sin noticias todavía.</p>';
  B.innerHTML = `<div class="relwrap"><div class="frame"><h3>Calendario</h3><p class="cal">${esc(calLong())}</p><p>Clima: <b>${esc(WX[curWx()].n)}</b>${SETTINGS.weather ? '' : ' (clima desactivado)'}</p>
    <p class="hint">Un día del juego dura 5 minutos y cada mes tiene 7 días. Las estaciones cambian con el mes: invierno (dic-feb) con nieve, primavera con lluvias, verano caluroso con tormentas y otoño con viento y hojas. Los hijos crecen con los días.</p>${(() => { const cs = TOWNS.map(t => [t, celebOf(t.k)]).filter(x => x[1]); return cs.length ? '<h3>Hoy en los pueblos</h3>' + cs.map(([t, c]) => `<div class="srow"><div class="sn"><b class="ok2">${esc(c.n)}</b><small>${esc(t.n)} · ${esc(c.d)}</small></div></div>`).join('') : ''; })()}
    <h3>Eventos activos</h3>${evs}</div><div class="frame"><h3>Pueblos</h3>${towns}<h3>Noticias</h3>${nw}</div></div>`;
}
