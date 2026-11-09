import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resolvePitchSlideIndex } from '../app/pitch-navigation.mjs';

test('one-based slide links resolve to zero-based indices within the deck', () => {
  for (const count of [1, 6, 9]) {
    for (let slide = 1; slide <= count; slide++) {
      assert.equal(resolvePitchSlideIndex(String(slide), count), slide - 1);
    }
    assert.equal(resolvePitchSlideIndex(String(count + 1), count), 0);
  }
});

test('fractional, missing, nonnumeric and out-of-range slide links safely show the first slide', () => {
  const slides = Array.from({ length: 6 }, (_, index) => ({ title: `Slide ${index + 1}` }));
  for (const value of [null, undefined, '', ' ', '0', '-1', '1.5', '5.99', '6.1', '7', 'NaN', 'Infinity', '-Infinity', 'hello', '1/2', '999999999999999999999']) {
    const index = resolvePitchSlideIndex(value, slides.length);
    assert.equal(index, 0, `Unsafe value: ${String(value)}`);
    assert.equal(slides[index].title, 'Slide 1');
  }
});

test('both pitch components use the shared resolver and their actual deck length', () => {
  for (const name of ['visual-pitch.tsx', 'discovery.tsx']) {
    const source = fs.readFileSync(new URL(`../app/${name}`, import.meta.url), 'utf8');
    assert.match(source, /import \{resolvePitchSlideIndex\} from '\.\/pitch-navigation\.mjs'/);
    assert.match(source, /setIndex\(resolvePitchSlideIndex\(new URLSearchParams\(location.search\).get\('slide'\),slides.length\)\)/);
  }
});
