"""After python3 build.py, prepare an opt-in native preview without changing the live game."""
from pathlib import Path
root=Path(__file__).resolve().parents[3]
src=Path(__file__).resolve().parent
dist=root/'dist'
for name,target in [('native.js','transmutador-native.js'),('ui.js','transmutador-ui.js'),('shell.html','transmutador.html')]:
 (dist/target).write_bytes((src/name).read_bytes())
code=(src/'native.js').read_text()+'\n'+(src/'ui.js').read_text()
html=(dist/'test.html').read_text().replace('</body>','<script>'+code.replace('</script','<\\/script')+'</script></body>')
(dist/'Transmutador_prueba_visual.html').write_text(html)
print('Prepared: dist/Transmutador_prueba_visual.html')
