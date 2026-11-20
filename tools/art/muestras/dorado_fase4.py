# Muestra (no forma parte del juego): fase 4 «Bestia Carmesí del Hilo» del Despertar Dorado, aprobada para más adelante.
# Uso: python3 tools/art/muestras/dorado_fase4.py file://$PWD/dist/test.html salida.png
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
JS = r"""(() => {
const S = 6, CW = 34, CH = 44, X0 = 7, Y0 = 3;
HAIRS.dz_f4 = pal(['#14080c', '#34121a', '#5e1e28', '#8e3040']); cosm('c_tmp_pelaje', 'Pelaje', 'body', () => ({ k: 'gi_ref', m: pal(['#4a080c', '#7a1418', '#a8282a', '#c84438', '#e0644e']), s: pal(['#3a2400', '#7a5000', '#b88a10', '#e8c040', '#fff08a']), giRef: 1 })); HAIRS.dz_oro = pal(['#6a3a00', '#b87800', '#f0c020', '#fff08a']);
SKINS.push(pal(['#5a0c10', '#962020', '#c23a32', '#e0644e'])); const FUR = SKINS.length - 1;
const hero = (a, cos) => { const L = heroLook('guerrero', a, { weapon: 0 }, cos || {}, {}); L.weapon = null; L.back = null; return buildHeroAtlas(L); };
const GI = { body: 'c_tmp_pelaje', legs: 'c_gi_ref_pants', feet: 'c_gi_ref_bare' };
const mk = (g, skin, hair, hs, eyes, top) => ({ g, bt: g === 'm' ? 0 : 1, skin, hair, eyes, hs, top: top || [1, 'azul'], bot: [2, 'negro'], shoe: [0, 'negro'] });
const SETS = [['m', [mk('m', 0, 'negro', 0, 'cafe'), mk('m', 0, 'dz_oro', 27, 'turquesa'), [mk('m', FUR, 'dz_f4', 29, 'ambar', [0, 'negro']), mk('m', 0, 'dz_f4', 29, 'ambar', [0, 'negro'])]]],
              ['f', [mk('f', 0, 'negro', 1, 'cafe'), mk('f', 0, 'dz_oro', 54, 'turquesa'), [mk('f', FUR, 'dz_f4', 51, 'ambar', [0, 'negro']), mk('f', 0, 'dz_f4', 51, 'ambar', [0, 'negro'])]]]];
const NAMES = ['Normal', 'Fase 2 (para comparar)', 'Fase 4 · Bestia Carmesí del Hilo'];
const cw = 330, ch = CH * S + 30, c = document.createElement('canvas'); c.id = 'sheet'; c.width = 60 + cw * 2 + 520; c.height = 60 + 2 * (ch + 20) + 150; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
x.fillStyle = '#1e1a26'; x.fillRect(0, 0, c.width, c.height); x.font = 'bold 22px sans-serif'; x.fillStyle = '#fff'; NAMES.forEach((n, k) => x.fillText(n, 40 + k * cw, 40));
const frame = (A, an, row, f) => [A.img, (A.idx[an] + f) * A.fw + X0, row * A.fh + Y0, CW, CH];
SETS.forEach(([g, list], r) => { const y = 60 + r * (ch + 20);
  list.forEach((a, k) => { const ox = 40 + k * cw, cx = ox + CW * S / 2, by = y + CH * S;
    if (k < 2) { const A = hero(a, k === 1 ? {} : {}); if (k === 1) { x.fillStyle = 'rgba(255,210,60,0.25)'; x.beginPath(); x.ellipse(cx, by - 120, 90, 140, 0, 0, 7); x.fill(); } x.drawImage(...frame(A, 'idle', 0, 0), ox, y, CW * S, CH * S); return; }
    // fase 4: cuerpo con pelaje (piel carmesí) + cabeza con piel normal encima, cola, aura carmesí con hilos y marcas rojas en los ojos
    const Af = hero(a[0], GI), An = hero(a[1], GI), views = [['idle', 0, 0], ['walk', 1, 1], ['idle', 3, 0]];
    views.forEach(([an, row, f], v) => { const vx = ox + v * (CW * S * 0.82 + 10), sc = v ? 0.82 : 1, w = CW * S * sc, h = CH * S * sc, yy = y + CH * S - h, ccx = vx + w / 2, bby = yy + h;
      const gr = x.createRadialGradient(ccx, bby - h * 0.45, 8, ccx, bby - h * 0.45, h * 0.7); gr.addColorStop(0, 'rgba(255,90,70,0.45)'); gr.addColorStop(1, 'rgba(160,0,20,0)'); x.fillStyle = gr; x.beginPath(); x.ellipse(ccx, bby - h * 0.45, w * 0.55, h * 0.62, 0, 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,200,180,0.7)'; x.lineWidth = 1.5; for (let k2 = 0; k2 < 3; k2++) { x.beginPath(); for (let t = 0; t <= 1; t += 0.05) { const Y = bby - t * h, X = ccx + Math.sin(t * 8 + k2 * 2.1) * w * 0.4 * (1 - t * 0.4); t ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); }
      const tail = () => { x.strokeStyle = '#5a0c10'; x.lineWidth = 10 * sc; x.lineCap = 'round'; x.beginPath(); const sx = ccx + (row === 1 ? -14 : 8) * sc; x.moveTo(sx, bby - h * 0.36); x.quadraticCurveTo(sx + (row === 1 ? -70 : 60) * sc, bby - h * 0.3, sx + (row === 1 ? -60 : 55) * sc, bby - h * 0.6); x.stroke(); x.strokeStyle = '#c23a32'; x.lineWidth = 5 * sc; x.stroke(); x.lineCap = 'butt'; };
      if (row === 0) tail(); x.drawImage(...frame(Af, an, row, f), vx, yy, w, h); if (row !== 0) tail();
      const headRows = 25; const fr = frame(An, an, row, f); x.drawImage(fr[0], fr[1], fr[2], CW, headRows, vx, yy, w, h * headRows / CH);
      if (row === 0) { x.fillStyle = '#d8202a'; const ey = yy + h * (19.5 / CH); x.fillRect(ccx - w * 0.2, ey, w * 0.11, h * 0.012); x.fillRect(ccx + w * 0.09, ey, w * 0.11, h * 0.012); } });
    x.fillStyle = '#ffb0a0'; x.font = '15px sans-serif'; x.fillText(L2('frente · lado · espalda', 'front · side · back'), ox, by + 24); }); });
x.font = '18px sans-serif'; x.fillStyle = '#e8e0c8'; const yy = c.height - 120;
['Fase 4: el hilo aprende el patrón de una bestia antigua. Pelaje carmesí sobre el cuerpo (por encima de la ropa, como el lobo y el dragón),',
 'melena negra y salvaje con reflejos rojos, ojos ámbar, cola carmesí y un aura roja con hilos de luz.',
 'Diseño propio de The Bound inspirado en la idea (no es una copia). Muestra hecha con el motor: no se guardó nada en el juego.'].forEach((t, i) => x.fillText(t, 30, yy + i * 26));
document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(c); return 1; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1600, 'height': 1000}); pg.on('pageerror', lambda e: print('ERR', e)); pg.goto(url); pg.wait_for_timeout(3000)
    pg.evaluate(JS); pg.wait_for_timeout(500); pg.locator('#sheet').screenshot(path=out); b.close()
