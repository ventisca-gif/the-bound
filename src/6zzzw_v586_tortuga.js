// ================= v5.86: LA TORTUGA GLOTONA (restaurante flotante) + NADAR EN EL MAR DE DAWN =================
// Sergio aprobó la muestra (tools/art/muestras/muestra_tortuga.js) y pidió: ponerla flotando cerca de Foosha, que se
// pueda entrar, con piratas y NPCs, por dentro estilo «restaurante de juego de gestión» (salas de colores vistas desde
// arriba), meseros atendiendo mesas, una vitrina con comida gigante (su foto del buffet) y poder nadar por el mar de Dawn.
// Diseño propio: la tortuga, las salas, los NPCs y los nombres son originales.
//  · Exterior: barco-tortuga en el mar de Dawn (TG_AT), dibujado con DL_HOOKS (se ordena con el bote). Casco sólido.
//  · Se sube con el bote, el galeón o nadando por la escalerilla del muelle de popa (XACT tort_board).
//  · Interior 'tortuga' (48×36): Bar Pirata, Jardín del Caparazón, Terraza, Gran Comedor, Recepción con la vitrina y Cocina.
//  · Meseros que llevan platos de la cocina a las mesas, clientes sentados que comentan, cocineros y la chef.
//  · Turno de mesero (ACT 'tgm', dentro del mapa): coges platos en el pase con ⚔ y los llevas a las mesas que piden.
//  · Nadar (helm 'swim'): tírate al agua desde el bote o desde la orilla; vuelve al bote o sal en la costa de Foosha
//    (salir a tierra pide la Fruta del Diablo, como desembarcar). Con una fruta comida te hundes: pierdes vida y te rescatan.
SAVEKEYS.push('tgServe');
const TG_AT = [580, 296], TG_DOCK = [588, 297], TG_W = 48, TG_H = 36;
const TG_NAME = L2('La Tortuga Glotona', 'The Gluttonous Turtle');
// ---------- exterior ----------
function tgShipPix() {
  const W = 230, H = 162, p = new Pix(W, H), SEA = 156;
  const shell = pal(['#2e3a1a', '#4a5a26', '#6a7a34', '#8c9a48', '#b0bc66']), skin = pal(['#2a5a4a', '#3e7a62', '#5a9a7a', '#80bc96', '#a8dab4']);
  const coral = pal(['#7a3020', '#b04a34', '#d8694a', '#ee8a66', '#ffb08c']), cream = pal(['#8a7a5a', '#b8a67e', '#dccaa0', '#f0e2be', '#fff6dc']);
  const terra = pal(['#5a2412', '#84361c', '#a84a26', '#c86434', '#e08a54']), wood = pal(['#3a2414', '#5a3820', '#7a502c', '#9a6a3a', '#ba8a52']);
  const white = C('#f4f2ea'), whiteS = C('#b8b4aa'), glass = pal(['#1e3a5a', '#3a6a9a', '#7ab0d8', '#d0ecff']), gold = pal(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), red = pal(['#5a0e10', '#9a1c1e', '#d0302c', '#f0605a']);
  for (const [mx, top] of [[40, 26], [190, 30]]) {
    p.rect(mx - 1, top, 3, 122 - top, wood[2]); p.vl(mx - 1, top, 122 - top, wood[3]); p.vl(mx + 1, top, 122 - top, wood[1]);
    for (const [sy, sw, sh] of [[top + 10, 34, 22], [top + 40, 40, 26]]) {
      p.rect(mx - sw / 2 - 1, sy - 2, sw + 2, 2, wood[1]);
      for (let y = 0; y < sh; y++) { const bul = Math.round(Math.sin(y / sh * Math.PI) * 3); for (let x = -sw / 2 - bul; x < sw / 2 + bul; x++) p.set(mx + x, sy + y, cream[x < -sw / 2 + 3 ? 2 : x > sw / 2 - 4 ? 1 : (x + 40) % 9 === 0 ? 2 : 3]); }
      const ex = mx, ey = sy + sh / 2 + 1; p.ell(ex, ey, 6, 3.4, red[2]); p.hl(ex - 6, ey - 1, 13, red[3]); p.rect(ex - 7, ey - 2, 15, 1, red[1]); p.rect(ex - 2, ey + 3, 5, 1, red[1]);
      for (const k of [-3, 0, 3]) { p.set(ex + k, ey - 4, cream[0]); p.set(ex + k + 1, ey - 5, cream[0]); p.set(ex + k, ey - 6, cream[0]); }
    }
    p.poly([[mx + 1, top - 8], [mx + 14, top - 5], [mx + 1, top - 2]], C('#2a9a8a')); p.vl(mx, top - 9, 9, wood[1]);
    p.line(mx, top, mx < 115 ? 70 : 160, 92, wood[0]);
  }
  const cen = []; for (let r = 0; r < 4; r++) for (let k = -5; k <= 5; k++) cen.push([115 + k * 22 + (r % 2) * 11, 100 + r * 17]);
  for (let y = 104; y <= SEA + 4; y++) for (let x = 26; x <= 204; x++) { const dx = (x - 115) / 89, dy = (y - SEA) / 52; if (dx * dx + dy * dy > 1) continue;
    let d1 = 1e9, d2 = 1e9, best = null; for (const c of cen) { const d = Math.hypot((x - c[0]) * 0.8, y - c[1]); if (d < d1) { d2 = d1; d1 = d; best = c; } else if (d < d2) d2 = d; }
    const edge = d2 - d1; let c = shell[dx < -0.45 ? 3 : dx > 0.5 ? 1 : 2];
    if (edge < 1.2) c = shell[0]; else if (edge < 2.4 && y < best[1]) c = shell[4]; else if (d1 < 3.5) c = shell[dx > 0.5 ? 2 : 3];
    if (dx * dx + dy * dy > 0.93 && edge >= 1.2) c = shell[1]; p.set(x, y, c); }
  for (let x = 30; x <= 200; x++) { const dx = (x - 115) / 85, yy = Math.round(SEA - 6 + dx * dx * 3); p.set(x, yy, cream[4]); p.set(x, yy + 1, cream[3]); p.set(x, yy + 2, cream[2]); p.set(x, yy + 3, cream[1]); }
  p.ball(18, 130, 15, 12, skin); p.ball(30, 140, 10, 9, skin);
  p.ell(12, 126, 3, 3.5, white); p.ell(12, 127, 1.6, 2.2, C('#101418')); p.set(11, 125, white);
  for (let k = 0; k < 12; k++) { const yy = 134 + Math.round(Math.sin(k / 11 * Math.PI) * 3); p.set(4 + k, yy, skin[0]); if (k > 2 && k < 9) p.set(4 + k, yy - 1, C('#8a2a2a')); }
  p.set(6, 131, C('#e07a7a')); p.set(7, 131, C('#e07a7a'));
  p.poly([[44, SEA - 2], [60, SEA - 4], [70, SEA + 6], [40, SEA + 8]], skin[2]); p.poly([[166, SEA - 3], [186, SEA - 2], [196, SEA + 7], [160, SEA + 6]], skin[1]);
  const tier = (x0, x1, y0, y1, win) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x <= x1; x++) { const t = (x - x0) / (x1 - x0); p.set(x, y, coral[t < 0.12 ? 4 : t > 0.85 ? 1 : t > 0.7 ? 2 : 3]); }
    p.hl(x0, y1 - 1, x1 - x0 + 1, coral[0]);
    for (let x = x0 + 8; x < x1 - 6; x += win) { const cy = Math.round((y0 + y1) / 2); p.ell(x, cy, 3.2, 3.2, cream[3]); p.ell(x, cy, 2.2, 2.2, glass[2]); p.set(x - 1, cy - 1, glass[3]); p.set(x + 1, cy + 1, glass[1]); }
    p.rect(x0 - 4, y0 - 2, x1 - x0 + 9, 2, terra[3]); p.hl(x0 - 4, y0 - 1, x1 - x0 + 9, terra[1]);
    p.hl(x0 - 4, y0 - 6, x1 - x0 + 9, white); for (let x = x0 - 4; x <= x1 + 4; x += 3) p.vl(x, y0 - 6, 4, (x & 1) ? whiteS : white);
  };
  p.rect(56, 108, 120, 4, wood[3]); p.hl(56, 108, 120, wood[4]); p.hl(56, 111, 120, wood[1]);
  tier(62, 168, 80, 108, 14); tier(74, 156, 56, 80, 13); tier(86, 144, 36, 56, 12);
  p.rect(108, 92, 14, 16, wood[1]); p.ell(115, 92, 7, 5, wood[1]); p.vl(115, 89, 19, wood[0]); p.set(112, 100, gold[3]); p.set(118, 100, gold[3]);
  p.ell(115, 84, 9, 4, gold[2]); p.ell(115, 84, 7, 2.6, terra[1]);
  p.line(106, 54, 124, 38, gold[3]); p.line(107, 54, 125, 38, gold[1]); p.ell(125, 37, 3, 4, gold[3]); p.set(124, 35, gold[4]);
  p.line(124, 54, 106, 38, gold[3]); p.line(125, 54, 107, 38, gold[1]); for (const k of [-2, 0, 2]) p.vl(105 + k, 33, 5, gold[3]); p.hl(103, 38, 5, gold[2]);
  for (let y = 18; y < 36; y++) { const w = Math.round(Math.sqrt(Math.max(0, 1 - ((36 - y) / 18) ** 2)) * 24); for (let x = 115 - w; x <= 115 + w; x++) p.set(x, y, cream[x < 115 - w * 0.5 ? 4 : x > 115 + w * 0.5 ? 1 : 3]); }
  p.ball(115, 16, 3, 3, gold); p.rect(130, 14, 6, 12, terra[2]); p.hl(129, 13, 8, terra[4]);
  for (const [a, b] of [[[40, 50], [74, 58]], [[190, 54], [156, 58]]]) for (let k = 0; k <= 6; k++) { const t = k / 6, x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 6); p.set(x, y, wood[0]); if (k % 2 === 1) { p.ell(x, y + 3, 2, 2.4, k % 4 === 1 ? red[2] : gold[2]); p.set(x - 1, y + 2, k % 4 === 1 ? red[3] : gold[4]); } }
  p.rect(200, SEA - 6, 28, 4, wood[3]); p.hl(200, SEA - 6, 28, wood[4]); for (const x of [204, 214, 224]) p.rect(x, SEA - 2, 2, 4, wood[1]);
  for (let y = SEA - 5; y < SEA - 1; y++) { p.set(222, y - 4, wood[2]); p.set(226, y - 4, wood[2]); } p.hl(222, SEA - 7, 5, wood[3]);
  p.outline(OUTL);
  // espuma en la línea del agua
  for (let x = 24; x <= 206; x++) if ((x * 5) % 7 < 4) p.set(x, SEA + 1 + ((x >> 3) & 1), C('#f2fbff'));
  return { c: p.canvas(), ax: 115, ay: SEA };
}
const tgShipSpr = () => spr('tg:ship', tgShipPix);
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M || !M.dawn) return; const x = TG_AT[0] * 16 + 8, y = TG_AT[1] * 16 + 8;
  if (x < cx - 160 || x > cx + VW + 160 || y < cy - 20 || y > cy + VH + 200) return;
  list.push({ type: 'xdraw', x, y, draw: (e, cx2, cy2) => { const s = tgShipSpr(); ctx.drawImage(s.c, Math.round(e.x - cx2 - s.ax), Math.round(e.y - cy2 - s.ay)); } }); });
