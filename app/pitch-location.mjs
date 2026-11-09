const SLIDE_CHANGE = 'amreye-pitch-slide-change';
/** @param {()=>void} notify */
export function subscribeSlide(notify) {
  window.addEventListener('popstate', notify);
  window.addEventListener('hashchange', notify);
  window.addEventListener(SLIDE_CHANGE, notify);
  return () => {
    window.removeEventListener('popstate', notify);
    window.removeEventListener('hashchange', notify);
    window.removeEventListener(SLIDE_CHANGE, notify);
  };
}
export const readSlide = () => new URLSearchParams(location.search).get('slide');
/** @param {number} next @param {number} count */
export function chooseSlide(next, count) {
  const url = new URL(location.href);
  url.searchParams.set('slide', String(Math.max(0, Math.min(count - 1, next)) + 1));
  history.replaceState(history.state, '', url);
  window.dispatchEvent(new Event(SLIDE_CHANGE));
}
