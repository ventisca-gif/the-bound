// 6.38 · Cómo llegar a la tumba de tus hijos (Sergio: «no sé cómo llegar a ver a mi hijo fallecido; en el mapa de las
// Tierras del Vínculo debería haber un icono para ir»).
// - Mapa: categoría «🕯 Camposanto» (MAPC.cem) con la entrada del Camposanto del Alba y la tumba de cada familiar fallecido
//   († nombre, edad); al tocarla, la flecha dorada lleva allí como cualquier punto del mapa.
// - Al fallecer un hijo o nieto, la flecha dorada apunta sola a su tumba y el aviso lo dice.
// - Árbol genealógico: botón «🕯 Ir al Camposanto».
MAPC.cem = [L2('Camposanto del Alba', 'Dawn Graveyard'), 'Dawn Graveyard', '#c8b0ff', 'star'];
function cemGate() { return typeof SA !== 'undefined' && SA.cem ? [SA.cem.gate, SA.cem.y1 - 1] : null; }
function cemGraveOf(f) { const P = G.P; if (typeof SA === 'undefined' || !SA.famG || !P) return null; try { cmSync(); } catch (e) { }
  const i = (P.fallen || []).indexOf(f); const o = SA.famG.find(o => !o.hidden && o.fi === i); return o ? [o.tx, o.ty + 1] : null; }
function cemGo(f) { const at = (f && cemGraveOf(f)) || cemGate(); if (!at) return false; setWp({ loc: at, m: 'world', t: f ? '🕯 ' + f.name : L2('Camposanto del Alba', 'Dawn Graveyard') }); return true; }
hookAfter('worldPOI', out => { if (!Array.isArray(out)) return; const P = G.P, g = cemGate(); if (g) out.push({ c: 'cem', x: g[0], y: g[1], t: '🕯 ' + L2('Camposanto del Alba · tumbas de tu familia', 'Dawn Graveyard · your family’s graves') });
  for (const f of (P && P.fallen) || []) { const at = cemGraveOf(f); if (at) out.push({ c: 'cem', x: at[0], y: at[1] - 1, t: '† ' + f.name + ' · ' + f.age + L2(' años', ' years') }); } });
hookAfter('kidDie', () => { const P = G.P, f = P && P.fallen && P.fallen[P.fallen.length - 1]; if (!f) return; setTimeout(() => { if (cemGo(f)) toast('🕯 ' + L2('La flecha dorada te lleva a la tumba de ', 'The golden arrow leads to the grave of ') + f.name + L2(' (Camposanto del Alba, al sur de Albor). También está en el Mapa.', ' (Dawn Graveyard, south of Albor). It is also on the Map.'), 'info', 7); }, 1500); });
hookAfter('famTree', () => { const M = $('#modal'), P = G.P; if (!M || !P || !(P.fallen || []).length || M.querySelector('#cemGo')) return; const row = M.querySelector('.row') || M;
  row.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="cemGo">🕯 ${L2('Ir al Camposanto', 'Go to the Graveyard')}</button>`); $('#cemGo').onclick = () => { if (cemGo(P.fallen[P.fallen.length - 1])) closeModal(); }; });
{ const i = typeof GSIS !== 'undefined' ? GSIS.findIndex(g => g[0] === 'camposanto') : -1; if (i >= 0) { const f = GSIS[i][2]; GSIS[i][2] = () => f().concat([L2('En el Mapa (Tierras del Vínculo) sale la categoría «Camposanto del Alba» con la entrada y la tumba de cada familiar († nombre). Al fallecer alguien, la flecha dorada te lleva a su tumba; en el árbol genealógico tienes «Ir al Camposanto».', 'On the Map (Lands of the Bound) there is a «Dawn Graveyard» category with the entrance and each relative’s grave († name). When someone passes away, the golden arrow leads to their grave; the family tree has «Go to the Graveyard».')]); } }
