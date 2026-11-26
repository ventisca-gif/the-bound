// 6.30 · Infancia de Luffy en Foosha (Sergio: «en la primera isla donde está Shanks agrega esta casa, hazla igualita,
// que se sepa que no se puede entrar… Dadan… el recuerdo jugable de Luffy niño, Ace niño y Sabo niño con cinemáticas…
// que te dé la ropa de ellos… hazla como la primera misión principal, antes de Shanks»).
// - Casa de Dadan nueva (la casa vieja `house17` del Monte Colubo cambia de dibujo, no se borra): casa larga de madera con
//   tejado de tejas rojas, entrada con cuernos, torre de vigía detrás, tendedero, escaleras y barriles. No se puede entrar.
// - Dadan, Luffy, Ace y Sabo niños con las hojas de sprites de Sergio (`INF_IMAGES`, tools/dev/inf_pack.py) y sus retratos
//   en los diálogos (`INF_POR`).
// - El recuerdo (`IA`, estado en `M.infArc`): se juega en el propio mapa de Foosha con un filtro sepia. Ace huye al Gray
//   Terminal → Sabo → Porchemy y sus piratas → caza del tigre del Colubo → Bluejam en el Gray Terminal en llamas →
//   juramento de las copas de sake (cinemática). Los tres niños pelean contigo.

// ---------- hojas de sprites y atlas ----------
const INF_SHEETS = {}, INF_POR = {};
for (const [id, url] of Object.entries(INF_IMAGES)) {
  const im = new Image(); im.src = url;
  if (/_por$/.test(id)) { INF_POR[id.slice(0, -4)] = im; continue; }
  INF_SHEETS[id] = im;
  im.addEventListener('load', () => { for (const e of G.ents || []) if (e.type === 'npc' && e.def && e.def.infArt === id) e.atlas = infAtlas(id); });
}
// columnas del atlas: 0 reposo · 1-4 caminar · 5-8 ataque (paso con impulso) · 9 herido · 10 caído · 11 hablar
const INF_DIRV = [[0, 1], [-1, 0], [1, 0], [0, -1]];
function infAtlas(id) {
  const im = INF_SHEETS[id], cw = INF_CELL.w, ch = INF_CELL.h;
  if (!im || !im.naturalWidth) return null;
  return getAtlas('inf_' + id, () => {
    const a = dawnPixelAtlas(cw / 2, ch / 2, { idle: 0, walk: 1, atk: 5, hurt: 9, dead: 10, talk: 11 }, 12, (g, c, r) => {
      let src = 0, dx = 0, dy = 0;
      if (c >= 1 && c <= 4) src = c;
      else if (c >= 5 && c <= 8) { src = [1, 2, 3, 0][c - 5]; const k = [2, 9, 14, 4][c - 5]; dx = INF_DIRV[r][0] * k; dy = INF_DIRV[r][1] * k * 0.5; }
      else if (c === 9) { dx = r === 1 ? 5 : r === 2 ? -5 : 0; dy = r === 0 ? -3 : r === 3 ? 3 : 1; }
      else if (c === 10) { g.translate(cw / 2, ch - 6); g.rotate(r === 2 ? Math.PI / 2 : -Math.PI / 2); g.scale(0.8, 0.8); g.translate(-cw / 2, -(ch - 6)); }
      else if (c === 11) src = 5;
      g.drawImage(im, src * cw, r * ch, cw, ch, dx, dy, cw, ch);
      if (c === 9) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,60,50,.35)'; g.fillRect(0, 0, cw, ch); g.globalCompositeOperation = 'source-over'; }
    });
    a.frames = { idle: 1, walk: 4, atk: 4, hurt: 1, dead: 1, talk: 1 }; return a;
  });
}
// retrato en la ventana de diálogo (52×52)
function infDrawPor(k) {
  const im = INF_POR[k], c = $('#dport'); if (!im || !c) return false;
  const draw = () => { const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); };
  if (im.naturalWidth) draw(); else im.addEventListener('load', draw, { once: true });
  return true;
}
hookAfter('openDialog', (r, npc) => { const k = npc && npc.def && npc.def.infPor; if (k) infDrawPor(k); });
// conversación con retratos: cada frase pone la cara de quien habla. seq = [[quién, es, en], ...]
const INF_WHO = {};
function infTalk(seq, done) {
  closePanel(); const box = $('#dialog'); box.hidden = false; G.paused = true;
  dlg = { npc: { id: 'inf_talk', def: { n: '', lines: [''] } }, page: null, infTalk: true };
  let k = 0;
  const next = () => {
    if (k >= seq.length) { closeDialog(); if (done) try { done(); } catch (e) { errOnce && errOnce('infTalk', e); } return; }
    const [who, es, en] = seq[k++], W = INF_WHO[who] || { n: who };
    if (!infDrawPor(W.por || who)) { const c = $('#dport'); c.getContext('2d').clearRect(0, 0, c.width, c.height); if (W.atlas) { const A = W.atlas(); if (A) drawPortrait(c, A); } }
    $('#dname').textContent = W.n; $('#dtitle').textContent = W.t || ''; setOpts([]);
    typeText(L2(es, en), () => setOpts([{ label: L2('Continuar ›', 'Continue ›'), fn: next }]));
  };
  next();
}

