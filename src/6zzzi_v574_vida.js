// ================= v5.74: VIDA EN EL MUNDO =================
// 1) Horarios en Lima, Lima Norte, Trujillo, Cusco, Machu Picchu, México y España: de día mucha gente, de noche poca,
//    vendedores que solo salen de noche y, de madrugada, loquitos que buscan pleito (se adaptan a tu fuerza).
// 2) Rumores: la gente comenta lo que de verdad has hecho.   3) Favor del día de un vecino (y visitas a tu casa).
// 4) Gatos, perros y palomas sueltos que reaccionan contigo. 5) Huerto por estaciones (8 cultivos de temporada).
// 6) Rutina de los hijos (escuela, jardín, cena y cama).     7) Cena en familia.   8) Diario de cada hijo.
// 9) Fotos de familia en la pared.  10) 🏠 Volver a casa.  11) Buscar en el inventario.  12) Avisos.
// 13) Cosechar todo y Bolsa de rescate (mochila llena).  14) Lista de compra.  15) Foto con temporizador y foto de familia.
// Nada de esto da fuerza nueva: solo oro, objetos, experiencia de oficio y comodidad.
SAVEKEYS.push('v74');
function V74() { const P = G.P; if (!P.v74 || typeof P.v74 !== 'object') P.v74 = {}; const S = P.v74;
  for (const [k, v] of [['lq', 0], ['favN', 0], ['wish', []], ['bag', []], ['ntf', {}], ['pics', []], ['din', -1], ['dinB', 0], ['homeT', 0], ['pets', 0], ['vis', -1], ['ndin', -1]]) if (S[k] === undefined) S[k] = Array.isArray(v) ? [] : (v && typeof v === 'object') ? {} : v;
  return S; }
const v74Try = f => function () { try { return f.apply(this, arguments); } catch (e) { console.warn('v574', e); } };
const v74H = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10007) / 10007; };
const v74Fem = () => { try { return normApp(G.P.app).g === 'f'; } catch (e) { return false; } };
const v74Weekend = () => calDay() % 7 >= 5;
const v74Sunday = () => calDay() % 7 === 6;

// =====================================================================================
// 1) HORARIOS DE LAS CIUDADES
// =====================================================================================
const V74_CITY = {
  lima: { re: /^pe_\d+$/, c: 'pe', a: 'pe_1' }, lima_norte: { re: /^pn_\d+$/, c: 'pe', a: 'pn_1' }, trujillo: { re: /^tr_\d+$/, c: 'pe', a: 'tr_1' },
  cusco: { re: /^(cz|tur)_\d+$/, c: 'pe', a: 'cz_1' }, machupicchu: { re: /^tur_\d+$/, c: 'pe', a: null },
  mexico: { re: /^mx_\d+$/, c: 'mx', a: 'mx_1' }, espana: { re: /^es_\d+$/, c: 'es', a: 'es_1' } };
function v74City() { const M = G.map; return M && V74_CITY[M.id] ? V74_CITY[M.id] : null; }
// fracción de gente en la calle según la hora (España cena tarde y duerme la siesta)
function v74Dens(h, c) {
  let d;
  if (h < 1) d = 0.24; else if (h < 5) d = 0.12; else if (h < 6) d = 0.25; else if (h < 7) d = 0.5; else if (h < 9) d = 0.85; else if (h < 13) d = 0.95;
  else if (h < 15) d = 0.9; else if (h < 19) d = 1; else if (h < 21) d = 0.8; else if (h < 22) d = 0.6; else d = 0.35;
  if (c === 'es') { if (h >= 14.5 && h < 17) d = 0.55; else if (h >= 21 && h < 23.5) d = 0.85; else if (h >= 23.5 || h < 1.5) d = 0.5; }
  if (c === 'mx' && h >= 19 && h < 23) d = Math.max(d, 0.75);   // la noche mexicana: tacos y plaza
  if (v74Sunday() && h >= 9 && h < 20) d = 1; else if (!v74Weekend() && h >= 9 && h < 18) d *= 0.92;
  return d; }
function v74Night() { const h = hourNow(); return h >= 22 || h < 5; }
const V74_SCH = { t: 0, lq: 0 };
function v74Schedule() { const M = G.map, C = v74City(); if (!M || !C || (typeof ACT !== 'undefined' && ACT.k)) return;
  const P = G.P, h = hourNow(), d = v74Dens(h, C.c), far = (x, y) => dist2(x, y, P.x, P.y) > 250 * 250;
  for (const e of G.ents) { if (e.type !== 'npc') continue; if (e.map !== M.id && e._v74h !== M.id) continue; if (!C.re.test(e.id) || e.v74keep || e.scene || e.follow) continue;
    const want = v74H(e.id + '|' + M.id) < d;
    if (!want && e.map === M.id) { if (far(e.x, e.y)) { e.map = 'hidden'; e._v74h = M.id; } }
    else if (want && e._v74h === M.id && e.map === 'hidden') { if (far(e.home.x, e.home.y)) { e.map = M.id; e._v74h = null; e.x = e.home.x; e.y = e.home.y; } } }
  v74Vendors(M, C); }

// ---------- vendedores que solo salen de noche ----------
const V74_NV = {
  lima: ['nv_lima', L2('Doña Carmen', 'Doña Carmen'), L2('Anticuchos de noche', 'Night anticuchos'), ['pl_anticuchos', 'pl_picarones', 'pl_chicha'], L2('¡Anticuchos calientitos, casero! De noche saben mejor.', 'Hot anticuchos, friend! They taste better at night.'), 'f'],
  lima_norte: ['nv_lnorte', L2('Don Wilmer', 'Don Wilmer'), L2('Carretilla nocturna', 'Night cart'), ['pe_pollo', 'pe_chaufa', 'pe_gaseosa'], L2('Salchipapa, pollito y su gaseosita. ¡Hasta la madrugada!', 'Fries, chicken and a soda. Open until dawn!'), 'm'],
  trujillo: ['nv_trujillo', L2('Señora Rosa', 'Señora Rosa'), L2('Picarones de la plaza', 'Square picarones'), ['pl_picarones', 'pl_mazamorra', 'pe_emoliente'], L2('Picarones con miel de chancaca. ¡El mejor bajativo de Trujillo!', 'Picarones with cane syrup. The best late-night treat in Trujillo!'), 'f'],
  cusco: ['nv_cusco', L2('Mama Justina', 'Mama Justina'), L2('Emoliente de la noche', 'Night emoliente'), ['pe_emoliente', 'pe_alfajor', 'pe_pan'], L2('Hace frío arriba en los Andes. Tómate un emoliente calientito.', 'It is cold up in the Andes. Have a hot emoliente.'), 'f'],
  mexico: ['nv_mexico', L2('Don Chuy', 'Don Chuy'), L2('Tacos de medianoche', 'Midnight tacos'), ['mx_tacos', 'mx_pozole', 'mx_horchata'], L2('¡Pásele, joven! Tacos al pastor hasta que salga el sol.', 'Come on in! Tacos al pastor until sunrise.'), 'm'],
  espana: ['nv_espana', L2('Manoli', 'Manoli'), L2('Churrería de madrugada', 'Dawn churro stand'), ['es_churros', 'es_bocadillo', 'es_horchata'], L2('¡Churros con chocolate para volver a casa, cariño!', 'Churros and chocolate on the way home, love!'), 'f'] };
for (const mid in V74_NV) { const [id, n, t, sell, line, g] = V74_NV[mid];
  NPCS[id] = { n, title: t, look: LK({ g, hairStyle: g === 'f' ? 'long' : 'short', hair: g === 'f' ? HAIRS.negro : HAIRS.castano, main: pal(['#5a1a1a', '#7a2a24', '#9a3a2e', '#c25a3e', '#e88a5a']), sec: pal(['#f0e8d8', '#f0e8d8', '#ffffff', '#ffffff', '#ffffff']) }), lines: [line, L2('De día no me encuentras: abro cuando la ciudad se apaga.', 'You will not find me by day: I open when the city goes dark.')], quests: [] };
  if (typeof PE_SELL !== 'undefined') PE_SELL[id] = sell.filter(x => ITEMS[x]); }
function v74Vendors(M, C) { const D = V74_NV[M.id]; if (!D) return; const h = hourNow(), open = h >= 19 || h < 4; let e = G.ents.find(q => q.type === 'npc' && q.id === D[0] && (q.map === M.id || q._v74h === M.id));
  if (!e && C.a) { const a = G.ents.find(q => q.type === 'npc' && q.id === C.a && (q.map === M.id || q._v74h === M.id)); if (!a) return; let x = a.home.x + 20, y = a.home.y;
    for (let k = 0; k < 12; k++) { const tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (!blockedFor(M, tx, ty, a.L || 0)) break; x += 16 * ((k % 3) - 1); y += 16 * (k % 2 ? 1 : -1); }
    e = spawnNPC(D[0], x, y, M.id, { face: 'down', wander: 0, L: a.L || 0 }); if (!e) return; e.v74nv = 1; }
  if (!e) return; if (!open && e.map === M.id) { e.map = 'hidden'; e._v74h = M.id; } else if (open && e.map === 'hidden') { e.map = M.id; e._v74h = null; } }
// farolito encendido junto al puesto nocturno
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !V74_NV[M.id]) return; const e = G.ents.find(q => q.v74nv && q.map === M.id); if (!e) return; const x = Math.round(e.x - cx), y = Math.round(e.y - cy);
  if (x < -40 || y < -60 || x > VW + 40 || y > VH + 60) return; ctx.save(); ctx.globalAlpha = 0.5 + 0.1 * Math.sin(G.t * 3); ctx.drawImage(glowSprite(30, ['#ffc860']), x - 30 + 14, y - 30 - 22); ctx.restore(); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x + 13, y - 22, 1, 22); ctx.fillStyle = '#ffd880'; ctx.fillRect(x + 12, y - 25, 3, 3); });

