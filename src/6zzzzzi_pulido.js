// 6.21 · Pulido (Sergio: «haga todo lo que dice de pulir … ordene cosas … pruebe el ritmo de dificultad, quiero que se
// sienta el poder y tu aumento de fuerza»). Solo ganchos y cosas nuevas: no se borra nada.

// 1) Barra roja al crear personaje: «Cannot read properties of undefined (reading 'weapon') · gearTiers».
//    El mímico del Velo (6zyt_velo2) copia el equipo de G.P al preparar su dibujo, y en el título/creación G.P aún no
//    tiene equipo. Sin equipo = sin armadura y arma de nivel 1 (lo mismo que dibuja el juego a un personaje nuevo).
hookAround('gearTiers', (next, P) => P && P.equip ? next(P) : { weapon: 1, head: 0, body: 0, legs: 0, feet: 0, ws: undefined });

// 2) Inicio tranquilo: al crear personaje salían a la vez «Sello de viaje», «prosperidad · pagan bien: Seda ×2,1»,
//    «Pueblo del día» e «Historia nueva» encima de la primera misión. Hasta terminar «Despertar» (q1) se guardan y salen
//    después, de uno en uno. Lo de la misión, los avisos de combate y los errores salen siempre.
const QUIET_Q = [];
function quietStart() { const P = G.P; return !!(P && P.quests && P.quests.done && !P.quests.done.q1 && (P.lv || 1) < 4); }
const QUIET_TOAST = /^(📮|🏘|📜)/, QUIET_BANNER = /Pueblo del día|Town of the day|Historia nueva|New story/;
hookBefore('toast', (msg, kind) => { if (quietStart() && kind !== 'quest' && QUIET_TOAST.test(String(msg || ''))) { if (QUIET_Q.length < 6) QUIET_Q.push(['t', msg, kind]); return HOOK_SKIP; }
  if (quietStart() && kind === 'quest' && /^(📜|📮)/.test(String(msg || ''))) { if (QUIET_Q.length < 6) QUIET_Q.push(['t', msg, kind]); return HOOK_SKIP; } });
hookBefore('banner', (a, b) => { if (quietStart() && QUIET_BANNER.test(String(a || ''))) { if (QUIET_Q.length < 6) QUIET_Q.push(['b', a, b]); return HOOK_SKIP; } });
let QUIET_T = 0;
V33_TICKS.push(() => { if (!QUIET_Q.length || quietStart() || G.t < QUIET_T) return; const [k, a, b] = QUIET_Q.shift(); QUIET_T = G.t + 4; if (k === 't') toast(a, b, 5); else banner(a, b); });

// 3) Sentir el poder. Medido (tools: héroe con el mejor equipo de su nivel, media de las clases, monstruo medio):
//    subir de nivel apenas se notaba contra un monstruo concreto. A nivel 500, con 60 niveles más, seguías necesitando
//    16,8 golpes (19,9 a su nivel); a nivel 100, 1,8 (3). Ahora, contra monstruos y jefes de nivel MÁS BAJO que tú:
//    +1,5 % de daño por nivel de ventaja (máx. +75 % con 50 niveles) y −1 % de daño recibido por nivel (máx. −50 %).
//    Contra monstruos de tu nivel o más fuertes no cambia nada. El PvP no se toca (los golpes de otro jugador no traen mob).
const LVADV = { dmg: 0.015, dmgMax: 0.75, red: 0.01, redMax: 0.5 };
function lvAdvantage(P, mlv) { const d = (P && P.lv || 0) - (mlv || 0); return d > 0 ? d : 0; }
hookAround('hitMob', (next, m, base, src) => {
  const P = G.P, d = m && m.type === 'mob' && !m.crewRival ? lvAdvantage(P, m.lv) : 0;
  return next(m, d ? base * (1 + Math.min(LVADV.dmgMax, d * LVADV.dmg)) : base, src);
});
hookAround('hurtPlayer', (next, base, src) => {
  const s = src || {}, mob = s.type === 'mob' ? s : s.dawnReto && s.dawnReto.type === 'mob' ? s.dawnReto : s.mid ? s : null;
  const d = mob && !s.pvp && !mob.crewRival ? lvAdvantage(G.P, mob.lv || s.lv) : 0;
  return next(d ? base * (1 - Math.min(LVADV.redMax, d * LVADV.red)) : base, src);
});

// 4) Ritmo de nivel alto. A su nivel y con el mejor equipo, un monstruo normal pedía ~8 golpes a nivel 300 pero ~20 a
//    nivel 500-600, y tú aguantabas solo ~12 de sus golpes: cuanto más subías, más lento y frágil te sentías.
//    Monstruos normales (no jefes) desde nivel 450: la vida baja poco a poco hasta ×0,65 a nivel 500 y el ataque hasta
//    ×0,85. Afecta a todos los monstruos normales de ese nivel (también los marines y piratas del Mar de Dawn). Los jefes
//    (DAWN_RETO, BOSSES) no cambian.
const HILV = { from: 450, to: 500, hp: 0.65, atk: 0.85 };
hookAfter('mobStats', (s, def, lv, boss) => {
  if (boss || !s || !(lv > HILV.from)) return;
  const k = Math.min(1, (lv - HILV.from) / (HILV.to - HILV.from));
  s.hp = Math.max(1, Math.round(s.hp * (1 - (1 - HILV.hp) * k))); s.atk = Math.max(1, Math.round(s.atk * (1 - (1 - HILV.atk) * k)));
  return s;
});
