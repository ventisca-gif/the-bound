// 6.41 · Oro de minijuegos y trabajos (Sergio: «mide cuánto oro dan los minijuegos y trabajos»).
// Medido (6.41, revisión de los 209 sitios que dan oro): los trabajos dan 100-2.000 por ronda (~1 min), los minijuegos de
// pueblo 200-3.000, matar monstruos ~150 por monstruo a nivel 139 y ~660 a nivel 600. Los premios grandes van con marca por
// día/semana/vez. Pero cinco actividades se podían repetir sin límite y pagaban fijo 80.000-600.000 por partida de 1-3
// minutos, a cualquier nivel (50-100 veces lo demás): carrera de relevos (hasta 600.000), carrera de dragones (hasta
// 400.000), casos del Tren Misterio (80.000 + 800/nivel), duelo de cocina (120.000 + 500/nivel) y esculturas de arena.
// Ahora pagan entero las 3 primeras veces de cada día del calendario, el 40 % de la 4.ª a la 6.ª y el 15 % después.
function goldDim(k) { const P = G.P; if (!P) return 1; const d = typeof calDay === 'function' ? calDay() : 0; if (!P.gdim || P.gdim.d !== d) P.gdim = { d, n: {} };
  const n = (P.gdim.n[k] = (P.gdim.n[k] || 0) + 1), f = n <= 3 ? 1 : n <= 6 ? 0.4 : 0.15;
  if (f < 1) setTimeout(() => toast('💰 ' + L2('Recompensa reducida (' + Math.round(f * 100) + ' %): ya lo hiciste ' + (n - 1) + ' veces hoy. Mañana vuelve a pagar entero.', 'Reduced reward (' + Math.round(f * 100) + '%): you already did it ' + (n - 1) + ' times today. Tomorrow it pays in full again.'), 'info', 5), 800);
  markDirty(); return f; }
SAVEKEYS.push('gdim');
if (typeof GSIS !== 'undefined') GSIS.unshift(['oro641', '💰 ' + L2('Oro de los minijuegos', 'Minigame gold'), () => [
  L2('La carrera de relevos, la carrera de dragones, los casos del Tren Misterio, el duelo de cocina y las esculturas de arena pagan entero las 3 primeras veces de cada día; de la 4.ª a la 6.ª el 40 % y después el 15 %. Al día siguiente vuelven a pagar entero.', 'The relay race, dragon race, Mystery Train cases, cooking duel and sand sculptures pay in full the first 3 times each day; the 4th to 6th pay 40% and after that 15%. The next day they pay in full again.')
], () => null]);
