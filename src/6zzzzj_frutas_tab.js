// 5.95 · Pestaña 🍇 Frutas en el menú (Sergio: «un icono de frutas arriba, como la enciclopedia, con todas las frutas del
// diablo, su icono, el poder que dan y cómo conseguir cada una, con su probabilidad»).
// Lee DFR/DFS/SK en vivo: una fruta nueva que se registre en DFR sale sola (con itemSources si no tiene ficha aquí).
TABS.splice(TABS.findIndex(t => t[0] === 'best') + 1, 0, ['frutas', L2('Frutas', 'Fruits'), ['dfruit']]);
const DF_TAB_TYPE = { goma: L2('Paramecia', 'Paramecia'), transparente: L2('Paramecia', 'Paramecia'), bara: L2('Paramecia', 'Paramecia'), mera: L2('Logia', 'Logia'), hana: L2('Paramecia', 'Paramecia') };
// Probabilidades: las mismas constantes que usa el juego (DF_CH/DF_PITY, BUGGY_REWARD_TABLE, dfTrySpawn).
function dfTabHow(kind) {
  const P = G.P, pc = c => Math.round(c * 1000) / 10 + ' %';
  if (kind === 'goma') return { where: L2('Hilandera Muda · nivel 600 · Tierras Tejidas (fuera del Mar de Dawn)', 'Mute Spinner · level 600 · Woven Lands (outside the Dawn Sea)'),
    chance: pc(DF_CH) + L2(' cada vez que la vences · segura a los ', ' each time you defeat her · guaranteed by win ') + DF_PITY,
    left: dfCanDrop() ? Math.max(1, DF_PITY - (P.dfPity || 0)) : 0,
    extra: L2('También es la llave de los desembarcos del Mar de Dawn: no se gasta aunque te la comas.', 'It is also the key to the Dawn Sea landings: it stays valid even if you eat it.'),
    wp: { loc: TJ_BOSS_AT.tj_hilandera, m: 'world', t: BOSSES.tj_hilandera.n } };
  if (kind === 'bara') { const row = BUGGY_REWARD_TABLE.find(r => r[0] === BARA_ID);
    return { where: L2('Buggy · nivel 570 · Orange Town (Mar de Dawn)', 'Buggy · level 570 · Orange Town (Dawn Sea)'),
      chance: pc(row[1]) + L2(' cada vez que lo vences · segura a la victoria ', ' each time you defeat him · guaranteed by win ') + row[2],
      left: row[3](P) ? 0 : Math.max(1, row[2] - ((P.buggyPity || {})[BARA_ID] || 0)),
      extra: L2('Primero vence a Cabaji con Luffy y Zoro; después Buggy te espera en su carpa.', 'First defeat Cabaji with Luffy and Zoro; then Buggy waits in his tent.'),
      wp: { loc: ORANGE_CIRCUS, m: 'dawn', t: 'Buggy' } }; }
  const live = DF_SPAWN.f && (DF_SPAWN.f.kind || 'transparente') === kind && G.t - DF_SPAWN.f.t < 240 ? DF_SPAWN.f : null;
  const wp = live ? { loc: [live.x >> 4, live.y >> 4], m: 'dawn', t: ITEMS[DFR[kind].item].n } : null;
  if (kind === 'transparente') return { where: L2('Aparece sola en tierra firme del Mar de Dawn, cerca de ti', 'It appears on its own on dry land in the Dawn Sea, near you'),
    chance: L2('12 % cada 45 s mientras caminas por una isla · dura 4 min', '12% every 45 s while you walk on an island · lasts 4 min'),
    extra: L2('Sale un aviso y una flecha. No aparece si ya la llevas o te la comiste.', 'A notice and an arrow appear. It does not spawn if you carry it or ate it.'), wp, live };
  if (kind === 'mera' || kind === 'hana') return { where: L2('Aparece en una isla del Mar de Dawn: Foosha, Shells Town, Orange Town, Isla de los Animales Raros o Villa Syrup', 'It appears on a Dawn Sea island: Foosha, Shells Town, Orange Town, Island of Rare Animals or Syrup Village'),
    chance: L2('13 % cada 45 s en el Mar de Dawn (en tierra o en el bote) · dura 4 min', '13% every 45 s in the Dawn Sea (on land or by boat) · lasts 4 min'),
    extra: L2('Necesitas el permiso de desembarco. El aviso dice la isla y el mapa la marca. Animales Raros y Villa Syrup cuentan cuando la historia te deja llegar con la tripulación. Shanks la quita con Voluntad ', 'You need the landing permit. The notice names the island and the map marks it. Rare Animals and Syrup Village count once the story lets you reach them with the crew. Shanks removes it at Will rank ') + DFR[kind].rank + '.', wp, live };
  const src = typeof itemSources === 'function' ? itemSources(DFR[kind].item) : null;
  return { where: src && src[0] ? src[0][0] : L2('Desconocido', 'Unknown'), chance: '', wp: src && src[0] && src[0][1] };
}
function dfTabPower(kind) {
  const D = DFR[kind], ids = DFS[kind] || [];
  if (kind === 'goma') return L2('Cuerpo de goma: tus golpes cuerpo a cuerpo estiran el brazo con el arma.', 'Rubber body: your melee hits stretch your arm with the weapon.');
  if (kind === 'transparente') return L2('Invisibilidad: los enemigos dejan de verte y tu primer golpe hace más daño.', 'Invisibility: enemies lose sight of you and your first hit deals more damage.');
  return D.passive || (D.desc || '').replace(/<[^>]+>/g, '') || (ids.length ? '' : L2('Sin técnicas.', 'No techniques.'));
}
function renderFruitsTab(B) {
  const P = G.P, kinds = Object.keys(DFR), have = k => P.fruit === k ? 2 : countItem(DFR[k].item) ? 1 : 0;
  const n = kinds.filter(k => have(k)).length;
  let h = `<div class="frame dftab"><h3>🍇 ${L2('Frutas del Diablo', 'Devil Fruits')} · ${n}/${kinds.length}</h3><p class="hint">${L2('Todas las frutas que hay en el juego, el poder que dan y cómo conseguirlas. Solo puedes tener el poder de una a la vez; Shanks (Foosha) lo retira. Con una fruta comida pierdes vida bajo el agua.', 'Every fruit in the game, the power it gives and how to get it. You can only hold one power at a time; Shanks (Foosha) removes it. With an eaten fruit you lose HP underwater.')}</p>`;
  h += `<p class="hint">${P.fruit && DFR[P.fruit] ? L2('Tu poder: ', 'Your power: ') + '<b>' + esc(DFR[P.fruit].ic + ' ' + DFR[P.fruit].n) + '</b>' + L2(' · rango ', ' · rank ') + dfRank() + '/10' : L2('Aún no has comido ninguna fruta.', 'You have not eaten any fruit yet.')}</p>`;
  for (const k of kinds) { const D = DFR[k], it = ITEMS[D.item], st = have(k), H = dfTabHow(k), ids = DFS[k] || [];
    const badge = st === 2 ? `<span class="dfb on">✓ ${L2('Comida', 'Eaten')}</span>` : st === 1 ? `<span class="dfb bag">🎒 ${L2('En tu mochila', 'In your bag')}</span>` : `<span class="dfb no">${L2('No conseguida', 'Not found')}</span>`;
    h += `<div class="dfcard">${iconHTML(it.icon, 48)}<div class="dfi"><b>${esc(it.n)}</b> <small>${esc(DF_TAB_TYPE[k] || 'Paramecia')}</small> ${badge}`;
    h += `<p>⚡ ${esc(dfTabPower(k))}</p>`;
    if (ids.length) h += `<p class="dftech">${ids.map(id => SK[id] ? `${iconHTML(SK[id].icon, 16)} ${esc(SK[id].n)}` : '').join(' · ')}</p>`;
    h += `<p>📍 ${esc(H.where)}</p>`;
    if (H.chance) h += `<p>🎲 ${esc(H.chance)}${H.left ? ` · <b>${L2('te faltan como mucho ', 'at most ')}${H.left}${L2(' victorias', ' wins left')}</b>` : ''}</p>`;
    if (H.live) h += `<p class="dflive">✨ ${L2('¡Ahora mismo hay una en ', 'One is out right now on ')}${esc(H.live.island || L2('una isla cercana', 'a nearby island'))}!</p>`;
    if (H.extra) h += `<p class="hint">${esc(H.extra)}</p>`;
    if (H.wp && H.wp.loc) h += `<button class="btn sm" data-dfwp="${k}">🧭 ${L2('Marcar en el mapa', 'Mark on the map')}</button>`;
    h += `</div></div>`; }
  B.innerHTML = h + '</div>';
  B.querySelectorAll('[data-dfwp]').forEach(b => b.onclick = () => { const H = dfTabHow(b.dataset.dfwp); if (!H.wp) return; setWp(H.wp); toast(L2('Destino marcado: ', 'Destination marked: ') + H.wp.t, 'info', 3); sfx('ui'); });
}
// renderPanel usa una tabla fija: se dibuja como si fuera la Enciclopedia y se cambia el cuerpo y la pestaña activa.
{ const _rp = renderPanel; renderPanel = function () {
  if (panelTab !== 'frutas') return _rp.apply(this, arguments);
  const enc = renderEncyclo; panelTab = 'best'; renderEncyclo = renderFruitsTab;
  try { return _rp.apply(this, arguments); } finally { renderEncyclo = enc; panelTab = 'frutas';
    $$('#ptabs .tab').forEach(b => b.classList.toggle('on', b.dataset.t === 'frutas')); } }; }
{ const st = document.createElement('style'); st.textContent = '.dftab .dfcard{display:flex;gap:.6em;align-items:flex-start;padding:.5em 0;border-top:1px solid rgba(220,180,110,.3)}.dftab .dfcard>img,.dftab .dfcard>canvas,.dftab .dfcard>span:first-child{flex:none;image-rendering:pixelated}.dftab .dfi{flex:1;min-width:0}.dftab .dfi p{margin:.2em 0;font-size:.86em;line-height:1.3}.dftab .dfb{font-size:.72em;padding:.05em .4em;border-radius:.4em;margin-left:.3em;white-space:nowrap}.dftab .dfb.on{background:#3d7a3a}.dftab .dfb.bag{background:#7a5a2a}.dftab .dfb.no{background:rgba(255,255,255,.12)}.dftab .dflive{color:#ffe08a}.dftab .dftech{opacity:.9}'; document.head.appendChild(st); }
// Arreglo: cuando una fruta del mapa desaparece a los 4 min, la flecha seguía apuntando a ese sitio.
{ let last = null; V33_TICKS.push(() => { try { const F = DF_SPAWN.f, P = G.P; if (F) { last = F; return; } if (!last || !P) return;
  if (P.wp && P.wp.m === 'dawn' && P.wp.x === (last.x >> 4) && P.wp.y === (last.y >> 4)) { P.wp = null; markDirty(true); } last = null; } catch (e) { } }); }
