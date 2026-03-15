'use client';

export function FeedbackButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden flex flex-col gap-2 items-end">
      <a
        href="mailto:austinhao2018@gmail.com?subject=Feedback%20for%20Great%20Seattle%20Life%20Hacks"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
            (window as any).fbq('trackCustom', 'Reachout', { channel: 'email' });
          }
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        title="Email us your feedback or ideas!"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
        <span className="hidden sm:inline">Email Us</span>
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=61551909728667"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
            (window as any).fbq('trackCustom', 'Reachout', { channel: 'facebook' });
          }
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        title="Have feedback or ideas? Leave a comment or review on our FB page!"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/></svg>
        <span className="hidden sm:inline">Feedback &amp; Ideas</span>
      </a>
    </div>
  );
}
