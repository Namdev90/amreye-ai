from pathlib import Path
import subprocess
root=Path(__file__).parent/'qa'
poppler=Path(r'C:\Users\namde\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe')
targets={
 'AMREYE AI Product and Laboratory Workflows': [21,22],
 'AMREYE AI Software and Data Systems': [23,24,45,46,48,49],
 'AMREYE AI Validation Legal and Safety': [20,21]}
for name,pages in targets.items():
 dest=root/name
 for p in pages:
  subprocess.run([str(poppler),'-r','110','-png','-f',str(p),'-l',str(p),'-singlefile',str(root/(name+'.pdf')),str(dest/f'page-{p:03d}')],check=True,capture_output=True)
 print(name, 'rendered',pages,flush=True)
