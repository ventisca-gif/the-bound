from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json,base64,io
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/skill_preview/out';OUT.mkdir(exist_ok=True)
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files']);pg=b.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 try:
  pg.goto((ROOT/'update/thebound.html').as_uri());pg.wait_for_timeout(2000)
  audit=pg.evaluate('''()=>{const kinds=new Set(['buff','heal','shield','nova','rain','field','meteor','vortex','summon','army','kingsoul','sumbuff','concert','beams','skyfall']);const skills=Object.values(SK).filter(s=>AP_CLASSES.includes(s.cls)).map(s=>({id:s.id,cls:s.cls,name:s.n,type:s.type,kind:s.eff?.k,art:s.eff?.art,pose:s.type==='act'?(SK_HOP[s.id]?.[2]||(['slam','leap'].includes(s.eff?.k)?'slam':kinds.has(s.eff?.k)?'cast':'atk')):null,cd:s.cd,mp:s.mp,extra:!!SK_EXTRA[s.id]}));return{version:GAME_VER,build:GAME_BUILD,bodies:BODY_T,classes:AP_CLASSES.map(cls=>({id:cls,name:CLASSES[cls].n,active:skills.filter(s=>s.cls===cls&&s.type==='act').length,passive:skills.filter(s=>s.cls===cls&&s.type==='pas').length})),skills};}''')
  pg.add_script_tag(content=(ROOT/'tests/skill_preview/sample.js').read_text())
  cases=pg.evaluate('SP_CASES');audit['examples']=cases;audit['previewOnly']=True;audit['frames']=0
  for case in cases:
   cls=case['cls'];frames=[]
   for f in range(24):
    data=pg.evaluate('(a)=>spFrame(a[0],a[1])',[cls,f]);im=Image.open(io.BytesIO(base64.b64decode(data.split(',')[1]))).convert('RGB');frames.append(im);audit['frames']+=10
   # Una paleta para todo el ciclo evita que el color fluctúe entre cuadros.
   montage=Image.new('RGB',(frames[0].width,frames[0].height*len(frames)))
   for i,im in enumerate(frames):montage.paste(im,(0,i*im.height))
   palette=montage.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
   indexed=[im.quantize(palette=palette,dither=Image.Dither.NONE)for im in frames]
   indexed[0].save(OUT/f'{cls}_diez_cuerpos.gif',save_all=True,append_images=indexed[1:],duration=100,loop=0,optimize=False,disposal=2)
   frames[10].save(OUT/f'{cls}_muestra.png');print(cls,'24 frames, 10 original bodies',flush=True)
  assert not errors,errors;audit['errors']=errors
  (OUT/'revision.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));print(json.dumps(audit['classes'],ensure_ascii=False),flush=True)
 finally:b.close()
