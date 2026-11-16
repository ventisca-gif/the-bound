// ================= v4.86: JAPÓN (quinta parte) =================
// Ruri, novena integrante de PRISM9, con el sprite del dibujo de Sergio (tools/dev/ruri.py): enamorable, con beso y abrazo.
// Su peinado («Melena de Ruri») para chicas. Color de pelo «Turquesa vivo» para todos. Tienda de cómics de Akihabara con
// 8 mangas que se leen (viñetas con los personajes del juego) y un dependiente que cuenta historias y curiosidades.
// El mapa de las Tierras sin Pintar ya sale en el panel del mapa.

// ---------- pelo: color turquesa vivo y la melena de Ruri ----------
HAIRS.turquesa_v = pal(['#0a4a4a', '#14807e', '#22b8b0', '#5ae6dc']); HAIR_ORDER.push('turquesa_v'); HAIR_N.turquesa_v = L2('Turquesa vivo', 'Bright turquoise');
AH.melena_ruri = c => { c.mane(c.Y(0.56), 6, 4, { w: 4.8, wild: 1, wav: 0.7 }); c.cap(2, { bumps: 11, ba: 0.09 }); c.sidelocks(c.Y(0.36), 3.2, { out: 1.6 }); c.fringe('messy', 6, { drop: 1 });
  if (!c.up && !c.side) for (const s of [-1, 1]) ahLock(c.F, [[c.hx + s * (c.rx - 0.6), c.hy], [c.hx + s * (c.rx + 2), c.hy + c.ry + 1], [c.hx + s * (c.rx + 2.6), c.hy + c.ry + 6]], 2.4, 0.6, {}); };
HS_F.push({ n: L2('Melena de Ruri', 'Ruri\'s mane'), cap: 'volume', bang: 'messy', side: 12, back: 18, bw: 1.3, jag: 1, layer: 1, ah: 'melena_ruri' });

// ---------- Ruri (sprite del dibujo de Sergio) ----------
const RURI_CV = (() => { const [fw, fh] = RURI_SIZE, c = mkCanvas(fw * 10, fh * 4), im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = RURI_SHEET; return c; })();
function ruriAtlas() { return getAtlas('npc_ruri', () => { const [fw, fh] = RURI_SIZE, base = { idle: 0, walk: 2, kiss: 6, hug: 8 }; return { img: RURI_CV, fw, fh, idx: new Proxy(base, { get: (t, k) => (k in t ? t[k] : 0) }), ax: fw >> 1, ay: fh - 2 }; }); }
const RURI = { k: 'ruri', n: 'Ruri', line: L2('Mi pelo es del color de la noche sobre Tokio. Por eso canto cuando se apagan las luces.', 'My hair is the colour of the night over Tokyo. That\'s why I sing when the lights go out.') };
NPCS.idol_ruri = { n: 'Ruri', title: 'PRISM9', look: LK({ g: 'f' }), lines: ['«' + RURI.line + '»', L2('Soy la novena estrella de PRISM9. La última en llegar… y la que más ensaya.', 'I\'m the ninth star of PRISM9. The last to join… and the one who rehearses the most.')], quests: [] };
ROM.idol_ruri = { g: 'f', loves: ['ring', 'crystal', 'gem'], likes: ['bouquet', 'cake', 'amulet'], hates: ['bone', 'ore'], taste: L2('las cadenas plateadas, los cristales y las gemas azules', 'silver chains, crystals and blue gems') }; ROM_WHERE.idol_ruri = L2('Cruce de Shibuya (Japón)', 'Shibuya Crossing (Japan)');
{ const _na = npcAtlas; npcAtlas = function (id) { if (id === 'idol_ruri') return ruriAtlas(); return _na.apply(this, arguments); }; }
{ const _mj = makeJapan; makeJapan = function () { const had = G.maps.japon, M = _mj.apply(this, arguments); if (!had && M) spawnNPC('idol_ruri', 264 * 16 + 8, 58 * 16 + 8, 'japon', { face: 'down', wander: 2 }); return M; }; }
// en el escenario PRISM9 baila con sus nueve integrantes (Ruri con su propio sprite)
{ const _g = jpLiveGroup; jpLiveGroup = function (next) { const r = _g(next); if (r.name === 'PRISM9') { r.n = 9; r.at = i => (i === 8 ? ruriAtlas() : xwAtlas(i, PRISM_APPS)); } return r; }; }
// su ropa para la estilista Mio
idDefineSet({ k: 'ruri', n: L2('Corsé Azul de Ruri', 'Ruri\'s Blue Corset'), price: 30000, body: () => ({ k: 'id_corse', m: IDP.azul, ch: IDP.plata, sl: 'det' }), legs: () => ({ k: 'shorts', m: IDP.negro }), feet: () => ({ k: 'boots', m: IDP.negro }) });

