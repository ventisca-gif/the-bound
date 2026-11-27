// 6.52 · Torre Infinita: lo que Sergio aprobó de las ideas («sí, haz todo eso»).
//  1) 📣 Avisos rápidos en la torre en línea o en equipo: «¡Ayuda!», «¡Aquí!», «¡A por el jefe!» (sale encima de ti y en
//     el chat del grupo; en equipo los compañeros con IA responden).
//  2) 🪶 Pluma de Fénix: si caes en la torre y nadie puede reanimarte, la pluma te levanta con media vida (una por subida).
//     Sale de los jefes de la torre desde el piso 20 (25 %) y cada 25 pisos de hito.
//  3) 📅 Reto de la semana: subida en solitario con la misma mecánica en todos los pisos (cambia cada semana, igual para
//     todos). Récord semanal propio (no cuenta para el top normal).
//  4) 🏆 Hitos con título y marco del retrato (Bitácora › Logros): pisos 25, 50, 100 y 200 en cualquier modo.
//  5) 🌐 Récord del grupo en línea (piso y con quién) en la sala de la torre.
//  6) 🎵 Papel de apoyo: el bardo reanima el doble de rápido y, al superar un piso en equipo, cura a sus compañeros.
it('pluma_fenix', { n: L2('Pluma de Fénix', 'Phoenix Feather'), t: 'mat', stack: true, price: 0, icon: ['wing', '#ff8a2a'], rar: 5, d: L2('Torre Infinita: si caes y nadie puede reanimarte, te levanta con media vida (una por subida). Sale de los jefes de la torre desde el piso 20 y cada 25 pisos.', 'Infinite Tower: if you fall and nobody can revive you, it gets you up with half HP (one per climb). Drops from tower bosses from floor 20 and every 25 floors.') });
function ti2St() { const S = tiSave(); S.top = S.top | 0; if (!S.wk || typeof S.wk !== 'object') S.wk = { w: 0, best: 0 }; return S; }

// ---------- 1) avisos rápidos ----------
const TI_PING = [['🆘', L2('¡Ayuda!', 'Help!')], ['📍', L2('¡Aquí!', 'Over here!')], ['👑', L2('¡A por el jefe!', 'Go for the boss!')]];
let TI_PINGT = 0;
function tiPingBtn() { let b = $('#tiPing'); const on = typeof TI !== 'undefined' && TI && (TI.mode === 'online' || TI.mode === 'team') && G.map && G.map.id === TI_MAP;
  if (!on) { if (b) b.hidden = true; const m = $('#tiPingM'); if (m) m.hidden = true; return; }
  if (!b) { b = document.createElement('button'); b.id = 'tiPing'; b.className = 'bitbtn'; b.title = L2('Aviso rápido', 'Quick call'); b.innerHTML = '📣'; b.style.cssText = 'top:auto;bottom:calc(9.5em + env(safe-area-inset-bottom,0px));left:auto;right:calc(13.5em + env(safe-area-inset-right,0px));font-size:1.1em';
    const m = document.createElement('div'); m.id = 'tiPingM'; m.hidden = true; m.style.cssText = 'position:absolute;bottom:calc(12em + env(safe-area-inset-bottom,0px));right:calc(10em + env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:.3em;z-index:9';
    m.innerHTML = TI_PING.map(([ic, t], i) => `<button class="btn sm" data-tp="${i}">${ic} ${t}</button>`).join('');
    $('#hud').appendChild(b); $('#hud').appendChild(m); b.onclick = () => { m.hidden = !m.hidden; sfx('ui'); };
    m.querySelectorAll('[data-tp]').forEach(x => x.onclick = () => { m.hidden = true; tiPing(+x.dataset.tp); }); }
  b.hidden = false; }
