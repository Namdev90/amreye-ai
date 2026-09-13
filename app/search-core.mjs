export const aliases = {
  'investor': ['business','service','validation'], 'invester': ['investor','business'],
  'pitch':['business','prototype','validation'], 'bahu':['operator','automation','interface'],
  'cell':['cell-culture'], 'stem':['stem-cell'], 'mic':['minimum','broth'],
  'zoi':['zone','diameter'], 'ast':['susceptibility','disk'], 'amr':['resistance'],
  'saas':['software','service'], 'lims':['laboratory','interoperability'],
  'campus':['college','teaching','audit'], 'rtpcr':['molecular','pcr'],
  'digital':['traceable','provenance'], 'offline':['local','reading'],
  'investr':['investor','business']
};
export const questions = [
 ['Start here','What is working in Reader V1 today?'],['Start here','What is demonstrated with synthetic data?'],['Start here','What still needs validation?'],
 ['Investors','What is the proposed business model?'],['Investors','How is System as a Service different from software SaaS?'],['Investors','What would a supervised pilot establish?'],
 ['Laboratories','How are unreadable images handled?'],['Laboratories','How do corrections affect approval?'],['Laboratories','Is direct MIC different from a zone measurement?'],
 ['Researchers','What is the cell-culture research direction?'],['Researchers','Are stem-cell workflows implemented?'],['Researchers','How would molecular results connect to phenotype data?'],
 ['Institutions','What does a campus audit include?'],['Institutions','How could a teaching laboratory collaborate?'],['Institutions','Which AMR map values are synthetic?'],
 ['Platform','What does BAHU mean?'],['Platform','What does the plate digital record contain?'],['Platform','What can I read offline?'],
 ['Platform','How could LIMS integration work?'],['Platform','Which data are measured, derived or simulated?']
];
const stop=new Set(['what','does','how','the','and','for','are','with','would','could','from','which','this','that','into','is','a','to','i','in','of','do','an','as','can']);
const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\bcells\b/g,'cell');
const contains=(text,term)=>(' '+text+' ').includes(' '+norm(term)+' ');
export function searchTopics(topics,query){
 const direct=norm(query).split(' ').filter(t=>t&&!stop.has(t));
 if(!direct.length)return [];
 const terms=[...new Set(direct.flatMap(t=>[t,...(aliases[t]||[])]))];
 return topics.map(topic=>{const title=norm(topic.title),body=norm([topic.category,topic.status,topic.searchText||'',...topic.text,...topic.tables.flat(2)].join(' '));const score=terms.reduce((n,t)=>n+(contains(title,t)?(direct.includes(t)?16:6):0)+(contains(body,t)?2:0),0)+(contains(title,query)?20:0);return{topic,score}}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.topic.title.localeCompare(b.topic.title));
}
export function relatedTopics(topics,topic){
 const explicit=topic.related||[];
 const links=topics.filter(t=>t.id!==topic.id&&(explicit.includes(t.id)||(t.related||[]).includes(topic.id)));
 return links.length?links:topics.filter(t=>t.id!==topic.id&&t.category===topic.category).slice(0,4);
}
