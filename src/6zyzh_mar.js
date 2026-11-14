// ================= v4.29: FONDO MARINO — almejas gigantes (minijuego), perlas rosas, doradas y de luna, 30 perlas perdidas,
// la sirena Perlina (compra y cambia perlas), Collar de Perlas Doradas, tortugas y la ballena del abismo =================
it('perla_rosa', { n: L2('Perla Rosa', 'Pink Pearl'), t: 'mat', stack: true, price: 2500, icon: ['pearl', '#ff9ac0'], rar: 3 });
it('perla_dorada', { n: L2('Perla Dorada', 'Golden Pearl'), t: 'mat', stack: true, price: 9000, icon: ['pearl', '#ffd040'], rar: 4 });
it('perla_luna', { n: L2('Perla de Luna', 'Moon Pearl'), t: 'mat', stack: true, price: 40000, icon: ['pearl', '#c8e8ff'], rar: 5 });
it('collar_perlas_doradas', { n: L2('Collar de Perlas Doradas', 'Golden Pearl Necklace'), t: 'acc', slot: 'neck', lv: 200, price: 400000, icon: ['amulet', 5], rar: 5, hpB: 16000, def: 700, mpB: 1600, atk: 820, crit: 3 });
it('lagrima_luna', { n: L2('Lágrima de Luna', 'Moon Tear'), t: 'acc', slot: 'acc', lv: 250, price: 900000, icon: ['ring', 5], rar: 5, hpB: 12000, def: 600, atk: 1100, crit: 5 });
RECIPES.push({ id: 'r_collar_perlas_doradas', job: 'joyeria', out: 'collar_perlas_doradas', n: 1, lv: 200, jlv: 30, gold: 120000, mats: [['perla_dorada', 3], ['perla_rosa', 5], ['perla', 6]], cat: 'accesorio' });
RECIPES.push({ id: 'r_lagrima_luna', job: 'joyeria', out: 'lagrima_luna', n: 1, lv: 250, jlv: 40, gold: 300000, mats: [['perla_luna', 2], ['perla_dorada', 3], ['diamante', 2]], cat: 'accesorio' });

// ---------- dibujos ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = s => C(s);
  if (kind === 'mr_gigante') { const p = new Pix(34, 24), s = pal(['#3a2a5a', '#7a5aa8', '#b89ae0', '#f0e0ff']); p.ell(17, 16, 16, 7, s[1]); for (let k = 0; k < 7; k++) p.line(17, 22, 3 + k * 5, 10, s[0]); p.ell(17, 9, 15, 6, s[2]); for (let k = 0; k < 6; k++) p.line(17, 4, 4 + k * 5, 12, s[1]);
    p.hl(4, 14, 26, s[3]); p.ball(17, 14, 3, 2, pal(['#c8a0b0', '#ffd0e0', '#ffffff', '#ffffff'])); p.outline(D('#140a20')); return { c: p.canvas(), ax: 17, ay: 23, light: 1 }; }
  if (kind === 'mr_brillo') { const p = new Pix(10, 10); p.set(4, 1, D('#ffffff')); p.set(4, 7, D('#ffffff')); p.hl(1, 4, 7, D('#c8e8ff')); p.ball(4, 4, 2, 2, pal(['#c8a0b0', '#ffe0f0', '#ffffff', '#ffffff'])); return { c: p.canvas(), ax: 4, ay: 8, light: 1 }; }
  return _ge(kind); }; }
