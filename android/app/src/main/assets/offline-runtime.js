// AMReye.AI · High-Performance Standalone Offline Runtime
// Provides instantaneous, zero-latency DOM interactions without server dependencies

(function () {
  'use strict';

  const routeTitles = {
    hub: 'Experience hub',
    home: 'Experience hub',
    products: 'Products',
    demo: 'Synthetic demo',
    research: 'Research library',
    library: 'Research library',
    apex: 'Research library',
    story: 'Project story',
    'project-story': 'Project story',
    team: 'Our team',
    recognition: 'Milestones & wins',
    guide: 'Project guide',
    about: 'About & contact',
    pathways: 'Collaboration',
    references: 'Concept references',
    network: 'AMR network concept',
    business: 'Commercial strategy',
    roadmap: 'Evidence roadmap'
  };

  // BEGIN OFFLINE FRAGMENT ROUTES
  const routeAlias = {
    home: 'hub',
    library: 'research',
    apex: 'research',
    'analysis-workbench': 'demo',
    console: 'demo',
    'project-story': 'story'
  };

  function normalize(route) {
    const clean = (route || '').replace(/^#\/?/, '').trim();
    return (Object.hasOwn(routeAlias, clean) ? routeAlias[clean] : clean) || 'hub';
  }

  function resolveOfflineFragment(fragment) {
    const route = normalize(fragment);
    if (route === 'main-content') return { kind: 'skip' };
    if (['hub', 'products', 'demo', 'research', 'story', 'team', 'recognition', 'guide', 'about'].includes(route)) {
      return { kind: 'section', route };
    }
    const queries = { pathways: 'collaboration', references: 'reference', business: 'business', network: 'surveillance', roadmap: 'validation', 'project-progress': 'development' };
    if (Object.hasOwn(queries, route)) return { kind: 'library', query: queries[route] };
    return { kind: 'anchor' };
  }
  // END OFFLINE FRAGMENT ROUTES

  // --- Toast Notification Helper ---
  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  // --- 1. Tab & Section Navigation ---
  function updateActiveSection(targetRoute) {
    const route = normalize(targetRoute);
    const sections = document.querySelectorAll('.app-section');
    let matched = false;

    sections.forEach((sec) => {
      const secId = sec.getAttribute('data-route') || sec.id;
      if (secId === route || (route === 'hub' && (secId === 'hub' || secId === 'home'))) {
        sec.classList.add('is-active');
        sec.style.display = 'block';
        matched = true;
      } else {
        sec.classList.remove('is-active');
        sec.style.display = 'none';
      }
    });

    if (!matched && sections.length > 0) {
      const hub = document.getElementById('hub') || sections[0];
      if (hub) {
        hub.classList.add('is-active');
        hub.style.display = 'block';
      }
    }

    // Update bottom dock links
    document.querySelectorAll('.atelier-dock a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkRoute = normalize(href);
      if (linkRoute === route || (route === 'hub' && linkRoute === 'home')) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('is-active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('is-active');
      }
    });

    // Update top header status context pill
    const contextEl = document.querySelector('.nav-context b');
    if (contextEl) {
      contextEl.textContent = routeTitles[route] || 'Explore AMReye.AI';
    }

    // Update main container attribute
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.setAttribute('data-active-section', route);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function initNavigation() {
    const restoreRoute = () => {
      const destination = resolveOfflineFragment(location.hash);
      if (destination.kind === 'section') updateActiveSection(destination.route);
    };
    window.addEventListener('hashchange', restoreRoute);
    window.addEventListener('popstate', restoreRoute);

    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target && !e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && target.target !== '_blank') {
        const href = target.getAttribute('href');
        if (href && href.length > 1) {
          const destination = resolveOfflineFragment(href);
          if (destination.kind === 'skip') {
            e.preventDefault();
            const main = document.getElementById('main-content');
            if (main) {
              if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
              main.focus();
              main.scrollIntoView({ block: 'start' });
            }
          } else if (destination.kind === 'library') {
            e.preventDefault();
            if (window.AmreyeOfflineLibrary?.search) {
              window.AmreyeOfflineLibrary.search(destination.query).catch(() => showToast('The bundled library could not be opened.'));
            } else {
              showToast('The bundled library is still loading. Try this link again.');
            }
          } else if (destination.kind === 'section') {
            e.preventDefault();
            if (location.hash !== href) {
              history.pushState(null, '', href);
            }
            updateActiveSection(destination.route);
          }
        }
      }
    });

    restoreRoute();
  }

  // --- 2. Quick Pitch Modal ---
  function initPitchModal() {
    const pitchModal = document.getElementById('pitch-modal-overlay');
    if (!pitchModal) return;

    let timerInterval = null;
    let secondsLeft = 240;
    const timerDisplay = pitchModal.querySelector('.pitch-timer-display');
    const startBtn = pitchModal.querySelector('.pitch-timer-toggle');

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const rem = s % 60;
      return `${m}:${rem < 10 ? '0' : ''}${rem}`;
    }

    function updateTimer() {
      if (timerDisplay) {
        timerDisplay.textContent = formatTime(secondsLeft);
      }
    }

    function openPitch() {
      pitchModal.classList.add('is-open');
      pitchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      secondsLeft = 240;
      updateTimer();
    }

    function closePitch() {
      pitchModal.classList.remove('is-open');
      pitchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      if (startBtn) startBtn.textContent = 'Start timer';
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.brief-button, [data-action="open-pitch"], button:has(.lucide-clock-3)');
      if (trigger) {
        e.preventDefault();
        openPitch();
      }
      if (e.target.closest('.pitch-modal-close') || e.target.classList.contains('pitch-modal-backdrop')) {
        e.preventDefault();
        closePitch();
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
          startBtn.textContent = 'Resume';
        } else {
          startBtn.textContent = 'Pause';
          timerInterval = setInterval(() => {
            if (secondsLeft > 0) {
              secondsLeft--;
              updateTimer();
            } else {
              clearInterval(timerInterval);
              timerInterval = null;
              startBtn.textContent = 'Done';
              showToast('Pitch timer completed!');
            }
          }, 1000);
        }
      });
    }

    pitchModal.querySelectorAll('.pitch-duration-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        pitchModal.querySelectorAll('.pitch-duration-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const mins = parseInt(chip.getAttribute('data-mins') || '4', 10);
        secondsLeft = mins * 60;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
          if (startBtn) startBtn.textContent = 'Start timer';
        }
        updateTimer();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pitchModal.classList.contains('is-open')) {
        closePitch();
      }
    });
  }

  // --- 3. Site Directory Drawer ---
  function initDirectoryDrawer() {
    const drawer = document.getElementById('directory-drawer-overlay');
    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    window.__closeFrontierMenu = closeDrawer;

    document.addEventListener('click', (e) => {
      if (e.target.closest('.index-button, [aria-label="Open site directory"]')) {
        e.preventDefault();
        openDrawer();
      }
      if (e.target.closest('.directory-close-btn') || e.target.classList.contains('directory-drawer-backdrop')) {
        e.preventDefault();
        closeDrawer();
      }
      if (e.target.closest('#directory-drawer-overlay a[href^="#"]')) {
        closeDrawer();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  // BEGIN SYNTHETIC EXPORT
  function saveSyntheticReport(format, text, filename) {
    if (!['json', 'csv'].includes(format) || typeof text !== 'string') {
      throw new TypeError('Synthetic report export requires JSON or CSV text.');
    }
    if (window.AndroidBridge && typeof window.AndroidBridge.saveSyntheticReport === 'function') {
      window.AndroidBridge.saveSyntheticReport(format, text);
      return;
    }
    const url = URL.createObjectURL(new Blob([text], {
      type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  // END SYNTHETIC EXPORT

  // --- 4. Synthetic demo: standalone adapter for the frozen offline HTML ---
  function initSyntheticDemo() {
    // Snapshot of the canonical fictional rules and review model; no clinical cutoffs.
    // BEGIN CANONICAL SYNTHETIC MODEL
// Deliberately fictional thresholds, never clinical CLSI or EUCAST data.
const demoDiscs = Object.freeze([
 {code:"CIP",name:"Ciprofloxacin",potency:"5",mm:25.4},
 {code:"AMC",name:"Amoxicillin–clavulanate",potency:"20/10",mm:19},
 {code:"MEM",name:"Meropenem",potency:"10",mm:28},
 {code:"GEN",name:"Gentamicin",potency:"10",mm:18.6},
 {code:"SXT",name:"Trimethoprim–sulfamethoxazole",potency:"1.25/23.75",mm:26},
 {code:"AMP",name:"Ampicillin",potency:"10",mm:6}
].map(d=>Object.freeze(d)));
function threshold(code,profile){const i=demoDiscs.findIndex(d=>d.code===code);if(i<0||!["A","B"].includes(profile))return null;const s=[23,22,24,21,23,19][i];const r=[17,16,18,15,17,13][i];return {s:s+(profile==="B"?3:0),r:r+(profile==="B"?2:0)}}
function classify(mm,code,profile){if(!Number.isFinite(mm)||mm<6||mm>40)return null;const cut=threshold(code,profile);if(!cut)return null;return mm>=cut.s?"S":mm<cut.r?"R":"I"}


const REVIEWER = 'BAHU-01 (demo identity)';
const REFERENCE_ID = 'synthetic-six-disc-reference-v1';
const REFERENCES = Object.freeze({CIP:24, AMC:23, MEM:28, GEN:18, SXT:26, AMP:14});
const SCENARIOS = Object.freeze({clean:'Clean demonstration plate', overlap:'Overlapping boundaries', fuzzy:'Fuzzy margins / swarming example', unreadable:'Unreadable / recapture required'});
const validMm = mm => Number.isFinite(mm) && mm >= 6 && mm <= 40;
const effectiveMm = record => record?.correctedMm ?? record?.originalMm ?? null;
const emptyRecords = (review = "pending") => Object.fromEntries(demoDiscs.map(d=>[d.code,{originalMm:null,correctedMm:null,verified:false,review}]));
function initialReview(){return {scenario:'clean',profile:'A',status:'idle',generation:0,runId:null,records:emptyRecords(),drafts:{},corrections:[],audit:[]};}
function readability(state){return state.status!=='complete'?'not assessed':state.scenario==='unreadable'?'unreadable':state.scenario==='clean'?'readable':'manual boundary review required';}
const clearApprovals = records => Object.fromEntries(Object.entries(records).map(([code,r])=>[code,{...r,verified:false,review:'pending'}]));
const audit = (s,a,message) => [...s.audit,{timestamp:a.at,reviewer:REVIEWER,runId:s.runId,action:message}];
function reviewReducer(s,a){
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
function compareMeasurements(records,profile){
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
function captureReport(state,timestamp){
 if(state.status!=='complete'||Object.keys(state.drafts).length)throw new Error('Finish the run and apply or cancel pending corrections first.');
 const results=demoDiscs.map(d=>({...d,...state.records[d.code],originalMm:validMm(state.records[d.code].originalMm)?state.records[d.code].originalMm:null,correctedMm:validMm(state.records[d.code].correctedMm)?state.records[d.code].correctedMm:null,mm:validMm(effectiveMm(state.records[d.code]))?effectiveMm(state.records[d.code]):null,interpretation:classify(effectiveMm(state.records[d.code]),d.code,state.profile),thresholds:validMm(effectiveMm(state.records[d.code]))?threshold(d.code,state.profile):null,referenceMm:REFERENCES[d.code],correctionEvents:state.corrections.filter(e=>e.discCode===d.code)}));
 return freezeDeep(structuredClone({schemaVersion:'2.0',type:'SYNTHETIC DEMONSTRATION - NOT FOR CLINICAL USE',timestamp,runId:state.runId,reviewer:REVIEWER,scenario:state.scenario,readability:readability(state),outcome:state.scenario==='unreadable'?'Incomplete: unreadable illustration. Recapture required; no measurements or interpretations.':results.every(r=>r.review==='confirmed')?'Demo review complete':'Incomplete: some discs await review or require repeat.',profile:state.profile,ruleVersion:`fictional-${state.profile}-v1`,referenceFixtureId:REFERENCE_ID,results,comparison:compareMeasurements(state.records,state.profile),correctionEvents:state.corrections,audit:state.audit,signature:'No authenticated clinical signature. All review actions are simulated.'}));
}
function reportCsv(report){
 const rows=[['schemaVersion',report.schemaVersion],['type',report.type],['timestamp',report.timestamp],['runId',report.runId],['reviewer',report.reviewer],['scenario',report.scenario],['readability',report.readability],['outcome',report.outcome],['referenceFixtureId',report.referenceFixtureId],['ruleVersion',report.ruleVersion],['pairedCount',report.comparison.pairedCount],['meanDifference',report.comparison.meanDifference],['meanAbsoluteDifference',report.comparison.meanAbsoluteDifference],['categoryAgreement',report.comparison.categoryAgreement],['code','name','potency','originalMm','correctedMm','mm','referenceMm','difference','interpretation','referenceCategory','agreement','review','boundaryVerified','correctionEvents'],...report.results.map((r,i)=>[r.code,r.name,r.potency,r.originalMm,r.correctedMm,r.mm,r.referenceMm,report.comparison.rows[i].difference,r.interpretation,report.comparison.rows[i].referenceCategory,report.comparison.rows[i].agreement,r.review,r.verified,JSON.stringify(r.correctionEvents)]),['audit',JSON.stringify(report.audit)]];
 // Formula-safe cells matter because correction reasons are visitor-entered text.
 return rows.map(row=>row.map(v=>{let text=v===null||v===undefined?'Not available':String(v);if(typeof v==='string'&&/^[=+@\-\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"'}).join(',')).join('\r\n');
}
    // END CANONICAL SYNTHETIC MODEL

    const demoSec = document.getElementById('demo');
    if (!demoSec) return;
    const runButton = demoSec.querySelector('.workbench-visual > button.solid-link');
    const resetButton = demoSec.querySelector('.workbench-controls > button');
    const selects = demoSec.querySelectorAll('.workbench-controls select');
    const results = demoSec.querySelector('.workbench-results');
    const reportButton = results.querySelector('button.text-link');
    const hint = results.querySelector('.review-hint');
    const progress = demoSec.querySelector('.metrology-progress');
    const plate = demoSec.querySelector('.metrology-plate');
    const panel = document.createElement('div');
    panel.className = 'caliper-panel';
    results.insertBefore(panel, reportButton);
    let state = initialReview(), selected = 'CIP', overlay = true, step = 0, timer = null;
    const stages = ['Plate registration', 'Scale reference', 'Disc identification', 'Boundary segmentation', 'Diameter measurement', 'Fictional rules', 'Human review'];
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const mm = value => validMm(value) ? value.toFixed(1) : 'Not available';
    const pending = () => Object.keys(state.drafts).length > 0;
    const readable = () => state.status === 'complete' && state.scenario !== 'unreadable';
    const send = action => { state = reviewReducer(state, {...action, at:new Date().toISOString()}); render(); };
    const stopTimer = () => { if (timer !== null) clearInterval(timer); timer = null; };
    const rows = [...results.querySelectorAll('.metrology-table tbody tr')];
    rows.forEach((row, i) => row.querySelector('button').setAttribute('data-select-disc', demoDiscs[i].code));

    function renderPlate() {
      if (!plate) return;
      plate.setAttribute('data-plate-view', overlay ? 'overlay' : 'raw');
      plate.querySelectorAll('[data-offline-overlay]').forEach(el => el.remove());
      demoDiscs.forEach((disc, i) => {
        const original = plate.querySelector(`[data-original-zone="${disc.code}"]`);
        if (!original) return;
        const group = original.parentElement;
        group.style.display = state.scenario === 'unreadable' ? 'none' : '';
        group.setAttribute('transform', state.scenario === 'overlap' && i === 1 ? 'translate(-30 -25)' : 'translate(0 0)');
        group.setAttribute('data-select-disc', disc.code);
        group.setAttribute('role', 'button');
        group.setAttribute('tabindex', readable() ? '0' : '-1');
        group.setAttribute('aria-disabled', String(!readable()));
        const effective = effectiveMm(state.records[disc.code]);
        group.setAttribute('aria-label', `${disc.code} synthetic effective zone ${mm(effective)}${effective === null ? '' : ' millimetres'}`);
        if (!readable() || !overlay) return;
        const x = Number(original.getAttribute('cx')), y = Number(original.getAttribute('cy'));
        const draft = state.drafts[disc.code];
        const draw = (value, color, dashed) => {
          if (!validMm(value)) return;
          const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
          circle.setAttribute('data-offline-overlay','true');
          Object.entries({cx:x,cy:y,r:value / 90 * 160,fill:'none',stroke:color,'stroke-width':disc.code === selected ? 2 : 1,'stroke-dasharray':dashed ? '3 4' : 'none'}).forEach(([k,v]) => circle.setAttribute(k,String(v)));
          group.appendChild(circle);
        };
        draw(effective,disc.code === selected ? '#78ddcc' : '#d8dfae',state.scenario === 'fuzzy');
        if (draft && draft.mm.trim()) draw(Number(draft.mm),'#e7a1ff',true);
      });
      if (state.scenario === 'unreadable') {
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        Object.entries({'data-offline-overlay':'true',x:180,y:180,'text-anchor':'middle',fill:'#fff','font-size':14}).forEach(([k,v]) => text.setAttribute(k,String(v)));
        text.textContent = 'Unreadable — recapture required'; plate.appendChild(text);
      }
    }

    function updateActions() {
      const draft = state.drafts[selected], current = state.records[selected];
      const apply = panel.querySelector('[data-demo-action="apply"]');
      if (apply) apply.disabled = !draft || !draft.mm.trim() || !validMm(Number(draft.mm)) || !draft.reason.trim() || Math.round(Number(draft.mm)*10)/10 === effectiveMm(current);
      const cancel = panel.querySelector('[data-demo-action="cancel"]');
      if (cancel) cancel.disabled = !draft;
      const confirm = panel.querySelector('[data-demo-action="confirm"]');
      if (confirm) confirm.disabled = pending() || (state.scenario !== 'clean' && !current.verified);
      const reject = panel.querySelector('[data-demo-action="reject"]');
      if (reject) reject.disabled = pending();
      reportButton.disabled = state.status !== 'complete' || pending();
      const status = panel.querySelector('[data-draft-status]');
      if (status) status.textContent = pending() ? 'Pending correction: apply or cancel every draft before review or reporting.' : 'No pending correction. Fictional demonstration only.';
    }

    function render() {
      const complete = state.status === 'complete', running = state.status === 'processing';
      selects[0].value = state.profile; selects[1].value = state.scenario;
      runButton.disabled = running;
      runButton.textContent = running ? stages[Math.min(step,6)] : complete ? 'Run demonstration again' : 'Run synthetic analysis';
      progress.textContent = running ? stages[Math.min(step,6)] : complete ? `Run complete · ${readability(state)}` : 'Ready · run analysis to begin';
      const bar = document.createElement('progress'); bar.max = 7; bar.value = complete ? 7 : running ? step : 0; progress.appendChild(bar);
      demoSec.querySelectorAll('.preset-chip').forEach(chip => chip.classList.toggle('active',chip.dataset.scenario === state.scenario));
      rows.forEach((row,i) => {
        const disc = demoDiscs[i], value = effectiveMm(state.records[disc.code]);
        row.setAttribute('data-selected',String(selected === disc.code));
        row.querySelector('button').disabled = !readable();
        row.children[1].textContent = value === null ? 'Not available' : mm(value) + ' mm';
        row.children[2].textContent = classify(value,disc.code,state.profile) ?? 'Not available';
      });
      panel.hidden = !readable(); hint.hidden = readable();
      hint.textContent = complete ? 'Recapture required. No measurements or interpretations. An incomplete demonstration report is available.' : 'Run the analysis to enable measurement editing and review.';
      if (readable()) {
        const record = state.records[selected], value = effectiveMm(record), draft = state.drafts[selected], cut = threshold(selected,state.profile);
        panel.innerHTML = `<h3>${selected} · Measurement review</h3><p>Original <b>${mm(record.originalMm)} mm</b> · Effective <b>${mm(value)} mm</b></p>
          <label>Correction diameter (mm)<input data-demo-field="mm" aria-label="Correction diameter in millimetres" type="number" min="6" max="40" step="0.1" value="${esc(draft?.mm ?? value)}"></label>
          <input data-demo-field="slider" aria-label="Adjust correction diameter" type="range" min="6" max="40" step="0.1" value="${esc(draft?.mm && validMm(Number(draft.mm)) ? draft.mm : value)}">
          <label>Correction reason<textarea data-demo-field="reason" placeholder="Explain why this example boundary needs correction">${esc(draft?.reason ?? '')}</textarea></label>
          <div class="review-actions"><button data-demo-action="apply">Apply correction</button><button data-demo-action="cancel">Cancel draft</button><button data-demo-action="cancel-all">Cancel all drafts</button></div>
          <p data-draft-status role="status"></p><small>Fictional ${state.profile}: S ≥ ${cut.s} mm · I ${cut.r} to &lt;${cut.s} mm · R &lt;${cut.r} mm. These are not CLSI/EUCAST cutoffs.</small>
          <label class="verify-boundary"><input type="checkbox" data-demo-field="verified" ${record.verified ? 'checked' : ''}>I inspected this simulated boundary${state.scenario === 'clean' ? '' : ' (required)'}</label>
          <p>Review: <b>${record.review}</b> · ${REVIEWER}</p><div class="review-actions"><button data-demo-action="confirm">Confirm review</button><button data-demo-action="reject">Reject</button></div>`;
      }
      const comparison = compareMeasurements(state.records,state.profile);
      const metrics = [comparison.pairedCount || 'Not available',comparison.meanDifference === null ? 'Not available' : comparison.meanDifference.toFixed(2)+' mm',comparison.meanAbsoluteDifference === null ? 'Not available' : comparison.meanAbsoluteDifference.toFixed(2)+' mm',comparison.categoryAgreement === null ? 'Not available' : comparison.categoryAgreement.toFixed(1)+'%'];
      demoSec.querySelectorAll('.comparison-summary b').forEach((el,i) => {el.textContent=metrics[i];});
      updateActions(); renderPlate();
    }

    runButton.addEventListener('click', () => {
      stopTimer(); step=0; send({type:'run'}); const generation=state.generation;
      timer=setInterval(() => { step++; if (step === 7) {stopTimer();send({type:'complete',generation});} else render(); },200);
    });
    resetButton.addEventListener('click', () => {stopTimer();selected='CIP';step=0;send({type:'reset'});});
    selects[0].addEventListener('change', () => send({type:'profile',value:selects[0].value}));
    selects[1].addEventListener('change', () => {stopTimer();step=0;send({type:'scenario',value:selects[1].value});});
    demoSec.addEventListener('input', e => {
      const field=e.target.dataset.demoField;
      if (!readable() || !['mm','slider','reason'].includes(field)) return;
      const patch = field === 'reason' ? {reason:e.target.value} : {mm:e.target.value};
      state=reviewReducer(state,{type:'draft',code:selected,patch,at:new Date().toISOString()});
      if (field === 'slider') panel.querySelector('[data-demo-field="mm"]').value=e.target.value;
      if (field === 'mm' && validMm(Number(e.target.value))) panel.querySelector('[data-demo-field="slider"]').value=e.target.value;
      updateActions();renderPlate();
    });
    demoSec.addEventListener('change', e => {
      if (e.target.dataset.demoField === 'verified' && readable()) send({type:'verify',code:selected,value:e.target.checked});
    });
    demoSec.addEventListener('click', e => {
      const disc=e.target.closest('[data-select-disc]');
      if (disc && readable()) { selected=disc.dataset.selectDisc;render(); }
      const preset=e.target.closest('.preset-chip');
      if (preset && preset.dataset.scenario !== state.scenario) {stopTimer();step=0;send({type:'scenario',value:preset.dataset.scenario});}
      const optical=e.target.closest('.optical-chip');
      if (optical) {demoSec.querySelectorAll('.optical-chip').forEach(el=>el.classList.toggle('active',el===optical));if(plate){plate.setAttribute('data-optical-mode',optical.dataset.optical);['standard','darkfield','edge'].forEach(mode=>plate.classList.toggle('metrology-plate-'+mode,mode===optical.dataset.optical));}}
      const view=e.target.closest('.view-switch button');
      if (view) {overlay=view.textContent.includes('Measurement');demoSec.querySelectorAll('.view-switch button').forEach(el=>el.setAttribute('aria-pressed',String(el===view)));renderPlate();}
      const action=e.target.closest('[data-demo-action]');
      if (action && !action.disabled && readable()) {
        if (action.dataset.demoAction === 'cancel-all') {Object.keys(state.drafts).forEach(code=>{state=reviewReducer(state,{type:'cancel',code});});render();}
        else send({type:action.dataset.demoAction,code:selected});
      }
    });
    demoSec.addEventListener('keydown', e => {
      const disc=e.target.closest('.metrology-plate [data-select-disc]');
      if (disc && readable() && ['Enter',' '].includes(e.key)) {e.preventDefault();selected=disc.dataset.selectDisc;render();}
    });
    reportButton.addEventListener('click', () => {
      if (state.status !== 'complete' || pending()) return;
      const report=captureReport(state,new Date().toISOString());
      const modal=document.createElement('dialog');
      modal.className='offline-demo-report';
      modal.dataset.state='open';
      modal.style.cssText='max-width:720px;width:calc(100% - 32px);max-height:85vh;overflow:auto;background:#10252b;color:#effffa;border:1px solid #78ddcc;border-radius:16px;padding:20px';
      modal.innerHTML=`<h2>AST demonstration record</h2><strong>SYNTHETIC · NOT FOR CLINICAL USE</strong><p>${esc(report.timestamp)} · ${esc(report.runId)}</p><p>${esc(report.outcome)}</p><p>Fictional profile ${report.profile} · ${esc(report.readability)}</p><div style="overflow:auto"><table><thead><tr><th>Disc</th><th>Original / effective mm</th><th>Fictional category</th><th>Review</th></tr></thead><tbody>${report.results.map(row=>`<tr><td>${row.code}</td><td>${mm(row.originalMm)} / ${mm(row.mm)}</td><td>${row.interpretation ?? 'Not available'}</td><td>${row.review}</td></tr>`).join('')}</tbody></table></div><p>${esc(report.signature)}</p><p>Correction events: ${report.correctionEvents.length}. No specimen was tested.</p><details><summary>Audit and correction record</summary><pre style="white-space:pre-wrap">${esc(JSON.stringify({corrections:report.correctionEvents,audit:report.audit},null,2))}</pre></details><button data-report-export="json">Export JSON</button> <button data-report-export="csv">Export CSV</button> <button data-report-close aria-label="Close demonstration report">Close report</button>`;
      modal.addEventListener('click', e => {
        if(e.target.closest('[data-report-close]')) modal.close();
        const button=e.target.closest('[data-report-export]');
        if(button){const format=button.dataset.reportExport;const text=format==='json'?JSON.stringify(report,null,2):reportCsv(report);saveSyntheticReport(format,text,`AMReye.AI-${report.runId}-synthetic-report.${format}`);}
      });
      modal.addEventListener('close',()=>{modal.remove();reportButton.focus();});
      document.body.appendChild(modal);modal.showModal();
    });
    render();
  }

  // --- 5. Research Compendium Live Search & Bookmarks ---
  function initResearchLibrary() {
    const researchSec = document.getElementById('research');
    if (!researchSec) return;

    let savedBookmarks = [];
    try {
      savedBookmarks = JSON.parse(localStorage.getItem('amreye_bookmarks') || '[]');
    } catch {
      savedBookmarks = [];
    }

    const searchInput = researchSec.querySelector('input[type="search"], input[placeholder*="Search"]');
    const cards = researchSec.querySelectorAll('.library-topic-card, .topic-item, .topic-card');

    function filterTopics() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const activeFilter = researchSec.querySelector('.library-filter-pill.active')?.getAttribute('data-cat') || 'all';

      cards.forEach((card) => {
        const text = (card.textContent || '').toLowerCase();
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        const cardId = card.getAttribute('data-topic-id') || card.id || '';

        const matchesQuery = !q || text.includes(q);
        let matchesFilter = true;

        if (activeFilter === 'bookmarked') {
          matchesFilter = savedBookmarks.includes(cardId);
        } else if (activeFilter !== 'all') {
          matchesFilter = cardCat.includes(activeFilter.toLowerCase());
        }

        card.style.display = matchesQuery && matchesFilter ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterTopics);
    }

    // Category filter pills
    researchSec.querySelectorAll('.library-filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        researchSec.querySelectorAll('.library-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterTopics();
      });
    });

    // Bookmark toggling on cards
    researchSec.addEventListener('click', (e) => {
      const starBtn = e.target.closest('.topic-bookmark-btn');
      if (starBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = starBtn.closest('.library-topic-card, .topic-item, .topic-card');
        const cardId = card?.getAttribute('data-topic-id') || card?.id || '';
        if (!cardId) return;

        if (savedBookmarks.includes(cardId)) {
          savedBookmarks = savedBookmarks.filter(id => id !== cardId);
          starBtn.classList.remove('is-bookmarked');
          starBtn.textContent = '☆';
          showToast('Removed from saved topics');
        } else {
          savedBookmarks.push(cardId);
          starBtn.classList.add('is-bookmarked');
          starBtn.textContent = '★';
          showToast('Saved topic to reading list ★');
        }

        try {
          localStorage.setItem('amreye_bookmarks', JSON.stringify(savedBookmarks));
        } catch {}

        // Update bookmark filter count badge
        const badge = researchSec.querySelector('.bookmark-count-badge');
        if (badge) badge.textContent = `(${savedBookmarks.length})`;
      }
    });
  }

  // --- 6. Laboratory Settings Modal ---
  function initSettingsModal() {
    const modal = document.getElementById('settings-modal-overlay');
    if (!modal) return;

    function openSettings() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeSettings() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="open-settings"], .header-settings-btn')) {
        e.preventDefault();
        openSettings();
      }
      if (e.target.closest('.settings-modal-close') || e.target.classList.contains('settings-modal-backdrop')) {
        e.preventDefault();
        closeSettings();
      }
      // Connection ping test inside settings
      if (e.target.closest('#btn-ping-test')) {
        const pingStatus = document.getElementById('ping-test-result');
        if (pingStatus) pingStatus.textContent = 'Testing connection...';
        const start = Date.now();
        fetch('https://amreye.in/favicon.svg', { mode: 'no-cors', cache: 'no-store' })
          .then(() => {
            const ms = Date.now() - start;
            if (pingStatus) {
              pingStatus.textContent = `Online · ${ms}ms latency to amreye.in`;
              pingStatus.style.color = '#34d399';
            }
          })
          .catch(() => {
            if (pingStatus) {
              pingStatus.textContent = 'Cloud server unreachable · Offline mode active';
              pingStatus.style.color = '#fbbf24';
            }
          });
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeSettings();
      }
    });
  }

  // --- 7. Pull-to-Refresh Gesture ---
  function initPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let indicator = document.getElementById('pull-refresh-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-refresh-indicator';
      indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>';
      document.body.appendChild(indicator);
    }

    window.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      if (distance > 0 && distance < 140) {
        indicator.style.top = `${Math.min(84, distance - 20)}px`;
        indicator.style.transform = `translateX(-50%) rotate(${distance * 2}deg)`;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (!isPulling) return;
      const distance = currentY - startY;
      if (distance > 70) {
        indicator.classList.add('is-visible');
        showToast('Refreshing laboratory status...');
        setTimeout(() => {
          indicator.classList.remove('is-visible');
          indicator.style.top = '-60px';
          if (navigator.onLine && location.hostname !== 'amreye.in') {
            if (confirm('Reconnect to live website (https://amreye.in/#home)?')) {
              window.location.href = 'https://amreye.in/#home';
            }
          }
        }, 800);
      } else {
        indicator.style.top = '-60px';
      }
      isPulling = false;
    });
  }

  // --- 8. Online / Offline Connectivity & Switcher ---
  function initConnectivity() {
    function updateOnlineStatus() {
      const isOnline = navigator.onLine;
      const isLiveOrigin = location.protocol === 'https:' && ['amreye.in', 'www.amreye.in'].includes(location.hostname);
      const statusPill = document.getElementById('app-network-pill');
      if (statusPill) {
        const mode = isLiveOrigin ? (isOnline ? 'Live website' : 'Website offline') : 'Bundled content';
        statusPill.innerHTML = `<span class="status-dot ${isOnline ? 'green' : 'amber'}"></span><span class="status-text">${mode}</span>`;
        statusPill.classList.toggle('is-online', isOnline);
        statusPill.classList.toggle('is-offline', !isOnline);
        const description = isLiveOrigin ? mode : `Bundled offline library. ${isOnline ? 'Network available; activate to open the live website.' : 'No network connection.'}`;
        statusPill.title = description;
        statusPill.setAttribute('aria-label', description);
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    document.addEventListener('click', (e) => {
      const pill = e.target.closest('#app-network-pill');
      if (pill) {
        if (window.AndroidBridge && typeof window.AndroidBridge.switchToOnline === 'function') {
          if (navigator.onLine) {
            window.AndroidBridge.switchToOnline();
          } else {
            alert('Currently offline. Please connect to Wi-Fi or mobile data to access the live server.');
          }
        } else if (location.hostname !== 'amreye.in') {
          if (confirm('Switch to live website (https://amreye.in/#home)?')) {
            window.location.href = 'https://amreye.in/#home';
          }
        }
      }
    });
  }

  // --- 9. App Splash Animation Dismissal ---
  function dismissSplash() {
    const splash = document.getElementById('app-splash-overlay');
    if (splash && !splash.classList.contains('is-dismissed')) {
      splash.classList.add('is-dismissed');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500);
    }
  }

  function boot() {
    initNavigation();
    initPitchModal();
    initDirectoryDrawer();
    initSyntheticDemo();
    initSettingsModal();
    initPullToRefresh();
    initConnectivity();

    setTimeout(dismissSplash, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
