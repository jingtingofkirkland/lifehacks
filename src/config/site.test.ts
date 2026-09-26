import { describe, expect, it } from 'vitest';
import { siteConfig } from './site';

describe('siteConfig contact channels', () => {
  it('exposes the official Messenger contact URL', () => {
    expect(siteConfig.messengerUrl).toBe('https://m.me/100077216003847');
  });

  it('includes a Messenger chat entry in the footer', () => {
    const entry = siteConfig.footerEntries.find(
      (e) => e.url === siteConfig.messengerUrl
    );
    expect(entry).toBeDefined();
    expect(entry!.title).toBe('Chat with us on Messenger');
  });

  it('renders the Messenger footer entry as an external link', () => {
    // Footer renders http(s) entries with <a target="_blank"> pills;
    // the URL must be absolute so it is not treated as an internal route.
    const entry = siteConfig.footerEntries.find(
      (e) => e.url === siteConfig.messengerUrl
    );
    expect(entry!.url.startsWith('https://')).toBe(true);
  });

  it('keeps footer entry urls unique', () => {
    const urls = siteConfig.footerEntries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
