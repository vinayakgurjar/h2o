import React, { useState } from 'react';
import { BottleSize, BottleStyle } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, Layers, Eye } from 'lucide-react';

interface ProductsSectionProps {
  onSelectProduct: (size: BottleSize, style: BottleStyle) => void;
  onCustomizeSize: (size: '500ml' | '1000ml') => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onCustomizeSize,
}) => {
  const [hoveredCard, setHoveredCard] = useState<'500ml' | '1000ml' | null>(null);

  return (
    <section id="products" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 cyber-grid relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#BD00FF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0B0E23] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#BD00FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#BD00FF]" />
            <span className="uppercase tracking-wider">VIRGIN CLARITY PET SILHOUETTES</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-syne uppercase">
            PICK YOUR BOTTLE.
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Collectible architectural silhouettes engineered to command attention on dining tables, bedside suites, and boardroom centerpieces.
          </p>
        </div>

        {/* Massive 2-Card Collectible Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: 500ML - MADE FOR TABLES */}
          <div
            onMouseEnter={() => setHoveredCard('500ml')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative rounded-3xl glass-cyber p-8 sm:p-12 border border-white/10 hover:border-[#BD00FF]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[580px]"
            style={{
              boxShadow: hoveredCard === '500ml' ? '0 0 50px rgba(189, 0, 255, 0.3)' : undefined,
            }}
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#BD00FF]/20 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

            <div>
              {/* Category / Meta unboxed */}
              <div className="flex items-center justify-between text-xs font-space text-slate-400 mb-6">
                <span className="font-bold text-white tracking-wider">HERO FORMAT</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#BD00FF] font-semibold">CAFÉ & RESTAURANT BENCHMARK</span>
                <span aria-hidden="true">·</span>
                <span>24 UNITS / CRATE</span>
              </div>

              {/* Massive Title Overlays */}
              <div className="space-y-1 mb-6">
                <div className="text-6xl sm:text-7xl font-black font-syne text-white tracking-tighter uppercase group-hover:text-glow-purple transition-all">
                  500ML
                </div>
                <div className="text-2xl sm:text-3xl font-black font-syne text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 uppercase tracking-tight">
                  MADE FOR TABLES.
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-8">
                The undisputed hospitality champion. Sits in front of your guest throughout their entire meal, turning every food flat-lay photo and social story into organic brand recall.
              </p>

              {/* Spec Pills */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#050505]/80 border border-white/10 text-xs font-space mb-8">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Profile</span>
                  <span className="font-bold text-white">Square / Round</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Label</span>
                  <span className="font-bold text-[#BD00FF]">Waterproof BOPP</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Low MOQ</span>
                  <span className="font-bold text-white">300 Bottles</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-space text-slate-400">
                From ₹6.80 / Bottle • Free 3D Proof
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectProduct('500ml', 'Square');
                  onCustomizeSize('500ml');
                }}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#BD00FF] to-[#9333EA] hover:from-[#A855F7] hover:to-[#7E22CE] text-white font-black text-xs uppercase tracking-wider font-space glow-purple-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>CUSTOMIZE →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: 1L - MADE TO BE SEEN */}
          <div
            onMouseEnter={() => setHoveredCard('1000ml')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative rounded-3xl glass-cyber p-8 sm:p-12 border border-white/10 hover:border-[#00F0FF]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[580px]"
            style={{
              boxShadow: hoveredCard === '1000ml' ? '0 0 50px rgba(0, 240, 255, 0.3)' : undefined,
            }}
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#00F0FF]/20 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

            <div>
              {/* Category / Meta unboxed */}
              <div className="flex items-center justify-between text-xs font-space text-slate-400 mb-6">
                <span className="font-bold text-white tracking-wider">EXECUTIVE FORMAT</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#00F0FF] font-semibold">LUXURY SUITES & CONCLAVES</span>
                <span aria-hidden="true">·</span>
                <span>12 UNITS / CRATE</span>
              </div>

              {/* Massive Title Overlays */}
              <div className="space-y-1 mb-6">
                <div className="text-6xl sm:text-7xl font-black font-syne text-white tracking-tighter uppercase group-hover:text-glow-cyan transition-all">
                  1L
                </div>
                <div className="text-2xl sm:text-3xl font-black font-syne text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 uppercase tracking-tight">
                  MADE TO BE SEEN.
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-8">
                The commanding architectural centerpiece. Formulated for luxury guest suites, presidential dining tables, VIP festival booths, and executive boardrooms that refuse ordinary water.
              </p>

              {/* Spec Pills */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#050505]/80 border border-white/10 text-xs font-space mb-8">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Height</span>
                  <span className="font-bold text-white">275mm Executive</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Closure</span>
                  <span className="font-bold text-[#00F0FF]">Tamper-Proof Cap</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Turnaround</span>
                  <span className="font-bold text-white">48-72h Doorstep</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-space text-slate-400">
                From ₹9.90 / Bottle • Free 3D Proof
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectProduct('1000ml', 'Square');
                  onCustomizeSize('1000ml');
                }}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0088FF] hover:from-[#38BDF8] hover:to-[#0284C7] text-[#050505] font-black text-xs uppercase tracking-wider font-space glow-cyan-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>CUSTOMIZE →</span>
                <ArrowRight className="w-4 h-4 text-[#050505]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