function tiPing(i) { const P = G.P, [ic, t] = TI_PING[i] || TI_PING[0]; if (G.t - TI_PINGT < 1.5) return; TI_PINGT = G.t;
  if (typeof netChat === 'function' && TI.mode === 'online') netChat(ic + ' ' + t); else { P.chat = ic + ' ' + t; P.chatT = G.t; }
  addFx({ type: 'ring', x: P.x, y: P.y, r: 26, dur: 0.6, col: i === 0 ? '#ff5a5a' : i === 1 ? '#5ae0ff' : '#ffd040' }); sfx('ui');
  if (TI.mode === 'team' && typeof HUNT !== 'undefined') { const a = HUNT.allies.find(q => !q.down && !q.remove); if (a) setTimeout(() => { a.chat = pick([L2('¡Voy!', 'On my way!'), L2('¡Entendido!', 'Got it!'), L2('¡Cuenta conmigo!', 'Count on me!')]); a.chatT = G.t; }, 500);
    // «¡Aquí!»: el equipo se reagrupa a tu lado; «¡A por el jefe!»: todos usan su poder especial
    if (i === 1) for (const q of HUNT.allies) if (!q.down && !q.remove && dist2(q.x, q.y, P.x, P.y) > 60 * 60) { q.x = P.x + (Math.random() - 0.5) * 30; q.y = P.y + 14; }
    if (i === 2) for (const q of HUNT.allies) if (!q.down) q.pcd = Math.min(q.pcd || 0, 0.3); } }
V33_TICKS.push(() => { try { tiPingBtn(); } catch (e) { } });

// ---------- 2) Pluma de Fénix ----------
hookBefore('tiEnd', why => { const P = G.P; if (why !== 'dead' || !TI || TI.fenix || !countItem('pluma_fenix')) return;
  takeItem('pluma_fenix', 1);
  TI.fenix = 1; P.downed = null; if (typeof downUI === 'function') downUI(true); P.dead = false; P.hp = Math.round(P.S.maxhp * 0.5); P.ifr = 3; setAnim(P, 'idle');
  addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.9, col: '#ff8a2a' }); burst(P.x, P.y - 12, 40, { sp: 70, up: 90, g: -30, life: 1.2, c: ['#ff8a2a', '#ffd040', '#ffffff'] }); sfx('level');
  banner('🪶 ' + L2('Pluma de Fénix', 'Phoenix Feather'), L2('¡Renaces de tus cenizas! (una por subida)', 'You rise from your ashes! (one per climb)')); markDirty(true); return HOOK_SKIP; });
hookAfter('killMob', (r, m) => { try { if (!m || !m.ti || !m.boss || !TI || TI.floor < 20 || Math.random() >= 0.25) return; setTimeout(() => { giveItem('pluma_fenix', 1, true); toast('🪶 ' + L2('Pluma de Fénix', 'Phoenix Feather'), 'loot', 5); }, 0); } catch (e) { } });

// ---------- 3) reto de la semana ----------
const tiWkMod = () => TI_MOD_K[(typeof FW_WEEK === 'function' ? FW_WEEK() : Math.floor(Date.now() / 6048e5)) % TI_MOD_K.length];
hookAfter('tiModFor', () => { if (typeof TI !== 'undefined' && TI && TI.mode === 'semana') return tiWkMod(); });
hookAround('tiCleared', (next, ...a) => { if (!TI || TI.mode !== 'semana') return next(...a);
  const S = ti2St(), b4 = S.best4, f = TI.floor; TI.mode = 'team'; try { next(...a); } finally { TI.mode = 'semana'; S.best4 = b4; }
  const w = typeof FW_WEEK === 'function' ? FW_WEEK() : 0; if (S.wk.w !== w) S.wk = { w, best: 0 }; if (f > S.wk.best) { S.wk.best = f; toast('📅 ' + L2('Récord de la semana: piso ', 'Weekly record: floor ') + f, 'quest', 4); } markDirty(true); });

// ---------- 4) hitos con título y marco ----------
const TI_HITOS = [[25, 't_ti_promesa', L2('Promesa de la Torre', 'Tower Hopeful'), 'plata', null], [50, 't_ti_veterana', L2('Veterano de la Torre', 'Tower Veteran'), 'oro', 'torre'], [100, 't_ti_leyenda', L2('Leyenda de la Torre', 'Tower Legend'), 'arcoiris', 'abismo'], [200, 't_ti_cima', L2('Cima Infinita', 'Infinite Summit'), 'arcoiris', 'arcoiris']];
if (typeof BIT_FR !== 'undefined') { BIT_FR.torre = [L2('Torre', 'Tower'), '#9a6ac8']; BIT_FR.abismo = [L2('Abismo', 'Abyss'), '#ff8a2a']; }
if (typeof BIT_ACH !== 'undefined') for (const [f, tid, tn, st, fr] of TI_HITOS) {
  const aid = 'a_ti_' + f, rew = { t: tid, g: f * 2000 }; if (fr) rew.fr = fr;
  BIT_ACH.push([aid, '♾', L2('Torre Infinita: piso ', 'Infinite Tower: floor ') + f, L2('Supera el piso ', 'Clear floor ') + f + L2(' de la Torre Infinita (cualquier modo).', ' of the Infinite Tower (any mode).'), P => (P.ti && P.ti.top) || 0, f, rew]);
  if (!TITLES.some(t => t[0] === tid)) TITLES.push([tid, tn, st, P => !!(P.bit && P.bit.got && P.bit.got[aid]), L2('Torre Infinita: piso ', 'Infinite Tower: floor ') + f]); TIT_ID[tid] = TITLES.find(t => t[0] === tid); }