// ---------- tienda de cómics (Akihabara) ----------
JP_H_OF.comics = () => 104; JP_ROOF.comics = ['#ffd040'];
function jpComicsB(w) { const W = w * 16, H = JP_H_OF.comics(), [c, g] = XC(W, H), R = (x, y, ww, hh, col) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  R(0, 4, W, H - 4, '#2a2a3a'); R(0, 0, W, 5, '#1a1a24'); R(4, 8, W - 8, 18, '#ffd040'); R(6, 10, W - 12, 14, '#1a1a24'); const t = '漫画・コミック', tw = jpW(t, 10); jpText(g, t, (W - tw) / 2, 11, '#ffd040', 10);
  // pósteres de cómic con viñetas y personajes del juego
  for (let i = 0; i < 3; i++) { const x = 6 + i * ((W - 12) / 3), pw = (W - 12) / 3 - 4; R(x, 30, pw, 40, ['#ff5a8a', '#5ab0ff', '#8aff6a'][i]); R(x + 2, 32, pw - 4, 36, '#fff8e8'); R(x + 2, 49, pw - 4, 1, '#1a1a24'); R(x + pw / 2, 32, 1, 17, '#1a1a24'); if (i === 1) idolPortrait(g, x + 4, 50, 2, 0.5); else jpPortrait(g, x + 4, 50, (i * 5) % 8, 0.5); g.fillStyle = '#1a1a24'; g.font = 'bold 9px monospace'; g.fillText('!?', x + 6, 44); }
  R(0, H - 30, W, 4, '#ff5a8a'); R(0, H - 26, W, 23, '#fff4e0'); for (let x = 3; x < W - 3; x += 4) R(x, H - 22, 3, 8 + (x * 3) % 7, ['#ff5a8a', '#5ab0ff', '#ffd040', '#8aff6a', '#c08aff'][x % 5]); R((W >> 1) - 7, H - 22, 14, 19, '#2a3a4a'); R((W >> 1) - 6, H - 21, 6, 18, 'rgba(160,210,255,0.5)'); R(0, H - 3, W, 3, '#5a5650');
  return { c, ax: W / 2, ay: H - 1 }; }
{ const _jb = jpBld; jpBld = function (key) { const [, kind, ws] = key.split('_'); if (kind === 'comics') return jpComicsB(+ws); return _jb.apply(this, arguments); }; }
{ const _bl = jpBldLights; jpBldLights = function (kind, w) { if (kind === 'comics') return [[0, -50, 60, 'rgba(255,220,100,0.55)']]; return _bl.apply(this, arguments); }; }
JP_IN.comics = { n: L2('Tienda de cómics', 'Comic shop'), j: '漫画' };
NPCS.jp_comic_st = { n: L2('Tendero de cómics', 'Comic shopkeeper'), title: L2('Otaku de Akihabara', 'Akihabara otaku'), look: LK({ g: 'm' }), lines: [jlTxt(['新刊、入ったよ！', 'Shinkan, haitta yo!', '¡Han llegado números nuevos! Pregúntame lo que quieras, me lo sé todo.', 'New issues just came in! Ask me anything, I know it all.'])], quests: [] }; JP_NPC_LOOK.jp_comic_st = 9;
{ const _mi = makeJpIn; makeJpIn = function (k) { if (k === 'comics') return makeComicsIn(); return _mi.apply(this, arguments); }; }
function makeComicsIn() { const id = 'jp_comics_in'; if (G.maps[id]) return G.maps[id]; const w = 20, h = 14, M = jpRoom(id, w, h, 3, 0.05, 'comics'), F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  for (const [x, y] of [[2, 3], [6, 3], [11, 3], [15, 3], [3, 7], [13, 7]]) F('jp_estante_manga', x, y, [[0, 0], [1, 0], [2, 0]]); F('jp_caja', 8, 9, [[0, 0], [1, 0], [2, 0]]); spawnNPC('jp_comic_st', 9 * 16 + 8, 8 * 16 + 8, id, { face: 'down' }); spawnNPC('jp_7', 4 * 16 + 8, 10 * 16 + 8, id, { face: 'up', wander: 2 });
  M.drawExtra = (cx, cy) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || Y < -16 || X > VW || Y > VH) continue; if (y < 3) { ctx.fillStyle = '#2a2a3a'; ctx.fillRect(X, Y, 16, 16); } else { ctx.fillStyle = (x + y) % 2 ? '#3a3a4e' : '#34344a'; ctx.fillRect(X, Y, 16, 16); } }
    for (let k = 0; k < 9; k++) { const X = (1 + k * 2) * 16 - cx, Y = 4 - cy; ctx.fillStyle = ['#ff5a8a', '#5ab0ff', '#ffd040', '#8aff6a', '#c08aff'][k % 5]; ctx.fillRect(X, Y, 24, 30); ctx.fillStyle = '#fff8e8'; ctx.fillRect(X + 2, Y + 2, 20, 26); ctx.fillStyle = '#1a1a24'; ctx.fillRect(X + 2, Y + 14, 20, 1); ctx.fillRect(X + 12, Y + 2, 1, 12); }
    jpText(ctx, '漫画', 9 * 16 - cx, 40 - cy, '#ffd040', 12); };
  G.maps[id] = M; return M; }
