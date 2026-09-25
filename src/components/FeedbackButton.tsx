'use client';

import { getStoredUtm } from '@/lib/utm';

const EMAIL_HREF =
  'mailto:austinhao2018@gmail.com?subject=Feedback%20for%20Great%20Seattle%20Life%20Hacks';
const NEXTDOOR_HREF = 'https://nextdoor.com/profile/01NtDbxtQJw45GwN4';

function trackReachout(channel: 'email' | 'nextdoor') {
  if (
    typeof window !== 'undefined' &&
    typeof (window as any).fbq === 'function'
  ) {
    (window as any).fbq('trackCustom', 'Reachout', {
      channel,
      ...getStoredUtm(),
    });
  }
}

function FeedbackPills({ showLabels = false }: { showLabels?: boolean }) {
  const labelClass = showLabels ? 'inline' : 'hidden sm:inline';
  return (
    <>
      <a
        href={EMAIL_HREF}
        onClick={() => trackReachout('email')}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        title="Email us your feedback or ideas!"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
        <span className={labelClass}>Email Us</span>
      </a>
      <a
        href={NEXTDOOR_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackReachout('nextdoor')}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#6dbe45] hover:bg-[#55a032] text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        title="Have feedback or ideas? Message us on Nextdoor!"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 20V9.5L12 4l8 5.5V20h-5v-6h-6v6H4z" /></svg>
        <span className={labelClass}>Message</span>
      </a>
    </>
  );
}

export function FeedbackButton() {
  return (
    <>
      {/* sm and up: floating pills, unchanged behavior */}
      <div
        data-testid="feedback-desktop"
        className="fixed bottom-4 right-4 z-50 print:hidden hidden sm:flex flex-col gap-2 items-end"
      >
        <FeedbackPills />
      </div>
      {/* Mobile: rendered in normal page flow after the page content, so the
          buttons can never cover game controls or cards on small screens. */}
      <div
        data-testid="feedback-mobile"
        className="print:hidden sm:hidden flex justify-center gap-3 px-4 pt-4 pb-10"
      >
        <FeedbackPills showLabels />
      </div>
    </>
  );
}
