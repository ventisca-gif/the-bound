// ================= v4.81: EL SUR DE ALBOR (Camposanto del Alba y Aeródromo), EDAD DE LA FAMILIA Y ÁRBOL GENEALÓGICO =================
// - El mapa del principio crece: al sur de Albor (entre los dos muelles) el mar se vuelve tierra nueva. Se añade al final
//   de buildWorld (envoltura de makeCamps), así no cambia ni un árbol ni una roca del resto del mundo.
// - Camposanto del Alba: tributo a los caídos (monumento, tumbas, cuidadora) y tumbas de tus descendientes fallecidos.
// - Aeródromo de Albor: pista, terminal, torre, hangar y 4 aviones que aterrizan, embarcan y despegan solos (reloj real,
//   igual para todos), con pasajeros que entran y salen. Dentro: viajeros de muchos países, billete y vuelo a Japón (nv. 400).
// - Familia: los descendientes cumplen años, se jubilan a los 65 y mueren de viejos (82-98 años, despacio: ~8 h de juego).
//   Árbol genealógico con todas las generaciones.
SAVEKEYS.push('fallen', 'aeTk', 'cmDay', 'cmFl', 'jp');

// ---------- utilidades de dibujo: lienzo, glifos (carteles) y dibujos ordenados con el mundo ----------
const XC = (w, h) => { const c = mkCanvas(w, h); return [c, c.getContext('2d')]; };
// texto en píxeles con los glifos de JPG (kanji, kana y letras); vertical = de arriba abajo
function jpText(g, s, x, y, col, size, vert, sc) { size = size || 10; sc = sc || 1; const G_ = JPG[size] || JPG[10]; let ox = 0, oy = 0; g.fillStyle = col;
  for (const ch of String(s).toUpperCase().replace(/Ü/g, 'U')) { const gl = G_[ch] || G_[ch.toUpperCase()]; if (!gl) { if (vert) oy += (size >> 1) * sc; else ox += (size >> 1) * sc; continue; }
    const [w, rows] = gl, R = rows.split('.'); for (let r = 0; r < R.length; r++) { const v = parseInt(R[r], 16); if (!v) continue; for (let b = 0; b < w; b++) if (v & (1 << (w - 1 - b))) g.fillRect(x + ox + b * sc, y + oy + r * sc, sc, sc); }
    if (vert) oy += (size + 1) * sc; else ox += (w + 1) * sc; }
  return vert ? oy : ox; }
function jpW(s, size) { size = size || 10; const G_ = JPG[size] || JPG[10]; let w = 0; for (const ch of String(s).toUpperCase()) { const gl = G_[ch]; w += (gl ? gl[0] : size >> 1) + 1; } return w - 1; }
// sprites propios: XSPR[clave] = () => { c, ax, ay } (se guardan en la caché de muebles)
const XSPR = {};
{ const _g2 = genFurn2; genFurn2 = function (kind) { const f = XSPR[kind]; if (f) { try { return f(); } catch (e) { console.warn(kind, e); } } return _g2.apply(this, arguments); }; }
// dibujos que se ordenan con el resto (aviones, coches, pasajeros): DL_HOOKS[i](lista, cx, cy) empuja {type:'xdraw', x, y, draw}
const DL_HOOKS = [];
{ const _p = drawList.push; drawList.push = function (x) { if (x === G.P && arguments.length === 1 && DL_HOOKS.length) { const cx = Math.round(G.cam.x), cy = Math.round(G.cam.y); for (const f of DL_HOOKS) try { f(drawList, cx, cy); } catch (e) { console.warn(e); } } return _p.apply(this, arguments); }; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e && e.type === 'xdraw') { try { e.draw(e, cx, cy); } catch (er) { } return; } return _de.apply(this, arguments); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl.apply(this, arguments); for (const d of list) if (d && d.type === 'xdraw' && d.light) out.push(d.light); return out; }; }
// mensaje sencillo
function xMsg(title, html, btns) { openModal(`<h2>${title}</h2><div style="line-height:1.45">${html}</div><div class="row" style="margin-top:.6em;gap:.4em;display:flex;flex-wrap:wrap">${(btns || []).map((b, i) => `<button class="btn" data-xb="${i}">${b[0]}</button>`).join('')}<button class="btn" data-xb="x">${L2('Cerrar', 'Close')}</button></div>`);
  $$('#modal [data-xb]').forEach(b => b.onclick = () => { const i = b.dataset.xb; if (i === 'x') { closeModal(); return; } const f = btns[+i][1]; closeModal(); f(); }); }
