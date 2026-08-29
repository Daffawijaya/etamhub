/**
 * Flaticon-style medal badge icons.
 * Custom SVG icons matching the Flaticon diamond/coin aesthetic.
 */

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

export function CoinIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coin-grad" x1="100" y1="100" x2="412" y2="412" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="coin-inner" x1="160" y1="160" x2="352" y2="352" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      {/* Outer circle */}
      <circle cx="256" cy="256" r="230" fill="url(#coin-grad)" stroke="#B45309" strokeWidth="8" />
      {/* Inner circle */}
      <circle cx="256" cy="256" r="180" fill="url(#coin-inner)" stroke="#D97706" strokeWidth="4" />
      {/* Star in center */}
      <path
        d="M256 120L280 200H360L296 248L320 328L256 280L192 328L216 248L152 200H232L256 120Z"
        fill="#B45309"
        opacity="0.8"
      />
      {/* Shine */}
      <ellipse cx="200" cy="180" rx="40" ry="20" fill="white" opacity="0.25" transform="rotate(-30 200 180)" />
    </svg>
  );
}

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

export function TrophyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophy-grad" x1="160" y1="60" x2="352" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <path d="M160 80H352V160C352 260 308 320 256 340C204 320 160 260 160 160V80Z" fill="url(#trophy-grad)" />
      {/* Cup rim */}
      <rect x="148" y="68" width="216" height="16" rx="8" fill="#FBBF24" />
      {/* Left handle */}
      <path d="M160 120H120C100 120 80 140 80 160C80 200 100 220 120 220H160" stroke="#D97706" strokeWidth="12" fill="none" />
      {/* Right handle */}
      <path d="M352 120H392C412 120 432 140 432 160C432 200 412 220 392 220H352" stroke="#D97706" strokeWidth="12" fill="none" />
      {/* Base */}
      <rect x="232" y="340" width="48" height="40" fill="#B45309" />
      <rect x="200" y="376" width="112" height="16" rx="4" fill="#92400E" />
      {/* Star */}
      <path d="M256 140L268 170H300L274 188L284 218L256 200L228 218L238 188L212 170H244L256 140Z" fill="#FDE68A" opacity="0.8" />
      {/* Shine */}
      <ellipse cx="210" cy="130" rx="20" ry="30" fill="white" opacity="0.2" transform="rotate(-15 210 130)" />
    </svg>
  );
}
