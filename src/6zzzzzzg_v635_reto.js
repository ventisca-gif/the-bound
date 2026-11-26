// 6.35 · Los enemigos de tu nivel ya hacen daño y armaduras con calidad (Sergio, tras la prueba de daño de la 6.34:
// «sube el daño de jefes, súper jefes y enemigos, es justo; seguimos siendo fuertes, pero ahora sí nos pueden hacer daño,
// porque tenemos habilidades que nos recuperan vida» y «a todas las armaduras, 1 % o 10 % de que salga una mejor; en el
// inventario buena, mala o normal; la buena da una ventaja pequeña, sin exagerar»).
// 1) Daño AL JUGADOR (no a aliados, no PvP, no duelos de la tripulación): monstruos ×1,6, jefes ×1,8, súper jefes ×2,2.
//    Sube poco a poco de nivel 15 a 60 para no endurecer el principio. Los jefes del Mar de Dawn ya tenían su reto
//    (DAWN_RETO, ×1,7-2,2): no se les suma el de jefe. El origen es el monstruo que pega si llega en `src`; si no (golpes
//    de patrón de jefe), el jefe vivo más cercano.
// 2) Calidad de armadura (t 'armor'): al conseguir una (botín, Herrería, tienda, misión) se tira: Mala 12 % (−5 %),
//    Normal 77 %, Buena 10 % (+8 %), Excelente 1 % (+15 %) a su defensa y vida. Se guarda en el objeto (`ql`), se ve en el
//    inventario (color y etiqueta) y se conserva al equiparla. Las que ya tenías son Normales.
const RETO = { mob: 0.6, boss: 0.8, sup: 1.2, lv0: 15, lv1: 60 };
function retoRamp() { const L = (G.P && G.P.lv) || 1; return Math.max(0, Math.min(1, (L - RETO.lv0) / (RETO.lv1 - RETO.lv0))); }
function retoSrcMob(s) { if (s && s.type === 'mob') return s; if (s && s.dawnReto && s.dawnReto.type === 'mob') return s.dawnReto;
  const P = G.P, mid = (G.map && G.map.id) || 'world'; let b = null, bd = 450 * 450; for (const m of G.ents) if (m.type === 'mob' && m.boss && !m.dying && m.hp > 0 && (m.map || 'world') === mid) { const d = dist2(m.x, m.y, P.x, P.y); if (d < bd) { bd = d; b = m; } } return b; }
function retoMul(src) { const s = src || {}; if (s.pvp || (typeof DUEL !== 'undefined' && DUEL) || (typeof CREW_DUEL !== 'undefined' && CREW_DUEL)) return 1;
  const m = retoSrcMob(s); if (m && m.crewRival) return 1; const r = retoRamp(); if (!r) return 1;
  if (m && m.boss) { if (typeof DAWN_RETO !== 'undefined' && DAWN_RETO[m.mid]) return 1; return 1 + r * (typeof isSuper === 'function' && isSuper(m) ? RETO.sup : RETO.boss); }
  return 1 + r * RETO.mob; }
hookAround('hurtPlayer', (next, base, src, ...a) => next(base * retoMul(src), src, ...a));

// ---------- calidad de armadura ----------
const ARMQ = [['mala', 0.12, 0.95, L2('Mala', 'Poor'), '#b07a6a'], ['normal', 0.77, 1, L2('Normal', 'Normal'), '#c8c0b0'], ['buena', 0.10, 1.08, L2('Buena', 'Good'), '#7ae07a'], ['exc', 0.01, 1.15, L2('Excelente', 'Excellent'), '#ffd040']];
const armqOf = k => ARMQ.find(q => q[0] === k) || ARMQ[1];
function armqRoll() { let r = Math.random(); for (const q of ARMQ) { if (r < q[1]) return q[0]; r -= q[1]; } return 'normal'; }
const armqTag = k => { const q = armqOf(k); return q[0] === 'normal' ? '' : `<span class="arq" style="color:${q[4]}">${q[3]} ${q[2] > 1 ? '+' : ''}${Math.round((q[2] - 1) * 100)} %</span>`; };
// al conseguir una armadura: las casillas nuevas sin calidad la reciben
hookBefore('giveItem', (id) => { const it = ITEMS[id]; if (it && it.t === 'armor' && G.P) G.P.__arqN = G.P.inv.length; });
hookAfter('giveItem', (r, id) => { const P = G.P, it = ITEMS[id]; if (!r || !it || it.t !== 'armor' || !P || P.__arqN === undefined) return; const from = P.__arqN; delete P.__arqN;
  for (let i = from; i < P.inv.length; i++) { const s = P.inv[i]; if (s && s.id === id && !s.ql) { s.ql = armqRoll(); if (s.ql !== 'normal') { const q = armqOf(s.ql); toast((q[2] > 1 ? '✨ ' : '') + it.n + ' · ' + L2('calidad ', 'quality ') + q[3] + ' (' + (q[2] > 1 ? '+' : '') + Math.round((q[2] - 1) * 100) + ' %)', q[2] > 1 ? 'quest' : 'info', 4); } } } });
