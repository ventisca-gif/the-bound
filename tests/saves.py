"""Partidas antiguas (6.12): crea una partida en versiones viejas del juego (update/thebound.html del historial de git),
la copia a la versión nueva, la carga desde el título como un jugador y comprueba que se juega y se vuelve a guardar.

Uso:  python3 tests/saves.py file://$PWD/dist/test.html [commit ...]
Sin commits, usa la versión más antigua del historial y una intermedia. Debe terminar en «OK» en todas.
"""
import json, os, subprocess, sys, tempfile
from playwright.sync_api import sync_playwright
new = sys.argv[1]; commits = sys.argv[2:]
ROOT = os.path.join(os.path.dirname(__file__), '..')
git = lambda *a: subprocess.run(['git', '-C', ROOT] + list(a), capture_output=True).stdout
if not commits:
    log = [l for l in git('log', '--format=%h', '--', 'update/version.json').decode().split() if l]
    commits = [log[-1], log[len(log) // 2]] if len(log) > 1 else log
HOOK = r"""(() => { window.__E = []; const _es = window.errShow; window.errShow = function (e) { window.__E.push(String((e && e.message) || e)); try { return _es && _es.apply(this, arguments); } catch (x) {} };
  window.addEventListener('error', ev => window.__E.push(String((ev.error && ev.error.message) || ev.message))); return 1; })()"""
OLD = """(lv)=>{ const P=G.P; while(P.lv<lv) gainXp(1e9); P.gold=123456; let n=0;
  for(const id of Object.keys(ITEMS)){ const I=ITEMS[id]; if(n<60 && (I.t==='mat'||I.t==='use'||I.slot) && (n*7+id.length)%11===0){ giveItem(id, I.stack?5:1); n++; } }
  for(const k in JOBS) P.jobs[k]={lv:Math.min(75,10+(k.length*3)%60),xp:5};
  saveGame(true); const dump={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(/^thebound\\./.test(k)) dump[k]=localStorage.getItem(k); }
  return {ver:GAME_VER, lv:P.lv, inv:P.inv.filter(Boolean).length, gold:P.gold, dump}; }"""
NEW = """async ()=>{ const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const P=G.P; const out={ver:GAME_VER, lv:P.lv, gold:P.gold, inv:P.inv.filter(Boolean).length, bad:[]};
  for(const k of ['atk','def','maxhp','crit','spd']) if(!isFinite(P.S[k])) out.bad.push('S.'+k);
  for(const k of ['ArrowRight','ArrowDown','ArrowLeft','ArrowUp']){ window.dispatchEvent(new KeyboardEvent('keydown',{key:k})); await sleep(500); window.dispatchEvent(new KeyboardEvent('keyup',{key:k})); }
  for(const p of ['inv','char','skills','quest','map']) { try{ openPanel(p); await sleep(120); closePanel(); }catch(e){ out.bad.push('panel '+p+': '+e.message); } }
  try{ renderGuia(); await sleep(100); closeModal(); }catch(e){ out.bad.push('lupa '+e.message); }
  saveGame(true); const again=JSON.parse(localStorage.getItem(slotKey(SLOT))); if(!again||again.lv!==P.lv) out.bad.push('no se vuelve a guardar'); out.errs=window.__E.slice(0,5); return out; }"""
ok = True
with sync_playwright() as p, tempfile.TemporaryDirectory() as td:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    for c in commits:
        html = git('show', c + ':update/thebound.html')
        if not html: print(c, 'sin update/thebound.html'); continue
        f = os.path.join(td, c + '.html'); open(f, 'wb').write(html)
        ctx = b.new_context(viewport={'width': 900, 'height': 500}); ctx.route('https://raw.githubusercontent.com/**/update/version.json*', lambda route: route.abort()); pg = ctx.new_page(); pe = []
        pg.on('pageerror', lambda e: pe.append(str(e)[:200]))
        pg.goto('file://' + f); pg.wait_for_timeout(3000)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Viejo'); pg.click('#ccGo'); pg.wait_for_timeout(1500); pg.click('#introOk'); pg.wait_for_timeout(500)
        old = pg.evaluate(OLD, 400); ctx.close()
        ctx = b.new_context(viewport={'width': 900, 'height': 500}); ctx.route('https://raw.githubusercontent.com/**/update/version.json*', lambda route: route.abort()); pg = ctx.new_page(); pe2 = []
        pg.on('pageerror', lambda e: pe2.append(str(e)[:200]))
        pg.goto(new); pg.wait_for_timeout(1500); pg.evaluate("(d)=>{ for(const k in d) localStorage.setItem(k,d[k]); return 1; }", old['dump'])
        pg.reload(); pg.wait_for_timeout(3000); pg.evaluate(HOOK)
        pg.evaluate("(()=>{ try { closeModal(); } catch (e) {} return 1; })()")  # ventana de Novedades al venir de una versión vieja (normal)
        pg.click('[data-slot]'); pg.wait_for_timeout(3000)
        pg.evaluate("(()=>{ try { closeModal(); } catch (e) {} return 1; })()")
        r = pg.evaluate(NEW); ctx.close()
        same = r['lv'] == old['lv'] and r['gold'] == old['gold'] and r['inv'] == old['inv']
        good = same and not r['bad'] and not r['errs'] and not pe2
        ok &= good
        print('%s v%s → v%s: nivel %s, oro %s, objetos %s · %s%s' % (c, old['ver'], r['ver'], r['lv'], r['gold'], r['inv'], 'OK' if good else 'FALLO', '' if good else ' ' + json.dumps({'same': same, 'bad': r['bad'], 'errs': r['errs'], 'page': pe2}, ensure_ascii=False)))
    b.close()
sys.exit(0 if ok else 1)
