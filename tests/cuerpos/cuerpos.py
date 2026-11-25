"""6.23 · Estructuras nuevas (10 de hombre, 12 de mujer) y forma de ojos a elegir.
Comprueba: número de estructuras, normApp por sexo, eyst, editor (filas Estructura y Forma de ojos), y que cada
estructura nueva se dibuja sin errores con las 19 transformaciones, Pez en sus etapas, nadar, bailes y posturas.
La ropa la revisa tools/dev/fitcheck.py (en reg.sh).
Uso: python3 tests/cuerpos/cuerpos.py file://$PWD/dist/test.html"""
import sys, json
from playwright.sync_api import sync_playwright
JS = r"""(() => { const P = G.P, errs = [], dk = Object.keys(DANCES).filter(k => DANCES[k].pose).slice(0, 3), wk = Object.keys(WM_POS); let n = 0;
  const forms = [[null, 0]]; for (const k of Object.keys(SR)) for (const [f] of SR_FORMS(k)) forms.push([k, f]);
  for (const g of ['m', 'f']) for (let bt = 4; bt < BODY_T[g].length; bt++) for (const eyst of ['', 'hero', 'big']) {
    try { P.cls = 'guerrero'; P.app = { ...DEF_APP, g, bt, ...(eyst ? { eyst } : {}) };
      for (const [k, f] of forms) { P.sr = k; P.srF = k ? f : 0; P.srOwn = Object.keys(SR); playerAtlas(P); n++; }
      P.sr = null; P.srF = 0; swimAtlasFor(P); for (const d of dk) danceAtlasFor(P, d); for (const w of wk) stanceAtlasFor(P, w);
      P.cls = 'pez'; for (const pz of [1, 2]) { P.app.pz = pz; playerAtlas(P); swimAtlasFor(P); n += 2; } } catch (e) { errs.push(g + bt + eyst + ': ' + e.message); } }
  P.cls = 'guerrero'; P.app = { ...DEF_APP };
  return { m: BODY_T.m.length, f: BODY_T.f.length, fit: FIT_BODIES.length, draws: n, errs,
    nf11: normApp({ ...DEF_APP, g: 'f', bt: 11 }).bt, nm10: normApp({ ...DEF_APP, g: 'm', bt: 10 }).bt, ey: normApp({ ...DEF_APP, eyst: 'sharp' }).eyst, eyBad: normApp({ ...DEF_APP, eyst: 'x' }).eyst,
    eyeApplied: heroLook('guerrero', { ...DEF_APP, g: 'm', eyst: 'big' }, { weapon: 1 }, {}).btS.eye }; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 915, 'height': 412}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(500)
    ui = pg.evaluate("()=>{const b=[...document.querySelectorAll('[data-ek=bt]')].find(b=>b.dataset.ev==='11');b.click();const e=[...document.querySelectorAll('[data-ek=eyst]')].find(b=>b.dataset.ev==='soft');e.click();return [document.querySelectorAll('[data-ek=bt]').length,document.querySelectorAll('[data-ek=eyst]').length,CC.app.bt,CC.app.eyst]}")
    pg.fill('#ccName', 'Cuerpos'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    kept = pg.evaluate("()=>[G.P.app.bt,G.P.app.eyst]")
    R = pg.evaluate(JS); R['ui'] = ui; R['kept'] = kept; R['pageErrors'] = errs
    print(json.dumps(R, ensure_ascii=False, indent=1))
    assert R['m'] == 10 and R['f'] == 12 and R['fit'] == 22 and not R['errs'] and R['nf11'] == 11 and R['nm10'] is None and R['ey'] == 'sharp' and R['eyBad'] is None and R['eyeApplied'] == 'big', R
    assert ui == [12, 7, 11, 'soft'] and kept == [11, 'soft'] and not errs, R
    print('OK'); b.close()
