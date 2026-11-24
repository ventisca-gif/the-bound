// ================= v5.88: VOLUNTAD, AURA DEL CONQUISTADOR, RECOMPENSA Y LA MARINA =================
// Sergio pidió (con imágenes de referencia de un anime): un aura roja con rayos negros que se expande y desmaya según tu
// voluntad; la voluntad sube venciendo enemigos; Shanks la usa; carteles de «se busca» con tu cara y tu recompensa, que
// sube al acabar con cualquier enemigo; y la Marina, que navega en botes, te intercepta en el mar y te busca por las
// islas (a veces pregunta por ti) según lo peligroso que seas. Nombres y diseños propios.
//  · Voluntad (P.vol): +1 por enemigo, +25 por jefe. Rango 0-10 (VOL_T). Rango 1 abre el «Aura del Conquistador».
//  · Aura (técnica 'cqa' en una casilla): onda roja con rayos negros; desmaya (aturde) a los enemigos según tu rango y
//    tumba a los muy débiles. Los jefes aguantan salvo con rango alto. Shanks nunca cae.
//  · Shanks (jefe) usa su aura ('sh_conquista'): si tu voluntad es baja te desmayas unos segundos (P.cqKO).
//  · Recompensa (P.bounty) y peligro (BNT_T, 0-7). Cartel de «se busca» dibujado con tu personaje.
//  · La Marina (Mar de Dawn): barcos que te persiguen y abordan (cubierta 'marina_deck'), y patrullas en las islas
//    con un investigador que pregunta por ti (puedes mentir o pelear).
SAVEKEYS.push('vol', 'bounty', 'bntTier');
const VOL_T = [0, 150, 500, 1200, 2500, 4500, 7500, 12000, 18000, 26000, 36000];
const volRank = () => { const v = (G.P && G.P.vol) || 0; let r = 0; for (let i = 0; i < VOL_T.length; i++) if (v >= VOL_T[i]) r = i; return r; };
const BNT_T = [0, 1e6, 5e6, 20e6, 60e6, 150e6, 400e6, 1e9];
const bntTier = () => { const b = (G.P && G.P.bounty) || 0; let t = 0; for (let i = 0; i < BNT_T.length; i++) if (b >= BNT_T[i]) t = i; return t; };
const bntFmt = n => '฿ ' + fmt(Math.floor(n || 0)) + '-';
const isMarine = m => m && m.mid && /^dawn_marine/.test(m.mid);

// ---------- ganar voluntad y recompensa ----------
function volGain(n) { const P = G.P; if (!P) return; const r0 = volRank(); P.vol = Math.min(99999999, (P.vol || 0) + n); const r1 = volRank();
  if (r1 > r0) { banner('👑 ' + L2('Tu voluntad crece', 'Your will grows') + ' · ' + L2('rango ', 'rank ') + r1, r0 === 0 ? L2('Has despertado el Aura del Conquistador: ponla en una casilla (Habilidades).', 'You awakened the Conqueror\'s Aura: put it in a slot (Skills).') : L2('Tu aura llega más lejos y desmaya a enemigos más fuertes.', 'Your aura reaches further and knocks out stronger foes.')); sfx('quest'); } }
function bntGain(n) { const P = G.P; if (!P || !(n > 0)) return; const t0 = bntTier(); P.bounty = Math.min(9e12, (P.bounty || 0) + Math.round(n)); const t1 = bntTier();
  if (t1 > t0 && t1 > (P.bntTier || 0)) { P.bntTier = t1; setTimeout(() => { toast('📜 ' + L2('¡Nuevo cartel de búsqueda! Recompensa: ', 'New wanted poster! Bounty: ') + bntFmt(P.bounty), 'quest', 6); bntPoster(true); }, 1200); } }
{ const _km = killMob; killMob = function (m) { const was = m && !m.dying; const r = _km.apply(this, arguments);
  try { const P = G.P; if (was && P && m.type === 'mob' && !m.summon && !m.pet) { volGain(m.boss ? 25 : 1); const lv = m.lv || 1; bntGain(m.boss ? lv * 3000 : isMarine(m) ? lv * 400 : lv * 60); } } catch (e) { } return r; }; }

// ---------- la técnica: Aura del Conquistador ----------
sk('cqa', 'fruta', 0, 0, L2('Aura del Conquistador', 'Conqueror\'s Aura'), 'act', 1, null, { mp: 40, cd: 45, icon: ['crown', 3], eff: { k: 'cq' }, cq: 1, max: 10,
  d: L2('Liberas tu voluntad: una onda roja con rayos negros desmaya a los enemigos según tu rango y tumba a los más débiles.', 'You unleash your will: a red wave with black lightning knocks enemies out depending on your rank and drops the weakest ones.') });
