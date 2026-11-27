"""Prueba 6.48: en la Torre Infinita no sale el muñeco de prueba; no da experiencia, oro ni objetos (solo piedras de mejora);
fuera de la torre los mismos enemigos siguen dando lo de siempre.
Uso: python3 tests/ti_premios.py file://$PWD/dist/test.html
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
      const ca = () => { try { closeModal(); closeDialog(); } catch (e) { } G.paused = false; }; ca(); P.lv = 300; calcStats(P);
      tiPools(); out.dummyEnPool = TI_POOL.includes('tp_dummy'); out.pool = TI_POOL.length;
      const inv = () => { const o = {}; for (const s of P.inv) if (s) o[s.id] = (o[s.id] || 0) + (s.q || s.n || 1); return o; };
      const god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 50);
      // fuera de la torre: los enemigos dan experiencia y oro como siempre
      const lv0 = P.lv, xp0 = P.xp, g0 = P.gold; const m0 = spawnMob('lobo', 300, P.x + 40, P.y, P.L, null, false) || spawnMob(Object.keys(MOBS)[0], 300, P.x + 40, P.y, P.L, null, false); killMob(m0); await w(200);
      out.fuera = { xp: P.xp - xp0 + (P.lv - lv0) * 1e9, oro: P.gold - g0 };
      // dentro: 60 enemigos y 3 jefes
      tiStart(1); await w(2600); ca(); const xp1 = P.xp, lvl1 = P.lv, g1 = P.gold, inv1 = inv(); let kills = 0;
      for (let k = 0; k < 12; k++) { for (const e of G.ents.slice()) if (e.type === 'mob' && e.ti && !e.dying) { killMob(e); kills++; } await w(150); TI.cleared = true; TI.floor = k % 3 === 2 ? Math.max(30, TI.floor) * 0 + (k + 1) * 10 : TI.floor; tiNext(); await w(2600); ca(); }
      const inv2 = inv(), gan = {}; for (const id in inv2) { const d = inv2[id] - (inv1[id] || 0); if (d > 0) gan[id] = d; }
      out.dentro = { kills, xp: P.xp - xp1 + (P.lv - lvl1) * 1e9, oro: P.gold - g1, objetos: gan, dummy: G.ents.some(e => e.mid === 'ti_tp_dummy') };
      tiEnd('left'); await w(1500); ca();
      // fuera otra vez: siguen dando lo de siempre
      const xp3 = P.xp, g3 = P.gold; const m3 = spawnMob('lobo', 300, P.x + 40, P.y, P.L, null, false) || spawnMob(Object.keys(MOBS)[0], 300, P.x + 40, P.y, P.L, null, false); killMob(m3); await w(200); out.fueraDespues = { xp: P.xp - xp3, oro: P.gold - g3 };
      clearInterval(god); } catch (e) { out.ERR = String(e.stack || e).slice(0, 500); } return out; })()""")
    print(json.dumps(res, ensure_ascii=False, indent=1)); print('ERRS', errs[:6]); b.close()
