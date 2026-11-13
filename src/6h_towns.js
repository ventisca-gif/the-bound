// ================= LIVING TOWNS: townsfolk with routines, town-specific decor, birthdays, festivals, flower days & weddings =================
const TF_PAL = { albor: [CLOTH.verde, CLOTH.beige, CLOTH.amarillo, CLOTH.marron || CLOTH.beige], puerto: [CLOTH.azul, CLOTH.marino, CLOTH.blanco, CLOTH.turquesa], arxar: [CLOTH.granate, CLOTH.morado, CLOTH.gris, CLOTH.rojo], sahrim: [CLOTH.naranja, CLOTH.amarillo, CLOTH.beige, CLOTH.rojo], yarakai: [CLOTH.verde, CLOTH.oliva || CLOTH.verde, CLOTH.marron || CLOTH.beige, CLOTH.turquesa] };
const TF_SKIN = { albor: [0, 1], puerto: [1, 2], arxar: [0, 1], sahrim: [2, 3], yarakai: [2, 3] };
// [key, name, title, female?, kid?, extra look, lines]
const TOWNFOLK = {
  albor: [['rosa', /*nt*/'Rosa', 'Granjera', 1, 0, { hat: 'straw', hair: HAIRS.rubio }, ['Las calabazas de este año son enormes.', '¿Has visto mi gallina? Siempre se escapa.']], ['tobias', 'Abuelo Tobías', 'Anciano de Albor', 0, 0, { hair: HAIRS.blanco, beard: HAIRS.blanco }, ['De joven luché contra un slime del tamaño de un carro.', 'Siéntate un rato, joven, que el sol calienta bien.']], ['lila', 'Lila', 'Niña', 1, 1, { hair: HAIRS.rojo }, ['¡Juguemos a los aventureros!', '¡Pip dice que eres muy fuerte!']], ['ivan', 'Iván', 'Panadero', 0, 0, { hair: HAIRS.castano, hat: 'chef' }, ['El pan de Albor es el mejor del valle.', 'Me levanto antes que el gallo.']], ['clara', 'Clara', 'Pastora', 1, 0, { hair: HAIRS.castano }, ['Mis ovejas se asustan de los lobos.', 'Hoy huele a lluvia.']]],
  puerto: [['nuno', 'Nuno', 'Pescador', 0, 0, { hat: 'bandana', beard: HAIRS.negro, hair: HAIRS.negro }, ['Hoy el mar está generoso.', 'Si oyes cantar a las gaviotas, viene tormenta.']], ['leo', 'Leo', 'Grumete', 0, 1, { hair: HAIRS.rubio }, ['¡Algún día tendré mi propio barco!']], ['ines', 'Inés', 'Vendedora de conchas', 1, 0, { hair: HAIRS.rosa }, ['¿Una concha de la suerte? Esta es gratis… para mirar.', 'El puerto nunca duerme.']], ['bras', 'Capitán Brás', 'Capitán retirado', 0, 0, { hair: HAIRS.gris, beard: HAIRS.gris, hat: 'bandana' }, ['Navegué hasta Nhar cuando aún no había volcán.', 'El mar no se conquista, se respeta.']], ['tiago', 'Tiago', 'Niño del muelle', 0, 1, { hair: HAIRS.negro }, ['¡He pescado un cangrejo con la mano!']]],
  arxar: [['leonor', 'Dama Leonor', 'Noble de Arxar', 1, 0, { hair: HAIRS.rubio, outfit: 'dress' }, ['En la Ciudadela, los modales lo son todo.', 'El Rey prepara la gran celebración de la Corona.']], ['matias', 'Matías', 'Escriba', 0, 0, { hair: HAIRS.castano, outfit: 'robe' }, ['Anoto cada hazaña de los aventureros. La tuya también.']], ['raul', 'Raúl', 'Soldado de permiso', 0, 0, { hair: HAIRS.negro }, ['Por fin un día libre. Nada de patrullas.']], ['celia', 'Celia', 'Florista', 1, 0, { hair: HAIRS.morado }, ['Las rosas de la Ciudadela crecen junto a las murallas.', '¿Flores para alguien especial?']], ['paje', 'Hugo el Paje', 'Paje', 0, 1, { hair: HAIRS.rubio }, ['¡Llevo un mensaje muy importante! … Creo.']]],
  sahrim: [['karim', 'Karim', 'Mercader de alfombras', 0, 0, { hair: HAIRS.negro, beard: HAIRS.negro, outfit: 'robe' }, ['Mis alfombras han visto más mundo que tú.', 'Un buen trato es como el agua: escaso y precioso.']], ['leila', 'Leila', 'Bailarina', 1, 0, { hair: HAIRS.negro, outfit: 'dress' }, ['Bailo bajo las estrellas del oasis cada noche de fiesta.']], ['samira', 'Samira', 'Aguadora', 1, 0, { hair: HAIRS.castano }, ['El agua del oasis es un regalo de los antiguos.']], ['yusuf', 'Anciano Yusuf', 'Sabio del desierto', 0, 0, { hair: HAIRS.blanco, beard: HAIRS.blanco, outfit: 'robe' }, ['La arena guarda secretos que el viento descubre.']], ['omar', 'Omar', 'Niño', 0, 1, { hair: HAIRS.negro }, ['¡He visto un escorpión enorme! … Bueno, mediano.']]],
  yarakai: [['tupak', 'Tupak', 'Cazador', 0, 0, { hair: HAIRS.negro }, ['El jaguar es el espíritu protector de Yarakai.']], ['inti', 'Inti', 'Tejedora', 1, 0, { hair: HAIRS.negro }, ['Tejo los colores de la selva en cada manta.', '¿Ves este patrón? Cuenta la historia de mi abuela.']], ['killa', 'Killa', 'Niña', 1, 1, { hair: HAIRS.castano }, ['¡Los monos me robaron la fruta otra vez!']], ['amaru', 'Anciano Amaru', 'Guardián de tótems', 0, 0, { hair: HAIRS.blanco, beard: HAIRS.blanco }, ['Los tótems escuchan. Háblales con respeto.']], ['yaku', 'Yaku', 'Pescadora del río', 1, 0, { hair: HAIRS.negro, hat: 'straw' }, ['El río trae peces y noticias.']]],
};
const TF_IDS = [];
for (const tk in TOWNFOLK) TOWNFOLK[tk].forEach(([k, n, title, f, kid, ex, lines], i) => {
  const id = 'tf_' + k, pl = TF_PAL[tk], R = new RNG(hash2(i * 7 + 3, tk.length * 13, 91) * 1e6 | 0);
  NPCS[id] = { n, title, town: tk, tf: 1, look: LK(Object.assign({ skin: SKINS[TF_SKIN[tk][R.int(0, 1)]], hairStyle: f ? 'long' : 'short', eyes: R.pick(['cafe', 'azul', 'verde', 'ambar', 'dorado']), outfit: f ? R.pick(['dress', 'apron', 'tunic']) : R.pick(['tunic', 'apron', 'sailor']), main: pl[i % pl.length], sec: pl[(i + 1) % pl.length], body: kid ? 'small' : undefined }, ex)), lines };
  TF_IDS.push(id);
});
// ---------- extra sprites (town decor & celebrations) ----------
const EXTRA_SPR = {};
const FLOWC = ['#ff5a7a', '#ffd040', '#c070ff', '#ffffff', '#ff8a2a', '#7ad8ff'];
EXTRA_SPR.flowerbed = o => spr('fb' + (o.v % 3), () => { const p = new Pix(18, 12); p.rect(1, 6, 16, 5, WOOD[1]); p.rect(2, 5, 14, 5, C('#4a2e1a')); for (let k = 0; k < 9; k++) { const x = 3 + (k * 5) % 13, y = 3 + (k * 3) % 4; p.vl(x, y + 1, 3, C('#3a7a2a')); p.set(x, y, C(FLOWC[(k + o.v) % FLOWC.length])); p.set(x + 1, y, C(FLOWC[(k + o.v + 2) % FLOWC.length])); } return { c: p.canvas(), ax: 9, ay: 11 }; });
EXTRA_SPR.windmill = o => { const f = Math.floor(G.t * 3) % 4; return spr('wm' + f, () => { const p = new Pix(56, 76), S = pal(['#4a4038', '#6e6254', '#8e8070', '#ad9f8c', '#cabda8']); for (let y = 30; y < 76; y++) { const w = 9 + (y - 30) * 0.14; for (let x = Math.round(28 - w); x <= Math.round(28 + w); x++) p.set(x, y, S[x < 24 ? 1 : x > 32 ? 3 : 2]); } p.poly([[16, 32], [28, 18], [40, 32]], C('#8a2a1a')); p.line(16, 32, 28, 18, C('#b8482a')); p.rect(25, 60, 7, 16, WOOD[1]); p.rect(26, 61, 5, 15, WOOD[0]); p.rect(26, 42, 5, 5, C('#2a1a10')); p.set(28, 44, C('#ffd080'));
  const cx = 28, cy = 30; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + f * Math.PI / 8; for (let d = 2; d < 24; d++) { const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; p.set(Math.round(x), Math.round(y), WOOD[3]); if (d > 6) for (let q = 1; q < 5; q++) p.set(Math.round(x - Math.sin(a) * q), Math.round(y + Math.cos(a) * q), q === 4 ? WOOD[2] : C('#e8dcc0')); } } p.ball(cx, cy, 2.5, 2.5, [WOOD[1], WOOD[2], WOOD[3], WOOD[4]]); return { c: p.canvas(), ax: 28, ay: 74 }; }); };