// el casco no se atraviesa con el bote
{ const _md = makeDawn; makeDawn = function () { const M = _md.apply(this, arguments); if (!M.tgHull) { M.tgHull = 1; const [x0, y0] = TG_AT;
  for (let y = y0 - 2; y <= y0 + 1; y++) for (let x = x0 - 6; x <= x0 + 5; x++) { const i = M.I(x, y); if (M.ter[i] === T.DEEP) M.ter[i] = T.IWALL; } } return M; }; }

// ---------- NPCs (motor de personajes nativo, como los de Foosha) ----------
const TG_CAST = {
  tg_chef: { n: L2('Chef Brígida «Cucharón»', 'Chef Brígida "Ladle"'), g: 'f', bt: 3, hair: 'castano', skin: 1, hs: 12, top: 'blanco', bot: 'gris', hat: 'band' },
  tg_maitre: { n: L2('Madame Perla', 'Madame Perla'), g: 'f', bt: 1, hair: 'platino', skin: 0, hs: 30, top: 'turquesa', bot: 'blanco' },
  tg_mesero1: { n: L2('Tomás, mesero', 'Tomás, waiter'), bt: 1, hair: 'negro', skin: 2, hs: 3, top: 'blanco', bot: 'negro' },
  tg_mesero2: { n: L2('Lía, mesera', 'Lía, waitress'), g: 'f', bt: 0, hair: 'rubio', skin: 0, hs: 5, top: 'blanco', bot: 'negro' },
  tg_mesero3: { n: L2('Nico, mesero', 'Nico, waiter'), bt: 0, hair: 'naranja', skin: 1, hs: 8, top: 'blanco', bot: 'negro' },
  tg_cocinero1: { n: L2('Pinche Ramiro', 'Kitchen hand Ramiro'), bt: 2, hair: 'negro', skin: 3, hs: 0, top: 'blanco', bot: 'gris', hat: 'band' },
  tg_cocinero2: { n: L2('Pinche Olga', 'Kitchen hand Olga'), g: 'f', bt: 2, hair: 'cobre', skin: 1, hs: 2, top: 'blanco', bot: 'gris', hat: 'band' },
  tg_barman: { n: L2('Gus el del ron', 'Gus the rum man'), bt: 3, hair: 'gris', skin: 2, hs: 9, top: 'granate', bot: 'marron', hat: 'band' },
  tg_pir1: { n: L2('Pirata Barbarroja Chico', 'Little Redbeard pirate'), bt: 2, hair: 'rojo', skin: 1, hs: 9, top: 'rojo', bot: 'negro', kind: 'pirate' },
  tg_pir2: { n: L2('Pirata Garfio de Pan', 'Breadhook pirate'), bt: 3, hair: 'negro', skin: 2, hs: 0, top: 'amarillo', bot: 'gris', kind: 'pirate', hat: 'band' },
  tg_pir3: { n: L2('Pirata Ojo de Sardina', 'Sardine-eye pirate'), bt: 4, hair: 'castano', skin: 3, hs: 5, top: 'azul', bot: 'beige', kind: 'pirate' },
  tg_pir4: { n: L2('Pirata Rosa Tormenta', 'Storm Rose pirate'), g: 'f', bt: 1, hair: 'rosa', skin: 0, hs: 8, top: 'negro', bot: 'rojo', kind: 'pirate' },
  tg_pir5: { n: L2('Pirata Dientes de Oro', 'Gold-tooth pirate'), bt: 1, hair: 'rubio', skin: 1, hs: 3, top: 'verde', bot: 'marron', kind: 'pirate', hat: 'band' },
  tg_pir6: { n: L2('Pirata Ancla Loca', 'Mad Anchor pirate'), g: 'f', bt: 3, hair: 'morado', skin: 2, hs: 12, top: 'marino', bot: 'gris', kind: 'pirate' },
  tg_cli1: { n: L2('Comensal de Foosha', 'Foosha diner'), g: 'f', bt: 0, hair: 'castano', skin: 0, hs: 4, top: 'rosa', bot: 'blanco' },
  tg_cli2: { n: L2('Pescador hambriento', 'Hungry fisherman'), bt: 2, hair: 'gris', skin: 2, hs: 0, top: 'oliva', bot: 'beige' },
  tg_cli3: { n: L2('Viajera del Mar de Dawn', 'Dawn Sea traveller'), g: 'f', bt: 2, hair: 'turquesa', skin: 1, hs: 20, top: 'amarillo', bot: 'azul' },
  tg_cli4: { n: L2('Marinero de permiso', 'Sailor on leave'), bt: 1, hair: 'castano', skin: 1, hs: 5, top: 'blanco', bot: 'marino' },
  tg_cli5: { n: L2('Niño glotón', 'Greedy kid'), bt: 0, hair: 'negro', skin: 1, hs: 1, top: 'naranja', bot: 'azul' },
  tg_cli6: { n: L2('Abuela crítica de cocina', 'Food-critic granny'), g: 'f', bt: 4, hair: 'blanco', skin: 0, hs: 6, top: 'morado', bot: 'gris' }
};
const TG_LINES = {
  tg_chef: [L2('¡En mi cocina nadie se queda con hambre, ni los piratas que no pagan!', 'Nobody leaves my kitchen hungry, not even the pirates who don\'t pay!'), L2('La tortuga se llama Bocona. Nos lleva por todo el Mar de Dawn mientras cocinamos.', 'The turtle is called Bigmouth. She carries us across the Dawn Sea while we cook.')],
  tg_maitre: [L2('Bienvenido a La Tortuga Glotona. ¿Mesa para uno? Si te sobra tiempo, me falta un mesero.', 'Welcome to the Gluttonous Turtle. Table for one? If you have time, I\'m one waiter short.')],
  tg_barman: [L2('Ron de coco, ron de piña o ron de ron. Aquí los piratas firman la paz a cucharadas.', 'Coconut rum, pineapple rum or rum rum. Here pirates sign peace treaties one spoonful at a time.')],
  tg_mesero1: [L2('¡Plato caliente, paso, paso!', 'Hot plate, coming through!')], tg_mesero2: [L2('La mesa del fondo pidió tres postres... para cada uno.', 'The back table ordered three desserts... each.')], tg_mesero3: [L2('En la terraza se ve Foosha al atardecer.', 'From the terrace you can see Foosha at sunset.')],
  tg_cocinero1: [L2('Sopa de algas, la favorita de Bocona.', 'Seaweed soup, Bigmouth\'s favourite.')], tg_cocinero2: [L2('¿Has visto la vitrina? La pierna de carne es de verdad... casi.', 'Seen the showcase? The meat leg is real... almost.')]
};
const TG_CHAT = [L2('¡Qué rico!', 'Yummy!'), L2('¡Otra ración!', 'Another serving!'), L2('¡Brindo por el mar!', 'A toast to the sea!'), L2('Esa carne es enorme', 'That meat is huge'), L2('¡Mesero!', 'Waiter!'), L2('Aquí no se pelea, se come', 'No fighting here, just eating'), L2('¡Ja, ja, ja!', 'Ha ha ha!'), L2('Pago con un tesoro', 'I\'ll pay with treasure')];
for (const id in TG_CAST) { DAWN_CAST[id] = TG_CAST[id]; NPCS[id] = { n: TG_CAST[id].n, title: TG_NAME, look: LK({}), quests: [], lines: TG_LINES[id] || [TG_CHAT[(id.length * 3) % TG_CHAT.length]] }; }
{ const old = npcAtlas; npcAtlas = function (id) { return TG_CAST[id] ? getAtlas('TG:' + id, () => buildAtlas(dawnLook(id), ['idle', 'walk', 'sit'], drawHero)) : old.apply(this, arguments); }; }

