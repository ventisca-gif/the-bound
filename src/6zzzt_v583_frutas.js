// ================= v5.83: FRUTAS DEL DIABLO (comerlas), PODERES DE GOMA, FRUTA TRANSPARENTE Y BOTÍN EN LA BARRA DE JEFES =================
// Sergio (5.83):
// - La Fruta del Diablo de la Hilandera Muda (5 % con pity) sigue siendo la llave de las islas, y además se puede COMER:
//   tu cuerpo se vuelve de goma y salen técnicas nuevas en tu árbol (sección 🍇 Fruta), todas con animación.
// - Con una fruta no puedes nadar: en el Fondo Marino y en Nerea pierdes vida. Shanks te la quita (para frutas futuras).
//   Mientras tengas un poder, el inventario bloquea comer otra fruta.
// - Fruta Transparente (pera verde agua): invisibilidad unos segundos con recarga. Aparece a veces en las islas de Dawn,
//   con aviso.
// - Todos los jefes enseñan encima de su barra de vida lo que sueltan y con qué probabilidad.
SAVEKEYS.push('fruit', 'dfKey', 'dfPity');
const DFR = { goma: { item: 'dawn_fruta_diablo', n: L2('Goma', 'Rubber'), ic: '🍇' }, transparente: { item: 'df_transparente', n: L2('Transparente', 'Clear'), ic: '🍐' } };
const dfrOf = id => Object.keys(DFR).find(k => DFR[k].item === id);
// las frutas se comen desde el inventario
ITEMS.dawn_fruta_diablo.t = 'cons'; ITEMS.dawn_fruta_diablo.n = L2('Fruta del Diablo de Goma', 'Rubber Devil Fruit');
it('df_transparente', { n: L2('Fruta Transparente', 'Clear Fruit'), t: 'cons', stack: true, price: 0, icon: ['dfruit2'], rar: 5, d: L2('Pera verde agua que casi no se ve. Aparece a veces en las islas de Dawn (Foosha y Shells Town), con aviso. Si te la comes: invisibilidad unos segundos (los enemigos no te ven). No puedes tener dos frutas.', 'An aqua-green pear you can barely see. It sometimes appears on the Dawn islands (Foosha and Shells Town), with a warning. If you eat it: invisibility for a few seconds (enemies cannot see you). You cannot have two fruits.') });
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'dfruit2') return _gi.apply(this, arguments); const p = new Pix(16, 16), G_ = [C('#1a6a6a'), C('#2aa8a0'), C('#5ad8c8'), C('#a8f4e4'), C('#f0fff8')];
  for (let y = 3; y < 15; y++) { const t = (y - 3) / 11, w = t < 0.4 ? 2.4 + t * 4 : 4 + Math.sin((t - 0.4) / 0.6 * Math.PI) * 1.6; for (let x = Math.floor(8 - w); x <= Math.ceil(8 + w - 1); x++) { const e = (x + 0.5 - 8) / w; p.set(x, y, e < -0.55 ? G_[3] : e > 0.55 ? G_[1] : y % 4 === 1 && Math.abs(e) < 0.3 ? G_[1] : G_[2]); } }
  p.vl(5, 5, 4, G_[4]); p.vl(6, 10, 3, G_[4]); p.vl(8, 1, 3, C('#2a8a3a')); p.set(9, 1, C('#4ab04a')); p.outline(OUTL); return p; }; }

