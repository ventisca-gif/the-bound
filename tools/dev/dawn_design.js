// Approved Dawn/Foosha terrain design; bake at development time, never during gameplay.
const TS = 16;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const dist2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
const dist = (ax, ay, bx, by) => Math.sqrt(dist2(ax, ay, bx, by));
const smooth = t => t * t * (3 - 2 * t);
const now = () => performance.now();
function hash2(x, y, s) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul((s | 0) + 1, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
class RNG {
  constructor(s) { this.r = mulberry32(s); }
  f() { return this.r(); }
  int(a, b) { return a + Math.floor(this.r() * (b - a + 1)); }
  range(a, b) { return a + this.r() * (b - a); }
  pick(a) { return a[Math.floor(this.r() * a.length)]; }
  chance(p) { return this.r() < p; }
}
// value noise with smooth interpolation
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = smooth(xf), v = smooth(yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function fbm(x, y, s, oct = 4) {
  let t = 0, amp = 1, f = 1, n = 0;
  for (let i = 0; i < oct; i++) { t += vnoise(x * f, y * f, s + i * 31) * amp; n += amp; amp *= 0.5; f *= 2; }
  return t / n;
}

const W=720,H=360;
const shapes=[[368,179,242,130],[473,135,154,96],[245,137,126,87]];
const sd=(x,y)=>{let d=-999;for(const [cx,cy,rx,ry]of shapes)d=Math.max(d,(1-Math.hypot((x-cx)/rx,(y-cy)/ry))*Math.min(rx,ry));d+=Math.sin(x*.063+y*.051)*1.6+Math.sin(x*.18-y*.13)*.5;const foosha=31-Math.hypot((x-531)*.9,(y-292)*1.1),cove=23-Math.hypot((x-330)*1.2,(y-309)*1.4);return Math.min(d,-foosha,-cove);};
const field=new Float32Array((W+1)*(H+1));for(let y=0;y<=H;y++)for(let x=0;x<=W;x++)field[y*(W+1)+x]=sd(x,y);
const grassNoise=Float32Array.from(field,(_,i)=>fbm((i%(W+1))/14,(i/(W+1)|0)/14,37,2));
const terrain=new Uint8Array(W*H),paths=[];
function route(points,width=3,type=3){paths.push({points,width,type});}
route([[521,264],[521,251],[512,241],[502,237],[489,225],[464,214],[435,200],[414,181],[393,166],[364,165],[341,155],[306,155],[287,151],[269,145],[244,145]],2.4);
route([[514,242],[526,239],[544,243],[556,248]],2.1);
route([[500,237],[492,251],[478,255]],1.7);
route([[393,166],[389,146],[372,139],[365,129]],1.9);
route([[341,155],[326,175],[332,209],[330,253],[330,286]],2);
const segdist=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
const pathField=new Float32Array((W+1)*(H+1)).fill(1000);for(let y=0;y<=H;y++)for(let x=0;x<=W;x++)for(const r of paths)for(let j=1;j<r.points.length;j++){const i=y*(W+1)+x;pathField[i]=Math.min(pathField[i],segdist(x,y,r.points[j-1],r.points[j])-r.width);}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,d=sd(x+.5,y+.5);terrain[i]=d>5?1:d>0?2:0;if(d>3)for(const r of paths)for(let j=1;j<r.points.length;j++)if(segdist(x+.5,y+.5,r.points[j-1],r.points[j])<r.width)terrain[i]=r.type;
 const ridge=Math.hypot((x-391)/63,(y-102)/36);if(d>8&&ridge<1&&y>110)terrain[i]=7;
 const ridge2=Math.hypot((x-405)/40,(y-80)/26);if(d>8&&ridge2<1&&y>87)terrain[i]=7;
 if(x>221&&x<268&&y>117&&y<145)terrain[i]=5;
 if(x>520&&x<524&&y>=253&&y<279||x>520&&x<541&&y>272&&y<276)terrain[i]=6;
}
