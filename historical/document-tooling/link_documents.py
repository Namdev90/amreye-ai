from pathlib import Path
from zipfile import ZipFile
from docx import Document
from docx.opc.constants import RELATIONSHIP_TYPE as RT
import json,sys,hashlib
root=Path(__file__).parent
mapping=json.loads((root/'drive-link-map.json').read_text(encoding='utf-8'))
files=[Path(x)for x in sys.argv[1:]] if len(sys.argv)>1 else list((root.parent/'outputs').rglob('*.docx'))
for p in files:
 before=ZipFile(p).read('word/document.xml')
 d=Document(p);count=0
 for rel in d.part.rels.values():
  if rel.reltype==RT.HYPERLINK and rel.is_external:
   original=str(rel.target_ref)
   base=original.split('#',1)[0].replace('\\','/').rsplit('/',1)[-1]
   if not original.startswith(('https://','http://')) and base in mapping:
    rel._target=mapping[base]+(('#'+original.split('#',1)[1])if '#'in original else '')
    count+=1
 if count:
  d.save(p)
  assert ZipFile(p).read('word/document.xml')==before,'Visible document structure changed'
 print(json.dumps({'file':p.name,'links_updated':count,'visible_document_unchanged':True}))