// ---------- personajes ----------
const INF_CAST = {
  inf_dadan: ['Curly Dadan', L2('Bandida del Monte Colubo', 'Mount Colubo bandit'), 'dadan', 46, [
    L2('¿Qué miras? Esta casa es de los bandidos Dadan. Aquí no se entra sin permiso… y no lo tienes.', 'What are you looking at? This house belongs to the Dadan bandits. Nobody gets in without permission… and you don’t have it.'),
    L2('Garp me dejó a esos tres mocosos. Comen como diez bandidos y rompen todo lo que tocan.', 'Garp left me those three brats. They eat like ten bandits and break everything they touch.'),
    L2('¡Que no lloro! Se me metió humo en los ojos, nada más.', 'I’m not crying! I got smoke in my eyes, that’s all.')]],
  inf_luffy: ['Luffy', L2('Recuerdo · Monte Colubo', 'Memory · Mount Colubo'), 'luffy', 32, [
    L2('¡Ace! ¡Sabo! ¡Esperadme! ¡Yo también voy!', 'Ace! Sabo! Wait for me! I’m coming too!'),
    L2('¡Algún día seré el Rey de los Piratas! ¡Shishishi!', 'One day I’ll be King of the Pirates! Shishishi!')]],
  inf_ace: ['Ace', L2('Recuerdo · Monte Colubo', 'Memory · Mount Colubo'), 'ace', 33, [
    L2('No me sigas. Los llorones no aguantan en este bosque.', 'Stop following me. Crybabies don’t last in this forest.'),
    L2('Cuando cumpla diecisiete me hago a la mar. Y nadie me va a decir quién tengo que ser.', 'When I turn seventeen I’m heading out to sea. And nobody is going to tell me who I have to be.')]],
  inf_sabo: ['Sabo', L2('Recuerdo · Gray Terminal', 'Memory · Gray Terminal'), 'sabo', 35, [
    L2('Ace y yo guardamos un tesoro escondido en el bosque. Es para nuestro barco pirata.', 'Ace and I keep a hidden treasure in the forest. It’s for our pirate ship.'),
    L2('Quiero ser libre. El mar es el único sitio donde nadie decide por ti.', 'I want to be free. The sea is the only place where nobody decides for you.')]]
};
for (const [id, [n, title, art, hgt, lines]] of Object.entries(INF_CAST)) {
  NPCS[id] = { n, title, look: LK({}), quests: [], lines, infArt: art, infPor: art, infHgt: hgt, atlas: () => infAtlas(art) || npcAtlas('dawn_pirata') };
  INF_WHO[art] = { n, t: title, por: art, atlas: () => infAtlas(art) };
}
INF_WHO.garp = { n: 'Garp', t: L2('Vicealmirante', 'Vice Admiral'), atlas: () => npcAtlas('inf_garp') };
INF_WHO.porchemy = { n: 'Porchemy', t: L2('Pirata de Bluejam', 'Bluejam pirate'), atlas: () => npcAtlas('inf_porchemy') };
INF_WHO.bluejam = { n: 'Bluejam', t: L2('Capitán pirata', 'Pirate captain'), atlas: () => npcAtlas('inf_bluejam') };