// pasajeros y transeúntes con dibujo de héroe (solo reposo y caminata, para que cueste poco)
const XW_APPS = [];
function xwAtlas(i, apps) { apps = apps || XW_APPS; const D = apps[i % apps.length]; return getAtlas('XW' + (apps.tag || '') + (i % apps.length), () => { const L = heroLook('guerrero', D[0], { weapon: 0 }, D[1] || {}, {}); L.weapon = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); }
function xwDraw(w, cx, cy) { const A = w.A; if (!A) return; const walk = w.mv, a = walk ? 'walk' : 'idle', n = ANIMS[a][1], f = walk ? Math.floor(G.t * 7 + w.ph) % n : 0;
  const col = A.idx[a] + f, row = DIRI[w.dir] || 0; const x = Math.round(w.x - A.ax - cx), y = Math.round(w.y - A.ay - cy);
  ctx.drawImage(shadowSprite(6, 2), Math.round(w.x - cx - 7), Math.round(w.y - cy - 3)); atlasBlit(ctx, A, col, row, x, y, A.fw, A.fh);
  if (w.bag) { const bx = Math.round(w.x - cx + (w.dir === 'left' ? 6 : w.dir === 'right' ? -10 : 6)), by = Math.round(w.y - cy - 9); ctx.fillStyle = '#1a1420'; ctx.fillRect(bx - 1, by - 1, 6, 10); ctx.fillStyle = w.bag; ctx.fillRect(bx, by, 4, 8); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(bx, by, 1, 8); ctx.fillStyle = '#888'; ctx.fillRect(bx + 1, by - 3, 2, 3); } }
{ const sk = [0, 1, 2, 3, 4, 5], hr = ['negro', 'castano', 'rubio', 'rojo', 'platino', 'cobre', 'blanco', 'gris'], top = [0, 1, 2, 3, 5], cl = ['azul', 'rojo', 'verde', 'negro', 'blanco', 'amarillo', 'morado', 'naranja', 'gris', 'rosa'];
  for (let i = 0; i < 14; i++) { const g = i % 2 ? 'm' : 'f', H = g === 'm' ? HS_M : HS_F; XW_APPS.push([{ g, skin: sk[(i * 5) % 6], hair: hr[(i * 3) % hr.length], hs: (i * 7) % H.length, eyes: pick(['cafe', 'azul', 'verde', 'gris']), top: [top[i % top.length], cl[(i * 3) % cl.length]], bot: [g === 'f' ? [0, 2][i % 2] : 0, cl[(i * 7 + 2) % cl.length]], shoe: [1, 'negro'], bt: i % 4 }, {}]); } }

// ---------- tierra nueva al sur de Albor ----------
const SA = { x0: 46, x1: 110, y0: 186, y1: 229, road: 97, cross: 205,
  cem: { x0: 50, x1: 68, y0: 190, y1: 203, gate: 59 },
  term: { x: 72, y: 199, w: 19, h: 4, door: 81 }, tower: [94, 202], hangar: { x: 100, y: 197, w: 9, h: 6 },
  park: { x0: 70, x1: 92, y0: 207, y1: 210 }, apron: { x0: 54, x1: 108, y0: 212, y1: 216 }, run: { x0: 50, x1: 109, y0: 219, y1: 222 }, taxiE: 105, taxiW: 55 };
function saLand(x, y) { if (x < SA.x0 || x > SA.x1 || y < SA.y0 || y > SA.y1) return false; const n = (hash2(x >> 1, y >> 1, 811) * 2.2) | 0, m = (hash2(y >> 1, x >> 2, 812) * 2.2) | 0;
  return x - SA.x0 >= n && SA.x1 - x >= m && SA.y1 - y >= ((hash2(x >> 2, 9, 813) * 2.5) | 0); }
const saIn = (r, x, y) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
function saExpand(W) {
  const I = W.I, ok = (x, y) => W.inb(x, y);
  // quitar lo que hubiera en una casilla (por el camino que baja de Albor)
  const clear = (x, y) => { const i = I(x, y), oi = W.objAt[i]; if (oi >= 0) { const o = W.objs[oi]; if (!o.xact && o.k !== 'bld') { o.hidden = true; for (const [dx, dy] of o.fp || [[0, 0]]) { const j = I(o.tx + dx, o.ty + dy); if (W.objAt[j] === oi) { W.objAt[j] = -1; W.solidO[j] = 0; } } } } };
  for (let y = SA.y0 - 2; y <= SA.y1; y++) for (let x = SA.x0; x <= SA.x1; x++) { if (!ok(x, y) || !saLand(x, y)) continue; const i = I(x, y);
    if (W.objAt[i] >= 0 && W.land[i]) continue;   // la costa que ya existía (vías del tren) se queda igual
    W.land[i] = 1; W.lvl[i] = 0; W.reg[i] = RI.valle; W.townAt[i] = -1; W.flags[i] = (W.flags[i] & 64) | 4; W.ter[i] = T.GRASS; if (W.riverMask) W.riverMask[i] = 0; }
  // playa alrededor
  for (let y = SA.y0; y <= SA.y1 + 1; y++) for (let x = SA.x0 - 1; x <= SA.x1 + 1; x++) { if (!ok(x, y)) continue; const i = I(x, y); if (W.ter[i] !== T.GRASS || !saLand(x, y)) continue;
    let near = false; for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) { if (!ok(x + dx, y + dy)) continue; if (!W.land[I(x + dx, y + dy)]) { near = Math.max(Math.abs(dx), Math.abs(dy)) <= (hash2(x, y, 4) < 0.4 ? 1 : 2); break; } }
    if (near) W.ter[i] = T.SAND; }
  // agua: profundidad cerca de la costa nueva
  { const N = W.w * W.h, q = []; for (let i = 0; i < N; i++) { if (!WATERY[W.ter[i]] && W.ter[i] !== T.LAVA) { W.wdist[i] = 0; q.push(i); } else W.wdist[i] = 255; }
    let qi = 0; while (qi < q.length) { const c = q[qi++], cx = c % W.w, cy = (c / W.w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (!ok(nx, ny)) continue; const j = I(nx, ny); if (W.wdist[j] > W.wdist[c] + 1) { W.wdist[j] = W.wdist[c] + 1; q.push(j); } } }
    for (let y = SA.y0 - 8; y <= SA.y1 + 8; y++) for (let x = SA.x0 - 8; x <= SA.x1 + 8; x++) { if (!ok(x, y)) continue; const i = I(x, y); if (W.ter[i] === T.DEEP && W.wdist[i] <= 3) W.ter[i] = T.WATER; } }
  // caminos: desde la salida sur de Albor hasta el aeródromo, y el cruce
  const road = (x, y) => { if (!ok(x, y)) return; const i = I(x, y); if (W.rail && W.rail[i]) return; if (W.ter[i] === T.BRIDGE || WATERY[W.ter[i]] || W.ter[i] === T.FACE) return; clear(x, y); W.ter[i] = T.COBBLE; W.flags[i] |= 1 | 4; };
  for (let y = 166; y <= SA.cross + 1; y++) for (const x of [SA.road, SA.road + 1]) { const i = I(x, y); if (W.ter[i] === T.FACE || W.ter[i] === T.FALL) W.ter[i] = T.STAIRS; road(x, y); }
  for (let x = SA.cem.gate - 1; x <= 108; x++) for (const y of [SA.cross, SA.cross + 1]) road(x, y);
  for (let y = SA.cem.y0 + 1; y < SA.cross; y++) road(SA.cem.gate, y);
  for (let x = SA.park.x0; x <= SA.park.x1; x++) for (let y = SA.term.y + SA.term.h; y <= SA.park.y1; y++) road(x, y);
  for (let x = 91; x <= 93; x++) for (let y = SA.park.y1 + 1; y < SA.apron.y0; y++) road(x, y);
  // pista, plataforma y rodaduras (se pintan como asfalto en saDecorate)
  const asph = (x, y) => { if (!ok(x, y)) return; const i = I(x, y); W.ter[i] = T.STONE; W.flags[i] |= 16 | 4; };
  for (let y = SA.apron.y0; y <= SA.apron.y1; y++) for (let x = SA.apron.x0; x <= SA.apron.x1; x++) asph(x, y);
  for (let y = SA.run.y0; y <= SA.run.y1; y++) for (let x = SA.run.x0; x <= SA.run.x1; x++) asph(x, y);
  for (const tx of [SA.taxiE, SA.taxiW]) for (let y = SA.apron.y1; y <= SA.run.y0; y++) for (let x = tx - 1; x <= tx + 1; x++) asph(x, y);
  // objetos
  const F = (f, x, y, fp, o) => addObj(W, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const rect = (w, h) => { const a = []; for (let y = -h + 1; y <= 0; y++) for (let x = 0; x < w; x++) a.push([x, y]); return a; };
  // camposanto
  const C0 = SA.cem; for (let x = C0.x0; x <= C0.x1; x++) { addObj(W, 'fence', x, C0.y0, { o: 'h' }); if (Math.abs(x - C0.gate) > 1) addObj(W, 'fence', x, C0.y1, { o: 'h' }); }
  for (let y = C0.y0 + 1; y < C0.y1; y++) { addObj(W, 'fence', C0.x0, y, { o: 'v' }); addObj(W, 'fence', C0.x1, y, { o: 'v' }); }
  F('cm_portico', C0.gate, C0.y1 + 1, [[-2, 0], [2, 0]], { solid: true });
  F('cm_monumento', C0.gate, C0.y0 + 4, [[-1, 0], [0, 0], [1, 0]], { xact: 'cm_tributo' });
  F('cm_mausoleo', C0.x1 - 3, C0.y0 + 3, rect(3, 2));
  for (const [x, y] of [[C0.x0 + 1, C0.y0 + 1], [C0.x1 - 1, C0.y0 + 1], [C0.x0 + 1, C0.y1 - 1], [C0.x1 - 1, C0.y1 - 1], [C0.x0 + 1, C0.y0 + 7], [C0.x1 - 1, C0.y0 + 7]]) F('cm_cipres', x, y);
  let gi = 0; for (const y of [C0.y0 + 3, C0.y0 + 5]) for (const x of [C0.x0 + 2, C0.x0 + 4, C0.x0 + 6, C0.x1 - 2, C0.x1 - 4, C0.x1 - 6]) { if (y === C0.y0 + 3 && x > C0.gate) continue; F('cm_lapida' + (gi % 4), x, y, null, { xact: 'cm_caido', gi: gi++ }); }
  SA.famG = []; for (const y of [C0.y0 + 8, C0.y0 + 11]) for (const x of [C0.x0 + 2, C0.x0 + 4, C0.x0 + 6, C0.x1 - 2, C0.x1 - 4, C0.x1 - 6]) SA.famG.push(F('cm_tumba_fam', x, y, null, { xact: 'cm_fam', hidden: true, solid: false }));
  F('cm_velas', C0.gate - 2, C0.y0 + 5, null, { solid: false }); F('cm_velas', C0.gate + 2, C0.y0 + 5, null, { solid: false }); F('cm_flores', C0.gate - 1, C0.y0 + 6, null, { solid: false }); F('cm_flores', C0.gate + 1, C0.y0 + 6, null, { solid: false });
  addObj(W, 'bench', C0.gate - 3, C0.y1 - 2); addObj(W, 'bench', C0.gate + 3, C0.y1 - 2); addObj(W, 'lantern', C0.gate - 1, C0.y1 - 1, { kind: 'iron' }); addObj(W, 'lantern', C0.gate + 1, C0.y1 - 1, { kind: 'iron' });
  W.npcDefs.push({ id: 'cm_cuidadora', x: C0.gate + 2, y: C0.y1 - 3, wander: 2 });
  // aeródromo
  const TM = SA.term; F('ae_terminal', TM.x, TM.y + TM.h - 1, rect(TM.w, TM.h).filter(([x, y]) => !(x === TM.door - TM.x && y === 0)), { px: TM.x * 16 + TM.w * 8, py: (TM.y + TM.h) * 16 - 1 });
  F('ae_puerta', TM.door, TM.y + TM.h, null, { solid: false, xact: 'ae_entrar' });
  F('ae_torre', SA.tower[0], SA.tower[1], rect(2, 2), { px: SA.tower[0] * 16 + 16, py: (SA.tower[1] + 1) * 16 - 1 });
  const HG = SA.hangar; F('ae_hangar', HG.x, HG.y + HG.h - 1, rect(HG.w, HG.h), { px: HG.x * 16 + HG.w * 8, py: (HG.y + HG.h) * 16 - 1 });
  F('ae_cartel', SA.road - 2, 190, [[0, 0]], {}); F('ae_cartel', TM.x - 2, SA.cross - 1, [[0, 0]], {});
  for (let x = SA.park.x0; x <= SA.park.x1; x += 3) if (Math.abs(x - TM.door) > 2) F('ae_farola', x, TM.y + TM.h + 1, null, {});
  for (const [x, y, c] of [[72, 209, 0], [74, 209, 1], [77, 209, 2], [86, 209, 3], [89, 209, 4], [84, 209, 1]]) F('ae_coche' + c, x, y, [[0, 0], [1, 0]], {});
  F('ae_bus', 79, SA.park.y1, [[0, 0], [1, 0], [2, 0]], {});
  for (let x = SA.apron.x0; x <= SA.apron.x1; x++) if (x < 90 || x > 94) F('ae_valla', x, SA.apron.y0 - 1, null, {});
  for (const x of [58, 66, 100]) F('ae_bandera', x, SA.cross - 1, null, {});
  F('ae_escalera', 84, SA.apron.y0 + 1, null, { solid: false }); F('ae_escalera', 98, SA.apron.y0 + 1, null, { solid: false });
  for (let x = SA.run.x0; x <= SA.run.x1; x += 6) { F('ae_luz', x, SA.run.y0 - 1, null, { solid: false }); F('ae_luz', x, SA.run.y1 + 1, null, { solid: false }); }
  // árboles y flores
  const R = new RNG(SEED + 4811); for (let k = 0; k < 160; k++) { const x = R.int(SA.x0 + 2, SA.x1 - 2), y = R.int(SA.y0 + 2, SA.y1 - 2), i = I(x, y); if (W.ter[i] !== T.GRASS || W.objAt[i] >= 0 || saIn(SA.cem, x, y) || saIn({ x0: 52, x1: 110, y0: 195, y1: 224 }, x, y)) continue; if (W.flags[i] & 1) continue;
    const r = R.f(); if (r < 0.55) addObj(W, 'tree', x, y, { sp: r < 0.15 ? 'cerezo' : 'roble', v: R.int(0, 3) }); else if (r < 0.8) addObj(W, 'bush', x, y, { kind: R.f() < 0.3 ? 'berry' : '', v: R.int(0, 3) }); else addObj(W, 'herb', x, y, { tier: 1, solid: false }); }
}
{ const _mc = makeCamps; makeCamps = function (W) { const r = _mc.apply(this, arguments); try { if (W && W.isWorld && !W.saDone) { W.saDone = 1; saExpand(W); } } catch (e) { console.warn('saExpand', e); } return r; }; }
// asfalto de la pista y la plataforma (encima del suelo de piedra)
{ const _dw = decorateWorld; decorateWorld = function (M) { _dw.apply(this, arguments); const d0 = M.decorate; M.decorate = (x, cx, cy) => { d0(x, cx, cy); try { saDecorate(M, x, cx, cy); } catch (e) { } }; }; }
function saDecorate(M, g, cx, cy) {
  const X0 = cx * CH, Y0 = cy * CH; if (X0 > SA.x1 + 1 || X0 + CH < SA.x0 || Y0 > SA.y1 + 1 || Y0 + CH < SA.apron.y0 - 1) return;
  for (let ty = Y0; ty < Y0 + CH; ty++) for (let tx = X0; tx < X0 + CH; tx++) { const i = tileAt(M, tx, ty); if (i < 0 || M.ter[i] !== T.STONE || !saIn({ x0: SA.x0, x1: SA.x1, y0: SA.apron.y0, y1: SA.run.y1 }, tx, ty)) continue;
    const x = tx * 16 - cx * CHP, y = ty * 16 - cy * CHP, h = hash2(tx, ty, 61); g.fillStyle = h < 0.5 ? '#3a3e46' : '#40444c'; g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(x + ((h * 97) | 0) % 14, y + ((h * 53) | 0) % 14, 2, 1);
    const rn = saIn(SA.run, tx, ty);
    if (rn) { if (ty === SA.run.y0) { g.fillStyle = '#e8e8e8'; g.fillRect(x, y + 1, 16, 1); } if (ty === SA.run.y1) { g.fillStyle = '#e8e8e8'; g.fillRect(x, y + 14, 16, 1); }
      if (ty === SA.run.y0 + 1 && tx % 3 === 0 && tx > SA.run.x0 + 4 && tx < SA.run.x1 - 4) { g.fillStyle = '#f4f4f4'; g.fillRect(x + 2, y + 15, 12, 2); }
      if (tx <= SA.run.x0 + 2 || tx >= SA.run.x1 - 2) { g.fillStyle = '#f0f0f0'; for (let k = 2; k < 16; k += 4) g.fillRect(x + 4, y + k, 8, 2); }
    }
    else { if (ty === SA.apron.y0 + 2 && (tx === 84 || tx === 98)) { g.fillStyle = '#ffd040'; g.fillRect(x, y + 7, 16, 2); }
      if (tx === SA.taxiE || tx === SA.taxiW) { g.fillStyle = '#ffd040'; g.fillRect(x + 7, y, 2, 16); } if (ty === SA.apron.y0 + 2 && tx > SA.taxiW && tx < SA.taxiE && tx % 2) { g.fillStyle = '#d8b030'; g.fillRect(x, y + 7, 8, 2); } } }
}

// ---------- dibujos del camposanto ----------
function xPix(w, h, fn) { const p = new Pix(w, h); fn(p); p.outline(OUTL); return p.canvas(); }
const CM_ST = P5(['#3a3c44', '#5a5c66', '#7c7e88', '#a2a4ae', '#cacdd6']), CM_MOSS = C('#4a7a3a');
for (let v = 0; v < 4; v++) XSPR['cm_lapida' + v] = () => ({ c: xPix(16, 22, p => { const S = CM_ST;
  if (v === 0) { p.rect(3, 6, 10, 14, S[2]); p.ell(8, 7, 5, 4, S[2]); p.rect(4, 6, 2, 13, S[3]); p.rect(11, 7, 1, 12, S[1]); p.hl(5, 10, 6, S[1]); p.hl(5, 12, 6, S[1]); }
  else if (v === 1) { p.rect(6, 2, 4, 18, S[2]); p.rect(2, 6, 12, 4, S[2]); p.vl(6, 2, 18, S[3]); p.hl(2, 6, 12, S[3]); p.vl(9, 3, 17, S[1]); }
  else if (v === 2) { p.rect(2, 9, 12, 11, S[2]); p.rect(3, 9, 2, 11, S[3]); p.poly([[2, 9], [8, 3], [14, 9]], S[3]); p.hl(4, 13, 8, S[1]); }
  else { p.rect(4, 4, 8, 16, S[2]); p.rect(5, 4, 2, 16, S[3]); p.rect(3, 2, 10, 3, S[1]); p.set(8, 9, CM_MOSS); }
  p.rect(1, 19, 14, 3, S[1]); p.hl(1, 19, 14, S[3]); p.set(3 + v, 20, CM_MOSS); p.set(12 - v, 18, CM_MOSS); }), ax: 8, ay: 21 });
XSPR.cm_tumba_fam = () => ({ c: xPix(18, 24, p => { const S = CM_ST; p.rect(3, 4, 12, 15, S[3]); p.ell(9, 5, 6, 4, S[3]); p.rect(4, 4, 2, 14, S[4]); p.rect(13, 5, 1, 13, S[2]);
  p.hl(6, 9, 6, S[1]); p.hl(6, 11, 6, S[1]); p.hl(7, 13, 4, S[1]); p.rect(1, 18, 16, 6, S[1]); p.rect(2, 19, 14, 4, C('#4a7a3a'));
  for (let i = 0; i < 6; i++) p.set(3 + i * 2, 19 + (i % 2), [C('#ff6a8a'), C('#ffd040'), C('#ffffff')][i % 3]); }), ax: 9, ay: 23 });
XSPR.cm_monumento = () => ({ c: xPix(40, 70, p => { const S = CM_ST, Au = C('#e8c050');
  p.rect(4, 56, 32, 12, S[1]); p.rect(6, 52, 28, 6, S[2]); p.hl(6, 52, 28, S[3]); p.rect(12, 14, 16, 40, S[2]); p.rect(12, 14, 4, 40, S[3]); p.rect(25, 14, 3, 40, S[1]);
  p.poly([[12, 14], [20, 2], [28, 14]], S[3]); p.poly([[20, 2], [28, 14], [21, 14]], S[2]);
  p.ell(20, 30, 6, 6, Au); p.ell(20, 30, 4, 4, S[2]); for (let a = 0; a < 8; a++) { const t = a / 8 * 6.28; p.set(Math.round(20 + Math.cos(t) * 8), Math.round(30 + Math.sin(t) * 8), C('#5aa04a')); }
  p.hl(14, 42, 12, Au); p.hl(15, 45, 10, S[4]); p.hl(16, 47, 8, S[4]); for (let x = 8; x < 33; x += 4) p.set(x, 60, S[3]); }), ax: 20, ay: 69 });
XSPR.cm_mausoleo = () => ({ c: xPix(50, 52, p => { const S = CM_ST; p.rect(3, 20, 44, 30, S[2]); p.rect(3, 20, 44, 3, S[3]); p.poly([[0, 21], [25, 6], [50, 21]], S[1]); p.poly([[5, 20], [25, 9], [45, 20]], S[3]);
  for (const x of [6, 14, 33, 41]) { p.rect(x, 23, 3, 26, S[4]); p.vl(x + 2, 23, 26, S[2]); } p.rect(20, 28, 10, 21, C('#1a1820')); p.ell(25, 28, 5, 4, C('#1a1820')); p.rect(21, 30, 8, 2, C('#2a2830')); p.set(25, 14, C('#e8c050')); p.rect(0, 48, 50, 4, S[1]); }), ax: 25, ay: 51 });
XSPR.cm_cipres = () => ({ c: xPix(16, 44, p => { const G1 = C('#1e3a24'), G2 = C('#2a5230'), G3 = C('#3a6e3e'); p.rect(7, 38, 3, 6, C('#4a3020'));
  for (let y = 2; y < 40; y++) { const w = Math.round(Math.sin((y - 2) / 38 * Math.PI) * 6 + 1); for (let x = 8 - w; x <= 8 + w; x++) p.set(x, y, x < 8 - w + 2 ? G3 : x > 8 + w - 2 ? G1 : G2); } for (let y = 6; y < 38; y += 5) p.set(6 + (y % 3), y, G3); }), ax: 8, ay: 43 });
XSPR.cm_velas = () => ({ c: xPix(14, 12, p => { for (const [x, h] of [[2, 7], [6, 5], [10, 6]]) { p.rect(x, 11 - h, 2, h, C('#f4ecd8')); p.set(x, 10 - h, C('#ffd040')); p.set(x, 9 - h, C('#ff8a30')); } }), ax: 7, ay: 11 });
XSPR.cm_flores = () => ({ c: xPix(12, 10, p => { p.rect(3, 6, 6, 4, C('#7a5030')); for (const [x, y, c] of [[3, 4, '#ff5a7a'], [6, 3, '#ffffff'], [8, 4, '#ffd040'], [5, 5, '#c070ff']]) { p.set(x, y, C(c)); p.set(x, y + 1, C('#3a7a2a')); } }), ax: 6, ay: 9 });
XSPR.cm_portico = () => { const [c, g] = XC(80, 52); const S = ['#2a2c34', '#4a4c56', '#6e707a', '#9a9ca6'];
  g.fillStyle = S[1]; g.fillRect(4, 10, 10, 42); g.fillRect(66, 10, 10, 42); g.fillStyle = S[2]; g.fillRect(6, 10, 4, 42); g.fillRect(68, 10, 4, 42);
  g.fillStyle = S[0]; g.fillRect(0, 2, 80, 10); g.fillStyle = S[2]; g.fillRect(2, 3, 76, 7); g.fillStyle = S[3]; g.fillRect(2, 3, 76, 1);
  g.fillStyle = '#1a1820'; g.fillRect(14, 12, 52, 2); for (let x = 16; x < 66; x += 5) { g.fillRect(x, 14, 1, 14); } g.fillRect(14, 27, 52, 1);
  jpText(g, 'CAMPOSANTO DEL ALBA', 40 - (jpW('CAMPOSANTO DEL ALBA', 10) >> 1), 2, '#e8d8a0', 10); return { c, ax: 40, ay: 51 }; };

// ---------- dibujos del aeródromo ----------
XSPR.ae_terminal = () => { const W = 19 * 16, H = 124, [c, g] = XC(W, H);
  const base = H - 64; g.fillStyle = '#c8ccd4'; g.fillRect(0, base - 6, W, 70); g.fillStyle = '#a8adb8'; g.fillRect(0, H - 8, W, 8);
  // fachada de cristal en dos pisos
  for (let fl = 0; fl < 2; fl++) { const y0 = base + 2 + fl * 26; g.fillStyle = '#2a4a6a'; g.fillRect(6, y0, W - 12, 22); const gr = g.createLinearGradient(0, y0, 0, y0 + 22); gr.addColorStop(0, 'rgba(160,210,255,0.55)'); gr.addColorStop(1, 'rgba(40,80,130,0.2)'); g.fillStyle = gr; g.fillRect(6, y0, W - 12, 22);
    g.fillStyle = '#e4e8ee'; for (let x = 6; x < W - 6; x += 16) g.fillRect(x, y0, 2, 22); g.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 10; x < W - 10; x += 32) { g.fillRect(x, y0 + 2, 1, 8); g.fillRect(x + 1, y0 + 2, 1, 4); } }
  // tejado curvo con alero
  g.fillStyle = '#7a8494'; g.beginPath(); g.moveTo(-2, base - 4); g.quadraticCurveTo(W / 2, base - 52, W + 2, base - 4); g.lineTo(W + 2, base + 2); g.lineTo(-2, base + 2); g.fill();
  g.fillStyle = '#9aa4b4'; g.beginPath(); g.moveTo(4, base - 4); g.quadraticCurveTo(W / 2, base - 46, W - 4, base - 4); g.lineTo(W - 4, base - 1); g.quadraticCurveTo(W / 2, base - 42, 4, base - 1); g.fill();
  g.fillStyle = '#5a6474'; g.fillRect(0, base - 1, W, 3); g.fillStyle = '#e8ecf2'; g.fillRect(0, base - 2, W, 1);
  // entrada
  const dx = (SA.term.door - SA.term.x) * 16; g.fillStyle = '#e8ecf2'; g.fillRect(dx - 14, base + 26, 44, 38); g.fillStyle = '#1e3450'; g.fillRect(dx - 8, H - 34, 32, 26); g.fillStyle = 'rgba(160,210,255,0.4)'; g.fillRect(dx - 8, H - 34, 15, 26); g.fillRect(dx + 9, H - 34, 15, 26);
  g.fillStyle = '#ffd040'; g.fillRect(dx - 14, base + 26, 44, 3);
  const s = 'AERÓDROMO DE ALBOR'; g.fillStyle = '#1a2a40'; g.fillRect(W / 2 - jpW(s, 12) / 2 - 4, base - 20, jpW(s, 12) + 8, 15); jpText(g, s, Math.round(W / 2 - jpW(s, 12) / 2), base - 19, '#ffe8a0', 12);
  for (const x of [20, W - 30]) { g.fillStyle = '#3a4a5a'; g.fillRect(x, H - 30, 10, 22); g.fillStyle = '#5ad0ff'; g.fillRect(x + 2, H - 28, 6, 6); }
  return { c, ax: W / 2, ay: H - 1 }; };
