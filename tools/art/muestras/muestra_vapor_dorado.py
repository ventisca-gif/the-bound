# MUESTRA (no se publica): fusión «Vapor Dorado» = Engranaje 2 + Despertar Dorado.
# Dibuja con el motor: columnas Engranaje 2 · Despertar Dorado (fase 2) · Fusión; filas chico y chica.
# La fusión usa el pelo/ojos/aura del Despertar Dorado y la piel del Engranaje 2, con el vapor teñido de oro.
# uso: python3 tools/art/muestras/muestra_vapor_dorado.py file://$PWD/dist/test.html out.png
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
JS = r"""(() => { window.requestAnimationFrame = () => 0;
const S = 4, CW = 120, RH = 128, cols = 3, rows = 2, W = CW * cols, H = RH * rows + 16;
cv.width = W * S; cv.height = H * S; ctx.setTransform(S, 0, 0, S, 0, 0); ctx.imageSmoothingEnabled = false;
const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1a1426'); bg.addColorStop(1, '#2a1a1a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
const app = g => Object.assign({}, DEF_APP, g === 'f' ? { g: 'f', hs: 5, hair: 'negro' } : { g: 'm', hs: 5, hair: 'negro' });
const look = (g, sr, sf) => heroLook('guerrero', app(g), { sr, sf }, {}, {});
const fusion = g => { const Lv = look(g, 'vapor', 1), Ld = look(g, 'dorado', 2); const L = Object.assign({}, Ld, { skin: Lv.skin, sr: 'vapor', srF: 1 }); return L; };
G.t = 3.7;
const names = ['Engranaje 2', 'Despertar Dorado', 'Fusión: Vapor Dorado'];
ctx.font = "9px 'Pixelify Sans', monospace"; ctx.textAlign = 'center';
for (let c = 0; c < cols; c++) { ctx.fillStyle = c === 2 ? '#ffd860' : '#f1e7d3'; ctx.fillText(names[c], c * CW + CW / 2, 12); }
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const g = r ? 'f' : 'm';
  const L = c === 0 ? look(g, 'vapor', 1) : c === 1 ? look(g, 'dorado', 2) : fusion(g); L.weapon = null;
  const A = buildHeroAtlas(L), e = { x: c * CW + CW / 2, y: 16 + r * RH + 110, dir: 'down', type: 'x', vph: 1 + c };
  if (c >= 1) { ctx.save(); ctx.translate(e.x, e.y); ctx.scale(1.4, 1.4); ctx.translate(-e.x, -e.y); dzAura(e, 0, 0, 2); ctx.restore(); }
  if (c !== 1) { ctx.save(); if (c === 2) ctx.filter = 'sepia(1) saturate(5) hue-rotate(-12deg) brightness(1.25)'; ctx.translate(e.x, e.y); ctx.scale(1.4, 1.4); ctx.translate(-e.x, -e.y); vapSteam(e, 0, 0, 1, false); if (c === 2) { e.vph += 1.3; vapSteam(e, 0, 0, 1, false); } ctx.restore(); }
  ctx.save(); ctx.translate(e.x - 17 * 2.2, e.y - 41 * 2.2); ctx.scale(2.2, 2.2); ctx.drawImage(A.img, A.idx.idle * A.fw + 7, 3, 34, 44, 0, 0, 34, 44); ctx.restore();
  if (c !== 1) { ctx.save(); if (c === 2) ctx.filter = 'sepia(1) saturate(5) hue-rotate(-12deg) brightness(1.25)'; ctx.translate(e.x, e.y); ctx.scale(1.4, 1.4); ctx.translate(-e.x, -e.y); vapSteam(e, 0, 0, 1, true); if (c === 2) { e.vph += 0.7; vapSteam(e, 0, 0, 1, true); } ctx.restore(); }
  if (c === 2) { for (let k = 0; k < 9; k++) { const a = k * 0.7 + 1, rr = 28 + (k % 3) * 8; ctx.fillStyle = k % 2 ? '#fff6b0' : '#ffd040'; ctx.fillRect(Math.round(e.x + Math.cos(a) * rr), Math.round(e.y - 44 + Math.sin(a) * rr * 1.2), 1.5, 1.5); } } }
const snap = mkCanvas(cv.width, cv.height); snap.getContext('2d').drawImage(cv, 0, 0); snap.id = 'snap'; document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(snap); snap.style.width = cv.width / 2 + 'px'; snap.style.height = cv.height / 2 + 'px'; return [W, H]; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1400, 'height': 1000}); pg.goto(url); pg.wait_for_timeout(1500)
    pg.click('#tNew'); pg.wait_for_timeout(300); pg.fill('#ccName', 'Ventisca'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    pg.wait_for_timeout(500)
    print(pg.evaluate(JS)); pg.wait_for_timeout(200)
    pg.locator('#snap').screenshot(path=out)
    b.close()