// ---------- casa de Dadan ----------
const INF_HOUSE_AT = [365, 139], INF_HOUSE_X = 362, INF_DOOR = [362, 140];
function infHouseArt() {
  const W = 300, H = 236, p = new Pix(W, H), base = H - 4;
  const plank = pal(['#7a5a36', '#9c7648', '#c09a64', '#d8b884', '#ecd4a2']), tile = pal(['#5e1e16', '#8a3222', '#b04a32', '#cc6a48', '#e48c64']);
  const post = pal(['#4a3420', '#6a4a2c', '#8a663c']), win = pal(['#2e2c52', '#47487c', '#6a6ca6', '#9a9ccc']);
  // torre de vigía detrás (celosía de troncos y plataforma con tejadillo)
  const tx0 = 122, tx1 = 166;
  for (const x of [tx0, tx1]) { p.rect(x, 22, 4, 112, post[1]); p.vl(x + 1, 22, 112, post[2]); }
  for (let y = 34; y < 130; y += 22) { p.line(tx0 + 2, y, tx1 + 2, y + 20, post[0]); p.line(tx1 + 2, y, tx0 + 2, y + 20, post[1]); p.hl(tx0, y, tx1 - tx0 + 4, post[2]); }
  p.rect(tx0 - 8, 20, tx1 - tx0 + 20, 6, plank[1]); p.hl(tx0 - 8, 20, tx1 - tx0 + 20, plank[3]);
  for (let x = tx0 - 6; x < tx1 + 12; x += 6) p.vl(x, 10, 10, post[1]);
  p.poly([[tx0 - 12, 10], [(tx0 + tx1) / 2 + 2, 0], [tx1 + 16, 10]], tile[2]); p.hl(tx0 - 12, 10, tx1 - tx0 + 28, tile[0]);
  // tejado a cuatro aguas de tejas rojas
  const rT = 104, rB = 146, L = 18, R = W - 18;
  p.poly([[L, rB], [R, rB], [R - 24, rT], [L + 24, rT]], tile[2]);
  for (let y = rT + 3; y < rB; y += 5) { const t = (y - rT) / (rB - rT), x0 = Math.round(L + 24 - t * 24), x1 = Math.round(R - 24 + t * 24); p.hl(x0, y, x1 - x0, tile[1]); for (let x = x0 + ((y >> 2) % 2) * 4; x < x1; x += 8) p.vl(x, y - 4, 4, tile[1]); p.hl(x0, y - 1, x1 - x0, tile[3]); }
  p.hl(L + 24, rT, R - L - 48, tile[4]); p.hl(L, rB, R - L, tile[0]); p.hl(L, rB + 1, R - L, tile[0]);
  // muros de tablones con postes y la franja de ventanas azul
  const wT = rB + 2, wL = 30, wR = W - 30;
  for (let y = wT; y < base; y++) { const v = (y - wT) % 7 === 0 ? 1 : (y - wT) % 7 < 3 ? 3 : 2; p.hl(wL, y, wR - wL, plank[v]); }
  for (let x = wL; x <= wR; x += 40) { p.rect(x, wT, 4, base - wT, post[1]); p.vl(x + 1, wT, base - wT, post[2]); }
  const wy = wT + 18; p.rect(wL + 4, wy, wR - wL - 8, 13, win[1]); p.hl(wL + 4, wy, wR - wL - 8, win[0]); p.hl(wL + 4, wy + 12, wR - wL - 8, plank[1]);
  for (let x = wL + 8; x < wR - 4; x += 9) { p.vl(x, wy + 1, 11, win[0]); p.rect(x + 2, wy + 3, 3, 4, win[3]); }
  p.rect(wL - 2, base - 3, wR - wL + 4, 3, post[0]);
  // entrada central con frontón de tejas, cuernos y vigas en aspa
  const cx = W / 2, gL = cx - 34, gR = cx + 34, gT = 78;
  p.rect(gL, gT + 30, gR - gL, base - gT - 30, plank[3]);
  for (let y = gT + 30; y < base; y += 6) p.hl(gL, y, gR - gL, plank[2]);
  p.line(gL + 4, gT + 36, gR - 4, gT + 64, post[1]); p.line(gR - 4, gT + 36, gL + 4, gT + 64, post[1]);
  p.poly([[gL - 12, gT + 36], [cx, gT], [gR + 12, gT + 36], [gR + 4, gT + 38], [cx, gT + 10], [gL - 4, gT + 38]], tile[2]);
  p.line(gL - 12, gT + 36, cx, gT, tile[0]); p.line(cx, gT, gR + 12, gT + 36, tile[0]); p.line(gL - 4, gT + 38, cx, gT + 10, plank[4]); p.line(cx, gT + 10, gR + 4, gT + 38, plank[4]);
  for (let k = 0; k < 14; k++) { p.set(cx - 10 - k, gT - 2 - Math.round(Math.sqrt(k) * 4), post[2]); p.set(cx - 11 - k, gT - 2 - Math.round(Math.sqrt(k) * 4), post[1]); p.set(cx + 10 + k, gT - 2 - Math.round(Math.sqrt(k) * 4), post[2]); p.set(cx + 11 + k, gT - 2 - Math.round(Math.sqrt(k) * 4), post[1]); }
  p.rect(cx - 9, gT - 4, 18, 6, post[1]);
  // tejadillo del porche y la puerta oscura
  p.rect(cx - 22, base - 58, 44, 6, tile[2]); p.hl(cx - 22, base - 58, 44, tile[4]); p.hl(cx - 22, base - 53, 44, tile[0]);
  p.rect(cx - 13, base - 50, 26, 50, C('#2a1e18')); p.rect(cx - 11, base - 48, 22, 48, C('#3a2a20')); p.vl(cx - 15, base - 52, 52, post[1]); p.vl(cx + 14, base - 52, 52, post[1]);
  p.rect(cx - 15, base - 3, 30, 3, plank[2]);
  // tendedero con ropa a la izquierda, escaleras y barriles
  p.vl(4, 120, base - 120, post[1]); p.line(4, 122, wL + 10, wT + 6, post[0]);
  const cl = [C('#e8e4dc'), C('#7aa0d0'), C('#d8d0c0'), C('#a07050'), C('#e8e4dc'), C('#8ab070')];
  for (let i = 0; i < 6; i++) { const x = 8 + i * 6, y = Math.round(122 + (wT + 6 - 122) * (x - 4) / (wL + 6)); p.rect(x, y + 1, 5, 9 + (i % 2) * 3, cl[i]); p.hl(x, y + 1, 5, C('#fff')); }
  for (const [x0, y0, x1] of [[38, base - 40, 46], [W - 46, rB - 14, W - 36]]) { p.line(x0, base, x0 + 6, y0, post[1]); p.line(x1, base, x1 + 6, y0, post[1]); for (let y = base - 6; y > y0 + 4; y -= 7) { const t = (base - y) / (base - y0); p.hl(Math.round(x0 + t * 6), y, x1 - x0 + 1, post[2]); } }
  for (const x of [cx - 32, cx + 26, W - 60]) { p.rect(x, base - 16, 12, 15, WOOD[2]); p.hl(x, base - 13, 12, C('#3a3a40')); p.hl(x, base - 5, 12, C('#3a3a40')); p.hl(x, base - 16, 12, WOOD[4]); }
  p.outline(OUTL);
  return { c: p.canvas(), ax: W / 2, ay: H - 2 };
}
hookAfter('dawnAssets', assets => { if (assets && !assets.dadan_house) assets.dadan_house = infHouseArt(); });
XACT.inf_door = [L2('Casa de Dadan · cerrada', 'Dadan’s house · closed'), 'house', () => {
  const P = G.P; if (!P) return;
  toast('🔒 ' + L2('La puerta de los bandidos Dadan está atrancada: no se puede entrar.', 'The Dadan bandits’ door is barred: you can’t go in.'), 'info', 4);
  const d = G.ents.find(e => e.id === 'inf_dadan' && e.map === 'dawn' && !e.remove); if (d) shellsRescueSpeak(d, '¡Eh! ¡Ahí no se entra!', 'Hey! You can’t go in there!');
}];
hookAfter('makeDawn', M => {
  if (!M || M.infHouse) return;
  const o = M.objs.find(o => o.k === 'dawn' && o.dawnKey === 'house17' && o.tx === INF_HOUSE_AT[0] && o.ty === INF_HOUSE_AT[1]);
  if (!o) return; M.infHouse = o;
  o.dawnKey = 'dadan_house'; o.dawnScale = 0.7; o.px = INF_HOUSE_X * 16 + 8; o.xact = 'inf_door';
  // la casa nueva es más ancha: su huella sólida va de x-6 a x+6 alrededor del centro nuevo
  for (let dy = -2; dy <= 0; dy++) for (let dx = -6; dx <= 6; dx++) {
    const x = INF_HOUSE_X + dx, y = INF_HOUSE_AT[1] + dy, i = y * M.w + x; M.solidO[i] = 1; M.objAt[i] = o.id; if (M.flags) M.flags[i] |= 32;
  }
  if (M.xactObjs && !M.xactObjs.includes(o)) M.xactObjs.push(o);
  M.npcDefs.push({ id: 'inf_dadan', x: 366, y: 141, face: 'down' });
  M.chunks.clear();
});
hookAfter('dawnSpawnPeople', (r, M) => { for (const e of G.ents) if (e.type === 'npc' && e.map === M.id && e.def && e.def.infHgt && !e.hgt) e.hgt = e.def.infHgt; });

// ---------- enemigos del recuerdo (dibujados con el motor) ----------
NPCS.inf_garp = { n: 'Monkey D. Garp', title: L2('Vicealmirante · recuerdo', 'Vice Admiral · memory'), look: LK({}), quests: [], lines: [''], infArt: 'garp', infPor: 'garp', infHgt: 46, atlas: () => infAtlas('garp') || npcAtlas('dawn_pirata') };
INF_WHO.garp = { n: 'Monkey D. Garp', t: L2('Vicealmirante', 'Vice Admiral'), por: 'garp', atlas: () => infAtlas('garp') };
const INF_LOOKS = {
  porchemy: { g: 'm', bt: 2, skin: 1, hair: 'negro', hs: 9, top: [1, 'morado'], bot: [0, 'negro'] },
  bluejam: { g: 'm', bt: 3, skin: 2, hair: 'rojo', hs: 4, top: [1, 'granate'], bot: [0, 'negro'] },
  pirata: { g: 'm', bt: 1, skin: 3, hair: 'castano', hs: 0, top: [1, 'gris'], bot: [0, 'marron'] }
};
function infLook(k) { const D = INF_LOOKS[k], app = { ...DEF_APP, g: D.g, bt: D.bt, skin: D.skin, hair: HAIRS[D.hair] ? D.hair : 'negro', eyes: 'marron', hs: D.hs, top: [D.top[0], CLOTH[D.top[1]] ? D.top[1] : 'negro'], bot: [0, CLOTH[D.bot[1]] ? D.bot[1] : 'negro'], shoe: [0, 'negro'] };
  const L = heroLook('guerrero', app, { weapon: k === 'pirata' ? 0 : 1 }, {}, {}); if (k === 'pirata') L.weapon = null; if (k !== 'pirata') L.head = { k: 'dawn_hat', dawn: 'band', cover: 'hat' }; return L; }
