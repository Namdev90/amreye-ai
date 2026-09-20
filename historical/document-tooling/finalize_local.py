from pathlib import Path
from zipfile import ZipFile
import hashlib,shutil,json
root=Path(__file__).parent
out=root.parent/'outputs'
desktop=Path(r'C:\Users\namde\Desktop\AMR-EYE.ai\AMREYE.AI Super Document.docx')
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
source=root/'source-master.docx'
main=out/'AMREYE.AI Super Document.docx'
if desktop.exists() and digest(desktop)==digest(source):
 shutil.copy2(main,desktop)
 print('Desktop original safely updated; final hash matches',digest(desktop)==digest(main))
elif desktop.exists() and digest(desktop)==digest(main):print('Desktop already matches final master')
else:print('Desktop preserved because it differs from source')
with ZipFile(out/'AMREYE AI Main and Supporting Documents.zip') as z:
 assert z.testzip() is None
 docs=[n for n in z.namelist() if n.endswith('.docx')]
 assert len(docs)==9,len(docs)
 for n in z.namelist():assert z.read(n)==(out/n).read_bytes(),n
 print('ZIP verified',len(docs),'Word files plus readme; all bytes match')
