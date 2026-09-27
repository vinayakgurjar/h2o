import React from 'react';

interface MlueLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only' | 'horizontal';
}

export const MlueLogo: React.FC<MlueLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'horizontal',
}) => {
  // Dimensions based on size
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 56, h: 56 },
    xl: { w: 80, h: 80 },
  }[size];

  const textSize = {
    sm: { title: 'text-xl', tag: 'text-[9px]' },
    md: { title: 'text-2xl', tag: 'text-[11px]' },
    lg: { title: 'text-3xl', tag: 'text-xs' },
    xl: { title: 'text-5xl', tag: 'text-sm' },
  }[size];

  // SVG Icon representing the MLUE fish, bottle, and water tank badge
  const LogoIcon = (
    <svg
      width={iconDimensions.w}
      height={iconDimensions.h}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      {/* Outer rounded container in brand button blue #1280d6 */}
      <rect x="8" y="10" width="84" height="80" rx="14" fill="#1280d6" />

      {/* Water Wave surface cut */}
      <path
        d="M 8 36 C 22 28, 32 40, 50 34 C 65 30, 78 38, 92 34 L 92 90 L 8 90 Z"
        fill="#0d6bb8"
        opacity="0.35"
      />

      {/* Bubbles */}
      <circle cx="28" cy="46" r="2.5" fill="#e3d3ff" opacity="0.9" />
      <circle cx="48" cy="40" r="3" fill="#e3d3ff" opacity="0.9" />
      <circle cx="72" cy="52" r="2.2" fill="#e3d3ff" opacity="0.8" />
      <circle cx="58" cy="74" r="2.5" fill="#e3d3ff" opacity="0.9" />

      {/* Little Swimming Fish (swimming left towards fresh hydration) */}
      <g transform="translate(18, 48)">
        {/* Tail fin */}
        <path
          d="M 12 11 L 3 4 C 5 8, 5 14, 3 18 Z"
          fill="#e3d3ff"
        />
        {/* Fish Body */}
        <ellipse cx="22" cy="11" rx="11" ry="8.5" fill="#e3d3ff" />
        {/* Dorsal fin */}
        <path d="M 20 2.5 Q 24 1 27 3.5 Z" fill="#e3d3ff" />
        {/* Fish eye */}
        <circle cx="28" cy="9.5" r="1.4" fill="#1280d6" />
      </g>

      {/* Angled Water Bottle Dipping In from top-right */}
      <g transform="translate(52, 10) rotate(34)">
        {/* Bottle Cap */}
        <rect x="10" y="2" width="8" height="4.5" rx="1.2" fill="#e3d3ff" />
        {/* Bottle Neck */}
        <rect x="11.5" y="6.5" width="5" height="4" fill="#e3d3ff" />
        {/* Bottle Body */}
        <rect x="8" y="10.5" width="12" height="24" rx="3.5" fill="#ffffff" />
        {/* Label on tilted bottle */}
        <rect x="8" y="16" width="12" height="10" fill="#1280d6" opacity="0.8" />
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'full') {
    // Stacked full badge like the logo image
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {LogoIcon}
        <span
          className={`font-black tracking-tight mt-2 lowercase ${textSize.title}`}
          style={{ color: '#006998', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          mlue
        </span>
        {showTagline && (
          <span
            className={`font-semibold tracking-wider uppercase mt-0.5 ${textSize.tag}`}
            style={{ color: '#003940' }}
          >
            Every Bottle Tells Your Story.
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (ideal for Navbar, headers, and footer cards)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center text-left">
        <span
          className={`font-black tracking-tight leading-none lowercase ${textSize.title}`}
          style={{ color: '#006998' }}
        >
          mlue
        </span>
        {showTagline && (
          <span
            className={`font-semibold tracking-wide text-[10px] sm:text-[11px] leading-tight mt-0.5 ${textSize.tag}`}
            style={{ color: '#003940' }}
          >
            Every Bottle Tells Your Story.
          </span>
        )}
      </div>
    </div>
  );
};
