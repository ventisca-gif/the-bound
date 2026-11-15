// =====================================================================================
// v4.59: Devorador Carmesí nuevo (imagen de Sergio), top que cubre cuando se destroza la ropa de mujer,
// frío y antorchas en los biomas helados, enfermedades, médica enamorable (uniforme y cofia), y lesiones
// por golpes de enemigos muy fuertes (contusión, cojera, pierna rota → gateas). Todo genérico: vale para
// cualquier ropa, cuerpo y clase.
// =====================================================================================
SAVEKEYS.push('ills', 'inj', 'cold');

// ---------- Devorador Carmesí con 4 direcciones ----------
const A59 = { devo: null, atl: null };
a47Load(ART59_DEVO.src, im => { A59.devo = im; A59.atl = null; for (const e of G.ents) if (e.type === 'mob' && e.mid === 'devorador_carmesi') e.atlas = mobAtlasFor(e.def.art); });
const DEVO_OLD = BOSSES.devorador_carmesi.art; BOSSES.devorador_carmesi.art = ['art59', 'devo'];
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'art59') { if (!A59.devo) return _ma(DEVO_OLD); if (A59.atl) return A59.atl; const cw = ART59_DEVO.cw, ch = ART59_DEVO.ch, c = {}; ['down', 'left', 'right', 'up'].forEach((d, i) => c[d] = [i * cw, 0]); return A59.atl = a47MobAtlas(A59.devo, c, cw, ch, {}); } return _ma.apply(this, arguments); }; }

// ---------- ropa de mujer destrozada (nivel 2): la tela del vientre se rompe y queda un top que cubre el pecho ----------
const TOPB = [C('#08090b'), C('#12171a'), C('#1c2628'), C('#2a3e3c'), C('#4a7a6a')];
{ const _ta = tearApply; tearApply = function (p, L) { _ta.apply(this, arguments); try { const M = p.meta; if (!window.TEAR_TOP || !M || !M.fem || (L.tear | 0) < 2) return; const SK = M.sk || L.skin || [], skin = new Set(SK), hair = new Set(L.hair || []);
      const ty = M.torsoTop, th = M.th, R = M.tx0 + M.tw - 1, cut = ty + Math.ceil(th * 0.55), legTop = M.legTop;
      const cloth = (x, y) => { const c = p.get(x, y); return uA(c) && !skin.has(c) && !hair.has(c) && (uR(c) + uG(c) + uB(c) > 30); };
      for (let y = ty; y < cut; y++) for (let x = M.tx0; x <= R; x++) if (cloth(x, y)) { const k = x === M.tx0 ? 3 : x === R ? 1 : (x + y) % 5 === 0 ? 4 : 2; p.set(x, y, TOPB[k]); }
      for (let x = M.tx0; x <= R; x++) if (cloth(x, cut - 1) || uA(p.get(x, cut - 1))) p.set(x, cut - 1, TOPB[0]);
      for (let y = cut; y < legTop; y++) for (let x = M.tx0; x <= R; x++) if (cloth(x, y)) p.set(x, y, SK[x === M.tx0 ? 3 : x === R ? 1 : 2] || C('#e0b090'));
      if (!M.side && !M.up) p.set(M.cx - 1, Math.min(legTop - 1, cut + 2), SK[0] || C('#a07050'));
      if (cut + 1 < legTop) p.set(M.tx0 + 1, cut + 1, TEAR_RED[1]); } catch (e) { } }; }