const cqCd = () => Math.max(25, 45 - volRank() * 2);
const cqRadius = r => 90 + r * 12;
function cqSync() { const P = G.P; if (!P) return; const r = volRank(); if (r >= 1) P.skills.cqa = r; else if (P.skills.cqa) { delete P.skills.cqa; P.slots = P.slots.map(s => s === 'cqa' ? null : s); } }
V33_TICKS.push(() => { try { cqSync(); } catch (e) { } });
const CQ_FX = [];
function cqFx(x, y, R, map, who) { CQ_FX.push({ x, y, R, map, t: G.t, who, seed: Math.random() * 1000 }); if (CQ_FX.length > 8) CQ_FX.shift(); }
function cqCast() { const P = G.P, r = volRank(), R = cqRadius(r); P.cqT = Date.now(); setAnim(P, 'cast'); cqFx(P.x, P.y, R, P.map, P); G.shake = 10; sfx('boss');
  floatText(P.x, P.y - 54, '👑 ' + L2('¡Aura del Conquistador!', 'Conqueror\'s Aura!'), '#ff4a4a', true);
  let ko = 0, down = 0; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== P.map || dist2(m.x, m.y, P.x, P.y) > R * R) continue;
    if (m.mid === SH_BOSS) { floatText(m.x, m.y - 50, L2('Shanks sonríe', 'Shanks smiles'), '#ffd0a0'); continue; }
    if (m.boss) { if (r >= 8) { m.stun = Math.max(m.stun || 0, 1 + (r - 8) * 0.5); floatText(m.x, m.y - 50, '😵', '#ff6a6a'); } else floatText(m.x, m.y - 50, L2('¡Resiste!', 'Resists!'), '#ffd0a0'); continue; }
    if ((m.lv || 1) <= P.lv - 30 + r * 3) { m.stun = 9; hitMob(m, (m.maxhp || m.hp || 1) * 50 + 1e9, {}); down++; continue; }
    if ((m.lv || 1) <= P.lv + r * 4) { m.stun = Math.max(m.stun || 0, 2 + r * 0.3); m.cqKOT = G.t + 2 + r * 0.3; ko++; floatText(m.x, m.y - 46, '😵', '#ff6a6a'); }
    else floatText(m.x, m.y - 46, L2('¡Resiste!', 'Resists!'), '#ffd0a0'); }
  if (ko || down) setTimeout(() => toast('👑 ' + (down ? L2('Desmayados: ', 'Fainted: ') + down + ' · ' : '') + L2('aturdidos: ', 'stunned: ') + ko, 'info', 3), 400); }
{ const _us = useSkill; useSkill = function (slot) { const P = G.P, id = P && P.slots[slot], s = id && SK[id]; if (!s || !s.cq) return _us.apply(this, arguments);
  if (P.dead || (P.cqKO || 0) > 0 || P.busy > 0 || P.job || P.fishing || !P.skills[id] || (P.cds[id] || 0) > 0) return; if (P.mp < s.mp) { toast(L2('Maná insuficiente', 'Not enough mana'), 'warn'); return; }
  if (G.map && G.map.tortuga) { toast(L2('En La Tortuga Glotona no se pelea: aquí se come.', 'No fighting at the Gluttonous Turtle: here we eat.'), 'info'); return; }
  P.mp -= s.mp; P.cds[id] = cqCd(); P.combatT = G.t; try { cqCast(); } catch (e) { console.warn('cq', e); } }; }
{ const _sd = skillDesc; skillDesc = function (id, r) { if (id !== 'cqa') return _sd.apply(this, arguments); const R = volRank(); return L2(`Onda de ${Math.round(cqRadius(R) / 16)} casillas: desmaya ${(2 + R * 0.3).toFixed(1)} s a los enemigos de hasta tu nivel +${R * 4}; tumba a los de nivel ${G.P.lv - 30 + R * 3} o menos. Jefes: aguantan${R >= 8 ? ' (desde rango 8 se aturden un momento)' : ' hasta el rango 8'}. Recarga ${cqCd()} s.`, `Wave of ${Math.round(cqRadius(R) / 16)} tiles: knocks out for ${(2 + R * 0.3).toFixed(1)} s the foes up to your level +${R * 4}; drops those of level ${G.P.lv - 30 + R * 3} or less. Bosses resist${R >= 8 ? ' (from rank 8 they are stunned briefly)' : ' until rank 8'}. Cooldown ${cqCd()} s.`); }; }
// dibujo: onda roja que se expande, rayos negros con borde rojo, y el aura alrededor de quien la lanza
function cqBolt(x0, y0, ang, len, seed) { ctx.beginPath(); ctx.moveTo(x0, y0); let x = x0, y = y0; const n = 6; for (let i = 1; i <= n; i++) { const t = i / n, j = (hash2(i, seed | 0, 9) - 0.5) * 14; x = x0 + Math.cos(ang) * len * t - Math.sin(ang) * j; y = y0 + Math.sin(ang) * len * t * 0.6 + Math.cos(ang) * j * 0.6; ctx.lineTo(x, y); } }
WORLD_DRAW.push((cx, cy) => { for (let i = CQ_FX.length - 1; i >= 0; i--) { const f = CQ_FX[i], age = G.t - f.t; if (age > 1.3) { CQ_FX.splice(i, 1); continue; } if (!G.map || f.map !== G.map.id) continue;
  const who = f.who, x = (who && who.x !== undefined ? who.x : f.x) - cx, y = (who && who.y !== undefined ? who.y : f.y) - cy - 12, k = Math.min(1, age / 0.7), R = f.R * (0.15 + 0.85 * k), a = 1 - Math.max(0, (age - 0.7) / 0.6);
  ctx.save(); ctx.globalAlpha = 0.35 * a; ctx.fillStyle = '#8a0a12'; ctx.beginPath(); ctx.ellipse(x, y + 10, R, R * 0.55, 0, 0, 7); ctx.fill();
  ctx.globalAlpha = 0.9 * a; ctx.lineWidth = 3; ctx.strokeStyle = '#ff2a2a'; ctx.beginPath(); ctx.ellipse(x, y + 10, R, R * 0.55, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 1; ctx.strokeStyle = '#1a0004'; ctx.beginPath(); ctx.ellipse(x, y + 10, R - 3, R * 0.55 - 2, 0, 0, 7); ctx.stroke();
  for (let b = 0; b < 12; b++) { const ang = b / 12 * Math.PI * 2 + f.seed + age * 0.6, len = R * (0.7 + hash2(b, f.seed | 0, 3) * 0.4); cqBolt(x, y, ang, len, f.seed + b * 7 + Math.floor(age * 12));
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,30,40,' + (0.8 * a) + ')'; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(8,0,2,' + a + ')'; ctx.stroke(); }
  ctx.restore(); } });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const f = CQ_FX.find(f => f.who === e && G.t - f.t < 1.4); if (f) { const x = Math.round(e.x - cx), y = Math.round(e.y - cy) - 16, a = 1 - (G.t - f.t) / 1.4;
    ctx.save(); ctx.globalAlpha = 0.55 * a; const g = ctx.createRadialGradient(x, y, 2, x, y, 26); g.addColorStop(0, 'rgba(255,40,40,0.9)'); g.addColorStop(1, 'rgba(120,0,10,0)'); ctx.fillStyle = g; ctx.fillRect(x - 28, y - 30, 56, 56); ctx.restore();
    const r = _de.apply(this, arguments); ctx.save(); ctx.globalAlpha = a; for (let b = 0; b < 4; b++) { cqBolt(x, y - 4, -Math.PI / 2 + (b - 1.5) * 0.7 + Math.sin(G.t * 9 + b) * 0.2, 22, b * 13 + Math.floor(G.t * 14)); ctx.lineWidth = 3; ctx.strokeStyle = '#ff2a2a'; ctx.stroke(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#050002'; ctx.stroke(); } ctx.restore(); return r; }
  // desmayado: estrellitas y «zzz» encima
  if ((e === G.P && (G.P.cqKO || 0) > 0) || (e.type === 'mob' && e.cqKOT && G.t < e.cqKOT && !e.dying)) { const r = _de.apply(this, arguments); const x = Math.round(e.x - cx), y = Math.round(e.y - cy) - (e.hgt || 40); ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    for (let k = 0; k < 3; k++) { const a = G.t * 4 + k * 2.1; ctx.fillStyle = k === 1 ? '#ffffff' : '#ffd040'; ctx.fillText('★', x + Math.cos(a) * 9, y + Math.sin(a) * 3); } ctx.textAlign = 'left'; return r; }
  return _de.apply(this, arguments); }; }
// se ve en los demás jugadores
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); try { const P = G.P; if (P && P.cqT && Date.now() - P.cqT < 4000) o.cq = P.cqT % 1e9; if (P && P.bounty) o.bty = Math.floor(P.bounty); } catch (e) { } }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); try { if (pr && typeof pr.cq === 'number' && pr.cq !== r.cqSeen) { const first = r.cqSeen === undefined; r.cqSeen = pr.cq; if (!first && G.map && r.map === G.map.id) cqFx(r.x, r.y, 150, r.map, r); } if (pr && typeof pr.bty === 'number') r.bty = clamp(pr.bty, 0, 9e12); } catch (e) { } }; }