XSPR.ae_torre = () => { const [c, g] = XC(36, 140); g.fillStyle = '#b8bcc6'; g.fillRect(12, 40, 12, 100); g.fillStyle = '#d8dce4'; g.fillRect(12, 40, 4, 100); g.fillStyle = '#8a8e98'; g.fillRect(22, 40, 2, 100);
  for (let y = 50; y < 136; y += 12) { g.fillStyle = '#5ad0ff'; g.fillRect(16, y, 4, 4); }
  g.fillStyle = '#6a7484'; g.beginPath(); g.moveTo(2, 40); g.lineTo(34, 40); g.lineTo(30, 26); g.lineTo(6, 26); g.fill(); g.fillStyle = '#1e3450'; g.fillRect(5, 16, 26, 11); g.fillStyle = 'rgba(160,220,255,0.6)'; for (let x = 6; x < 30; x += 6) g.fillRect(x, 17, 4, 9);
  g.fillStyle = '#4a5464'; g.fillRect(3, 12, 30, 5); g.fillStyle = '#9aa4b4'; g.fillRect(17, 2, 2, 10); g.fillStyle = '#ff3a3a'; g.fillRect(16, 0, 4, 3); return { c, ax: 18, ay: 139, light: [18, 1] }; };
XSPR.ae_hangar = () => { const W = 9 * 16, H = 100, [c, g] = XC(W, H); g.fillStyle = '#7a8090'; g.beginPath(); g.moveTo(0, 40); g.quadraticCurveTo(W / 2, -6, W, 40); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  g.fillStyle = '#9aa0b0'; for (let x = 4; x < W; x += 8) g.fillRect(x, 20, 2, 80); g.fillStyle = '#5a606e'; g.fillRect(14, 44, W - 28, H - 44); g.fillStyle = '#2a2e38'; g.fillRect(20, 50, W - 40, H - 50);
  // avión guardado dentro (morro)
  g.fillStyle = '#e8ecf2'; g.beginPath(); g.ellipse(W / 2, H - 22, 26, 11, 0, 0, 7); g.fill(); g.fillStyle = '#1e3450'; g.fillRect(W / 2 - 10, H - 28, 20, 4); g.fillStyle = '#3a6ad8'; g.fillRect(W / 2 - 24, H - 18, 48, 3);
  jpText(g, 'HANGAR 1', 18, 30, '#ffd040', 10); return { c, ax: W / 2, ay: H - 1 }; };
XSPR.ae_puerta = () => { const [c] = XC(2, 2); return { c, ax: 1, ay: 1 }; };
XSPR.ae_cartel = () => { const [c, g] = XC(56, 40); g.fillStyle = '#4a3a2a'; g.fillRect(8, 20, 3, 20); g.fillRect(45, 20, 3, 20); g.fillStyle = '#1a3a6a'; g.fillRect(0, 2, 56, 20); g.fillStyle = '#e8ecf2'; g.fillRect(1, 3, 54, 1);
  jpText(g, 'AERÓDROMO', 28 - (jpW('AERÓDROMO', 10) >> 1), 5, '#ffffff', 10); g.fillStyle = '#ffd040'; g.beginPath(); g.moveTo(30, 16); g.lineTo(40, 18); g.lineTo(30, 20); g.fill(); g.fillRect(18, 17, 12, 2); return { c, ax: 28, ay: 39 }; };
