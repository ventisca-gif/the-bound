// ================= v5.16: BAHÍA DE ACAPULCO (GUERRERO) COMO EN LAS FOTOS DE SERGIO =================
// El mapa de México crece hacia el sur (MX_H 640). La bahía es una herradura de mar con playa dorada, la Costera
// (avenida con palmeras) con los hoteles altos entre la avenida y la playa, colonias de casitas de colores y los
// cerros verdes detrás. Al oeste La Quebrada (acantilado con clavadistas) y Pie de la Cuesta con palapas; al este
// Puerto Marqués; en la boca de la bahía la isla La Roqueta (lancha). Letras de colores «ACAPULCO» y «GUERRERO» en la playa.
const ACA = { x0: 336, x1: 700, y0: 410, cx: 518, cy: 648, rx: 140, ry: 150, isl: [400, 628, 11, 6] };
const acaE = (x, y) => Math.hypot((x - ACA.cx) / ACA.rx, (y - ACA.cy) / ACA.ry);
const acaWest = y => ACA.x0 + Math.round(3 * Math.sin(y * 0.13)) + (y > 596 ? Math.round((y - 596) * 0.4) : 0);
const acaEast = y => ACA.x1 - Math.round(3 * Math.sin(y * 0.11)) - (y > 600 ? Math.round((y - 600) * 0.4) : 0);
const acaIn = (x, y) => x >= ACA.x0 && x <= ACA.x1 && y >= ACA.y0;
const ACA_B = { SEA: 1, BEACH: 2, HOT: 3, COST: 4, CITY: 5, HILL: 6, ISL: 7 };
MX_RES.push([ACA.x0, ACA.y0, ACA.x1, 639]);
// arena dorada (23) y cerro con selva (24)
LM_GCOL.length = 21; LM_GCOL.push('#6a9a8a', '#5a8a4a', '#e8c88a', '#2e7a32');
{ const _p2 = lmPaint2; lmPaint2 = function (M, g, x, y, tx, ty, k, m) { if (k !== 23 && k !== 24) return _p2.apply(this, arguments); const h = hash2(tx, ty, 191), R = (a, b, w, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, hh); };
  if (k === 23) { R(0, 0, 16, 16, h < 0.5 ? '#e8c88a' : '#e2c080'); for (let q = 0; q < 5; q++) R((hash2(tx * 5 + q, ty, 192) * 15) | 0, (hash2(tx, ty * 5 + q, 193) * 15) | 0, 1, 1, ['#f8e4b0', '#c8a068', '#fff0c8'][q % 3]);
    if (m === 1) { R(0, 12, 16, 4, 'rgba(255,255,255,0.5)'); R(((h * 9) | 0), 13, 6, 1, '#ffffff'); } if (m === 2) R(0, 0, 16, 16, 'rgba(120,90,50,0.18)'); return; }
  R(0, 0, 16, 16, h < 0.5 ? '#2e7a32' : '#2a722e'); for (let q = 0; q < 4; q++) { const px = (hash2(tx * 3 + q, ty, 194) * 13) | 0, py = (hash2(tx, ty * 3 + q, 195) * 13) | 0; R(px, py, 3, 3, ['#3e9a3e', '#226a2a', '#4aa848', '#1e5a26'][q]); } }; }
{ const _mb = mxBuild; mxBuild = function (M) { const I = M.I, J = LM_G, w = M.w, h = M.h, B = M.acaB = new Uint8Array(w * h);
  // ---- suelo de la bahía (antes de construir el resto de México) ----
  for (let y = ACA.y0; y < h; y++) for (let x = ACA.x0 - 8; x <= ACA.x1 + 8; x++) { if (x < 0 || x >= w) continue; const i = I(x, y), e = acaE(x, y), [ix, iy, irx, iry] = ACA.isl, ei = Math.hypot((x - ix) / irx, (y - iy) / iry);
    const ocean = y >= 478 && (x < acaWest(y) || x > acaEast(y)); if (x < ACA.x0 && y < 478) continue; if (x > ACA.x1 && y < 478) continue;
    let b; if (ei < 1) b = ACA_B.ISL; else if (ocean || e < 1) b = ACA_B.SEA; else if (e < 1.05) b = ACA_B.BEACH; else if (e < 1.09) b = ACA_B.HOT; else if (e < 1.125) b = ACA_B.COST; else if (e < 1.33 || y > 560) b = ACA_B.CITY; else b = ACA_B.HILL;
    if (b !== ACA_B.SEA && b !== ACA_B.ISL && y >= 470) { const dw = x - acaWest(y), de = acaEast(y) - x; if (Math.min(dw, de) < 4) b = ACA_B.BEACH; }
    B[i] = b; M.lm[i] = 0; M.ld[i] = 0;
    if (b === ACA_B.SEA) { M.lg[i] = J.SEA; M.ld[i] = Math.min(250, Math.round(e < 1 ? (1 - e) * 90 : Math.min(Math.abs(x - acaWest(y)), Math.abs(x - acaEast(y)), y - 478) )); M.ter[i] = T.WATER; continue; }
    M.ter[i] = T.FLOOR;
    if (b === ACA_B.BEACH || b === ACA_B.ISL) { M.lg[i] = 23; if (b === ACA_B.ISL && ei < 0.6) { M.lg[i] = 24; } }
    else if (b === ACA_B.HOT) M.lg[i] = J.WALK;
    else if (b === ACA_B.COST) { const t = e - 1.09; M.lg[i] = t < 0.006 || t > 0.029 ? J.WALK : J.ROAD; if (Math.abs(t - 0.0175) < 0.0025) M.lg[i] = J.GRASS; }
    else if (b === ACA_B.CITY) { const lane = (x - ACA.x0) % 16 < 2 || (y - ACA.y0) % 9 === 0; M.lg[i] = lane ? J.PATH : J.GRASS; }
    else M.lg[i] = 24; }
  // espuma en la orilla
  for (let y = ACA.y0; y < h - 1; y++) for (let x = ACA.x0 - 8; x <= ACA.x1 + 8; x++) { const i = I(x, y); if (M.lg[i] === 23 && (M.lg[i + w] === J.SEA || M.lg[i + 1] === J.SEA || M.lg[i - 1] === J.SEA)) M.lm[i] = 1; }
  // La Quebrada: acantilado al lado del mar abierto, al oeste
  for (let y = 520; y <= 560; y++) { const x0 = acaWest(y); for (let x = x0; x < x0 + 4; x++) { const i = I(x, y); M.lg[i] = J.CLIFF; M.ld[i] = 8; M.ter[i] = T.IWALL; } }
  // calles que suben de la Costera al resto de México
  for (const sx of [420, 518, 616]) for (let y = 392; y < h; y++) { let stop = false; for (let x = sx; x < sx + 5; x++) { const i = I(x, y); if (y >= ACA.y0 && (B[i] === ACA_B.COST || B[i] === ACA_B.HOT || B[i] === ACA_B.BEACH || B[i] === ACA_B.SEA)) { stop = true; break; } M.lg[i] = x === sx || x === sx + 4 ? J.WALK : J.ROAD; M.lm[i] = 0; M.ter[i] = T.FLOOR; if (y >= ACA.y0) B[i] = 9; } if (stop) break; }
  _mb.apply(this, arguments);
  // ---- se quitan los objetos del Acapulco viejo (hoteles, sombrillas y bandera de la 5.15) para poner la bahía nueva ----
  for (const o of M.objs) if (o.k === 'furn' && !o.hidden && acaIn(o.tx, o.ty) && o.ty >= 436 && o.ty <= 480 && !o.xact) bldHideObj(M, o);
  acaBuild(M); }; }
