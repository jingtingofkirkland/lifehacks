/**
 * @vitest-environment jsdom
 *
 * PostCard (/tech/) interaction tests.
 *
 * Reader feedback: the article preview looked Chinese-only and was not
 * clickable, and the "Read More" text control was too faint to notice.
 * The card now (a) makes the whole preview a button that expands the full
 * article, (b) styles Read More / Show Less as a filled high-contrast
 * pill button, and (c) shows a bilingual chip when an English version
 * exists. These tests mount the real component and lock that behaviour in.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import React, { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { PostCard } from './PostCard';
import type { TechPost } from '@/config/techPosts';

// Next compiles JSX with the automatic runtime, but vitest's esbuild uses
// the classic runtime (tsconfig keeps `jsx: preserve`), so component
// modules reference a global React at render time.
(globalThis as Record<string, unknown>).React = React;
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const bilingualPost: TechPost = {
  id: 'test-post',
  title: 'Test Title 标题',
  description: 'A short preview description.',
  category: 'AI',
  date: '2026-10-05',
};

const zhContent = '# Test Title 标题\n\n这是中文正文段落。';
const enContent = '## Test Title English\n\nThis is the English body paragraph.';

let container: HTMLDivElement;
let root: Root;

function render(ui: React.ReactElement) {
  act(() => {
    root.render(ui);
  });
}

function click(el: Element) {
  act(() => {
    el.dispatchEvent(
      new window.MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  });
}

function buttons(): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll('button'));
}

function buttonByText(text: string): HTMLButtonElement | undefined {
  return buttons().find((b) => b.textContent?.includes(text));
}

/** The preview toggle is the button that wraps the card title (h3). */
function previewButton(): HTMLButtonElement | undefined {
  return buttons().find((b) => b.querySelector('h3'));
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('PostCard preview expansion', () => {
  it('renders the preview as a collapsed button and hides the article', () => {
    render(
      createElement(PostCard, {
        post: bilingualPost,
        content: zhContent,
        contentEn: enContent,
      }),
    );
    const preview = previewButton();
    expect(preview).toBeDefined();
    expect(preview!.getAttribute('aria-expanded')).toBe('false');
    expect(preview!.getAttribute('aria-controls')).toBe(
      'test-post-full-content',
    );
    expect(container.querySelector('#test-post-full-content')).toBeNull();
    expect(container.textContent).not.toContain('这是中文正文段落');
  });

  it('expands the bilingual article when the preview is clicked', () => {
    render(
      createElement(PostCard, {
        post: bilingualPost,
        content: zhContent,
        contentEn: enContent,
      }),
    );
    // Click the title text itself — the click must bubble to the preview
    // button and open the article.
    click(previewButton()!.querySelector('h3')!);
    expect(previewButton()!.getAttribute('aria-expanded')).toBe('true');

    const region = container.querySelector('#test-post-full-content');
    expect(region).not.toBeNull();
    expect(region!.getAttribute('role')).toBe('region');
    expect(region!.textContent).toContain('这是中文正文段落');

    // Language toggle switches the same expanded article to English.
    click(buttonByText('English')!);
    expect(region!.textContent).toContain('This is the English body paragraph.');
    expect(region!.textContent).not.toContain('这是中文正文段落');

    // Clicking the preview again collapses the article.
    click(previewButton()!);
    expect(previewButton()!.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('#test-post-full-content')).toBeNull();
  });

  it('styles Read More as a filled high-contrast button and flags bilingual content', () => {
    render(
      createElement(PostCard, {
        post: bilingualPost,
        content: zhContent,
        contentEn: enContent,
      }),
    );
    const readMore = buttonByText('Read More');
    expect(readMore).toBeDefined();
    expect(readMore!.className).toContain('bg-blue-600');
    expect(readMore!.className).toContain('text-white');
    expect(readMore!.className).toContain('font-semibold');
    expect(container.textContent).toContain('双语全文');

    // The Read More control toggles the same region.
    click(readMore!);
    expect(container.querySelector('#test-post-full-content')).not.toBeNull();
    expect(buttonByText('Show Less')).toBeDefined();
  });

  it('renders no expand controls for a post without full content', () => {
    render(createElement(PostCard, { post: bilingualPost }));
    expect(previewButton()).toBeUndefined();
    expect(buttonByText('Read More')).toBeUndefined();
    expect(container.textContent).toContain('Test Title 标题');
  });
});
