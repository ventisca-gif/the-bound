// 6.55 · Torre Infinita: pisos especiales y el jefe Reflejo (ideas aprobadas por Sergio; no existían).
//  - Pisos especiales (12 % de los pisos que no son de jefe, desde el 6; no en línea, para que todos vean lo mismo):
//    💰 tesoro (sin enemigos: Piedras de Mejora), 🛒 tienda (el mercader de la torre cambia piedras por una Pluma de
//    Fénix o una Piedra Superior) y ⚠ trampa (15 s esquivando zonas que caen del techo, sin enemigos).
//  - 🪞 Cada 100 pisos, además del jefe, sale «Tu Reflejo»: un enemigo con tu mismo aspecto.
const TI_SP = { tesoro: ['💰', L2('Piso del tesoro', 'Treasure floor')], tienda: ['🛒', L2('Piso del mercader', 'Merchant floor')], trampa: ['⚠', L2('Piso trampa: ¡esquiva 15 s!', 'Trap floor: dodge for 15 s!')] };
function tiSpecial(f) { if (!TI || TI.mode === 'online' || f < 6 || f % TI_BOSS === 0) return null; const R = new RNG(SEED * 7 + f * 104729 + 3); if (R.f() >= 0.12) return null; return ['tesoro', 'tienda', 'trampa'][R.int(0, 2)]; }
NPCS.ti_tendero = { n: L2('Mercader de la Torre', 'Tower Merchant'), title: L2('Solo acepta piedras', 'Only takes stones'), look: LK({ g: 'm', hair: HAIRS.gris || HAIRS.negro, main: pal(['#1a1030', '#2a1a4a', '#3e2a6a', '#5a408a', '#7a5aaa']) }), lines: [L2('Aquí arriba el oro no vale nada. Las piedras, sí.', 'Up here gold is worthless. Stones are not.')], quests: [] };
const tiShopClear = () => { for (const e of G.ents) if (e.type === 'npc' && e.id === 'ti_tendero') e.remove = true; };
hookBefore('tiEnterFloor', () => { tiShopClear(); if (TI) TI.trap = 0; });
hookBefore('tiEnd', () => { tiShopClear(); if (TI) TI.trap = 0; });
hookBefore('tiSpawn', (M, f) => { const k = tiSpecial(f); if (!k || !TI || TI.spawned) return; TI.spawned = true; TI.sp = k; const P = G.P, cx = (M.w >> 1) * 16 + 8, cy = ((M.h >> 1) - 1) * 16 + 8;
  banner(TI_SP[k][0] + ' ' + TI_SP[k][1], L2('Piso ', 'Floor ') + f); sfx('quest');
  if (k === 'tesoro') { const n = 2 + Math.floor(f / 40), n2 = f >= 30 && Math.random() < 0.5 ? 1 : 0; giveItem('piedra1', n, true); if (n2) giveItem('piedra2', n2, true); addFx({ type: 'ring', x: cx, y: cy, r: 40, dur: 0.8, col: '#ffd040' }); burst(cx, cy, 30, { sp: 70, up: 80, g: 50, life: 1, c: ['#ffd040', '#ffffff'] }); toast('💰 +' + n + ' ' + ITEMS.piedra1.n + (n2 ? ' · +1 ' + ITEMS.piedra2.n : ''), 'loot', 4); }
  if (k === 'tienda') { const e = spawnNPC('ti_tendero', cx, cy - 34, TI_MAP, { face: 'down', wander: 0 }); if (e) { e.chat = L2('¡Pasa, pasa! Cambio piedras.', 'Come in! I trade stones.'); e.chatT = G.t + 1; } TI.shop = {}; }
  if (k === 'trampa') { TI.trap = G.t + 15; TI.trapT = 0; }
  return HOOK_SKIP; });
// trampa: el piso no se supera hasta que pasan los 15 s
hookBefore('tiCleared', () => { if (TI && TI.trap && G.t < TI.trap) return HOOK_SKIP; });
V33_TICKS.push(dt => { if (typeof TI === 'undefined' || !TI || !TI.trap || !G.map || G.map.id !== TI_MAP) return; const P = G.P; if (G.t >= TI.trap) { TI.trap = 0; return; } TI.trapT = (TI.trapT || 0) - (dt || 0.016); if (TI.trapT > 0) return; TI.trapT = Math.max(0.35, 0.8 - (TI.floor || 1) * 0.002);
  const n = 1 + Math.min(3, Math.floor((TI.floor || 1) / 60)); for (let i = 0; i < n; i++) { const x = P.x + (Math.random() - 0.5) * 90, y = P.y + (Math.random() - 0.5) * 70, r = 22 + Math.random() * 10; telegraph({ shape: 'circle', x, y, r, dur: 0.9 });
    setTimeout(() => { const Q = G.P; if (!TI || !TI.trap || Q.dead || G.map.id !== TI_MAP) return; addFx({ type: 'ring', x, y, r, dur: 0.3, col: '#ff6a3a' }); if (Math.hypot(Q.x - x, Q.y - y) < r && !(Q.ifr > 0)) { const d = Math.round(Q.S.maxhp * 0.1); Q.hp -= d; Q.flash = 0.15; floatText(Q.x, Q.y - 34, d, '#ff6a3a'); if (Q.hp <= 0) playerDie(); } }, 900); } });
