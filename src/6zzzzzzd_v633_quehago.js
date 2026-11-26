// 6.33 · «¿Qué hago ahora?» más claro (Sergio: «flecha amarilla que te guíe dónde ir, otra que diga la armadura que
// necesitas y dónde crearla con sus materiales, y en tala, pesca y minería pon los minerales y árboles del Mar de Dawn,
// ideas que expliquen, y revisa el tope, que ya no es 130»).
// - ⚔ Para subir de nivel: monstruos de tu nivel con su sitio (`mobWhere`) y ➜ Llévame (flecha dorada, `setWp`); cuánta
//   experiencia falta y cuántos monstruos son (la experiencia real por monstruo se mide al matar: `Q3.xpf`).
// - 🛡 Tu armadura: por ranura, la mejor de la Herrería para tu nivel y clase, si ya la llevas, sus materiales (tienes /
//   pide), el oro, ➜ a la Herrería y ➜ al sitio del primer material que falta (`itemSources`).
// - ⚒ Oficios: tope de verdad (130 y hasta 160 con las 3 maestrías), siguiente paso (`ocAdvice`), recurso de tu nivel y el
//   siguiente, lo del Mar de Dawn (tiers 23-25: árboles, vetas y peces, con la herramienta que piden) y un consejo.
// Solo ganchos: hookAfter('qhOpen'), hookAround('qhJobsHTML'), hookBefore/After('killMob').
const Q3 = { xpf: 1, lv0: 0, xp0: 0 };
const Q3_ISLES = L2('Foosha, Shells Town, Orange Town, Isla de los Animales Raros y Villa Syrup', 'Foosha, Shells Town, Orange Town, Rare Animals Island and Syrup Village');
const q3Ln = s => String(s || '');
// ---------- experiencia real por monstruo (pasivas, mascota, bonos…) ----------
hookBefore('killMob', m => { const P = G.P; if (P) { Q3.lv0 = P.lv; Q3.xp0 = P.xp; } });
hookAfter('killMob', (r, m) => { const P = G.P; if (!P || !m || m.boss || !m.xp || P.lv !== Q3.lv0) return; const got = P.xp - Q3.xp0; if (got <= 0) return;
  const lvDiff = m.lv - P.lv, base = m.xp * (lvDiff < -8 ? 0.3 : lvDiff < -4 ? 0.7 : lvDiff > 3 ? 1.25 : 1), f = got / Math.max(1, base); if (f > 0.5 && f < 6) Q3.xpf = Q3.xpf * 0.7 + f * 0.3; });
// ---------- monstruos de tu nivel y dónde están ----------
function q3MobTarget() { const P = G.P, L = P.lv, cur = typeof curMapId === 'function' ? curMapId() : 'world'; let best = null, bs = Infinity;
  for (const k in MOBS) { const D = MOBS[k]; if (!Array.isArray(D.lv) || typeof D.n !== 'string' || D.lv[0] > L + 3 || D.lv[1] < L - 6) continue;
    let w = null; try { w = mobWhere(k); } catch (e) { } if (!w || !w.loc) continue; const m = w.m || 'world', same = m === cur;
    let route = same; try { if (!same && typeof wpRoute === 'function') route = !!wpRoute({ x: w.loc[0], y: w.loc[1], m }); } catch (e) { }
    const mid = (D.lv[0] + D.lv[1]) / 2, d = same ? Math.hypot(w.loc[0] - P.x / 16, w.loc[1] - P.y / 16) : 0;
    const s = (same ? 0 : route ? 1e6 : 2e6) + Math.abs(mid - L) * 40 + d; if (s < bs) { bs = s; best = { k, D, w: { loc: w.loc, m, t: w.t } }; } }
  return best; }
