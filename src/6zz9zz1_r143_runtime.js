// Approved detailed creature art. Only explicitly tagged enemy/boss definitions are intercepted.
const R143_DESIGNS=[R143_DATA_1,R143_DATA_2,R143_DATA_3,R143_DATA_4,R143_DATA_5,R143_DATA_6,R143_DATA_7,R143_DATA_8,R143_DATA_9,R143_DATA_10,R143_DATA_11,R143_DATA_12,R143_DATA_13].flat();
const R143_OF=new Map(R143_DESIGNS.map(s=>[s.id,s])),R143_BEFORE={mobs:JSON.stringify(MOBS),bosses:JSON.stringify(BOSSES)};
const R143_PROTECTED={drawHero,npcAtlas,heroLook,buildHeroAtlas,npcs:Object.entries(NPCS).map(([id,d])=>[id,d,d.look])};
const R143_EXCLUDED=['slime_v','slime_a','imitador','B_nihil','B_lienya'];
for(const S of R143_DESIGNS){if(R143_EXCLUDED.includes(S.id))throw Error('Excluded redesign '+S.id);const D=S.boss?BOSSES[S.id.slice(2)]:MOBS[S.id];if(!D)throw Error('Unknown redesign '+S.id);S.originalArt=D.art;const art=D.art.slice();Object.defineProperty(art,'r143',{value:S.id,enumerable:false});D.art=art;}
const R143_IMAGES=new Map(),R143_ATLASES=new Map(),R143_FRAMES=new Map();
const R143_LIMIT={images:12*1024*1024,atlases:12*1024*1024,frames:12*1024*1024};
const R143_BYTES={images:0,atlases:0,frames:0};
function r143Get(m,k){const v=m.get(k);if(!v)return null;m.delete(k);m.set(k,v);return v.value;}
function r143Put(m,k,value,bytes,kind){if(m.has(k)){R143_BYTES[kind]-=m.get(k).bytes;m.delete(k);}m.set(k,{value,bytes});R143_BYTES[kind]+=bytes;while(R143_BYTES[kind]>R143_LIMIT[kind]&&m.size>1){const key=m.keys().next().value;R143_BYTES[kind]-=m.get(key).bytes;m.delete(key);}return value;}
function r143Source(S){let item=r143Get(R143_IMAGES,S.id);if(item)return item;const image=new Image();item={image,ready:false,promise:null};item.promise=new Promise((resolve,reject)=>{image.onload=()=>{item.ready=true;resolve(item);};image.onerror=()=>reject(Error('Creature source '+S.id));});image.src=S.image;return r143Put(R143_IMAGES,S.id,item,S.cell*S.cell*5*4,'images');}
let r143Legacy;
function r143Atlas(id){const S=R143_OF.get(id),old=r143Legacy(S.originalArt);
 // This boss reflects the actual player appearance and must keep doing so.
 if(id==='B_reflejo_eclipse')return Object.assign({},old,{r143:id,r143Mirror:true,r143Old:old});
 let A=r143Get(R143_ATLASES,id);if(A)return A;
 A={img:mkCanvas(old.img.width,old.img.height),fw:old.fw,fh:old.fh,ax:old.ax,ay:old.ay,idx:Object.assign({},old.idx),combatWidth:old.combatWidth||old.fw,r143:id,r143Old:old,r143BaseReady:false,r143Tint:false};
 A.img.getContext('2d').drawImage(old.img,0,0);r143Put(R143_ATLASES,id,A,A.img.width*A.img.height*4,'atlases');
 const source=r143Source(S);source.promise.then(()=>r143BaseAtlas(A,source)).catch(()=>{});return A;}