// ---------- muebles (dibujados en código, con contorno) ----------
const TGP = { mantel: pal(['#8a6a10', '#c09a20', '#ecc83c', '#fae070', '#fff4b0']), madera: pal(['#3a2414', '#5a3820', '#7a502c', '#9a6a3a', '#ba8a52']), rosa: pal(['#6a1a3a', '#9a2a56', '#c84a78', '#e8789a', '#ffb0c8']), acero: pal(['#3a4048', '#5a646e', '#8a96a0', '#b8c2ca', '#e4ecf0']), blanco: pal(['#9a968c', '#c4c0b4', '#e4e0d4', '#f4f2ea', '#ffffff']), verde: pal(['#1e4a22', '#2e6a2e', '#4a8a3a', '#6aac4a', '#9ad06a']), mar: pal(['#1a3a6a', '#2a5a9a', '#3a7ac0', '#6aa8e0', '#a8d8ff']) };
const TG_FOOD = [[C('#8a3a1a'), C('#c86a3a')], [C('#e0a020'), C('#fff0a0')], [C('#3a8a2a'), C('#e04a3a')], [C('#e8e0c8'), C('#d84a4a')], [C('#6a3a8a'), C('#f0c040')], [C('#c84a1a'), C('#f0d080')]];
function tgPlate(p, x, y, k) { const F = TG_FOOD[k % TG_FOOD.length]; p.ell(x, y, 3.6, 2, TGP.blanco[4]); p.ell(x, y, 3.6, 2, TGP.blanco[3]); p.hl(x - 3, y + 1, 7, TGP.blanco[1]); p.ell(x, y - 0.6, 2, 1.3, F[0]); p.set(x - 1, y - 1, F[1]); p.set(x + 1, y - 1, F[1]); }
const tgX = (w, h, ax, ay, fn) => () => { const p = new Pix(w, h); fn(p); p.outline(OUTL); return { c: p.canvas(), ax, ay }; };
for (let v = 0; v < 4; v++) XSPR['tg_mesa' + v] = tgX(30, 26, 15, 22, p => { const M = v === 3 ? TGP.madera : TGP.mantel; p.rect(13, 14, 4, 9, TGP.madera[1]); p.hl(10, 23, 10, TGP.madera[2]);
  p.ell(15, 11, 13, 7, M[1]); p.ell(15, 10, 13, 6.4, M[3]); p.ell(13, 9, 8, 3.5, M[4]); if (v !== 3) for (let x = 3; x < 28; x += 3) p.set(x, 15 + ((x >> 1) & 1), M[2]);
  tgPlate(p, 9, 10, v); tgPlate(p, 21, 10, v + 2); p.rect(14, 5, 2, 5, C('#e8f0ff')); p.set(14, 4, C('#ffd060')); });
XSPR.tg_sofa = tgX(34, 20, 17, 18, p => { const R = TGP.rosa; p.rect(2, 2, 30, 8, R[3]); p.hl(2, 2, 30, R[4]); p.rect(1, 9, 32, 7, R[2]); p.hl(1, 9, 32, R[4]); p.rect(1, 2, 3, 14, R[1]); p.rect(30, 2, 3, 14, R[1]); p.hl(1, 16, 32, TGP.madera[1]); for (const x of [10, 22]) p.vl(x, 3, 6, R[2]); });
XSPR.tg_vitrina = tgX(118, 52, 59, 48, p => {
  // mostrador largo de madera con luz, y encima la comida gigante (pierna de carne, tentáculo, langosta, pescado, jamón, calabaza)
  p.rect(2, 34, 114, 14, TGP.madera[2]); p.hl(2, 34, 114, TGP.madera[4]); p.hl(2, 47, 114, TGP.madera[0]); for (let x = 6; x < 114; x += 8) p.vl(x, 36, 11, TGP.madera[1]);
  p.rect(2, 30, 114, 4, TGP.verde[2]); for (let x = 3; x < 114; x += 2) p.set(x, 30, TGP.verde[(x % 3) + 2]); p.hl(2, 38, 114, C('#ffe8a0'));
  // pierna de carne con hueso
  p.ball(16, 22, 11, 8, pal(['#5a1a10', '#8a3020', '#b04a30', '#d0704a'])); p.ell(16, 22, 5, 3, C('#e8b0a0')); p.rect(26, 20, 10, 3, TGP.blanco[3]); p.ball(36, 19, 2.5, 2.5, TGP.blanco); p.ball(36, 24, 2.5, 2.5, TGP.blanco);
  // tentáculo rosa que se enrolla
  for (let k = 0; k < 26; k++) { const a = k * 0.32, r = 12 - k * 0.38, x = 50 + Math.cos(a) * r * 0.6, y = 18 - k * 0.35 + Math.sin(a) * r * 0.5; p.ball(x, y, 3 - k * 0.06, 3 - k * 0.06, TGP.rosa.slice(1)); if (k % 4 === 0) p.set(Math.round(x), Math.round(y + 1), TGP.rosa[4]); }
  // langosta roja
  p.ball(70, 16, 6, 12, pal(['#6a0a0a', '#a01818', '#d0302c', '#f06a5a'])); p.ball(64, 6, 3, 4, pal(['#6a0a0a', '#a01818', '#d0302c', '#f06a5a'])); p.ball(76, 6, 3, 4, pal(['#6a0a0a', '#a01818', '#d0302c', '#f06a5a'])); for (let y = 10; y < 28; y += 4) p.hl(66, y, 9, C('#801010'));
  // pescado plateado
  p.ball(86, 24, 8, 4.5, TGP.acero.slice(1)); p.poly([[93, 24], [99, 19], [99, 29]], TGP.acero[2]); p.set(81, 23, C('#101418')); p.hl(80, 26, 4, TGP.mar[3]);
  // jamón y calabaza
  p.ball(101, 18, 6, 7, pal(['#6a2a1a', '#a04a3a', '#d07060', '#f0a090'])); p.ell(101, 18, 2.5, 3, C('#f8e0d0'));
  p.ball(110, 24, 6, 5, TGP.verde.slice(1)); for (const x of [107, 110, 113]) p.vl(x, 20, 8, TGP.verde[0]); p.rect(109, 17, 2, 3, TGP.madera[2]);
});
XSPR.tg_fogon = tgX(34, 30, 17, 26, p => { const A = TGP.acero; p.rect(1, 8, 32, 18, A[2]); p.hl(1, 8, 32, A[4]); p.rect(1, 16, 32, 10, A[1]); p.rect(5, 18, 10, 6, C('#1a1a1e')); p.rect(19, 18, 10, 6, C('#1a1a1e')); p.hl(6, 23, 8, C('#ff7a2a')); p.hl(20, 23, 8, C('#ff7a2a'));
  p.ball(10, 6, 6, 4, A.slice(1)); p.ell(10, 4, 5, 1.6, C('#d8a040')); p.ball(24, 6, 5, 3, pal(['#3a3a40', '#5a5a60', '#7a7a80', '#9a9aa0'])); p.hl(27, 5, 6, TGP.madera[2]);
  for (const x of [6, 10, 22]) { p.set(x, 1, C('#e8eef2')); p.set(x + 1, 0, C('#e8eef2')); } });
