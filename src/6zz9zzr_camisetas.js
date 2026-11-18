// ================= v5.16: CAMISETAS DE ESPAÑA Y MÉXICO, BOTARGA DEL DOCTOR BONACHÓN =================
// Diseños propios (sin escudos ni marcas oficiales). 'jersey': cuello, ribete en los hombros, franja en el pecho,
// escudito de colores y número en la espalda; se ajusta a las 4 estructuras con los anclajes de fitKind.
fitKind('body', 'jersey', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, b = s.b, k = s.c || [];
  const put = (x, y, c) => { if (x >= tx0 && x <= R && uA(p.get(x, y))) p.set(x, y, c); };
  // cuello y ribete de hombros
  for (let x = tx0; x <= R; x++) put(x, ty, b[2]); if (!side) { put(tx0, ty + 1, b[3]); put(R, ty + 1, b[3]); } else put(d > 0 ? R : tx0, ty + 1, b[3]);
  if (!up && !side) { put(cx - 1, ty + 1, b[1]); put(cx, ty + 1, b[1]); }
  // franja horizontal (España) o greca (México)
  if (s.band) { const y0 = ty + Math.round(th * 0.45); for (let y = y0; y < y0 + 2; y++) for (let x = tx0; x <= R; x++) put(x, y, s.band[y === y0 ? 3 : 2]); }
  if (s.greca) { const y0 = ty + Math.round(th * 0.6); for (let x = tx0; x <= R; x++) { put(x, y0, s.greca[2]); if ((x - tx0) % 3 === 1) put(x, y0 - 1, s.greca[3]); } }
  // escudito de colores a la izquierda del pecho
  if (!up && !side && k.length) { const x = R - 2, y = ty + 2; put(x - 1, y, k[0]); put(x, y, k[1]); put(x - 1, y + 1, k[2]); put(x, y + 1, k[0]); }
  // número en la espalda
  if (up) { const y = ty + 2, x = cx - 2; for (const [dx, dy] of [[0, 0], [0, 1], [0, 2], [2, 0], [3, 0], [2, 1], [3, 1], [2, 2], [3, 2]]) put(x + dx, y + dy, b[3]); } });
const CAMIS = [['c_es_camiseta', L2('Camiseta de España (roja)', 'Spain shirt (red)'), () => ({ k: 'jersey', m: CLOTH.rojo, s: CLOTH.rojo, b: CLOTH.amarillo, band: CLOTH.amarillo, c: [C('#c81e2a'), C('#ffd040'), C('#2a5ad8')] }), 2500, L2('Tienda del estadio (España)', 'Stadium shop (Spain)')],
  ['c_es_camiseta_azul', L2('Camiseta de España (visitante)', 'Spain shirt (away)'), () => ({ k: 'jersey', m: CLOTH.marino, s: CLOTH.marino, b: CLOTH.rojo, band: CLOTH.amarillo, c: [C('#c81e2a'), C('#ffd040'), C('#ffffff')] }), 2500, L2('Tienda del estadio (España)', 'Stadium shop (Spain)')],
  ['c_mx_camiseta', L2('Camiseta de México (verde)', 'Mexico shirt (green)'), () => ({ k: 'jersey', m: CLOTH.verde, s: CLOTH.verde, b: CLOTH.blanco, greca: CLOTH.oliva, c: [C('#1a7a3a'), C('#ffffff'), C('#c81e2a')] }), 2500, L2('Mercado de Acapulco y Zócalo (México)', 'Acapulco market and Zócalo (Mexico)')],
  ['c_mx_camiseta_blanca', L2('Camiseta de México (blanca)', 'Mexico shirt (white)'), () => ({ k: 'jersey', m: CLOTH.blanco, s: CLOTH.blanco, b: CLOTH.verde, greca: CLOTH.rojo, c: [C('#1a7a3a'), C('#ffffff'), C('#c81e2a')] }), 2500, L2('Mercado de Acapulco y Zócalo (México)', 'Acapulco market and Zócalo (Mexico)')]];