XSPR.jp_estante_manga = () => { const [c, g] = XC(48, 34); g.fillStyle = '#5a3a24'; g.fillRect(0, 0, 48, 34); for (let y = 2; y < 32; y += 10) { g.fillStyle = '#3a2416'; g.fillRect(0, y + 8, 48, 2); for (let x = 2; x < 46; x += 3) { g.fillStyle = ['#ff5a8a', '#5ab0ff', '#ffd040', '#8aff6a', '#c08aff', '#ffffff', '#ff7a3a'][(x * 3 + y) % 7]; g.fillRect(x, y, 2, 8); } } return { c, ax: 8, ay: 33 }; };
// ---------- los mangas: se leen desde la mochila (no se gastan) ----------
// viñetas: [quién, texto]; quién = idol (hikari…yuzu, kira…nene, ruri), 'neko', 'heroe', 'akane', 'slime', 'ventisca', 'narr'
const COMICS = [
  { k: 'stella1', n: L2('STELLA☆LINK nº 1: El primer concierto', 'STELLA☆LINK #1: The first concert'), col: '#ff8ac0', p: [
    ['narr', L2('Akihabara, cinco minutos antes del primer concierto.', 'Akihabara, five minutes before the first concert.')], ['hikari', L2('¿Y si se me olvida la letra? ¿Y si tropiezo? ¿Y si…?', 'What if I forget the lyrics? What if I trip? What if…?')],
    ['sora', L2('Mira al público. ¿Ves las barras de luz? Cada una es alguien que vino por nosotras.', 'Look at the crowd. See the penlights? Each one is someone who came for us.')], ['mei', L2('¡Y yo traje caramelos por si alguien se desmaya!', 'And I brought candy in case someone faints!')],
    ['rin', L2('Respira. Una canción es un hilo: solo hay que no soltarlo.', 'Breathe. A song is a thread: you just have to hold on.')], ['yuzu', L2('¡Tres, dos, uno…!', 'Three, two, one…!')], ['hikari', L2('¡Gracias, Akihabara! ¡Brillemos juntos!', 'Thank you, Akihabara! Let\'s shine together!')]] },
  { k: 'neko', n: L2('El gato que quería ser idol', 'The cat who wanted to be an idol'), col: '#f4b860', p: [
    ['neko', L2('Miau. (Traducción: estoy harto de que solo me acaricien. Yo quiero aplausos.)', 'Meow. (Translation: I\'m tired of only being petted. I want applause.)')], ['narr', L2('Esa noche, el gato naranja del café se coló en la sala de conciertos.', 'That night, the café\'s orange cat sneaked into the concert hall.')],
    ['mei', L2('¡¿Un gato en el escenario?!', 'A cat on the stage?!')], ['neko', L2('Miau. (Traducción: el foco es mío.)', 'Meow. (Translation: the spotlight is mine.)')], ['narr', L2('El público gritó más fuerte que nunca.', 'The crowd cheered louder than ever.')],
    ['yuzu', L2('Vale, nuevo integrante honorífico. Pero los ensayos son a las nueve.', 'Fine, new honorary member. But rehearsals are at nine.')], ['neko', L2('Miau. (Traducción: renuncio.)', 'Meow. (Translation: I quit.)')]] },
  { k: 'kira', n: L2('PRISM9: La cremallera de Kira', 'PRISM9: Kira\'s zipper'), col: '#3a6a9e', p: [
    ['kira', L2('Tenemos un problema. La cremallera del corsé no sube.', 'We have a problem. The corset zipper won\'t go up.')], ['umi', L2('¡Faltan dos minutos!', 'Two minutes left!')], ['hana', L2('Tira fuerte. Sin miedo.', 'Pull hard. No fear.')],
    ['kira', L2('Si tiro más fuerte salgo al escenario con media cremallera en la mano.', 'If I pull any harder I\'ll go on stage holding half a zipper.')], ['ruri', L2('Quieta. Con una cadena plateada lo atamos y parecerá a propósito.', 'Hold still. We\'ll tie it with a silver chain and it\'ll look intentional.')],
    ['narr', L2('Esa noche, medio Tokio copió el «look de la cadena».', 'That night, half of Tokyo copied «the chain look».')], ['kira', L2('…De nada, moda.', '…You\'re welcome, fashion.')]] },
  { k: 'ventisca', n: L2('La Ventisca dibuja Japón', 'The Ventisca draws Japan'), col: '#c8e8ff', p: [
    ['narr', L2('Más allá del Lienzo, la Ventisca escribe tierras nuevas cada estación.', 'Beyond the Canvas, the Ventisca writes new lands every season.')], ['ventisca', L2('Hoy no pintaré un bosque ni un desierto. Pintaré un recuerdo.', 'Today I won\'t paint a forest or a desert. I\'ll paint a memory.')],
    ['narr', L2('Un monte nevado. Calles llenas de luces. Cerezos que caen como nieve rosa.', 'A snowy mountain. Streets full of lights. Cherry trees falling like pink snow.')], ['ventisca', L2('Cada casilla de 16 en 16, como hacían los Tejedores. Así sabrá el mundo que es suyo.', 'Each tile sixteen by sixteen, as the Weavers did. That way the world will know it belongs.')],
    ['heroe', L2('…¿Por eso hay un aeródromo en Albor?', '…Is that why there\'s an aerodrome in Albor?')], ['ventisca', L2('Un recuerdo no sirve de nada si nadie puede ir a verlo.', 'A memory is no use if nobody can go and see it.')]] },
  { k: 'slime', n: L2('Diario de un slime en Tokio', 'Diary of a slime in Tokyo'), col: '#8aff6a', p: [
    ['slime', L2('Día 1. Llegué en avión. Nadie me miró raro. Aquí todo el mundo es raro.', 'Day 1. Arrived by plane. Nobody looked at me funny. Everyone here is funny.')], ['slime', L2('Día 2. Intenté comprar un té en una máquina expendedora. La máquina me compró a mí.', 'Day 2. I tried to buy tea from a vending machine. The machine bought me.')],
    ['heroe', L2('¿Qué haces ahí dentro?', 'What are you doing in there?')], ['slime', L2('Ser el producto del mes.', 'Being product of the month.')],
    ['slime', L2('Día 3. Crucé Shibuya con todo el mundo a la vez. Me pisaron 41 veces. Fue precioso.', 'Day 3. Crossed Shibuya with everyone at once. Got stepped on 41 times. It was beautiful.')], ['slime', L2('Día 4. Vuelvo a Albor. Allí al menos solo me atacan los héroes.', 'Day 4. Going back to Albor. At least there only heroes attack me.')]] },
  { k: 'semaforo', n: L2('El héroe y el semáforo', 'The hero and the traffic light'), col: '#ffd040', p: [
    ['heroe', L2('He vencido a guardianes, a un Desatado y a un Eclipse. No me da miedo nada.', 'I\'ve beaten guardians, an Unbound and an Eclipse. Nothing scares me.')], ['narr', L2('Semáforo en rojo.', 'Red light.')],
    ['heroe', L2('…Espero.', '…I\'ll wait.')], ['akane', L2('Muy bien. En Japón hasta los héroes esperan al verde.', 'Good. In Japan even heroes wait for green.')],
    ['heroe', L2('¿Y por qué los coches frenan cuando me pongo delante?', 'And why do cars brake when I stand in front of them?')], ['akane', L2('Porque eres el único que lleva una espada al supermercado.', 'Because you\'re the only one who brings a sword to the supermarket.')]] },
  { k: 'ruri', n: L2('Ruri, la novena estrella', 'Ruri, the ninth star'), col: '#24406a', p: [
    ['akane', L2('PRISM tiene ocho. No busco a nadie más.', 'PRISM has eight. I\'m not looking for anyone else.')], ['ruri', L2('Entonces no me busque. Solo escúcheme una canción.', 'Then don\'t look for me. Just listen to one song.')],
    ['narr', L2('Ruri cantó con las luces apagadas. Su voz sonaba como la noche sobre Tokio.', 'Ruri sang with the lights off. Her voice sounded like the night over Tokyo.')], ['kira', L2('…Vale. Yo no lloro. Es el humo del escenario.', '…Okay. I don\'t cry. It\'s the stage smoke.')],
    ['akane', L2('PRISM9. Me gusta cómo suena.', 'PRISM9. I like how that sounds.')], ['ruri', L2('Ensayo a las seis. De la mañana.', 'Rehearsal at six. In the morning.')], ['mika', L2('¡¿DE LA MAÑANA?!', 'IN THE MORNING?!')]] },
  { k: 'onsen', n: L2('Onsen y leche con café', 'Onsen and coffee milk'), col: '#5aa8c0', p: [
    ['narr', L2('Día libre. Las idols van al onsen del Fuji.', 'Day off. The idols go to the Fuji onsen.')], ['sena', L2('Aaah… El agua del Fuji te quita hasta los malos ensayos.', 'Aaah… Fuji\'s water washes away even bad rehearsals.')],
    ['umi', L2('Lo mejor viene al salir: leche con café.', 'The best part comes after: coffee milk.')], ['jun', L2('Leche de fruta. Siempre leche de fruta.', 'Fruit milk. Always fruit milk.')],
    ['narr', L2('Comenzó la Gran Guerra de la Leche, que duró veinte minutos.', 'The Great Milk War began, and lasted twenty minutes.')], ['hikari', L2('¿Y si… mezclamos las dos?', 'What if… we mix both?')], ['narr', L2('Nadie volvió a hablar de aquello.', 'Nobody ever spoke of it again.')]] }];
