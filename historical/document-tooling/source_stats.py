from pathlib import Path
from docx import Document
from pypdf import PdfReader
from collections import Counter
import json
root=Path(__file__).parent
d=Document(root/'source-master.docx')
b=json.loads((root/'source-blocks.json').read_text(encoding='utf-8'))
starts=[x for x in b if x.get('style')=='Heading 1']
stats=[]
for j,x in enumerate(starts):
 end=starts[j+1]['index'] if j+1<len(starts) else 99999
 items=[z for z in b if x['index']<=z['index']<end]
 stats.append({'start':x['index'],'end':end-1,'title':x['text'],'words':sum(len(z['text'].split())for z in items)})
print(json.dumps(stats))
p=Path(r'C:\Users\namde\Documents\Codex\2026-09-17\referenced-chatgpt-conversation-this-is-an\work')
print(json.dumps({n:len(PdfReader(p/n).pages)for n in ['product-consolidated.pdf','product-final.pdf']}))
imgs=[]
(root/'source-images').mkdir(exist_ok=True)
for i,el in enumerate(d.element.body):
 for blip in el.xpath('.//a:blip'):
  from docx.oxml.ns import qn
  rid=blip.get(qn('r:embed'))
  part=d.part.related_parts[rid]
  dest=root/'source-images'/Path(str(part.partname)).name
  dest.write_bytes(part.blob)
  imgs.append({'index':i,'file':str(dest),'previous':next((x['text'] for x in b if x['index']==i-1),'')})
print(json.dumps(imgs))
(root/'source-stats.json').write_text(json.dumps({'chapters':stats,'images':imgs},indent=2),encoding='utf-8')
