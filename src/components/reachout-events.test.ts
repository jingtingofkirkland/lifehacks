/**
 * @vitest-environment jsdom
 *
 * Reachout click attribution tests.
 *
 * The contact CTAs used to fire one merged `Reachout` Pixel event with a
 * `channel` param, which made per-channel attribution in daily reporting
 * fragile. Each channel now fires its own event (ReachoutEmail,
 * ReachoutNextdoor, ReachoutMessenger) while keeping the `channel` param
 * and the UTM spread. These tests mount the real components in jsdom,
 * stub fbq, click the CTAs, and assert the exact trackCustom payloads —
 * including that the old merged event is never fired.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React, { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { FeedbackButton } from './FeedbackButton';
import { MessengerBubble } from './MessengerBubble';

// Next compiles JSX with the automatic runtime, but vitest's esbuild uses
// the classic runtime (tsconfig keeps `jsx: preserve`), so component
// modules reference a global React at render time.
(globalThis as Record<string, unknown>).React = React;
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

type FbqMock = ReturnType<typeof vi.fn>;

let fbq: FbqMock;
let container: HTMLDivElement;
let root: Root;
let preventer: (e: Event) => void;

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

/** Every event name passed to fbq across all calls. */
function firedEvents(): string[] {
  return fbq.mock.calls.map((c) => String(c[1]));
}

beforeEach(() => {
  fbq = vi.fn();
  (window as unknown as { fbq: FbqMock }).fbq = fbq;
  window.sessionStorage.clear();
  // Stored UTMs must be spread into every Reachout* payload.
  window.sessionStorage.setItem(
    'utm',
    JSON.stringify({ source: 'facebook', medium: 'cpc' }),
  );
  // Stop jsdom from trying to "navigate" mailto: / m.me links on click.
  preventer = (e: Event) => e.preventDefault();
  document.addEventListener('click', preventer, true);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.removeEventListener('click', preventer, true);
  container.remove();
  delete (window as unknown as { fbq?: FbqMock }).fbq;
  window.sessionStorage.clear();
});

describe('FeedbackButton reachout events', () => {
  it('Email Us fires ReachoutEmail with channel + UTM params', () => {
    render(createElement(FeedbackButton));
    const emailLink = container.querySelector('a[href^="mailto:"]');
    expect(emailLink).not.toBeNull();
    click(emailLink!);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'ReachoutEmail', {
      channel: 'email',
      source: 'facebook',
      medium: 'cpc',
    });
  });

  it('Nextdoor Message fires ReachoutNextdoor with channel + UTM params', () => {
    render(createElement(FeedbackButton));
    const nextdoorLink = container.querySelector(
      'a[href^="https://nextdoor.com/"]',
    );
    expect(nextdoorLink).not.toBeNull();
    click(nextdoorLink!);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'ReachoutNextdoor', {
      channel: 'nextdoor',
      source: 'facebook',
      medium: 'cpc',
    });
  });

  it('never fires the old merged Reachout event', () => {
    render(createElement(FeedbackButton));
    click(container.querySelector('a[href^="mailto:"]')!);
    click(container.querySelector('a[href^="https://nextdoor.com/"]')!);
    expect(fbq).toHaveBeenCalledTimes(2);
    expect(firedEvents()).toEqual(['ReachoutEmail', 'ReachoutNextdoor']);
    expect(firedEvents()).not.toContain('Reachout');
  });
});

describe('MessengerBubble reachout event', () => {
  it('bubble click fires ReachoutMessenger with channel + UTM params', () => {
    render(createElement(MessengerBubble));
    const bubble = container.querySelector(
      'a[aria-label="Chat with us on Messenger"]',
    );
    expect(bubble).not.toBeNull();
    click(bubble!);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'ReachoutMessenger', {
      channel: 'messenger',
      source: 'facebook',
      medium: 'cpc',
    });
    expect(firedEvents()).not.toContain('Reachout');
  });
});