// ---------- frío: en los Picos Helados o con nieve te enfrías; las antorchas, las hogueras y estar bajo techo te calientan ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { if (kind === 'antorcha') { const D = C, p = new Pix(12, 30); p.rect(5, 10, 2, 20, D('#5a3a1a')); p.rect(3, 8, 6, 3, D('#3a2a1a')); p.ell(6, 5, 3, 4, D('#ff7a1a')); p.ell(6, 6, 2, 3, D('#ffd040')); p.set(6, 4, D('#fff6c0')); p.outline(D('#1a0a04')); return { c: p.canvas(), ax: 6, ay: 29, light: 1 }; } return _ge.apply(this, arguments); }; }
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); try { const R = new RNG(SEED + 5959); let n = 0, t = 0; while (n < 14 && t++ < 4000) { const x = R.int(2, W.w - 3), y = R.int(2, W.h - 3), r = REGIONS[W.reg[y * W.w + x]]; if (!r || r.k !== 'picos') continue; const f = freeTileNear(W, x, y); if (!f) continue; if (putNear(W, 'antorcha', f[0], f[1], [[0, 0]], { light: 1, warm: 1 })) n++; } } catch (e) { console.warn(e); } }; }
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.isWorld) return; for (const o of M.objs) { if (!o.warm || o.hidden) continue; const x = o.px - cx, y = o.py - cy - 26; if (x < -20 || y < -20 || x > VW + 20 || y > VH + 20) continue; ctx.drawImage(glowSprite(22, 'rgba(255,170,60,0.55)'), Math.round(x - 22), Math.round(y - 22)); if (Math.random() < 0.2) part(o.px + (Math.random() - 0.5) * 4, o.py - 26, { vz: 30, g: -20, life: 0.5, c: pick(['#ffd040', '#ff7a1a']), s: 1 }); } });
function inColdZone() { const P = G.P, M = G.map; if (!P || !M || !M.isWorld || P.inside) return false; const r = regionAt(Math.floor(P.x / 16), Math.floor(P.y / 16)); return (r && r.k === 'picos') || curWx() === 'snow'; }
function nearWarm() { const P = G.P, M = G.map; if (!M) return false; if (P.inside || !M.isWorld) return true; for (const o of M.objs) { if (o.hidden) continue; if ((o.warm || o.xact === 'ofi_fire' || o.k === 'campfire') && dist2(o.px, o.py, P.x, P.y) < 60 * 60) return true; } return false; }
let coldT = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P || !P.S) return; coldT += dt || 0; if (coldT < 1) return; const s = coldT; coldT = 0; P.cold = P.cold || 0; const warm = nearWarm(), cz = inColdZone();
  if (warm) P.cold = Math.max(0, P.cold - 5 * s); else if (cz) P.cold = Math.min(100, P.cold + 1.3 * s); else P.cold = Math.max(0, P.cold - 0.6 * s);
  if (P.cold >= 100) { P.cold = 45; illGet('resfriado'); }
  if (cz && !warm && P.cold > 60 && Math.random() < 0.03 * s) floatText(P.x, P.y - 40, L2('¡Brrr! Busca una antorcha', 'Brrr! Find a torch'), '#9ad8ff');
  coldHud(); });
function coldHud() { const P = G.P; let d = $('#coldHud'); if (!P.cold || P.cold < 4) { if (d) d.remove(); return; } if (!d) { d = document.createElement('div'); d.id = 'coldHud'; d.style.cssText = 'position:absolute;left:50%;top:calc(4.2em + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:15;background:rgba(10,20,40,.7);border:1px solid #6ac8ff;border-radius:6px;padding:.1em .5em;font-family:Verdana,Arial,sans-serif;font-weight:700;font-size:.8em;color:#cfeeff;pointer-events:none'; document.body.appendChild(d); }
  d.textContent = '❄ ' + L2('Frío ', 'Cold ') + Math.round(P.cold) + '%' + (nearWarm() ? ' · 🔥' : ''); }

