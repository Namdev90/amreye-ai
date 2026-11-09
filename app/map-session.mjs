import {restoreMapState} from './network-data.mjs';
/** @param {{getItem:(key:string)=>string|null}} storage */
export function readMapSession(storage) {
  try { return restoreMapState(JSON.parse(storage.getItem('amr-map-v1') || 'null')); }
  catch { return restoreMapState(null); }
}