function q3LevelHTML() { const P = G.P; if (P.lv >= MAXLV) return `<br><small>⭐ ${L2('Nivel máximo.', 'Max level.')}</small>`;
  const T = q3MobTarget(), need = Math.max(0, xpToNext(P.lv) - (P.xp || 0)), pct = Math.min(100, Math.round((P.xp || 0) / xpToNext(P.lv) * 100));
  let h = `<span class="dbar"><b style="width:${pct}%"></b></span><small>${L2('Te faltan ', 'You need ')}${fmt(need)} XP ${L2('para el nivel ', 'for level ')}${P.lv + 1}`;
  if (T) { const per = Math.max(1, Math.round(mobStats(T.D, P.lv, false).xp * Q3.xpf)); h += ` (≈${fmt(Math.ceil(need / per))} ${L2('monstruos de tu nivel', 'monsters of your level')})</small>`;
    h += `<br><small>👹 ${esc(T.D.n)} (${L2('Nv. ', 'Lv. ')}${T.D.lv[0]}-${T.D.lv[1]}) · ${esc(q3Ln(T.w.t))}</small><div class="row"><button class="btn sm gold" data-q3lv="1">➜ ${L2('Llévame (flecha)', 'Take me (arrow)')}</button></div>`; Q3.lvT = T; }
  else h += `</small><br><small>${L2('Busca en 🔍 Lupa › Enemigos los de tu nivel; si no hay en este mapa, viaja a la zona de arriba.', 'Look in 🔍 Magnifier › Enemies for your level; if there are none on this map, travel to the zone above.')}</small>`;
  return h; }
// ---------- armadura que te toca y dónde forjarla ----------
const Q3_SLOTS = [['head', L2('Casco', 'Helmet')], ['body', L2('Armadura', 'Armour')], ['legs', L2('Grebas', 'Greaves')], ['feet', L2('Botas', 'Boots')]];
const q3Score = I => (I.def || 0) + (I.hpB || 0) / 10;
function q3BestRecipe(slot) { const P = G.P; let best = null;
  for (const r of RECIPES) { const I = ITEMS[r.out]; if (!I || r.job !== 'herreria' || I.t !== 'armor' || I.slot !== slot || (I.lv || 1) > P.lv || (I.cls && I.cls !== P.cls) || (r.cls && r.cls !== P.cls)) continue;
    if (!best || q3Score(I) > q3Score(ITEMS[best.out])) best = r; } return best; }
function q3ArmorHTML() { const P = G.P, rows = []; let allOk = true; Q3.matWp = {};
  for (const [slot, nm] of Q3_SLOTS) { const r = q3BestRecipe(slot); if (!r) continue; const I = ITEMS[r.out], E = P.equip && P.equip[slot] && ITEMS[P.equip[slot].id];
    if (E && q3Score(E) >= q3Score(I)) { rows.push(`<div class="q3a ok">✅ <b>${esc(nm)}</b>: ${esc(E.n)}</div>`); continue; } allOk = false;
    if (countItem(r.out) > 0) { rows.push(`<div class="q3a">🎒 <b>${esc(nm)}</b>: ${L2('ya tienes ', 'you already have ')}<b>${esc(I.n)}</b> ${L2('en la mochila: equípala (Inventario › Equipar).', 'in your bag: equip it (Bag › Equip).')}</div>`); continue; }
    const mats = (r.mats || []).map(([id, n]) => { const h = countItem(id), ok = h >= n; return `<span class="${ok ? 'q3ok' : 'q3no'}">${esc(ITEMS[id] ? ITEMS[id].n : id)} ${Math.min(h, n)}/${n}</span>`; }).join(' · ');
    const miss = (r.mats || []).find(([id, n]) => countItem(id) < n); let src = null;
    if (miss) { try { src = (itemSources(miss[0]) || []).find(s => s[1] && s[1].loc); } catch (e) { } if (src) Q3.matWp[slot] = Object.assign({ m: 'world' }, src[1]); }
    const jl = r.jlv && jobLv('herreria') < r.jlv ? ` · ⚒ ${L2('Herrería nivel ', 'Smithing level ')}${r.jlv}` : '';
    rows.push(`<div class="q3a"><b>${esc(nm)}</b>: ${E ? esc(E.n) + ' → ' : ''}<b>${esc(I.n)}</b> (${L2('Nv. ', 'Lv. ')}${I.lv || 1}, ${L2('def ', 'def ')}${I.def || 0})<br><small>${mats || L2('sin materiales', 'no materials')} · 💰 ${fmt(r.gold || 0)}${jl}</small>`
      + (miss ? `<br><small>${L2('Falta ', 'Missing ')}${esc(ITEMS[miss[0]] ? ITEMS[miss[0]].n : miss[0])}: ${esc(src ? src[0] : ((itemSources(miss[0]) || [])[0] || [L2('mira la Lupa', 'see the Magnifier')])[0])}</small>${src ? `<div class="row"><button class="btn sm" data-q3mat="${slot}">➜ ${L2('Dónde conseguirlo', 'Where to get it')}</button></div>` : ''}` : '') + `</div>`); }
  if (!rows.length) return '';
  const head = allOk ? L2('Llevas la mejor armadura de la Herrería para tu nivel.', 'You wear the best Forge armour for your level.') : L2('Forja en la Herrería (Aldea Albor) la de tu nivel:', 'Forge the one for your level at the Forge (Albor Village):');
  return `<div class="gsrc q3arm"><span><b>🛡 ${L2('Tu armadura', 'Your armour')}</b><br><small>${esc(head)}</small>${rows.join('')}${allOk ? '' : `<div class="row"><button class="btn sm gold" data-q3forge="1">➜ ${L2('Llévame a la Herrería', 'Take me to the Forge')}</button></div>`}</span></div>`; }
