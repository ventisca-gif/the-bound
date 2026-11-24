// Painted fruit icons sampled onto the existing 16 x 16 inventory grid.
const DAWN_FRUIT_PIXELS={
 df_mera:[["#f4a908","#f58803","#ec7a03","#ea6c02","#eb5902","#d55903","#e44702","#cd4a02","#c05003","#5c4c28","#055057","#e03301","#bf3102","#db1e02","#b41f02","#851401","#002b3a"],
  "....g.....a.....",
  "....aa...aaa....",
  "...aaaaaaaga....",
  ".....agaaga.....",
  "....f5498388....",
  "...0132320218...",
  "..81102611474e..",
  "..8b20357bc5e8..",
  "..2856652752525.",
  ".2028c100411367.",
  ".74002434bb4bce.",
  ".fc32677ee8cc7f.",
  "..5bd523c22766..",
  "..5be1166136be..",
  "...eebbbddbef...",
  ".....ffffff....."],
 df_hana:[["#f29bbb","#dc9da2","#ed90b4","#ed849d","#e37da2","#e27893","#e26d98","#d8618c","#9f7457","#5d7216","#486c0d","#dc5488","#ad5477","#ae3a5e","#424d1e"],
  "........9999....",
  ".......9a.ea....",
  "...99a.9.9e.....",
  "..a99aeaa99.....",
  "....9ee9e9e.....",
  "....0400262c....",
  "..c7052002245...",
  "..20024060004...",
  ".c40240242004c..",
  ".1272055205b21..",
  ".c32425834446c..",
  ".d2064030440bd..",
  ".c74640726427...",
  "..db6b7667bbd...",
  "...c4bb2077d....",
  ".....dcdc......."]
};
{const old=genIcon;genIcon=function(spec){
 const data=DAWN_FRUIT_PIXELS[spec[0]];
 if(!data)return old.apply(this,arguments);
 const [colors,...rows]=data,p=new Pix(16,16),ink=pal(colors);
 rows.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]!=='.')p.set(x,y,ink[parseInt(row[x],32)]);});
 return p;
};}