for (const [id, n, vis, price, src] of CAMIS) { cosm(id, n, 'body', vis, { src }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 3, d: L2('Camiseta de fútbol. Solo cambia el aspecto.', 'Football shirt. Appearance only.') }); COS_SHOP.push(id); }
// ---------- botarga del Doctor Bonachón: cabezota con canas, gafas y un bigotón ----------
fitKind('head', 'mx_botarga', (p, A, s) => { const { hx, hy, hrx, hry, side, up, d } = A, sk = pal(['#a86a48', '#d8946a', '#f0b48a', '#ffd0a8']), hw = pal(['#9a9aa4', '#c8c8d0', '#e8e8f0', '#ffffff']);
  const rx = hrx + 2.5, ry = hry + 2.5, cy = hy, top = Math.round(cy - ry);
  p.ball(hx + (side ? d * 0.5 : 0), cy, rx, ry, sk);
  // canas a los lados y atrás (calvo arriba)
  if (up) { p.ball(hx, cy + 1, rx, ry - 1, hw); p.ball(hx, top + 3, rx - 3, 3, sk); return; }
  const sides = side ? [-d] : [-1, 1]; for (const sg of sides) { p.ball(hx + sg * (rx - 1.5), cy + 1, 2.5, ry * 0.6, hw); }
  // orejas
  if (!side) for (const sg of [-1, 1]) p.ball(hx + sg * (rx + 0.5), cy + 1, 1.2, 2, sk);
  // gafas, cejas y ojitos
  const ey = Math.round(cy - 1), ex = side ? [Math.round(hx + d * 4 - (d < 0 ? 1 : 0))] : [Math.round(hx - 4), Math.round(hx + 3)];
  for (const x of ex) { p.ball(x + 0.5, ey + 0.5, 2.6, 2.4, [C('#3a2a1e'), C('#c8e8f8'), C('#e8f8ff')]); p.rect(x, ey, 2, 2, C('#2a1a12')); p.set(x, ey, C('#ffffff')); p.hl(x - 2, ey - 3, 5, hw[1]); }
  if (!side) p.hl(ex[0] + 3, ey, ex[1] - ex[0] - 3, C('#3a2a1e'));
  // nariz y el bigotón canoso
  const nx = side ? Math.round(hx + d * (rx - 0.5)) : Math.round(hx - 0.5); p.ball(nx + 0.5, ey + 3, 1.6, 1.4, [sk[1], sk[2]]);
  const my = ey + 5; if (side) { for (let k = 0; k < 6; k++) p.vl(Math.round(hx + d * (2 + k * 0.9)), my - (k > 3 ? 1 : 0), 2 + (k < 4 ? 1 : 0), hw[k % 2 ? 2 : 1]); }
  else { for (let k = -5; k <= 5; k++) { const yy = my + (Math.abs(k) > 3 ? 1 : 0); p.vl(Math.round(hx - 0.5 + k), yy, 2 + (Math.abs(k) < 4 ? 1 : 0), hw[(k + 5) % 3 === 0 ? 1 : 2]); } p.hl(Math.round(hx - 2.5), my + 3, 5, C('#a83a3a')); }
  // brillo en la calva
  p.hl(Math.round(hx - 2), top + 1, 3, sk[3]); }, { face: true });
cosm('c_mx_botarga', L2('Botarga del Doctor Bonachón (cabezota con bigotón)', 'Doctor Bonachón mascot head (big head and moustache)'), 'head', () => ({ k: 'mx_botarga', m: CLOTH.blanco }), { src: L2('Farmacias del Doctor Bonachón (México)', 'Doctor Bonachón pharmacies (Mexico)') });
it('cosi_c_mx_botarga', { n: COSM.c_mx_botarga.n, t: 'cos', cos: 'c_mx_botarga', price: 4000, icon: ['hanger'], rar: 4, d: L2('La cabeza gigante de la mascota que baila en la puerta de las farmacias. Combínala con la bata para ir de botarga completa. Solo cambia el aspecto.', 'The giant head of the mascot that dances at pharmacy doors. Wear it with the coat for the full costume. Appearance only.') }); COS_SHOP.push('c_mx_botarga');
PE_SELL.mx_farmaceutica = ['cosi_c_mx_botarga'].concat(PE_SELL.mx_farmaceutica || []);
PE_SELL.mx_playa_v = (PE_SELL.mx_playa_v || []).concat(['cosi_c_mx_camiseta', 'cosi_c_mx_camiseta_blanca']);
if (PE_SELL.mx_puesto) PE_SELL.mx_puesto = PE_SELL.mx_puesto.concat(['cosi_c_mx_camiseta', 'cosi_c_mx_camiseta_blanca']);