// ---------- enfermedades ----------
const ILL = {
  resfriado: { n: L2('Resfriado', 'Cold'), days: 2, cure: 800, eff: { spd: 0.92, atk: 0.95 }, msg: L2('¡Achís!', 'Achoo!'), how: L2('Pasar frío en los Picos Helados o con nieve sin calentarte en una antorcha, hoguera o bajo techo.', 'Getting cold in the Frozen Peaks or in snow without warming up at a torch, campfire or indoors.'), what: L2('−8 % velocidad, −5 % ataque y estornudos.', '−8% speed, −5% attack and sneezing.') },
  gripe: { n: L2('Gripe', 'Flu'), days: 3, cure: 1500, eff: { spd: 0.9, atk: 0.9, hp: 0.92 }, msg: L2('*cof, cof*', '*cough, cough*'), how: L2('Andar bajo la lluvia o la tormenta con mucho frío, o un resfriado que empeora.', 'Walking in rain or storms while very cold, or a cold that gets worse.'), what: L2('−10 % velocidad y ataque, −8 % vida máxima y tos.', '−10% speed and attack, −8% max HP and coughing.') },
  fiebre: { n: L2('Fiebre del pantano', 'Swamp fever'), days: 3, cure: 1200, eff: { atk: 0.92, mp: 0.85 }, msg: L2('Todo da vueltas…', 'Everything is spinning…'), how: L2('Pasar tiempo en el Pantano Gris (los mosquitos).', 'Spending time in the Grey Swamp (mosquitoes).'), what: L2('−8 % ataque, −15 % maná y mareos.', '−8% attack, −15% mana and dizziness.') },
  intox: { n: L2('Intoxicación', 'Poisoning'), days: 1, cure: 1000, eff: { mp: 0.8, spd: 0.95 }, msg: L2('Ugh… me duele la tripa', 'Ugh… my stomach hurts'), how: L2('Picaduras de arañas, serpientes, escorpiones y plantas venenosas.', 'Bites from spiders, snakes, scorpions and poisonous plants.'), what: L2('−20 % maná y −5 % velocidad.', '−20% mana and −5% speed.') },
  infeccion: { n: L2('Infección', 'Infection'), days: 4, cure: 2000, eff: { hp: 0.9, def: 0.95 }, msg: L2('La herida arde…', 'The wound burns…'), how: L2('Seguir luchando con la ropa destrozada y heridas (menos de un cuarto de vida) o mordiscos de la Luna de Sangre.', 'Keep fighting with torn clothes and wounds (below a quarter of HP) or Blood Moon bites.'), what: L2('−10 % vida máxima y −5 % defensa.', '−10% max HP and −5% defence.') } };
function illGet(k) { const P = G.P; P.ills = P.ills || {}; if (k in P.ills) return; P.ills[k] = calDay(); calcStats(P); banner('🤒 ' + ILL[k].n, ILL[k].what + ' ' + L2('La médica Iris de Albor te cura.', 'Doctor Iris in Albor can cure you.')); sfx('hurt'); markDirty(); }
function illCure(k) { const P = G.P; if (!P.ills || !(k in P.ills)) return; delete P.ills[k]; calcStats(P); markDirty(); }
let illT = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P || !P.S) return; illT += dt || 0; if (illT < 1) return; const s = illT; illT = 0; P.ills = P.ills || {};
  for (const k in P.ills) if (calDay() - P.ills[k] >= ILL[k].days) { illCure(k); toast('🙂 ' + L2('Te has curado: ', 'You recovered: ') + ILL[k].n, 'quest', 4); }
  const M = G.map, r = M && M.isWorld ? regionAt(Math.floor(P.x / 16), Math.floor(P.y / 16)) : null, w = curWx();
  if (r && r.k === 'pantano' && !P.inside && Math.random() < 0.0025 * s) illGet('fiebre');
  if ((w === 'rain' || w === 'storm') && (P.cold || 0) > 55 && !nearWarm() && Math.random() < 0.004 * s) illGet('gripe');
  if (P.ills.resfriado && (P.cold || 0) > 80 && Math.random() < 0.002 * s) { illCure('resfriado'); illGet('gripe'); }
  if ((P.tear | 0) >= 2 && P.S && P.hp < P.S.maxhp * 0.25 && Math.random() < 0.0015 * s) illGet('infeccion');
  for (const k in P.ills) if (Math.random() < 0.012 * s) { P.chat = ILL[k].msg; P.chatT = G.t; if (k === 'resfriado' || k === 'gripe') { P.stunT = 0; } if (k === 'fiebre') G.shake = Math.max(G.shake || 0, 2); break; } });