hookAround('mobAtlasFor', (next, art) => art && art[0] === 'hum' && INF_LOOKS[art[1]] ? getAtlas('inf_hum:' + art[1], () => buildAtlas(infLook(art[1]), ['idle', 'walk', 'atk', 'hurt', 'dead'], drawHero)) : next(art));
NPCS.inf_porchemy = { n: 'Porchemy', title: '', look: LK({}), quests: [], lines: [''], atlas: () => mobAtlasFor(['hum', 'porchemy']) };
NPCS.inf_bluejam = { n: 'Bluejam', title: '', look: LK({}), quests: [], lines: [''], atlas: () => mobAtlasFor(['hum', 'bluejam']) };
MOBS.inf_pirata = { ...MOBS.dawn_pirata, n: L2('Pirata de Bluejam', 'Bluejam pirate'), art: ['hum', 'pirata'], reg: [], drops: [] };
const INF_WHERE = L2('Recuerdo · Monte Colubo', 'Memory · Mount Colubo');
BOSSES.inf_porchemy = { n: 'Porchemy', lv: 562, hp: 40, atk: 3.2, def: 3.2, spd: 64, r: 30, where: INF_WHERE, art: ['hum', 'porchemy'], moves: ['charge'], drops: [] };
BOSSES.inf_jabali = { n: L2('Jabalí Gigante del Colubo', 'Giant Colubo Boar'), lv: 568, hp: 48, atk: 3.4, def: 3.3, spd: 70, r: 34, where: INF_WHERE, art: ['quad', 'jabali_rey'], moves: ['charge', 'slam'], drops: [] };
BOSSES.inf_bluejam = { n: 'Bluejam', lv: 576, hp: 56, atk: 3.6, def: 3.4, spd: 70, r: 32, where: INF_WHERE, art: ['hum', 'bluejam'], moves: ['charge', 'slam', 'volley'], drops: [] };
if (typeof DAWN_RETO === 'object') Object.assign(DAWN_RETO, { inf_porchemy: 1.6, inf_jabali: 1.7, inf_bluejam: 1.8 });
// técnicas de los niños (las usa crewTechniqueAttack)
CREW_TECHNIQUES.inf_luffy = [['Pistola de Goma', 'Gum-Gum Pistol', 140, 1, 1, 2.3, 'rubber'], ['Mordisco de Goma', 'Gum-Gum Chomp', 50, 2, 1.2, 3.2, 'rubber'], ['Cabezazo', 'Headbutt', 46, 1, 1.4, 3.8, 'axe']];
CREW_TECHNIQUES.inf_ace = [['Golpe de tubo', 'Pipe Strike', 62, 2, 1.3, 2.6, 'sweep'], ['Barrido de tubo', 'Pipe Sweep', 54, 3, 1.25, 3.4, 'sweep'], ['Puño de Ace', 'Ace’s Fist', 44, 1, 1.5, 3.6, 'kick']];
CREW_TECHNIQUES.inf_sabo = [['Tubo de Sabo', 'Sabo’s Pipe', 64, 2, 1.3, 2.5, 'blade'], ['Garra del Dragón', 'Dragon Claw', 50, 1, 1.6, 4, 'kick'], ['Molinete', 'Windmill', 56, 3, 1.2, 3.3, 'sweep']];