XSPR.ae_farola = () => { const [c, g] = XC(14, 44); g.fillStyle = '#3a3e48'; g.fillRect(6, 6, 2, 38); g.fillRect(6, 4, 7, 2); g.fillStyle = '#fff4c0'; g.fillRect(10, 6, 4, 2); g.fillStyle = '#2a2e38'; g.fillRect(4, 41, 6, 3); return { c, ax: 7, ay: 43, light: [12, 7] }; };
XSPR.ae_bandera = () => { const [c, g] = XC(22, 50); g.fillStyle = '#c8ccd4'; g.fillRect(2, 2, 2, 48); const cols = ['#c8102e', '#ffd040', '#c8102e']; for (let i = 0; i < 3; i++) { g.fillStyle = cols[i]; g.fillRect(4, 4 + i * 4, 16, 4); } return { c, ax: 3, ay: 49 }; };
XSPR.ae_valla = () => { const [c, g] = XC(16, 16); g.fillStyle = '#8a909c'; g.fillRect(0, 4, 16, 1); g.fillRect(0, 9, 16, 1); g.fillRect(0, 14, 16, 1); g.fillStyle = '#6a707c'; g.fillRect(1, 2, 2, 14); g.fillStyle = 'rgba(160,170,180,0.6)'; for (let x = 0; x < 16; x += 2) g.fillRect(x, 4, 1, 10); return { c, ax: 8, ay: 15 }; };
XSPR.ae_escalera = () => { const [c, g] = XC(22, 26); g.fillStyle = '#e8ecf2'; g.fillRect(2, 18, 18, 6); g.fillStyle = '#2a2e38'; g.fillRect(3, 23, 4, 3); g.fillRect(15, 23, 4, 3); g.fillStyle = '#b8bcc6'; for (let k = 0; k < 6; k++) g.fillRect(6 + k * 2, 16 - k * 2, 6, 2); g.fillStyle = '#ffd040'; g.fillRect(2, 18, 18, 1); return { c, ax: 11, ay: 25 }; };
XSPR.ae_luz = () => { const [c, g] = XC(6, 6); g.fillStyle = '#2a2e38'; g.fillRect(1, 3, 4, 3); g.fillStyle = '#7ad8ff'; g.fillRect(2, 1, 2, 2); return { c, ax: 3, ay: 5, light: [3, 1] }; };
const XCAR_COL = ['#e8ecf2', '#c8102e', '#1a1c24', '#2a5ad8', '#ffd040', '#3aa04a', '#8a8e98'];
function carSprite(col, dir) { const hz = dir === 'left' || dir === 'right', [c, g] = hz ? XC(34, 22) : XC(20, 32), dk = uMulH(col, 0.7);
  if (hz) { g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(2, 17, 30, 4); g.fillStyle = col; g.fillRect(1, 8, 32, 10); g.fillStyle = dk; g.fillRect(1, 16, 32, 2); g.fillStyle = col; g.fillRect(7, 2, 19, 8); g.fillStyle = '#1e3450'; g.fillRect(9, 3, 7, 6); g.fillRect(17, 3, 7, 6); g.fillStyle = 'rgba(180,220,255,0.6)'; g.fillRect(9, 3, 2, 3); g.fillRect(17, 3, 2, 3);
    g.fillStyle = '#121216'; g.fillRect(4, 15, 7, 6); g.fillRect(23, 15, 7, 6); g.fillStyle = '#8a8e98'; g.fillRect(6, 17, 3, 2); g.fillRect(25, 17, 3, 2); const front = dir === 'right' ? 31 : 1; g.fillStyle = '#fff4c0'; g.fillRect(front, 10, 2, 3); g.fillStyle = '#ff3a3a'; g.fillRect(dir === 'right' ? 1 : 31, 10, 2, 3);
    g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(2, 8, 30, 1); }
  else { g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(2, 27, 16, 4); g.fillStyle = col; g.fillRect(2, 3, 16, 26); g.fillStyle = dk; g.fillRect(2, 26, 16, 3); g.fillStyle = '#121216'; g.fillRect(0, 6, 3, 6); g.fillRect(17, 6, 3, 6); g.fillRect(0, 19, 3, 6); g.fillRect(17, 19, 3, 6);
    const up = dir === 'up'; g.fillStyle = '#1e3450'; g.fillRect(4, up ? 7 : 16, 12, 6); g.fillStyle = 'rgba(180,220,255,0.55)'; g.fillRect(5, up ? 8 : 17, 4, 2); g.fillStyle = col; g.fillRect(4, 13, 12, 3);
    g.fillStyle = up ? '#fff4c0' : '#ff3a3a'; g.fillRect(4, 3, 3, 2); g.fillRect(13, 3, 3, 2); g.fillStyle = up ? '#ff3a3a' : '#fff4c0'; g.fillRect(4, 27, 3, 2); g.fillRect(13, 27, 3, 2); }
  return c; }
const uMulH = (hex, f) => { const n = parseInt(hex.slice(1), 16), r = Math.round(((n >> 16) & 255) * f), gg = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f); return '#' + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1); };
for (let i = 0; i < 5; i++) XSPR['ae_coche' + i] = () => ({ c: carSprite(XCAR_COL[i], i % 2 ? 'left' : 'right'), ax: 9, ay: 20 });
XSPR.ae_bus = () => { const [c, g] = XC(52, 30); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(2, 25, 48, 4); g.fillStyle = '#ffd040'; g.fillRect(1, 4, 50, 22); g.fillStyle = '#e0a020'; g.fillRect(1, 22, 50, 4); g.fillStyle = '#1e3450'; for (let x = 4; x < 46; x += 8) g.fillRect(x, 7, 6, 8);
  g.fillStyle = 'rgba(180,220,255,0.5)'; for (let x = 4; x < 46; x += 8) g.fillRect(x, 7, 2, 4); g.fillStyle = '#121216'; g.fillRect(6, 22, 8, 7); g.fillRect(38, 22, 8, 7); jpText(g, 'BUS', 20, 15, '#1a1c24', 10); return { c, ax: 9, ay: 29 }; };
// avión: morro a la derecha ('right'); se voltea o se gira para las otras direcciones
const PLANE_LIV = [['#e8ecf2', '#2a5ad8', '#c8102e'], ['#f4f4f4', '#c8102e', '#ffd040'], ['#e8ecf2', '#1a8a6a', '#ffd040'], ['#f0f0f4', '#6a3ac8', '#ff8ab0']];
function planeSprite(li) { return spr('xplane' + li, () => { const [b, s, t] = PLANE_LIV[li % PLANE_LIV.length], [c, g] = XC(96, 56), cy = 34;
  // ala del fondo (arriba) y estabilizador
  g.fillStyle = '#9aa0ac'; g.beginPath(); g.moveTo(50, cy - 4); g.lineTo(34, cy - 22); g.lineTo(28, cy - 22); g.lineTo(36, cy - 4); g.fill(); g.beginPath(); g.moveTo(14, cy - 3); g.lineTo(6, cy - 10); g.lineTo(3, cy - 10); g.lineTo(8, cy - 3); g.fill();
  // timón de cola
  g.fillStyle = s; g.beginPath(); g.moveTo(4, cy - 4); g.lineTo(2, cy - 22); g.lineTo(10, cy - 22); g.lineTo(20, cy - 4); g.fill(); g.fillStyle = t; g.fillRect(4, cy - 17, 6, 3);
  // fuselaje
  g.fillStyle = b; g.beginPath(); g.moveTo(4, cy - 5); g.lineTo(80, cy - 6); g.quadraticCurveTo(95, cy - 4, 95, cy + 1); g.quadraticCurveTo(94, cy + 6, 82, cy + 6); g.lineTo(8, cy + 5); g.quadraticCurveTo(2, cy + 2, 4, cy - 5); g.fill();
  g.fillStyle = uMulH(b, 0.78); g.fillRect(8, cy + 3, 76, 3); g.fillStyle = s; g.fillRect(8, cy + 1, 78, 2); g.fillStyle = '#1e3450'; for (let x = 20; x < 78; x += 4) g.fillRect(x, cy - 3, 2, 2);
  g.fillStyle = '#1e3450'; g.beginPath(); g.moveTo(86, cy - 4); g.lineTo(92, cy - 2); g.lineTo(87, cy - 1); g.fill();
  // ala de delante (abajo) con motores
  g.fillStyle = '#b8bcc6'; g.beginPath(); g.moveTo(52, cy + 4); g.lineTo(36, cy + 22); g.lineTo(28, cy + 22); g.lineTo(38, cy + 4); g.fill(); g.fillStyle = '#7a808c'; g.fillRect(30, cy + 20, 8, 2);
  for (const [ex, ey] of [[42, cy + 10], [36, cy - 12]]) { g.fillStyle = '#5a606c'; g.fillRect(ex, ey, 12, 5); g.fillStyle = '#2a2e38'; g.fillRect(ex + 10, ey, 2, 5); g.fillStyle = '#d8dce4'; g.fillRect(ex, ey, 12, 1); }
  g.fillStyle = '#d8dce4'; g.beginPath(); g.moveTo(16, cy + 4); g.lineTo(8, cy + 11); g.lineTo(5, cy + 11); g.lineTo(10, cy + 4); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(12, cy - 5, 70, 1); return { c, ax: 48, ay: cy + 6 }; }); }
// dibuja un avión en el suelo (x, y) a una altura alt mirando a dir
function drawPlane(li, x, y, alt, dir, cx, cy) { const S = planeSprite(li), sc = 1 + Math.min(0.5, alt / 300); ctx.save();
  ctx.globalAlpha = Math.max(0.15, 0.4 - alt / 600); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(Math.round(x - cx), Math.round(y - cy), 40 * (dir === 'up' || dir === 'down' ? 0.45 : 1), 10, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  ctx.translate(Math.round(x - cx), Math.round(y - cy - alt)); if (dir === 'left') ctx.scale(-1, 1); else if (dir === 'up') ctx.rotate(-Math.PI / 2); else if (dir === 'down') ctx.rotate(Math.PI / 2); ctx.scale(sc, sc);
  ctx.drawImage(S.c, -S.ax, -S.ay); ctx.restore(); }

// ---------- los aviones: un reloj de 160 s, 4 aviones desfasados 40 s (igual para todos los jugadores) ----------
const AE_T = 160, AE_N = 4;
function aeLerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
// estado de un avión en el instante t (0..160) para un aeropuerto Q: { x, y, alt, dir, ph }
function aePlane(Q, t, gate) { const ry = (Q.run.y0 + Q.run.y1 + 1) * 8, ay = (Q.apron.y0 + 2) * 16 + 8, x0 = Q.run.x0 * 16, x1 = Q.run.x1 * 16, tE = Q.taxiE * 16 + 8, tW = Q.taxiW * 16 + 8, gx = gate * 16 + 8;
  if (t < 7) { const k = t / 7; return { x: aeLerp(x0 - 520, x0 + 140, k), y: ry, alt: aeLerp(140, 0, k), dir: 'right', ph: 'land' }; }
  if (t < 18) { const k = (t - 7) / 11, e = 1 - (1 - k) * (1 - k); return { x: aeLerp(x0 + 140, tE, e), y: ry, alt: 0, dir: 'right', ph: 'roll' }; }
  if (t < 23) return { x: tE, y: aeLerp(ry, ay, (t - 18) / 5), alt: 0, dir: 'up', ph: 'taxi' };
  if (t < 28) return { x: aeLerp(tE, gx, (t - 23) / 5), y: ay, alt: 0, dir: 'left', ph: 'taxi' };
  if (t < 50) return { x: gx, y: ay, alt: 0, dir: 'left', ph: 'gate', k: (t - 28) / 22 };
  if (t < 54) return { x: aeLerp(gx, tW, (t - 50) / 4), y: ay, alt: 0, dir: 'left', ph: 'taxi' };
  if (t < 56) return { x: tW, y: aeLerp(ay, ry, (t - 54) / 2), alt: 0, dir: 'down', ph: 'taxi' };
  if (t < 64) { const k = (t - 56) / 8; return { x: aeLerp(tW, x1 - 220, k * k), y: ry, alt: 0, dir: 'right', ph: 'takeoff' }; }
  if (t < 72) { const k = (t - 64) / 8; return { x: aeLerp(x1 - 220, x1 + 520, k), y: ry, alt: aeLerp(0, 170, k * k), dir: 'right', ph: 'climb' }; }
  return null; }
const AE_Q = { albor: Object.assign({ gates: [84, 98] }, SA) };
function aeNow() { return Date.now() / 1000; }
// aviones del mapa actual como dibujos ordenados
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M) return; const Q = M.isWorld ? AE_Q.albor : M.aeQ; if (!Q) return;
  if (M.isWorld && (cx > (SA.x1 + 36) * 16 || cx + VW < (SA.x0 - 36) * 16 || cy > (SA.y1 + 12) * 16 || cy + VH < (SA.y0 - 6) * 16)) return;
  const now = aeNow();
  for (let i = 0; i < AE_N; i++) { const t = ((now + i * 40) % AE_T + AE_T) % AE_T, s = aePlane(Q, t, Q.gates[i % 2]); if (!s) continue; if (s.x < cx - 140 || s.x > cx + VW + 140) continue;
    list.push({ type: 'xdraw', x: s.x, y: s.alt > 20 ? 1e9 : s.y + 6, noShadow: true, draw: (e, cx_, cy_) => drawPlane(i + (Q.liv || 0), s.x, s.y, s.alt, s.dir, cx_, cy_), light: { x: s.x + (s.dir === 'right' ? 44 : s.dir === 'left' ? -44 : 0), y: s.y - s.alt - 4, r: 40, c: 'rgba(255,240,200,0.5)' } }); } });
