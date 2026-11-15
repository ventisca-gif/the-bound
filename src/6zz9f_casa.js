// ================= v4.65: CASA ÚTIL, TROFEOS Y MUSEO DE AVENTURAS =================
// - Trofeos de jefe (uno por jefe, 64): el primero que vences siempre lo suelta; luego 10 %. Se exponen en el museo.
// - Muebles nuevos con función (se fabrican en la Mesa de trabajo y se colocan en tu casa):
//   Vitrina de trofeos y Pedestal (museo), Taller del artesano (fabrica esencias, abono y muebles), Biblioteca
//   (Crónicas del mundo y un libro al día que da experiencia), Trampilla del sótano (sótano secreto con 40 huecos),
//   Cama de invitados (un amigo pasa la noche: +amistad), Macetero mágico (jardinería mágica), Mesa de alquimia,
//   y decoración: Farol de flores lunares, Estatua del héroe, Banderín del festival, Alfombra morada, Cuadro de Nihil.
// - Museo: trofeos con el dibujo del jefe, primeras armas, hallazgos arqueológicos y recuerdos de festivales.
//   Cada día pasan visitantes (aldeanos) que comentan tu colección.
SAVEKEYS.push('mus', 'cellar', 'libDay');

// ---------- iconos nuevos ----------
{ const _gi = genIcon; genIcon = function (spec) { const [kind, a] = spec; if (!['trophy', 'medal', 'flowerm', 'seedm', 'find'].includes(kind)) return _gi(spec);
    const p = new Pix(16, 16), col = C(typeof a === 'string' ? a : '#ffd040'), sh = f => uMul(col, f), lt = uMix(col, C('#ffffff'), 0.5);
    if (kind === 'trophy') { p.rect(4, 2, 8, 6, GOLD[3]); p.hl(4, 2, 8, GOLD[5]); p.rect(5, 3, 6, 4, GOLD[4]); p.set(3, 3, GOLD[2]); p.set(2, 4, GOLD[2]); p.set(3, 6, GOLD[2]); p.set(12, 3, GOLD[2]); p.set(13, 4, GOLD[2]); p.set(12, 6, GOLD[2]);
      p.rect(7, 8, 2, 3, GOLD[2]); p.rect(4, 11, 8, 2, sh(0.6)); p.rect(3, 13, 10, 2, sh(0.45)); p.ball(8, 4.5, 2, 1.8, [sh(0.6), col, lt]); }
    else if (kind === 'medal') { p.poly([[5, 1], [8, 6], [11, 1]], C('#c03a3a')); p.line(5, 1, 8, 6, C('#e86a6a')); p.ball(8, 10, 4.2, 4.2, [sh(0.5), sh(0.8), col, lt]); p.set(7, 9, C('#ffffff')); }
    else if (kind === 'flowerm') { p.vl(8, 8, 7, C('#3a8a3a')); p.set(7, 11, C('#5ab04a')); p.set(9, 12, C('#5ab04a')); for (let k = 0; k < 5; k++) { const an = k * 1.256 - 1.57; p.ball(8 + Math.cos(an) * 3, 6 + Math.sin(an) * 3, 2, 2, [sh(0.7), col, lt]); } p.ball(8, 6, 1.5, 1.5, [C('#fff6a0'), C('#ffffff')]); }
    else if (kind === 'seedm') { p.ball(8, 9, 4, 5, [sh(0.4), sh(0.7), col, lt]); p.line(8, 4, 10, 1, C('#5ab04a')); p.set(6, 7, C('#ffffff')); p.set(11, 12, lt); }
    else if (kind === 'find') { p.poly([[3, 12], [6, 4], [12, 3], [13, 11], [8, 14]], sh(0.55)); p.poly([[6, 4], [12, 3], [10, 8]], col); p.line(5, 8, 11, 6, lt); p.set(9, 10, C('#ffffff')); }
    p.outline(OUTL); return p; }; }

