// 6.55 · Vida y calidad de vida (ideas aprobadas por Sergio; no existían):
//  - 🍲 Devolver la visita: cuando un vecino te visita en casa, en los 3 días siguientes puedes encontrarlo de 18:00 a
//    21:00 junto a la plaza de cualquier ciudad y cenar en su casa: vida y maná llenos, +8 de amistad, +2 de reputación
//    y algo de comer para llevar.
//  - 💀 Registro de caídas: al caer, un aviso dice qué te derrotó y cuánto te quitó el último golpe; las últimas 10
//    caídas quedan en Bitácora › 💀 Caídas con un consejo.
//  - ⚖ Comparar equipo: en el inventario, al tocar una pieza se ven las diferencias reales (ataque, defensa, vida,
//    maná, crítico) frente a lo que llevas puesto, en verde o rojo.
SAVEKEYS.push('v655v', 'deaths');
function v655v() { const P = G.P; return P.v655v && typeof P.v655v === 'object' ? P.v655v : (P.v655v = {}); }
// ---------- 🍲 devolver la visita ----------
DLG_HOOKS.push((npc, opts) => { try { if (!npc || !npc.v74vis) return; const S = v655v(); if (!S.vb || S.vb.d !== calDay()) { S.vb = { id: npc.id, d: calDay() }; markDirty(); } } catch (e) { } });
const v655Pend = () => { const S = G.P && v655v(); return S && S.vb && calDay() > S.vb.d && calDay() <= S.vb.d + 3 ? S.vb : null; };
let v655vT = 0;
V33_TICKS.push(dt => { v655vT -= dt || 0.016; if (v655vT > 0) return; v655vT = 1; try { const M = G.map; if (!M || !V74_CITY[M.id] || M.id === 'machupicchu') return; const a = v75Anchor(M); if (!a) return; const h = hourNow(), vb = v655Pend();
  for (const id of ['v74_vecina', 'v74_vecino']) { const e = v75Temp(M, id, a.x + 56, a.y + 30, !!(vb && vb.id === id && h >= 18 && h < 21), { wander: 0 }); if (e && vb && vb.id === id) e.v655 = 1; } } catch (e) { if (typeof errOnce === 'function') errOnce('v655v', e); } });
DLG_HOOKS.push((npc, opts) => { try { const vb = v655Pend(); if (!npc || !vb || npc.id !== vb.id || npc.v74vis || G.map.home) return;
  opts.unshift({ label: '🍲 ' + L2('Cenar en su casa', 'Have dinner at their place'), cls: 'quest', icon: ['food', 4], fn: () => { const S = v655v(), P = G.P; if (!S.vb || S.vb.id !== npc.id) return; S.vb = null;
    P.hp = P.S.maxhp; if (P.S.maxmp) P.mp = P.S.maxmp; if (typeof frOf === 'function') { const f = frOf(npc.id); f.p = Math.min(100, (f.p || 0) + 8); } if (V74_CITY[G.map.id]) v75Rep(G.map.id, 2);
    const g = pick((typeof V74_GIFT !== 'undefined' ? V74_GIFT : [['pan', 2]]).filter(x => ITEMS[x[0]])); if (g) giveItem(g[0], g[1]); sfx('quest'); burst(P.x, P.y - 20, 20, { sp: 50, up: 60, g: 40, life: 1, c: ['#ffd0a0', '#ffffff'] });
    typeText(L2('¡Qué alegría que vinieras! Siéntate, que la sopa está calientita. Llévate esto para tu familia.', 'So glad you came! Sit down, the soup is hot. Take this for your family.')); markDirty(true); uiDirty.hud = true; } }); } catch (e) { } });
if (typeof LUPA_CIU !== 'undefined') { LUPA_CIU.push(['visita655', '🍲 ' + L2('Devolver la visita', 'Return the visit'), () => [L2('Cuando la vecina Marta o el vecino Tomás te visitan en casa, en los 3 días siguientes te esperan de 18:00 a 21:00 junto a la plaza de cualquier ciudad. Habla con ellos y cena en su casa: vida y maná llenos, +8 de amistad, +2 de reputación y comida para llevar.', 'When neighbour Marta or Tomás visits you at home, for the next 3 days they wait for you 18:00-21:00 by the square of any city. Talk to them and have dinner at their place: full HP and mana, +8 friendship, +2 reputation and food to take home.'), (() => { const vb = G.P && v655Pend(); return vb ? '⏳ ' + L2('Tienes una visita pendiente: ', 'You have a pending visit: ') + (NPCS[vb.id] ? NPCS[vb.id].n : '?') : L2('Ahora no tienes visitas pendientes.', 'No pending visits right now.'); })()], () => null]);
  const hoy = LUPA_CIU.find(s => s[0] === 'hoy'); if (hoy) { const f = hoy[2]; hoy[2] = () => { const out = f(); try { const vb = v655Pend(); if (vb) out.push('🍲 ' + (NPCS[vb.id] ? NPCS[vb.id].n : '') + L2(' te espera para cenar (18:00-21:00, junto a la plaza de cualquier ciudad).', ' is waiting for you for dinner (18:00-21:00, by the square of any city).')); } catch (e) { } return out; }; } }

