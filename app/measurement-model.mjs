import {demoDiscs, classify, threshold} from './demo-rules.mjs';

export const REVIEWER = 'BAHU-01 (demo identity)';
export const REFERENCE_ID = 'synthetic-six-disc-reference-v1';
export const REFERENCES = Object.freeze({CIP:24, AMC:23, MEM:28, GEN:18, SXT:26, AMP:14});
export const SCENARIOS = Object.freeze({clean:'Clean demonstration plate', overlap:'Overlapping boundaries', fuzzy:'Fuzzy margins / swarming example', unreadable:'Unreadable / recapture required'});
export const validMm = mm => Number.isFinite(mm) && mm >= 6 && mm <= 40;
export const effectiveMm = record => record?.correctedMm ?? record?.originalMm ?? null;
const emptyRecords = (review = "pending") => Object.fromEntries(demoDiscs.map(d=>[d.code,{originalMm:null,correctedMm:null,verified:false,review}]));
export function initialReview(){return {scenario:'clean',profile:'A',status:'idle',generation:0,runId:null,records:emptyRecords(),drafts:{},corrections:[],audit:[]};}
export function readability(state){return state.status!=='complete'?'not assessed':state.scenario==='unreadable'?'unreadable':state.scenario==='clean'?'readable':'manual boundary review required';}
const clearApprovals = records => Object.fromEntries(Object.entries(records).map(([code,r])=>[code,{...r,verified:false,review:'pending'}]));
const audit = (s,a,message) => [...s.audit,{timestamp:a.at,reviewer:REVIEWER,runId:s.runId,action:message}];
export function reviewReducer(s,a){
 if(a.code && !demoDiscs.some(d=>d.code===a.code))return s;
 if(a.type==='reset')return {...initialReview(),generation:s.generation+1};
 if(a.type==='scenario'){
  if(!Object.hasOwn(SCENARIOS,a.value)||a.value===s.scenario)return s;
  return {...initialReview(),profile:s.profile,scenario:a.value,generation:s.generation+1};
 }
 if(a.type==='profile'){
  if(!['A','B'].includes(a.value)||s.profile===a.value)return s;
  return {...s,profile:a.value,records:clearApprovals(s.records),audit:audit(s,a,`Fictional profile ${s.profile} → ${a.value}; approvals cleared`)};
 }
 if(a.type==='run'){
  const generation=s.generation+1;
  const next={...initialReview(),scenario:s.scenario,profile:s.profile,generation,runId:`demo-run-${generation}`,status:'processing'};
  return {...next,audit:audit(next,a,'Synthetic analysis started; new run')};
 }
 if(a.type==='complete'){
  if(s.status!=='processing'||a.generation!==s.generation)return s;
  const records=s.scenario==='unreadable'?emptyRecords('not applicable'):Object.fromEntries(demoDiscs.map(d=>[d.code,{originalMm:d.mm,correctedMm:null,verified:false,review:'pending'}]));
  return {...s,status:'complete',records,audit:audit(s,a,s.scenario==='unreadable'?'Unreadable illustration; recapture required; no measurements produced':'Synthetic measurements ready')};
 }
 if(s.status!=='complete'||s.scenario==='unreadable'||!a.code)return s;
 const record=s.records[a.code];
 if(a.type==='draft')return {...s,drafts:{...s.drafts,[a.code]:{mm:String(effectiveMm(record)),reason:'',...s.drafts[a.code],...a.patch}}};
 if(a.type==='cancel') {const drafts={...s.drafts};delete drafts[a.code];return {...s,drafts};}
 if(a.type==='apply'){
  const draft=s.drafts[a.code];const mm=Number(draft?.mm);
  if(!draft?.mm?.trim()||!validMm(mm)||!draft.reason.trim())return s;
  const afterMm=Math.round(mm*10)/10;
  if(afterMm===effectiveMm(record))return s;
  const event={runId:s.runId,discCode:a.code,originalMm:record.originalMm,beforeMm:effectiveMm(record),afterMm,reason:draft.reason.trim(),timestamp:a.at,reviewer:REVIEWER};
  const drafts={...s.drafts};delete drafts[a.code];
  return {...s,drafts,records:{...s.records,[a.code]:{...record,correctedMm:afterMm,review:'pending',verified:false}},corrections:[...s.corrections,event],audit:audit(s,a,`${a.code} correction applied; approval and boundary verification cleared`)};
 }
 if(a.type==='verify')return {...s,records:{...s.records,[a.code]:{...record,verified:!!a.value,review:'pending'}},audit:audit(s,a,`${a.code} boundary verification ${a.value?'checked':'cleared'}`)};
 if(a.type==='confirm'){
  if(Object.keys(s.drafts).length||!validMm(effectiveMm(record))||(s.scenario!=='clean'&&!record.verified))return s;
  return {...s,records:{...s.records,[a.code]:{...record,review:'confirmed'}},audit:audit(s,a,`${a.code} confirmed in demo`)};
 }
 if(a.type==='reject')return {...s,records:{...s.records,[a.code]:{...record,review:'rejected',verified:false}},audit:audit(s,a,`${a.code} rejected; repeat required`)};
 return s;
}
export function compareMeasurements(records,profile){
 const rows=demoDiscs.map(d=>{
  const rawOriginal=records[d.code]?.originalMm, rawEffective=effectiveMm(records[d.code]);
  const originalMm=validMm(rawOriginal)?rawOriginal:null, mm=validMm(rawEffective)?rawEffective:null, referenceMm=REFERENCES[d.code];
  const category=classify(mm,d.code,profile),referenceCategory=classify(referenceMm,d.code,profile);
  const paired=validMm(mm)&&validMm(referenceMm)&&category!==null&&referenceCategory!==null;
  return {code:d.code,originalMm,mm,referenceMm,difference:paired?Math.round((mm-referenceMm)*100)/100:null,category:paired?category:null,referenceCategory:paired?referenceCategory:null,agreement:paired?category===referenceCategory:null};
 });
 const pairs=rows.filter(r=>r.difference!==null),n=pairs.length;
 return {rows,pairedCount:n,excludedCount:rows.length-n,meanDifference:n?pairs.reduce((s,r)=>s+r.difference,0)/n:null,meanAbsoluteDifference:n?pairs.reduce((s,r)=>s+Math.abs(r.difference),0)/n:null,categoryAgreement:n?pairs.filter(r=>r.agreement).length/n*100:null};
}
function freezeDeep(value){if(value&&typeof value==='object'){Object.values(value).forEach(freezeDeep);Object.freeze(value)}return value;}
export function captureReport(state,timestamp){
 if(state.status!=='complete'||Object.keys(state.drafts).length)throw new Error('Finish the run and apply or cancel pending corrections first.');
 const results=demoDiscs.map(d=>({...d,...state.records[d.code],originalMm:validMm(state.records[d.code].originalMm)?state.records[d.code].originalMm:null,correctedMm:validMm(state.records[d.code].correctedMm)?state.records[d.code].correctedMm:null,mm:validMm(effectiveMm(state.records[d.code]))?effectiveMm(state.records[d.code]):null,interpretation:classify(effectiveMm(state.records[d.code]),d.code,state.profile),thresholds:validMm(effectiveMm(state.records[d.code]))?threshold(d.code,state.profile):null,referenceMm:REFERENCES[d.code],correctionEvents:state.corrections.filter(e=>e.discCode===d.code)}));
 return freezeDeep(structuredClone({schemaVersion:'2.0',type:'SYNTHETIC DEMONSTRATION - NOT FOR CLINICAL USE',timestamp,runId:state.runId,reviewer:REVIEWER,scenario:state.scenario,readability:readability(state),outcome:state.scenario==='unreadable'?'Incomplete: unreadable illustration. Recapture required; no measurements or interpretations.':results.every(r=>r.review==='confirmed')?'Demo review complete':'Incomplete: some discs await review or require repeat.',profile:state.profile,ruleVersion:`fictional-${state.profile}-v1`,referenceFixtureId:REFERENCE_ID,results,comparison:compareMeasurements(state.records,state.profile),correctionEvents:state.corrections,audit:state.audit,signature:'No authenticated clinical signature. All review actions are simulated.'}));
}
export function reportCsv(report){
 const rows=[['schemaVersion',report.schemaVersion],['type',report.type],['timestamp',report.timestamp],['runId',report.runId],['reviewer',report.reviewer],['scenario',report.scenario],['readability',report.readability],['outcome',report.outcome],['referenceFixtureId',report.referenceFixtureId],['ruleVersion',report.ruleVersion],['pairedCount',report.comparison.pairedCount],['meanDifference',report.comparison.meanDifference],['meanAbsoluteDifference',report.comparison.meanAbsoluteDifference],['categoryAgreement',report.comparison.categoryAgreement],['code','name','potency','originalMm','correctedMm','mm','referenceMm','difference','interpretation','referenceCategory','agreement','review','boundaryVerified','correctionEvents'],...report.results.map((r,i)=>[r.code,r.name,r.potency,r.originalMm,r.correctedMm,r.mm,r.referenceMm,report.comparison.rows[i].difference,r.interpretation,report.comparison.rows[i].referenceCategory,report.comparison.rows[i].agreement,r.review,r.verified,JSON.stringify(r.correctionEvents)]),['audit',JSON.stringify(report.audit)]];
 // Formula-safe cells matter because correction reasons are visitor-entered text.
 return rows.map(row=>row.map(v=>{let text=v===null||v===undefined?'Not available':String(v);if(typeof v==='string'&&/^[=+@\-\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"'}).join(',')).join('\r\n');
}