// ---------- técnicas (sección 🍇 de tu árbol; el rango sube con el nivel: 1 a nivel 500, 10 a nivel 590+) ----------
const DFS = { goma: ['gom1', 'gom2', 'gom3', 'gom4', 'gom5'], transparente: ['tra1'] };
for (const [id, n, cd, mp, icon, eff, d] of [
  ['gom1', L2('Goma Goma: Pistola', 'Rubber: Pistol'), 3, 14, ['star', '#ffd040'], { k: 'gpist', m: 2.4, mr: 0.12 }, L2('Estiras el brazo y golpeas lejos (hasta 10 casillas): {m}% de daño.', 'You stretch your arm and hit far away (up to 10 tiles): {m}% damage.')],
  ['gom2', L2('Goma Goma: Ametralladora', 'Rubber: Gatling'), 12, 30, ['star', '#ff8a4a'], { k: 'ggat', m: 0.3, mr: 0.02 }, L2('Una lluvia de catorce puñetazos estirados al frente: {m}% cada uno.', 'A storm of fourteen stretched punches ahead: {m}% each.')],
  ['gom3', L2('Goma Goma: Hacha', 'Rubber: Axe'), 14, 32, ['star', '#ff5a3a'], { k: 'ghacha', m: 3.2, mr: 0.2 }, L2('Levantas la pierna hasta el cielo y la dejas caer: {m}% de daño en la zona y aturde 1 s.', 'You raise your leg up to the sky and drop it: {m}% area damage and 1 s stun.')],
  ['gom4', L2('Goma Goma: Bazuca', 'Rubber: Bazooka'), 8, 20, ['star', '#ffb040'], { k: 'gbaz', m: 2.2, mr: 0.12 }, L2('Empujas con las dos palmas estiradas: {m}% de daño y lanzas lejos a los enemigos.', 'You push with both palms stretched: {m}% damage and knock enemies far back.')],
  ['gom5', L2('Goma Goma: Globo', 'Rubber: Balloon'), 20, 24, ['shield', '#ffd8a0'], { k: 'gglobo', m: 0.8, mr: 0.05 }, L2('Te inflas como un globo 4 s: recibes 65 % menos de daño y empujas a los que están cerca ({m}%).', 'You inflate like a balloon for 4 s: you take 65% less damage and push nearby enemies away ({m}%).')],
  ['tra1', L2('Transparencia', 'Transparency'), 25, 30, ['eye', '#5ad8c8'], { k: 'tinvis', m: 2, mr: 0.1 }, L2('Te vuelves invisible 6 s: los enemigos no te ven y tu primer golpe hace {m}% más.', 'You turn invisible for 6 s: enemies cannot see you and your first hit deals {m}% more.')]])
  sk(id, 'fruta', 0, 0, n, 'act', 500, null, { mp, cd, icon, eff, d, fruit: 1, max: 10 });
const dfRank = () => clamp(Math.floor((((G.P && G.P.lv) || 500) - 500) / 10) + 1, 1, 10);
function dfSyncSkills() { const P = G.P; if (!P) return; const own = P.fruit ? DFS[P.fruit] || [] : []; for (const k in DFS) for (const id of DFS[k]) { if (own.includes(id)) P.skills[id] = dfRank(); else if (P.skills[id]) { delete P.skills[id]; P.slots = P.slots.map(s => s === id ? null : s); } } }
V33_TICKS.push(() => { try { dfSyncSkills(); } catch (e) { } });
// el árbol: sección de la fruta debajo de las ramas de tu clase
{ const _rs = renderSkills; renderSkills = function (B) { const r = _rs.apply(this, arguments); try { const P = G.P; if (!DFR[P.fruit]) return r; const D = DFR[P.fruit], ids = DFS[P.fruit];
    const h = `<div class="frame dfsk"><h3>${D.ic} ${L2('Fruta ', 'Fruit: ')}${esc(D.n)} · ${L2('rango ', 'rank ')}${dfRank()}/10</h3><p class="hint">${L2('Técnicas de tu fruta. El rango sube con tu nivel. Equípalas en una casilla.', 'Your fruit\'s techniques. Their rank rises with your level. Put them in a slot.')}</p>${ids.map(id => { const s = SK[id];
      return `<div class="gsrc"><span>${iconHTML(s.icon, 22)} <b>${esc(s.n)}</b> · ${s.cd} s · ${s.mp} ${L2('maná', 'mana')}<br><small>${esc(skillDesc(id, dfRank()))}</small><div class="row">${[0, 1, 2, 3].map(i => `<button class="btn sm" data-dfq="${id}:${i}">${i + 1}${P.slots[i] === id ? ' ✓' : ''}</button>`).join('')}</div></span></div>`; }).join('')}${P.fruit === 'goma' ? `<p class="hint">🥊 ${L2('Pasiva: tus ataques cuerpo a cuerpo estiran el brazo con el arma y golpean a distancia. No puedes nadar.', 'Passive: your melee attacks stretch your arm with the weapon and hit at range. You cannot swim.')}</p>` : `<p class="hint">${L2('No puedes nadar.', 'You cannot swim.')}</p>`}</div>`;
    const R = B.querySelector('.skR'); if (R) R.insertAdjacentHTML('afterbegin', h.replace('class="frame dfsk"', 'class="dfsk"')); else B.insertAdjacentHTML('beforeend', h); B.querySelectorAll('[data-dfq]').forEach(b => b.onclick = () => { const [id, i] = b.dataset.dfq.split(':'); const prev = P.slots.indexOf(id); if (prev >= 0) P.slots[prev] = null; P.slots[+i] = id; uiDirty.hud = true; sfx('equip'); renderPanel(); }); } catch (e) { console.warn('df skills', e); } return r; }; }