XSPR.tg_encimera = tgX(18, 22, 9, 20, p => { const A = TGP.acero; p.rect(1, 6, 16, 14, A[2]); p.hl(1, 6, 16, A[4]); p.rect(1, 8, 16, 2, A[3]); p.vl(9, 11, 8, A[1]); p.ball(5, 4, 3, 2, TGP.verde.slice(1)); p.ell(12, 4, 3, 1.8, C('#e8d8b8')); p.set(13, 3, C('#d84a4a')); });
XSPR.tg_nevera = tgX(18, 32, 9, 30, p => { const A = TGP.blanco; p.rect(1, 1, 16, 29, A[3]); p.vl(1, 1, 29, A[4]); p.vl(16, 1, 29, A[1]); p.hl(1, 12, 16, A[1]); p.rect(13, 4, 2, 5, TGP.acero[1]); p.rect(13, 15, 2, 8, TGP.acero[1]); p.ball(6, 6, 2, 2, TGP.mar.slice(1)); });
XSPR.tg_pase = tgX(34, 26, 17, 22, p => { const A = TGP.acero; p.rect(1, 10, 32, 12, TGP.madera[2]); p.hl(1, 10, 32, TGP.madera[4]); p.rect(1, 6, 32, 4, A[3]); p.hl(1, 6, 32, A[4]); for (let k = 0; k < 4; k++) tgPlate(p, 6 + k * 7, 7, k); p.rect(14, 0, 6, 4, C('#d0302c')); p.set(16, 1, C('#ffffff')); p.set(17, 1, C('#ffffff')); });
XSPR.tg_sombrilla = tgX(40, 44, 20, 40, p => { p.vl(20, 10, 30, TGP.blanco[1]); p.ell(20, 37, 10, 4, TGP.blanco[3]); p.ell(20, 36, 10, 3.4, TGP.blanco[4]); tgPlate(p, 16, 35, 1); tgPlate(p, 24, 35, 4);
  for (let y = 0; y < 12; y++) { const w = Math.round(4 + y * 1.4); for (let x = -w; x <= w; x++) p.set(20 + x, 2 + y, ((Math.floor((x + 40) / 4)) & 1) ? C('#f8f4e8') : C('#f0b020')); } p.hl(2, 14, 36, C('#c08010')); p.ball(20, 1, 1.5, 1.5, TGP.mantel); });
XSPR.tg_fuente = tgX(46, 38, 23, 32, p => { const S = TGP.blanco; p.ell(23, 28, 21, 8, S[1]); p.ell(23, 27, 20, 7, S[3]); p.ell(23, 27, 17, 5.4, TGP.mar[2]); p.ell(20, 26, 8, 2, TGP.mar[3]);
  p.rect(21, 10, 5, 16, S[2]); p.vl(21, 10, 16, S[4]); p.ball(23, 9, 6, 4, pal(['#2a5a4a', '#3e7a62', '#5a9a7a', '#80bc96'])); p.ball(17, 8, 2.4, 2, pal(['#2a5a4a', '#3e7a62', '#5a9a7a', '#80bc96'])); p.set(16, 7, C('#101418'));
  for (const [x, y] of [[23, 2], [21, 3], [26, 3], [19, 5], [28, 5]]) p.set(x, y, TGP.mar[4]); });
XSPR.tg_arbol = tgX(30, 40, 15, 38, p => { p.rect(13, 22, 4, 16, TGP.madera[2]); p.vl(13, 22, 16, TGP.madera[3]); p.ell(15, 37, 8, 2.5, TGP.madera[1]); p.ball(15, 14, 13, 12, TGP.verde.slice(1)); p.ball(10, 10, 6, 5, TGP.verde.slice(2)); for (const [x, y] of [[8, 16], [20, 8], [19, 18]]) p.ball(x, y, 1.6, 1.6, pal(['#c0302c', '#f05a4a', '#ff9a8a'])); });
XSPR.tg_banco = tgX(34, 18, 17, 16, p => { const W = TGP.madera; p.rect(2, 4, 30, 3, W[3]); p.rect(2, 9, 30, 3, W[2]); p.hl(2, 9, 30, W[4]); for (const x of [4, 29]) p.rect(x, 12, 2, 5, W[1]); for (const x of [4, 29]) p.vl(x, 3, 7, W[0]); });
XSPR.tg_columna = tgX(16, 44, 8, 42, p => { const S = TGP.blanco; p.rect(4, 10, 8, 30, S[3]); p.vl(4, 10, 30, S[4]); p.vl(11, 10, 30, S[1]); p.rect(2, 38, 12, 4, S[2]); p.rect(2, 8, 12, 3, S[2]); for (let y = 14; y < 38; y += 6) p.hl(5, y, 6, C('#e0b020')); p.ball(8, 4, 4, 4, pal(['#e08a20', '#f8c040', '#fff080', '#ffffff'])); });
XSPR.tg_barra = tgX(84, 30, 42, 26, p => { const W = TGP.madera; p.rect(1, 10, 82, 16, W[2]); p.hl(1, 10, 82, W[4]); p.rect(1, 12, 82, 2, W[3]); for (let x = 5; x < 82; x += 10) p.vl(x, 15, 10, W[1]);
  for (let k = 0; k < 9; k++) { const x = 6 + k * 9, c = [C('#2a6a2a'), C('#8a2a1a'), C('#c89a30'), C('#2a3a8a')][k % 4]; if (k % 3 === 2) { p.ell(x, 7, 3, 2.5, C('#c89a60')); p.ell(x, 6, 2.4, 1.4, C('#fff4d0')); } else { p.rect(x - 1, 2, 3, 8, c); p.set(x, 1, C('#e8d8b8')); p.set(x - 1, 4, C('#ffffff')); } } });
XSPR.tg_estante = tgX(34, 30, 17, 28, p => { const W = TGP.madera; p.rect(1, 1, 32, 27, W[1]); for (const y of [9, 18, 27]) p.hl(1, y, 32, W[3]); for (let k = 0; k < 15; k++) { const x = 3 + (k % 5) * 6, y = 2 + Math.floor(k / 5) * 9, c = [C('#2a6a2a'), C('#8a2a1a'), C('#c89a30'), C('#2a3a8a'), C('#6a2a6a')][k % 5]; p.rect(x, y + 2, 3, 6, c); p.set(x + 1, y + 1, C('#e8d8b8')); } });
XSPR.tg_cartel = () => { const t = textSprite(L2('LA TORTUGA GLOTONA', 'THE GLUTTONOUS TURTLE'), '#fff4c0', '#5a2412', 1), w = t.width + 14, h = t.height + 10, p = new Pix(w, h);
  p.rect(0, 0, w, h, TGP.madera[2]); p.hl(0, 0, w, TGP.madera[4]); p.hl(0, h - 1, w, TGP.madera[0]); p.rect(2, 2, w - 4, h - 4, C('#a84a26')); p.outline(OUTL); const c = p.canvas(); c.getContext('2d').drawImage(t, 7, 5); return { c, ax: w >> 1, ay: h }; };
XSPR.tg_puerta = tgX(36, 12, 18, 10, p => { p.rect(1, 1, 34, 9, TGP.madera[2]); for (let x = 3; x < 34; x += 4) p.vl(x, 1, 9, TGP.madera[1]); p.hl(1, 1, 34, TGP.madera[4]); });
XSPR.tg_ancla = tgX(22, 30, 11, 28, p => { const A = TGP.acero; p.vl(10, 4, 22, A[2]); p.vl(11, 4, 22, A[3]); p.ell(11, 3, 3, 3, A[2]); p.ell(11, 3, 1.4, 1.4, 0); p.hl(5, 8, 13, A[2]); for (let k = 0; k < 8; k++) { p.set(3 + k, 21 + Math.round(Math.sqrt(k) * 2), A[2]); p.set(18 - k, 21 + Math.round(Math.sqrt(k) * 2), A[2]); } p.poly([[1, 21], [5, 19], [5, 24]], A[3]); p.poly([[21, 21], [17, 19], [17, 24]], A[3]); });

// ---------- mapa interior ----------
// salas: 0 bar (madera), 1 jardín (hierba), 2 terraza (tablones claros), 3 comedor (moqueta rosa), 4 recepción (mármol), 5 cocina (azulejo)
const TG_DOORS = [[16, 9], [16, 10], [16, 25], [16, 26], [31, 9], [31, 10], [31, 25], [31, 26], [8, 17], [9, 17], [23, 17], [24, 17], [38, 17], [39, 17]];
const tgRoom = (x, y) => (y < 17 ? (x < 16 ? 0 : x < 31 ? 1 : 2) : (x < 16 ? 3 : x < 31 ? 4 : 5));
function tgTile(x, y) { if (x < 2 || x > 45 || y < 3 || y > 33) return (x === 23 || x === 24) && y === 34 ? 'door' : (x >= 1 && x <= 46 && y >= 2 && y <= 34) ? 'rim' : 'sea';
  if ((x === 16 || x === 31 || y === 17) && !TG_DOORS.some(d => d[0] === x && d[1] === y)) return 'wall'; return 'floor'; }
