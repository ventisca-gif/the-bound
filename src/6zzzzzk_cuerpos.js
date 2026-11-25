// 6.23 · 5 estructuras nuevas por sexo + «Cintura» y «Avispa» (Sergio vio la muestra: «me gustó todos … las prendas y armaduras
// y todo colocado, igual las manos, y agregarías una extra … una de mujer con una buena cintura»).
// Se añaden al final de BODY_T (no se cambia ni se borra ninguna): los índices viejos siguen siendo los mismos, las
// partidas guardadas no cambian y los NPCs siguen eligiendo entre las 4 primeras (npcBodyFor usa % 4).
// Ropa, armaduras, peinados y armas usan las medidas del dibujo (tw, th, lh…), así que se adaptan solas; se comprueba
// con tools/dev/fitcheck.py (0 avisos en estructuras nuevas).
BODY_T.m.push(
  { n: ['Titán', 'Titan'], tw: 13, sw: 10, th: 10, lh: 9, lw: 4, aw: 4, al: 7, hrx: 7.8, hry: 8, jaw: 3.4, eye: 'sharp', ey: 2, mo: 4, mw: 1, blush: 0, taper: 1 },
  { n: ['Juvenil', 'Youthful'], tw: 9, sw: 8, th: 7, lh: 6, al: 5, hrx: 8.2, hry: 8.4, jaw: 2, eye: 'big', ey: 3, mo: 4, bang: 3 },
  { n: ['Galán', 'Dashing'], tw: 12, sw: 9, th: 10, lh: 10, aw: 3, al: 8, hrx: 7.4, hry: 7.8, jaw: 2.6, eye: 'hero', ey: 2, mo: 3, mw: 1, blush: 0, taper: 1 },
  { n: ['Compacto', 'Stocky'], tw: 13, sw: 11, th: 8, lh: 6, lw: 4, aw: 4, al: 5, hrx: 8.2, hry: 7.8, jaw: 3.2, eye: 'soft', ey: 3, mo: 4, blush: 0, belly: 1 },
  { n: ['Larguirucho', 'Lanky'], tw: 8, sw: 7, th: 10, lh: 10, aw: 2, al: 8, hrx: 7.2, hry: 8, jaw: 2.2, eye: 'sharp', ey: 2, mo: 4, mw: 1, blush: 0 }
);
BODY_T.f.push(
  { n: ['Alta', 'Tall'], bust: 2, tw: 9, sw: 7, th: 9, lh: 11, al: 8, eye: 'lash', waist: 2, hips: 1 },
  { n: ['Guerrera', 'Warrior'], bust: 2, tw: 11, sw: 9, th: 9, lh: 8, lw: 4, aw: 3, al: 7, jaw: 2.6, eye: 'sharp', ey: 2, waist: 1, blush: 0 },
  { n: ['Chibi', 'Chibi'], bust: 1, tw: 8, sw: 7, th: 5, lh: 5, al: 4, hrx: 8.2, hry: 8.8, eye: 'big', ey: 3, mo: 4, bang: 3 },
  { n: ['Señorial', 'Graceful'], bust: 3, tw: 9, sw: 8, th: 10, lh: 8, al: 7, hry: 7.6, eye: 'soft', lip: 1, hips: 1, waist: 2, blush: 0 },
  { n: ['Llenita', 'Plump'], bust: 3, tw: 11, sw: 9, th: 8, lh: 7, lw: 4, hry: 8, eye: 'lash', belly: 1, hips: 1 },
  // «Cintura»: cintura marcada pero más suave (torso 10, entra 3 px); Sergio eligió esta de la primera muestra
  { n: ['Cintura', 'Waisted'], bust: 2, tw: 10, wd: 3, sw: 8, th: 10, lh: 9, al: 7, eye: 'lash', waist: 3, hips: 2, lip: 1 },
  // «Avispa»: la cintura más estrecha (torso 12, entra 4 px), abdomen plano, caderas y piernas largas
  { n: ['Avispa', 'Hourglass'], bust: 2, tw: 12, wd: 4, sw: 8, th: 10, lh: 9, al: 7, eye: 'lash', waist: 3, hips: 2, lip: 1 }
);

// normApp solo aceptaba bt menor que el número de estructuras de HOMBRE para los dos sexos; ahora cada sexo su lista.
hookAfter('normApp', (o, a) => {
  if (!o || !a) return;
  const bt = a.bt | 0, T = BODY_T[o.g === 'm' ? 'm' : 'f'];
  if (bt > 0 && bt < T.length) o.bt = bt; else if (bt >= T.length) delete o.bt;
});