// ---------- dibujo de brazos y piernas de goma ----------
const DF_FX = [];
function dfSkin() { const P = G.P, S = (typeof SKINS !== 'undefined' && SKINS[(P.app && P.app.skin) | 0]) || null, c = S ? S[3] : '#f0c8a0'; return typeof c === 'string' ? c : uCss(c); }
function dfLimb(ctx, sx, sy, ex, ey, col, w, fist) { ctx.lineCap = 'round'; ctx.strokeStyle = '#2a1214'; ctx.lineWidth = w + 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, sy - 1); ctx.lineTo(ex, ey - 1); ctx.stroke();
  if (fist) { const r = fist; ctx.fillStyle = '#2a1214'; ctx.fillRect(Math.round(ex - r - 1), Math.round(ey - r - 1), r * 2 + 2, r * 2 + 2); ctx.fillStyle = col; ctx.fillRect(Math.round(ex - r), Math.round(ey - r), r * 2, r * 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(Math.round(ex - r), Math.round(ey - r), r, 1); } }
if (typeof DL_HOOKS !== 'undefined') DL_HOOKS.push((list, cx, cy) => { const P = G.P; for (let i = DF_FX.length - 1; i >= 0; i--) if (G.t - DF_FX[i].t > DF_FX[i].dur) DF_FX.splice(i, 1); if (!P || (!DF_FX.length && !(P.gfusen > G.t))) return;
  list.push({ type: 'xdraw', x: P.x, y: P.y + 2, noShadow: true, draw: () => { const col = dfSkin();
    if (P.gfusen > G.t) { const k = Math.min(1, (P.gfusen - G.t) * 3, (G.t - (P.gfusen - 4)) * 4), r = 6 + 12 * k, x = P.x - cx, y = P.y - 16 - cy; ctx.fillStyle = '#2a1214'; ctx.beginPath(); ctx.ellipse(x, y, r + 1, r * 0.9 + 1, 0, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.9, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.18, -0.6, 0, 7); ctx.fill(); }
    for (const F of DF_FX) { const p = Math.min(1, (G.t - F.t) / F.dur), sx = P.x - cx + (F.ox || 0), sy = P.y - cy + (F.oy || -14);
      if (F.k === 'arm') { const e = Math.sin(p * Math.PI), len = F.reach * e; dfLimb(ctx, sx, sy, sx + Math.cos(F.ang) * len, sy + Math.sin(F.ang) * len, col, F.w || 3, F.fist || 3); }
      else if (F.k === 'leg') { // sube recta hasta arriba y cae sobre el objetivo
        const hx = P.x - cx, hy = P.y - cy - 8, tx = F.tx - cx, ty = F.ty - cy, up = p < 0.6 ? p / 0.6 : 1, fall = p < 0.6 ? 0 : Math.min(1, (p - 0.6) / 0.15), top = hy - 130 * up;
        const ex = hx + (tx - hx) * fall, ey = top + (ty - top) * fall; dfLimb(ctx, hx, hy, ex, ey, col, 4, 0); ctx.fillStyle = '#2a1214'; ctx.fillRect(Math.round(ex) - 5, Math.round(ey) - 3, 10, 6); ctx.fillStyle = '#8a5a32'; ctx.fillRect(Math.round(ex) - 4, Math.round(ey) - 2, 8, 4); } } } }); });

