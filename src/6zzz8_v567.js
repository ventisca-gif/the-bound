// ================= v5.67: «¿QUÉ HAGO AHORA?» TE GUÍA POR LOS OFICIOS =================
// Sergio (5.67): en ▦ Atajos › ¿Qué hago ahora? sale una sección de oficios: primero Tala, Minería y Pesca (con las casillas
// 🪓 ⛏ 🎣 de la barra) y, cuando las terminas, uno a uno el resto, hasta completar los 68.
// Regla para el futuro: cualquier hacha, pico o caña nueva solo necesita `t: 'tool'` y `tool: 'tala' | 'mineria' | 'pesca'`
// con su `power`; se equipa en el inventario y funciona sola con su casilla (6zzz5_herramientas).

const QH_CORE = ['tala', 'mineria', 'pesca'];
function jobCap(k) { const rk = typeof mastRank === 'function' ? mastRank(k) || 0 : 0; return JOBMAX + (typeof JOB_EXT !== 'undefined' && JOB_EXT[k] || 0) + (rk ? 10 * rk : 0); }
function jobBaseCap(k) { return JOBMAX + (typeof JOB_EXT !== 'undefined' && JOB_EXT[k] || 0); }   // «terminado» = tope sin maestría
function jobLv(k) { const J = G.P.jobs && G.P.jobs[k]; return J ? J.lv : 1; }
function jobDone(k) { return jobLv(k) >= jobBaseCap(k); }
function qhJobOrder() { return QH_CORE.filter(k => JOBS[k]).concat(Object.keys(JOBS).filter(k => !QH_CORE.includes(k))); }
const QH_CORE_HOW = {
  tala: () => L2('Equípate un hacha (Inventario › Equipar), acércate a un árbol y pulsa la casilla 🪓 de abajo.', 'Equip an axe (Bag › Equip), walk up to a tree and tap the 🪓 slot below.'),
  mineria: () => L2('Equípate un pico, acércate a una veta y pulsa la casilla ⛏ de abajo.', 'Equip a pickaxe, walk up to an ore vein and tap the ⛏ slot below.'),
  pesca: () => L2('Equípate una caña, acércate al agua y pulsa 🎣; cuando pique, vuelve a pulsar y mantén para recoger.', 'Equip a rod, walk up to water and tap 🎣; when it bites, tap again and hold to reel in.')
};
function qhJobHow(k) { if (QH_CORE_HOW[k]) return QH_CORE_HOW[k](); const g = typeof JOB_GUIDE !== 'undefined' && JOB_GUIDE[k]; if (g && g.how) return LANG_EN ? g.how[1] : g.how[0]; const d = JOBS[k] && JOBS[k].d; return d ? d : L2('Mira cómo se hace en 🔍 Lupa › Oficios.', 'See how in 🔍 Magnifier › Jobs.'); }
function qhJobFind(k) { try { const g = typeof JOB_GUIDE !== 'undefined' && JOB_GUIDE[k]; return g && g.find ? g.find() : null; } catch (e) { return null; } }
function qhToolLine(k) { const id = typeof eqTool === 'function' ? eqTool(k) : null; return id ? ' · ' + L2('equipada: ', 'equipped: ') + ITEMS[id].n : ' · ' + L2('¡no tienes herramienta equipada!', 'no tool equipped!'); }
function qhJobsHTML() { const P = G.P; if (!P || !P.jobs) return ''; const all = qhJobOrder(), done = all.filter(jobDone).length, rows = [];
  const core = QH_CORE.filter(k => JOBS[k]), coreLeft = core.filter(k => !jobDone(k));
  const show = coreLeft.length ? coreLeft : (all.find(k => !jobDone(k)) ? [all.find(k => !jobDone(k))] : []);
  for (const k of show) { const lv = jobLv(k), cap = jobBaseCap(k), f = qhJobFind(k);
    rows.push(`<div class="qhjob"><b>${esc(JOBS[k].n)}</b> · ${L2('nivel ', 'level ')}${lv}/${cap}${QH_CORE.includes(k) ? esc(qhToolLine(k)) : ''}<br><small>${esc(qhJobHow(k))}</small><div class="row">${f && f.loc ? `<button class="btn sm" data-qhwp="${k}">➜ ${L2('Llévame', 'Take me')}</button>` : ''}<button class="btn sm" data-qhg="${k}">🔍 ${L2('Ver en la Lupa', 'See in Magnifier')}</button></div></div>`); }
  const head = coreLeft.length ? L2('Empieza por Tala, Minería y Pesca', 'Start with Woodcutting, Mining and Fishing') : show.length ? L2('Siguiente oficio', 'Next job') : L2('¡Has terminado todos los oficios!', 'You finished every job!');
  return `<div class="gsrc qhjobs"><span><b>⚒ ${L2('Oficios', 'Jobs')} · ${done}/${all.length}</b> <small>(${esc(head)})</small><span class="dbar"><b style="width:${Math.round(done / all.length * 100)}%"></b></span>${rows.join('')}</span></div>`; }
{ const _qh = qhOpen; qhOpen = function () { const r = _qh.apply(this, arguments); try { const M = $('#modal'), gs = M ? [...M.querySelectorAll('.frame > .gsrc')] : [], last = gs[gs.length - 1]; if (last && !M.querySelector('.qhjobs')) { last.insertAdjacentHTML('afterend', qhJobsHTML());
      M.querySelectorAll('[data-qhwp]').forEach(b => b.onclick = () => { const f = qhJobFind(b.dataset.qhwp); if (f) { setWp(f); closeModal(); } });
      M.querySelectorAll('[data-qhg]').forEach(b => b.onclick = () => { closeModal(); GJOB = b.dataset.qhg; guiaJobs(); }); } } catch (e) { console.warn('qh jobs', e); } return r; }; }
{ const st = document.createElement('style'); st.textContent = '.qhjobs .qhjob{margin-top:.45em;padding-top:.35em;border-top:1px solid rgba(220,180,110,.25)}.qhjobs .row{margin-top:.25em;display:flex;gap:.35em;flex-wrap:wrap}.qhjobs .dbar{display:block;height:.45em;background:#2a1a12;border-radius:.3em;margin:.3em 0;overflow:hidden}.qhjobs .dbar b{display:block;height:100%;background:#f0c040}'; document.head.appendChild(st); }
// la guía de Tala/Minería/Pesca de la Lupa también habla de las casillas
try { if (typeof JOB_GUIDE !== 'undefined') for (const k of QH_CORE) if (JOB_GUIDE[k]) JOB_GUIDE[k].how = [QH_CORE_HOW[k](), QH_CORE_HOW[k]()]; } catch (e) { }

if (typeof GSIS !== 'undefined') GSIS.unshift(['oficios567', '⚒ ' + L2('Oficios en «¿Qué hago ahora?»', 'Jobs in «What do I do now?»'), () => [
  L2('▦ Atajos › ¿Qué hago ahora?: nueva sección de oficios. Primero Tala, Minería y Pesca (con tu herramienta equipada y las casillas 🪓 ⛏ 🎣); cuando llegan a su tope pasa al siguiente oficio, uno a uno, hasta los 68.', '▦ Shortcuts › What do I do now?: new jobs section. First Woodcutting, Mining and Fishing (with your equipped tool and the 🪓 ⛏ 🎣 slots); when they reach their cap it moves to the next job, one by one, up to all 68.'),
  L2('➜ Llévame pone la flecha dorada donde practicarlo; 🔍 Ver en la Lupa abre la guía de ese oficio.', '➜ Take me sets the golden arrow where to practise it; 🔍 See in Magnifier opens that job\'s guide.')
], () => null]);