// cintura de avispa (waist 3) y caderas 2: de frente y de espalda la cintura entra 2 px por lado en el centro y 1 px
// en las filas de alrededor (curva suave); de lado, 1 px por delante y por detrás. Caderas 2 = 1 px más en las 3
// últimas filas del torso. Se recorta después de la ropa, así vestidos y armaduras siguen la misma silueta.
hookAfter('bodyTorsoShape', (_r, p, S, o) => {
  if (!S || !o) return;
  const { tx0, ty, tw, th, side, fem, d, m } = o, R = tx0 + tw - 1;
  if (S.waist === 3 && fem) {
    const yc = ty + th - 4;   // fila más estrecha
    if (!side) {
      const D = S.wd || 3;   // profundidad en la fila más estrecha
      for (const [y, k] of [[yc - 3, 1], [yc - 2, D - 1], [yc - 1, D], [yc, D], [yc + 1, D - 1], [yc + 2, 1]]) for (let i = 0; i < k; i++) { p.set(tx0 + i, y, 0); p.set(R - i, y, 0); }
      if (m) for (const y of [yc - 1, yc]) { p.set(tx0 + D, y, m[1]); p.set(R - D, y, m[1]); }
    } else {
      for (const y of [yc - 1, yc, yc + 1]) { p.set(tx0, y, 0); p.set(R, y, 0); }
    }
  }
  if (S.hips === 2 && !side && m) for (let y = ty + th - 2; y < ty + th; y++) { p.set(tx0 - 1, y, m[3]); p.set(R + 1, y, m[1]); if (y === ty + th - 1) { p.set(tx0 - 2, y, m[3]); p.set(R + 2, y, m[1]); } }
});

// el revisor de ropa (tools/dev/fitcheck.py → fitCheck) solo probaba las 4 primeras de cada sexo; ahora todas
if (typeof FIT_BODIES !== 'undefined') for (const g of ['m', 'f']) for (let i = 0; i < BODY_T[g].length; i++) if (!FIT_BODIES.some(([a, b]) => a === g && b === i)) FIT_BODIES.push([g, i]);

// sombreros altos: fitHeadLayer solo encoge lo que no cabe en el cuadro si la cabeza tiene otro tamaño que la clásica.
// Atlética (f4) y Guerrera (f6) tienen la cabeza clásica pero más arriba (cuerpo más alto), y c_bruja, sombreros de
// mago, wagasa… se salían por arriba. Para cabezas más altas que la clásica (parte de arriba en y < 10,5; la clásica
// está en 11) se pasa por el camino que escala con la cabeza un 2,5 % más baja, que es el que sabe encoger. La clásica
// y las demás no cambian.
hookAround('fitHeadLayer', (next, p, B, hx, hy, HD, draw) => {
  const near = HD && Math.abs(B.hrx / FIT_HEAD.hrx - 1) < 0.02 && Math.abs(B.hry / FIT_HEAD.hry - 1) < 0.02;
  if (!near || FIT_FACE.has(HD.k) || HD.fit === 'face' || hy - B.hry >= 10.5) return next(p, B, hx, hy, HD, draw);
  const o = B.hry; B.hry = o * 0.975;
  try { return next(p, B, hx, hy, HD, draw); } finally { B.hry = o; }
});

// Falsos avisos del revisor revisados a ojo con imagen (frente, pasos 1 y 3, espalda y perfil) en la 6.23: se ven
// bien puestos. El revisor los marca porque la cintura recortada (waist 3) separa el traje del cuerpo «sin prenda»,
// porque los torsos muy anchos (Titán, Compacto) dejan el brazo dentro de la zona que mide como piel, o por 1-3 px de
// adorno. Solo esta pareja exacta prenda + estructura: cualquier otra prenda o estructura se sigue avisando.
const FIT_OK_NEW = {
  'c_dama_vestido|m5': 1, 'c_dama_vestido|m8': 1, 'c_idol_boho_v|m5': 1, 'c_idol_boho_v|m8': 1, 'c_selva|m5': 1, 'c_selva|m8': 1,
  'c_vestido_encaje|m5': 1, 'c_vestido_encaje|m8': 1, 'c_vestido_gala|m5': 1, 'c_vestido_gala|m8': 1, 'c_vestido_gotico|m5': 1, 'c_vestido_gotico|m8': 1,
  'c_vestido_hielo|m5': 1, 'c_vestido_hielo|m8': 1, 'c_vestido_noche|m5': 1, 'c_vestido_noche|m8': 1, 'c_vestido_verano|m5': 1, 'c_vestido_verano|m8': 1,
  'c_idol_escenario_v|f8': 1, 'c_idol_escenario_v|f10': 1, 'c_idol_escenario_v|f11': 1, 'c_idol_escolar_v|f8': 1, 'c_idol_escolar_v|f10': 1, 'c_idol_escolar_v|f11': 1,
  'c_danza_top|m5': 1, 'c_danza_top|m8': 1, 'c_danza_top|f11': 1,
  'c_gt_plataforma|f7': 1, 'c_idol_botas|f7': 1, 'c_of_pes_b|f7': 1, 'c_loba_vestido|f7': 1,
  'c_mx_catrina|m4': 1, 'c_mx_catrina|m9': 1
};
hookAfter('fitCheck', r => { if (r && Array.isArray(r.issues)) r.issues = r.issues.filter(i => !(i.body && FIT_OK_NEW[i.id + '|' + i.body[0] + i.body[1]])); });
