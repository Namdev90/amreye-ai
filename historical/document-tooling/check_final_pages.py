from pathlib import Path
from pypdf import PdfReader
import json
root=Path(__file__).parent/'qa'
targets={
 'AMREYE AI Product and Laboratory Workflows': ['Function: Recovery'],
 'AMREYE AI Software and Data Systems': ['Capability element: Conventional baseline','Field: corrected_record_ids','Term: Bias'],
 'AMREYE AI Validation Legal and Safety': ['Validation']}
for name,needles in targets.items():
 r=PdfReader(root/(name+'.pdf'))
 print(name, 'pages',len(r.pages))
 for i,p in enumerate(r.pages):
  t=p.extract_text()
  for n in needles:
   if n in t and (name!= 'AMREYE AI Validation Legal and Safety' or i>=19):
    pos=t.find(n)
    print(json.dumps({'page':i+1,'label':n,'following':t[pos:pos+500],'end':t[-220:]},ensure_ascii=False))
