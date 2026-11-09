"use client";
import {useCallback, useEffect, useReducer, useState, useSyncExternalStore} from 'react';
import {resolvePitchSlideIndex} from './pitch-navigation.mjs';
import {elapsedSeconds, timerReducer} from './pitch-timer.mjs';

import {subscribeSlide,readSlide,chooseSlide} from './pitch-location.mjs';
const serverSlide = () => null;
export function usePitchSlide(count:number) {
  const slide = useSyncExternalStore(subscribeSlide, readSlide, serverSlide);
  const index = resolvePitchSlideIndex(slide, count);
  const choose = useCallback((next:number) => {
    chooseSlide(next,count);
  }, [count]);
  return {index, choose};
}
export function usePitchTimer() {
  const [state, dispatch] = useReducer(timerReducer, {duration:4, elapsed:0, startedAt:null});
  const [now, setNow] = useState(0);
  const running = state.startedAt !== null;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      dispatch({type:'tick', now:time});
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);
  const toggle = () => {const time=Date.now();setNow(time);dispatch({type:'toggle',now:time});};
  const reset = () => dispatch({type:'reset', now:0});
  const setDuration = (duration:number) => dispatch({type:'duration',duration,now:0});
  return {duration:state.duration, left:state.duration*60-elapsedSeconds(state, now), running, toggle, reset, setDuration};
}
