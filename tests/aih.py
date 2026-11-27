"""Prueba de los cazadores-jugador con IA (6.43).
Uso: python3 tests/aih.py file://$PWD/dist/test.html [captura.png]
"""
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]; shot = sys.argv[2] if len(sys.argv) > 2 else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1200, 'height': 800})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.on('console', lambda m: m.type in ('error', 'warning') and ('hook' in m.text or 'TypeError' in m.text or 'ReferenceError' in m.text or 'aih' in m.text) and errs.append(m.text[:300]))
    pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    res = pg.evaluate("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), P = G.P, out = {}; const closeAll = () => { try { closeModal(); closeDialog(); } catch (e) { } G.paused = false; };
      try { closeAll(); window.__god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 50);
      // cerca de un campamento de nivel bajo del mundo
      const W = G.world, c = W.camps.filter(c => c.lv >= 8 && c.lv <= 20)[0]; setMap(W, c.x * 16 + 8 + 200, c.y * 16 + 8, 'down'); await w(600); closeAll();
      out.world = { n: AIH_LIST.length, lvs: AIH_LIST.map(e => e.aih.lv).slice(0, 8), names: AIH_LIST.map(e => e.aih.name).slice(0, 8) };
      const k0 = AIH_LIST.reduce((s, e) => s + e.aih.kills, 0); await w(20000); closeAll();
      out.after20s = { kills: AIH_LIST.reduce((s, e) => s + e.aih.kills, 0) - k0, fighting: AIH_LIST.filter(e => e.ai.st === 'fight').length, states: AIH_LIST.map(e => e.ai.st).join(',') };
      // antirrobo: nunca atacan tu objetivo ni tu zona
      const mob = G.ents.find(m => m.type === 'mob' && !m.dying && m.map === 'world'); let stolen = 0;
      if (mob) { P.x = mob.x + 30; P.y = mob.y; P.target = mob; hitMob(mob, 1); const t0 = G.t; for (let i = 0; i < 40; i++) { await w(100); if (AIH_LIST.some(e => e.ai.tgt === mob)) stolen++; if (G.t - t0 > 5) break; } }
      out.antiRobo = { mob: !!mob, stolen, zoneHit: AIH_LIST.some(e => e.ai.tgt && Math.hypot(e.ai.tgt.x - AIH_PF.x, e.ai.tgt.y - AIH_PF.y) < 150) };
      // diálogo y perfil
      const e0 = AIH_LIST[0]; P.x = e0.x + 10; P.y = e0.y; openDialog(e0); await w(200); out.dlg = { name: document.querySelector('#dname').textContent, opts: [...document.querySelectorAll('#dialog button')].map(b => b.textContent).slice(0, 5) }; closeAll();
      // duelo
      aihDuel(e0); await w(2500); out.duel = { on: !!DUEL, name: DUEL && DUEL.o.name, atlasHero: !!(DUEL && DUEL.m && DUEL.m.atlas && DUEL.m.atlas.idx && DUEL.m.atlas.idx.chop !== undefined) };
      if (DUEL && DUEL.m) { killMob(DUEL.m); await w(3000); } closeAll();
      // otros mapas
      const maps = {}; for (const id of ['japon', 'velo_roto', 'archipielago', 'cielo', 'lima', 'espana', 'selva']) { const D = MAPW_LIST.find(m => m.id === id); if (!D || !D.mk) { maps[id] = 'sin mapa'; continue; } try { const M = D.mk(); const s = (M.camps && M.camps[0]) ? [M.camps[0].x * 16 + 8, M.camps[0].y * 16 + 8] : [(M.w >> 1) * 16 + 8, (M.h >> 1) * 16 + 8]; setMap(M, s[0], s[1], 'down'); await w(1500); closeAll(); maps[id] = AIH_LIST.length + ' / ' + aihCount(M); } catch (e) { maps[id] = 'ERR ' + e.message; } }
      out.maps = maps; out.saved = Object.keys(P.aihLv || {}).length;
      const T0 = makeTower(); setMap(T0, (T0.w >> 1) * 16 + 8, (T0.h - 3) * 16, 'up'); await w(300); out.tower = AIH_LIST.length;
      clearInterval(window.__god); } catch (e) { out.ERR = String(e && e.stack || e).slice(0, 500); } return out; })()""")
    print(json.dumps(res, ensure_ascii=False, indent=1)); print('ERRS', errs[:12])
    if shot:
        pg.evaluate("""(async () => { const P = G.P, W = G.world, c = W.camps.filter(c => c.lv >= 8 && c.lv <= 20)[0]; setMap(W, c.x * 16 + 8 + 60, c.y * 16 + 8 + 40, 'down'); for (const e of AIH_LIST.slice(0, 5)) { e.x = c.x * 16 + 8 + (Math.random() - 0.5) * 120; e.y = c.y * 16 + 8 + (Math.random() - 0.5) * 80; e.ai.st = 'idle'; e.ai.t = 0; } try { closeModal(); } catch (e) { } G.paused = false; })()""")
        pg.wait_for_timeout(6000); pg.screenshot(path=shot)
    b.close()
