// ================= MENUS (panel with tabs) =================
let panelTab = 'char', invSel = -1, invFilter = 'all', skSel = null, qSel = null, eqSel = null;
const TABS = [['char', 'Personaje', ['sword', 3]], ['inv', 'Inventario', ['bag']], ['skills', 'Habilidades', ['star', '#ffd040']], ['jobs', 'Oficios', ['anvil']], ['quest', 'Misiones', ['book']], ['map', 'Mapa', ['map']], ['wardrobe', 'Armario', ['hanger']], ['best', 'Enciclopedia', ['paw']], ['rel', 'Relaciones', ['heart', '#ff5a8a']], ['pass', 'Pase', ['star', '#ff8ab0']], ['pets', 'Mascotas', ['paw']], ['souls', 'Almas', ['soul', '#5ab0ff']], ['world', 'Mundo', ['flag']], ['opts', 'Ajustes', ['gear']]];
function openPanel(tab) { if (!G.P || G.P.dead) return; closeDialog(); panelTab = tab || panelTab; $('#panel').hidden = false; G.paused = true; renderPanel(); sfx('ui'); }
function closePanel() { $('#panel').hidden = true; G.paused = !$('#modal').hidden || !$('#dialog').hidden; sfx('ui'); }
function renderPanel() {
  if (panelTab === 'souls' && G.P.cls !== 'invocador') panelTab = 'char';
  $('#ptabs').innerHTML = TABS.filter(t => t[0] !== 'souls' || G.P.cls === 'invocador').map(([k, n, ic]) => `<button class="tab ${k === panelTab ? 'on' : ''}" data-t="${k}">${iconHTML(ic, 18)}<span>${n}</span>${k === 'skills' && G.P.spts ? '<b class="dot"></b>' : ''}${k === 'char' && G.P.apts ? '<b class="dot"></b>' : ''}</button>`).join('');
  $$('#ptabs .tab').forEach(b => b.onclick = () => { panelTab = b.dataset.t; renderPanel(); sfx('ui'); });
  const B = $('#pbody'); B.scrollTop = 0;
  ({ char: renderChar, inv: renderInv, skills: renderSkills, jobs: renderJobs, quest: renderQuests, map: renderMap, wardrobe: renderWardrobe, best: renderEncyclo, rel: renderRel, pass: renderPass, pets: renderPets, souls: renderSoulsTab, world: renderWorldTab, opts: renderOpts })[panelTab](B);
}
function statLine(k, v) { return `<div class="st"><span>${k}</span><b>${v}</b></div>`; }
function itemStatsHTML(it) {
  const L = []; if (it.atk) L.push(['Ataque', '+' + it.atk]); if (it.def) L.push(['Defensa', '+' + it.def]); if (it.hpB) L.push(['Vida', '+' + it.hpB]); if (it.mpB) L.push(['Maná', '+' + it.mpB]); if (it.crit) L.push(['Crítico', '+' + it.crit + '%']); if (it.spdB) L.push(['Velocidad', '+' + it.spdB]);
  if (it.heal) L.push(['Cura', fmt(Math.min(it.heal, 99999)) + (it.heal > 9999 ? ' (total)' : '')]); if (it.mana) L.push(['Maná', '+' + fmt(Math.min(it.mana, 99999))]); if (it.food) L.push(['Comida', '+' + it.food + '% ataque, 3 min']); if (it.power) L.push(['Potencia', it.power]);
  return L.map(([a, b]) => statLine(a, b)).join('') + weaponDescHTML(it);
}
function typeName(it) { switch (it.t) { case 'weapon': return 'Arma' + (it.cls ? ' · ' + CLASSES[it.cls].n : ''); case 'armor': return { head: 'Casco', body: 'Armadura', legs: 'Grebas', feet: 'Botas' }[it.slot]; case 'acc': return it.slot === 'neck' ? 'Amuleto' : 'Anillo'; case 'cos': return 'Cosmético · ' + ({ head: 'Cabeza', body: 'Torso', legs: 'Piernas', feet: 'Pies', back: 'Espalda' }[COSM[it.cos].slot]) + ((G.P.wardrobe || []).includes(it.cos) ? ' · ya lo tienes' : ''); case 'tool': return 'Herramienta · ' + JOBS[it.tool].n; case 'mat': return it.fish ? 'Pescado' : 'Material'; case 'cons': return 'Consumible'; case 'quest': return 'Objeto de misión'; } return ''; }
// ---------- character ----------
let previewT = 0;
function renderChar(B) {
  const P = G.P, S = P.S, C_ = CLASSES[P.cls];
  const slot = (s, lab) => { const e = P.equip[s]; return `<button class="eq ${eqSel === s ? 'sel' : ''}" data-s="${s}">${e ? iconHTML(ITEMS[e.id].icon, 32) + (e.up ? `<em class="upl">+${e.up}</em>` : '') : '<span class="ph">' + lab + '</span>'}</button>`; };
  const at = (k, n) => `<div class="attr"><span>${n}</span><b>${P.attr[k]}</b>${P.apts ? `<button class="plus" data-a="${k}">+</button>` : ''}</div>`;
  const e = eqSel && P.equip[eqSel] ? ITEMS[P.equip[eqSel].id] : null;
  B.innerHTML = `<div class="charwrap"><div class="frame chL"><div class="eqrow">${slot('head', 'Casco')}${slot('neck', 'Amul.')}</div><div class="eqrow">${slot('weapon', 'Arma')}<canvas id="prev" width="48" height="48"></canvas>${slot('acc', 'Anillo')}</div><div class="eqrow">${slot('body', 'Armad.')}${slot('legs', 'Grebas')}${slot('feet', 'Botas')}</div>
  ${e ? `<div class="eqinfo"><b style="color:${RARC[e.rar || 0]}">${P.equip[eqSel].up ? '+' + P.equip[eqSel].up + ' ' : ''}${esc(e.n)}</b>${itemStatsHTML(e)}<button class="btn" id="uneq">Quitar</button></div>` : '<p class="hint">Toca un espacio para ver tu equipo. Equipa desde el Inventario.</p>'}</div>
  <div class="frame chR"><h2>${esc(P.name)}</h2><p class="sub">${C_.n} · Nivel ${P.lv} · Poder ${fmt(S.power)}</p><div class="xpline"><div class="bar xp big"><i style="width:${P.lv >= MAXLV ? 100 : (100 * P.xp / xpToNext(P.lv)).toFixed(1)}%"></i></div><small>${P.lv >= MAXLV ? 'Nivel máximo' : fmt(P.xp) + ' / ' + fmt(xpToNext(P.lv)) + ' XP'}</small></div>
  <div class="stats">${statLine('Vida', fmt(S.maxhp))}${statLine('Maná', fmt(S.maxmp))}${statLine('Ataque', fmt(S.atk))}${statLine('Defensa', fmt(S.def))}${statLine('Crítico', S.crit.toFixed(1) + '%')}${statLine('Daño crítico', S.critD + '%')}${statLine('Vel. ataque', (1 / S.aspd).toFixed(2) + '/s')}${statLine('Velocidad', Math.round(S.spd))}${S.life ? statLine('Robo de vida', S.life + '%') : ''}${S.dodge ? statLine('Esquiva', S.dodge + '%') : ''}</div>
  <h3>Atributos ${P.apts ? `<span class="pill">${P.apts} puntos</span>` : ''}</h3><div class="attrs">${at('str', 'Fuerza')}${at('int', 'Inteligencia')}${at('dex', 'Destreza')}${at('vit', 'Vitalidad')}</div>
  <p class="hint">${C_.n}: tu atributo principal es <b>${{ str: 'Fuerza', int: 'Inteligencia', dex: 'Destreza' }[C_.main]}</b>. Vitalidad aumenta vida y defensa.</p>
  <div class="goldline">${iconHTML(['coin'], 18)} ${fmt(P.gold)} oro · ${P.stats.kills || 0} enemigos derrotados</div></div></div>`;
  $$('.eq').forEach(b => b.onclick = () => { eqSel = eqSel === b.dataset.s ? null : b.dataset.s; renderPanel(); });
  const u = $('#uneq'); if (u) u.onclick = () => { unequip(eqSel); eqSel = null; renderPanel(); };
  $$('.plus').forEach(b => b.onclick = () => { if (P.apts <= 0) return; P.attr[b.dataset.a]++; P.apts--; calcStats(P); sfx('ui'); renderPanel(); uiDirty.hud = true; });
  previewT = 0; animPreview();
}
function animPreview() { const c = $('#prev'); if (!c) return; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; const A = G.P.atlas; const dir = Math.floor(previewT / 1.6) % 4, f = Math.floor(previewT * 7) % 4; x.clearRect(0, 0, 48, 48); x.drawImage(A.img, (A.idx.walk + f) * A.fw, [0, 1, 3, 2][dir] * A.fh, A.fw, A.fh, (48 - A.fw) / 2, 48 - A.fh, A.fw, A.fh); }
// ---------- inventory ----------
function renderInv(B) {
  const P = G.P; const flt = { all: () => true, eq: it => it.slot || it.t === 'tool', mat: it => it.t === 'mat', cons: it => it.t === 'cons', quest: it => it.t === 'quest' }[invFilter];
  const chips = [['all', 'Todo'], ['eq', 'Equipo'], ['mat', 'Materiales'], ['cons', 'Consumibles'], ['quest', 'Misión']].map(([k, n]) => `<button class="chip ${invFilter === k ? 'on' : ''}" data-f="${k}">${n}</button>`).join('');
  let cells = ''; for (let i = 0; i < INV_MAX; i++) { const s = P.inv[i]; if (s && !flt(ITEMS[s.id])) continue; if (!s && invFilter !== 'all') continue; cells += s ? `<button class="slot r${ITEMS[s.id].rar || 0} ${invSel === i ? 'sel' : ''}" data-i="${i}">${iconHTML(ITEMS[s.id].icon, 32)}${s.q > 1 ? `<em>${s.q}</em>` : ''}${s.up ? `<em class="upl">+${s.up}</em>` : ''}${canEquip(s.id) === null && (ITEMS[s.id].slot) && betterThanEquipped(s.id) ? '<b class="up">▲</b>' : ''}</button>` : `<div class="slot empty"></div>`; }
  const s = P.inv[invSel], it = s ? ITEMS[s.id] : null;
  let det = '<p class="hint">Toca un objeto para ver sus detalles.</p>';
  if (it) {
    const why = it.slot ? canEquip(s.id) : null; const req = it.lv ? `<div class="req ${P.lv < it.lv ? 'bad' : ''}">Requiere nivel ${it.lv}</div>` : '';
    det = `<div class="ihead">${iconHTML(it.icon, 48)}<div><b style="color:${RARC[it.rar || 0]}">${s.up ? '+' + s.up + ' ' : ''}${esc(it.n)}</b><small>${typeName(it)}${it.tier && it.t === 'mat' ? ' · Nivel ' + it.tier : ''}</small></div></div>${req}<div class="stats">${itemStatsHTML(it)}</div>${it.slot && P.equip[it.slot] ? `<div class="cmp">Equipado: ${esc(ITEMS[P.equip[it.slot].id].n)}</div>` : ''}
    <div class="row">${it.slot ? `<button class="btn gold" id="iuse" ${why ? 'disabled' : ''}>${why || 'Equipar'}</button>` : it.t === 'cons' ? `<button class="btn gold" id="iuse">Usar</button>${it.heal && !it.food ? `<button class="btn" id="ipot">${P.potion === s.id ? 'Poción rápida ✓' : 'Usar como poción rápida'}</button>` : ''}` : ''}
    ${it.t !== 'quest' ? `<button class="btn danger" id="idrop">${dropConfirm === invSel ? '¿Seguro? Tirar' : 'Tirar'}</button>` : ''}</div><p class="val">${iconHTML(['coin'], 14)} Valor: ${fmt(Math.floor(it.price * 0.4))} oro</p>`;
  }
  B.innerHTML = `<div class="invwrap"><div class="frame invL"><div class="chips">${chips}</div><div class="grid">${cells}</div><div class="goldline">${iconHTML(['coin'], 18)} ${fmt(P.gold)} oro · ${P.inv.length}/${INV_MAX}</div></div><div class="frame invR">${det}</div></div>`;
  $$('.chip').forEach(b => b.onclick = () => { invFilter = b.dataset.f; invSel = -1; renderPanel(); });
  $$('.slot[data-i]').forEach(b => b.onclick = () => { invSel = +b.dataset.i; dropConfirm = -1; renderPanel(); sfx('ui'); });
  const u = $('#iuse'); if (u) u.onclick = () => { useItem(invSel); invSel = -1; renderPanel(); };
  const pq = $('#ipot'); if (pq) pq.onclick = () => { P.potion = s.id; toast('Poción rápida: ' + it.n); renderPanel(); uiDirty.hud = true; };
  const d = $('#idrop'); if (d) d.onclick = () => { if (dropConfirm !== invSel) { dropConfirm = invSel; renderPanel(); return; } P.inv.splice(invSel, 1); invSel = -1; dropConfirm = -1; renderPanel(); };
}
let dropConfirm = -1;
function betterThanEquipped(id) { const it = ITEMS[id], cur = G.P.equip[it.slot]; const sc = x => x ? (ITEMS[x].atk || 0) * 2 + (ITEMS[x].def || 0) * 2 + (ITEMS[x].hpB || 0) * 0.2 + (ITEMS[x].crit || 0) * 3 : -1; return sc(id) > sc(cur && cur.id); }
// ---------- skills ----------
function skillDesc(id, r) { const s = SK[id], v = skillVal(id, Math.max(1, r)); return s.d.replace(/\{(\w+)\}/g, (_, k) => v[k] !== undefined ? (+v[k]).toFixed(v[k] % 1 ? 1 : 0) : '?'); }
function renderSkills(B) {
  const P = G.P, br = BR[P.cls], ids = Object.keys(SK).filter(k => SK[k].cls === P.cls);
  const col = b => ids.filter(k => SK[k].b === b).sort((a, c) => SK[a].row - SK[c].row).map(k => { const s = SK[k], r = P.skills[k] || 0, can = !canLearn(k); const locked = P.lv < s.req || (s.pre && !P.skills[s.pre]); return `<button class="node ${r ? 'has' : ''} ${locked ? 'locked' : ''} ${skSel === k ? 'sel' : ''} ${can ? 'can' : ''} ${s.type}" data-k="${k}">${iconHTML(s.icon, 28)}<em>${r}/${s.max}</em>${s.type === 'pas' ? '<i class="pas">P</i>' : ''}</button>`; }).join('<div class="link"></div>');
  const slots = P.slots.map((id, i) => `<button class="sslot" data-i="${i}">${id ? iconHTML(SK[id].icon, 24) : '<span>' + (i + 1) + '</span>'}</button>`).join('');
  let det = '<p class="hint">Toca una habilidad para ver sus detalles. Ganas 1 punto por nivel.</p>';
  if (skSel) { const s = SK[skSel], r = P.skills[skSel] || 0, why = canLearn(skSel);
    det = `<div class="ihead">${iconHTML(s.icon, 44)}<div><b>${esc(s.n)}</b><small>${s.type === 'act' ? 'Activa' : 'Pasiva'} · ${br[s.b]} · Rango ${r}/${s.max}</small></div></div>
    <p>${esc(skillDesc(skSel, r || 1))}</p>${r && r < s.max ? `<p class="next">Siguiente rango: ${esc(skillDesc(skSel, r + 1))}</p>` : ''}
    ${s.type === 'act' ? `<div class="stats">${statLine('Maná', s.mp)}${statLine('Recarga', s.cd + ' s')}</div>` : ''}
    <div class="req ${P.lv < s.req ? 'bad' : ''}">Requiere nivel ${s.req}${s.pre ? ' · ' + SK[s.pre].n : ''}</div>
    <div class="row"><button class="btn gold" id="learn" ${why ? 'disabled' : ''}>${why || (r ? 'Mejorar (+1)' : 'Aprender')}</button></div>
    ${s.type === 'act' && r ? `<p class="hint">Equipar en ranura:</p><div class="row">${[0, 1, 2, 3].map(i => `<button class="btn sm" data-eqs="${i}">${i + 1}${P.slots[i] === skSel ? ' ✓' : ''}</button>`).join('')}</div>` : ''}`; }
  B.innerHTML = `<div class="skwrap"><div class="frame skL"><div class="skhead"><span class="pill big">${P.spts} puntos</span><div class="sslots">${slots}</div></div><div class="tree">${br.map((n, b) => `<div class="bcol"><h3>${n}</h3>${col(b)}</div>`).join('')}</div></div><div class="frame skR">${det}</div></div>${soulsHTML()}`; bindSouls(B);
  $$('.node').forEach(b => b.onclick = () => { skSel = b.dataset.k; renderPanel(); sfx('ui'); });
  const l = $('#learn'); if (l) l.onclick = () => { learnSkill(skSel); renderPanel(); };
  $$('[data-eqs]').forEach(b => b.onclick = () => { const i = +b.dataset.eqs; const prev = P.slots.indexOf(skSel); if (prev >= 0) P.slots[prev] = null; P.slots[i] = skSel; uiDirty.hud = true; sfx('equip'); renderPanel(); });
}
// ---------- jobs ----------
function renderJobs(B) {
  const P = G.P;
  const unlocks = { tala: ['Roble', 'Pino', 'Abedul', 'Ébano', 'Sauce', 'Pino Escarchado', 'Ceniza'], mineria: ['Cobre', 'Hierro', 'Plata', 'Oro', 'Mithril', 'Adamantita', 'Cristal Rúnico'], herbo: ['Hierba Verde', 'Flor Azul', 'Raíz Roja', 'Loto Gris', 'Flor de Luna', 'Flor de Nieve', 'Hierba Ígnea'], pesca: ['Sardina/Trucha/Carpa', 'Salmón/Lubina/Perca', 'Pez Globo/Anguila/Lucio', 'Pez Espada/Trucha Dorada/Pez Luna', 'Pez de Hielo/Pez Linterna', 'Atún Real/Koi', 'Pez Dragón'] };
  const tools = { tala: 'Hacha', mineria: 'Pico', pesca: 'Caña' };
  B.innerHTML = `<div class="frame jobs">${Object.keys(JOBS).map(k => { const J = P.jobs[k], D = JOBS[k]; let next = ''; if (unlocks[k]) { const t = RESLV.findIndex((l, i) => i > 0 && l > J.lv); next = t > 0 ? `Nivel ${RESLV[t]}: ${unlocks[k][t - 1]}` : 'Todo desbloqueado'; } else next = 'Fabrica en ' + (k === 'herreria' ? 'herrerías' : k === 'alquimia' ? 'alquimistas' : 'posadas');
    const tl = tools[k] ? ` · ${tools[k]}: ${bestTool(k) ? ['', 'Cobre', 'Hierro', 'Mithril', 'Rúnico'][bestTool(k)] : '<span class="bad">ninguna</span>'}` : '';
    return `<div class="job">${iconHTML(D.icon === 'herb' ? ['herb', 1] : D.icon === 'potion' ? ['potion', '#c040e0'] : D.icon === 'food' ? ['food', 2] : D.icon === 'anvil' ? ['anvil'] : [D.icon, 2], 36)}<div class="jb"><b>${D.n} <span class="pill">Nv. ${J.lv}</span></b><div class="bar xp"><i style="width:${J.lv >= JOBMAX ? 100 : (100 * J.xp / jobXpToNext(J.lv)).toFixed(1)}%"></i></div><small>${esc(D.desc)}</small><small class="nx">${esc(next)}${tl}</small><div class="perks">${perkLine(k)}</div></div></div>`; }).join('')}</div>`;
}
// ---------- quests ----------
function renderQuests(B) {
  const P = G.P, act = Object.keys(P.quests.active).sort((a, b) => (QD(b).main ? 1 : 0) - (QD(a).main ? 1 : 0));
  if (!qSel || !P.quests.active[qSel]) qSel = P.track || act[0] || null;
  const list = act.map(id => { const Q = QD(id); return `<button class="qi ${qSel === id ? 'sel' : ''} ${Q.main ? 'main' : ''}" data-q="${id}"><span class="ex">${questReady(id) ? '?' : '!'}</span><div><b>${esc(Q.n)}</b><small>${Q.main ? 'Historia' : Q.board ? 'Gremio' : 'Secundaria'} · Nv. ${Q.lv}</small></div>${P.track === id ? '<i class="trk">◆</i>' : ''}</button>`; }).join('') || '<p class="hint">No tienes misiones activas. Busca personajes con <b class="exc">!</b> sobre la cabeza.</p>';
  let det = '';
  if (qSel) { const Q = QD(qSel), R = Q.rew; det = `<h2>${esc(Q.n)}</h2><p class="sub">${Q.main ? 'Misión principal' : 'Misión secundaria'} · Entrega: ${esc(NPCS[turnInNpc(Q)] ? NPCS[turnInNpc(Q)].n : 'Kael')}</p><p>${esc(Q.desc)}</p><h3>Objetivos</h3><ul class="objs">${Q.obj.map((o, i) => `<li class="${objCount(Q, i) >= (o.n || 1) ? 'ok' : ''}">${esc(objText(Q, i))}</li>`).join('')}</ul>
    <h3>Guía paso a paso</h3><ol class="guide">${questGuide(qSel).map(g => `<li>${g}</li>`).join('')}</ol>
    <h3>Recompensas</h3><div class="rew">${R.xp ? `<span>${fmt(R.xp)} XP</span>` : ''}${R.gold ? `<span>${iconHTML(['coin'], 14)} ${fmt(R.gold)}</span>` : ''}${(R.items || []).map(([id, n]) => `<span>${iconHTML(ITEMS[id].icon, 16)} ${esc(ITEMS[id].n)}${n > 1 ? ' ×' + n : ''}</span>`).join('')}</div>
    <div class="row"><button class="btn gold" id="qtrack">${P.track === qSel ? 'Siguiendo ✓' : 'Seguir en pantalla'}</button><button class="btn" id="qmap">Ver en el mapa</button>${!Q.main ? `<button class="btn danger" id="qab">${qAbandon === qSel ? '¿Seguro? Abandonar' : 'Abandonar'}</button>` : ''}</div>`; }
  const avail = Object.keys(QUESTS).filter(canOffer).slice(0, 6).map(id => `<li>${esc(QUESTS[id].n)} — ${esc(NPCS[QUESTS[id].giver].n)}</li>`).join('');
  const ng = guideTarget(); const nextHint = !act.length && ng && ng.next ? `<p class="hint">Siguiente misión de la historia: <b>${esc(QUESTS[ng.next].n)}</b>. ${esc(ng.label)}${npcPlace(ng.npc)}. La flecha dorada te lleva.</p>` : '';
  B.innerHTML = `<div class="qwrap"><div class="frame qL">${list}${nextHint}${avail ? `<h3>Disponibles</h3><ul class="avail">${avail}</ul>` : ''}<h3>Guía del aventurero</h3>${GUIDE.map((g, i) => `<details class="gd"${i === 0 && !act.length ? ' open' : ''}><summary>${esc(g[0])}</summary><p>${g[1]}</p></details>`).join('')}</div><div class="frame qR">${det || '<p class="hint">Selecciona una misión.</p>'}</div></div>`;
  const qm = $('#qmap'); if (qm) qm.onclick = () => { P.track = qSel; uiDirty.quest = true; panelTab = 'map'; renderPanel(); };
  $$('.qi').forEach(b => b.onclick = () => { qSel = b.dataset.q; qAbandon = null; renderPanel(); });
  const t = $('#qtrack'); if (t) t.onclick = () => { P.track = qSel; uiDirty.quest = true; renderPanel(); };
  const a = $('#qab'); if (a) a.onclick = () => { if (qAbandon !== qSel) { qAbandon = qSel; renderPanel(); return; } delete P.quests.active[qSel]; if (P.track === qSel) P.track = null; qSel = null; qAbandon = null; uiDirty.quest = true; renderPanel(); };
}
let qAbandon = null;
// ---------- bestiary ----------
let bSel = null, bReg = 'all';
const AI_N = { passive: 'Pacífico', aggro: 'Agresivo', ranged: 'A distancia', charge: 'Embiste' };
function renderBestiary(B) {
  const P = G.P, best = P.best || {};
  const regs = REGIONS.filter(R => R.k !== 'mar').concat([{ k: 'cueva', n: 'Cuevas' }]);
  const entries = []; for (const id in MOBS) entries.push({ id, def: MOBS[id], boss: false, kills: best[id] || 0 });
  for (const id in BOSSES) entries.push({ id: 'B_' + id, bid: id, def: BOSSES[id], boss: true, kills: best['B_' + id] || (P.bossKills[id] || 0) });
  const inReg = e => bReg === 'all' || (bReg === 'cueva' && e.def.cave) || (e.boss ? bossRegion(e.bid) === bReg : (e.def.reg || []).includes(bReg));
  const list = entries.filter(inReg).sort((a, b) => (a.boss - b.boss) || ((a.def.lv[0] || a.def.lv) - (b.def.lv[0] || b.def.lv)));
  const known = entries.filter(e => e.kills > 0).length;
  if (!bSel || !entries.find(e => e.id === bSel)) bSel = list[0] && list[0].id;
  const cur = entries.find(e => e.id === bSel);
  const row = e => `<button class="bst ${bSel === e.id ? 'sel' : ''} ${e.kills ? '' : 'unk'} ${e.boss ? 'boss' : ''}" data-b="${e.id}"><canvas width="32" height="32" data-bc="${e.id}"></canvas><span><b>${e.kills ? esc(e.def.n) : '???'}</b><small>${e.boss ? 'Jefe · ' : ''}Nv. ${Array.isArray(e.def.lv) ? e.def.lv[0] + '–' + e.def.lv[1] : e.def.lv}</small></span></button>`;
  let det = '<p class="hint">Derrota enemigos para registrarlos.</p>';
  if (cur) { const D = cur.def, lv = Array.isArray(D.lv) ? Math.round((D.lv[0] + D.lv[1]) / 2) : D.lv, st = mobStats(D, lv, cur.boss); const k = cur.kills;
    const where = D.where ? D.where : cur.boss ? (REGIONS.find(r => r.k === bossRegion(cur.bid)) || {}).n || '' : (D.reg || []).map(r => (REGIONS.find(x => x.k === r) || {}).n).filter(Boolean).join(', ');
    const drops = (D.drops || []).map(([id, ch]) => `<span>${iconHTML(ITEMS[id].icon, 16)} ${k ? esc(ITEMS[id].n) : '???'}${cur.boss ? '' : ` <small>${k >= 5 ? (ch * 100).toFixed(ch < 0.05 ? 1 : 0) + '%' : ''}</small>`}</span>`).join('');
    const extra = cur.boss ? `${D.acc ? `<span>${iconHTML(ITEMS[D.acc].icon, 16)} ${k ? esc(ITEMS[D.acc].n) : '???'}</span>` : ''}${(D.cos || []).map(c => `<span>${iconHTML(['hanger'], 16)} ${k ? esc(COSM[c].n) : '???'} <small>${(P.wardrobe || []).includes(c) ? '✓' : ''}</small></span>`).join('')}` : '';
    det = `<div class="bhead"><canvas id="bBig" width="96" height="96"></canvas><div><h2>${k ? esc(D.n) : '???'}</h2><p class="sub">${cur.boss ? 'Jefe' : AI_N[D.ai] || ''} · Nivel ${Array.isArray(D.lv) ? D.lv[0] + '–' + D.lv[1] : D.lv}</p><p class="sub">${esc(where)}</p></div></div>
      <div class="stats">${statLine('Derrotados', fmt(k))}${k ? statLine('Vida (nv. ' + lv + ')', fmt(st.hp)) + statLine('Ataque', fmt(st.atk)) + statLine('Defensa', fmt(st.def)) + statLine('Experiencia', fmt(cur.boss ? Math.round(st.xp * 1.6) : st.xp)) : ''}${D.poison ? statLine('Efecto', 'Veneno') : D.burn ? statLine('Efecto', 'Quemadura') : ''}</div>
      <h3>Botín</h3><div class="rew bdrops">${drops}${extra}</div>${k && k < 5 && !cur.boss ? '<p class="hint">Derrota 5 para conocer las probabilidades de botín.</p>' : ''}${!k ? '<p class="hint">Aún no lo has derrotado. Búscalo en ' + esc(where || 'el mundo') + '.</p>' : ''}`; }
  B.innerHTML = `<div class="bwrap"><div class="frame bL"><div class="chips"><button class="chip ${bReg === 'all' ? 'on' : ''}" data-br="all">Todos</button>${regs.map(R => `<button class="chip ${bReg === R.k ? 'on' : ''}" data-br="${R.k}">${esc(R.n)}</button>`).join('')}</div><p class="hint">Registrados: ${known}/${entries.length}</p><div class="blist">${list.map(row).join('')}</div></div><div class="frame bR">${det}</div></div>`;
  $$('[data-br]', B).forEach(b => b.onclick = () => { bReg = b.dataset.br; bSel = null; sfx('ui'); renderPanel(); });
  $$('[data-b]', B).forEach(b => b.onclick = () => { bSel = b.dataset.b; sfx('ui'); renderPanel(); });
  const drawMob = (cv, e, big) => { const A = mobAtlasFor(e.def.art); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; const s = Math.min(cv.width / A.fw, cv.height / A.fh) * (big ? 1 : 1.1); x.clearRect(0, 0, cv.width, cv.height); if (!e.kills) x.filter = 'brightness(0)'; x.drawImage(A.img, A.idx.idle * A.fw, 0, A.fw, A.fh, (cv.width - A.fw * s) / 2, cv.height - A.fh * s, A.fw * s, A.fh * s); x.filter = 'none'; };
  $$('[data-bc]', B).forEach(cv => { const e = entries.find(x => x.id === cv.dataset.bc); if (e) drawMob(cv, e); });
  const bb = $('#bBig'); if (bb && cur) drawMob(bb, cur, true);
}
function bossRegion(id) { const b = G.world.bosses.find(x => x.id === id); return b ? (regionAt(b.x, b.y) || {}).k : null; }
const GUIDE = [
  ['Primeros pasos', 'Habla con los personajes que tienen <b>!</b> sobre la cabeza para recibir misiones. La misión que sigues aparece arriba a la izquierda y la <b>flecha dorada</b> alrededor de tu héroe apunta al objetivo (también en el minimapa). Cuando aparece <b>?</b> sobre alguien, vuelve a hablarle para cobrar la recompensa.'],
  ['Combate', 'Toca la <b>espada</b> para atacar (mantén pulsado para atacar seguido). El botón del <b>corredor</b> esquiva y te hace invulnerable un instante. Las habilidades se colocan en los botones redondos: aprende una en Habilidades y toca un botón vacío <b>+</b>.'],
  ['Subir de nivel', 'Ganas experiencia al derrotar enemigos, completar misiones y trabajar en los oficios. Cada nivel da puntos de <b>atributo</b> (Personaje) y de <b>habilidad</b>. Busca zonas acordes a tu nivel: el mapa muestra el rango de cada región. El nivel máximo es ' + MAXLV + '.'],
  ['Oficios', 'Lleva <b>hacha</b>, <b>caña</b> y <b>pico</b> en la mochila (te los regala la Anciana Mira) y pulsa el botón de acción frente a un árbol, el agua o una veta. Los materiales mejores piden más nivel de oficio y mejor herramienta. Herrería, alquimia, cocina y joyería se hacen en las ciudades.'],
  ['Equipo y forja', 'En la herrería se forjan armas, cascos, armaduras, grebas y botas. Cada pieza pide nivel, oro y a veces materiales. Todo lo que equipas se ve en tu personaje. En el <b>Armario</b> puedes ponerte cosméticos encima sin perder estadísticas.'],
  ['Viajar', 'Toca las <b>piedras de viaje</b> para activarlas; después puedes viajar entre ellas desde el mapa. Para llegar a otras tierras habla con la capitana Marina en Puerto Coral.'],
  ['Morir y guardar', 'Si caes, reapareces en la última ciudad y pierdes un poco de oro. La partida se guarda sola; descansar en la posada también guarda.'],
  ['Jugar en grupo', 'Abre el menú › Grupo para crear o unirte a un equipo con amigos. Los enemigos y la experiencia se comparten mientras estéis cerca.'],
];
function npcPlace(id) { const p = npcWorldPos(id); if (!p) return ''; const W = G.world, i = W.I(clamp(p[0] | 0, 0, W.w - 1), clamp(p[1] | 0, 0, W.h - 1)); return W.townAt[i] >= 0 ? ' en ' + TOWNS[W.townAt[i]].n : ' en ' + REGIONS[W.reg[i]].n; }
function questGuide(id) {
  const Q = QD(id), out = [];
  if (questReady(id)) { const n = turnInNpc(Q); return ['¡Objetivos cumplidos! Vuelve con <b>' + esc(NPCS[n] ? NPCS[n].n : 'Kael') + '</b>' + esc(npcPlace(n)) + ' y háblale para cobrar la recompensa (sigue la flecha dorada).']; }
  Q.obj.forEach((o, i) => {
    const done = objCount(Q, i) >= (o.n || 1); if (done) return; let h = '';
    if (o.t === 'kill') { const c = nearestCampOf(o.m, o.fam); const R = c ? regionAt(c.x, c.y) : null; h = 'Busca ' + esc(o.m ? MOBS[o.m].n : famName(o.fam)) + (R ? ' en <b>' + esc(R.n) + '</b> (Nv. ' + R.lv[0] + '–' + R.lv[1] + ')' : '') + '. La flecha dorada marca el campamento más cercano.'; }
    else if (o.t === 'boss') { const B = BOSSES[o.b], b = G.world.bosses.find(x => x.id === o.b); const R = b ? regionAt(b.x, b.y) : null; h = 'Derrota a <b>' + esc(B.n) + '</b> (Nv. ' + B.lv + ')' + (R ? ' en ' + esc(R.n) : '') + '. Lleva pociones y esquiva las zonas rojas. Recomendado: nivel ' + Math.max(1, B.lv - 1) + ' o más.'; }
    else if (o.t === 'talk') h = 'Habla con <b>' + esc(NPCS[o.npc].n) + '</b>' + esc(npcPlace(o.npc)) + '.';
    else if (o.t === 'item') { const I_ = ITEMS[o.it]; const src = itemSource(o.it); h = 'Consigue <b>' + esc(I_.n) + '</b>' + (o.n > 1 ? ' ×' + o.n : '') + (src ? ': ' + src : '') + '.'; }
    else if (o.t === 'job') { const J = { tala: ['tala árboles', 'hacha'], pesca: ['pesca en ríos o lagos', 'caña'], mineria: ['mina vetas de mineral', 'pico'], herbo: ['recoge hierbas', ''] }[o.job] || ['trabaja', '']; h = 'Acércate y ' + J[0] + ' pulsando el botón de <b>acción</b>' + (J[1] ? ' (necesitas un ' + J[1] + ' en la mochila' + (bestTool(o.job) ? ' — ya lo tienes' : ': pídeselo a la Anciana Mira') + ')' : '') + '.'; }
    else if (o.t === 'craft') h = 'Ve a la herrería de una ciudad, habla con el herrero y elige <b>Forjar</b>. Allí ves los materiales que faltan.';
    else if (o.t === 'level') h = 'Gana experiencia derrotando enemigos y completando misiones hasta el nivel ' + o.n + '.';
    if (h) out.push(h);
  });
  if (!out.length) out.push('Sigue la flecha dorada.');
  return out;
}
function itemSource(id) {
  const I_ = ITEMS[id]; if (!I_) return '';
  const mobs = Object.keys(MOBS).filter(k => (MOBS[k].drops || []).some(d => d[0] === id)).map(k => MOBS[k].n);
  if (mobs.length) return 'lo sueltan ' + esc(mobs.slice(0, 3).join(', '));
  if (I_.fish) return 'se pesca (Pesca nivel ' + RESLV[I_.tier] + ')'; if (/^log/.test(id)) return 'se tala (Tala nivel ' + RESLV[I_.tier] + ')'; if (/^ore/.test(id)) return 'se mina (Minería nivel ' + RESLV[I_.tier] + ')'; if (/^herb/.test(id)) return 'se recoge (Herboristería)';
  const r = RECIPES.find(r => r.out === id); if (r) return 'se fabrica con ' + JOBS[r.job].n;
  return '';
}
// ---------- world map ----------
let mapView = null;
function renderMap(B) {
  const W = G.world, bits = G.P.exploredBits, seen = (x, y) => { const i = W.I(x, y); return !!(bits[i >> 3] & (1 << (i & 7))); };
  const regs = REGIONS.filter(R => R.k !== 'mar').slice().sort((a, b) => a.lv[0] - b.lv[0]).map(R => { const k = seen(R.c[0], R.c[1]), ws = WAYSTONES.find(w => w.k === R.k) || (R.k === 'valle' ? WAYSTONES[0] : null), on = ws && G.P.ws[ws.k]; const cur = G.P.lv >= R.lv[0] && G.P.lv <= R.lv[1]; return `<div class="mreg ${k ? '' : 'dim'} ${cur ? 'cur' : ''}"><b>${k ? esc(R.n) : '???'}</b><small>Nv. ${R.lv[0]}–${R.lv[1]}</small>${on ? '<i class="mws" title="Piedra de viaje activada"></i>' : ''}</div>`; }).join('');
  B.innerHTML = `<div class="frame mapwrap"><div class="mapmain"><canvas id="wm"></canvas><div class="maplegend"><span><i style="background:#ffe040"></i>Misión</span><span><i style="background:#4ad8f0"></i>Piedra de viaje (toca para viajar)</span><span><i style="background:#ffffff"></i>Tú</span>${G.remote.size ? '<span><i style="background:#5ae0ff"></i>Jugadores</span>' : ''}</div></div><div class="mapregs"><h3>Regiones</h3>${regs}</div></div>`;
  const cvs = $('#wm'); const wrap = cvs.parentElement;
  const rw = wrap.clientWidth - 8, rh = Math.max(200, wrap.clientHeight - 30); const sc = Math.max(1, Math.min(rw / W.w, rh / W.h)); cvs.width = Math.floor(W.w * sc); cvs.height = Math.floor(W.h * sc); cvs.style.width = cvs.width + 'px'; cvs.style.height = cvs.height + 'px';
  const x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(mmBase, 0, 0, cvs.width, cvs.height);
  // fog
  const fog = mkCanvas(W.w, W.h), fx = fog.getContext('2d'), id = fx.createImageData(W.w, W.h), d = new Uint32Array(id.data.buffer);
  for (let i = 0; i < W.w * W.h; i++) if (!(bits[i >> 3] & (1 << (i & 7)))) d[i] = rgbU(18, 14, 12, 225);
  fx.putImageData(id, 0, 0); x.drawImage(fog, 0, 0, cvs.width, cvs.height);
  x.font = `bold ${Math.round(9 + sc * 1.5)}px 'Pixelify Sans', monospace`; x.textAlign = 'center';
  const label = (s, tx, ty, col) => { x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.9)'; x.strokeText(s, tx * sc, ty * sc); x.fillStyle = col; x.fillText(s, tx * sc, ty * sc); };
  for (const R of REGIONS) if (R.k !== 'mar') { const i = W.I(R.c[0], R.c[1]); if (bits[i >> 3] & (1 << (i & 7))) label(R.n, R.c[0], R.c[1] - 6, '#e8dcc0'); else label('???', R.c[0], R.c[1] - 6, '#8a7a6a'); }
  for (const t of TOWNS) { const cxp = (t.x0 + t.x1) / 2, cyp = (t.y0 + t.y1) / 2; x.fillStyle = '#c0302a'; x.fillRect(cxp * sc - 4, cyp * sc - 4, 8, 8); x.strokeStyle = '#ffe8a0'; x.strokeRect(cxp * sc - 4, cyp * sc - 4, 8, 8); label(t.n, cxp, cyp + 8, '#ffd23a'); }
  for (const w of WAYSTONES) { const on = G.P.ws[w.k]; x.fillStyle = on ? '#4ad8f0' : '#3a4a5a'; x.beginPath(); x.arc(w.x * sc, w.y * sc, 4, 0, 7); x.fill(); x.strokeStyle = '#0a1a24'; x.stroke(); }
  const tg = guideTarget(); if (tg) { const loc = guidePos(tg); if (loc) { x.fillStyle = '#ffe040'; x.beginPath(); x.arc(loc[0] * sc, loc[1] * sc, 5 + Math.sin(G.t * 4), 0, 7); x.fill(); x.fillStyle = '#1a1010'; x.fillText('!', loc[0] * sc, loc[1] * sc + 4); } }
  mapExtras(x, sc); mapFriends(x, sc);
  const P = G.P, px = (P.map === 'world' ? P.x : P.retX || P.x) / 16, py = (P.map === 'world' ? P.y : P.retY || P.y) / 16; x.fillStyle = '#ffffff'; x.strokeStyle = '#1a1010'; x.lineWidth = 2; x.beginPath(); x.arc(px * sc, py * sc, 5, 0, 7); x.stroke(); x.fill();
  cvs.onclick = e => { const r = cvs.getBoundingClientRect(); const mx = (e.clientX - r.left) / sc, my = (e.clientY - r.top) / sc; const w = WAYSTONES.find(w => dist(w.x, w.y, mx, my) < 6 / sc + 3); if (w) { if (!G.P.ws[w.k]) { toast('Aún no has activado esa piedra de viaje', 'warn'); return; } if (G.P.map !== 'world' && !G.P.inside) return; closePanel(); travelTo(w.k); } };
}
// ---------- options ----------
const SETTINGS = { music: 0.5, sfx: 0.7, quality: 1, vib: 1, tips: 1, guide: 1 };
function loadSettings() { try { Object.assign(SETTINGS, JSON.parse(storage.get('thebound.settings') || '{}')); } catch (e) { } G.quality = SETTINGS.quality; }
function saveSettings() { storage.set('thebound.settings', JSON.stringify(SETTINGS)); G.quality = SETTINGS.quality; applyVolumes(); }
let wipeStep = 0;
function renderOpts(B) {
  const on = NET.room ? `Conectado · ${G.remote.size + 1} en el mundo` : (typeof phnIn === 'function' && phnIn()) ? `Online · ${phnRoomLabel(PHN.room)} · ${G.remote.size + 1} jugadores` : 'Sin conexión multijugador (modo individual)';
  B.innerHTML = `<div class="frame opts"><h3>Sonido</h3><label>Música <input type="range" id="oMus" min="0" max="1" step="0.05" value="${SETTINGS.music}"></label><label>Efectos <input type="range" id="oSfx" min="0" max="1" step="0.05" value="${SETTINGS.sfx}"></label>
  <h3>Juego</h3><label class="tg"><input type="checkbox" id="oQ" ${SETTINGS.quality ? 'checked' : ''}> Efectos visuales completos (desactiva si va lento)</label><label class="tg"><input type="checkbox" id="oV" ${SETTINGS.vib ? 'checked' : ''}> Vibración</label><label class="tg"><input type="checkbox" id="oG" ${SETTINGS.guide ? 'checked' : ''}> Flecha guía hacia la misión</label><label class="tg"><input type="checkbox" id="oT" ${SETTINGS.tips ? 'checked' : ''}> Consejos para principiantes</label><label class="tg"><input type="checkbox" id="oEv" ${SETTINGS.events !== false ? 'checked' : ''}> Eventos del mundo (asaltos, festivales, mercaderes...)</label><label class="tg"><input type="checkbox" id="oPvp" ${PVP.on ? 'checked' : ''}> PvP con amigos en el multijugador local (los dos deben activarlo)</label><label class="tg"><input type="checkbox" id="oWx" ${SETTINGS.weather !== false ? 'checked' : ''}> Clima y estaciones (lluvia, nieve, tormentas)</label>
  <h3>Partida</h3><div class="row"><button class="btn gold" id="oSave">Guardar ahora</button><button class="btn" id="oExp">Copiar código de partida</button><button class="btn" id="oImp">Cargar código</button></div><textarea id="oCode" placeholder="Pega aquí un código de partida" hidden></textarea><p class="hint" id="oMsg">Se guarda automáticamente cada 20 segundos${NET.db ? ' y en tu cuenta' : ''}.</p>
  <h3>En línea</h3><p class="hint">${on}</p>
  <h3>Controles</h3><p class="hint">Móvil: joystick para moverte, espada para atacar (mantén para atacar seguido), corredor para esquivar, botones redondos para habilidades y el botón de acción para hablar, talar, minar, pescar o recoger.<br>Teclado: WASD/flechas, Espacio/J atacar, E acción, Shift esquivar, 1-4 habilidades, H poción, I inventario, K habilidades, Q misiones, M mapa.</p>
  <div class="row"><button class="btn" id="oTitle">Volver al título</button><button class="btn" id="oSlots">Cambiar de personaje</button><button class="btn danger" id="oWipe">${wipeStep ? 'Toca otra vez para BORRAR la partida' : 'Borrar partida'}</button></div></div>`;
  $('#oMus').oninput = e => { SETTINGS.music = +e.target.value; saveSettings(); }; $('#oSfx').oninput = e => { SETTINGS.sfx = +e.target.value; saveSettings(); sfx('ui'); };
  $('#oQ').onchange = e => { SETTINGS.quality = e.target.checked ? 1 : 0; saveSettings(); }; $('#oV').onchange = e => { SETTINGS.vib = e.target.checked ? 1 : 0; saveSettings(); }; $('#oG').onchange = e => { SETTINGS.guide = e.target.checked ? 1 : 0; saveSettings(); }; $('#oT').onchange = e => { SETTINGS.tips = e.target.checked ? 1 : 0; saveSettings(); };
  $('#oSave').onclick = () => { saveGame(true); $('#oMsg').textContent = 'Partida guardada.'; };
  $('#oExp').onclick = async () => { saveGame(true); const code = await packCode({ v: 2, kind: 'hero', hero: serializeP(G.P) }); const ta = $('#oCode'); ta.hidden = false; ta.value = code; ta.select(); try { navigator.clipboard.writeText(code).then(() => $('#oMsg').textContent = 'Código copiado. Guárdalo para recuperar tu partida.', () => $('#oMsg').textContent = 'Selecciona y copia el código de arriba.'); } catch (e) { $('#oMsg').textContent = 'Selecciona y copia el código de arriba.'; } };
  $('#oImp').onclick = () => { const ta = $('#oCode'); if (ta.hidden) { ta.hidden = false; ta.value = ''; ta.focus(); $('#oMsg').textContent = 'Pega tu código y vuelve a tocar "Cargar código".'; return; } unpackCode(ta.value).then(d => { const o = d && (d.kind === 'hero' ? d.hero : d.kind === 'account' ? null : d); if (d && d.kind === 'account') { $('#oMsg').textContent = 'Ese es un código de CUENTA: impórtalo en la pantalla de título con "Importar cuenta".'; return; } if (!o || !o.cls || !o.name) throw 0; o.savedAt = Date.now(); G.noSave = true; storage.set(slotKey(SLOT), JSON.stringify(o)); $('#oMsg').textContent = 'Partida cargada: ' + o.name + ' (nivel ' + o.lv + '). Reiniciando…'; setTimeout(() => location.reload(), 600); }).catch(() => { $('#oMsg').textContent = 'El código no es válido. Revisa que esté completo (sin cortar).'; }); };
  $('#oTitle').onclick = () => { saveGame(true); location.reload(); };
  $('#oEv').onchange = e => { SETTINGS.events = e.target.checked; saveSettings(); };
  $('#oPvp').onchange = e => { PVP.on = e.target.checked; toast(PVP.on ? 'PvP activado: puedes luchar con amigos que también lo tengan activado' : 'PvP desactivado', 'info'); netPresence(true); };
  $('#oWx').onchange = e => { SETTINGS.weather = e.target.checked; saveSettings(); calcStats(G.P); };
  $('#oSlots').onclick = () => { saveGame(true); setTimeout(() => location.reload(), 300); };
  $('#oWipe').onclick = () => { if (!wipeStep) { wipeStep = 1; renderPanel(); setTimeout(() => { wipeStep = 0; }, 4000); return; } storage.del(slotKey(SLOT)); wipeCloud(); location.reload(); };
}
