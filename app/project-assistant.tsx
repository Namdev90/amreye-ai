"use client";

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, MessageCircle, Send, RotateCcw, X} from 'lucide-react';
import data from './public-knowledge.json';
import {projectGuideReply} from './project-guide-core.mjs';

type GuideSource = {id: string; title: string; url: string};
type GuideMatch = {id: string; title: string; status: string; summary: string; referenceLabel: string; sources: GuideSource[]};
type Turn = {id: number; question: string; reply: {kind: string; message: string; matches: GuideMatch[]}};
const prompts = ['What is working in Reader V1 today?', 'What still needs validation?', 'What does BAHU mean?'];

export default function ProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const latest = useRef<HTMLElement>(null);
  useEffect(() => { if (turns.length) latest.current?.scrollIntoView({block: 'start', behavior: 'instant'}); }, [turns]);
  const ask = (value: string) => {
    const query = value.trim().slice(0, 400);
    if (!query) return;
    setTurns(previous => [...previous.slice(-11), {id: Date.now(), question: query, reply: projectGuideReply(query, data)}]);
    setQuestion('');
  };
  return <div className="project-assistant">
    <button className="project-assistant-launcher" aria-label="Ask the project guide" aria-expanded={open} aria-controls="project-assistant-panel" onClick={() => setOpen(!open)}><MessageCircle aria-hidden="true"/><span>Ask AMReye</span></button>
    {open && <section id="project-assistant-panel" className="project-assistant-panel" aria-labelledby="project-assistant-title" onKeyDown={event => {if(event.key === 'Escape'){setOpen(false);event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('.project-assistant-launcher')?.focus();}}}>
      <header data-slot="dialog-header"><h2 id="project-assistant-title" data-slot="dialog-title">AMReye project guide</h2><p data-slot="dialog-description">Source-linked search · Not generative AI</p><button className="project-assistant-close" aria-label="Close project guide" onClick={() => {setOpen(false);document.querySelector<HTMLButtonElement>('.project-assistant-launcher')?.focus();}}><X size={20}/></button></header>
      <div className="project-assistant-conversation" role="log" aria-label="Project guide conversation" aria-live="polite" aria-relevant="additions">
        {!turns.length && <div className="project-assistant-welcome"><p>What would you like to understand?</p><p>Explore the prototype, research and proposed products using the public library.</p><div className="project-assistant-prompts">{prompts.map(prompt => <button key={prompt} onClick={() => ask(prompt)}>{prompt}<ArrowUpRight size={15} aria-hidden="true"/></button>)}</div></div>}
        {turns.map((turn, index) => <section className="project-assistant-turn" key={turn.id} ref={index === turns.length - 1 ? latest : undefined}>
          <p className="project-assistant-question">{turn.question}</p>
          <div className="project-assistant-answer"><p>{turn.reply.message}</p>{turn.reply.matches.map(match => <article key={match.id}><small>{match.status}</small><h3>{match.title}</h3><p>{match.summary}</p><a href={'/library?topic=' + encodeURIComponent(match.id)} onClick={() => setOpen(false)}>Read topic and references<ArrowUpRight size={14} aria-hidden="true"/></a>{match.sources.length > 0 && <details><summary>Background sources</summary>{match.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={14} aria-hidden="true"/></a>)}</details>}</article>)}</div>
        </section>)}
      </div>
      <form className="project-assistant-form" onSubmit={event => {event.preventDefault();ask(question);}}><label className="sr-only" htmlFor="project-guide-question">Ask about AMReye</label><input id="project-guide-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={400} placeholder="Ask about the project…" autoComplete="off"/><button type="submit" disabled={!question.trim()} aria-label="Send question"><Send size={19}/></button></form>
      <div className="project-assistant-foot"><small>Stays in this tab. No patient data or medical advice.</small><button onClick={() => {setTurns([]);setQuestion('');}} disabled={!turns.length} aria-label="Clear conversation"><RotateCcw size={16}/></button></div>
    </section>}
  </div>;
}
