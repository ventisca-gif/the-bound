function rubberGearFour(P, atlas, dir, anim, frame) {
 const ink='#160e20', armor='#29152e', red='#922143', lit='#d34761', shine='#ffd5df';

   const c=mkCanvas(128,118).getContext('2d');
   const poly=(col,...pts)=>{c.fillStyle=col;c.beginPath();c.moveTo(...pts[0]);for(const pt of pts.slice(1))c.lineTo(...pt);c.fill();};
   const box=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
   const oval=(col,x,y,w,h)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();};
   const stroke=(col,width,draw)=>{c.strokeStyle=col;c.lineWidth=width;c.lineCap='round';c.beginPath();draw();c.stroke();};
   for(const flip of [false,true]){
     c.save(); if(flip){c.translate(128,0);c.scale(-1,1);}
     const curl=()=>{c.moveTo(24,63);c.bezierCurveTo(45,49,8,51,17,37);c.bezierCurveTo(23,28,44,32,38,21);c.bezierCurveTo(36,15,29,16,27,18);};
     stroke('#8595ae',5,curl); c.translate(-1,-1);stroke('#c0cde0',2.5,curl);c.restore();
     oval('#cad6e7',flip?88:43,27,1.1,1.1);
   }

   const female=P.app.g==='f', back=dir==='up', side=dir==='left'||dir==='right';
   const tones=ttSkin(P), skin=[ '#4e2b32', ...tones ];
   const step=anim==='walk' ? (frame % 4 < 2 ? 2 : -2) : 0;
   const punch=anim==='atk' ? 4 + frame * 2 : 0;
   c.save(); c.translate(64,0); c.scale(side ? (dir==='left' ? -.66 : .66) : 1,1); c.translate(-64,0);
   const drawArm = flip => {
     c.save(); if(flip){c.translate(128,0);c.scale(-1,1);}
     c.translate(side ? (flip ? 16 : 16) : 0, (flip ? step : -step) - (punch && flip === (frame % 2 === 0) ? punch : 0));
     if(side && flip){
       c.translate(41,43); c.scale(.78,.92); c.translate(-41,-43);
     }
     oval(ink,41,43,14,13); oval(red,41,42,13,12); oval(armor,41,44,11,10);
     oval(skin[2],43,36,5.5,3.7);oval(skin[3],43,35,4.3,2.4);
     oval(lit,34,36,4.3,1.9);box(shine,32,35,4,1);
     oval(ink,34,54,13,12);oval(red,34,53,12,10.5);oval(armor,34,55,10,8.5);
     oval(lit,31,49,5,2);box(shine,29,48,4,1);
     poly(ink,[12,66],[15,61],[23,57],[32,57],[40,60],[45,67],[45,79],[42,90],[36,95],[21,95],[14,91],[10,83],[9,74]);
     poly(red,[13,66],[17,62],[25,59],[33,59],[40,63],[44,69],[43,79],[39,91],[34,94],[21,93],[15,89],[11,81],[11,73]);
     poly(armor,[14,70],[20,66],[34,65],[41,69],[41,81],[37,90],[33,92],[21,91],[15,87],[13,79]);
     poly(lit,[13,70],[17,64],[23,62],[29,62],[22,64],[17,68],[15,72]);
     box(shine,17,65,4,2);
     for(let i=0;i<(back ? 1 : 4);i++){
       const y=70+i*5, x=23+i*.65;
       oval(ink,x+3,y+1,6-i*.45,3.2);
       oval(i===0?lit:red,x+3,y,5.5-i*.5,2.4);
       box(shine,x+2,y-1,Math.max(2,4-i),1);
     }
     oval(ink,37,74,5,7);oval(red,37,73,3.8,5.2);box(lit,36,69,3,2);box(shine,36,69,2,1);
     c.restore();
   };
   if (side) drawArm(true);
   for(const flip of [false,true]){
     c.save(); if(flip){c.translate(128,0);c.scale(-1,1);}
     c.translate(side ? (flip ? 11 + step : 8 - step) : 0,flip ? step : -step);
     poly(ink,[48,84],[60,85],[58,98],[54,103],[54,108],[41,108],[42,103],[47,99]);
     poly(red,[48,89],[57,90],[54,100],[51,103],[52,106],[43,106],[45,103],[49,99]);
     poly(lit,[48,94],[52,94],[49,102],[45,104],[49,103]); box(shine,46,104,3,1);
     poly(ink,[46,70],[65,71],[65,80],[60,91],[55,96],[43,96],[39,91],[39,83]);
     poly('#204254',[46,72],[63,73],[62,81],[58,90],[53,93],[43,93],[41,89],[42,81]);
     poly('#35596a',[47,74],[56,74],[46,82],[43,89],[42,84]);
     poly('#102a3a',[57,78],[60,79],[54,88],[48,90],[46,87],[51,85]);
     poly('#bfb5b6',[41,91],[45,93],[48,92],[51,94],[56,91],[57,94],[54,96],[44,96],[41,94]);
     c.restore();
   }
   poly(ink,[47,33],[57,28],[71,28],[81,33],[82,50],[75,61],[76,73],[68,77],[59,77],[51,74],[52,61],[45,50]);
   poly(skin[0],[49,34],[57,30],[71,30],[79,34],[79,49],[73,61],[74,72],[67,75],[59,75],[53,72],[54,60],[48,48]);
   if(back){
     poly(armor,[48,33],[57,29],[71,29],[80,33],[80,54],[74,67],[54,67],[48,54]);
     poly('#513044',[51,35],[61,40],[67,40],[77,35],[73,56],[65,65],[63,65],[55,56]);
     box('#d9aa57',63,46,2,17);
   }
   for(const flip of back ? [] : [false,true]){
     c.save(); if(flip){c.translate(128,0);c.scale(-1,1);}
     poly(skin[2],[56,33],[63,31],[63,42],[59,40],[54,39]);
     poly(skin[3],[57,34],[61,33],[63,39],[61,38],[56,37]);
     poly(skin[2],[52,42],[57,40],[63,43],[63,51],[59,53],[53,51]);
     poly(skin[3],[55,43],[59,43],[62,45],[62,50],[57,51],[54,49]);
     for(let i=0;i<3;i++){
       const y=54+i*6;
       poly(skin[2],[57,y+1],[61,y],[63,y+1],[63,y+5],[58,y+5],[56,y+3]);
       box(skin[3],59,y+1,3,2);
     }
     if(female)poly('#261e35',[53,42],[63,43],[64,53],[54,54],[52,50]);
     if(female)box('#4a3654',55,44,8,2);
     poly(armor,[47,31],[54,30],[57,34],[53,39],[52,47],[53,60],[48,59],[45,51],[44,36]);
     poly('#d9aa57',[48,32],[54,31],[52,35],[54,36],[51,40],[50,48],[51,57],[48,58],[49,56],[48,47],[49,40],[52,36],[49,35]);
     c.restore();
   }
   poly('#6d4129',[51,69],[58,72],[68,72],[76,69],[77,74],[72,77],[57,77],[51,74]);
   poly('#e5b64f',[52,70],[58,73],[68,73],[75,70],[75,73],[70,75],[57,75],[52,73]);
   poly('#c38d38',[72,74],[77,73],[82,85],[77,87],[74,83]);poly('#f1cb6c',[75,75],[77,75],[80,84],[78,85]);
   if (!side) drawArm(true);
   drawArm(false);
   c.restore();
   const h=mkCanvas(atlas.fw,atlas.fh).getContext('2d');
   const col=atlas.idx[anim]+frame;
   atlasBlit(h,atlas,col,DIRI[dir],0,0,atlas.fw,atlas.fh);
   c.imageSmoothingEnabled=false;
   const look = atlas.hdL;
   const body = BODYP.normal;
   const pose = heroPose(dir, anim, frame, look);
   const neck = Math.round(atlas.ay - (pose.jump || 0) - body.lh - body.th + pose.crouch + pose.bob);
   // Keep the native head scale on both axes and place the neck on the new torso.
   c.drawImage(h.canvas, 0, 0, atlas.fw, neck, 64 - atlas.ax, 34 - neck, atlas.fw, neck);
   // Quantize edge transparency to a hard pixel boundary before enlarging.
   const pixels=c.getImageData(0,0,128,118);
   for(let i=3;i<pixels.data.length;i+=4)pixels.data[i]=pixels.data[i]>=128?255:0;
   c.putImageData(pixels,0,0);
   return c.canvas;
 }