// sirena Perlina: dibujada con cola de pez sobre su figura
NPCS.perlina = { n: 'Perlina', title: L2('La sirena de las perlas', 'The pearl mermaid'), look: LK({ g: 'f', outfit: 'dress', hairStyle: 'long', hair: HAIRS.turquesa, skin: SKINS[1], main: P5(['#0a3a4a', '#1a6a7a', '#2aa0a8', '#6ad8d0', '#c0fff4']), eyes: 'azul' }),
  lines: [L2('Las almejas gigantes se abren cuando respiran. Si las abres a destiempo, muerden. Lo digo por experiencia: me faltan dos escamas.', 'Giant clams open when they breathe. Open them at the wrong time and they bite. I speak from experience: I am missing two scales.'),
    L2('Hay treinta perlas perdidas por todo el fondo. Brillan un poquito. Las perdió una reina de Nerea que lloraba perlas en vez de lágrimas.', 'There are thirty lost pearls across the seabed. They shine a little. A queen of Nerea who cried pearls instead of tears lost them.'),
    L2('La ballena del abismo pasa por la zona oscura. No muerde, solo canta. Si la oyes, es que vas por buen camino.', 'The abyss whale passes through the dark zone. It does not bite, it only sings. If you hear it, you are on the right path.')], quests: [] };
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de(e, cx, cy); if (e.type === 'npc' && e.id === 'perlina') { const x = Math.round(e.x - cx), y = Math.round(e.y - cy - (e.z || 0)), sw = Math.round(Math.sin(G.t * 3) * 2);
    ctx.fillStyle = '#1a8a8a'; ctx.beginPath(); ctx.ellipse(x, y - 6, 6, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2ac0b0'; ctx.beginPath(); ctx.ellipse(x + 1, y - 7, 4, 6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#6ae0d0'; ctx.beginPath(); ctx.moveTo(x + sw, y + 1); ctx.lineTo(x - 7 + sw, y + 6); ctx.lineTo(x + sw, y + 3); ctx.lineTo(x + 7 + sw, y + 6); ctx.closePath(); ctx.fill(); } return r; }; }

// ---------- colocar almejas, perlas perdidas y a Perlina al crear el mapa ----------
const MR_FOUND = 30;
{ const _mk = makeSub; makeSub = function () { const fresh = !G.maps.submarino, M = _mk(); if (!fresh || M.v429) return M; M.v429 = 1; const R = new RNG(SEED + 6161), ent = SUB.entry;
  const free = (x, y) => { const i = M.I(x, y); return x > 2 && y > 2 && x < M.w - 3 && y < M.h - 3 && M.lvl[i] === 0 && !SOLID_T[M.ter[i]] && M.objAt[i] < 0 && Math.hypot(x - ent[0], y - ent[1]) > 5; };
  const spot = (y0, y1) => { for (let t = 0; t < 500; t++) { const x = R.int(3, M.w - 4), y = R.int(y0, y1); if (free(x, y)) return [x, y]; } return null; };
  const Z = [[6, 32], [33, 64], [65, 96]]; let gi = 0, pi = 0;
  for (let z = 0; z < 3; z++) for (let k = 0; k < 4; k++) { const s = spot(...Z[z]); if (s) addObj(M, 'furn', s[0], s[1], { f: 'mr_gigante', fp: [[-1, 0], [0, 0], [1, 0]], xact: 'gclam', gid: gi++, gz: z }); }
  for (let z = 0; z < 3; z++) for (let k = 0; k < 10; k++) { const s = spot(...Z[z]); if (s) addObj(M, 'furn', s[0], s[1], { f: 'mr_brillo', fp: [[0, 0]], solid: false, xact: 'lostpearl', pid: pi++ }); }
  const s = spot(ent[1] + 3, ent[1] + 12) || [ent[0] + 3, ent[1] + 5]; spawnNPC('perlina', s[0] * 16 + 8, s[1] * 16 + 8, 'submarino', { face: 'down' });
  M.turtles = Array.from({ length: 5 }, (_, i) => ({ x: R.int(10, M.w - 10) * 16, y: R.int(10, 60) * 16, a: R.f() * 6.28, v: 10 + R.f() * 8 })); const de = M.drawExtra; M.drawExtra = (cx, cy) => { de && de(cx, cy); mrFauna(M, cx, cy); }; M.chunks = new Map(); return M; }; }
{ const _it = interactTarget; interactTarget = function () { const P = G.P; if (P && G.map && G.map.sub) for (const o of G.map.objs) if (o.xact === 'lostpearl' && (P.pearlF || []).includes(o.pid)) o.hidden = true; return _it.apply(this, arguments); }; }
XACT.lostpearl = [L2('Coger la perla perdida', 'Take the lost pearl'), ['pearl', '#ffe0f0'], o => { const P = G.P; P.pearlF = P.pearlF || []; if (P.pearlF.includes(o.pid)) return; P.pearlF.push(o.pid); o.hidden = true; const n = P.pearlF.length;
  giveItem(n % 10 === 0 ? 'perla_luna' : n % 3 === 0 ? 'perla_dorada' : 'perla_rosa', 1); sfx('coin'); burst(o.px, o.py - 6, 12, { sp: 40, up: 30, g: 20, life: 0.8, c: ['#ffe0f0', '#ffffff', '#c8e8ff'] });
  toast(L2(`Perla perdida ${n}/${MR_FOUND}`, `Lost pearl ${n}/${MR_FOUND}`), 'loot', 4);
  if (n === 10) { P.gold += 50000; toast(L2('Perlina te dará una recompensa: ¡10 perlas perdidas!', 'Perlina has a reward: 10 lost pearls!'), 'quest'); }
  if (n === MR_FOUND) { giveItem('lagrima_luna', 1); banner(L2('¡Todas las perlas perdidas!', 'All the lost pearls!'), L2('Recibes la Lágrima de Luna', 'You receive the Moon Tear')); } markDirty(true); }];
