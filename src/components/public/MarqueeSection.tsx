import React from 'react';

export const MarqueeSection: React.FC = () => {
  const items = [
    'CUSTOM BRANDING',
    '✦',
    '500ML',
    '✦',
    '1L',
    '✦',
    'RESTAURANTS',
    '✦',
    'CAFÉS',
    '✦',
    'HOTELS',
    '✦',
    'EVENTS',
    '✦',
    'CORPORATE',
    '✦',
    'CUSTOM LABELS',
    '✦',
    'WATERPROOF BOPP',
    '✦',
    'LOW 300 MOQ',
    '✦',
    '48H DISPATCH',
    '✦',
  ];

  return (
    <div className="relative overflow-hidden py-5 bg-[#0B0E23] border-y border-white/10 select-none z-20">
      {/* Edge gradient fade */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
        {/* Repeated twice for seamless infinite loop */}
        {[...items, ...items].map((text, idx) => (
          <span
            key={idx}
            className={`font-syne font-black tracking-wider uppercase text-base sm:text-xl lg:text-2xl transition-colors ${
              text === '✦'
                ? 'text-[#BD00FF] shadow-sm'
                : 'text-white hover:text-[#00F0FF]'
            }`}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