// se conserva al equiparla (equipFromInv crea un objeto nuevo con id y up)
hookAround('equipFromInv', (next, idx, ...a) => { const P = G.P, s = P && P.inv[idx], ql = s && s.ql, id = s && s.id, slot = s && ITEMS[s.id] && ITEMS[s.id].slot; const r = next(idx, ...a);
  if (ql && slot && P.equip[slot] && P.equip[slot].id === id && !P.equip[slot].ql) { P.equip[slot].ql = ql; calcStats(P); } return r; });
// efecto en las estadísticas
hookAfter('calcStats', (r, P) => { if (!P || !P.S || !P.equip) return; let dd = 0, dh = 0;
  for (const sl in P.equip) { const e = P.equip[sl]; if (!e || !e.ql || e.ql === 'normal') continue; const it = ITEMS[e.id]; if (!it || it.t !== 'armor') continue; const k = armqOf(e.ql)[2] - 1, up = 1 + 0.08 * (e.up || 0);
    dd += (it.def || 0) * up * k; dh += (it.hpB || 0) * up * k; }
  if (dd || dh) { P.S.def = Math.max(0, Math.round(P.S.def + dd)); P.S.maxhp = Math.max(1, Math.round(P.S.maxhp + dh)); if (P.hp > P.S.maxhp) P.hp = P.S.maxhp; } });
// en el inventario: etiqueta en el detalle y puntito en la casilla
// renderPanel guarda renderInv en una tabla al cargar, así que se decora después de renderPanel (pestaña inventario)
hookAfter('renderPanel', () => { try { const P = G.P, B = typeof panelTab !== 'undefined' && panelTab === 'inv' ? $('#panel') : null; if (!B || !P) return;
  for (const b of B.querySelectorAll('.slot[data-i]')) { const s = P.inv[+b.dataset.i]; if (s && s.ql && s.ql !== 'normal' && !b.querySelector('.arqd')) b.insertAdjacentHTML('beforeend', `<i class="arqd" style="background:${armqOf(s.ql)[4]}"></i>`); }
  const s = P.inv[invSel], it = s && ITEMS[s.id]; if (it && it.t === 'armor') { const h = B.querySelector('.ihead small'); if (h && !h.querySelector('.arq')) h.insertAdjacentHTML('beforeend', ' · ' + (armqTag(s.ql || 'normal') || `<span class="arq">${L2('Calidad Normal', 'Normal quality')}</span>`)); } } catch (e) { } });
{ const st = document.createElement('style'); st.textContent = '.slot{position:relative}.slot .arqd{position:absolute;left:3px;bottom:3px;width:.5em;height:.5em;border-radius:50%;box-shadow:0 0 0 1px #000}.arq{font-weight:bold}'; document.head.appendChild(st); }
if (typeof GSIS !== 'undefined') GSIS.unshift(['reto635', '⚔ ' + L2('Daño de los enemigos y calidad de armaduras', 'Enemy damage and armour quality'), () => [
  L2('Desde la 6.35 los enemigos de tu nivel sí hacen daño: monstruos ×1,6, jefes ×1,8 y súper jefes ×2,2 (sube poco a poco de nivel 15 a 60). Usa tus habilidades de cura, escudo y defensa, pociones y esquiva.', 'Since 6.35 enemies of your level really hurt: monsters ×1.6, bosses ×1.8 and super bosses ×2.2 (ramps up from level 15 to 60). Use your heal, shield and defence skills, potions and dodging.'),
  L2('Cada armadura que consigues tiene calidad: Mala (12 %, −5 %), Normal (77 %), Buena (10 %, +8 %) o Excelente (1 %, +15 %) a su defensa y vida. Se ve en el inventario con un puntito de color y en su detalle.', 'Every armour you get has a quality: Poor (12%, −5%), Normal (77%), Good (10%, +8%) or Excellent (1%, +15%) to its defence and HP. It shows in the bag with a coloured dot and in its details.')
], () => null]);
