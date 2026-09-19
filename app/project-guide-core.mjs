import {searchTopics} from './search-core.mjs';

export function projectGuideReply(question, data) {
  const query = question.trim().slice(0, 400);
  if (/\b(dosage|dose|prescri\w*|diagnos\w*|my symptoms|my results|my infection|my patient|patient results|clinical breakpoints|clsi cutoffs|eucast cutoffs)\b/i.test(query)
      || /\b(which|what|recommend|choose)\b.*\b(antibiotic|treatment|medicine)\b.*\b(take|use|patient|infection|me|my)\b/i.test(query)
      || /\b(should i|can i|can you|should we)\b.*\b(take|treat|interpret|diagnose|prescribe)\b/i.test(query)) {
    return {kind: 'boundary', message: 'This guide cannot recommend treatment, interpret a patient result or supply clinical breakpoints. AMReye.AI is a prototype project, and the demonstrations use fictional data. Please consult a qualified clinician for medical decisions. I can help you find project information about validation or human review.', matches: []};
  }
  if (/^(hello|hi|hey|help)[!.?\s]*$/i.test(query)) {
    return {kind: 'intro', message: 'Ask about the prototype, proposed instruments, validation or the demo. I find published project summaries and link you to their references. This is a search-based guide, not generative AI.', matches: []};
  }
  const matches = searchTopics(data.topics, query).filter(result => result.score >= 6).slice(0, 3).map(({topic}) => ({
    id: topic.id, title: topic.title, status: topic.status, summary: topic.text[0],
    referenceLabel: topic.referenceLabel,
    sources: data.sources.filter(source => topic.sourceIds.includes(source.id)).slice(0, 2),
  }));
  return matches.length
    ? {kind: 'results', message: 'Here are the closest published project summaries. Each keeps its development status and source links.', matches}
    : {kind: 'empty', message: 'I could not find a clear match in the public project library. Try a subject such as Reader V1, validation, BAHU or image quality. I cannot search private documents or invent missing information.', matches: []};
}
