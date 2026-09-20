// Bundled interactions. Product content comes from app/product-showcase.tsx;
// workflow content comes from app/discovery.tsx. These remain concept descriptions.
(function () {
  'use strict';

  // Native onPageFinished injects the legacy enhancer. The bundled reader already
  // owns its responsive layout, navigation and forms; avoid duplicate handlers.
  window.__amreye_frontier_injected = true;
  if (window.__amreye_offline_interactions) return;
  window.__amreye_offline_interactions = true;

  const content = {"products":[{"id":"apex","name":"APEX XR","label":"FLAGSHIP RESEARCH","summary":"The proposed clinical, research and bio-automation reference platform, bringing the deepest AMReye.AI architecture into one modular workstation.","status":"Proposed product","group":"Products","points":["Modular research pathways","Direct broth microdilution pathway","Research imaging and constrained automation"],"action":"Open flagship knowledge","href":"#apex"},{"id":"lite","name":"Reader V1","label":"PORTABLE AST","summary":"The near-term endpoint disk-diffusion reader: calibrated images, zone measurements and qualified human review.","status":"Prototype demo","group":"Products","points":["Guided image capture","Synthetic zone-analysis demo","Human review record"],"action":"Open analysis","href":"#demo"},{"id":"core","name":"AMReye.AI Core","label":"CONNECTED WORKBENCH","summary":"Smart incubation, repeat imaging and traceable AST workflow in one proposed system.","status":"Proposed product","group":"Products","points":["Time-lapse acquisition","Plate digital twin","Edge-first operation"],"action":"Explore hardware","href":"#hardware"},{"id":"pro","name":"AMReye.AI Pro","label":"MULTIMODAL LAB","summary":"A future research tier for richer sensing, analytics and laboratory integration.","status":"Future R&D","group":"Products","points":["Multiple optical modes","Auxiliary sensor fusion","Custom model workflows"],"action":"View product brief"},{"id":"clinical","name":"Clinical Pathway","label":"VALIDATION TRACK","summary":"A future regulated pathway for validated AST, MIC, QC and standards traceability.","status":"Future R&D","group":"Products","points":["Analytical validation","Clinical protocols","Regulatory planning"],"action":"View validation path","href":"#roadmap"},{"id":"bahu","name":"SaaS–BAHU","label":"HUMAN CONTROL LAYER","summary":"A proposed software layer connecting people, instruments, AI and biological workflows.","status":"Future R&D","group":"Platform","points":["Operator workflow","Instrument orchestration","Human-in-the-loop release"],"action":"Open BAHU","href":"#bahu"},{"id":"edge","name":"Edge AI","label":"LOCAL INTELLIGENCE","summary":"Local processing for lower latency, offline continuity and reduced cloud dependence.","status":"Proposed product","group":"Platform","points":["On-device inference","Local result queue","Selective cloud sync"],"action":"Open architecture","href":"#architecture"},{"id":"cloud","name":"AMReye.AI Cloud","label":"FLEET + DATA LAYER","summary":"A proposed connected-services layer for device management, governed data and updates.","status":"Proposed product","group":"Platform","points":["Fleet observability","Versioned model delivery","Enterprise workspace"],"action":"View platform brief"},{"id":"connect","name":"Connect","label":"LAB INTEROPERABILITY","summary":"A future connectivity layer for LIMS, LIS, HIS and governed exchange standards.","status":"Future R&D","group":"Platform","points":["LIMS / LIS / HIS","FHIR-ready pathway","Auditable data exchange"],"action":"View connectivity","href":"#architecture"},{"id":"nap","name":"NAP-AMR Command Map","label":"NATIONAL INTELLIGENCE","summary":"A concept for governed AMR signals, hotspots and variation trends across regions.","status":"Future R&D","group":"Intelligence","points":["Synthetic hotspot explorer","Region and organism filters","Policy-ready trend views"],"action":"Open intelligence concept","href":"#network"},{"id":"global","name":"Global AMR Network","label":"LOCAL → GLOBAL","summary":"A federated concept connecting local health centres to national and international views.","status":"Future R&D","group":"Intelligence","points":["Local health-centre nodes","Country-specific governance","Cross-border aggregate views"],"action":"View network model"},{"id":"models","name":"Model Registry","label":"MULTIMODAL AI","summary":"Separate models for plate imaging, growth kinetics and research data, each with its own evidence boundary.","status":"Future R&D","group":"Intelligence","points":["Image-to-measurement","Growth-curve analysis","Omics association only with qualified source data"],"action":"Explore model stack"},{"id":"research","name":"Research Studio","label":"COLLEGE + R&D","summary":"A future workspace for universities and research centres to study governed, de-identified datasets.","status":"Future R&D","group":"Intelligence","points":["Cohort workspaces","Model comparison","Reproducible export"],"action":"View research pathway"},{"id":"government","name":"Government Programs","label":"PUBLIC HEALTH","summary":"A proposed deployment and support pathway for national and state AMR programs.","status":"Future R&D","group":"Services","points":["Program configuration","Governed aggregation","Training and adoption"],"action":"View program model"},{"id":"support","name":"Maintenance + Support","label":"SYSTEM CARE","summary":"Planned service coverage for devices, software, databases and connected operations.","status":"Proposed product","group":"Services","points":["Preventive maintenance","Calibration pathway","Support desk"],"action":"View service scope"},{"id":"updates","name":"Updates + Assurance","label":"CONTINUOUS SERVICE","summary":"Versioned software, model and standards updates with traceability and rollback controls.","status":"Proposed product","group":"Services","points":["Signed releases","Model registry","Standards database versions"],"action":"View update model"}],"workflows":{"lite":["Small laboratories and teaching benches","Prepare the plate using the chosen method → controlled image capture → zone measurement → qualified review.","A first imaging pathway. A synthetic interface is available; a validated clinical instrument is not yet established."],"core":["Laboratories needing repeat imaging and sample traceability","Barcode a plate → controlled incubation → scheduled images → review the digital record.","Adds continuity around plate-based work. Loaded chamber performance, optics and method agreement require validation."],"pro":["Research laboratories with assay-specific imaging needs","Configure the assay → acquire optical and auxiliary signals → compare time-resolved observations.","Research sensing is assay-specific. VOC fingerprints cannot independently identify species; coarse proximity is not colony profilometry."],"apex":["Institutions exploring a configurable flagship workstation","Select modules → calibrate the instrument → run a controlled plate or broth workflow → retain a traceable record.","A maximum-configuration architecture proposal. Integration, clinical validation, production design and final pricing remain future work."],"clinical":["Clinical laboratories preparing a formal validation pathway","Define intended use → qualify the method → validate performance → document quality controls → seek applicable approvals.","No clinical accuracy, regulatory clearance or universal turnaround is claimed. Direct MIC uses broth microdilution."],"bahu":["Operators coordinating several instruments and workflows","Define a constrained workflow → authorise the run → monitor instrument status → review exceptions and release.","System/Software as a Service with Bio-Automation & Human User Interface. Human responsibility remains explicit."],"edge":["Sites that need processing close to the instrument","Capture locally → run a qualified model → queue records → sync approved data when connected.","The device architecture proposes local inference. The website itself runs a deterministic demo, not a deployed diagnostic model."],"cloud":["Multi-site laboratories and institutions","Register a device → manage access → synchronise governed records → review fleet status and versions.","Optional cloud services are proposed. Hosting location, data retention and institutional agreements need to be established."],"connect":["Laboratories linking instrument records to existing systems","Map identifiers and fields → validate an adapter → exchange records → reconcile acknowledgements.","LIMS, LIS, HIS and FHIR pathways require partner-specific integration, consent and testing. No live connector is operating here."],"nap":["Government researchers and AMR surveillance programs","Quality-check local records → de-identify → aggregate by region and time → review trends.","A NAP-AMR-aligned concept, not a current government contract or operational surveillance network."],"global":["National programs and international research collaborations","Keep local governance → agree comparable definitions → share approved aggregates → compare trends.","Country-specific rules, laboratory quality and compatible reporting definitions come before cross-border expansion."],"models":["Teams evaluating imaging and multimodal research models","Define an input → train and evaluate → version a model → monitor limits and retain a review trail.","Images support visible-feature measurement. Strain, proteins and genomic associations require qualified assays or omics inputs."],"research":["Colleges, universities and research centres","Select a study → define a protocol → capture time-series data → compare cohorts → retain methods and provenance.","Research tools are proposed. Every assay and dataset needs its own reproducibility, consent and validation checks."],"government":["State, national and public-sector implementation teams","Scope a program → assess facilities → procure through the applicable route → train teams → monitor adoption.","A proposed selling and deployment model. No procurement approval, tender win or government partnership is implied."],"support":["Laboratories planning the full system lifecycle","Schedule maintenance → check calibration → record faults → service and requalify the device.","Planned preventive maintenance, database support, training and service documentation. Commercial terms are not final."],"updates":["Teams responsible for controlled software and database change","Review a release → verify signatures → validate compatibility → deploy with rollback and audit records.","Software, models and standards need separately versioned releases. A language model must never invent clinical breakpoints."]},"art":{"lite":"lite","core":"core-reference","pro":"gantry","apex":"pro","clinical":"imaging","bahu":"bahu","edge":"edge","cloud":"cloud","connect":"connect","nap":"network","global":"global","models":"models","research":"research","government":"government","support":"support","updates":"deployment"},"stages":[{"name":"Capture","number":"01","title":"A consistent starting point.","copy":"Calibrated plate imaging is the first step toward a reproducible measurement.","href":"/?topic=reader-v1#library","action":"Explore the reader"},{"name":"Measure","number":"02","title":"Every zone, a traceable measure.","copy":"Explore zone diameters, calibration and corrections in the synthetic plate demonstration.","href":"#demo","action":"Simulate the workflow"},{"name":"Review","number":"03","title":"Keep qualified people in control.","copy":"Uncertainty and unreadable results remain visible before a qualified reviewer releases a record.","href":"/?topic=plate-provenance#library","action":"Follow the review record"},{"name":"Connect","number":"04","title":"A record with somewhere to go.","copy":"Explore the proposed path from local instruments to governed laboratory and research systems.","href":"/?topic=interoperability#library","action":"Explore connectivity"}]};
  const topicRoutes = {
    apex: 'topic-9', lite: 'reader-v1', core: 'topic-10', pro: 'topic-13',
    clinical: 'research-validation-mode', bahu: 'topic-39', edge: 'topic-45',
    cloud: 'topic-40', connect: 'interoperability', nap: 'research-surveillance',
    global: 'topic-68', models: 'research-models', research: 'research-research-roles',
    government: 'research-surveillance', support: 'system-service', updates: 'research-offline'
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function openKnowledge(kind, value) {
    const library = window.AmreyeOfflineLibrary;
    if (library) {
      if (kind === 'topic') library.openTopic(value);
      else library.search(value);
      return;
    }
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set(kind === 'topic' ? 'topic' : 'q', value);
    url.hash = 'research';
    history.pushState(null, '', url);
    window.dispatchEvent(new Event('hashchange'));
  }

  function initProducts() {
    const section = document.getElementById('products');
    if (!section) return;
    const grid = section.querySelector('.collection-grid');
    const search = section.querySelector('.collection-search input');
    const filters = Array.from(section.querySelectorAll('.product-filters button'));
    const foot = section.querySelector('.collection-foot');
    const compareButton = foot && foot.querySelector('button');
    if (!grid || !foot || !compareButton) return;
    let group = 'Products';
    const selected = new Set();
    const selectionBar = element('div', 'comparison-selection');
    selectionBar.setAttribute('aria-label', 'Selected product concepts');
    grid.before(selectionBar);
    const comparison = element('section', 'offline-card offline-product-comparison');
    comparison.setAttribute('aria-label', 'Compare selected product concepts');
    comparison.tabIndex = -1;
    comparison.style.display = 'none';
    foot.after(comparison);

    function compare() {
      comparison.replaceChildren();
      if (selected.size < 2) { comparison.style.display = 'none'; return; }
      comparison.style.display = 'block';
      comparison.append(element('h3', '', 'Compare pathways'));
      const close = element('button', 'text-link', 'Close comparison');
      close.type = 'button';
      close.addEventListener('click', () => { comparison.style.display = 'none'; compareButton.focus(); });
      comparison.append(close);
      const columns = element('div', 'compare-grid');
      content.products.filter(product => selected.has(product.id)).forEach(product => {
        const article = element('article', '');
        const workflow = content.workflows[product.id];
        article.append(element('h3', '', product.name), element('small', '', product.status));
        article.append(element('h4', '', 'Best-fit use case'), element('p', '', workflow[0]));
        const points = element('ul', '');
        product.points.forEach(point => points.append(element('li', '', point)));
        article.append(points, element('h4', '', 'Evidence boundary'), element('p', '', workflow[2]));
        const deeper = element('button', 'text-link', 'Explore this pathway');
        deeper.type = 'button';
        deeper.addEventListener('click', () => openKnowledge('topic', topicRoutes[product.id]));
        article.append(deeper);
        columns.append(article);
      });
      comparison.append(columns, element('p', '', 'Comparisons describe proposed scope, not validated product specifications or final prices.'));
    }

    function render() {
      const query = (search ? search.value : '').trim().toLowerCase();
      const visible = content.products.filter(product =>
        (group === 'All' || product.group === group) &&
        [product.name, product.summary, ...product.points].join(' ').toLowerCase().includes(query));
      grid.replaceChildren();
      visible.forEach(product => {
        const card = element('article', 'collection-card');
        const open = element('button', 'product-open');
        open.type = 'button';
        open.setAttribute('aria-label', 'Explore ' + product.name);
        open.addEventListener('click', () => openKnowledge('topic', topicRoutes[product.id]));
        const art = element('div', 'collection-art');
        const image = element('img', '');
        image.src = '/visuals/' + content.art[product.id] + '.webp';
        image.width = 1536; image.height = 1024; image.loading = 'lazy';
        image.alt = product.name + ' · generated concept illustration';
        art.append(image, element('span', '', 'CONCEPT'));
        const copy = element('div', 'collection-card-copy');
        copy.append(element('small', '', product.label), element('h3', '', product.name),
          element('p', '', product.summary), element('span', 'collection-status', product.status + ' ↗'));
        open.append(art, copy);
        const toggle = element('label', 'compare-toggle');
        const checkbox = element('input', '');
        checkbox.type = 'checkbox';
        checkbox.checked = selected.has(product.id);
        checkbox.disabled = !checkbox.checked && selected.size >= 3;
        checkbox.setAttribute('aria-label', 'Compare ' + product.name);
        checkbox.addEventListener('change', () => {
          if (selected.has(product.id)) selected.delete(product.id);
          else if (selected.size < 3) selected.add(product.id);
          render();
          if (comparison.style.display !== 'none') compare();
        });
        toggle.append(checkbox, document.createTextNode('Compare'));
        card.append(open, toggle); grid.append(card);
      });
      if (!visible.length) grid.append(element('p', '', 'No matching concepts. Try another search or choose All.'));
      const count = foot.querySelector('p');
      if (count) { count.textContent = visible.length + ' of ' + content.products.length + ' concepts · Choose up to 3 to compare.'; count.setAttribute('role', 'status'); }
      compareButton.disabled = selected.size < 2;
      compareButton.textContent = 'Compare selected (' + selected.size + ')';
      selectionBar.replaceChildren();
      selectionBar.style.display = selected.size ? '' : 'none';
      content.products.filter(product => selected.has(product.id)).forEach(product => {
        const remove = element('button', 'text-link', product.name + ' ×');
        remove.type = 'button';
        remove.setAttribute('aria-label', 'Remove ' + product.name + ' from comparison');
        remove.addEventListener('click', () => {
          selected.delete(product.id); render();
          if (comparison.style.display !== 'none') compare();
        });
        selectionBar.append(remove);
      });
      filters.forEach(button => button.setAttribute('aria-pressed', String((button.textContent.trim() === 'Instruments' ? 'Products' : button.textContent.trim()) === group)));
    }
    filters.forEach(button => button.addEventListener('click', () => {
      group = button.textContent.trim() === 'Instruments' ? 'Products' : button.textContent.trim(); render();
    }));
    if (search) search.addEventListener('input', render);
    compareButton.addEventListener('click', () => { compare(); comparison.focus(); comparison.scrollIntoView({block: 'start'}); });
    render();
  }

  function initWorkflow() {
    const panel = document.getElementById('workflow-panel');
    const tabs = Array.from(document.querySelectorAll('#home .workflow-tabs [role="tab"]'));
    if (!panel || !tabs.length) return;
    function select(index, focus) {
      const step = content.stages[index];
      tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      panel.setAttribute('aria-labelledby', tabs[index].id);
      panel.querySelector('h2').textContent = step.title;
      panel.querySelector('p').textContent = step.copy;
      const link = panel.querySelector('a');
      link.href = step.href.replace('#library', '#research');
      link.textContent = step.action + ' ↗';
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index, false));
      tab.addEventListener('keydown', event => {
        const target = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
        if (target === undefined) return;
        event.preventDefault(); select(target, true);
      });
    });
  }

  function initSearch() {
    document.querySelectorAll('.home-search, .guide-search').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) openKnowledge('search', input.value.trim());
    }));
    const guidePresets = {
      'What is working in Reader V1 today?': ['topic', 'reader-v1'],
      'What is demonstrated with synthetic data?': ['search', 'synthetic'],
      'What still needs validation?': ['search', 'validation']
    };
    document.querySelectorAll('.guide-prompts button').forEach(button => button.addEventListener('click', () => {
      const question = button.textContent.trim();
      const preset = guidePresets[question] || ['search', question];
      openKnowledge(preset[0], preset[1]);
    }));
  }

  function initContact() {
    document.querySelectorAll('.contact-panel form').forEach(form => {
      const status = form.querySelector('[role="status"]');
      const email = 'namdevshirodkar20@gmail.com';
      const draft = () => {
        const name = form.querySelector('input[autocomplete="name"], input[name="name"]');
        const organisation = form.querySelector('input[autocomplete="organization"], input[name="organisation"]');
        const message = form.querySelector('textarea');
        const kind = form.querySelector('select');
        return {subject: 'AMReye.AI · ' + (kind ? kind.value : 'Enquiry'), body: 'Hello AMReye.AI team,\n\nName: ' + (name ? name.value.trim() : '') + '\nOrganisation: ' + (organisation && organisation.value.trim() || 'Not specified') + '\n\n' + (message ? message.value.trim() : '')};
      };
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const value = draft();
        const bridge = window.AndroidBridge;
        if (bridge && typeof bridge.openEmailDraft === 'function') bridge.openEmailDraft(email, value.subject, value.body);
        else location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(value.subject) + '&body=' + encodeURIComponent(value.body);
        if (status) status.textContent = 'Email draft requested. Nothing has been sent or stored by this app.';
      });
      const copy = Array.from(form.querySelectorAll('button[type="button"]')).find(button => /copy/i.test(button.textContent));
      if (copy) copy.addEventListener('click', async () => {
        if (!form.reportValidity()) return;
        const value = draft();
        const text = 'To: ' + email + '\nSubject: ' + value.subject + '\n\n' + value.body;
        try {
          if (window.AndroidBridge && typeof window.AndroidBridge.copyToClipboard === 'function') {
            window.AndroidBridge.copyToClipboard(text);
            if (status) status.textContent = 'Copy requested. Nothing has been sent.';
          } else {
            await navigator.clipboard.writeText(text);
            if (status) status.textContent = 'Draft copied. Nothing has been sent.';
          }
        } catch (_) {
          let fallback = form.querySelector('.offline-copy-fallback');
          if (!fallback) { fallback = element('textarea', 'offline-copy-fallback'); fallback.readOnly = true; fallback.rows = 8; fallback.setAttribute('aria-label', 'Email draft to copy'); form.append(fallback); }
          fallback.value = text; fallback.focus(); fallback.select();
          if (status) status.textContent = 'Copy is unavailable. Select and copy the draft below.';
        }
      });
    });
  }

  function boot() { initProducts(); initWorkflow(); initSearch(); initContact(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