function r143Pose(A,col){let name='idle',start=-1,end=A.img.width/A.fw;for(const[k,v]of Object.entries(A.idx))if(v<=col&&v>start){name=k;start=v;}for(const v of Object.values(A.idx))if(v>start&&v<end)end=v;return{anim:name==='cast'?'atk':['idle','walk','atk','hurt'].includes(name)?name:'idle',f:Math.max(0,col-start),count:Math.max(1,end-start)};}
// Small mesh deformations preserve the approved artwork, alternating feet/forelegs and arm support.
function r143Warp(S,source,dir,anim,f){const N=S.cell,cv=mkCanvas(N,N),g=cv.getContext('2d');g.imageSmoothingEnabled=false;const index={down:0,up:1,left:2,right:3}[dir]||0;
 let pose=index,flip=false;if(anim==='atk'&&dir==='right')pose=4;if(anim==='atk'&&dir==='left'){pose=4;flip=true;}
 g.save();if(flip){g.translate(N,0);g.scale(-1,1);}g.drawImage(source.image,pose*N,0,N,N,0,0,N,N);g.restore();
 if(anim==='idle'&&f%2===0)return cv;
 const input=g.getImageData(0,0,N,N),out=g.createImageData(N,N),p=input.data,q=out.data;
 const phase=[0,1,0,-1][f%4],attack=[-.35,1,.25,0][Math.min(f,3)],facing=dir==='left'?-1:dir==='right'?1:0;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){let dx=0,dy=0;const u=x/N,v=y/N,side=x<N/2?-1:1;
  if(anim==='walk'){
   if(S.movement==='legs'||S.movement==='beast'||S.movement==='insect'){
    const leg=Math.max(0,(v-.66)/.26),foot=S.movement==='beast'?Math.sin(u*Math.PI*4+f*Math.PI/2):side*phase;
    dx=foot*leg*(facing?3:2);dy=foot*leg*2;
    const arm=(Math.abs(u-.5)>.23&&v>.34&&v<.7)?Math.sin((v-.34)/.36*Math.PI):0;dx-=side*phase*arm*2;dy-=side*phase*arm*1.5;
   }else if(S.movement==='wing'){const wing=Math.max(0,(Math.abs(u-.5)-.14)/.36);dy=phase*wing*4;dx=side*phase*wing;}
   else if(S.movement==='swim'){dx=Math.sin(v*7+f*Math.PI/2)*2.5*Math.max(0,(v-.3));dy=phase*.7;}
   else{dx=(u-.5)*phase*3;dy=Math.sin(u*5+f*Math.PI/2)*1.8*(v>.4?1:.3);}
  }else if(anim==='atk'){
   const arm=Math.max(0,Math.abs(u-.5)-.15)*3*(v>.2&&v<.75?Math.sin((v-.2)/.55*Math.PI):0);
   dx=facing*attack*3+side*attack*arm*4;dy=(dir==='up'?-1:dir==='down'?1:0)*attack*2-attack*arm*4;
   if(S.movement==='wing'){dy-=attack*Math.max(0,Math.abs(u-.5)-.15)*8;}
   if(S.movement==='float'){dx+=(u-.5)*attack*6;dy+=(v-.7)*attack*3;}
  }else if(anim==='hurt'){dx=Math.sin(v*8)*1.5;dy=1;}
  else{dy=-Math.sin(u*Math.PI)*.7;dx=(u-.5)*.4;}
  const sx=Math.round(x-dx),sy=Math.round(y-dy);if(sx<0||sy<0||sx>=N||sy>=N)continue;const i=(sy*N+sx)*4,j=(y*N+x)*4;q[j]=p[i];q[j+1]=p[i+1];q[j+2]=p[i+2];q[j+3]=p[i+3];
 }g.putImageData(out,0,0);return cv;}
function r143Cell(A,col,row,sourceOverride){const S=R143_OF.get(A.r143);if(A.r143Mirror)return null;A.r143PadX=Math.ceil(A.fw*.5);const source=sourceOverride||r143Source(S);if(!source.ready)return null;
 const key=S.id+':'+col+':'+row+(A.r143Tint?':soul':''),cached=r143Get(R143_FRAMES,key);if(cached){r143Native(A,col,row,cached);return cached;}
 const pad=A.r143PadX=Math.ceil(A.fw*.5),pose=r143Pose(A,col),body=r143Warp(S,source,['down','left','right','up'][row]||'down',pose.anim,pose.f),c=mkCanvas((A.fw+pad*2)*3,A.fh*3),g=c.getContext('2d');g.imageSmoothingEnabled=false;
 // Garments, wings and weapons may visually overhang the legacy cell, without changing its combat dimensions.
 const fit=S.fit,s=Math.min((A.fw*1.75-6)/fit[0],(A.fh-6)/fit[1])*3;g.drawImage(body,(A.ax+pad)*3-72*s,A.ay*3-132*s,S.cell*s,S.cell*s);
 if(A.r143Tint){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(35,110,220,.48)';g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';}
 r143Native(A,col,row,c);return r143Put(R143_FRAMES,key,c,c.width*c.height*4,'frames');}