// ---------- oficios: tope real, recurso de tu nivel, Mar de Dawn y consejos ----------
function q3ResName(job, t) { if (job === 'tala') return q3Ln(ITEMS['log' + t] && ITEMS['log' + t].n).replace(/^Tronco (del |de )?/, '').replace(/ Log$/, '');
  if (job === 'mineria') return q3Ln(ITEMS['ore' + t] && ITEMS['ore' + t].n).replace(/^Mineral de /, '');
  return (typeof FISH !== 'undefined' ? FISH : []).filter(f => f[2] === t).map(f => f[1]).slice(0, 2).join(', '); }
function q3Tier(lv) { let t = 1; for (let k = 1; k < RESLV.length; k++) if (RESLV[k] !== undefined && RESLV[k] <= lv) t = k; return t; }
const Q3_TIPS = {
  tala: [L2('Los árboles reaparecen a los 5 s: quédate en un bosquecillo de tu tier y ve de uno a otro.', 'Trees respawn in 5 s: stay in a grove of your tier and go from one to the next.'), L2('Los troncos de tier alto sirven para casas, barcos, muebles y las armaduras de los mares.', 'High-tier logs are used for houses, boats, furniture and the sea armours.')],
  mineria: [L2('Las vetas de tu tier dan más experiencia que las bajas. Si la flecha te lleva lejos, es porque tu pico aún no puede con las de cerca.', 'Veins of your tier give more experience than low ones. If the arrow sends you far, your pickaxe can’t handle the near ones yet.'), L2('Los minerales se usan en la Herrería (armas, armaduras y herramientas) y en la Joyería.', 'Ores are used at the Forge (weapons, armour and tools) and in Jewelcrafting.')],
  pesca: [L2('En el Mar de Dawn se pesca desde cualquier orilla o desde el barco; la mitad de las veces pica un pez propio de Dawn si tu nivel llega.', 'In the Dawn Sea you can fish from any shore or from the ship; half the time a Dawn fish bites if your level is enough.'), L2('Los peces se venden, se cocinan (bonos de comida) y algunos piden encargos del tablón.', 'Fish are sold, cooked (food buffs) and some are asked for in board orders.')]
};
const Q3_TIP_ALL = L2('Los encargos de oficio del tablón de Kael dan experiencia extra, y cada rango de maestría sube el tope 10 niveles (hasta +30).', 'Kael’s board job orders give extra experience, and each mastery rank raises the cap by 10 levels (up to +30).');
function q3DawnHTML(job) { const tiers = [23, 24, 25].filter(t => RESLV[t] !== undefined), J = jobLv(job), tool = typeof bestTool === 'function' ? bestTool(job) || 0 : 0;
  const what = job === 'tala' ? L2('Árboles', 'Trees') : job === 'mineria' ? L2('Vetas', 'Veins') : L2('Peces', 'Fish');
  const where = job === 'pesca' ? L2('se pescan en todo el Mar de Dawn', 'caught all over the Dawn Sea') : L2('8 por isla en ', '8 per island on ') + Q3_ISLES;
  const items = tiers.map(t => { const nt = typeof toolNeed === 'function' ? toolNeed(job, t) : 0, tid = typeof ocTool === 'function' ? ocTool(job, nt) : null, ok = J >= RESLV[t] && tool >= nt;
    return `<li>${ok ? '✅' : '🔒'} <b>${esc(q3ResName(job, t))}</b> · ${L2('oficio ', 'job ')}${RESLV[t]}${tid && ITEMS[tid] ? ' · ' + esc(ITEMS[tid].n) + ' (' + L2('personaje ', 'character ') + (ITEMS[tid].lv || 1) + ')' : ''}</li>`; }).join('');
  return `<details class="q3dw"><summary>🏴‍☠️ ${L2('Mar de Dawn', 'Dawn Sea')}: ${esc(what)} ${L2('de tier 23-25', 'of tier 23-25')}</summary><small>${esc(where)}. ${L2('Reaparecen a los 5 s.', 'They respawn in 5 s.')}</small><ul>${items}</ul></details>`; }
