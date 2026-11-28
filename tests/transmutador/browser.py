"""Exercise creation, transformation, combat and save restoration in the full game."""
import shutil
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=shutil.which('google-chrome') or shutil.which('chromium'))
    page = browser.new_page(viewport={'width': 1280, 'height': 760}, has_touch=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'warning' and 'hook ' in msg.text else None)
    page.route('https://raw.githubusercontent.com/**/update/version.json*', lambda route: route.abort())
    page.goto(sys.argv[1])
    page.locator('#tNew').click()
    page.locator('[data-c="transmutador"]').click()
    page.locator('#ccName').fill('Prueba Fuego')
    page.locator('#ccGo').click()
    page.locator('#introOk').click()
    touch = page.context.new_cdp_session(page)
    def check_joystick(form):
        page.wait_for_function('TM_POSE_SHEET.naturalWidth && G.P.atlas.fw === 80')
        assert page.evaluate("""form => {
          const A = G.P.atlas, w = A.fw, h = A.fh, col = A.idx.idle, row = DIRI.down;
          const hd = mkCanvas(w * 2, h * 2).getContext('2d');
          const lo = mkCanvas(w * 2, h * 2).getContext('2d');
          hd.imageSmoothingEnabled = lo.imageSmoothingEnabled = false;
          atlasBlit(hd, A, col, row, 0, 0, w * 2, h * 2);
          lo.drawImage(A.img, col * w, row * h, w, h, 0, 0, w * 2, h * 2);
          const pixels = hd.getImageData(0, 0, w * 2, h * 2).data;
          const legacy = lo.getImageData(0, 0, w * 2, h * 2).data;
          let top = h * 2, bottom = 0;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 128) {
            const y = Math.floor(i / (w * 8));
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
          }
          const expected = {ascua: 36, prisma: 48, cefiro: 37, coloso: 43}[form];
          const portrait = mkCanvas(52, 52);
          drawPortrait(portrait, A);
          const portraitPixels = portrait.getContext('2d').getImageData(0, 0, 52, 52).data;
          return Math.abs((bottom - top + 1) - expected * 2) <= 3 &&
            pixels.some((pixel, i) => pixel !== legacy[i]) && !hd.imageSmoothingEnabled &&
            portraitPixels.some((pixel, i) => i % 4 === 3 && pixel === 255);
        }""", form), form
        joy = page.locator('#joy').bounding_box()
        x, y = joy['x'] + joy['width'] / 2, joy['y'] + joy['height'] / 2
        r = joy['width'] * 0.3
        page.evaluate('G.P.busy = 0')
        for direction, dx, dy in [('down', 0, r), ('up', 0, -r), ('left', -r, 0), ('right', r, 0)]:
            touch.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
            touch.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x + dx, 'y': y + dy}]})
            page.wait_for_function('d => G.P.dir === d && G.P.anim === "walk"', arg=direction)
            assert page.evaluate("""d => {
              const A = G.P.atlas, c = A.img.getContext('2d'), row = DIRI[d] * A.fh;
              const walks = Array.from({length: ANIMS.walk[1]}, (_, i) =>
                c.getImageData((A.idx.walk + i) * A.fw, row, A.fw, A.fh).data);
              const idle = c.getImageData(A.idx.idle * A.fw, row, A.fw, A.fh).data;
              return walks.some(walk => walk.some((pixel, i) => pixel !== idle[i])) &&
                idle.some((pixel, i) => i % 4 === 3 && pixel === 255) &&
                idle[3] === 0;
            }""", direction), (form, direction)
            touch.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            page.wait_for_function('d => G.P.dir === d && G.P.anim === "idle"', arg=direction)

    page.wait_for_function('G.P?.cls === "transmutador"')
    human = page.evaluate('G.P.equip.weapon.id')
    page.locator('#tmControls button').first.click()
    page.locator('[data-tmf="ascua"]').click()
    page.wait_for_function('tmActive(G.P) && G.P.atlas === tmAtlas()')
    check_joystick('ascua')
    assert page.locator('#tmControls button img').count() == 5
    assert page.evaluate('(() => { G.P.delay = 0; G.P.busy = 0; basicAttack(); return G.P.atkCd > 0; })()')
    for i in range(5):
        page.evaluate('G.P.busy = 0; G.P.mp = G.P.S.maxmp')
        page.locator(f'#tmControls [data-tmt="{i}"]').click()
        assert page.evaluate('(i) => G.P.cds["tm_ascua_" + i] > 0', i)
    # The other forms: switch from the bracelet selector, use the four techniques of each.
    for form in ['prisma', 'cefiro', 'coloso']:
        page.evaluate('G.P.busy = 0')
        page.locator('#tmControls [data-tm-swap]').click()
        page.locator(f'[data-tmf="{form}"]').click()
        page.wait_for_function('(f) => tmFormId(G.P) === f && tmActive(G.P) && G.P.atlas === tmAtlas()', arg=form)
        check_joystick(form)
        for i in range(4):
            page.evaluate('G.P.busy = 0; G.P.mp = G.P.S.maxmp')
            page.locator(f'#tmControls [data-tmt="{i}"]').click()
            assert page.evaluate('([f, i]) => G.P.cds["tm_" + f + "_" + i] > 0', [form, i]), (form, i)
        page.wait_for_timeout(900)
    page.evaluate('G.P.busy = 5; G.P.apts = 3; openPanel("char")')
    page.locator('.plus').first.click()
    page.evaluate('closePanel()')
    page.locator('#tmControls button').first.click()
    page.wait_for_function('!tmActive(G.P)')
    assert page.evaluate('G.P.equip.weapon.id') == human
    assert page.evaluate('serializeP(G.P).cls') == 'transmutador'
    page.evaluate("optApply(true, false); openPanel('opts')")
    assert page.locator('#oOpt').is_checked()
    page.locator('#oHD').check()
    page.wait_for_function("HDS === 2 && !OPT.on && OPT.manual")
    page.reload()
    page.wait_for_function("HDS === 2 && !OPT.on && OPT.manual")
    assert not errors, errors
    print('PASS: creation, return to human after spending points while busy, native HD, portrait, scale, four-direction touch joystick and idle for all forms, five skill controls, basic punch and human equipment')
