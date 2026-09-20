from pathlib import Path
from docx import Document
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
import json
root=Path(__file__).parent
dest=root/'render-ready';dest.mkdir(exist_ok=True)
for path in (root.parent/'outputs').rglob('*.docx'):
 d=Document(path)
 before=''.join(t.text or '' for t in d.element.body.xpath('.//w:t'))
 links=d.element.body.xpath('.//w:hyperlink')
 for h in links:
  parent=h.getparent();index=parent.index(h)
  for child in list(h):parent.insert(index,child);index+=1
  parent.remove(h)
 after=''.join(t.text or '' for t in d.element.body.xpath('.//w:t'));assert before==after
 used={v for e in d.element.iter() for k,v in e.attrib.items() if k.startswith('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}')}
 for rid,rel in list(d.part.rels.items()):
  if rel.reltype in [RT.HYPERLINK,RT.IMAGE] and rid not in used:d.part.drop_rel(rid)
 # Hyperlink wrappers do not affect printed text or formatting. These copies avoid
 # Word's stalled PDF link resolution while preserving all displayed content.
 d.save(dest/path.name)
 print(json.dumps({'file':path.name,'flattened_links':len(links),'visible_text_preserved':True}))
