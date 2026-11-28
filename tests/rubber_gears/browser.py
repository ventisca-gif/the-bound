"""Check locked Rubber Gear cards and render their preview sprites on the game map."""
import os
from pathlib import Path
import sys

from playwright.sync_api import sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM'))
    page = browser.new_page(viewport={'width': 1120, 'height': 650}, has_touch=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda msg: errors.append(msg.text) if msg.type in ('warning', 'error') and 'hook ' in msg.text else None)
    page.route('https://raw.githubusercontent.com/**/update/version.json*', lambda route: route.abort())
    page.goto(sys.argv[1])
    page.locator('#tNew').click()
    page.locator('[data-c="guerrero"]').click()
    page.locator('#ccName').fill('Prueba Goma')
    page.locator('#ccGo').click()
    page.locator('#introOk').click()
    page.wait_for_function('G.P && document.querySelector("#bHub")')
    page.locator('#bHub').click()
    page.locator('#bTrans').click()
    cards = page.locator('#rubberGearCards')
    cards.wait_for()
    assert cards.locator('.gsrc').count() == 2
    assert cards.locator('.gsrc button').count() == 0
    assert 'Requiere' in cards.inner_text()
    if len(sys.argv) > 2:
        output = Path(sys.argv[2])
        output.mkdir(parents=True, exist_ok=True)
        cards.screenshot(path=output / 'panel.png')
    page.evaluate('closeModal(); G.P.fruit = "humo"')
    assert page.locator('#bRubberGear').count() == 0
    page.evaluate('G.P.fruit = "goma"; dfSyncSkills()')
    original = page.evaluate('JSON.stringify([G.P.S, G.P.slots, G.P.skills, G.P.srF])')
    page.locator('#bHub').click()
    page.locator('#bRubberGear').click()
    cards.wait_for()
    assert 'Ya tienes' in cards.inner_text()
    assert cards.locator('.gsrc button').count() == 0
    assert page.evaluate('RUBBER_GEARS.every(g => g.techniques.length === 4)')
    for index in range(4):
        cards.locator(f'[data-rubber-demo="{index}"]').click()
    assert original == page.evaluate('JSON.stringify([G.P.S, G.P.slots, G.P.skills, G.P.srF])')
    page.evaluate('closeModal(); G.P.fruit = null')
    page.wait_for_function('document.querySelector("#bRubberGear").style.display === "none"')
    page.evaluate("""() => {
      window.gearShot = {};
      const cache = new Map();
      hookBefore('drawEnt', (e, cx, cy) => {
        const shot = window.gearShot;
        if (e !== G.P || !shot.form) return;
        const key = [shot.form, shot.dir, shot.sex, shot.anim, shot.frame].join();
        if (!cache.has(key)) {
          const P = {...e, app: {...e.app, g: shot.sex, hair: shot.sex === 'f' ? 'rojo' : 'negro'}};
          const draw = shot.form === 3 ? rubberGearThree : rubberGearFour;
          cache.set(key, draw(P, rubberGearPreviewAtlas(P), shot.dir, shot.anim, shot.frame));
        }
        const size = shot.form === 3 ? 1 : .74;
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(cache.get(key), Math.round(e.x - cx - 64 * size), Math.round(e.y - cy - 106 * size), 128 * size, 118 * size);
        ctx.restore();
        return HOOK_SKIP;
      });
    }""")
    for form in (3, 4):
        for sex in ('f', 'm'):
            for direction in ('down', 'up', 'left', 'right'):
                assert page.evaluate("""([form, sex, dir]) => {
                  const P = {...G.P, app: {...G.P.app, g: sex}};
                  const A = rubberGearPreviewAtlas(P);
                  const draw = form === 3 ? rubberGearThree : rubberGearFour;
                  const pixels = (anim, f) => draw(P, A, dir, anim, f).getContext('2d')
                    .getImageData(0,0,128,118).data;
                  const idle = pixels('idle', 0);
                  return idle.some((v,i) => i % 4 === 3 && v === 255) &&
                    pixels('walk', 2).some((v,i) => v !== idle[i]) &&
                    pixels('atk', 1).some((v,i) => v !== idle[i]);
                }""", [form, sex, direction])
                if len(sys.argv) > 2:
                    page.evaluate('shot => window.gearShot = shot', dict(form=form, sex=sex, dir=direction, anim='walk', frame=2))
                    page.wait_for_timeout(70)
                    page.screenshot(path=output / f'{form}-{sex}-{direction}.png')
    assert not errors, errors
    print('PASS: locked UI, fruit shortcut, unchanged player state, and both models in four directions with idle, walk and attack poses.')
    browser.close()