// ---------- desmayarse (el aura de Shanks) ----------
{ const _up = updatePlayer; updatePlayer = function (dt) { const P = G.P; if (P && (P.cqKO || 0) > 0 && !P.dead) { P.cqKO = Math.max(0, P.cqKO - (dt || 0.016)); setAnim(P, 'hurt', true); P.target = null; if (P.cqKO <= 0) floatText(P.x, P.y - 46, L2('¡Despiertas!', 'You come to!'), '#a0ffa0'); return; } return _up.apply(this, arguments); }; }
{ const _ba = basicAttack; basicAttack = function () { if (G.P && (G.P.cqKO || 0) > 0) return; return _ba.apply(this, arguments); }; }
{ const _us = useSkill; useSkill = function () { if (G.P && (G.P.cqKO || 0) > 0) return; return _us.apply(this, arguments); }; }
{ const _pd = playerDie; playerDie = function () { if (G.P) G.P.cqKO = 0; return _pd.apply(this, arguments); }; }
BOSSES[SH_BOSS].moves.push('sh_conquista'); FAR.push('sh_conquista'); NEAR.push('sh_conquista');
{ const _bm = bossMove; bossMove = function (m, mv) { if (mv !== 'sh_conquista') return _bm.apply(this, arguments); const P = G.P;
  if (m.cqNext && G.t < m.cqNext) return _bm.call(this, m, 'sh_presion'); m.cqNext = G.t + 18; setAnim(m, 'atk'); m.busyT = 1.6;
  floatText(m.x, m.y - 60, '👑 ' + L2('¡Aura del Conquistador!', 'Conqueror\'s Aura!'), '#ff4a4a', true);
  telegraph({ shape: 'circle', x: m.x, y: m.y, r: 210, dur: 1.4, col: 'rgba(120,0,10,0.28)', cb: () => { cqFx(m.x, m.y, 210, m.map, m); G.shake = 12; sfx('boss');
    if (dist2(P.x, P.y, m.x, m.y) > 210 * 210 || P.dead) return; const r = volRank();
    if (r < 6) { P.cqKO = Math.max(0.8, 3 - r * 0.35); floatText(P.x, P.y - 50, '😵 ' + L2('¡Te desmayas!', 'You faint!'), '#ff6a6a', true); toast('👑 ' + L2('Tu voluntad (rango ', 'Your will (rank ') + r + L2(') no aguanta el aura de Shanks. Con rango 6 la resistes.', ') cannot withstand Shanks\'s aura. At rank 6 you resist it.'), 'warn', 5); }
    else { hurtPlayer(m.atk * 0.6, { lv: m.lv }); floatText(P.x, P.y - 50, '👑 ' + L2('¡Tu voluntad resiste!', 'Your will holds!'), '#ffd040', true); } } }); }; }

// ---------- carteles de búsqueda ----------
function bntPortrait(g, x, y, w, h) { const P = G.P; g.fillStyle = '#8ac8e8'; g.fillRect(x, y, w, h); g.fillStyle = '#5a9ac8'; g.fillRect(x, y + h * 0.62, w, h * 0.38); g.fillStyle = '#ffffff'; g.fillRect(x + w * 0.08, y + h * 0.14, w * 0.2, h * 0.05); g.fillRect(x + w * 0.7, y + h * 0.1, w * 0.18, h * 0.05);
  try { const A = playerAtlas(P), sx = A.idx.idle * A.fw + 7, sy = 3; g.imageSmoothingEnabled = false; const sc = w / 26; g.drawImage(A.img, sx + 4, sy, 26, 30, x, y + h - 30 * sc + 4, 26 * sc, 30 * sc); } catch (e) { }
  g.strokeStyle = '#2a1608'; g.lineWidth = 3; g.strokeRect(x, y, w, h); }
