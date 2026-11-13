// ================= NEW CLASSES: BARDO (music, heals, party songs) & INVOCADOR (scythe, souls, spirit summons) =================
// ---------- bardo skills ----------
sk('d1', 'bardo', 0, 0, 'Nota Aguda', 'act', 1, null, { mp: 8, cd: 2.2, icon: ['note', '#ffd040'], eff: { k: 'proj', m: 2.5, mr: 0.2, spd: 240, art: 'note' }, d: 'Una nota afilada que hiere a distancia: {m}% de daño.' });
sk('d2', 'bardo', 0, 1, 'Acorde Disonante', 'act', 8, 'd1', { mp: 16, cd: 6, icon: ['note', '#ff7ab0'], eff: { k: 'proj', m: 1.2, mr: 0.1, spd: 220, n: 5, spread: 0.9, art: 'note' }, d: 'Cinco notas en abanico ({m}% cada una).' });
sk('d3', 'bardo', 0, 2, 'Virtuoso', 'pas', 15, 'd1', { icon: ['up', '#ffd040'], pas: { atkP: 3 }, d: 'Aumenta el poder musical (ataque) en {atkP}%.' });
sk('d4', 'bardo', 0, 3, 'Crescendo', 'act', 45, 'd2', { mp: 40, cd: 18, icon: ['nova', '#ffd040'], eff: { k: 'nova', m: 5.2, mr: 0.45, r: 70, stun: 1, art: 'note' }, d: 'Una onda sonora a tu alrededor: {m}% de daño y aturde 1 s.' });
sk('d5', 'bardo', 1, 0, 'Canción Curativa', 'act', 3, null, { mp: 14, cd: 9, icon: ['heart', '#6aff7a'], eff: { k: 'heal', p: 16, pr: 1.5, pt: 1 }, d: 'Curas un {p}% de la vida máxima a ti y a tu grupo cercano.' });
sk('d6', 'bardo', 1, 1, 'Balada Protectora', 'act', 10, 'd5', { mp: 22, cd: 24, icon: ['shield', '#9ad8ff'], eff: { k: 'buff', dur: 15, st: { defP: 18 }, str: { defP: 2 }, pt: 1 }, d: 'Durante 15 s, tú y tu grupo: +{defP}% defensa.' });
sk('d7', 'bardo', 1, 2, 'Melodía Vital', 'pas', 18, 'd5', { icon: ['heart', '#e84050'], pas: { hpP: 4 }, d: 'Aumenta la vida máxima en {hpP}%.' });
sk('d8', 'bardo', 1, 3, 'Himno del Renacer', 'act', 35, 'd6', { mp: 45, cd: 40, icon: ['heart', '#ffd040'], eff: { k: 'heal', p: 40, pr: 2.5, pt: 1 }, d: 'Una gran curación: {p}% de la vida máxima para ti y tu grupo.' });
sk('d9', 'bardo', 2, 0, 'Paso de Baile', 'act', 5, null, { mp: 10, cd: 6, icon: ['dash', '#ffd040'], eff: { k: 'dash', dist: 96, m: 1.3, mr: 0.1, stun: 0.4 }, d: 'Un paso de baile veloz que golpea ({m}%).' });
sk('d10', 'bardo', 2, 1, 'Tempo', 'pas', 12, 'd9', { icon: ['up', '#7ad8ff'], pas: { aspdP: 2 }, d: 'Aumenta la velocidad de ataque en {aspdP}%.' });
sk('d11', 'bardo', 2, 2, 'Marcha de Guerra', 'act', 25, 'd9', { mp: 30, cd: 28, icon: ['shout', '#ff8a3a'], eff: { k: 'buff', dur: 15, st: { atkP: 18, aspdP: 10 }, str: { atkP: 2 }, pt: 1 }, d: 'Durante 15 s, tú y tu grupo: +{atkP}% ataque y +10% velocidad de ataque.' });
sk('d12', 'bardo', 2, 3, 'Ritmo Frenético', 'act', 60, 'd11', { mp: 60, cd: 50, icon: ['star', '#ffd040'], eff: { k: 'buff', dur: 15, st: { atkP: 35, aspdP: 25 }, str: { atkP: 3 }, pt: 1 }, d: 'Durante 15 s, tú y tu grupo: +{atkP}% ataque y +25% velocidad de ataque.' });
sk('d13', 'bardo', 0, 4, 'Sinfonía Destructiva', 'act', 100, 'd4', { mp: 100, cd: 18, icon: ['note', '#ff4040'], eff: { k: 'rain', m: 2.5, mr: 0.2, n: 12, r: 28, area: 72, art: 'note' }, d: 'Doce notas caen del cielo sobre la zona ({m}% cada una).' });
sk('d14', 'bardo', 0, 5, 'Réquiem', 'act', 130, 'd13', { mp: 170, cd: 34, icon: ['nova', '#c070ff'], eff: { k: 'field', m: 3.1, mr: 0.24, r: 78, ticks: 12, art: 'note' }, d: 'Una tormenta de música: {m}% por pulso durante 6 s.' });
sk('d15', 'bardo', 1, 4, 'Coro Celestial', 'act', 104, 'd8', { mp: 90, cd: 40, icon: ['shield', '#fff0a0'], eff: { k: 'shield', p: 35, pr: 3, dur: 10, pt: 1 }, d: 'Un escudo que absorbe el {p}% de tu vida; tu grupo recibe una curación igual.' });
sk('d16', 'bardo', 1, 5, 'Aria Eterna', 'act', 134, 'd15', { mp: 150, cd: 60, icon: ['star', '#fff0a0'], eff: { k: 'buff', dur: 20, st: { defP: 30, atkP: 20 }, str: { defP: 2 }, pt: 1 }, d: 'Durante 20 s, tú y tu grupo: +{defP}% defensa y +{atkP}% ataque.' });
sk('d17', 'bardo', 2, 4, 'Eco Resonante', 'act', 110, 'd12', { mp: 100, cd: 14, icon: ['note', '#7ad8ff'], eff: { k: 'proj', m: 5, mr: 0.4, spd: 260, n: 3, spread: 0.5, pierce: 1, art: 'note' }, d: 'Tres ecos perforantes ({m}% cada uno).' });
sk('d18', 'bardo', 2, 5, 'Gran Final', 'act', 140, 'd17', { mp: 180, cd: 40, icon: ['nova', '#ffd040'], eff: { k: 'nova', m: 13, mr: 0.95, r: 96, stun: 2, art: 'note' }, d: 'El último acorde: {m}% de daño a todo a tu alrededor y aturde 2 s.' });
sk('d19', 'bardo', 0, 6, 'Concierto Legendario', 'act', 145, 'd14', { mp: 200, cd: 45, icon: ['note', '#ffffff'], eff: { k: 'concert', m: 2.4, mr: 0.18, r: 90, ticks: 16 }, d: 'Durante 8 s tocas sin parar: {m}% de daño por pulso en área y curas un 3% de vida al grupo con cada pulso.' });
// ---------- invocador skills ----------
sk('i1', 'invocador', 0, 0, 'Invocar Almas', 'act', 1, null, { mp: 20, cd: 14, icon: ['soul', '#5ab0ff'], eff: { k: 'summon', m: 0.55, mr: 0.05, dur: 45 }, d: 'Invoca tus almas vinculadas como espíritus azules (1 alma; 2 en rango 4; 3 en rango 8). Pegan con {m}% de tu ataque según su fuerza.' });
sk('i2', 'invocador', 0, 1, 'Cosecha de Almas', 'pas', 8, 'i1', { icon: ['soul', '#9ad8ff'], pas: { soulP: 3 }, d: '+{soulP}% de probabilidad de capturar almas.' });
sk('i3', 'invocador', 0, 2, 'Vínculo Espectral', 'pas', 15, 'i1', { icon: ['up', '#5ab0ff'], pas: { sumP: 4 }, d: 'Tus espíritus hacen +{sumP}% de daño.' });
sk('i4', 'invocador', 0, 3, 'Furia Espectral', 'act', 45, 'i3', { mp: 40, cd: 25, icon: ['shout', '#5ab0ff'], eff: { k: 'sumbuff', p: 40, pr: 3, dur: 12 }, d: 'Tus espíritus se enfurecen: +{p}% de daño y velocidad durante 12 s.' });
sk('i5', 'invocador', 1, 0, 'Siega', 'act', 3, null, { mp: 10, cd: 4, icon: ['scythe', '#c8d0e0'], eff: { k: 'slash', m: 2, mr: 0.16, arc: 3, r: 40, kb: 40 }, d: 'Un corte amplio de guadaña: {m}% de daño al frente.' });
sk('i6', 'invocador', 1, 1, 'Guadaña Giratoria', 'act', 10, 'i5', { mp: 20, cd: 9, icon: ['spin', '#5ab0ff'], eff: { k: 'spin', m: 0.8, mr: 0.06, r: 42, hits: 5 }, d: 'Giras la guadaña golpeando 5 veces ({m}% cada golpe).' });
sk('i7', 'invocador', 1, 2, 'Toque Mortal', 'pas', 18, 'i5', { icon: ['up', '#c8d0e0'], pas: { atkP: 3 }, d: 'Aumenta el ataque en {atkP}%.' });
sk('i8', 'invocador', 1, 3, 'Ejecución', 'act', 35, 'i6', { mp: 35, cd: 14, icon: ['slash', '#5ab0ff'], eff: { k: 'slash', m: 4.6, mr: 0.38, arc: 2.2, r: 46, kb: 80 }, d: 'Un tajo de la muerte: {m}% de daño (doble a enemigos con menos del 30% de vida).', exec: 1 });
sk('i9', 'invocador', 2, 0, 'Drenar Vida', 'act', 5, null, { mp: 12, cd: 4, icon: ['drop', '#5ab0ff'], eff: { k: 'proj', m: 1.6, mr: 0.13, spd: 210, art: 'soul', drain: 30 }, d: 'Un rayo de almas que roba vida: {m}% de daño y te curas el 30% del daño.' });
sk('i10', 'invocador', 2, 1, 'Aura de Muerte', 'pas', 12, 'i9', { icon: ['shield', '#5ab0ff'], pas: { defP: 3 }, d: 'Aumenta la defensa en {defP}%.' });
sk('i11', 'invocador', 2, 2, 'Plaga', 'act', 25, 'i9', { mp: 30, cd: 16, icon: ['snow', '#7ae07a'], eff: { k: 'field', m: 0.8, mr: 0.07, r: 56, ticks: 10, poison: 1, art: 'soul' }, d: 'Una niebla de muerte: {m}% por pulso y envenena.' });
sk('i12', 'invocador', 2, 3, 'Maldición', 'act', 60, 'i11', { mp: 50, cd: 22, icon: ['star', '#5ab0ff'], eff: { k: 'mark', p: 25, pr: 2, m: 2.5, mr: 0.2 }, d: 'Maldices a un enemigo: recibe +{p}% de daño durante 10 s.' });
sk('i13', 'invocador', 0, 4, 'Ejército de Sombras', 'act', 100, 'i4', { mp: 110, cd: 40, icon: ['soul', '#2a70e0'], eff: { k: 'army', m: 1.2, mr: 0.1, n: 3 }, d: 'Tres sombras surgen junto a tu objetivo y lo golpean 4 veces cada una ({m}% por golpe en área). No ocupan huecos de invocación.' });
sk('i14', 'invocador', 0, 5, 'Rey de los Muertos', 'act', 130, 'i13', { mp: 160, cd: 60, icon: ['soul', '#ffd040'], eff: { k: 'kingsoul', m: 1.6, mr: 0.1, dur: 25 }, d: 'Invoca tu alma más poderosa (mejor si es de un jefe) a tamaño gigante durante 25 s ({m}% de tu ataque).' });
sk('i15', 'invocador', 1, 4, 'Danza Macabra', 'act', 104, 'i8', { mp: 100, cd: 20, icon: ['spin', '#c8d0e0'], eff: { k: 'spin', m: 1.1, mr: 0.08, r: 54, hits: 8 }, d: 'Un torbellino de guadaña de 8 golpes ({m}% cada uno).' });
sk('i16', 'invocador', 1, 5, 'Cosecha Final', 'act', 134, 'i15', { mp: 170, cd: 38, icon: ['slam', '#5ab0ff'], eff: { k: 'slam', m: 9.5, mr: 0.65, r: 82, stun: 1.5, front: 0 }, d: 'La guadaña siega todo a tu alrededor: {m}% de daño y aturde 1.5 s.' });
sk('i17', 'invocador', 2, 4, 'Llamas del Inframundo', 'act', 110, 'i12', { mp: 110, cd: 18, icon: ['nova', '#5ab0ff'], eff: { k: 'nova', m: 5, mr: 0.4, r: 80, art: 'soul' }, d: 'Fuego azul de almas: {m}% de daño a tu alrededor.' });
sk('i18', 'invocador', 2, 5, 'Puerta del Más Allá', 'act', 140, 'i17', { mp: 180, cd: 32, icon: ['nova', '#2a70e0'], eff: { k: 'vortex', m: 1, mr: 0.08, r: 90, ticks: 12 }, d: 'Abres un portal que atrae y daña a los enemigos ({m}% por pulso).' });
for (const id of ['d1', 'd2', 'd4', 'd13', 'd14', 'd17', 'd18', 'd19']) SK[id].music = 1;
// ---------- weapon passives for the new classes ----------
WPASS.bardo = { n: 'Armonía Resonante', d: t => `Tus notas tienen un ${10 + t}% de probabilidad de curar un ${2 + Math.floor(t / 5)}% de vida a ti y a tu grupo.` };
WPASS.invocador = { n: 'Siega de Almas', d: t => `+${t}% de probabilidad de capturar almas. Cada enemigo derrotado te cura un ${1 + Math.floor(t / 5)}% de vida.` };
// ---------- souls ----------
const SOUL_MAX = 40;
function pasSum(k) { const P = G.P; let s = 0; for (const id in P.skills) { const S = SK[id]; if (S && S.type === 'pas' && S.pas && S.pas[k]) s += S.pas[k] * P.skills[id]; } return s; }
function soulDef(s) { return s.b ? BOSSES[s.mid] || MOBS[s.mid] : MOBS[s.mid] || BOSSES[s.mid]; }
function soulPower(s) { const P = G.P; return clamp(s.lv / Math.max(1, P.lv), 0.35, 1.15) * (s.el ? 1.35 : 1) * (s.b ? 1.9 : 1); }
function captureSoul(m) {
  const P = G.P; if (P.cls !== 'invocador' || m.ghost || !soulDef(m)) return; P.souls = P.souls || [];
  const W = wInfo(P), ch = m.boss ? 1 : m.elite ? 0.6 : 0.2 + (pasSum('soulP') + (W.t || 0)) / 100;
  if (W.t) { const h = Math.round(P.S.maxhp * (1 + Math.floor(W.t / 5)) / 100); P.hp = Math.min(P.S.maxhp, P.hp + h); }
  if (Math.random() > ch) return;
  const s = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), mid: m.mid, lv: m.lv, el: m.elite ? 1 : 0, b: m.boss ? 1 : 0 };
  P.souls.push(s); if (P.souls.length > SOUL_MAX) { P.souls.sort((a, b) => soulPower(b) - soulPower(a)); const out = P.souls.pop(); P.soulSet = (P.soulSet || []).filter(x => x !== out.id); }
  addFx({ type: 'bolt', x: m.x, y: m.y - 12, x2: P.x, y2: P.y - 14, dur: 0.35, col: '#7ac8ff' }); burst(P.x, P.y - 14, 8, { sp: 30, up: 30, g: -20, life: 0.6, c: ['#5ab0ff', '#d0f0ff'] });
  if (m.boss || m.elite || !P.souls.some(x => x !== s && x.mid === m.mid)) toast('Alma capturada: ' + (soulDef(s).n) + (m.boss ? ' (¡jefe!)' : m.elite ? ' (élite)' : ''), 'loot', 3);
  markDirty();
}
// tinted (blue spirit) atlases
const TINT = new Map();
function soulAtlas(def) { const A = mobAtlasFor(def.art); if (TINT.has(A)) return TINT.get(A); const c = document.createElement('canvas'); c.width = A.img.width; c.height = A.img.height; const x = c.getContext('2d'); x.drawImage(A.img, 0, 0); x.globalCompositeOperation = 'color'; x.fillStyle = '#3a8cff'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'screen'; x.fillStyle = 'rgba(30,70,140,0.55)'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'destination-in'; x.drawImage(A.img, 0, 0); const B = Object.assign({}, A, { img: c }); TINT.set(A, B); return B; }
let SUMMONS = []; const SUMMON_MAX = 3;
function spawnSummon(soul, mult, dur, opts) {
  const P = G.P, def = soulDef(soul); if (!def) return null; const a = Math.random() * 6.28;
  SUMMONS = SUMMONS.filter(x => !x.remove); while (SUMMONS.length >= SUMMON_MAX) { const old = SUMMONS.shift(); old.remove = true; burst(old.x, old.y - 10, 8, { sp: 30, up: 30, g: -20, life: 0.5, c: ['#5ab0ff', '#d0f0ff'] }); }
  const e = { type: 'summon', soul, mid: soul.mid, def, x: P.x + Math.cos(a) * 18, y: P.y + Math.sin(a) * 12, L: P.L, map: P.map, dir: 'down', anim: 'idle', af: 0, at: 0, cd: 0.4, t: dur, dur, atkM: mult * soulPower(soul) * (1 + pasSum('sumP') / 100), army: opts && opts.army, scale: opts && opts.scale || (soul.b ? 0.65 : 1), name: (opts && opts.name) || 'Espíritu de ' + def.n };
  e.hum = def.art[0] === 'hum'; e.atlas = soulAtlas(def); G.ents.push(e); SUMMONS.push(e); addFx({ type: 'ring', x: e.x, y: e.y, r: 18, dur: 0.5, col: '#5ab0ff' }); burst(e.x, e.y - 10, 14, { sp: 40, up: 40, g: -30, life: 0.8, c: ['#5ab0ff', '#d0f0ff', '#2a60c0'] }); return e;
}
function chosenSouls() { const P = G.P; P.souls = P.souls || []; let set = (P.soulSet || []).map(id => P.souls.find(s => s.id === id)).filter(Boolean); if (!set.length) set = P.souls.slice().sort((a, b) => soulPower(b) - soulPower(a)); return set; }
function castSummon(id, r, mult, e) {
  const P = G.P;
  if (e.k === 'summon') { const n = r >= 8 ? 3 : r >= 4 ? 2 : 1, set = chosenSouls().slice(0, n); if (!set.length) return false; for (const x of SUMMONS.filter(x => !x.army)) x.t = 0; for (const s of set) spawnSummon(s, mult, e.dur); toast(set.length + ' espíritu' + (set.length > 1 ? 's' : '') + ' invocado' + (set.length > 1 ? 's' : ''), 'info'); }
  else if (e.k === 'army') { const T = nearestMob(P.x, P.y, 200), cx = T ? T.x : P.x + DIRV[P.dir][0] * 40, cy = T ? T.y : P.y + DIRV[P.dir][1] * 30, d = P.S.atk * mult;
    for (let k = 0; k < 3; k++) { const a = k * 2.09 + Math.random(), sx = cx + Math.cos(a) * 26, sy = cy + Math.sin(a) * 18; addFx({ type: 'ring', x: sx, y: sy, r: 12, dur: 0.6, col: '#2a70e0' }); burst(sx, sy - 10, 14, { sp: 30, up: 50, g: -30, life: 0.9, c: ['#0a1a3a', '#2a6ad0', '#5ab0ff'] });
      for (let h = 0; h < 4; h++) delayAct(0.3 + h * 0.28 + k * 0.08, () => { addFx({ type: 'bolt', x: sx, y: sy - 14, x2: cx + (Math.random() - 0.5) * 16, y2: cy - 8, dur: 0.2, col: '#7ac8ff' }); hitCircle(cx, cy, 34, d, { summon: 1 }); }); } }
  else if (e.k === 'kingsoul') { const s = chosenSouls().slice().sort((a, b) => soulPower(b) - soulPower(a))[0]; if (!s) return false; spawnSummon(s, mult * (s.b ? 1.4 : 1), e.dur, { army: 1, scale: s.b ? 1 : 1.6, name: 'Rey: ' + soulDef(s).n }); G.shake = 4; sfx('boss'); }
  else if (e.k === 'sumbuff') { if (!SUMMONS.length) return false; const v = skillVal(id, r); for (const x of SUMMONS) { x.rage = e.dur; x.rageP = v.p; burst(x.x, x.y - 10, 10, { sp: 40, up: 40, g: -30, life: 0.6, c: ['#ff5a5a', '#5ab0ff'] }); } }
  sfx('boom'); return true;
}
function updateSummon(e, dt) {
  const P = G.P; e.t -= dt; e.cd -= dt; if (e.rage > 0) e.rage -= dt;
  if (e.t <= 0 || P.dead) { e.remove = true; burst(e.x, e.y - 10, 10, { sp: 30, up: 30, g: -20, life: 0.6, c: ['#5ab0ff', '#d0f0ff'] }); SUMMONS = SUMMONS.filter(x => x !== e); return; }
  if (e.map !== P.map) { e.map = P.map; e.x = P.x; e.y = P.y + 6; }
  let tgt = null, bd = 170 * 170; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map) { const d = dist2(m.x, m.y, P.x, P.y); if (d < bd) { bd = d; tgt = m; } }
  const rng = 18 * (e.scale || 1) + 8; let tx, ty;
  if (tgt) { const a = Math.atan2(e.y - tgt.y, e.x - tgt.x); tx = tgt.x + Math.cos(a) * rng; ty = tgt.y + Math.sin(a) * rng * 0.7; }
  else { const i = SUMMONS.indexOf(e), a = i * 2.1 + G.t * 0.4; tx = P.x + Math.cos(a) * 26; ty = P.y + Math.sin(a) * 16; }
  const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
  if (L > 260) { e.x = P.x; e.y = P.y; } else if (L > 2) { const sp = Math.min(L * 5, 95 * (e.rage > 0 ? 1.4 : 1)); e.x += dx / L * sp * dt; e.y += dy / L * sp * dt; }
  if (tgt) { e.dir = dirFromVec(tgt.x - e.x, tgt.y - e.y); if (e.cd <= 0 && Math.hypot(tgt.x - e.x, tgt.y - e.y) < rng + 14) { e.cd = e.rage > 0 ? 0.75 : 1.05; setAnim(e, e.atlas.idx.atk !== undefined ? 'atk' : 'idle'); const d = P.S.atk * e.atkM * (1 + (e.rage > 0 ? e.rageP / 100 : 0)); if (e.scale > 1.2 || e.soul.b) hitCircle(tgt.x, tgt.y, 26, d, { summon: 1 }); else hitMob(tgt, d, { summon: 1 }); addFx({ type: 'ring', x: tgt.x, y: tgt.y, r: 10, dur: 0.25, col: '#7ac8ff' }); } }
  else if (L > 3) e.dir = dirFromVec(dx, dy);
  const an = e.anim === 'atk' && e.af < (e.atlas.idx.atk !== undefined ? animN(e, 'atk') - 1 : 0) ? 'atk' : L > 3 ? 'walk' : 'idle';
  if (an !== e.anim) setAnim(e, e.atlas.idx[an] !== undefined ? an : 'idle'); stepAnim(e, dt, 8);
  if (Math.random() < dt * 4) burst(e.x + (Math.random() - 0.5) * 10, e.y - 8 - Math.random() * 10, 1, { sp: 6, up: 20, g: -20, life: 0.6, c: ['#5ab0ff', '#d0f0ff'] });
}
// ---------- party casts (bard heals & songs reach the group) ----------
PARTY.pc = []; PARTY.pcSeq = 0;
function partyCast(o) { if (!PARTY.id) return; o.s = ++PARTY.pcSeq; o.x = Math.round(G.P.x); o.y = Math.round(G.P.y); PARTY.pc.push(o); if (PARTY.pc.length > 4) PARTY.pc.shift(); netPresence(true); }
function partyCastRecv(r, pr) {
  if (!Array.isArray(pr.pc)) { if (r.pcSeen === undefined) r.pcSeen = 0; return; } const P = G.P; const first = r.pcSeen === undefined; let mx = r.pcSeen || 0;
  for (const c of pr.pc) { if (!c || !(c.s > (r.pcSeen || 0))) continue; mx = Math.max(mx, c.s); if (first || P.dead || r.map !== P.map || dist(+c.x, +c.y, P.x, P.y) > 300) continue;
    if (c.k === 'heal') { const h = Math.round(P.S.maxhp * clamp(+c.p || 0, 0, 60) / 100); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + h, '#6aff7a'); burst(P.x, P.y - 10, 12, { sp: 30, up: 50, g: -30, life: 0.8, c: ['#8aff6a', '#ffffff'] }); }
    if (c.k === 'buff' && SK[c.id] && SK[c.id].eff && SK[c.id].eff.st) { const st = {}; for (const k in SK[c.id].eff.st) st[k] = clamp(+(c.st && c.st[k]) || SK[c.id].eff.st[k], 0, 80); addBuff(P, 'pc_' + c.id, st, clamp(+c.dur || 10, 1, 30)); toast(r.name + ' te da ' + SK[c.id].n, 'info'); addFx({ type: 'ring', x: P.x, y: P.y, r: 22, dur: 0.5, col: '#ffd040' }); } }
  r.pcSeen = mx;
}
// ---------- concert (bard ultimate) ----------
function castConcert(id, r, mult, e) { const P = G.P; P.concert = { t: 0, ticks: e.ticks, left: e.ticks, r: e.r, dmg: P.S.atk * mult }; return true; }
function concertTick(dt) { const P = G.P, C = P.concert; if (!C) return; C.t -= dt; if (C.t > 0) return; C.t = 0.5; C.left--;
  hitCircle(P.x, P.y, C.r, C.dmg, {}); addFx({ type: 'ring', x: P.x, y: P.y, r: C.r, dur: 0.4, col: '#ffd040' }); for (let i = 0; i < 4; i++) addFx({ type: 'note', x: P.x + (Math.random() - 0.5) * 70, y: P.y - 14 - Math.random() * 26, dur: 1.1, dbl: i & 1, col: ['#ffd040', '#ff7ab0', '#7ad8ff'][i % 3] });
  const h = Math.round(P.S.maxhp * 0.03); P.hp = Math.min(P.S.maxhp, P.hp + h); if (C.left % 2 === 0) partyCast({ k: 'heal', p: 6 }); if (C.left <= 0) P.concert = null; }
