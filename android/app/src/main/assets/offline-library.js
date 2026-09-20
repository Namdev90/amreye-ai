// Read the bundled library without a server or React hydration.
(function () {
  'use strict';

  const assetBase = new URL('.', document.currentScript ? document.currentScript.src : location.href);
  const PAGE_SIZE = 12;
  const state = { data: null, query: '', category: 'All', maturity: 'All', limit: PAGE_SIZE, topic: null, page: 0 };
  const sourceIndex = new Map();
  const topicIndex = new Map();
  const searchIndex = new Map();
  const headingIndex = new Map();
  const questionWords = new Set(('what which why how when where who is are was were be been being the a an and or to of for in on at by from with without as it its this that these those do does did can could would should will may might me my i we our you your please tell show explain about working work today currently still needs need').split(' '));
  let section, grid, search, category, maturity, result, more, clear, empty, overlay, dialog, content;
  let returnFocus = null;
  let returnTopicId = null;
  let previousOverflow = '';

  const clean = value => String(value == null ? '' : value).replace(/\*\*/g, '').trim();
  const normalize = value => clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = clean(text);
    return node;
  };
  const button = (text, action, className) => {
    const node = element('button', className, text);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  };
  const externalLink = (text, href) => {
    const node = element('a', '', text);
    try {
      const url = new URL(href, assetBase);
      if (!['https:', 'http:'].includes(url.protocol)) return element('span', '', text);
      node.href = url.href;
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
    } catch (_) { return element('span', '', text); }
    return node;
  };

  function navigate(update, replace) {
    const url = new URL(location.href);
    update(url);
    history[replace ? 'replaceState' : 'pushState']({}, '', url);
    // The standalone section router listens to hashchange, including query-only navigation.
    window.dispatchEvent(new Event('hashchange'));
  }

  function writeFilters() {
    const url = new URL(location.href);
    for (const [key, value] of [['q', state.query], ['category', state.category], ['maturity', state.maturity]]) {
      if (value && value !== 'All') url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState({}, '', url);
  }

  function setFilters() {
    state.query = search.value;
    state.category = category.value;
    state.maturity = maturity.value;
    state.limit = PAGE_SIZE;
    writeFilters();
    renderResults();
  }

  function resetFilters() {
    search.value = '';
    category.value = maturity.value = 'All';
    setFilters();
  }

  function findTopics() {
    const query = normalize(state.query).replace(/[^\p{L}\p{N}\s-]+/gu, ' ').replace(/\s+/g, ' ').trim();
    const terms = [...new Set(query.split(/\s+/).filter(term => term && !questionWords.has(term)))];
    const candidates = state.data.topics.filter(topic =>
      (state.category === 'All' || topic.category === state.category) &&
      (state.maturity === 'All' || topic.status === state.maturity)
    );
    if (!query) return candidates;
    if (!terms.length) return [];
    return candidates.map((topic, order) => {
      const text = searchIndex.get(topic.id);
      const headings = headingIndex.get(topic.id) || normalize(topic.title);
      const exact = headings.includes(query) ? 2 : text.includes(query) ? 1 : 0;
      const matched = terms.filter(term => text.includes(term));
      const score = matched.reduce((sum, term) => sum + (headings.includes(term) ? 16 : 2), 0);
      return { topic, exact, matched: matched.length, score, order };
    }).filter(hit => hit.matched > 0)
      .sort((a, b) => b.exact - a.exact || Number(b.matched === terms.length) - Number(a.matched === terms.length) || b.score - a.score || a.order - b.order)
      .map(hit => hit.topic);
  }

  function renderResults() {
    if (!state.data) return;
    const topics = findTopics();
    const fragment = document.createDocumentFragment();
    topics.slice(0, state.limit).forEach(topic => {
      const card = button('', () => openTopic(topic.id), 'topic-card');
      card.dataset.topicId = topic.id;
      card.dataset.category = topic.category;
      const label = element('span', '', topic.category);
      const arrow = element('span', '', '\u2197');
      arrow.setAttribute('aria-hidden', 'true');
      label.appendChild(arrow);
      const meta = element('div', 'topic-card-meta');
      meta.appendChild(element('small', '', topic.status));
      if (topic.pageStart) meta.appendChild(element('small', '', 'pp. ' + topic.pageStart + '\u2013' + (topic.pageEnd || topic.pageStart)));
      card.append(label, element('h2', '', topic.title), element('p', '', (topic.text || [])[0] || 'Explore this topic and its sources.'), meta);
      fragment.appendChild(card);
    });
    grid.replaceChildren(fragment);
    result.replaceChildren(document.createTextNode(topics.length + ' topics '), element('span', '', '/ ' + state.data.topics.length + ' in the library'));
    const remaining = Math.max(0, topics.length - state.limit);
    more.hidden = !remaining;
    more.replaceChildren(document.createTextNode('Show more '), element('span', '', remaining + ' remaining'));
    clear.hidden = !state.query && state.category === 'All' && state.maturity === 'All';
    empty.hidden = topics.length !== 0;
    section.querySelectorAll('.library-chip-row').forEach((row, index) => {
      const selected = index === 0 ? state.category : state.maturity;
      row.querySelectorAll('button').forEach(chip => chip.setAttribute('aria-pressed', String(chip.textContent.trim() === selected)));
    });
  }

  function appendText(node, value) {
    // Treat library prose as text. Only known citation tokens become interactive links.
    const text = clean(value);
    let from = 0;
    for (const match of text.matchAll(/\[([A-Z]+\d+)\]/g)) {
      node.appendChild(document.createTextNode(text.slice(from, match.index)));
      if (sourceIndex.has(match[1])) {
        const link = element('a', '', match[0]);
        link.href = '#offline-source-' + match[1];
        link.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const sources = content.querySelector('.chapter-sources');
          if (sources) sources.open = true;
          const reference = document.getElementById('offline-source-' + match[1]);
          if (reference) { reference.scrollIntoView({ block: 'nearest' }); reference.focus({ preventScroll: true }); }
        });
        node.appendChild(link);
      } else node.appendChild(document.createTextNode(match[0]));
      from = match.index + match[0].length;
    }
    node.appendChild(document.createTextNode(text.slice(from)));
  }

  function appendTables(tables) {
    (tables || []).forEach((rows, index) => {
      if (!rows.length) return;
      const wrap = element('div', 'topic-table-scroll');
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Table ' + (index + 1));
      const table = element('table');
      const header = element('thead');
      const body = element('tbody');
      rows.forEach((cells, rowIndex) => {
        const row = element('tr');
        cells.forEach((value, columnIndex) => {
          const cell = element(rowIndex === 0 ? 'th' : 'td');
          if (rowIndex === 0) cell.scope = 'col';
          else cell.dataset.label = clean(rows[0][columnIndex] || '');
          appendText(cell, value);
          row.appendChild(cell);
        });
        (rowIndex === 0 ? header : body).appendChild(row);
      });
      table.append(header, body);
      wrap.appendChild(table);
      content.appendChild(wrap);
    });
  }

  function renderPage(topic) {
    content.replaceChildren();
    const page = (topic.pages || [])[state.page];
    if (page) content.appendChild(element('h2', '', page.title));
    ((page || topic).text || []).forEach(text => {
      const heading = text.match(/^(#{1,6})\s+(.+)/);
      // Figures are available in the linked bundled compendium; do not expose build paths as prose.
      if (text.startsWith('!FIG ')) {
        const caption = text.includes('|') ? text.slice(text.indexOf('|') + 1).trim() : 'Figure from the source compendium';
        content.appendChild(element('p', 'topic-boundary', 'Figure: ' + caption + ' See the source pages in the bundled compendium.'));
      } else {
        const paragraph = element(heading ? 'h3' : 'p');
        appendText(paragraph, heading ? heading[2] : text);
        content.appendChild(paragraph);
      }
    });
    appendTables((page || topic).tables);
    const citationIds = new Set([...(topic.sourceIds || []), ...Array.from(JSON.stringify(topic).matchAll(/\[([A-Z]+\d+)\]/g), match => match[1])]);
    if (citationIds.size) {
      const references = element('details', 'chapter-sources');
      references.appendChild(element('summary', '', 'Sources cited in this chapter (' + citationIds.size + ')'));
      citationIds.forEach(id => {
        const source = sourceIndex.get(id);
        const row = element('p');
        row.id = 'offline-source-' + id;
        row.tabIndex = -1;
        const title = '[' + id + '] ' + (source ? source.title : 'Reference not included in this bundled source register');
        row.appendChild(source && source.url ? externalLink(title, source.url) : element('span', '', title + (source ? ' \u00b7 Internal project input' : '')));
        references.appendChild(row);
      });
      content.appendChild(references);
    }
    let related = state.data.topics.filter(other => other.id !== topic.id && ((topic.related || []).includes(other.id) || (other.related || []).includes(topic.id)));
    if (!related.length) related = state.data.topics.filter(other => other.id !== topic.id && other.category === topic.category).slice(0, 4);
    if (related.length) {
      content.appendChild(element('h3', '', 'Connected topics'));
      const links = element('nav', 'related-topics');
      links.setAttribute('aria-label', 'Connected topics and backlinks');
      related.forEach(other => links.appendChild(button(other.title + ' \u2197', () => openTopic(other.id))));
      content.appendChild(links);
    }
    content.appendChild(element('p', 'topic-boundary', 'Prototype, proposed products and future research remain distinct. These materials do not establish clinical performance or regulatory clearance. External reference websites require an internet connection.'));
    content.scrollTop = 0;
  }

  function hideTopic() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    const returnCard = returnTopicId && Array.from(grid.querySelectorAll('.topic-card')).find(card => card.dataset.topicId === returnTopicId);
    const focusTarget = returnFocus && returnFocus.isConnected ? returnFocus : returnCard || search;
    if (focusTarget && focusTarget.getClientRects().length) focusTarget.focus({ preventScroll: true });
    returnFocus = null;
    returnTopicId = null;
    state.topic = null;
  }

  function closeTopic() {
    navigate(url => url.searchParams.delete('topic'), true);
    hideTopic();
  }

  function showTopic(id) {
    if (state.topic === id && !overlay.hidden) return;
    const topic = topicIndex.get(id);
    state.topic = id;
    state.page = 0;
    dialog.replaceChildren();
    const close = button('Close \u00d7', closeTopic, 'offline-library-close');
    close.setAttribute('aria-label', 'Close topic');
    dialog.appendChild(close);
    const title = element('h2', '', topic ? topic.title : 'Topic not found');
    title.id = 'offline-topic-title';
    title.dataset.slot = 'dialog-title';
    if (!topic) {
      dialog.append(title, element('p', '', 'This topic link is not in the bundled library. Close this panel to browse or search all available topics.'));
    } else {
      dialog.append(element('span', 'eyebrow', topic.category + ' \u00b7 ' + topic.status), title);
      const actions = element('div', 'topic-actions');
      const notice = element('span');
      notice.setAttribute('role', 'status');
      actions.appendChild(button('Copy link', async () => {
        const shareURL = new URL('https://amreye.in/');
        shareURL.searchParams.set('topic', id);
        shareURL.hash = 'research';
        try {
          if (window.AndroidBridge && typeof window.AndroidBridge.copyToClipboard === 'function') window.AndroidBridge.copyToClipboard(shareURL.href);
          else await navigator.clipboard.writeText(shareURL.href);
          notice.textContent = 'Link copied';
        } catch (_) { notice.textContent = 'Link: ' + shareURL.href; }
      }));
      if (topic.pageStart) {
        const pdf = element('a', '', 'Source pages ' + topic.pageStart + '\u2013' + (topic.pageEnd || topic.pageStart));
        pdf.href = new URL('documents/amreye-compendium.pdf#page=' + topic.pageStart, assetBase).href;
        pdf.target = '_blank';
        pdf.rel = 'noopener noreferrer';
        actions.appendChild(pdf);
      }
      actions.appendChild(notice);
      dialog.appendChild(actions);
      if (topic.pages && topic.pages.length) {
        const navigation = element('div', 'chapter-navigation');
        const select = element('select');
        select.setAttribute('aria-label', 'Chapter page');
        topic.pages.forEach((page, index) => { const option = element('option', '', 'p. ' + page.page + ' \u00b7 ' + page.title); option.value = String(index); select.appendChild(option); });
        const changePage = index => { state.page = index; select.value = String(index); previous.disabled = index === 0; next.disabled = index === topic.pages.length - 1; renderPage(topic); };
        const previous = button('\u2190', () => changePage(state.page - 1));
        const next = button('\u2192', () => changePage(state.page + 1));
        previous.setAttribute('aria-label', 'Previous source page');
        next.setAttribute('aria-label', 'Next source page');
        previous.disabled = true;
        next.disabled = topic.pages.length <= 1;
        select.addEventListener('change', () => changePage(Number(select.value)));
        const label = element('label');
        label.appendChild(select);
        navigation.append(previous, label, next);
        dialog.appendChild(navigation);
      }
      content = element('div', 'topic-content');
      dialog.appendChild(content);
      renderPage(topic);
    }
    if (overlay.hidden) { if (!returnFocus) returnFocus = document.activeElement; previousOverflow = document.body.style.overflow; }
    overlay.hidden = false;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
  }

  function syncRoute() {
    if (!state.data) return;
    const params = new URLSearchParams(location.search);
    const nextQuery = params.get('q') || '';
    const nextCategory = params.get('category') || 'All';
    const nextMaturity = params.get('maturity') || 'All';
    if (nextQuery !== state.query || nextCategory !== state.category || nextMaturity !== state.maturity) state.limit = PAGE_SIZE;
    state.query = nextQuery;
    state.category = Array.from(category.options).some(option => option.value === nextCategory) ? nextCategory : 'All';
    state.maturity = Array.from(maturity.options).some(option => option.value === nextMaturity) ? nextMaturity : 'All';
    search.value = state.query;
    category.value = state.category;
    maturity.value = state.maturity;
    renderResults();
    const route = location.hash.replace(/^#\/?/, '');
    const id = params.get('topic');
    if (id && ['research', 'apex', 'library', ''].includes(route)) showTopic(id);
    else hideTopic();
  }

  function openTopic(id) {
    if (overlay && overlay.hidden) {
      returnFocus = document.activeElement;
      const card = returnFocus && returnFocus.closest('[data-topic-id]');
      returnTopicId = card ? card.dataset.topicId : null;
    }
    return ready.then(() => {
      navigate(url => { url.searchParams.set('topic', id); url.hash = 'research'; });
    });
  }

  function searchLibrary(query) {
    return ready.then(() => {
      navigate(url => {
        url.searchParams.delete('topic');
        url.searchParams.delete('category');
        url.searchParams.delete('maturity');
        if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
        url.hash = 'research';
      });
    });
  }

  async function init() {
    section = document.querySelector('#research.library-page') || document.querySelector('#research .library-page');
    if (!section) return;
    grid = section.querySelector('.topic-grid');
    search = section.querySelector('input[type="search"]');
    [category, maturity] = section.querySelectorAll('.explorer-controls select');
    result = section.querySelector('.library-result-meta [role="status"]');
    more = section.querySelector('.library-more');
    if (!grid || !search || !category || !maturity || !result || !more) return;
    const style = element('style');
    style.textContent = '.offline-library-overlay[hidden],.library-page [hidden]{display:none!important}.offline-library-overlay{position:fixed;inset:0;z-index:10000;background:#000b;display:flex;align-items:center;justify-content:center;padding:12px}.offline-library-overlay .library-dialog{position:relative;transform:none;left:auto;top:auto;margin:0;gap:16px;border-radius:16px;width:min(100%,1000px)!important;max-height:90dvh;box-sizing:border-box}.offline-library-close{align-self:flex-end;min-height:44px;flex-shrink:0;padding:8px 14px;border:1px solid #ffffff45;border-radius:8px}.offline-library-overlay .topic-content{flex:1;min-height:0}.offline-library-overlay .related-topics{display:flex;flex-wrap:wrap;gap:10px}.offline-library-overlay .related-topics button{border:1px solid #ffffff30;border-radius:8px;padding:10px;text-align:left}.offline-library-overlay .topic-content a:focus{outline:2px solid #a4eddf}.offline-library-overlay h2{margin:0}.offline-library-overlay .chapter-navigation{flex-shrink:0}.offline-library-overlay .topic-boundary{overflow-wrap:anywhere}';
    document.head.appendChild(style);
    overlay = element('div', 'standalone-modal-overlay offline-library-overlay');
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    dialog = element('section', 'apex-dialog library-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'offline-topic-title');
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', event => { if (event.target === overlay) closeTopic(); });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeTopic(); }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]),a[href],select,[tabindex="0"]')).filter(node => node.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    clear = button('Clear filters', resetFilters);
    clear.hidden = true;
    section.querySelector('.library-result-meta').appendChild(clear);
    empty = element('div', 'offline-card');
    empty.hidden = true;
    empty.append(element('h2', '', 'No matching topics'), element('p', '', 'Try a broader subject or clear the filters.'), button('Reset search', resetFilters, 'secondary-action'));
    grid.after(empty);
    search.addEventListener('input', setFilters);
    category.addEventListener('change', setFilters);
    maturity.addEventListener('change', setFilters);
    more.addEventListener('click', () => { state.limit += PAGE_SIZE; renderResults(); });
    section.querySelectorAll('.library-chip-row').forEach((row, index) => row.querySelectorAll('button').forEach(chip => chip.addEventListener('click', () => { (index === 0 ? category : maturity).value = chip.textContent.trim(); setFilters(); })));
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      // Fragment links inherit the current ?topic= query, but are not new topic navigation.
      if ((link.getAttribute('href') || '').trim().startsWith('#')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !['/', '/index.html', '/library', location.pathname].includes(url.pathname)) return;
      if (!url.searchParams.has('topic') && !(url.searchParams.has('q') && ['#research', '#apex', '#library'].includes(url.hash))) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(current => { current.search = url.search; current.hash = 'research'; });
    }, true);
    result.textContent = 'Loading the bundled library\u2026';
    try {
      const response = await fetch(new URL('repository.json', assetBase));
      if (!response.ok) throw new Error('Bundled library unavailable');
      const data = await response.json();
      if (!Array.isArray(data.topics) || !Array.isArray(data.sources)) throw new Error('Invalid library data');
      state.data = data;
      data.sources.forEach(source => sourceIndex.set(source.id, source));
      data.topics.forEach(topic => {
        topicIndex.set(topic.id, topic);
        headingIndex.set(topic.id, normalize([topic.title, ...(topic.pages || []).map(page => page.title)].join(' ')));
        searchIndex.set(topic.id, normalize([topic.title, topic.category, topic.status, topic.searchText || '', ...(topic.text || []), JSON.stringify(topic.tables || []), ...(topic.pages || []).map(page => [page.title, ...(page.text || []), JSON.stringify(page.tables || [])].join(' '))].join(' ')));
      });
      for (const [select, values] of [[category, data.topics.map(topic => topic.category)], [maturity, data.topics.map(topic => topic.status)]]) {
        select.replaceChildren(...['All', ...new Set(values)].map(value => { const option = element('option', '', value); option.value = value; return option; }));
      }
      // A topic-only launch must activate the research section rather than the default home section.
      if (new URLSearchParams(location.search).has('topic') && !location.hash) navigate(url => { url.hash = 'research'; }, true);
      syncRoute();
    } catch (error) {
      result.textContent = 'The bundled library could not be opened. Restart the app to try again.';
      result.setAttribute('role', 'alert');
      more.hidden = true;
      grid.replaceChildren();
      search.disabled = category.disabled = maturity.disabled = true;
      throw error;
    }
  }

  const ready = document.readyState === 'loading'
    ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })).then(init)
    : Promise.resolve().then(init);
  ready.catch(() => {}); // The visible error above is the failure state; avoid an unhandled rejection.
  window.AmreyeOfflineLibrary = { ready, openTopic, search: searchLibrary, syncRoute, closeTopic };
})();