hookAfter('tiCleared', () => { try { if (!TI) return; const S = ti2St(), f = TI.floor; if (f > S.top) S.top = f;
  if (f % 25 === 0 && !(S.fx || {})[f]) { S.fx = S.fx || {}; S.fx[f] = 1; giveItem('pluma_fenix', 1, true); toast('🪶 ' + L2('Pluma de Fénix por el piso ', 'Phoenix Feather for floor ') + f, 'loot', 5); }
  if (typeof bitBadge !== 'undefined') bitBadge = true;
  // 5) récord del grupo en línea
  if (TI.mode === 'online') { const n = tioCount(); if (f > (S.bestOn || 0)) { S.bestOn = f; S.bestOnW = [G.P.name].concat(tioPeers().map(r => r.name || '?')).slice(0, 7).map(s => cleanStr(s, 16)); toast('🌐 ' + L2('Récord del grupo: piso ', 'Group record: floor ') + f + ' (' + n + ')', 'quest', 4); } }
  // 6) el bardo cura al equipo al superar un piso
  if (G.P.cls === 'bardo' && typeof HUNT !== 'undefined') for (const a of HUNT.allies) if (!a.remove) { if (a.down) { a.down = false; a.downT = 0; } a.hp = Math.min(a.maxhp, a.hp + Math.round(a.maxhp * 0.35)); floatText(a.x, a.y - 40, '♪ +35 %', '#8aff8a'); }
  markDirty(true); } catch (e) { if (typeof errOnce === 'function') errOnce('ti2clr', e); } });
// el bardo reanima el doble de rápido (amigos en línea y compañeros del equipo)
V33_TICKS.push(() => { const P = G.P; if (!P || P.cls !== 'bardo') return; for (const R of [P.revive, P.tiRev]) if (R && !R.fast) { R.fast = 1; R.t = Math.min(R.t, 1); } });

// ---------- la sala: reto semanal y récords ----------
hookAfter('tiOpen', () => { try { const box = $('#mbody .frame'); if (!box || box.querySelector('#tiGoW')) return; const S = ti2St(), w = typeof FW_WEEK === 'function' ? FW_WEEK() : 0, mk = tiWkMod(), wb = S.wk.w === w ? S.wk.best : 0, have = countItem('pluma_fenix');
  const d = document.createElement('div'); d.innerHTML = `<h4>📅 ${L2('Reto de la semana', 'Weekly challenge')}: ${esc(TI_MODS[mk][0])}</h4><p class="hint">${L2('Subida en solitario con esa mecánica en TODOS los pisos. Cambia cada semana. Récord de esta semana: piso ', 'Solo climb with that mechanic on EVERY floor. Changes every week. This week\'s record: floor ')}<b>${wb}</b> (${L2('no cuenta para el top', 'does not count for the leaderboard')}).</p><div class="row"><button class="btn" id="tiGoW">📅 ${L2('Empezar el reto', 'Start the challenge')}</button></div>
    <p class="hint">🪶 ${L2('Plumas de Fénix', 'Phoenix Feathers')}: <b>${have}</b> · ♾ ${L2('mejor piso (cualquier modo)', 'best floor (any mode)')}: <b>${S.top || 0}</b>${S.bestOn ? ' · 🌐 ' + L2('récord del grupo: piso ', 'group record: floor ') + '<b>' + S.bestOn + '</b> (' + (S.bestOnW || []).map(esc).join(', ') + ')' : ''}</p>`;
  const top = box.querySelector('#tiTop'); box.insertBefore(d, top ? top.previousElementSibling : null); $('#tiGoW').onclick = () => { closeModal(); tiStart(1, 'semana'); }; } catch (e) { if (typeof errOnce === 'function') errOnce('ti2open', e); } });
// el reto se cuenta como en solitario para todo lo demás (caer, salir, premios)
hookAfter('tiStart', () => { if (TI && TI.mode === 'semana') banner('📅 ' + L2('Reto de la semana', 'Weekly challenge'), TI_MODS[tiWkMod()][0]); });