// picaduras venenosas y mordiscos de la Luna de Sangre
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { const P = G.P, h0 = P ? P.hp : 0, m = typeof CUR_MOB !== 'undefined' ? CUR_MOB : null; const r = _hp.apply(this, arguments);
    try { if (!P || P.spect || DUEL || (src && src.pvp) || !m || !m.def || P.hp >= h0) return r; const a = m.def.art || []; if (/spider|snake|scorp|plant/.test(a[0] + ' ' + a[1]) && Math.random() < 0.04) illGet('intox'); if (m.blood && Math.random() < 0.02) illGet('infeccion');
      injMaybe(m, h0 - P.hp); } catch (e) { } return r; }; }

// ---------- lesiones: golpes de enemigos mucho más fuertes ----------
const INJ = {
  contusion: { n: L2('Contusión', 'Bruise'), days: 1, cure: 600, sev: 1, eff: { def: 0.9 }, what: L2('−10 % defensa. Se cura sola en 1 día.', '−10% defence. Heals by itself in 1 day.') },
  cojera: { n: L2('Esguince (cojeas)', 'Sprain (limping)'), days: 2, cure: 1200, sev: 2, eff: { spd: 0.7 }, what: L2('−30 % velocidad: cojeas. Se cura en 2 días.', '−30% speed: you limp. Heals in 2 days.') },
  rota: { n: L2('Pierna rota (gateas)', 'Broken leg (crawling)'), days: 4, cure: 3000, sev: 3, eff: { spd: 0.4, atk: 0.9 }, what: L2('−60 % velocidad y −10 % ataque: vas gateando. Se cura en 4 días o con la médica.', '−60% speed and −10% attack: you crawl. Heals in 4 days or with the doctor.') } };
function injMaybe(m, dmg) { const P = G.P; if (!P.S || P.dead) return; const gap = (m.lv || 1) - P.lv, f = dmg / P.S.maxhp; if (gap < 15 && f < 0.25) return;
  const roll = Math.random(); let k = null; if ((gap >= 25 || f >= 0.35) && roll < 0.04) k = 'rota'; else if (roll < 0.12) k = 'cojera'; else if (roll < 0.3) k = 'contusion'; if (!k) return;
  const cur = P.inj && INJ[P.inj.k]; if (cur && cur.sev >= INJ[k].sev) return; P.inj = { k, d: calDay() }; calcStats(P); banner('🩹 ' + INJ[k].n, INJ[k].what); sfx('hurt'); G.shake = Math.max(G.shake || 0, 6); netPresence(true); markDirty(); }
function injCure() { const P = G.P; if (!P.inj) return; P.inj = null; calcStats(P); netPresence(true); markDirty(); }
V33_TICKS.push(() => { const P = G.P; if (!P || !P.inj || !INJ[P.inj.k]) return; if (calDay() - P.inj.d >= INJ[P.inj.k].days) { toast('🙂 ' + L2('Ya estás bien: ', 'You\'re fine now: ') + INJ[P.inj.k].n, 'quest', 4); injCure(); } });
// efectos en las estadísticas
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P && P === G.P && P.S) { const S = P.S, effs = []; for (const k in P.ills || {}) if (ILL[k]) effs.push(ILL[k].eff); if (P.inj && INJ[P.inj.k]) effs.push(INJ[P.inj.k].eff);
        for (const e of effs) { if (e.spd) S.spd *= e.spd; if (e.atk) S.atk = Math.round(S.atk * e.atk); if (e.def) S.def = Math.round(S.def * e.def); if (e.hp) S.maxhp = Math.round(S.maxhp * e.hp); if (e.mp) S.maxmp = Math.round(S.maxmp * e.mp); }
        if (P.hp > S.maxhp) P.hp = S.maxhp; if (effs.length) S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); } } catch (e) { } return r; }; }
