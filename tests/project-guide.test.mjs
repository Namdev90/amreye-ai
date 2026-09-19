import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectGuideReply} from '../app/project-guide-core.mjs';
const data = JSON.parse(readFileSync(new URL('../app/public-knowledge.json', import.meta.url), 'utf8'));

test('guide preserves public source summaries and maturity labels', () => {
  const reply = projectGuideReply('What is working in Reader V1 today?', data);
  assert.equal(reply.kind, 'results');
  assert.ok(reply.matches.length > 0 && reply.matches.length <= 3);
  for (const match of reply.matches) {
    const topic = data.topics.find(item => item.id === match.id);
    assert.equal(match.summary, topic.text[0]);
    assert.equal(match.status, topic.status);
    assert.ok(match.sources.every(source => topic.sourceIds.includes(source.id)));
  }
});
test('guide does not invent answers for unavailable information', () => {
  assert.equal(projectGuideReply('zxqv987 nonsense', data).kind, 'empty');
});
test('guide identifies itself accurately and does not replace clinical care', () => {
  assert.match(projectGuideReply('hello', data).message, /not generative AI/);
  for (const query of ['Which antibiotic should I take?', 'Can you interpret my results?', 'Give me clinical breakpoints', 'What dose should I take?']) {
    const reply = projectGuideReply(query, data);
    assert.equal(reply.kind, 'boundary', query);
    assert.equal(reply.matches.length, 0);
  }
  assert.equal(projectGuideReply('What still needs validation?', data).kind, 'results');
});
