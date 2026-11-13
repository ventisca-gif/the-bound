// ================= BATTLE PASS (60 levels), PETS, DANCES, BEACH & CLASS COSMETICS, SOUL GRIMOIRE =================
// ---------- new cosmetics ----------
const TROP = P5(['#0a4a3a', '#1a7a5a', '#2ab07a', '#6ae0a0', '#c8ffd8']), SUNSET = P5(['#6a1a0a', '#b83a10', '#ff6a2a', '#ffa040', '#ffe080']), SKYB = P5(['#1a4a7a', '#2a7ab8', '#4aa8e8', '#8ad0ff', '#e0f4ff']);
const PASSC = { src: 'Pase de batalla' };
cosm('c_gafas', 'Gafas de Sol', 'head', () => ({ k: 'shades', m: pal(['#2a2a3a', '#4a4a5a', '#6a6a7a', '#a8e0ff', '#ffffff']) }), PASSC);
cosm('c_pamela', 'Sombrero de Playa', 'head', () => ({ k: 'sunhat', m: pal(['#6a5020', '#a8884a', '#d8b870', '#f0dca0', '#fff4d0']), s: CLOTH.rojo, cover: 'hat' }), PASSC);
cosm('c_banador', 'Traje de Baño', 'body', () => ({ k: 'swim', m: CLOTH.turquesa, s: P5(['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']) }), PASSC);
cosm('c_hawaiana', 'Camisa Hawaiana', 'body', () => ({ k: 'hawaii', m: P5(['#0a3a5a', '#165a8a', '#2a7ab8', '#4a9ad8', '#8ac8ff']), s: P5(['#ff5a7a', '#ff5a7a', '#ffd040', '#ffd040', '#ffffff']) }), PASSC);
cosm('c_hawaiana_roja', 'Camisa Hawaiana Roja', 'body', () => ({ k: 'hawaii', m: CLOTH.rojo, s: P5(['#ffffff', '#ffffff', '#ffd040', '#ffd040', '#7ae07a']) }), PASSC);
cosm('c_banador_rojo', 'Bañador Rojo', 'body', () => ({ k: 'swim', m: CLOTH.rojo, s: P5(['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffd040']) }), PASSC);
cosm('c_pareo', 'Pareo Tropical', 'legs', () => ({ k: 'skirt', m: SUNSET }), PASSC);
cosm('c_bermuda', 'Bermudas de Playa', 'legs', () => ({ k: 'shorts', m: TROP }), PASSC);
cosm('c_chanclas', 'Chanclas', 'feet', () => ({ k: 'sandals', m: SKYB }), PASSC);
cosm('c_gala_guerrero', 'Armadura de Gala', 'body', () => ({ k: 'plate', m: P5(['#8a8a98', '#c8c8d8', '#ececf4', '#ffffff', '#ffffff']), s: GOLD.slice(1), t: 12 }), PASSC);
cosm('c_astral_mago', 'Túnica Astral', 'body', () => ({ k: 'robe', m: P5(['#0a0a2a', '#14144a', '#22226a', '#3a3a9a', '#6a6ad0']), s: TIERP[13], t: 12 }), PASSC);
cosm('c_bosque_arquero', 'Cuero del Guardabosques', 'body', () => ({ k: 'leather', m: CLOTH.verde, s: GOLD.slice(1), t: 9 }), PASSC);
cosm('c_carmesi_asesino', 'Sombra Carmesí', 'body', () => ({ k: 'shadow', m: P5(['#1a0206', '#3a060e', '#5a0a18', '#8a1424', '#c02a3a']), s: P5(['#2a2a32', '#4a4a56', '#8a8a96', '#c8c8d4', '#ffffff']), t: 12 }), PASSC);
cosm('c_estrella_bardo', 'Chaqueta de Estrella', 'body', () => ({ k: 'coat', m: CLOTH.morado, s: GOLD.slice(1) }), PASSC);
cosm('c_animas_invocador', 'Manto de Ánimas', 'body', () => ({ k: 'robe', m: P5(['#04040e', '#0a0a1e', '#141432', '#1e1e48', '#2a2a60']), s: P5(['#0a1a3a', '#163a7a', '#2a6ad0', '#5ab0ff', '#c0e8ff']), t: 12 }), PASSC);
cosm('c_vestido_verano', 'Vestido de Verano', 'body', () => ({ k: 'dress', m: P5(['#c86a1a', '#f0a030', '#ffd060', '#fff0a0', '#ffffff']), s: CLOTH.blanco }), PASSC);
cosm('c_vestido_gala', 'Vestido de Gala', 'body', () => ({ k: 'dress', m: CLOTH.granate, s: GOLD.slice(1) }), PASSC);
cosm('c_traje_gala', 'Traje de Gala', 'body', () => ({ k: 'coat', m: CLOTH.negro, s: GOLD.slice(1) }), PASSC);
cosm('c_obsidiana', 'Armadura de Obsidiana', 'body', () => ({ k: 'plate', m: P5(['#060408', '#140c10', '#22141a', '#3a1e24', '#ff5a1a']), s: SUNSET, t: 15 }), PASSC);
cosm('c_aurora', 'Túnica Aurora', 'body', () => ({ k: 'robe', m: P5(['#0a3a3a', '#1a7a6a', '#3ac0a0', '#9af0d0', '#ffffff']), s: CLOTH.rosa, t: 12 }), PASSC);
cosm('c_alas_mariposa', 'Alas de Mariposa', 'back', () => ({ k: 'wings', o: P5(['#6a1a6a', '#b03ab0', '#e070e0', '#ffb0ff', '#ffffff']) }), PASSC);
cosm('c_alas_fenix', 'Alas de Fénix', 'back', () => ({ k: 'wings', o: SUNSET }), PASSC);
cosm('c_alas_celestes', 'Alas Celestes', 'back', () => ({ k: 'wings', o: SKYB }), PASSC);
cosm('c_capa_arcoiris', 'Capa Arcoíris', 'back', () => ({ k: 'cape', o: CLOTH.rojo, i: CLOTH.azul, tr: P5(['#ffd040', '#ffd040', '#6ae07a', '#6ae07a', '#c070ff']) }), PASSC);
cosm('c_capa_galaxia', 'Capa Galaxia', 'back', () => ({ k: 'cape', o: P5(['#04020a', '#0e061e', '#1a0a36', '#2a124e', '#4a2a7a']), i: P5(['#1a0a3a', '#3a1a6a', '#6a2aa8', '#c04ae0', '#ffd0ff']), tr: TIERP[13], emb: TIERP[13] }), PASSC);
cosm('c_orejas_zorro', 'Orejas de Zorro', 'head', () => ({ k: 'catears', m: P5(['#5a2a0a', '#9a4a14', '#d8701e', '#f0a050', '#ffe0c0']), cover: 'hat' }), PASSC);
cosm('c_corona_volcan', 'Corona Volcánica', 'head', () => ({ k: 'crown', cover: 'hat' }), PASSC);
cosm('c_tiara_sol', 'Tiara del Sol', 'head', () => ({ k: 'circlet', s: SUNSET, cover: 'hat' }), PASSC);
cosm('c_panuelo_tropical', 'Pañuelo Tropical', 'head', () => ({ k: 'bandana', m: TROP, cover: 'hat' }), PASSC);
cosm('c_aureola_dorada', 'Aureola Dorada', 'head', () => ({ k: 'halo', cover: 'hat' }), PASSC);
// ---------- dances ----------
const DANCES = {
  clasico: { n: 'Clásico' },
  macarena: { n: 'Macarena', pose: (ps, f) => { const o = [[-3, -3, 3, -3], [-1, -9, 1, -9], [-4, 0, 4, 0], [-4, 0, 4, 0]][f]; ps.lax = o[0]; ps.lay = o[1]; ps.rax = o[2]; ps.ray = o[3]; ps.lean = f === 3 ? 1 : 0; ps.bob = f === 3 ? -1 : 0; } },
  floss: { n: 'Floss', pose: (ps, f) => { const s = f % 2 ? 1 : -1; ps.lax = 4 * s - 1; ps.rax = 4 * s + 1; ps.lay = 2; ps.ray = 2; ps.lean = -s; } },
  robot: { n: 'Robot', pose: (ps, f) => { const o = [[0, 0, 5, -4], [-3, -4, 3, -4], [-5, -4, 0, 0], [0, 1, 0, 1]][f]; ps.lax = o[0]; ps.lay = o[1]; ps.rax = o[2]; ps.ray = o[3]; } },
  moonwalk: { n: 'Moonwalk', walk: 1, pose: (ps, f) => { ps.lean = -1; ps.lay = 1; ps.ray = 1; } },
  dab: { n: 'Dab', pose: (ps, f) => { const s = f < 2 ? 1 : -1; ps.lax = -6 * s; ps.lay = -7; ps.rax = -2 * s; ps.ray = -4; ps.lean = s; ps.bob = 1; if (s < 0) { const t = ps.lax; ps.lax = ps.rax; ps.rax = t; } } },
  caballito: { n: 'Caballito', pose: (ps, f) => { ps.crouch = 2; ps.jump = f % 2 ? 3 : 0; ps.lax = 1; ps.rax = -1; ps.lay = -3; ps.ray = -3; ps.lfy = f % 2 ? -1 : 0; } },
  twist: { n: 'Twist', pose: (ps, f) => { const s = f % 2 ? 1 : -1; ps.crouch = 1 + (f % 2); ps.lean = s; ps.lax = -4; ps.lay = -2; ps.rax = 4; ps.ray = -2; ps.lfx = s; ps.rfx = -s; } },
  breakdance: { n: 'Breakdance', spin: 1, pose: (ps, f) => { ps.crouch = 4; ps.lax = -5; ps.rax = 5; ps.lay = -1; ps.ray = -1; } },
  salsa: { n: 'Salsa', walk: 1, pose: (ps, f) => { if (f % 2) { ps.lay = -9; ps.lax = -1; } else { ps.ray = -9; ps.rax = 1; } ps.bob = f % 2 ? -1 : 0; } },
  hiphop: { n: 'Paso Hip-Hop', pose: (ps, f) => { ps.bob = f % 2 ? -2 : 0; ps.crouch = 1; ps.lax = 2; ps.rax = -2; ps.lay = -4; ps.ray = -4; ps.lfx = f === 1 ? -1 : 0; ps.rfx = f === 3 ? 1 : 0; } },
};
for (const k in DANCES) if (DANCES[k].pose) ANIMS['dz_' + k] = [0, 4];
{ const _hp = heroPose; heroPose = function (dir, anim, f, L) { if (anim.startsWith('dz_')) { const D = DANCES[anim.slice(3)]; const ps = poseFor(dir, D.walk ? 'walk' : 'idle', D.walk ? f : 0, L); ps.noWeapon = 1; ps.wang = null; D.pose(ps, f); return ps; } return _hp(dir, anim, f, L); }; }
function danceAtlasFor(e, dk) { const app = normApp(e.app), gear = e.type === 'player' ? gearTiers(e) : e.gear, cos = e.cos || {}, hh = e.type === 'player' ? e.hideHelm : e.hh; return getAtlas('D' + dk + heroKey(e.cls, app, gear, cos, hh), () => buildAtlas(heroLook(e.cls, app, gear, cos, { hideHelm: hh }), ['dz_' + dk], drawHero)); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) {
  if ((e.type === 'player' || e.type === 'remote') && e.anim === 'dance' && e.dk && DANCES[e.dk] && DANCES[e.dk].pose) { const A0 = e.atlas, an0 = e.anim, d0 = e.dir, f0 = e.af; e.atlas = danceAtlasFor(e, e.dk); e.anim = 'dz_' + e.dk; e.af = f0 % 4; if (DANCES[e.dk].spin) e.dir = DIRS[[0, 1, 3, 2][Math.floor(G.t * 8) % 4]]; try { _de(e, cx, cy); } finally { e.atlas = A0; e.anim = an0; e.dir = d0; e.af = f0; } return; }
  if (e.type === 'pet' || e.type === 'rpet') { drawPetAura(e, cx, cy); }
  return _de(e, cx, cy); }; }
