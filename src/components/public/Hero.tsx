import React, { useState, useEffect, useRef } from 'react';
import { BottleSequenceViewer } from '../3d/BottleSequenceViewer';
import { BottleCustomization } from '../../types';
import { trackEvent } from '../../utils/analytics';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Zap, Droplets, Sliders, CheckCircle } from 'lucide-react';

interface HeroProps {
  customization: BottleCustomization;
  onChangeCustomization: (c: BottleCustomization) => void;
  onScrollToCustomizer: () => void;
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  customization,
  onChangeCustomization,
  onScrollToCustomizer,
  onScrollToForm,
}) => {
  const [activeStyle, setActiveStyle] = useState<'BOLD' | 'LUXURY' | 'MINIMAL' | 'CYBER'>('BOLD');
  const [activeSize, setActiveSize] = useState<'500ml' | '1000ml'>('500ml');

  // Scroll-linked states: detect scrolling past hero fold
  const [isPastFold, setIsPastFold] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Hero fold threshold: trigger when user scrolls past fold (scrollY > 75px)
          const pastFold = scrollY > 75;
          setIsPastFold(pastFold);

          // Calculate normalized progress over the hero section
          const heroHeight = heroRef.current?.offsetHeight || 800;
          const progress = Math.min(1.8, Math.max(0, scrollY / heroHeight));
          setScrollProgress(progress);

          // Proportional rotation angle driven by scroll position
          setScrollRotation(scrollY * 0.0035);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial evaluation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    onChangeCustomization({
      ...customization,
      brandName: val || 'YOUR BRAND',
    });
  };

  const handleStyleToggle = (style: 'BOLD' | 'LUXURY' | 'MINIMAL' | 'CYBER') => {
    setActiveStyle(style);
    let capCol = '#BD00FF';
    let tag = 'ON EVERY TABLE.';
    if (style === 'LUXURY') {
      capCol = '#F5D77F';
      tag = 'CRAFTED HOSPITALITY HYDRATION';
    } else if (style === 'MINIMAL') {
      capCol = '#050505';
      tag = 'SPECIALTY COFFEE & ARTISAN DINING';
    } else if (style === 'CYBER') {
      capCol = '#00F0FF';
      tag = 'BIO-ADAPTIVE NEURAL VELOCITY';
    }
    onChangeCustomization({
      ...customization,
      capColor: capCol,
      labelColor: capCol,
      tagline: tag,
    });
    trackEvent('hero_style_toggle', { style });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-center bg-[#050505] text-white pt-8 pb-16 lg:py-20 border-b border-white/10 cyber-grid overflow-hidden"
    >
      
      {/* Cinematic Deep Indigo & Electric Purple Energy Waves */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#0B0E23] via-[#BD00FF]/20 to-[#00F0FF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Main 2-Column Hero: Left Oversized Typography & Quick Live Input, Right Massive 3D Bottle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT: Cinematic Copy & High-Impact Typography (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Atmospheric Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[#0B0E23]/90 border border-white/10 px-4 py-1.5 rounded-full text-xs font-space text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#BD00FF] animate-ping" />
              <span className="font-bold text-white tracking-wider">NEXT-GEN PACKAGING STUDIO</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#00F0FF]">ZERO GENERIC LABELS</span>
            </div>

            {/* Giant Headline: YOUR BRAND. ON EVERY TABLE. */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.95] font-syne uppercase">
                YOUR BRAND. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD00FF] via-white to-[#00F0FF] text-glow-purple">
                  ON EVERY TABLE.
                </span>
              </h1>
            </div>

            {/* Secondary Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Custom-branded water bottles designed to make your restaurant, café or event impossible to ignore. Turn every dining flat-lay into free organic marketing.
            </p>

            {/* Live Hero Interactivity: Instant Type-to-Preview Bar */}
            <div className="glass-cyber rounded-2xl p-4 border border-white/10 space-y-3 max-w-lg shadow-xl">
              <div className="flex items-center justify-between text-xs font-space">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#BD00FF]" />
                  <span>Preview Your Venue Bottle Live</span>
                </span>
                <span className="text-[#00F0FF] text-[11px] font-bold">UPDATES IN 3D →</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customization.brandName}
                  onChange={handleBrandNameChange}
                  placeholder="TYPE YOUR CAFÉ / RESTAURANT NAME"
                  maxLength={18}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#050505] border border-white/15 focus:border-[#BD00FF] focus:ring-1 focus:ring-[#BD00FF] text-xs font-bold font-space uppercase text-white outline-none tracking-wider transition-all"
                />
              </div>

              {/* Quick style switcher tabs */}
              <div className="flex items-center gap-2 pt-1">
                {(['BOLD', 'LUXURY', 'MINIMAL', 'CYBER'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleToggle(style)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
                      activeStyle === style
                        ? 'bg-[#BD00FF] text-white shadow-sm'
                        : 'bg-[#050505] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  trackEvent('hero_cta_click', { cta: 'create_your_bottle' });
                  onScrollToCustomizer();
                }}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#BD00FF] to-[#9333EA] hover:from-[#A855F7] hover:to-[#7E22CE] text-white font-black text-sm uppercase tracking-wider glow-purple transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[50px] font-space"
              >
                <span>CREATE YOUR BOTTLE →</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackEvent('hero_cta_click', { cta: 'get_bulk_quote' });
                  onScrollToForm();
                }}
                className="py-4 px-7 rounded-2xl bg-[#0B0E23] hover:bg-[#151B3B] border border-white/15 hover:border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[50px] font-space"
              >
                <span>GET A BULK QUOTE</span>
              </button>
            </div>

            {/* Proof Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-slate-400 font-space">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#39FF14] shrink-0" />
                <span>300 Bottles MOQ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>Waterproof BOPP Wrap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#BD00FF] shrink-0" />
                <span>48H Indore Dispatch</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Huge Realistic 3D Condensed Bottle (5 cols) with Scroll-Linked Glow & Rotation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Outer Container with Scroll-Linked Soft Pulsating Neon Aura */}
            <div className="relative w-full">
              
              {/* Soft pulsating neon background aura that blooms when scrolling past the fold */}
              <div
                className={`absolute -inset-3 sm:-inset-6 rounded-[2.5rem] transition-all duration-700 pointer-events-none ${
                  isPastFold
                    ? 'opacity-100 animate-aura-pulse-soft'
                    : 'opacity-0 scale-95'
                }`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${customization.capColor || '#BD00FF'} 0%, rgba(0, 240, 255, 0.4) 45%, transparent 75%)`,
                }}
              />

              {/* Product Viewport Container with scroll-linked subtle 3D tilt & pulsating neon border */}
              <div
                className={`w-full h-[500px] sm:h-[620px] relative rounded-3xl glass-cyber overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-500 ${
                  isPastFold
                    ? 'border-[#BD00FF]/60 animate-neon-pulse-soft'
                    : 'border-white/10 hover:border-white/25'
                }`}
                style={{
                  transform: isPastFold
                    ? `perspective(1000px) rotateY(${Math.sin(scrollProgress * 2.2) * 5}deg) rotateX(${Math.cos(scrollProgress * 2.2) * 2.5}deg) scale(1.015)`
                    : 'none',
                  transition: 'transform 0.15s ease-out, border-color 0.5s ease-out',
                }}
              >
                
                {/* Backlight Ambient Glow with pulsating intensity */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isPastFold
                      ? 'opacity-85 bg-gradient-to-b from-[#BD00FF]/20 via-[#00F0FF]/15 to-[#BD00FF]/25'
                      : 'opacity-30 bg-gradient-to-b from-transparent via-[#BD00FF]/10 to-transparent'
                  }`}
                />

                {/* High-Performance 360 Image Sequence Scrubber with Frame-Accurate Scroll Reaction */}
                <BottleSequenceViewer
                  customization={customization}
                  accentColor={customization.capColor || '#BD00FF'}
                  secondaryAccent="#00F0FF"
                  sizeFormat={activeSize}
                  styleVariant={activeStyle}
                  scrollRotationOffset={scrollRotation}
                  isPastHeroFold={isPastFold}
                  scrollProgress={scrollProgress}
                  className="w-full h-full"
                />

                {/* Format Toggle Floating Switcher (500ML vs 1L) */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#050505]/90 backdrop-blur-md border border-white/20 p-1 rounded-xl z-30 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setActiveSize('500ml')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
                      activeSize === '500ml'
                        ? 'bg-[#BD00FF] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    500ML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSize('1000ml')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
                      activeSize === '1000ml'
                        ? 'bg-[#BD00FF] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1L
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
