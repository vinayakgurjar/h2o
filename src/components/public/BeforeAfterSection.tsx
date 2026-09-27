import React, { useState, useRef, useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';
import { ArrowRight, Sparkles, X, Check } from 'lucide-react';

interface BeforeAfterProps {
  onMakeItYours: () => void;
}

export const BeforeAfterSection: React.FC<BeforeAfterProps> = ({ onMakeItYours }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
    trackEvent('before_after_slider_drag', { pos: sliderPos });
  };

  return (
    <section id="comparison" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 cyber-grid relative overflow-hidden">
      
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-[#BD00FF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0B0E23] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="uppercase tracking-wider">SIDE-BY-SIDE REALITY CHECK</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-syne uppercase">
            WHY SERVE A GENERIC BOTTLE?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Your table is already a branding opportunity. Stop giving free advertising to grocery brands while serving gourmet cuisine.
          </p>
        </div>

        {/* Draggable Interactive Comparison Module */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleClick}
          className="relative w-full h-[420px] sm:h-[500px] rounded-3xl overflow-hidden glass-cyber border border-white/15 cursor-ew-resize select-none shadow-2xl"
        >
          {/* RIGHT SIDE: "YOUR BRAND" (Full background base) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#0B0E23] to-[#1A0D33] flex items-center justify-center p-8">
            <div className="flex flex-col items-center text-center space-y-4 max-w-md ml-auto sm:mr-12">
              <div className="px-3.5 py-1 rounded-full bg-[#BD00FF]/20 border border-[#BD00FF]/50 text-[#BD00FF] font-black text-xs uppercase tracking-widest font-space">
                YOUR BRAND (THE UPGRADE)
              </div>

              {/* Graphic Mockup Bottle Container */}
              <div className="w-48 h-72 rounded-3xl bg-gradient-to-b from-[#151B3B] to-[#050505] border-2 border-[#BD00FF]/60 shadow-[0_0_40px_rgba(189,0,255,0.35)] flex flex-col justify-between p-4 relative overflow-hidden">
                <div className="w-8 h-3 rounded-t-md bg-[#BD00FF] mx-auto" />
                <div className="text-center space-y-1 my-auto">
                  <div className="text-2xl font-black font-syne text-white tracking-wider uppercase">
                    YOUR CAFÉ
                  </div>
                  <div className="text-[9px] font-space text-[#00F0FF] uppercase tracking-widest">
                    ARTISAN DINING
                  </div>
                  <div className="w-8 h-0.5 bg-[#BD00FF] mx-auto mt-2" />
                  <div className="text-[8px] font-mono text-slate-400 mt-2">
                    500ML • VIRGIN PET
                  </div>
                </div>
                <div className="text-[8px] font-space text-slate-500 text-center uppercase">
                  WATERPROOF BOPP
                </div>
              </div>

              <div className="text-xs text-slate-300 font-space leading-tight">
                ✦ High aesthetic recall • Guests share photos • 100% matched to your interior
              </div>
            </div>
          </div>

          {/* LEFT SIDE: "BORING" GENERIC BOTTLE (Clipped by slider position) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-[#0A0A0C] border-r-2 border-white flex items-center justify-start p-8"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="flex flex-col items-center text-center space-y-4 max-w-md sm:ml-12 min-w-[280px]">
              <div className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 font-black text-xs uppercase tracking-widest font-space">
                BORING (GENERIC WATER)
              </div>

              {/* Boring Blue Grocery Bottle Container */}
              <div className="w-44 h-72 rounded-xl bg-slate-900 border border-slate-700/60 flex flex-col justify-between p-4 opacity-75 grayscale contrast-125">
                <div className="w-6 h-3 rounded-t-md bg-blue-700 mx-auto" />
                <div className="text-center space-y-1 my-auto">
                  <div className="text-lg font-bold text-blue-400 tracking-tight">
                    SUPERMARKET AQUA
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Boring Blue Grocery Label
                  </div>
                  <div className="text-[8px] text-rose-400 mt-2 font-mono">
                    WRINKLED PAPER LABEL
                  </div>
                </div>
                <div className="text-[8px] text-slate-600 text-center">
                  Zero Social Recall
                </div>
              </div>

              <div className="text-xs text-slate-400 font-space leading-tight">
                ✕ Ruins aesthetic table presentation • Zero marketing value
              </div>
            </div>
          </div>

          {/* Draggable Divider Bar & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_#ffffff] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#050505] flex items-center justify-center font-black text-xs shadow-2xl border-2 border-[#BD00FF]">
              ⇄
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onMakeItYours}
            className="py-4 px-8 rounded-2xl bg-[#BD00FF] hover:bg-[#A855F7] text-white font-black text-xs uppercase tracking-wider glow-purple transition-all inline-flex items-center gap-2 cursor-pointer font-space active:scale-95"
          >
            <span>MAKE IT YOURS →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