// ---------- trofeos ----------
const TROPHY_PAL = ['#ff5a5a', '#ffb030', '#ffe060', '#7aff7a', '#5ad0ff', '#7a8aff', '#c070ff', '#ff70c0', '#e0e0f0', '#40ffd0'];
function trophyCol(id) { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return TROPHY_PAL[h % TROPHY_PAL.length]; }
for (const id in BOSSES) it('trofeo_' + id, { n: L2('Trofeo: ', 'Trophy: ') + BOSSES[id].n, t: 'mat', stack: true, tier: 1, price: 50, troph: id, icon: ['trophy', trophyCol(id)], rar: 3, d: L2('Expónlo en el museo de tu casa (Vitrina o Pedestal).', 'Display it in your house museum (Display case or Pedestal).') });
{ const _km = killMob; killMob = function (m) { const first = m && m.boss && G.P && !(G.P.bossKills || {})[m.mid]; const r = _km.apply(this, arguments);
    try { if (m && m.boss && !m.duel && ITEMS['trofeo_' + m.mid]) { const P = G.P, M = P.mus = P.mus || {}; const has = (M.tr || {})[m.mid] || countItem('trofeo_' + m.mid);
      if (first || !has || Math.random() < 0.1) { giveItem('trofeo_' + m.mid, 1); toast('🏆 ' + ITEMS['trofeo_' + m.mid].n, 'quest', 3); } } } catch (e) { }
    return r; }; }

// ---------- hallazgos arqueológicos (excavación) ----------
const FINDS = [['hallazgo_vasija', 'Vasija de Nerea', 'Nerean Urn', '#5aa0d0', L2('Pintada con barcos que navegan entre nubes.', 'Painted with ships sailing among clouds.')],
  ['hallazgo_pluma', 'Pluma de Alado', 'Winged Feather', '#e0e8ff', L2('Blanca, ligera y todavía tibia.', 'White, light and still warm.')],
  ['hallazgo_moneda', 'Moneda de Vael', 'Coin of Vael', '#ffd040', L2('Lleva la cara de un rey que no envejece.', 'It bears the face of a king who never ages.')],
  ['hallazgo_tablilla', 'Tablilla de los Vientos', 'Wind Tablet', '#c0a070', L2('Escrita en la lengua que enseñaron los Alados.', 'Written in the tongue the Winged taught.')],
  ['hallazgo_ambar', 'Gota de ámbar', 'Amber Drop', '#ff9a20', L2('Dentro se mueve algo muy pequeño.', 'Something tiny moves inside.')],
  ['hallazgo_hilo', 'Hilo del Telar', 'Loom Thread', '#ffe0a0', L2('Un hilo de luz que no se apaga.', 'A thread of light that never goes out.')],
  ['hallazgo_mascara', 'Máscara del Eclipse', 'Eclipse Mask', '#3a2a4a', L2('Por detrás no hay nada pintado.', 'There is nothing painted behind it.')],
  ['hallazgo_fragmento', 'Esquirla del Sello', 'Seal Shard', '#ffe066', L2('Una astilla de los siete fragmentos, ya sin poder.', 'A splinter of the seven shards, now powerless.')]];
for (const [id, n, en, col, d] of FINDS) it(id, { n: L2(n, en), t: 'mat', stack: true, tier: 3, price: 400, find: 1, icon: ['find', col], rar: 3, d });
{ const _gj = gainJobXp; gainJobXp = function (job, n) { const r = _gj.apply(this, arguments); try { if (job === 'excavacion' && Math.random() < 0.05) { const f = pick(FINDS); giveItem(f[0], 1); toast('🏺 ' + L2('Hallazgo arqueológico: ', 'Archaeological find: ') + ITEMS[f[0]].n, 'quest', 3); } } catch (e) { } return r; }; }

// ---------- primeras armas: se recuerda la primera de cada tipo ----------
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P && P === G.P && P.equip && P.equip.weapon) { const M = P.mus = P.mus || {}; M.fw = M.fw || {}; const I = ITEMS[P.equip.weapon.id]; const k = I && (I.cls || P.cls); if (k && !M.fw[k]) M.fw[k] = P.equip.weapon.id; } } catch (e) { } return r; }; }