const TG_TABLES = [[5, 21], [11, 21], [5, 26], [11, 26], [5, 31], [11, 31]];
const TG_PARAS = [[35, 7], [41, 7], [35, 13], [41, 13]];
const TG_BAR_T = [[5, 11], [11, 11], [5, 15], [11, 15]];
const TG_PASS = [28, 24];   // casilla donde se recogen los platos (delante del pase)
function makeTortuga() {
  if (G.maps.tortuga) return G.maps.tortuga;
  const w = TG_W, h = TG_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'tortuga', w, h, I, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', camps: [], exit: { x: -9, y: -9 }, hudName: TG_NAME, tortuga: 1, overviewMinimap: true };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = tgTile(x, y); M.ter[I(x, y)] = t === 'floor' || t === 'door' ? T.FLOOR : T.IWALL; }
  prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const chairs = (x, y) => { F('chair', x - 1, y, [[0, 0]], { solid: false }); F('chair', x + 1, y, [[0, 0]], { solid: false }); };
  // bar pirata
  F('tg_barra', 8, 6, [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]); F('tg_estante', 4, 4, [[0, 0], [1, 0]]); F('tg_estante', 12, 4, [[0, 0], [1, 0]]);
  TG_BAR_T.forEach(([x, y]) => { F('tg_mesa3', x, y, [[0, 0]]); chairs(x, y); });
  F('barrels', 2, 16); F('barrels', 15, 16); F('barrels', 2, 8); F('tg_ancla', 14, 8);
  // jardín del caparazón
  F('tg_fuente', 23, 10, [[-1, 0], [0, 0], [1, 0], [-1, -1], [0, -1], [1, -1]]); for (const [x, y] of [[18, 5], [29, 5], [18, 15], [29, 15]]) F('tg_arbol', x, y);
  F('tg_banco', 20, 14, [[0, 0], [1, 0]]); F('tg_banco', 27, 14, [[0, 0], [-1, 0]]); for (const [x, y] of [[21, 4], [26, 4]]) F('plant', x, y);
  // terraza
  TG_PARAS.forEach(([x, y]) => { F('tg_sombrilla', x, y, [[0, 0]]); chairs(x, y); }); for (const [x, y] of [[33, 4], [44, 4], [44, 16], [33, 16]]) F('plant', x, y);
  // gran comedor
  TG_TABLES.forEach(([x, y], k) => { F('tg_mesa' + (k % 3), x, y, [[0, 0]]); chairs(x, y); });
  F('tg_sofa', 8, 19, [[0, 0], [1, 0], [-1, 0]]); for (const [x, y] of [[2, 19], [15, 19], [2, 33], [15, 33]]) F('tg_columna', x, y); F('plant', 8, 33);
  // recepción con la vitrina de comida gigante
  F('tg_vitrina', 23, 20, [[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0]]); F('tg_pase', 28, 23, [[0, 0], [1, 0]], { xact: 'tg_pase' });
  F('counter', 19, 29, [[-1, 0], [0, 0], [1, 0]]); F('tg_columna', 18, 32); F('tg_columna', 29, 32); F('plant', 21, 32); F('plant', 26, 32);
  F('tg_puerta', 23, 34, [], { solid: false, xact: 'tort_leave' }); F('tg_puerta', 24, 34, [], { solid: false, xact: 'tort_leave', hidden: true });
  // cocina
  for (const x of [35, 39, 43]) F('tg_fogon', x, 20, [[0, 0], [1, 0]]); for (let x = 34; x <= 44; x += 2) F('tg_encimera', x, 27, [[0, 0]]); F('tg_nevera', 45, 23); F('tg_nevera', 45, 25); F('barrels', 33, 32); F('barrels', 45, 32);
  M.drawExtra = (cx, cy) => { const s = spr('tg:cartel', XSPR.tg_cartel); ctx.drawImage(s.c, Math.round(23.9 * 16 - cx - s.ax), Math.round(33 * 16 + 4 - cy - s.ay)); };
  // gente
  const S = (id, x, y, o) => spawnNPC(id, x * 16 + 8, y * 16 + 10, 'tortuga', Object.assign({ face: 'down', L: 0 }, o || {}));
  const sit = (id, x, y, face) => { const e = S(id, x, y, { face, scene: 1, tgSit: 1, noTag: 1 }); if (e) { e.y += 3; setAnim(e, 'sit'); } return e; };
  S('tg_maitre', 19, 28); S('tg_chef', 39, 23); S('tg_cocinero1', 35, 22, { wander: 1 }); S('tg_cocinero2', 43, 22, { wander: 1 }); S('tg_barman', 8, 5);
  sit('tg_pir1', 4, 11, 'right'); sit('tg_pir2', 6, 11, 'left'); sit('tg_pir3', 10, 11, 'right'); sit('tg_pir4', 12, 15, 'left'); sit('tg_pir5', 4, 15, 'right'); S('tg_pir6', 13, 8, { wander: 1 });
  sit('tg_cli1', 4, 21, 'right'); sit('tg_cli2', 12, 21, 'left'); sit('tg_cli3', 6, 26, 'left'); sit('tg_cli4', 10, 31, 'right'); sit('tg_cli5', 34, 7, 'right'); sit('tg_cli6', 42, 13, 'left');
  const wt = (id, x, y, route) => { const e = S(id, x, y, { scene: 1, tgWaiter: route, tgSt: 0, tgT: Math.random() * 2 }); return e; };
  wt('tg_mesero1', 27, 24, 'comedor'); wt('tg_mesero2', 26, 25, 'comedor'); wt('tg_mesero3', 38, 19, 'terraza');
  G.maps.tortuga = M; return M;
}
// suelo y paredes pintados a mano (salas de colores vistas desde arriba)
function tgPaint(M, cx, cy) {
  const c = mkCanvas(CHP, CHP), g = c.getContext('2d'), t0x = cx * CH, t0y = cy * CH;
  const FL = [['#8a5a34', '#9a6a3c', '#7a4e2c'], ['#6aac4a', '#7aba56', '#5e9e42'], ['#d8b888', '#e4c698', '#c8a878'], ['#d84a78', '#e05a86', '#c83e6c'], ['#efe6d4', '#fff8ea', '#d8cfbc'], ['#e8f0f6', '#9ac0dc', '#c8dcec']];
  const FACE = ['#c88a5a', '#e8d8a8', '#f0e4c0', '#f4c8d4', '#f4ead4', '#d4e4ee'];
  for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) { const x = t0x + tx, y = t0y + ty, X = tx * 16, Y = ty * 16, t = tgTile(x, y);
    if (t === 'sea') { g.fillStyle = '#2a6eb0'; g.fillRect(X, Y, 16, 16); if ((x * 7 + y * 13) % 11 < 2) { g.fillStyle = '#6aa8e0'; g.fillRect(X + 3, Y + 6, 8, 1); } continue; }
    if (t === 'rim' || t === 'door') { g.fillStyle = t === 'door' ? '#9a6a3a' : '#5a3820'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#7a502c'; for (let k = 0; k < 16; k += 4) g.fillRect(X, Y + k, 16, 1);
      if (t === 'rim' && y === 2 && x >= 31) { g.fillStyle = '#f4f2ea'; g.fillRect(X, Y + 2, 16, 2); g.fillRect(X + 2, Y + 4, 2, 10); g.fillRect(X + 10, Y + 4, 2, 10); }
      if (t === 'rim') { g.fillStyle = '#e0b020'; g.fillRect(X, Y + 13, 16, 1); } continue; }
    if (t === 'wall') { const below = tgTile(x, y + 1) === 'floor', r = tgRoom(x, Math.min(33, y + 1)); g.fillStyle = '#fff4dc'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#c8b48a'; g.fillRect(X, Y, 16, 1);
      if (below && y === 17) { g.fillStyle = FACE[r]; g.fillRect(X, Y + 5, 16, 11); g.fillStyle = '#b8a078'; g.fillRect(X, Y + 5, 16, 1); if ((x % 3) === 0) { g.fillStyle = '#7ab0d8'; g.fillRect(X + 5, Y + 8, 6, 5); g.fillStyle = '#ffffff'; g.fillRect(X + 5, Y + 8, 2, 2); } }
      else { g.fillStyle = '#e8d8b8'; g.fillRect(X + 5, Y, 6, 16); } continue; }
    const r = tgRoom(x, y), P = FL[r]; let col = P[0];
    if (r === 0) col = P[(y & 1) ? 0 : 1]; else if (r === 1) col = P[((x * 5 + y * 3) % 7 === 0) ? 2 : 0]; else if (r === 2) col = P[(x & 1) ? 0 : 1];
    else if (r === 3) col = (x === 2 || x === 15 || y === 18 || y === 33) ? '#e0b020' : P[((x + y) % 4 === 0) ? 1 : 0]; else if (r === 4) col = P[((x + y) & 1) ? 0 : 1]; else col = P[((x + y) & 1) ? 0 : 1];
    g.fillStyle = col; g.fillRect(X, Y, 16, 16);
    if (r === 0 || r === 2) { g.fillStyle = P[2]; g.fillRect(X, Y + 15, 16, 1); if ((x + y) % 3 === 0) g.fillRect(X + 8, Y, 1, 16); }
    if (r === 1 && (x * 3 + y * 7) % 5 === 0) { g.fillStyle = '#9ad06a'; g.fillRect(X + 5, Y + 5, 2, 3); g.fillRect(X + 10, Y + 9, 2, 3); }
    if (r === 1 && (x === 23 || x === 24) && (y < 8 || y > 11)) { g.fillStyle = '#d8c8a0'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#c4b48a'; g.fillRect(X + (y & 1) * 8, Y + 4, 6, 6); }
    if (r === 4 && x >= 21 && x <= 26 && y >= 27) { g.fillStyle = '#c83e3e'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#e0b020'; if (x === 21) g.fillRect(X, Y, 1, 16); if (x === 26) g.fillRect(X + 15, Y, 1, 16); }
    if (r === 3 && col !== '#e0b020') { g.fillStyle = '#f08aa8'; if ((x * 3 + y) % 6 === 0) { g.fillRect(X + 7, Y + 6, 2, 4); g.fillRect(X + 6, Y + 7, 4, 2); } }
  }
  return c;
}
{ const old = renderChunk; renderChunk = function (M, cx, cy) { return M && M.tortuga ? tgPaint(M, cx, cy) : old.apply(this, arguments); }; }

// ---------- subir y bajar ----------
const tgDockPx = () => [TG_DOCK[0] * 16 + 8, TG_DOCK[1] * 16 + 8];
function tgBoardAction() { const P = G.P, M = G.map; if (!M || !M.dawn || !P || !P.dawnHelm || P.dead || G.fading) return null; const [x, y] = tgDockPx(); return dist2(P.x, P.y, x, y) < (P.dawnHelm.kind === 'galleon' ? 130 : 70) ** 2 ? 'tort_board' : null; }
function tgBoard() { const P = G.P; if (tgBoardAction() !== 'tort_board') return; transition(() => { P._tortTrip = { h: P.dawnHelm, x: P.x, y: P.y, dir: P.dir }; P.inside = 'tortuga'; const M = makeTortuga(); setMap(M, 23.5 * 16, 32 * 16 + 8, 'up');
  banner('🐢 ' + TG_NAME, L2('Restaurante flotante · Bar Pirata, Jardín, Terraza, Comedor y Cocina', 'Floating restaurant · Pirate Bar, Garden, Terrace, Dining Room and Kitchen')); clueSafe(); }); }
const clueSafe = () => { try { if (typeof clueUnlock === 'function') clueUnlock('tortuga'); } catch (e) { } };
function tgLeave() { const P = G.P, S = P._tortTrip; if (G.fading || P.dead) return; if (ACT.k === 'tgm') tgmEnd(true);
  transition(() => { P.inside = null; P._tortTrip = null; const M = makeDawn(); if (S && S.h) { P.dawnHelm = S.h; setMap(M, S.x, S.y, 'down'); if (S.h.kind === 'galleon') P._alvidaBerth = { x: S.x, y: S.y, dir: 'down' }; }
    else { const [x, y] = tgDockPx(); P.dawnHelm = dawnHelm('swim', { x: P.retX, y: P.retY }); setMap(M, x, y + 16, 'down'); } markDirty(true); }); }
XACT.tort_board = [L2('Subir a La Tortuga Glotona', 'Board the Gluttonous Turtle'), 'ways', tgBoard];
XACT.tort_leave = [() => G.P && G.P._tortTrip && G.P._tortTrip.h && G.P._tortTrip.h.kind === 'swim' ? L2('Volver a nadar', 'Back to swimming') : L2('Volver a tu barco', 'Back to your boat'), 'ways', tgLeave];
XACT.tg_pase = [() => ACT.k === 'tgm' ? (G.P.tgPlate ? null : L2('Coger plato', 'Take a plate')) : null, 'bag', () => tgmTake()];
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); try { const P = G.P; if (r !== false && P && G.map === M && !M.dawn && !M.tortuga) { P.dawnBoat = null; P._tortTrip = null; } } catch (e) { } return r; }; }

