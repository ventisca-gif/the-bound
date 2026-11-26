# Prueba de aguante (6.34): 60 s contra la media de los jefes de tu nivel (un golpe cada 1,5 s), sin y con las habilidades de cura, escudo y defensa de cada clase.
# uso: python3 tools/dev/aguante.py file://$PWD/dist/test.html salida.json
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
const KIT = { guerrero: ['g6', 'g8', 'g15', 'g16', 'ev_g2'], mago: ['m7', 'm11'], arquero: ['a7'], bardo: ['d5', 'd6', 'd8', 'd15', 'd16', 'ev_b1'], pez: ['z6', 'z8', 'z16'] };
function fight(base, lv, kit, secs) { // golpe cada 1,5 s; habilidades en cuanto salen (curas si vida < 70 %)
  const L = P.lv, max0 = P.S.maxhp; let hp = max0, shield = 0, shT = 0, healed = 0, taken = 0, died = null; const cd = {}, act = [];
  const sks = kit.filter(id => SK[id] && SK[id].req <= L && (!SK[id].evo || L >= 240)).map(id => ({ id, s: SK[id], v: skillVal(id, SK[id].max || 10) }));
  for (let t = 0; t <= secs; t += 0.5) {
    for (const k of sks) { if ((cd[k.id] || 0) > t) continue; const e = k.s.eff;
      if (e.k === 'heal') { if (hp > max0 * 0.7) continue; const h = Math.min(max0 - hp, max0 * k.v.p / 100); hp += h; healed += h; }
      else if (e.k === 'shield') { if (shield > 0 && shT > t) continue; shield = max0 * k.v.p / 100; shT = t + e.dur; }
      else if (e.k === 'buff') { const st = {}; for (const q in e.st) st[q] = k.v[q] !== undefined ? k.v[q] : e.st[q]; act.push({ st, end: t + e.dur }); }
      cd[k.id] = t + k.s.cd; }
    if (Math.abs(t / 1.5 - Math.round(t / 1.5)) > 1e-6 || t === 0) continue;
    const b = {}; for (const a of act) if (a.end > t) for (const q in a.st) b[q] = (b[q] || 0) + a.st[q]; P.buff = b; calcStats(P);
    P.dead = false; P.ifr = 0; P.shield = 0; P.hp = P.S.maxhp; const h0 = P.hp; hurtPlayer(base, { lv }); let d = Math.max(0, h0 - P.hp) * max0 / P.S.maxhp;
    if (shT <= t) shield = 0; const ab = Math.min(shield, d); shield -= ab; d -= ab; hp -= d; taken += d; if (hp <= 0 && died === null) died = t; }
  P.buff = {}; calcStats(P); P.hp = P.S.maxhp; P.dead = false;
  return { pctMin: taken / max0 * 100 * 60 / secs, healPct: healed / max0 * 100 * 60 / secs, died, end: Math.max(0, hp / max0 * 100) }; }
for (const L of [148, 300, 500, 600]) for (const cls of Object.keys(KIT)) for (const [bn, o] of [['ataque', {}], ['ataque+todo', { all: 1 }]]) {
  setup(cls, L, o); const bs = Object.entries(BOSSES).filter(([k, b]) => Math.abs(b.lv - L) <= 20); if (!bs.length) continue;
  let s = 0; for (const [k, b] of bs) s += mobStats(b, b.lv, true).atk; const base = s / bs.length;
  const no = fight(base, L, [], 60), yes = fight(base, L, KIT[cls], 60);
  out.push({ L, cls, bn, no, yes, skills: KIT[cls].filter(id => SK[id] && SK[id].req <= L && (!SK[id].evo || L >= 240)).join(',') });
}
P.lv = SAVE.lv; P.cls = SAVE.cls; return { out, sup }; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(3000)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Prueba'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=3000)
    except Exception: pass
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    R = pg.evaluate(JS); R['errs'] = errs; json.dump(R, open(out, 'w')); b.close()
