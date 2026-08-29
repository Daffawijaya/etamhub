/**
 * Flaticon-style medal badge icons.
 * Custom SVG icons matching the Flaticon medal aesthetic.
 */

export function SeedlingIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="seedling-grad" x1="200" y1="80" x2="320" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M256 480V240" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M256 300C200 300 140 260 140 200C140 200 200 180 256 240" fill="url(#seedling-grad)" />
      <path d="M200 250C180 230 170 210 170 200" stroke="#16A34A" strokeWidth="3" opacity="0.5" />
      {/* Right leaf */}
      <path d="M256 240C312 240 372 200 372 140C372 140 312 120 256 180" fill="#4ADE80" />
      <path d="M312 190C332 170 342 150 342 140" stroke="#16A34A" strokeWidth="3" opacity="0.5" />
      {/* Pot */}
      <path d="M200 460H312L296 480H216L200 460Z" fill="#92400E" />
      <rect x="192" y="452" width="128" height="12" rx="4" fill="#A16207" />
    </svg>
  );
}

export function SilverMedalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silver-body" x1="160" y1="80" x2="352" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="40%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="silver-rim" x1="140" y1="60" x2="372" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="ribbon-left" x1="180" y1="340" x2="220" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="ribbon-right" x1="292" y1="340" x2="332" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* Ribbon left */}
      <path d="M180 340L160 480L228 440L256 380" fill="url(#ribbon-left)" />
      {/* Ribbon right */}
      <path d="M332 340L352 480L284 440L256 380" fill="url(#ribbon-right)" />
      {/* Medal outer ring */}
      <circle cx="256" cy="220" r="170" fill="url(#silver-rim)" />
      {/* Medal body */}
      <circle cx="256" cy="220" r="152" fill="url(#silver-body)" />
      {/* Inner ring */}
      <circle cx="256" cy="220" r="120" fill="none" stroke="#94A3B8" strokeWidth="3" opacity="0.4" />
      {/* Number 1 */}
      <text x="256" y="240" textAnchor="middle" fill="#475569" fontSize="100" fontWeight="bold" fontFamily="Arial, sans-serif">1</text>
      {/* Shine */}
      <ellipse cx="210" cy="160" rx="50" ry="25" fill="white" opacity="0.35" transform="rotate(-20 210 160)" />
      <ellipse cx="200" cy="145" rx="20" ry="10" fill="white" opacity="0.25" transform="rotate(-20 200 145)" />
    </svg>
  );
}

export function GoldMedalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold-body" x1="160" y1="80" x2="352" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="gold-rim" x1="140" y1="60" x2="372" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="gold-ribbon-left" x1="180" y1="340" x2="220" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="gold-ribbon-right" x1="292" y1="340" x2="332" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* Ribbon left */}
      <path d="M180 340L160 480L228 440L256 380" fill="url(#gold-ribbon-left)" />
      {/* Ribbon right */}
      <path d="M332 340L352 480L284 440L256 380" fill="url(#gold-ribbon-right)" />
      {/* Medal outer ring */}
      <circle cx="256" cy="220" r="170" fill="url(#gold-rim)" />
      {/* Medal body */}
      <circle cx="256" cy="220" r="152" fill="url(#gold-body)" />
      {/* Inner ring */}
      <circle cx="256" cy="220" r="120" fill="none" stroke="#D97706" strokeWidth="3" opacity="0.4" />
      {/* Star */}
      <path d="M256 120L280 185H350L294 225L314 290L256 252L198 290L218 225L162 185H232L256 120Z" fill="#92400E" opacity="0.7" />
      {/* Shine */}
      <ellipse cx="210" cy="160" rx="50" ry="25" fill="white" opacity="0.35" transform="rotate(-20 210 160)" />
      <ellipse cx="200" cy="145" rx="20" ry="10" fill="white" opacity="0.25" transform="rotate(-20 200 145)" />
    </svg>
  );
}

export function DiamondIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diamond-grad" x1="120" y1="80" x2="392" y2="432" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Diamond shape */}
      <path d="M256 32L480 200L256 480L32 200L256 32Z" fill="url(#diamond-grad)" />
      {/* Facet highlights */}
      <path d="M256 32L480 200H256V32Z" fill="#93C5FD" opacity="0.5" />
      <path d="M256 32L32 200H256V32Z" fill="#60A5FA" opacity="0.3" />
      <path d="M32 200L256 480V200H32Z" fill="#1E40AF" opacity="0.3" />
      <path d="M480 200L256 480V200H480Z" fill="#2563EB" opacity="0.4" />
      {/* Center line */}
      <path d="M32 200H480" stroke="#1E3A8A" strokeWidth="3" opacity="0.3" />
      {/* Sparkle */}
      <circle cx="200" cy="180" r="12" fill="white" opacity="0.6" />
      <circle cx="220" cy="160" r="6" fill="white" opacity="0.4" />
    </svg>
  );
}