// tienda
DLG_HOOKS.push((npc, opts) => { try { if (!npc || npc.id !== 'ti_tendero' || !TI || !TI.shop) return; const S = TI.shop;
  const deal = (key, label, cost, give) => { if (S[key]) return; opts.unshift({ label: label + ' · ' + cost + ' ' + ITEMS.piedra1.n, cls: 'quest', icon: ['stone', '#8ad0ff'], fn: () => { if (S[key]) return; if (countItem('piedra1') < cost) { typeText(L2('Te faltan piedras. Vuelve cuando tengas más.', 'You need more stones. Come back with more.')); return; } takeItem('piedra1', cost); S[key] = 1; give(); sfx('coin'); typeText(L2('¡Trato hecho!', 'Deal!')); markDirty(true); } }); };
  deal('fenix', '🪶 ' + ITEMS.pluma_fenix.n, 12, () => giveItem('pluma_fenix', 1, true));
  if (ITEMS.piedra2) deal('sup', '💎 ' + ITEMS.piedra2.n, 6, () => giveItem('piedra2', 1, true)); } catch (e) { } });
// 🪞 Tu Reflejo cada 100 pisos
const TI_REF = 'ti_reflejo';
if (!Object.prototype.hasOwnProperty.call(MOBS, TI_REF)) Object.defineProperty(MOBS, TI_REF, { value: { n: L2('Tu Reflejo', 'Your Reflection'), art: ['hum', 'espadachin_portal'], reg: ['x'], lv: [1, 100000], hp: 30, atk: 1.6, def: 1.3, spd: 70, ai: 'aggro', fam: 'reflejo', drops: [] }, enumerable: false, configurable: true, writable: true });
hookAfter('tiSpawn', (r, M, f) => { try { if (!TI || f % 100 !== 0 || TI.refF === f) return; TI.refF = f; const P = G.P, cx = (M.w >> 1) * 16 + 8, cy = ((M.h >> 1) - 1) * 16 + 8;
  const m = spawnMob(TI_REF, tiLvOf(f), cx + 40, cy - 10, 0, null, false); if (!m) return; m.map = TI_MAP; m.ti = 1; m.state = 'chase'; m.aggroR = 999; m.name = L2('Tu Reflejo', 'Your Reflection'); m.gold = 0; m.xp = 0; m.elite = 1;
  const nOn = TI.mode === 'online' ? tioCount() : 1; m.tioI = 900 + f; if (nOn > 1) m.hp = m.maxhp = Math.round(m.maxhp * (1 + 0.35 * (nOn - 1)));
  try { m.atlas = playerAtlas(P); } catch (e) { } addFx({ type: 'ring', x: m.x, y: m.y, r: 30, dur: 0.8, col: '#c8e0ff' }); m.chat = L2('¿Te reconoces?', 'Do you recognise yourself?'); m.chatT = G.t; toast('🪞 ' + L2('¡Tu Reflejo ha salido del espejo!', 'Your Reflection stepped out of the mirror!'), 'warn', 4); } catch (e) { if (typeof errOnce === 'function') errOnce('tiRef', e); } });
// los jefes nombran la novedad en la Lupa de la torre
if (typeof GSIS !== 'undefined') { const g = GSIS.find(x => x[0] === 'n_torre_inf'); if (g) { const f0 = g[2]; g[2] = () => f0().concat([L2('Pisos especiales (no en línea): 💰 tesoro (piedras sin luchar), 🛒 mercader (cambia piedras por una Pluma de Fénix o una Piedra Superior) y ⚠ trampa (esquiva 15 s). Cada 100 pisos, además del jefe, sale 🪞 Tu Reflejo, con tu mismo aspecto.', 'Special floors (not online): 💰 treasure (stones without fighting), 🛒 merchant (trades stones for a Phoenix Feather or a Superior Stone) and ⚠ trap (dodge for 15 s). Every 100 floors, besides the boss, 🪞 Your Reflection appears, with your own look.')]); } }
