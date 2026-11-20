// ================= v5.59: DIARIO DEL HÉROE (▦ Atajos › 📔) =================
// Un libro que se escribe solo con lo que de verdad te pasa: primer jefe vencido de cada tipo, cada 50 niveles, pareja,
// hijos, formas nuevas, fusiones y marcos conseguidos. Lore: el Telar recuerda cada hazaña del hilo vacío.
SAVEKEYS.push('heroLog', 'heroSnap');
function hlAdd(ic, es, en) { const P = G.P; P.heroLog = P.heroLog || []; P.heroLog.push({ d: calDay(), ic, t: L2(es, en), lv: P.lv }); if (P.heroLog.length > 300) P.heroLog.shift(); markDirty(); toast('📔 ' + L2('Nueva página en tu diario', 'New page in your diary'), 'info', 2); }
function hlSnap() { const P = G.P; let fr = []; try { fr = BIT().fr.slice(); } catch (e) { } return { b: Object.keys(P.bossKills || {}), k: (P.kids || []).map(k => k.name || k.n || ''), f: (P.srOwn || []).slice(), fu: !!P.fus, f2: P.fus2 || null, fr, p: P.partner || null, l: Math.floor((P.lv || 1) / 50) }; }
let hlT = 0; V33_TICKS.push(dt => { hlT += dt || 0.016; if (hlT < 2) return; hlT = 0; const P = G.P; if (!P || !P.S) return; const now = hlSnap(), S = P.heroSnap;
  if (!S) { P.heroSnap = now; if (!(P.heroLog || []).length) hlAdd('📖', 'Empieza mi diario. Nivel ' + P.lv + ', ' + now.b.length + ' jefes vencidos y ' + now.f.length + ' formas.', 'My diary begins. Level ' + P.lv + ', ' + now.b.length + ' bosses defeated and ' + now.f.length + ' forms.'); return; }
  for (const id of now.b) if (!S.b.includes(id) && BOSSES[id]) hlAdd('⚔', 'Vencí por primera vez a ' + BOSSES[id].n + '.', 'I defeated ' + BOSSES[id].n + ' for the first time.');
  if (now.l > S.l) hlAdd('⭐', '¡Llegué al nivel ' + now.l * 50 + '!', 'I reached level ' + now.l * 50 + '!');
  if (now.p && now.p !== S.p) { const n = NPCS[now.p] ? NPCS[now.p].n : now.p; hlAdd('💍', 'Empecé una vida con ' + n + '.', 'I started a life with ' + n + '.'); }
  for (const k of now.k) if (k && !S.k.includes(k)) hlAdd('👶', 'Nació ' + k + '.', k + ' was born.');
  for (const f of now.f) if (!S.f.includes(f) && SR[f]) hlAdd('🌀', 'Desperté una forma nueva: ' + SR[f].n + '.', 'I awakened a new form: ' + SR[f].n + '.');
  if (now.fu && !S.fu) hlAdd('✨', 'Fusioné mis formas: Dragón de Hielo.', 'I fused my forms: Ice Dragon.');
  if (now.f2 && now.f2 !== S.f2 && typeof FUS2 !== 'undefined' && FUS2[now.f2]) hlAdd('✨', 'Fusioné mis formas: ' + FUS2[now.f2].n + '.', 'I fused my forms: ' + FUS2[now.f2].n + '.');
  for (const id of now.fr) if (!S.fr.includes(id) && BIT_FR[id]) hlAdd('🖼', 'Conseguí el marco «' + BIT_FR[id][0] + '».', 'I earned the «' + BIT_FR[id][0] + '» frame.');
  P.heroSnap = now; });
function hlOpen(owner, list) { const P = G.P, mine = !owner, L_ = (mine ? P.heroLog || [] : list).slice().reverse(), friends = [...G.remote.values()].filter(r => r.dy && r.dy.length);
  openModal(`<div class="frame"><h3>📔 ${mine ? L2('Diario del héroe', 'Hero\'s diary') : L2('Diario de ', 'Diary of ') + esc(owner)}</h3><p class="hint">${L2('Se escribe solo con lo que te pasa: jefes vencidos, niveles, pareja, hijos, formas, fusiones y marcos. El Telar recuerda cada hazaña del hilo vacío.', 'It writes itself with what happens to you: bosses defeated, levels, partner, children, forms, fusions and frames. The Loom remembers every deed of the empty thread.')}</p>
    <div style="max-height:50vh;overflow:auto">${L_.map(e => `<div class="gsrc"><span><b>${e.ic} ${esc(e.t)}</b><br><small>${L2('Día ', 'Day ')}${e.d + 1}${e.lv ? ' · ' + L2('nivel ', 'level ') + e.lv : ''}</small></span></div>`).join('') || `<p class="hint">${L2('Aún no hay páginas.', 'No pages yet.')}</p>`}</div>
    ${mine && friends.length ? `<h4>${L2('Diarios de jugadores online', 'Online players\' diaries')}</h4>${friends.map(r => `<div class="gsrc"><span>${esc(r.name)} · ${r.dy.length}</span><button class="btn sm" data-dyv="${esc(r.name)}">${L2('Leer', 'Read')}</button></div>`).join('')}` : ''}
    <div class="row">${mine ? '' : `<button class="btn" id="dyBack">${L2('Mi diario', 'My diary')}</button>`}<button class="btn" id="dyX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#dyX').onclick = closeModal; const bk = $('#dyBack'); if (bk) bk.onclick = () => hlOpen(); $$('#modal [data-dyv]').forEach(b => b.onclick = () => { const r = friends.find(q => q.name === b.dataset.dyv); if (r) hlOpen(r.name, r.dy); }); }
// en el online se comparten las últimas 8 páginas
V6_PRES.push(o => { const L_ = G.P.heroLog; if (L_ && L_.length) o.dy = L_.slice(-8).map(e => [e.ic, String(e.t).slice(0, 70), e.d, e.lv]); });
V6_RECVS.push((r, pr) => { r.dy = Array.isArray(pr.dy) ? pr.dy.slice(0, 8).filter(e => Array.isArray(e)).map(e => ({ ic: cleanStr(e[0], 4), t: cleanStr(e[1], 70), d: +e[2] || 0, lv: +e[3] || 0 })) : null; });
V33_TICKS.push(() => { const row = $('#tr .trbtns'); if (!row || !G.P || $('#bDiary')) return; const b = document.createElement('button'); b.className = 'mini'; b.id = 'bDiary'; b.title = L2('Diario del héroe', 'Hero\'s diary'); b.setAttribute('aria-label', b.title); b.textContent = '📔'; b.onclick = () => hlOpen(); row.appendChild(b); });
if (typeof TR_TABS !== 'undefined') TR_TABS[3][3].push('bDiary');
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_diario_heroe', '📔 ' + L2('Diario del héroe', 'Hero\'s diary'), () => [L2('▦ Atajos › 📔: un libro que se escribe solo con tus hazañas reales (primer jefe vencido de cada tipo, cada 50 niveles, pareja, hijos, formas nuevas, fusiones y marcos), con el día del juego y tu nivel. Tus amigos online pueden leer tus últimas páginas.', '▦ Shortcuts › 📔: a book that writes itself with your real deeds (first defeat of each boss, every 50 levels, partner, children, new forms, fusions and frames), with the game day and your level. Your online friends can read your latest pages.')], () => null]);