// pasajeros: por tierra hacia la puerta de la terminal y, con un avión en la puerta de embarque, entre la terminal y el avión
const AE_WALK = [];
function aeWalkTick(dt, Q, mapId, apps) { const P = G.P; if (!P || !G.map || G.map.id !== mapId) { AE_WALK.length = 0; return; }
  const near = Math.abs(P.x - Q.term.door * 16) < 700 && Math.abs(P.y - Q.term.y * 16) < 500; if (!near) { AE_WALK.length = 0; return; }
  Q._sp = (Q._sp || 0) - dt; const door = [Q.term.door * 16 + 8, (Q.term.y + Q.term.h) * 16 + 6];
  if (Q._sp <= 0 && AE_WALK.length < 14) { Q._sp = 1.6 + Math.random() * 2.2; const out = Math.random() < 0.35, sx = (Q.park.x0 + Math.random() * (Q.park.x1 - Q.park.x0)) * 16, sy = (Q.park.y1 + 0.5) * 16, i = Math.floor(Math.random() * 99);
    AE_WALK.push({ x: out ? door[0] : sx, y: out ? door[1] : sy, path: out ? [[door[0], door[1] + 18], [sx, sy]] : [[sx, door[1] + 18], door], A: xwAtlas(i, apps), dir: 'up', ph: Math.random() * 4, bag: Math.random() < 0.7 ? pick(['#c8102e', '#2a5ad8', '#1a1c24', '#ffd040', '#8a5a3a']) : null, sp: 30 + Math.random() * 10, mv: 1 }); }
  // embarque
  const now = aeNow(); for (let i = 0; i < AE_N; i++) { const t = ((now + i * 40) % AE_T + AE_T) % AE_T; if (t < 29 || t > 48) continue; const gx = Q.gates[i % 2] * 16 + 8, gy = (Q.apron.y0 + 2) * 16 + 6, side = [(Q.side || 92) * 16, (Q.park.y1 + 1) * 16];
    const key = 'b' + i + Math.floor(now / 2.5); if (Q._bk === key) continue; Q._bk = key; const arriving = t < 38, j = Math.floor(Math.random() * 99);
    AE_WALK.push({ x: arriving ? gx - 10 : side[0], y: arriving ? gy : door[1] + 10, path: arriving ? [[side[0], gy], side, [side[0], door[1] + 10]] : [side, [side[0], gy], [gx - 10, gy]], A: xwAtlas(j, apps), dir: 'down', ph: Math.random() * 4, bag: Math.random() < 0.6 ? pick(['#c8102e', '#2a5ad8', '#1a1c24']) : null, sp: 34, mv: 1 }); }
  for (let k = AE_WALK.length - 1; k >= 0; k--) { const w = AE_WALK[k], tg = w.path[0]; if (!tg) { AE_WALK.splice(k, 1); continue; } const dx = tg[0] - w.x, dy = tg[1] - w.y, L = Math.hypot(dx, dy);
    if (L < 2) { w.path.shift(); continue; } const v = Math.min(L, w.sp * dt); w.x += dx / L * v; w.y += dy / L * v; w.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } }
DL_HOOKS.push((list, cx, cy) => { for (const w of AE_WALK) if (w.x > cx - 40 && w.x < cx + VW + 40 && w.y > cy - 40 && w.y < cy + VH + 60) list.push({ type: 'xdraw', x: w.x, y: w.y, noShadow: true, draw: (e, a, b) => xwDraw(w, a, b) }); });
V33_TICKS.push(dt => { const M = G.map; if (!M) return; if (M.isWorld) aeWalkTick(dt || 0, AE_Q.albor, 'world'); else if (M.aeQ) aeWalkTick(dt || 0, M.aeQ, M.id, M.aeApps); });

// ---------- el camposanto: tributo, tumbas y cuidadora ----------
NPCS.cm_cuidadora = { n: L2('Odila', 'Odila'), title: L2('Cuidadora del camposanto', 'Graveyard keeper'), look: LK({ g: 'f', hair: HAIRS.gris, hairStyle: 'long', outfit: 'robe', main: P5(['#1e1a24', '#2e2838', '#423a50', '#5a5068', '#766c86']), eyes: 'gris' }),
  lines: [L2('Aquí descansan los Vigías del Alba que cayeron defendiendo el valle, y los vecinos cuyo hilo se terminó de tejer.', 'Here rest the Dawn Watchers who fell defending the valley, and the neighbours whose thread was fully woven.'),
    L2('Los héroes se levantan al caer: su hilo llega al otro lado del cristal. Los demás, cuando el Telar termina su hilo, se quedan aquí, con nosotros.', 'Heroes rise when they fall: their thread reaches the other side of the glass. Everyone else, when the Loom finishes their thread, stays here, with us.'),
    L2('Si un día tus hijos o tus nietos se van, les guardaré un sitio junto al monumento. Nadie se olvida en el Camposanto del Alba.', 'If one day your children or grandchildren pass away, I will keep them a place by the monument. No one is forgotten in the Dawn Graveyard.')], quests: [] };
const CM_CAIDOS = [['Edrin Valcorde', L2('Fundador de los Vigías del Alba. Encontró el primer hilo vacío.', 'Founder of the Dawn Watchers. Found the first empty thread.')], ['Sela Brumanegra', L2('Vigía. Contuvo a los lobos del bosque una noche entera.', 'Watcher. Held back the forest wolves for a whole night.')],
  ['Tomeo el Herrero', L2('Forjó las primeras lanzas de Albor.', 'Forged the first spears of Albor.')], ['Ivra y Calen', L2('Hermanos vigías. Cayeron juntos en el puerto.', 'Watcher siblings. Fell together at the port.')], ['Abuela Nesa', L2('Partera de medio valle. Su hilo se terminó a los 103 años.', 'Midwife of half the valley. Her thread ended at 103.')],
  ['Oren de la Costa', L2('Pescador. Salvó a seis niños de la crecida.', 'Fisher. Saved six children from the flood.')], ['Capitán Hald', L2('Vigía mayor. Cerró la Puerta Sur con su escudo.', 'Chief watcher. Closed the South Gate with his shield.')], ['Lirio', L2('Cantaba en la posada de Albor.', 'Sang at the Albor inn.')], ['Bram el Viejo', L2('Plantó los cerezos del valle.', 'Planted the valley\'s cherry trees.')]];
XACT.cm_tributo = [L2('Rendir tributo a los caídos', 'Pay tribute to the fallen'), 'heart', () => { const P = G.P, first = P.cmDay !== calDay();
  xMsg('🕯 ' + L2('A los caídos', 'To the fallen'), L2('«A quienes cayeron para que el valle siguiera teniendo color. Su hilo sigue en el Telar.»', '"To those who fell so the valley would keep its colour. Their thread remains in the Loom."') + '<br><br>' + (first ? L2('Dejas una vela encendida. Sientes la mano de los que vinieron antes: <b>+8 % de ataque y velocidad durante 10 minutos</b>.', 'You leave a lit candle. You feel the hand of those who came before: <b>+8% attack and speed for 10 minutes</b>.') : L2('Ya encendiste una vela hoy. Vuelve mañana.', 'You already lit a candle today. Come back tomorrow.'))
    + ((P.fallen || []).length ? '<br><br><b>' + L2('Tu familia', 'Your family') + ':</b><br>' + P.fallen.map(f => '† ' + esc(f.name) + ' (' + f.age + L2(' años', ' years') + ')').join('<br>') : ''));
  if (first) { P.cmDay = calDay(); addBuff(P, 'tributo', { atkP: 8, spdP: 8 }, 600); for (let q = 0; q < 14; q++) part(P.x + (Math.random() - 0.5) * 40, P.y - 30, { vz: 20, g: -8, life: 1.6, c: pick(['#ffd040', '#fff4c0', '#ff9a30']) }); sfx('quest'); markDirty(); } }];
XACT.cm_caido = [o => L2('Leer la lápida', 'Read the headstone'), 'book', o => { const d = CM_CAIDOS[(o.gi || 0) % CM_CAIDOS.length]; xMsg('🪦 ' + esc(d[0]), esc(d[1])); }];
XACT.cm_fam = [o => { const f = (G.P.fallen || [])[o.fi]; return f ? L2('Tumba de ', 'Grave of ') + f.name : null; }, 'heart', o => { const P = G.P, f = (P.fallen || [])[o.fi]; if (!f) return; P.cmFl = P.cmFl || {}; const gen = famGenName(f.gen || 2);
  xMsg('🪦 ' + esc(f.name), `<b>${esc(gen)}</b><br>${L2('Nació el día ', 'Born on day ')}${f.born} · ${L2('falleció el día ', 'passed away on day ')}${f.day} · ${f.age} ${L2('años', 'years')}<br>${f.spouse ? '💍 ' + esc(f.spouse) + '<br>' : ''}${f.kids ? '👶 ' + f.kids + L2(' hijos', ' children') + '<br>' : ''}<br><i>${L2('«Su hilo sigue en el Telar.»', '"Their thread remains in the Loom."')}</i>`,
    [[P.cmFl[f.id] === calDay() ? L2('Ya dejaste flores hoy', 'You left flowers today') : '💐 ' + L2('Dejar flores', 'Leave flowers'), () => { if (P.cmFl[f.id] === calDay()) return; P.cmFl[f.id] = calDay(); for (let q = 0; q < 16; q++) part(o.px + (Math.random() - 0.5) * 20, o.py - 8, { vz: 24, g: -6, life: 1.4, c: pick(['#ff6a8a', '#ffffff', '#ffd040', '#ff9ad8']) }); toast(L2('Dejas flores en la tumba de ', 'You leave flowers on the grave of ') + f.name, 'info'); markDirty(); }]]); }];
