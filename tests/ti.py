"""Prueba de la Torre Infinita (6.43).
Uso: python3 tests/ti.py file://$PWD/dist/test.html [captura.png]
Recorre: entrada en la Torre de los Portales, subida desde el piso 1, pisos superados, jefes (10, 50, 100), caer en la
torre (sin muerte normal), guardar a mitad de subida y TODOS los enemigos y jefes del juego dentro de la torre.
"""
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]; shot = sys.argv[2] if len(sys.argv) > 2 else None
W = "(ms => new Promise(r => setTimeout(r, ms)))"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1200, 'height': 800})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.on('console', lambda m: m.type in ('error', 'warning') and ('hook' in m.text or 'TypeError' in m.text or 'ReferenceError' in m.text) and errs.append(m.text[:300]))
    pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    res = pg.evaluate("""(async () => { const w = %s, P = G.P, out = {}; try { const closeAll = () => { try { closeModal(); closeDialog(); } catch (e) { } G.paused = false; };
      P.lv = 700; calcStats(P); P.hp = P.S.maxhp; closeAll(); window.__god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 30);
      const T0 = makeTower(); out.door = !!T0.objs.find(o => o.xact === 'ti_open'); setMap(T0, (T0.w >> 1) * 16 + 8, (T0.h - 3) * 16, 'up');
      tiOpen(); out.modal = !!document.querySelector('#tiGo1'); closeAll();
      tiStart(1); await w(2600); closeAll(); out.f1 = { map: G.map.id, floor: TI && TI.floor, alive: tiAlive(), lv: G.ents.filter(e => e.ti && e.type === 'mob').map(e => e.lv) };
      const clear = async () => { for (const e of G.ents.slice()) if (e.type === 'mob' && e.ti && !e.dying) killMob(e); await w(700); closeAll(); };
      await clear(); out.c1 = { cleared: TI.cleared, portal: !!G.map.objs.find(o => o.xact === 'ti_next'), best: P.ti.best };
      tiNext(); await w(2600); closeAll(); out.f2 = { floor: TI.floor, alive: tiAlive(), lv: (G.ents.find(e => e.ti && e.type === 'mob') || {}).lv };
      const _te = tiEnd; window.__te = []; tiEnd = function (w) { window.__te.push(w + ' ' + new Error().stack.split(String.fromCharCode(10)).slice(2, 6).join(' | ')); return _te.apply(this, arguments); }; window.__god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 30); const boss = {}; for (const f of [10, 50, 100, 140]) { TI.cleared = true; TI.floor = f - 1; tiNext(); await w(2600); closeAll(); const B = G.ents.find(e => e.ti && e.boss && !e.dying); boss[f] = B ? [B.mid, B.lv, B.hp] : null; await clear(); }
      out.boss = boss; out.best = P.ti.best;
      // guardar durante la subida
      TI.cleared = true; tiNext(); await w(2600); closeAll(); let saved = null; const _ss = storage.set; storage.set = function (k, v) { if (/save/i.test(k) && typeof v === 'string' && v.length > 1000) { try { const o = JSON.parse(v); saved = o.map || (o.P && o.P.map) || 'ok'; } catch (e) { saved = 'nojson'; } } return _ss.apply(this, arguments); };
      saveGame(true); storage.set = _ss; out.saveMap = saved; out.mapAfterSave = P.map;
      clearInterval(window.__god);
      // caer en la torre
      P.hp = 1; playerDie(); await w(1500); out.die = { dead: P.dead, ti: !!TI, map: G.map.id, hp: P.hp === P.S.maxhp }; closeAll();
      // todos los enemigos y jefes del juego dentro de la torre
      window.__god = setInterval(() => { P.hp = P.S.maxhp; P.dead = false; P.ifr = 5; }, 30); tiStart(1); await w(2600); closeAll(); for (const e of G.ents) if (e.ti) e.remove = true; await w(100);
      tiPools(); const bad = [], M = G.map; let n = 0;
      for (const id of TI_POOL.concat(TI_BPOOL.map(b => '!' + b))) { const boss = id[0] === '!', k = boss ? id.slice(1) : id; try { const key = tiDef(k, boss), m = spawnMob(key, 700, P.x + 60, P.y - 60, 0, null, boss); m.map = M.id; m.ti = 1; m.state = 'chase'; for (let s = 0; s < 6; s++) { updateMob(m, 0.1); } P.hp = P.S.maxhp; killMob(m); n++; } catch (e) { bad.push(id + ': ' + (e.message || e)); } for (const e of G.ents) if (e.ti) e.remove = true; }
      out.all = { n, mobs: TI_POOL.length, bosses: TI_BPOOL.length, bad: bad.slice(0, 15), badN: bad.length };
      out.hiddenInMOBS = Object.keys(MOBS).filter(k => k.startsWith('ti_')).length; out.newMobs = Object.keys(TI_MOBS).every(k => MOBS[k]);
      clearInterval(window.__god); tiEnd('left'); await w(1500); closeAll(); out.end = { ti: !!TI, map: G.map.id };
      } catch (e) { out.ERR = String(e && e.stack || e).slice(0, 400); out.te = window.__te; } return out; })()""" % W)
    print(json.dumps(res, ensure_ascii=False, indent=1)); print('ERRS', errs[:12])
    if shot:
        pg.evaluate("""(async () => { const P = G.P; P.lv = 700; calcStats(P); tiStart(37); await new Promise(r => setTimeout(r, 2800)); try { closeModal(); } catch (e) { } G.paused = false; })()"""); pg.wait_for_timeout(1500); pg.screenshot(path=shot)
    b.close()
