import { resolveSiteRoute } from './site-routes.mjs';

// Both shell anchors and framework Links use the same navigation contract.
// Return false for native browser actions (including modified clicks and downloads).
export function navigateSiteLink(event, anchor, browser) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return false;
  const target = new URL(anchor.href, browser.location.href);
  if (target.origin !== browser.location.origin || !['/', '/library'].includes(target.pathname) || target.hash === '#main-content') return false;
  const route = resolveSiteRoute(target.href);
  event.preventDefault();
  if (route.href !== browser.location.pathname + browser.location.search + browser.location.hash) {
    browser.history.pushState({}, '', route.href);
    browser.dispatchEvent(new browser.PopStateEvent('popstate'));
  }
  return true;
}