// ---------- loquitos de madrugada ----------
const V74_LQ = {
  pe: { n: L2('Loquito del barrio', 'Neighbourhood nutter'), say: [L2('¡Oe, tú! ¡Ven pe, causa!', 'Oi, you! Come here, mate!'), L2('¡¿Qué miras?! ¡Esta esquina es mía!', 'What are you looking at?! This corner is mine!'), L2('¡Ja, ja! ¡Te voy a chapar!', 'Ha ha! I am gonna catch you!'), L2('¡A ver, a ver, ¿quién eres tú?!', 'Well, well, who are you?!')] },
  mx: { n: L2('Loco de la cuadra', 'Crazy of the block'), say: [L2('¡Órale, tú! ¡Ven pa\'cá!', 'Hey, you! Get over here!'), L2('¡¿Qué me ves?!', 'What are you staring at?!'), L2('¡Esta cuadra es mía, carnal!', 'This block is mine, pal!'), L2('¡Ahorita vas a ver!', 'You are gonna see!')] },
  es: { n: L2('Chalado de la noche', 'Night loony'), say: [L2('¡Eh, tú! ¡Ven aquí, chaval!', 'Hey, you! Come here, kid!'), L2('¡¿Qué miras?!', 'What are you looking at?!'), L2('¡Esta calle es mía!', 'This street is mine!'), L2('¡Te vas a enterar!', 'You are in for it!')] } };
{ const dirt = a => pal(a);
  HLOOKS.lq1 = { body: 'normal', skin: SKINS[1], hair: HAIRS.negro, hairStyle: 'spiky', eyes: 'cafe', outfit: 'tunic', main: dirt(['#24221c', '#38352a', '#4e4a3a', '#66604c', '#807860']), sec: dirt(['#3a1410', '#5a2018', '#7a3024', '#9a4434', '#b85c48']), cloth: dirt(['#1a1612', '#2a241e', '#3a322a', '#4c4236', '#605444']), weapon: { k: 'club', tier: 0 } };
  HLOOKS.lq2 = { body: 'normal', skin: SKINS[2], hair: HAIRS.blanco, hairStyle: 'long', eyes: 'cafe', outfit: 'tunic', main: dirt(['#1a2230', '#26324a', '#344462', '#465a7c', '#5e7496']), sec: dirt(['#2a2a2a', '#3a3a3a', '#4e4e4e', '#666666', '#808080']), cloth: dirt(['#1e1a14', '#2e281e', '#40382a', '#544a38', '#6a5e48']), weapon: { k: 'club', tier: 0 } };
  HLOOKS.lq3 = { body: 'normal', skin: SKINS[0], hair: HAIRS.castano, hairStyle: 'spiky', eyes: 'cafe', outfit: 'rogue', main: dirt(['#1e2a1a', '#2c3e26', '#3c5434', '#506c44', '#688856']), sec: dirt(['#3a2a10', '#5a4018', '#7a5824', '#9a7232', '#b88c44']), cloth: dirt(['#141414', '#222222', '#323030', '#444040', '#585252']), hat: 'bandana', weapon: { k: 'club', tier: 0 } }; }
for (const c of ['pe', 'mx', 'es']) MOBS['lq_' + c] = { n: V74_LQ[c].n, art: ['hum', 'lq1'], reg: [], lv: [1, 1], hp: 1, atk: 0.8, def: 0.6, spd: 74, ai: 'aggro', fam: 'bandido', drops: [['pocion1', 0.25], ['pan', 0.2]] };
// fuerza adaptada a la tuya: unos 6-10 golpes para tumbarlo y unos 25-35 golpes suyos para tumbarte
function v74LqScale(m) { const P = G.P, S = P.S, lv = P.lv, crit = 1 + Math.min(65, S.crit || 0) / 100 * ((S.critD || 150) / 100 - 1);
  const hit = Math.max(1, (S.atk || 10) * dmgRedM(m.df, lv) * crit), hits = 6 + Math.random() * 4;
  m.hp = m.maxhp = Math.max(30, Math.round(hit * hits));
  m.atk = Math.max(3, Math.round((S.maxhp || 100) / (25 + Math.random() * 10) / dmgRedP(S.def || 0, lv)));
  m.xp = Math.round(m.xp * 1.4); m.gold = Math.round(m.gold * 3 + 20); }
function v74LqSpawn(M, C) { const P = G.P;
  const homes = G.ents.filter(e => e.type === 'npc' && (e._v74h === M.id) && C.re.test(e.id)).map(e => e.home).filter(h => { const d = dist2(h.x, h.y, P.x, P.y); return d > 130 * 130 && d < 300 * 300; });
  let at = null; for (let k = 0; k < 20 && !at; k++) { let x, y; if (homes.length) { const h = pick(homes); x = h.x; y = h.y; } else { const a = Math.random() * 6.283, r = 150 + Math.random() * 120; x = P.x + Math.cos(a) * r; y = P.y + Math.sin(a) * r; }
    const tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (tx > 1 && ty > 1 && tx < M.w - 2 && ty < M.h - 2 && !blockedFor(M, tx, ty, P.L)) at = { x, y }; }
  if (!at) return null; const m = spawnMob('lq_' + C.c, P.lv, at.x, at.y, P.L, null, false); if (!m) return null;
  const v = 1 + Math.floor(Math.random() * 3); m.atlas = mobAtlasFor(['hum', 'lq' + v]); m.lq = 1; m.noSafe = 1; m.aggroR = 230; m.name = V74_LQ[C.c].n; v74LqScale(m);
  m.chat = pick(V74_LQ[C.c].say); m.chatT = G.t; return m; }
function v74Loquitos(dt) { const M = G.map, P = G.P; if (!M || !P) return; const C = v74City(), night = v74Night();
  for (const m of G.ents) if (m.lq && !m.dying && (!C || m.map !== M.id || !night || dist2(m.x, m.y, P.x, P.y) > 620 * 620)) m.remove = true;
  if (!C || !night || P.dead || P.lv < 5 || (typeof ACT !== 'undefined' && ACT.k) || P.inside === 'hidden' || G.fading) return;
  for (const m of G.ents) if (m.lq && !m.dying && m.map === M.id && Math.random() < dt * 0.12) { m.chat = pick(V74_LQ[C.c].say); m.chatT = G.t; }
  V74_SCH.lq -= dt; if (V74_SCH.lq > 0) return; V74_SCH.lq = 28 + Math.random() * 30;
  const alive = G.ents.filter(m => m.lq && !m.dying && m.map === M.id).length; if (alive >= 2 || Math.random() > 0.45) return;
  if (v74LqSpawn(M, C)) { const S = V74(); if (!S.ntf.lq_off && (S._lqT || 0) < Date.now() - 120000) { S._lqT = Date.now(); toast('⚠ ' + L2('Un loquito de la madrugada te busca pleito. ¡Cuidado!', 'A late-night nutter is picking a fight with you. Careful!'), 'warn'); } } }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.lq) { const S = V74(); S.lq++; markDirty(); if (S.lq === 1 || S.lq % 10 === 0) toast('🌙 ' + L2('Loquitos calmados: ', 'Nutters calmed: ') + S.lq, 'info'); } } catch (e) { } return r; }; }

// =====================================================================================
// 2) RUMORES: lo que la gente dice de ti (sale de lo que de verdad has hecho)
// =====================================================================================
function v74Facts() { const P = G.P, S = V74(), out = [], f = v74Fem();
  const log = (P.heroLog || []).slice(-30), boss = log.filter(e => e.ic === '⚔').pop();
  if (boss) { const m = /a (.+)\.$/.exec(String(boss.t)) || /defeated (.+) for/.exec(String(boss.t)); if (m) out.push(L2('que venciste a ' + m[1], 'that you defeated ' + m[1])); }
  const nb = Object.keys(P.bossKills || {}).length; if (nb >= 3) out.push(L2('que ya llevas ' + nb + ' jefes distintos vencidos', 'that you have already beaten ' + nb + ' different bosses'));
  if (P.partner && NPCS[P.partner]) out.push(L2('que vives con ' + NPCS[P.partner].n + ' y que se os ve muy felices', 'that you live with ' + NPCS[P.partner].n + ' and you look very happy'));
  const ks = (P.kids || []).map(k => k.name).filter(Boolean); if (ks.length) out.push(L2('que tus hijos (' + ks.join(', ') + ') son igualitos a ti', 'that your children (' + ks.join(', ') + ') look just like you'));
  out.push(L2('que ya eres nivel ' + P.lv, 'that you are already level ' + P.lv));
  if (S.lq) out.push(L2('que de madrugada calmaste a ' + S.lq + ' loquito' + (S.lq > 1 ? 's' : '') + ' tú solit' + (f ? 'a' : 'o'), 'that you calmed ' + S.lq + ' late-night nutter' + (S.lq > 1 ? 's' : '') + ' all by yourself'));
  if (S.favN) out.push(L2('que ya hiciste ' + S.favN + ' favor' + (S.favN > 1 ? 'es' : '') + ' a los vecinos', 'that you have done ' + S.favN + ' favour' + (S.favN > 1 ? 's' : '') + ' for the neighbours'));
  if (P.jobs) { let bj = null; for (const k in P.jobs) if (JOBS[k] && (!bj || (P.jobs[k].lv || 0) > (P.jobs[bj].lv || 0))) bj = k; if (bj && P.jobs[bj].lv >= 10) out.push(L2('que eres de lo mejor en ' + JOBS[bj].n + ' (nivel ' + P.jobs[bj].lv + ')', 'that you are one of the best at ' + JOBS[bj].n + ' (level ' + P.jobs[bj].lv + ')')); }
  if (P.gold >= 1e6) out.push(L2('que tienes más oro que el banco', 'that you have more gold than the bank'));
  if (P.sr && typeof SR !== 'undefined' && SR[P.sr]) out.push(L2('que de noche te conviertes en ' + SR[P.sr].n.toLowerCase(), 'that at night you turn into a ' + SR[P.sr].n.toLowerCase()));
  if (S.pets >= 5) out.push(L2('que todos los gatos y perros de la calle te conocen', 'that every stray cat and dog knows you'));
  return out; }
const V74_RUMOR_HEAD = { pe: [L2('Oe, ¿sabías? Dicen ', 'Hey, did you know? They say '), L2('En el mercado se comenta ', 'At the market they say '), L2('Mi vecina me contó ', 'My neighbour told me ')],
  mx: [L2('Oye, ¿supiste? Dicen ', 'Hey, did you hear? They say '), L2('En la plaza se cuenta ', 'In the square they say '), L2('Mi comadre me dijo ', 'My friend told me ')],
  es: [L2('¿Te has enterado? Dicen ', 'Have you heard? They say '), L2('En el bar se comenta ', 'At the bar they say '), L2('Mi vecina del quinto dice ', 'My neighbour upstairs says ')],
  w: [L2('Por la aldea se dice ', 'Around the village they say '), L2('En la taberna cuentan ', 'At the tavern they say '), L2('He oído ', 'I have heard ')] };
function v74Rumor(c) { const F = v74Facts(); return pick(V74_RUMOR_HEAD[c] || V74_RUMOR_HEAD.w) + pick(F) + '.'; }
function v74IsCrowd(npc) { for (const k in V74_CITY) if (V74_CITY[k].re.test(npc.id)) return V74_CITY[k].c; return npc.def && npc.def.tf ? 'w' : null; }
DLG_HOOKS.push((npc, opts) => { try { const c = v74IsCrowd(npc); if (!c) return; opts.splice(Math.max(0, opts.length - 1), 0, { label: '👂 ' + L2('¿Qué se dice por aquí?', 'What is the word around here?'), icon: ['talk'], fn: () => typeText(v74Rumor(c)) }); } catch (e) { } });
// al pasar cerca, a veces cuchichean sobre ti
function v74Whisper() { const P = G.P, M = G.map; if (!M || P.dead || !v74City()) return; const C = v74City();
  for (const e of G.ents) { if (e.type !== 'npc' || e.map !== M.id || !C.re.test(e.id) || (e.chat && G.t - e.chatT < 8)) continue; if (dist2(e.x, e.y, P.x, P.y) > 56 * 56) continue;
    if ((e._v74w || 0) > G.t || Math.random() > 0.06) { e._v74w = G.t + 20; continue; } e._v74w = G.t + 60; const F = v74Facts(); if (!F.length) return;
    const t = pick([L2('¡Mira! Es ' + P.name + '…', 'Look! It is ' + P.name + '…'), L2('Psst… ', 'Psst… ') + L2('dicen ', 'they say ') + pick(F) + '…']); e.chat = t.length > 64 ? t.slice(0, 62) + '…' : t; e.chatT = G.t; return; } }