function bntPosterCanvas() { const P = G.P, W = 300, H = 420, c = mkCanvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#e6cf9c'; g.fillRect(0, 0, W, H); for (let k = 0; k < 900; k++) { const x = (hash2(k, 1, 5) * W) | 0, y = (hash2(k, 2, 5) * H) | 0; g.fillStyle = hash2(k, 3, 5) > 0.5 ? 'rgba(120,80,30,0.08)' : 'rgba(255,240,200,0.12)'; g.fillRect(x, y, 3, 3); }
  const gr = g.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 260); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(90,50,10,0.45)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const F = s => `${s}px 'Pixelify Sans', monospace`; g.textAlign = 'center'; g.fillStyle = '#2a1608';
  g.font = F(52); g.fillText(L2('SE BUSCA', 'WANTED'), W / 2, 62); bntPortrait(g, 34, 78, W - 68, 190);
  g.font = F(17); g.fillText(L2('VIVO O MUERTO', 'DEAD OR ALIVE'), W / 2, 296); g.font = F(32); g.fillText(String(P.name || '???').toUpperCase().slice(0, 14), W / 2, 332);
  g.font = F(26); g.fillText(bntFmt(P.bounty), W / 2, 368); g.font = F(9); g.fillStyle = '#4a3018';
  g.fillText(L2('Peligro ', 'Danger ') + '★'.repeat(bntTier()) + '☆'.repeat(7 - bntTier()) + ' · ' + L2('Voluntad rango ', 'Will rank ') + volRank(), W / 2, 388); g.textAlign = 'right'; g.font = F(16); g.fillStyle = '#2a1608'; g.fillText(L2('MARINA', 'NAVY'), W - 24, 408);
  g.strokeStyle = '#7a5428'; g.lineWidth = 2; for (const [x0, s] of [[30, 1], [W - 30, -1]]) { g.beginPath(); g.moveTo(x0, 280); g.quadraticCurveTo(x0 + s * 14, 286, x0 + s * 6, 300); g.stroke(); }
  g.textAlign = 'left'; return c; }
function bntPoster(fresh) { const P = G.P; if (!P) return;
  if (!(P.bounty > 0)) { toast(L2('Todavía nadie ofrece recompensa por ti. Vence enemigos y la Marina se fijará en ti.', 'Nobody has put a bounty on you yet. Defeat enemies and the Navy will notice you.'), 'info', 4); return; }
  openModal(`<div class="frame cqpost"><h3>📜 ${fresh ? L2('¡Nuevo cartel de búsqueda!', 'New wanted poster!') : L2('Tu cartel de búsqueda', 'Your wanted poster')}</h3><div id="cqPoster" style="text-align:center"></div><p class="hint">${L2('La recompensa sube al vencer enemigos (más con jefes y marines). Con más peligro, la Marina te persigue más a menudo por el Mar de Dawn y las islas.', 'The bounty rises when you defeat enemies (more with bosses and marines). The more dangerous you are, the more often the Navy hunts you in the Dawn Sea and on the islands.')}</p><div class="row"><button class="btn" id="cqPX">${L2('Cerrar', 'Close')}</button></div></div>`);
  const c = bntPosterCanvas(); c.style.width = 'min(300px,70vw)'; c.style.imageRendering = 'auto'; $('#cqPoster').appendChild(c); $('#cqPX').onclick = closeModal; }
XSPR.cq_cartel = () => { const p = new Pix(16, 20); p.rect(1, 1, 14, 18, C('#e6cf9c')); p.hl(3, 3, 10, C('#2a1608')); p.hl(4, 4, 8, C('#2a1608')); p.rect(4, 6, 8, 6, C('#8ac8e8')); p.ball(8, 9, 2, 2, pal(['#a86e58', '#e3a98d', '#f6caaf'])); p.hl(4, 14, 8, C('#4a3018')); p.hl(3, 16, 10, C('#2a1608')); p.set(1, 1, C('#7a5428')); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 19 }; };
XACT.cq_cartel = [L2('Mirar el cartel de búsqueda', 'Look at the wanted poster'), 'book', () => bntPoster(false)];
{ const _md = makeDawn; makeDawn = function () { const M = _md.apply(this, arguments); if (!M.cqPost) { M.cqPost = 1; for (const [x, y] of [[518, 252], [531, 256], [508, 246]]) { const i = M.I(x, y); if (!SOLID_T[M.ter[i]] && M.ter[i] !== T.DEEP && !(M.solidO && M.solidO[i])) addObj(M, 'furn', x, y, { f: 'cq_cartel', fp: [[0, 0]], xact: 'cq_cartel' }); } } return M; }; }
{ const _mt = makeTortuga; makeTortuga = function () { const M = _mt.apply(this, arguments); if (!M.cqPost) { M.cqPost = 1; addObj(M, 'furn', 21, 18, { f: 'cq_cartel', fp: [], solid: false, xact: 'cq_cartel' }); addObj(M, 'furn', 6, 3, { f: 'cq_cartel', fp: [], solid: false, xact: 'cq_cartel' }); } return M; }; }