function r143Native(A,col,row,frame){const done=A.r143NativeDone||(A.r143NativeDone=new Set()),key=col+':'+row;if(done.has(key))return;const g=A.img.getContext('2d'),pad=A.r143PadX||0,scale=Math.min(A.fw/frame.width,A.fh/frame.height);g.save();g.imageSmoothingEnabled=false;g.beginPath();g.rect(col*A.fw,row*A.fh,A.fw,A.fh);g.clip();g.clearRect(col*A.fw,row*A.fh,A.fw,A.fh);g.drawImage(frame,col*A.fw+A.ax-(A.ax+pad)*3*scale,row*A.fh+A.ay-A.ay*3*scale,frame.width*scale,frame.height*scale);g.restore();done.add(key);}
function r143BaseAtlas(A,source){if(A.r143BaseReady||A.r143Mirror)return;const cols=A.img.width/A.fw;for(let row=0;row<4;row++){const c=r143Cell(A,A.idx.idle||0,row,source);if(c)for(let col=0;col<cols;col++){A.r143NativeDone?.delete(col+':'+row);r143Native(A,col,row,c);}}A.r143BaseReady=true;}
{const prev=mobAtlasFor;r143Legacy=prev;mobAtlasFor=function(art){return art?.r143&&R143_OF.has(art.r143)?r143Atlas(art.r143):prev.apply(this,arguments);};}
{const prev=atlasBlit;atlasBlit=function(c,A,col,row,x,y,w,h){if(!A?.r143)return prev.apply(this,arguments);if(A.r143Mirror)return prev.call(this,c,A.r143Old,col,row,x,y,w,h);const frame=r143Cell(A,col,row);if(frame){const pad=(A.r143PadX||0)*w/A.fw;c.save();c.imageSmoothingEnabled=false;c.drawImage(frame,x-pad,y,w+pad*2,h);c.restore();return;}return prev.call(this,c,A.r143Old,col,row,x,y,w,h);};}
{const prev=soulAtlas;soulAtlas=function(D){const A=mobAtlasFor(D.art);if(A.r143&&!A.r143Mirror){const source=r143Source(R143_OF.get(A.r143));if(source.ready)r143BaseAtlas(A,source);}const B=prev.apply(this,arguments);if(A.r143){B.r143=A.r143;B.r143Tint=true;B.r143Mirror=A.r143Mirror;B.r143Old=A.r143Old;}return B;};}
function r143PortraitLayout(A,w,h){const margin=Math.max(1,Math.min(w,h)*.04),S=R143_OF.get(A.r143);let vw=A.fw,vh=A.fh;if(!A.r143Mirror){const scale=Math.min((A.fw*1.75-6)/S.fit[0],(A.fh-6)/S.fit[1]);vw=S.fit[0]*scale;vh=S.fit[1]*scale;}const s=Math.min((w-margin*2)/vw,(h-margin*2)/vh);return{s,x:w/2-A.ax*s,y:h-margin-A.ay*s};}
const R143_PORT=new Map();
{const prev=renderBestiary;renderBestiary=function(B){const r=prev.apply(this,arguments),pending=[];const one=cv=>{const id=cv.dataset.bc||bSel,S=R143_OF.get(id);if(!S)return;const known=(G.P.best?.[id]||0)||(S.boss&&G.P.bossKills?.[id.slice(2)]),key=id+(known?'':':?')+':'+cv.width+'x'+cv.height,done=R143_PORT.get(key);
 /* 6.13: retrato definitivo guardado (antes se repintaban todos en cada toque de la lista) */if(done){const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(done,0,0);return;}
 const A=r143Atlas(id);const paint=source=>{if(!cv.isConnected)return;const g=cv.getContext('2d'),L=r143PortraitLayout(A,cv.width,cv.height);g.imageSmoothingEnabled=false;g.clearRect(0,0,cv.width,cv.height);g.filter=known?'none':'brightness(0)';const frame=!A.r143Mirror&&source?.ready?r143Cell(A,A.idx.idle||0,0,source):null;if(frame){const pad=A.r143PadX*L.s;g.drawImage(frame,L.x-pad,L.y,(A.fw+A.r143PadX*2)*L.s,A.fh*L.s);}else atlasBlit(g,A,A.idx.idle||0,0,L.x,L.y,A.fw*L.s,A.fh*L.s);g.filter='none';
  if(frame||A.r143Mirror){const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;c.getContext('2d').drawImage(cv,0,0);R143_PORT.set(key,c);}};paint();if(!A.r143Mirror)pending.push(r143Source(S).promise.then(paint).catch(()=>{}));};
 /* 6.13: por trozos; r143Ready sigue esperando a que estén todos */const cvs=[...B.querySelectorAll('[data-bc],#bBig')].filter(cv=>R143_OF.has(cv.dataset.bc||bSel));B.r143Ready=bestChunk(cvs,one).then(()=>Promise.all(pending));return r;};}
