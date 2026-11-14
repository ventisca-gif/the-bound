"""Música del Velo Roto (v4.25): mete assets/music/velo1.mp3 y velo2.mp3 en src/6zyza_musica_data.js.
Se sacaron de los dos vídeos de Sergio (solo el audio, mono, 56 kbps) con ffmpeg:
  ffmpeg -i video.mp4 -vn -ac 1 -ar 44100 -af loudnorm=I=-18:TP=-2 -c:a libmp3lame -b:a 56k assets/music/veloN.mp3
Uso: python3 tools/dev/musica.py"""
import base64, json, os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
d = {k: 'data:audio/mpeg;base64,' + base64.b64encode(open(os.path.join(R, 'assets', 'music', k + '.mp3'), 'rb').read()).decode() for k in ('velo1', 'velo2')}
open(os.path.join(R, 'src', '6zyza_musica_data.js'), 'w').write('// Generado por tools/dev/musica.py (audio de los vídeos de Sergio). No editar a mano.\nconst MUSICA_VELO = ' + json.dumps(d) + ';\n')
print({k: len(v) for k, v in d.items()})
