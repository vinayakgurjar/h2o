import React, { useState } from 'react';
import { Bottle3DCanvas } from '../3d/Bottle3DCanvas';
import { BottleCustomization } from '../../types';
import { trackEvent } from '../../utils/analytics';
import {
  Zap,
  Sliders,
  Play,
  RotateCw,
  ShieldCheck,
  Flame,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface FlavorPreset {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  neonColor: string;
  bgGradient: string;
  caffeine: string;
  activeNootropic: string;
  sensoryNote: string;
}

export const H2O_FLAVORS: FlavorPreset[] = [
  {
    id: 'cyber-blueprint',
    name: 'CYBER BLUEPRINT',
    code: 'H2O-01',
    subtitle: 'Electric Blueberry • Blue Lotus • Citicoline',
    neonColor: '#00F0FF',
    bgGradient: 'from-[#00F0FF]/20 via-[#00F0FF]/5 to-transparent',
    caffeine: '200mg',
    activeNootropic: 'Cognizin® Citicoline',
    sensoryNote: 'Crisp electric berry with an icy hyper-clean finish',
  },
  {
    id: 'acid-overload',
    name: 'ACID OVERLOAD',
    code: 'H2O-02',
    subtitle: 'Toxic Green Apple • Sour Lime • Electrolytes',
    neonColor: '#39FF14',
    bgGradient: 'from-[#39FF14]/20 via-[#39FF14]/5 to-transparent',
    caffeine: '200mg',
    activeNootropic: 'L-Tyrosine + Zinc',
    sensoryNote: 'Electrifying sour crunch that kicks in under 90 seconds',
  },
  {
    id: 'void-drive',
    name: 'VOID DRIVE',
    code: 'H2O-03',
    subtitle: 'Midnight Dragonfruit • Acai • L-Theanine Zen',
    neonColor: '#BD00FF',
    bgGradient: 'from-[#BD00FF]/20 via-[#BD00FF]/5 to-transparent',
    caffeine: '200mg',
    activeNootropic: '2:1 L-Theanine Stack',
    sensoryNote: 'Deep floral berry with zero jitter and laser focus',
  },
  {
    id: 'solar-inferno',
    name: 'SOLAR INFERNO',
    code: 'H2O-04',
    subtitle: 'Blood Orange • Mango • Ghost Chili Kick',
    neonColor: '#FF5E00',
    bgGradient: 'from-[#FF5E00]/20 via-[#FF5E00]/5 to-transparent',
    caffeine: '220mg',
    activeNootropic: 'Beta-Alanine Rush',
    sensoryNote: 'Explosive citrus thermogenic warmth for maximum heart-rate',
  },
  {
    id: 'neon-tokyo',
    name: 'NEON TOKYO',
    code: 'H2O-05',
    subtitle: 'Cherry Blossom Fizz • Lychee • Red Ginseng',
    neonColor: '#FF007F',
    bgGradient: 'from-[#FF007F]/20 via-[#FF007F]/5 to-transparent',
    caffeine: '180mg',
    activeNootropic: 'Panax Red Ginseng',
    sensoryNote: 'Sparkling botanical nectar inspired by Shibuya nightlife',
  },
];

interface Hero3DStudioProps {
  customization: BottleCustomization;
  onChangeCustomization: (c: BottleCustomization) => void;
  onOpenCustomizerModal: () => void;
  onOpenVideoModal: () => void;
  onOpenQuoteModal: () => void;
  onScrollToLeadForm: () => void;
  onScrollToTracker: () => void;
}

export const Hero3DStudio: React.FC<Hero3DStudioProps> = ({
  customization,
  onChangeCustomization,
  onOpenCustomizerModal,
  onOpenVideoModal,
  onOpenQuoteModal,
  onScrollToLeadForm,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorPreset>(H2O_FLAVORS[0]);
  const [activeTab, setActiveTab] = useState<'flavor' | 'canLab' | 'specs'>('flavor');
  const [clanTag, setClanTag] = useState('H2O SQUAD');

  const handleSelectFlavor = (flavor: FlavorPreset) => {
    setSelectedFlavor(flavor);
    onChangeCustomization({
      ...customization,
      labelColor: flavor.neonColor,
      capColor: flavor.neonColor,
      tagline: flavor.subtitle,
    });
    trackEvent('flavor_select', { flavor: flavor.name });
  };

  const handleApplyClanTag = (tag: string) => {
    setClanTag(tag);
    onChangeCustomization({
      ...customization,
      brandName: tag || 'H2O',
    });
  };

  return (
    <section id="3d-studio" className="relative bg-[#05070B] text-white pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-white/10 overflow-hidden cyber-grid">
      
      {/* Dynamic Volumetric Neon Atmosphere */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-25"
        style={{ backgroundColor: selectedFlavor.neonColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Status & Manifesto Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2.5 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space text-slate-300">
            <span
              className="w-2 h-2 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: selectedFlavor.neonColor, boxShadow: `0 0 8px ${selectedFlavor.neonColor}` }}
            />
            <span className="font-bold text-white tracking-wider">BIO-ADAPTIVE ENERGY FUEL</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">VERSION 3.2 • ZERO SUGAR</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-space">
            <button
              type="button"
              onClick={onOpenVideoModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#0C1019] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#00F0FF] text-[#00F0FF]" />
              <span>Manifesto Reel</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Hero: Left Pitch & Controls, Right 3D Energy Can */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: High-Voltage Gen-Z Pitch & Interactive Can Lab (7 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Bold Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-syne uppercase">
                Overclock <br />
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 transition-colors"
                  style={{
                    textShadow: `0 0 40px ${selectedFlavor.neonColor}30`,
                  }}
                >
                  Your Reality.
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
                Next-gen performance fuel engineered for esports athletes, midnight creators, rave dancers, and streetwear culture. Powered by 200mg clean green coffee caffeine, Cognizin® citicoline, and bio-osmotic electrolytes. Zero sugar. Zero crash.
              </p>
            </div>

            {/* Live Interactive Can Configurator Box */}
            <div className="glass-cyber rounded-2xl p-5 shadow-2xl space-y-4 border border-white/10">
              
              {/* Segmented Control Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('flavor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-space transition-all cursor-pointer ${
                      activeTab === 'flavor'
                        ? 'bg-[#00F0FF] text-[#05070B] glow-cyan-sm'
                        : 'text-slate-400 hover:text-white bg-[#05070B]'
                    }`}
                  >
                    1. Flavor Drop
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('canLab')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-space transition-all cursor-pointer ${
                      activeTab === 'canLab'
                        ? 'bg-[#00F0FF] text-[#05070B] glow-cyan-sm'
                        : 'text-slate-400 hover:text-white bg-[#05070B]'
                    }`}
                  >
                    2. Clan Tag
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('specs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-space transition-all cursor-pointer ${
                      activeTab === 'specs'
                        ? 'bg-[#00F0FF] text-[#05070B] glow-cyan-sm'
                        : 'text-slate-400 hover:text-white bg-[#05070B]'
                    }`}
                  >
                    3. Bio-Matrix
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onOpenCustomizerModal}
                  className="text-xs text-[#00F0FF] hover:underline font-bold flex items-center gap-1 cursor-pointer font-space"
                >
                  <span>Full Studio</span>
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab 1: Flavor Selector */}
              {activeTab === 'flavor' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>SELECT ACTIVE FORMULA ({selectedFlavor.code})</span>
                    <span style={{ color: selectedFlavor.neonColor }}>{selectedFlavor.activeNootropic}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {H2O_FLAVORS.map((flavor) => {
                      const isSelected = selectedFlavor.id === flavor.id;
                      return (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => handleSelectFlavor(flavor)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-[#131926] border-white/40 shadow-lg'
                              : 'bg-[#070A10] border-white/5 hover:border-white/20'
                          }`}
                          style={{
                            boxShadow: isSelected ? `0 0 16px ${flavor.neonColor}40` : undefined,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: flavor.neonColor, boxShadow: `0 0 6px ${flavor.neonColor}` }}
                            />
                            <span className="text-[10px] font-space text-slate-400 font-bold">{flavor.code}</span>
                          </div>
                          <div className="text-xs font-bold text-white tracking-wide truncate">{flavor.name}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{flavor.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sensory flavor descriptor banner */}
                  <div className="p-3 rounded-xl bg-[#05070B] border border-white/10 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-slate-300">{selectedFlavor.sensoryNote}</span>
                    </div>
                    <span className="text-[11px] font-bold font-space text-[#00F0FF] shrink-0 ml-2">
                      {selectedFlavor.caffeine} VOLT
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Custom Clan Tag / Squad Imprint */}
              {activeTab === 'canLab' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Clan / Squad Tag / Gamer Handle (Live 3D Render)
                    </label>
                    <input
                      type="text"
                      value={clanTag}
                      onChange={(e) => handleApplyClanTag(e.target.value)}
                      maxLength={16}
                      className="w-full bg-[#05070B] border border-white/10 focus:border-[#00F0FF] rounded-xl px-3.5 py-2.5 text-sm text-white font-bold tracking-wider uppercase outline-none transition-colors"
                      placeholder="e.g. SQUAD_2026, CLAN_H2O"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Can Finish
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Matte Obsidian', 'Cyber Metal', 'Holo Laser Foil', 'Liquid Gloss'].map((finish) => (
                        <button
                          key={finish}
                          type="button"
                          onClick={() => onChangeCustomization({ ...customization, finish: finish as any })}
                          className={`p-2 text-xs font-bold rounded-lg border text-left transition-all ${
                            customization.finish === finish
                              ? 'bg-[#131926] border-[#00F0FF] text-white'
                              : 'bg-[#05070B] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Bio-Matrix Specs */}
              {activeTab === 'specs' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-400">
                    BIO-ENGINEERED PERFORMANCE COMPOSITION
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#05070B] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Energy Engine</div>
                      <div className="font-bold text-white text-sm">200mg Green Coffee</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Smooth 6h Curve</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#05070B] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Synaptic Speed</div>
                      <div className="font-bold text-white text-sm">250mg Citicoline</div>
                      <div className="text-[10px] text-cyan-400 mt-0.5">Reaction Time Boost</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#05070B] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Caloric Impact</div>
                      <div className="font-bold text-white text-sm">0 Sugar / 10 Cal</div>
                      <div className="text-[10px] text-purple-400 mt-0.5">Keto / Diabetic Safe</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#05070B] border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase">Hydration Core</div>
                      <div className="font-bold text-white text-sm">Pink Salt + Potassium</div>
                      <div className="text-[10px] text-yellow-400 mt-0.5">Full Cell Hydration</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onScrollToLeadForm}
                className="py-3 px-6 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] font-black text-sm tracking-wider uppercase flex items-center gap-2 glow-cyan transition-all cursor-pointer min-h-[48px] active:scale-95"
              >
                <Zap className="w-4 h-4 fill-[#05070B]" />
                <span>Order Squad Pack / Wholesale</span>
              </button>

              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="py-3 px-5 rounded-xl bg-[#0C1019] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer min-h-[48px]"
              >
                <span>Instant Drop Quote</span>
              </button>
            </div>

            {/* Streetwear & Esports Trust Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="text-[11px] font-medium leading-tight">FSSAI & Anti-Doping Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Activity className="w-4 h-4 text-[#39FF14] shrink-0" />
                <span className="text-[11px] font-medium leading-tight">Zero Sugar • Zero Crash</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Layers className="w-4 h-4 text-[#BD00FF] shrink-0" />
                <span className="text-[11px] font-medium leading-tight">100% Recyclable Aluminium</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D High-Voltage Energy Drink Can Studio (5 cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            <div className="w-full h-[460px] sm:h-[540px] relative rounded-3xl overflow-hidden glass-cyber border border-white/10 shadow-2xl flex items-center justify-center">
              
              {/* Dynamic Accent Ambient Backdrop */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${selectedFlavor.neonColor} 0%, transparent 70%)`,
                }}
              />

              {/* Three.js 3D WebGL Canvas */}
              <Bottle3DCanvas
                customization={{
                  ...customization,
                  brandName: clanTag,
                  tagline: selectedFlavor.subtitle,
                }}
                neonColor={selectedFlavor.neonColor}
                flavorTitle={selectedFlavor.name}
                interactive={true}
                autoRotateDefault={true}
                className="w-full h-full"
              />

              {/* Top Can Spec HUD Overlay */}
              <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#05070B]/80 backdrop-blur-md border border-white/10 text-[10px] font-space font-bold uppercase tracking-wider text-slate-300">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: selectedFlavor.neonColor }}
                  />
                  <span>MODEL: 330ML SLEEK CAN</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pl-1">
                  LATENCY: ZERO • 120 FPS
                </div>
              </div>

              {/* Bottom Quick Switch Pill Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#05070B]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full z-20">
                {H2O_FLAVORS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFlavor(f)}
                    className="w-5 h-5 rounded-full transition-transform hover:scale-125 cursor-pointer relative"
                    style={{
                      backgroundColor: f.neonColor,
                      boxShadow: selectedFlavor.id === f.id ? `0 0 10px ${f.neonColor}` : undefined,
                    }}
                    title={f.name}
                    aria-label={`Switch to ${f.name}`}
                  >
                    {selectedFlavor.id === f.id && (
                      <span className="absolute inset-0 rounded-full border-2 border-white scale-125" />
                    )}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