// almeja gigante: pulsa «Abrir» cuando esté abierta del todo (zona verde); si fallas, muerde
XACT.gclam = [o => { const P = G.P; return ((P.gclD || {})[o.gid] === calDay()) ? L2('Almeja gigante (mañana)', 'Giant clam (tomorrow)') : L2('Abrir almeja gigante', 'Open giant clam'); }, ['pearl', '#ff9ac0'], o => {
  const P = G.P; P.gclD = P.gclD || {}; if (P.gclD[o.gid] === calDay()) { toast(L2('Esta almeja ya está cerrada hasta mañana', 'This clam is shut until tomorrow'), 'info'); return; }
  let t = 0, done = false, raf = 0; const sp = 1.6 + o.gz * 0.5, zone = 0.16 - o.gz * 0.025;
  openModal(`<h2>${L2('Almeja gigante', 'Giant clam')}</h2><p class="hint">${L2('Se abre y se cierra al respirar. Pulsa «Abrir» cuando la marca esté en la zona verde.', 'It opens and closes as it breathes. Press "Open" when the marker is in the green zone.')}</p><div id="gcBar" style="position:relative;height:1.4em;background:#1a2a3a;border-radius:.5em;overflow:hidden;margin:.6em 0"><div style="position:absolute;left:${(1 - zone) * 100}%;right:0;top:0;bottom:0;background:#3ad07a"></div><div id="gcM" style="position:absolute;top:0;bottom:0;width:5px;background:#fff"></div></div><div class="row"><button class="btn gold" id="gcGo">${L2('Abrir', 'Open')}</button></div>`, 'party');
  const tick = () => { if (done) return; t += 0.016; const v = (Math.sin(t * sp) + 1) / 2, m = $('#gcM'); if (!m) { done = true; return; } m.style.left = `calc(${(v * 100).toFixed(1)}% - 2px)`; m.dataset.v = v; raf = requestAnimationFrame(tick); }; tick();
  $('#gcGo').onclick = () => { done = true; cancelAnimationFrame(raf); const v = +($('#gcM').dataset.v || 0); closeModal(); P.gclD[o.gid] = calDay(); markDirty();
    if (v >= 1 - zone) { const r = Math.random(), id = o.gz === 2 && r < 0.12 ? 'perla_luna' : r < 0.25 + o.gz * 0.15 ? 'perla_dorada' : 'perla_rosa', n = id === 'perla_rosa' ? 2 + o.gz : 1; giveItem(id, n); giveItem('perla', 2); sfx('quest'); burst(o.px, o.py - 10, 18, { sp: 50, up: 40, g: 30, life: 1, c: ['#ffe0f0', '#ffffff'] }); toast(L2(`¡La almeja se abre! ${n}× ${ITEMS[id].n} y 2 perlas`, `The clam opens! ${n}× ${ITEMS[id].n} and 2 pearls`), 'loot', 5); }
    else { hurtPlayer(Math.round(P.S.maxhp * 0.1), {}); G.shake = 5; toast(L2('¡Ay! La almeja muerde y se cierra hasta mañana.', 'Ouch! The clam bites and shuts until tomorrow.'), 'warn'); } }; }];
