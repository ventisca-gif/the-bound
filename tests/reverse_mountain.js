// Geometry/integration contract against the production module; no browser required.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const hooks={},T={DEEP:0,SAND:2,GRASS:3,COBBLE:5,STONE:9,FACE:13,BRIDGE:21};
const c={console,T,CH:32,NPCS:{},HAIRS:{},SKINS:[],L2:s=>s,LK:x=>x,pal:x=>x,
 hookAfter:(n,f)=>(hooks[n]??=[]).push(f),hookAround:()=>{},XACT:{},DL_HOOKS:[],WORLD_DRAW:[],CN_SC:{},LUPA_DAWN:[]};
vm.createContext(c);vm.runInContext(fs.readFileSync('src/6zzzzzzz_v663_reverse.js','utf8'),c);
vm.runInContext(`globalThis.contract={RMC_BOX,RMC_ROUTES,RMC_PIER,RMC_CROCUS,RMC_MOOR,RMC_EXIT,rmcTile,rmcActual,rmcDockKey};`,c);
const K=c.contract,w=1632,h=1024,N=w*h;
const M={w,h,I:(x,y)=>y*w+x,cw:Math.ceil(w/32),chh:h/32,objGrid:Array.from({length:Math.ceil(w/32)*h/32},()=>[]),chunks:new Map(),npcDefs:[],objs:[]};
for(const key of ['ter','lvl','reg','flags','solidO','objAt'])M[key]=key==='objAt'?new Int32Array(N).fill(-1):new Uint8Array(N);
// Preserve Shells Town / Claude's pre-existing data verbatim.
M.ter[M.I(1440,172)]=T.GRASS;M.flags[50]=23;
c.addObj=(m,k,x,y,o)=>{m.objs.push({k,x,y,...o});};hooks.makeDawn[0](M);
assert.equal(M.ter[M.I(1440,172)],T.GRASS);assert.equal(M.flags[50],23);assert(M.h>=1382);
assert(M.npcDefs.some(n=>n.id==='rm_crocus'));
const surface=(x,y,r=18)=>[[0,0],[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>{const tx=(x+dx)>>4,ty=(y+dy)>>4;return tx>=0&&ty>=0&&tx<M.w&&ty<M.h&&M.ter[M.I(tx,ty)]===T.DEEP;});
let samples=0;
for(const route of K.RMC_ROUTES)for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2);for(let j=0;j<=n;j++){const x=(a[0]+(b[0]-a[0])*j/n)*16+8,y=(a[1]+(b[1]-a[1])*j/n)*16+8;assert(surface(x,y),`blocked Merry channel ${x/16},${y/16}`);samples++;}}
for(const at of [K.RMC_PIER,K.RMC_CROCUS])assert([T.BRIDGE,T.COBBLE,T.STONE,T.SAND].includes(M.ter[M.I(...at)]));
assert(surface(K.RMC_MOOR[0]*16+8,K.RMC_MOOR[1]*16+8));
const old=M.ter;hooks.makeDawn[0](M);assert.equal(M.ter,old,'map generation is idempotent');
console.log(`PASS: ${samples} Merry channel samples, dock, Crocus, mooring, existing terrain and idempotence`);
