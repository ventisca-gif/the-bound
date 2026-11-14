// ================= v4.40: HIJOS CON HABILIDADES E INVOCACIONES, EQUIPO PROPIO, JEFES QUE ATACAN A TODO EL EQUIPO Y ESCALADO POR GRUPO =================

// =====================================================================================
// ARMAS: la penalización cuenta desde la mejor arma que existe para tu nivel (entre 250 y 300 no hay armas nuevas)
// =====================================================================================
const WTOP = {};
function wTopLv(cls, plv) { const key = cls + ':' + plv; if (WTOP[key] !== undefined) return WTOP[key]; let top = 0; for (const id in ITEMS) { const it = ITEMS[id]; if (it.t === 'weapon' && it.lv && it.lv <= plv && (!it.cls || it.cls === cls) && !it.leg && !it.quest) top = Math.max(top, it.lv); } return WTOP[key] = top || plv; }
wOutgrown = function (P) { const e = P && P.equip && P.equip.weapon, it = e && ITEMS[e.id]; if (!it || !it.lv || it.t !== 'weapon') return 0; return wGapPen(wTopLv(P.cls, P.lv), it.lv); };
wAtLevel = function (P) { const e = P && P.equip && P.equip.weapon, it = e && ITEMS[e.id]; return !!(it && it.t === 'weapon' && it.lv && it.lv >= wTopLv(P.cls, P.lv) - 10); };

// =====================================================================================
// HIJOS (y nietos, bisnietos…): 4 habilidades de su clase como el jugador, se pueden cambiar
// =====================================================================================
function kidSkPool(k) { const L = kidLv(k); return Object.keys(SK).filter(id => { const s = SK[id]; return s.cls === k.cls && s.type === 'act' && (s.req || 1) <= L && s.eff; }).sort((a, b) => (SK[b].req || 0) - (SK[a].req || 0)); }
function kidSkills(k) { if (!k.cls || kidStage(k) < 2) return []; const pool = kidSkPool(k); k.sks = (k.sks || []).filter(id => pool.includes(id)); if (!k.sks.length || (k.sksAuto !== false && k.sks.length < 4)) { for (const id of pool) { if (k.sks.length >= 4) break; if (!k.sks.includes(id)) k.sks.push(id); } } return k.sks.slice(0, 4); }
const KSK = new WeakMap();
function kidCast(e, tgt) { const k = e.kid, now = G.t, cds = KSK.get(e) || {}; KSK.set(e, cds); if ((e.gcd || 0) > now) return false;
  for (const id of kidSkills(k)) { const s = SK[id], f = s.eff; if ((cds[id] || 0) > now) continue; const r = f.r || f.area || 60, far = ['proj', 'volley', 'line', 'beam', 'rain', 'field'].includes(f.k);
    const d = tgt ? Math.hypot(tgt.x - e.x, tgt.y - e.y) : 999; const heal = /heal|song|buff|shield|aura/.test(f.k || '') || f.heal;
    if (!heal && !tgt) continue; if (!heal && d > (far ? 170 : r + 30)) continue;
    cds[id] = now + (s.cd || 6) * 1.2; e.gcd = now + 1.1; const atk = kidAtk(k) * Math.max(1, (f.m || 1.5)) * 1.3; setAnim(e, f.k === 'nova' || heal ? 'cast' : 'atk'); e.loopAnim = false;
    const col = (s.icon && s.icon[1]) || '#ffd040', area = (cx, cy, rr) => { addFx({ type: 'ring', x: cx, y: cy - 8, r: rr, dur: 0.35, col }); for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map && dist2(m.x, m.y, cx, cy) < rr * rr) { hitMob(m, atk, { kid: 1, kidE: e, fire: f.fire }); if (f.burn) m.burn = Math.max(m.burn || 0, 3), m.burnD = atk * 0.1; if (f.slow) m.slow = Math.max(m.slow || 0, f.slow); if (f.freeze) m.freeze = Math.max(m.freeze || 0, f.freeze); } };
    if (f.k === 'summon' || f.k === 'army' || f.k === 'kingsoul') ksumCall(e, f.k !== 'summon');
    else if (heal) { const P = G.P, h = Math.round((P.S ? P.S.maxhp : 500) * 0.08); if (P.S && !P.dead) { P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + fmt(h), '#6aff7a'); } for (const q of G.ents) if (q.type === 'kid' && q.kid && q.kid.follow && q.map === e.map) q.kid.hp = Math.min(kidMaxHp(q.kid), (q.kid.hp || 0) + kidMaxHp(q.kid) * 0.1); burst(e.x, e.y - 12, 12, { sp: 40, up: 50, g: -20, life: 0.8, c: [col, '#ffffff'] }); }
    else if (f.k === 'proj' || f.k === 'volley' || f.k === 'line' || f.k === 'beam') { const n = f.k === 'volley' ? 3 : 1, a0 = Math.atan2(tgt.y - e.y, tgt.x - e.x); for (let i = 0; i < n; i++) spawnProj('p', e.x, e.y - 8, a0 + (i - (n - 1) / 2) * 0.18, { spd: f.spd || 240, dmg: atk, art: f.art || 'orb', life: 0.9, pierce: f.pierce, kidShot: 1, kidE: e }); }
    else if (f.k === 'rain' || f.k === 'field') { for (let i = 0; i < 3; i++) delayKid(0.15 + i * 0.25, () => area(tgt.x + (Math.random() - 0.5) * 30, tgt.y + (Math.random() - 0.5) * 20, 36)); }
    else if (f.k === 'nova' || f.k === 'spin' || f.k === 'slam') area(f.k === 'nova' ? e.x : tgt.x, f.k === 'nova' ? e.y : tgt.y, Math.min(90, r));
    else { area(tgt.x, tgt.y, 30); addFx({ type: 'slash', x: e.x, y: e.y - 8, ang: Math.atan2(tgt.y - e.y, tgt.x - e.x), arc: 2.4, r: 34, dur: 0.25, col }); }
    if (Math.random() < 0.5) floatText(e.x, e.y - 40, s.n, col); return true; }
  return false; }