function cmSync() { const W = G.world, P = G.P; if (!W || !SA.famG || !P) return; const fl = P.fallen || [], n = SA.famG.length, start = Math.max(0, fl.length - n);
  SA.famG.forEach((o, k) => { const idx = start + k, on = idx < fl.length; o.hidden = !on; o.fi = idx; const i = W.I(o.tx, o.ty); W.solidO[i] = on ? 1 : 0; }); }
let cmT = 0; V33_TICKS.push(dt => { cmT += dt || 0; if (cmT < 2) return; cmT = 0; cmSync(); });
WORLD_DRAW.push((cx, cy) => { const M = G.map, P = G.P; if (!M || !M.isWorld || !SA.famG) return; for (const o of SA.famG) { if (o.hidden || dist2(o.px, o.py, P.x, P.y) > 70 * 70) continue; const f = (P.fallen || [])[o.fi]; if (!f) continue; const s = textSprite('+ ' + f.name, '#e8e0ff'); ctx.drawImage(s, Math.round(o.px - cx - s.width / 2), Math.round(o.py - cy - 34)); } });

// ---------- edad de la familia, jubilación, muerte y árbol genealógico ----------
const AGE_PER_DAY = 0.9, AGE_RET = 65;
function kidAgeY(k) { if (!k) return 0; if (k.ag0 === undefined) { const now = calDay(), y0 = Math.max(0, (now - (k.born || 0)) * AGE_PER_DAY); k.ag0 = now; k.agY = Math.min(y0, 30); }   // los que ya existían empiezan con 30 años como mucho
  return Math.floor(k.agY + (calDay() - k.ag0) * AGE_PER_DAY); }
function kidDeathAge(k) { return 82 + Math.floor(hash2(String(k.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0), 7, 917) * 17); }
function famGen(k, seen) { if (!k || !k.gparent) return 2; seen = seen || new Set(); if (seen.has(k.id)) return 3; seen.add(k.id); const P = G.P, p = (P.kids || []).concat(P.fallen || []).find(x => x.id === k.gparent); return p ? famGen(p, seen) + 1 : 3; }
function famGenName(n) { return [L2('Tú', 'You'), L2('Tú', 'You'), L2('Hijos', 'Children'), L2('Nietos', 'Grandchildren'), L2('Bisnietos', 'Great-grandchildren'), L2('Tataranietos', 'Great-great-grandchildren')][n] || L2('Generación ', 'Generation ') + n; }
function kidRetire(k, quiet) { if (k.ret) return; k.ret = 1; k.ljobOld = k.ljob; k.follow = false; if (typeof FOLLOW_KIDS !== 'undefined') FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q.kid !== k); for (const q of G.ents) if (q.type === 'kid' && q.kid === k) q.remove = true; if (k.explore) { k.explore = 0; }
  if (!quiet) { banner('🌅 ' + k.name + L2(' se jubila', ' retires'), kidAgeY(k) + L2(' años. Ya no luchará ni trabajará: ahora disfruta de la vida en casa.', ' years old. They will no longer fight or work: now they enjoy life at home.')); sfx('quest'); } markDirty(true); }
function kidDie(k) { const P = G.P; if (typeof famMigrate === 'function') try { famMigrate(); } catch (e) { }
  const age = kidAgeY(k), f = { id: k.id, name: k.name, g: k.g, app: k.app, born: k.born || 0, day: calDay(), age, gparent: k.gparent || null, parent: k.parent || null, gen: famGen(k), spouse: k.spouse ? k.spouse.name : null, kids: (P.kids || []).filter(x => x.gparent === k.id).length };
  P.fallen = P.fallen || []; P.fallen.push(f); P.kids = (P.kids || []).filter(x => x !== k);
  if (typeof FOLLOW_KIDS !== 'undefined') FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q.kid !== k); for (const q of G.ents) if ((q.type === 'kid' || q.fam) && (q.kid === k || q.famOf === k)) q.remove = true;
  banner('🕯 ' + k.name + L2(' ha fallecido', ' has passed away'), age + L2(' años. Descansa en el Camposanto del Alba, al sur de Albor.', ' years old. They rest in the Dawn Graveyard, south of Albor.')); sfx('quest'); cmSync(); markDirty(true); }
function ageDay() { const P = G.P; if (!P || !P.kids) return; for (const k of P.kids.slice()) { const a = kidAgeY(k); if (a >= kidDeathAge(k)) { kidDie(k); continue; } if (a >= AGE_RET && !k.ret) kidRetire(k); else if (a === kidDeathAge(k) - 3 && !k.oldW) { k.oldW = 1; toast('👴 ' + k.name + L2(' está muy mayor. Visítale.', ' is very old. Go see them.'), 'info', 6); } } }
{ const _nd = newDay; newDay = function () { const r = _nd.apply(this, arguments); try { ageDay(); } catch (e) { console.warn(e); } return r; }; }
// los jubilados no trabajan, no acompañan y no van de expedición
{ const _ld = legDay; legDay = function () { const ks = (G.P && G.P.kids || []).filter(k => k.ret && k.ljob); for (const k of ks) { k._lj = k.ljob; k.ljob = null; } try { return _ld.apply(this, arguments); } finally { for (const k of ks) k.ljob = k._lj; } }; }
let retT = 0; V33_TICKS.push(dt => { retT += dt || 0; if (retT < 1.5) return; retT = 0; const P = G.P; if (!P || !P.kids) return; for (const k of P.kids) if (k.ret && (k.follow || k.explore)) { k.follow = false; k.explore = 0; if (typeof FOLLOW_KIDS !== 'undefined') FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q.kid !== k); for (const q of G.ents) if (q.type === 'kid' && q.kid === k && !q.fam) q.remove = true; toast(k.name + L2(' está jubilado/a: prefiere quedarse en casa.', ' is retired: they prefer to stay home.'), 'info'); } });
function famTreeHTML() { const P = G.P, all = (P.kids || []).map(k => ({ k, dead: false })).concat((P.fallen || []).map(f => ({ k: f, dead: true })));
  const kidsOf = id => all.filter(x => id ? x.k.gparent === id : !x.k.gparent);
  const line = x => { const k = x.k, a = x.dead ? k.age : kidAgeY(k), st = x.dead ? '† ' + L2('falleció a los ', 'died at ') + k.age : k.ret ? '🌅 ' + L2('jubilado/a', 'retired') : kidAdult(k) ? L2('adulto', 'adult') : kidStName(k, kidStage(k));
    return `<div class="ftN${x.dead ? ' dead' : ''}"><b>${x.dead ? '🕯 ' : k.g === 'f' ? '👧 ' : '👦 '}${esc(k.name)}</b> <small>${a} ${L2('años', 'years')} · ${esc(st)}${k.spouse ? ' · 💍 ' + esc(typeof k.spouse === 'string' ? k.spouse : k.spouse.name) : ''}</small></div>`; };
  const rec = (id, d) => { const ch = kidsOf(id); if (!ch.length || d > 8) return ''; return '<div class="ftL">' + ch.map(x => '<div class="ftI">' + line(x) + rec(x.k.id, d + 1) + '</div>').join('') + '</div>'; };
  const gens = {}; for (const x of all) { const g = x.dead ? (x.k.gen || famGen(x.k)) : famGen(x.k); gens[g] = gens[g] || [0, 0]; gens[g][x.dead ? 1 : 0]++; }
  const partners = [P.partner, P.partner2].filter(Boolean).map(id => NPCS[id] ? NPCS[id].n : id).join(' · ');
  return `<div class="ftTop"><b>👑 ${esc(P.name)}</b>${partners ? ' <small>💞 ' + esc(partners) + '</small>' : ''}</div>${rec(null, 0) || '<p class="hint">' + L2('Todavía no tienes hijos.', 'You have no children yet.') + '</p>'}
    <div class="ftSum">${Object.keys(gens).sort().map(g => `<span>${esc(famGenName(+g))}: <b>${gens[g][0]}</b>${gens[g][1] ? ' · 🕯 ' + gens[g][1] : ''}</span>`).join('')}</div>`; }
function famTree() { openModal(`<h2>🌳 ${L2('Árbol genealógico', 'Family tree')}</h2><p class="hint">${L2('Tus hijos cumplen años (1 año cada poco más de un día del calendario), se jubilan a los 65 y mueren de viejos entre los 82 y los 98. Los que se van descansan en el Camposanto del Alba, al sur de Albor.', 'Your children grow older (1 year every little more than a calendar day), retire at 65 and die of old age between 82 and 98. Those who pass away rest in the Dawn Graveyard, south of Albor.')}</p><div class="ftree">${famTreeHTML()}</div><button class="btn" id="ftClose">${L2('Cerrar', 'Close')}</button>`);
  const b = $('#ftClose'); if (b) b.onclick = closeModal; }
{ const st = document.createElement('style'); st.textContent = '.ftree{max-height:58vh;overflow:auto;padding:.3em}.ftTop{padding:.3em .5em;border:1px solid #ffd040;border-radius:.4em;background:rgba(255,208,64,.08)}.ftL{margin-left:.9em;border-left:2px solid rgba(255,208,64,.35);padding-left:.6em}.ftI{margin:.25em 0}.ftN{padding:.15em .3em;border-radius:.3em;background:rgba(255,255,255,.05)}.ftN.dead{opacity:.6}.ftN small{opacity:.8}.ftSum{display:flex;flex-wrap:wrap;gap:.6em;margin-top:.6em;font-size:.85em}'; document.head.appendChild(st); }
{ const _fo = famOpen; famOpen = function () { const r = _fo.apply(this, arguments); try { const m = $('#modal h2'); if (m && !$('#ftBtn')) { const b = document.createElement('button'); b.id = 'ftBtn'; b.className = 'btn'; b.style.margin = '.2em 0 .5em'; b.textContent = '🌳 ' + L2('Árbol genealógico', 'Family tree'); b.onclick = famTree; m.insertAdjacentElement('afterend', b); }
    // edad y jubilación en cada fila
    $$('#modal .srow').forEach(row => { const nm = row.querySelector('b'); if (!nm) return; const k = (G.P.kids || []).find(k => nm.textContent.includes(k.name)); if (!k || row.dataset.age) return; row.dataset.age = 1; const sm = row.querySelector('small'); if (sm) sm.textContent += ' · ' + kidAgeY(k) + L2(' años', ' years') + (k.ret ? ' · 🌅 ' + L2('jubilado/a', 'retired') : ''); }); } catch (e) { } return r; }; }
// el botón de familia sale también si hay fallecidos (para ver el árbol)
{ const _fb = famBtn; famBtn = function () { const r = _fb.apply(this, arguments); const b = $('#famBtn'), P = G.P; if (b && P && b.hidden && (P.fallen || []).length) b.hidden = false; return r; }; }
// jubilar antes de tiempo (desde los 55) desde el panel del hijo
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid, body = $('#mbody'); if (!k || !body || e.fam || !(G.P.kids || []).includes(k)) return r; const a = kidAgeY(k), d = document.createElement('div'); d.className = 'legBox';
    d.innerHTML = `<div class="srow"><div class="sn"><b>🎂 ${a} ${L2('años', 'years')}${k.ret ? ' · 🌅 ' + L2('jubilado/a', 'retired') : ''}</b><small>${L2('Se jubila a los 65 y vivirá hasta los 82-98.', 'Retires at 65 and will live until 82-98.')}</small></div>${!k.ret && a >= 55 ? `<button class="btn sm" id="kRet">${L2('Jubilar', 'Retire')}</button>` : ''}</div>`;
    body.appendChild(d); const b = $('#kRet'); if (b) b.onclick = () => { kidRetire(k); closeModal(); }; } catch (er) { } return r; }; }