// ---------- muebles nuevos ----------
const NEWF = {
  vitrina: { n: L2('Vitrina de trofeos', 'Trophy case'), fp: [[0, 0], [1, 0]], cost: [['log', 6], ['piedra', 4]], gold: 3000, cat: 'mueble' },
  pedestal: { n: L2('Pedestal del museo', 'Museum pedestal'), cost: [['piedra', 4]], gold: 1500, cat: 'mueble' },
  taller: { n: L2('Taller del artesano', 'Artisan workshop'), fp: [[0, 0], [1, 0]], cost: [['log', 8], ['ore1', 2]], gold: 2500, cat: 'mueble' },
  biblioteca: { n: L2('Biblioteca', 'Library'), fp: [[0, 0], [1, 0]], cost: [['log', 10]], gold: 4000, cat: 'mueble' },
  trampilla: { n: L2('Trampilla del sótano', 'Cellar trapdoor'), solid: false, cost: [['log', 6], ['piedra', 6]], gold: 6000, cat: 'mueble' },
  cama_inv: { n: L2('Cama de invitados', 'Guest bed'), fp: [[0, 0], [0, 1]], cost: [['log', 5]], gold: 1800, cat: 'mueble' },
  macetero: { n: L2('Macetero mágico', 'Magic planter'), cost: [['log', 2], ['piedra', 2]], gold: 1200, cat: 'granja' },
  alquimia: { n: L2('Mesa de alquimia', 'Alchemy table'), fp: [[0, 0], [1, 0]], cost: [['log', 4], ['piedra', 4]], gold: 3500, cat: 'mueble' },
  farol_flor: { n: L2('Farol de flores lunares', 'Moonflower lantern'), cost: [], gold: 800, cat: 'deco' },
  estatua_heroe: { n: L2('Estatua del héroe', 'Hero statue'), cost: [['piedra', 10]], gold: 5000, cat: 'deco' },
  banderin: { n: L2('Banderín del festival', 'Festival bunting'), solid: false, cost: [], gold: 300, cat: 'deco' },
  alfombra_m: { n: L2('Alfombra morada', 'Purple rug'), solid: false, cost: [], gold: 400, cat: 'deco' },
  cuadro_nihil: { n: L2('Cuadro del Ente Oscuro', 'Painting of the Dark Entity'), solid: false, cost: [], gold: 2500, cat: 'deco' },
};
for (const k in NEWF) { const b = Object.assign({ f: 'nf_' + k, tool: 'tala', tier: 1, L: 1 }, NEWF[k]); BK[k] = b; BK_KEYS.push(k); it('bk_' + k, { n: b.n, t: 'mat', bk: k, stack: true, tier: 1, price: 5, icon: ['bk', k] }); }
{ const _gf2 = genFurn2; genFurn2 = function (kind) { if (!/^nf_/.test(kind)) return _gf2(kind); const k = kind.slice(3), W_ = WOOD; let p, ax, ay, light;
    const glass = C('#9ad0f0'), gl2 = C('#d8f0ff'), st = [C('#4a4a56'), C('#6a6a76'), C('#8e8e9a'), C('#b0b0ba')];
    switch (k) {
      case 'vitrina': { p = new Pix(32, 34); p.rect(1, 6, 30, 26, W_[2]); p.rect(1, 4, 30, 3, W_[4]); p.hl(1, 4, 30, W_[5]); p.rect(3, 8, 26, 20, glass); p.hl(3, 17, 26, W_[3]);
        [[6, 13, '#ffd040'], [14, 13, '#ff5a5a'], [22, 13, '#7ad0ff'], [8, 25, '#c070ff'], [18, 25, '#7aff7a']].forEach(([x, y, c]) => { p.rect(x, y - 4, 4, 3, GOLD[3]); p.rect(x + 1, y - 1, 2, 2, GOLD[2]); p.set(x + 1, y - 4, C(c)); });
        for (let i = 0; i < 6; i++) p.set(5 + i, 9 + i, gl2); p.rect(1, 29, 30, 3, W_[1]); ax = 8; ay = 30; break; }
      case 'pedestal': { p = new Pix(16, 28); p.rect(3, 8, 10, 18, st[2]); p.vl(3, 8, 18, st[3]); p.vl(12, 8, 18, st[1]); p.rect(1, 6, 14, 3, st[3]); p.rect(1, 25, 14, 3, st[1]);
        p.rect(5, 1, 6, 5, GOLD[3]); p.hl(5, 1, 6, GOLD[5]); p.set(4, 2, GOLD[2]); p.set(11, 2, GOLD[2]); p.ball(8, 3, 1.5, 1.2, [C('#a03030'), C('#ff5a5a')]); ax = 8; ay = 26; break; }
      case 'taller': { p = new Pix(34, 26); p.rect(1, 8, 32, 5, W_[4]); p.hl(1, 8, 32, W_[5]); woodPost(p, 3, 13, 24, 3); woodPost(p, 29, 13, 24, 3); p.rect(4, 18, 26, 2, W_[2]);
        p.rect(5, 3, 7, 5, IRON[3]); p.hl(5, 3, 7, IRON[5]); p.rect(15, 4, 2, 4, W_[3]); p.rect(13, 3, 6, 2, IRON[4]); p.rect(22, 2, 8, 6, C('#7a4a2a')); p.rect(23, 3, 6, 4, C('#c08a4a')); p.set(25, 4, C('#ffe060'));
        p.rect(6, 19, 4, 4, W_[3]); p.rect(18, 19, 6, 4, C('#5a5a6a')); ax = 8; ay = 24; break; }
      case 'biblioteca': { p = new Pix(34, 40); p.rect(1, 2, 32, 37, W_[2]); p.rect(1, 0, 32, 3, W_[4]); p.hl(1, 0, 32, W_[5]);
        const bc = ['#8a2a2a', '#2a5a8a', '#3a7a3a', '#8a6a2a', '#5a2a7a', '#2a7a7a', '#a04a2a'];
        for (let r = 0; r < 4; r++) { p.rect(3, 4 + r * 9, 28, 7, W_[0]); let x = 4; let i = r * 3; while (x < 30) { const w = 2 + ((i * 7) % 2); p.rect(x, 5 + r * 9 + (i % 3 === 0 ? 1 : 0), w, 6 - (i % 3 === 0 ? 1 : 0), C(bc[i % bc.length])); p.vl(x, 5 + r * 9, 6, uMul(C(bc[i % bc.length]), 1.3)); x += w + 1; i++; } p.hl(3, 11 + r * 9, 28, W_[4]); }
        ax = 8; ay = 38; break; }
      case 'trampilla': { p = new Pix(16, 16); p.rect(1, 1, 14, 14, W_[1]); for (let i = 0; i < 4; i++) p.rect(2, 2 + i * 3, 12, 2, W_[3]); p.rect(2, 2, 12, 1, W_[4]); p.rect(6, 7, 4, 2, IRON[4]); p.set(7, 8, IRON[2]); p.vl(1, 1, 14, IRON[2]); p.vl(14, 1, 14, IRON[2]); ax = 8; ay = 14; break; }
      case 'cama_inv': { p = new Pix(18, 34); p.rect(1, 2, 16, 30, W_[2]); p.rect(1, 0, 16, 4, W_[4]); p.rect(3, 5, 12, 25, C('#f4ece0')); p.rect(4, 6, 10, 5, C('#ffffff')); p.rect(3, 13, 12, 17, C('#2a7a6a')); p.hl(3, 13, 12, C('#5ab0a0')); for (let y = 16; y < 30; y += 4) p.hl(4, y, 10, C('#3a8a7a')); ax = 9; ay = 32; break; }
      case 'macetero': { p = new Pix(16, 22); p.rect(2, 12, 12, 8, C('#8a4a2a')); p.hl(2, 12, 12, C('#b06a3a')); p.rect(1, 11, 14, 2, C('#a05a32')); p.rect(3, 13, 10, 2, C('#3a2414'));
        const g = Math.floor(G.t * 2) % 2; p.vl(8, 4, 8, C('#3a8a3a')); p.ball(8, 4, 2.5, 2.5, [C('#5a2a8a'), C('#a060ff'), C('#e0c0ff')]); p.set(6, 8, C('#5ab04a')); p.set(10, 7, C('#5ab04a')); if (g) p.set(11, 2, C('#ffffff')); ax = 8; ay = 20; light = '#a060ff'; break; }
      case 'alquimia': { p = new Pix(34, 26); p.rect(1, 9, 32, 4, C('#4a3a5a')); p.hl(1, 9, 32, C('#6a5a7a')); woodPost(p, 3, 13, 24, 3); woodPost(p, 29, 13, 24, 3);
        p.ball(8, 5, 3, 3.5, [C('#2a6a2a'), C('#5ad05a'), C('#c0ffc0')]); p.rect(7, 0, 2, 2, C('#c8b090')); p.ball(17, 6, 2.5, 3, [C('#6a2a8a'), C('#c070ff'), C('#f0d0ff')]); p.rect(16, 1, 2, 2, C('#c8b090'));
        p.rect(23, 3, 6, 6, C('#3a3a46')); p.hl(23, 3, 6, C('#6a6a76')); p.set(25, 5, C('#ff8a3a')); p.set(26, 4, C('#ffe060')); ax = 8; ay = 24; light = '#7aff9a'; break; }
      case 'farol_flor': { p = new Pix(12, 30); p.vl(6, 10, 18, IRON[2]); p.rect(3, 27, 6, 2, IRON[2]); p.rect(2, 2, 8, 9, IRON[3]); p.rect(3, 3, 6, 7, C('#c0e8ff')); p.ball(6, 6.5, 2, 2, [C('#7ab0ff'), C('#ffffff')]); p.rect(4, 0, 4, 2, IRON[4]); ax = 6; ay = 28; light = '#9ad0ff'; break; }
      case 'estatua_heroe': { p = new Pix(18, 38); p.rect(2, 30, 14, 7, st[1]); p.hl(2, 30, 14, st[3]); p.ball(9, 6, 4, 4, [st[1], st[2], st[3]]); p.rect(6, 10, 6, 11, st[2]); p.vl(6, 10, 11, st[3]); p.rect(6, 21, 2, 9, st[1]); p.rect(10, 21, 2, 9, st[1]); p.line(12, 12, 16, 2, st[3]); p.line(13, 12, 17, 3, st[2]); p.rect(4, 11, 2, 7, st[2]); ax = 9; ay = 36; break; }
      case 'banderin': { p = new Pix(32, 12); p.line(0, 2, 31, 2, C('#6a4a2a')); const cs = ['#ff5a5a', '#ffd040', '#5ad0ff', '#7aff7a', '#c070ff']; for (let i = 0; i < 6; i++) p.poly([[i * 5 + 1, 3], [i * 5 + 5, 3], [i * 5 + 3, 9]], C(cs[i % 5])); ax = 16; ay = 10; break; }
      case 'alfombra_m': { p = new Pix(32, 20); p.rect(0, 0, 32, 20, C('#4a1a6a')); p.rect(2, 2, 28, 16, C('#6a2a8a')); p.rect(4, 4, 24, 12, C('#4a1a6a')); p.ell(16, 10, 6, 4, C('#c070ff')); p.ell(16, 10, 3, 2, C('#ffd040')); ax = 16; ay = 18; break; }
      case 'cuadro_nihil': { p = new Pix(20, 18); p.rect(0, 0, 20, 18, GOLD[2]); p.rect(1, 1, 18, 16, GOLD[3]); p.rect(2, 2, 16, 14, C('#12061c')); p.ell(10, 9, 5, 6, C('#3a1050')); p.set(8, 8, C('#ff70ff')); p.set(12, 8, C('#ff70ff')); p.hl(8, 11, 5, C('#c060e0')); p.rect(7, 3, 6, 1, C('#c060e0')); ax = 10; ay = 17; break; }
      default: return _gf2('table');
    }
    p.outline(OUTL); return { c: p.canvas(), ax, ay, light }; }; }

