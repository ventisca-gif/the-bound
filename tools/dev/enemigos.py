# Daño de cada monstruo y jefe contra un héroe de su nivel (6.35).
# uso: python3 tools/dev/enemigos.py file://$PWD/dist/test.html salida.json
import sys, json
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
JS = r"""(() => {
const P = G.P, best = (pred, L, score) => Object.values(ITEMS).filter(i => pred(i) && (i.lv || 0) <= L).sort((a, b) => score(b) - score(a))[0];
const SAVE = { lv: P.lv, cls: P.cls };
function setup(cls, L, o) {
  P.cls = cls; P.lv = L; const C = CLASSES[cls], attr = {}; for (const k in C.base) attr[k] = Math.floor(C.base[k] + C.grow[k] * (L - 1));
  attr[o.def ? 'vit' : C.main] += 3 * (L - 1); P.attr = attr; P.apts = 0;
  const eq = {}; const w = best(i => i.slot === 'weapon' && i.cls === cls && !i.leg && !i.cursedW, L, i => i.atk || 0); if (w) eq.weapon = { id: w.id, up: 0 };
  for (const s of ['head', 'body', 'legs', 'feet']) { const a = best(i => i.slot === s && i.t === 'armor' && (!i.cls || i.cls === cls) && !i.curse, L, i => (i.def || 0) + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id, up: 0 }; }
  for (const s of ['acc', 'neck']) { const a = best(i => i.slot === s && (!i.cls || i.cls === cls) && !i.curse, L, i => (i.atk || 0) * 2 + (i.def || 0) * 1.5 + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id }; }
  P.equip = eq; const sk = {}; for (const id in SK) { const s = SK[id]; if (s.cls === cls && s.type === 'pas' && s.req <= L) sk[id] = 10; } P.skills = sk;
  P.buff = {}; P.buffs = []; P.app = Object.assign({}, P.app, { asc: o.all && L >= 190 ? 1 : 0 }); P.evo = o.all && L >= 240 ? cls : null; P.spec = o.all && L >= 500 ? SPECS[cls][o.def ? 0 : 1][0] : null;
  P.trz = o.all && L >= 700 ? { lv: 50, xp: 0 } : null; P.sr = o.all ? 'fantasma' : null; P.srF = o.all ? 1 : 0;
  for (const j in P.jobs) P.jobs[j].lv = o.all ? (typeof jobBaseCap === 'function' ? jobBaseCap(j) : 75) : 1;
  calcStats(P); P.hp = P.S.maxhp; return P.S; }
function hitPct(base, lv, n) { let tot = 0; for (let i = 0; i < n; i++) { P.dead = false; P.ifr = 0; P.shield = 0; P.hp = P.S.maxhp; const h0 = P.hp; hurtPlayer(base, { lv }); tot += Math.max(0, h0 - P.hp); } P.hp = P.S.maxhp; P.dead = false; return tot / n / P.S.maxhp * 100; }
const mobsAt = L => Object.entries(MOBS).filter(([k, m]) => Array.isArray(m.lv) && m.lv[0] <= L && m.lv[1] >= L);
const out = [], sup = [];
function hit2(src, base, n) { let tot = 0; for (let i = 0; i < n; i++) { P.dead = false; P.ifr = 0; P.shield = 0; P.hp = P.S.maxhp; const h0 = P.hp; hurtPlayer(base, src); tot += Math.max(0, h0 - P.hp); } P.hp = P.S.maxhp; P.dead = false; return tot / n / P.S.maxhp * 100; }
const all = []; for (const k in MOBS) { const d = MOBS[k]; if (!Array.isArray(d.lv) || typeof d.n !== 'string') continue; all.push([k, d, Math.round((d.lv[0] + d.lv[1]) / 2), false]); }
for (const k in BOSSES) { const d = BOSSES[k]; if (!d.lv || typeof d.n !== 'string') continue; all.push([k, d, d.lv, true]); }
const cache = {};
for (const [k, d, lv0, boss] of all) { const lv = Math.max(1, Math.min(MAXLV, lv0)); const st = mobStats(d, lv, boss); const src = { type: 'mob', boss, mid: k, lv, def: d };
  const r = { k, n: d.n, lv, boss, sup: typeof SUPER_BOSS !== 'undefined' && SUPER_BOSS[k] !== undefined, dawn: typeof DAWN_RETO !== 'undefined' && !!DAWN_RETO[k] };
  for (const cls of ['guerrero', 'mago']) { const key = cls + lv; if (!cache[key]) cache[key] = 1; setup(cls, lv, {}); r[cls] = hit2(src, st.atk, 16); }
  out.push(r); }
P.lv = SAVE.lv; P.cls = SAVE.cls; return { out, sup }; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(3000)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Prueba'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=3000)
    except Exception: pass
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    R = pg.evaluate(JS); R['errs'] = errs; json.dump(R, open(out, 'w')); b.close()
