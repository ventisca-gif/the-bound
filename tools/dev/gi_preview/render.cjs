const fs=require('fs'),vm=require('vm'),path=require('path');
const {createCanvas}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
const root=path.resolve(__dirname,'../../..');process.chdir(root);
const ctx={console,Uint8Array,Uint32Array,Map,Set,Math,JSON,performance,document:{createElement:()=>createCanvas(1,1)},LANG_EN:false,L2:(a,b)=>a,CLASSES:{guerrero:{weapon:'sword'}},drawPortrait:()=>{},appEditorHTML:()=>'',bindAppEditor:()=>{}};vm.createContext(ctx);
for(const f of ['00_core.js','30_art_env.js','32_art_chars.js','35_art_hero.js','6zw_bodies.js','6zx_fit.js'])vm.runInContext(fs.readFileSync('src/'+f,'utf8'),ctx,{filename:f});
vm.runInContext(fs.readFileSync('src/6zyzx_v445.js','utf8').split('// ---------- góticas')[0],ctx);
vm.runInContext(fs.readFileSync('src/6zu_hd.js','utf8').split('// vistas previas')[0],ctx);
vm.runInContext(fs.readFileSync('src/6zz9zu_gi_preview.js','utf8'),ctx);
const code=`(()=>{const out=[];for(const g of ['m','f'])for(let bt=0;bt<BODY_T[g].length;bt++){
const app={g,bt,skin:0,hs:g==='m'?0:6,hair:'negro',eyes:'azul',top:[0,'negro'],bot:[0,'negro'],shoe:[0,'negro']};
const L=heroLook('guerrero',app,{},GI_PARTS,{});L.weapon=null;L.back=null;L.head=null;
const frames=[];for(const dir of ['down','left','right','up'])for(let f=0;f<4;f++){const p=new Pix(48,48);p.t=new Uint8Array(48*48);p.tg=0;drawHero(p,L,dir,'walk',f);p.outline(OUTL,false);const q=hdDetail(p,hdMats(L));hdOrn(q,p,L);frames.push({dir,f,pixels:Array.from(q.d),meta:p.meta});}out.push({g,bt,name:bodyName(g,bt),frames});}return out;})()`;
const out=vm.runInContext(code,ctx);fs.writeFileSync('tools/dev/gi_preview/frames.json',JSON.stringify(out));console.log('Rendered',out.length,'bodies and',out.reduce((s,r)=>s+r.frames.length,0),'frames with the original drawing engine');
vm.runInContext("FIT_BODIES.push(['m',4],['f',4]);",ctx);
const checks=vm.runInContext("fitCheck('c_gi_ref_')",ctx);fs.writeFileSync('tools/dev/gi_preview/fit_result.json',JSON.stringify(checks,null,2));console.log(JSON.stringify({stats:checks.stats,issues:checks.issues.slice(0,8),total:checks.issues.length}));
