from pathlib import Path
from docx import Document
from pypdf import PdfReader
from zipfile import ZipFile,ZIP_DEFLATED
import json,shutil,hashlib
root=Path(__file__).parent;out=root.parent/'outputs'
manifest=json.loads((root/'distribution-manifest.json').read_text(encoding='utf-8'))
links=json.loads((root/'drive-link-map.json').read_text(encoding='utf-8'))
verification=json.loads((root/'verification.json').read_text(encoding='utf-8'))
backup=out/'Source backup';backup.mkdir(exist_ok=True)
backupfile=backup/'2026-09-19 Original master before restructuring.docx'
shutil.copy2(root/'source-master.docx',backupfile)
main=Document(out/'AMREYE.AI Super Document.docx')
words=sum(len(p.text.split())for p in main.paragraphs)+sum(len(c.text.split())for t in main.tables for r in t.rows for c in r.cells)
counts={p.stem+'.docx':len(PdfReader(p).pages)for p in (root/'qa').glob('AMREYE*.pdf')}
lines=['# AMREYE AI document set','', 'Start with **AMREYE.AI Super Document.docx**, the seven-page main project overview. The existing Drive master keeps the same file ID.','',f'The source contained approximately {manifest["source_words"]:,} words. The main overview now contains approximately {words:,} words, with technical detail retained in seven supporting documents.','', '## Budget scope','', 'The INR 10 lakh working budget covers first core Reader V1 development, research and validation. The retained reference component BOM is approximately INR 69,242 before unresolved charges. These have different scopes. Later Bio-Vault and APEX XR development needs a separate budget.','', '## Files','', '| Document | Rendered pages |','| --- | ---: |',f'| Main project overview | {counts["AMREYE.AI Super Document.docx"]} |']
for m in manifest['modules']:lines.append(f'| {m["title"].replace("AMREYE AI ","")} | {counts[m["file"]]} |')
lines+=['','## What changed','', '- The main document now concentrates on the project, first product, current evidence, customers, commercial model, team, budget and future direction.','- Detailed operating rules, legal and regulatory material, technical design, research, data definitions, procurement and financial scenarios are in specialist references.','- All 7,406 substantive source blocks were assigned to a supporting document. Exact retained text was checked, with two recorded editorial sentence repairs. Two crowded diagrams were re-expressed as editable text or a mapping table; their original artwork remains in the source backup.','- Main and supporting documents were rendered for visual review. Table row splits and orphaned headings were corrected. Original figure and table numbers remain in the supporting references for traceability.','- Internal document links point to the corresponding Drive records. No sharing permissions were broadened.','', '## Source preservation','', 'The Source backup folder contains the unchanged original downloaded from Drive before restructuring. Its SHA-256 was verified against the uploaded Drive backup. The source master was last modified on 17 September 2026; this document set was prepared on 19 September 2026.','', 'The review reorganized existing material. It did not commission new scientific research or independently revalidate external technical claims. The unresolved INR 500 integrated-platform BOM discrepancy remains visible in the financial reference.','', '## Drive locations','', f'- [Main project overview]({links["AMREYE.AI Super Document.docx"]})','- [Supporting documents](https://drive.google.com/drive/folders/18dH1nPJ6tMnGr5CLrlj4Met0WpENVP5J)','- [Original source backup](https://drive.google.com/file/d/1Bh9etwikZzFPd7iqqK77BOXqGaOtNCDF/view)','']
(out/'Start here.md').write_text('\n'.join(lines),encoding='utf-8')
with ZipFile(out/'AMREYE AI Main and Supporting Documents.zip','w',ZIP_DEFLATED)as z:
 for p in out.rglob('*'):
  if p.is_file()and p.suffix in ['.docx','.md']:z.write(p,p.relative_to(out))
result={'main_pages':counts['AMREYE.AI Super Document.docx'],'main_words':words,'source_words':manifest['source_words'],'companion_pages':counts,'source_backup_sha256':hashlib.sha256(backupfile.read_bytes()).hexdigest(),'zip_bytes':(out/'AMREYE AI Main and Supporting Documents.zip').stat().st_size,'source_text_check_missing':verification['missing_text_instances']}
(root/'delivery-verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
