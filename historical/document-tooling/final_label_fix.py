from pathlib import Path
from docx import Document
import json
root=Path(__file__).parent
names=['AMREYE AI Product and Laboratory Workflows.docx','AMREYE AI Software and Data Systems.docx','AMREYE AI Validation Legal and Safety.docx']
prefixes=('Function:','Field:','Term:','Capability element:')
for name in names:
 p=root.parent/'outputs'/'Supporting documents'/name;d=Document(p);n=0
 for para in d.paragraphs:
  if len(para.text)<180 and (para.text.startswith(prefixes)or para.text.rstrip().endswith(':')):
   para.paragraph_format.keep_with_next=True;n+=1
 d.save(p);print(json.dumps({'file':name,'grouped_labels':n}))
