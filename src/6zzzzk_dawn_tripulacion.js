// 5.96 · Tripulación del Mar de Dawn (Sergio: «tu opinión está bien, hazla» + «que la tripulación tenga recompensa con su
// cartel como el sistema actual, que suba cuando derrotan o siguen esta historia» + «en la Lupa no dice nada del crossover»).
// 1) Compañero caído en pelea: se levanta a los 15 s con un tercio de su vida (Morgan, Cabaji, Buggy, Villa Syrup).
// 2) Recompensas de Luffy, Zoro, Nami y Usopp (P.crewBty) con su cartel, usando BNT_T y el mismo papel que el tuyo.
// 3) Lupa › 🏴‍☠️ Mar de Dawn: la historia paso a paso, con ✅, flecha y los sistemas del crossover.

// ---------- 1) el compañero caído se levanta ----------
const CREW_UP_S = 15, CREW_UP_HP = 1 / 3;
V33_TICKS.push(() => { try { const M = G.map; if (!M) return;
  for (const e of G.ents) { if (e.type !== 'npc' || e.shellsDefense === undefined || e.remove || e.map !== M.id || !(e.maxhp > 0)) continue;
    if (e.hp > 0) { e.crewDownAt = 0; continue; }
    if (!e.crewDownAt) { e.crewDownAt = G.t; floatText(e.x, e.y - 70, L2('Se levanta en 15 s', 'Back up in 15 s'), '#ffe2a0'); continue; }
    if (G.t - e.crewDownAt < CREW_UP_S) continue;
    e.crewDownAt = 0; e.hp = Math.max(1, Math.round(e.maxhp * CREW_UP_HP)); e.nextAssist = G.t + 0.8; e.actionUntil = 0; setAnim(e, 'idle', true);
    addFx({ type: 'ring', x: e.x, y: e.y, r: 30, dur: 0.5, col: '#ffe08a' }); burst(e.x, e.y - 20, 14, { sp: 70, up: 40, life: 0.5, c: ['#ffe08a', '#ffffff'] });
    if (typeof shellsRescueSpeak === 'function') shellsRescueSpeak(e, '¡Todavía no he terminado!', 'I’m not done yet!'); } } catch (er) { } });

// ---------- 2) recompensas de la tripulación ----------
SAVEKEYS.push('crewBty', 'crewBtyT');
const CREW_BTY = [
  [SHELLS_CAST_IDS.luffy, 'Luffy', P => !!(P.bossKills || {})[MORGAN_ID]],
  [SHELLS_CAST_IDS.zoro, 'Zoro', P => !!(P.bossKills || {})[MORGAN_ID]],
  [ORANGE_NAMI, 'Nami', P => !!P.dawnCrewJoined],
  [SYRUP_USOPP, 'Usopp', P => !!P.syrupUsopp]];
// quién pelea en cada jefe de la historia (los demás compañeros que ya tienes suben menos)
const CREW_BTY_FIGHT = { [MORGAN_ID]: ['luffy', 'zoro'], [ORANGE_CABAJI]: ['zoro', 'luffy'], [ORANGE_BUGGY]: ['luffy', 'zoro'],
  [SYRUP_SHAM]: ['zoro'], [SYRUP_BUCHI]: ['zoro'], [SYRUP_JANGO]: ['nami', 'usopp'], [SYRUP_CAPTAIN]: ['luffy'] };