// ---------- acciones de los muebles ----------
Object.assign(FURN_ACT, {
  nf_vitrina: [L2('Museo de aventuras', 'Adventure museum'), 'star', () => openMuseum()],
  nf_pedestal: [L2('Museo de aventuras', 'Adventure museum'), 'star', () => openMuseum()],
  nf_taller: [L2('Taller del artesano', 'Artisan workshop'), 'anvil', () => openWorkshop()],
  nf_biblioteca: [L2('Biblioteca', 'Library'), 'book', () => openLibrary()],
  nf_trampilla: [L2('Bajar al sótano', 'Go down to the cellar'), 'bag', () => openCellar()],
  nf_cama_inv: [L2('Invitar a un amigo', 'Invite a friend'), 'heart', () => openGuest()],
  nf_macetero: [L2('Macetero mágico', 'Magic planter'), 'herb', () => openPlanter()],
  nf_alquimia: [L2('Mesa de alquimia', 'Alchemy table'), 'potion', () => openAlchemy()],
});

// ---------- museo ----------
function musData() { const P = G.P, M = P.mus = P.mus || {}; M.tr = M.tr || {}; M.fd = M.fd || {}; M.md = M.md || {}; M.fw = M.fw || {}; return M; }
function musDonate() { const P = G.P, M = musData(); let n = 0;
  for (let i = P.inv.length - 1; i >= 0; i--) { const s = P.inv[i], I = s && ITEMS[s.id]; if (!I) continue;
    if (I.troph && !M.tr[I.troph]) { M.tr[I.troph] = calDay() + 1; takeItem(s.id, 1); n++; }
    else if (I.find && !M.fd[s.id]) { M.fd[s.id] = calDay() + 1; takeItem(s.id, 1); n++; }
    else if (I.medal && !M.md[s.id]) { M.md[s.id] = calDay() + 1; takeItem(s.id, 1); n++; } }
  if (n) { sfx('questdone'); toast(L2('Piezas expuestas: ', 'Pieces displayed: ') + n, 'quest'); markDirty(true); } else toast(L2('No tienes piezas nuevas para exponer', 'No new pieces to display'), 'info');
  return n; }
