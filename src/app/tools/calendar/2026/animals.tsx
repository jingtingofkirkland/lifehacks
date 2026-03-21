/* ─────────── Cute cartoon animals + puppy photos for empty calendar cells ─────────── */
/* Puppies are placed at every 3rd index (0,3,6,9,12,15) so that no two puppies
   are 7 positions apart — preventing vertical adjacency in the calendar grid.
   Each puppy type appears 2×, each SVG animal appears 1×. */

const MiniAnimals: ((s?: number) => JSX.Element)[] = [
  // [0] dog sketch (PNG)
  (s = 24) => (
    <img src="/dog_sketch.png" alt="" width={s} height={s} style={{ objectFit: 'contain' }} />
  ),
  // [1] sleeping cat
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="32" rx="14" ry="8" fill="#FFB366"/>
      <circle cx="16" cy="28" r="5" fill="#FFB366"/>
      <polygon points="12,24 10,16 16,22" fill="#FFB366"/><polygon points="20,24 22,16 16,22" fill="#FFB366"/>
      <polygon points="12.5,23 11,18 15.5,22" fill="#FF8FA3"/><polygon points="19.5,23 21,18 16.5,22" fill="#FF8FA3"/>
      <path d="M14 28 Q16 26 18 28" stroke="#334155" strokeWidth="0.8" fill="none"/>
      <ellipse cx="16" cy="29.5" rx="1.2" ry="0.8" fill="#FF8FA3"/>
      <path d="M36 30 Q38 28 38 32" stroke="#FFB366" strokeWidth="2" strokeLinecap="round"/>
      <path d="M38 32 Q40 30 40 34" stroke="#FFB366" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // [2] happy puppy (SVG)
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="12" fill="#D2A679"/>
      <ellipse cx="14" cy="18" rx="4" ry="8" fill="#B8895A" transform="rotate(-10 14 18)"/>
      <ellipse cx="34" cy="18" rx="4" ry="8" fill="#B8895A" transform="rotate(10 34 18)"/>
      <circle cx="20" cy="24" r="2" fill="white"/><circle cx="28" cy="24" r="2" fill="white"/>
      <circle cx="20.5" cy="24" r="1.2" fill="#334155"/><circle cx="28.5" cy="24" r="1.2" fill="#334155"/>
      <ellipse cx="24" cy="28" rx="2" ry="1.5" fill="#334155"/>
      <path d="M22 30 Q24 33 26 30" stroke="#334155" strokeWidth="0.8" fill="none"/>
      <ellipse cx="24" cy="33" rx="1.5" ry="2" fill="#FF8FA3"/>
      <circle cx="17" cy="28" r="2" fill="#FFB3B3" opacity="0.4"/><circle cx="31" cy="28" r="2" fill="#FFB3B3" opacity="0.4"/>
    </svg>
  ),
  // [3] puppy in the park (JPG)
  (s = 24) => (
    <img src="/puppy_park.jpg" alt="" width={s} height={s} style={{ objectFit: 'contain', borderRadius: '4px' }} />
  ),
  // [4] chick
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="28" r="12" fill="#FDE68A"/><circle cx="24" cy="18" r="8" fill="#FDE68A"/>
      <circle cx="21" cy="16" r="1.5" fill="#334155"/><circle cx="27" cy="16" r="1.5" fill="#334155"/>
      <circle cx="21.5" cy="15.5" r="0.5" fill="white"/><circle cx="27.5" cy="15.5" r="0.5" fill="white"/>
      <polygon points="24,19 22,21 26,21" fill="#F59E0B"/>
      <circle cx="18" cy="18" r="2" fill="#FFB3B3" opacity="0.4"/><circle cx="30" cy="18" r="2" fill="#FFB3B3" opacity="0.4"/>
      <path d="M14 28 Q10 24 12 20" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M34 28 Q38 24 36 20" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // [5] panda
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="13" fill="white" stroke="#E5E7EB" strokeWidth="0.5"/>
      <circle cx="16" cy="16" r="5" fill="#334155"/><circle cx="32" cy="16" r="5" fill="#334155"/>
      <ellipse cx="18" cy="24" rx="4" ry="4.5" fill="#334155"/><ellipse cx="30" cy="24" rx="4" ry="4.5" fill="#334155"/>
      <circle cx="18" cy="24" r="2" fill="white"/><circle cx="30" cy="24" r="2" fill="white"/>
      <circle cx="18.5" cy="24" r="1" fill="#334155"/><circle cx="30.5" cy="24" r="1" fill="#334155"/>
      <ellipse cx="24" cy="29" rx="2" ry="1.3" fill="#334155"/>
      <path d="M22 30.5 Q24 32.5 26 30.5" stroke="#334155" strokeWidth="0.6" fill="none"/>
      <circle cx="15" cy="28" r="2" fill="#FFB3B3" opacity="0.3"/><circle cx="33" cy="28" r="2" fill="#FFB3B3" opacity="0.3"/>
    </svg>
  ),
  // [6] beige puppy (JPG)
  (s = 24) => (
    <img src="/puppy_beige.jpg" alt="" width={s} height={s} style={{ objectFit: 'contain', borderRadius: '4px' }} />
  ),
  // [7] penguin
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="28" rx="11" ry="14" fill="#334155"/><ellipse cx="24" cy="30" rx="7" ry="10" fill="white"/>
      <circle cx="20" cy="22" r="1.8" fill="white"/><circle cx="28" cy="22" r="1.8" fill="white"/>
      <circle cx="20.5" cy="22" r="1" fill="#334155"/><circle cx="28.5" cy="22" r="1" fill="#334155"/>
      <polygon points="24,25 22,28 26,28" fill="#F59E0B"/>
      <path d="M13 26 Q8 30 12 36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M35 26 Q40 30 36 36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="21" cy="40" rx="3" ry="1.5" fill="#F59E0B"/><ellipse cx="27" cy="40" rx="3" ry="1.5" fill="#F59E0B"/>
    </svg>
  ),
  // [8] fox
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="28" r="12" fill="#F97316"/>
      <polygon points="14,22 8,8 20,18" fill="#F97316"/><polygon points="34,22 40,8 28,18" fill="#F97316"/>
      <polygon points="14.5,21 10,12 19,18" fill="#FDE68A"/><polygon points="33.5,21 38,12 29,18" fill="#FDE68A"/>
      <circle cx="20" cy="26" r="2" fill="white"/><circle cx="28" cy="26" r="2" fill="white"/>
      <circle cx="20.5" cy="26" r="1.2" fill="#334155"/><circle cx="28.5" cy="26" r="1.2" fill="#334155"/>
      <ellipse cx="24" cy="30" rx="1.5" ry="1" fill="#334155"/>
      <ellipse cx="24" cy="32" rx="5" ry="3" fill="white"/>
      <path d="M22 32 Q24 34 26 32" stroke="#334155" strokeWidth="0.6" fill="none"/>
    </svg>
  ),
  // [9] dog sketch (PNG) — second appearance
  (s = 24) => (
    <img src="/dog_sketch.png" alt="" width={s} height={s} style={{ objectFit: 'contain' }} />
  ),
  // [10] bear
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="14" cy="16" r="5" fill="#92400E"/><circle cx="34" cy="16" r="5" fill="#92400E"/>
      <circle cx="14" cy="16" r="3" fill="#B8895A"/><circle cx="34" cy="16" r="3" fill="#B8895A"/>
      <circle cx="24" cy="28" r="14" fill="#92400E"/>
      <circle cx="20" cy="24" r="2" fill="#334155"/><circle cx="28" cy="24" r="2" fill="#334155"/>
      <circle cx="20.7" cy="23.5" r="0.6" fill="white"/><circle cx="28.7" cy="23.5" r="0.6" fill="white"/>
      <ellipse cx="24" cy="30" rx="5" ry="4" fill="#B8895A"/>
      <ellipse cx="24" cy="29" rx="2" ry="1.3" fill="#334155"/>
      <path d="M22 31 Q24 33 26 31" stroke="#334155" strokeWidth="0.7" fill="none"/>
    </svg>
  ),
  // [11] owl
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="28" rx="13" ry="14" fill="#92400E"/>
      <polygon points="16,16 12,6 20,14" fill="#92400E"/><polygon points="32,16 36,6 28,14" fill="#92400E"/>
      <circle cx="19" cy="24" r="5" fill="white"/><circle cx="29" cy="24" r="5" fill="white"/>
      <circle cx="19" cy="24" r="2.5" fill="#334155"/><circle cx="29" cy="24" r="2.5" fill="#334155"/>
      <circle cx="19.8" cy="23.2" r="0.8" fill="white"/><circle cx="29.8" cy="23.2" r="0.8" fill="white"/>
      <polygon points="24,28 22,30 26,30" fill="#F59E0B"/>
      <path d="M18 34 Q24 38 30 34" stroke="#78350F" strokeWidth="1" fill="none"/>
    </svg>
  ),
  // [12] puppy in the park (JPG) — second appearance
  (s = 24) => (
    <img src="/puppy_park.jpg" alt="" width={s} height={s} style={{ objectFit: 'contain', borderRadius: '4px' }} />
  ),
  // [13] koala
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="14" cy="20" r="7" fill="#94A3B8"/><circle cx="34" cy="20" r="7" fill="#94A3B8"/>
      <circle cx="14" cy="20" r="4" fill="#CBD5E1"/><circle cx="34" cy="20" r="4" fill="#CBD5E1"/>
      <circle cx="24" cy="28" r="13" fill="#94A3B8"/>
      <circle cx="20" cy="26" r="2" fill="#334155"/><circle cx="28" cy="26" r="2" fill="#334155"/>
      <circle cx="20.6" cy="25.4" r="0.6" fill="white"/><circle cx="28.6" cy="25.4" r="0.6" fill="white"/>
      <ellipse cx="24" cy="32" rx="4" ry="3" fill="#CBD5E1"/>
      <ellipse cx="24" cy="31" rx="2.5" ry="1.5" fill="#334155"/>
    </svg>
  ),
  // [14] bunny
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="20" cy="12" rx="3.5" ry="10" fill="white" stroke="#E5E7EB" strokeWidth="0.8"/>
      <ellipse cx="28" cy="12" rx="3.5" ry="10" fill="white" stroke="#E5E7EB" strokeWidth="0.8"/>
      <ellipse cx="20" cy="12" rx="1.8" ry="7" fill="#FFB3B3"/><ellipse cx="28" cy="12" rx="1.8" ry="7" fill="#FFB3B3"/>
      <circle cx="24" cy="28" r="12" fill="white" stroke="#E5E7EB" strokeWidth="0.8"/>
      <circle cx="20" cy="26" r="1.8" fill="#334155"/><circle cx="28" cy="26" r="1.8" fill="#334155"/>
      <ellipse cx="24" cy="30" rx="1.5" ry="1" fill="#FFB3B3"/>
      <path d="M22 32 Q24 34 26 32" stroke="#CCCCCC" strokeWidth="0.7" fill="none"/>
      <circle cx="17" cy="30" r="2.5" fill="#FFB3B3" opacity="0.3"/><circle cx="31" cy="30" r="2.5" fill="#FFB3B3" opacity="0.3"/>
    </svg>
  ),
  // [15] beige puppy (JPG) — second appearance
  (s = 24) => (
    <img src="/puppy_beige.jpg" alt="" width={s} height={s} style={{ objectFit: 'contain', borderRadius: '4px' }} />
  ),
  // [16] whale
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="28" rx="16" ry="10" fill="#3B82F6"/>
      <ellipse cx="24" cy="30" rx="12" ry="6" fill="#60A5FA" opacity="0.4"/>
      <circle cx="14" cy="26" r="1.5" fill="white"/><circle cx="14.5" cy="26" r="0.8" fill="#334155"/>
      <path d="M38 24 Q44 18 42 28" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M18 32 Q20 34 22 32" stroke="#334155" strokeWidth="0.8" fill="none"/>
      <ellipse cx="22" cy="18" rx="1.5" ry="3" fill="#60A5FA" opacity="0.6"/>
      <line x1="22" y1="15" x2="20" y2="10" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="15" x2="24" y2="10" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // [17] duck
  (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="26" cy="32" rx="14" ry="10" fill="#FDE68A"/>
      <circle cx="16" cy="22" r="8" fill="#FDE68A"/>
      <circle cx="14" cy="20" r="1.5" fill="#334155"/>
      <circle cx="14.5" cy="19.5" r="0.5" fill="white"/>
      <path d="M8 24 L6 22 L6 26Z" fill="#F97316"/>
      <path d="M38 28 Q42 32 38 36" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="24" r="2" fill="#FFB3B3" opacity="0.3"/>
    </svg>
  ),
];

/** Deterministic pick — same animal always appears on the same cell */
export function pickAnimal(month: number, day: number): (s?: number) => JSX.Element {
  return MiniAnimals[(month * 31 + day) % MiniAnimals.length];
}