const crewKey = id => ({ [SHELLS_CAST_IDS.luffy]: 'luffy', [SHELLS_CAST_IDS.zoro]: 'zoro', [ORANGE_NAMI]: 'nami', [SYRUP_USOPP]: 'usopp', [BAR_SANJI]: 'sanji' })[id];   // 6.27: + Sanji
const crewMet = P => CREW_BTY.filter(c => c[2](P));
const crewTier = n => { let t = 0; for (let i = 0; i < BNT_T.length; i++) if ((n || 0) >= BNT_T[i]) t = i; return t; };
function crewBtyGain(key, n) { const P = G.P; if (!P || !(n > 0)) return; P.crewBty = P.crewBty || {}; P.crewBtyT = P.crewBtyT || {};
  const c = CREW_BTY.find(c => crewKey(c[0]) === key); if (!c || !c[2](P)) return;
  P.crewBty[key] = Math.min(9e12, (P.crewBty[key] || 0) + Math.round(n)); const t = crewTier(P.crewBty[key]);
  if (t > (P.crewBtyT[key] || 0)) { P.crewBtyT[key] = t; setTimeout(() => { toast('📜 ' + L2('¡Nuevo cartel de ', 'New wanted poster for ') + c[1] + '! ' + bntFmt(P.crewBty[key]), 'quest', 6);
    if ($('#modal').hidden) crewPoster(key, true); }, 2600); } }
{ const _km = killMob; killMob = function (m) { const was = m && !m.dying; const r = _km.apply(this, arguments);
  try { const P = G.P; if (!was || !P || m.type !== 'mob' || m.summon || m.pet || !G.map || !/^(dawn|alvida_deck|marina_deck)$/.test(G.map.id)) return r;
    const lv = m.lv || 1, fight = CREW_BTY_FIGHT[m.mid] || [];
    for (const c of crewMet(P)) { const k = crewKey(c[0]);
      crewBtyGain(k, m.boss ? (fight.includes(k) ? (fight[0] === k ? lv * 7000 : lv * 4500) : lv * 900) : P.dawnCrewJoined ? lv * (isMarine(m) ? 160 : 25) : 0); } } catch (e) { } return r; }; }
// al unirse, cada uno trae la recompensa que ya tenía por lo que hizo en la historia
V33_TICKS.push(() => { try { const P = G.P; if (!P || !P.bossKills) return; P.crewBty = P.crewBty || {}; P.crewBtyT = P.crewBtyT || {};
  for (const c of crewMet(P)) { const k = crewKey(c[0]); if (P.crewBty[k] !== undefined) continue; let n = 0;
    for (const [mid, who] of Object.entries(CREW_BTY_FIGHT)) if (P.bossKills[mid] && who.includes(k)) n += (BOSSES[mid].lv || 550) * (who[0] === k ? 7000 : 4500);
    P.crewBty[k] = n || 1e6; P.crewBtyT[k] = crewTier(P.crewBty[k]); } } catch (e) { } });
function crewPosterCanvas(key) { const P = G.P, c0 = CREW_BTY.find(c => crewKey(c[0]) === key), W = 300, H = 420, cv = mkCanvas(W, H), g = cv.getContext('2d'), n = (P.crewBty || {})[key] || 0;
  g.fillStyle = '#e6cf9c'; g.fillRect(0, 0, W, H); for (let k = 0; k < 900; k++) { const x = (hash2(k, 1, 7) * W) | 0, y = (hash2(k, 2, 7) * H) | 0; g.fillStyle = hash2(k, 3, 7) > 0.5 ? 'rgba(120,80,30,0.08)' : 'rgba(255,240,200,0.12)'; g.fillRect(x, y, 3, 3); }
  const gr = g.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 260); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(90,50,10,0.45)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const F = s => `${s}px 'Pixelify Sans', monospace`; g.textAlign = 'center'; g.fillStyle = '#2a1608'; g.font = F(52); g.fillText(L2('SE BUSCA', 'WANTED'), W / 2, 62);
  const bx = 34, by = 78, bw = W - 68, bh = 190; g.fillStyle = '#8ac8e8'; g.fillRect(bx, by, bw, bh); g.fillStyle = '#5a9ac8'; g.fillRect(bx, by + bh * 0.62, bw, bh * 0.38);
  try { const A = npcAtlas(c0[0]), col = A.idx.idle || 0, sc = Math.min(bw / A.fw, (bh * 1.45) / A.fh); g.save(); g.beginPath(); g.rect(bx, by, bw, bh); g.clip(); g.imageSmoothingEnabled = false;
    g.drawImage(A.img, col * A.fw, 0, A.fw, A.fh, Math.round(bx + bw / 2 - A.ax * sc), Math.round(by + bh * 1.02 - A.ay * sc + A.fh * sc * 0.28), Math.round(A.fw * sc), Math.round(A.fh * sc)); g.restore(); } catch (e) { }
  g.strokeStyle = '#2a1608'; g.lineWidth = 3; g.strokeRect(bx, by, bw, bh);
  g.fillStyle = '#2a1608'; g.font = F(17); g.fillText(L2('VIVO O MUERTO', 'DEAD OR ALIVE'), W / 2, 296); g.font = F(32); g.fillText(c0[1].toUpperCase(), W / 2, 332);
  g.font = F(26); g.fillText(bntFmt(n), W / 2, 368); g.font = F(9); g.fillStyle = '#4a3018'; const t = crewTier(n);
  g.fillText(L2('Peligro ', 'Danger ') + '★'.repeat(t) + '☆'.repeat(7 - t) + ' · ' + L2('Tripulación de ', 'Crew of ') + String(P.name || '???'), W / 2, 388);
  g.textAlign = 'right'; g.font = F(16); g.fillStyle = '#2a1608'; g.fillText(L2('MARINA', 'NAVY'), W - 24, 408); g.textAlign = 'left'; return cv; }
