// Visual integration: retain every original art discriminator, atlas anchor and combat dimension.
const R133_ALL_BEFORE={mobs:JSON.stringify(MOBS),bosses:JSON.stringify(BOSSES)};
const R133_OF=new Map(R133_DESIGNS.map(s=>[s.id,s])),R133_BEFORE={},R133_ATL=new Map(),R133_FRAMES=new Map();
const R133_FRAME_MAX=8*1024*1024,R133_ATLAS_MAX=12*1024*1024;
let r133FrameBytes=0,r133AtlasBytes=0;
for(const S of R133_DESIGNS){const D=S.boss?BOSSES[S.id.slice(2)]:MOBS[S.id];if(!D)throw Error('Missing redesign target: '+S.id);R133_BEFORE[S.id]=JSON.stringify(D);S.originalArt=D.art;const art=D.art.slice();Object.defineProperty(art,'r133',{value:S.id,enumerable:false});D.art=art;}
function r133Remember(map,key,val,bytes,max,kind){map.set(key,{value:val,bytes});if(kind==='frame')r133FrameBytes+=bytes;else r133AtlasBytes+=bytes;while((kind==='frame'?r133FrameBytes:r133AtlasBytes)>max&&map.size>1){const k=map.keys().next().value,e=map.get(k);map.delete(k);if(kind==='frame')r133FrameBytes-=e.bytes;else r133AtlasBytes-=e.bytes;}}
function r133Read(map,key){const v=map.get(key);if(!v)return null;map.delete(key);map.set(key,v);return v.value;}
let r133Legacy;
function r133Atlas(id){let A=r133Read(R133_ATL,id);if(A)return A;const S=R133_OF.get(id),old=r133Legacy(S.originalArt);if(!old?.img)throw Error('Missing legacy atlas: '+id);
 A={img:mkCanvas(old.img.width,old.img.height),fw:old.fw,fh:old.fh,idx:Object.assign({},old.idx),ax:old.ax,ay:old.ay,combatWidth:old.combatWidth||old.fw,r133:id,r133Done:new Set(),r133Old:old};
 r133Remember(R133_ATL,id,A,A.img.width*A.img.height*4,R133_ATLAS_MAX,'atlas');for(let row=0;row<4;row++)r133Cell(A,A.idx.idle||0,row);return A;}
function r133Pose(A,col){let name='idle',start=0;for(const [k,v]of Object.entries(A.idx))if(v<=col&&v>=start){name=k;start=v;}return {anim:['walk','atk','hurt','idle'].includes(name)?name:name==='cast'?'atk':'idle',f:(col-start)%4};}
function r133Cell(A,col,row){const key=A.r133+':'+col+':'+row+(A.r133Tint?':soul':''),cached=r133Read(R133_FRAMES,key);if(cached)return cached;const S=R133_OF.get(A.r133),pose=r133Pose(A,col),p=r133Paint(S,['down','left','right','up'][row]||'down',pose.anim,pose.f),c=mkCanvas(A.fw*2,A.fh*2),x=c.getContext('2d');x.imageSmoothingEnabled=false;const s=Math.min((c.width-4)/96,(c.height-4)/96),dx=A.ax*2-48*s,dy=A.ay*2-84*s;x.drawImage(p.canvas(),dx,dy,96*s,96*s);
 if(A.r133Tint){x.globalCompositeOperation='source-atop';x.fillStyle='rgba(35,110,220,0.48)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over';}
 if(!A.r133Done.has(col+':'+row)){const g=A.img.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(col*A.fw,row*A.fh,A.fw,A.fh);g.drawImage(c,col*A.fw,row*A.fh,A.fw,A.fh);A.r133Done.add(col+':'+row);}
 r133Remember(R133_FRAMES,key,c,c.width*c.height*4,R133_FRAME_MAX,'frame');return c;}
{const prev=mobAtlasFor;r133Legacy=prev;mobAtlasFor=function(art){return art?.r133&&R133_OF.has(art.r133)?r133Atlas(art.r133):prev.apply(this,arguments);};}
{const prev=atlasBlit;atlasBlit=function(c,A,col,row,x,y,w,h){if(!A?.r133)return prev.apply(this,arguments);const cv=r133Cell(A,col,row);c.drawImage(cv,x,y,w,h);};}
// Soul copies keep their existing blue appearance, animation and original combat values.
{const prev=soulAtlas;soulAtlas=function(D){const A=mobAtlasFor(D.art);if(A.r133){const cols=A.img.width/A.fw;for(let row=0;row<4;row++)for(let col=0;col<cols;col++)r133Cell(A,col,row);}const B=prev.apply(this,arguments);if(A.r133){B.r133Tint=true;B.r133Done=new Set(A.r133Done);}return B;};}
// The encyclopedia uses the same high-detail cells as the world, instead of enlarging a low-res thumbnail.
const R133_PORT=new Map();
{const prev=renderBestiary;renderBestiary=function(B){const r=prev.apply(this,arguments);function paint(cv,id){const S=R133_OF.get(id);if(!S||!cv)return;const known=(G.P.best?.[id]||0)||(S.boss&&G.P.bossKills?.[id.slice(2)]),key=id+(known?'':':?')+':'+cv.width+'x'+cv.height;
 /* 6.13: retrato guardado ya pintado (antes se repintaban todos con filtro en cada toque de la lista) */let c=R133_PORT.get(key);
 if(!c){const A=r133Atlas(id);c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const g=c.getContext('2d'),s=Math.min(cv.width/A.fw,cv.height/A.fh);g.imageSmoothingEnabled=false;if(!known)g.filter='brightness(0)';atlasBlit(g,A,A.idx.idle||0,0,(cv.width-A.fw*s)/2,cv.height-A.fh*s,A.fw*s,A.fh*s);g.filter='none';R133_PORT.set(key,c);}
 const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(c,0,0);}paint(B.querySelector('#bBig'),bSel);/* 6.13: por trozos, sin congelar la ventana */bestChunk([...B.querySelectorAll('[data-bc]')].filter(cv=>R133_OF.has(cv.dataset.bc)),cv=>paint(cv,cv.dataset.bc));return r;};}