// ---------- la terminal por dentro: mostradores, panel de salidas, asientos, café y puerta de embarque ----------
const AEV = [
  ['ae_br', L2('Viajera de Brasil', 'Traveller from Brazil'), 'f', 2, 'negro', 'Olá! Primeira vez em Albor? Os pastéis da posada são uma delícia!', L2('¡Hola! ¿Primera vez en Albor? ¡Los pasteles de la posada están deliciosos!', 'Hi! First time in Albor? The inn\'s pastries are delicious!')],
  ['ae_mx', L2('Viajero de México', 'Traveller from Mexico'), 'm', 1, 'negro', '¡Órale! Vine a ver los volcanes de Isla Brasa. En mi tierra también tenemos, ¿eh?', L2('Viene a ver los volcanes de Isla Brasa.', 'He came to see the volcanoes of Ember Isle.')],
  ['ae_us', L2('Viajero de Estados Unidos', 'Traveller from the USA'), 'm', 0, 'rubio', 'Hey there! I heard Japan\'s got the best ramen in the world. Can\'t wait!', L2('¡Hola! Dicen que Japón tiene el mejor ramen del mundo. ¡No puedo esperar!', 'He can\'t wait to try ramen in Japan.')],
  ['ae_fr', L2('Viajera de Francia', 'Traveller from France'), 'f', 0, 'castano', 'Bonjour ! Je vais à Tokyo pour voir les cerisiers en fleur.', L2('¡Buenos días! Voy a Tokio a ver los cerezos en flor.', 'Good morning! I\'m going to Tokyo to see the cherry blossoms.')],
  ['ae_it', L2('Viajero de Italia', 'Traveller from Italy'), 'm', 1, 'castano', 'Ciao! Il caffè di questo aeroporto... mamma mia, non è un espresso.', L2('¡Hola! El café de este aeropuerto… madre mía, eso no es un expreso.', 'Hi! This airport\'s coffee… good grief, that\'s no espresso.')],
  ['ae_de', L2('Viajera de Alemania', 'Traveller from Germany'), 'f', 0, 'platino', 'Guten Tag! Der Flug nach Japan ist pünktlich. Sehr gut.', L2('¡Buenas! El vuelo a Japón sale puntual. Muy bien.', 'Good day! The flight to Japan is on time. Very good.')],
  ['ae_kr', L2('Viajera de Corea', 'Traveller from Korea'), 'f', 0, 'negro', '안녕하세요! 일본에 가면 노래방에 갈 거예요!', L2('¡Hola! ¡Cuando llegue a Japón voy a ir al karaoke!', 'Hello! When I get to Japan I\'m going to karaoke!')],
  ['ae_ar', L2('Viajero de Argentina', 'Traveller from Argentina'), 'm', 1, 'castano', '¡Che! ¿Vos también vas a Japón? Dicen que hay que tener nivel 400 para aguantar el viaje.', L2('Dicen que hace falta nivel 400 para aguantar el viaje.', 'They say you need level 400 to endure the trip.')],
  ['ae_in', L2('Viajera de la India', 'Traveller from India'), 'f', 5, 'negro', 'Namaste! Este valle es precioso. En casa mi abuela me pedirá fotos de los cerezos.', L2('¡Namasté! Su abuela le pedirá fotos de los cerezos.', 'Namaste! Her grandma will ask for photos of the cherry trees.')],
  ['ae_eg', L2('Viajero de Egipto', 'Traveller from Egypt'), 'm', 5, 'negro', L2('Ahlan! En el desierto de Sahrim me siento como en casa. Aunque allí nadie vende helado.', 'Ahlan! In the Sahrim desert I feel at home. Though nobody there sells ice cream.'), L2('¡Hola! En Sahrim se siente como en casa.', 'Hello! He feels at home in Sahrim.')],
  ['ae_pe', L2('Viajera de Perú', 'Traveller from Peru'), 'f', 1, 'negro', '¡Hola, causa! Traje ceviche para el vuelo. Shhh, no se lo digas a la azafata.', L2('Lleva ceviche escondido para el vuelo.', 'She is hiding ceviche for the flight.')],
  ['ae_ca', L2('Viajero de Canadá', 'Traveller from Canada'), 'm', 0, 'cobre', 'Sorry! Is this the line for Tokyo? Oh, sorry, sorry, you were first.', L2('¡Perdón! ¿Es la fila para Tokio? Ay, perdón, perdón, usted iba primero.', 'Sorry! Is this the line for Tokyo? Oh, sorry, you were first.')],
];
const AEV_APP = {}, AEV_CL = ['azul', 'rojo', 'verde', 'negro', 'blanco', 'amarillo', 'morado', 'naranja', 'rosa', 'gris'];
AEV.forEach(([id, n, g, skin, hair, ln, tr], i) => { const H = g === 'm' ? HS_M : HS_F; AEV_APP[id] = [{ g, skin, hair, hs: (i * 5 + 3) % H.length, eyes: pick(['cafe', 'azul', 'verde']), top: [[1, 2, 5, 3, 0][i % 5], AEV_CL[i % 10]], bot: [g === 'f' ? [0, 2][i % 2] : 0, AEV_CL[(i + 4) % 10]], shoe: [1, 'negro'], bt: i % 4 }, {}];
  NPCS[id] = { n, title: L2('Pasajero', 'Passenger'), look: LK({ g, hair: HAIRS[hair], skin: SKINS[skin] }), lines: [ln + (ln === tr ? '' : '\n\n(' + tr + ')')], quests: [] }; });
NPCS.ae_taquilla = { n: L2('Taquillera', 'Ticket agent'), title: L2('Aeródromo de Albor', 'Albor Aerodrome'), look: LK({ g: 'f', hair: HAIRS.castano, hairStyle: 'long', outfit: 'dress', main: P5(['#0a1a3a', '#14306a', '#1e4a9a', '#3a6ac8', '#6a9ae8']) }),
  lines: [L2('Bienvenido al Aeródromo de Albor. Desde aquí sale el vuelo a Japón.', 'Welcome to Albor Aerodrome. The flight to Japan leaves from here.'), L2('Hace poco la Ventisca empezó a pintar tierras de su propio mundo, el del otro lado del cristal. La primera fue Japón. Desde entonces llegan viajeros de muchos países.', 'Not long ago the Ventisca began painting lands from her own world, the one on the other side of the glass. The first was Japan. Since then travellers come from many countries.')], quests: [] };
NPCS.ae_cafetera = { n: L2('Camarero del café', 'Café waiter'), title: L2('Café del aeródromo', 'Aerodrome café'), look: LK({ hair: HAIRS.negro, outfit: 'apron', main: P5(['#3a2010', '#5a3418', '#7a4a24', '#9a6234', '#b87c48']) }), lines: [L2('Un café para el vuelo, ¿le pongo?', 'A coffee for the flight?')], quests: [] };
AEV_APP.ae_taquilla = [{ g: 'f', skin: 1, hair: 'castano', hs: 3, eyes: 'cafe', top: [1, 'azul'], bot: [2, 'azul'], shoe: [1, 'negro'] }, {}]; AEV_APP.ae_cafetera = [{ g: 'm', skin: 2, hair: 'negro', hs: 1, eyes: 'cafe', top: [2, 'blanco'], bot: [0, 'negro'], shoe: [1, 'negro'] }, {}];
{ const _na = npcAtlas; npcAtlas = function (id) { const D = AEV_APP[id]; if (D) return getAtlas('AEV' + id, () => { const L = heroLook('guerrero', D[0], { weapon: 0 }, D[1], {}); L.weapon = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }
const AE_TICKET = 100000, AE_LV = 400;
function aeBoarding() { const now = aeNow(); let open = false, wait = 999; for (let i = 0; i < AE_N; i++) { const t = ((now + i * 40) % AE_T + AE_T) % AE_T; if (t >= 28 && t < 50) open = true; wait = Math.min(wait, t < 28 ? 28 - t : AE_T - t + 28); } return { open, wait: Math.ceil(wait) }; }
function makeTerminal(id, o) { if (G.maps[id]) return G.maps[id]; const w = 36, h = 20, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], aeIn: o.k };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (y < 4 || x === 0 || x === w - 1 || y === h - 1) M.ter[I(x, y)] = T.IWALL;
  const ex = w >> 1; M.ter[I(ex, h - 1)] = T.FLOOR; M.exit = { x: ex, y: h - 1 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, p) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, p || {}));
  for (const x of [3, 7, 11]) F('ae_mostrador', x, 6, [[0, 0], [1, 0], [2, 0]]);
  F(o.jp ? 'ae_panel_jp' : 'ae_panel', 17, 3, [[0, 0], [1, 0], [2, 0]]);
  for (const y of [10, 13]) for (const x of [14, 19, 24]) F('ae_asientos', x, y, [[0, 0], [1, 0], [2, 0], [3, 0]]);
  F('ae_puerta_emb', 31, 3, [[-1, 0], [0, 0], [1, 0]]); F('ae_vacio', 31, 5, null, { solid: false, xact: 'ae_embarcar' });
  F('ae_cafe', 28, 16, [[0, 0], [1, 0], [2, 0]]); F('ae_arco', 22, 16, [[0, 0]], { solid: false });
  for (const [x, y] of [[1, 5], [34, 5], [1, 17], [34, 17], [13, 6], [16, 8]]) F('plant', x, y);
  const sp = (nid, x, y, p) => spawnNPC(nid, x * 16 + 8, y * 16 + 8, id, Object.assign({ face: 'down' }, p || {}));
  sp(o.clerk, 8, 5); sp(o.cafe, 29, 15);
  (o.travellers || []).forEach((nid, i) => sp(nid, [15, 18, 21, 25, 27, 16, 23, 26, 12, 30, 20, 10][i % 12], [9, 12, 9, 12, 9, 15, 15, 12, 9, 9, 12, 14][i % 12], { wander: i % 3 === 0 ? 2 : 0 }));
  M.drawExtra = (cx, cy) => aeFloor(M, cx, cy, o); G.maps[id] = M; return M; }