// ---------- panel de Habilidades: voluntad, aura y recompensa ----------
{ const _rs = renderSkills; renderSkills = function (B) { const r = _rs.apply(this, arguments); try { const P = G.P, R = volRank(), nx = VOL_T[R + 1];
  const h = `<div class="cqsk"><h3>👑 ${L2('Voluntad', 'Will')} · ${fmt(P.vol || 0)} · ${L2('rango ', 'rank ')}${R}/10</h3><p class="hint">${L2('Sube venciendo enemigos (+1, jefes +25).', 'It rises by defeating enemies (+1, bosses +25).')} ${nx ? L2('Siguiente rango: ', 'Next rank: ') + fmt(nx) : L2('Rango máximo.', 'Max rank.')}</p>
    ${R >= 1 ? `<div class="gsrc"><span>${iconHTML(SK.cqa.icon, 22)} <b>${esc(SK.cqa.n)}</b> · ${cqCd()} s · ${SK.cqa.mp} ${L2('maná', 'mana')}<br><small>${esc(skillDesc('cqa', R))}</small><div class="row">${[0, 1, 2, 3].map(i => `<button class="btn sm" data-cqq="${i}">${i + 1}${P.slots[i] === 'cqa' ? ' ✓' : ''}</button>`).join('')}</div></span></div>` : `<p class="hint">🔒 ${L2('El Aura del Conquistador despierta con voluntad 150.', 'The Conqueror\'s Aura awakens at 150 will.')}</p>`}
    <p class="hint">📜 ${L2('Recompensa: ', 'Bounty: ')}<b>${bntFmt(P.bounty)}</b> · ${L2('peligro ', 'danger ')}${bntTier()}/7 <button class="btn sm" id="cqPost">${L2('Ver cartel', 'See poster')}</button></p></div>`;
  const Rr = B.querySelector('.skR'); if (Rr) Rr.insertAdjacentHTML('afterbegin', h); else B.insertAdjacentHTML('beforeend', h);
  B.querySelectorAll('[data-cqq]').forEach(b => b.onclick = () => { const i = +b.dataset.cqq, prev = P.slots.indexOf('cqa'); if (prev >= 0) P.slots[prev] = null; P.slots[i] = 'cqa'; uiDirty.hud = true; sfx('equip'); renderPanel(); });
  const pb = B.querySelector('#cqPost'); if (pb) pb.onclick = () => bntPoster(false); } catch (e) { console.warn('cq skills', e); } return r; }; }

// ---------- la Marina ----------
fitKind('head', 'mr_gorra', (p, A, s) => { const { hx, hy, side, up, d } = A, W = RM.blanco, B = RM.marino;
  roEll(p, hx, hy - 4.5, 8.4, 5.4, W, true); roRow(p, hx - 8, hx + 8, hy - 4, W[2]); roRow(p, hx - 8, hx + 8, hy - 3, B[2]);
  if (!up) { const vx = side ? hx + d * 6 : hx; if (side) roRow(p, vx, vx + d * 3, hy - 3, W[1]); else { roRow(p, hx - 6, hx + 6, hy - 2, W[3]); roRow(p, hx - 5, hx + 5, hy - 1, W[1]); }
    if (!side) { roRect(p, hx - 3, hy - 7, 7, 2, RM.celeste[2]); roRow(p, hx - 2, hx + 2, hy - 7, RM.marino[3]); } } });
fitKind('body', 'mr_uniforme', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, m = s.m, R = tx0 + tw - 1, B = RM.marino;
  if (!up && !side) { for (let y = ty; y < ty + 3; y++) { p.set(tx0 + (y - ty), y, B[2]); p.set(R - (y - ty), y, B[2]); } p.set(Math.round(cx - 1), ty + 3, B[3]); p.set(Math.round(cx), ty + 3, B[3]); p.set(Math.round(cx - 1), ty + 4, B[2]); p.set(Math.round(cx), ty + 5, B[1]); }
  else if (up) { p.rect(tx0 + 1, ty, tw - 2, 3, B[2]); p.hl(tx0 + 1, ty + 2, tw - 2, W_(4)); } else p.set(Math.round(cx - d * 2), ty, B[2]);
  p.hl(tx0, ty + th - 2, tw, B[1]); if (s.cap) { for (const sx of [tx0 - 1, R]) { p.rect(sx, ty, 2, 2, RM.oro[3]); p.set(sx, ty + 2, RM.oro[2]); } for (let y = ty + 2; y < ty + th; y += 2) if (!up && !side) p.set(Math.round(cx - 0.5), y, RM.oro[3]); } });
