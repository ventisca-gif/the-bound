// ================= v4.30: los monstruos de los eventos sí atacan en los pueblos, hijos más resistentes que acuden
// a los asedios y hablan, hijos visibles en el minimapa y en el mapa, y los enemigos atacan a quien vean primero =================

// ---------- los monstruos de eventos (luna de sangre, invasiones, ladrones, bandidos…) llevan noSafe: atacan aunque estés en el pueblo ----------
{ const _um = updateMob; updateMob = function (m, dt) { if (m.noSafe && G.pSafe) { const ps = G.pSafe; G.pSafe = false; try { return _um(m, dt); } finally { G.pSafe = ps; } } return _um(m, dt); }; }

// ---------- hijos más resistentes: la misma vida que tú a su nivel y un 40 % menos de daño recibido ----------
kidMaxHp = function (k) { const P = G.P, S = P.S || {}; if (kidStage(k) < 2) return Math.round((150 + (P.lv || 1) * 20) * 0.6); return Math.max(80, Math.round((S.maxhp || 300) * kidRatio(k) * (0.9 + 0.05 * kidArmor(k)))); };
{ const _kr = kidHurtRaw; kidHurtRaw = function (e, base, lv) { return _kr(e, base * 0.6, lv); }; }
const KID_REST2 = 2 * 60 * 1000;
{ const _uk = updateKid; updateKid = function (e, dt) { const k = e.kid, r = _uk(e, dt); if (k && k.restUntil && k.restUntil - Date.now() > KID_REST2) k.restUntil = Date.now() + KID_REST2; return r; }; }

// ---------- los enemigos atacan a quien vean primero (tú o tus hijos) y cambian si otro está mucho más cerca ----------
{ const _um = updateMob; updateMob = function (m, dt) { if (!m.boss && !m.dying && m.state === 'chase' && (m.kchk2 = (m.kchk2 || 0) - dt) <= 0) { m.kchk2 = 1.2; const P = G.P, dp = dist2(m.x, m.y, P.x, P.y);
    let best = null, bd = dp * 0.5; for (const kd of G.ents) if (kd.type === 'kid' && !kd.remove && !kd.down && kd.kid && (kd.kid.follow || kd.explore) && kd.map === m.map && kidStage(kd.kid) === 2) { const d = dist2(m.x, m.y, kd.x, kd.y); if (d < bd) { bd = d; best = kd; } }
    if (best && m.ktgt !== best) m.ktgt = best; else if (m.ktgt && !P.dead && dp < dist2(m.x, m.y, m.ktgt.x, m.ktgt.y) * 0.5) m.ktgt = null; }
  return _um(m, dt); }; }

// ---------- globos de texto de los hijos ----------
const KID_TALK = {
  come: [L2('¡Ya voy, {p}! ¡Nadie toca nuestro pueblo!', 'Coming, {p}! Nobody touches our town!'), L2('¡He visto la luna roja desde casa! ¡Aquí estoy!', 'I saw the red moon from home! I\'m here!'), L2('¡{p}, te cubro la espalda!', '{p}, I\'ve got your back!')],
  fight: [L2('¡Toma esto!', 'Take this!'), L2('¡Como me enseñaste, {p}!', 'Just like you taught me, {p}!'), L2('¡No te acerques a mi familia!', 'Stay away from my family!'), L2('¡Este es mío!', 'This one\'s mine!')],
  low: [L2('¡{p}, me están dando fuerte!', '{p}, they\'re hitting me hard!'), L2('Necesito un respiro…', 'I need a breather…')],
  win: [L2('¡Lo hemos conseguido, {p}!', 'We did it, {p}!'), L2('¿Has visto cómo luchaba? ¡Dilo!', 'Did you see me fight? Say it!')],
  any: [L2('¿Adónde vamos ahora, {p}?', 'Where to now, {p}?'), L2('Cuando sea mayor quiero ser como tú.', 'When I grow up I want to be like you.'), L2('¿Me compras algo en la próxima tienda?', 'Will you buy me something at the next shop?'), L2('Me encanta ir de aventura contigo.', 'I love adventuring with you.')],
  night: [L2('De noche todo da un poco de miedo… pero contigo no.', 'Everything is a bit scary at night… but not with you.')],
};
function kidSay(e, kind) { const pool = KID_TALK[kind] || KID_TALK.any, p = (G.P.app && normApp(G.P.app).g === 'f') ? L2('mamá', 'mom') : L2('papá', 'dad'); let t = pick(pool).replace('{p}', p); t = t.replace(/^(¡|¿)?(\p{Ll})/u, (m, a, b) => (a || '') + b.toUpperCase()); e.chat = t; e.chatT = G.t; }
V33_TICKS.push(dt => { const P = G.P; if (!P || P.dead) return; dt = dt || 0.016;
  for (const e of FOLLOW_KIDS) { if (!e || e.remove || e.down || e.map !== P.map || !e.kid) continue; e.talkT = (e.talkT === undefined ? 10 + Math.random() * 20 : e.talkT) - dt; const k = e.kid, low = k.hp !== undefined && k.hp < kidMaxHp(k) * 0.3;
    if (low && !e.saidLow) { e.saidLow = 1; kidSay(e, 'low'); continue; } if (!low) e.saidLow = 0;
    if (e.talkT > 0) continue; e.talkT = 25 + Math.random() * 35; const fight = G.t - (e.combatT || -99) < 4 || G.t - (P.combatT || -99) < 4; kidSay(e, fight ? 'fight' : (typeof isNight === 'function' && isNight() && Math.random() < 0.4) ? 'night' : 'any'); } });

