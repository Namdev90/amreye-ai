from pathlib import Path
import urllib.request,hashlib,json
root=Path(__file__).parent
out=root.parent/'outputs'
data=json.loads((root/'final-readback-urls.json').read_text())
records=[]
for item in data:
 name=item['name']
 path=out/name if name=='AMREYE.AI Super Document.docx' else out/'Supporting documents'/name
 request=urllib.request.Request(item['url'],headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(request,timeout=60) as r: remote=r.read()
 digest=hashlib.sha256(remote).hexdigest()
 matches=digest==hashlib.sha256(path.read_bytes()).hexdigest()
 records.append({'name':name,'bytes':len(remote),'sha256':digest,'matches':matches})
 print(json.dumps(records[-1]),flush=True)
 assert matches,name
report=root/'final-readback-verification.json'
old=json.loads(report.read_text()) if report.exists() else []
byname={r['name']:r for r in old+records}
report.write_text(json.dumps(list(byname.values()),indent=2))