// =====================================================================================
// 3) FAVOR DEL DÍA y visitas de vecinos a tu casa
// =====================================================================================
function v74FavItem() { const P = G.P, J = P.jobs || {}, tierFor = (job, max) => { let t = 1; for (let k = 1; k <= max; k++) if (RESLV[k] !== undefined && (J[job] ? J[job].lv : 1) >= RESLV[k]) t = k; return t; }, pool = [];
  { const t = tierFor('tala', 11); if (ITEMS['log' + t]) pool.push(['log' + t, 'tala', t]); }
  { const t = tierFor('mineria', 11); if (ITEMS['ore' + t]) pool.push(['ore' + t, 'mineria', t]); }
  { const lv = J.pesca ? J.pesca.lv : 1, fs = FISH.filter(f => RESLV[f[2]] <= lv && ITEMS[f[0]]); if (fs.length) { const f = fs[Math.max(0, fs.length - 1 - Math.floor(Math.random() * 3))]; pool.push([f[0], 'pesca', f[2]]); } }
  { const lv = J.agricultura ? J.agricultura.lv : 1, cs = CROPS.filter(c => RESLV[c[2]] <= lv && ITEMS[c[0]]); if (cs.length) { const c = cs[cs.length - 1]; pool.push([c[0], 'agricultura', c[2]]); } }
  const C = v74City(); if (C && V74_NV[G.map.id] && ITEMS[V74_NV[G.map.id][3][0]]) pool.push([V74_NV[G.map.id][3][0], null, 3]);
  const [id, job, t] = pick(pool), q = 2 + Math.floor(Math.random() * 3); return { it: id, q, job, gold: Math.round((ITEMS[id].price || 20) * q * 3 + 150 + G.P.lv * 25), jx: job ? 30 + t * 30 : 0 }; }
function v74FavTick() { const P = G.P, M = G.map, S = V74(), d = calDay(); if (!M || !v74City() || P.dead) return; if (S.fav && S.fav.d === d) return;
  const C = v74City(), cand = G.ents.filter(e => e.type === 'npc' && e.map === M.id && C.re.test(e.id) && dist2(e.x, e.y, P.x, P.y) < 260 * 260 && dist2(e.x, e.y, P.x, P.y) > 60 * 60); if (!cand.length) return;
  const e = pick(cand); e.v74keep = 1; S.fav = Object.assign({ d, id: e.id, map: M.id, done: 0, nm: e.def.n }, v74FavItem()); markDirty();
  e.chat = '❗ ' + L2('¡Oye! ¿Me ayudas con algo?', 'Hey! Could you help me with something?'); e.chatT = G.t;
  if (!S.ntf.fav_off) toast('🤝 ' + L2('Un vecino te pide un favor (', 'A neighbour asks you a favour (') + e.def.n + ')', 'quest'); }
function v74FavText(F) { return L2('¿Me traes ', 'Could you bring me ') + F.q + '× ' + gName(F.it) + L2('? Te pago ', '? I will pay you ') + fmt(F.gold) + L2(' de oro', ' gold') + (F.jx ? L2(' y te enseño un truco de ' + JOBS[F.job].n, ' and teach you a ' + JOBS[F.job].n + ' trick') : '') + '.'; }
function v74FavDeliver(npc) { const P = G.P, S = V74(), F = S.fav; if (!F || F.done) return; const have = countItem(F.it);
  if (have < F.q) { const src = (typeof itemSources === 'function' ? itemSources(F.it) : []).find(s => s[1] && s[1].loc); typeText(v74FavText(F) + ' ' + L2('(Tienes ' + have + '.)', '(You have ' + have + '.)'));
    if (src) setOpts([{ label: '🧭 ' + L2('¿Dónde lo consigo? (flecha)', 'Where do I get it? (arrow)'), fn: () => { setWp(src[1]); closeDialog(); toast('🧭 ' + src[0], 'info'); } }, { label: L2('Vale', 'OK'), fn: () => dialogMenu() }]); return; }
  takeItem(F.it, F.q); P.gold += F.gold; if (F.jx && F.job) gainJobXp(F.job, F.jx); F.done = 1; S.favN++; markDirty(true); sfx('coin');
  burst(npc.x, npc.y - 20, 16, { sp: 50, up: 50, g: 60, life: 0.8, c: ['#ffd040', '#ff8ac0', '#ffffff'] }); npc.v74keep = 0;
  typeText(L2('¡Muchísimas gracias! Aquí tienes ', 'Thank you so much! Here are ') + fmt(F.gold) + L2(' de oro. ¡Eres lo máximo!', ' gold. You are the best!'));
  if (S.favN % 10 === 0) toast('🤝 ' + L2('¡' + S.favN + ' favores! Los vecinos hablan muy bien de ti.', S.favN + ' favours! The neighbours speak very well of you.'), 'quest'); }
DLG_HOOKS.push((npc, opts) => { try { const S = V74(), F = S.fav; if (F && !F.done && F.id === npc.id && F.d === calDay()) opts.unshift({ label: '🤝 ' + L2('Favor: ', 'Favour: ') + F.q + '× ' + esc(gName(F.it)), cls: 'quest', icon: ITEMS[F.it].icon, fn: () => v74FavDeliver(npc) }); } catch (e) { } });
// visitas a tu casa (de día, una vez al día como mucho)
NPCS.v74_vecina = { n: L2('Vecina Marta', 'Neighbour Marta'), title: L2('De visita', 'Visiting'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.castano, main: pal(['#2a4a2a', '#3a6a3a', '#4e8a4a', '#6aa860', '#8ac880']) }), lines: [L2('¡Pasaba por aquí y quise saludar!', 'I was passing by and wanted to say hi!'), L2('Qué bonita tienes la casa.', 'Your house is so pretty.')], quests: [] };
NPCS.v74_vecino = { n: L2('Vecino Tomás', 'Neighbour Tomás'), title: L2('De visita', 'Visiting'), look: LK({ g: 'm', hair: HAIRS.negro, main: pal(['#3a2a4a', '#4e3a66', '#664e86', '#8268a6', '#a088c4']), weapon: { k: 'cane', tier: 0 } }), lines: [L2('¡Buenas! Te traje algo del huerto.', 'Hi! I brought you something from my garden.'), L2('Tus hijos son un encanto.', 'Your children are lovely.')], quests: [] };
const V74_GIFT = [['pan', 2], ['ensalada', 1], ['trigo', 4], ['zanahoria', 3], ['tomate', 3], ['pe_alfajor', 2]];
function v74HomeVisit(M) { const S = V74(), d = calDay(), h = hourNow(); if (S.vis === d || h < 9 || h >= 19) return; S.vis = d; if (Math.random() > 0.55) return;
  const id = Math.random() < 0.5 ? 'v74_vecina' : 'v74_vecino', e = spawnNPC(id, 14 * 16 + 8 + (Math.random() < 0.5 ? -40 : 40), 19 * 16 + 8, M.id, { face: 'up', wander: 1, L: 0 }); if (!e) return; e.v74vis = 1; e.chat = L2('¡Hola, vecin' + (v74Fem() ? 'a' : 'o') + '!', 'Hello, neighbour!'); e.chatT = G.t + 1; }
DLG_HOOKS.push((npc, opts) => { try { if (!npc.v74vis || npc.v74gave) return; opts.unshift({ label: '🎁 ' + L2('Recibir su regalo', 'Accept the gift'), cls: 'quest', icon: ['coin'], fn: () => { npc.v74gave = 1; const g = pick(V74_GIFT.filter(x => ITEMS[x[0]])); if (g) giveItem(g[0], g[1]); typeText(L2('¡Para ti! Que lo disfrutes con tu familia.', 'For you! Enjoy it with your family.')); } }); } catch (e) { } });

// =====================================================================================
// 4) ANIMALES SUELTOS: gatos, perros y palomas (llamas extra en Cusco)
// =====================================================================================
const V74_AN = { gato: [{ b: '#e8a050', b2: '#fff0d8', ear: 'pointy', tail: 'thin', eye: '#3a8a2a' }, { b: '#2a2630', b2: '#4a4654', ear: 'pointy', tail: 'thin', eye: '#ffd040' }, { b: '#d8d8e0', b2: '#a8a8b8', ear: 'pointy', tail: 'thin', eye: '#4a8ad0' }],
  perro: [{ b: '#c8a070', b2: '#f0dcc0', ear: 'floppy', tail: 'thin', eye: '#2a1a10' }, { b: '#3a3030', b2: '#c89060', ear: 'pointy', tail: 'thin', eye: '#2a1a10' }, { b: '#f0ece4', b2: '#d8a878', ear: 'floppy', tail: 'puff', eye: '#2a1a10' }],
  paloma: [{ kind: 'bird', b: '#8a8e9a', b2: '#c8ccd8', eye: '#ff6a3a' }, { kind: 'bird', b: '#6a6e7a', b2: '#9aa0b0', eye: '#ff6a3a' }] };
function v74AnAtlas(k, v) { return getAtlas('V74AN' + k + v, () => { PETS.__v74 = { n: '', look: V74_AN[k][v] }; try { return genPet('__v74'); } finally { delete PETS.__v74; } }); }
function v74AnPlace(M, C) { if (M._v74an) return; M._v74an = 1; const P = G.P, R = new RNG(v74H(M.id) * 1e6 | 0);
  const homes = G.ents.filter(e => e.type === 'npc' && (e.map === M.id || e._v74h === M.id) && C.re.test(e.id)).map(e => ({ x: e.home.x, y: e.home.y, L: e.L || 0 })); if (!homes.length) return;
  let ai = 0; const put = (k, n) => { for (let i = 0; i < n; i++) { const akey = M.id + '#' + (ai++); const h = homes[R.int(0, homes.length - 1)], v = R.int(0, V74_AN[k].length - 1), x = h.x + R.int(-20, 20), y = h.y + R.int(-14, 14); if (blockedFor(M, Math.floor(x / 16), Math.floor(y / 16), h.L)) continue;
    V74_ANS.push({ type: 'san', ak: k, akey, v, atlas: v74AnAtlas(k, v), x, y, L: h.L, map: M.id, dir: 'down', anim: 'idle', af: 0, at: 0, shR: k === 'paloma' ? 3 : 4, home: { x, y }, st: R.f() * 3, z: 0, hw: 3, hh: 2, scale: k === 'paloma' ? 0.6 : 0.78 }); } };
  put('gato', 8); put('perro', 7); put('paloma', 14); for (const e of V74_ANS) if (e.map === M.id && !G.ents.includes(e)) G.ents.push(e);
  if (M.id === 'cusco' && NPCS.cz_llamita) for (let i = 0; i < 4; i++) { const a = G.ents.find(e => e.type === 'npc' && e.id === 'cz_1'); if (a) spawnNPC('cz_llamita', a.home.x + R.int(-40, 40), a.home.y + R.int(-20, 20), M.id, { wander: 3, noTag: 1 }); } }