const KDEL = []; function delayKid(t, fn) { KDEL.push({ t: G.t + t, fn }); }
V33_TICKS.push(() => { for (let i = KDEL.length - 1; i >= 0; i--) if (G.t >= KDEL[i].t) { const d = KDEL.splice(i, 1)[0]; try { d.fn(); } catch (e) { } } });
{ const _uk = updateKid; updateKid = function (e, dt) { const r = _uk.apply(this, arguments); try { const k = e.kid; if (!k || e.fam || e.down || e.scene || !k.cls || kidStage(k) < 2 || !(k.follow || e.explore) || e.map !== G.map.id) return r;
    let tgt = null, bd = 170 * 170; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map && m.state !== 'dummy') { const d = dist2(m.x, m.y, e.x, e.y); if (d < bd) { bd = d; tgt = m; } }
    if (tgt || (k.hp < kidMaxHp(k) * 0.6)) kidCast(e, tgt); } catch (err) { } return r; }; }

// ---------- invocaciones de los hijos invocadores: capturan almas, las guardan o las borran ----------
const KSUM_FALLBACK = ['lobo', 'oso', 'golem', 'esqueleto', 'orco'];
function kidSouls(k) { k.souls = (k.souls || []).filter(s => MOBS[s.mid]); return k.souls; }
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); try { if (src && src.kidE && m && m.hp <= 0 && !m.boss && MOBS[m.mid] && src.kidE.kid && src.kidE.kid.cls === 'invocador' && Math.random() < 0.25) { const k = src.kidE.kid, S = kidSouls(k);
      if (!S.some(s => s.mid === m.mid && s.lv >= m.lv)) { S.push({ mid: m.mid, lv: m.lv, id: Date.now().toString(36) + S.length }); S.sort((a, b) => b.lv - a.lv); if (S.length > 8) S.length = 8; floatText(m.x, m.y - 30, L2('¡Alma capturada!', 'Soul captured!'), '#5ab0ff'); kidLog(k, L2('Capturó el alma de ', 'Captured the soul of ') + MOBS[m.mid].n); } } } catch (e) { } return d; }; }
