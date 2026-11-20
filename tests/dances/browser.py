from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[2];O=R/'tests/dances/out';O.mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--no-sandbox','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
 p=b.new_page(viewport={'width':1280,'height':760},device_scale_factor=2);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
 try:
  p.goto((R/'dist/test.html').as_uri());p.wait_for_timeout(1500);p.click('#tNew');p.wait_for_timeout(300);p.fill('#ccName','Ventisca');p.click('#ccGo');p.wait_for_timeout(1500);p.click('#introOk');p.wait_for_timeout(300)
  p.evaluate('G.paused=true;G.noSave=true;SETTINGS.sfx=0;setHD(true)')
  result=p.evaluate((R/'tests/dances/check.js').read_text());print(json.dumps(result),flush=True)
  p.evaluate("()=>{G.P.gold=100000;G.P.dances=['clasico','macarena'];G.P.cosAuraOwn=['violeta'];G.P.cosAura='violeta';G.P.app={...DEF_APP,g:'f',bt:1,hs:ADO_HS.f,hair:'ado',eyes:'celeste'};refreshLook();openPanel('wardrobe');}")
  p.locator('[data-wdance]').click();p.wait_for_timeout(350);assert p.locator('[data-dbuy]').count()==10
  p.locator('[data-dpreview="merlina"]').click();p.wait_for_timeout(300);assert p.evaluate("G.P.gold===100000&&!G.P.dances.includes('merlina')")
  p.screenshot(path=str(O/'01_armario_bailes.png'));p.locator('[data-dbuy="merlina"]').click();p.wait_for_timeout(300);assert p.evaluate("G.P.gold===88000&&G.P.dances.includes('merlina')")
  p.locator('#wdRot').click();p.wait_for_timeout(250);p.locator('#wdMyDances').click();assert p.locator('#emoPop').is_visible();assert p.locator('[data-emd="merlina"]').count()==1
  p.screenshot(path=str(O/'02_boton_bailes_existente.png'));p.locator('[data-emd="merlina"]').click();assert p.evaluate("G.P.dk==='merlina'&&G.P.anim==='dance'")
  p.evaluate('G.paused=false');p.wait_for_timeout(800);p.screenshot(path=str(O/'03_baile_en_juego.png'))
  # All ten purchase controls are reachable on mobile; preview and buying preserve auras.
  p.set_viewport_size({'width':840,'height':420});p.evaluate("G.paused=true;openPanel('wardrobe');wdMode='dance';renderPanel()");p.wait_for_timeout(300);p.locator('[data-dbuy="merlina"]').scroll_into_view_if_needed();assert p.locator('[data-dbuy="merlina"]').is_visible();p.screenshot(path=str(O/'04_armario_movil.png'))
  p.locator('[data-waura]').click();assert p.locator('[data-cab]').count()==6;p.locator('[data-wdance]').click();assert p.locator('[data-dbuy]').count()==10
  assert p.evaluate("G.P.cosAura==='violeta'&&ERR_SEEN.size===0"),p.evaluate('[...ERR_SEEN]');assert not errs,errs
  result['ui']={'freePreview':True,'goldPurchase':True,'existingButton':True,'mobileScroll':True,'aurasPreserved':True};result['errors']=errs;(O/'result.json').write_text(json.dumps(result,indent=2))
 finally:b.close()
