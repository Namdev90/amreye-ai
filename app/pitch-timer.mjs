/** @typedef {{duration:number, elapsed:number, startedAt:number|null}} TimerState */
/** @param {TimerState} state @param {number} now */
export function elapsedSeconds(state, now) {
  return Math.min(state.duration * 60, state.elapsed + (state.startedAt === null ? 0 : Math.max(0, Math.floor((now - state.startedAt) / 1000))));
}
/** @param {TimerState} state @param {{type:string, now:number, duration?:number}} action @returns {TimerState} */
export function timerReducer(state, action) {
  if (action.type === 'reset') return {...state, elapsed: 0, startedAt: null};
  if (action.type === 'duration') return {duration: action.duration ?? state.duration, elapsed: 0, startedAt: null};
  const elapsed = elapsedSeconds(state, action.now);
  if (action.type === 'toggle') {
    if (state.startedAt !== null) return {...state, elapsed, startedAt: null};
    return elapsed >= state.duration * 60 ? state : {...state, startedAt: action.now};
  }
  if (action.type === 'tick' && elapsed >= state.duration * 60) return {...state, elapsed, startedAt: null};
  return state;
}