function aeFloor(M, cx, cy, o) { const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(M.w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(M.h - 1, Math.ceil((cy + VH) / 16));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const X = x * 16 - cx, Y = y * 16 - cy, t = M.ter[M.I(x, y)];
    if (t === T.FLOOR) { ctx.fillStyle = (x + y) % 2 ? '#e4e6ec' : '#d6d9e2'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(X + 2, Y + 2, 3, 1); if (x > 13 && x < 31 && y === 17) { ctx.fillStyle = '#c8102e'; ctx.fillRect(X, Y + 4, 16, 8); } continue; }
    if (y < 4) { const sky = ctx.createLinearGradient(0, Y, 0, Y + 16); ctx.fillStyle = y < 2 ? '#6aa8e8' : y === 2 ? '#9ac8f4' : '#5a6070'; ctx.fillRect(X, Y, 16, 16); if (y === 3) { ctx.fillStyle = '#3a3e46'; ctx.fillRect(X, Y + 6, 16, 10); ctx.fillStyle = '#e8e8e8'; if (x % 3 === 0) ctx.fillRect(X + 2, Y + 11, 10, 1); }
      ctx.fillStyle = '#c8ccd6'; if (x % 3 === 0) ctx.fillRect(X, Y, 2, 16); if (y === 0) ctx.fillRect(X, Y, 16, 3); continue; }
    ctx.fillStyle = '#b8bcc8'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#9a9eaa'; ctx.fillRect(X, Y + 14, 16, 2); }
  // un avión que pasa por la ventana
  const ph = (aeNow() % 40) / 40, px = -100 + ph * (M.w * 16 + 200) - cx, py = 2 * 16 - cy; if (py > -40) { ctx.save(); ctx.beginPath(); ctx.rect(16 - cx, 0 - cy, (M.w - 2) * 16, 4 * 16); ctx.clip(); const S = planeSprite(o.jp ? 1 : 0); ctx.drawImage(S.c, Math.round(px), Math.round(py + 6 - S.ay * 0.6), S.c.width * 0.6, S.c.height * 0.6); ctx.restore(); } }
XSPR.ae_vacio = () => { const [c] = XC(2, 2); return { c, ax: 1, ay: 1 }; };
XSPR.ae_mostrador = () => { const [c, g] = XC(48, 28); g.fillStyle = '#2a4a7a'; g.fillRect(0, 6, 48, 22); g.fillStyle = '#e8ecf2'; g.fillRect(0, 4, 48, 4); g.fillStyle = '#ffd040'; g.fillRect(0, 12, 48, 2); g.fillStyle = '#1a2a40'; g.fillRect(6, 0, 10, 5); g.fillStyle = '#5ad0ff'; g.fillRect(7, 1, 8, 3); g.fillStyle = '#8a8e98'; g.fillRect(30, 1, 12, 4); return { c, ax: 8, ay: 27 }; };
function aePanel(jp) { const [c, g] = XC(56, 36); g.fillStyle = '#121418'; g.fillRect(0, 0, 56, 30); g.fillStyle = '#4a4e58'; g.fillRect(26, 30, 4, 6); g.fillStyle = '#ffd040'; g.fillRect(0, 0, 56, 9);
  if (jp) { jpText(g, '出発 便', 3, 0, '#121418', 10); jpText(g, 'ALBOR 13:40', 3, 10, '#ffffff', 10); jpText(g, '大阪 14:05', 3, 20, '#7ad0ff', 10); }
  else { jpText(g, 'SALIDAS', 3, 0, '#121418', 10); jpText(g, 'TOKIO 13:40', 3, 10, '#ffffff', 10); jpText(g, '東京 便', 3, 20, '#7ad0ff', 10); }
  return { c, ax: 8, ay: 35 }; }
XSPR.ae_panel = () => aePanel(false); XSPR.ae_panel_jp = () => aePanel(true);
XSPR.ae_asientos = () => { const [c, g] = XC(64, 22); for (let k = 0; k < 4; k++) { const x = k * 16; g.fillStyle = '#2a5ad8'; g.fillRect(x + 2, 2, 12, 9); g.fillStyle = '#3a6ae8'; g.fillRect(x + 2, 10, 12, 6); g.fillStyle = '#6a9af8'; g.fillRect(x + 3, 3, 10, 1); }
  g.fillStyle = '#5a606c'; g.fillRect(0, 16, 64, 2); g.fillRect(4, 18, 2, 4); g.fillRect(58, 18, 2, 4); return { c, ax: 8, ay: 21 }; };
XSPR.ae_puerta_emb = () => { const [c, g] = XC(52, 44); g.fillStyle = '#5a606c'; g.fillRect(0, 6, 52, 38); g.fillStyle = '#1e3450'; g.fillRect(8, 12, 36, 32); g.fillStyle = 'rgba(160,210,255,0.45)'; g.fillRect(10, 14, 15, 30); g.fillRect(27, 14, 15, 30);
  g.fillStyle = '#ffd040'; g.fillRect(0, 0, 52, 9); jpText(g, 'PUERTA 1', 4, -1, '#121418', 10); return { c, ax: 26, ay: 43 }; };
XSPR.ae_cafe = () => { const [c, g] = XC(48, 34); g.fillStyle = '#5a3418'; g.fillRect(0, 12, 48, 22); g.fillStyle = '#8a5a30'; g.fillRect(0, 10, 48, 4); g.fillStyle = '#e8ecf2'; for (const x of [6, 16, 26]) { g.fillRect(x, 4, 6, 6); g.fillStyle = '#7a4a24'; g.fillRect(x + 1, 5, 4, 2); g.fillStyle = '#e8ecf2'; }
  g.fillStyle = '#2a2a30'; g.fillRect(34, 0, 12, 10); g.fillStyle = '#ff5a5a'; g.fillRect(36, 2, 2, 2); jpText(g, 'CAFÉ', 10, 18, '#ffe8a0', 10); return { c, ax: 8, ay: 33 }; };
XSPR.ae_arco = () => { const [c, g] = XC(24, 40); g.fillStyle = '#8a8e98'; g.fillRect(0, 4, 4, 36); g.fillRect(20, 4, 4, 36); g.fillRect(0, 0, 24, 6); g.fillStyle = '#3aff6a'; g.fillRect(10, 1, 4, 3); return { c, ax: 12, ay: 39 }; };
const AE_ALB = { k: 'albor', clerk: 'ae_taquilla', cafe: 'ae_cafetera', travellers: AEV.map(a => a[0]) };
XACT.ae_entrar = [L2('Entrar al aeródromo', 'Enter the aerodrome'), 'run', o => { const P = G.P, M = makeTerminal('ae_terminal', AE_ALB); P.retX = o.px; P.retY = o.py + 18; transition(() => { P.inside = 'ae_terminal'; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner(L2('Aeródromo de Albor', 'Albor Aerodrome'), L2('Vuelos a Japón · nivel 400', 'Flights to Japan · level 400')); }); }];
DLG_HOOKS.push((npc, opts) => {
  if (npc.id === 'ae_taquilla' || npc.id === 'jp_taquilla') { const P = G.P, toJp = npc.id === 'ae_taquilla';
    opts.unshift({ label: '🎫 ' + (toJp ? L2('Billete a Japón (Tokio) · ', 'Ticket to Japan (Tokyo) · ') + AE_TICKET.toLocaleString() + L2(' de oro · nivel ', ' gold · level ') + AE_LV : L2('Billete de vuelta a Albor (gratis)', 'Return ticket to Albor (free)')), icon: ['coin'], fn: () => {
      if (P.aeTk === (toJp ? 'jp' : 'al')) { typeText(L2('Ya tienes tu billete. Espera en la sala: cuando el avión llegue a la puerta, embarca por la Puerta 1.', 'You already have your ticket. Wait in the lounge: when the plane reaches the gate, board through Gate 1.')); return; }
      if (toJp && P.lv < AE_LV) { typeText(L2('Lo siento: el vuelo a Japón cruza el Mar de Coral y mucho más allá. Solo dejamos subir a héroes de nivel 400.', 'Sorry: the flight to Japan crosses the Coral Sea and far beyond. We only let level 400 heroes board.')); return; }
      if (toJp && P.gold < AE_TICKET) { typeText(L2('No te llega el oro. El billete cuesta ', 'You don\'t have enough gold. The ticket costs ') + AE_TICKET.toLocaleString() + '.'); return; }
      if (toJp) P.gold -= AE_TICKET; P.aeTk = toJp ? 'jp' : 'al'; sfx('coin'); markDirty(true); const b = aeBoarding();
      typeText(L2('¡Aquí tienes tu billete! ', 'Here is your ticket! ') + (b.open ? L2('Ahora mismo se está embarcando: ve a la Puerta 1.', 'Boarding right now: go to Gate 1.') : L2('El próximo embarque empieza en unos ', 'Next boarding starts in about ') + b.wait + L2(' segundos. Espera en la sala.', ' seconds. Wait in the lounge.'))); } }); }
  if (npc.id === 'ae_cafetera' || npc.id === 'jp_cafetera') opts.unshift({ label: '☕ ' + L2('Café (500 de oro · +6 % velocidad, 5 min)', 'Coffee (500 gold · +6% speed, 5 min)'), icon: ['coin'], fn: () => { const P = G.P; if (P.gold < 500) { typeText(L2('No te llega.', 'Not enough.')); return; } P.gold -= 500; addBuff(P, 'cafe', { spdP: 6 }, 300); sfx('coin'); typeText(L2('Recién hecho. ¡Buen viaje!', 'Freshly made. Have a good trip!')); } }); });
XACT.ae_embarcar = [o => { const P = G.P, M = G.map, b = aeBoarding(); return '✈ ' + (b.open ? L2('Embarcar', 'Board') : L2('Puerta 1 · embarque en ', 'Gate 1 · boarding in ') + b.wait + ' s'); }, 'run', o => { const P = G.P, M = G.map, jp = !!(M && M.aeIn === 'jp'), need = jp ? 'al' : 'jp', b = aeBoarding();
  if (P.aeTk !== need) { xMsg('✈ ' + L2('Puerta 1', 'Gate 1'), L2('Necesitas un billete. Cómpralo en el mostrador de la izquierda.', 'You need a ticket. Buy it at the counter on the left.')); return; }
  if (!b.open) { xMsg('✈ ' + L2('Puerta 1', 'Gate 1'), L2('El avión todavía no ha llegado a la puerta. Embarque en ', 'The plane has not reached the gate yet. Boarding in ') + b.wait + L2(' segundos.', ' seconds.')); return; }
  P.aeTk = null; markDirty(true); flightCine(jp ? L2('TOKIO · ALBOR', 'TOKYO · ALBOR') : L2('ALBOR · TOKIO', 'ALBOR · TOKYO'), () => { if (jp) aeArriveAlbor(); else if (typeof goJapan === 'function') goJapan(); }); }];
// HUD con la cuenta atrás mientras tienes billete y estás en la terminal
let aeHT = 0; V33_TICKS.push(dt => { aeHT += dt || 0; if (aeHT < 0.5) return; aeHT = 0; const M = G.map, P = G.P; if (!M || !P) return; const on = M.aeIn && P.aeTk && (P.aeTk === (M.aeIn === 'jp' ? 'al' : 'jp'));
  if (on) { const b = aeBoarding(); mgHud('✈ ' + (b.open ? L2('¡Embarcando! Ve a la Puerta 1', 'Boarding! Go to Gate 1') : L2('Próximo embarque en ', 'Next boarding in ') + b.wait + ' s')); P._aeHud = 1; } else if (P._aeHud) { P._aeHud = 0; mgHud(null); } });
function aeArriveAlbor() { const P = G.P, W = G.world, x = SA.term.door * 16 + 8, y = (SA.term.y + SA.term.h + 1) * 16 + 8; transition(() => { P.inside = null; setMap(W, x, y, 'down'); banner(L2('Aeródromo de Albor', 'Albor Aerodrome'), L2('¡Bienvenido a casa!', 'Welcome home!')); markDirty(true); }); }
// el vuelo: cielo, nubes y el avión cruzando (6 s)
function flightCine(title, cb) { const d = document.createElement('div'); d.id = 'flightCine'; d.style.cssText = 'position:fixed;inset:0;z-index:99;background:#000;display:flex;align-items:center;justify-content:center'; const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; cv.style.cssText = 'width:100%;height:100%;object-fit:contain;image-rendering:pixelated'; d.appendChild(cv); document.body.appendChild(d);
  const g = cv.getContext('2d'), S = planeSprite(1), t0 = performance.now(), D = 6000, cl = Array.from({ length: 14 }, (_, i) => [Math.random() * 320, 40 + Math.random() * 130, 20 + Math.random() * 40, 0.3 + Math.random() * 0.7]); sfx('quest');
  const step = () => { const t = (performance.now() - t0) / D; if (t >= 1) { d.remove(); cb && cb(); return; }
    const sky = g.createLinearGradient(0, 0, 0, 180); sky.addColorStop(0, t < 0.5 ? '#3a7ad8' : '#d8783a'); sky.addColorStop(1, t < 0.5 ? '#aad4ff' : '#ffd0a0'); g.fillStyle = sky; g.fillRect(0, 0, 320, 180);
    for (const c of cl) { c[0] -= c[3] * 3; if (c[0] < -60) c[0] = 380; g.fillStyle = `rgba(255,255,255,${0.5 + c[3] * 0.4})`; g.beginPath(); g.ellipse(c[0], c[1], c[2], c[2] * 0.35, 0, 0, 7); g.ellipse(c[0] + c[2] * 0.5, c[1] - 4, c[2] * 0.6, c[2] * 0.3, 0, 0, 7); g.fill(); }
    g.imageSmoothingEnabled = false; const bob = Math.sin(t * 20) * 1.5; g.drawImage(S.c, 160 - S.c.width, 80 + bob - S.c.height, S.c.width * 2, S.c.height * 2);
    g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, 150, 320, 30); jpText(g, title, 160 - jpW(title, 12) / 2, 158, '#ffe8a0', 12);
    const a = t < 0.1 ? 1 - t / 0.1 : t > 0.9 ? (t - 0.9) / 0.1 : 0; if (a > 0) { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, 320, 180); } requestAnimationFrame(step); };
  step(); }
