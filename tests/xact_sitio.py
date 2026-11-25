"""Acciones del mapa en su sitio (6.12): construye cada mapa de MAPW_LIST, se coloca junto a cada objeto con acción
(`o.xact`, dos de cada tipo por mapa), la usa con doInteract como un jugador, juega 1,2 s pulsando ⚔ y apunta los errores.

Uso:  python3 tests/xact_sitio.py file://$PWD/dist/test.html  (tarda; debe acabar sin líneas debajo de RESULTS)
"""
import sys
from playwright.sync_api import sync_playwright
url = sys.argv[1]
HOOK = r"""(() => { window.__E = []; const push = (tag, e) => window.__E.push(tag + ' | ' + ((e && e.message) || e) + ' | ' + ((e && e.stack) || '').split('\n').slice(1, 3).join(' ').replace(/file:\/\/[^ )]*\//g, ''));
  const _es = window.errShow; window.errShow = function (e) { push('errShow', e); try { return _es && _es.apply(this, arguments); } catch (x) {} };
  window.addEventListener('error', ev => push('onerror', ev.error || ev.message)); return 1; })()"""
LIST = r"""(() => { const out = []; for (const e of MAPW_LIST) { let M = null; try { M = e.id === 'world' ? G.world : (G.maps[e.id] || (e.mk && e.mk())); } catch (x) { out.push([e.id, -1, 'MK ' + x.message]); continue; } if (!M || !M.objs) continue;
  const n = (() => { const seen = {}; return M.objs.filter(o => { if (!o || !o.xact || !XACT[o.xact]) return false; seen[o.xact] = (seen[o.xact] || 0) + 1; return seen[o.xact] <= 2; }); })().length; out.push([e.id, n, '']); } return out; })()"""
RUN = r"""async (args) => { const [mid, from, to] = args; const out = []; const sleep = ms => new Promise(r => setTimeout(r, ms));
  const e = MAPW_LIST.find(x => x.id === mid); const getM = () => mid === 'world' ? G.world : (G.maps[mid] || e.mk());
  let M = getM(); const objs = (() => { const seen = {}; return M.objs.filter(o => { if (!o || !o.xact || !XACT[o.xact]) return false; seen[o.xact] = (seen[o.xact] || 0) + 1; return seen[o.xact] <= 2; }); })().slice(from, to);
  for (const o of objs) { const e0 = window.__E.length; let err = '';
    try { M = getM(); if (G.map !== M) setMap(M, o.px || (o.x * 16 + 8), (o.py || (o.y * 16 + 8)) + 18, 'up'); else { G.P.x = o.px || (o.x * 16 + 8); G.P.y = (o.py || (o.y * 16 + 8)) + 18; } } catch (x) { err = 'SETMAP ' + x.message; }
    await sleep(150);
    try { doInteract({ kind: 'xact', o }); } catch (x) { err += ' THROW ' + x.message + ' @ ' + (x.stack || '').split('\n')[1]; }
    for (let i = 0; i < 6; i++) { await sleep(200); try { if (ACT.k && ACT.onAtk) ACT.onAtk(); else basicAttack(); } catch (x) { err += ' ATK ' + x.message; } }
    try { if (ACT.k) actEnd(); actClean(); closeModal(); if (typeof truRemarFin === 'function' && G.P.totora) truRemarFin(); } catch (x) { err += ' CLEAN ' + x.message; }
    const errs = window.__E.slice(e0); if (err || errs.length) out.push(mid + '/' + o.xact + ' => ' + err + ' ' + [...new Set(errs)].slice(0, 3).join(' ;; ')); }
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'])
    def fresh():
        ctx = b.new_context(viewport={'width': 900, 'height': 500}); pg = ctx.new_page(); pe = []
        pg.on('pageerror', lambda e: pe.append(str(e)[:300]))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1200); pg.click('#introOk'); pg.wait_for_timeout(300)
        pg.evaluate("(()=>{ const P=G.P; while(P.lv<650) gainXp(1e9); P.gold=1e9; for(const k in JOBS) P.jobs[k]={lv:60,xp:0}; window.hurtPlayer=()=>{}; return 1; })()")
        pg.evaluate(HOOK); return ctx, pg, pe
    ctx, pg, pe = fresh(); maps = pg.evaluate(LIST); ctx.close()
    print('MAPS', maps, flush=True); res = []
    for mid, n, err in maps:
        if err: res.append(mid + ' MK ' + err); continue
        for i in range(0, n, 25):
            ctx, pg, pe = fresh()
            try: res += pg.evaluate(RUN, [mid, i, i + 25])
            except Exception as e: res.append('%s %d CRASH %s' % (mid, i, str(e)[:200]))
            res += [mid + ' PAGEERROR ' + x for x in pe]; ctx.close(); print('done', mid, i, len(res), flush=True)
    print('RESULTS'); print('\n'.join(res)); b.close()