function doDance(k) { const P = G.P; P.dances = P.dances || ['clasico']; if (!P.dances.includes(k)) return; P.dk = k === 'clasico' ? null : k; doEmote('dance'); if (typeof passEvent === 'function') passEvent('dance', 1); }
// ---------- pets ----------
const PETS = {
  gato: { n: 'Gato Negro', d: '+5% de probabilidad de crítico.', price: 3000, look: { b: '#1a1620', b2: '#3a3446', ear: 'pointy', tail: 'thin', eye: '#ffd040' } },
  perro: { n: 'Perro Fiel', d: 'Muerde a tus enemigos (25% de tu ataque).', price: 3500, act: 'bite', look: { b: '#9a6a3a', b2: '#c89a64', ear: 'floppy', tail: 'thin', eye: '#2a1a10' } },
  zorro: { n: 'Zorro Astuto', d: '+12% de oro de los enemigos.', price: 5000, act: 'gold', look: { b: '#d8701e', b2: '#fff0e0', ear: 'pointy', tail: 'bushy', eye: '#2a1a10' } },
  buho: { n: 'Búho Sabio', d: '+8% de experiencia.', price: 6000, act: 'xp', fly: 1, look: { kind: 'bird', b: '#8a6a4a', b2: '#e8d8b8', eye: '#ffb030' } },
  conejo: { n: 'Conejo Saltarín', d: '+8% de velocidad de movimiento.', price: 2500, look: { b: '#e8e4ea', b2: '#ffc8d8', ear: 'long', tail: 'puff', eye: '#c83a5a' } },
  slimecito: { n: 'Slimecito', d: 'Te cura un 1.5% de vida cada 5 segundos.', price: 4000, act: 'heal', look: { kind: 'slime', b: '#3a9a2a', b2: '#b8f890' } },
  tortuga: { n: 'Tortuga Escudo', d: '+8% de defensa.', price: 4000, look: { kind: 'turtle', b: '#3a8a3a', b2: '#8a6a3a' } },
  pinguino: { n: 'Pingüino Pescador', d: 'Los peces pican antes y a veces pesca uno extra para ti.', price: 4500, act: 'fish', look: { kind: 'penguin', b: '#1a1a2a', b2: '#f0f0f8', eye: '#ffffff' } },
  mapache: { n: 'Mapache Ladronzuelo', d: '15% de probabilidad de material extra al talar, minar o recolectar.', pass: 1, act: 'gather', look: { b: '#6a6a72', b2: '#c8c8d0', ear: 'pointy', tail: 'ringed', mask: 1, eye: '#1a1a1a' } },
  dragoncito: { n: 'Dragoncito', d: 'Escupe bolas de fuego a tus enemigos (40% de tu ataque).', pass: 1, act: 'fire', fly: 1, look: { kind: 'dragon', b: '#c02a2a', b2: '#ffd040', eye: '#ffffff' } },
  hada: { n: 'Hada Luminosa', d: 'Ilumina la noche y las cuevas, y regenera maná.', pass: 1, act: 'light', fly: 1, look: { kind: 'fairy', b: '#ff9ad8', b2: '#bff0ff' } },
  fenix: { n: 'Fénix Bebé', d: 'Si caes, te reanima al instante (una vez cada 10 minutos). +5% de ataque.', pass: 1, act: 'revive', fly: 1, look: { kind: 'bird', b: '#ff6a1a', b2: '#ffd040', eye: '#ffffff', fire: 1 } },
};
function genPet(k) {
  const L = PETS[k].look, B = pal([L.b, L.b, L.b2, L.b2]).map((c, i) => i === 0 ? uMul(c, 0.6) : i === 1 ? c : i === 2 ? c : uMul(c, 1.1)), dk = uMul(C(L.b), 0.45), body = C(L.b), hi = C(L.b2), eye = C(L.eye || '#1a1a1a');
  return mobAtlas(26, 24, (p, dir, a, f) => {
    const side = dir === 'left', up = dir === 'up', hop = a === 'walk' ? [0, 2, 3, 1][f] : a === 'idle' ? f : a === 'atk' ? [0, 2, 0][f] : 0, by = 20 - hop, cx = 13;
    const kind = L.kind || 'quad';
    if (kind === 'slime') { const w = 7 + (a === 'walk' && f % 2 ? 1 : 0), h = 6 - (a === 'walk' && f % 2 ? 1 : 0); p.ball(cx, by - h + 1, w, h, [dk, body, body, hi]); if (!up) { p.set(cx - 3, by - h, C('#102010')); p.set(cx + 2, by - h, C('#102010')); } p.set(cx - 3, by - h * 2 + 3, C('#ffffff')); return; }
    if (kind === 'turtle') { p.ball(cx, by - 4, 7, 4.5, [dk, C(L.b2), C(L.b2), uMul(C(L.b2), 1.3)]); for (let k2 = -1; k2 <= 1; k2++) p.set(cx + k2 * 3, by - 6, dk); const hx = side ? cx - 8 : cx, hy = up ? by - 9 : side ? by - 4 : by - 1; if (!up) { p.ball(hx, hy, 2.6, 2.2, [dk, body, body, hi]); p.set(hx - 1, hy - 1, C('#101010')); if (!side) p.set(hx + 1, hy - 1, C('#101010')); } for (const lx of [-5, 5]) p.rect(cx + lx - 1, by - 1 + (a === 'walk' && f % 2 ? -1 : 0), 2, 2, body); return; }
    if (kind === 'penguin') { p.ball(cx, by - 6, 5.5, 7, [dk, body, body, body]); if (!up) p.ball(cx + (side ? -1 : 0), by - 5, 3.6, 5.5, [hi, hi, hi, C('#ffffff')]); p.ball(cx, by - 13, 4.5, 4, [dk, body, body, body]); if (!up) { p.set(cx - 2 + (side ? -1 : 0), by - 14, eye); if (!side) p.set(cx + 2, by - 14, eye); p.rect(cx - 1 + (side ? -4 : 0), by - 12, 2, 1, C('#ffb030')); } for (const lx of side ? [0] : [-3, 3]) p.rect(cx + lx - 1, by, 3, 1, C('#ffb030')); for (const s of [-1, 1]) p.line(cx + s * 5, by - 9, cx + s * 7, by - 4 - (a === 'walk' ? f % 2 * 2 : 0), dk); return; }
    if (kind === 'bird' || kind === 'dragon' || kind === 'fairy') {
      const fl = Math.floor((G.t || 0) * 0) + [0, 2, 3, 1][f % 4], cy = by - 9 - (a === 'walk' ? 0 : f);
      if (kind === 'fairy') { for (const s of [-1, 1]) p.ball(cx + s * 5, cy - 2 - (fl % 2), 3.5, 2.6, pal(['#9ad8ff', '#bff0ff', '#e0f8ff', '#ffffff'])); p.ball(cx, cy, 2.4, 3, [dk, body, body, hi]); p.ball(cx, cy - 4, 2.4, 2.2, pal(['#d8a888', '#f0c8a8', '#ffe0c8', '#fff0e0'])); p.rect(cx - 2, cy - 7, 5, 1, C('#ffe060')); if (!up) { p.set(cx - 1, cy - 4, C('#2a2a5a')); p.set(cx + 1, cy - 4, C('#2a2a5a')); } return; }
      for (const s of side ? [1] : [-1, 1]) { const wy = [-4, -1, 2, -1][fl]; p.poly([[cx + s * 2, cy - 1], [cx + s * 9, cy + wy - 2], [cx + s * 7, cy + wy + 2], [cx + s * 3, cy + 3]], kind === 'dragon' ? uMul(body, 0.8) : hi); }
      p.ball(cx, cy, 5, 4.6, [dk, body, body, hi]); if (!up) p.ball(cx + (side ? -1 : 0), cy + 1, 2.8, 2.6, [hi, hi, hi, C('#ffffff')]);
      const hx = side ? cx - 3 : cx, hy = cy - 5; p.ball(hx, hy, 3.6, 3.2, [dk, body, body, hi]);
      if (kind === 'dragon') { for (const s of side ? [1] : [-1, 1]) { p.set(hx + s * 2, hy - 4, hi); p.set(hx + s * 2, hy - 5, hi); } p.line(cx + (side ? 4 : 0), cy + 3, cx + (side ? 9 : 0), cy + 6, body); } else { p.set(hx - 2, hy - 3, body); p.set(hx + 2, hy - 3, body); }
      if (!up) { p.set(hx - 1 - (side ? 1 : 0), hy - 1, eye); if (!side) p.set(hx + 1, hy - 1, eye); p.rect(hx - 1 + (side ? -3 : 0), hy + 1, 2, 1, C(kind === 'dragon' ? '#ff9a6a' : '#ffb030')); }
      if (L.fire) { p.set(hx, hy - 5, C('#ffd040')); p.set(hx - 1, hy - 4, C('#ff8a2a')); p.set(hx + 1, hy - 4, C('#ff8a2a')); }
      return; }
    // quadruped (cat, dog, fox, bunny, raccoon)
    const lp = a === 'walk' ? f % 2 : 0;
    if (side) { p.ball(cx + 1, by - 5, 6.5, 3.8, [dk, body, body, hi]); for (const lx of [-3, 4]) { p.rect(cx + lx, by - 2, 2, 3 - (lp && lx < 0 ? 1 : 0), dk); }
      const tx = cx + 7; if (L.tail === 'bushy' || L.tail === 'ringed') { p.ball(tx + 2, by - 8, 2.6, 4, [dk, body, body, L.tail === 'ringed' ? dk : hi]); p.set(tx + 2, by - 11, hi); } else if (L.tail === 'puff') p.ball(tx, by - 6, 2, 2, [hi, hi, hi, C('#ffffff')]); else p.line(tx - 1, by - 6, tx + 2, by - 11 + lp, body);
      const hx = cx - 5, hy = by - 10; p.ball(hx, hy, 4, 3.6, [dk, body, body, hi]); p.ball(hx - 2.5, hy + 1.5, 2, 1.6, [hi, hi, hi, C('#ffffff')]); p.set(hx - 4, hy + 1, dk);
      if (L.ear === 'long') { p.rect(hx, hy - 9, 2, 6, body); p.vl(hx + 1, hy - 8, 4, C(L.b2)); } else if (L.ear === 'floppy') { p.rect(hx + 1, hy - 3, 3, 5, dk); } else { p.poly([[hx - 1, hy - 3], [hx + 2, hy - 7], [hx + 3, hy - 2]], body); }
      if (L.mask) p.hl(hx - 3, hy - 1, 5, dk); p.set(hx - 2, hy - 1, eye); }
    else { p.ball(cx, by - 4, 5.5, 4, [dk, body, body, hi]); for (const lx of [-3, 2]) p.rect(cx + lx, by - 1, 2, 2, dk);
      if (up) { const tl = L.tail; if (tl === 'bushy' || tl === 'ringed') p.ball(cx, by - 7, 2.6, 3.6, [dk, body, body, hi]); else if (tl === 'puff') p.ball(cx, by - 4, 2, 2, [hi, hi, hi, C('#ffffff')]); else p.line(cx, by - 6, cx + 2, by - 11, body); }
      const hy = by - 11; p.ball(cx, hy, 4.6, 4, [dk, body, body, hi]);
      if (L.ear === 'long') for (const s of [-1, 1]) { p.rect(cx + s * 2 - (s < 0 ? 1 : 0), hy - 10, 2, 7, body); if (!up) p.vl(cx + s * 2 - (s < 0 ? 0 : -1) - 1 + (s < 0 ? 1 : 0), hy - 9, 5, C(L.b2)); }
      else if (L.ear === 'floppy') for (const s of [-1, 1]) p.rect(cx + s * 5 - 1, hy - 2, 2, 5, dk);
      else for (const s of [-1, 1]) p.poly([[cx + s * 1.5, hy - 3], [cx + s * 4.5, hy - 7], [cx + s * 4.5, hy - 1]], body);
      if (!up) { if (L.mask) p.hl(cx - 4, hy - 1, 9, dk); p.set(cx - 2, hy - 1, eye); p.set(cx + 2, hy - 1, eye); p.ball(cx, hy + 1.5, 2, 1.5, [hi, hi, hi, C('#ffffff')]); p.set(cx, hy + 1, dk); } }
  });
}
function petAtlas(k) { return getAtlas('PET' + k, () => genPet(k)); }
let PETE = null;
function petStats(P, S) { const k = P.pet; if (!k || !PETS[k]) return; if (k === 'gato') S.crit = Math.min(70, S.crit + 5); if (k === 'conejo') S.spd *= 1.08; if (k === 'tortuga') S.def = Math.round(S.def * 1.08); if (k === 'fenix') S.atk = Math.round(S.atk * 1.05); if (k === 'hada') S.mpReg = (S.mpReg || 0) + 2; }
function petHas(act) { const P = G.P; return !!(P && P.pet && PETS[P.pet] && PETS[P.pet].act === act); }
function setPet(k) { const P = G.P; P.pet = k && P.pets && P.pets.includes(k) ? k : null; if (PETE) { PETE.remove = true; PETE = null; } spawnPetEnt(); calcStats(P); markDirty(); netPresence(true); }
function spawnPetEnt() { const P = G.P; if (!P || !P.pet || P.ghost) return; if (PETE && !PETE.remove && G.ents.includes(PETE)) return; PETE = { type: 'pet', pid: P.pet, atlas: petAtlas(P.pet), x: P.x + 12, y: P.y + 6, map: P.map, dir: 'down', anim: 'idle', af: 0, at: 0, shR: 4, L: -1, cd: 1 }; if (PETS[P.pet].fly) PETE.z = 8; if (P.pet === 'hada') { PETE.glow = 70; PETE.glowC = 'rgba(200,240,255,0.5)'; } if (P.pet === 'fenix' || P.pet === 'dragoncito') { PETE.glow = 30; PETE.glowC = 'rgba(255,160,60,0.4)'; } G.ents.push(PETE); }
function givePet(k, silent) { const P = G.P; P.pets = P.pets || []; if (!PETS[k] || P.pets.includes(k)) return false; P.pets.push(k); if (!silent) toast('¡Nueva mascota: ' + PETS[k].n + '! Equípala en la pestaña Mascotas', 'quest', 5); if (!P.pet) setPet(k); markDirty(true); return true; }
function petTick(dt) {
  const P = G.P; if (!P || !P.pet || P.ghost) return; spawnPetEnt(); const e = PETE; if (!e) return;
  if (e.map !== P.map) { e.map = P.map; e.x = P.x + 10; e.y = P.y + 4; }
  if (P.riding) { e.x = P.x; e.y = P.y; e.map = 'hidden'; return; }
  const dv = DIRV[P.dir], tx = P.x - dv[0] * 18 + (dv[1] ? 12 : 0), ty = P.y - dv[1] * 12 + 4, dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
  if (L > 300) { e.x = tx; e.y = ty; } else if (L > 4) { const sp = Math.min(L * 4, P.S.spd * 1.25); e.x += dx / L * sp * dt; e.y += dy / L * sp * dt; e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); } else { setAnim(e, 'idle', true); if (L < 1) e.dir = P.dir; }
  stepAnim(e, dt, e.anim === 'walk' ? 9 : 3); if (PETS[P.pet].fly) e.z = 8 + Math.sin(G.t * 4) * 2;
  e.cd -= dt; const act = PETS[P.pet].act;
  if ((act === 'bite' || act === 'fire') && e.cd <= 0 && !P.dead) { const m = nearestMob(P.x, P.y, act === 'fire' ? 150 : 90); if (m) { e.cd = act === 'fire' ? 1.6 : 1.2; if (act === 'fire') spawnProj('p', e.x, e.y - 8, Math.atan2(m.y - e.y, m.x - e.x), { spd: 200, dmg: P.S.atk * 0.4, art: 'fire', fire: 1, life: 1, pet: 1 }); else { e.x = m.x + (e.x < m.x ? -10 : 10); e.y = m.y; hitMob(m, P.S.atk * 0.25, { summon: 1 }); setAnim(e, 'atk'); sfx('swing'); } } }
  if (act === 'heal' && e.cd <= 0) { e.cd = 5; if (!P.dead && P.hp < P.S.maxhp) { const h = Math.max(1, Math.round(P.S.maxhp * 0.015)); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 36, '+' + h, '#7ae07a'); } }
  if (act === 'light' && e.cd <= 0) { e.cd = 1; P.mp = Math.min(P.S.maxmp, P.mp + Math.max(1, P.S.maxmp * 0.01)); }
  if (Math.random() < dt * 2 && (act === 'light' || act === 'revive')) burst(e.x, e.y - 10 - (e.z || 0), 1, { sp: 8, up: 10, g: -10, life: 0.6, c: act === 'light' ? ['#bff0ff', '#ffffff'] : ['#ffd040', '#ff7a1a'] });
}
function drawPetAura(e, cx, cy) { }
// pet effects on loot
{ const _gx = gainXp; gainXp = function (n) { if (petHas('xp')) n = Math.round(n * 1.08); return _gx.apply(this, [n].concat([].slice.call(arguments, 1))); }; }
function petOnKill(m) { const P = G.P; if (petHas('gold') && m.gold) { const g = Math.round(m.gold * 0.12); if (g) P.gold += g; } }
function petOnHarvest(kind, tier) { if (petHas('gather') && Math.random() < 0.15) { const id = (kind === 'tala' ? 'log' : kind === 'mineria' ? 'ore' : 'herb') + tier; if (ITEMS[id]) { giveItem(id, 1, true); floatText(G.P.x, G.P.y - 44, '+1 Mapache', '#c8c8d0'); } } }
// remote pets
function petPresence(o) { const P = G.P; if (PETE && P.pet) o.pe = [P.pet, Math.round(PETE.x), Math.round(PETE.y), DIRS.indexOf(PETE.dir), PETE.anim === 'walk' ? 1 : 0]; }
function petRecv(r, pr) { const a = pr.pe; if (Array.isArray(a) && PETS[a[0]]) { let e = r.rpet; if (!e || e.pid !== a[0] || e.remove) { if (e) e.remove = true; e = { type: 'rpet', pid: a[0], atlas: petAtlas(a[0]), x: +a[1], y: +a[2], map: r.map, dir: 'down', anim: 'idle', af: 0, at: 0, shR: 4 }; if (PETS[a[0]].fly) e.z = 8; G.ents.push(e); r.rpet = e; } e.tx = +a[1]; e.ty = +a[2]; e.dir = DIRS[a[3]] || 'down'; e.ta = a[4] ? 'walk' : 'idle'; e.map = r.map; e.seen = G.t; } else if (r.rpet) { r.rpet.remove = true; r.rpet = null; } }
// ---------- battle pass ----------
const PASS_LV = 60, PASS_XP = 500;
const PR = [
  ['gold', 500], ['dance', 'macarena'], ['cos', 'c_gafas'], ['item', 'pocion2', 5], ['pet', 'mapache'], ['cos', 'c_pamela'], ['gold', 1500], ['cos', 'c_banador'], ['dance', 'floss'], ['cos', 'c_hawaiana'],
  ['item', 'piedra1', 3], ['cos', 'c_pareo'], ['cos', 'c_bermuda'], ['cos', 'c_chanclas'], ['item', 'tarjeta_tren', 1], ['dance', 'robot'], ['cos', 'c_gala_guerrero'], ['gold', 3000], ['cos', 'c_astral_mago'], ['pet', 'dragoncito'],
  ['cos', 'c_bosque_arquero'], ['dance', 'moonwalk'], ['cos', 'c_carmesi_asesino'], ['item', 'piedra2', 2], ['cos', 'c_estrella_bardo'], ['cos', 'c_animas_invocador'], ['dance', 'dab'], ['cos', 'c_alas_mariposa'], ['gold', 6000], ['pet', 'hada'],
  ['cos', 'c_capa_arcoiris'], ['dance', 'caballito'], ['cos', 'c_orejas_zorro'], ['item', 'pocion3', 10], ['cos', 'c_vestido_verano'], ['dance', 'twist'], ['cos', 'c_banador_rojo'], ['gold', 10000], ['cos', 'c_panuelo_tropical'], ['cos', 'c_hawaiana_roja'],
  ['dance', 'breakdance'], ['cos', 'c_traje_gala'], ['item', 'piedra3', 1], ['cos', 'c_vestido_gala'], ['gold', 15000], ['dance', 'salsa'], ['cos', 'c_alas_fenix'], ['item', 'piedra2', 5], ['cos', 'c_capa_galaxia'], ['dance', 'hiphop'],
  ['cos', 'c_corona_volcan'], ['gold', 25000], ['cos', 'c_obsidiana'], ['item', 'piedra3', 2], ['cos', 'c_aurora'], ['cos', 'c_tiara_sol'], ['gold', 40000], ['cos', 'c_alas_celestes'], ['cos', 'c_aureola_dorada'], ['pet', 'fenix'],
];
function prName(r) { return r[0] === 'gold' ? fmt(r[1]) + ' oro' : r[0] === 'dance' ? 'Baile: ' + DANCES[r[1]].n : r[0] === 'cos' ? (COSM[r[1]] ? COSM[r[1]].n : r[1]) : r[0] === 'pet' ? 'Mascota: ' + PETS[r[1]].n : ITEMS[r[1]] ? ITEMS[r[1]].n + (r[2] > 1 ? ' ×' + r[2] : '') : r[1]; }
function prIcon(r) { return r[0] === 'gold' ? ['coin'] : r[0] === 'dance' ? ['note', '#ff7ab0'] : r[0] === 'cos' ? ['hanger'] : r[0] === 'pet' ? ['paw'] : ITEMS[r[1]] ? ITEMS[r[1]].icon : ['star', '#ffd040']; }
const PM = [ // mission templates: [kind, filter, target, xp, text]
  ['kill', null, 25, 300, 'Derrota {n} enemigos'], ['kill', null, 50, 450, 'Derrota {n} enemigos'], ['elite', null, 2, 400, 'Derrota {n} enemigos de élite'], ['boss', null, 1, 600, 'Derrota a un jefe'],
  ['job', 'tala', 8, 300, 'Tala {n} árboles'], ['job', 'mineria', 8, 300, 'Mina {n} vetas'], ['job', 'herbo', 8, 300, 'Recolecta {n} hierbas'], ['fish', null, 5, 320, 'Pesca {n} peces'],
  ['craft', null, 3, 300, 'Fabrica {n} objetos'], ['quest', null, 1, 450, 'Completa {n} misión'], ['talk', null, 6, 200, 'Habla con {n} personas'], ['dance', null, 1, 150, 'Baila una vez'],
  ['cave', null, 15, 450, 'Derrota {n} enemigos en una cueva'], ['train', null, 1, 350, 'Viaja {n} vez en tren'], ['dig', null, 3, 280, 'Excava {n} montículos'], ['farm', null, 2, 280, 'Cosecha {n} veces'],
];
function passState() { const P = G.P; P.pass = P.pass || { xp: 0, lv: 0, ms: [] }; while (P.pass.ms.length < 3) P.pass.ms.push(newMission(P.pass.ms)); return P.pass; }
function newMission(cur) { const used = new Set(cur.map(m => m.i)); let i, tries = 0; do { i = (Math.random() * PM.length) | 0; tries++; } while ((used.has(i) || (PM[i][0] === 'train' && typeof RAIL === 'undefined')) && tries < 50); return { i, p: 0 }; }
function msText(m) { const t = PM[m.i]; return t[4].replace('{n}', t[2]); }
function passXp(n) { const S = passState(); if (S.lv >= PASS_LV) return; S.xp += n; while (S.lv < PASS_LV && S.xp >= PASS_XP) { S.xp -= PASS_XP; S.lv++; grantPass(S.lv); } if (S.lv >= PASS_LV) S.xp = 0; uiDirty.hud = true; }
function grantPass(lv) { const r = PR[lv - 1], P = G.P; if (!r) return; if (r[0] === 'gold') P.gold += r[1]; else if (r[0] === 'dance') { P.dances = P.dances || ['clasico']; if (!P.dances.includes(r[1])) P.dances.push(r[1]); } else if (r[0] === 'cos') giveCosmetic(r[1], true); else if (r[0] === 'pet') givePet(r[1], true); else if (ITEMS[r[1]]) giveItem(r[1], r[2] || 1, true);
  banner('¡Pase de batalla: nivel ' + lv + '!', prName(r)); sfx('level'); markDirty(true); }
