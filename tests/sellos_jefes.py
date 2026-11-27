"""Prueba 6.48: fase de los sellos del Rey Vael (sellos pisables, se rompe al pisarlos, red de seguridad a los 35 s).
Uso: python3 tests/sellos_jefes.py file://$PWD/dist/test.html
"""
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1200, 'height': 700})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    res = pg.evaluate("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), P = G.P, out = {}; try {
      const ca = () => { try { closeModal(); closeDialog(); } catch (e) { } G.paused = false; }; ca(); P.lv = 148; calcStats(P);
      const god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 50);
      // el Rey Vael en su sitio del mundo (ruinas con columnas)
      const W = G.world, sp = W.bosses.find(b => b.id === 'vael'); out.spot = sp ? [sp.x, sp.y] : null; setMap(W, sp.x * 16 + 8, (sp.y + 3) * 16 + 8, 'up'); await w(1500); ca();
      const V = sp.ent || G.ents.find(e => e.mid === 'vael' && !e.dying); out.vael = !!V; if (!V) return out;
      V.hp = Math.round(V.maxhp * 0.49); await w(600); ca();
      out.fase = { invuln: !!V.invuln, sellos: (V.seals || []).map(s => [Math.round(s.x), Math.round(s.y), blockedFor(W, Math.floor(s.x / 16), Math.floor(s.y / 16), V.L || 0) ? 'BLOQUEADO' : 'pisable']) };
      const h0 = V.hp; hitMob(V, 99999); out.inmune = V.hp === h0;
      for (const s of V.seals) { P.x = s.x; P.y = s.y; V.state = 'idle'; for (let k = 0; k < 10; k++) { await w(250); ca(); P.x = s.x; P.y = s.y; } }
      out.pisados = { invuln: !!V.invuln, hechos: V.seals.filter(s => s.done).length };
      const h1 = V.hp; hitMob(V, 5000); out.recibeDanio = V.hp < h1;
      // red de seguridad: otra fase y sin pisar sellos durante más de 35 s
      V.vaelP = 0; V.hp = Math.round(V.maxhp * 0.4); P.x = V.x + 200; P.y = V.y + 120; await w(600); ca(); out.fase2 = !!V.invuln; V.invT0 = G.t - 36; await w(800); out.seguridad = !V.invuln;
      clearInterval(god); } catch (e) { out.ERR = String(e.stack || e).slice(0, 500); } return out; })()""")
    print(json.dumps(res, ensure_ascii=False)); print('ERRS', errs[:6]); b.close()
