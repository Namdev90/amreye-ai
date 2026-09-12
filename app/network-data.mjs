// Fixed invented fixtures. No surveillance feed, randomness, or patient records.
export const regions = Object.freeze({
 india:[{id:'goa',name:'Goa',x:186,y:294},{id:'maharashtra',name:'Maharashtra',x:200,y:237},{id:'karnataka',name:'Karnataka',x:220,y:327},{id:'delhi',name:'Delhi',x:255,y:117},{id:'tamil-nadu',name:'Tamil Nadu',x:272,y:371},{id:'west-bengal',name:'West Bengal',x:377,y:212}],
 global:[{id:'india',name:'India',x:424,y:209},{id:'europe',name:'Europe',x:326,y:105},{id:'north-america',name:'North America',x:121,y:120},{id:'south-america',name:'South America',x:194,y:297},{id:'africa',name:'Africa',x:320,y:244},{id:'asia-pacific',name:'Asia-Pacific outside India',x:505,y:142}]
});
export const organisms = Object.freeze({ecoli:'E. coli',kpneumoniae:'K. pneumoniae'});
export const antibiotics = Object.freeze({cip:'Ciprofloxacin',mem:'Meropenem'});
export const periods = Object.freeze(['2026-Q1','2026-Q2','2026-Q3']);
// Each region: [Q1 tested, resistant, Q2 tested, resistant, Q3 tested, resistant].
const base={goa:[100,32,120,42,120,48],maharashtra:[240,96,250,95,260,104],karnataka:[180,54,200,64,210,63],delhi:[160,72,170,68,180,81],'tamil-nadu':[150,45,160,40,180,54],'west-bengal':[140,56,160,64,170,68],india:[970,355,1060,373,1120,418],europe:[400,80,420,84,440,88],'north-america':[350,77,370,74,390,78],'south-america':[200,80,220,77,240,84],africa:[160,64,180,72,200,80],'asia-pacific':[360,126,380,133,400,140]};
export const mapFixture=Object.freeze(Object.entries(base).flatMap(([region,values])=>Object.keys(organisms).flatMap((organism,oi)=>Object.keys(antibiotics).flatMap((antibiotic,ai)=>periods.map((period,pi)=>{
 const tested=values[pi*2],resistant=values[pi*2+1];
 // Deterministic secondary examples; zero-denominator fixture teaches missingness.
 const missing=region==='africa'&&oi===1&&ai===1&&pi===2;
 return Object.freeze({region,organism,antibiotic,period,tested:missing?0:tested,resistant:missing?0:Math.max(0,resistant+oi*8-ai*20)});
})))));
export function resistancePercent(row){return row&&Number.isInteger(row.tested)&&row.tested>0&&Number.isInteger(row.resistant)&&row.resistant>=0&&row.resistant<=row.tested?row.resistant/row.tested*100:null;}
export function regionMetric(region,filters){
 const find=period=>mapFixture.find(r=>r.region===region&&r.organism===filters.organism&&r.antibiotic===filters.antibiotic&&r.period===period);
 const row=find(filters.period),percent=resistancePercent(row),index=periods.indexOf(filters.period),previous=index>0?find(periods[index-1]):null,priorPercent=resistancePercent(previous);
 return {region,tested:percent===null?null:row.tested,resistant:percent===null?null:row.resistant,percent,trend:percent===null||priorPercent===null?null:percent-priorPercent,previousPeriod:index>0?periods[index-1]:null};
}
export const defaultMapState={view:'india',selection:{india:'goa',global:'india'},organism:'ecoli',antibiotic:'cip',period:'2026-Q3'};
export function restoreMapState(value){
 if(!value||!Object.hasOwn(regions,value.view)||!Object.hasOwn(organisms,value.organism)||!Object.hasOwn(antibiotics,value.antibiotic)||!periods.includes(value.period))return {...defaultMapState,selection:{...defaultMapState.selection}};
 return {view:value.view,organism:value.organism,antibiotic:value.antibiotic,period:value.period,selection:Object.fromEntries(Object.entries(regions).map(([view,list])=>[view,list.some(r=>r.id===value.selection?.[view])?value.selection[view]:defaultMapState.selection[view]]))};
}