function musScore() { const M = musData(); return Object.keys(M.tr).length * 3 + Object.keys(M.fd).length * 2 + Object.keys(M.md).length * 2 + Object.keys(M.fw).length; }
const MUS_TALK = [
  [L2('¿Esto es de verdad el trofeo de %s? Mi abuelo no se lo creería.', 'Is this really the trophy of %s? My grandpa wouldn\'t believe it.'), 'tr'],
  [L2('He venido solo para ver lo de %s. Da miedo hasta en la vitrina.', 'I came just to see the %s one. It\'s scary even behind glass.'), 'tr'],
  [L2('Esa %s… la Doctora Selma pagaría lo que fuera por ella.', 'That %s… Doctor Selma would pay anything for it.'), 'fd'],
  [L2('¿Tu primera arma fue esa? Todos empezamos por algo.', 'Was that your first weapon? We all start somewhere.'), ''],
  [L2('Le he dicho a todo el pueblo que viniera. Espero que no te importe.', 'I told the whole village to come. Hope you don\'t mind.'), ''],
  [L2('Aquí huele a aventura. Y un poco a polvo.', 'It smells like adventure in here. And a bit like dust.'), ''],
  [L2('Esa %s brilla más que mi futuro.', 'That %s shines brighter than my future.'), 'md'],
];
function musVisitors() { const M = musData(), d = calDay(), names = Object.keys(NPCS).filter(k => NPCS[k].tf && NPCS[k].n); if (!names.length || !musScore()) return [];
  const out = []; const n = Math.min(3, 1 + Math.floor(musScore() / 15));
  for (let i = 0; i < n; i++) { const r = hash2(d * 7 + i, 3, 91), who = NPCS[names[Math.floor(r * names.length) % names.length]].n; let [t, k] = MUS_TALK[Math.floor(hash2(d, i * 5, 17) * MUS_TALK.length) % MUS_TALK.length];
    const pool = k ? Object.keys(M[k]) : []; if (k && !pool.length) [t, k] = MUS_TALK[4];
    const it_ = k ? pool[Math.floor(hash2(d, i, 3) * pool.length) % pool.length] : ''; const nm = k === 'tr' ? (BOSSES[it_] || {}).n : it_ ? (ITEMS[it_] || {}).n : '';
    out.push([who, t.replace('%s', nm || '')]); }
  return out; }