// Perlina compra y cambia perlas
function perlinaShop() { closeDialog(); const P = G.P, SELL = [['perla', 900], ['perla_negra', 6000], ['perla_rosa', 2500], ['perla_dorada', 9000], ['perla_luna', 40000]];
  const render = () => { openModal(`<h2>${L2('Las perlas de Perlina', 'Perlina\'s pearls')}</h2><p class="hint">${L2('Perlas perdidas encontradas', 'Lost pearls found')}: ${(P.pearlF || []).length}/${MR_FOUND}</p><div class="slist">${SELL.map(([id, pr]) => `<button class="srow" data-ps="${id}" ${countItem(id) ? '' : 'disabled'}>${iconHTML(ITEMS[id].icon, 22)}<div class="sn"><b>${esc(ITEMS[id].n)} ×${countItem(id)}</b><small>${L2('Vender una por', 'Sell one for')} ${fmt(pr)} ${L2('oro', 'gold')}</small></div></button>`).join('')}
    <button class="srow" id="psCollar">${iconHTML(ITEMS.collar_perlas_doradas.icon, 22)}<div class="sn"><b>${esc(ITEMS.collar_perlas_doradas.n)}</b><small>3 ${esc(ITEMS.perla_dorada.n)} + 5 ${esc(ITEMS.perla_rosa.n)} + 6 ${esc(ITEMS.perla.n)}</small></div></button></div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
    $('#mclose').onclick = closeModal; $$('[data-ps]').forEach(b => b.onclick = () => { const id = b.dataset.ps; if (!countItem(id)) return; takeItem(id, 1); P.gold += SELL.find(x => x[0] === id)[1]; sfx('coin'); markDirty(); render(); });
    $('#psCollar').onclick = () => { const need = [['perla_dorada', 3], ['perla_rosa', 5], ['perla', 6]]; if (need.some(([id, n]) => countItem(id) < n)) { toast(L2('Te faltan perlas', 'Not enough pearls'), 'warn'); return; } for (const [id, n] of need) takeItem(id, n); giveItem('collar_perlas_doradas', 1); sfx('level'); toast(L2('Perlina te ensarta un Collar de Perlas Doradas ♥', 'Perlina strings you a Golden Pearl Necklace ♥'), 'quest', 5); markDirty(); render(); }; };
  render(); }
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'perlina') opts.unshift({ label: L2('Perlas (vender y collares)', 'Pearls (sell and necklaces)'), icon: ['pearl', '#ffd040'], fn: perlinaShop }); });
// fauna tranquila: tortugas marinas y la ballena del abismo que pasa por la zona oscura
function mrFauna(M, cx, cy) { if (!M.turtles) return; const dt = 0.016;
  for (const t of M.turtles) { t.a += (Math.sin(G.t * 0.3 + t.v) * 0.4) * dt; t.x += Math.cos(t.a) * t.v * dt; t.y += Math.sin(t.a) * t.v * 0.5 * dt; if (t.x < 64 || t.x > M.w * 16 - 64) t.a = Math.PI - t.a; if (t.y < 120 || t.y > 64 * 16) t.a = -t.a;
    const x = Math.round(t.x - cx), y = Math.round(t.y - cy), f = Math.cos(t.a) < 0 ? -1 : 1, fl = Math.sin(G.t * 4 + t.v) * 2; if (x < -30 || x > VW + 30 || y < -30 || y > VH + 30) continue;
    ctx.fillStyle = '#3a6a3a'; ctx.fillRect(x - 6 * f - 2, y - 2 + fl, 4, 2); ctx.fillRect(x + 3 * f - 2, y + 3 - fl, 4, 2); ctx.fillStyle = '#5a8a3a'; ctx.beginPath(); ctx.ellipse(x, y, 8, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#8ab05a'; ctx.beginPath(); ctx.ellipse(x - f, y - 1, 5, 3, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7aa05a'; ctx.beginPath(); ctx.ellipse(x + 9 * f, y, 3, 2.4, 0, 0, 7); ctx.fill(); }
  const P = G.P; if (P.y / 16 > 66) { const k = (G.t * 0.02) % 1, x = Math.round(k * (VW + 400) - 200), y = 70 + Math.sin(G.t * 0.2) * 10; ctx.fillStyle = 'rgba(10,20,40,0.55)'; ctx.beginPath(); ctx.ellipse(x, y, 90, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 85, y); ctx.lineTo(x - 130, y - 22); ctx.lineTo(x - 122, y + 18); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(200,232,255,0.5)'; ctx.fillRect(x + 50, y - 6, 3, 3); } }
SAVEKEYS.push('pearlF', 'gclD');