// ---------- en un asedio o evento con monstruos en tu pueblo, tus hijos mayores vienen a ayudarte ----------
let KID_HELP = []; let KID_HELP_T = 0;
function kidsToHelp(why) { const P = G.P; if (!P.kids) return; let n = 0;
  for (const k of P.kids) { if (k.follow || k.explore || kidStage(k) < 2 || !k.cls || kidResting(k)) continue; if (folCount() + n >= 3) break;
    k.follow = true; k.helpEv = 1; k.hp = kidMaxHp(k); const e = kidEnt(k, P.map, P.x + (Math.random() - 0.5) * 60, P.y + 40); FOLLOW_KIDS.push(e); KID_HELP.push(e); kidSay(e, 'come'); burst(e.x, e.y - 10, 14, { sp: 50, up: 40, g: 40, life: 0.8, c: ['#ffd040', '#ffffff'] }); n++; }
  if (n) toast(L2(`¡${n === 1 ? 'Tu hijo/a viene' : 'Tus hijos vienen'} a ayudarte!`, n === 1 ? 'Your kid comes to help you!' : 'Your kids come to help you!'), 'quest', 4); }
function kidsHelpEnd() { if (!KID_HELP.length) return; for (const e of KID_HELP) { if (!e || e.remove) continue; kidSay(e, 'win'); const k = e.kid; setTimeout(() => { k.follow = false; delete k.helpEv; e.remove = true; FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q !== e); markDirty(); }, 4000); } KID_HELP = []; toast(L2('Tus hijos vuelven a casa', 'Your kids head home'), 'info'); }
V33_TICKS.push(dt => { const P = G.P; if (!P || !G.map) return; KID_HELP_T -= dt || 0.016; if (KID_HELP_T > 0) return; KID_HELP_T = 1;
  const active = (typeof SIEGE !== 'undefined' && SIEGE) || (G.pSafe && G.ents.some(m => m.type === 'mob' && m.noSafe && !m.dying && m.map === P.map && dist2(m.x, m.y, P.x, P.y) < 300 * 300));
  if (active && !KID_HELP.length && !P._kidHelpOn) { P._kidHelpOn = 1; kidsToHelp(); }
  if (!active && P._kidHelpOn) { P._kidHelpOn = 0; kidsHelpEnd(); } });
// al cargar una partida, los que vinieron a ayudar vuelven a casa
{ const _ip = initPlayerRuntime; initPlayerRuntime = function (P) { const r = _ip.apply(this, arguments); for (const k of P.kids || []) if (k.helpEv) { k.follow = false; delete k.helpEv; } return r; }; }

// ---------- dónde están tus hijos: puntos en el minimapa (con flecha en el borde) y en el mapa ----------
function kidSpots() { const P = G.P, out = []; for (const k of P.kids || []) { if (kidStage(k) < 1) continue; const e = G.ents.find(q => q.type === 'kid' && q.kid === k && !q.remove);
    if (e && (k.follow || k.explore)) out.push({ k, m: e.map, x: e.x / 16, y: e.y / 16 }); else if (k.explore && k.xc && k.xc.m === 'world') out.push({ k, m: 'world', x: k.xc.x, y: k.xc.y }); } return out; }
{ const _dm = drawMinimap; drawMinimap = function () { _dm.apply(this, arguments); const P = G.P; if (!P || P.map !== 'world') return; const cvs = $('#mm'), x = cvs.getContext('2d'), S = cvs.width, sc = 3, tx = P.x / 16, ty = P.y / 16;
  for (const s of kidSpots()) { if (s.m !== 'world') continue; let dx = (s.x - tx) * sc, dy = (s.y - ty) * sc; const L = Math.hypot(dx, dy), R = S / 2 - 5; if (L > R) { dx = dx / L * R; dy = dy / L * R; }
    x.fillStyle = '#1a0a14'; x.fillRect(Math.round(dx + S / 2) - 3, Math.round(dy + S / 2) - 3, 6, 6); x.fillStyle = s.k.explore ? '#ffb040' : '#ff7ad0'; x.fillRect(Math.round(dx + S / 2) - 2, Math.round(dy + S / 2) - 2, 4, 4); } }; }
MAPC.kid = [L2('Tus hijos', 'Your kids'), 'Your kids', '#ff7ad0', 'heart'];
{ const _wp = worldPOI; worldPOI = function () { const out = _wp.apply(this, arguments); for (const s of kidSpots()) if (s.m === 'world') out.push({ c: 'kid', x: Math.round(s.x), y: Math.round(s.y), t: s.k.name + ' · ' + (s.k.explore ? L2('de expedición', 'on an expedition') : L2('contigo', 'with you')) + ' · ' + L2('Nv. ', 'Lv. ') + kidLv(s.k) }); return out; }; }