function q3JobRow(k) { const P = G.P, lv = jobLv(k), cap = jobBaseCap(k), capM = jobCap(k), core = QH_CORE.includes(k), f = qhJobFind(k), rk = typeof mastRank === 'function' ? mastRank(k) || 0 : 0;
  const capTxt = core ? `${lv}/${capM}` + (rk < 3 ? ` <small>(${L2('hasta ', 'up to ')}${cap + 30} ${L2('con maestría', 'with mastery')})</small>` : '') : `${lv}/${cap}`;
  let h = `<div class="qhjob"><b>${esc(JOBS[k].n)}</b> · ${L2('nivel ', 'level ')}${capTxt}${core ? esc(qhToolLine(k)) : ''}<br><small>${esc(qhJobHow(k))}</small>`;
  if (core) { const t = q3Tier(lv), nx = RESLV.findIndex((l, i) => i > t && l !== undefined && l > lv), ic = k === 'tala' ? '🌲' : k === 'mineria' ? '⛏' : '🐟';
    h += `<br><small>${ic} ${L2('De tu nivel: ', 'Your level: ')}<b>${esc(q3ResName(k, t))}</b> (tier ${t})${nx > 0 ? ' · ' + L2('siguiente: ', 'next: ') + esc(q3ResName(k, nx)) + ' (' + L2('nivel ', 'level ') + RESLV[nx] + ')' : ''}</small>`;
    try { const A = ocAdvice(k); h += `<ul class="q3adv">${A.lines.slice(1).map(l => `<li>${esc(l)}</li>`).join('')}</ul>`; if (A.wp) Q3.mastWp = Q3.mastWp || {}, Q3.mastWp[k] = A.wp; } catch (e) { }
    h += q3DawnHTML(k); const tips = Q3_TIPS[k] || []; h += `<small class="q3tip">💡 ${esc(tips[(Math.floor(Date.now() / 6e4) + k.length) % tips.length] || Q3_TIP_ALL)}</small>`; }
  h += `<div class="row">${f && f.loc ? `<button class="btn sm gold" data-qhwp="${k}">➜ ${L2('Llévame (flecha)', 'Take me (arrow)')}</button>` : ''}${Q3.mastWp && Q3.mastWp[k] ? `<button class="btn sm" data-q3mast="${k}">⭐ ${L2('Maestría', 'Mastery')}</button>` : ''}<button class="btn sm" data-qhg="${k}">🔍 ${L2('Ver en la Lupa', 'See in Magnifier')}</button></div></div>`;
  return h; }