// cojear y gatear: se dibuja sobre cualquier ropa, cuerpo y clase (tú y los demás jugadores online)
function injOf(e) { if (e === G.P) return G.P.inj && G.P.inj.k; if (e && e.type === 'remote') return e.inj; return null; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const k = injOf(e); if (!k || k === 'contusion' || e.riding || e.rd) return _de.apply(this, arguments); const moving = e.anim === 'walk', fx = Math.round(e.x - cx), fy = Math.round(e.y - cy);
    ctx.save(); try { if (k === 'cojera') { if (moving) ctx.translate(0, (e.af % 2) ? 2 : 0); return _de.apply(this, arguments); }
      // pierna rota: gateando (cuerpo bajo e inclinado) o sentado si estás quieto
      const sk = moving ? (e.dir === 'left' ? 0.35 : e.dir === 'right' ? -0.35 : 0) : 0, sy = moving ? 0.58 + ((e.af % 2) ? 0.03 : 0) : 0.72;
      ctx.translate(fx, fy); ctx.transform(1, 0, sk, sy, 0, 0); ctx.translate(-fx, -fy); return _de.apply(this, arguments); } finally { ctx.restore(); } }; }
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); const P = G.P; if (P && P.inj) o.inj = P.inj.k; return r; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er.apply(this, arguments); r.inj = typeof pr.inj === 'string' && INJ[pr.inj] ? pr.inj : null; }; }

// ---------- la médica Iris (Albor): uniforme de enfermería y cofia, cura enfermedades y lesiones, enamorable ----------
fitKind('body', 'enfermera', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, d } = A, R = tx0 + tw - 1, m = s.m, RD = C('#d82a3a');
  for (let y = legTop - 1; y <= legTop + 3; y++) { const e = y > legTop ? 1 : 0, x0 = side ? cx - 4 - (d > 0 ? e : 0) : tx0 - e, x1 = side ? cx + 3 + (d < 0 ? e : 0) : R + e; for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 ? m[4] : x === x1 ? m[2] : m[3]); }
  p.hl(side ? cx - 4 : tx0, A.waistY, side ? 8 : tw, s.s[2]);
  if (up) { p.set(cx - 1, ty + 2, RD); p.set(cx - 2, ty + 3, RD); p.set(cx - 1, ty + 3, RD); p.set(cx, ty + 3, RD); p.set(cx - 1, ty + 4, RD); return; }
  if (side) { const x = cx + (d > 0 ? 1 : -2); p.set(x, ty + 2, RD); p.set(x, ty + 3, RD); return; }
  const x = R - 2; p.set(x, ty + 2, RD); p.set(x - 1, ty + 3, RD); p.set(x, ty + 3, RD); p.set(x + 1, ty + 3, RD); p.set(x, ty + 4, RD); for (let y = ty + 1; y < A.waistY; y += 2) p.set(cx - 1, y, m[2]); });
fitKind('head', 'cofia', (p, A, s) => { const cx = A.hx, top = Math.round(A.headTop), m = s.m, RD = C('#d82a3a'), w = Math.round(A.hrx * 0.9);
  for (let y = top - 2; y <= top + 1; y++) for (let x = Math.round(cx - w + (y < top ? 2 : 0)); x <= Math.round(cx + w - (y < top ? 2 : 0)); x++) p.set(x, y, y === top + 1 ? m[2] : m[4]);
  if (!A.up) { const x = A.side ? Math.round(cx + A.d * 2) : Math.round(cx); p.set(x, top - 1, RD); p.set(x - 1, top, RD); p.set(x, top, RD); p.set(x + 1, top, RD); p.set(x, top + 1, RD); } });
