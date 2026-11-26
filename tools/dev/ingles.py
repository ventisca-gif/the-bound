# Comprueba en inglés (?lang=en) las ventanas nuevas de la 6.32-6.39 y avisa si queda texto en español.
# uso: python3 tools/dev/ingles.py file://$PWD/dist/test.html
import sys, json, re
from playwright.sync_api import sync_playwright
url = sys.argv[1] + '?lang=en'
JS = r"""(async () => { const P = G.P, sleep = ms => new Promise(r => setTimeout(r, ms)), T = {}; const grab = (k, el) => { T[k] = ((el || document.querySelector('#modal')) || {}).innerText || ''; };
  P.lv = 130; calcStats(P);
  qhOpen(); await sleep(200); grab('quehago'); closeModal();
  curseOpen(); await sleep(100); grab('malditos'); closeModal();
  P.jobs.agricultura.lv = 10; giveItem('sem_trigo', 3, true); giveItem('sem_melon', 2, true); const o = G.world.objs.find(o => o.k === 'plot'); delete P.farm[o.pid]; farmAction(o); await sleep(100); grab('huerto'); closeModal();
  P.dead = false; giveItem('b_10', 1, true); const i = P.inv.findIndex(s => s.id === 'b_10'); P.inv[i].ql = 'buena'; openPanel('inv'); invSel = i; renderPanel(); await sleep(100); grab('inventario', document.querySelector('#pbody .ihead')); closePanel && closePanel();
  P.cls = 'mago'; P.lv = 600; P.skills = { m19: 10 }; calcStats(P); openPanel('skills'); skSel = 'm19'; renderPanel(); await sleep(100); grab('habilidad', document.querySelector('#pbody .stats')); try { closePanel(); } catch (e) {}
  const k = Object.keys(ROM)[0]; P.partner = k; P.kids = [{ id: 'kq1', name: 'Blake', g: 'm', app: { g: 'm' }, born: 0, parent: k }]; P.kids[0].ag0 = calDay(); P.kids[0].agY = 87; kidDie(P.kids[0]); await sleep(200);
  cmSync(); const g = SA.famG.find(o => !o.hidden); XACT.cm_fam[2](g); await sleep(100); grab('tumba'); document.querySelector('#lwGo').click(); await sleep(100); grab('palabras'); closeModal();
  romanceMenu({ id: k, x: P.x, y: P.y }); await sleep(100); T.pareja = [...document.querySelectorAll('#dopts button')].slice(0, 3).map(b => b.innerText).join(' | ') + ' || ' + ((document.querySelector('#dtext') || {}).innerText || '');
  T.luto = lutoLine(P.fallen[0]) + ' || ' + lutoDate(5) + ' || ' + lutoAgo(P.fallen[0]);
  T.poi = worldPOI().filter(q => q.c === 'cem').map(q => q.t).join(' | ') + ' || ' + MAPC.cem[0];
  T.gsis = GSIS.filter(g => /634|635|636|633|639|camposanto/.test(g[0])).map(g => g[1] + ': ' + g[2]().join(' ')).join('\n');
  T.bruja = BC_COS.map(c => c[1]).join(' | ');
  T.toastq = (() => { const a = []; const _t = window.toast; return ''; })();
  return T; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 900, 'height': 500}); pg.goto(url); pg.wait_for_timeout(3000)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Test'); pg.click('#ccGo'); pg.wait_for_timeout(2500)
    try: pg.click('#introOk', timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(800); T = pg.evaluate(JS); b.close()
SP = re.compile(r"[áéíóúñ¿¡]|\b(de|la|el|los|las|con|para|tu|tus|que|nivel|hijo|días|años|Nació|murió|hace|Tienes|Falta|armadura|Herrería|Llévame|oficio|monstruos)\b")
for k, v in T.items():
    bad = [l for l in v.split('\n') if SP.search(l)]
    print('==', k, 'OK' if not bad else 'ESPAÑOL:', '|', v.replace(chr(10),' ')[:230]); [print('   ', l[:180]) for l in bad[:8]]
