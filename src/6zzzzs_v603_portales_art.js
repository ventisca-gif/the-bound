// 6.03 · Los enemigos y jefes de los portales 400-600 con los dibujos de Sergio (su bestiario, recortado con
// tools/dev/portales.py → 6zzzzr_v603_portales_data.js). Mismas mecánicas. Arte ['port', clave]; si la imagen no
// cargara, queda el dibujo provisional de la 5.99.
const PORT_CV = {};
for (const k in PORT_SHEET) { const [fw, fh] = PORT_SIZE[k], c = mkCanvas(fw * 10, fh * 4); PORT_CV[k] = c; const im = new Image(); im.onload = () => { c.getContext('2d').drawImage(im, 0, 0); c._ok = 1; }; im.src = PORT_SHEET[k]; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'port' && PORT_CV[art[1]]) { if (!PORT_CV[art[1]]._ok && art[2]) return _ma.call(this, art[2]); return getAtlas('Mport' + art[1] + (PORT_CV[art[1]]._ok ? '' : '_'), () => { const [fw, fh] = PORT_SIZE[art[1]]; return { img: PORT_CV[art[1]], fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 4 }; }); } return _ma.apply(this, arguments); }; }
for (const id in PORT_SHEET) { const D = MOBS[id] && DG2_MOBS[id] ? MOBS[id] : BOSSES[id] && DG2_BOSS[id] ? BOSSES[id] : null; if (!D) continue; const old = D.art; D.art = ['port', id, old];
  if (DG_MOBS[id]) DG_MOBS[id][1] = D.art; }