function ksumCall(e, big) { const k = e.kid, L = kidLv(k), max = L >= 150 ? 3 : L >= 60 ? 2 : 1, S = kidSouls(k), set = (k.soulSet && k.soulSet.length ? k.soulSet.map(id => S.find(s => s.id === id)).filter(Boolean) : S).slice(0, max);
  const list = set.length ? set : [{ mid: KSUM_FALLBACK[Math.min(KSUM_FALLBACK.length - 1, Math.floor(L / 60))], lv: L }];
  for (const q of G.ents) if (q.type === 'ksum' && q.owner === e) q.remove = true;
  list.forEach((s, i) => { const def = MOBS[s.mid] || MOBS.lobo; if (!def) return; const a = i * 2.1, q = { type: 'ksum', owner: e, kid: k, mid: s.mid, def, x: e.x + Math.cos(a) * 18, y: e.y + Math.sin(a) * 12, L: e.L, map: e.map, dir: 'down', anim: 'idle', af: 0, at: 0, cd: 0.5, t: big ? 30 : 22, scale: big ? 1.3 : 1, name: L2('Espíritu de ', 'Spirit of ') + def.n, pow: 0.35 * (1 + Math.min(1, s.lv / Math.max(1, L)) * 0.5) * (big ? 1.4 : 1) };
    q.hum = def.art[0] === 'hum'; q.atlas = soulAtlas(def); G.ents.push(q); burst(q.x, q.y - 10, 12, { sp: 40, up: 40, g: -30, life: 0.8, c: ['#5ab0ff', '#d0f0ff'] }); });
}
function updateKsum(q, dt) { const e = q.owner; q.t -= dt; q.cd -= dt; if (q.t <= 0 || !e || e.remove || e.map !== q.map && !(e.map === G.map.id)) { q.remove = true; burst(q.x, q.y - 10, 8, { sp: 30, up: 30, g: -20, life: 0.5, c: ['#5ab0ff', '#d0f0ff'] }); return; }
  if (q.map !== e.map) { q.map = e.map; q.x = e.x; q.y = e.y; }
  let tgt = null, bd = 160 * 160; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === q.map) { const d = dist2(m.x, m.y, e.x, e.y); if (d < bd) { bd = d; tgt = m; } }
  let tx, ty; if (tgt) { const a = Math.atan2(q.y - tgt.y, q.x - tgt.x); tx = tgt.x + Math.cos(a) * 20; ty = tgt.y + Math.sin(a) * 14; } else { const a = G.t * 0.5 + (q.mid.length); tx = e.x + Math.cos(a) * 24; ty = e.y + Math.sin(a) * 14; }
  const dx = tx - q.x, dy = ty - q.y, L = Math.hypot(dx, dy); if (L > 260) { q.x = e.x; q.y = e.y; } else if (L > 2) { const sp = Math.min(L * 5, 95); q.x += dx / L * sp * dt; q.y += dy / L * sp * dt; }
  if (tgt) { q.dir = dirFromVec(tgt.x - q.x, tgt.y - q.y); if (q.cd <= 0 && Math.hypot(tgt.x - q.x, tgt.y - q.y) < 34) { q.cd = 1.1; if (q.atlas.idx.atk !== undefined) setAnim(q, 'atk'); hitMob(tgt, kidAtk(q.kid) * q.pow * 3, { summon: 1, kid: 1 }); } } else if (L > 3) q.dir = dirFromVec(dx, dy);
  const an = q.anim === 'atk' && q.af < (q.atlas.idx.atk !== undefined ? animN(q, 'atk') - 1 : 0) ? 'atk' : L > 3 ? 'walk' : 'idle'; if (an !== q.anim) setAnim(q, q.atlas.idx[an] !== undefined ? an : 'idle'); stepAnim(q, dt, 8); }
V33_TICKS.push(dt => { for (const q of G.ents) if (q.type === 'ksum' && !q.remove) try { updateKsum(q, dt || 0); } catch (e) { q.remove = true; } });

