import sys
from playwright.sync_api import sync_playwright
url,out,cfg=sys.argv[1],sys.argv[2],sys.argv[3]
extra=sys.argv[4] if len(sys.argv)>4 else None
JS=r"""(CFG => { const P=G.P; const res=[]; const c=document.createElement('canvas'); const S=3, CW=80, CH=64; const cols=[['idle','down',0],['walk','left',1],['idle','up',0]];
c.width=CW*S*cols.length*2+20; c.height=(CH*S+20)*Math.ceil(CFG.length/2); const x=c.getContext('2d'); x.fillStyle='#4a7a3a'; x.fillRect(0,0,c.width,c.height); x.imageSmoothingEnabled=false;
CFG.forEach(([lab,sr,f,eq,cos,sc,fus],i)=>{ P.fus=0; G._fx=null; P._tejTest=1; P.equip={}; for(const k in eq) P.equip[k]={id:eq[k]}; P.cos=cos||{}; P.sr=sr; P.srF=f; P.srC=sc||P.srC; P.srOwn=[sr]; if(!P.skills) P.skills={}; refreshLook(); const A=P.atlas; const ox=(i%2)*(CW*S*cols.length+20), oy=Math.floor(i/2)*(CH*S+20);
 cols.forEach(([an,d,fr],k)=>{ x.drawImage(A.img,(A.idx[an]+fr)*A.fw,['down','left','right','up'].indexOf(d)*A.fh,A.fw,A.fh,ox+k*CW*S+(CW-A.fw)*S/2,oy+20+(CH-A.fh)*S,A.fw*S,A.fh*S); }); x.fillStyle='#fff'; x.font='bold 15px sans-serif'; x.fillText(lab,ox+4,oy+15); });
document.body.innerHTML=''; document.body.appendChild(c); c.id='sheet'; return [P.atlas.fw,P.atlas.fh]; })"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':1600,'height':1200}); pg.goto(url); pg.wait_for_timeout(2500)
    for s in ['#tNew']: pg.click(s)
    pg.wait_for_timeout(400); pg.fill('#ccName','Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk',timeout=2000)
    except Exception: pass
    if extra: pg.add_script_tag(path=extra)
    print(pg.evaluate('('+JS+')('+cfg+')')); pg.locator('#sheet').screenshot(path=out); b.close()