// ---------- 💀 registro de caídas ----------
let V655_HIT = null;
hookAround('hurtPlayer', (next, base, src, ...a) => { const P = G.P, h0 = P ? P.hp : 0; const r = next(base, src, ...a); try { const d = h0 - P.hp; if (d > 0) { const m = (src && src.name) ? src : (typeof CUR_MOB !== 'undefined' && CUR_MOB) || null; V655_HIT = { n: (m && m.name) || (src && src.n) || L2('un ataque', 'an attack'), lv: m && m.lv, boss: !!(m && m.boss), d: Math.round(d), t: G.t }; } } catch (e) { } return r; });
hookBefore('playerDie', () => { try { const P = G.P; if (!P || P.dead || P.downed) return; const H = V655_HIT && G.t - V655_HIT.t < 6 ? V655_HIT : null, n = H ? H.n : L2('algo que no se vio venir', 'something you didn\'t see coming');
  P.deaths = Array.isArray(P.deaths) ? P.deaths : []; P.deaths.unshift({ n: cleanStr(n, 40), lv: H && H.lv || 0, b: H && H.boss ? 1 : 0, d: H ? H.d : 0, m: (G.map && (G.map.name || G.map.id)) || '', pl: P.lv, t: Date.now() }); P.deaths.length = Math.min(P.deaths.length, 10);
  toast('💀 ' + L2('Te derrotó: ', 'Defeated by: ') + n + (H ? ' · ' + L2('último golpe ', 'last hit ') + fmt(H.d) : ''), 'warn', 5); markDirty(); } catch (e) { } });
function v655Tip(x) { if (x.b) return L2('Es un jefe: aléjate de las zonas rojas y lleva pociones.', 'It\'s a boss: stay out of red zones and bring potions.'); if (x.lv && x.lv > x.pl + 4) return L2('Era de más nivel que tú: sube de nivel o mejora tu equipo.', 'It was higher level than you: level up or improve your gear.'); if (x.d > 0) return L2('Mejora tu defensa (armadura, piedras de mejora) o esquiva con el corredor.', 'Improve your defence (armour, upgrade stones) or dodge with the runner.'); return L2('Revisa tu equipo en la herrería.', 'Check your gear at the smithy.'); }
if (typeof BIT_TABS !== 'undefined') { BIT_TABS.push(['caidas', '💀', L2('Caídas', 'Falls')]);
  BIT_RENDER.caidas = () => { const D = (G.P && G.P.deaths) || []; if (!D.length) return `<p class="hint">${L2('No has caído desde la versión 6.55. ¡Sigue así!', 'You haven\'t fallen since version 6.55. Keep it up!')}</p>`;
    return `<p class="hint">${L2('Tus últimas 10 caídas: qué te derrotó y un consejo.', 'Your last 10 falls: what defeated you and a tip.')}</p><div class="slist">${D.map(x => { const dt = new Date(x.t); return `<div class="srow"><div class="sn"><b>💀 ${esc(x.n)}${x.lv ? ' · ' + L2('Nv. ', 'Lv. ') + x.lv : ''}</b><small>${dt.toLocaleDateString()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')} · ${esc(String(x.m))} · ${L2('tú: Nv. ', 'you: Lv. ')}${x.pl}${x.d ? ' · ' + L2('último golpe ', 'last hit ') + fmt(x.d) : ''}</small><small class="hint">💡 ${esc(v655Tip(x))}</small></div></div>`; }).join('')}</div>`; }; }

// ---------- ⚖ comparar equipo ----------
const V655_CMP = new Map();
function v655Cmp(s, it) { const P = G.P, slot = it.slot; if (!slot || !(slot in P.equip)) return null; const key = s.id + ':' + (s.up || 0) + ':' + (s.q2 || '') + '|' + JSON.stringify(P.equip[slot] || null) + '|' + P.lv; if (V655_CMP.has(key)) return V655_CMP.get(key);
  const keep = { hp: P.hp, mp: P.mp, eq: P.equip[slot], S: P.S }; let a = null, b = null;
  try { b = Object.assign({}, P.S); P.equip[slot] = Object.assign({}, s); calcStats(P); a = Object.assign({}, P.S); } catch (e) { a = null; } finally { P.equip[slot] = keep.eq; try { calcStats(P); } catch (e) { } P.hp = Math.min(keep.hp, P.S.maxhp); P.mp = Math.min(keep.mp, P.S.maxmp || keep.mp); }
  const out = a && b ? [['atk', L2('Ataque', 'Attack')], ['def', L2('Defensa', 'Defence')], ['maxhp', L2('Vida', 'HP')], ['maxmp', L2('Maná', 'Mana')], ['crit', L2('Crítico', 'Crit')]].map(([k, n]) => [n, Math.round(((+a[k] || 0) - (+b[k] || 0)) * 10) / 10]).filter(x => x[1]) : null;
  if (V655_CMP.size > 60) V655_CMP.clear(); V655_CMP.set(key, out); return out; }
hookAfter('renderInv', (r, B) => { try { const P = G.P, s = P.inv[invSel], it = s && ITEMS[s.id]; if (!it || !it.slot || (it.t !== 'weapon' && it.t !== 'armor' && it.t !== 'acc')) return; const root = B || document, box = root.querySelector('.invR .stats'); if (!box || root.querySelector('.v655cmp')) return;
  const D = v655Cmp(s, it); if (!D) return; const html = D.length ? D.map(([n, v]) => `<span style="color:${v > 0 ? '#8aff8a' : '#ff7a7a'}">${v > 0 ? '▲ +' : '▼ '}${fmt(v)} ${n}</span>`).join(' · ') : `<span class="hint">${L2('Igual que lo que llevas', 'Same as what you wear')}</span>`;
  box.insertAdjacentHTML('afterend', `<div class="v655cmp" style="font-size:.86em;margin:.2em 0">⚖ ${L2('Si te lo pones', 'If you wear it')}: ${html}</div>`); } catch (e) { if (typeof errOnce === 'function') errOnce('v655cmp', e); } });
