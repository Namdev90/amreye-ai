from pathlib import Path
from collections import Counter
from zipfile import ZipFile
from lxml import etree
from docx import Document
import json,re
from docx.oxml.ns import qn
ROOT=Path(__file__).parent;OUT=ROOT.parent/'outputs'
manifest=json.loads((ROOT/'distribution-manifest.json').read_text(encoding='utf-8'))
source=json.loads((ROOT/'source-blocks.json').read_text(encoding='utf-8'))
expected=Counter(b['text']for b in source if 19<=b['index']<=7424 and b['text'] and b['index']not in [389,6546] and b.get('style')!='Heading 1')
actual=Counter();reports=[]
for path in OUT.rglob('*.docx'):
 d=Document(path);texts=[]
 for p in d.paragraphs:texts.append(p.text)
 for t in d.tables:texts.append('\n'.join(' | '.join(c.text for c in row.cells)for row in t.rows))
 if path.parent.name=='Supporting documents':actual.update(x for x in texts if x)
 z=ZipFile(path);duplicates=[n for n,c in Counter(z.namelist()).items()if c>1]
 anchors={b.get(qn('w:name'))for b in d.element.body.xpath('.//w:bookmarkStart')}
 missing=[h.get(qn('w:anchor'))for h in d.element.body.xpath('.//w:hyperlink')if h.get(qn('w:anchor')) and h.get(qn('w:anchor'))not in anchors]
 ids=set(d.part.rels)
 missing_ids=[val for e in d.element.body.iter()for key,val in e.attrib.items()if key.startswith('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}') and val not in ids]
 reports.append({'file':path.name,'words':sum(len(t.split())for t in texts),'paragraphs':len(d.paragraphs),'tables':len(d.tables),'images':len(d.inline_shapes),'duplicate_zip_parts':duplicates,'missing_anchors':missing,'missing_relationships':missing_ids})
lost=expected-actual
result={'source_substantive_blocks_assigned':len({i for arr in manifest['mapping'].values()for i in arr}),'expected_substantive_blocks':7424-19+1,'missing_text_instances':sum(lost.values()),'missing_text_samples':list(lost.items())[:6],'budget_sum_INR':sum([220000,160000,120000,100000,150000,250000]),'documents':reports}
(ROOT/'verification.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
assert not lost
assert all(not x['duplicate_zip_parts']and not x['missing_anchors']and not x['missing_relationships']for x in reports)