function passEvent(k, a) {
  const P = G.P; if (!P || P.ghost) return; const S = passState();
  if (k === 'kill') { const m = a; passXp(m.boss ? 120 : m.elite ? 25 : 3); }
  if (k === 'quest') passXp(150); if (k === 'fish') passXp(8); if (k === 'craft') passXp(10); if (k === 'job') passXp(4); if (k === 'train') passXp(40);
  for (const m of S.ms) { const t = PM[m.i]; let inc = 0;
    if (k === 'kill') { const mob = a; if (t[0] === 'kill') inc = 1; if (t[0] === 'elite' && mob.elite) inc = 1; if (t[0] === 'boss' && mob.boss) inc = 1; if (t[0] === 'cave' && CAVES[mob.map]) inc = 1; }
    else if (k === 'job' && t[0] === 'job' && t[1] === a) inc = 1; else if (k === 'job' && t[0] === 'dig' && a === 'excavacion') inc = 1; else if (k === 'job' && t[0] === 'farm' && a === 'agricultura') inc = 1;
    else if (t[0] === k && k !== 'kill' && k !== 'job') inc = 1;
    if (!inc) continue; m.p += inc; if (m.p >= t[2]) { m.done = 1; toast('Misión del pase completada: ' + msText(m) + ' (+' + t[3] + ' PB)', 'quest', 4); passXp(t[3]); } }
  if (S.ms.some(m => m.done)) { S.ms = S.ms.filter(m => !m.done); while (S.ms.length < 3) S.ms.push(newMission(S.ms)); if (panelTab === 'pass' && !$('#panel').hidden) renderPanel(); }
}
// hooks for pass events
{ const _cq = completeQuest; completeQuest = function () { const r = _cq.apply(this, arguments); passEvent('quest', 1); return r; }; }
{ const _gj = gainJobXp; gainJobXp = function (job) { const r = _gj.apply(this, arguments); passEvent('job', job); return r; }; }
{ const _fc = fishCaught; fishCaught = function (fish) { const r = _fc.apply(this, arguments); passEvent('fish', 1); if (petHas('fish') && Math.random() < 0.12) { giveItem(fish[0], 1, true); floatText(G.P.x, G.P.y - 44, '+1 Pingüino', '#ffffff'); } return r; }; }
{ const _dc = doCraft; doCraft = function (r) { const before = countItem(r.out); const x = _dc.apply(this, arguments); if (countItem(r.out) > before) passEvent('craft', 1); return x; }; }
{ const _od = openDialog; openDialog = function (e) { if (e && e.type === 'npc') passEvent('talk', 1); return _od.apply(this, arguments); }; }
// ---------- panels ----------
function renderPass(B) {
  const P = G.P, S = passState(); P.dances = P.dances || ['clasico'];
  const ms = S.ms.map(m => { const t = PM[m.i]; return `<div class="srow"><div class="sn"><b>${esc(msText(m))}</b><small>${Math.min(m.p, t[2])}/${t[2]} · +${t[3]} PB</small><div class="bar xp"><i style="width:${(100 * Math.min(1, m.p / t[2])).toFixed(0)}%"></i></div></div></div>`; }).join('');
  const track = PR.map((r, i) => { const lv = i + 1, got = S.lv >= lv; return `<div class="pr ${got ? 'got' : ''} ${lv === S.lv + 1 ? 'next' : ''} ${r[0] === 'pet' ? 'pet' : ''}"><small>Nv.${lv}</small>${iconHTML(prIcon(r), 24)}<span>${esc(prName(r))}</span>${got ? '<b>✓</b>' : ''}</div>`; }).join('');
  const dances = Object.keys(DANCES).map(k => `<button class="btn sm ${P.dances.includes(k) ? '' : 'dim'}" data-dz="${k}" ${P.dances.includes(k) ? '' : 'disabled'}>${esc(DANCES[k].n)}${P.dances.includes(k) ? '' : ' 🔒'}</button>`).join('');
  B.innerHTML = `<div class="frame passw"><div class="phead"><h3>Pase de Batalla · Temporada del Volcán</h3><div class="pl"><b>Nivel ${S.lv}/${PASS_LV}</b><div class="bar xp big"><i style="width:${S.lv >= PASS_LV ? 100 : (100 * S.xp / PASS_XP).toFixed(1)}%"></i></div><small>${S.lv >= PASS_LV ? '¡Pase completado!' : S.xp + '/' + PASS_XP + ' PB'}</small></div></div>
    <p class="hint">Ganas puntos del pase (PB) jugando: derrotando enemigos, con misiones de la historia, oficios y pesca, y sobre todo completando las misiones del pase. Las recompensas se reciben solas al subir de nivel.</p>
    <h3>Misiones del pase</h3><div class="slist">${ms}</div><h3>Recompensas</h3><div class="ptrack">${track}</div><h3>Tus bailes</h3><div class="row wrap">${dances}</div></div>`;
  $$('[data-dz]', B).forEach(b => b.onclick = () => { closePanel(); doDance(b.dataset.dz); });
  const nx = B.querySelector('.pr.next'); if (nx) setTimeout(() => nx.scrollIntoView({ block: 'nearest', inline: 'center' }), 30);
}
function renderPets(B) {
  const P = G.P; P.pets = P.pets || [];
  const cards = Object.keys(PETS).map(k => { const D = PETS[k], own = P.pets.includes(k), on = P.pet === k; return `<div class="petc ${own ? '' : 'dim'} ${on ? 'on' : ''}"><canvas width="52" height="48" data-petc="${k}"></canvas><div class="sn"><b>${esc(D.n)}</b><small>${esc(D.d)}</small><small>${own ? (on ? '<b class="ok2">Contigo</b>' : 'Tuya') : D.pass ? 'Recompensa del Pase de Batalla' : 'Tienda de mascotas de Albor · ' + fmt(D.price) + ' oro'}</small></div>${own ? `<button class="btn sm ${on ? '' : 'gold'}" data-pet="${on ? '' : k}">${on ? 'Guardar' : 'Llevar'}</button>` : ''}</div>`; }).join('');
  B.innerHTML = `<div class="frame"><h3>Mascotas ${P.pets.length}/${Object.keys(PETS).length}</h3><p class="hint">Tu mascota te sigue a todas partes, también la ven tus amigos en el multijugador. Cada una ayuda de una forma distinta.</p><div class="petgrid">${cards}</div></div>`;
  $$('[data-petc]', B).forEach(cv => { const A = petAtlas(cv.dataset.petc), x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(A.img, 0, 0, A.fw, A.fh, 0, 0, A.fw * 2, A.fh * 2); });
  $$('[data-pet]', B).forEach(b => b.onclick = () => { setPet(b.dataset.pet || null); sfx('ui'); renderPanel(); });
}
function renderSoulsTab(B) {
  const P = G.P; P.souls = P.souls || []; P.soulSet = (P.soulSet || []).filter(id => P.souls.some(s => s.id === id));
  const list = P.souls.slice().sort((a, b) => soulPower(b) - soulPower(a)), eq = P.soulSet.map(id => P.souls.find(s => s.id === id));
  const slot = i => { const s = eq[i]; return `<div class="sslot2 ${s ? 'on' : ''}">${s ? `<canvas width="56" height="56" data-sc="${s.id}"></canvas><b>${esc(soulDef(s).n)}</b><small>${Math.round(soulPower(s) * 100)}%</small>` : '<small>Vacío</small>'}</div>`; };
  B.innerHTML = `<div class="frame grim"><h3>${iconHTML(['soul', '#5ab0ff'], 20)} Grimorio de Almas · ${P.souls.length}/${SOUL_MAX}</h3><p class="hint">Cada enemigo que derrotas puede dejar su alma (élites 60%, jefes 100%). Elige hasta 3 almas: serán tus espíritus azules al usar Invocar Almas. Su fuerza depende del nivel y rango del enemigo.</p>
    <div class="sslots3">${slot(0)}${slot(1)}${slot(2)}</div><div class="soulgrid big">${list.map(s => { const d = soulDef(s), on = P.soulSet.includes(s.id); return `<div class="soul ${on ? 'on' : ''} ${s.b ? 'boss' : s.el ? 'el' : ''}"><canvas width="40" height="40" data-sc="${s.id}"></canvas><b>${esc(d.n)}</b><small>Nv.${s.lv}${s.b ? ' · jefe' : s.el ? ' · élite' : ''} · fuerza ${Math.round(soulPower(s) * 100)}%</small><div class="row"><button class="btn sm ${on ? '' : 'gold'}" data-seq="${s.id}">${on ? 'Quitar' : 'Equipar'}</button><button class="btn sm" data-srel="${s.id}">Liberar</button></div></div>`; }).join('') || '<p class="hint">Aún no tienes almas.</p>'}</div></div>`;
  $$('[data-sc]', B).forEach(cv => { const s = P.souls.find(x => x.id === cv.dataset.sc); if (!s) return; const A = soulAtlas(soulDef(s)), x = cv.getContext('2d'); x.imageSmoothingEnabled = false; const sc = Math.min(cv.width / A.fw, cv.height / A.fh) * 1.2; x.drawImage(A.img, A.idx.idle * A.fw, 0, A.fw, A.fh, (cv.width - A.fw * sc) / 2, cv.height - A.fh * sc, A.fw * sc, A.fh * sc); });
  $$('[data-seq]', B).forEach(b => b.onclick = () => { const id = b.dataset.seq; if (P.soulSet.includes(id)) P.soulSet = P.soulSet.filter(x => x !== id); else { if (P.soulSet.length >= 3) P.soulSet.shift(); P.soulSet.push(id); } sfx('ui'); markDirty(); renderPanel(); });
  $$('[data-srel]', B).forEach(b => b.onclick = () => { if (b.dataset.ok !== '1') { b.dataset.ok = '1'; b.textContent = '¿Seguro?'; return; } const id = b.dataset.srel; P.souls = P.souls.filter(s => s.id !== id); P.soulSet = P.soulSet.filter(x => x !== id); burst(P.x, P.y - 20, 12, { sp: 30, up: 50, g: -30, life: 1, c: ['#5ab0ff', '#d0f0ff'] }); sfx('ui'); markDirty(); renderPanel(); });
}
// pet shop at Albor
NPCS.cuidadora = { n: 'Dina', title: 'Cuidadora de mascotas', look: LK({ hair: HAIRS.rubio, hairStyle: 'long', outfit: 'apron', main: CLOTH.verde, eyes: 'verde' }), lines: ['¡Cada mascota tiene su talento! Elige con el corazón.', 'Los dragoncitos y los fénix solo los consiguen los aventureros más dedicados.'] };
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'cuidadora') return; opts.push({ label: 'Adoptar una mascota', icon: ['paw'], fn: () => openPetShop() }); });
function openPetShop() {
  const P = G.P; P.pets = P.pets || [];
  const rows = Object.keys(PETS).filter(k => !PETS[k].pass).map(k => { const D = PETS[k], own = P.pets.includes(k); return `<div class="srow ${own ? 'dim' : ''}"><canvas width="40" height="36" data-petc="${k}"></canvas><div class="sn"><b>${esc(D.n)}</b><small>${esc(D.d)}</small></div>${own ? '<small>Ya es tuya</small>' : `<button class="btn sm gold" data-buyp="${k}">${iconHTML(['coin'], 12)} ${fmt(D.price)}</button>`}</div>`; }).join('');
  openModal(`<h2>${iconHTML(['paw'], 22)} Adoptar mascota</h2><div class="slist">${rows}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $$('#modal [data-petc]').forEach(cv => { const A = petAtlas(cv.dataset.petc), x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(A.img, 0, 0, A.fw, A.fh, 0, 0, A.fw * 1.5, A.fh * 1.5); });
  $$('#modal [data-buyp]').forEach(b => b.onclick = () => { const k = b.dataset.buyp; if (P.gold < PETS[k].price) { toast('No tienes suficiente oro', 'warn'); return; } P.gold -= PETS[k].price; sfx('coin'); givePet(k); openPetShop(); });
  const c = $('#mclose'); if (c) c.onclick = closeModal;
}
function placePetShop(W) { const t = TOWNS.find(t => t.k === 'albor'); for (const [x, y] of [[113, 147], [112, 149], [124, 147], [114, 156], [120, 159]]) { const i = W.I(x, y); if (!SOLID_T[W.ter[i]] && W.objAt[i] < 0) { W.npcDefs.push({ id: 'cuidadora', x, y, face: 'down' }); return; } } }
