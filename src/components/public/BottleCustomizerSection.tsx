import React, { useState } from 'react';
import { Bottle3DCanvas } from '../3d/Bottle3DCanvas';
import { BottleCustomization } from '../../types';
import { trackEvent } from '../../utils/analytics';
import { showToast } from '../../utils/toast';
import {
  Sparkles,
  Sliders,
  Check,
  Send,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Flame,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BottleCustomizerSectionProps {
  customization: BottleCustomization;
  onChangeCustomization: (c: BottleCustomization) => void;
  onRequestQuote: () => void;
}

export const BottleCustomizerSection: React.FC<BottleCustomizerSectionProps> = ({
  customization,
  onChangeCustomization,
  onRequestQuote,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<'500ml' | '1000ml'>(
    customization.bottleSize === '1000ml' ? '1000ml' : '500ml'
  );
  const [selectedStyle, setSelectedStyle] = useState<
    'MINIMAL' | 'LUXURY' | 'BOLD' | 'NATURAL' | 'CORPORATE' | 'CYBER'
  >('BOLD');
  const [accentColor, setAccentColor] = useState<string>(customization.capColor || '#BD00FF');
  const [instagram, setInstagram] = useState<string>('@yourvenue');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const STYLES = [
    {
      id: 'BOLD',
      name: 'BOLD STREETWEAR',
      desc: 'Heavy typography, intense electric purple & cyan contrast',
      defaultCap: '#BD00FF',
    },
    {
      id: 'LUXURY',
      name: 'LUXURY SERIF',
      desc: 'Midnight obsidian with hairline gold foil monogram',
      defaultCap: '#F5D77F',
    },
    {
      id: 'MINIMAL',
      name: 'SCANDI MINIMAL',
      desc: 'Crisp negative space, monochromatic precision',
      defaultCap: '#050505',
    },
    {
      id: 'NATURAL',
      name: 'BOTANICAL MINERAL',
      desc: 'Organic forest tones with vivid acid lime accents',
      defaultCap: '#39FF14',
    },
    {
      id: 'CYBER',
      name: 'FUTURISTIC CYBER',
      desc: 'High-voltage circuitry, neon blue and Japanese katakana',
      defaultCap: '#00F0FF',
    },
    {
      id: 'CORPORATE',
      name: 'EXECUTIVE SUITE',
      desc: 'Architectural clean lines, institutional authority',
      defaultCap: '#1E3A8A',
    },
  ] as const;

  const COLOR_PALETTES = [
    { name: 'Electric Purple', hex: '#BD00FF' },
    { name: 'Neon Cyan', hex: '#00F0FF' },
    { name: 'Acid Lime', hex: '#39FF14' },
    { name: 'Luxury Gold', hex: '#F5D77F' },
    { name: 'Onyx Black', hex: '#050505' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ];

  const handleSizeChange = (sz: '500ml' | '1000ml') => {
    setSelectedSize(sz);
    onChangeCustomization({
      ...customization,
      bottleSize: sz,
    });
    trackEvent('customizer_size_change', { size: sz });
  };

  const handleStyleChange = (st: typeof selectedStyle) => {
    setSelectedStyle(st);
    const found = STYLES.find((s) => s.id === st);
    const cap = found?.defaultCap || '#BD00FF';
    setAccentColor(cap);
    onChangeCustomization({
      ...customization,
      capColor: cap,
      labelColor: cap,
    });
    trackEvent('customizer_style_change', { style: st });
  };

  const handleColorChange = (hex: string) => {
    setAccentColor(hex);
    onChangeCustomization({
      ...customization,
      capColor: hex,
      labelColor: hex,
    });
  };

  const handleSaveDesign = () => {
    setIsSaved(true);
    showToast(`Design for "${customization.brandName || 'YOUR BRAND'}" saved to session!`, 'success');
    trackEvent('customizer_design_saved', {
      brand: customization.brandName,
      size: selectedSize,
      style: selectedStyle,
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <section id="customizer" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 cyber-grid relative overflow-hidden">
      
      {/* Background Volumetric Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0B0E23] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#BD00FF]">
            <Sliders className="w-3.5 h-3.5 text-[#BD00FF]" />
            <span className="uppercase tracking-wider">GAME-LIKE LOADOUT CREATOR</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-syne uppercase">
            BUILD YOUR BOTTLE.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Configure size, chassis style, brand typography, and cap closures in real time. Watch every single change wrap onto your 3D bottle preview instantly.
          </p>
        </div>

        {/* Loadout Workspace Grid: Left/Right Controls, Center 3D Bottle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Steps 01 to 03 (3.5 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* STEP 01: SIZE */}
            <div className="glass-cyber rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-space">
                <span className="font-bold text-white uppercase tracking-wider">STEP 01 // SIZE</span>
                <span className="text-[#BD00FF] font-semibold">{selectedSize}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSizeChange('500ml')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-space ${
                    selectedSize === '500ml'
                      ? 'bg-[#151B3B] border-[#BD00FF] text-white shadow-sm'
                      : 'bg-[#050505] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-base font-black">500ML</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tables & Dining</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSizeChange('1000ml')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-space ${
                    selectedSize === '1000ml'
                      ? 'bg-[#151B3B] border-[#BD00FF] text-white shadow-sm'
                      : 'bg-[#050505] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-base font-black">1 LITRE</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Suites & Banquets</div>
                </button>
              </div>
            </div>

            {/* STEP 02: STYLE */}
            <div className="glass-cyber rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-space">
                <span className="font-bold text-white uppercase tracking-wider">STEP 02 // STYLE</span>
                <span className="text-[#00F0FF] font-semibold">{selectedStyle}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStyleChange(st.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStyle === st.id
                        ? 'bg-[#151B3B] border-white/40 text-white'
                        : 'bg-[#050505] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-space truncate">{st.name}</div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">{st.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 03: BRAND IDENTITY INPUT */}
            <div className="glass-cyber rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="text-xs font-space font-bold text-white uppercase tracking-wider">
                STEP 03 // BRAND IDENTITY
              </div>

              <div>
                <label className="block text-[11px] font-space text-slate-400 mb-1">
                  Brand / Venue Name (Live 3D Render)
                </label>
                <input
                  type="text"
                  value={customization.brandName}
                  onChange={(e) =>
                    onChangeCustomization({
                      ...customization,
                      brandName: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={18}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 focus:border-[#BD00FF] text-xs font-bold text-white uppercase outline-none font-space tracking-wider"
                  placeholder="e.g. SÖREN ROASTERS"
                />
              </div>

              <div>
                <label className="block text-[11px] font-space text-slate-400 mb-1">
                  Tagline / Positioning Subtext
                </label>
                <input
                  type="text"
                  value={customization.tagline}
                  onChange={(e) =>
                    onChangeCustomization({
                      ...customization,
                      tagline: e.target.value,
                    })
                  }
                  maxLength={36}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050505] border border-white/10 focus:border-[#BD00FF] text-xs font-medium text-white outline-none font-space"
                  placeholder="e.g. Artisanal Single-Origin Dining"
                />
              </div>
            </div>

          </div>

          {/* CENTER: Massive 3D Bottle Canvas Viewport (4.5 cols) */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center">
            
            <div className="w-full h-[520px] sm:h-[600px] relative rounded-3xl glass-cyber border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
              
              {/* Backlight reflection */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
                }}
              />

              {/* Real-time 3D Bottle */}
              <Bottle3DCanvas
                customization={customization}
                accentColor={accentColor}
                secondaryAccent="#00F0FF"
                sizeFormat={selectedSize}
                styleVariant={selectedStyle}
                interactive={true}
                autoRotateDefault={true}
                className="w-full h-full"
              />

              {/* Floating LIVE badge */}
              <div className="absolute top-4 left-4 bg-[#050505]/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-lg pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="text-[10px] font-space font-black uppercase tracking-widest text-white">
                  LIVE 3D SIMULATION
                </span>
              </div>

              {/* Bottom Complete Callout Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#050505]/90 backdrop-blur-xl border border-white/15 p-3 rounded-2xl flex items-center justify-between text-xs font-space z-20">
                <div className="truncate pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Active Preset</span>
                  <span className="font-bold text-white truncate">{customization.brandName || 'YOUR BRAND'}</span>
                </div>

                <button
                  type="button"
                  onClick={onRequestQuote}
                  className="py-2 px-3.5 rounded-xl bg-[#BD00FF] hover:bg-[#A855F7] text-white font-black text-xs uppercase tracking-wider glow-purple-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  Request Quote →
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT: Steps 04 to 05 & That's Your Bottle Completion (3.5 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* STEP 04: BRAND COLORS & CAP */}
            <div className="glass-cyber rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="text-xs font-space font-bold text-white uppercase tracking-wider">
                STEP 04 // ACCENT & CAP FINISH
              </div>

              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((col) => {
                  const isSelected = accentColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => handleColorChange(col.hex)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#151B3B] border-white/40 shadow-sm'
                          : 'bg-[#050505] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] font-space font-medium truncate max-w-full">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 05: DETAILS (Instagram, Website, QR) */}
            <div className="glass-cyber rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="text-xs font-space font-bold text-white uppercase tracking-wider">
                STEP 05 // SOCIAL & QR INTEGRATION
              </div>

              <div>
                <label className="block text-[11px] font-space text-slate-400 mb-1">
                  Instagram Handle / Website
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourvenue or yourvenue.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 focus:border-[#BD00FF] text-xs font-semibold text-white outline-none font-space"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#050505]/70 border border-white/5 text-[11px] text-slate-400 leading-snug">
                ✦ High-contrast QR codes directly link guests to your digital food menu, Google Review page, or Instagram profile.
              </div>
            </div>

            {/* COMPLETION CARD: THAT'S YOUR BOTTLE. */}
            <div className="glass-cyber rounded-2xl p-5 border border-[#BD00FF]/40 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#BD00FF] fill-[#BD00FF]" />
                <h3 className="font-syne font-black text-lg uppercase text-white tracking-tight">
                  THAT'S YOUR BOTTLE.
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Your custom 3D design is locked into the packaging queue. Request bulk wholesale rates or save design for review with your team.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDesign}
                  className="flex-1 py-3 px-3 rounded-xl bg-[#050505] hover:bg-[#151B3B] border border-white/15 text-white font-bold text-xs uppercase tracking-wider font-space transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'SAVED!' : 'SAVE DESIGN'}</span>
                </button>

                <button
                  type="button"
                  onClick={onRequestQuote}
                  className="flex-1 py-3 px-3 rounded-xl bg-[#BD00FF] hover:bg-[#A855F7] text-white font-black text-xs uppercase tracking-wider font-space glow-purple-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>REQUEST QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {isSaved && (
                <div className="text-[11px] text-emerald-400 font-space text-center pt-1">
                  ✓ Vector configuration saved to session memory!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
