// ================= v5.57: DESPERTAR DORADO (fases 1, 2 y 3) · GUARDADO Y BLOQUEADO =================
// Sergio aprobó la muestra y pidió guardar los diseños sin poder usarlos todavía: salen en 🌀 Transformaciones
// bloqueados («Próximamente»), con sus poderes y fuerza como «???». Diseño propio de The Bound (no copia):
// Fase 1 · Despertar: pelo dorado y más erizado. Fase 2 · Chispa del Hilo: puntas más altas, aura dorada con hilos de
// luz y chispas eléctricas. Fase 3 · Corona de Luz: el pelo crece hasta la cintura, aura grande y mucha electricidad.
// Lore (cuando se desbloquee): el hilo vacío se enciende con la luz que el último Tejedor guardó en él (LORE §11 y §30).
// La muestra de la fase 4 (Bestia Carmesí del Hilo) está guardada en tools/art/muestras/dorado_fase4.py.
const DZ_GOLD = [C('#6a3a00'), C('#b87800'), C('#f0c020'), C('#fff08a')];
const DZ_GOLD3 = [C('#7a4600'), C('#c88a00'), C('#ffd440'), C('#fff6b0')];
function dzDraw(p, L, dir, anim, f, F) { const m = p.meta; if (!m || m.hrx === undefined) return;
  const G_ = F === 3 ? DZ_GOLD3 : DZ_GOLD, empty = (x, y) => !uA(p.get(x, y)), isHair = c => G_.includes(c);
  const side = m.side, up = m.up, d = m.d || 1, hx = Math.round(m.hx), hrx = m.hrx, hy = Math.round(m.hy), wy = m.waistY !== undefined ? Math.round(m.waistY) : hy + 14, sway = Math.sin((f || 0) * 1.3);
  const put = (x, y, c, over) => { x = Math.round(x); y = Math.round(y); if (over || empty(x, y) || isHair(p.get(x, y))) p.set(x, y, c); };
  // 3) fase 3: melena larga hasta la cintura (por detrás del cuerpo; de espaldas la tapa)
  if (F === 3) { const y1 = wy + 7;
    if (up) { for (let y = hy; y <= y1 + 1; y++) { const half = Math.round(hrx - 0.5 - Math.max(0, y - y1 + 2) * 1.5); for (let x = hx - half; x <= hx + half; x++) { const k = (x - hx + 40) % 3; p.set(x, y, Math.abs(x - hx) === half ? G_[1] : k === 0 ? G_[1] : k === 1 ? G_[2] : G_[3]); } } }
    else if (side) { const bx = hx - d * Math.round(hrx - 1.5); for (let y = hy - 2; y <= y1; y++) { const w = y > y1 - 3 ? Math.max(1, 4 - (y - y1 + 3)) : 4; for (let k = 0; k < w; k++) put(bx - d * k + sway * (y - hy) / 10, y, k === 0 ? G_[3] : k === w - 1 ? G_[1] : G_[2]); } }
    else for (const sd of [-1, 1]) { const bx = hx + sd * Math.round(hrx - 0.5); for (let y = hy - 1; y <= y1; y++) { const w = y > y1 - 3 ? Math.max(1, 3 - (y - y1 + 3)) : 3; for (let k = 0; k < w; k++) put(bx + sd * k + sway * (y - hy) / 12, y, k === 0 ? G_[3] : k === w - 1 ? G_[1] : G_[2]); } } } }
