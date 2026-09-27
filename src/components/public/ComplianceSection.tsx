import React from 'react';
import { ShieldCheck, Zap, Activity, Check, X, Atom, Sparkles } from 'lucide-react';

export const ComplianceSection: React.FC = () => {
  const COMPARISONS = [
    {
      feature: 'Added Refined Sugar',
      h2o: '0g (Zero Sugar Spike)',
      legacy: '27g – 36g (Syrup Crash)',
      coffee: '0g (Bitter / Acidic)',
      h2oBetter: true,
    },
    {
      feature: 'Caffeine Origin',
      h2o: '200mg Natural Green Coffee Bean',
      legacy: '160mg Synthetic Petroleum Anhydrous',
      coffee: '120mg Variable Roast',
      h2oBetter: true,
    },
    {
      feature: 'Nootropic Focus Matrix',
      h2o: 'Cognizin® Citicoline + L-Theanine',
      legacy: 'None (Sugar & Artificial Taurine)',
      coffee: 'None',
      h2oBetter: true,
    },
    {
      feature: 'Crash & Jitter Factor',
      h2o: 'Zero Crash (Smooth 6-Hour Flow Curve)',
      legacy: 'Violent 90-Min Collapse & Brain Fog',
      coffee: 'Tremors, Jitters & Gastro Distress',
      h2oBetter: true,
    },
    {
      feature: 'Cellular Hydration',
      h2o: 'Bio-Osmotic Himalayan Pink Salt + K+',
      legacy: 'Dehydrating Diuretic Sodium',
      coffee: 'Dehydrating Diuretic',
      h2oBetter: true,
    },
    {
      feature: 'Caloric Impact',
      h2o: '10 kcal (Keto & Fasting Friendly)',
      legacy: '160 – 210 Empty Calories',
      coffee: '5 kcal (Black)',
      h2oBetter: true,
    },
  ];

  const PILLARS = [
    {
      icon: Atom,
      title: '2:1 Neural Golden Ratio',
      desc: '200mg clean caffeine paired with 100mg L-Theanine to stimulate alpha brainwaves. You gain razor-sharp mental focus without the hand tremors or accelerated anxiety.',
      accent: '#00F0FF',
    },
    {
      icon: Zap,
      title: 'Cognizin® Synaptic Boost',
      desc: 'Clinically tested Citicoline provides essential precursors for acetylcholine synthesis, supporting faster visual-motor reaction times in high-stakes gaming and sports.',
      accent: '#39FF14',
    },
    {
      icon: Activity,
      title: 'Full-Spectrum Osmolytes',
      desc: 'Infused with mineral potassium, magnesium malate, and unrefined pink salt to replenish electrolytes lost during intense physical exertion and long festival nights.',
      accent: '#BD00FF',
    },
    {
      icon: ShieldCheck,
      title: 'Certified Cleanroom Standards',
      desc: 'Manufactured in automated FSSAI-licensed facility with zero banned performance substances, 100% recyclable aluminium cans, and strict batch sterility audits.',
      accent: '#FF007F',
    },
  ];

  return (
    <section id="bio-matrix" className="py-20 bg-[#05070B] border-b border-white/10 text-[#CBD5E1] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#39FF14]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39FF14]" />
            <span className="uppercase tracking-wider">CLINICAL PERFORMANCE MATRIX</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-syne uppercase">
            Why H2O Crushes <br />
            <span className="text-slate-400">Legacy Energy Drinks.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop poisoning your cognitive engine with 35 grams of high-fructose corn syrup and synthetic chemical sludge. H2O was formulated by biohackers and sports scientists to deliver pure mental velocity.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="glass-cyber rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-16 overflow-x-auto">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-4 pb-4 border-b border-white/10 text-xs font-space font-bold uppercase tracking-wider text-slate-400">
              <div>Ingredient / Effect</div>
              <div className="text-[#00F0FF] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <span className="text-sm font-black text-white">H2O NEXT-GEN FUEL</span>
              </div>
              <div>Legacy Sugar Drinks</div>
              <div>Black Coffee</div>
            </div>

            <div className="divide-y divide-white/5">
              {COMPARISONS.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 py-4 text-xs items-center hover:bg-white/[0.02] transition-colors">
                  <div className="font-bold text-white font-space pr-2">{row.feature}</div>
                  
                  {/* H2O column */}
                  <div className="font-semibold text-white flex items-center gap-1.5 pr-2">
                    <Check className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span className="text-glow-cyan">{row.h2o}</span>
                  </div>

                  {/* Legacy column */}
                  <div className="text-slate-400 flex items-center gap-1.5 pr-2">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{row.legacy}</span>
                  </div>

                  {/* Coffee column */}
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                    <span>{row.coffee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Bio-Science Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="glass-cyber rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl bg-[#070A10] border border-white/10 flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{ borderColor: `${p.accent}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: p.accent }} />
                  </div>

                  <h3 className="text-lg font-black font-syne uppercase text-white tracking-tight mb-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-space uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span>Clinical Efficacy Verified</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