hookAround('qhJobsHTML', next => { const P = G.P; if (!P || !P.jobs) return next(); try {
  const all = qhJobOrder(), done = all.filter(jobDone).length, core = QH_CORE.filter(k => JOBS[k]), coreLeft = core.filter(k => jobLv(k) < jobCap(k) || (typeof mastRank === 'function' && mastRank(k) < 3 && jobLv(k) < jobBaseCap(k) + 30));
  const show = coreLeft.length ? coreLeft : (all.find(k => !jobDone(k)) ? [all.find(k => !jobDone(k))] : []);
  const head = coreLeft.length ? L2('Empieza por Tala, Minería y Pesca', 'Start with Woodcutting, Mining and Fishing') : show.length ? L2('Siguiente oficio', 'Next job') : L2('¡Has terminado todos los oficios!', 'You finished every job!');
  return `<div class="gsrc qhjobs"><span><b>⚒ ${L2('Oficios', 'Jobs')} · ${done}/${all.length}</b> <small>(${esc(head)})</small><span class="dbar"><b style="width:${Math.round(done / all.length * 100)}%"></b></span>${show.map(q3JobRow).join('')}<small class="q3tip">💡 ${esc(Q3_TIP_ALL)}</small></span></div>`;
} catch (e) { if (typeof errOnce === 'function') errOnce('q3jobs', e); return next(); } });
// ---------- montar las secciones en la ventana ----------
hookAfter('qhOpen', () => { const M = $('#modal'); if (!M) return; const gs = [...M.querySelectorAll('.frame > .gsrc')], lvBox = gs.find(g => /⚔/.test(g.textContent)) || gs[1];
  if (lvBox && !M.querySelector('[data-q3lvbox]')) { const sp = lvBox.querySelector('span') || lvBox; sp.insertAdjacentHTML('beforeend', `<div data-q3lvbox="1">${q3LevelHTML()}</div>`); lvBox.insertAdjacentHTML('afterend', q3ArmorHTML()); }
  const B = (sel, fn) => M.querySelectorAll(sel).forEach(b => b.onclick = () => { try { fn(b); } catch (e) { console.warn('q3', e); } });
  B('[data-q3lv]', () => { const T = Q3.lvT; if (T) { setWp({ loc: T.w.loc, m: T.w.m, t: T.D.n + ' · ' + q3Ln(T.w.t) }); closeModal(); } });
  B('[data-q3forge]', () => { const f = JOB_GUIDE.herreria && JOB_GUIDE.herreria.find && JOB_GUIDE.herreria.find(); if (f) { setWp(Object.assign({ m: 'world' }, f)); closeModal(); } });
  B('[data-q3mat]', b => { const w = Q3.matWp[b.dataset.q3mat]; if (w) { setWp(w); closeModal(); } });
  B('[data-q3mast]', b => { const w = Q3.mastWp && Q3.mastWp[b.dataset.q3mast]; if (w) { setWp(w); closeModal(); } });
  // los botones de oficios se pintaron de nuevo con el gancho: vuelve a enlazarlos como en 6zzz8
  B('[data-qhwp]', b => { const f = qhJobFind(b.dataset.qhwp); if (f) { setWp(f); closeModal(); } });
  B('[data-qhg]', b => { closeModal(); GJOB = b.dataset.qhg; guiaJobs(); });
});
{ const st = document.createElement('style'); st.textContent = '.q3arm .q3a{margin-top:.35em;padding-top:.3em;border-top:1px solid rgba(220,180,110,.2)}.q3arm .q3a.ok{opacity:.8}.q3ok{color:#8fe08a}.q3no{color:#ff9a7a}'
  + '.q3dw{margin:.3em 0;font-size:.92em}.q3dw summary{cursor:pointer;color:#ffd070}.q3dw ul,.q3adv{margin:.2em 0 .2em 1.1em;padding:0}.q3adv{font-size:.88em}.q3tip{display:block;margin-top:.25em;color:#e8d8a8}'
  + '[data-q3lvbox] .dbar{display:block;height:.45em;background:#2a1a12;border-radius:.3em;margin:.3em 0;overflow:hidden}[data-q3lvbox] .dbar b{display:block;height:100%;background:#a070ff}[data-q3lvbox] .row,.q3arm .row{margin-top:.25em;display:flex;gap:.35em;flex-wrap:wrap}'; document.head.appendChild(st); }
if (typeof GSIS !== 'undefined') GSIS.unshift(['quehago633', '🧭 ' + L2('¿Qué hago ahora? (6.33)', 'What do I do now? (6.33)'), () => [
  L2('⚔ Para subir de nivel: cuánta experiencia te falta, cuántos monstruos de tu nivel son y dónde están, con ➜ Llévame (flecha dorada).', '⚔ To level up: how much experience you need, how many monsters of your level that is and where they are, with ➜ Take me (golden arrow).'),
  L2('🛡 Tu armadura: la mejor que puedes forjar en la Herrería para tu nivel y clase en cada ranura, sus materiales (tienes / pide) y el oro, con flecha a la Herrería y al sitio del material que falta.', '🛡 Your armour: the best you can forge at the Forge for your level and class in each slot, its materials (have / need) and gold, with an arrow to the Forge and to where the missing material is.'),
  L2('⚒ Tala, Minería y Pesca: tope 130 y hasta 160 con las 3 maestrías; el recurso de tu nivel y el siguiente, qué herramienta falta, los árboles, vetas y peces del Mar de Dawn (tier 23-25) y un consejo.', '⚒ Woodcutting, Mining and Fishing: cap 130 and up to 160 with the 3 masteries; your level’s resource and the next, which tool is missing, the Dawn Sea trees, veins and fish (tier 23-25) and a tip.')
], () => null]);