// ---------- vida en el restaurante: meseros, clientes y cocina ----------
const TG_ROUTES = { comedor: { pass: [27, 24], via: [[17, 25.5], [15, 25.5]], dest: TG_TABLES.map(([x, y]) => [x, y + 1]) }, terraza: { pass: [38.5, 19], via: [[38.5, 17], [38.5, 15]], dest: TG_PARAS.map(([x, y]) => [x, y + 1]) } };
function tgPath(e, pts, dt) { const p = pts[0]; if (!p) return true; const tx = p[0] * 16 + 8, ty = p[1] * 16 + 8; npcStep(e, tx, ty, 46, dt); if (Math.hypot(tx - e.x, ty - e.y) < 3) { pts.shift(); } return !pts.length; }
function tgTick(dt) { const M = G.map; if (!M || !M.tortuga) return; dt = Math.min(dt || 0.016, 0.1);
  for (const e of G.ents) { if (e.map !== 'tortuga' || e.type !== 'npc') continue;
    if (e.tgSit) { if (e.anim !== 'sit') setAnim(e, 'sit'); if (Math.random() < dt * 0.04) { e.chat = TG_CHAT[(Math.random() * TG_CHAT.length) | 0]; e.chatT = G.t; } continue; }
    const R = e.tgWaiter && TG_ROUTES[e.tgWaiter]; if (!R) continue;
    if (e.tgT > 0) { e.tgT -= dt; e.anim = 'idle'; continue; }
    if (!e.tgPts) { if (e.tgSt === 0) { e.tgPts = [R.pass.slice()]; } else { const d = R.dest[(Math.random() * R.dest.length) | 0]; e.tgPts = R.via.map(v => v.slice()).concat([d.slice()]); e.tgCarry = 1 + ((Math.random() * TG_FOOD.length) | 0); } }
    if (tgPath(e, e.tgPts, dt)) { e.tgPts = null; if (e.tgSt === 0) { e.tgSt = 1; e.tgT = 0.8; } else { e.tgSt = 2; e.tgT = 1.4; e.tgCarry = 0; e.dir = 'up'; } }
    if (e.tgSt === 2 && !e.tgPts && e.tgT <= 0) { e.tgSt = 0; e.tgPts = R.via.slice().reverse().map(v => v.slice()).concat([R.pass.slice()]); e.tgSt = 3; }
    if (e.tgSt === 3 && !e.tgPts) e.tgSt = 0;
  } }
V33_TICKS.push(tgTick);
// plato en la mano (meseros y tú durante el turno)
function tgDrawCarry(x, y, k) { const F = TG_FOOD[(k - 1) % TG_FOOD.length]; ctx.fillStyle = '#9a968c'; ctx.fillRect(x - 6, y + 1, 12, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 6, y, 12, 2); ctx.fillStyle = uCss(F[0]); ctx.fillRect(x - 3, y - 3, 6, 3); ctx.fillStyle = uCss(F[1]); ctx.fillRect(x - 2, y - 4, 2, 1); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de.apply(this, arguments); try { const k = e === G.P ? (ACT.k === 'tgm' && G.P.tgPlate) : e && e.tgCarry; if (k && G.map && G.map.tortuga) tgDrawCarry(Math.round(e.x - cx + (e.dir === 'left' ? -7 : 7)), Math.round(e.y - cy - 22), k); } catch (er) { } return r; }; }

// ---------- turno de mesero (dentro del mapa, con ⚔) ----------
function tgmStart() { const P = G.P; if (actBusy() || !G.map || !G.map.tortuga) return; closeDialog();
  Object.assign(ACT, { k: 'tgm', t: 90, served: 0, late: 0, orders: [], next: 0.5, onAtk: () => { tgmAct(); return true; } }); P.tgPlate = 0;
  banner('🍽 ' + L2('¡Turno de mesero!', 'Waiter shift!'), L2('Coge los platos en el pase (junto a la cocina) con ⚔ y llévalos a las mesas que piden (🍽).', 'Take plates at the pass (next to the kitchen) with ⚔ and bring them to the tables asking (🍽).')); }
function tgmTake() { const P = G.P, A = ACT; if (A.k !== 'tgm' || P.tgPlate) return; if (!A.orders.length) { toast(L2('Todavía nadie ha pedido.', 'Nobody has ordered yet.'), 'info'); return; }
  const o = A.orders.find(o => !o.taken) || A.orders[0]; o.taken = 1; P.tgPlate = o.dish; sfx('coin'); floatText(P.x, P.y - 40, '🍽 ' + L2('Mesa ', 'Table ') + (o.t + 1), '#fff0a0'); }
function tgmAct() { const P = G.P, A = ACT; const [px, py] = [TG_PASS[0] * 16 + 8, TG_PASS[1] * 16 + 8];
  if (!P.tgPlate) { if (Math.hypot(P.x - px, P.y - py) < 34) tgmTake(); else floatText(P.x, P.y - 40, L2('Ve al pase', 'Go to the pass'), '#ffd0a0'); return; }
  let best = null, bd = 30; for (const o of A.orders) { const [tx, ty] = TG_TABLES[o.t], d = Math.hypot(P.x - (tx * 16 + 8), P.y - (ty * 16 + 8)); if (d < bd) { bd = d; best = o; } }
  if (!best) { floatText(P.x, P.y - 40, L2('Acércate a una mesa que pida', 'Get close to a table that is ordering'), '#ffd0a0'); return; }
  A.orders.splice(A.orders.indexOf(best), 1); P.tgPlate = 0; A.served++; const tip = 40 + Math.round(best.life * 4); P.gold += tip; sfx('quest'); floatText(P.x, P.y - 40, '+' + tip + ' 💰', '#ffd040'); }