const DZ_LOCK = true;
// cada fase cambia el peinado (los de la muestra que gustó a Sergio), el pelo a dorado y los ojos a turquesa
HAIRS.dz_oro = pal(['#6a3a00', '#b87800', '#f0c020', '#fff08a']); HAIRS.dz_oro3 = pal(['#7a4600', '#c88a00', '#ffd440', '#fff6b0']); HAIR_N.dz_oro = HAIR_N.dz_oro3 = L2('Dorado del Despertar', 'Awakening gold');
const DZ_HS = { m: [32, 27, 7], f: [52, 54, 51] };
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, opts) { const F = gear && gear.sr === 'dorado' ? Math.min(3, gear.sf | 0) : 0; if (F && app) { const g = (app.g || 'm') === 'f' ? 'f' : 'm'; app = Object.assign({}, app, { hair: F === 3 ? 'dz_oro3' : 'dz_oro', hs: DZ_HS[g][F - 1], eyes: 'turquesa' }); } return _hl.call(this, cls, app, gear, cos, opts); }; }
SR.dorado = { n: L2('Despertar Dorado', 'Golden Awakening'), f: L2('Fase 1 · Despertar', 'Phase 1 · Awakening'), ic: '⚡', col: '#ffd040', cost: [['esencia_nihil', 99]], lv: 9999,
  pas: L2('PRÓXIMAMENTE · aún no se puede conseguir. Fase 1: pelo dorado y erizado. Fase 2: aura dorada con hilos de luz y chispas eléctricas. Fase 3: el pelo crece hasta la cintura y la electricidad se desata. Poderes y fuerza: ???', 'COMING SOON · cannot be obtained yet. Phase 1: golden spiky hair. Phase 2: golden aura with threads of light and electric sparks. Phase 3: the hair grows to the waist and the electricity is unleashed. Powers and strength: ???'),
  forms: () => [[1, L2('Fase 1 · Despertar', 'Phase 1 · Awakening')], [2, L2('Fase 2 · Chispa del Hilo', 'Phase 2 · Spark of the Thread')], [3, L2('Fase 3 · Corona de Luz', 'Phase 3 · Crown of Light')]],
  why: () => `<b>🔒 ${L2('Próximamente', 'Coming soon')}</b> · ${L2('poderes y fuerza: ???', 'powers and strength: ???')}` };
SRSK.dorado = ['srd1', 'srd2', 'srd3', 'srd4'];
if (typeof FORM_POW !== 'undefined') FORM_POW.dorado = [['dr', 0, '???', '???'], ['crit', 0, '???', '???'], ['spd', 0, '???', '???']];
if (typeof KID_FORMS !== 'undefined') { const i = KID_FORMS.indexOf('dorado'); if (i >= 0) KID_FORMS.splice(i, 1); }
// bloqueado: el ritual no la da, no se puede usar y si alguien la tuviera se le quita (salvo en pruebas: P._dzTest)
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const b = document.querySelector('#modal [data-sr="dorado"]'); if (b) { b.disabled = true; b.textContent = '🔒 ' + L2('Próximamente', 'Coming soon'); b.onclick = null; } } catch (e) { } return r; }; }
{ const _su = srUse; srUse = function (k) { if (k === 'dorado' && DZ_LOCK && !G.P._dzTest) { toast('⚡ ' + L2('Despertar Dorado: próximamente.', 'Golden Awakening: coming soon.'), 'warn'); return; } return _su.apply(this, arguments); }; }
V33_TICKS.push(() => { const P = G.P; if (P && DZ_LOCK && !P._dzTest && P.srOwn && P.srOwn.includes('dorado')) { P.srOwn = P.srOwn.filter(k => k !== 'dorado'); if (P.sr === 'dorado') { P.sr = null; P.srF = 0; calcStats(P); refreshLook(); } } });
{ const _ss = srSet; srSet = function (on) { const P = G.P; if (on === 3 && P && P.sr === 'dorado') { const r = _ss.call(this, 1); P.srF = 3; calcStats(P); refreshLook(); markDirty(); return r; } return _ss.apply(this, arguments); }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const dz = L && L.sr === 'dorado' && L.srF, own = dz && !p.t; if (own) { p.t = new Uint8Array(p.w * p.h); p.tg = 0; } const r = _dh.apply(this, arguments);
  if (dz) try { const tg = p.tg; p.tg = 6; dzDraw(p, L, dir, anim, f, Math.min(3, L.srF | 0)); p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('dz', e); } if (own) { p.t = undefined; } return r; }; }
