// ================= v5.07: FANS QUE TE SIGUEN (carrera de idol) =================
// Si eres idol (agencia de Akane), en los pueblos y en las ciudades de Japón se te acercan fans según tu rango:
// te siguen un rato, piden un autógrafo (lo firmas solo con quedarte cerca), te dan las gracias y se van.
// Cada autógrafo suma unos pocos fans. En multijugador los demás ven a tus fans siguiéndote (presencia `fan`).
const FAN_MAX = [1, 2, 3, 5, 7, 10], FAN_EVERY = [26, 20, 15, 10, 7, 4];
const FANS = []; let fanT = 6;
function fanRank(P) { return P && P.jp && P.jp.idol && typeof idolRank === 'function' ? idolRank(P.jp.idol.fans || 0) : -1; }
function fanPlace(P) { const M = G.map; if (!M || P.dead || P.inside) return false; if (M.jp) return true; if (M.id !== 'world') return false; const tx = P.x / 16, ty = P.y / 16; return TOWNS.some(t => tx >= t.x0 - 6 && tx <= t.x1 + 6 && ty >= t.y0 - 6 && ty <= t.y1 + 6); }
function fanApps() { return G.map && G.map.jp && typeof JP_APPS_W !== 'undefined' ? JP_APPS_W : undefined; }
function fanSpawn(owner, local) { const a = Math.random() * Math.PI * 2, r = 170 + Math.random() * 60, i = (Math.random() * 16) | 0;
 FANS.push({ own: owner, local, x: owner.x + Math.cos(a) * r, y: owner.y + Math.sin(a) * r * 0.7, A: xwAtlas(i, fanApps()), mv: 1, ph: Math.random() * 9, dir: 'down', st: 'come', t: 0, sp: 46 + Math.random() * 18, off: [(Math.random() - 0.5) * 50, 16 + Math.random() * 18] }); }
function fanTick(dt) { const P = G.P; if (!P || !G.map) { FANS.length = 0; return; }
 const rk = fanRank(P), here = rk >= 0 && fanPlace(P), mine = FANS.filter(f => f.local).length;
 if (here) { fanT -= dt; if (fanT <= 0 && mine < FAN_MAX[rk]) { fanT = FAN_EVERY[rk] * (0.7 + Math.random() * 0.6); fanSpawn(P, true); } }
 // fans de otros jugadores (en el mismo mapa)
 for (const r of G.remote.values()) { if (r.map !== P.map || !r.fan) continue; const have = FANS.filter(f => f.own === r).length; if (have < r.fan && Math.random() < dt * 0.4) fanSpawn(r, false); }
 for (let k = FANS.length - 1; k >= 0; k--) { const f = FANS[k], o = f.own; f.t += dt;
  if (!o || (o !== P && !G.remote.has(o.peer)) || (o.map && o.map !== P.map) || Math.abs(f.x - P.x) > 800 || Math.abs(f.y - P.y) > 600) { FANS.splice(k, 1); continue; }
  if (f.local && !here && f.st !== 'leave') { f.st = 'leave'; f.t = 0; }
  if (!f.local && o.fan < FANS.filter(q => q.own === o).length && f.st !== 'leave') { f.st = 'leave'; f.t = 0; }
  let tx = o.x + f.off[0], ty = o.y + f.off[1];
  if (f.st === 'leave') { const a = Math.atan2(f.y - o.y, f.x - o.x); tx = f.x + Math.cos(a) * 200; ty = f.y + Math.sin(a) * 200; if (f.t > 6) { FANS.splice(k, 1); continue; } }
  const dx = tx - f.x, dy = ty - f.y, L = Math.hypot(dx, dy);
  if (L > 6) { const st = Math.min(L, f.sp * dt * (L > 120 ? 1.6 : 1)); f.x += dx / L * st; f.y += dy / L * st; f.mv = 1; f.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
  else { f.mv = 0; f.dir = Math.abs(o.x - f.x) > Math.abs(o.y - f.y) ? (o.x > f.x ? 'right' : 'left') : (o.y > f.y ? 'down' : 'up'); }
  if (f.st === 'come' && L < 30) { f.st = 'ask'; f.t = 0; }
  if (f.st === 'ask' && f.t > 3.5) { f.st = 'happy'; f.t = 0; if (f.local) { const g = 1 + rk * 3; P.jp.idol.fans = (P.jp.idol.fans || 0) + g; floatText(f.x, f.y - 40, '✍ +' + g + ' ' + L2('fans', 'fans'), '#ff8ad0'); sfx('coin'); markDirty(); } }
  if (f.st === 'happy' && f.t > 2.5) { f.st = Math.random() < 0.35 ? 'follow' : 'leave'; f.t = 0; }
  if (f.st === 'follow' && f.t > 12 + Math.random() * 8) { f.st = 'leave'; f.t = 0; }
 } }
V33_TICKS.push(dt => fanTick(Math.min(0.05, dt || 0)));
function fanBubble(f, sx, sy) { const y = Math.round(sy - 42), x = Math.round(sx); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillRect(x - 6, y - 6, 13, 11); ctx.fillRect(x - 1, y + 5, 3, 2);
 if (f.st === 'ask') { ctx.fillStyle = '#3a2a4a'; ctx.fillRect(x - 3, y - 3, 7, 1); ctx.fillRect(x - 3, y - 1, 5, 1); ctx.fillRect(x - 3, y + 1, 6, 1); ctx.fillStyle = '#e83a8a'; ctx.fillRect(x + 3, y + 1, 1, 2); }
 else { ctx.fillStyle = '#ff4a8a'; ctx.fillRect(x - 3, y - 3, 2, 2); ctx.fillRect(x + 1, y - 3, 2, 2); ctx.fillRect(x - 3, y - 2, 6, 2); ctx.fillRect(x - 2, y, 4, 1); ctx.fillRect(x - 1, y + 1, 2, 1); } }
DL_HOOKS.push((list, cx, cy) => { for (const f of FANS) if (f.x > cx - 40 && f.x < cx + VW + 40 && f.y > cy - 40 && f.y < cy + VH + 60) list.push({ type: 'xdraw', x: f.x, y: f.y, noShadow: true, draw: (e, a, b) => { xwDraw(f, a, b); if (f.st === 'ask' || f.st === 'happy') fanBubble(f, f.x - a, f.y - b); } }); });
// multijugador: cuántos fans te siguen ahora
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); const n = FANS.filter(f => f.local && f.st !== 'leave').length; if (n) o.fan = n; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); r.fan = clamp(pr.fan | 0, 0, 10); }; }
if (typeof GSIS !== 'undefined') { const e = GSIS.find(s => s[0] === 'of_idols'); const add = ['of_fans', '✍ ' + L2('Fans que te siguen', 'Fans who follow you'), () => [
 L2('Si eres idol (agencia de Akane en Akihabara), en los pueblos y en las ciudades de Japón se te acercan fans. Cuanto más alto tu rango, más fans y más a menudo (de 1 a 10 a la vez).', 'If you are an idol (Akane’s agency in Akihabara), fans come up to you in towns and Japanese cities. The higher your rank, the more fans and the more often (from 1 to 10 at a time).'),
 L2('Te piden un autógrafo: quédate cerca unos segundos y lo firmas (+fans). Algunos te siguen un rato y luego se van. Los demás jugadores también ven a tus fans.', 'They ask for an autograph: stay close for a few seconds and you sign it (+fans). Some follow you for a while and then leave. Other players see your fans too.')], () => null];
 GSIS.splice(e ? GSIS.indexOf(e) + 1 : 0, 0, add); }