// ---------- el recuerdo ----------
SAVEKEYS.push('infDone', 'infHint');
const INF_GT = [292, 158], INF_HUNT = [400, 133], INF_HOUSE_FRONT = [362, 143];
const INF_ROUTE = [[372, 142], [389, 146], [393, 160], [376, 165], [341, 156], [306, 156], [292, 158]];
const infPx = ([x, y]) => [x * 16 + 8, y * 16 + 8];
const infDone = P => (P && P.infDone) || 0;
const infNear = (P, at, r) => dist2(P.x, P.y, ...infPx(at)) < r * r;
function infKid(M, P, id, x, y) {
  const e = spawnNPC(id, x, y, M.id, { scene: true, noTalk: true, hgt: NPCS[id].infHgt, face: 'down' });
  const lv = Math.max(560, Math.min(P.lv || 600, 700)); Object.assign(e, { hp: 1, maxhp: 1, lv, nextAssist: G.t + 1, infKid: 1 });
  return e;
}
function infClear(M, keepMsg) {
  const A = M && M.infArc; if (!A) return;
  for (const e of [...Object.values(A.kids), ...A.cast, ...A.foes]) if (e && !e.dying) e.remove = true;
  if (A.boss && G.bossBar === A.boss) showBoss(null);
  M.infArc = null; const P = G.P; if (P && P.wp && P.wp.infArc) P.wp = null;
}
function infStart() {
  const M = G.map, P = G.P; if (!M || M.id !== 'dawn' || M.infArc || P.dead || P.dawnHelm) return;
  if (P.lv < 560) { toast(L2('Necesitas nivel 560 para el recuerdo.', 'You need level 560 for the memory.'), 'info'); return; }
  closeDialog();
  const go = () => transition(() => {
    for (const e of G.ents) if (e.infHome) e.remove = true;
    const [px, py] = infPx(INF_HOUSE_FRONT); P.x = px; P.y = py; P.dir = 'down'; updateCamera(0, true);
    const A = M.infArc = { owner: P, phase: 'intro', t: G.t, beat: 0, kids: {}, cast: [], foes: [], boss: null, first: !infDone(P) };
    A.kids.luffy = infKid(M, P, 'inf_luffy', px - 24, py + 14);
    A.kids.ace = infKid(M, P, 'inf_ace', px + 30, py + 6);
    banner('📖 ' + L2('Recuerdo de los hermanos', 'Memory of the brothers'), L2('Monte Colubo, hace muchos años', 'Mount Colubo, many years ago'));
    setTimeout(() => infTalk([
      ['dadan', '¡¿Otro mocoso más?! Garp, ¡esto no era parte del trato!', 'Another brat?! Garp, this wasn’t part of the deal!'],
      ['luffy', '¡Hola! Soy Luffy. ¡Voy a ser el Rey de los Piratas!', 'Hi! I’m Luffy. I’m going to be King of the Pirates!'],
      ['ace', '…', '…'],
      ['dadan', 'Ese es Ace. No habla con nadie. Ahí lo tienes… ¡ya se escapa otra vez!', 'That’s Ace. He doesn’t talk to anyone. There he goes… running off again!'],
      ['luffy', '¡Espérame, Ace! ¡Ven conmigo, vamos a seguirlo!', 'Wait for me, Ace! Come on, let’s follow him!']
    ], () => { A.phase = 'chase'; A.t = G.t; A.step = 0; infWp(INF_GT, L2('Sigue a Ace · Gray Terminal', 'Follow Ace · Gray Terminal')); }), 900);
  });
  if (SETTINGS.cine !== false) cinePlay(INF_CINE_INTRO(), go); else go();
}
function infWp(at, t) { setWp({ loc: at, m: 'dawn', t }); if (G.P.wp) G.P.wp.infArc = 1; }
function infFoes(M, A, list) {
  for (const [id, lv, boss, dx, dy] of list) {
    const [cx, cy] = [G.P.x + dx, G.P.y + dy], at = freePxNear(M, cx, cy, 4) || [cx, cy];
    const m = spawnMob(id, lv, at[0], at[1], 0, null, boss); if (!m) continue;
    m.map = 'dawn'; m.aggroT = 99; m.target = G.P; m.state = 'fight'; m.infFoe = 1; A.foes.push(m);
    if (boss) { A.boss = m; showBoss(m); sfx('boss'); banner(m.name, L2('Nivel ', 'Level ') + m.lv); }
  }
}
function infFoesLeft(A) { A.foes = A.foes.filter(f => !f.dying && !f.remove && f.hp > 0); return A.foes.length; }
function infKidsTick(M, A, dt) {
  const P = G.P, list = [A.kids.luffy, A.kids.ace, A.kids.sabo].filter(Boolean);
  list.forEach((e, i) => {
    if (e.remove) return;
    if (dist2(e.x, e.y, P.x, P.y) > 420 ** 2) { e.x = P.x + (i - 1) * 24; e.y = P.y + 22; }
    if (e.actionUntil > G.t) { if (typeof baratiePose === 'function') baratiePose(e); return; }
    if (e.infLead) return;
    let best = null, bd = 1e12; for (const f of A.foes) { if (f.dying || f.remove) continue; const d = dist2(f.x, f.y, e.x, e.y); if (d < bd) { bd = d; best = f; } }
    if (best) {
      if (crewTechniqueAttack(M, e, best, A.foes, () => G.map.infArc === A, 1 + Math.max(0, (e.lv - 560)) * 0.004, 0.22)) return;
      const an = Math.atan2(e.y - best.y, e.x - best.x) + (i - 1) * 0.9; shellsActorMove(M, e, best.x + Math.cos(an) * 40, best.y + Math.sin(an) * 40, dt); return;
    }
    const ox = (i - 1) * 26, oy = 26 + (i % 2) * 8;
    if (dist2(e.x, e.y, P.x + ox, P.y + oy) > 30 ** 2) shellsActorMove(M, e, P.x + ox, P.y + oy, dt * 1.5); else { setAnim(e, 'idle', true); }
  });
}
const infSay = (e, es, en) => { if (e && !e.remove) shellsRescueSpeak(e, es, en); };
function infTick(M, A, dt) {
  const P = G.P, t = G.t - A.t;
  if (P.dead) { infClear(M); toast(L2('El recuerdo se desvanece… Habla con Dadan para volver a intentarlo.', 'The memory fades… Talk to Dadan to try again.'), 'info', 6); return; }
  if (P.dawnHelm || P.x > 470 * 16 || P.y > 230 * 16) { infClear(M); toast(L2('Te alejaste del Monte Colubo: el recuerdo se desvanece.', 'You left Mount Colubo: the memory fades.'), 'info', 5); return; }
  if (A.phase === 'intro' || A.phase === 'talk') return;
  if (A.phase === 'chase') {
    const ace = A.kids.ace; ace.infLead = 1;
    const tgt = INF_ROUTE[Math.min(A.step, INF_ROUTE.length - 1)], [tx, ty] = infPx(tgt);
    // Ace se adelanta pero espera si te quedas atrás
    if (dist2(ace.x, ace.y, P.x, P.y) < 230 ** 2) { if (shellsActorMove(M, ace, tx, ty, dt * 1.6) && A.step < INF_ROUTE.length - 1) A.step++; }
    else { setAnim(ace, 'idle', true); ace.dir = dirFromVec(P.x - ace.x, P.y - ace.y); }
    if (A.beat === 0 && t > 2) { A.beat++; infSay(ace, '¡No me sigas!', 'Stop following me!'); }
    if (A.beat === 1 && t > 9) { A.beat++; infSay(A.kids.luffy, '¡Ace! ¡Espera!', 'Ace! Wait!'); }
    infKidsTick(M, A, dt);
    if (infNear(P, INF_GT, 150)) {
      A.phase = 'talk'; ace.infLead = 0;
      const [sx, sy] = infPx([INF_GT[0] - 3, INF_GT[1] - 2]); A.kids.sabo = infKid(M, P, 'inf_sabo', sx, sy);
      infTalk([
        ['sabo', '¡Ace! ¿Quién es ese? ¿Lo trajiste tú?', 'Ace! Who’s that? Did you bring him?'],
        ['ace', 'No. Me siguió todo el camino. Es el nieto de Garp.', 'No. He followed me the whole way. He’s Garp’s grandson.'],
        ['luffy', '¡Soy Luffy! ¿Qué es este sitio? ¡Huele a basura y a aventura!', 'I’m Luffy! What is this place? It smells like garbage and adventure!'],
        ['sabo', 'El Gray Terminal. Aquí guardamos el tesoro para nuestro barco… ¡Cuidado! ¡Son los piratas de Bluejam!', 'The Gray Terminal. We keep the treasure for our ship here… Look out! It’s Bluejam’s pirates!'],
        ['porchemy', '¡Así que vosotros robasteis el dinero del capitán! ¡Lo vais a devolver con intereses!', 'So you’re the ones who stole the captain’s money! You’ll pay it back with interest!']
      ], () => { A.phase = 'fight1'; A.t = G.t; const lv = Math.max(556, Math.min(P.lv, 640) - 8);
        infFoes(M, A, [['inf_porchemy', 562, true, 0, -110], ['inf_pirata', lv, false, -120, -60], ['inf_pirata', lv, false, 120, -60], ['inf_pirata', lv, false, -150, 40], ['inf_pirata', lv, false, 150, 40]]); });
    }
    return;
  }
  infKidsTick(M, A, dt);
  if (A.phase === 'fight1' && !infFoesLeft(A)) {
    A.phase = 'talk'; A.boss = null; showBoss(null);
    infTalk([
      ['ace', '…No lloraste. Ni cuando te pegaron.', '…You didn’t cry. Not even when they hit you.'],
      ['luffy', '¡Claro que no! ¡Quiero ser vuestro amigo!', 'Of course not! I want to be your friend!'],
      ['sabo', 'Jajaja. Vale. Pero hoy cenamos lo que cacemos. En el bosque del Colubo hay un jabalí enorme.', 'Hahaha. Fine. But tonight we eat whatever we hunt. There’s a huge boar in the Colubo forest.'],
      ['ace', 'El que lo tumbe es el mayor. Vamos.', 'Whoever brings it down is the oldest. Let’s go.']
    ], () => { A.phase = 'hunt_go'; A.t = G.t; infWp(INF_HUNT, L2('Caza en el bosque del Colubo', 'Hunt in the Colubo forest')); });
    return;
  }
  if (A.phase === 'hunt_go' && infNear(P, INF_HUNT, 120)) {
    A.phase = 'fight2'; A.t = G.t; infSay(A.kids.luffy, '¡Ahí está! ¡Es gigante!', 'There it is! It’s huge!');
    infFoes(M, A, [['inf_jabali', 568, true, 40, -90], ['lobo', 560, false, -110, -40], ['lobo', 560, false, 110, -40]]);
    for (const f of A.foes) if (f.mid === 'lobo') { f.name = L2('Lobo del Colubo', 'Colubo wolf'); }
    return;
  }
  if (A.phase === 'fight2' && !infFoesLeft(A)) {
    A.phase = 'talk'; A.boss = null; showBoss(null);
    infTalk([
      ['luffy', '¡Lo tumbé yo! ¡Bueno… un poquito!', 'I brought it down! Well… a little bit!'],
      ['sabo', '¿Qué es ese humo? …¡El Gray Terminal está ardiendo!', 'What’s that smoke? …The Gray Terminal is burning!'],
      ['ace', 'Bluejam. Quiere quemarlo todo con la gente dentro. ¡Vamos!', 'Bluejam. He wants to burn it all with people still inside. Let’s go!']
    ], () => { A.phase = 'fire_go'; A.t = G.t; A.fire = 1; infWp(INF_GT, L2('Gray Terminal en llamas', 'Gray Terminal on fire')); });
    return;
  }
  if (A.phase === 'fire_go' && infNear(P, INF_GT, 140)) {
    A.phase = 'talk';
    infTalk([
      ['bluejam', 'Mira quién vuelve. Los mocosos que no saben cuándo rendirse.', 'Look who’s back. The brats who don’t know when to give up.'],
      ['sabo', 'Aquí vive gente. ¡Apaga el fuego!', 'People live here. Put out the fire!'],
      ['ace', '¡Luffy, quédate detrás de mí! ¡No pienso huir!', 'Luffy, stay behind me! I’m not running!'],
      ['luffy', '¡Yo tampoco! ¡Somos tres!', 'Me neither! There are three of us!']
    ], () => { A.phase = 'fight3'; A.t = G.t; const lv = Math.max(560, Math.min(P.lv, 640) - 6);
      infFoes(M, A, [['inf_bluejam', 576, true, 0, -120], ['inf_pirata', lv, false, -140, -50], ['inf_pirata', lv, false, 140, -50], ['inf_pirata', lv, false, -160, 50], ['inf_pirata', lv, false, 160, 50], ['inf_pirata', lv, false, 0, 120]]); });
    return;
  }
  if (A.phase === 'fight3' && !infFoesLeft(A)) {
    A.phase = 'end'; A.boss = null; showBoss(null); A.fire = 0;
    const fin = () => infEnd(M, A);
    if (SETTINGS.cine !== false) cinePlay(INF_CINE_SAKE(), fin); else fin();
  }
}
function infEnd(M, A) {
  const P = G.P, first = !infDone(P);
  P.infDone = infDone(P) + 1; const gold = first ? 200000 : 50000; P.gold = (P.gold || 0) + gold;
  try { crewBtyGain && crewBtyGain('luffy', 576 * 4000); } catch (e) { }
  infClear(M);
  transition(() => { const [px, py] = infPx(INF_HOUSE_FRONT); P.x = px; P.y = py + 8; P.dir = 'up'; updateCamera(0, true); });
  const got = typeof infClothes === 'function' ? infClothes(first) : [];
  setTimeout(() => {
    xMsg(L2('Desde hoy somos hermanos', 'From today we are brothers'), [
      L2('Dadan: …Esos tres mocosos me van a matar de un disgusto. Pero son mis mocosos.', 'Dadan: …Those three brats will be the death of me. But they’re my brats.'),
      L2('El recuerdo termina en la casa de Dadan, como empezó: con tres copas de sake y una promesa.', 'The memory ends at Dadan’s house, as it began: with three cups of sake and a promise.'),
      '<b>+' + gold.toLocaleString() + ' ' + L2('oro', 'gold') + '</b>' + (got.length ? '<br>🧥 ' + got.map(id => esc(COSM[id].n)).join(', ') : ''),
      L2('Puedes repetir el recuerdo hablando con Dadan: cada vez puede caer otra prenda de los tres hermanos (con pity).', 'You can replay the memory by talking to Dadan: each time another piece of the three brothers’ clothes can drop (with pity).')
    ].join('<br><br>'));
    markDirty(true);
  }, 900);
}
DLG_HOOKS.push((npc, opts) => {
  if (!npc || G.map?.id !== 'dawn' || G.map.infArc) return;
  if (!['inf_dadan', 'inf_luffy', 'inf_ace', 'inf_sabo'].includes(npc.id)) return;
  const P = G.P, n = infDone(P);
  opts.unshift({ label: (n ? '🔁 ' : '<b class="q">!</b> ') + L2('Recuerdo de los hermanos', 'Memory of the brothers') + (n ? '' : ' <i>(' + L2('historia', 'story') + ')</i>') + ' · ' + L2('Nv. ', 'Lv. ') + 560, cls: n ? '' : 'quest', icon: n ? ['talk'] : null, fn: infStart });
});
// ---------- los tres niños en la casa de Dadan (fuera del recuerdo) ----------
const INF_HOME = [['inf_luffy', 358, 143], ['inf_ace', 368, 144], ['inf_sabo', 371, 142]];
V33_TICKS.push(dt => {
  const M = G.map, P = G.P; if (!M || !P || M.id !== 'dawn') return;
  if (M.infArc) { if (M.infArc.owner !== P) { infClear(M); return; } infTick(M, M.infArc, Math.min(dt || 0.016, 0.1)); return; }
  const near = infNear(P, INF_HOUSE_AT, 520);
  const home = G.ents.filter(e => e.infHome && !e.remove && e.map === M.id);
  if (!near) { for (const e of home) e.remove = true; return; }
  if (!home.length) for (const [id, x, y] of INF_HOME) { const at = freePxNear(M, x * 16 + 8, y * 16 + 8, 4); if (at) { const e = spawnNPC(id, at[0], at[1], M.id, { wander: 2, hgt: NPCS[id].infHgt, face: 'down' }); if (e) e.infHome = 1; } }
  // aviso la primera vez que pisas Foosha: es la primera historia del Mar de Dawn
  if (!infDone(P) && !P.infHint && !P.dawnHelm) { P.infHint = 1; banner('📖 ' + L2('Nueva historia: Recuerdo de los hermanos', 'New story: Memory of the brothers'), L2('Habla con Dadan en su casa del Monte Colubo', 'Talk to Dadan at her house on Mount Colubo')); setWp({ loc: INF_DOOR, m: 'dawn', t: L2('Casa de Dadan', 'Dadan’s house') }); markDirty(); }
});
hookAfter('setMap', () => { const M = G.maps && G.maps.dawn; if (M && M.infArc && G.map !== M) infClear(M); });
// filtro de recuerdo (sepia) y fuego del Gray Terminal
WORLD_DRAW.push((cx, cy) => {
  const M = G.map, A = M && M.infArc; if (!A || CINE.on) return;
  ctx.save(); ctx.fillStyle = 'rgba(150,110,60,.20)'; ctx.fillRect(0, 0, VW, VH);
  const g = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, VH * 0.8); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,35,10,.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  if (A.fire) { const [gx, gy] = infPx(INF_GT), d = Math.hypot(G.P.x - gx, G.P.y - gy), a = clamp(1 - d / 900, 0, 1);
    if (a > 0) { ctx.fillStyle = `rgba(255,90,20,${(0.22 * a).toFixed(2)})`; ctx.fillRect(0, 0, VW, VH);
      for (let i = 0; i < 40; i++) { const x = (i * 97 + G.t * 30 * (1 + i % 3)) % VW, y = VH - ((i * 53 + G.t * 60 * (1 + i % 2)) % VH); ctx.fillStyle = i % 3 ? 'rgba(255,170,60,.8)' : 'rgba(255,230,140,.8)'; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
      for (let i = 0; i < 9; i++) { const fx = gx - cx + Math.sin(i * 2.1) * 220, fy = gy - cy + Math.cos(i * 1.7) * 120; const h = 14 + 6 * Math.sin(G.t * 9 + i);
        ctx.fillStyle = 'rgba(255,120,30,.85)'; ctx.beginPath(); ctx.moveTo(fx - 8, fy); ctx.lineTo(fx, fy - h); ctx.lineTo(fx + 8, fy); ctx.fill(); ctx.fillStyle = 'rgba(255,220,120,.9)'; ctx.beginPath(); ctx.moveTo(fx - 4, fy); ctx.lineTo(fx, fy - h * 0.6); ctx.lineTo(fx + 4, fy); ctx.fill(); } } }
  ctx.restore();
});

