import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignores falsy inputs', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('resolves conflicting tailwind utilities', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles conditional objects', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});
