# Prueba de «doble toque» (6.53): busca recompensas que se pueden cobrar dos veces en los diálogos.
# Para cada NPC del juego abre su diálogo, pulsa cada opción de premio (regalo, cobrar, recoger, reclamar, recibir…)
# y, si la misma opción sigue en el menú (o el botón viejo sigue funcionando), la pulsa otra vez: si la segunda vez
# vuelve a dar oro, objetos o cosméticos, lo apunta como fallo.
# uso: python3 tests/doble_toque.py file://$PWD/dist/test.html
import json, sys
from playwright.sync_api import sync_playwright
URL = sys.argv[1]
JS = r"""(() => {
  const P = G.P, RE = /recibir|cobrar|recoger|reclamar|regalo|premio|recompensa|accept the gift|claim|collect|reward|gift/i;
  const snap = () => [P.gold, (P.inv || []).reduce((a, s) => a + (s ? (s.q || 1) : 0), 0), (P.wardrobe || []).length].join('|');
  const out = { npcs: 0, opts: 0, fails: [], errs: [] };
  const ids = Object.keys(NPCS);
  for (const id of ids) {
    let e = null;
    try { e = spawnNPC(id, P.x + 20, P.y, G.map.id, { face: 'up' }); if (!e) continue; e.v74vis = 1; out.npcs++;
      openDialog(e); if (!dlg) { e.remove = true; continue; }
      const labels = [...document.querySelectorAll('#dopts .dopt')].map(b => b.textContent).filter(t => RE.test(t));
      for (const lab of labels) {
        if (!dlg) openDialog(e); if (!dlg) break;
        const b1 = [...document.querySelectorAll('#dopts .dopt')].find(b => b.textContent === lab); if (!b1) continue; out.opts++;
        const s0 = snap(); b1.click(); const s1 = snap(); if (s0 === s1) continue;       // no dio nada (o abrió otra cosa)
        b1.click();                                                                    // botón viejo
        const b2 = [...document.querySelectorAll('#dopts .dopt')].find(b => b.textContent === lab); if (b2) b2.click();   // la misma opción otra vez
        const s2 = snap(); if (s2 !== s1) out.fails.push(id + ' · ' + lab + ' · ' + s0 + ' → ' + s1 + ' → ' + s2);
      }
    } catch (er) { if (out.errs.length < 10) out.errs.push(id + ': ' + (er && er.message)); }
    try { closeDialog(); closeModal(); closePanel(); } catch (er) { }
    if (e) e.remove = true; G.ents = G.ents.filter(q => !q.remove || q.type !== 'npc');
  }
  return out; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 900, 'height': 500}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto(URL); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Prueba'); pg.click('#ccGo'); pg.wait_for_timeout(1500); pg.click('#introOk'); pg.wait_for_timeout(500)
    pg.evaluate("G.P.lv = 300; calcStats(G.P); G.P.gold = 1e6; window.confirm = () => true; window.alert = () => {}; 1")
    res = pg.evaluate(JS)
    print(json.dumps({'npcs': res['npcs'], 'opciones de premio': res['opts'], 'fallos': res['fails'][:40], 'errores': res['errs'], 'errores de página': errs[:5]}, ensure_ascii=False, indent=1))
    b.close()
    sys.exit(1 if res['fails'] else 0)