// ---------- cinemáticas ----------
function infCnSpr(x, key, row, col, X, Y, s) { const im = INF_SHEETS[key]; if (!im || !im.naturalWidth) return; const cw = INF_CELL.w, ch = INF_CELL.h; x.drawImage(im, col * cw, row * ch, cw, ch, Math.round(X - cw * s / 2), Math.round(Y - ch * s * 0.96), Math.round(cw * s), Math.round(ch * s)); }
CN_SC.inf_garp = (x, t, k) => {
  cnSky(x, '#7ab8e0', '#d8ecd0'); for (let i = 0; i < 4; i++) cnCloud(x, ((i * 80 + t * 4) % 320) - 40, 18 + (i % 2) * 10, 1, 'rgba(255,255,255,.85)');
  cnGround(x, 104, '#5a9a44', '#6ab052');
  for (let i = 0; i < 9; i++) { const X = i * 32 - 6; cnR(x, '#3a6a2e', X, 60 + (i % 3) * 4, 26, 46); cnR(x, '#4a8a3a', X + 3, 58 + (i % 3) * 4, 20, 10); }
  const H = dawnSprite('dadan_house', 1); if (H) x.drawImage(H.c, 70, 104 - 92, 118, 93);
  const walk = Math.floor(t * 6) % 4, gx = Math.max(150, 250 - t * 28);
  infCnSpr(x, 'dadan', 0, k > 0.6 ? 5 : 0, 112, 120, 0.42);
  infCnSpr(x, 'garp', gx > 150 ? 1 : 0, gx > 150 ? 1 + walk : 5, gx, 122, 0.42);
  infCnSpr(x, 'luffy', gx > 150 ? 1 : 0, gx > 150 ? 1 + walk : 5, gx - 22, 122, 0.42);
};
CN_SC.inf_fuego = (x, t, k) => {
  cnSky(x, '#3a1a20', '#d8602a'); for (let i = 0; i < 18; i++) { const X = i * 15, h = 20 + cnRnd(i) * 26 + Math.sin(t * 8 + i) * 4; cnR(x, '#ff8a2a', X, 104 - h, 12, h); cnR(x, '#ffd070', X + 3, 104 - h * 0.6, 6, h * 0.6); }
  cnGround(x, 104, '#3a2a22', '#4a3a2a'); for (let i = 0; i < 30; i++) cnR(x, '#6a5a4a', (i * 37) % CN_W, 106 + (i * 13) % 30, 6, 3);
  infCnSpr(x, 'ace', 3, 1 + Math.floor(t * 6) % 4, 100, 126, 0.42); infCnSpr(x, 'sabo', 3, 1 + Math.floor(t * 6 + 2) % 4, 128, 128, 0.42); infCnSpr(x, 'luffy', 3, 1 + Math.floor(t * 6 + 1) % 4, 156, 126, 0.42);
};
CN_SC.inf_sake = (x, t, k) => {
  cnSky(x, '#3a2a5a', '#ffb070'); x.globalAlpha = 0.9; x.fillStyle = '#ffe0a0'; x.beginPath(); x.arc(200, 92, 18, 0, 7); x.fill(); x.globalAlpha = 1;
  cnR(x, '#2a3a5a', 0, 96, CN_W, 48); for (let i = 0; i < CN_W; i += 6) cnR(x, '#ffd890', i + (Math.floor(t * 4) % 6), 100 + (i % 18) / 3, 3, 1);
  x.fillStyle = '#3a2a1e'; x.beginPath(); x.moveTo(20, 144); x.lineTo(40, 108); x.lineTo(150, 102); x.lineTo(176, 144); x.fill(); cnR(x, '#5a8a3a', 40, 104, 110, 4);
  const up = k > 0.35, cup = (X, Y) => { cnR(x, '#e8d8b8', X - 3, Y, 7, 3); cnR(x, '#a03a2a', X - 3, Y + 1, 7, 1); if (up && k > 0.5) for (let i = 0; i < 3; i++) cnR(x, '#d8f0ff', X - 1 + i, Y - 2 - ((t * 8 + i) % 3), 1, 1); };
  infCnSpr(x, 'ace', 0, up ? 5 : 0, 70, 106, 0.44); infCnSpr(x, 'sabo', 0, up ? 5 : 0, 96, 106, 0.44); infCnSpr(x, 'luffy', 0, up ? 5 : 0, 122, 106, 0.44);
  if (up) { cup(76, 70 - (k > 0.5 ? 6 : 0)); cup(98, 66 - (k > 0.5 ? 6 : 0)); cup(116, 70 - (k > 0.5 ? 6 : 0)); }
};
const INF_CINE_INTRO = () => [
  { s: 'inf_garp', title: L2('Monte Colubo · hace muchos años', 'Mount Colubo · many years ago'), txt: L2('Garp, el héroe de la Marina, subió al monte con su nieto a cuestas y se lo dejó a la bandida Dadan. «Críalo fuerte», le dijo.', 'Garp, the Navy’s hero, climbed the mountain with his grandson and left him with the bandit Dadan. "Raise him strong," he said.') },
  { s: 'inf_garp', txt: L2('En aquella casa ya vivía otro chico, Ace, que no hablaba con nadie… y que siempre se escapaba hacia el Gray Terminal.', 'Another boy already lived in that house, Ace, who spoke to no one… and who always ran off to the Gray Terminal.') }];