for (const C of COMICS) it('jp_manga_' + C.k, { n: C.n, t: 'cons', comic: C.k, stack: true, price: 2500, icon: ['book', C.col], rar: 2, d: L2('Manga de la tienda de cómics de Akihabara. Úsalo para leerlo (no se gasta).', 'Manga from the Akihabara comic shop. Use it to read it (it isn\'t used up).') });
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx], i_ = s && ITEMS[s.id]; if (i_ && i_.comic) { comicRead(i_.comic); return; } return _ui.apply(this, arguments); }; }
const COMIC_WHO = { hikari: [IDOL_APPS, 0], sora: [IDOL_APPS, 1], mei: [IDOL_APPS, 2], rin: [IDOL_APPS, 3], yuzu: [IDOL_APPS, 4] }; PRISM.forEach((I, i) => COMIC_WHO[I.k] = [PRISM_APPS, i]);
function comicFace(cv, who) { const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, cv.width, cv.height); const W = cv.width, H = cv.height;
  try { if (COMIC_WHO[who]) { const [apps, i] = COMIC_WHO[who], A = xwAtlas(i, apps); g.drawImage(A.img, A.idx.idle * A.fw + 7, 2, 34, 30, 0, 0, W, H * 30 / 34 * W / W); return; }
    if (who === 'ruri') { const A = ruriAtlas(); g.drawImage(A.img, 0, 0, A.fw, Math.round(A.fh * 0.6), (W - W * 0.9) / 2, 0, W * 0.9, H * 0.9); return; }
    if (who === 'heroe' && G.P && G.P.atlas) { const A = G.P.atlas; g.drawImage(A.img, A.idx.idle * A.fw + 7, 2, 34, 30, 0, 0, W, H); return; }
    if (who === 'akane') { const A = npcAtlas('jp_prod'); g.drawImage(A.img, A.idx.idle * A.fw + 7, 2, 34, 30, 0, 0, W, H); return; }
    if (who === 'neko') { const S = nekoSprite(0, 1, 0); g.drawImage(S.c, 0, 0, 18, 14, W * 0.1, H * 0.2, W * 0.8, H * 0.62); return; }
    if (who === 'slime') { g.fillStyle = '#5ac83a'; g.beginPath(); g.ellipse(W / 2, H * 0.62, W * 0.38, H * 0.3, 0, 0, 7); g.fill(); g.fillStyle = '#8af06a'; g.beginPath(); g.ellipse(W * 0.42, H * 0.5, W * 0.12, H * 0.08, 0, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(W * 0.38, H * 0.58, 4, 6); g.fillRect(W * 0.58, H * 0.58, 4, 6); return; }
    if (who === 'ventisca') { g.fillStyle = '#c8e8ff'; for (let k = 0; k < 14; k++) g.fillRect((k * 37) % W, (k * 23) % H, 3, 3); g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.beginPath(); g.moveTo(W * 0.2, H * 0.85); g.quadraticCurveTo(W * 0.5, H * 0.4, W * 0.85, H * 0.12); g.stroke(); g.fillStyle = '#5ab0e8'; g.fillRect(W * 0.16, H * 0.82, 6, 6); return; }
    g.fillStyle = '#e8e0cc'; g.font = 'bold 20px monospace'; g.textAlign = 'center'; g.fillText('…', W / 2, H * 0.6); } catch (e) { } }
