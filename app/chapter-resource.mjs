/**
 * Load one chapter and ignore every result after cancellation, including fetchers
 * that resolve despite abort (for example a response already being decoded).
 * @param {string} id
 * @param {AbortSignal} signal
 * @param {typeof fetch} fetcher
 */
export async function loadChapter(id, signal, fetcher = fetch) {
  try {
    const response = await fetcher('/library/' + encodeURIComponent(id) + '.json', {signal});
    if (!response.ok) throw new Error('Unavailable');
    const detail = await response.json();
    return signal.aborted ? null : {detail, error:''};
  } catch {
    return signal.aborted ? null : {detail:null, error:'This chapter could not be loaded. Check your connection and try again.'};
  }
}