// ---------- bard basic-attack passive ----------
function bardNoteHit() { const P = G.P, W = wInfo(P); if (P.cls !== 'bardo' || !W.t) return; if (Math.random() * 100 < 10 + W.t) { const p = 2 + Math.floor(W.t / 5), h = Math.round(P.S.maxhp * p / 100); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 36, '+' + h, '#6aff7a'); P.noteHealT = (P.noteHealT || 0); if (G.t - P.noteHealT > 3) { P.noteHealT = G.t; partyCast({ k: 'heal', p }); } } }
// ---------- souls panel (shown in the skills tab for the summoner) ----------
function soulsHTML() {
  const P = G.P; if (P.cls !== 'invocador') return ''; P.souls = P.souls || []; P.soulSet = (P.soulSet || []).filter(id => P.souls.some(s => s.id === id));
  const list = P.souls.slice().sort((a, b) => soulPower(b) - soulPower(a));
  return `<div class="frame souls"><h3>${iconHTML(['soul', '#5ab0ff'], 18)} Almas capturadas ${P.souls.length}/${SOUL_MAX} <small>· elige hasta 3 para invocar</small></h3><div class="soulgrid">${list.map(s => { const d = soulDef(s), on = P.soulSet.includes(s.id); return `<button class="soul ${on ? 'on' : ''} ${s.b ? 'boss' : s.el ? 'el' : ''}" data-soul="${s.id}"><b>${esc(d.n)}</b><small>Nv.${s.lv}${s.b ? ' · jefe' : s.el ? ' · élite' : ''} · fuerza ${Math.round(soulPower(s) * 100)}%</small></button>`; }).join('') || '<p class="hint">Derrota enemigos para capturar sus almas. Las de élites y jefes son más fuertes.</p>'}</div></div>`;
}
function bindSouls(B) { $$('[data-soul]', B).forEach(b => b.onclick = () => { const P = G.P, id = b.dataset.soul; P.soulSet = P.soulSet || []; if (P.soulSet.includes(id)) P.soulSet = P.soulSet.filter(x => x !== id); else { if (P.soulSet.length >= 3) P.soulSet.shift(); P.soulSet.push(id); } sfx('ui'); markDirty(); renderPanel(); }); }
// ---------- remote summons & companions (multiplayer) ----------
function extraPresence(o) {
  if (SUMMONS.length) o.sm = SUMMONS.slice(0, 4).map(e => [e.mid, Math.round(e.x), Math.round(e.y), DIRS.indexOf(e.dir), e.anim === 'atk' ? 1 : e.anim === 'walk' ? 2 : 0, e.soul.b ? 2 : e.scale > 1.2 ? 1 : 0]);
  if (COMP && COMP.e) o.cp = [relKey(COMP.e.id), Math.round(COMP.e.x), Math.round(COMP.e.y), DIRS.indexOf(COMP.e.dir), COMP.e.anim === 'walk' ? 1 : 0, COMP.hand ? 1 : 0];
}
function extraRecv(r, pr) {
  const keep = new Set();
  if (Array.isArray(pr.sm)) pr.sm.slice(0, 4).forEach((a, i) => { const def = a[5] === 2 ? BOSSES[a[0]] || MOBS[a[0]] : MOBS[a[0]] || BOSSES[a[0]]; if (!def) return; const key = r.peer + ':sm' + i; keep.add(key); let e = r.rsm && r.rsm[i];
    if (!e || e.mid !== a[0] || e.remove) { e = { type: 'rsum', key, mid: a[0], def, x: +a[1], y: +a[2], L: 0, map: r.map, dir: 'down', anim: 'idle', af: 0, at: 0, scale: a[5] === 1 ? 1.6 : a[5] === 2 ? 0.65 : 1 }; e.hum = def.art[0] === 'hum'; e.atlas = soulAtlas(def); G.ents.push(e); r.rsm = r.rsm || []; if (r.rsm[i]) r.rsm[i].remove = true; r.rsm[i] = e; }
    e.tx = +a[1]; e.ty = +a[2]; e.dir = DIRS[a[3]] || 'down'; e.ta = a[4] === 1 ? 'atk' : a[4] === 2 ? 'walk' : 'idle'; e.map = r.map; e.seen = G.t; });
  if (r.rsm) r.rsm.forEach((e, i) => { if (e && !keep.has(e.key)) { e.remove = true; r.rsm[i] = null; } });
  if (Array.isArray(pr.cp) && NPCS[pr.cp[0]]) { const a = pr.cp; let e = r.rcp; if (!e || e.id !== a[0] || e.remove) { if (e) e.remove = true; e = { type: 'rcomp', id: a[0], x: +a[1], y: +a[2], L: 0, map: r.map, dir: 'down', anim: 'idle', af: 0, at: 0, owner: r }; e.hum = true; e.atlas = npcAtlas(a[0]); e.def = NPCS[a[0]]; G.ents.push(e); r.rcp = e; } e.tx = +a[1]; e.ty = +a[2]; e.dir = DIRS[a[3]] || 'down'; e.ta = a[4] ? 'walk' : 'idle'; e.hand = !!a[5]; e.map = r.map; e.seen = G.t; }
  else if (r.rcp) { r.rcp.remove = true; r.rcp = null; }
}
function updateRemoteExtra(e, dt) { if (G.t - (e.seen || 0) > 4) { e.remove = true; return; } const dx = e.tx - e.x, dy = e.ty - e.y; if (Math.hypot(dx, dy) > 150) { e.x = e.tx; e.y = e.ty; } else { e.x += dx * Math.min(1, dt * 10); e.y += dy * Math.min(1, dt * 10); } if (e.atlas.idx[e.ta] !== undefined) setAnim(e, e.ta, true); stepAnim(e, dt, e.anim === 'walk' ? 8 : 3); }
function drawRemoteHand(e, cx, cy) { if (e.type !== 'rcomp' || !e.hand || !e.owner) return; const o = e.owner; const ax = e.x - cx, ay = e.y - cy - 9, bx = o.x - cx, by = o.y - cy - 9; if (Math.abs(ax - bx) > 22 || Math.abs(ay - by) > 14) return; const s = Math.sign(ax - bx) || 1; ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Math.round(bx + s * 4), Math.round(by + 1)); ctx.lineTo(Math.round(ax - s * 4), Math.round(ay + 1)); ctx.stroke(); ctx.strokeStyle = '#f0c49a'; ctx.lineWidth = 2; ctx.stroke(); if (Math.random() < 0.01) floatText((e.x + o.x) / 2, Math.min(e.y, o.y) - 34, '♥', '#ff7ab0'); }