function comicRead(k) { const C = COMICS.find(c => c.k === k); if (!C) return; let pg = 0; const per = 3, pages = Math.ceil(C.p.length / per);
  const draw = () => { const panels = C.p.slice(pg * per, pg * per + per); openModal(`<h2>📖 ${esc(C.n)}</h2><div class="comic">${panels.map(([w, t], i) => `<div class="cpanel ${w === 'narr' ? 'narr' : ''}" style="border-color:${C.col}">${w === 'narr' ? '' : `<canvas width="68" height="60" data-cf="${i}"></canvas>`}<div class="cbub"><b>${w === 'narr' ? '' : esc((NPCS['idol_' + w] || {}).n || { heroe: L2('Héroe', 'Hero'), akane: 'Akane', neko: L2('Gato', 'Cat'), slime: 'Slime', ventisca: L2('La Ventisca', 'The Ventisca') }[w] || '')}</b> ${esc(t)}</div></div>`).join('')}</div>
      <div class="row" style="display:flex;gap:.5em;justify-content:center;margin-top:.5em"><button class="btn" id="cPrev" ${pg ? '' : 'disabled'}>◀</button><span style="align-self:center">${pg + 1}/${pages}</span><button class="btn" id="cNext">${pg + 1 < pages ? '▶' : L2('Cerrar', 'Close')}</button></div>`);
    panels.forEach(([w], i) => { const cv = document.querySelector(`[data-cf="${i}"]`); if (cv) comicFace(cv, w); });
    $('#cPrev').onclick = () => { if (pg) { pg--; draw(); } }; $('#cNext').onclick = () => { if (pg + 1 < pages) { pg++; draw(); sfx('ui'); } else closeModal(); }; };
  draw(); }
{ const st = document.createElement('style'); st.textContent = `.comic{display:flex;flex-direction:column;gap:.4em}.cpanel{display:flex;gap:.5em;align-items:center;border:3px solid #ffd040;border-radius:.4em;background:#fff8e8;color:#1a1a24;padding:.35em .5em}.cpanel canvas{width:68px;height:60px;image-rendering:pixelated;background:#ffe8f0;border-radius:.3em;flex:none}.cpanel.narr{background:#1a1a24;color:#ffe8a0;font-style:italic}.cbub{line-height:1.35}`; document.head.appendChild(st); }
// el dependiente: vende mangas y cuenta historias y curiosidades del mundo
const COMIC_TALK = [L2('¿Sabías que el mundo está pintado en casillas de 16 en 16? Los Tejedores firmaban así. Mira el suelo con atención.', 'Did you know the world is painted in 16 by 16 tiles? The Weavers signed it that way. Look closely at the ground.'),
  L2('Dicen que el Fuji de aquí es más bajito que el de verdad para que quepa entero en tu… en tu vista. Sí, eso, en tu vista.', 'They say this Fuji is shorter than the real one so it fits whole on your… in your view. Yes, your view.'),
  L2('En Albor vive la Anciana Mira. Cuenta un capítulo de las Crónicas al día. Yo me los sé todos, pero no te haré spoilers.', 'Old Mira lives in Albor. She tells one chapter of the Chronicles a day. I know them all, but no spoilers.'),
  L2('El rey de Vael sigue en su trono, muerto y despierto. Mejor que el peor villano de cualquier manga.', 'The king of Vael is still on his throne, dead and awake. Better than any manga villain.'),
  L2('Los héroes se levantan al caer porque su hilo llega «al otro lado del cristal». Yo me caigo y me quedo en el suelo. Injusto.', 'Heroes get up when they fall because their thread reaches «the other side of the glass». I fall and stay down. Unfair.'),
  L2('Lienya, la Diosa sin Pintar, fue la primera obra de la Ventisca. Si alguna vez la ves, pídele un autógrafo. Si sobrevives.', 'Lienya, the Unpainted Goddess, was the Ventisca\'s first work. If you ever see her, ask for an autograph. If you survive.'),
  L2('El gato naranja del café de gatos se cree idol. No le digas que no lo es.', 'The orange cat at the cat café thinks it\'s an idol. Don\'t tell it otherwise.'),
  L2('Truco: en el gran cruce de Shibuya, espera a que todos los semáforos estén en rojo. Entonces cruza todo el mundo a la vez, hasta en diagonal.', 'Tip: at the great Shibuya crossing, wait for every light to turn red. Then everyone crosses at once, even diagonally.'),
  L2('Si sacas un «Gran fortuna» en la omikuji de Fushimi Inari, sales con más fuerza. Si sacas «Mala suerte», átala al árbol y listo.', 'If you draw a «Great blessing» at Fushimi Inari\'s omikuji, you come out stronger. If you get «Bad luck», tie it to the tree and done.'),
  L2('PRISM9 ensaya a las seis de la mañana desde que llegó Ruri. Mika todavía no la ha perdonado.', 'PRISM9 has rehearsed at six in the morning since Ruri joined. Mika still hasn\'t forgiven her.'),
  L2('Hay una luna que sonríe al otro lado de un velo roto. No es un manga. Ojalá lo fuera.', 'There\'s a moon that smiles on the other side of a broken veil. It\'s not a manga. I wish it were.'),
  L2('El acuario de Okinawa tiene un tiburón ballena enorme. Come plancton. Yo como fideos instantáneos. Somos parecidos.', 'The Okinawa aquarium has a huge whale shark. It eats plankton. I eat instant noodles. We\'re alike.')];
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!P || npc.id !== 'jp_comic_st') return;
  opts.unshift({ label: '💬 ' + L2('Cuéntame algo', 'Tell me something'), icon: ['book'], fn: () => typeText(COMIC_TALK[(Math.random() * COMIC_TALK.length) | 0]) });
  for (const C of COMICS.slice().reverse()) opts.unshift({ label: '📖 ' + C.n + ' · 2.500' + L2(' oro', ' gold'), icon: ['book', C.col], fn: () => { if (countItem('jp_manga_' + C.k)) { closeDialog(); comicRead(C.k); return; } if (P.gold < 2500) { typeText(L2('No te llega el oro.', 'Not enough gold.')); return; } P.gold -= 2500; giveItem('jp_manga_' + C.k, 1); sfx('coin'); markDirty(); closeDialog(); comicRead(C.k); } }); });
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (!M || !M.jp) return out; for (const o of M.objs) if (o.xact === 'jp_in' && o.ik === 'comics') out.push({ c: 'jpfun', x: o.tx, y: o.ty, t: L2('Tienda de cómics (mangas para leer)', 'Comic shop (manga to read)') }); return out; }; }

