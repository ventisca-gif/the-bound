"""Duelos PvP a nivel máximo: ¿se pueden hacer frente todas las clases?

Uso: python3 tools/dev/pvp.py file://$PWD/dist/test.html [nivel] [--raw]

Para cada clase al nivel indicado (por defecto MAXLV) con el mejor equipo de su nivel, ascensión, evolución y
todas sus habilidades al máximo, estima:
  - daño por segundo contra otro jugador (ataque básico + rotación de habilidades limitada por maná, invocaciones),
    con las reglas del PvP del juego: se envía el 30 % del daño, el rival aplica su defensa y su esquiva, y como
    mucho cuenta un golpe cada 0,22 s por objetivo;
  - aguante: vida, escudos y curaciones por segundo;
  - tiempo para derrotar a cada rival y quién gana cada duelo.
Con --raw ignora el ajuste PvP por clase (PVP_CLS) para ver el estado sin corregir.
"""
import json, sys
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
url = args[0]; lv = int(args[1]) if len(args) > 1 else 0
raw = '--raw' in sys.argv
JS = r"""(([LV, RAW, MUL]) => {
const L = LV || MAXLV, out = {}, CLS = Object.keys(CLASSES);
const best = (pred, score) => Object.values(ITEMS).filter(i => pred(i) && (i.lv || 0) <= L).sort((a, b) => score(b) - score(a))[0];
// fracción del área que alcanza a un rival que se mueve, y tiempo en que se reparten los golpes (para el límite de 0,22 s)
const HITF = { slash: 0.9, spin: 0.9, slam: 0.85, dash: 0.8, leap: 0.8, proj: 0.85, rain: 0.5, nova: 0.9, field: 0.6, shadow: 0.9, mark: 0.9, flurry: 0.9, meteor: 0.7, vortex: 0.6, concert: 0.75, skyfall: 0.85, beams: 0.4, grab: 0.85 };
const SPREAD = { spin: 0.11, flurry: 0.08, rain: 0.12, field: 0.5, vortex: 0.3, concert: 0.5, beams: 0.12, skyfall: 0.3 };
for (const cls of CLS) {
  const C = CLASSES[cls], attr = {}; for (const k in C.base) attr[k] = Math.floor(C.base[k] + C.grow[k] * (L - 1)); attr[C.main] += 3 * (L - 1);
  const eq = {}; const w = best(i => i.slot === 'weapon' && i.cls === cls && !i.leg && !i.curse, i => i.atk || 0); if (w) eq.weapon = { id: w.id, up: 10 };
  for (const s of ['head', 'body', 'legs', 'feet']) { const a = best(i => i.slot === s && i.t === 'armor', i => (i.def || 0) + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id, up: 10 }; }
  for (const s of ['acc', 'neck']) { const a = best(i => i.slot === s && (!i.cls || i.cls === cls), i => (i.atk || 0) * 2 + (i.def || 0) * 1.5 + (i.hpB || 0) / 10); if (a) eq[s] = { id: a.id }; }
  const skills = {}; for (const id in SK) { const s = SK[id]; if (s.cls === cls && s.req <= L) skills[id] = s.max || 10; }
  const app = Object.assign({}, normApp(G.P.app), { asc: 1, evo: cls });
  const P = { cls, lv: L, attr, equip: eq, skills, buff: {}, buffs: [], app, hp: 1, mp: 1 };
  const S = calcStats(P), critMul = 1 + Math.min(70, S.crit) / 100 * (S.critD / 100 - 1);
  // buffs propios (promedio por tiempo activo)
  let atkB = 0, defB = 0, aspdB = 0, dodgeB = 0, critB = 0;
  const acts = Object.keys(skills).map(id => SK[id]).filter(s => s.type === 'act' && s.eff);
  for (const s of acts) { const e = s.eff; if (e.k !== 'buff') continue; const v = skillVal(s.id, skills[s.id]), up = Math.min(1, e.dur / s.cd);
    atkB += (v.atkP || 0) * up; defB += (v.defP || 0) * up; aspdB += (v.aspdP || 0) * up; dodgeB += (v.dodge || 0) * up; critB += (v.crit || 0) * up; }
  const atk = S.atk * (1 + atkB / 100), aspd = S.aspd / (1 + aspdB / 100), cm = 1 + Math.min(70, S.crit + critB) / 100 * (S.critD / 100 - 1);
  // rotación de habilidades
  let mpUse = 0, busy = 0, hits = 0, dmg = 0, heal = 0, shield = 0; const det = [];
  for (const s of acts) { const e = s.eff, v = skillVal(s.id, skills[s.id]), m = (v.m || 100) / 100 * (1 + (S.skillP || 0) / 100), per = 1 / s.cd;
    mpUse += s.mp * per; busy += 0.35 * per;
    if (e.k === 'heal') { heal += S.maxhp * (v.p || e.p || 0) / 100 * per; continue; }
    if (e.k === 'shield') { shield += S.maxhp * (v.p || e.p || 0) / 100 * per; continue; }
    if (e.k === 'buff' || e.k === 'blink' || e.k === 'sumbuff') continue;
    if (e.k === 'summon' || e.k === 'army' || e.k === 'kingsoul') { const n = e.k === 'army' ? (e.n || 3) : 1, up = Math.min(1, (e.dur || 30) / s.cd), h = n * up / 1.05; hits += h * per * s.cd; dmg += atk * m * h * 0.9; det.push(s.id + ':inv'); continue; }
    let n = e.hits || e.ticks || e.n || 1; if (e.k === 'proj' && e.n) n = Math.min(e.n, 2);
    const sp = SPREAD[e.k] ? SPREAD[e.k] * n : 0, eff = Math.min(n, Math.floor(sp / 0.22) + 1);
    const f = HITF[e.k] || 0.85; dmg += atk * m * eff * f * cm * per; hits += eff * f * per; det.push(s.id + ':' + (atk * m * eff * f * cm / 1000).toFixed(0) + 'k/' + s.cd + 's');
  }
  const mpRegen = (S.mpReg || 0) + S.maxmp * 0.012, manaF = Math.min(1, mpRegen / Math.max(1, mpUse));
  dmg *= manaF; heal *= manaF; shield *= manaF; hits *= manaF;
  const hf = RAW || typeof PVP_HEAL === 'undefined' ? 1 : (PVP_HEALC[cls] !== undefined ? PVP_HEALC[cls] : PVP_HEAL); heal = heal * hf + S.maxhp * 0.002; shield *= hf;   // curas de habilidad reducidas en PvP + regeneración en combate
  const basicT = Math.max(0.2, 1 - busy * manaF), basic = atk * cm / aspd * basicT, basicH = basicT / aspd;
  let dps = dmg + basic, hps = hits + basicH; if (hps > 1 / 0.22) dps *= (1 / 0.22) / hps;
  const pv = MUL ? (MUL[cls] || 1) : RAW || typeof PVP_CLS === 'undefined' ? 1 : (PVP_CLS[cls] || 1);
  out[cls] = { atk: S.atk, def: Math.round(S.def * (1 + defB / 100)), hp: S.maxhp, crit: S.crit, dodge: Math.min(40, S.dodge + dodgeB), dps: dps * pv, heal, shield, manaF, basicShare: basic / (dmg + basic), det };
}
// duelos
const res = {}, red = (d) => dmgRedP(d, L);
for (const a of CLS) { res[a] = {}; for (const b of CLS) { const A = out[a], B = out[b];
  const inA = A.dps * 0.3 * red(B.def) * (1 - B.dodge / 100), inB = B.dps * 0.3 * red(A.def) * (1 - A.dodge / 100);
  const tA = B.hp / Math.max(1, inA - B.heal - B.shield), tB = A.hp / Math.max(1, inB - A.heal - A.shield);   // A tarda tA en derrotar a B
  res[a][b] = { t: tA, win: tB / tA }; } }
return { L, out, res };
})"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sim'); pg.click('#ccGo'); pg.wait_for_timeout(1500); pg.click('#introOk'); pg.wait_for_timeout(300)
    R = pg.evaluate('(' + JS + ')(%s)' % json.dumps([lv, raw, None]))
    if '--solve' in sys.argv:   # busca multiplicadores PvP por clase que igualen la fuerza media en duelo
        import math
        mul = {c: 1.0 for c in R['out']}
        for it in range(12):
            R = pg.evaluate('(' + JS + ')(%s)' % json.dumps([lv, False, mul]))
            cl = list(R['out']); res = R['res']
            pw = {a: math.exp(sum(math.log(max(1e-6, res[a][b]['win'])) for b in cl if b != a) / (len(cl) - 1)) for a in cl}
            for c in cl: mul[c] = min(2.0, max(0.45, mul[c] * pw[c] ** -0.35))
        print('PVP_CLS sugerido:', json.dumps({c: round(v, 2) for c, v in mul.items()}))
    b.close()
out, res, cls = R['out'], R['res'], list(R['out'].keys())
print('Nivel %d %s' % (R['L'], '(sin ajuste PvP)' if raw else ''))
print('%-10s %8s %7s %8s %5s %5s %9s %8s %7s %5s' % ('clase', 'ataque', 'def', 'vida', 'crit', 'esq', 'dps', 'cura/s', 'escudo/s', 'maná'))
for c in cls:
    o = out[c]; print('%-10s %8d %7d %8d %5.0f %5.1f %9.0f %8.0f %8.0f %5.2f' % (c, o['atk'], o['def'], o['hp'], o['crit'], o['dodge'], o['dps'], o['heal'], o['shield'], o['manaF']))
print('\nSegundos que tarda la FILA en derrotar a la COLUMNA (entre paréntesis: ventaja; >1 gana la fila)')
print('%-10s' % '' + ''.join('%14s' % c[:10] for c in cls))
for a in cls: print('%-10s' % a + ''.join('%7.0fs(%4.2f)' % (res[a][b]['t'], res[a][b]['win']) for b in cls))
import math
power = {a: math.exp(sum(math.log(res[a][b]['win']) for b in cls if b != a) / (len(cls) - 1)) for a in cls}
print('\nFuerza media en duelo (1.00 = igualado):')
for a in sorted(cls, key=lambda a: -power[a]): print('  %-10s %.2f' % (a, power[a]))
print('JSON', json.dumps(power))