const V74_ANS = [];
function v74AnTick(dt) { const M = G.map, P = G.P; if (!M || !M._v74an) return; const h = hourNow(), night = h >= 20 || h < 6;
  for (const e of V74_ANS) { if (e.map !== M.id && e._hid !== M.id) continue; if (dist2(e.x, e.y, P.x, P.y) > 700 * 700 && !e.fol) continue;
    // de noche las palomas duermen; los perros se quedan echados
    if (e.ak === 'paloma' && night) { if (e.map === M.id) { e.map = 'hidden'; e._hid = M.id; } continue; } else if (e._hid === M.id && !night) { e.map = M.id; e._hid = null; e.x = e.home.x; e.y = e.home.y; e.z = 0; e.fly = 0; }
    if (e.map !== M.id) continue; const d = Math.hypot(P.x - e.x, P.y - e.y), run = P.anim === 'walk' && (P.S && P.S.spd > 0);
    let tx = null, ty = null, sp = 26;
    if (e.ak === 'paloma') { if (e.fly > 0) { e.fly -= dt; e.z = Math.min(46, (e.z || 0) + dt * 60); e.x += e.fvx * dt; e.y += e.fvy * dt; e.dir = e.fvx < 0 ? 'left' : 'right'; setAnim(e, 'walk', true); stepAnim(e, dt, 12); if (e.fly <= 0) { e.x = e.home.x; e.y = e.home.y; e.z = 0; } continue; }
      if (d < 42) { e.fly = 5 + Math.random() * 3; const a = Math.atan2(e.y - P.y, e.x - P.x) + (Math.random() - 0.5); e.fvx = Math.cos(a) * 70; e.fvy = Math.sin(a) * 40; sfx && Math.random() < 0.3 && sfx('ui'); continue; } }
    else if (e.ak === 'gato') { if (d < 34 && run && !e.pet) { tx = e.x - (P.x - e.x) * 3; ty = e.y - (P.y - e.y) * 3; sp = 90; } }
    else if (e.ak === 'perro') { if (night && !e.fol) { setAnim(e, 'idle', true); stepAnim(e, dt, 2); continue; } if (d < 70 && !e.folT) { e.folT = G.t + 7 + Math.random() * 5; } if (e.folT && G.t < e.folT && d > 22) { tx = P.x + 14; ty = P.y + 6; sp = Math.min(110, d * 2); } else if (e.folT && G.t >= e.folT) { e.folT = G.t > e.folT + 30 ? 0 : e.folT; } }
    if (e.fol && G.t < e.fol) { if (d > 20) { tx = P.x - 14; ty = P.y + 8; sp = Math.min(140, d * 2.5); } } else if (e.fol) e.fol = 0;
    if (tx === null) { e.st -= dt; if (e.st <= 0) { e.st = 2 + Math.random() * 4; e.goal = Math.random() < 0.55 ? { x: e.home.x + (Math.random() - 0.5) * 70, y: e.home.y + (Math.random() - 0.5) * 40 } : null; } if (e.goal) { tx = e.goal.x; ty = e.goal.y; } }
    if (tx !== null) { const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy); if (L > 3) { moveEnt(M, e, dx / L * sp * dt, dy / L * sp * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, sp > 60 ? 12 : 8); } else { e.goal = null; setAnim(e, 'idle', true); } }
    else { setAnim(e, 'idle', true); stepAnim(e, dt, 2); } } }
// acariciar con ⚔ (el gato te sigue un rato si llevas pescado)
const V74_X = [];
V74_X.push(() => { const P = G.P, M = G.map; if (!M._v74an) return null; let b = null, bd = 26 * 26; for (const e of V74_ANS) { if (e.map !== M.id || e.ak === 'paloma') continue; const d = dist2(e.x, e.y, P.x, P.y); if (d < bd) { bd = d; b = e; } } if (!b) return null; if (G.ents.some(e => (e.type === 'npc' || e.type === 'kid') && e.map === M.id && dist2(e.x, e.y, P.x, P.y) < bd)) return null;
  return { label: b.ak === 'gato' ? L2('Acariciar al gato', 'Pet the cat') : L2('Acariciar al perro', 'Pet the dog'), icon: ['heart', '#ff8ac0'], fn: () => { const S = V74(), P = G.P; b.pet = 1; b.dir = dirFromVec(P.x - b.x, P.y - b.y); setAnim(b, 'idle'); P.dir = dirFromVec(b.x - P.x, b.y - P.y); setAnim(P, 'gather'); P.busy = 0.5;
    for (let k = 0; k < 4; k++) setTimeout(() => floatText(b.x + (Math.random() - 0.5) * 10, b.y - 14, '♥', '#ff6a9a'), k * 160);
    const fish = b.ak === 'gato' && P.inv.find(s => s && FISH.some(f => f[0] === s.id));
    if (fish) { takeItem(fish.id, 1); b.fol = G.t + 45; toast('🐟 ' + L2('Le diste ', 'You gave it ') + gName(fish.id) + L2(': el gato te sigue un rato.', ': the cat follows you for a while.'), 'info'); }
    else if (b.ak === 'perro') { b.fol = G.t + 30; b.folT = 0; }
    if (!b.petD || b.petD !== calDay()) { b.petD = calDay(); S.pets++; markDirty(); if (S.pets === 5 || S.pets === 25 || S.pets === 100) toast('🐾 ' + L2('¡Has hecho ' + S.pets + ' amigos peludos en la calle!', 'You have made ' + S.pets + ' furry friends on the street!'), 'quest'); }
    if (typeof v75PetHook === 'function') v75PetHook(b); sfx('ui'); } }; });

// =====================================================================================
// 5) HUERTO POR ESTACIONES
// =====================================================================================
// [id, nombre, inglés, color, estación (0 inv, 1 prim, 2 ver, 3 oto), crecimiento s, tier]
const V74_SC = [['col_invierno', 'Col de invierno', 'Winter cabbage', '#7ac06a', 0, 420, 3], ['naranja_nieve', 'Naranja de nieve', 'Snow orange', '#ffa030', 0, 540, 5],
  ['fresa', 'Fresa', 'Strawberry', '#ff3a5a', 1, 360, 2], ['arveja', 'Arveja', 'Garden pea', '#8ad050', 1, 480, 4],
  ['sandia', 'Sandía', 'Watermelon', '#3aa040', 2, 600, 5], ['maiz_morado', 'Maíz morado', 'Purple corn', '#6a2a8a', 2, 480, 4],
  ['castana', 'Castaña', 'Chestnut', '#8a5a2a', 3, 480, 4], ['manzana_roja', 'Manzana roja', 'Red apple', '#d82a2a', 3, 540, 5]];
const V74_SCROP = {};
for (const [id, n, en, col, s, grow, t] of V74_SC) { V74_SCROP[id] = s;
  it(id, { n: L2(n, en), t: 'mat', crop: 1, stack: true, tier: t, price: 6 * t * t + 30, icon: ['crop', col], rar: 2, d: L2('Cultivo de temporada. Se vende bien y es un buen regalo.', 'Seasonal crop. Sells well and makes a nice gift.') });
  it('sem_' + id, { n: L2('Semillas de ', 'Seeds: ') + L2(n, en), t: 'mat', seed: id, grow, stack: true, tier: t, price: 4 * t * t + 20, icon: ['seed', col], rar: 1, d: L2('De temporada: en ' + SEASONS[s].toLowerCase() + ' crece el doble de rápido y da una pieza más; fuera de temporada crece a la mitad.', 'Seasonal: in ' + ['winter', 'spring', 'summer', 'autumn'][s] + ' it grows twice as fast and yields one more; out of season it grows at half speed.') }); }
V33_TICKS.push(v74Try(() => { const P = G.P; if (!P || !P.farm) return; const now = Date.now(), dt = Math.min(5, (now - (P._v74fT || now)) / 1000); P._v74fT = now; if (dt <= 0) return; const s = seasonNow();
  for (const pid in P.farm) { const F = P.farm[pid], cs = V74_SCROP[F.c]; if (cs === undefined) continue; if (cs === s) F.t -= dt * 1000; else F.t += dt * 500; } }));
{ const _fa = farmAction; farmAction = function (o) { const P = G.P, F = P.farm && P.farm[o.pid], c = F && F.c, ripe = F && plotState(o).st === 3; const r = _fa.apply(this, arguments);
  try { if (ripe && V74_SCROP[c] === seasonNow()) giveItem(c, 1, true); if (ripe) v74HarvestAll(o); } catch (e) { console.warn(e); } return r; }; }
const V74_SEEDS = () => V74_SC.filter(x => x[4] === seasonNow()).map(x => 'sem_' + x[0]);
DLG_HOOKS.push((npc, opts) => { try { if (npc.def.shop !== 'farm') return; const P = G.P; for (const id of V74_SEEDS().reverse()) { const I = ITEMS[id]; opts.unshift({ label: '🌸 ' + I.n + ' ×5 · ' + fmt(I.price * 5) + L2(' oro', ' gold'), icon: I.icon, fn: () => { if (P.gold < I.price * 5) { typeText(L2('No te alcanza el oro.', 'You do not have enough gold.')); return; } P.gold -= I.price * 5; giveItem(id, 5); sfx('coin'); typeText(L2('¡Semillas de ' + SEASONS[seasonNow()].toLowerCase() + '! Plántalas ahora que es su temporada.', 'Seasonal seeds! Plant them now while it is their season.')); } }); } } catch (e) { } });

// =====================================================================================
// 13) COSECHAR TODO y BOLSA DE RESCATE
// =====================================================================================
let V74_HV = 0;
function v74HarvestAll(o0) { if (V74_HV) return; const P = G.P, M = G.map; if (!M || !M.objs) return; V74_HV = 1; let n = 0, rp = 0;
  try { for (const o of M.objs) { if (o.k !== 'plot' || o === o0 || !P.farm[o.pid] || plotState(o).st !== 3) continue; farmAction(o); n++; }
    // vuelve a sembrar los huertos vacíos con las semillas que lleves
    for (const o of M.objs) { if (o.k !== 'plot' || P.farm[o.pid]) continue; if (!P.inv.some(s => s && ITEMS[s.id] && ITEMS[s.id].seed && P.jobs.agricultura.lv >= (RESLV[ITEMS[s.id].tier] || 1))) break; if (dist2(o.px, o.py, P.x, P.y) > 220 * 220) continue; farmAction(o); rp++; }
  } finally { V74_HV = 0; P.busy = 0.5; }
  if (n || rp) toast('🧺 ' + L2('Cosechado todo: ', 'Harvested all: ') + (n + 1) + (rp ? L2(' · resembrados ', ' · replanted ') + rp : ''), 'job'); }
{ const _gi = giveItem; giveItem = function (id, q = 1, silent) { const r = _gi.apply(this, arguments); try { if (r === false && ITEMS[id] && ITEMS[id].t !== 'cos' && G.P && G.P.inv.length >= INV_MAX) { const S = V74(); if (S.bag.length < 80) { const it = ITEMS[id], s = it.stack && S.bag.find(b => b.id === id); if (s) s.q += q; else S.bag.push({ id, q: it.stack ? q : 1 }); if ((S._bagT || 0) < G.t - 6) { S._bagT = G.t; toast('📦 ' + L2('Mochila llena: lo guardé en la Bolsa de rescate (▦ Atajos › 🧺)', 'Bag full: kept in the Rescue bag (▦ Shortcuts › 🧺)'), 'warn'); } markDirty(); return true; } } } catch (e) { } return r; }; }
function v74BagTake() { const S = V74(); let n = 0; while (S.bag.length && G.P.inv.length < INV_MAX) { const b = S.bag.shift(); if (!ITEMS[b.id]) continue; const it = ITEMS[b.id]; if (it.stack) { const s = G.P.inv.find(x => x && x.id === b.id); if (s) s.q += b.q; else G.P.inv.push({ id: b.id, q: b.q }); } else G.P.inv.push({ id: b.id }); n++; }
  uiDirty.inv = true; markDirty(true); toast(n ? '📦 ' + L2('Recogiste ' + n + ' objetos', 'Picked up ' + n + ' items') + (S.bag.length ? L2(' (sigue llena la mochila)', ' (bag still full)') : '') : L2('La mochila sigue llena.', 'The bag is still full.'), n ? 'loot' : 'warn'); }