// ---------- lanzar las técnicas ----------
function dfCast(id) { const P = G.P, s = SK[id], e = s.eff, r = P.skills[id] || 1, atk = P.S.atk * ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100);
  const tgt = nearestMob(P.x, P.y, 190), ang = tgt ? Math.atan2(tgt.y - 8 - (P.y - 14), tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); if (tgt) P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y);
  const end = reach => [P.x + Math.cos(ang) * reach, P.y - 6 + Math.sin(ang) * reach];
  switch (e.k) {
    case 'gpist': { const reach = tgt ? clamp(Math.hypot(tgt.x - P.x, tgt.y - P.y), 40, 165) : 150; setAnim(P, 'atk'); DF_FX.push({ k: 'arm', t: G.t, dur: 0.38, ang, reach, w: 3, fist: 4 }); sfx('swing');
      delayAct(0.17, () => { const [x, y] = end(reach); hitCircle(x, y, 24, atk, { kb: 70 }); burst(x, y - 4, 12, { sp: 90, up: 30, g: 20, life: 0.4, c: ['#ffffff', '#ffd040'] }); G.shake = 3; }); break; }
    case 'ggat': { P.busy = 1; for (let k = 0; k < 14; k++) delayAct(0.07 * k, () => { const a = ang + (Math.random() - 0.5) * 0.7, reach = 60 + Math.random() * 55; DF_FX.push({ k: 'arm', t: G.t, dur: 0.16, ang: a, reach, ox: (Math.random() - 0.5) * 6, w: 3, fist: 3 }); setAnim(P, 'atk');
        const x = P.x + Math.cos(a) * reach, y = P.y - 6 + Math.sin(a) * reach; hitCircle(x, y, 22, atk); if (k % 2) sfx('swing'); burst(x, y, 3, { sp: 50, up: 20, g: 10, life: 0.25, c: ['#ffffff', '#ffb040'] }); }); break; }
    case 'ghacha': { const tx = tgt ? tgt.x : P.x + Math.cos(ang) * 50, ty = tgt ? tgt.y : P.y + Math.sin(ang) * 40; P.busy = 0.9; setAnim(P, 'cast'); DF_FX.push({ k: 'leg', t: G.t, dur: 1.05, tx, ty }); telegraph({ shape: 'circle', x: tx, y: ty, r: 64, dur: 0.62, col: 'rgba(255,200,120,0.18)' });
      delayAct(0.64, () => { hitCircle(tx, ty, 64, atk, { stun: 1 }); addFx({ type: 'ring', x: tx, y: ty, r: 64, dur: 0.5, col: '#ffd8a0' }); burst(tx, ty, 34, { sp: 160, up: 40, g: 60, life: 0.8, c: ['#d8c8b0', '#8a7a6a', '#ffffff'] }); G.shake = 9; sfx('boom'); }); break; }
    case 'gbaz': { setAnim(P, 'atk'); const px = -Math.sin(ang) * 5, py = Math.cos(ang) * 5; DF_FX.push({ k: 'arm', t: G.t, dur: 0.34, ang, reach: 80, ox: px, oy: -14 + py, w: 3, fist: 5 }, { k: 'arm', t: G.t, dur: 0.34, ang, reach: 80, ox: -px, oy: -14 - py, w: 3, fist: 5 }); sfx('swing');
      delayAct(0.16, () => { const [x, y] = end(78); hitCircle(x, y, 42, atk, { kb: 220 }); addFx({ type: 'ring', x, y, r: 42, dur: 0.35, col: '#ffffff' }); G.shake = 5; }); break; }
    case 'gglobo': { P.gfusen = G.t + 4; setAnim(P, 'cast'); hitCircle(P.x, P.y, 56, atk, { kb: 160 }); addFx({ type: 'ring', x: P.x, y: P.y, r: 56, dur: 0.4, col: '#ffd8a0' }); sfx('buff'); break; }
    case 'tinvis': { addBuff(P, 'df_invis', { invis: 1, ambush: Math.round(((e.m || 2) + (e.mr || 0) * (r - 1)) * 100) - 100 }, 6); setAnim(P, 'cast'); burst(P.x, P.y - 14, 24, { sp: 60, up: 40, g: 0, life: 0.7, c: ['#a8f4e4', '#5ad8c8', '#ffffff'] }); sfx('buff'); banner(L2('Transparencia', 'Transparency'), L2('Los enemigos no te ven durante 6 s', 'Enemies cannot see you for 6 s')); break; } } }
{ const _us = useSkill; useSkill = function (slot) { const P = G.P, id = P && P.slots[slot], s = id && SK[id]; if (!s || !s.fruit) return _us.apply(this, arguments);
  if (P.dead || P.busy > 0 || P.job || P.fishing || !P.skills[id] || (P.cds[id] || 0) > 0) return; if (P.mp < s.mp) { toast(L2('Maná insuficiente', 'Not enough mana'), 'warn'); return; }
  P.mp -= s.mp; P.cds[id] = s.cd; P.combatT = G.t; try { dfCast(id); } catch (e) { console.warn('df cast', e); } }; }