function acaBuild(M) { const I = M.I, J = LM_G, w = M.w, h = M.h, B = M.acaB, R = new RNG(SEED + 9611);
  const occ = (x, y) => x < 0 || y < 0 || x >= w || y >= h || M.objAt[I(x, y)] >= 0 || SOLID_T[M.ter[I(x, y)]];
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})), Fs = (f, x, y, o) => occ(x, y) ? null : F(f, x, y, null, o);
  const sp = (id, x, y, o) => spawnNPC(id, x * 16 + 8, y * 16 + 8, 'mexico', Object.assign({ face: 'down' }, o || {}));
  const fits = (x, by, wd, dp, b) => { for (let yy = by - dp + 1; yy <= by; yy++) for (let xx = x; xx < x + wd; xx++) { if (occ(xx, yy) || B[I(xx, yy)] !== b) return false; } return true; };
  const bld = (kind, x, by, wd, v) => F('lmb_' + kind + '_' + wd + '_' + v, x, by, jpFp(wd, LM_DEPTH[kind] || 3), { px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jpb: 1, jl: lmBldLights(kind === 'torre' || kind === 'hotelcun' ? kind === 'torre' ? 'torre' : 'casa' : 'casa', wd) });
  const fill = (b, kinds, dp, wmin, wmax, gapP) => { for (let by = h - 2; by > ACA.y0 + dp; by--) { let x = ACA.x0; while (x < ACA.x1) { const wd = R.int(wmin, wmax); if (R.f() < gapP) { x += 2; continue; } if (fits(x, by, wd, dp + 1, b)) { bld(kinds[R.int(0, kinds.length - 1)], x, by, wd, R.int(0, 15)); x += wd + 1; } else x++; } } };
  // hoteles altos entre la Costera y la playa
  LM_DEPTH.hotelcun = LM_DEPTH.hotelcun || 3; fill(ACA_B.HOT, ['torre', 'hotelcun', 'torre'], 3, 5, 7, 0.08);
  // colonias de casitas de colores y cerros con casas sueltas y selva
  fill(ACA_B.CITY, ['mxcasa', 'mxcasa', 'mxcol', 'taqueria', 'depa', 'farmacia'], 3, 4, 6, 0.12);
  for (let y = ACA.y0 + 4; y < 560; y += 2) for (let x = ACA.x0; x <= ACA.x1; x += 2) { const i = I(x, y); if (B[i] !== ACA_B.HILL || occ(x, y)) continue; const r = R.f(); if (r < 0.06 && fits(x, y, 3, 3, ACA_B.HILL)) bld('mxcasa', x, y, 3, R.int(0, 15)); else if (r < 0.42) Fs('lm_arbol', x + (y % 4 ? 1 : 0), y); }
  // la Costera: palmeras y faroles en las banquetas, palmeras en el camellón
  for (let y = ACA.y0; y < h; y++) for (let x = ACA.x0; x <= ACA.x1; x++) { const i = I(x, y); if (B[i] !== ACA_B.COST) continue; const lg = M.lg[i]; if (lg === J.GRASS && (x + y) % 5 === 0) Fs('lm_palmera' + ((x >> 1) % 3), x, y); else if (lg === J.WALK && (x * 3 + y * 7) % 23 === 0) Fs(R.f() < 0.6 ? 'lm_palmera1' : 'lm_farol', x, y, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  // playa: sombrillas, toallas, palapas, tablas de surf y gente
  let nb = 0; for (let y = ACA.y0; y < h; y += 2) for (let x = ACA.x0; x <= ACA.x1; x += 3) { const i = I(x, y); if (M.lg[i] !== 23 || B[i] !== ACA_B.BEACH || M.lm[i] === 1) continue; const r = R.f(); if (r < 0.14) Fs(R.f() < 0.5 ? 'mx_sombrilla_azul' : 'lm_sombrilla' + R.int(0, 3), x, y); else if (r < 0.17) Fs('mx_palapa', x, y); else if (r < 0.18) Fs('lm_tabla', x, y); else if (r < 0.215 && nb < 70) { sp(MX_ACA_NPC[nb % MX_ACA_NPC.length], x, y, { wander: 3 }); nb++; } }
  // letras de colores en la playa
  for (const [f, cx] of [['mx_letras_aca', 462], ['mx_letras_gro', 572]]) { let by = 0; for (let y = 470; y < 560; y++) { if (B[I(cx, y)] === ACA_B.BEACH && B[I(cx, y + 3)] === ACA_B.BEACH) { by = y + 1; break; } } if (by) F(f, cx, by, [[-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], { px: cx * 16 + 8 }); }
  // mar: lanchas, rocas y el yate de paseo
  for (let k = 0; k < 26; k++) { const a = Math.PI * (0.05 + R.f() * 0.9), e = 0.6 + R.f() * 0.35, x = Math.round(ACA.cx - Math.cos(a) * ACA.rx * e), y = Math.round(ACA.cy - Math.sin(a) * ACA.ry * e); if (y < h && M.lg[I(x, y)] === J.SEA) Fs(k % 3 ? 'jp_barca' : 'jp_roca', x, y, { solid: false }); }
  // La Roqueta: árboles y faro
  { const [ix, iy] = ACA.isl; for (let k = 0; k < 18; k++) Fs('lm_arbol', ix + R.int(-6, 6), iy + R.int(-3, 2)); F('mx_faro', ix + 5, iy + 3, [[0, 0]]); sp('mx_lanchero', ix - 3, iy + 4); }
  // La Quebrada: clavadistas y mirador
  for (let k = 0; k < 3; k++) sp('mx_clavadista', acaWest(530 + k * 10) + 5, 530 + k * 10, { face: 'left' }); F('mx_mirador', acaWest(545) + 7, 546, [[0, 0], [1, 0], [2, 0]]);
  // la lancha a La Roqueta y la Capilla de la Paz (cruz en el cerro)
  { let p = null; const x = ACA.cx - 60; for (let y = 470; y < 620 && !p; y++) if (M.lg[I(x, y)] === J.SEA && M.lg[I(x, y - 1)] === 23) p = [x, y - 2]; if (p) { F('jp_barca', p[0], p[1] + 3, [[0, 0]], { solid: false }); sp('mx_lanchero', p[0] - 2, p[1]); ACA.muelle = p; } }
  F('lm_cruz', 640, ACA.y0 + 12, [[0, 0]], { px: 640 * 16 + 8 }); F('mx_bandera', ACA.cx, 488, [[0, 0]], { px: ACA.cx * 16 + 4 });
  // Pie de la Cuesta (oeste) y Puerto Marqués (este): palapas y hamacas frente al mar abierto
  for (let y = 482; y < 630; y += 6) { const xw = acaWest(y) + 2, xe = acaEast(y) - 2; if (M.lg[I(xw, y)] === 23) Fs(y % 12 ? 'mx_palapa' : 'mx_hamaca', xw, y); if (M.lg[I(xe, y)] === 23) Fs(y % 12 ? 'mx_hamaca' : 'mx_palapa', xe, y); }
  for (let k = 0; k < 6; k++) { sp('mx_playa_v', acaWest(500 + k * 20) + 3, 500 + k * 20, { wander: 3 }); sp('mx_playa_v', acaEast(500 + k * 20) - 3, 500 + k * 20, { wander: 3 }); } }
// ---------- decorados ----------
XSPR.mx_palapa = () => { const [c, g] = XC(40, 40); g.fillStyle = '#7a5a30'; g.fillRect(8, 16, 3, 24); g.fillRect(29, 16, 3, 24); g.fillStyle = '#c8a050'; g.beginPath(); g.moveTo(20, 2); g.lineTo(0, 18); g.lineTo(40, 18); g.fill(); g.fillStyle = '#a8803a'; for (let x = 2; x < 40; x += 4) g.fillRect(x, 15 + (x % 8 ? 1 : 0), 2, 4); g.fillStyle = '#e0c070'; g.beginPath(); g.moveTo(20, 2); g.lineTo(14, 18); g.lineTo(20, 18); g.fill(); g.fillStyle = '#f4f0e6'; g.fillRect(12, 30, 16, 2); g.fillStyle = '#3ab8e8'; g.fillRect(13, 26, 4, 4); return { c, ax: 20, ay: 39 }; };
XSPR.mx_hamaca = () => { const [c, g] = XC(44, 26); g.fillStyle = '#7a5a30'; g.fillRect(2, 2, 3, 24); g.fillRect(39, 2, 3, 24); const cols = ['#e83a3a', '#ffd040', '#3ab86a', '#3a8ad8', '#e86ab8']; for (let k = 0; k < 5; k++) { g.strokeStyle = cols[k]; g.lineWidth = 1.4; g.beginPath(); g.moveTo(4, 6 + k * 0.6); g.quadraticCurveTo(22, 22 + k, 40, 6 + k * 0.6); g.stroke(); } return { c, ax: 22, ay: 25 }; };
XSPR.mx_faro = () => { const [c, g] = XC(20, 54); g.fillStyle = '#f4f0e6'; g.beginPath(); g.moveTo(5, 54); g.lineTo(7, 12); g.lineTo(13, 12); g.lineTo(15, 54); g.fill(); g.fillStyle = '#c81e2a'; for (const y of [20, 34, 46]) g.fillRect(6, y, 8, 4); g.fillStyle = '#2a2a30'; g.fillRect(6, 6, 8, 6); g.fillStyle = '#ffe080'; g.fillRect(8, 7, 4, 4); g.fillStyle = '#c81e2a'; g.fillRect(5, 3, 10, 3); return { c, ax: 10, ay: 53 }; };
XSPR.mx_mirador = () => { const [c, g] = XC(48, 24); g.fillStyle = '#c8c0b0'; g.fillRect(0, 14, 48, 10); g.fillStyle = '#8a8478'; g.fillRect(0, 22, 48, 2); g.fillStyle = '#f4f0e6'; g.fillRect(0, 6, 48, 2); for (let x = 1; x < 48; x += 6) g.fillRect(x, 6, 2, 9); return { c, ax: 24, ay: 23 }; };
function mxLetras(txt) { const L = txt.length, W = L * 15 + 6, [c, g] = XC(W, 30), cols = ['#e83a5a', '#ffb020', '#3ac8e8', '#7ad84a', '#b85ad8', '#ff6a2a', '#2a8ad8', '#ffd040'];
  for (let k = 0; k < L; k++) { const x = 3 + k * 15; g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x + 2, 6, 14, 22); g.fillStyle = cols[k % cols.length]; g.fillRect(x, 4, 13, 22); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x, 4, 13, 3); jpText(g, txt[k], x + 2, 9, '#ffffff', 10, false, 1); }
  g.fillStyle = '#d8c8a0'; g.fillRect(0, 26, W, 4); const [c2, g2] = XC(W * 2, 60); g2.imageSmoothingEnabled = false; g2.drawImage(c, 0, 0, W * 2, 60); return { c: c2, ax: W, ay: 59 }; }
