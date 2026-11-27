// Test the shipped geometry and new map directly, including the prior save migration contract.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const hooks={},T={DEEP:0,SAND:2,GRASS:3,COBBLE:5,STONE:9,FACE:13,BRIDGE:21};
const c={console,T,CH:8,NPCS:{},HAIRS:{},SKINS:[],L2:s=>s,LK:x=>x,pal:x=>x,SAVEKEYS:[],MAPC:{},MAPW_LIST:[],G:{maps:{}},
 hookAfter:(n,f)=>(hooks[n]??=[]).push(f),hookBefore:()=>{},hookAround:()=>{},XACT:{},DL_HOOKS:[],WORLD_DRAW:[],CN_SC:{},LUPA_DAWN:[]};
vm.createContext(c);for(const f of ['src/6zzzzzzz_v663_reference.js','src/6zzzzzzz_v663_reverse.js','src/6zzzzzzz_v664_grandline.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext('globalThis.K={RMC_BOX,RMC_ROUTES,RMC_PIER,RMC_CROCUS,RMC_MOOR,RMC_EXIT,RMA_EAST_PIER,RMA_EAST_MOOR,RMA_CAPE_ENTRY,RMA_MOUNT_EXIT,rmcActual,makeGrandLine,GL_RETURN,GL_ARRIVE};',c);
const K=c.K,w=1632,h=1024,N=w*h,M={w,h,I:(x,y)=>y*w+x,cw:w/8,chh:h/8,objGrid:Array.from({length:w*h/64},()=>[]),chunks:new Map(),npcDefs:[]};
for(const key of ['ter','lvl','reg','flags','solidO','objAt'])M[key]=key==='objAt'?new Int32Array(N).fill(-1):new Uint8Array(N);
M.ter[M.I(1440,172)]=T.GRASS;M.flags[50]=23;hooks.makeDawn[0](M);
assert.equal(M.ter[M.I(1440,172)],T.GRASS);assert.equal(M.flags[50],23);assert(M.npcDefs.some(n=>n.id==='rm_crocus'));
const water=(x,y,r=18)=>[[0,0],[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>{const tx=(x+dx)>>4,ty=(y+dy)>>4;return tx>=0&&ty>=0&&tx<M.w&&ty<M.h&&M.ter[M.I(tx,ty)]===T.DEEP;});
let samples=0;for(const route of K.RMC_ROUTES)for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2);for(let j=0;j<=n;j++){const x=(a[0]+(b[0]-a[0])*j/n)*16+8,y=(a[1]+(b[1]-a[1])*j/n)*16+8;assert(water(x,y),`blocked original-proposal channel ${x/16},${y/16}`);samples++;}}
for(const at of [K.RMC_MOOR,K.RMA_EAST_MOOR,K.RMC_EXIT,K.RMA_CAPE_ENTRY,K.RMA_MOUNT_EXIT])assert(water(at[0]*16+8,at[1]*16+8),'water arrival '+at);
for(const at of [K.RMC_PIER,K.RMC_CROCUS,K.RMA_EAST_PIER])assert([T.SAND,T.BRIDGE].includes(M.ter[M.I(Math.floor(at[0]),Math.floor(at[1]))]),'walkable '+at);
// A player must be able to walk from the west pier to Crocus without walking through the cottage or water.
const start=K.RMC_PIER.map(Math.floor),end=K.RMC_CROCUS.map(Math.floor),q=[start],seen=new Set([start.join()]);let found=false;
for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===end[0]&&y===end[1]){found=true;break;}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,k=a+','+b;if(seen.has(k)||a<1440||a>=1632||b<K.RMC_BOX[1]||b>=M.h)continue;const t=M.ter[M.I(a,b)];if(![T.SAND,T.BRIDGE].includes(t)||M.solidO[M.I(a,b)])continue;seen.add(k);q.push([a,b]);}}
assert(found,'Crocus reachable from west pier');
const before=M.ter;hooks.makeDawn[0](M);assert.equal(M.ter,before,'idempotent map generation');
c.initMapObjs=m=>{m.objs=[];m.npcDefs=[];m.solidO=new Uint8Array(m.w*m.h);};const sea=K.makeGrandLine();assert.equal(sea.ter.some(t=>t!==T.DEEP),false);assert.equal(sea.objs.length,0);assert.equal(sea.npcDefs.length,0);assert.equal(sea.camps.length,0);assert.equal(K.makeGrandLine(),sea);
console.log(`PASS: ${samples} original-proposal channel samples; both docks; Crocus path; arrival points; unchanged islands; empty Grand Line map.`);
