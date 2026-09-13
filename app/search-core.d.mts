import type {Topic} from './library-view';
export const aliases:Record<string,string[]>;
export const questions:string[][];
export function searchTopics<T extends Topic>(topics:T[],query:string):{topic:T;score:number}[];
export function relatedTopics<T extends Topic>(topics:T[],topic:T):T[];
