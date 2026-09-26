import { siteConfig } from '@/config/site';

/**
 * "Chat with us on Messenger" pill button.
 * Links to the site's official Messenger contact channel.
 * Styled like the site's other pill buttons (see NavLinks/Footer).
 */
export function MessengerButton() {
  return (
    <a
      href={siteConfig.messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-4 px-4 py-2 rounded-full bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-sm font-medium"
    >
      Chat with us on Messenger
    </a>
  );
}