function v74BagSell() { const S = V74(); let g = 0; for (const b of S.bag) if (ITEMS[b.id] && ITEMS[b.id].t !== 'quest') g += Math.floor((ITEMS[b.id].price || 0) * 0.4) * (b.q || 1); S.bag = S.bag.filter(b => ITEMS[b.id] && ITEMS[b.id].t === 'quest'); G.P.gold += g; markDirty(true); sfx('coin'); toast('+' + fmt(g) + L2(' oro', ' gold'), 'loot'); }

// =====================================================================================
// 6) RUTINA DE LOS HIJOS · 7) CENA EN FAMILIA · 9) FOTOS EN LA PARED
// =====================================================================================
function v74HomeMap() { const M = G.map; return M && M.bnew && M.home && !isUpper(M.id) && isHome(M.id) ? M : null; }
const V74_GARDEN = [[12, 18], [16, 18], [13, 20], [15, 20], [11, 19]], V74_BED = [[21, 12], [23, 13], [22, 11]], V74_TABLE = [[15, 7], [17, 7], [18, 6], [14, 6]];
function v74KidPhase() { const h = hourNow(), wd = !v74Weekend(); if (h >= 22 || h < 7) return 'bed'; if (wd && h >= 8 && h < 14) return 'school'; if (h >= 19) return 'dinner'; if (h >= 14 || !wd) return 'garden'; return 'home'; }
function v74KidRoutine() { const M = v74HomeMap(); if (!M) return; const ph = v74KidPhase(); let i = 0;
  // vuelven de la escuela: si falta alguno en casa, aparece
  if (ph !== 'school') for (const k of G.P.kids || []) { if (k.follow || k.explore || kidStage(k) !== 1 || k.ret) continue; if (!G.ents.some(q => q.type === 'kid' && q.kid === k && !q.remove)) { const e = kidEnt(k, M.id, 14 * 16 + 8, 14 * 16 + 8); e.chat = L2('¡Ya volví!', 'I am back!'); e.chatT = G.t; } }
  for (const e of G.ents) { if (e.type !== 'kid' || e.map !== M.id || e.remove) continue; const k = e.kid; if (!k || k.follow || k.explore || e.down) continue; const st = kidStage(k), my = i++;
    if (ph === 'school' && st === 1) { e.remove = true; v74KidDia(k, '🏫', v74School(k)); continue; }
    if (e._v74ph === ph) continue; e._v74ph = ph; e._sleep = ph === 'bed';
    const spot = ph === 'garden' ? V74_GARDEN[my % V74_GARDEN.length] : ph === 'bed' ? V74_BED[my % V74_BED.length] : ph === 'dinner' ? V74_TABLE[my % V74_TABLE.length] : null;
    if (spot) { e.x = e.home.x = spot[0] * 16 + 8; e.y = e.home.y = spot[1] * 16 + 8; e.goal = null; } } }
{ const _uk = updateKid; updateKid = function (e, dt) { if (e && e._sleep && !e.kid.follow && v74HomeMap()) { setAnim(e, 'idle', true); e.dir = 'down'; if (Math.random() < dt * 0.6) floatText(e.x + 4, e.y - 20, 'z', '#c8d8ff'); return; } return _uk.apply(this, arguments); }; }
{ const _hf = homeFamily; homeFamily = function (M) { const r = _hf.apply(this, arguments); try { if (v74KidPhase() === 'school' && M && M.bnew && !isUpper(M.id)) for (const e of G.ents) if (e.type === 'kid' && e.map === M.id && !e.kid.follow && kidStage(e.kid) === 1) e.remove = true; } catch (e) { } return r; }; }
const V74_SUBJ = [L2('Hoy aprendí a contar hasta cien', 'Today I learned to count to a hundred'), L2('Hice un dibujo de mi familia en clase', 'I drew my family in class'), L2('Me pusieron una estrella dorada', 'I got a gold star'), L2('Aprendí la historia de los Tejedores', 'I learned the story of the Weavers'), L2('Jugué al fútbol en el recreo', 'I played football at break'), L2('Leí mi primer cuento sin ayuda', 'I read a story all by myself'), L2('Hice un amigo nuevo en el colegio', 'I made a new friend at school')];
function v74School(k) { return pick(V74_SUBJ) + '.'; }
// al llegar a casa de noche te reciben
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); try { const P = G.P; P._v74in = G.t;
    if (M && M.bnew && M.home && !isUpper(M.id) && isHome(M.id)) { for (const e of G.ents) if (e.type === 'kid' && e.map === M.id) e._v74ph = null; setTimeout(v74Try(() => { v74KidRoutine(); const ph = v74KidPhase(), kids = G.ents.filter(e => e.type === 'kid' && e.map === M.id && !e.kid.follow);
      if (ph === 'school' && (P.kids || []).some(k => kidStage(k) === 1 && !k.follow && !k.explore)) toast('🏫 ' + L2('Tus hijos están en la escuela. Vuelven a las 14:00.', 'Your children are at school. They come back at 14:00.'), 'info');
      if ((ph === 'dinner' || ph === 'bed') && kids.length) { const e = kids[0]; e.chat = ph === 'bed' ? L2('Zzz… (¡llegaste!)…', 'Zzz… (you are home!)…') : L2('¡Llegaste! Te esperábamos para cenar.', 'You are home! We waited for you for dinner.'); e.chatT = G.t; }
      v74HomeVisit(M); }), 400); }
    if (M && V74_CITY[M.id]) setTimeout(v74Try(() => { v74Schedule(); v74AnPlace(M, V74_CITY[M.id]); if (v74Night() && !V74().ntf.lq_off && G.P.lv >= 5) toast('🌙 ' + L2('Es de madrugada: hay poca gente y algunos loquitos buscan pleito.', 'It is late at night: few people around and some nutters are looking for trouble.'), 'warn'); }), 300);
  } catch (e) { console.warn(e); } return r; }; }
// cena: en la mesa del salón, de 19:00 a 23:00, con tu pareja o tus hijos
V74_X.push(() => { const M = v74HomeMap(), P = G.P; if (!M) return null; const h = hourNow(); if (h < 18.5 || h >= 23.5) return null; if (dist2(P.x, P.y, 16.5 * 16, 7 * 16) > 40 * 40) return null;
  const fam = !!P.partner || (P.kids || []).some(k => kidStage(k) >= 1); if (!fam) return null; if (V74().din === calDay()) return null;
  return { label: L2('Cenar en familia', 'Family dinner'), icon: ['food', 5], fn: v74Dinner }; });
function v74Dinner() { const P = G.P, S = V74(), M = G.map; S.din = calDay(); S.dinB = Date.now() + 30 * 60000; P.hp = P.S.maxhp; P.mp = P.S.maxmp; markDirty(true);
  const pe = G.ents.find(e => e.type === 'npc' && e.map === M.id && e.atHome); if (pe) { pe.x = 15 * 16 + 8; pe.y = 7 * 16 + 8; pe.dir = 'right'; pe.chat = L2('¡Qué rico te quedó!', 'This is delicious!'); pe.chatT = G.t; }
  try { if (P.partner && typeof rel === 'function') { const R = rel(P.partner); if (R && typeof R.a === 'number') R.a = Math.min(R.amax || 1000, R.a + 5); } } catch (e) { }
  for (const e of G.ents) if (e.type === 'kid' && e.map === M.id && !e.kid.follow) { v74KidDia(e.kid, '🍽', L2('Cenamos todos juntos en casa.', 'We all had dinner together at home.')); e.chat = pick([L2('¡Más puré!', 'More mash!'), L2('¿Me cuentas una aventura?', 'Will you tell me an adventure?'), L2('¡Te quiero!', 'Love you!')]); e.chatT = G.t + Math.random(); }
  burst(16.5 * 16, 6 * 16, 18, { sp: 30, up: 40, g: -10, life: 1, c: ['#ffd080', '#ffffff', '#ff9a6a'] }); sfx('level');
  toast('🍽 ' + L2('Cena en familia: vida y maná llenos y +15 % de experiencia de oficio durante 30 min.', 'Family dinner: full health and mana and +15% job experience for 30 min.'), 'quest', 5);
  if (!S.pics.length || S.pics[S.pics.length - 1].k !== 'din' || S.pics[S.pics.length - 1].d < calDay() - 6) v74Photo('din', L2('Cena en familia', 'Family dinner')); }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { const P = G.P; if (P && P.v74 && P.v74.dinB > Date.now() && n > 0) n = Math.max(1, Math.round(n * 1.15)); return _gj.call(this, job, n, ...[].slice.call(arguments, 2)); }; }

// ---------- 9) fotos de familia ----------
function v74PhotoCanvas() { const P = G.P, W = 84, H = 60, c = mkCanvas(W, H), g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#ffd8a0'); sky.addColorStop(1, '#f0a070'); g.fillStyle = sky; g.fillRect(0, 0, W, H); g.fillStyle = '#8a5a3a'; g.fillRect(0, H - 12, W, 12); g.fillStyle = '#a8704a'; g.fillRect(0, H - 12, W, 2);
  const ppl = []; ppl.push([playerAtlas(P), 1]); if (P.partner && NPCS[P.partner]) ppl.push([npcAtlas(P.partner), 1]); for (const k of (P.kids || []).slice(0, 3)) { if (kidStage(k) === 0) continue; ppl.push([kidAtlas(k), kidStage(k) === 1 ? 0.78 : 0.92]); }
  const n = ppl.length, step = Math.min(26, (W - 10) / Math.max(1, n)); ppl.forEach(([A, s], i) => { if (!A || !A.img) return; const fw = A.fw * s, fh = A.fh * s, x = W / 2 - (n - 1) * step / 2 + i * step - fw / 2, y = H - 6 - fh; try { g.drawImage(A.img, (A.idx.idle || 0) * A.fw, 0, A.fw, A.fh, Math.round(x), Math.round(y), Math.round(fw), Math.round(fh)); } catch (e) { } });
  return c; }
