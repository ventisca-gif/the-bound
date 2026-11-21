"""Smoke-test the Amazon route and records from a real Chromium session."""
from pathlib import Path
import json
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
URL = (ROOT / 'dist/test.html').as_uri()
OUTPUT = Path(os.environ.get('SELVA_TEST_OUT', '/tmp/thebound-selva'))
OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'),
                                 args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
    page = browser.new_page(viewport={'width':1280,'height':720}, has_touch=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(URL)
    page.wait_for_selector('#tNew')
    page.click('#tNew')
    page.fill('#ccName','Ventisca')
    page.click('#ccGo')
    page.click('#introOk')
    page.evaluate("SETTINGS.sfx=0; G.P.gold=9999; goLima();")
    page.wait_for_function("G.map.id==='lima' && !G.fading && G.fade<.05")
    page.evaluate("""() => {
      const terminal = G.map.objs.find(o => o.xact === 'lm_aeropuerto');
      G.P.x=terminal.px; G.P.y=terminal.py+12; doInteract();
    }""")
    page.wait_for_function("G.map.id==='pe_terminal' && !G.fading && G.fade<.05")

    def talk(id):
        page.evaluate("""id => {
          const e=G.ents.find(n => n.id===id && n.map===G.map.id && !n.remove);
          G.P.x=e.x; G.P.y=e.y+12; doInteract();
        }""", id)

    talk('pe_taquilla')
    ticket = page.locator('#dopts button', has_text='Billete a la Selva peruana')
    ticket.click()
    assert page.evaluate("G.P.gold===9999 && !G.P.selvaTicket")
    page.evaluate("G.P.gold=20000; G.P.aeTk='es';")
    ticket.click()
    ticket.click()
    assert page.evaluate("G.P.gold===10000 && G.P.selvaTicket && G.P.aeTk==='es'")
    page.screenshot(path=str(OUTPUT/'jorge_chavez.png'))
    page.evaluate("saveGame(true)")
    page.reload()
    page.locator('#tslots [data-slot]').click()
    assert page.evaluate("G.map.id==='pe_terminal' && G.P.gold===10000 && G.P.selvaTicket")
    page.evaluate("""() => {
      const gate = G.map.objs.find(o => o.xact==='selva_embarcar');
      G.P.x=gate.px; G.P.y=gate.py+10;
      window.testAEB = aeBoarding;
      aeBoarding=()=>({open:false,wait:12}); doInteract();
    }""")
    assert '12 segundos' in page.locator('#modal').inner_text()
    page.evaluate("closeModal(); aeBoarding=()=>({open:true,wait:0}); doInteract();")
    page.locator('#plGo').wait_for()
    assert page.evaluate("G.map.plane && G.P.plane && G.P.selvaTicket")
    assert page.evaluate("serializeP(G.P).selvaStay.m === 'pe_terminal'")
    page.locator('#plGo').click()
    page.wait_for_function("G.map.id==='selva' && !G.fading && G.fade<.05", timeout=18000)
    assert page.evaluate("G.P.gold===10000 && !G.P.selvaTicket && G.P.aeTk==='es'")
    page.evaluate("aeBoarding=window.testAEB; G.time=11*60")

    assert 'Selva peruana' in page.locator('#zone').inner_text()
    map_check = page.evaluate("""() => {
      const M=G.map, seen=new Uint8Array(M.w*M.h), q=[M.I(...SELVA_AIR_SPAWN)];
      seen[q[0]]=1;
      for(let i=0; i<q.length; i++) {
        const id=q[i], x=id%M.w, y=id/M.w|0;
        for (const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nx=x+dx,ny=y+dy,k=M.I(nx,ny);
          if (!seen[k] && !blockedFor(M,nx,ny,0)) { seen[k]=1; q.push(k); }
        }
      }
      const count = G.ents.filter(e=>e.map===M.id&&e.type==='npc');
      const neighbors=(x,y)=>[[x+1,y],[x-1,y],[x,y+1],[x,y-1],[x,y]].some(([a,b])=>seen[M.I(a,b)]);
      return {size:[M.w,M.h],reachable:SELVA_POI.map(([,x,y])=>neighbors(x,y)),residents:count.length,
        reachableResidents:count.every(e=>neighbors(e.x>>4,e.y>>4)), objects:M.objs.length,
        maxCell:Math.max(...M.objGrid.map(a=>a.length)), cache:M.chunks.size};
    }""")
    assert map_check['size'] == [720,360] and all(map_check['reachable']), map_check
    assert map_check['residents'] == 21 and map_check['reachableResidents'], map_check
    assert map_check['objects'] < 8500 and map_check['cache'] <= 90, map_check

    for id, name, word, answer in [('ag_luz','shipibo-konibo','jene','Agua de río'),
                                   ('ta_elena','asháninka','nampi','Comunidad')]:
        page.evaluate("""id => {
          const e=G.ents.find(n=>n.id===id&&n.map==='selva');
          setMap(G.map,e.x,e.y+12,'up');
        }""", id)
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUTPUT/f'{id}.png'))
        talk(id)
        page.locator('#dopts button',has_text=f'Aprender {name}').click()
        page.locator('#dmsg').click()
        assert word in page.locator('#dmsg').inner_text()
        page.locator('#dopts button',has_text='Practicar').click()
        page.locator('#modal button',has_text=answer).click()
        assert '¡Correcto!' in page.locator('#modal').inner_text()
        page.locator('[data-xb=x]').click()

    page.evaluate("openPanel('map')")
    assert 'Cocha Espejo' in page.locator('#mwList').inner_text()
    assert 'Tambo del Bosque' in page.locator('#mwList').inner_text()
    page.screenshot(path=str(OUTPUT/'mapa_selva.png'))
    page.evaluate("closePanel(); saveGame(true)")
    coords = page.evaluate("[G.P.x,G.P.y]")
    page.reload()
    page.locator('#tslots [data-slot]').click()
    assert page.evaluate("G.map.id==='selva' && G.P.gold===10000")
    assert page.evaluate("[G.P.x,G.P.y]") == coords

    talk('selva_piloto')
    page.locator('#dopts button',has_text='Volver a Lima').click()
    page.locator('#plGo').wait_for()
    assert page.evaluate("serializeP(G.P).selvaStay.m === 'selva'")
    page.locator('#plGo').click()
    page.wait_for_function("G.map.id==='pe_terminal' && !G.fading && G.fade<.05",timeout=18000)
    assert page.evaluate("G.P.gold===10000 && G.P.aeTk==='es'")
    page.evaluate("exitInterior()")
    page.wait_for_function("G.map.id==='lima' && !G.fading && G.fade<.05")
    assert page.locator('#errlog').is_hidden(), page.locator('#errlog').inner_text()
    assert not errors, errors
    print(json.dumps(map_check,ensure_ascii=False))
    browser.close()
