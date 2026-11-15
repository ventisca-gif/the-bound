// ================= v4.43: ARREGLOS (bloqueo al salir de la mazmorra, retransmisión que se abría sola) y cazadores útiles =================

// 1) Salir de una mazmorra: si se pisaba otra vez la salida mientras cargaba, se llamaba a sí misma sin fin
//    («Maximum call stack size exceeded»). Ahora hay un candado y, si falta el punto de vuelta, sales en la puerta de tu casa.
let DG_LEAVING = 0;
dgLeave = function () { const P = G.P; if (DG_LEAVING > G.t) return; DG_LEAVING = G.t + 2; const R = P.dgRet || { m: 'world', x: NaN, y: NaN }; huntAlliesClear(); HUNT.dg = null; P.dgRet = null;
  transition(() => { let M = R.m === 'world' ? G.world : R.m === 'torre_portales' ? makeTower() : (G.maps[R.m] || (R.m === 'cielo' ? makeSky() : R.m === 'archipielago' ? makeArchi() : R.m === 'velo_roto' ? makeVelo() : G.world)); let x = R.x, y = R.y;
    if (!isFinite(x) || !isFinite(y)) { M = G.world; safeRet(); x = P.retX; y = P.retY; } P.inside = R.inside || null; setMap(M, x, y, 'down'); }); };
{ const _ei = exitInterior; exitInterior = function () { const M = G.map; if (M && CAVES[M.id] && CAVES[M.id].dg) { dgLeave(); return; } if (M && M.tower && DG_LEAVING > G.t) return; return _ei.apply(this, arguments); }; }

// 2) La retransmisión se reabría cada segundo porque su contenido seguía dentro de la ventana cerrada
// (arreglado en 6zyzt_v441.js: solo se refresca si la ventana está abierta)

// 3) Cazadores útiles: pegan según SU nivel y rango (un cazador de más nivel pega mucho más) y aguantan más
huntAtk = function (a) { const P = G.P, lv = hnLv(a.h), rk = hnRank(a.h); return Math.max(1, Math.round((P.S ? P.S.atk : 100) * (0.75 + rk * 0.12) * Math.pow((lv + 20) / ((P.lv || 1) + 20), 1.1))); };
{ const _sp = huntAlliesSpawn; huntAlliesSpawn = function (M) { _sp.apply(this, arguments); const P = G.P; for (const a of HUNT.allies) { const lv = hnLv(a.h); a.maxhp = Math.round((P.S ? P.S.maxhp : 1000) * (1 + hnRank(a.h) * 0.1) * Math.pow((lv + 20) / (P.lv + 20), 0.9)); a.hp = a.maxhp; a.rf = (0.9 + hnRank(a.h) * 0.12) * Math.pow((lv + 20) / (P.lv + 20), 0.5); } huntBars(); }; }
// los cazadores de mucho más nivel no aceptan ir contigo
function hnAccepts(h) { return hnLv(h) <= G.P.lv + 20; }
{ const _ti = tpInvite; tpInvite = function (h) { if (!hnAccepts(h)) { toast(h.name + ': «' + pick([L2('¿Tú? Vuelve cuando tengas más nivel.', 'You? Come back when you\'re stronger.'), L2('No hago de niñera. Sube de rango primero.', 'I don\'t babysit. Rank up first.'), L2('Mi equipo no espera a nadie.', 'My team doesn\'t wait for anyone.')]) + '»', 'warn', 5); return; } return _ti.apply(this, arguments); }; }
huntPick = function () { const P = G.P, sel = (hunt().team || []).map(i => HN[i]).filter(h => h && hnAccepts(h) && !hnBusy(h)); const pool = HN.filter(h => !sel.includes(h) && !hnBusy(h) && hnAccepts(h)).sort((a, b) => Math.abs(hnLv(a) - P.lv) - Math.abs(hnLv(b) - P.lv)); while (sel.length < 3 && pool.length) sel.push(pool.shift()); return sel.slice(0, 3); };

// 4) Escalado por equipo más justo: los cazadores cuentan medio y los hijos un tercio; los jefes +40 % de vida por miembro
teamSize = function () { const P = G.P; let n = 1; try { n += (typeof partyNear === 'function' ? partyNear().length : 0); } catch (e) { } n += G.ents.filter(kd => kd.type === 'kid' && kidAlive(kd) && kidStage(kd.kid) === 2 && kd.map === P.map).length * 0.33; if (HUNT && HUNT.allies) n += HUNT.allies.filter(a => !a.remove && !a.down).length * 0.5; return n; };
teamScale = function (m) { const want = teamSize(); if (Math.abs((m.teamN || 1) - want) < 0.2) return; const prev = m.teamN || 1, hpF = m.boss ? 0.4 : 0.25, atF = m.boss ? 0.12 : 0.08;
  const k0 = 1 + hpF * (prev - 1), k1 = 1 + hpF * (want - 1), a0 = 1 + atF * (prev - 1), a1 = 1 + atF * (want - 1), pct = m.hp / m.maxhp; m.maxhp = Math.round(m.maxhp / k0 * k1); m.hp = Math.max(1, Math.round(m.maxhp * pct)); m.atk = Math.round(m.atk / a0 * a1); m.teamN = want; };
// los jefes de las mazmorras de nivel bajo no son esponjas: menos vida
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const e = _sm.apply(this, arguments); if (e && boss && BOSSES[mid] && BOSSES[mid].dg) { e.hp = e.maxhp = Math.round(e.maxhp * 0.7); } return e; }; }