const NURSE_W = P5(['#b8c0cc', '#d4dae2', '#e8ecf0', '#f6f8fa', '#ffffff']), NURSE_S = P5(['#3a6ab0', '#5a8ad0', '#7aaae8', '#a8c8f8', '#d8e8ff']);
cosm('c_enfermera', L2('Uniforme de Enfermería', 'Nurse Uniform'), 'body', () => ({ k: 'enfermera', m: NURSE_W, s: NURSE_S }), { src: L2('Médica Iris (Albor)', 'Doctor Iris (Albor)') });
cosm('c_cofia', L2('Cofia de Enfermera', 'Nurse Cap'), 'head', () => ({ k: 'cofia', m: NURSE_W }), { src: L2('Médica Iris (Albor)', 'Doctor Iris (Albor)') });
it('cosi_c_enfermera', { n: L2('Uniforme de Enfermería', 'Nurse Uniform'), t: 'cos', cos: 'c_enfermera', price: 8000, icon: ['hanger'], rar: 3 });
it('cosi_c_cofia', { n: L2('Cofia de Enfermera', 'Nurse Cap'), t: 'cos', cos: 'c_cofia', price: 4000, icon: ['hanger'], rar: 3 });
NPCS.medica_iris = { n: L2('Iris', 'Iris'), title: L2('Médica de Albor', 'Albor\'s doctor'), look: LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'dress', main: NURSE_W, sec: NURSE_S, eyes: 'verde' }), lines: [L2('¿Te duele algo? Cuéntame y lo arreglamos.', 'Does something hurt? Tell me and we\'ll fix it.'), L2('En los Picos Helados, quédate cerca de las antorchas o te resfriarás.', 'In the Frozen Peaks, stay near the torches or you\'ll catch a cold.'), L2('Una pierna rota no es broma: ven a verme antes de seguir luchando.', 'A broken leg is no joke: come see me before you keep fighting.')] };
ROM.medica_iris = { g: 'f', loves: ['herb', 'potion', 'bouquet'], likes: ['cake', 'crystal', 'food'], hates: ['bone', 'fang'], taste: L2('las hierbas medicinales, las pociones y las flores', 'medicinal herbs, potions and flowers') };
ROM_WHERE.medica_iris = L2('Consulta de Albor', 'Albor clinic');
if (typeof WED_SPOUSE_LINES !== 'undefined') WED_SPOUSE_LINES.medica_iris = L2('¡La médica Iris se casa! Ahora sí que estamos en buenas manos.', 'Doctor Iris is getting married! Now we really are in good hands.');
{ const _na = npcAtlas; npcAtlas = function (id) { if (id === 'medica_iris') { const app = { g: 'f', bt: 0, hs: 6, hair: 'castano', eyes: 'verde', skin: 0, top: [0, 'blanco'], bot: [0, 'blanco'], shoe: [0, 'blanco'] }; const L = heroLook('bardo', app, { weapon: 0 }, { body: 'c_enfermera', head: 'c_cofia' }, {}); L.weapon = null; L.back = null; return getAtlas('npc_medica_iris', () => buildHeroAtlas(L)); } return _na.apply(this, arguments); }; }
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); const t = TOWNS.find(t => t.k === 'albor'); if (!t) return; const [x, y] = freeTileNear(W, Math.round((t.x0 + t.x1) / 2) + 6, Math.round((t.y0 + t.y1) / 2) - 3); W.npcDefs.push({ id: 'medica_iris', x, y, face: 'down', wander: 0 }); }; }
function clinicMenu() { const P = G.P, ills = Object.keys(P.ills || {}), inj = P.inj && INJ[P.inj.k] ? P.inj.k : null, cost = ills.reduce((a, k) => a + ILL[k].cure, 0) + (inj ? INJ[inj].cure : 0);
  const rows = ills.map(k => `<div class="news bad">🤒 <b>${esc(ILL[k].n)}</b> · ${esc(ILL[k].what)} · ${fmt(ILL[k].cure)} ${L2('oro', 'gold')}</div>`).concat(inj ? [`<div class="news bad">🩹 <b>${esc(INJ[inj].n)}</b> · ${esc(INJ[inj].what)} · ${fmt(INJ[inj].cure)} ${L2('oro', 'gold')}</div>`] : []);
  openModal(`<h2>🩺 ${L2('Consulta de la médica Iris', 'Doctor Iris\'s clinic')}</h2><div class="pvBody">${rows.join('') || `<div class="news good">${L2('Estás sano. ¡Cuídate del frío!', 'You\'re healthy. Watch out for the cold!')}</div>`}</div>
    <div class="row">${cost ? `<button class="btn gold" id="clCure">${L2('Curarme', 'Cure me')} · ${fmt(cost)} ${L2('oro', 'gold')}</button>` : ''}<button class="btn" id="clShop">${L2('Uniforme y cofia', 'Uniform and cap')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; const c = $('#clCure'); if (c) c.onclick = () => { if (P.gold < cost) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= cost; for (const k of ills) illCure(k); injCure(); P.cold = 0; banner('💚 ' + L2('¡Curado!', 'Cured!'), L2('Iris: «Ya estás como nuevo. Ten más cuidado.»', 'Iris: "Good as new. Be more careful."')); sfx('level'); closeModal(); };
  $('#clShop').onclick = () => { const L_ = [['cosi_c_enfermera', 'c_enfermera'], ['cosi_c_cofia', 'c_cofia']]; openModal(`<h2>👩‍⚕️ ${L2('Uniforme de enfermería', 'Nurse uniform')}</h2><div class="slist">${L_.map(([i, c2]) => `<div class="srow">${iconHTML(['hanger'], 24)}<div class="sn"><b>${esc(ITEMS[i].n)}</b><small>${(P.wardrobe || []).includes(c2) ? L2('ya lo tienes', 'owned') : fmt(ITEMS[i].price) + ' ' + L2('oro', 'gold')}</small></div><button class="btn sm" data-cl="${i}" ${(P.wardrobe || []).includes(c2) ? 'disabled' : ''}>${L2('Comprar', 'Buy')}</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party'); $('#mclose').onclick = closeModal;
    $$('[data-cl]').forEach(b => b.onclick = () => { const it_ = ITEMS[b.dataset.cl]; if (P.gold < it_.price) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= it_.price; P.wardrobe = P.wardrobe || []; if (!P.wardrobe.includes(it_.cos)) P.wardrobe.push(it_.cos); sfx('coin'); toast('🎁 ' + it_.n, 'quest'); markDirty(true); closeModal(); }); }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'medica_iris') opts.unshift({ label: L2('Consulta médica', 'Medical checkup'), icon: ['heart', '#6aff7a'], fn: () => { closeDialog(); clinicMenu(); } }); });

// ---------- lupa › Sistemas ----------
GSIS.push(['salud', '🩺 ' + L2('Enfermedades, lesiones y frío', 'Illness, injuries and cold'), () => [
  L2('La médica Iris (Albor, junto a la plaza) cura cualquier enfermedad o lesión a cambio de oro. También vende el Uniforme de Enfermería y la Cofia, y se puede enamorar.', 'Doctor Iris (Albor, by the square) cures any illness or injury for gold. She also sells the Nurse Uniform and Cap, and can be romanced.'),
  L2('Frío: en los Picos Helados o cuando nieva sube tu medidor ❄. Las antorchas de los Picos, las hogueras y estar bajo techo te calientan. Al llegar al 100 % te resfrías.', 'Cold: in the Frozen Peaks or when it snows your ❄ meter rises. The Peaks\' torches, campfires and being indoors warm you up. At 100% you catch a cold.')]
  .concat(Object.keys(ILL).map(k => '🤒 ' + ILL[k].n + ': ' + ILL[k].how + ' ' + ILL[k].what + ' ' + L2('Dura ', 'Lasts ') + ILL[k].days + L2(' días o cúrala por ', ' days, or cure it for ') + fmt(ILL[k].cure) + L2(' oro.', ' gold.')))
  .concat([L2('Lesiones: los golpes de enemigos 15 niveles o más por encima de ti (o golpes que quitan un cuarto de tu vida) pueden lesionarte:', 'Injuries: hits from enemies 15+ levels above you (or hits that take a quarter of your HP) can injure you:')])
  .concat(Object.keys(INJ).map(k => '🩹 ' + INJ[k].n + ': ' + INJ[k].what + ' ' + L2('Curarla con Iris: ', 'Cure with Iris: ') + fmt(INJ[k].cure) + L2(' oro.', ' gold.'))), () => null]);
