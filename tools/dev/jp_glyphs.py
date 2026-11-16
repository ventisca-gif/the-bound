"""Glifos japoneses en píxeles para los carteles de Japón (v4.81).

Uso: python3 tools/dev/jp_glyphs.py   → escribe src/6zz9w_jp_glyphs.js

Dibuja cada carácter de JP_TEXTS con la fuente de mapa de bits WenQuanYi Zen Hei Sharp (10 y 12 px, sin suavizado)
y lo guarda como filas de bits en hexadecimal. En el juego, jpText(ctx, texto, x, y, color, tamaño, vertical)
pinta los carteles igual en todos los teléfonos (no depende de las fuentes del sistema).
Si añades un cartel nuevo, pon su texto aquí y vuelve a ejecutar la herramienta.
"""
from PIL import Image, ImageDraw, ImageFont
import json, os

FONT = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'
JP_TEXTS = [
    'カラオケ', 'ラーメン', '秋葉原', 'アキバ', 'ゲーム', 'アニメ', '東京', '新宿', '歌舞伎町', '浅草', '雷門', '寿司', '居酒屋', '焼肉', '焼鳥',
    'コンビニ', '喫茶', 'メイドカフェ', '電気街', '京都', '金閣寺', '富士山', '空港', '東京国際空港', 'ホテル', '薬', '書店', '酒', '営業中', '本日',
    '東京タワー', '映画', '漫画', 'フィギュア', 'カフェ', '駅', '一番', '大売出し', '新作', '限定', '祭', '和菓子', 'うどん', 'そば', '天ぷら',
    'お茶', '自販機', '茶屋', '旅館', '温泉', '神社', '寺', '桜', '花見', '入口', '出口', '止まれ', '中古', 'ガチャ', 'ロボ', '音楽', '歌',
    '甘味', '団子', '餃子', '定食', '弁当', '本屋', '服', '時計', '宝石', '銀座', '渋谷', '原宿', 'ラッキー', '激安', '二十四時間', '大人気',
    '日本', '大阪', '奈良', '鎌倉', '富士', '五重塔', '浅草寺', '仲見世', '提灯', '万歳', 'ようこそ', '日本へ', '発', '着', '便', '搭乗口',
    '銭湯', '竹', '風鈴', '扇子', '着物', '舞妓', '芸者', '猫', '犬', '星', '夢', '愛', '光', '雪', '月', '火', '水', '木', '金', '土', '日',
    '0123456789', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'ÁÉÍÓÚÑ', '-!?:.·', 'ー', '・', '成田', '羽田', '出発', '到着', '国際線', '案内',
]

SCAN = ['6zz9x_v481.js', '6zz9y_japon.js', '6zz9z_japon2.js', '6zz9za_japon3.js']   # también todos los kana y kanji que aparecen en estos archivos

def scanned():
    base = os.path.join(os.path.dirname(__file__), '..', '..', 'src'); out = ''
    for n in SCAN:
        p = os.path.join(base, n)
        if os.path.exists(p): out += ''.join(ch for ch in open(p, encoding='utf-8').read() if '\u3040' <= ch <= '\u30ff' or '\u4e00' <= ch <= '\u9fff')
    return out

def glyphs(size):
    f = ImageFont.truetype(FONT, size, index=1)
    chars = sorted(set(''.join(JP_TEXTS) + scanned()) - {' '})
    out = {}
    for ch in chars:
        im = Image.new('1', (size * 2, size * 2), 0); d = ImageDraw.Draw(im); d.fontmode = '1'
        d.text((0, 0), ch, font=f, fill=1)
        w = size if ord(ch) > 0x2000 else (size + 1) // 2 + 1
        rows = []
        for y in range(size + 1):
            v = 0
            for x in range(w):
                if im.getpixel((x, y)): v |= 1 << (w - 1 - x)
            rows.append(format(v, 'x'))
        out[ch] = [w, '.'.join(rows)]
    return out

def main():
    data = {10: glyphs(10), 12: glyphs(12)}
    js = ('// ================= v4.81: glifos japoneses en píxeles (generado por tools/dev/jp_glyphs.py, no editar a mano) =================\n'
          '// JPG[tamaño][carácter] = [ancho, filas en hexadecimal separadas por puntos]. Lo usa jpText en 6zz9y_japon.js.\n'
          'const JPG = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'src', '6zz9w_jp_glyphs.js')
    open(path, 'w', encoding='utf-8').write(js)
    print('glifos', len(data[10]), 'bytes', len(js.encode()))

if __name__ == '__main__':
    main()
