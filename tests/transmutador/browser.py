"""Exercise creation, transformation, combat and save restoration in the full game."""
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path='/usr/bin/google-chrome')
    page = browser.new_page(viewport={'width': 1280, 'height': 760})
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
    page.wait_for_function('G.P?.cls === "transmutador" && tmImage.naturalWidth > 0')
    human = page.evaluate('G.P.equip.weapon.id')
    page.locator('#tmControls button').first.click()
    page.wait_for_function('tmActive(G.P) && G.P.atlas === tmAtlas()')
    assert page.locator('#tmControls button img').count() == 5
    assert page.evaluate('(() => { G.P.delay = 0; G.P.busy = 0; basicAttack(); return G.P.atkCd > 0; })()')
    for i in range(5):
        page.evaluate('G.P.busy = 0; G.P.mp = G.P.S.maxmp')
        page.locator('#tmControls button').nth(i + 1).click()
        assert page.evaluate('(i) => G.P.cds["tm_fire_" + i] > 0', i)
    page.evaluate('G.P.busy = 0')
    page.locator('#tmControls button').first.click()
    page.wait_for_function('!tmActive(G.P)')
    assert page.evaluate('G.P.equip.weapon.id') == human
    assert page.evaluate('serializeP(G.P).cls') == 'transmutador'
    assert not errors, errors
    print('PASS: creation, fire atlas, five skill controls, basic punch and human equipment')