// Globo: menos daño mientras estás inflado
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { const P = G.P; if (P && P.gfusen > G.t) base *= 0.35; return _hp.call(this, base, src); }; }
// pasiva de goma: los ataques cuerpo a cuerpo estiran el brazo con el arma (como Engranaje 2)
{ const _ba = basicAttack; basicAttack = function () { const P = G.P, cd0 = P ? P.atkCd : 1; const r = _ba.apply(this, arguments);
  try { if (P.fruit === 'goma' && !(P.sr === 'vapor' && P.srF) && cd0 <= 0 && P.atkCd > 0 && (['sword', 'dagger', 'scythe'].includes(CLASSES[P.cls].weapon) || P.cls === 'pez') && typeof VAP_ARMS !== 'undefined') {
    const tgt = nearestMob(P.x, P.y, 150), ang = tgt ? Math.atan2(tgt.y - 6 - (P.y - 14), tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]), reach = tgt ? clamp(Math.hypot(tgt.x - P.x, tgt.y - P.y) - 6, 40, 125) : 85;
    VAP_ARMS.push({ t: G.t, dur: 0.32, ang, reach, w: vapWeaponCv(P) }); delayAct(0.12, () => { const x = P.x + Math.cos(ang) * reach, y = P.y - 8 + Math.sin(ang) * reach; hitCircle(x, y, 22, P.S.atk * 0.7, { kb: 30 }); }); } } catch (e) { } return r; }; }

// Keep the item in the bag until a living owner without a fruit confirms it.
function dfEat(id) {
 const P=G.P,kind=dfrOf(id);
 if(!P||P.dead||!kind||!countItem(id))return;
 const D=DFR[kind];
 if(P.fruit){
  xMsg('🍇 '+L2('Ya tienes una fruta','You already have a fruit'),
   L2('Solo puedes comer una Fruta del Diablo a la vez. Si quieres cambiar de poder, visita a Shanks en Foosha. Esta fruta se queda en tu inventario.',
      'You can only eat one Devil Fruit at a time. To switch powers, visit Shanks in Foosha. This fruit stays in your inventory.'),[]);
  return;
 }
 const description=kind==='goma'
  ?L2('Tu cuerpo se volverá de <b>goma</b>. Tendrás cinco técnicas nuevas y tus golpes cuerpo a cuerpo estirarán el brazo.',
      'Your body will turn to <b>rubber</b>. You gain five new techniques, and melee hits stretch your arm.')
  :D.desc||L2('Podrás volverte <b>invisible</b> durante seis segundos.','You can turn <b>invisible</b> for six seconds.');
 xMsg(D.ic+' '+ITEMS[id].n,description+'<br><br>'+
  L2('Con el poder de una fruta perderás vida bajo el agua. Shanks puede retirarlo. Conservas tu permiso de desembarco.',
     'With a fruit power, you lose HP underwater. Shanks can remove it. You keep your landing permit.'),[
   ['😋 '+L2('Comérmela','Eat it'),()=>{
    if(G.P!==P||P.dead||P.fruit||!takeItem(id,1))return;
    P.fruit=kind;P.dfKey=1;dfSyncSkills();
    for(const sid of DFS[kind]){
     const free=P.slots.findIndex(x=>!x);
     if(free>=0&&!P.slots.includes(sid))P.slots[free]=sid;
    }
    burst(P.x,P.y-14,40,{sp:100,up:70,g:10,life:1,c:kind==='goma'?['#7a46c8','#ffd040','#ffffff']:D.colors||['#a8f4e4','#5ad8c8','#ffffff']});
    sfx('quest');banner(D.ic+' '+L2('Fruta ','Fruit: ')+D.n,D.passive||L2('Mira tus técnicas en Habilidades › Fruta','See your techniques in Skills › Fruit'));
    uiDirty.hud=true;markDirty(true);
   }]
  ]);
}
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx]; if (s && dfrOf(s.id)) { dfEat(s.id); return; } return _ui.apply(this, arguments); }; }
// no puedes nadar: en los mapas submarinos pierdes vida
const DF_WATER_MAPS = new Set(['submarino', 'nerea']);
V33_TICKS.push(dt => { const P = G.P; if (!P || !P.fruit || P.dead || !DF_WATER_MAPS.has(P.map)) return; P._dfW = (P._dfW || 0) + (dt || 0.016);
  if (!P._dfWarn || G.t - P._dfWarn > 20) { P._dfWarn = G.t; toast(L2('¡Tu fruta no te deja nadar! Pierdes vida bajo el agua.', 'Your fruit will not let you swim! You lose HP underwater.'), 'warn', 4); }
  if (P._dfW >= 1) { P._dfW = 0; const d = Math.max(1, Math.round(P.S.maxhp * 0.04)); P.hp -= d; floatText(P.x, P.y - 34, d, '#5aa8ff'); if (P.hp <= 0) playerDie(); } });