function v74Photo(k, t) { const S = V74(); let url; try { url = v74PhotoCanvas().toDataURL('image/png'); } catch (e) { return; } S.pics.push({ k, t, d: calDay(), url }); while (S.pics.length > 6) S.pics.shift(); V74_IMG.clear(); markDirty(true); toast('🖼 ' + L2('Nueva foto de familia en la pared de tu casa', 'New family photo on your house wall'), 'info'); }
const V74_IMG = new Map(); function v74Img(url) { let im = V74_IMG.get(url); if (!im) { im = new Image(); im.src = url; V74_IMG.set(url, im); } return im; }
WORLD_DRAW.push((cx, cy) => { const M = v74HomeMap(); if (!M) return; const S = V74(), L_ = S.pics.slice(-3); L_.forEach((p, i) => { const im = v74Img(p.url); if (!im.complete) return; const x = Math.round((20.4 + i * 1.55) * 16 - cx), y = Math.round(3 * 16 + 1 - cy);
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 1, y - 1, 24, 18); ctx.fillStyle = '#d8b060'; ctx.fillRect(x, y, 22, 16); ctx.drawImage(im, x + 1, y + 1, 20, 14); }); });
V74_X.push(() => { const M = v74HomeMap(), P = G.P; if (!M || !V74().pics.length) return null; if (dist2(P.x, P.y, 22 * 16, 4.6 * 16) > 30 * 30 || P.dir !== 'up') return null; return { label: L2('Ver fotos de familia', 'See family photos'), icon: ['heart', '#ffd040'], fn: v74PicsOpen }; });
function v74PicsOpen() { const S = V74(); openModal(`<div class="frame"><h3>🖼 ${L2('Fotos de familia', 'Family photos')}</h3><p class="hint">${L2('Se hacen solas en la boda, al nacer un hijo, cuando crece y en las cenas en familia. Las 3 últimas cuelgan en el salón.', 'They are taken by themselves at the wedding, when a child is born, when they grow up and at family dinners. The last 3 hang in the living room.')}</p>
  <div style="display:flex;flex-wrap:wrap;gap:.5em;justify-content:center;max-height:55vh;overflow:auto">${S.pics.slice().reverse().map(p => `<figure style="margin:0;text-align:center"><img src="${p.url}" style="width:168px;height:120px;image-rendering:pixelated;border:3px solid #d8b060;border-radius:3px"><figcaption><small>${esc(p.t)} · ${L2('día ', 'day ')}${p.d + 1}</small></figcaption></figure>`).join('') || `<p class="hint">${L2('Aún no hay fotos.', 'No photos yet.')}</p>`}</div>
  <div class="row"><button class="btn gold" id="v74pNew">📷 ${L2('Foto de familia ahora', 'Family photo now')}</button><button class="btn" id="v74pX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#v74pX').onclick = closeModal; $('#v74pNew').onclick = () => { v74Photo('man', L2('Foto de familia', 'Family photo')); v74PicsOpen(); }; }
// fotos solas: boda, nacimiento, cada vez que un hijo crece
let v74FamT = 0; V33_TICKS.push(v74Try(dt => { v74FamT += dt || 0.016; if (v74FamT < 3) return; v74FamT = 0; const P = G.P; if (!P || !P.S) return; const S = V74();
  const snap = { p: P.partner || null, k: (P.kids || []).map(k => k.id + ':' + kidStage(k)) };
  if (S.famSnap) { if (snap.p && snap.p !== S.famSnap.p) v74Photo('boda', L2('Nuestra boda', 'Our wedding'));
    for (const s of snap.k) if (!S.famSnap.k.includes(s)) { const [id, st] = s.split(':'), k = (P.kids || []).find(q => String(q.id) === id); if (!k) continue;
      if (!S.famSnap.k.some(x => x.split(':')[0] === id)) { v74Photo('bebe', L2('Llegó ', 'Welcome, ') + (k.name || '')); v74KidDia(k, '👶', L2('¡Nací! Mi familia me recibió con muchos abrazos.', 'I was born! My family welcomed me with lots of hugs.')); }
      else { v74Photo('crece', (k.name || '') + L2(' ha crecido', ' has grown up')); v74KidDia(k, st === '2' ? '🎓' : '🌱', st === '2' ? L2('¡Ya soy mayor! Ahora puedo luchar al lado de mi familia.', 'I am grown up! Now I can fight beside my family.') : L2('Ya no soy un bebé: ¡ya camino y juego en el jardín!', 'I am not a baby any more: I walk and play in the garden!')); } } }
  S.famSnap = snap; }));

// =====================================================================================
// 8) DIARIO DE CADA HIJO
// =====================================================================================
function v74KidDia(k, ic, t) { if (!k) return; k.dia = k.dia || []; const d = calDay(); if (k.dia.some(e => e.d === d && e.ic === ic)) return; k.dia.push({ d, ic, t }); if (k.dia.length > 60) k.dia.shift(); markDirty(); }
function v74KidDiaOpen(k) {
  const dia = (k.dia || []).slice().reverse(), xp = (k.log || []);
  openModal(`<div class="frame"><h3>📖 ${L2('Diario de ', 'Diary of ') + esc(k.name || '')}</h3><p class="hint">${L2('Lo escribe solo: la escuela, las cenas, cuando creció y sus expediciones.', 'Written by themselves: school, dinners, growing up and their expeditions.')}</p>
  <div style="max-height:52vh;overflow:auto">${dia.map(e => `<div class="gsrc"><span><b>${e.ic} ${esc(e.t)}</b><br><small>${L2('Día ', 'Day ')}${e.d + 1}</small></span></div>`).join('')}
  ${xp.length ? `<h4>🧭 ${L2('Expediciones', 'Expeditions')}</h4>` + xp.map(([ts, s]) => `<div class="gsrc"><span>${esc(s)}<br><small>${new Date(ts).toLocaleString()}</small></span></div>`).join('') : ''}
  ${!dia.length && !xp.length ? `<p class="hint">${L2('Aún no ha escrito nada.', 'Nothing written yet.')}</p>` : ''}</div><div class="row"><button class="btn" id="v74kdX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#v74kdX').onclick = closeModal; }
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (!k || e.fam || !(G.P.kids || []).includes(k)) return r; const row = $('#modal .row'); if (row && !$('#v74kd')) { row.insertAdjacentHTML('afterbegin', `<button class="btn sm" id="v74kd">📖 ${L2('Su diario', 'Their diary')}</button>`); $('#v74kd').onclick = () => v74KidDiaOpen(k); } } catch (er) { } return r; }; }

// =====================================================================================
// 10) 🏠 VOLVER A CASA (cada 15 minutos)
// =====================================================================================
const V74_HOME_CD = 15 * 60000;
function v74HomeDoor() { const P = G.P, W = G.world; if (!W || !P.homes) return null; const ids = Object.keys(P.homes).filter(id => !isUpper(id)); const pref = V74().homeId; if (pref && ids.includes(pref)) ids.unshift(pref);
  for (const id of ids) { const d = (W.doors || []).find(q => q.to === id); if (d) return d; } return null; }
function v74GoHome() { const P = G.P, S = V74(), d = v74HomeDoor();
  if (!d) { toast(L2('Aún no tienes casa en el mundo. Compra una leyendo el cartel «Se vende».', 'You do not have a house in the world yet. Buy one by reading a «For sale» sign.'), 'warn'); return; }
  if (P.dead) return; if (typeof ACT !== 'undefined' && ACT.k) { toast(L2('Termina primero lo que estás haciendo.', 'Finish what you are doing first.'), 'warn'); return; }
  if (G.map && G.map.id === d.to) { toast(L2('Ya estás en casa.', 'You are already home.'), 'info'); return; }
  if (G.ents.some(m => m.type === 'mob' && m.map === P.map && !m.dying && (m.boss || m.state === 'chase' || m.lq) && dist2(m.x, m.y, P.x, P.y) < 220 * 220)) { toast(L2('No puedes irte en mitad de una pelea.', 'You cannot leave in the middle of a fight.'), 'warn'); return; }
  if (/^dg|mazmorra|dawn|foosha|little_garden|shells|alvida/.test(String(P.map))) { toast(L2('Desde aquí no se puede volver a casa.', 'You cannot go home from here.'), 'warn'); return; }
  const left = S.homeT + V74_HOME_CD - Date.now(); if (left > 0) { toast('🏠 ' + L2('Podrás volver a casa en ', 'You can go home again in ') + Math.ceil(left / 60000) + ' min', 'warn'); return; }
  if (P.riding || G.fading) { toast(L2('Ahora no puedes: baja primero del vehículo.', 'Not now: get off the vehicle first.'), 'warn'); return; }
  S.homeT = Date.now(); markDirty();
  addFx({ type: 'ring', x: P.x, y: P.y, r: 30, dur: 0.6, col: '#ffd040' }); burst(P.x, P.y - 12, 20, { sp: 60, up: 60, g: 20, life: 0.7, c: ['#ffd040', '#ffffff', '#ff9ad0'] });
  setTimeout(v74Try(() => { if (!G.fading) enterInterior(d); }), 350); }

// =====================================================================================
// 11) BUSCAR EN EL INVENTARIO (y filtro «Oficio»)
// =====================================================================================
const V74_INV = { q: '', job: 0 };
function v74InvJob(it) { return it && (it.t === 'tool' || it.seed || it.crop || /^(log|ore|herb)\d+$/.test(it.id || '') || FISH.some(f => f[0] === it.id) || it.id === 'lombriz' || /^pz_/.test(it.id || '')); }
function v74InvApply(root) { const P = G.P, q = V74_INV.q.trim().toLowerCase(); root.querySelectorAll('.invL .slot').forEach(b => { if (!b.dataset.i) { b.style.display = q || V74_INV.job ? 'none' : ''; return; } const s = P.inv[+b.dataset.i], it = s && ITEMS[s.id]; let ok = true;
  if (q && !(it && String(it.n).toLowerCase().includes(q))) ok = false; if (V74_INV.job && !v74InvJob(Object.assign({ id: s && s.id }, it))) ok = false; b.style.display = ok ? '' : 'none'; }); }
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const root = B || document, chips = root.querySelector('.invL .chips'); if (!chips) return r;
  if (!chips.querySelector('#v74job')) { chips.insertAdjacentHTML('beforeend', `<button class="chip ${V74_INV.job ? 'on' : ''}" id="v74job">⚒ ${L2('Oficio', 'Jobs')}</button><input id="v74q" class="v74q" placeholder="🔎 ${L2('Buscar…', 'Search…')}" value="${esc(V74_INV.q)}" autocomplete="off">`);
    root.querySelector('#v74job').onclick = () => { V74_INV.job = V74_INV.job ? 0 : 1; renderPanel(); }; const inp = root.querySelector('#v74q'); inp.oninput = () => { V74_INV.q = inp.value; v74InvApply(root); }; inp.onkeydown = ev => ev.stopPropagation(); }
  v74InvApply(root);
  // 14) lista de compra desde el inventario
  const P = G.P, s = P.inv[invSel], R = root.querySelector('.invR'); if (s && R && ITEMS[s.id] && !R.querySelector('#v74wish')) { const row = R.querySelector('.row') || R, on = V74().wish.includes(s.id);
    row.insertAdjacentHTML('beforeend', `<button class="btn ${on ? 'gold' : ''}" id="v74wish">📝 ${on ? L2('En la lista', 'On the list') : L2('A la lista', 'Add to list')}</button>`); R.querySelector('#v74wish').onclick = () => { v74WishToggle(s.id); renderPanel(); }; }
  } catch (e) { console.warn(e); } return r; }; }

