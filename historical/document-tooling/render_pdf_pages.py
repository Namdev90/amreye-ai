from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image,ImageOps,ImageDraw
import json,sys,subprocess
root=Path(__file__).parent
files=[Path(x) for x in sys.argv[1:]] if len(sys.argv)>1 else list((root/'qa').glob('AMREYE*.pdf'))
results=[]
for f in files:
 dest=f.with_suffix('');dest.mkdir(exist_ok=True)
 doc=pdfium.PdfDocument(f)
 lengths=[]
 poppler=Path(r'C:\Users\namde\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe')
 subprocess.run([str(poppler),'-r','100','-png',str(f),str(dest/'poppler')],check=True,capture_output=True)
 for imfile in dest.glob('poppler-*.png'):
  number=int(imfile.stem.rsplit('-',1)[1]);imfile.replace(dest/f'page-{number:03d}.png')
 for page in doc:lengths.append(len(page.get_textpage().get_text_range()))
 # Contact sheets are a supplemental navigation aid; full pages remain available for review.
 for start in range(0,len(doc),12):
  canvas=Image.new('RGB',(4*230,3*405),'#ddd');draw=ImageDraw.Draw(canvas)
  for j,i in enumerate(range(start,min(start+12,len(doc)))):
   im=Image.open(dest/f'page-{i+1:03d}.png');im.thumbnail((220,365))
   x=(j%4)*230+5;y=(j//4)*405+25
   canvas.paste(im,(x,y));draw.text((x,y-18),str(i+1),fill='black')
  canvas.save(dest/f'contact-{start//12+1:02d}.png')
 info={'pdf':f.name,'pages':len(doc),'short_pages':[{'page':i+1,'chars':n}for i,n in enumerate(lengths)if n<180],'page_text_lengths':lengths}
 (dest/'page-metrics.json').write_text(json.dumps(info,indent=2),encoding='utf-8');results.append(info)
 print(json.dumps({'file':f.name,'pages':len(doc),'short_pages':info['short_pages']}),flush=True)
(root/'qa'/'render-metrics.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