function bossPortrait(id, size) { try { const A = mobAtlasFor(BOSSES[id].art); if (!A || !A.img) return ''; const c = mkCanvas(size, size), x = c.getContext('2d'); x.imageSmoothingEnabled = false; const k = Math.min(size / A.fw, size / A.fh);
    x.drawImage(A.img, (A.idx.idle || 0) * A.fw, 0, A.fw, A.fh, Math.round((size - A.fw * k) / 2), Math.round(size - A.fh * k), Math.round(A.fw * k), Math.round(A.fh * k)); return c.toDataURL(); } catch (e) { return ''; } }
const BOSS_PORT = {};
function openMuseum() {
  const P = G.P, M = musData(), tr = Object.keys(BOSSES), have = tr.filter(k => M.tr[k]);
  const cell = (on, img, name, sub) => `<div class="musC ${on ? '' : 'off'}">${img}<b>${esc(name)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const trH = tr.map(k => { const on = !!M.tr[k]; if (on && BOSS_PORT[k] === undefined) BOSS_PORT[k] = bossPortrait(k, 40); const src = on ? BOSS_PORT[k] : ''; return cell(on, src ? `<img src="${src}" alt="">` : iconHTML(['trophy', trophyCol(k)], 32), on ? BOSSES[k].n : '???', on && SUPER_BOSS[k] !== undefined ? '⚠ ' + L2('Súper jefe', 'Super boss') : ''); }).join('');
  const fdH = FINDS.map(([id]) => cell(!!M.fd[id], iconHTML(ITEMS[id].icon, 32), M.fd[id] ? ITEMS[id].n : '???', M.fd[id] ? ITEMS[id].d : '')).join('');
  const mdH = FEST_MEDALS.map(id => cell(!!M.md[id], iconHTML(ITEMS[id].icon, 32), M.md[id] ? ITEMS[id].n : '???', '')).join('');
  const fwH = Object.keys(M.fw).map(c => { const I = ITEMS[M.fw[c]]; return I ? cell(true, iconHTML(I.icon, 32), I.n, (CLASSES[c] || {}).n || '') : ''; }).join('') || `<p class="hint">${L2('Equipa armas y aquí se guardará la primera de cada clase.', 'Equip weapons and the first one of each class will be kept here.')}</p>`;
  const vis = musVisitors();
  openModal(`<h2>🏛 ${L2('Museo de aventuras', 'Adventure museum')}</h2><p class="hint">${L2('Puntuación del museo', 'Museum score')}: <b>${musScore()}</b> · ${L2('Trofeos', 'Trophies')} ${have.length}/${tr.length} · ${L2('Hallazgos', 'Finds')} ${Object.keys(M.fd).length}/${FINDS.length} · ${L2('Medallas', 'Medals')} ${Object.keys(M.md).length}/${FEST_MEDALS.length}</p>
    <div class="row"><button class="btn gold sm" id="musD">🏆 ${L2('Exponer lo que llevo', 'Display what I carry')}</button></div>
    ${vis.length ? `<div class="musV">${vis.map(([w, t]) => `<p><b>${esc(w)}:</b> «${esc(t)}»</p>`).join('')}</div>` : ''}
    <div class="musS"><h3>${L2('Trofeos de jefes', 'Boss trophies')}</h3><div class="musG">${trH}</div><h3>${L2('Hallazgos arqueológicos', 'Archaeological finds')}</h3><div class="musG">${fdH}</div>
    <h3>${L2('Recuerdos de festivales', 'Festival memories')}</h3><div class="musG">${mdH}</div><h3>${L2('Primeras armas', 'First weapons')}</h3><div class="musG">${fwH}</div></div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $('#musD').onclick = () => { musDonate(); openMuseum(); };
}