// =====================================================================================
// 14) LISTA DE COMPRA (con flecha a donde se consigue)
// =====================================================================================
function v74WishToggle(id) { const S = V74(), i = S.wish.indexOf(id); if (i >= 0) S.wish.splice(i, 1); else { if (S.wish.length >= 20) { toast(L2('La lista tiene 20 cosas como mucho.', 'The list holds 20 things at most.'), 'warn'); return; } S.wish.push(id); toast('📝 ' + L2('Añadido a la lista: ', 'Added to the list: ') + gName(id), 'info'); } markDirty(); }
{ const _ag = afterGive; afterGive = function (id) { const r = _ag.apply(this, arguments); try { const S = G.P.v74; if (S && S.wish && S.wish.includes(id) && (S._wT || {})[id] !== calDay()) { S._wT = S._wT || {}; S._wT[id] = calDay(); toast('📝 ' + L2('¡Ya tienes ', 'You now have ') + gName(id) + L2(' de tu lista!', ' from your list!'), 'quest'); } } catch (e) { } return r; }; }

// =====================================================================================
// 12) AVISOS
// =====================================================================================
const V74_NTF = [['crop', '🌾', L2('Cosecha lista', 'Crop ready')], ['kid', '🧭', L2('Hallazgos de los hijos en expedición', 'Children\'s expedition finds')], ['din', '🍽', L2('Hora de cenar en familia', 'Family dinner time')], ['fav', '🤝', L2('Favores de vecinos', 'Neighbour favours')], ['lq', '🌙', L2('Loquitos de madrugada', 'Late-night nutters')]];
let v74NtT = 0; V33_TICKS.push(v74Try(dt => { v74NtT += dt || 0.016; if (v74NtT < 3) return; v74NtT = 0; const P = G.P; if (!P || !P.S) return; const S = V74(), off = k => S.ntf[k + '_off'];
  if (!off('crop') && P.farm) { let n = 0; for (const pid in P.farm) { const F = P.farm[pid], sd = ITEMS['sem_' + F.c]; if (!sd || F.v74n) continue; const g = sd.grow / (typeof cropEventMul === 'function' ? cropEventMul() : 1); if ((Date.now() - F.t) / 1000 >= g) { F.v74n = 1; n++; } } if (n) toast('🌾 ' + L2(n + (n > 1 ? ' cultivos listos' : ' cultivo listo') + ' para cosechar', n + ' crop' + (n > 1 ? 's' : '') + ' ready to harvest'), 'job'); }
  if (!off('kid')) for (const k of P.kids || []) { if (!k.explore || !k.log || !k.log.length) continue; const ts = k.log[0][0]; if (k.v74lt === undefined) { k.v74lt = ts; continue; } if (ts > k.v74lt) { k.v74lt = ts; toast('🧭 ' + (k.name || '') + ': ' + k.log[0][1], 'info'); break; } }
  if (!off('din') && (P.partner || (P.kids || []).length)) { const h = hourNow(); if (h >= 19 && h < 19.6 && S.ndin !== calDay() && S.din !== calDay()) { S.ndin = calDay(); toast('🍽 ' + L2('Son las siete: tu familia te espera para cenar en casa (▦ Atajos › 🏠).', 'It is seven o\'clock: your family is waiting for dinner at home (▦ Shortcuts › 🏠).'), 'info', 4); } } }));

// =====================================================================================
// 15) FOTO: temporizador de 3 s y foto de familia
// =====================================================================================
if (typeof photoMode === 'function') { const _pm = photoMode; photoMode = function (on) { const r = _pm.apply(this, arguments); try { const d = $('#photoBar'); if (on && d && !$('#v74tm')) { const last = d.querySelector('.phr:last-child');
  last.insertAdjacentHTML('afterbegin', `<button class="btn" id="v74tm">⏱ 3 s</button><button class="btn" id="v74fam">👨‍👩‍👧 ${L2('Familia', 'Family')}</button>`);
  $('#v74tm').onclick = () => { d.style.visibility = 'hidden'; let n = 3; const tick = () => { if (n > 0) { floatText(G.P.x, G.P.y - 44, String(n), '#ffffff', true); n--; setTimeout(tick, 1000); } else { d.style.visibility = ''; photoShot(); } }; tick(); };
  $('#v74fam').onclick = () => { if (!G.P.partner && !(G.P.kids || []).length) { toast(L2('Necesitas pareja o hijos para la foto de familia.', 'You need a partner or children for a family photo.'), 'warn'); return; } v74Photo('man', L2('Foto de familia', 'Family photo')); }; } } catch (e) { } return r; }; }

// =====================================================================================
// INTERACCIONES (⚔ cerca) y TICK
// =====================================================================================
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (P && M && !P.dead) for (const f of V74_X) { let x = null; try { x = f(); } catch (e) { } if (x) return { kind: 'v74x', label: x.label, icon: x.icon, fn: x.fn }; } return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function (it) { it = it || interactTarget(); if (it && it.kind === 'v74x') { it.fn(); return; } return _di.apply(this, arguments); }; }
V33_TICKS.push(v74Try(dt => { const P = G.P; if (!P || !G.map) return; dt = dt || 0.016; V74_SCH.t -= dt;
  if (V74_SCH.t <= 0) { V74_SCH.t = 1; v74Schedule(); v74FavTick(); v74KidRoutine(); v74Whisper(); const C = v74City(); if (C) v74AnPlace(G.map, C); }
  V74_SCH.lt = (V74_SCH.lt || 0) + dt; if (V74_SCH.lt >= 0.25) { v74Loquitos(V74_SCH.lt); V74_SCH.lt = 0; } v74AnTick(dt); }));

// =====================================================================================
// ATAJOS: 🏠 Volver a casa · 🧺 Vida diaria (lista, bolsa, favor, avisos, fotos)
// =====================================================================================
function v74LifeOpen(tab) { const P = G.P, S = V74(); tab = tab || S._tab || 'wish'; S._tab = tab;
  const tabs = [['wish', '📝 ' + L2('Lista', 'List')], ['bag', '📦 ' + L2('Bolsa', 'Bag') + (S.bag.length ? ' (' + S.bag.length + ')' : '')], ['fav', '🤝 ' + L2('Favor', 'Favour')], ['ntf', '🔔 ' + L2('Avisos', 'Alerts')]].map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-v74t="${k}">${n}</button>`).join('');
  let body = '';
  if (tab === 'wish') { body = `<p class="hint">${L2('Apunta lo que buscas. «Llévame» enciende la flecha dorada hacia donde se consigue y te avisa cuando lo tengas.', 'Note what you are looking for. «Take me» lights the golden arrow to where you get it and tells you when you have it.')}</p>
    <input id="v74wq" class="v74q" style="width:100%" placeholder="🔎 ${L2('Añadir: escribe un objeto…', 'Add: type an item…')}" autocomplete="off"><div id="v74wr"></div>` +
    (S.wish.map(id => { const I = ITEMS[id]; if (!I) return ''; const src = (itemSources(id) || []).slice(0, 3); return `<div class="gsrc"><span>${iconHTML(I.icon, 22)} <b>${esc(I.n)}</b> · ${L2('tienes ', 'you have ')}${countItem(id)}<br>${src.map((s, i) => `<small>• ${esc(s[0])}</small>${s[1] && s[1].loc ? ` <button class="btn sm" data-v74go="${esc(id)}|${i}">🧭 ${L2('Llévame', 'Take me')}</button>` : ''}`).join('<br>') || `<small>${L2('Sin fuentes conocidas', 'No known sources')}</small>`}</span><button class="btn sm" data-v74rm="${esc(id)}">✕</button></div>`; }).join('') || `<p class="hint">${L2('La lista está vacía. También puedes añadir desde el inventario (📝 A la lista).', 'The list is empty. You can also add from the bag (📝 Add to list).')}</p>`); }
  if (tab === 'bag') body = `<p class="hint">${L2('Cuando la mochila está llena, lo que consigues se guarda aquí (hasta 80) en vez de perderse.', 'When your bag is full, what you get is kept here (up to 80) instead of being lost.')}</p>` + (S.bag.length ? `<div class="row wrap">${S.bag.map(b => ITEMS[b.id] ? `<span class="chip">${iconHTML(ITEMS[b.id].icon, 18)} ${esc(ITEMS[b.id].n)}${b.q > 1 ? ' ×' + b.q : ''}</span>` : '').join('')}</div><div class="row"><button class="btn gold" id="v74bt">🧺 ${L2('Recoger todo', 'Pick up all')}</button><button class="btn" id="v74bs">${L2('Vender todo', 'Sell all')}</button></div>` : `<p class="hint">${L2('Vacía.', 'Empty.')}</p>`);
  if (tab === 'fav') { const F = S.fav; body = `<p class="hint">${L2('Cada día un vecino de Lima, Lima Norte, Trujillo, Cusco, México o España te pide un favor (❗ encima). Tráele lo que pide: oro y experiencia de oficio.', 'Every day a neighbour in Lima, North Lima, Trujillo, Cusco, Mexico or Spain asks you a favour (❗ above them). Bring what they ask: gold and job experience.')}</p>` +
    (F && F.d === calDay() ? `<div class="gsrc"><span><b>${esc(F.nm || '')}</b> · ${esc(V74_CITY[F.map] ? (MAPW_LIST.find(m => m.id === F.map) || { n: F.map }).n : F.map)}<br>${F.done ? '✅ ' + L2('Hecho', 'Done') : esc(v74FavText(F)) + ' ' + L2('(tienes ', '(you have ') + countItem(F.it) + ')'}</span></div>` : `<p class="hint">${L2('Hoy aún no te han pedido nada: date una vuelta por una ciudad.', 'Nobody has asked you anything today yet: take a walk around a city.')}</p>`) + `<p class="hint">${L2('Favores hechos: ', 'Favours done: ')}${S.favN} · ${L2('loquitos calmados: ', 'nutters calmed: ')}${S.lq} · ${L2('amigos peludos: ', 'furry friends: ')}${S.pets}</p>`; }
  if (tab === 'ntf') body = `<p class="hint">${L2('Elige qué avisos quieres ver.', 'Choose which alerts you want to see.')}</p>` + V74_NTF.map(([k, ic, n]) => `<label class="gsrc" style="cursor:pointer"><span>${ic} ${esc(n)}</span><input type="checkbox" data-v74n="${k}" ${S.ntf[k + '_off'] ? '' : 'checked'}></label>`).join('');
  openModal(`<div class="frame"><h3>🧺 ${L2('Vida diaria', 'Daily life')}</h3><div class="chips">${tabs}</div><div style="max-height:56vh;overflow:auto">${body}</div><div class="row">${S.pics.length ? `<button class="btn" id="v74lp">🖼 ${L2('Fotos de familia', 'Family photos')}</button>` : ''}<button class="btn" id="v74lX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#v74lX').onclick = closeModal; const lp = $('#v74lp'); if (lp) lp.onclick = v74PicsOpen;
  $$('#modal [data-v74t]').forEach(b => b.onclick = () => v74LifeOpen(b.dataset.v74t));
  $$('#modal [data-v74rm]').forEach(b => b.onclick = () => { v74WishToggle(b.dataset.v74rm); v74LifeOpen('wish'); });
  $$('#modal [data-v74go]').forEach(b => b.onclick = () => { const [id, i] = b.dataset.v74go.split('|'), s = itemSources(id)[+i]; if (s && s[1]) { setWp(s[1]); closeModal(); toast('🧭 ' + s[0], 'info'); } });
  $$('#modal [data-v74n]').forEach(c => c.onchange = () => { S.ntf[c.dataset.v74n + '_off'] = c.checked ? 0 : 1; markDirty(); });
  const bt = $('#v74bt'); if (bt) bt.onclick = () => { v74BagTake(); v74LifeOpen('bag'); }; const bs = $('#v74bs'); if (bs) bs.onclick = () => { v74BagSell(); v74LifeOpen('bag'); };
  const wq = $('#v74wq'); if (wq) { wq.onkeydown = ev => ev.stopPropagation(); wq.oninput = () => { const q = wq.value.trim().toLowerCase(), box = $('#v74wr'); if (q.length < 2) { box.innerHTML = ''; return; }
    const res = Object.values(ITEMS).filter(I => I.n && typeof I.n === 'string' && I.n.toLowerCase().includes(q) && I.t !== 'cos' && !/^__/.test(I.id || '')).slice(0, 8);
    box.innerHTML = res.map(I => `<button class="btn sm" data-v74add="${esc(I.id)}">${iconHTML(I.icon, 16)} ${esc(I.n)}</button>`).join(' ');
    $$('#v74wr [data-v74add]').forEach(b => b.onclick = () => { if (!V74().wish.includes(b.dataset.v74add)) v74WishToggle(b.dataset.v74add); v74LifeOpen('wish'); }); }; } }
