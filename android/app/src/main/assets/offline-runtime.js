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
    return routeAlias[clean] || clean || 'hub';
  }

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
    window.addEventListener('hashchange', () => {
      updateActiveSection(location.hash);
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.length > 1) {
          const route = normalize(href);
          if (route) {
            e.preventDefault();
            if (location.hash !== href) {
              history.pushState(null, '', href);
            }
            updateActiveSection(route);
          }
        }
      }
    });

    updateActiveSection(location.hash || 'hub');
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

  // --- 4. Synthetic Caliper & Agar Plate Demo ---
  function initSyntheticDemo() {
    const demoSec = document.getElementById('demo');
    if (!demoSec) return;

    let currentDisc = 'CIP';
    let currentMm = 24.0;
    let isOverlayVisible = true;
    let selectedProfile = 'A';
    let isInspected = false;
    let currentOpticalMode = 'standard';

    const breakpoints = {
      AMP: { s: 14, r: 14 },
      CIP: { s: 25, r: 22 },
      MEM: { s: 28, r: 22 },
      GEN: { s: 18, r: 15 },
      SXT: { s: 16, r: 13 },
      AMC: { s: 19, r: 19 }
    };

    function calculateCategory(disc, mm) {
      const rule = breakpoints[disc] || { s: 20, r: 15 };
      if (mm >= rule.s) return { cat: 'S', label: 'Susceptible', color: '#34d399' };
      if (mm < rule.r) return { cat: 'R', label: 'Resistant', color: '#f87171' };
      return { cat: 'I', label: 'Intermediate', color: '#fbbf24' };
    }

    function updateWorkbenchUI() {
      demoSec.querySelectorAll('.caliper-mm-display, [data-field="current-mm"]').forEach((el) => {
        el.textContent = `${currentMm.toFixed(1)} mm`;
      });

      const res = calculateCategory(currentDisc, currentMm);
      demoSec.querySelectorAll('.caliper-category-badge, [data-field="current-category"]').forEach((el) => {
        el.textContent = `${res.cat} · ${res.label}`;
        el.style.borderColor = res.color;
        el.style.color = res.color;
      });

      const slider = demoSec.querySelector('input[type="range"].caliper-slider');
      if (slider && parseFloat(slider.value) !== currentMm) {
        slider.value = currentMm.toString();
      }

      const zoneCircle = demoSec.querySelector(`.plate-disc-zone[data-disc="${currentDisc}"], #disc-zone-${currentDisc}`);
      if (zoneCircle) {
        const radius = Math.max(12, currentMm * 2.2);
        zoneCircle.setAttribute('r', radius.toString());
      }
    }

    demoSec.addEventListener('input', (e) => {
      if (e.target.matches('input[type="range"].caliper-slider, input[type="range"]')) {
        currentMm = parseFloat(e.target.value);
        updateWorkbenchUI();
      }
    });

    demoSec.addEventListener('click', (e) => {
      // Nudge buttons
      const nudgeBtn = e.target.closest('[data-nudge], .caliper-nudges button');
      if (nudgeBtn) {
        let delta = parseFloat(nudgeBtn.getAttribute('data-nudge') || '0');
        if (!delta) {
          const txt = nudgeBtn.textContent || '';
          if (txt.includes('-1.0')) delta = -1.0;
          else if (txt.includes('-0.1')) delta = -0.1;
          else if (txt.includes('+0.1')) delta = 0.1;
          else if (txt.includes('+1.0')) delta = 1.0;
        }
        currentMm = Math.min(35.0, Math.max(6.0, Math.round((currentMm + delta) * 10) / 10));
        updateWorkbenchUI();
      }

      // Disc selection
      const discBtn = e.target.closest('[data-select-disc]');
      if (discBtn) {
        currentDisc = discBtn.getAttribute('data-select-disc') || 'CIP';
        demoSec.querySelectorAll('[data-select-disc]').forEach(b => b.classList.remove('active'));
        discBtn.classList.add('active');
        updateWorkbenchUI();
      }

      // Optical illumination modes
      const opticalChip = e.target.closest('.optical-chip');
      if (opticalChip) {
        const mode = opticalChip.getAttribute('data-optical') || 'standard';
        currentOpticalMode = mode;
        demoSec.querySelectorAll('.optical-chip').forEach(c => c.classList.remove('active'));
        opticalChip.classList.add('active');
        const plateSvg = demoSec.querySelector('.metrology-plate');
        if (plateSvg) {
          plateSvg.setAttribute('data-optical-mode', mode);
          plateSvg.className.baseVal = `metrology-plate metrology-plate-${mode}`;
        }
        showToast(`Optical filter: ${opticalChip.textContent}`);
      }

      // Scenario presets
      const presetChip = e.target.closest('.preset-chip');
      if (presetChip) {
        const scenario = presetChip.getAttribute('data-scenario') || 'clean';
        demoSec.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        presetChip.classList.add('active');
        const selectScenario = demoSec.querySelector('select[value]');
        if (selectScenario) {
          selectScenario.value = scenario;
          selectScenario.dispatchEvent(new Event('change', { bubbles: true }));
        }
        showToast(`QC Scenario: ${presetChip.textContent}`);
      }

      // Overlay toggle
      const overlayBtn = e.target.closest('.view-switch button, .plate-toggle-overlay');
      if (overlayBtn) {
        const isOverlay = overlayBtn.textContent.includes('overlay') || overlayBtn.textContent.includes('Measurement');
        isOverlayVisible = isOverlay;
        demoSec.querySelectorAll('.view-switch button').forEach(b => b.setAttribute('aria-pressed', 'false'));
        overlayBtn.setAttribute('aria-pressed', 'true');
        const overlayG = demoSec.querySelector('.plate-svg-overlay');
        if (overlayG) {
          overlayG.style.display = isOverlayVisible ? 'block' : 'none';
        }
      }

      // Inspection confirmation
      const inspectCheckbox = e.target.closest('input[type="checkbox"]');
      if (inspectCheckbox && (inspectCheckbox.id === 'inspect-boundary' || inspectCheckbox.closest('.verify-boundary'))) {
        isInspected = inspectCheckbox.checked;
        const confirmBtn = demoSec.querySelector('.btn-confirm-review, .review-actions button');
        if (confirmBtn) {
          confirmBtn.disabled = !isInspected;
        }
      }

      // Lab certificate modal trigger
      const certBtn = e.target.closest('.btn-lab-certificate, [data-action="open-certificate"]');
      if (certBtn) {
        const modal = document.getElementById('lab-certificate-modal');
        if (modal) {
          modal.classList.add('is-open');
        }
      }

      // Export report modal
      const exportBtn = e.target.closest('[data-action="export-record"], .btn-view-record');
      if (exportBtn) {
        const modal = document.getElementById('record-export-modal');
        if (modal) {
          modal.classList.add('is-open');
        }
      }
    });

    // Close certificate & record modals
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cert-modal-close') || e.target.classList.contains('cert-modal-backdrop')) {
        const modal = document.getElementById('lab-certificate-modal');
        if (modal) modal.classList.remove('is-open');
      }
      if (e.target.closest('.record-modal-close') || e.target.classList.contains('record-modal-backdrop')) {
        const modal = document.getElementById('record-export-modal');
        if (modal) modal.classList.remove('is-open');
      }
      // Copy certificate summary
      if (e.target.closest('#btn-copy-cert')) {
        const summary = `AMReye.AI AST Metrology Record\nScenario: SCN-2026-EUCAST-DEMO\nCIP 5µg: ${currentMm.toFixed(1)} mm (${calculateCategory(currentDisc, currentMm).cat})\nStatus: Inspected & Verified\nDisclaimer: Synthetic Demonstration Only`;
        navigator.clipboard.writeText(summary).then(() => {
          showToast('Certificate summary copied to clipboard!');
        }).catch(() => {
          showToast('Copied to clipboard');
        });
      }
    });

    updateWorkbenchUI();
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
      const statusPill = document.getElementById('app-network-pill');
      if (statusPill) {
        if (isOnline) {
          statusPill.innerHTML = '<span class="status-dot green"></span><span class="status-text">Online (Live)</span>';
          statusPill.classList.add('is-online');
          statusPill.classList.remove('is-offline');
        } else {
          statusPill.innerHTML = '<span class="status-dot amber"></span><span class="status-text">Offline Metrology</span>';
          statusPill.classList.add('is-offline');
          statusPill.classList.remove('is-online');
        }
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
    initResearchLibrary();
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