// The existing Shanks option handles all fruits and preserves the landing permit.
function dfConfirmRemove(P){
 const kind=P.fruit,D=DFR[kind],rank=D?.rank||0;
 const ready=()=>G.P===P&&P.fruit===kind&&(!rank||volRank()>=rank||P.bossKills?.[SH_BOSS]);
 if(!ready()){
  typeText(L2('Shanks: Desarrolla tu Voluntad hasta el rango ','Shanks: Raise your Will to rank ')+rank+
   L2(' o gana mi duelo. Entonces podré quitarte este poder.',' or win my duel. Then I can remove this power.'));
  return;
 }
 closeDialog();
 xMsg('🍇 '+L2('Quitar la fruta','Remove the fruit'),
  L2('Shanks: Perderás las técnicas de la fruta. Podrás comerte otra y volver a nadar.','Shanks: You’ll lose the fruit techniques. You can eat another fruit and swim again.'),[
   ['✔ '+L2('Sí, quítamela','Yes, remove it'),()=>{
    if(!ready())return;
    dfClearNewEffects(P);
    if(kind==='transparente')removeBuff(P,'df_invis');
    P.gfusen=0;P.fruit=null;dfSyncSkills();uiDirty.hud=true;
    burst(P.x,P.y-14,30,{sp:80,up:50,g:20,life:.8,c:['#ffffff','#c8c8d0']});
    toast(L2('Ya no tienes poderes de fruta.','You no longer have fruit powers.'),'info',4);markDirty(true);
   }]
  ]);
}
DLG_HOOKS.push((npc,opts)=>{
 const P=G.P;
 if(P?.fruit&&npc.id==='dawn_shanks')opts.push({label:'🍇 '+L2('Quitarme la fruta','Remove my fruit'),icon:['star','#7a46c8'],fn:()=>dfConfirmRemove(P)});
});

