import React from 'react';
import { Zap, Sparkles, ArrowRight, Eye, Shield, Tag } from 'lucide-react';
import { BottleCustomization } from '../../types';
import { showToast } from '../../utils/toast';

interface PortfolioSectionProps {
  onLoadPresetTo3D: (preset: BottleCustomization) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onLoadPresetTo3D }) => {
  const DROPS = [
    {
      id: 'drop-01-apex-esports',
      dropCode: 'CAPSULE 001',
      title: 'APEX CLAN // TOURNAMENT EDITION',
      sub: 'Official Fuel of EMEA Masters Finalists',
      accentColor: '#00F0FF',
      flavor: 'CYBER BLUEPRINT',
      customization: {
        bottleSize: '500ml' as const,
        bottleStyle: 'Sleek Nordic Cylinder' as const,
        capColor: '#00F0FF',
        labelColor: '#00F0FF',
        labelStyle: 'Custom Full-Wrap' as const,
        brandName: 'APEX CLAN',
        tagline: '120 FPS REFLEX ENERGY // ZERO DELAY',
        finish: 'Matte' as const,
      },
      stats: '12,000 Cans Produced • Sold Out in 42 Mins',
      description:
        'Custom matte black aluminium can featuring reflective cyan circuit lines and clan watermark. Formulated with 250mg Citicoline for competitive CS2 & Valorant teams.',
    },
    {
      id: 'drop-02-tokyo-nightlife',
      dropCode: 'CAPSULE 002',
      title: 'SHIBUYA UNDERGROUND × DJ KAZU',
      sub: 'All-Night Boiler Room Tokyo Residency',
      accentColor: '#FF007F',
      flavor: 'NEON TOKYO',
      customization: {
        bottleSize: '500ml' as const,
        bottleStyle: 'Sleek Nordic Cylinder' as const,
        capColor: '#FF007F',
        labelColor: '#FF007F',
        labelStyle: 'Custom Full-Wrap' as const,
        brandName: 'SHIBUYA 4AM',
        tagline: 'FLOW STATE BOTANICAL NECTAR',
        finish: 'Metallic Foil' as const,
      },
      stats: '8,500 Cans Distributed • Shibuya Sound Museum',
      description:
        'Holographic laser foil finish paired with sparkling cherry blossom notes and red ginseng. Engineered to keep dancefloors locked until sunrise without alcohol lethargy.',
    },
    {
      id: 'drop-03-streetwear-raw',
      dropCode: 'CAPSULE 003',
      title: 'VOID ARCHIVE // TECHWEAR DROP',
      sub: 'Limited Collab with Seoul Cyberpunk Apparel',
      accentColor: '#BD00FF',
      flavor: 'VOID DRIVE',
      customization: {
        bottleSize: '500ml' as const,
        bottleStyle: 'Square' as const,
        capColor: '#BD00FF',
        labelColor: '#BD00FF',
        labelStyle: 'Custom Full-Wrap' as const,
        brandName: 'VOID ARCHIVE',
        tagline: 'NEURAL PERFORMANCE MATRIX',
        finish: 'Matte' as const,
      },
      stats: '3,000 Numbered Collector Cans • Gift with Purchase',
      description:
        'Anodized obsidian metal with serialized laser-etched QR tags linking to exclusive digital lookbooks. Sold alongside oversized heavyweight hoodies and tactical slings.',
    },
    {
      id: 'drop-04-redline-drift',
      dropCode: 'CAPSULE 004',
      title: 'REDLINE MOTORSPORTS // FORMULA D',
      sub: 'Paddock Fuel for Pro Drift Championship',
      accentColor: '#FF5E00',
      flavor: 'SOLAR INFERNO',
      customization: {
        bottleSize: '500ml' as const,
        bottleStyle: 'Classic Round' as const,
        capColor: '#FF5E00',
        labelColor: '#FF5E00',
        labelStyle: 'Custom Full-Wrap' as const,
        brandName: 'REDLINE CORPS',
        tagline: 'MAXIMUM ADRENALINE THERMAL PUMP',
        finish: 'Gloss' as const,
      },
      stats: '15,000 Cans Pit Lane Allocation',
      description:
        '500ml high-capacity heavy chassis can engineered with 220mg natural caffeine and beta-alanine for extreme reaction time under 140°F cockpit temperatures.',
    },
  ];

  return (
    <section id="limited-drops" className="py-20 bg-[#05070B] border-b border-white/10 text-[#CBD5E1] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#BD00FF]">
              <Tag className="w-3.5 h-3.5 text-[#BD00FF]" />
              <span className="uppercase tracking-wider">COLLAB ARCHIVE & DROPS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-syne uppercase">
              Limited Edition <br />
              <span className="text-slate-400">Can Collaborations.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We partner with elite gaming orgs, music festivals, and independent streetwear labels to create bespoke energy drink drops with custom can finishes and exclusive formulas.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-space">
            <span>Want a Custom Clan Drop?</span>
            <span className="mx-2 text-slate-600">·</span>
            <a href="#hero-lead-form" className="text-[#00F0FF] font-bold hover:underline">
              Request 300-Can MOQ
            </a>
          </div>
        </div>

        {/* 4 Drops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DROPS.map((drop) => (
            <div
              key={drop.id}
              className="glass-cyber rounded-3xl p-7 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top ambient glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: drop.accentColor }}
              />

              <div>
                {/* Meta Top Bar */}
                <div className="flex items-center justify-between text-xs font-space mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: drop.accentColor }} />
                    <span className="font-bold text-white tracking-wider">{drop.dropCode}</span>
                  </div>
                  <span className="text-slate-400">{drop.stats}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black font-syne uppercase text-white tracking-tight mb-1">
                  {drop.title}
                </h3>

                <div className="text-xs font-space font-medium mb-4" style={{ color: drop.accentColor }}>
                  {drop.sub}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                  {drop.description}
                </p>

                {/* Visual Spec Matrix */}
                <div className="p-4 rounded-2xl bg-[#070A10] border border-white/10 mb-6 flex items-center justify-between text-xs font-space">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Formula Core</span>
                    <span className="font-bold text-white">{drop.flavor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Finish Grade</span>
                    <span className="font-bold text-slate-200">{drop.customization.finish}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Can Format</span>
                    <span className="font-bold text-slate-200">{drop.customization.bottleSize}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onLoadPresetTo3D(drop.customization);
                    showToast(`Loaded ${drop.dropCode}: ${drop.title} into 3D Lab!`, 'info');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0C1019] hover:bg-[#131926] border border-white/15 hover:border-white/40 text-white font-bold text-xs font-space flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <Eye className="w-4 h-4" style={{ color: drop.accentColor }} />
                  <span>Inspect Drop In 3D Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('hero-lead-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-4 rounded-xl text-[#05070B] font-extrabold text-xs font-space flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[44px] hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: drop.accentColor }}
                >
                  <span>Request Similar Drop</span>
                  <ArrowRight className="w-4 h-4 text-[#05070B]" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