const MR_CAST = { dawn_marine: { n: L2('Marine raso', 'Navy private'), bt: 2, hair: 'castano', skin: 1, hs: 0, top: 'blanco', bot: 'blanco' }, dawn_marine_cap: { n: L2('Capitán de la Marina', 'Navy captain'), bt: 3, hair: 'rosa', skin: 0, hs: 5, top: 'blanco', bot: 'marino' }, dawn_marine_spy: { n: L2('Marine investigador', 'Navy investigator'), bt: 1, hair: 'negro', skin: 2, hs: 3, top: 'blanco', bot: 'blanco' } };
function mrLook(id) { const had = !!DAWN_CAST[id]; if (!had) DAWN_CAST[id] = MR_CAST[id]; let L; try { L = dawnLook(id); } finally { if (!had) delete DAWN_CAST[id]; } L.top = { k: 'mr_uniforme', m: RM.blanco, s: RM.marino, cap: id === 'dawn_marine_cap' }; L.head = { k: 'mr_gorra', m: RM.blanco, cover: 'hat' };
  if (id === 'dawn_marine_cap') L.back = { k: 'cape', o: RM.blanco, i: RM.blanco, tr: RM.oro.slice(1) }; L.feet = { k: 'boots', m: RM.negro }; return L; }
{ const old = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'hum' && MR_CAST[art[1]]) return getAtlas('MR:' + art[1], () => buildAtlas(mrLook(art[1]), ['idle', 'walk', 'atk', 'hurt', 'dead'], drawHero)); return old.apply(this, arguments); }; }
MOBS.dawn_marine = Object.assign({}, MOBS.dawn_pirata, { n: MR_CAST.dawn_marine.n, art: ['hum', 'dawn_marine'], fam: 'dawn_marine', ai: 'aggro', drops: [] });
MOBS.dawn_marine_cap = Object.assign({}, MOBS.dawn_pirata, { n: MR_CAST.dawn_marine_cap.n, art: ['hum', 'dawn_marine_cap'], fam: 'dawn_marine', ai: 'aggro', drops: [], hp: (MOBS.dawn_pirata.hp || 1) * 3, atk: (MOBS.dawn_pirata.atk || 1) * 1.3 });
NPCS.dawn_marine_spy = { n: MR_CAST.dawn_marine_spy.n, title: L2('Marina · patrulla de islas', 'Navy · island patrol'), look: LK({}), quests: [], lines: [L2('Busco a un pirata peligroso. ¿Lo has visto?', 'I am looking for a dangerous pirate. Have you seen them?')], atlas: () => getAtlas('MR:spy', () => buildAtlas(mrLook('dawn_marine_spy'), ['idle', 'walk'], drawHero)) };
const MR = { boat: null, hunt: null, nextSea: 0, nextLand: 0, spy: null };
const mrLv = () => Math.min(600, 500 + bntTier() * 12);
const mrEvery = () => Math.max(45, 170 - bntTier() * 18);
function mrSquad(M, x, y, n, cap) { const out = []; for (let k = 0; k < n + (cap ? 1 : 0); k++) { const at = freePxNear(M, x, y, 5) || [x + (k - n / 2) * 20, y + 40]; const id = cap && k === n ? 'dawn_marine_cap' : 'dawn_marine'; const m = spawnMob(id, mrLv() + (id === 'dawn_marine_cap' ? 8 : 0), at[0], at[1], 0, null, false); if (m) { m.mrHunt = 1; m.aggroT = 99; m.target = G.P; out.push(m); } } MR.hunt = { t: G.t, mobs: out, map: M.id }; return out; }
// barco de la Marina: vela blanca con un ancla azul
XSPR.mr_barco = () => { const p = new Pix(64, 58), W = RM.blanco, B = RM.marino; p.poly([[4, 40], [60, 40], [54, 54], [10, 54]], W[3]); p.hl(6, 44, 52, B[2]); p.hl(8, 48, 48, B[1]); p.rect(31, 6, 2, 36, RM.marron[2]);
  p.poly([[12, 10], [52, 10], [50, 36], [14, 36]], W[4]); p.line(14, 10, 15, 36, W[2]); p.vl(32, 16, 12, B[2]); p.hl(28, 18, 9, B[2]); for (let k = 0; k < 7; k++) p.set(26 + k + (k > 3 ? 1 : 0), 27 - Math.abs(3 - k) + 3, B[2]);
  p.poly([[33, 2], [44, 4], [33, 7]], B[3]); p.outline(OUTL); return { c: p.canvas(), ax: 32, ay: 50 }; };
DL_HOOKS.push((list, cx, cy) => { const b = MR.boat, M = G.map; if (!b || !M || !M.dawn) return; list.push({ type: 'xdraw', x: b.x, y: b.y + 10, draw: (e, cx2, cy2) => { const s = spr('mr:barco', XSPR.mr_barco); ctx.save(); ctx.translate(Math.round(b.x - cx2), Math.round(b.y - cy2 + 10)); if (b.dir < 0) ctx.scale(-1, 1); ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); } }); });
function mrTick(dt) { const P = G.P, M = G.map; if (!P || !M || P.dead || G.fading) return; dt = Math.min(dt || 0.016, 0.1); const tier = bntTier();
  if (!M.dawn) { if (MR.boat) MR.boat = null; return; }
  const H = P.dawnHelm;
  // en el mar: barco que persigue
  if (H) { if (!MR.boat && tier >= 1 && G.t > MR.nextSea) { MR.nextSea = G.t + mrEvery(); if (Math.random() < 0.55 + tier * 0.06) { for (let k = 0; k < 20; k++) { const a = Math.random() * 6.28, x = P.x + Math.cos(a) * 620, y = P.y + Math.sin(a) * 420; if (dawnSurface(M, x, y)) { MR.boat = { x, y, dir: 1, t: G.t, lost: 0 }; toast('⚓ ' + L2('¡Un barco de la Marina te ha visto! Te quiere abordar. Huye o déjate atrapar.', 'A Navy ship spotted you! It wants to board you. Flee or let them catch you.'), 'warn', 6); sfx('boss'); break; } } } }
    const b = MR.boat; if (b) { const dx = P.x - b.x, dy = P.y - b.y, d = Math.hypot(dx, dy), sp = (G.t - b.t < 3 ? 60 : 250 + tier * 15), st = Math.min(d, sp * dt); b.dir = dx < 0 ? -1 : 1;
      const nx = b.x + dx / d * st, ny = b.y + dy / d * st; if (dawnSurface(M, nx, ny, 10)) { b.x = nx; b.y = ny; } else if (dawnSurface(M, nx, b.y, 10)) b.x = nx; else if (dawnSurface(M, b.x, ny, 10)) b.y = ny;
      if (d < 40 && !G.fading) { MR.boat = null; mrBoard(); return; } if (d > 900) { b.lost += dt; if (b.lost > 6) { MR.boat = null; toast(L2('Has dejado atrás al barco de la Marina.', 'You left the Navy ship behind.'), 'info', 4); } } else b.lost = 0;
      if (G.t - b.t > 90) { MR.boat = null; } } return; }
  if (MR.boat) MR.boat = null;
  // en tierra: patrullas que preguntan por ti
  if (MR.hunt) { const alive = MR.hunt.mobs.filter(m => !m.dying && !m.remove && m.map === M.id); if (!alive.length) { const n = MR.hunt.mobs.length; MR.hunt = null; if (n) { banner('⚓ ' + L2('Patrulla derrotada', 'Patrol defeated'), L2('La Marina tardará en volver… y tu cartel sube.', 'The Navy will take a while to return… and your poster goes up.')); } } return; }
  if (MR.spy) { const e = MR.spy; if (e.remove) { MR.spy = null; return; } const d = Math.hypot(P.x - e.x, P.y - e.y); if (!e.asked) { if (d > 34) npcStep(e, P.x, P.y + 4, 40, dt); else { e.anim = 'idle'; e.dir = dirFromVec(P.x - e.x, P.y - e.y); if (!e.chatT || G.t - e.chatT > 6) { e.chat = L2('Oye… ¿has visto a este pirata?', 'Hey… have you seen this pirate?'); e.chatT = G.t; } } }
    if (G.t - e.spawnT > 30 && !e.asked) mrSpyEnd(false, L2('El marine te mira bien… ¡y reconoce tu cara del cartel!', 'The marine takes a good look at you… and recognises your face from the poster!')); return; }
  if (tier >= 1 && G.t > MR.nextLand && !P.dawnHelm) { MR.nextLand = G.t + mrEvery() * 1.3; if (Math.random() < 0.5 + tier * 0.05) { if (tier >= 4 && Math.random() < 0.5) { toast('⚓ ' + L2('¡Una patrulla de la Marina te ha encontrado!', 'A Navy patrol found you!'), 'warn', 5); mrSquad(M, P.x, P.y, 2 + Math.min(4, tier), tier >= 3); }
    else { const at = freePxNear(M, P.x, P.y, 7); if (at) { const e = spawnNPC('dawn_marine_spy', at[0], at[1], M.id, { scene: 1 }); if (e) { e.spawnT = G.t; MR.spy = e; toast('⚓ ' + L2('Un marine pregunta por ti en la isla…', 'A marine is asking about you on the island…'), 'info', 5); } } } } } }