function tgmEnd(quiet) { const P = G.P, A = ACT, n = A.served || 0; P.tgPlate = 0; actEnd(); if (quiet && !n) return;
  const gold = 250 + n * 110; P.gold += gold; P.tgServe = (P.tgServe || 0) + n; if (typeof gainJobXp === 'function' && JOBS.restaurante) gainJobXp('restaurante', 20 + n * 14);
  banner('🍽 ' + L2('Fin del turno', 'Shift over'), L2('Platos servidos: ', 'Plates served: ') + n + ' · +' + fmt(gold) + ' ' + L2('oro', 'gold') + (JOBS.restaurante ? ' · ' + L2('oficio Restaurante', 'Restaurant job') : '')); markDirty(true); }
V33_TICKS.push(dt => { if (ACT.k !== 'tgm') return; const A = ACT, M = G.map; dt = Math.min(dt || 0.016, 0.1); if (!M || !M.tortuga || G.P.dead) { tgmEnd(true); return; }
  A.t -= dt; A.next -= dt; for (const o of A.orders) o.life -= dt;
  const lost = A.orders.filter(o => o.life <= 0); if (lost.length) { A.late += lost.length; A.orders = A.orders.filter(o => o.life > 0); if (lost.some(o => o.taken)) G.P.tgPlate = 0; floatText(G.P.x, G.P.y - 40, L2('¡Se cansaron de esperar!', 'They got tired of waiting!'), '#ff8a8a'); }
  if (A.next <= 0 && A.orders.length < 3) { const free = TG_TABLES.map((_, i) => i).filter(i => !A.orders.some(o => o.t === i)); const t = free[(Math.random() * free.length) | 0]; A.orders.push({ t, dish: 1 + ((Math.random() * TG_FOOD.length) | 0), life: 26 }); A.next = 4 + Math.random() * 4; }
  mgHud(`🍽 ${L2('Servidos', 'Served')} ${A.served} · ⏱ ${Math.ceil(A.t)} s${A.late ? ' · 😤 ' + A.late : ''}${G.P.tgPlate ? ' · ' + L2('llevas un plato', 'carrying a plate') : ''}`);
  if (A.t <= 0) tgmEnd(); });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'tgm' || !G.map || !G.map.tortuga) return; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  for (const o of ACT.orders) { const [tx, ty] = TG_TABLES[o.t], x = tx * 16 + 8 - cx, y = ty * 16 - 22 - cy + Math.sin(G.t * 4) * 2; ctx.fillStyle = o.life < 8 ? '#ffb0a0' : '#ffffff'; ctx.fillRect(x - 11, y - 11, 22, 16); ctx.fillStyle = '#1a1218'; ctx.fillRect(x - 11, y + 5, 22, 1); ctx.fillText('🍽', x, y + 2); }
  if (!G.P.tgPlate) { const x = TG_PASS[0] * 16 + 8 - cx, y = TG_PASS[1] * 16 - 30 - cy + Math.sin(G.t * 5) * 3; ctx.fillStyle = '#ffd040'; ctx.fillText('▼', x, y); } ctx.textAlign = 'left'; });
DLG_HOOKS.push((npc, opts) => { if (!npc) return;
  if (npc.id === 'tg_maitre') opts.unshift({ label: '🍽 ' + L2('Trabajar de mesero (turno de 90 s)', 'Work as a waiter (90 s shift)'), icon: ['food', 1], fn: tgmStart });
  if (npc.id === 'tg_chef') opts.unshift({ label: '🍲 ' + L2('Comer el plato del día (500 de oro)', 'Eat the dish of the day (500 gold)'), icon: ['food', 1], fn: () => { const P = G.P; if (P.gold < 500) { toast(L2('No te alcanza el oro.', 'Not enough gold.'), 'warn'); return; } P.gold -= 500; P.hp = P.S.maxhp; P.mp = P.S.maxmp; closeDialog(); sfx('quest'); banner('🍲 ' + L2('¡Delicioso!', 'Delicious!'), L2('Vida y maná al máximo.', 'Health and mana fully restored.')); markDirty(true); } }); });

// ---------- NADAR en el Mar de Dawn ----------
const SWIM_SPEED = 120;
function swimNearLand(M, x, y) { for (let r = 1; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const tx = (x >> 4) + dx, ty = (y >> 4) + dy, i = tileAt(M, tx, ty); if (i < 0) continue; const t = M.ter[i]; if (t !== T.DEEP && !SOLID_T[t] && !WATERY[t] && !(M.solidO && M.solidO[i])) return [tx * 16 + 8, ty * 16 + 8]; } return null; }
function swimNearWater(M, x, y) { let best = null, bd = 1e9; for (let ty = (y >> 4) - 3; ty <= (y >> 4) + 3; ty++) for (let tx = (x >> 4) - 3; tx <= (x >> 4) + 3; tx++) { const px = tx * 16 + 8, py = ty * 16 + 8; if (!dawnSurface(M, px, py)) continue; const d = dist2(px, py, x, y); if (d < bd) { bd = d; best = [px, py]; } } return best; }
const swimCoastOk = (x, y) => { const tx = x >> 4, ty = y >> 4; return tx >= 470 && tx <= 600 && ty >= 215 && ty <= 300; };
function swimAction() { const P = G.P, M = G.map; if (!M || !M.dawn || !P || P.dead || G.fading) return null; const H = P.dawnHelm;
  if (H && H.kind === 'swim') { const B = P.dawnBoat; if (B && dist2(P.x, P.y, B.x, B.y) < 44 * 44) return 'swim_boat'; if (swimNearLand(M, P.x, P.y)) return 'swim_out'; return null; }
  if (!H && swimNearWater(M, P.x, P.y)) return 'swim_in'; return null; }
function swimIn(fromBoat) { const P = G.P, M = G.map; if (!M || !M.dawn || G.fading) return; const H = P.dawnHelm;
  const at = fromBoat ? [P.x, P.y + 20] : swimNearWater(M, P.x, P.y); if (!at) return;
  transition(() => { let ret = { x: P.retX, y: P.retY };
    if (fromBoat && H) { P.dawnBoat = { x: P.x, y: P.y, dir: P.dir, h: H }; ret = H.returnAt || ret; }
    else if (P.fooshaBerth) { const B = P.fooshaBerth; P.dawnBoat = { x: B.x, y: B.y, dir: B.dir, h: B.h }; ret = (B.h && B.h.returnAt) || ret; P.fooshaBerth = null; }
    else if (P.shellBerth && typeof shellsDockPoint === 'function' && M.shells) { const [x, y] = shellsDockPoint(M, SHELL_MOORING); P.dawnBoat = { x, y, dir: 'down', h: P.shellBerth }; ret = P.shellBerth.returnAt || ret; P.shellBerth = null; }
    else if (P.dawnBoat && P.dawnBoat.h) ret = P.dawnBoat.h.returnAt || ret;
    const sp = dawnSurface(M, at[0], at[1]) ? at : swimNearWater(M, at[0], at[1]) || at; P.dawnHelm = dawnHelm('swim', ret); P.x = sp[0]; P.y = sp[1]; P.target = null; P.swimT = 0;
    if (P.fruit) toast('🍇 ' + L2('¡La Fruta del Diablo te hunde! Pierdes vida en el agua: vuelve rápido al bote o a la orilla.', 'The Devil Fruit drags you down! You lose health in the water: get back to the boat or the shore fast.'), 'warn', 6);
    else toast('🏊 ' + L2('Nadando. Vuelve al bote, sube a La Tortuga Glotona por la escalerilla o sal en la costa de Foosha.', 'Swimming. Get back to the boat, climb the Gluttonous Turtle\'s ladder or come ashore on Foosha\'s coast.'), 'info', 5);
    updateCamera(0, true); netPresence(true); markDirty(true); }); }
function swimOut(toBoat) { const P = G.P, M = G.map; if (!M || !M.dawn || G.fading) return;
  if (toBoat) { const B = P.dawnBoat; if (!B) return; transition(() => { P.dawnHelm = B.h || dawnHelm('skiff', P.dawnHelm && P.dawnHelm.returnAt); P.x = B.x; P.y = B.y; P.dir = B.dir || 'down'; P.dawnBoat = null; if (P.dawnHelm.kind === 'galleon') P._alvidaBerth = { x: B.x, y: B.y, dir: P.dir }; updateCamera(0, true); netPresence(true); markDirty(true); }); return; }
  const at = swimNearLand(M, P.x, P.y); if (!at) return;
  if (!swimCoastOk(at[0], at[1])) { toast(L2('Aquí la costa es demasiado escarpada para salir. Prueba en la costa de Foosha.', 'The shore is too steep to climb out here. Try Foosha\'s coast.'), 'info', 4); return; }
  if (!dfHas()) { toast(dawnLandingNotice(), 'info', 5); return; }
  transition(() => { const B = P.dawnBoat; if (B && B.h && B.h.kind !== 'galleon') { P.fooshaBerth = { x: B.x, y: B.y, dir: B.dir, h: B.h }; P.dawnBoat = null; } P.dawnHelm = null; P.x = at[0]; P.y = at[1]; P.dir = 'up'; P.target = null; banner('Villa Foosha', L2('Sales del agua empapado', 'You climb out soaking wet')); updateCamera(0, true); netPresence(true); markDirty(true); }); }
