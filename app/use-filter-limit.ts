"use client";
import {useState} from 'react';

// Adjust pagination during render so a new filter never paints the old limit.
export function useFilterLimit(filterKey:string) {
  const [state, setState] = useState({filterKey, limit:12});
  if (state.filterKey !== filterKey) setState({filterKey, limit:12});
  const limit = state.filterKey === filterKey ? state.limit : 12;
  const showMore = () => setState(current => ({filterKey, limit:(current.filterKey === filterKey ? current.limit : 12) + 12}));
  return {limit, showMore};
}
