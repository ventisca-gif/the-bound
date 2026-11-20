// ================= v4.65: PROGRESO MÁS ÁGIL Y ESPERA DE POCIONES =================
// - Maestría de armas: curva más suave (antes hacían falta ~200.000 victorias para el 50) y la experiencia sube con el
//   nivel del enemigo. Ahora el 50 llega en unas 15-20 horas de juego a nivel alto.
// - Arma despertada: el doble de experiencia por victoria y +50 % contra enemigos de tu nivel o más.
// - Pociones curativas: 8 s de espera entre una y otra (el botón muestra la cuenta atrás). Maná y comida no esperan.

// ---------- maestría ----------
wmNeed = function (lv) { return Math.round(8 * Math.pow(lv, 1.3)); };
// killMob ya da 1 / 4 / 25; se añade un extra según el nivel del enemigo
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments);
    try { if (m && m.type === 'mob' && !m.part && !m.summoned && G.P) { const extra = Math.floor((m.lv || 1) / 40) * (m.boss ? 5 : m.elite ? 2 : 1); if (extra > 0) wmGain(extra); } } catch (e) { }
    return r; }; }

// ---------- arma despertada ----------
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments);
    try { const P = G.P, w = P && P.equip && P.equip.weapon; if (w && m && !m.summoned && m.type === 'mob') { const l0 = wlvOf(w); w.wx = (w.wx || 0) + (m.boss ? 30 : m.elite ? 6 : 1) * ((m.lv || 1) >= P.lv - 5 ? 1.5 : 1); const l1 = wlvOf(w);
      if (l1 > l0) { banner(L2('Tu arma despierta: nivel ', 'Your weapon awakens: level ') + l1, w.soul || ''); sfx('level'); calcStats(P); } } } catch (e) { }
    return r; }; }

// ---------- espera de pociones curativas ----------
const POT_CD = 30; // 5.64: 30 s (Sergio)
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx], it = s && ITEMS[s.id];
    if (it && it.t === 'cons' && (it.heal || (it.p && it.k === 'heal'))) {
      const left = (P.healCd || 0) - G.t; if (left > 0) { toast(L2('Poción curativa en espera: ', 'Healing potion cooling down: ') + Math.ceil(left) + ' s', 'warn', 1.2); return; }
      const r = _ui.apply(this, arguments); P.healCd = G.t + POT_CD; return r; }
    return _ui.apply(this, arguments); }; }
if (!document.getElementById('potCss')) { const st = document.createElement('style'); st.id = 'potCss'; st.textContent = '#hbPot{position:relative}#hbPot .pcd{position:absolute;inset:0;border-radius:inherit;background:conic-gradient(rgba(0,0,0,.65) var(--a),transparent 0);display:flex;align-items:center;justify-content:center;color:#fff;font:bold 1em Verdana,sans-serif;text-shadow:0 1px 0 #000;pointer-events:none}'; document.head.appendChild(st); }
V33_TICKS.push(() => { const b = $('#hbPot'), P = G.P; if (!b || !P || typeof HB2 !== 'undefined') return; let o = b.querySelector('.pcd'); const left = (P.healCd || 0) - G.t;
  if (left <= 0) { if (o) o.remove(); return; } if (!o) { o = document.createElement('span'); o.className = 'pcd'; b.appendChild(o); }
  o.style.setProperty('--a', Math.round(left / POT_CD * 360) + 'deg'); const t = String(Math.ceil(left)); if (o.textContent !== t) o.textContent = t; });