XSPR.mx_letras_aca = () => mxLetras('ACAPULCO'); XSPR.mx_letras_gro = () => mxLetras('GUERRERO');
// ---------- gente de la playa, lanchero y comida nueva ----------
CMD.mx_coco = p => { p.ball(8, 9, 6, 5.5, pal(['#2a5a1a', '#4a8a2a', '#6ab83a', '#a8e070'])); p.ball(8, 5, 3, 1.2, pal(['#f4f0e0', '#ffffff'])); p.line(10, 0, 9, 5, C('#ff5a8a')); };
CMD.mx_coctel = p => { cmCup(p, '#e8f4f8', '#c8e8f0'); p.rect(5, 7, 7, 6, C('#e86a3a')); for (const [x, y] of [[6, 8], [9, 10], [7, 11]]) p.set(x, y, C('#ffb090')); p.set(10, 7, C('#3aa84a')); p.ball(12, 4, 1.6, 1.6, pal(['#8ac83a', '#c8f070'])); };
it('mx_coco', { n: L2('Agua de coco', 'Coconut water'), t: 'cons', stack: true, heal: 2500, mana: 1200, price: 400, icon: ['comida', 'mx_coco'], rar: 1, d: L2('Coco frío abierto con machete en la playa de Acapulco. Cura vida y maná.', 'Cold coconut opened with a machete on Acapulco beach. Heals HP and mana.') });
it('mx_coctel', { n: L2('Cóctel de camarón', 'Shrimp cocktail'), t: 'cons', stack: true, heal: 5500, price: 1000, icon: ['comida', 'mx_coctel'], rar: 1, d: L2('Camarones con salsa, limón y aguacate, en vaso. Cura 5.500 de vida.', 'Shrimp with sauce, lime and avocado, in a glass. Heals 5,500 HP.') });
UI_ICONS.push('comida:mx_coco', 'comida:mx_coctel');
NPCS.mx_playa_v = { n: L2('Vendedor de playa', 'Beach seller'), title: 'Acapulco', look: LK({ g: 'm' }), lines: [L2('¡Cocos fríos, coctelitos de camarón! ¡Pásele, güero!', 'Cold coconuts, shrimp cocktails! Come on over!')], quests: [], hat: 'paja' }; MX_NPC_LOOK.mx_playa_v = 2; PE_SELL.mx_playa_v = ['mx_coco', 'mx_coctel', 'mx_elote', 'mx_horchata'];
NPCS.mx_lanchero = { n: L2('Lanchero', 'Boatman'), title: L2('Paseo a La Roqueta', 'Trip to La Roqueta'), look: LK({ g: 'm' }), lines: [L2('¡Lancha con fondo de cristal a La Roqueta! Se ven los peces y la Virgen de los Mares.', 'Glass-bottom boat to La Roqueta! You can see the fish and the underwater Virgin.')], quests: [], hat: 'gorra' }; MX_NPC_LOOK.mx_lanchero = 5;
const MX_ACA_NPC = []; for (let n = 1; n <= 30; n++) { const id = 'mx_aca' + n, [g] = MX_LOOKS[(n * 7) % MX_LOOKS.length]; NPCS[id] = { n: g === 'f' ? L2('Turista', 'Tourist') : L2('Bañista', 'Swimmer'), title: 'Acapulco', look: LK({ g: g === 'f' ? 'f' : 'm' }), lines: [[L2('¡Qué rico está el agua! Calientita todo el año.', 'The water is lovely! Warm all year round.'), L2('Al atardecer los clavadistas saltan en La Quebrada. ¡No te lo pierdas!', 'At sunset the divers jump at La Quebrada. Do not miss it!'), L2('La Costera va de punta a punta de la bahía. Puros hoteles y palmeras.', 'The Costera runs from end to end of the bay. All hotels and palm trees.'), L2('Toma la lancha a La Roqueta, es una islita con un faro.', 'Take the boat to La Roqueta, a little island with a lighthouse.'), L2('Vine desde la Ciudad de México en autobús, cinco horas.', 'I came from Mexico City by bus, five hours.')][n % 5]], quests: [], hat: n % 3 ? null : 'paja' }; MX_NPC_LOOK[id] = (n * 7) % MX_LOOKS.length; MX_ACA_NPC.push(id); }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'mx_lanchero') return; const P = G.P, onIsl = P.y / 16 > ACA.isl[1] - 10;
  opts.unshift({ label: onIsl ? L2('⛵ Volver a la playa (gratis)', '⛵ Back to the beach (free)') : L2('⛵ Lancha a La Roqueta (150 de oro)', '⛵ Boat to La Roqueta (150 gold)'), fn: () => { if (!onIsl) { if (P.gold < 150) { toast(L2('No te alcanza el oro.', 'Not enough gold.'), 'bad'); return; } P.gold -= 150; } const [x, y] = onIsl ? (ACA.muelle || [ACA.cx - 60, 540]) : [ACA.isl[0] - 2, ACA.isl[1] + 2]; closeModal(); P.x = x * 16 + 8; P.y = y * 16 + 8; toast('⛵ ' + (onIsl ? L2('De vuelta en la playa.', 'Back on the beach.') : L2('Llegaste a La Roqueta.', 'You reached La Roqueta.')), 'quest'); } }); });