V33_TICKS.push(v74Try(() => { const row = $('#tr .trbtns'); if (!row || !G.P) return;
  if (!$('#bV74Home')) { const b = document.createElement('button'); b.className = 'mini'; b.id = 'bV74Home'; b.title = L2('Volver a casa', 'Go home'); b.setAttribute('aria-label', b.title); b.textContent = '🏠'; b.onclick = v74GoHome; row.appendChild(b); }
  if (!$('#bV74Life')) { const b = document.createElement('button'); b.className = 'mini'; b.id = 'bV74Life'; b.title = L2('Vida diaria', 'Daily life'); b.setAttribute('aria-label', b.title); b.textContent = '🧺'; b.onclick = () => v74LifeOpen(); row.appendChild(b); }
  const b = $('#bV74Life'), S = G.P.v74, pg = !!(S && (S.bag.length || (S.fav && S.fav.d === calDay() && !S.fav.done))); if (b && b.classList.contains('ping') !== pg) b.classList.toggle('ping', pg); }));
if (typeof TR_TABS !== 'undefined') TR_TABS[3][3].push('bV74Home', 'bV74Life');
{ const st = document.createElement('style'); st.textContent = '.v74q{background:#1a1410;color:#f3e6c8;border:1px solid var(--gold);border-radius:.4em;padding:.25em .5em;font:inherit;font-size:.85em;min-width:7em;max-width:12em}'; document.head.appendChild(st); }

// =====================================================================================
// LUPA › SISTEMAS
// =====================================================================================
if (typeof GSIS !== 'undefined') {
  const E = [
    ['v74_horario', '🌆 ' + L2('Ciudades con horario (día y noche)', 'Cities with a schedule (day and night)'), [L2('En Lima, Lima Norte, Trujillo, Cusco, Machu Picchu, México y España la gente sigue la hora del juego: por la mañana y la tarde las calles están llenas, al anochecer se van a casa y de madrugada casi no queda nadie. Los domingos sale todo el mundo. En España hay siesta y se cena tarde; en México la noche sigue con tacos.', 'In Lima, North Lima, Trujillo, Cusco, Machu Picchu, Mexico and Spain people follow the game clock: mornings and afternoons are busy, at dusk they go home and late at night hardly anyone is left. On Sundays everybody is out. Spain has a siesta and late dinners; in Mexico the night goes on with tacos.'), L2('Vendedores de noche (19:00-4:00): Doña Carmen (anticuchos, Lima), Don Wilmer (Lima Norte), Señora Rosa (picarones, Trujillo), Mama Justina (emoliente, Cusco), Don Chuy (tacos, México) y Manoli (churros, España). Tienen un farolito encendido.', 'Night vendors (19:00-4:00): Doña Carmen (anticuchos, Lima), Don Wilmer (North Lima), Señora Rosa (picarones, Trujillo), Mama Justina (emoliente, Cusco), Don Chuy (tacos, Mexico) and Manoli (churros, Spain). They have a lit lantern.')]],
    ['v74_loquitos', '🌙 ' + L2('Loquitos de la madrugada', 'Late-night nutters'), [L2('De 22:00 a 5:00, en esas ciudades, a veces sale un loquito de un callejón y te busca pleito. Su fuerza se adapta a la tuya (unos 6-10 golpes para calmarlo). Dan experiencia y algo de oro. Si te alejas o se hace de día, se van.', 'From 22:00 to 5:00 in those cities, sometimes a nutter comes out of an alley and picks a fight. Their strength adapts to yours (about 6-10 hits to calm them). They give experience and some gold. If you walk away or day breaks, they leave.')]],
    ['v74_rumores', '👂 ' + L2('Rumores sobre ti', 'Rumours about you'), [L2('Habla con la gente de las ciudades o de los pueblos: «¿Qué se dice por aquí?». Comentan lo que de verdad has hecho (jefes vencidos, tu pareja, tus hijos, tu nivel, tu mejor oficio, los loquitos que calmaste…). Al pasar cerca, a veces cuchichean.', 'Talk to people in cities or villages: «What is the word around here?». They comment on what you have really done (bosses beaten, your partner, your children, your level, your best job, the nutters you calmed…). When you walk by, sometimes they whisper.')]],
    ['v74_favor', '🤝 ' + L2('Favor del día y visitas', 'Favour of the day and visits'), [L2('Cada día un vecino de las ciudades te pide algo (❗ encima): madera, mineral, pescado, cosecha o comida de un puesto. Tráeselo: oro y experiencia de oficio. Si no sabes dónde está, te pone la flecha. ▦ Atajos › 🧺 › Favor.', 'Every day a neighbour in the cities asks for something (❗ above them): wood, ore, fish, crops or street food. Bring it: gold and job experience. If you do not know where to find it, they set the arrow. ▦ Shortcuts › 🧺 › Favour.'), L2('De día, a veces un vecino viene a tu casa con un regalo.', 'By day, sometimes a neighbour visits your house with a gift.')]],
    ['v74_animales', '🐾 ' + L2('Animales de la calle', 'Street animals'), [L2('Gatos, perros y palomas en las ciudades. Las palomas salen volando si te acercas; los gatos huyen si vas corriendo; los perros te siguen un rato. ⚔ cerca para acariciarlos. Si llevas pescado, el gato te sigue. De noche las palomas duermen y los perros se echan.', 'Cats, dogs and pigeons in the cities. Pigeons fly off if you get close; cats run if you rush; dogs follow you a while. ⚔ close by to pet them. If you carry fish, the cat follows you. At night pigeons sleep and dogs lie down.')]],
    ['v74_huerto', '🌸 ' + L2('Huerto por estaciones', 'Seasonal garden'), [L2('8 cultivos de temporada (col de invierno, naranja de nieve, fresa, arveja, sandía, maíz morado, castaña y manzana). El granjero vende las de la estación actual. En su estación crecen el doble de rápido y dan una pieza más; fuera, a la mitad. Al cosechar uno se cosechan todos los que estén listos y se vuelve a sembrar con tus semillas.', '8 seasonal crops (winter cabbage, snow orange, strawberry, garden pea, watermelon, purple corn, chestnut and apple). The farmer sells the current season\'s. In season they grow twice as fast and yield one more; out of season, half. Harvesting one harvests every ripe plot and replants with your seeds.')]],
    ['v74_familia', '🏡 ' + L2('Rutina de la familia', 'Family routine'), [L2('Los hijos pequeños van a la escuela de lunes a viernes de 8:00 a 14:00, por la tarde juegan en el jardín, a las 19:00 se sientan a la mesa y a las 22:00 se van a dormir. Si llegas de noche, te reciben.', 'Young children go to school Monday to Friday from 8:00 to 14:00, play in the garden in the afternoon, sit at the table at 19:00 and go to bed at 22:00. If you come home at night, they welcome you.'), L2('Cena en familia (mesa del salón, 19:00-23:00, con pareja o hijos): vida y maná llenos y +15 % de experiencia de oficio durante 30 minutos, una vez al día.', 'Family dinner (living room table, 19:00-23:00, with partner or children): full health and mana and +15% job experience for 30 minutes, once a day.'), L2('Cada hijo tiene su diario (📖 al hablar con él) y en el salón cuelgan las 3 últimas fotos de familia (boda, nacimientos, cuando crecen y las cenas). Mirando la pared con ⚔ ves todas.', 'Each child has a diary (📖 when you talk to them) and the last 3 family photos hang in the living room (wedding, births, growing up and dinners). Face the wall and press ⚔ to see them all.')]],
    ['v74_comodo', '🏠 ' + L2('Volver a casa, buscar, avisos y lista', 'Go home, search, alerts and list'), [L2('▦ Atajos › 🏠 te lleva a tu casa al momento (cada 15 min; no en mitad de una pelea ni en el Mar de Dawn).', '▦ Shortcuts › 🏠 takes you home instantly (every 15 min; not mid-fight or in the Dawn Sea).'), L2('Inventario: buscador 🔎 y filtro ⚒ Oficio (herramientas, madera, mineral, peces, semillas y cosecha).', 'Bag: 🔎 search and ⚒ Jobs filter (tools, wood, ore, fish, seeds and crops).'), L2('▦ Atajos › 🧺 Vida diaria: 📝 lista de compra con flecha, 📦 Bolsa de rescate (lo que no cabía en la mochila), 🤝 favor del día y 🔔 avisos (cosecha lista, hallazgos de los hijos, hora de cenar, favores y loquitos).', '▦ Shortcuts › 🧺 Daily life: 📝 shopping list with arrow, 📦 Rescue bag (what did not fit in the bag), 🤝 favour of the day and 🔔 alerts (crop ready, children\'s finds, dinner time, favours and nutters).'), L2('Modo foto: ⏱ temporizador de 3 s (se oculta la barra) y 👨‍👩‍👧 foto de familia para la pared.', 'Photo mode: ⏱ 3 s timer (the bar hides) and 👨‍👩‍👧 family photo for the wall.')]] ];
  for (const [id, t, lines] of E.reverse()) GSIS.unshift([id, t, () => lines, () => null]);
}