// ---------- sótano secreto (40 huecos aparte del baúl) ----------
function openCellar() {
  const P = G.P; P.cellar = P.cellar || []; const C_ = P.cellar;
  const row = (s, i, from) => { const I = ITEMS[s.id]; return I ? `<button class="slot" data-${from}="${i}" title="${esc(I.n)}">${iconHTML(I.icon, 28)}${(s.q || 1) > 1 ? `<small>${s.q}</small>` : ''}</button>` : ''; };
  openModal(`<h2>🕯 ${L2('Sótano secreto', 'Secret cellar')}</h2><p class="hint">${L2('Toca algo de tu bolsa para guardarlo aquí y algo del sótano para sacarlo.', 'Tap something in your bag to store it and something in the cellar to take it out.')} (${C_.length}/40)</p>
    <h3>${L2('Sótano', 'Cellar')}</h3><div class="slots">${C_.map((s, i) => row(s, i, 'cl')).join('') || `<p class="hint">${L2('Vacío', 'Empty')}</p>`}</div><h3>${L2('Bolsa', 'Bag')}</h3><div class="slots">${P.inv.map((s, i) => s && !ITEMS[s.id].quest ? row(s, i, 'iv') : '').join('')}</div>
    <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-iv]').forEach(b => b.onclick = () => { const i = +b.dataset.iv, s = P.inv[i]; if (!s) return; if (C_.length >= 40 && !(ITEMS[s.id].stack && C_.find(c => c.id === s.id))) { toast(L2('El sótano está lleno', 'The cellar is full'), 'warn'); return; } P.inv.splice(i, 1); const o = ITEMS[s.id].stack && C_.find(c => c.id === s.id); if (o) o.q = (o.q || 1) + (s.q || 1); else C_.push(s); uiDirty.inv = true; markDirty(); openCellar(); });
  $$('#modal [data-cl]').forEach(b => b.onclick = () => { const i = +b.dataset.cl, s = C_[i]; if (!s) return; C_.splice(i, 1); if (ITEMS[s.id].stack) giveItem(s.id, s.q || 1, true); else P.inv.push(s); uiDirty.inv = true; markDirty(); openCellar(); });
}

// ---------- biblioteca: un libro al día ----------
const LIB_BOOKS = [
  [L2('Tratado de los hilos', 'Treatise on threads'), L2('Todo lo que vive está atado. Lo que se corta, cae al Velo; lo que se anuda, vuelve.', 'Everything alive is tied. What is cut falls into the Veil; what is knotted comes back.')],
  [L2('Diario de un Vigía', 'Diary of a Warden'), L2('Mil años esperando una marca de luz. Mi padre la esperó, yo la espero. Quizá mis hijos la vean.', 'A thousand years waiting for a mark of light. My father waited, I wait. Perhaps my children will see it.')],
  [L2('Recetario de Albor', 'Albor cookbook'), L2('Para un buen estofado: paciencia, fuego lento y no dejar que el héroe meta la mano antes de tiempo.', 'For a good stew: patience, low heat, and don\'t let the hero dip in early.')],
  [L2('Bestiario de Selma', 'Selma\'s bestiary'), L2('Los slimes no son malos: solo encuentran cosas brillantes en mal momento.', 'Slimes aren\'t evil: they just find shiny things at the wrong time.')],
  [L2('Cantares de Nerea', 'Songs of Nerea'), L2('Bajo las olas un rey canta todavía. Si pescas en el abismo, no le grites.', 'Beneath the waves a king still sings. If you fish in the abyss, don\'t shout at him.')],
  [L2('Manual del jardinero mágico', 'Magic gardener\'s manual'), L2('La flor lunar solo crece de noche; la raíz de tormenta, con lluvia. Escucha al cielo antes de plantar.', 'The moonflower only grows at night; the storm root, with rain. Listen to the sky before planting.')],
];
function openLibrary() {
  const P = G.P, d = calDay(), read = P.libDay === d, b = LIB_BOOKS[d % LIB_BOOKS.length];
  openModal(`<h2>📚 ${L2('Biblioteca', 'Library')}</h2><div class="row"><button class="btn gold sm" id="libC">📜 ${L2('Crónicas del mundo', 'World chronicles')}</button></div>
    <h3>${L2('Libro de hoy', 'Today\'s book')}: ${esc(b[0])}</h3><p class="lorep">${esc(b[1])}</p>
    <div class="row">${read ? `<p class="hint">${L2('Ya has leído hoy. Vuelve mañana.', 'You already read today. Come back tomorrow.')}</p>` : `<button class="btn" id="libR">${L2('Leer (experiencia)', 'Read (experience)')}</button>`}<button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $('#libC').onclick = () => { closeModal(); openBook('mundo'); };
  const r = $('#libR'); if (r) r.onclick = () => { P.libDay = d; gainXp(Math.round(xpToNext(P.lv) * 0.05)); wmGain(20); sfx('questdone'); toast(L2('Has aprendido algo nuevo', 'You learned something new'), 'quest'); markDirty(); openLibrary(); };
}

if (!document.getElementById('musCss')) { const st = document.createElement('style'); st.id = 'musCss';
  st.textContent = '.musS{max-height:52vh;overflow-y:auto}.musG{display:grid;grid-template-columns:repeat(auto-fill,minmax(6.2em,1fr));gap:.35em;margin-bottom:.6em}.musC{display:flex;flex-direction:column;align-items:center;text-align:center;padding:.3em;border-radius:6px;background:rgba(232,192,112,.12);border:1px solid rgba(232,192,112,.4);font-size:.78em}'
    + '.musC.off{opacity:.45;background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.1)}.musC img{width:40px;height:40px;image-rendering:pixelated}.musC small{opacity:.75;font-size:.85em}.musV{background:rgba(0,0,0,.25);border-radius:6px;padding:.3em .6em;margin:.3em 0;font-size:.88em}.musV p{margin:.2em 0}';
  document.head.appendChild(st); }
