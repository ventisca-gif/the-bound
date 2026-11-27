"""Prueba: equipar/quitar objetos malditos y normales no deja estadísticas cambiadas para siempre.
Uso: python3 tests/malditos_stats.py file://$PWD/dist/test.html
Usa las funciones reales del juego (equipFromInv, unequip, calcStats, pactos de las armas malditas) y compara con la base.
"""
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1200, 'height': 700})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(url); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    res = pg.evaluate("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), P = G.P, out = { cases: [] }; try {
      const ca = () => { try { closeModal(); closeDialog(); } catch (e) { } G.paused = false; }; ca();
      P.lv = 160; P.attr = { str: 400, int: 50, dex: 120, vit: 300 }; calcStats(P); P.hp = P.S.maxhp;
      const KEYS = ['atk', 'def', 'maxhp', 'maxmp', 'crit', 'critD', 'spd', 'aspd', 'life', 'dodge', 'power'];
      const snap = () => { calcStats(P); const o = {}; for (const k of KEYS) o[k] = P.S[k]; o.attr = JSON.stringify(P.attr); o.lock = P.lockSlot; o.aggro = !!P.curseAggro; return o; };
      const diff = (a, b) => { const d = []; for (const k in a) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) d.push(k + ':' + a[k] + '→' + b[k]); return d; };
      const eq = (id, extra) => { giveItem(id, 1); const i = P.inv.findIndex(s => s && s.id === id && !s.pact && !s.dom && !s.pur); if (extra) Object.assign(P.inv[i], extra); equipFromInv(i); ca(); };
      const un = s => { unequip(s); ca(); };
      // equipo normal de partida (mejor de nivel 160 para guerrero, sin malditos)
      const best = s => Object.keys(ITEMS).filter(id => { const it = ITEMS[id]; return it.slot === s && (!it.cls || it.cls === P.cls) && (it.lv || 1) <= 160 && !it.cos && !it.quest && !it.curse && !it.cursedW && it.price > 0; }).sort((a, b) => (ITEMS[b].lv || 1) - (ITEMS[a].lv || 1))[0];
      const NORMAL = {}; for (const s of ['weapon', 'head', 'body', 'legs', 'feet', 'acc', 'neck']) { const id = best(s); if (id) { NORMAL[s] = id; eq(id); } }
      await w(300); const S0 = snap(); out.base = S0; out.normal = NORMAL;
      const ORIG = {}; for (const s in NORMAL) ORIG[s] = JSON.stringify(P.equip[s]);
      const restore = () => { for (const s in NORMAL) { if (JSON.stringify(P.equip[s]) !== ORIG[s]) { if (P.equip[s]) un(s); const i = P.inv.findIndex(x => x && JSON.stringify(x) === ORIG[s]); if (i >= 0) { equipFromInv(i); ca(); } } } };
      const wc = 'wc_' + P.cls; await w(300); ca();
      const CURSE = [['anillo_maldito', 'acc'], ['collar_sangriento', 'neck'], ['yelmo_vacio', 'head'], [wc, 'weapon', { pact: 'def' }], [wc, 'weapon', { pact: 'skill' }], [wc, 'weapon', { pact: 'aggro' }], [wc, 'weapon', { dom: 1 }], [wc, 'weapon', { pur: 1 }]];
      // 1) cada maldito solo: aplica su efecto y al quitarlo todo vuelve igual
      for (const [id, s, ex] of CURSE) { eq(id, ex); await w(250); ca(); const S1 = snap(); restore(); await w(100); const S2 = snap(); out.cases.push({ id: id + (ex ? JSON.stringify(ex) : ''), cambia: diff(S0, S1).slice(0, 4), vuelve: diff(S0, S2) }); }
      // 2) varios malditos a la vez (anillo + collar + yelmo + arma con pacto): se suman los efectos y al quitarlos vuelve igual
      eq('anillo_maldito'); eq('collar_sangriento'); eq('yelmo_vacio'); eq(wc, { pact: 'def' }); await w(250); ca(); const Sall = snap(); restore(); await w(100); const Sback = snap();
      out.todos = { atk: Sall.atk + ' (base ' + S0.atk + ')', crit: Sall.crit + ' (base ' + S0.crit + ')', def: Sall.def, maxhp: Sall.maxhp, spd: Sall.spd, vuelve: diff(S0, Sback) };
      // dos iguales no se acumulan (dos anillos malditos no existen a la vez: un solo hueco de anillo); pacto + anillo sí se suman
      eq('anillo_maldito'); const Sr = snap(); restore(); eq(wc, { pact: 'aggro' }); const Sp = snap(); restore(); eq('anillo_maldito'); eq(wc, { pact: 'aggro' }); const Srp = snap(); restore();
      out.suma = { anillo: Sr.atk, pacto: Sp.atk, ambos: Srp.atk, esperado_aprox: Math.round(S0.atk * (Sr.atk / S0.atk) * (Sp.atk / S0.atk)) };
      // 3) 300 cambios al azar entre malditos y normales; al final, con el equipo normal, todo igual que al principio
      const pool = CURSE.concat(Object.entries(NORMAL).map(([s, id]) => [id, s])); let ops = 0;
      for (let k = 0; k < 300; k++) { const [id, s, ex] = pool[Math.floor(Math.random() * pool.length)]; if (Math.random() < 0.3 && P.equip[s]) un(s); else eq(id, ex); ops++; if (P.inv.length > 800) P.inv = P.inv.filter(x => x && Object.values(ORIG).includes(JSON.stringify(x))); }
      restore(); await w(300); ca(); const Send = snap(); out.azar = { ops, vuelve: diff(S0, Send), hp: [P.hp, P.S.maxhp], lockSlot: P.lockSlot, curseAggro: !!P.curseAggro };
      // 4) quitarlo todo y volver a ponerlo
      for (const s in NORMAL) un(s); const Snone = snap(); restore(); const Sre = snap(); out.desnudo = { atk: Snone.atk, vuelve: diff(S0, Sre) };
      // 6) arma maldita con pacto elegido en la ventana: al quitarla y ponerla conserva pacto, dominio y purificación
      const pk = {}; for (const pact of ['def', 'skill', 'aggro']) { un('weapon'); giveItem(wc, 1); let i = P.inv.findIndex(x => x && x.id === wc && !x.pact && !x.dom && !x.pur); equipFromInv(i); await w(400); const b2 = document.querySelector('#modal [data-pact="' + pact + '"]'); if (b2) b2.click(); await w(100); ca();
        const A1 = snap(), wp = JSON.stringify(P.equip.weapon); P.equip.weapon.domK = 77; const ref = P.equip.weapon; un('weapon'); i = P.inv.indexOf(ref); equipFromInv(i); await w(400); const offer = (!document.querySelector('#modal').hidden && !!document.querySelector('#modal [data-pact]')); ca(); const A2 = snap();
        pk[pact] = { elegido: wp, tras: JSON.stringify(P.equip.weapon), ataque: A1.atk + '→' + A2.atk, ofreceOtraVez: offer, sello: P.lockSlot }; un('weapon'); }
      for (const st of [{ dom: 1 }, { pur: 1 }]) { giveItem(wc, 1); let i = P.inv.findIndex(x => x && x.id === wc && !x.pact && !x.dom && !x.pur); Object.assign(P.inv[i], st); const ref = P.inv[i]; equipFromInv(P.inv.indexOf(ref)); await w(400); const o1 = (!document.querySelector('#modal').hidden && !!document.querySelector('#modal [data-pact]')); ca(); const ref2 = P.equip.weapon; un('weapon'); i = P.inv.indexOf(ref2); equipFromInv(i); await w(400); const o2 = (!document.querySelector('#modal').hidden && !!document.querySelector('#modal [data-pact]')); ca(); pk[st.dom ? 'dominada' : 'purificada'] = { tras: JSON.stringify(P.equip.weapon), ofrece: o1 || o2 }; un('weapon'); }
      restore(); out.pactos = pk; const Sfin = snap(); out.pactosVuelve = diff(S0, Sfin);
      // 5) guardar y cargar con un maldito puesto y luego quitarlo
      eq('anillo_maldito'); eq(wc, { pact: 'skill' }); saveGame(true); const raw = JSON.parse(JSON.stringify(P)); restore(); const Sx = snap(); out.guardar = { vuelve: diff(S0, Sx), lockSlotGuardado: raw.lockSlot };
      } catch (e) { out.ERR = String(e.stack || e).slice(0, 500); } return out; })()""")
    print(json.dumps(res, ensure_ascii=False, indent=1)); print('ERRS', errs[:6]); b.close()