function rubberGearThree(P, atlas, dir, anim, frame) {
  const canvas = mkCanvas(128, 118), c = canvas.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.translate(64, 106);
  const skin = ttSkin(P);
  for (const sign of [-1, 1]) {
    c.strokeStyle = '#a7c5d0'; c.globalAlpha = .65;
    c.lineCap = 'round'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(sign * 27, -12);
    c.bezierCurveTo(sign * 43, -24, sign * 22, -28, sign * 33, -46);
    c.stroke();
  }
  c.globalAlpha = 1;
  const arms = ttFistLayout({ titanOn: 2, dir, anim, af: frame });
  for (const behind of [true, false]) {
    if (!behind) atlasBlit(c, atlas, atlas.idx[anim] + frame, DIRI[dir], -atlas.ax, -atlas.ay, atlas.fw, atlas.fh);
    for (const arm of arms.filter(a => a.behind === behind)) {
      const x = arm.x * 1.16, y = arm.y - 2;
      const w = Math.round(arm.w * 1.06), h = Math.round(arm.h * 1.06);
      const view = dir === 'up' ? 'back' : arm.view;
      c.lineCap = 'round';
      for (const [width, color] of [[6, '#201925'], [4, skin[1]], [1, skin[2]]]) {
        c.strokeStyle = color; c.lineWidth = width;
        c.beginPath(); c.moveTo(arm.sx, arm.sy);
        c.lineTo(x - Math.sign(x) * w * .3, y + 3); c.stroke();
      }
      c.save(); c.translate(x, y);
      if (view === 'side' ? arm.d < 0 : arm.d > 0) c.scale(-1, 1);
      c.drawImage(ttFistArt(skin, view, w * 2, h * 2), -w / 2, -h / 2, w, h);
      c.restore();
    }
  }
  return canvas;
}

// Mark only exposed face pixels at the native eye anchors, keeping hair and pupils intact.
hookAfter('drawHero', (_, p, look) => {
  const m = p.meta;
  if (!look.rubberEyeMarks || !m || m.up) return;
  const eyeY = Math.round(m.hy) + FACE.ey;
  const eyeGap = look.btS?.eg || 0;
  const eyes = m.side ? [[m.hx + (m.d < 0 ? -5 : 3), m.d]]
    : [[m.hx - 4 - eyeGap, -1], [m.hx + 3 + eyeGap, 1]];
  const layer = p.tg;
  p.tg = 3;
  for (const [x, outward] of eyes) {
    const edge = x + (outward < 0 ? -1 : 2);
    for (const [px, py] of [[x, eyeY + 3], [x + 1, eyeY + 3],
      [edge, eyeY + 1], [edge, eyeY + 2], [edge + outward, eyeY + 2]]) {
      if (m.sk.includes(p.get(px, py))) p.set(px, py, C('#0b080f'));
    }
  }
  p.tg = layer;
});
