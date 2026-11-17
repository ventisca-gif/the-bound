import json,unicodedata
from pathlib import Path
p=Path('src/6zz9zv_r133_data.js');D=json.loads(p.read_text().split('= ',1)[1].rsplit(';',1)[0])
base={'gray':['#202636','#3d4a5b','#6e7c8b','#a4b1b5','#dce3d8'],'bone':['#393336','#77654b','#c8b995','#e4d8b4','#fff1cf'],'pink':['#45263e','#81456b','#ba6e9b','#e8a3c4','#ffdae2'],'coral':['#441e24','#8c3430','#cf523b','#ee8660','#ffc59a'],'violet':['#20132f','#48245f','#79518e','#b582bd','#e9bee8'],'leaf':['#122923','#2e5132','#548049','#8fb66e','#ceda9e'],'black':['#101421','#252d3b','#424f5d','#738296','#b0b8c5']}
SL={'slime_m':['#30113d','#5d216d','#963c9f','#d77bd2','#f9b5ee'],'slime_h':['#233d65','#417eae','#8dcadd','#c0edee','#f2ffff'],'slime_arena':['#4b321d','#865d30','#bb914d','#dfc181','#fff0b7'],'slime_cristal':['#29174a','#5c3b8a','#9471ca','#c6a3ec','#f1dcff'],'slime_eclipse':['#100e20','#271638','#4c2b65','#85589a','#d49add']}
variants={}
for line in '''fur:lobo
thorn_mane:lobosombra
ice_mane:lobohielo
ice_crown:lobo_glacial
tusks:jabali
heavy_fur:oso
ridge_spots:hiena
rosettes:jaguar
void_horns:bestia
toxic_drips:slime_m
ice_shards:slime_h
lava_cracks:slime_r
sandstones:slime_arena
prism_crown:slime_cristal
void_ring:slime_eclipse
coal_shell:slime_brasa
spore_caps:slime_espora
coral:cangrejo
scar_shell:cangrejo_g
coral_crown:kragg
spined_eyes:cangrejo_mutante
spined_crown:rey_cangrejo
spiral:cangrejo_ermitano
anchor:cangrejo_ancla
sand_plates:escorpion
quartz:escorpcristal,aranacristal
barbs:escorp_abismo
molten:escorp_brasa
royal_blades:sahrak
abyss_blades:escorp_rey
amber:guardian_ambar
leaf_mark:arana
void_mark:arana_abismo
cave_spines:arana_cueva
sand_mark:araña_playa
rope_mark:araña_mastil
gold_web:arana_hilo
obsidian:ix_arana
portal_crown:reina_aracnida
red_scarf:muneco_nieve
black_frost:muneco_oscuro
royal_frost:rey_invierno
flame_tail:salamandra
volcanic_plates:salamandra_v
ember_frill:salamandra_ignea
blue_flames:salamandra_azul
royal_frill:salamandra_madre
rose_bell:medusa
glow_bell:medusa_abisal
storm_bell:medusa_tormenta
jade_scribe:lagarto_sabio
drowned_book:bibliotecario_ahogado
blue_roses:caballero_rosas
royal_roses:rey_rosas
lava_core:golem_magma
rune_plates:golem_runico
jade_guard:guardian_jade
cloud_armor:golem_nube
lightning_armor:golem_rayo
spindles:golem_telar
void_armor:coloso_umbrio
sun_shield:ix_guerrero
ruined_armor:coloso_ruinas
spectral_fins:tiburon_espectral
rose_gills:ajolote_rosa
void_gills:ajolote_negro
gold_gills:ajolote_dorado
crown_gills:ajolote_ancestral
pearl_shell:escarabajo_perla
ember_shell:escarabajo_brasa
sacred_shell:escarabajo_sagrado
sky_shell:escarabajo_cielo
sun_shell:ix_escarabajo'''.splitlines():
 v,ids=line.split(':');variants.update({id:v for id in ids.split(',')})
for S in D:
 id=S['feature']
 if id=='slime_m':S['theme']='poison'
 if id=='slime_h':S['theme']='ice'
 if id in ['salamandra','salamandra_v','salamandra_ignea','salamandra_madre']:S['theme']='fire'
 if not S['palette']:
  if id in SL:S['palette']=SL[id]
  elif S['family']=='human':S['palette']=base['black']if any(a in id for a in ['caballero','bandido','ladron','pirata','bibliotecario'])else base['leaf']if'bruja'in id or'sabio'in id else base['coral']if'goblin'in id else base['bone']if'esqueleto'in id else base['gray']if'orco'in id else None
  elif S['family']=='beast':S['palette']=base['gray']if id=='lobo'else base['black']if id=='bestia'else None
  elif S['family']=='bat':S['palette']=base['violet']if id in ['murcielago','murcieclipse','murci_espora']else base['leaf']if id=='murciselva'else base['gray']if id in ['murci_cueva','murci_ceniza']else None
  elif S['family']=='ghost'and id in ['fantasma','espectro_niebla']:S['palette']=base['gray']
  elif id=='medusa':S['palette']=base['pink']
  elif S['family']=='crab'and id in ['cangrejo','cangrejo_g','kragg']:S['palette']=base['coral']
  elif id=='sahrak':S['palette']=base['coral']
  elif S['family']=='fish'and id=='rape_abisal':S['palette']=base['black']
  elif S['family']=='fish'and id=='mero':S['palette']=['#2e2421','#574332','#94774d','#c0a475','#e6d3a8']
 S['variant']=variants.get(id,S['theme']+'_'+id)
p.write_text('// The exact 119 enemies + 14 bosses selected by Sergio from the audit.\nconst R133_DESIGNS = '+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n');print(len(D),'individual design specifications updated')
