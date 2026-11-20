# Muestra (no forma parte del juego): reemplazos de la VERSIÓN PLAY STORE (Miku→Lumi Koe, Teto→Beni Kotone, Neru→Aoi Hoshino, Ado→Kurenai Yume, gi naranja→gi rojo).
# Uso: python3 tools/art/muestras/play_reemplazos.py file://$PWD/dist/test.html salida.png
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
JS = r"""(() => new Promise(done => {
const S = 5, CW = 34, CH = 44, X0 = 7, Y0 = 3;
const app = (hair, hs, eyes, extra) => Object.assign({ g: 'f', bt: 1, skin: 0, hair, eyes, hs, top: [1, 'blanco'], bot: [2, 'negro'], shoe: [0, 'negro'] }, extra || {});
const hero = (a, cos) => { const L = heroLook('guerrero', a, { weapon: 0 }, cos || {}, {}); L.weapon = null; L.back = null; return buildHeroAtlas(L); };
// cosmético temporal SOLO para la muestra: gi rojo con fajín blanco (no se guarda en el juego)
cosm('c_tmp_gi_rojo', 'Gi rojo', 'body', () => ({ k: 'gi_ref', m: CLOTH.rojo, s: CLOTH.blanco, giRef: 1 }));
cosm('c_tmp_gi_rojo_p', 'Gi rojo', 'legs', () => ({ k: 'baggy', m: CLOTH.rojo, giRef: 1 }));
const ROWS = [
 ['Hatsune Miku', { npc: 'jp_miku' }, 'Lumi Koe', hero(app('morado', 9, 'violeta'), { body: 'c_idol_escenario_v', legs: 'c_idol_escenario_f', feet: 'c_idol_escenario_b' })],
 ['Kasane Teto', { npc: 'jp_teto' }, 'Beni Kotone', hero(app('rosa', 42, 'rosa'), { body: 'c_idol_peluche_v', legs: 'c_idol_peluche_f', feet: 'c_idol_peluche_b' })],
 ['Akita Neru', { npc: 'jp_neru' }, 'Aoi Hoshino', hero(app('azul', 5, 'celeste'), { body: 'c_idol_y2k_v', legs: 'c_idol_y2k_f', feet: 'c_idol_y2k_b' })],
 ['Ado', { atlas: hero(ADO_APP, {}) }, 'Kurenai Yume', hero(app('rojo', 33, 'ambar'), { body: 'c_idol_gabardina_v', legs: 'c_idol_gabardina_f', feet: 'c_idol_gabardina_b' })],
 ['Gi naranja (como Goku)', { atlas: hero(app('negro', 0, 'cafe', { g: 'm' }), { body: 'c_gi_ref_top', legs: 'c_gi_ref_pants', feet: 'c_gi_ref_bare' }) }, 'Gi rojo de Albor', hero(app('negro', 0, 'cafe', { g: 'm' }), { body: 'c_tmp_gi_rojo', legs: 'c_tmp_gi_rojo_p', feet: 'c_gi_ref_bare' })]];
const COLS = [['idle', 0, 0], ['walk', 1, 1], ['idle', 3, 0]];
const cw = CW * S, ch = CH * S, W = 260 + cw * 3 + 40 + 260 + cw * 3, c = document.createElement('canvas'); c.id = 'sheet'; c.width = W; c.height = 60 + ROWS.length * (ch + 30); const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
x.fillStyle = '#3a6a3a'; x.fillRect(0, 0, W, c.height); x.font = 'bold 30px sans-serif'; x.fillStyle = '#fff'; x.fillText('AHORA (versión de amigos, no se toca)', 20, 40); x.fillText('PROPUESTA (solo versión Play Store)', 260 + cw * 3 + 60, 40);
x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(260 + cw * 3 + 20, 50, 4, c.height);
let pend = 0; const NPCQ = [];
const drawAtlas = (A, ox, oy) => COLS.forEach(([an, row, f], k) => x.drawImage(A.img, (A.idx[an] + f) * A.fw + X0, row * A.fh + Y0, CW, CH, ox + k * cw, oy, cw, ch));
ROWS.forEach(([n0, cur, n1, prop], r) => { const y = 60 + r * (ch + 30); x.fillStyle = '#fff'; x.font = 'bold 26px sans-serif'; x.fillText(n0, 10, y + ch / 2); x.fillText(n1, 260 + cw * 3 + 40, y + ch / 2);
  if (cur.atlas) drawAtlas(cur.atlas, 240, y); else { const A = npcAtlas(cur.npc); NPCQ.push([A, y]); }
  drawAtlas(prop, 260 + cw * 3 + 260, y); });
function fin() { document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(c); done(1); }
setTimeout(() => { for (const [A, y] of NPCQ) { const fw = A.fw, fh = A.fh, ax = A.ax || fw / 2; [['idle', 0, 0], ['walk', 1, 1], ['idle', 3, 0]].forEach(([an, row, f], k) => { const i = (A.idx && A.idx[an] !== undefined ? A.idx[an] : 0) + f; x.drawImage(A.img, i * fw, row * fh, fw, fh, 240 + k * cw + (cw - fw * S * 0.82) / 2, y + ch - fh * S * 0.82, fw * S * 0.82, fh * S * 0.82); }); } fin(); }, 1500); }))()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1400, 'height': 1000}); pg.goto(url); pg.wait_for_timeout(3000)
    pg.on('pageerror', lambda e: print('ERR', e)); pg.evaluate(JS); pg.wait_for_timeout(500); pg.locator('#sheet').screenshot(path=out); b.close()
