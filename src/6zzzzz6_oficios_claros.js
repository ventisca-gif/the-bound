// 6.11 · Oficios más claros (Sergio: «que la Lupa avise, baja el nivel de las herramientas y arregla lo de la maestría
// que no se ve y los 70-80 s de los recursos»).
// 1) Herramientas: desde la potencia 5 piden un 25 % menos de nivel de personaje (las de Dawn, desde 500, que es cuando
//    se llega a Dawn). Así el oficio no se queda parado esperando al personaje.
// 2) Avisos que dicen QUÉ falta: tope de oficio → maestría (quién y dónde, con flecha); herramienta → cuál, si la tienes
//    y qué nivel de personaje pide.
// 3) Al llegar al tope sin maestría completa, aviso una vez con la maestra/maestro y la flecha.
// 4) Lupa › 🔎 › Oficios: «Siguiente paso» con todo eso y el tope de verdad (antes ponía siempre /75).
// Árboles, vetas y hierbas del mundo reaparecen a los 5 s, como en Dawn (antes 70 / 80 / 50 s): cambiado en src/52_player.js.

// ---------- 1) nivel de personaje de las herramientas ----------
const TOOL_LV_OLD = {};
for (const id in ITEMS) { const I = ITEMS[id]; if (I.t !== 'tool' || !['tala', 'mineria', 'pesca'].includes(I.tool) || (I.power || 0) < 5) continue;
  const old = I.lv || 1, dawn = old >= 600, lv = dawn ? 500 + (old - 620) * 2 / 3 : Math.round(old * 0.75 / 5) * 5;
  TOOL_LV_OLD[id] = old; I.lv = Math.round(lv); }
for (const r of RECIPES) if (TOOL_LV_OLD[r.out] !== undefined) r.lv = ITEMS[r.out].lv;

// ---------- utilidades ----------
const OC_JOBS = ['tala', 'mineria', 'pesca'];
const ocTool = (job, p) => Object.keys(ITEMS).find(k => ITEMS[k].t === 'tool' && ITEMS[k].tool === job && ITEMS[k].power === p);
const ocMaster = job => { const D = typeof MAST !== 'undefined' && MAST[job]; if (!D) return null; const npc = NPCS[D.npc], loc = typeof townLoc === 'function' ? townLoc(D.town) : null;
  return { n: npc ? npc.n : D.npc, town: townName(D.town), wp: loc ? { loc, m: 'world', t: (npc ? npc.n : '') + ' · ' + townName(D.town) } : null, D }; };
function ocMasteryLine(job) { const M = ocMaster(job), r = mastRank(job); if (!M || r >= 3) return '';
  const nx = M.D.need[r], g = M.D.gold[r], mats = (M.D.mats[r] || []).map(([id, n]) => n + ' ' + (ITEMS[id] ? ITEMS[id].n : id)).join(', ');
  return L2(`Entrena la maestría con ${M.n} en ${M.town}: siguiente rango con ${JOBS[job].n} ${nx}, ${fmt(g)} de oro`, `Train mastery with ${M.n} in ${M.town}: next rank at ${JOBS[job].n} ${nx}, ${fmt(g)} gold`) + (mats ? ', ' + mats : '') + L2(` (+10 al tope, hasta ${jobBaseCap(job) + 30}).`, ` (+10 to the cap, up to ${jobBaseCap(job) + 30}).`); }
// qué recurso toca y qué falta para él
function ocAdvice(job) { const P = G.P, J = P.jobs[job] || { lv: 1 }, cap = jobCap(job), tool = bestTool(job), out = []; let wp = null;
  let t = 1; for (let k = 1; k <= 25; k++) if (RESLV[k] !== undefined && RESLV[k] <= J.lv) t = k;
  const what = job === 'tala' ? L2('árboles', 'trees') : job === 'mineria' ? L2('vetas', 'veins') : L2('peces', 'fish');
  out.push(L2(`Nivel ${J.lv} de ${cap} (tope actual). Con tu nivel llegas a ${what} de tier ${t}.`, `Level ${J.lv} of ${cap} (current cap). Your level reaches tier ${t} ${what}.`));
  const nt = toolNeed(job, t);
  if (!tool) out.push('🛠 ' + L2('No tienes herramienta: pídesela gratis a la Anciana Mira, cómprala en la tienda o fabrícala en la Herrería.', 'You have no tool: ask Old Mira for one, buy it at the shop or craft it at the Forge.'));
  else if (tool < nt) { const id = ocTool(job, nt), I = id && ITEMS[id];
    if (I) out.push('🛠 ' + L2(`Para ese tier te falta ${I.n} (potencia ${nt}). `, `For that tier you need ${I.n} (power ${nt}). `) + (P.lv < (I.lv || 1) ? L2(`Pide nivel de personaje ${I.lv} (tienes ${P.lv}).`, `It needs character level ${I.lv} (you have ${P.lv}).`) : L2('Ya tienes el nivel: fabrícala en la Herrería.', 'You have the level: craft it at the Forge.'))); }
  else out.push('✅ ' + L2('Tu herramienta sirve para tu nivel.', 'Your tool is good for your level.'));
  const next = RESLV.findIndex((l, k) => k > t && l !== undefined && l > J.lv);
  if (next > 0) { if (RESLV[next] > cap) { out.push('⭐ ' + L2(`El siguiente tier (${next}) pide nivel ${RESLV[next]}, más que tu tope.`, `The next tier (${next}) needs level ${RESLV[next]}, above your cap.`) + ' ' + ocMasteryLine(job)); const M = ocMaster(job); if (M) wp = M.wp; }
    else out.push(L2(`Siguiente tier (${next}) a nivel ${RESLV[next]}.`, `Next tier (${next}) at level ${RESLV[next]}.`)); }
  if (J.lv >= cap && mastRank(job) < 3) { const l = ocMasteryLine(job); if (l && !out.some(x => x.includes(l))) out.push('⭐ ' + L2('Has llegado al tope. ', 'You reached the cap. ') + l); const M = ocMaster(job); if (M) wp = M.wp; }
  return { lines: out, wp }; }

