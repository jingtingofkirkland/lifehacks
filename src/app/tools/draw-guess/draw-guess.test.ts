import { describe, expect, it } from 'vitest';
import {
  CUSTOM_WORDS_KEY,
  makeCustomWord,
  maskWord,
  mergePool,
  parseCustomWords,
  parseRemovedIds,
  parseTally,
  pickWord,
  themeWords,
  WORD_BANK,
  type CustomWord,
} from './words';

describe('built-in word bank', () => {
  it('has 5 themes with at least 20 bilingual words each', () => {
    expect(WORD_BANK).toHaveLength(5);
    for (const theme of WORD_BANK) {
      expect(theme.words.length).toBeGreaterThanOrEqual(20);
      for (const entry of theme.words) {
        expect(entry.en.trim()).not.toBe('');
        expect(entry.zh.trim()).not.toBe('');
      }
    }
  });

  it('has unique word ids across the whole bank', () => {
    const ids = WORD_BANK.flatMap((t) => t.words.map((entry) => entry.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps difficulty at medium: first-glance freebies out, think-a-bit words in', () => {
    const ids = new Set(WORD_BANK.flatMap((t) => t.words.map((e) => e.id)));
    for (const gone of [
      'animals:dog',
      'animals:cat',
      'animals:bee',
      'food:apple',
      'school:sun',
      'school:moon',
      'everyday:car',
      'everyday:house',
      'actions:eat',
      'actions:run',
    ]) {
      expect(ids.has(gone), `${gone} should be gone`).toBe(false);
    }
    for (const kept of [
      'everyday:fire-truck',
      'everyday:refrigerator',
      'school:microscope',
      'school:waterfall',
      'school:slide',
      'school:forest',
      'school:astronaut',
      'actions:play-piano',
      'actions:play-soccer',
      'animals:goldfish',
    ]) {
      expect(ids.has(kept), `${kept} should be in`).toBe(true);
    }
  });

  it('ignores removed ids that no longer exist in the bank', () => {
    // A family removed 狗 while it was still in the bank; after the
    // medium-difficulty refresh that id is simply gone — the stale
    // entry must stay a harmless no-op, never an error or a phantom.
    const pool = mergePool('animals', [], ['animals:dog']);
    expect(pool).toHaveLength(28);
  });
});

describe('mergePool (built-in + custom - removed)', () => {
  const custom: CustomWord[] = [makeCustomWord('animals', ' axolotl ')];
  const removed = ['animals:elephant'];

  it('includes custom words and excludes removed built-ins', () => {
    const pool = mergePool('animals', custom, removed);
    expect(pool.some((entry) => entry.id === 'custom:animals:axolotl')).toBe(true);
    expect(pool.some((entry) => entry.id === 'animals:elephant')).toBe(false);
    expect(pool.some((entry) => entry.id === 'animals:tiger')).toBe(true);
  });

  it('"all" spans every theme', () => {
    const pool = mergePool('all', custom, removed);
    const total = WORD_BANK.reduce((n, t) => n + t.words.length, 0);
    expect(pool).toHaveLength(total - 1 + 1);
  });

  it('themeWords splits builtin/custom for the manager UI', () => {
    const { builtin, custom: themeCustom } = themeWords('animals', custom, removed);
    expect(builtin.some((entry) => entry.id === 'animals:elephant')).toBe(false);
    expect(themeCustom).toHaveLength(1);
  });
});

describe('pickWord (no repeat with previous word)', () => {
  const pool = mergePool('animals', [], []);

  it('never returns the previous word when the pool has more than one', () => {
    let seed = 42;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let last = pickWord(pool, null, rng);
    for (let i = 0; i < 200; i += 1) {
      const next = pickWord(pool, last?.id ?? null, rng);
      expect(next).not.toBeNull();
      expect(next?.id).not.toBe(last?.id);
      last = next;
    }
  });

  it('returns null for an empty pool and the only word for a pool of one', () => {
    expect(pickWord([], null)).toBeNull();
    const only = pool[0];
    expect(pickWord([only], only.id)?.id).toBe(only.id);
  });
});

describe('maskWord (anti-peek display)', () => {
  it('masks one bullet per character and keeps spaces', () => {
    expect(maskWord('苹果')).toBe('••');
    expect(maskWord('ice cream')).toBe('••• •••••');
    expect(maskWord('')).toBe('');
  });
});

describe('localStorage parsers (tolerant of junk)', () => {
  it('round-trips custom words and drops malformed entries', () => {
    const list = [makeCustomWord('food', 'taco')];
    expect(parseCustomWords(JSON.stringify(list))).toEqual(list);
    expect(parseCustomWords('not json')).toEqual([]);
    expect(parseCustomWords('[{"id":1}]')).toEqual([]);
    expect(parseCustomWords(null)).toEqual([]);
    expect(CUSTOM_WORDS_KEY).toContain('drawGuess');
  });

  it('keeps an optional English gloss on custom words, bilingually in the pool', () => {
    const withGloss = makeCustomWord('animals', ' 滑板 ', ' skateboard ');
    expect(withGloss).toEqual({
      id: 'custom:animals:滑板',
      theme: 'animals',
      text: '滑板',
      en: 'skateboard',
    });
    expect(parseCustomWords(JSON.stringify([withGloss]))).toEqual([withGloss]);
    const pool = mergePool('animals', [withGloss], []);
    const entry = pool.find((e) => e.id === withGloss.id);
    expect(entry).toEqual({ id: withGloss.id, zh: '滑板', en: 'skateboard' });
    // No gloss (older saves): the word still joins, same text both ways,
    // and a junk gloss is dropped instead of breaking the word.
    const bare = makeCustomWord('animals', '仓鼠');
    expect(bare.en).toBeUndefined();
    expect(
      parseCustomWords(
        '[{"id":"custom:animals:x","theme":"animals","text":"x","en":5}]',
      ),
    ).toEqual([{ id: 'custom:animals:x', theme: 'animals', text: 'x' }]);
  });

  it('parses removed ids and tally defensively', () => {
    expect(parseRemovedIds('["animals:elephant", 3, null]')).toEqual(['animals:elephant']);
    expect(parseRemovedIds('{oops')).toEqual([]);
    expect(parseTally('7')).toBe(7);
    expect(parseTally('-2')).toBe(0);
    expect(parseTally('abc')).toBe(0);
    expect(parseTally(null)).toBe(0);
  });
});
