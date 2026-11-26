# Lanza todas las habilidades activas de las 7 clases a nivel 600 contra un muñeco y dice cuáles fallan (6.35).
# uso: python3 tools/dev/habilidades.py file://$PWD/dist/test.html salida.json
import sys, json
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
HOOK = r"""(() => { window.__E = []; const push = (tag, e) => window.__E.push(tag + ' | ' + ((e && e.message) || e) + ' | ' + ((e && e.stack) || '').split('\n').slice(1, 3).join(' ').replace(/file:\/\/[^ )]*\//g, ''));
  const _es = window.errShow; window.errShow = function (e) { push('errShow', e); try { return _es && _es.apply(this, arguments); } catch (x) {} };
  window.addEventListener('error', ev => push('onerror', ev.error || ev.message)); return 1; })()"""
JS = r"""(async (CLS) => { const P = G.P, sleep = ms => new Promise(r => setTimeout(r, ms)), res = [];
  const L = 600; P.cls = CLS; P.lv = L; const C = CLASSES[CLS], attr = {}; for (const k in C.base) attr[k] = Math.floor(C.base[k] + C.grow[k] * (L - 1)); attr[C.main] += 3 * (L - 1); P.attr = attr;
  P.evo = CLS; P.app = Object.assign({}, P.app, { asc: 1 });
  const ids = Object.keys(SK).filter(id => SK[id].cls === CLS && SK[id].type === 'act'); P.skills = {}; for (const id in SK) if (SK[id].cls === CLS) P.skills[id] = SK[id].max || 10;
  calcStats(P); P.slots = [null, null, null, null];
  for (const id of ids) { const s = SK[id], e = s.eff || {}; const E0 = window.__E.length;
    for (const m of G.ents) if (m.type === 'mob' && m.qa) m.remove = true;
    const mob = spawnMob(Object.keys(MOBS).find(k => MOBS[k].lv && MOBS[k].lv[0] >= 400) || 'slime', L, P.x + 26, P.y, P.L); mob.qa = 1; mob.hp = mob.maxhp = 1e12; mob.atk = 0; mob.state = 'dummy';
    P.cds = {}; P.busy = 0; P.mp = P.S.maxmp = 1e6; P.dead = false; P.hp = Math.round(P.S.maxhp * 0.5); P.shield = 0; P.buff = {}; P.buffs = []; P.slots[0] = id; P.dir = 'right';
    const hp0 = P.hp, x0 = P.x, y0 = P.y; let ok = true, why = '';
    try { useSkill(0); } catch (err) { ok = false; why = 'throw ' + err.message; }
    const cast = (P.cds[id] || 0) > 0; await sleep(1800);
    const dmg = 1e12 - Math.max(0, mob.hp), heal = P.hp - hp0, sh = P.shield > 0, bf = Object.keys(P.buff || {}).filter(k => P.buff[k]).length || (P.buffs || []).length, moved = Math.hypot(P.x - x0, P.y - y0) > 8;
    const sum = G.ents.some(m => m.summoned || m.type === 'summon' || m.ally) ;
    const errs = window.__E.slice(E0);
    const kind = e.k; let expect = '';
    if (['heal'].includes(kind) && heal <= 0) expect = 'no curó'; else if (kind === 'shield' && !sh) expect = 'sin escudo'; else if (kind === 'buff' && !bf) expect = 'sin buff';
    else if (e.m !== undefined && !['heal', 'shield', 'buff', 'summon', 'army', 'kingsoul', 'sumbuff', 'dash', 'blink'].includes(kind) && dmg <= 0) expect = 'no hizo daño';
    res.push({ id, n: s.n, k: kind, req: s.req, cast, dmg: Math.round(dmg), heal, sh, bf, moved, errs, expect, why });
    P.x = x0; P.y = y0; mob.remove = true; }
  return res; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 900, 'height': 500}); pe = []; pg.on('pageerror', lambda e: pe.append(str(e)[:300]))
    pg.goto(url); pg.wait_for_timeout(3000); pg.evaluate(HOOK)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Prueba'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1000); R = {}
    for cls in pg.evaluate('Object.keys(CLASSES)'):
        R[cls] = pg.evaluate('(' + JS + ')(%s)' % json.dumps(cls))
    R['_pageerrors'] = pe; json.dump(R, open(out, 'w')); b.close()
