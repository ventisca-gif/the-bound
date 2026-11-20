from pathlib import Path
import base64,json,os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[2];O=R/'tests/auras/out';O.mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--no-sandbox','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
 p=b.new_page(viewport={'width':1280,'height':760},device_scale_factor=2);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
 try:
  p.goto((R/'dist/test.html').as_uri());p.wait_for_timeout(1500);p.click('#tNew');p.wait_for_timeout(400);p.fill('#ccName','Ventisca');p.click('#ccGo');p.wait_for_timeout(1600);p.click('#introOk');p.wait_for_timeout(400)
  p.evaluate('G.paused=true;G.noSave=true;SETTINGS.sfx=0;setHD(true)')
  result=p.evaluate((R/'tests/auras/check.js').read_text());print(json.dumps(result),flush=True)
  p.evaluate("()=>{G.P.gold=200000;G.P.cosAuraOwn=[];G.P.cosAura=null;G.P.app={...DEF_APP,g:'f',bt:1,hs:ADO_HS.f,hair:'ado',eyes:'celeste'};refreshLook();openPanel('wardrobe');}");p.wait_for_timeout(300)
  assert p.locator('[data-waura]').count()==1
  p.locator('[data-waura]').click();p.wait_for_timeout(300);assert p.locator('[data-cab]').count()==6
  # Preview does not spend gold or silently equip a locked aura.
  p.locator('[data-cap="violeta"]').click();p.wait_for_timeout(300);assert p.evaluate('G.P.gold===200000&&G.P.cosAura===null')
  p.screenshot(path=str(O/'01_armario_auras_vista_previa.png'))
  p.locator('[data-cab="violeta"]').click();p.wait_for_timeout(300);assert p.evaluate("G.P.gold===175000&&G.P.cosAura==='violeta'&&G.P.cosAuraOwn.includes('violeta')")
  p.screenshot(path=str(O/'02_compra_oro_equipo.png'))
  p.locator('#wdRot').click();p.wait_for_timeout(250);p.locator('#caNone').click();p.wait_for_timeout(250);assert p.evaluate('G.P.cosAura===null&&G.P.gold===175000')
  p.evaluate("cosAuraBuy('tormenta');closePanel();G.paused=false;G.P.x=1880;G.P.y=2460;updateCamera(0,true)");p.wait_for_timeout(600);p.screenshot(path=str(O/'03_aura_dentro_juego.png'))
  # Mobile wardrobe: all six purchase buttons remain reachable by scrolling.
  p.set_viewport_size({'width':840,'height':420});p.evaluate("openPanel('wardrobe');wdMode='aura';renderPanel()");p.wait_for_timeout(350);p.locator('[data-cab="jardin"]').scroll_into_view_if_needed();assert p.locator('[data-cab="jardin"]').is_visible();p.screenshot(path=str(O/'04_armario_movil.png'))
  assert not errs,errs;result['errors']=errs;result['ui']={'previewFree':True,'purchase':True,'removeFree':True,'mobileScroll':True};(O/'result.json').write_text(json.dumps(result,indent=2))
 finally:b.close()