V33_TICKS.push(mrTick);
function mrSpyEnd(lied, msg) { const P = G.P, e = MR.spy; if (!e) return; MR.spy = null; e.remove = true; closeDialog(); if (lied) { floatText(P.x, P.y - 46, L2('Se lo ha creído', 'They bought it'), '#a0ffa0'); return; }
  toast('⚓ ' + msg, 'warn', 5); mrSquad(G.map, e.x, e.y, 2 + Math.min(4, bntTier()), bntTier() >= 3); }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'dawn_marine_spy' || npc !== MR.spy) return; npc.asked = 1;
  opts.unshift({ label: '🤥 ' + L2('Mentir: «No, no lo he visto»', 'Lie: "No, I haven\'t seen them"'), icon: ['talk'], fn: () => { const ch = clamp(0.75 - bntTier() * 0.08 + volRank() * 0.03, 0.15, 0.9); if (Math.random() < ch) { typeText(L2('«Vale… gracias. Si lo ves, avisa a la Marina.»', '"Alright… thanks. If you see them, tell the Navy."')); setTimeout(() => mrSpyEnd(true), 1200); } else mrSpyEnd(false, L2('«¡Eres tú! ¡Es la cara del cartel!»', '"It\'s you! The face on the poster!"')); } },
    { label: '⚔ ' + L2('«Soy yo. ¿Algún problema?»', '"It\'s me. Any problem?"'), icon: ['sword'], fn: () => mrSpyEnd(false, L2('«¡Todos a por él!»', '"Everyone, get them!"')) }); });
// abordaje en el mar
function mrDeck() { if (G.maps.marina_deck) return G.maps.marina_deck; const w = 30, h = 20, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'marina_deck', w, h, I, ter: new Uint8Array(N).fill(T.DEEP), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), dark: 0, isWorld: false, chunks: new Map(), camps: [], exit: { x: -9, y: -9 }, hudName: L2('Cubierta de la Marina', 'Navy deck'), overviewMinimap: true };
  for (let y = 4; y <= 15; y++) for (let x = 2; x <= 27; x++) { const bow = Math.max(0, Math.abs(y - 9.5) - 3); if (x >= 2 + bow && x <= 27 - bow) M.ter[I(x, y)] = T.PLANK; }
  prepPalettes(M); initMapObjs(M); for (const [x, y] of [[8, 6], [9, 6], [20, 13], [24, 7]]) addObj(M, 'furn', x, y, { f: x % 2 ? 'barrels' : 'chest' });
  addObj(M, 'furn', 4, 9, { f: 'ae_vacio', xact: 'mr_leave', solid: false, fp: [] });
  M.drawExtra = (cx, cy) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || X > VW || Y < -16 || Y > VH) continue; if (M.ter[I(x, y)] === T.DEEP) { ctx.fillStyle = '#315f82'; ctx.fillRect(X, Y, 16, 16); if ((y * 17 + x * 13) % 19 < 2) { ctx.fillStyle = '#508eab'; ctx.fillRect(X + 2, Y + 4, 10, 1); } } else if (M.ter[I(x, y - 1)] === T.DEEP || M.ter[I(x, y + 1)] === T.DEEP || M.ter[I(x - 1, y)] === T.DEEP || M.ter[I(x + 1, y)] === T.DEEP) { ctx.fillStyle = '#e8e4d8'; ctx.fillRect(X, Y + 5, 16, 5); ctx.fillStyle = '#2a50a8'; ctx.fillRect(X, Y + 4, 16, 2); } } };
  return G.maps.marina_deck = M; }
function mrBoard() { const P = G.P, H = P.dawnHelm; if (!H || G.fading) return; transition(() => { P._mrTrip = { h: H, x: P.x, y: P.y, dir: P.dir }; P.inside = 'marina_deck'; const M = mrDeck(); for (const e of G.ents) if (e.map === 'marina_deck' && e.type === 'mob') e.remove = true;
  setMap(M, 5 * 16 + 8, 9 * 16 + 8, 'right'); const t = bntTier(); mrSquad(M, 18 * 16, 9 * 16, 3 + Math.min(5, t), t >= 3); banner('⚓ ' + L2('¡Abordaje de la Marina!', 'Navy boarding!'), L2('Vence a todos los marines para recuperar tu barco.', 'Defeat every marine to get your boat back.')); }); }
