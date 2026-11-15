"""Dificultad de los jefes (v4.68): cuánto tarda cada jefe en caer y cuánto aguantas, solo, con 2 hijos y con 4 amigos.

Uso:  python3 tools/dev/jefes.py file://$PWD/dist/test.html [--json]

Modelo (estimación, no una pelea real):
- Héroe «típico» del nivel del jefe: el mejor equipo de su nivel con mejoras según la etapa (+0 hasta 99, +3 hasta 199,
  +5 hasta 299, +7 desde 300), pasivas al máximo, 70 % de los atributos al principal.
- Daño por segundo = golpe normal / velocidad × 1,5 (habilidades) × 0,7 (tiempo atacando: esquivar, moverse).
- Vida del jefe con todos los ajustes del juego (mobStats, −20 % desde nivel 200, BOSS_TUNE de la 4.68).
- Grupo: el juego sube la vida del jefe un 55 % y su daño un 15 % por cada persona más (teamScale). Un hijo adulto cuenta
  0,5 y hace un 35 % del daño de un héroe. 4 amigos = 4 héroes iguales.
- «Aguante» = segundos que resistes recibiendo todos sus golpes sin esquivar (cada 1,2 s).
- K = 2,2: calibrado con peleas reales en el motor (Gruk 34, Nihil 250, Rey de las Campanas 330 con golpes normales
  sin parar: tardan 2,1-2,5 veces lo que da la fórmula, por teletransportes, curas, invulnerabilidad y golpes fallidos).
Objetivo por tipo de jefe (solo): normal de zona 1,25-3 min (sube con el nivel), jefes de continente 3-6 min,
súper jefes 6-10 min. `--solve` imprime BOSS_TUNE (multiplicador de vida) para llevar cada jefe a su objetivo.
"""
import sys, json
from playwright.sync_api import sync_playwright

url = sys.argv[1]
JS = r"""(() => {
const best = (pred, L, score) => Object.values(ITEMS).filter(i => pred(i) && (i.lv || 0) <= L).sort((a, b) => score(b) - score(a))[0];
const up = L => L < 100 ? 0 : L < 200 ? 3 : L < 300 ? 5 : 7;
const hero = (cls, L) => { const C = CLASSES[cls], attr = {}; for (const k in C.base) attr[k] = Math.floor(C.base[k] + C.grow[k] * (L - 1)); attr[C.main] += 3 * (L - 1);
  const eq = {}; const w = best(i => i.slot === 'weapon' && i.cls === cls && !i.leg && !i.anc, L, i => i.atk || 0); if (w) eq.weapon = { id: w.id, up: up(L) };
  for (const s of ['head', 'body', 'legs', 'feet']) { const a = best(i => i.slot === s && i.t === 'armor', L, i => (i.def || 0) + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id, up: up(L) }; }
  for (const s of ['acc', 'neck']) { const a = best(i => i.slot === s && (!i.cls || i.cls === cls), L, i => (i.atk || 0) * 2 + (i.def || 0) * 1.5 + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id }; }
  const skills = {}; for (const id in SK) { const s = SK[id]; if (s.cls === cls && s.type === 'pas' && s.req <= L) skills[id] = 10; }
  return calcStats({ cls, lv: Math.min(L, MAXLV), attr, equip: eq, skills, buff: {}, buffs: [], app: G.P.app, hp: 1, mp: 1 }); };
const redM = typeof dmgRedM === 'function' ? dmgRedM : (def) => 100 / (100 + def * 1.1), redP = typeof dmgRedP === 'function' ? dmgRedP : (def) => 100 / (100 + def * 1.1);
const out = [];
for (const id of Object.keys(BOSSES)) { const B = BOSSES[id]; const L = B.lv;
  const bs = mobStats(B, L, true); let hp = bs.hp * (L >= 200 ? 0.8 : 1) * ((typeof BOSS_TUNE !== 'undefined' && BOSS_TUNE[id]) || 1);
  let dps = 0, ttd = 0, n = 0;
  for (const cls of Object.keys(CLASSES)) { if (cls === 'pez') continue; const S = hero(cls, L); const critMul = 1 + Math.min(65, S.crit) / 100 * (S.critD / 100 - 1);
    dps += S.atk * redM(bs.def, L) * critMul / S.aspd * 1.5 * 0.7; ttd += S.maxhp / Math.max(1, bs.atk * ((typeof BOSS_TUNE_ATK !== 'undefined' && BOSS_TUNE_ATK[id]) || 1) * redP(S.def, L)) * 1.2; n++; }
  dps /= n; ttd /= n;
  const team = (people, dmg) => 2.2 * hp * (1 + 0.55 * (people - 1)) / (dps * dmg);
  const kind = (typeof SUPER_BOSS !== 'undefined' && SUPER_BOSS[id] !== undefined) ? 'super' : L >= 200 ? 'cont' : 'zona';
  out.push({ tune: (typeof BOSS_TUNE !== 'undefined' && BOSS_TUNE[id]) || 1, id, n: B.n, lv: L, kind, solo: team(1, 1), kids: team(2, 1.7), four: team(4, 4), ttd, ttd4: ttd / (1 + 0.15 * 3) });
}
return out; })()"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sim'); pg.click('#ccGo'); pg.wait_for_timeout(1500); pg.click('#introOk'); pg.wait_for_timeout(300)
    R = pg.evaluate(JS)
    b.close()
SUPER_T = {'desatado': 360, 'eclipsor': 420, 'nihil': 540, 'luna_sonriente': 540, 'sin_nombre': 600, 'lienzo_blanco': 600}
def target(r):
    if r['kind'] == 'super': return SUPER_T.get(r['id'], 480)
    if r['kind'] == 'cont': return 180 + (r['lv'] - 200) / 150 * 120          # 3 -> 5 min
    return 75 + (r['lv'] - 1) / 199 * 105                                      # 1,25 -> 3 min (al principio el equipo suele ir peor)
if '--solve' in sys.argv:
    tune = {}
    for r in R:
        cur = (r.get('tune') or 1)
        k = target(r) / r['solo']
        if abs(k - 1) > 0.08: tune[r['id']] = round(cur * k, 2)
    print('const BOSS_TUNE = ' + json.dumps(tune) + ';'); sys.exit()
if '--json' in sys.argv:
    print(json.dumps(R)); sys.exit()
T = {'zona': (90, 240), 'cont': (180, 360), 'super': (360, 600)}
m = lambda s: '%4.1f' % (s / 60)
print('jefe                         nivel tipo   solo  2hijos 4amigos (min) | aguante solo/4 (s) | objetivo')
bad = 0
for r in sorted(R, key=lambda r: r['lv']):
    lo, hi = T[r['kind']]
    if r['kind'] == 'zona': lo, hi = target(r) * 0.75, target(r) * 1.5
    lo *= 0.97; hi *= 1.03; flag = '' if lo <= r['solo'] <= hi else ('LARGO' if r['solo'] > hi else 'CORTO')
    if r['ttd'] < 12: flag += ' MUERES-RAPIDO'
    if flag: bad += 1
    print('%-28s %4d %-5s %s  %s   %s       | %4.0f / %4.0f          | %s' % (r['n'][:28], r['lv'], r['kind'], m(r['solo']), m(r['kids']), m(r['four']), r['ttd'], r['ttd4'], flag))
print('\nfuera de objetivo:', bad, 'de', len(R))