// ---------- armas imbuidas (aura del dibujo de Sergio: tools/dev/imbuidas.py) ----------
// El arma se ve imbuida cuando atacas con un elemento (habilidad de fuego, hielo, rayo o agua en los últimos 2,5 s),
// cuando lleva una runa de la herrería (fuego, hielo o rayo) o mientras dura una Esencia de imbuir (5 min).
SAVEKEYS.push('imb');
const IMB_CV = {};
for (const k in IMB_IMG) { const [w, h] = IMB_SIZE[k], c = mkCanvas(w, h); IMB_CV[k] = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = IMB_IMG[k]; }
const IMB_N = { fire: L2('Fuego', 'Fire'), ice: L2('Hielo', 'Ice'), shock: L2('Rayo', 'Lightning'), wet: L2('Agua', 'Water') };
const IMB_COL = { fire: '#ffb030', ice: '#bfe8ff', shock: '#7ab8ff', wet: '#9ad8ff' };
function imbueOf(P) {
  if (!P || !P.equip || !P.equip.weapon) return '';
  if (P.imb && P.imb.until > Date.now() && IMB_CV[P.imb.k]) return P.imb.k;
  if (P._el && G.t - P._el.t < 2.5 && IMB_CV[P._el.k]) return P._el.k;
  const r = P.equip.weapon.fg && P.equip.weapon.fg.rune; return r === 'fuego' ? 'fire' : r === 'hielo' ? 'ice' : r === 'rayo' ? 'shock' : '';
}
// la esencia hace que todos tus golpes lleven el elemento
V33_TICKS.push(() => { const P = G.P; if (P && P.imb && P.imb.until > Date.now()) P._el = { k: P.imb.k, t: G.t, id: 'imb' }; else if (P && P.imb) P.imb = null; });
function drawImbue(e, cx, cy, k) {
  const c = IMB_CV[k]; if (!c || !c.width) return; const [w, h] = IMB_SIZE[k], s = 0.8;
  const off = { down: [7, -8], up: [-7, -10], left: [-9, -8], right: [9, -8] }[e.dir] || [7, -8];
  const atk = e.anim === 'atk'; const a = atk ? dirAng(e.dir) + Math.PI / 2 : 0;
  const x = Math.round(e.x - cx + off[0] + (atk ? Math.cos(dirAng(e.dir)) * 6 : 0)), y = Math.round(e.y - cy + off[1]);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(x, y); ctx.rotate(a);
  ctx.globalAlpha = 0.35; ctx.fillStyle = IMB_COL[k]; ctx.beginPath(); ctx.ellipse(0, -h * s / 2, w * s * 0.9, h * s * 0.6, 0, 0, 7); ctx.fill();
  ctx.globalAlpha = 0.92 + 0.08 * Math.sin(G.t * 12); const fl = Math.floor(G.t * 8) % 2 && k === 'fire';
  if (fl) ctx.scale(-1, 1); ctx.drawImage(c, Math.round(-w * s / 2), Math.round(-h * s - 2 + Math.sin(G.t * 6)), Math.round(w * s), Math.round(h * s)); ctx.restore();
  if (Math.random() < 0.25) part(e.x + off[0] + (Math.random() - 0.5) * 6, e.y + off[1], { z: 8 + Math.random() * 12, vz: k === 'ice' || k === 'wet' ? -6 : 18, life: 0.6, c: IMB_COL[k], s: 1 });
}
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de.apply(this, arguments); try { if (e === G.P && !e.dead && !e.mount) { const k = imbueOf(e); if (k) drawImbue(e, cx, cy, k); } else if (e.type === 'remote' && e.imb && IMB_CV[e.imb]) drawImbue(e, cx, cy, e.imb); } catch (x) { } return r; }; }
// online: los demás ven tu arma imbuida
{ const _f = extraPresence; extraPresence = function (o) { const r = _f.apply(this, arguments); const k = imbueOf(G.P); if (k) o.imb = k; return r; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er.apply(this, arguments); r.imb = typeof pr.imb === 'string' && IMB_CV[pr.imb] ? pr.imb : null; }; }
// Esencias de imbuir (se usan desde el inventario)
for (const [k, n, en, col] of [['fire', 'Esencia de Fuego', 'Fire Essence', '#ff8a2a'], ['ice', 'Esencia de Hielo', 'Ice Essence', '#9ae8ff'], ['shock', 'Esencia de Rayo', 'Lightning Essence', '#6a9aff'], ['wet', 'Esencia de Agua', 'Water Essence', '#3a8aff']])
  it('esencia_imb_' + k, { n: L2(n, en), t: 'cons', stack: true, imbK: k, price: 900, lv: 20, icon: ['potion2', col], rar: 2, d: L2('Imbuye tu arma 5 minutos: cada golpe lleva el elemento y provoca reacciones.', 'Imbues your weapon for 5 minutes: every hit carries the element and triggers reactions.') });
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx], I = s && ITEMS[s.id];
    if (I && I.imbK) { if (!P.equip.weapon) { toast(L2('Equipa un arma primero', 'Equip a weapon first'), 'warn'); return; } P.imb = { k: I.imbK, until: Date.now() + 300000 }; s.q--; if (s.q <= 0) P.inv.splice(idx, 1); uiDirty.inv = uiDirty.hud = true; sfx('potion'); banner(L2('Arma imbuida: ', 'Weapon imbued: ') + IMB_N[I.imbK], L2('5 minutos', '5 minutes')); markDirty(); return; }
    return _ui.apply(this, arguments); }; }