// ---------- equipo: se equipan lo mejor que encuentran o forjan, aunque supere al tuyo ----------
kidAutoEquip = function (k) { k.equip = k.equip || {}; let ch = 0; const L = kidLv(k);
  for (const s of (k.inv || []).slice()) { const it = ITEMS[s.id]; if (!it || !it.slot || !['weapon', 'head', 'body', 'legs', 'feet'].includes(it.slot) || (it.cls && it.cls !== k.cls) || (it.lv || 1) > L) continue;
    const cur = k.equip[it.slot] && ITEMS[k.equip[it.slot].id], sc = i => (i.tier || 0) * 1000 + (i.lv || 0) * 10 + (i.atk || i.def || 0) / 100;
    if (!cur || sc(it) > sc(cur)) { const old = k.equip[it.slot]; k.equip[it.slot] = s; k.inv = k.inv.filter(q => q !== s); if (old) k.inv.push(old); ch = 1; kidLog(k, L2('Se equipó ' + it.n, 'Equipped ' + it.n)); } }
  if (ch) refreshKidAtlas(k); };
function kidForge(k) { const L = kidLv(k), slots = ['weapon', 'head', 'body', 'legs', 'feet'], s = pick(slots); let best = null;
  for (const id in ITEMS) { const it = ITEMS[id]; if (it.slot !== s || (it.cls && it.cls !== k.cls) || (s === 'weapon' && !it.cls) || (it.lv || 1) > L || it.quest || it.cos || it.leg || it.price <= 0) continue; if (!best || (it.lv || 0) > (best.lv || 0)) best = it; }
  if (!best) return; k.inv = k.inv || []; if (k.inv.length >= 30) k.inv.shift(); k.inv.push({ id: best.id }); kidLog(k, L2('Forjó ', 'Forged ') + best.n); kidAutoEquip(k); }
{ const _ss = kidSimStep; kidSimStep = function (k) { const r = _ss.apply(this, arguments); if (!kidResting(k) && Math.random() < 0.05) kidForge(k); return r; }; }
// su fuerza ya no se queda por debajo de la tuya si suben más: hasta 1,5 veces
kidRatio = function (k) { const P = G.P; return Math.min(1.5, (kidLv(k) + 20) / ((P.lv || 1) + 20)); };
kidGearF = function (k) { const w = k.equip && k.equip.weapon && ITEMS[k.equip.weapon.id]; if (!w) return 0.55; return clamp(0.55 + 0.45 * ((w.lv || 1) + 10) / (kidLv(k) + 10), 0.55, 1.1); };

// ---------- panel del hijo: elegir sus 4 habilidades y sus almas ----------
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid, body = $('#mbody'); if (!k || !body || !k.cls || kidStage(k) < 2 || (e.fam && e.kid !== e.famOf)) return r; const pool = kidSkPool(k), cur = kidSkills(k);
    const box = document.createElement('div'); box.className = 'legBox';
    box.innerHTML = `<h3>✦ ${L2('Habilidades', 'Skills')} (${cur.length}/4)</h3><p class="hint">${L2('Elige hasta 4. Las usa sola en combate según su nivel; las nuevas se añaden solas mientras tenga hueco.', 'Pick up to 4. They use them in combat by themselves based on level; new ones are added automatically while there is room.')}</p><div class="chips">${pool.map(id => `<button class="chip ${cur.includes(id) ? 'on' : ''}" data-ksk="${id}">${iconHTML(SK[id].icon, 16)} ${esc(SK[id].n)}</button>`).join('') || `<i>${L2('Aún ninguna', 'None yet')}</i>`}</div>`
      + (k.cls === 'invocador' ? `<h3>👻 ${L2('Almas', 'Souls')} (${kidSouls(k).length}/8)</h3><p class="hint">${L2('Captura almas al derrotar enemigos. Invoca las marcadas con ★ (o las más fuertes). Hasta 3 a la vez desde nivel 150.', 'Captures souls when defeating enemies. Summons the ★ ones (or the strongest). Up to 3 at once from level 150.')}</p>${kidSouls(k).map(s => `<div class="srow"><div class="sn"><b>${(k.soulSet || []).includes(s.id) ? '★ ' : ''}${esc(MOBS[s.mid].n)}</b><small>${L2('Nv.', 'Lv.')} ${s.lv}</small></div><button class="btn sm" data-kss="${s.id}">★</button><button class="btn sm" data-ksd="${s.id}">${L2('Borrar', 'Delete')}</button></div>`).join('')}` : '');
    body.appendChild(box);
    $$('#modal [data-ksk]').forEach(b => b.onclick = () => { const id = b.dataset.ksk; k.sksAuto = false; k.sks = kidSkills(k); if (k.sks.includes(id)) k.sks = k.sks.filter(x => x !== id); else if (k.sks.length < 4) k.sks.push(id); else toast(L2('Ya tiene 4: quita una antes.', 'Already 4: remove one first.'), 'info'); markDirty(); openKid(e); });
    $$('#modal [data-kss]').forEach(b => b.onclick = () => { const id = b.dataset.kss; k.soulSet = k.soulSet || []; if (k.soulSet.includes(id)) k.soulSet = k.soulSet.filter(x => x !== id); else k.soulSet.push(id); markDirty(); openKid(e); });
    $$('#modal [data-ksd]').forEach(b => b.onclick = () => { const id = b.dataset.ksd; k.souls = kidSouls(k).filter(s => s.id !== id); k.soulSet = (k.soulSet || []).filter(x => x !== id); markDirty(); openKid(e); }); } catch (err) { console.warn(err); } return r; }; }