EXTRA_SPR.anchor = () => spr('anchor', () => { const p = new Pix(18, 20), I = IRON; p.vl(9, 2, 15, I[3]); p.vl(10, 2, 15, I[2]); p.hl(5, 5, 9, I[3]); p.ell(9.5, 2, 2, 1.6, I[4]); for (let x = 2; x <= 16; x++) { const y = 16 - Math.round(Math.sqrt(Math.max(0, 49 - (x - 9.5) ** 2)) * 0.5); p.set(x, y, I[3]); p.set(x, y + 1, I[1]); } p.set(2, 13, I[4]); p.set(16, 13, I[4]); return { c: p.canvas(), ax: 9, ay: 19 }; });
EXTRA_SPR.brazier = () => { const f = Math.floor(G.t * 8) % 3; return spr('brz' + f, () => { const p = new Pix(14, 26), I = IRON; p.rect(6, 12, 2, 13, I[2]); p.hl(3, 24, 8, I[3]); p.ell(7, 11, 5, 2.5, I[3]); p.hl(2, 10, 10, I[4]); const fl = [[7, 2], [5, 4], [9, 3]]; for (const [x, y] of fl) { p.ell(x + (f === 1 ? 1 : 0), y + 4, 2, 4 - (f === 2 ? 1 : 0), C('#ff7a1a')); p.ell(x, y + 6, 1, 2, C('#ffe060')); } return { c: p.canvas(), ax: 7, ay: 25 }; }); };
EXTRA_SPR.rug = o => spr('rug' + (o.v % 3), () => { const p = new Pix(30, 14), c = [['#8a1a1a', '#e0a020', '#2a4a8a'], ['#2a4a8a', '#e8d8a8', '#8a1a1a'], ['#1a6a4a', '#e0a020', '#6a1a4a']][o.v % 3]; p.poly([[2, 3], [28, 1], [28, 11], [2, 13]], C(c[0])); for (let x = 4; x < 27; x += 3) p.vl(x, 5 - Math.round(x / 14), 5, C(c[1])); p.line(2, 3, 28, 1, C(c[2])); p.line(2, 13, 28, 11, C(c[2])); return { c: p.canvas(), ax: 15, ay: 12 }; });
EXTRA_SPR.garland = () => spr('garland', () => { const p = new Pix(72, 36); for (const x of [2, 69]) { p.rect(x, 4, 2, 32, WOOD[2]); p.set(x, 3, WOOD[4]); } for (let x = 4; x < 69; x++) { const y = 6 + Math.round(Math.sin((x - 4) / 65 * Math.PI) * 7); p.set(x, y, C('#e8e0d0')); if ((x - 4) % 6 === 0) { const c = C(FLOWC[((x / 6) | 0) % FLOWC.length]); p.poly([[x, y + 1], [x + 4, y + 1], [x + 2, y + 6]], c); } } return { c: p.canvas(), ax: 36, ay: 35 }; });
EXTRA_SPR.lanterns = () => { const f = Math.floor(G.t * 2) % 2; return spr('lstr' + f, () => { const p = new Pix(72, 36); for (const x of [2, 69]) p.rect(x, 4, 2, 32, WOOD[2]); for (let x = 4; x < 69; x++) { const y = 6 + Math.round(Math.sin((x - 4) / 65 * Math.PI) * 6); p.set(x, y, C('#3a2a1a')); if ((x - 4) % 9 === 4) { p.rect(x - 2, y + 1, 5, 6, C(['#ff4a3a', '#ffb030', '#ff7aa0'][((x / 9) | 0) % 3])); p.rect(x - 1, y + 2, 3, 4, C(f ? '#fff0a0' : '#ffe080')); } } return { c: p.canvas(), ax: 36, ay: 35 }; }); };
EXTRA_SPR.balloons = o => spr('bal' + (o.v % 2), () => { const p = new Pix(22, 40); const cs = o.v % 2 ? ['#ff5a7a', '#7ad8ff', '#ffd040'] : ['#c070ff', '#6aff7a', '#ff8a2a']; [[6, 8], [15, 6], [11, 14]].forEach(([x, y], i) => { p.line(x, y + 5, 11, 38, C('#e8e0d0')); p.ball(x, y, 4, 5, pal([cs[i], cs[i], cs[i], '#ffffff']).map((c, k) => k < 3 ? uMul(c, 0.7 + k * 0.15) : c)); }); return { c: p.canvas(), ax: 11, ay: 39 }; });
EXTRA_SPR.partytable = () => spr('ptable', () => { const p = new Pix(36, 24); p.rect(2, 9, 32, 6, C('#f0e8e0')); p.hl(2, 15, 32, C('#e05a7a')); for (let x = 3; x < 33; x += 4) p.set(x, 16, C('#e05a7a')); p.rect(4, 16, 2, 7, WOOD[1]); p.rect(30, 16, 2, 7, WOOD[1]); p.rect(13, 3, 10, 6, C('#f8d8e8')); p.hl(13, 3, 10, C('#ff8ab0')); p.rect(14, 6, 8, 1, C('#c84a6a')); for (const x of [15, 18, 21]) { p.vl(x, 0, 3, C('#7ad8ff')); p.set(x, 0, C('#ffd040')); } for (const x of [6, 27]) { p.rect(x, 6, 3, 3, C('#ffd040')); } return { c: p.canvas(), ax: 18, ay: 22 }; });
EXTRA_SPR.weddingarch = o => spr('warch' + (o.fl ? 1 : 0), () => { const p = new Pix(48, 50); const wc = C('#f4f0ec'), ws = C('#c8c0b8'); for (const x of [5, 41]) { p.rect(x, 14, 3, 36, wc); p.vl(x + 2, 14, 36, ws); } for (let a = 0; a <= 32; a++) { const t = a / 32 * Math.PI, x = 24 - Math.cos(t) * 18, y = 16 - Math.sin(t) * 13; p.rect(Math.round(x) - 1, Math.round(y) - 1, 3, 3, wc); if (a % 3 === 0) p.set(Math.round(x), Math.round(y) - 2, C(o.fl ? FLOWC[a % FLOWC.length] : (a % 2 ? '#ff8ab0' : '#ffffff'))); if (a % 4 === 1) p.set(Math.round(x) + 1, Math.round(y), C('#5aa040')); } for (const x of [5, 41]) for (let y = 18; y < 48; y += 5) { p.set(x + 1, y, C(o.fl ? FLOWC[y % FLOWC.length] : '#ff8ab0')); p.set(x, y + 1, C('#5aa040')); } return { c: p.canvas(), ax: 24, ay: 49 }; });
EXTRA_SPR.bonfire = () => { const f = Math.floor(G.t * 8) % 3; return spr('bonf' + f, () => { const p = new Pix(28, 30); for (let k = 0; k < 5; k++) p.line(4 + k * 5, 28, 14, 18, WOOD[k % 2 ? 2 : 3]); for (const [x, h] of [[9, 12], [14, 17], [19, 11]]) { p.ell(x + (f === 1 ? 1 : 0), 26 - h / 2, 4, h / 2 + (f === 2 ? 1 : 0), C('#ff6a1a')); p.ell(x, 27 - h / 3, 2, h / 3, C('#ffd040')); } return { c: p.canvas(), ax: 14, ay: 29 }; }); };
OBJSH.windmill = [16, 4]; OBJSH.brazier = [5, 2]; OBJSH.anchor = [7, 2];
// ---------- permanent town decor (each town gets its own identity) ----------
function placeTownDecor(W) {
  const R = new RNG(SEED + 777);
  const freeA = (x, y, rx, ry) => { for (let yy = y - ry; yy <= y + ry; yy++) for (let xx = x - rx; xx <= x + rx; xx++) { if (!W.inb(xx, yy)) return false; const i = W.I(xx, yy); if (SOLID_T[W.ter[i]] || W.objAt[i] >= 0 || W.ter[i] === T.STAIRS || W.ter[i] === T.BRIDGE || (W.flags[i] & 1) || W.ter[i] === T.FARM || W.doors.some(d => Math.abs(d.x - xx) <= 1 && Math.abs(d.y - yy) <= 1)) return false; } return true; };
  const put = (t, k, n, rx, ry, props) => { let c = 0; for (let tries = 0; tries < 900 && c < n; tries++) { const x = R.int(t.x0 + 2, t.x1 - 2), y = R.int(t.y0 + 2, t.y1 - 2); if (!freeA(x, y, rx, ry)) continue; addObj(W, k, x, y, Object.assign({ v: R.int(0, 5) }, props && props(x, y))); c++; } return c; };
  for (const t of TOWNS) {
    if (t.k === 'albor') { put(t, 'windmill', 1, 2, 2, () => ({ fp: [[0, 0], [-1, 0], [1, 0]] })); put(t, 'flowerbed', 10, 1, 1, () => ({ solid: false })); put(t, 'hay', 3, 1, 1); put(t, 'cart', 1, 1, 1, () => ({ fp: [[0, 0], [1, 0]] })); }
    if (t.k === 'puerto') { put(t, 'anchor', 3, 1, 1); put(t, 'crate', 6, 1, 1); put(t, 'barrel', 6, 1, 1); put(t, 'nets', 2, 1, 1); }
    if (t.k === 'arxar') { put(t, 'brazier', 8, 1, 1); put(t, 'statue', 2, 1, 1); put(t, 'banner', 6, 1, 1, () => ({ col: R.pick(['#9a1c2c', '#2a4a9a', '#c8a020']) })); put(t, 'flowerbed', 4, 1, 1, () => ({ solid: false })); }
    if (t.k === 'sahrim') { put(t, 'rug', 6, 1, 1, () => ({ solid: false })); put(t, 'pot', 8, 1, 1, () => ({ col: R.pick(['#ff6080', '#ffe060', '#c070ff', '#ff8a2a']) })); put(t, 'tree', 6, 1, 1, () => ({ sp: 'palma', deco: true })); put(t, 'brazier', 3, 1, 1); }
    if (t.k === 'yarakai') { put(t, 'totem', 5, 1, 1); put(t, 'campfire', 2, 1, 1); put(t, 'tree', 4, 1, 1, () => ({ sp: 'palma', deco: true })); put(t, 'flowerbed', 4, 1, 1, () => ({ solid: false })); }
  }
}
// ---------- townsfolk spawn & routines ----------
function townPlaza(tk) { const t = TOWNS.find(x => x.k === tk), W = G.world; const f = W.objs.find(o => (o.k === 'fountain' || o.k === 'well') && o.tx >= t.x0 && o.tx <= t.x1 && o.ty >= t.y0 && o.ty <= t.y1); if (f) return [f.tx, f.ty + 3]; const w = WAYSTONES.find(x => x.k === tk); return w ? [w.x, w.y + 4] : [(t.x0 + t.x1) >> 1, (t.y0 + t.y1) >> 1]; }
function townPOIs(tk) { const t = TOWNS.find(x => x.k === tk), W = G.world, out = []; for (const o of W.objs) if (o.tx >= t.x0 && o.tx <= t.x1 && o.ty >= t.y0 && o.ty <= t.y1 && ['fountain', 'well', 'bench', 'stall', 'waystone', 'flowerbed', 'statue', 'totem', 'campfire', 'rug', 'anchor', 'windmill', 'brazier', 'cart'].includes(o.k)) out.push({ x: o.px, y: o.py + (o.k === 'bench' ? 0 : 14), bench: o.k === 'bench', k: o.k }); return out; }
function townOK(W, x, y, L) { const tx = Math.floor(x / 16), ty = Math.floor(y / 16); return !blockedFor(W, tx, ty, L) && !blockedFor(W, tx, ty + 1, L); }
function spawnTownfolk(W) {
  for (const tk in TOWNFOLK) { const t = TOWNS.find(x => x.k === tk), R = new RNG(SEED + tk.length * 31 + 5);
    TOWNFOLK[tk].forEach(([k]) => { const id = 'tf_' + k; let x = 0, y = 0, L = t.lvl; for (let tries = 0; tries < 300; tries++) { const tx = R.int(t.x0 + 2, t.x1 - 2), ty = R.int(t.y0 + 2, t.y1 - 2), i = W.I(tx, ty); if (SOLID_T[W.ter[i]] || W.solidO[i] || W.ter[i] === T.STAIRS) continue; x = tx * 16 + 8; y = ty * 16 + 12; L = W.lvl[i]; if (townOK(W, x, y, L)) break; }
      if (x) { const e = spawnNPC(id, x, y, 'world', { L, life: { town: tk, t: Math.random() * 3 } }); } }); }
  for (const e of G.ents) if (e.type === 'npc' && e.map === 'world' && e.wander && !e.life && !e.def.shop) { const t = TOWNS.find(t => e.x / 16 >= t.x0 - 2 && e.x / 16 <= t.x1 + 2 && e.y / 16 >= t.y0 - 2 && e.y / 16 <= t.y1 + 2); if (t) e.life = { town: t.k, t: Math.random() * 3, quest: 1 }; }
}
const LIFE_SAY = ['¡Buenos días!', '¿Qué tal todo?', 'Hace buen día.', 'Ja, ja, ja.', '¿Te has enterado?', '…', '¡No me digas!', 'Mmm…', '¡Qué bien huele el pan!', 'La, la, la…'];
function hourNow() { return (G.time / 60) % 24; }
function lifeUpdate(e, dt) {
  const P = G.P, Lf = e.life, M = G.world, h = hourNow(), cel = celebOf(Lf.town);
  const near = P.map === e.map && dist2(e.x, e.y, P.x, P.y) < 40 * 40;
  if (near && !e.scene) { e.dir = dirFromVec(P.x - e.x, P.y - e.y); if (e.anim !== 'cheer' && e.anim !== 'dance') setAnim(e, 'idle', true); e.wt = null; if (!e.greeted) { e.greeted = 1; if (Math.random() < 0.5) { e.chat = pick2(['¡Hola!', '¡Buenas, aventurero!', '¡Hola, ' + P.name + '!']); e.chatT = G.t; } } stepAnim(e, dt, 2); return; }
  if (!near) e.greeted = 0;
  Lf.t -= dt;
  const plazaPx = () => { const pz = townPlaza(Lf.town); return { x: pz[0] * 16 + 8 + (Math.random() - 0.5) * 70, y: pz[1] * 16 + 8 + (Math.random() - 0.5) * 40 }; };
  if (e.wt) { const dx = e.wt.x - e.x, dy = e.wt.y - e.y, L = Math.hypot(dx, dy);
    if (L < 3) { e.wt = null; const arr = Lf.arrive; Lf.arrive = null; if (arr === 'sit') { setAnim(e, 'sit'); Lf.t = 6 + Math.random() * 6; Lf.pose = 'sit'; } else if (arr === 'party') { Lf.pose = 'party'; Lf.t = 8 + Math.random() * 8; } else if (arr === 'home') { e.hidden = 1; e.map = 'hidden'; return; } else { setAnim(e, 'idle'); Lf.t = 2 + Math.random() * 4; } }
    else { e.dir = dirFromVec(dx, dy); const sp = (e.def.body === 'small' ? 30 : 24) * (cel ? 1.1 : 1); if (!moveEnt(M, e, dx / L * sp * dt, dy / L * sp * dt)) { Lf.stuck = (Lf.stuck || 0) + dt; if (Lf.stuck > 0.8) { e.wt = null; Lf.stuck = 0; Lf.t = 0.5; } } else Lf.stuck = 0; setAnim(e, 'walk', true); } }
  else if (Lf.pose === 'party') { const a = (Math.floor(G.t / 2 + e.x) % 3 === 0) ? 'cheer' : 'dance'; if (A_HAS(e, a)) setAnim(e, a, true); }
  if (!e.wt && Lf.t <= 0) {
    Lf.pose = null; const tf = e.def.tf && !Lf.quest;
    if (tf && (tfOwl(e.id) ? (h >= 1.5 && h < 5.5) : (h >= 23.5 || h < 5.5)) && !cel) { const home = Lf.home || (Lf.home = nearestDoorPx(e)); if (home) { e.wt = home; Lf.arrive = 'home'; return; } }
    if (cel && Math.random() < 0.85) { e.wt = plazaPx(); Lf.arrive = 'party'; }
    else { const r = Math.random(), pois = Lf.pois || (Lf.pois = townPOIs(Lf.town));
      if (r < (Lf.quest ? 0.25 : 0.5) && pois.length) { const p = pois[(Math.random() * pois.length) | 0]; e.wt = { x: p.x + (Math.random() - 0.5) * 20, y: p.y + (p.bench ? 6 : Math.random() * 10) }; Lf.arrive = p.bench ? 'sit' : null; }
      else if (r < 0.7) { const o = G.ents.find(x => x !== e && x.life && x.map === e.map && !x.wt && dist2(x.x, x.y, e.x, e.y) < 120 * 120); if (o) { e.wt = { x: o.x + (e.x < o.x ? -18 : 18), y: o.y }; Lf.talkTo = o; } else Lf.t = 1; }
      else { const R0 = Lf.quest ? 40 : 90; e.wt = { x: e.home.x + (Math.random() - 0.5) * R0 * 2, y: e.home.y + (Math.random() - 0.5) * R0 }; }
      if (e.wt) { const t = TOWNS.find(x => x.k === Lf.town); e.wt.x = clamp(e.wt.x, (t.x0 + 1) * 16, (t.x1 - 1) * 16); e.wt.y = clamp(e.wt.y, (t.y0 + 1) * 16, (t.y1 - 1) * 16); if (Lf.quest && dist(e.wt.x, e.wt.y, e.home.x, e.home.y) > 120) e.wt = { x: e.home.x, y: e.home.y }; }
      Lf.t = 3 + Math.random() * 5; }
  }
  if (!e.wt && Lf.talkTo) { const o = Lf.talkTo; Lf.talkTo = null; if (dist2(o.x, o.y, e.x, e.y) < 40 * 40) { e.dir = dirFromVec(o.x - e.x, o.y - e.y); o.dir = dirFromVec(e.x - o.x, e.y - o.y); o.wt = null; if (o.life) o.life.t = 4; Lf.t = 4; e.chat = pick2(LIFE_SAY); e.chatT = G.t; setTimeout(() => { if (o.map === e.map) { o.chat = pick2(LIFE_SAY); o.chatT = G.t; } }, 1400); } }
  stepAnim(e, dt, e.anim === 'walk' ? 7 : e.anim === 'dance' ? 6 : 2);
}
function A_HAS(e, a) { return e.atlas && e.atlas.idx[a] !== undefined; }
function pick2(a) { return a[(Math.random() * a.length) | 0]; }
function nearestDoorPx(e) { let best = null, bd = 1e12; for (const d of G.world.doors) { if (d.cave) continue; const dd = dist2(d.x * 16 + 8, d.y * 16 + 8, e.x, e.y); if (dd < bd) { bd = dd; best = { x: d.x * 16 + 8, y: (d.y + 1) * 16 + 4 }; } } return bd < 400 * 400 ? best : null; }
// hidden villagers come back in the morning (or for a celebration)
let townT = 0;
function townTick(dt) {
  townT += dt; if (townT < 1) return; townT = 0; const h = hourNow();
  for (const e of G.ents) if (e.type === 'npc' && e.hidden && e.life) { if ((h >= 5.5 && h < 23.5) || celebOf(e.life.town)) { e.hidden = 0; e.map = 'world'; if (e.life.home) { e.x = e.life.home.x; e.y = e.life.home.y - 4; } e.life.t = 0.5; } }
  celebDecor();
}
// ---------- celebrations ----------
const FESTS = { albor: { n: 'Fiesta de la Cosecha', day: 3, deco: 'garland', d: 'Albor celebra la cosecha con bailes y pan recién hecho.' }, puerto: { n: 'Día del Mar', day: 5, deco: 'lanterns', d: 'Los marineros honran al mar con farolillos.' }, arxar: { n: 'Día de la Corona', day: 7, deco: 'garland', d: 'La Ciudadela festeja a su Rey con estandartes.' }, sahrim: { n: 'Noche de las Linternas', day: 2, deco: 'lanterns', d: 'El oasis se ilumina con mil linternas.' }, yarakai: { n: 'Ritual del Jaguar', day: 6, deco: 'bonfire', d: 'Yarakai danza alrededor del fuego sagrado.' } };
function tfBirthday(id) { const h = hash2(id.length * 17, id.charCodeAt(3) * 7 + id.charCodeAt(4), 55); return { m: Math.floor(h * 12), day: 1 + Math.floor(hash2(id.charCodeAt(4), 3, 9) * 7) }; }
const CELEB_CACHE = { d: -1, map: {} };
function celebOf(tk) {
  if (!G.P || !G.P.cal) return null; const d = calDay(); if (CELEB_CACHE.d !== d) { CELEB_CACHE.d = d; CELEB_CACHE.map = {}; }
  if (CELEB_CACHE.map[tk] !== undefined) return CELEB_CACHE.map[tk];
  const D = calDate(), F = FESTS[tk]; let c = null;
  if (typeof townRuled === 'function' && townRuled(tk)) c = null;
  else if (F && D.day === F.day) c = { k: 'fest', n: F.n, d: F.d, deco: F.deco };
  else { const bd = TOWNFOLK[tk].map(r => 'tf_' + r[0]).find(id => { const b = tfBirthday(id); return b.m === D.m && b.day === D.day; });
    const wed = hash2(d * 13 + 7, tk.length * 31, 404) < 0.07;
    if (wed) { const R = new RNG(d * 97 + tk.length); c = { k: 'wed', n: 'Boda en ' + TOWNS.find(t => t.k === tk).n, d: pick2(['¡Hoy se casan ', '¡Gran boda: ']) + R.pick(['Ana', 'Lucía', 'Marta', 'Elena', 'Sofía', 'Inés']) + ' y ' + R.pick(['Pablo', 'Diego', 'Mateo', 'Javier', 'Hugo', 'Leo']) + '!' }; }
    else if (bd) c = { k: 'bday', n: 'Cumpleaños de ' + NPCS[bd].n, d: '¡Hoy ' + NPCS[bd].n + ' cumple años! Hay pastel para todos.', who: bd };
    else if (D.season === 1 && D.day === 1) c = { k: 'flor', n: 'Día de las Flores', d: 'Las calles se llenan de flores por la primavera.' }; }
  if (c && SETTINGS.events === false) c = null;
  return CELEB_CACHE.map[tk] = c;
}
let DECO = [], DECO_KEY = '';
function celebDecor() {
  if (!G.world || !G.P || G.P.ghost) return; const key = calDay() + ':' + TOWNS.map(t => { const c = celebOf(t.k); return c ? c.k : '-'; }).join(',');
  if (key === DECO_KEY) return; DECO_KEY = key; for (const e of DECO) e.remove = true; DECO = [];
  for (const e of G.ents) if (e.weddingNpc) e.remove = true;
  const W = G.world;
  for (const t of TOWNS) { const c = celebOf(t.k); if (!c) continue; const [px, py] = townPlaza(t.k), L = t.lvl;
    const at = (k, dx, dy, props) => { const x = (px + dx) * 16 + 8, y = (py + dy) * 16 + 12; const i = W.I(px + dx, py + dy); if (SOLID_T[W.ter[i]] || W.objAt[i] >= 0) return; const e = Object.assign({ type: 'deco', k2: k, map: 'world', x, y, noShadow: true, v: DECO.length }, props || {}); G.ents.push(e); DECO.push(e); };
    if (c.k === 'fest') { if (c.deco === 'bonfire') { at('bonfire', 0, 2, { glow: 60, glowC: 'rgba(255,150,60,0.6)' }); at('garland', -5, -1); at('garland', 5, -1); } else { at(c.deco, -4, -2); at(c.deco, 4, -2); at(c.deco, 0, 5); } at('partytable', 3, 2); at('balloons', -3, 2); }
    if (c.k === 'bday') { at('partytable', 0, 2); at('balloons', -2, 1); at('balloons', 2, 1, { v: 1 }); at('garland', 0, -2); }
    if (c.k === 'flor') { for (const [dx, dy] of [[-4, 0], [4, 0], [-2, 3], [2, 3], [0, -2]]) at('flowerpot', dx, dy); at('weddingarch', 0, 4, { fl: 1 }); }
    if (c.k === 'wed') { at('weddingarch', 0, 0); at('partytable', -4, 2); at('partytable', 4, 2); at('balloons', -2, -1); at('balloons', 2, -1, { v: 1 }); at('garland', 0, 4);
      const R = new RNG(calDay() * 7 + t.k.length); const bride = spawnNPC('novia', (px - 0.6) * 16 + 8, py * 16 + 20, 'world', { L, face: 'down' }), groom = spawnNPC('novio', (px + 0.6) * 16 + 8, py * 16 + 20, 'world', { L, face: 'down' }); for (const e of [bride, groom]) if (e) { e.weddingNpc = 1; e.scene = 1; } }
  }
}
EXTRA_SPR.flowerpot = o => spr('fpot' + (o.v % 3), () => { const p = new Pix(14, 16); p.poly([[3, 9], [11, 9], [10, 15], [4, 15]], C('#b85a2a')); p.hl(3, 9, 9, C('#d8783a')); for (let k = 0; k < 7; k++) { const x = 3 + k, y = 3 + (k * 5) % 5; p.vl(x + 1, y + 2, 9 - y - 2, C('#3a8a2a')); p.ball(x + 1, y + 1, 1.6, 1.6, pal([FLOWC[(k + o.v) % 6], FLOWC[(k + o.v) % 6], FLOWC[(k + o.v) % 6], '#ffffff'])); } return { c: p.canvas(), ax: 7, ay: 15 }; });
function drawDeco(e, cx, cy) { const s = (EXTRA_SPR[e.k2] || (() => null))(e); if (!s) return; ctx.drawImage(s.c, Math.round(e.x - s.ax - cx), Math.round(e.y + (e.dyOff || 0) - s.ay - cy)); if (e.k2 === 'bonfire' && Math.random() < 0.3) part(e.x + (Math.random() - 0.5) * 10, e.y - 10, { vz: 30, life: 0.7, c: Math.random() < 0.5 ? '#ff8a2a' : '#ffd040', s: 1 }); if ((e.k2 === 'weddingarch' && !e.fl) && Math.random() < 0.08) burst(e.x + (Math.random() - 0.5) * 40, e.y - 40, 2, { sp: 20, up: 10, g: 20, life: 1.4, c: ['#ff8ab0', '#ffffff', '#ffd040', '#7ad8ff'] }); }
NPCS.novia = { n: 'Novia', title: 'Recién casada', look: LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'dress', main: P5(['#a8a0a8', '#d0c8d0', '#ece6ec', '#f8f4f8', '#ffffff']), sec: P5(['#c84a6a', '#e86a8a', '#ff8ab0', '#ffb0c8', '#ffe0ea'])}), lines: ['¡Es el día más feliz de mi vida!', '¡Gracias por venir a nuestra boda!'] };
NPCS.novio = { n: 'Novio', title: 'Recién casado', look: LK({ hair: HAIRS.negro, outfit: 'royal', main: P5(['#0a0a10', '#16161e', '#22222e', '#30303e', '#40404e']), sec: P5(['#a8a0a8', '#d0c8d0', '#ece6ec', '#f8f4f8', '#ffffff']) }), lines: ['¡Me he casado con la mejor persona del mundo!', 'Toma un trozo de pastel, invita la casa.'] };
// what happens when you talk to someone during a celebration
function celebTalk(e) {
  const P = G.P, tk = e.life ? e.life.town : (e.weddingNpc ? (TOWNS.find(t => e.x / 16 >= t.x0 - 3 && e.x / 16 <= t.x1 + 3 && e.y / 16 >= t.y0 - 3 && e.y / 16 <= t.y1 + 3) || {}).k : null); if (!tk) return;
  const c = celebOf(tk); if (!c) return; P.celebGot = P.celebGot || {}; const key = calDay() + ':' + tk;
  if (c.k === 'bday' && e.id === c.who && !P.celebGot[key]) { P.celebGot[key] = 1; giveItem('pastel', 1); toast('¡' + e.def.n + ' te da un trozo de pastel de cumpleaños!', 'quest'); burst(e.x, e.y - 20, 20, { sp: 50, up: 60, g: 60, life: 1, c: FLOWC }); }
  else if (c.k === 'wed' && e.weddingNpc && !P.celebGot[key]) { P.celebGot[key] = 1; giveItem('ramo', 1); toast('¡Los novios te regalan un ramo de flores!', 'quest'); burst(e.x, e.y - 20, 24, { sp: 60, up: 70, g: 60, life: 1.2, c: ['#ff8ab0', '#ffffff', '#ffd040'] }); }
  else if (c.k === 'fest' && !P.celebGot[key]) { P.celebGot[key] = 1; addBuff(P, 'festivo', { atkP: 8, spdP: 8 }, 600); toast('¡Espíritu festivo! +8% ataque y velocidad durante 10 min', 'quest'); }
  else if (c.k === 'flor' && !P.celebGot[key]) { P.celebGot[key] = 1; giveItem('ramo', 1); toast('¡Te regalan flores por el Día de las Flores!', 'quest'); }
  e.chat = c.k === 'bday' ? (e.id === c.who ? '¡Gracias por venir a mi fiesta!' : '¡Feliz cumpleaños, ' + NPCS[c.who].n + '!') : c.k === 'wed' ? '¡Vivan los novios!' : c.k === 'fest' ? '¡Feliz ' + c.n + '!' : '¡Qué bonitas están las flores!'; e.chatT = G.t;
}
let lastCelebBanner = '';
function celebEnterTown(tk) { const c = celebOf(tk); if (!c) return; const key = calDay() + tk; if (lastCelebBanner === key) return; lastCelebBanner = key; setTimeout(() => { banner(c.n, c.d); sfx('quest'); }, 1600); }
// shop discount during the town festival
{ const _tpm = townPriceMul; townPriceMul = function (tk) { const c = tk && celebOf(tk); return _tpm(tk) * (c && c.k === 'fest' ? 0.85 : 1); }; }
{ const _od = openDialog; openDialog = function (e) { if (e && e.type === 'npc') celebTalk(e); return _od.apply(this, arguments); }; }
// ---------- job perks (milestones make every job feel better as it levels) ----------
const JOB_PERKS = {
  tala: [[10, 'Hacha ligera: talas un 15% más rápido'], [25, 'Leñador experto: +10% de probabilidad de tronco doble'], [45, 'Tesoro del bosque: 5% de probabilidad de encontrar oro entre las raíces']],
  mineria: [[10, 'Golpe certero: minas un 15% más rápido'], [25, 'Ojo de joyero: 4% de probabilidad de sacar una gema'], [45, 'Veta rica: +10% de probabilidad de mineral doble']],
  herbo: [[15, 'Manos verdes: +10% de probabilidad de hierba doble'], [35, 'Herbolario: 6% de probabilidad de una hierba superior']],
  pesca: [[20, 'Paciencia: los peces pican antes'], [40, 'Cofre hundido: 6% de probabilidad de pescar un cofre con oro']],
  herreria: [[20, 'Forja eficiente: −15% de oro al forjar'], [40, 'Temple perfecto: 10% de probabilidad de devolver un material']],
  alquimia: [[20, 'Destilado doble: 15% de probabilidad de una poción extra'], [40, 'Ahorro alquímico: −15% de oro']],
  cocina: [[20, 'Ración extra: 15% de probabilidad de un plato extra'], [40, 'Chef ahorrador: −15% de oro']],
  joyeria: [[20, 'Pulido fino: −15% de oro'], [40, 'Gema sobrante: 10% de probabilidad de devolver un material']],
  sastreria: [[20, 'Hilo fino: −15% de oro'], [40, 'Retales: 10% de probabilidad de devolver un material']],
  excavacion: [[15, 'Pala veloz: excavas un 15% más rápido'], [35, 'Arqueólogo: +10% de probabilidad de doble hallazgo']],
  agricultura: [[15, 'Abono: +1 cosecha extra a veces'], [35, 'Semillero: +15% de probabilidad de recuperar semillas']],
};
function perk(job, lv) { const P = G.P; return !!(P && P.jobs[job] && P.jobs[job].lv >= lv); }
function perkLine(job) { return (JOB_PERKS[job] || []).map(([lv, t]) => `<span class="perk ${perk(job, lv) ? 'on' : ''}">${perk(job, lv) ? '✓' : 'Nv.' + lv} ${esc(t)}</span>`).join(''); }
function jobHarvestBonus(kind, tier, o) {
  const P = G.P; petOnHarvest(kind, tier);
  if (kind === 'mineria' && perk('mineria', 25) && Math.random() < 0.04) { const g = tier >= 10 ? 'opalo' : tier >= 7 ? 'diamante' : tier >= 4 ? 'esmeralda' : 'rubi'; if (ITEMS[g]) { giveItem(g, 1); toast('¡Has encontrado una gema!', 'loot', 3); } }
  if (kind === 'tala' && perk('tala', 45) && Math.random() < 0.05) { const g = 20 + tier * 30; P.gold += g; floatText(P.x, P.y - 40, '+' + g + ' ORO', '#ffd040'); }
  if (((kind === 'tala' && perk('tala', 25)) || (kind === 'mineria' && perk('mineria', 45))) && Math.random() < 0.1) giveItem((kind === 'tala' ? 'log' : 'ore') + tier, 1, true);
}
{ const _dc = doCraft; doCraft = function (r) { const P = G.P, cheap = (r.job === 'herreria' && perk('herreria', 20)) || ((r.job === 'alquimia' || r.job === 'cocina') && perk(r.job, 40)) || ((r.job === 'joyeria' || r.job === 'sastreria') && perk(r.job, 20)); const g0 = r.gold; let ok = false; const before = countItem(r.out);
  if (cheap) r.gold = Math.round(g0 * 0.85); try { _dc(r); } finally { r.gold = g0; } ok = countItem(r.out) > before; if (!ok) return;
  if ((r.job === 'alquimia' || r.job === 'cocina') && perk(r.job, 20) && ITEMS[r.out].stack && Math.random() < 0.15) { giveItem(r.out, 1); toast('¡Te ha salido uno extra!', 'job'); }
  if (['herreria', 'joyeria', 'sastreria'].includes(r.job) && perk(r.job, 40) && Math.random() < 0.1) { const m = matsFor(r).find(([id]) => ITEMS[id] && ITEMS[id].stack); if (m) { giveItem(m[0], 1, true); toast('Recuperas 1 ' + ITEMS[m[0]].n, 'job'); } } }; }
{ const _fc = fishCaught; fishCaught = function (fish) { _fc(fish); const P = G.P; if (perk('pesca', 40) && Math.random() < 0.06) { const g = 40 + fish[2] * 60; P.gold += g; toast('¡Un cofre hundido! +' + g + ' oro', 'loot', 3); sfx('coin'); } }; }
