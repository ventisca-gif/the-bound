"""Barrido de errores (6.48): a nivel 5, 150, 400 y 700 abre todas las pestañas, todos los botones de Atajos, todas las fichas de
la Lupa › Sistemas y visita todos los mapas del mapa del mundo jugando unos segundos. Apunta cualquier error de la página,
errores de ganchos (errOnce) y avisos de TypeError/ReferenceError.
Uso: python3 tests/barrido.py file://$PWD/dist/test.html [niveles separados por comas]
"""
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]; LVS = [int(x) for x in (sys.argv[2] if len(sys.argv) > 2 else '5,150,400,700').split(',')]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files'])
    report = {}
    for lv in LVS:
        pg = b.new_page(viewport={'width': 1200, 'height': 700}); errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)[:240]))
        pg.on('console', lambda m: m.type in ('error', 'warning') and any(k in m.text for k in ('TypeError', 'ReferenceError', 'RangeError', 'hook', 'is not', 'undefined')) and 'Photon' not in m.text and errs.append('CON ' + m.text[:240]))
        pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
        try: pg.click('#introOk', timeout=2000)
        except Exception: pass
        res = pg.evaluate("""(async (LV) => { const w = ms => new Promise(r => setTimeout(r, ms)), P = G.P, out = { tabs: 0, btns: 0, lupa: 0, maps: [], fail: [] };
          const ca = () => { try { closeModal(); closeDialog(); closePanel && closePanel(); } catch (e) { } try { $('#panel').hidden = true; } catch (e) { } G.paused = false; };
          const T = (tag, f) => { try { f(); } catch (e) { out.fail.push(tag + ': ' + String(e && e.message || e).slice(0, 160)); } };
          ca(); P.lv = LV; P.gold = 5e8; calcStats(P); P.hp = P.S.maxhp; const god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 100);
          // pestañas del menú
          for (const [k] of TABS) { T('tab ' + k, () => openPanel(k)); await w(120); T('tab ' + k + ' render', () => renderPanel()); out.tabs++; ca(); }
          // botones de Atajos (todos los de la fila, también los de pestañas ocultas)
          const btns = [...document.querySelectorAll('#tr .trbtns button, #tr button')].filter(b2 => b2.id && b2.onclick); const seen = new Set();
          for (const b2 of btns) { if (seen.has(b2.id) || /bHub|bOnline|bChat/.test(b2.id)) continue; seen.add(b2.id); T('btn ' + b2.id, () => b2.onclick()); await w(150); out.btns++; ca(); }
          // Lupa › Sistemas: cada ficha
          if (typeof GSIS !== 'undefined') for (const g of GSIS) { T('lupa ' + g[0], () => { const a = g[2] && g[2](); if (g[3]) g[3](); return a; }); out.lupa++; }
          // todos los mapas del mapa del mundo
          for (const D of MAPW_LIST) { if (!D.mk && D.id !== 'world') continue; let M = null; T('map ' + D.id + ' mk', () => { M = D.id === 'world' ? G.world : D.mk(); }); if (!M || typeof M.I !== 'function' || !M.ter) continue; // Perú/México/España son la imagen para elegir ciudad, no mapas jugables
            T('map ' + D.id + ' set', () => { const c = (M.camps && M.camps[0]) ? [M.camps[0].x * 16 + 8, M.camps[0].y * 16 + 8] : [(M.w >> 1) * 16 + 8, (M.h >> 1) * 16 + 8]; setMap(M, c[0], c[1], 'down'); });
            await w(1800); ca(); out.maps.push(D.id + ':' + G.ents.filter(e => e.map === M.id).length); }
          clearInterval(god); out.errOnce = typeof ERR_SEEN !== 'undefined' ? [...ERR_SEEN].slice(0, 30) : []; return out; })(%d)""" % lv)
        report[lv] = {'tabs': res['tabs'], 'btns': res['btns'], 'lupa': res['lupa'], 'maps': len(res['maps']), 'fail': res['fail'][:30], 'errOnce': res['errOnce'], 'errs': sorted(set(errs))[:30]}
        pg.close()
    print(json.dumps(report, ensure_ascii=False, indent=1)); b.close()