XACT.swim_in = [() => G.P && G.P.dawnHelm ? L2('Tirarse al agua', 'Jump into the water') : L2('Nadar', 'Swim'), 'ways', () => swimIn(!!G.P.dawnHelm)];
XACT.swim_boat = [L2('Subir al bote', 'Climb into the boat'), 'ways', () => swimOut(true)];
XACT.swim_out = [L2('Salir del agua', 'Climb out of the water'), 'ways', () => swimOut(false)];
// prioridad: subir a la tortuga > acciones de nado > lo demás
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map;
  try { if (M && M.dawn && P && !P.dead) { const b = tgBoardAction(); if (b) return { kind: 'xact', label: XACT[b][0], icon: 'ways', o: { xact: b } };
    const H = P.dawnHelm; if (H && H.kind === 'swim') { const k = swimAction(); if (k) return { kind: 'xact', label: XACT[k][0], icon: 'ways', o: { xact: k } }; const r = _it.apply(this, arguments); return r && r.o && /alvida_(board|deck)/.test(r.o.xact) ? null : r; }
    const r = _it.apply(this, arguments); if (r) return r; if (!H) { const k = swimAction(); if (k) return { kind: 'xact', label: XACT[k][0], icon: 'ways', o: { xact: k } }; } return r; } } catch (e) { }
  return _it.apply(this, arguments); }; }
// desde el bote: botón para tirarse al agua (en el bote ⚔ no hace nada)
{ const _ba = basicAttack; basicAttack = function () { const P = G.P; if (P && P.dawnHelm && P.dawnHelm.kind === 'skiff' && G.map && G.map.dawn && !tgBoardAction()) { const it = interactTarget(); if (!it) { swimIn(true); return; } } return _ba.apply(this, arguments); }; }
// nadar: más lento que el bote, con la fruta pierdes vida y te rescatan
{ const _up = updatePlayer; updatePlayer = function (dt) { const P = G.P, M = G.map, H = P && P.dawnHelm; if (!M || !M.dawn || !H || H.kind !== 'swim' || P.dead) return _up.apply(this, arguments);
  const [dx, dy] = moveInput(); if (dx || dy) { const d = SWIM_SPEED * dt, st = Math.max(1, Math.ceil(d / 6)), sx = dx * d / st, sy = dy * d / st; for (let i = 0; i < st; i++) { if (dawnSurface(M, P.x + sx, P.y, 6)) P.x += sx; if (dawnSurface(M, P.x, P.y + sy, 6)) P.y += sy; } P.dir = dirFromVec(dx, dy); setAnim(P, 'walk', true); stepAnim(P, dt, 6); } else setAnim(P, 'idle', true);
  P.swimT = (P.swimT || 0) + dt;
  if (P.fruit) { P.hp -= P.S.maxhp * 0.06 * dt; if (Math.random() < dt * 2) part(P.x + (Math.random() - 0.5) * 10, P.y - 6, { vz: 30, g: 40, life: 0.6, c: '#d0ecff', s: 2 });
    if (P.hp <= P.S.maxhp * 0.08) { P.hp = Math.max(1, Math.round(P.S.maxhp * 0.1)); const B = P.dawnBoat; toast('🛟 ' + L2('Te hundías... un mesero de La Tortuga Glotona te lanza un salvavidas.', 'You were sinking... a waiter from the Gluttonous Turtle throws you a lifebuoy.'), 'warn', 6);
      if (B) { swimOut(true); } else { const [x, y] = tgDockPx(); P.x = x; P.y = y + 16; } } } }; }
// dibujo: solo asoma medio cuerpo, con ondas alrededor
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const P = G.P; if (e === P && P.dawnHelm && P.dawnHelm.kind === 'swim' && G.map && G.map.dawn) { const x = Math.round(e.x - cx), y = Math.round(e.y - cy), wob = Math.sin(G.t * 4) * 1.5;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y - 80, 80, 66 + wob); ctx.clip(); ctx.translate(0, 8); try { _de.call(this, e, cx, cy); } finally { ctx.restore(); }
    ctx.strokeStyle = 'rgba(230,248,255,0.9)'; ctx.lineWidth = 1; for (const k of [0, 1]) { const r = 9 + k * 5 + ((G.t * 6) % 4); ctx.beginPath(); ctx.ellipse(x, y - 6 + wob, r, r * 0.35, 0, 0, 7); ctx.stroke(); } return; }
  return _de.apply(this, arguments); }; }
// el bote que dejas al nadar se ve donde lo dejaste
DL_HOOKS.push((list, cx, cy) => { const P = G.P, B = P && P.dawnBoat, M = G.map; if (!M || !M.dawn || !B || (B.h && B.h.kind === 'galleon')) return; list.push({ type: 'xdraw', x: B.x, y: B.y + 15, draw: (e, cx2, cy2) => { const s = dawnSprite('boat'); if (s) dawnShipSprite(cx2, cy2, s, B.x, B.y + 16, B.dir); } }); });

// ---------- mapa, Lupa y pistas ----------
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); try {
  if (M && M.dawn) out.push({ c: 'shop', x: TG_AT[0], y: TG_AT[1], t: '🐢 ' + TG_NAME });
  if (M && M.tortuga) for (const [x, y, es, en] of [[8, 9, 'Bar Pirata', 'Pirate Bar'], [23, 7, 'Jardín del Caparazón', 'Shell Garden'], [38, 10, 'Terraza', 'Terrace'], [8, 24, 'Gran Comedor', 'Great Dining Room'], [23, 24, 'Vitrina y recepción · turno de mesero', 'Showcase and reception · waiter shift'], [39, 24, 'Cocina · plato del día', 'Kitchen · dish of the day'], [23, 34, 'Salida al mar', 'Way out to sea']]) out.push({ c: 'shop', x, y, t: L2(es, en) }); } catch (e) { } return out; }; }
if (typeof GSIS !== 'undefined') GSIS.unshift(['tortuga586', '🐢 ' + TG_NAME, () => [
  L2('Restaurante flotante sobre una tortuga gigante, cerca de Foosha en el Mar de Dawn (nivel 500, se navega desde Puerto Coral con la Capitana Marina). No hace falta la Fruta del Diablo.', 'Floating restaurant on a giant turtle near Foosha in the Dawn Sea (level 500, sail from Coral Port with Captain Marina). No Devil Fruit needed.'),
  L2('Acércate con el bote (o nadando) al muelle de popa y pulsa «Subir». Dentro: Bar Pirata, Jardín del Caparazón con fuente, Terraza con sombrillas, Gran Comedor, Recepción con la vitrina de comida gigante y Cocina.', 'Bring your boat (or swim) to the stern dock and press "Board". Inside: Pirate Bar, Shell Garden with a fountain, Terrace with parasols, Great Dining Room, Reception with the giant food showcase and Kitchen.'),
  L2('🍽 Turno de mesero (habla con Madame Perla): 90 s; coge platos en el pase con ⚔ y llévalos a las mesas con 🍽. Da oro, propinas y experiencia del oficio Restaurante.', '🍽 Waiter shift (talk to Madame Perla): 90 s; take plates at the pass with ⚔ and bring them to the tables showing 🍽. Gives gold, tips and Restaurant job experience.'),
  L2('🍲 La chef Brígida sirve el plato del día: 500 de oro, vida y maná al máximo.', '🍲 Chef Brígida serves the dish of the day: 500 gold, full health and mana.'),
  L2('🏊 Nadar: en el bote pulsa ⚔ (o «Tirarse al agua») y desde la orilla «Nadar». Nadas más despacio que el bote; vuelve a tu bote, sube a la tortuga o sal en la costa de Foosha (pide la Fruta del Diablo, como desembarcar). Si comiste una fruta, el mar te hunde: pierdes vida y te rescatan con un salvavidas.', '🏊 Swimming: in the boat press ⚔ (or "Jump into the water") and from the shore "Swim". You are slower than the boat; get back to your boat, climb onto the turtle or come ashore on Foosha\'s coast (needs the Devil Fruit, like landing). If you ate a fruit the sea drags you down: you lose health and get rescued with a lifebuoy.')],
  () => ({ loc: [229, 129], m: 'world', t: L2('Capitana Marina (bote a Dawn)', 'Captain Marina (boat to Dawn)') })]);