// =====================================================================================
// JEFES: también van a por tus hijos (y no solo a por ti)
// =====================================================================================
{ const _um = updateMob; updateMob = function (m, dt) { if (!m || !m.boss || m.dying || m.ghost) return _um.apply(this, arguments);
    m.btT = (m.btT || 0) - dt; if (m.btT <= 0) { m.btT = 4 + Math.random() * 3; const P = G.P, kids = G.ents.filter(kd => kd.type === 'kid' && kidAlive(kd) && kidStage(kd.kid) === 2 && dist2(kd.x, kd.y, m.x, m.y) < 260 * 260); m.bkt = null;
      if (kids.length && Math.random() < kids.length / (kids.length + 1.4)) m.bkt = pick(kids); }
    if (m.bkt && !kidAlive(m.bkt)) m.bkt = null;
    if (m.bkt) { const RP = G.P; G.P = kidProxy(m.bkt); KID_AGGRO = m.bkt; try { return _um.apply(this, arguments); } finally { G.P = RP; KID_AGGRO = null; } }
    return _um.apply(this, arguments); }; }

// =====================================================================================
// ESCALADO POR GRUPO: más gente (jugadores del grupo cerca e hijos que te acompañan) = más vida y daño
// =====================================================================================
function teamSize() { const P = G.P; let n = 1; try { n += (typeof partyNear === 'function' ? partyNear().length : 0); } catch (e) { } n += G.ents.filter(kd => kd.type === 'kid' && kidAlive(kd) && kidStage(kd.kid) === 2 && kd.map === P.map).length * 0.5; if (typeof HUNT !== 'undefined' && HUNT && HUNT.allies) n += HUNT.allies.filter(a => !a.remove && !a.down).length; return n; }
function teamScale(m) { const n = teamSize(), want = n; if (Math.abs((m.teamN || 1) - want) < 0.25) return; const prev = m.teamN || 1, hpF = m.boss ? 0.55 : 0.3, atF = m.boss ? 0.15 : 0.1;
  const k0 = 1 + hpF * (prev - 1), k1 = 1 + hpF * (want - 1), a0 = 1 + atF * (prev - 1), a1 = 1 + atF * (want - 1); const pct = m.hp / m.maxhp; m.maxhp = Math.round(m.maxhp / k0 * k1); m.hp = Math.max(1, Math.round(m.maxhp * pct)); m.atk = Math.round(m.atk / a0 * a1); m.teamN = want; }
{ const _um = updateMob; updateMob = function (m, dt) { if (m && !m.ghost && !m.dying && m.type === 'mob' && m.state !== 'idle' && m.state !== 'dummy') { m.tsT = (m.tsT || 0) - dt; if (m.tsT <= 0) { m.tsT = 2; try { teamScale(m); } catch (e) { } } } return _um.apply(this, arguments); }; }
// jefes de nivel 200+ con un 20 % menos de vida (el informe de equilibrio daba 2-6 min en solitario)
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const e = _sm.apply(this, arguments); if (e && boss && lv >= 200) { e.hp = e.maxhp = Math.round(e.maxhp * 0.8); } return e; }; }