// ---------- zonas, estado y mapa ----------
{ const z = MX_ZONES.find(z => z.k === 'acapulco'); if (z) { z.t = (x, y) => acaIn(x, y); z.s = L2('La bahía, la Costera y los cerros', 'The bay, the Costera and the hills'); }
  const ix = MX_ZONES.indexOf(z); MX_ZONES.splice(ix, 0,
    { k: 'roqueta', n: L2('Isla La Roqueta', 'La Roqueta Island'), s: 'Acapulco', t: (x, y) => Math.hypot((x - ACA.isl[0]) / 16, (y - ACA.isl[1]) / 10) < 1 },
    { k: 'quebrada', n: 'La Quebrada', s: L2('Acapulco · clavadistas', 'Acapulco · cliff divers'), t: (x, y) => y >= 505 && y <= 575 && x >= ACA.x0 - 4 && x < ACA.x0 + 26 },
    { k: 'piecuesta', n: 'Pie de la Cuesta', s: L2('Acapulco · palapas y atardeceres', 'Acapulco · palm huts and sunsets'), t: (x, y) => y > 575 && x >= ACA.x0 - 4 && x < ACA.x0 + 30 },
    { k: 'pmarques', n: L2('Puerto Marqués', 'Puerto Marqués'), s: 'Acapulco', t: (x, y) => y > 500 && x > ACA.x1 - 34 && x <= ACA.x1 + 4 },
    { k: 'costera', n: L2('Costera de Acapulco', 'Acapulco Costera'), s: L2('Hoteles, palmeras y playa', 'Hotels, palm trees and beach'), t: (x, y) => acaIn(x, y) && acaE(x, y) >= 1 && acaE(x, y) < 1.125 },
    { k: 'bahia', n: L2('Bahía de Acapulco', 'Acapulco Bay'), s: 'Guerrero', t: (x, y) => acaIn(x, y) && acaE(x, y) < 1 }); }
{ const g = MX_ST.find(s => s.k === 'guerrero'); if (g) { const t0 = g.t; g.t = (x, y) => t0(x, y) || acaIn(x, y); g.n = L2('Guerrero · Taxco y Acapulco', 'Guerrero · Taxco and Acapulco'); } }
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (M && M.id === 'mexico') { for (const o of out) if (o.x === 336 && o.y === 450) { o.x = ACA.x0 + 6; o.y = 540; }
  out.push({ c: 'pesight', x: ACA.cx, y: 505, t: L2('Bahía de Acapulco · letras de colores', 'Acapulco Bay · colourful letters') }, { c: 'pefun', x: ACA.isl[0], y: ACA.isl[1], t: L2('Isla La Roqueta (lancha 150 de oro)', 'La Roqueta Island (boat, 150 gold)') }, { c: 'pesight', x: ACA.x0 + 10, y: 600, t: 'Pie de la Cuesta' }, { c: 'pesight', x: ACA.x1 - 10, y: 560, t: L2('Puerto Marqués', 'Puerto Marqués') }, { c: 'pesight', x: 640, y: ACA.y0 + 12, t: L2('Capilla de la Paz (cruz del cerro)', 'Chapel of Peace (hill cross)') }); } return out; }; }
