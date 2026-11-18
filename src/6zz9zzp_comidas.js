// ================= v5.16: ICONOS PROPIOS DE LAS COMIDAS DE PERÚ, MÉXICO, JAPÓN Y ESPAÑA =================
// Antes muchas salían como pociones o gotas en el inventario. genIcon(['comida', id]) dibuja cada plato a 16×16.
const CMD = {};
const cmPlate = (p, y = 11, w = 6.5) => { p.ball(8, y, w, 2.6, pal(['#8a8a90', '#c8c8d0', '#f0f0f4', '#ffffff'])); };
const cmBowl = (p, col) => { p.ball(8, 9, 6.5, 2, pal(col)); for (let y = 10; y < 15; y++) { const h = Math.round(6.5 - (y - 10) * 0.9); p.hl(8 - h, y, h * 2 + 1, C(y < 12 ? '#e8e4dc' : '#c0bcb4')); } p.hl(5, 14, 7, C('#9a968e')); };
const cmCup = (p, body, top) => { for (let y = 5; y < 15; y++) { const h = Math.round(4.5 - (y - 5) * 0.18); p.hl(8 - h, y, h * 2 + 1, C(body)); } p.hl(4, 5, 9, C(top)); p.hl(5, 4, 7, C(top)); p.vl(5, 7, 6, C('#ffffff')); };
const cmMug = (p, body, drink) => { p.rect(3, 5, 9, 10, C(body)); p.rect(4, 5, 7, 2, C(drink)); p.vl(4, 7, 7, C('#ffffff')); p.vl(14, 8, 4, C(body)); p.set(13, 7, C(body)); p.set(13, 12, C(body)); for (const x of [6, 9]) { p.set(x, 2, C('#e8e8f0')); p.set(x + 1, 1, C('#e8e8f0')); p.set(x, 0, C('#e8e8f0')); } };
const cmBot = (p, glass, liq, cap) => { p.rect(6, 1, 4, 2, C(cap)); p.rect(6, 3, 4, 3, C(glass)); for (let y = 6; y < 15; y++) p.hl(4, y, 8, C(y < 8 ? glass : liq)); p.hl(4, 9, 8, C('#c81e2a')); p.hl(4, 10, 8, C('#ffffff')); p.vl(5, 6, 9, C('#ffffff')); };
// ---- Perú ----
CMD.pe_emoliente = p => { cmCup(p, '#e8e4dc', '#3a8a4a'); p.hl(5, 7, 7, C('#3a8a4a')); p.ball(8, 10, 2, 2, pal(['#2a6a3a', '#4aa85a', '#8ad87a'])); };
CMD.pe_helado = p => { p.poly([[5, 8], [11, 8], [8, 15]], C('#c8903a')); for (let y = 9; y < 14; y += 2) p.hl(6, y, 5, C('#a8702a')); p.ball(8, 6, 4, 3.5, pal(['#a86a20', '#d89040', '#f0b860', '#ffe0a0'])); p.ball(8, 3, 2.5, 2, pal(['#a86a20', '#e8a050', '#ffd090'])); };
CMD.pe_chicharron = p => { p.ball(8, 6, 6.5, 3.5, pal(['#a8702a', '#d8a050', '#f0c880', '#fff0c8'])); p.hl(2, 9, 13, C('#c87a3a')); p.hl(2, 10, 13, C('#e8903a')); p.hl(3, 11, 11, C('#3aa84a')); p.ball(8, 12.5, 6, 2, pal(['#a8702a', '#d8a050', '#f0c880'])); for (const x of [4, 8, 12]) p.set(x, 9, C('#8a4a1a')); };
CMD.pe_alfajor = p => { p.ball(8, 10, 6, 2.5, pal(['#c8a070', '#e8c898', '#f8e8c8'])); p.hl(2, 8, 13, C('#a8602a')); p.ball(8, 6.5, 6, 2.5, pal(['#c8a070', '#f0e8d8', '#ffffff', '#ffffff'])); for (const [x, y] of [[5, 5], [9, 6], [11, 5], [7, 7]]) p.set(x, y, C('#ffffff')); };
CMD.pe_cafe = p => { cmMug(p, '#e8e4dc', '#5a3418'); p.rect(5, 9, 5, 3, C('#c87a3a')); };
CMD.pe_pollo = p => { cmPlate(p, 12); p.ball(6, 8, 4.5, 3.5, pal(['#7a3a10', '#b8601e', '#e08a3a', '#f8c070'])); p.line(9, 7, 12, 5, C('#f4ecd8')); p.ball(12.5, 4.5, 1.4, 1.2, [C('#f4ecd8'), C('#ffffff')]); for (let k = 0; k < 4; k++) p.rect(9 + k, 9 + (k % 2), 1, 3, C('#ffd860')); };
CMD.pe_chaufa = p => { cmPlate(p, 12); p.ball(8, 9, 5.5, 3.5, pal(['#a8702a', '#d8a040', '#f0c868', '#fff0b0'])); for (const [x, y, c] of [[6, 8, '#3aa84a'], [9, 7, '#ffd040'], [10, 10, '#3aa84a'], [5, 10, '#c86a3a'], [8, 11, '#ffd040']]) p.set(x, y, C(c)); };
CMD.pe_wantan = p => { cmBowl(p, ['#a87a30', '#e8c870', '#f8e8a8', '#fffbe0']); p.ball(6, 8.5, 2, 1.4, pal(['#d8b880', '#f8e8c0'])); p.ball(10, 9, 2, 1.4, pal(['#d8b880', '#f8e8c0'])); p.set(8, 8, C('#3aa84a')); p.set(11, 8, C('#3aa84a')); };
CMD.pe_gaseosa = p => cmBot(p, '#e8f0f0', '#ffd040', '#3a5ad8');
CMD.pe_pan = p => { p.ball(8, 9, 6.5, 4, pal(['#a8682a', '#d8984a', '#f0c070', '#ffe8b0'])); p.line(5, 6, 6, 11, C('#a8682a')); p.line(10, 6, 11, 11, C('#a8682a')); };
// ---- México ----
CMD.mx_tacos = p => { cmPlate(p, 13); for (const [x, y] of [[5, 9], [11, 9]]) { p.ball(x, y, 3.8, 3, pal(['#a8803a', '#e8c870', '#f8e8a8'])); p.hl(x - 3, y - 2, 7, C('#c8602a')); p.set(x - 1, y - 3, C('#ffd040')); p.set(x + 1, y - 3, C('#3aa84a')); p.set(x, y - 2, C('#ffffff')); } };
CMD.mx_tamal = p => { p.poly([[2, 13], [8, 3], [14, 13]], C('#d8c890')); p.poly([[4, 13], [8, 5], [12, 13]], C('#e8d8a0')); p.ball(8, 10, 3, 3, pal(['#c8a050', '#f0d070', '#fff0a0'])); p.line(2, 13, 14, 13, C('#a89860')); p.line(8, 3, 8, 6, C('#a89860')); };
CMD.mx_elote = p => { p.line(3, 14, 6, 11, C('#c8a878')); for (let k = 0; k < 7; k++) p.ball(7 + k * 0.9, 10 - k * 1.1, 2.6, 2.6, pal(['#c89a20', '#f0c830', '#ffe060', '#fff8c0'])); for (let k = 0; k < 5; k++) p.set(7 + k, 10 - k, C('#ffffff')); p.line(8, 5, 13, 2, C('#ff5a2a')); p.set(9, 9, C('#c81e2a')); p.set(11, 6, C('#c81e2a')); };
CMD.mx_churros = p => { p.rect(4, 8, 8, 7, C('#e8e4dc')); p.hl(4, 8, 8, C('#c81e2a')); for (const [x, t] of [[5, 2], [7, 0], [9, 1], [11, 3]]) { for (let y = t; y < 9; y++) p.hl(x - 1, y, 2, C(y % 2 ? '#c8803a' : '#e8a050')); p.set(x, t, C('#fff0c0')); } };
CMD.mx_horchata = p => { cmCup(p, '#f4ecd8', '#e8e0c8'); p.line(10, 1, 9, 6, C('#3ab8e8')); for (const [x, y] of [[6, 9], [9, 11], [7, 12]]) p.set(x, y, C('#c8a070')); };
CMD.mx_pozole = p => { cmBowl(p, ['#7a1a0a', '#b83a1a', '#d8602a', '#f08a4a']); for (const [x, y] of [[5, 8], [8, 9], [11, 8], [7, 7], [10, 10]]) p.set(x, y, C('#fff8e0')); p.set(9, 7, C('#3aa84a')); p.set(6, 9, C('#3aa84a')); };
CMD.mx_mole = p => { cmPlate(p, 12); p.ball(8, 10, 5, 2.6, pal(['#2a0e06', '#4a1a0a', '#6a2a14', '#8a4a2a'])); p.ball(8, 9, 2.6, 1.6, pal(['#c8a070', '#e8c898'])); for (const [x, y] of [[5, 9], [11, 10], [9, 11]]) p.set(x, y, C('#ffffff')); };
CMD.mx_chiles = p => { cmPlate(p, 12); for (const x of [5, 11]) { p.ball(x, 9, 3, 2.2, pal(['#1a4a1a', '#2a7a2a', '#4aa84a', '#8ad87a'])); p.vl(x, 5, 3, C('#5a7a2a')); } p.ball(8, 10, 2.4, 1.6, pal(['#e8e0d0', '#ffffff'])); p.set(8, 9, C('#c81e2a')); };
// ---- Japón ----
CMD.jp_onigiri = p => { p.poly([[2, 13], [8, 3], [14, 13]], C('#ffffff')); p.poly([[3, 13], [8, 5], [13, 13]], C('#f4f4f0')); p.rect(5, 9, 6, 5, C('#1a2a1a')); p.hl(5, 9, 6, C('#2a4a2a')); };
CMD.jp_takoyaki = p => { p.rect(2, 10, 12, 4, C('#e8d8b0')); for (const x of [4, 8, 12]) { p.ball(x, 9, 2.4, 2.4, pal(['#8a4a1a', '#c8803a', '#e8a860'])); p.hl(x - 1, 8, 3, C('#4a1a0a')); p.set(x, 7, C('#3aa84a')); } };
CMD.jp_yakitori = p => { p.line(2, 14, 14, 2, C('#c8a878')); for (let k = 0; k < 4; k++) p.ball(5 + k * 2.4, 11 - k * 2.4, 2, 2, pal(['#5a2a0a', '#a85a1e', '#d8903a'])); };
CMD.jp_okonomiyaki = p => { cmPlate(p, 12); p.ball(8, 9, 5.5, 3.5, pal(['#8a4a1a', '#c8803a', '#e8a860'])); for (let k = 0; k < 4; k++) p.line(4 + k * 2, 7, 6 + k * 2, 11, C('#4a1a0a')); p.line(4, 9, 12, 9, C('#f4f0e0')); };
CMD.jp_tamago = p => { cmPlate(p, 13); p.rect(4, 6, 8, 6, C('#ffd040')); p.hl(4, 6, 8, C('#fff0a0')); p.hl(4, 9, 8, C('#e8b020')); p.rect(7, 6, 2, 6, C('#1a2a1a')); };
CMD.jp_matcha = p => { cmBowl(p, ['#2a5a1a', '#4a8a2a', '#7ab84a', '#b8e890']); };
CMD.jp_te = p => { cmMug(p, '#3a5a3a', '#a8c870'); };
CMD.jp_neko_latte = p => { cmMug(p, '#f4f0e6', '#c8a070'); p.set(6, 5, C('#ffffff')); p.set(9, 5, C('#ffffff')); };
CMD.jp_sake = p => { p.rect(4, 4, 6, 11, C('#f4f0e6')); p.rect(5, 1, 4, 3, C('#f4f0e6')); p.rect(4, 7, 6, 4, C('#2a5ad8')); p.ball(12, 13, 2, 1.6, pal(['#c8c0b0', '#f4f0e6'])); };
CMD.jp_leche = p => cmBot(p, '#e8f0f0', '#ffffff', '#3ab8e8');
CMD.jp_manzana = p => { p.ball(8, 9, 5.5, 5, pal(['#7a0a0a', '#c81e1e', '#e84a3a', '#ff9a8a'])); p.vl(8, 2, 3, C('#5a3a1a')); p.ball(10, 3, 2, 1.2, pal(['#2a7a2a', '#4aa84a'])); };
// ---- España (v5.16) ----
CMD.es_paella = p => { p.ball(8, 9, 7, 4.5, pal(['#2a2a30', '#4a4a54'])); p.hl(0, 9, 2, C('#2a2a30')); p.hl(14, 9, 2, C('#2a2a30')); p.ball(8, 9, 6, 3.6, pal(['#c88a10', '#f0b020', '#ffd040', '#fff0a0'])); for (const [x, y, c] of [[5, 8, '#e84a2a'], [10, 9, '#e84a2a'], [8, 7, '#3aa84a'], [6, 10, '#1a1a24'], [11, 7, '#1a1a24'], [9, 11, '#ffe060']]) p.set(x, y, C(c)); };
CMD.es_tortilla = p => { cmPlate(p, 12); p.ball(8, 9, 5.5, 3.5, pal(['#c88a20', '#f0c040', '#ffe070', '#fff4b0'])); p.poly([[8, 9], [13, 7], [13, 11]], C('#fff4b0')); p.hl(9, 9, 4, C('#f0e0a0')); };
CMD.es_churros = p => { cmMug(p, '#e8e4dc', '#4a1a0a'); p.line(10, 3, 15, 13, C('#e8a050')); p.line(11, 3, 15, 11, C('#c8803a')); };
CMD.es_jamon = p => { cmPlate(p, 12); for (let k = 0; k < 3; k++) { p.ball(5 + k * 3, 9 - (k % 2), 2.8, 2, pal(['#7a1a1a', '#b83a3a', '#e86a6a', '#ffd0c8'])); p.set(5 + k * 3, 8 - (k % 2), C('#ffffff')); } };
CMD.es_gazpacho = p => { cmCup(p, '#f4f0e6', '#c81e1e'); p.rect(5, 6, 7, 3, C('#c81e1e')); p.set(7, 5, C('#3aa84a')); };
CMD.es_bocadillo = p => { p.ball(8, 7, 7, 2.5, pal(['#a8682a', '#d8984a', '#f0c070'])); p.hl(1, 9, 15, C('#c83a3a')); p.hl(1, 10, 15, C('#ffd060')); p.ball(8, 12, 7, 2.2, pal(['#a8682a', '#d8984a', '#f0c070'])); };
CMD.es_horchata = p => { cmCup(p, '#f8f4e8', '#e8e0c8'); p.line(10, 1, 9, 6, C('#ff8a2a')); };
CMD.es_pulpo = p => { p.ball(8, 10, 7, 4, pal(['#8a5a2a', '#c8904a', '#e8b878'])); for (const [x, y] of [[5, 9], [8, 8], [11, 9], [6, 11], [10, 11]]) { p.ball(x, y, 1.6, 1.4, pal(['#a83a5a', '#e8a8b8'])); p.set(x, y - 1, C('#c81e1e')); } };
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] === 'comida' && CMD[spec[1]]) { const p = new Pix(16, 16); CMD[spec[1]](p); p.outline(OUTL); return p; } return _gi.apply(this, arguments); }; }
for (const k in CMD) if (ITEMS[k]) ITEMS[k].icon = ['comida', k];