// ---------- el mapa de las Tierras sin Pintar en el panel del mapa ----------
if (typeof MAPW_LIST !== 'undefined' && !MAPW_LIST.some(w => w.id === 'sin_pintar')) MAPW_LIST.push({ id: 'sin_pintar', n: L2('Las Tierras sin Pintar (Lienzo Blanco)', 'The Unpainted Lands (White Canvas)'), mk: () => makeSinPintar(), how: L2('Puente al este de Albor, después del Velo Roto (misiones de Mael).', 'Bridge east of Albor, after the Broken Veil (Mael\'s quests).') });

// ---------- lupa ----------
if (typeof GSIS !== 'undefined') GSIS.push(['jp_comics', '📖 ' + L2('Japón: tienda de cómics, Ruri y pelo nuevo', 'Japan: comic shop, Ruri and new hair'), () => [
  L2('Tienda de cómics (Akihabara, al oeste): 8 mangas que se leen desde la mochila sin gastarse, con viñetas de las idols, el héroe, los gatos y la Ventisca (2.500 oro cada uno). El dependiente te cuenta historias y curiosidades del mundo con «Cuéntame algo».', 'Comic shop (Akihabara, west side): 8 manga you read from your bag without using them up, with panels of the idols, the hero, the cats and the Ventisca (2,500 gold each). The shopkeeper tells stories and trivia about the world with «Tell me something».'),
  L2('Ruri, novena integrante de PRISM9: pasea por el Cruce de Shibuya, se puede enamorar (beso y abrazo con su propio sprite) y baila con el grupo en la sala de Akihabara. La estilista Mio vende su Corsé Azul.', 'Ruri, ninth member of PRISM9: she hangs around Shibuya Crossing, can be romanced (kiss and hug with her own sprite) and dances with the group at the Akihabara hall. Stylist Mio sells her Blue Corset.'),
  L2('Pelo nuevo: «Melena de Ruri» (chicas) y el color «Turquesa vivo» (chicas y chicos), en el editor y la peluquería.', 'New hair: «Ruri\'s mane» (girls) and the «Bright turquoise» colour (girls and boys), in the editor and the barber.'),
  L2('El mapa de las Tierras sin Pintar ya sale en el panel del mapa (flechas ▶).', 'The Unpainted Lands map now shows in the map panel (▶ arrows).')],
  () => ({ loc: [127, 52], t: L2('Tienda de cómics', 'Comic shop'), m: 'japon' })]);