function crewPoster(key, fresh) { const P = G.P, c0 = CREW_BTY.find(c => crewKey(c[0]) === key); if (!P || !c0) return;
  openModal(`<div class="frame cqpost"><h3>📜 ${fresh ? L2('¡Nuevo cartel de ', 'New poster for ') : L2('Cartel de ', 'Poster of ')}${esc(c0[1])}</h3><div id="crPoster" style="text-align:center"></div><p class="hint">${L2('La recompensa de tu tripulación sube cuando vencéis juntos a los jefes de la historia del Mar de Dawn (más quien da el golpe principal) y, si van contigo, con cada enemigo de Dawn.', 'Your crew’s bounty rises when you beat the Dawn Sea story bosses together (more for whoever leads the fight) and, if they sail with you, with every Dawn enemy.')}</p><div class="row"><button class="btn" id="crAll">🏴‍☠️ ${L2('Toda la tripulación', 'Whole crew')}</button><button class="btn" id="crX">${L2('Cerrar', 'Close')}</button></div></div>`);
  const cv = crewPosterCanvas(key); cv.style.width = 'min(300px,70vw)'; $('#crPoster').appendChild(cv); $('#crX').onclick = closeModal; $('#crAll').onclick = crewPosters; }
function crewListHTML() { const P = G.P, met = crewMet(P); if (!met.length) return `<p class="hint">🏴‍☠️ ${L2('Aún no tienes tripulación: sigue la historia del Mar de Dawn (Shells Town).', 'No crew yet: follow the Dawn Sea story (Shells Town).')}</p>`;
  return met.map(c => { const k = crewKey(c[0]); return `<div class="gsrc"><span>🏴‍☠️ <b>${esc(c[1])}</b> · ${bntFmt((P.crewBty || {})[k])} · ${L2('peligro ', 'danger ')}${crewTier((P.crewBty || {})[k])}/7</span><button class="btn sm" data-crp="${k}">${L2('Cartel', 'Poster')}</button></div>`; }).join(''); }