// ---------- la Fruta Transparente aparece en las islas de Dawn ----------
const DF_SPAWN = { t: 0, f: null };
function dfTrySpawn() { const P = G.P, M = G.map; if (!P || !M || M.id !== 'dawn' || P.dawnHelm || P.dead || DF_SPAWN.f) return; if (countItem('df_transparente') || P.fruit === 'transparente') return;
  if (G.t - DF_SPAWN.t < 45) return; DF_SPAWN.t = G.t; if (Math.random() > 0.12) return;
  for (let k = 0; k < 60; k++) { const a = Math.random() * 6.283, d = 6 + Math.random() * 14, x = Math.floor(P.x / 16 + Math.cos(a) * d), y = Math.floor(P.y / 16 + Math.sin(a) * d); if (x < 2 || y < 2 || x >= M.w - 2 || y >= M.h - 2) continue; const i = M.I(x, y);
    if (SOLID_T[M.ter[i]] || WATERY[M.ter[i]] || M.ter[i] === T.DEEP || (M.solidO && M.solidO[i])) continue;
    DF_SPAWN.f = { x: x * 16 + 8, y: y * 16 + 10, t: G.t }; banner('🍐 ' + L2('¡Una fruta extraña!', 'A strange fruit!'), L2('Ha aparecido cerca. Búscala antes de que desaparezca (4 min).', 'It appeared nearby. Find it before it vanishes (4 min).')); sfx('quest');
    try { setWp({ loc: [x, y], m: 'dawn', t: ITEMS.df_transparente.n }); } catch (e) { } return; } }
V33_TICKS.push(() => { try { dfTrySpawn(); const F = DF_SPAWN.f; if (F && (G.t - F.t > 240 || !G.map || G.map.id !== 'dawn')) DF_SPAWN.f = null; } catch (e) { } });
const DF_ICV={};
DL_HOOKS.push((list,cx,cy)=>{
 const F=DF_SPAWN.f;if(!F||G.map?.id!=='dawn')return;
 const D=DFR[F.kind||'transparente'],key=ITEMS[D.item].icon[0];
 const sprite=DF_ICV[key]||(DF_ICV[key]=genIcon([key]).canvas());
 list.push({type:'xdraw',x:F.x,y:F.y,draw:()=>{
  const bob=Math.sin(G.t*3)*2,xx=Math.round(F.x-cx-8),yy=Math.round(F.y-cy-18+bob);
  ctx.save();ctx.globalAlpha=F.kind?1:.55+Math.sin(G.t*4)*.25;
  ctx.drawImage(sprite,xx,yy,16,16);ctx.restore();
 }});
});
XACT.df_pick=[L2('Coger la fruta','Pick up the fruit'),'star',()=>{
 const P=G.P,F=DF_SPAWN.f;
 if(!F||P.dawnHelm||P.dead||G.map?.id!=='dawn'||dist2(P.x,P.y,F.x,F.y)>30**2)return;
 const D=DFR[F.kind||'transparente'];
 if(!giveItem(D.item,1,true))return;
 DF_SPAWN.f=null;P.dfKey=1;
 if(P.wp?.m==='dawn'&&P.wp.x===(F.x>>4)&&P.wp.y===(F.y>>4))P.wp=null;
 sfx('quest');banner(D.ic+' '+ITEMS[D.item].n,L2('Cómela desde el inventario.','Eat it from the inventory.'));
 markDirty(true);
}];
{ const _it = interactTarget; interactTarget = function () { const P = G.P, F = DF_SPAWN.f; if (F && P && G.map && G.map.id === 'dawn' && !P.dawnHelm && dist2(P.x, P.y, F.x, F.y) < 30 * 30) return { kind: 'xact', label: XACT.df_pick[0], icon: 'star', o: { xact: 'df_pick' } }; return _it.apply(this, arguments); }; }