function mrLeave() { const P = G.P, S = P._mrTrip; if (G.fading || P.dead) return; if (MR.hunt && MR.hunt.map === 'marina_deck' && MR.hunt.mobs.some(m => !m.dying && !m.remove)) { toast(L2('Primero vence a los marines.', 'Defeat the marines first.'), 'warn'); return; }
  transition(() => { P.inside = null; P._mrTrip = null; MR.hunt = null; const M = makeDawn(); if (S && S.h) { P.dawnHelm = S.h; setMap(M, S.x, S.y, 'down'); } MR.nextSea = G.t + mrEvery(); markDirty(true); }); }
XACT.mr_leave = [() => MR.hunt && MR.hunt.map === 'marina_deck' && MR.hunt.mobs.some(m => !m.dying && !m.remove) ? null : L2('Volver a tu barco', 'Back to your boat'), 'ways', mrLeave];
V33_TICKS.push(() => { const P = G.P, M = G.map; if (!P || !M || M.id !== 'marina_deck' || !MR.hunt || MR.hunt.map !== 'marina_deck') return; if (MR.hunt.mobs.length && MR.hunt.mobs.every(m => m.dying || m.remove)) { MR.hunt.mobs = []; const g = 2000 + bntTier() * 1500; P.gold += g; banner('⚓ ' + L2('¡Abordaje rechazado!', 'Boarding repelled!'), '+' + fmt(g) + ' ' + L2('oro · vuelve a tu barco (popa)', 'gold · back to your boat (stern)')); sfx('quest'); } });
// si te derrota la Marina: multa y recompensa algo más baja
{ const _pd = playerDie; playerDie = function () { const P = G.P; const caught = P && !P.dead && MR.hunt && MR.hunt.mobs.some(m => !m.dying && !m.remove && dist2(m.x, m.y, P.x, P.y) < 260 * 260); const r = _pd.apply(this, arguments);
  try { if (caught) { const fine = Math.floor(P.gold * 0.1); P.gold -= fine; P.bounty = Math.floor((P.bounty || 0) * 0.9); for (const m of MR.hunt.mobs) m.remove = true; MR.hunt = null; MR.boat = null; P._mrTrip = null; setTimeout(() => toast('⚓ ' + L2('La Marina te capturó: pagas ', 'The Navy captured you: you pay ') + fmt(fine) + L2(' de oro de multa y tu recompensa baja un 10 %.', ' gold in fines and your bounty drops 10%.'), 'warn', 7), 800); } } catch (e) { } return r; }; }
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); try { if (r !== false && G.map === M && !M.dawn && M.id !== 'marina_deck') { MR.boat = null; if (MR.spy) { MR.spy.remove = true; MR.spy = null; } if (MR.hunt && MR.hunt.map !== M.id) MR.hunt = null; } } catch (e) { } return r; }; }
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); try { if (M && M.dawn && MR.boat) out.push({ c: 'boss', x: MR.boat.x / 16, y: MR.boat.y / 16, t: L2('Barco de la Marina', 'Navy ship') }); } catch (e) { } return out; }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['voluntad588', '👑 ' + L2('Voluntad, Aura y recompensa', 'Will, Aura and bounty'), () => [
  L2('👑 Voluntad: sube al vencer enemigos (+1, jefes +25). Rangos 0-10 (150, 500, 1.200, 2.500, 4.500, 7.500, 12.000, 18.000, 26.000, 36.000). Se ve en Habilidades.', '👑 Will: rises by defeating enemies (+1, bosses +25). Ranks 0-10 (150, 500, 1,200, 2,500, 4,500, 7,500, 12,000, 18,000, 26,000, 36,000). Shown in Skills.'),
  L2('Aura del Conquistador (rango 1+): ponla en una casilla en Habilidades. Onda roja con rayos negros que desmaya a los enemigos de hasta tu nivel + 4 por rango y tumba a los muy débiles. Los jefes aguantan hasta el rango 8. Shanks no cae.', 'Conqueror\'s Aura (rank 1+): put it in a slot in Skills. A red wave with black lightning that knocks out foes up to your level + 4 per rank and drops very weak ones. Bosses resist until rank 8. Shanks never falls.'),
  L2('Shanks también la usa: si tu voluntad es menor que rango 6, te desmayas unos segundos.', 'Shanks uses it too: if your will is below rank 6, you faint for a few seconds.'),
  L2('📜 Recompensa: sube al vencer cualquier enemigo (nivel × 60; jefes × 3.000; marines × 400). Cada nivel de peligro (1 M, 5 M, 20 M, 60 M, 150 M, 400 M, 1.000 M) saca un cartel nuevo con tu cara. Lo ves en Habilidades o en los carteles de Foosha y de La Tortuga Glotona.', '📜 Bounty: rises with any defeated enemy (level × 60; bosses × 3,000; marines × 400). Each danger level (1M, 5M, 20M, 60M, 150M, 400M, 1,000M) brings a new poster with your face. See it in Skills or on the posters in Foosha and the Gluttonous Turtle.'),
  L2('⚓ La Marina (Mar de Dawn, desde peligro 1): sus barcos te persiguen en el mar; si te alcanzan te abordan y peleas en su cubierta (vences y vuelves a tu barco con oro). En las islas, un marine pregunta por ti: puedes mentir (más fácil con poca recompensa y mucha voluntad) o pelear. Desde peligro 4 hay emboscadas. Si te derrotan, pagas un 10 % de tu oro y tu recompensa baja un 10 %. En La Tortuga Glotona nadie pelea.', '⚓ The Navy (Dawn Sea, from danger 1): their ships chase you at sea; if they catch you they board you and you fight on their deck (win and get back to your boat with gold). On the islands a marine asks about you: you can lie (easier with a low bounty and high will) or fight. From danger 4 there are ambushes. If they beat you, you pay 10% of your gold and your bounty drops 10%. Nobody fights at the Gluttonous Turtle.')],
  () => ({ loc: [229, 129], m: 'world', t: L2('Capitana Marina (bote a Dawn)', 'Captain Marina (boat to Dawn)') })]);