function crewPosters() { openModal(`<div class="frame cqpost"><h3>🏴‍☠️ ${L2('Recompensas de la tripulación', 'Crew bounties')}</h3><p class="hint">📜 ${L2('Tú: ', 'You: ')}<b>${bntFmt(G.P.bounty)}</b> <button class="btn sm" id="crMe">${L2('Cartel', 'Poster')}</button></p>${crewListHTML()}<div class="row"><button class="btn" id="crX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#crX').onclick = closeModal; $('#crMe').onclick = () => bntPoster(false); $$('#modal [data-crp]').forEach(b => b.onclick = () => crewPoster(b.dataset.crp)); }
// en tu cartel y en Habilidades, acceso a los de la tripulación
{ const _bp = bntPoster; bntPoster = function () { const r = _bp.apply(this, arguments); try { const row = $('#modal .cqpost .row'); if (row && !$('#crOpen') && crewMet(G.P).length) { const b = document.createElement('button'); b.className = 'btn'; b.id = 'crOpen'; b.textContent = '🏴‍☠️ ' + L2('Tripulación', 'Crew'); b.onclick = crewPosters; row.insertBefore(b, row.firstChild); } } catch (e) { } return r; }; }
{ const _rs = renderSkills; renderSkills = function (B) { const r = _rs.apply(this, arguments); try { const box = B.querySelector('.cqsk'); if (box && crewMet(G.P).length) { box.insertAdjacentHTML('beforeend', `<p class="hint">🏴‍☠️ ${L2('Tripulación', 'Crew')}</p>` + crewListHTML()); box.querySelectorAll('[data-crp]').forEach(b => b.onclick = () => crewPoster(b.dataset.crp)); } } catch (e) { } return r; }; }

// ---------- 3) Lupa › 🏴‍☠️ Mar de Dawn ----------
const dawnWon = id => !!((G.P && G.P.bossKills) || {})[id];
const dawnShellsWp = () => { const M = G.maps && G.maps.dawn; return M && M.shells ? { loc: [M.shells.start + SHELLS_RESCUE_AT[0], SHELLS_RESCUE_AT[1]], m: 'dawn', t: 'Shells Town' } : null; };
const gsisRef = id => (typeof GSIS !== 'undefined' && GSIS.find(g => g[0] === id)) || null;
const LUPA_DAWN = [
  ['ruta', () => '🧭 ' + L2('Ruta de la historia', 'Story route'), () => [
    (dawnWon(ALVIDA_BOSS) ? '✅ ' : '⬜ ') + L2('1. Nivel 500: bote con la Capitana Marina y galeón de Alvida.', '1. Level 500: boat from Captain Marina and Alvida’s galleon.'),
    (dfHas() ? '✅ ' : '⬜ ') + L2('2. Fruta del Diablo (llave de los desembarcos): Hilandera Muda, Tierras Tejidas.', '2. Devil Fruit (landing key): Mute Spinner, Woven Lands.'),
    (dawnWon(MORGAN_ID) ? '✅ ' : '⬜ ') + L2('3. Shells Town: rescata a Zoro y vence a Morgan (550) con Luffy y Zoro.', '3. Shells Town: rescue Zoro and beat Morgan (550) with Luffy and Zoro.'),
    (dawnWon(ORANGE_CABAJI) && dawnWon(ORANGE_BUGGY) ? '✅ ' : '⬜ ') + L2('4. Orange Town: Cabaji (567) y Buggy (570); Nami se une y el bote pasa a ser el Going Merry.', '4. Orange Town: Cabaji (567) and Buggy (570); Nami joins and the boat becomes the Going Merry.'),
    (G.P && G.P.rareDone ? '✅ ' : '⬜ ') + L2('5. Isla de los Animales Raros: ayuda a Gaimon con los cinco cofres.', '5. Island of Rare Animals: help Gaimon with the five chests.'),
    (G.P && G.P.syrupUsopp ? '✅ ' : '⬜ ') + L2('6. Villa Syrup: Sham y Buchi (con Zoro), Jango (con Nami y Usopp) y Kuro (580, con Luffy); Usopp se une.', '6. Syrup Village: Sham and Buchi (with Zoro), Jango (with Nami and Usopp) and Kuro (580, with Luffy); Usopp joins.'),
    (dawnWon(SH_BOSS) ? '✅ ' : '⬜ ') + L2('7. Nivel 600: duelo con Shanks en Foosha (Engranaje 2, Pirata de Paja y su ropa).', '7. Level 600: duel with Shanks in Foosha (Gear 2, Straw Pirate set and his clothes).')],
    () => { const P = G.P; if (!P) return null; if (!dfHas()) return { loc: TJ_BOSS_AT.tj_hilandera, m: 'world', t: BOSSES.tj_hilandera.n };
      if (!dawnWon(MORGAN_ID)) return dawnShellsWp(); if (!dawnWon(ORANGE_BUGGY)) return { loc: dawnWon(ORANGE_CABAJI) ? ORANGE_CIRCUS : ORANGE_GATE, m: 'dawn', t: 'Orange Town' };
      if (!P.rareDone) return { loc: RARE_PIER, m: 'dawn', t: RARE_NAME }; if (!P.syrupUsopp) return { loc: syrupNext(P), m: 'dawn', t: SYRUP_NAME }; return null; }],
  ['equipo', () => '🏴‍☠️ ' + L2('Tripulación y recompensas', 'Crew and bounties'), () => [
    L2('En las peleas de la historia te acompañan: Luffy y Zoro (Morgan, Cabaji, Buggy), Zoro (Sham y Buchi), Nami y Usopp (Jango) y Luffy (Kuro). Si un compañero cae, se levanta a los 15 s con un tercio de su vida.', 'In story fights you are joined by: Luffy and Zoro (Morgan, Cabaji, Buggy), Zoro (Sham and Buchi), Nami and Usopp (Jango) and Luffy (Kuro). If a crewmate falls, they get back up after 15 s with a third of their HP.'),
    L2('Cada uno tiene recompensa y cartel: sube al vencer juntos a los jefes de la historia (más quien lleva la pelea) y con cada enemigo de Dawn si van contigo. Míralos en Habilidades › Voluntad o en tu cartel › 🏴‍☠️ Tripulación.', 'Each one has a bounty and a poster: it rises when you beat the story bosses together (more for whoever leads the fight) and with every Dawn enemy while they sail with you. See them in Skills › Will or in your poster › 🏴‍☠️ Crew.'),
    L2('Los jefes del Mar de Dawn hacen daño de verdad incluso con despertares y transformación: esquiva sus ataques marcados.', 'Dawn Sea bosses hit hard even with awakenings and transformations: dodge their marked attacks.')].concat(crewMet(G.P).map(c => '📜 ' + c[1] + ': ' + bntFmt(((G.P.crewBty || {})[crewKey(c[0])]) || 0))), () => null],
  ['frutas', () => '🍇 ' + L2('Frutas del Diablo', 'Devil Fruits'), () => [L2('Todas las frutas, su poder y su probabilidad están en el menú › 🍇 Frutas.', 'Every fruit, its power and its chance are in the menu › 🍇 Fruits.')].concat(Object.keys(DFR).map(k => (G.P.fruit === k ? '✅ ' : '• ') + ITEMS[DFR[k].item].n)), () => null]];
for (const [id, ic] of [['crossover583', ''], ['fruta582', ''], ['dawn_element_fruits', '🔥 '], ['voluntad588', ''], ['tortuga586', ''], ['engranaje2', '']]) { const g = gsisRef(id); if (g) LUPA_DAWN.push([id, () => ic + g[1], g[2], g[3] || (() => null)]); }
let LUPA_DAWN_SEL = 'ruta';
function guiaDawn() { GUIA.tab = 'dawn'; const P = G.P, list = LUPA_DAWN.map(([k, t]) => `<button class="gitem ${LUPA_DAWN_SEL === k ? 'sel' : ''}" data-gdw="${k}"><span>${esc(t())}</span></button>`).join('');
  const S = LUPA_DAWN.find(s => s[0] === LUPA_DAWN_SEL) || LUPA_DAWN[0]; let det = ''; let w = null; try { w = S[3](); } catch (e) { }
  if (w) WP_M[Math.round(w.loc[0] * 10) / 10 + ',' + Math.round(w.loc[1] * 10) / 10] = w.m || 'world';
  det = `<h4>${esc(S[1]())}</h4>` + S[2]().map(t => `<div class="gsrc"><span>${esc(t)}</span></div>`).join('') + (w ? `<div class="gsrc"><span>📍 <b>${esc(w.t)}</b></span>${guiaFollowBtn(w, w.t)}</div>` : '');
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${guiaChipsHTML('dawn')}</div><div class="gcols"><div class="glist">${list}</div><div class="gdet">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; guiaBindChips(); $$('[data-gdw]').forEach(b => b.onclick = () => { LUPA_DAWN_SEL = b.dataset.gdw; guiaDawn(); });
  const off = $('#gOff'); if (off) off.onclick = () => { P.wp = null; markDirty(); guiaDawn(); };
  $$('[data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); if (P.wp && P.wp.x === x && P.wp.y === y) { P.wp = null; markDirty(); } else setWp({ loc: [x, y], t: b.dataset.wl, m: WP_M[Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10] || 'world' }); guiaDawn(); }); }
{ const _gc = guiaChipsHTML; guiaChipsHTML = function (tab) { return `<button class="chip ${tab === 'dawn' ? 'on' : ''}" data-gx="dawn">🏴‍☠️ ${L2('Crossovers', 'Crossovers')}</button>` + _gc.apply(this, arguments); }; }
{ const _gb = guiaBindChips; guiaBindChips = function () { _gb.apply(this, arguments); const b = $('.guia [data-gx="dawn"]'); if (b) b.onclick = () => guiaDawn(); }; }
{ const _ga = guiaAddJobChip; guiaAddJobChip = function () { _ga.apply(this, arguments); const ch = $('.guia .chips'); if (!ch || ch.querySelector('[data-gx="dawn"]')) return; const b = document.createElement('button'); b.className = 'chip'; b.dataset.gx = 'dawn'; b.textContent = '🏴‍☠️ ' + L2('Crossovers', 'Crossovers'); b.onclick = () => guiaDawn(); ch.insertBefore(b, ch.firstChild); }; }
{ const _gx = guiaX; guiaX = function (tab) { if (tab === 'dawn') return guiaDawn(); return _gx.apply(this, arguments); }; }
{ const _rg = renderGuia; renderGuia = function () { if (GUIA.tab === 'dawn') return guiaDawn(); return _rg.apply(this, arguments); }; }
