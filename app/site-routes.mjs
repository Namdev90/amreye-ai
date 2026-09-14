export const sectionHref = id => id === 'library' || id === 'apex' ? '/library' : '/#' + id;

// Preserve old bookmarks and topic queries while giving the library a named URL.
export function resolveSiteRoute(input) {
  const url = new URL(input);
  const hash = url.hash.slice(1);
  const section = hash === 'apex' || hash === 'library' ? 'library' : hash || (url.pathname.replace(/\/$/, '') === '/library' ? 'library' : 'home');
  url.pathname = section === 'library' ? '/library' : '/';
  url.hash = section === 'library' ? '' : hash;
  return {section, href: url.pathname + url.search + url.hash};
}
