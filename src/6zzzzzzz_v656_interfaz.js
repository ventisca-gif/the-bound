// ================= 6.56 · Interfaz más cómoda en el celular (revisión de pantallas) =================
// Todo con ganchos y CSS (bloque «6.56» al final del <style> de template.html). No se borra nada.

// 1) Pestañas del menú: Mascotas y Pase tenían el mismo dibujo que Enciclopedia (pata) y Habilidades (estrella). En el
//    celular solo se ven los iconos, así que ahora cada pestaña tiene el suyo.
try { const T = k => TABS.find(t => t[0] === k); if (T('pets')) T('pets')[2] = ['bone', '#e0d8c2']; if (T('pass')) T('pass')[2] = ['medal', '#ffd040']; } catch (e) { }

// 2) Fila de pestañas: en vertical no caben las 15. Se difumina el borde que tiene más pestañas (pista de que se puede
//    deslizar) y la pestaña elegida se desliza a la vista.
function v656TabsHint() { const r = $('#ptabs'); if (!r) return; const L = r.scrollLeft > 4, R = r.scrollLeft + r.clientWidth < r.scrollWidth - 4; r.classList.toggle('mL', L); r.classList.toggle('mR', R); }
hookAfter('renderPanel', function () {
  try { const r = $('#ptabs'); if (!r) return; if (!r._v656) { r._v656 = 1; r.addEventListener('scroll', v656TabsHint, { passive: true }); }
    const on = r.querySelector('.tab.on'); if (on) { const a = on.offsetLeft, b = a + on.offsetWidth; if (a < r.scrollLeft) r.scrollLeft = a - 8; else if (b > r.scrollLeft + r.clientWidth) r.scrollLeft = b - r.clientWidth + 8; }
    v656TabsHint(); } catch (e) { }
});

// 3) Consejos que seguían hablando de antes de la 5.64 (herramientas en la mochila y «botón de acción»): desde la 5.64
//    hachas, picos y cañas se equipan en el inventario y se usan con su casilla de la barra de abajo.
Object.assign(TIPS, {
  tools: L2('Las herramientas se <b>equipan en el Inventario</b> y se usan con su casilla de la barra de abajo: 🪓 talar, ⛏ minar y 🎣 pescar. La Anciana Mira te regala hacha, caña y pico.', 'Tools are <b>equipped in the Inventory</b> and used with their slot on the bottom bar: 🪓 chop, ⛏ mine and 🎣 fish. Elder Mira gives you an axe, a rod and a pickaxe.'),
  tree: L2('Árbol al frente: toca la casilla 🪓 de la barra de abajo para talar y conseguir troncos.', 'Tree ahead: tap the 🪓 slot on the bottom bar to chop logs.'),
  ore: L2('Veta de mineral: toca la casilla ⛏ de la barra de abajo para minar con tu pico.', 'Ore vein: tap the ⛏ slot on the bottom bar to mine with your pickaxe.'),
  fish: L2('Agua: toca la casilla 🎣 para lanzar la caña. Cuando pique, toca otra vez y <b>mantén</b> para que el pez quede en la zona verde.', 'Water: tap the 🎣 slot to cast. When it bites, tap again and <b>hold</b> to keep the fish in the green zone.'),
  herb: L2('Planta: acércate y toca <b>Recoger</b> para guardarla. Sirve para pociones y comida.', 'Plant: walk up and tap <b>Gather</b> to pick it. It is used for potions and food.'),
});

// 4) Bocadillos de los NPC: en la plaza se tapaban unos a otros y con la etiqueta del clima de arriba. Ahora, si un
//    bocadillo pisa otro ya dibujado en ese fotograma, sube por encima; y ninguno se mete en la franja de arriba.
const V656B = { t: -1, r: [] };
hookAround('drawBubble', function (next, str, x, y) {
  if (V656B.t !== G.t) { V656B.t = G.t; V656B.r = []; }
  const lines = Math.min(3, Math.ceil(String(str || '').length / 22) || 1), h = lines * 8 + 6, w = Math.min(22, String(str || '').length) * 4 + 10;
  for (let k = 0; k < 4; k++) { const hit = V656B.r.find(r => Math.abs(r[0] - x) < (r[2] + w) / 2 && y - h < r[1] && y > r[1] - r[3]); if (!hit) break; y = hit[1] - hit[3] - 3; }
  if (y - h < 22) y = 22 + h;
  V656B.r.push([x, y, w, h]); return next(str, x, y);
});

// 5) Casillas de habilidad vacías «+»: a nivel 1 había 6 círculos vacíos entre los botones. Se ven solo cuando tienes
//    algo que poner (habilidad aprendida sin colocar o puntos por gastar). Las ocupadas no cambian.
function v656SlotsWanted() { const P = G.P; if (!P) return true; if (P.spts > 0) return true; const sl = P.slots || [];
  for (const id in P.skills || {}) { const s = SK[id]; if (s && s.type !== 'pas' && !sl.includes(id)) return true; } return false; }
let V656_SLT = 0;
hookAfter('updateHUD', function () {
  const now = performance.now(); if (now - V656_SLT < 250) return; V656_SLT = now;
  try { const want = v656SlotsWanted(); document.body.classList.toggle('v656noslot', !want); } catch (e) { }
});

// 6) Mapa con el celular en horizontal: la leyenda ocupaba un tercio de la pantalla. Botón para plegarla (se recuerda).
let V656_LEG = false; try { V656_LEG = localStorage.getItem('thebound.legOff') === '1'; } catch (e) { }
hookAfter('renderMap', function (r, B) {
  try { const W = (B && B.querySelector) ? B.querySelector('.mapwrap') : $('#pbody .mapwrap'); if (!W || W.querySelector('.v656leg')) return;
    W.classList.toggle('legOff', V656_LEG);
    const b = document.createElement('button'); b.className = 'btn sm v656leg'; const lab = () => { b.textContent = V656_LEG ? '◀ ' + L2('Leyenda', 'Legend') : L2('Ocultar leyenda', 'Hide legend') + ' ▶'; };
    lab(); b.onclick = () => { V656_LEG = !V656_LEG; try { localStorage.setItem('thebound.legOff', V656_LEG ? '1' : '0'); } catch (e) { } W.classList.toggle('legOff', V656_LEG); lab(); sfx('ui'); };
    W.appendChild(b); } catch (e) { }
});