const INF_CINE_SAKE = () => [
  { s: 'inf_fuego', title: L2('El Gray Terminal', 'The Gray Terminal'), txt: L2('Esa noche el fuego se apagó solo al amanecer. Los tres chicos salieron del humo con la ropa negra y las manos juntas.', 'That night the fire died out at dawn. The three boys came out of the smoke with blackened clothes and joined hands.') },
  { s: 'inf_sake', title: L2('Las copas de sake', 'The sake cups'), txt: L2('Sabo robó una botella de Dadan. En lo alto del acantilado llenaron tres copas.', 'Sabo stole a bottle from Dadan. At the top of the cliff they filled three cups.') },
  { s: 'inf_sake', txt: L2('«Cuando compartes una copa de sake te vuelves hermano. ¡Desde hoy somos hermanos!» Algún día los tres se harían a la mar.', '"When you share a cup of sake you become brothers. From today we are brothers!" Some day all three would set out to sea.') }];

// ---------- Lupa › Crossovers: primera historia del Mar de Dawn ----------
{
  const route = LUPA_DAWN.find(([id]) => id === 'ruta');
  if (route) {
    const prevList = route[2], prevNext = route[3];
    route[2] = () => { const out = prevList().slice(), P = G.P || {}; let at = out.findIndex(s => /^(✅|⬜) ?3\./u.test(s));
      if (at < 0) at = Math.min(3, out.length);
      for (let i = at; i < out.length; i++) out[i] = out[i].replace(/^((?:✅|⬜) ?)(\d+)\./u, (m0, a, n) => a + (+n + 1) + '.');
      out.splice(at, 0, (infDone(P) ? '✅ ' : '⬜ ') + L2('3. Villa Foosha · Recuerdo de los hermanos (primera historia, antes de Shanks): habla con Dadan en su casa del Monte Colubo. Con Luffy, Ace y Sabo niños: ', '3. Foosha Village · Memory of the brothers (first story, before Shanks): talk to Dadan at her house on Mount Colubo. With young Luffy, Ace and Sabo: ') + cxBoss('inf_porchemy') + ' → ' + cxBoss('inf_jabali') + ' → ' + cxBoss('inf_bluejam') + '.');
      return out; };
    route[3] = () => { const P = G.P; if (P && dfHas() && !infDone(P)) return { loc: INF_DOOR, m: 'dawn', t: L2('Casa de Dadan · Recuerdo de los hermanos', 'Dadan’s house · Memory of the brothers') }; return prevNext(); };
  }
  LUPA_DAWN.push(['infancia630', () => '📖 ' + L2('Recuerdo de los hermanos', 'Memory of the brothers'), () => [
    L2('Casa de Dadan (Monte Colubo, Villa Foosha): no se puede entrar, pero Dadan y los tres niños están fuera.', 'Dadan’s house (Mount Colubo, Foosha Village): you can’t go in, but Dadan and the three kids are outside.'),
    L2('Habla con Dadan (o con Luffy, Ace o Sabo) para jugar el recuerdo. Nivel 560. Pasa con un filtro de recuerdo y se repite cuando quieras.', 'Talk to Dadan (or Luffy, Ace or Sabo) to play the memory. Level 560. It plays with a memory filter and can be replayed whenever you like.'),
    L2('1) Sigue a Ace hasta el Gray Terminal. 2) Sabo y la pelea con Porchemy y los piratas de Bluejam. 3) Caza del Jabalí Gigante en el bosque del Colubo. 4) El Gray Terminal arde: Bluejam. 5) Cinemática de las copas de sake.', '1) Follow Ace to the Gray Terminal. 2) Sabo and the fight with Porchemy and Bluejam’s pirates. 3) Hunt the Giant Boar in the Colubo forest. 4) The Gray Terminal burns: Bluejam. 5) Sake cups cutscene.'),
    L2('Luffy, Ace y Sabo niños pelean contigo con sus técnicas. Si caes, el recuerdo se desvanece y vuelves a empezar.', 'Young Luffy, Ace and Sabo fight alongside you with their techniques. If you fall, the memory fades and you start again.'),
    L2('Premio: 200.000 de oro la primera vez (50.000 al repetir) y la ropa de los tres hermanos (ver «Ropa de los hermanos»).', 'Reward: 200,000 gold the first time (50,000 on replays) and the three brothers’ clothes (see "Brothers’ clothes").'),
    (infDone(G.P) ? '✅ ' + L2('Completado ', 'Completed ') + infDone(G.P) + '×' : '⬜ ' + L2('Sin completar', 'Not completed'))],
    () => ({ loc: INF_DOOR, m: 'dawn', t: L2('Casa de Dadan', 'Dadan’s house') })]);
}
