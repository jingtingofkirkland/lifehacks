/* ─────────────────── Inline SVG Holiday Stickers ─────────────────── */

export const Stickers: Record<string, (size?: number) => JSX.Element> = {
  fireworks: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="20" r="4" fill="#FF4444"/>
      <line x1="32" y1="20" x2="32" y2="6" stroke="#FF4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="20" y2="10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="44" y2="10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="18" y2="22" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="46" y2="22" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="24" y2="32" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="40" y2="32" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="6" r="2" fill="#FF4444"/>
      <circle cx="20" cy="10" r="2" fill="#FFD700"/>
      <circle cx="44" cy="10" r="2" fill="#FFD700"/>
      <circle cx="18" cy="22" r="2" fill="#FF6B6B"/>
      <circle cx="46" cy="22" r="2" fill="#FF6B6B"/>
      <circle cx="24" cy="32" r="2" fill="#4ECDC4"/>
      <circle cx="40" cy="32" r="2" fill="#4ECDC4"/>
      <circle cx="48" cy="38" r="3" fill="#FFD700"/>
      <line x1="48" y1="38" x2="48" y2="28" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="38" x2="40" y2="32" stroke="#FF69B4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="38" x2="56" y2="32" stroke="#FF69B4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="38" x2="54" y2="46" stroke="#87CEEB" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="38" x2="42" y2="46" stroke="#87CEEB" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  partyHat: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,6 18,50 46,50" fill="#FF6B6B" stroke="#E55555" strokeWidth="1"/>
      <line x1="22" y1="38" x2="42" y2="38" stroke="#FFD700" strokeWidth="2"/>
      <line x1="25" y1="28" x2="39" y2="28" stroke="#4ECDC4" strokeWidth="2"/>
      <line x1="28" y1="18" x2="36" y2="18" stroke="#FF69B4" strokeWidth="2"/>
      <circle cx="32" cy="6" r="3" fill="#FFD700"/>
      <ellipse cx="32" cy="50" rx="16" ry="4" fill="#FF6B6B" stroke="#E55555" strokeWidth="1"/>
      <rect x="12" y="10" width="3" height="3" fill="#FFD700" transform="rotate(30 13 11)"/>
      <rect x="48" y="14" width="3" height="3" fill="#4ECDC4" transform="rotate(-20 49 15)"/>
      <rect x="50" y="8" width="2" height="4" fill="#FF69B4" transform="rotate(45 51 10)"/>
      <rect x="10" y="20" width="2" height="4" fill="#87CEEB" transform="rotate(-30 11 22)"/>
    </svg>
  ),
  dove: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="34" rx="12" ry="8" fill="white" stroke="#CBD5E1" strokeWidth="1"/>
      <circle cx="24" cy="32" r="6" fill="white" stroke="#CBD5E1" strokeWidth="1"/>
      <circle cx="21" cy="31" r="1.2" fill="#334155"/>
      <polygon points="16,32 12,30 12,34" fill="#F59E0B"/>
      <path d="M34 28 Q42 18 52 22 Q46 26 38 30Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8"/>
      <path d="M12 33 Q8 38 6 44" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
      <ellipse cx="7" cy="40" rx="2.5" ry="1.5" fill="#22C55E" transform="rotate(-30 7 40)"/>
      <ellipse cx="9" cy="37" rx="2" ry="1.2" fill="#22C55E" transform="rotate(-50 9 37)"/>
    </svg>
  ),
  flag: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="14" y1="12" x2="14" y2="56" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="14" y="12" width="36" height="8" fill="#EF4444" rx="1"/>
      <rect x="14" y="20" width="36" height="8" fill="white" rx="0"/>
      <rect x="14" y="28" width="36" height="8" fill="#EF4444" rx="1"/>
      <rect x="14" y="12" width="14" height="16" fill="#1E40AF"/>
      <circle cx="17" cy="16" r="0.8" fill="white"/><circle cx="21" cy="16" r="0.8" fill="white"/><circle cx="25" cy="16" r="0.8" fill="white"/>
      <circle cx="17" cy="20" r="0.8" fill="white"/><circle cx="21" cy="20" r="0.8" fill="white"/><circle cx="25" cy="20" r="0.8" fill="white"/>
      <circle cx="17" cy="24" r="0.8" fill="white"/><circle cx="21" cy="24" r="0.8" fill="white"/><circle cx="25" cy="24" r="0.8" fill="white"/>
    </svg>
  ),
  dog: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="34" r="16" fill="#D2A679"/>
      <ellipse cx="18" cy="22" rx="6" ry="10" fill="#B8895A" transform="rotate(-15 18 22)"/>
      <ellipse cx="46" cy="22" rx="6" ry="10" fill="#B8895A" transform="rotate(15 46 22)"/>
      <circle cx="26" cy="32" r="3" fill="white"/><circle cx="38" cy="32" r="3" fill="white"/>
      <circle cx="27" cy="32" r="1.8" fill="#334155"/><circle cx="39" cy="32" r="1.8" fill="#334155"/>
      <circle cx="27.8" cy="31.2" r="0.6" fill="white"/><circle cx="39.8" cy="31.2" r="0.6" fill="white"/>
      <ellipse cx="32" cy="38" rx="3" ry="2.2" fill="#334155"/>
      <path d="M29 40 Q32 44 35 40" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="32" cy="44" rx="2" ry="3" fill="#FF8FA3"/>
      <circle cx="22" cy="38" r="2.5" fill="#FFB3B3" opacity="0.5"/><circle cx="42" cy="38" r="2.5" fill="#FFB3B3" opacity="0.5"/>
    </svg>
  ),
  cat: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="36" r="15" fill="#FFB366"/>
      <polygon points="18,24 14,8 26,20" fill="#FFB366" stroke="#E59A4D" strokeWidth="0.8"/>
      <polygon points="46,24 50,8 38,20" fill="#FFB366" stroke="#E59A4D" strokeWidth="0.8"/>
      <polygon points="19,22 16,12 25,20" fill="#FF8FA3"/><polygon points="45,22 48,12 39,20" fill="#FF8FA3"/>
      <ellipse cx="26" cy="34" rx="3" ry="3.5" fill="#7CC77C"/><ellipse cx="38" cy="34" rx="3" ry="3.5" fill="#7CC77C"/>
      <ellipse cx="26" cy="34" rx="1.5" ry="3.5" fill="#334155"/><ellipse cx="38" cy="34" rx="1.5" ry="3.5" fill="#334155"/>
      <polygon points="32,39 30,41 34,41" fill="#FF8FA3"/>
      <line x1="12" y1="38" x2="24" y2="40" stroke="#C9A064" strokeWidth="0.8"/><line x1="12" y1="42" x2="24" y2="42" stroke="#C9A064" strokeWidth="0.8"/>
      <line x1="40" y1="40" x2="52" y2="38" stroke="#C9A064" strokeWidth="0.8"/><line x1="40" y1="42" x2="52" y2="42" stroke="#C9A064" strokeWidth="0.8"/>
      <path d="M30 42 Q32 44 34 42" stroke="#C9A064" strokeWidth="0.8" fill="none"/>
      <circle cx="22" cy="40" r="2.5" fill="#FFB3B3" opacity="0.4"/><circle cx="42" cy="40" r="2.5" fill="#FFB3B3" opacity="0.4"/>
    </svg>
  ),
  turkey: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="36" cy="20" rx="6" ry="14" fill="#EF4444" transform="rotate(-15 36 20)"/>
      <ellipse cx="32" cy="18" rx="5" ry="14" fill="#F59E0B"/>
      <ellipse cx="28" cy="20" rx="6" ry="14" fill="#22C55E" transform="rotate(15 28 20)"/>
      <ellipse cx="40" cy="22" rx="5" ry="12" fill="#F97316" transform="rotate(-25 40 22)"/>
      <ellipse cx="24" cy="22" rx="5" ry="12" fill="#A855F7" transform="rotate(25 24 22)"/>
      <ellipse cx="32" cy="40" rx="12" ry="10" fill="#92400E"/>
      <circle cx="32" cy="30" r="6" fill="#92400E"/>
      <circle cx="30" cy="29" r="1.5" fill="white"/><circle cx="34" cy="29" r="1.5" fill="white"/>
      <circle cx="30" cy="29" r="0.8" fill="#334155"/><circle cx="34" cy="29" r="0.8" fill="#334155"/>
      <polygon points="32,32 30,34 34,34" fill="#F59E0B"/>
      <path d="M32 34 Q31 38 32 40" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="48" x2="26" y2="54" stroke="#F59E0B" strokeWidth="2"/>
      <line x1="36" y1="48" x2="38" y2="54" stroke="#F59E0B" strokeWidth="2"/>
    </svg>
  ),
  tree: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 18,24 46,24" fill="#16A34A"/>
      <polygon points="32,14 14,34 50,34" fill="#15803D"/>
      <polygon points="32,24 10,46 54,46" fill="#166534"/>
      <rect x="28" y="46" width="8" height="10" fill="#92400E" rx="1"/>
      <polygon points="32,4 33,8 37,8 34,11 35,15 32,12 29,15 30,11 27,8 31,8" fill="#FFD700"/>
      <circle cx="26" cy="22" r="2" fill="#EF4444"/><circle cx="38" cy="22" r="2" fill="#3B82F6"/>
      <circle cx="22" cy="32" r="2" fill="#FFD700"/><circle cx="42" cy="32" r="2" fill="#EF4444"/>
      <circle cx="32" cy="30" r="2" fill="#A855F7"/><circle cx="18" cy="42" r="2" fill="#3B82F6"/>
      <circle cx="46" cy="42" r="2" fill="#FFD700"/><circle cx="32" cy="40" r="2" fill="#22C55E"/>
    </svg>
  ),
  heart: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 54 Q8 34 16 18 Q22 10 32 20 Q42 10 48 18 Q56 34 32 54Z" fill="#EF4444"/>
      <path d="M32 50 Q12 32 18 20 Q22 14 30 22" fill="#FF6B6B" opacity="0.4"/>
    </svg>
  ),
  star: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,6 38,24 56,24 42,36 47,54 32,44 17,54 22,36 8,24 26,24" fill="#FFD700" stroke="#F59E0B" strokeWidth="1"/>
      <polygon points="32,12 36,24 48,24 38,32 42,44 32,36 22,44 26,32 16,24 28,24" fill="#FDE68A" opacity="0.5"/>
    </svg>
  ),
  fist: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="22" y="16" width="20" height="28" rx="4" fill="#92400E"/>
      <rect x="22" y="16" width="5" height="20" rx="2.5" fill="#7C3610" stroke="#6B2E0D" strokeWidth="0.5"/>
      <rect x="27" y="14" width="5" height="22" rx="2.5" fill="#92400E" stroke="#7C3610" strokeWidth="0.5"/>
      <rect x="32" y="16" width="5" height="20" rx="2.5" fill="#92400E" stroke="#7C3610" strokeWidth="0.5"/>
      <rect x="37" y="18" width="5" height="18" rx="2.5" fill="#7C3610" stroke="#6B2E0D" strokeWidth="0.5"/>
      <ellipse cx="20" cy="34" rx="4" ry="6" fill="#A0522D" stroke="#7C3610" strokeWidth="0.5"/>
      <line x1="12" y1="20" x2="16" y2="24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <line x1="48" y1="20" x2="44" y2="24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="6" x2="30" y2="12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  scroll: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="12" width="32" height="40" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2"/>
      <ellipse cx="16" cy="14" rx="4" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1"/>
      <ellipse cx="48" cy="14" rx="4" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1"/>
      <ellipse cx="16" cy="50" rx="4" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1"/>
      <ellipse cx="48" cy="50" rx="4" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1"/>
      <line x1="22" y1="22" x2="42" y2="22" stroke="#D97706" strokeWidth="1.2" opacity="0.5"/>
      <line x1="22" y1="28" x2="42" y2="28" stroke="#D97706" strokeWidth="1.2" opacity="0.5"/>
      <line x1="22" y1="34" x2="38" y2="34" stroke="#D97706" strokeWidth="1.2" opacity="0.5"/>
      <line x1="22" y1="40" x2="42" y2="40" stroke="#D97706" strokeWidth="1.2" opacity="0.5"/>
      <path d="M44 42 Q52 36 54 24" stroke="#1E40AF" strokeWidth="1.2" fill="none"/>
      <polygon points="54,24 56,22 52,20" fill="#1E40AF"/>
    </svg>
  ),
  poppy: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="26" rx="8" ry="10" fill="#EF4444"/>
      <ellipse cx="24" cy="32" rx="8" ry="10" fill="#DC2626" transform="rotate(30 24 32)"/>
      <ellipse cx="40" cy="32" rx="8" ry="10" fill="#DC2626" transform="rotate(-30 40 32)"/>
      <ellipse cx="28" cy="38" rx="7" ry="9" fill="#EF4444" transform="rotate(60 28 38)"/>
      <ellipse cx="36" cy="38" rx="7" ry="9" fill="#EF4444" transform="rotate(-60 36 38)"/>
      <circle cx="32" cy="34" r="5" fill="#1A1A1A"/>
      <circle cx="30" cy="33" r="0.8" fill="#FFD700"/><circle cx="34" cy="33" r="0.8" fill="#FFD700"/><circle cx="32" cy="36" r="0.8" fill="#FFD700"/>
      <line x1="32" y1="42" x2="32" y2="58" stroke="#16A34A" strokeWidth="2.5"/>
    </svg>
  ),
  bunny: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="24" cy="14" rx="5" ry="14" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <ellipse cx="40" cy="14" rx="5" ry="14" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <ellipse cx="24" cy="14" rx="2.5" ry="10" fill="#FFB3B3"/><ellipse cx="40" cy="14" rx="2.5" ry="10" fill="#FFB3B3"/>
      <circle cx="32" cy="38" r="16" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <circle cx="26" cy="34" r="2.5" fill="#334155"/><circle cx="38" cy="34" r="2.5" fill="#334155"/>
      <circle cx="27" cy="33" r="0.8" fill="white"/><circle cx="39" cy="33" r="0.8" fill="white"/>
      <ellipse cx="32" cy="40" rx="2" ry="1.5" fill="#FFB3B3"/>
      <path d="M30 42 Q32 45 34 42" stroke="#CCCCCC" strokeWidth="1" fill="none"/>
      <circle cx="22" cy="40" r="3" fill="#FFB3B3" opacity="0.4"/><circle cx="42" cy="40" r="3" fill="#FFB3B3" opacity="0.4"/>
    </svg>
  ),
  /* ─────── Additional Stickers ─────── */
  snowman: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="44" r="14" fill="white" stroke="#CBD5E1" strokeWidth="1"/>
      <circle cx="32" cy="24" r="10" fill="white" stroke="#CBD5E1" strokeWidth="1"/>
      <circle cx="28" cy="22" r="1.5" fill="#334155"/><circle cx="36" cy="22" r="1.5" fill="#334155"/>
      <polygon points="32,26 38,28 32,28" fill="#F97316"/>
      <path d="M28 30 Q32 33 36 30" stroke="#334155" strokeWidth="0.8" fill="none"/>
      <rect x="22" y="14" width="20" height="4" rx="1" fill="#334155"/>
      <rect x="26" y="8" width="12" height="8" rx="1" fill="#334155"/>
      <circle cx="32" cy="38" r="1.5" fill="#334155"/><circle cx="32" cy="44" r="1.5" fill="#334155"/><circle cx="32" cy="50" r="1.5" fill="#334155"/>
      <line x1="18" y1="30" x2="10" y2="22" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
      <line x1="46" y1="30" x2="54" y2="22" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
      <rect x="26" y="34" width="12" height="2" rx="1" fill="#EF4444"/>
    </svg>
  ),
  pumpkin: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="38" rx="18" ry="16" fill="#F97316"/>
      <ellipse cx="24" cy="38" rx="10" ry="16" fill="#FB923C" opacity="0.5"/>
      <ellipse cx="40" cy="38" rx="10" ry="16" fill="#EA580C" opacity="0.3"/>
      <path d="M32 22 Q30 14 28 10" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="36" cy="16" rx="4" ry="2.5" fill="#22C55E" transform="rotate(30 36 16)"/>
      <polygon points="26,34 28,38 24,38" fill="#1A1A1A"/><polygon points="38,34 40,38 36,38" fill="#1A1A1A"/>
      <path d="M26 44 L28 42 L30 44 L32 42 L34 44 L36 42 L38 44" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  gift: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="28" width="40" height="28" rx="3" fill="#EF4444"/>
      <rect x="12" y="22" width="40" height="10" rx="3" fill="#DC2626"/>
      <rect x="29" y="22" width="6" height="34" fill="#FFD700"/>
      <rect x="12" y="25" width="40" height="6" fill="#FFD700" opacity="0.0"/>
      <line x1="12" y1="28" x2="52" y2="28" stroke="#FFD700" strokeWidth="4"/>
      <path d="M32 22 Q26 14 20 18 Q16 22 24 22" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M32 22 Q38 14 44 18 Q48 22 40 22" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  sun: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="12" fill="#FBBF24"/>
      <circle cx="32" cy="32" r="10" fill="#FDE68A"/>
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a} x1={32 + 14 * Math.cos(a * Math.PI / 180)} y1={32 + 14 * Math.sin(a * Math.PI / 180)} x2={32 + 22 * Math.cos(a * Math.PI / 180)} y2={32 + 22 * Math.sin(a * Math.PI / 180)} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>
      ))}
      <circle cx="28" cy="30" r="1.5" fill="#92400E"/><circle cx="36" cy="30" r="1.5" fill="#92400E"/>
      <path d="M28 36 Q32 40 36 36" stroke="#92400E" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  rainbow: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 48 A24 24 0 0 1 56 48" stroke="#EF4444" strokeWidth="4" fill="none"/>
      <path d="M12 48 A20 20 0 0 1 52 48" stroke="#F97316" strokeWidth="4" fill="none"/>
      <path d="M16 48 A16 16 0 0 1 48 48" stroke="#FBBF24" strokeWidth="4" fill="none"/>
      <path d="M20 48 A12 12 0 0 1 44 48" stroke="#22C55E" strokeWidth="4" fill="none"/>
      <path d="M24 48 A8 8 0 0 1 40 48" stroke="#3B82F6" strokeWidth="4" fill="none"/>
      <path d="M28 48 A4 4 0 0 1 36 48" stroke="#8B5CF6" strokeWidth="4" fill="none"/>
      <circle cx="10" cy="50" r="4" fill="white"/><circle cx="14" cy="48" r="3" fill="white"/><circle cx="6" cy="48" r="3" fill="white"/>
      <circle cx="54" cy="50" r="4" fill="white"/><circle cx="50" cy="48" r="3" fill="white"/><circle cx="58" cy="48" r="3" fill="white"/>
    </svg>
  ),
  balloon: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="24" cy="22" rx="10" ry="14" fill="#EF4444"/>
      <path d="M24 36 L24 54" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2"/>
      <polygon points="24,36 22,38 26,38" fill="#EF4444"/>
      <ellipse cx="40" cy="18" rx="8" ry="12" fill="#3B82F6"/>
      <path d="M40 30 L38 54" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2"/>
      <polygon points="40,30 38,32 42,32" fill="#3B82F6"/>
      <ellipse cx="32" cy="24" rx="9" ry="13" fill="#22C55E"/>
      <path d="M32 37 L32 54" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2"/>
      <polygon points="32,37 30,39 34,39" fill="#22C55E"/>
      <ellipse cx="22" cy="20" rx="3" ry="4" fill="white" opacity="0.3"/>
      <ellipse cx="38" cy="16" rx="2.5" ry="3.5" fill="white" opacity="0.3"/>
      <ellipse cx="30" cy="22" rx="2.5" ry="4" fill="white" opacity="0.3"/>
    </svg>
  ),
  cake: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="14" y="32" width="36" height="22" rx="4" fill="#FBBF24"/>
      <rect x="14" y="32" width="36" height="8" rx="4" fill="#F472B6"/>
      <path d="M14 40 Q22 36 32 40 Q42 44 50 40" stroke="white" strokeWidth="2" fill="none"/>
      <rect x="30" y="18" width="4" height="14" rx="1" fill="#FFD700"/>
      <ellipse cx="32" cy="14" rx="3" ry="5" fill="#F97316"/>
      <ellipse cx="32" cy="12" rx="2" ry="3" fill="#FBBF24"/>
      <circle cx="32" cy="10" r="1.5" fill="#FDE68A"/>
      <circle cx="22" cy="34" r="2" fill="#EF4444"/><circle cx="32" cy="34" r="2" fill="#22C55E"/><circle cx="42" cy="34" r="2" fill="#3B82F6"/>
    </svg>
  ),
  clover: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="26" cy="22" r="10" fill="#22C55E"/>
      <circle cx="38" cy="22" r="10" fill="#16A34A"/>
      <circle cx="22" cy="34" r="10" fill="#16A34A"/>
      <circle cx="42" cy="34" r="10" fill="#22C55E"/>
      <path d="M32 32 L36 54" stroke="#15803D" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="28" cy="20" r="3" fill="#4ADE80" opacity="0.4"/>
      <circle cx="40" cy="20" r="3" fill="#4ADE80" opacity="0.3"/>
    </svg>
  ),
  umbrella: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 32 A24 24 0 0 1 56 32 L32 32Z" fill="#EF4444"/>
      <path d="M8 32 A24 24 0 0 1 24 10" fill="#DC2626"/>
      <path d="M24 32 A12 20 0 0 1 32 10" fill="#F87171" opacity="0.5"/>
      <line x1="32" y1="12" x2="32" y2="52" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 52 Q32 56 36 56" stroke="#92400E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="8" r="1.5" fill="#3B82F6"/><circle cx="44" cy="6" r="1" fill="#3B82F6"/>
      <circle cx="12" cy="14" r="1" fill="#3B82F6"/><circle cx="50" cy="12" r="1.5" fill="#3B82F6"/>
    </svg>
  ),
  snowflake: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="32" y1="6" x2="32" y2="58" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="9" y1="19" x2="55" y2="45" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="9" y1="45" x2="55" y2="19" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="14" x2="27" y2="10" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="14" x2="37" y2="10" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="50" x2="27" y2="54" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="50" x2="37" y2="54" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="24" x2="12" y2="20" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="24" x2="12" y2="28" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="40" x2="52" y2="36" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="40" x2="52" y2="44" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="40" x2="12" y2="44" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="40" x2="12" y2="36" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="24" x2="52" y2="28" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="24" x2="52" y2="20" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="4" fill="#BFDBFE"/>
    </svg>
  ),
};
