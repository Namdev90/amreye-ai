(function() {
  if (window.__amreye_frontier_injected) return;
  window.__amreye_frontier_injected = true;

  // 0. Mark body for mobile app context
  document.body.classList.remove('amreye-app-desktop');
  document.body.classList.add('amreye-app-mobile');

  // 1. Inject cutting-edge Frontier AI styles & transition animations
  const style = document.createElement('style');
  style.id = 'amreye-frontier-styles';
  style.textContent = `
    @keyframes frontierSectionEnter {
      0% {
        opacity: 0.15;
        transform: translateY(18px) scale(0.99);
        filter: blur(4px);
      }
      60% {
        opacity: 0.95;
        filter: blur(0px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
      }
    }

    @keyframes frontierScanBeam {
      0% {
        transform: translateX(-100%) skewX(-20deg);
        opacity: 0;
      }
      30% {
        opacity: 0.9;
      }
      100% {
        transform: translateX(260%) skewX(-20deg);
        opacity: 0;
      }
    }

    @keyframes cyberLaserSweep {
      0% {
        left: -40%;
        width: 40%;
      }
      50% {
        left: 20%;
        width: 60%;
      }
      100% {
        left: 100%;
        width: 40%;
      }
    }

    @keyframes cyberPulseAura {
      0%, 100% {
        filter: drop-shadow(0 0 5px rgba(120, 221, 204, 0.45));
      }
      50% {
        filter: drop-shadow(0 0 14px rgba(120, 221, 204, 0.85));
      }
    }

    /* ===== Fullscreen Page Transition Scanner (1.25s) ===== */
    @keyframes ptRingPulse {
      0% { transform: scale(0.88); opacity: 0.35; }
      50% { transform: scale(1.12); opacity: 0.95; }
      100% { transform: scale(0.88); opacity: 0.35; }
    }
    @keyframes ptRingSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes ptLaserSweep {
      0% { width: 12%; left: 0%; }
      50% { width: 55%; left: 22%; }
      100% { width: 12%; left: 88%; }
    }
    @keyframes ptFadeIn {
      0% { opacity: 0; transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes ptFadeOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.04); }
    }

    #amreye-page-transition {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 2147483646;
      background: #07090b;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      pointer-events: none;
    }
    #amreye-page-transition.is-active {
      display: flex;
      pointer-events: auto;
      animation: ptFadeIn 0.15s ease-out both;
    }
    #amreye-page-transition.is-fading {
      animation: ptFadeOut 0.25s ease-in both;
    }

    .pt-scanner-container {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
    }
    .pt-ring-outer {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border: 2.5px solid #78ddcc;
      border-radius: 50%;
      background: rgba(8, 29, 34, 0.65);
      animation: ptRingPulse 1.2s ease-in-out infinite;
    }
    .pt-ring-inner {
      position: absolute;
      top: 14px; left: 14px; right: 14px; bottom: 14px;
      border: 1.5px dashed #38bdf8;
      border-radius: 50%;
      animation: ptRingSpin 2.4s linear infinite;
    }
    .pt-logo-core {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 58px; height: 58px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,221,204,0.25) 0%, transparent 70%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pt-logo-core span {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #78ddcc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .pt-brand-text {
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.04em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin-bottom: 4px;
    }
    .pt-sub-text {
      color: #78ddcc;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin-bottom: 20px;
    }
    .pt-laser-track {
      width: 160px;
      height: 3.5px;
      background: rgba(14, 23, 31, 0.9);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
    .pt-laser-fill {
      position: absolute;
      top: 0; height: 100%;
      background: linear-gradient(90deg, #38bdf8, #78ddcc, #34d399);
      border-radius: 2px;
      box-shadow: 0 0 8px #78ddcc;
      animation: ptLaserSweep 0.75s ease-in-out infinite alternate;
    }

    /* === Scroll & overflow containment === */
    html, body {
      overscroll-behavior: contain !important;
      -webkit-overflow-scrolling: touch;
    }

    html {
      scroll-behavior: smooth !important;
    }

    /* Subtle custom scrollbar */
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(120, 221, 204, 0.25);
      border-radius: 2px;
    }

    /* Top web loading laser bar */
    #amreye-web-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 2147483647;
      background: transparent;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.25s ease;
      pointer-events: none;
    }

    #amreye-web-loader.is-active {
      opacity: 1;
    }

    #amreye-web-loader .laser-line {
      position: absolute;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, transparent, #38bdf8, #78ddcc, #34d399, transparent);
      box-shadow: 0 0 10px #78ddcc;
      animation: cyberLaserSweep 0.85s infinite ease-in-out;
    }

    /* Transition classes */
    .frontier-animated-section {
      animation: frontierSectionEnter 0.32s cubic-bezier(0.16, 1, 0.3, 1) both !important;
      will-change: transform, opacity, filter;
    }

    .frontier-scan-active {
      position: relative;
      overflow: hidden;
    }

    .frontier-scan-active::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(120, 221, 204, 0.32), transparent);
      animation: frontierScanBeam 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      z-index: 999;
    }

    /* ===== HIDE DESKTOP QUICK-ACTION RAIL ===== */
    /* Prevents the desktop menu from appearing at the top of the mobile screen */
    .quick-action-rail {
      display: none !important;
    }

    /* ===== MOBILE BOTTOM DOCK OPTIMIZATION ===== */
    .atelier-dock {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      top: auto !important;
      display: flex !important;
      justify-content: space-around !important;
      align-items: center !important;
      min-height: 56px !important;
      background: rgba(7, 9, 11, 0.95) !important;
      backdrop-filter: blur(24px) saturate(140%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
      border-top: 1px solid rgba(120, 221, 204, 0.18) !important;
      border-radius: 0 !important;
      margin: 0 !important;
      padding: 6px 4px max(8px, env(safe-area-inset-bottom)) !important;
      z-index: 99999 !important;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.6) !important;
      pointer-events: auto !important;
    }

    .atelier-dock > a {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 3px !important;
      flex: 1 1 0 !important;
      min-height: 48px !important;
      color: #94a3b8 !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      text-decoration: none !important;
      -webkit-tap-highlight-color: transparent !important;
      touch-action: manipulation !important;
      transition: color 0.16s ease, transform 0.14s ease !important;
    }

    .atelier-dock > a:active {
      transform: scale(0.90) !important;
    }

    .atelier-dock > a[aria-current="page"],
    .atelier-dock > a.active {
      color: #78ddcc !important;
    }

    .atelier-dock > a[aria-current="page"] svg,
    .atelier-dock > a.active svg {
      color: #78ddcc !important;
      filter: drop-shadow(0 0 6px rgba(120, 221, 204, 0.7));
      animation: cyberPulseAura 2s infinite ease-in-out !important;
    }

    /* Top header bar — clean mobile header */
    .atelier-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 9990 !important;
      pointer-events: auto !important;
      touch-action: manipulation;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .brief-button, .index-button, .atelier-brand {
      touch-action: manipulation;
      min-width: 44px !important;
      min-height: 44px !important;
    }

    .brief-button:active, .index-button:active {
      transform: scale(0.92) !important;
    }

    /* Cards micro-interactions */
    .home-branches a, .product-card, .topic-card, .launch-card, .precision-workflow, .hub-card {
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease !important;
      touch-action: manipulation;
    }

    .home-branches a:active, .product-card:active, .topic-card:active, .hub-card:active {
      transform: scale(0.97) !important;
    }

    /* Prevent bottom dock from covering content */
    body, main, [data-workspace], .experience-hub, .home-directory {
      padding-bottom: 84px !important;
    }

    /* ===== DRAWER & HAMBURGER MENU OVERLAY RULES ===== */
    [data-slot="sheet-overlay"],
    .standalone-drawer-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 100000 !important;
      background: rgba(5, 7, 9, 0.88) !important;
      backdrop-filter: blur(20px) saturate(140%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
    }

    [data-slot="sheet-overlay"]:not([data-state="open"]),
    .standalone-drawer-overlay:not(.is-open) {
      display: none !important;
      pointer-events: none !important;
    }

    [data-slot="sheet-overlay"][data-state="open"],
    .standalone-drawer-overlay.is-open {
      display: block !important;
      pointer-events: auto !important;
    }

    [data-slot="sheet-content"].atelier-menu,
    .standalone-drawer-card {
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      z-index: 100001 !important;
      background: #080b0d !important;
      color: #eef3f3 !important;
      border: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.95) !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      padding-top: max(env(safe-area-inset-top, 0px), 24px) !important;
      padding-bottom: calc(max(env(safe-area-inset-bottom, 0px), 20px) + 48px) !important;
      padding-inline: 20px !important;
      box-sizing: border-box !important;
    }

    [data-slot="sheet-content"].atelier-menu:not([data-state="open"]),
    .standalone-drawer-card:not(.is-open) {
      display: none !important;
      pointer-events: none !important;
    }

    [data-slot="sheet-content"].atelier-menu[data-state="open"],
    .standalone-drawer-card.is-open {
      display: flex !important;
      flex-direction: column !important;
      pointer-events: auto !important;
    }

    [data-slot="sheet-content"].atelier-menu:has(.atelier-menu-body),
    .standalone-drawer-card:has(.atelier-menu-body) {
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* Suppress any default or redundant floating close buttons from Radix visually, while preserving clickable DOM node for programmatic triggers */
    [data-slot="sheet-content"].atelier-menu > button:not(.atelier-menu-close):not(.atelier-menu-done-btn),
    [data-slot="sheet-content"].atelier-menu > [data-slot="sheet-close"]:not(.atelier-menu-close):not(.atelier-menu-done-btn),
    [data-slot="sheet-content"].atelier-menu button.absolute:not(.atelier-menu-close),
    .standalone-drawer-card > button.absolute,
    .frontier-sr-hidden-close,
    [data-radix-original-close="true"] {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -10 !important;
    }

    @media (min-width: 851px) {
      [data-slot="sheet-content"].atelier-menu {
        left: auto !important;
        right: 0 !important;
        width: 620px !important;
        border-left: 1px solid rgba(120, 221, 204, 0.25) !important;
      }
    }

    .atelier-menu-header {
      position: sticky !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 20 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding-top: max(env(safe-area-inset-top, 0px), 16px) !important;
      padding-bottom: 12px !important;
      padding-inline: 20px !important;
      background: rgba(8, 11, 13, 0.96) !important;
      backdrop-filter: blur(24px) saturate(140%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
      border-bottom: 1px solid rgba(120, 221, 204, 0.16) !important;
      flex-shrink: 0 !important;
    }

    .atelier-menu-brand {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .atelier-menu-brand img {
      height: 28px !important;
      width: auto !important;
    }

    .atelier-menu-badge {
      display: inline-flex !important;
      align-items: center !important;
      padding: 3px 9px !important;
      border-radius: 999px !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      color: #78ddcc !important;
      background: rgba(120, 221, 204, 0.12) !important;
      border: 1px solid rgba(120, 221, 204, 0.28) !important;
    }

    .atelier-menu-close {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      min-height: 44px !important;
      border-radius: 50% !important;
      background: rgba(14, 23, 31, 0.9) !important;
      border: 1.5px solid rgba(120, 221, 204, 0.6) !important;
      color: #78ddcc !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      transition: background 0.15s, border-color 0.15s, transform 0.12s !important;
      flex-shrink: 0 !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6) !important;
      pointer-events: auto !important;
      z-index: 100010 !important;
    }

    .atelier-menu-close svg {
      width: 20px !important;
      height: 20px !important;
      stroke: #78ddcc !important;
      stroke-width: 2.5px !important;
      pointer-events: none !important;
    }

    .atelier-menu-close:active {
      transform: scale(0.90) !important;
      background: rgba(120, 221, 204, 0.25) !important;
      border-color: #78ddcc !important;
      color: #78ddcc !important;
    }

    .atelier-menu-body {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      padding: 22px 18px 24px !important;
      scrollbar-width: thin !important;
      scrollbar-color: rgba(120, 221, 204, 0.25) transparent !important;
    }

    .atelier-menu-title-group {
      padding: 0 0 16px !important;
      margin: 0 !important;
    }

    .atelier-menu-title {
      font-size: clamp(26px, 5.5vw, 36px) !important;
      font-weight: 700 !important;
      letter-spacing: -0.04em !important;
      color: #ffffff !important;
      line-height: 1.15 !important;
      margin: 0 0 6px 0 !important;
    }

    .atelier-menu .menu-intro {
      font-size: 13.5px !important;
      color: #94a3b8 !important;
      margin: 0 !important;
      line-height: 1.5 !important;
    }

    .atelier-menu .menu-columns {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 24px !important;
      margin-top: 16px !important;
    }

    @media (min-width: 680px) {
      .atelier-menu .menu-columns {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 24px !important;
      }
    }

    .menu-group {
      display: flex !important;
      flex-direction: column !important;
      background: rgba(255, 255, 255, 0.025) !important;
      border: 1px solid rgba(255, 255, 255, 0.07) !important;
      border-radius: 16px !important;
      padding: 16px !important;
    }

    .menu-group-header {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      margin-bottom: 3px !important;
    }

    .menu-group-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 50% !important;
      background: #78ddcc !important;
      box-shadow: 0 0 8px #78ddcc !important;
    }

    .menu-group h3 {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #f1f5f9 !important;
      margin: 0 !important;
      letter-spacing: -0.02em !important;
    }

    .menu-group-copy {
      font-size: 12px !important;
      color: #94a3b8 !important;
      margin: 2px 0 10px !important;
      line-height: 1.4 !important;
      min-height: 0 !important;
    }

    .menu-group-nav {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 2px 12px !important;
    }

    @media (max-width: 440px) {
      .menu-group-nav {
        grid-template-columns: 1fr !important;
      }
    }

    .menu-link-item {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      min-height: 44px !important;
      padding: 9px 8px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
      font-size: 13px !important;
      color: #cbd5e1 !important;
      text-decoration: none !important;
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      border-radius: 8px !important;
      transition: all 0.14s ease !important;
    }

    .menu-link-item:hover,
    .menu-link-item:active {
      background: rgba(120, 221, 204, 0.1) !important;
      color: #78ddcc !important;
      padding-inline: 10px !important;
    }

    .menu-link-arrow {
      color: #78ddcc !important;
      opacity: 0.65 !important;
      flex-shrink: 0 !important;
      transition: transform 0.14s, opacity 0.14s !important;
    }

    .menu-link-item:active .menu-link-arrow {
      transform: translate(2px, -2px) !important;
      opacity: 1 !important;
    }

    .atelier-menu-footer {
      margin-top: 24px !important;
      padding-top: 16px !important;
      padding-bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 24px) !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .atelier-menu-done-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      min-height: 46px !important;
      width: 100% !important;
      max-width: 280px !important;
      padding: 0 20px !important;
      border-radius: 999px !important;
      background: rgba(120, 221, 204, 0.14) !important;
      border: 1px solid rgba(120, 221, 204, 0.35) !important;
      color: #78ddcc !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      transition: all 0.15s ease !important;
    }

    .atelier-menu-done-btn:active {
      transform: scale(0.96) !important;
      background: rgba(120, 221, 204, 0.28) !important;
    }

    .atelier-menu-footnote {
      font-size: 11px !important;
      color: #64748b !important;
      letter-spacing: 0.04em !important;
      text-align: center !important;
    }

    /* Hide header & bottom dock while menu is open */
    body.menu-open .atelier-dock,
    body[data-menu-open="true"] .atelier-dock,
    body:has([data-slot="sheet-content"][data-state="open"]) .atelier-dock,
    body:has(.atelier-menu[data-state="open"]) .atelier-dock,
    body:has(.standalone-drawer-overlay.is-open) .atelier-dock {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transform: translateY(100%) !important;
      transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s !important;
    }

    body.menu-open .atelier-header,
    body[data-menu-open="true"] .atelier-header,
    body:has([data-slot="sheet-content"][data-state="open"]) .atelier-header,
    body:has(.atelier-menu[data-state="open"]) .atelier-header,
    body:has(.standalone-drawer-overlay.is-open) .atelier-header {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transform: translateY(-100%) !important;
      transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s !important;
    }
  `;
  document.head.appendChild(style);

  // 2. Ensure mobile responsive viewport
  (function fixViewport() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  })();

  // 3. Create Fullscreen Page Transition Overlay (DOM Fallback / Sync)
  var transitionOverlay = document.getElementById('amreye-page-transition');
  if (!transitionOverlay) {
    transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'amreye-page-transition';
    transitionOverlay.innerHTML = 
      '<div class="pt-scanner-container">' +
        '<div class="pt-ring-outer"></div>' +
        '<div class="pt-ring-inner"></div>' +
        '<div class="pt-logo-core"><span>AMR</span></div>' +
      '</div>' +
      '<div class="pt-brand-text">AMReye.AI</div>' +
      '<div class="pt-sub-text">LOADING SECTION</div>' +
      '<div class="pt-laser-track"><div class="pt-laser-fill"></div></div>';
    document.body.appendChild(transitionOverlay);
  }

  var transitionTimeout = null;
  var transitionFadeTimeout = null;
  function showPageTransition(sectionName) {
    // 1. Native Android hardware-accelerated transition
    if (window.AndroidBridge && window.AndroidBridge.showPageTransition) {
      try {
        window.AndroidBridge.showPageTransition(sectionName || 'NAVIGATING');
        return;
      } catch(e) {}
    }

    // 2. Web DOM overlay transition fallback
    if (transitionTimeout) clearTimeout(transitionTimeout);
    if (transitionFadeTimeout) clearTimeout(transitionFadeTimeout);
    var overlay = document.getElementById('amreye-page-transition');
    if (!overlay) return;
    
    var subText = overlay.querySelector('.pt-sub-text');
    if (subText && sectionName) {
      var cleanName = sectionName.toUpperCase().replace(/^[#/?=]+/, '').replace(/[-_]/g, ' ');
      subText.textContent = cleanName || 'NAVIGATING';
    }
    
    overlay.classList.remove('is-fading');
    overlay.classList.add('is-active');
    overlay.style.display = 'flex';
    overlay.style.pointerEvents = 'auto';
    
    transitionTimeout = setTimeout(function() {
      overlay.classList.add('is-fading');
      transitionFadeTimeout = setTimeout(function() {
        overlay.classList.remove('is-active', 'is-fading');
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
      }, 250);
    }, 600);
  }

  // 4. Top Web Loading Laser Bar
  var webLoader = document.getElementById('amreye-web-loader');
  if (!webLoader) {
    webLoader = document.createElement('div');
    webLoader.id = 'amreye-web-loader';
    webLoader.innerHTML = '<div class="laser-line"></div>';
    document.body.appendChild(webLoader);
  }

  function showLoadingIndicator() {
    if (webLoader) webLoader.classList.add('is-active');
    if (window.AndroidBridge && window.AndroidBridge.onSectionLoading) {
      try { window.AndroidBridge.onSectionLoading(true); } catch(e) {}
    }
  }

  function hideLoadingIndicator() {
    if (webLoader) webLoader.classList.remove('is-active');
    if (window.AndroidBridge && window.AndroidBridge.onSectionLoading) {
      try { window.AndroidBridge.onSectionLoading(false); } catch(e) {}
    }
  }

  // 5. Update active dock item state
  function updateActiveDock(activeHash) {
    if (!activeHash) return;
    var targetId = activeHash.replace('#', '');
    var dockLinks = document.querySelectorAll('.atelier-dock a');
    dockLinks.forEach(function(a) {
      var href = a.getAttribute('href') || '';
      if (href === activeHash || href === '#' + targetId) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      } else {
        a.removeAttribute('aria-current');
        a.classList.remove('active');
      }
    });
  }

  // 6. Animate section changes with FULLSCREEN transition
  function triggerSectionTransition(target, sectionName) {
    showPageTransition(sectionName || 'NAVIGATING');
    showLoadingIndicator();
    updateActiveDock(sectionName);

    if (!target) {
      setTimeout(hideLoadingIndicator, 1250);
      return;
    }
    // After transition overlay starts fading, trigger entry animation on target
    setTimeout(function() {
      target.classList.remove('frontier-animated-section', 'frontier-scan-active');
      void target.offsetWidth;
      target.classList.add('frontier-animated-section', 'frontier-scan-active');
      setTimeout(function() {
        target.classList.remove('frontier-scan-active');
        hideLoadingIndicator();
      }, 450);
    }, 750);
  }

  // Watch hash navigation (e.g. #hub, #home, #products, #demo, #research, #story)
  var lastHash = window.location.hash;
  window.addEventListener('hashchange', function() {
    var hash = window.location.hash;
    if (hash === lastHash) return;
    lastHash = hash;
    if (hash && hash.length > 1) {
      var target = document.querySelector(hash);
      if (target) {
        triggerSectionTransition(target, hash);
        return;
      }
    }
    var main = document.querySelector('main') || document.body;
    triggerSectionTransition(main, hash || 'HOME');
  });

  // 7. Intercept clicks for mailto, external links, PDFs, and navigation
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a, button[data-tab], .atelier-dock a, .home-branches a, .hub-card');
    if (!link) return;

    // A. Intercept mailto: links -> trigger native email (Gmail)
    var href = link.getAttribute('href') || (link.tagName === 'A' ? link.href : null);
    if (href && href.startsWith('mailto:')) {
      e.preventDefault();
      e.stopPropagation();
      if (window.AndroidBridge && window.AndroidBridge.openEmailLink) {
        window.AndroidBridge.openEmailLink(href);
      } else if (window.AndroidBridge && window.AndroidBridge.openEmailDraft) {
        try {
          var mailUrl = new URL(href);
          var to = mailUrl.pathname || 'namdevshirodkar20@gmail.com';
          var subject = mailUrl.searchParams.get('subject') || 'AMReye.AI Contact';
          var body = mailUrl.searchParams.get('body') || '';
          window.AndroidBridge.openEmailDraft(to, subject, body);
        } catch(err) {
          window.AndroidBridge.openEmailLink(href);
        }
      } else {
        window.location.href = href;
      }
      return;
    }

    // B. Intercept PDF and document links -> open via browser or viewer
    if (href && (href.endsWith('.pdf') || href.includes('/documents/') || href.endsWith('.csv'))) {
      e.preventDefault();
      e.stopPropagation();
      if (window.AndroidBridge && window.AndroidBridge.openPdfDocument) {
        window.AndroidBridge.openPdfDocument(href);
      } else if (window.AndroidBridge && window.AndroidBridge.openInBrowser) {
        window.AndroidBridge.openInBrowser(href);
      } else {
        window.open(href, '_blank');
      }
      return;
    }

    // C. Intercept External links -> route to Chrome / system browser
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      var isInternal = href.includes('amreye.in') || href.includes('androidplatform.net') || href.includes('localhost');
      if (!isInternal || link.target === '_blank') {
        e.preventDefault();
        e.stopPropagation();
        if (window.AndroidBridge && window.AndroidBridge.openInBrowser) {
          window.AndroidBridge.openInBrowser(href);
        } else {
          window.open(href, '_blank');
        }
        return;
      }
    }

  }, true);

  // 8. Intercept contact form submission to ensure native email draft triggers
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form && form.closest('.contact-panel, form[action^="mailto:"]')) {
      var select = form.querySelector('select');
      var nameInput = form.querySelector('input[autoComplete="name"], input[name="name"]');
      var orgInput = form.querySelector('input[autoComplete="organization"], input[name="org"]');
      var noteInput = form.querySelector('textarea');
      
      var kind = select ? select.value : 'Request a demo';
      var name = nameInput ? nameInput.value : '';
      var org = orgInput ? orgInput.value : '';
      var note = noteInput ? noteInput.value : '';
      var message = 'Hello AMReye.AI team,\n\n' + kind + '\nName: ' + name + '\nOrganisation: ' + org + '\n\n' + note;
      
      if (window.AndroidBridge && window.AndroidBridge.openEmailDraft) {
        e.preventDefault();
        window.AndroidBridge.openEmailDraft('namdevshirodkar20@gmail.com', 'AMReye.AI · ' + kind, message);
      }
    }
  }, true);

  // 9. Active Menu Lifecycle Synchronization & DOM Enhancement
  window.__closeFrontierMenu = function() {
    // 1. Click Radix's original close button if available
    try {
      var origCloses = document.querySelectorAll('[data-radix-original-close="true"], .frontier-sr-hidden-close');
      origCloses.forEach(function(btn) {
        btn.click();
      });
    } catch(e) {}

    // 2. Click any Radix SheetClose inside the menu
    try {
      var sheetClosers = document.querySelectorAll('.atelier-menu [data-slot="sheet-close"]:not(.atelier-menu-close), [data-slot="sheet-content"] [data-slot="sheet-close"]:not(.atelier-menu-close)');
      sheetClosers.forEach(function(sc) {
        sc.click();
      });
    } catch(e) {}

    // 3. Dispatch Escape key to dismiss Radix Sheet
    try {
      var escEvt = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
        composed: true
      });
      if (document.activeElement) document.activeElement.dispatchEvent(escEvt);
      document.dispatchEvent(escEvt);
      window.dispatchEvent(escEvt);
    } catch(e) {}

    // 4. Click backdrop overlay to trigger dismissal
    try {
      var overlay = document.querySelector('[data-slot="sheet-overlay"], [data-radix-dialog-overlay], .standalone-drawer-overlay');
      if (overlay) {
        overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        overlay.click();
      }
    } catch(e) {}

    // 5. Dismiss offline drawer if present
    try {
      var drawer = document.getElementById('directory-drawer-overlay');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    } catch(e) {}

    // 6. Force state attribute closed as fallback
    try {
      var openMenus = document.querySelectorAll('[data-slot="sheet-content"], .atelier-menu, .standalone-drawer-card');
      openMenus.forEach(function(m) {
        m.setAttribute('data-state', 'closed');
        m.classList.remove('is-open');
      });

      var overlays = document.querySelectorAll('[data-slot="sheet-overlay"], [data-radix-dialog-overlay], .standalone-drawer-overlay');
      overlays.forEach(function(o) {
        o.setAttribute('data-state', 'closed');
        o.classList.remove('is-open');
      });
    } catch(e) {}

    // 7. Force body state and restore header & dock
    document.body.classList.remove('menu-open');
    document.body.removeAttribute('data-menu-open');
    var header = document.querySelector('.atelier-header');
    var dock = document.querySelector('.atelier-dock');
    if (header) {
      header.style.removeProperty('display');
      header.style.opacity = '1';
      header.style.visibility = 'visible';
      header.style.pointerEvents = 'auto';
      header.style.transform = 'translateY(0)';
    }
    if (dock) {
      dock.style.removeProperty('display');
      dock.style.opacity = '1';
      dock.style.visibility = 'visible';
      dock.style.pointerEvents = 'auto';
      dock.style.transform = 'translateY(0)';
    }
    syncMenuState();
  };

  function syncMenuState() {
    var isOpen = !!document.querySelector(
      '[data-slot="sheet-content"][data-state="open"], .atelier-menu[data-state="open"], .standalone-drawer-overlay.is-open, .standalone-drawer-card.is-open'
    );
    var currentlyOpen = document.body.classList.contains('menu-open');
    if (isOpen === currentlyOpen) {
      if (isOpen) enhanceActiveMenu();
      return;
    }

    var header = document.querySelector('.atelier-header');
    var dock = document.querySelector('.atelier-dock');

    if (isOpen) {
      document.body.classList.add('menu-open');
      document.body.setAttribute('data-menu-open', 'true');
      if (header) {
        header.style.setProperty('display', 'none', 'important');
      }
      if (dock) {
        dock.style.setProperty('display', 'none', 'important');
      }
      enhanceActiveMenu();
    } else {
      document.body.classList.remove('menu-open');
      document.body.removeAttribute('data-menu-open');
      if (header) {
        header.style.removeProperty('display');
        header.style.opacity = '1';
        header.style.visibility = 'visible';
        header.style.pointerEvents = 'auto';
        header.style.transform = 'translateY(0)';
      }
      if (dock) {
        dock.style.removeProperty('display');
        dock.style.opacity = '1';
        dock.style.visibility = 'visible';
        dock.style.pointerEvents = 'auto';
        dock.style.transform = 'translateY(0)';
      }
    }
  }

  function enhanceActiveMenu() {
    var menu = document.querySelector('[data-slot="sheet-content"][data-state="open"], .atelier-menu[data-state="open"]');
    if (!menu) return;

    // Keep Radix's original close button in DOM so its React click handler is intact, but hide it visually
    var extraButtons = menu.querySelectorAll(':scope > button, :scope > [data-slot="sheet-close"], button.absolute, button[aria-label*="Close"], button[aria-label*="close"]');
    extraButtons.forEach(function(btn) {
      if (!btn.closest('.atelier-menu-header') && !btn.closest('.atelier-menu-footer') && !btn.classList.contains('atelier-menu-close')) {
        btn.setAttribute('data-radix-original-close', 'true');
        btn.classList.add('frontier-sr-hidden-close');
        btn.style.cssText = 'position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; opacity: 0 !important; pointer-events: none !important; z-index: -10 !important;';
      }
    });

    if (menu.dataset.frontierEnhanced) return;
    menu.dataset.frontierEnhanced = 'true';

    // If modern top header bar is missing (e.g. from amreye.in), dynamically inject it!
    if (!menu.querySelector('.atelier-menu-header')) {
      var topBar = document.createElement('div');
      topBar.className = 'atelier-menu-header';
      topBar.innerHTML = 
        '<div class="atelier-menu-brand">' +
          '<img src="/brand/amreye-logo-white.svg" alt="AMReye.AI" width="135" height="30" style="height:28px;width:auto;" />' +
          '<span class="atelier-menu-badge">Site Directory</span>' +
        '</div>' +
        '<button type="button" class="atelier-menu-close" aria-label="Close directory">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>' +
        '</button>';
      
      var closeBtn = topBar.querySelector('.atelier-menu-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.__closeFrontierMenu();
        });
        closeBtn.addEventListener('touchend', function(e) {
          e.preventDefault();
          window.__closeFrontierMenu();
        }, { passive: false });
      }
      menu.insertBefore(topBar, menu.firstChild);
    }

    // If modern footer is missing, inject Done button and footnote!
    if (!menu.querySelector('.atelier-menu-footer')) {
      var footer = document.createElement('div');
      footer.className = 'atelier-menu-footer';
      footer.innerHTML = 
        '<button type="button" class="atelier-menu-done-btn">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
          '<span>Done Exploring</span>' +
        '</button>' +
        '<span class="atelier-menu-footnote">AMReye.AI · Autonomous Microbiology Metrology Platform</span>';
      
      var doneBtn = footer.querySelector('.atelier-menu-done-btn');
      if (doneBtn) {
        doneBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.__closeFrontierMenu();
        });
        doneBtn.addEventListener('touchend', function(e) {
          e.preventDefault();
          window.__closeFrontierMenu();
        }, { passive: false });
      }
      menu.appendChild(footer);
    }

    // Bind link clicks inside the menu to close cleanly and update hash
    var links = menu.querySelectorAll('a[href^="#"]');
    links.forEach(function(a) {
      if (a.dataset.frontierBound) return;
      a.dataset.frontierBound = 'true';
      a.classList.add('menu-link-item');
      a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          window.__closeFrontierMenu();
          window.location.hash = href;
        }
      });
    });
  }

  // MutationObserver to watch for menu open/close states
  if (typeof MutationObserver !== 'undefined') {
    var menuObserverTimer = null;
    var menuObserver = new MutationObserver(function() {
      if (menuObserverTimer) clearTimeout(menuObserverTimer);
      menuObserverTimer = setTimeout(syncMenuState, 60);
    });
    // Only observe data-state to avoid infinite loops and main-thread lockups
    menuObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-state'] });
  }

  // Fast-path click and touchend handlers on menu triggers and close buttons
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('.index-button, [data-slot="sheet-trigger"]');
    if (trigger) {
      setTimeout(syncMenuState, 20);
      setTimeout(syncMenuState, 100);
      return;
    }
    var closer = e.target.closest('.atelier-menu-close, .atelier-menu-done-btn, [data-slot="sheet-close"], [data-slot="sheet-overlay"], [data-radix-dialog-overlay], .standalone-drawer-overlay, .directory-close-btn');
    if (closer) {
      window.__closeFrontierMenu();
      return;
    }
  }, true);

  document.addEventListener('touchend', function(e) {
    var closer = e.target.closest('.atelier-menu-close, .atelier-menu-done-btn, [data-slot="sheet-close"], [data-slot="sheet-overlay"], [data-radix-dialog-overlay], .standalone-drawer-overlay, .directory-close-btn');
    if (closer) {
      e.preventDefault();
      window.__closeFrontierMenu();
      return;
    }
  }, { capture: true, passive: false });
})();
