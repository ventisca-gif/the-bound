# Balance report: player (best gear for its level) vs. average monster/boss of that level, for every class.
# usage: python3 tools/dev/balance.py file://.../dist/test.html [up]
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]; up = int(sys.argv[2]) if len(sys.argv) > 2 else 0
JS = r"""(UP => {
const out = [], LVS = [10, 30, 60, 100, 140, 170, 200, 230, 250];
const best = (pred, L, score) => Object.values(ITEMS).filter(i => pred(i) && (i.lv || 0) <= L).sort((a, b) => score(b) - score(a))[0];
const mobAt = L => { const ms = Object.values(MOBS).filter(m => Array.isArray(m.lv) ? m.lv[0] <= L && m.lv[1] >= L : Math.abs((m.lv || 0) - L) <= 5); const n = ms.length || 1; const avg = k => ms.reduce((a, m) => a + (m[k] || 1), 0) / n; return { hp: avg('hp'), atk: avg('atk'), def: avg('def'), n: ms.length }; };
const bossAt = L => Object.values(BOSSES).filter(b => Math.abs(b.lv - L) <= 15).sort((a, b) => Math.abs(a.lv - L) - Math.abs(b.lv - L))[0];
for (const cls of Object.keys(CLASSES)) for (const L of LVS) {
  const C = CLASSES[cls], attr = {}; for (const k in C.base) attr[k] = Math.floor(C.base[k] + C.grow[k] * (L - 1)); attr[C.main] += 3 * (L - 1);
  const eq = {}; const w = best(i => i.slot === 'weapon' && i.cls === cls && !i.leg, L, i => i.atk || 0); if (w) eq.weapon = { id: w.id, up: UP };
  for (const s of ['head', 'body', 'legs', 'feet']) { const a = best(i => i.slot === s && i.t === 'armor', L, i => (i.def || 0) + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id, up: UP }; }
  for (const s of ['acc', 'neck']) { const a = best(i => i.slot === s && (!i.cls || i.cls === cls), L, i => (i.atk || 0) * 2 + (i.def || 0) * 1.5 + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id }; }
  const skills = {}; for (const id in SK) { const s = SK[id]; if (s.cls === cls && s.type === 'pas' && s.req <= L) skills[id] = 10; }
  const P = { cls, lv: L, attr, equip: eq, skills, buff: {}, buffs: [], app: G.P.app, hp: 1, mp: 1 };
  const S = calcStats(P);
  const M = mobAt(L), st = mobStats({ hp: M.hp, atk: M.atk, def: M.def }, L, false);
  const redM = typeof dmgRedM === 'function' ? dmgRedM : (def) => 100 / (100 + def * 1.1), redP = typeof dmgRedP === 'function' ? dmgRedP : (def) => 100 / (100 + def * 1.1);
  const critMul = 1 + Math.min(65, S.crit) / 100 * (S.critD / 100 - 1);
  const hit = S.atk * redM(st.def, L) * critMul, ttk = Math.ceil(st.hp / hit) * S.aspd;
  const taken = Math.max(1, st.atk * redP(S.def, L)), ttd = S.maxhp / taken * 1.4;
  const B = bossAt(L); let bt = '';
  if (B) { const bs = mobStats(B, B.lv, true); const bh = S.atk * redM(bs.def, B.lv) * critMul; const bdmg = Math.max(1, bs.atk * redP(S.def, B.lv)); bt = `boss ${B.n.slice(0, 14)}(${B.lv}) ttk=${(bs.hp / bh * S.aspd).toFixed(0)}s ttd=${(S.maxhp / bdmg * 1.2).toFixed(0)}s`; }
  out.push(`${cls.padEnd(9)} L${String(L).padEnd(3)} atk=${S.atk} def=${S.def} hp=${S.maxhp} | mob hp=${st.hp} atk=${st.atk} def=${st.def} | hits=${Math.ceil(st.hp / hit)} ttk=${ttk.toFixed(1)}s ttd=${ttd.toFixed(0)}s (${(S.maxhp / taken).toFixed(0)} golpes) | ${bt} | acc=${(eq.acc || {}).id},${(eq.neck || {}).id}`);
}
return out.join('\n'); })(%d)""" % up
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sim'); pg.click('#ccGo'); pg.wait_for_timeout(1500); pg.click('#introOk'); pg.wait_for_timeout(300)
    print(pg.evaluate(JS))
    b.close()