// ---------- botín de cada jefe encima de su barra de vida ----------
// extras que no están en BOSSES[id].drops (se dan por código): [objeto, probabilidad, nota]
const BOSS_EXTRA = { tj_hilandera: () => { const P = G.P; return dfCanDrop() ? [[DF_ID, DF_CH, L2('segura en ', 'sure in ') + Math.max(1, DF_PITY - ((P && P.dfPity) || 0))]] : []; } };
function bossDropsText(m) { const D = m && m.def; if (!D) return ''; const pct = c => (c >= 1 ? 100 : Math.round(c * 1000) / 10) + ' %';
  const L = (D.drops || []).filter(d => ITEMS[d[0]]).map(([id, c, n]) => ITEMS[id].n + (n > 1 ? ' ×1-' + n : '') + ' ' + pct(c));
  const X = BOSS_EXTRA[m.mid] ? BOSS_EXTRA[m.mid]() : []; for (const [id, c, note] of X) if (ITEMS[id]) L.push('⭐ ' + ITEMS[id].n + ' ' + pct(c) + (note ? ' (' + note + ')' : ''));
  if (D.acc && ITEMS[D.acc]) L.push(ITEMS[D.acc].n); if (D.reward && ITEMS[D.reward]) L.push(ITEMS[D.reward].n);
  return L.length ? '🎁 ' + L.join(' · ') : ''; }
{ const _sb = showBoss; showBoss = function (m) { const r = _sb.apply(this, arguments); try { const el = $('#bossbar'); if (!el) return r; let s = el.querySelector('.bdrops'); if (!s) { s = document.createElement('small'); s.className = 'bdrops'; el.insertBefore(s, el.querySelector('.bar')); } s.textContent = m ? bossDropsText(m) : ''; s.hidden = !m || !s.textContent; } catch (e) { } return r; }; }
{ const st = document.createElement('style'); st.textContent = '#bossbar .bdrops{display:block;font-size:.62em;line-height:1.25;opacity:.92;color:#ffe8b0;text-shadow:0 1px 0 #000;margin:.1em 0 .15em;white-space:normal}.dfsk{margin:0 0 .6em;padding-bottom:.5em;border-bottom:1px solid rgba(220,180,110,.3)}.dfsk .row{display:flex;gap:.3em;margin-top:.2em}'; document.head.appendChild(st); }

// ---------- Lupa: progresión crossover ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['crossover583', '🏴‍☠️ ' + L2('Progresión crossover (Dawn, frutas y Engranaje 2)', 'Crossover progression (Dawn, fruits and Gear 2)'), () => [
  L2('1. Nivel 500: la Capitana Marina (Puerto Coral) te da un bote para el Mar de Dawn y puedes abordar el galeón de Alvida.', '1. Level 500: Captain Marina (Coral Port) gives you a boat for the Dawn Sea and you can board Alvida\'s galleon.'),
  L2('2. Fruta del Diablo: la Hilandera Muda (nivel 600, Tierras Tejidas) la suelta con un 5 % y es segura a los 20 intentos (la barra del jefe enseña cuántos faltan). Abre para siempre los desembarcos de Foosha y Shells Town.', '2. Devil Fruit: the Mute Spinner (level 600, Woven Lands) drops it at 5% and it is guaranteed by the 20th try (the boss bar shows how many are left). It opens the Foosha and Shells Town landings for good.'),
  L2('3. Si te la comes: cuerpo de goma. Técnicas en Habilidades › Fruta: Pistola, Ametralladora, Hacha, Bazuca y Globo; además tus golpes cuerpo a cuerpo estiran el brazo con el arma.', '3. If you eat it: rubber body. Techniques in Skills › Fruit: Pistol, Gatling, Axe, Bazooka and Balloon; and your melee hits stretch your arm with the weapon.'),
  L2('4. Fruta Transparente: aparece a veces en las islas de Dawn (con aviso y flecha, 4 minutos). Comida: invisibilidad 6 s.', '4. Clear Fruit: it sometimes appears on the Dawn islands (with a warning and an arrow, 4 minutes). Eaten: 6 s invisibility.'),
  L2('⚠ Con una fruta no puedes nadar (pierdes vida en el Fondo Marino y en Nerea). El inventario impide comer otra hasta que Shanks (Foosha) retire el poder.', '⚠ With a fruit you cannot swim (you lose HP on the Seabed and in Nerea). The bag blocks eating another until Shanks (Foosha) removes your power.'),
  L2('5. Engranaje 2 (nivel 600): vence a la Rueca Desbocada, desembarca en Foosha y gana el duelo contra Shanks; luego él hace el ritual.', '5. Gear 2 (level 600): defeat the Runaway Spinning Wheel, land at Foosha and win the duel against Shanks; then he performs the ritual.'),
  L2('🎁 Todos los jefes enseñan encima de su barra de vida lo que sueltan y con qué probabilidad.', '🎁 Every boss shows above its health bar what it drops and how likely it is.')
], () => { const P = G.P; if (!P) return null; return dfHas() ? { loc: [229, 129], m: 'world', t: L2('Capitana Marina', 'Captain Marina') } : { loc: TJ_BOSS_AT.tj_hilandera, m: 'world', t: BOSSES.tj_hilandera.n }; }]);