// el detalle HD vuelve a llamar a drawHero, así que el dorado se ve también en HD
// aura dorada con hilos de luz y chispas (fases 2 y 3), para ti y para los demás en el online
function dzAura(e, cx, cy, F) { if (F === 1) { const x = e.x - cx, y = e.y - cy; ctx.fillStyle = 'rgba(255,220,80,0.16)'; ctx.beginPath(); ctx.ellipse(x, y - 16, 14, 24, 0, 0, 7); ctx.fill(); if (Math.sin(G.t * 5 + e.x) > 0.6) { ctx.fillStyle = '#fff6b0'; ctx.fillRect(x + Math.sin(G.t * 3) * 12, y - 30 + Math.cos(G.t * 4) * 8, 2, 2); } return; } const x = e.x - cx, y = e.y - cy, t = G.t + (e.x || 0) * 0.01, h = F === 3 ? 62 : 50, g = ctx.createRadialGradient(x, y - 22, 4, x, y - 22, h * 0.8); g.addColorStop(0, 'rgba(255,240,140,0.35)'); g.addColorStop(1, 'rgba(255,170,0,0)'); ctx.fillStyle = g;
  ctx.beginPath(); const n = F === 3 ? 11 : 8; for (let k = 0; k <= n * 2; k++) { const u = k / (n * 2), a = Math.PI + u * Math.PI, rr = (k % 2 ? 0.55 : 0.85 + Math.sin(t * 9 + k) * 0.08) * h; ctx.lineTo(x + Math.cos(a) * rr * 0.55, y - 8 + Math.sin(a) * rr); } ctx.lineTo(x + h * 0.3, y + 3); ctx.lineTo(x - h * 0.3, y + 3); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,248,200,0.6)'; ctx.lineWidth = 1; for (let k = 0; k < (F === 3 ? 4 : 2); k++) { ctx.beginPath(); for (let u = 0; u <= 1; u += 0.08) { const yy = y - u * h, xx = x + Math.sin(u * 9 + k * 2.1 + t * 3) * h * 0.28 * (1 - u * 0.4); u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  if (Math.sin(t * 7) > (F === 3 ? 0.2 : 0.6)) { ctx.strokeStyle = 'rgba(180,235,255,0.95)'; ctx.lineWidth = 1.5; for (let k = 0; k < (F === 3 ? 3 : 1); k++) { let px = x + (k % 2 ? 12 : -12), py = y - 30 - k * 8; ctx.beginPath(); ctx.moveTo(px, py); for (let s = 0; s < 4; s++) { px += (k % 2 ? 5 : -5) + Math.sin(t * 40 + s * 3 + k) * 4; py += 4 + Math.cos(t * 33 + s) * 4; ctx.lineTo(px, py); } ctx.stroke(); } } }
WORLD_DRAW.push((cx, cy) => { const P = G.P; if (!P) return; if (P.sr === 'dorado' && (P.srF | 0) >= 1) dzAura(P, cx, cy, P.srF | 0); for (const r of G.remote.values()) if (r.map === P.map && r.gear && r.gear.sr === 'dorado' && (r.gear.sf | 0) >= 1) dzAura(r, cx, cy, r.gear.sf | 0); });
// Lupa
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_dorado', '⚡ ' + L2('Despertar Dorado (próximamente)', 'Golden Awakening (coming soon)'), () => [L2('Se ve en 🌀 Transformaciones pero aún no se puede conseguir. Fase 1 · Despertar (pelo dorado y erizado), Fase 2 · Chispa del Hilo (aura dorada con hilos de luz y chispas) y Fase 3 · Corona de Luz (pelo hasta la cintura y mucha electricidad).', 'It shows in 🌀 Transformations but cannot be obtained yet. Phase 1 · Awakening (golden spiky hair), Phase 2 · Spark of the Thread (golden aura with threads of light and sparks) and Phase 3 · Crown of Light (waist-long hair and lots of electricity).'), L2('Cómo se consigue, sus poderes y su fuerza: ???', 'How to get it, its powers and its strength: ???')], () => null]);
if (typeof SR_GUIDE !== 'undefined') SR_GUIDE.dorado = { how: () => [L2('Próximamente: aún no se puede conseguir.', 'Coming soon: cannot be obtained yet.')], lore: () => L2('???', '???') };