// ---------- 2) avisos al recolectar ----------
{ const _hg = hbGather; hbGather = function (job) { try { const P = G.P;
    if (P && !P.dead && !P.job && !P.fishing && (job === 'tala' || job === 'mineria') && eqTool(job)) { const o = hbFindRes(job);
      if (o) { const tier = job === 'tala' ? WOODT[o.sp] : o.tier, need = RESLV[tier] || 999, lv = (P.jobs[job] || { lv: 1 }).lv, cap = jobCap(job);
        if (lv < need) { toast(L2('Requiere ', 'Requires ') + JOBS[job].n + L2(' nivel ', ' level ') + need + (need > cap ? ' · ' + L2(`tu tope es ${cap}: `, `your cap is ${cap}: `) + ocMasteryLine(job) : ''), 'warn', need > cap ? 6 : 3); return; }
        const nt = toolNeed(job, tier); if (bestTool(job) < nt) { const id = ocTool(job, nt), I = id && ITEMS[id];
          toast(L2('Necesitas ', 'You need ') + (I ? I.n : L2('una herramienta mejor', 'a better tool')) + L2(` (potencia ${nt})`, ` (power ${nt})`) + (I && P.lv < (I.lv || 1) ? L2(`: pide nivel de personaje ${I.lv}`, `: needs character level ${I.lv}`) : I ? L2(': fabrícala en la Herrería', ': craft it at the Forge') : ''), 'warn', 4); return; } } } } catch (e) { }
  return _hg.apply(this, arguments); }; }

// ---------- 3) aviso al llegar al tope ----------
{ const _gj = gainJobXp; gainJobXp = function (job) { const P = G.P, J = P && P.jobs && P.jobs[job], before = J ? J.lv : 0; const r = _gj.apply(this, arguments);
  try { if (J && OC_JOBS.includes(job) && J.lv > before && J.lv >= jobCap(job) && mastRank(job) < 3) { P.capWarn = P.capWarn || {}; const key = job + ':' + jobCap(job);
    if (!P.capWarn[key]) { P.capWarn[key] = 1; const M = ocMaster(job); toast('⭐ ' + JOBS[job].n + L2(`: tope ${jobCap(job)}. `, `: cap ${jobCap(job)}. `) + ocMasteryLine(job), 'quest', 8); if (M && M.wp && !P.wp) setWp(M.wp); markDirty(); } } } catch (e) { }
  return r; }; }
SAVEKEYS.push('capWarn');

// ---------- 4) Lupa › Oficios: siguiente paso y tope de verdad ----------
{ const _gj = guiaJobs; guiaJobs = function () { const r = _gj.apply(this, arguments);
  try { if (!GJOB || !OC_JOBS.includes(GJOB)) { if (GJOB && JOBS[GJOB]) { const h = $('.guia .gdet h4'); if (h) h.innerHTML = h.innerHTML.replace('/' + JOBMAX, '/' + jobCap(GJOB)); } return r; }
    const det = $('.guia .gdet'); if (!det) return r; const h = det.querySelector('h4'); if (h) h.innerHTML = h.innerHTML.replace('/' + JOBMAX, '/' + jobCap(GJOB));
    const A = ocAdvice(GJOB); let html = `<div class="gsrc"><span>🧭 <b>${L2('Siguiente paso', 'Next step')}:</b><br>${A.lines.map(esc).join('<br>')}</span>${A.wp ? guiaFollowBtn(A.wp, A.wp.t) : ''}</div>`;
    if (A.wp) WP_M[Math.round(A.wp.loc[0] * 10) / 10 + ',' + Math.round(A.wp.loc[1] * 10) / 10] = 'world';
    const first = det.querySelector('.gsrc'); if (first) first.insertAdjacentHTML('afterend', html); else det.insertAdjacentHTML('beforeend', html);
    $$('.guia .gdet [data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); setWp({ loc: [x, y], t: b.dataset.wl, m: WP_M[Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10] || 'world' }); guiaJobs(); });
  } catch (e) { } return r; }; }
