'use client';

export function FeedbackButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      <a
        href="https://www.facebook.com/profile.php?id=61551909728667"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
            (window as any).fbq('trackCustom', 'Reachout');
          }
        }}
        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        title="Have feedback or ideas? Leave a comment or review on our FB page!"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/></svg>
        <span className="hidden sm:inline">Feedback &amp; Ideas</span>
      </a>
    </div>
  );
}
