# v4.60: fondo de la Academia Arcana (castillo y cielo en espiral) desde la imagen de Sergio, pixelado.
import base64, io
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
im = Image.open('tools/art/ref/academia_sergio.jpg').convert('RGB')
W, H = im.size
crop = im.crop((0, 120, W, 1110))               # cielo + castillo (sin el camino de abajo)
tw = 400; th = round(crop.height * tw / crop.width)
small = crop.resize((tw, th), Image.BOX).quantize(colors=64, method=Image.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
bio = io.BytesIO(); small.save(bio, 'PNG', optimize=True)
open('src/6zz6a_art_v460.js', 'w').write('// v4.60: fondo de la Academia Arcana (tools/art/make_v460.py; original en tools/art/ref)\n' + f"const ART60_SKY = {{ src: 'data:image/png;base64,{base64.b64encode(bio.getvalue()).decode()}', w: {tw}, h: {th} }};\n")
small.save('/tmp/acad_sky.png'); print(tw, th, len(bio.getvalue()))
