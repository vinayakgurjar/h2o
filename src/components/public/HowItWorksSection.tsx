import React from 'react';
import { UploadCloud, Factory, Truck, ArrowRight, Zap } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface HowItWorksProps {
  onStartEnquiry?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onStartEnquiry }) => {
  const steps = [
    {
      num: '01',
      icon: UploadCloud,
      title: 'Choose Formula & Clan Tag',
      description:
        'Select from 6 bio-engineered flavors (e.g. Cyber Blueprint or Acid Overload). Send your logo or creator insignia for instant 3D can visualization in 2 hours.',
      highlight: 'Complimentary 3D vector proof',
      accent: '#00F0FF',
    },
    {
      num: '02',
      icon: Factory,
      title: 'Cleanroom Canning & Fill',
      description:
        'Aluminium cans are cold-filled with 200mg green coffee caffeine, nootropic citicoline, and electrolytes under certified FSSAI cleanroom standards.',
      highlight: 'Zero sugar • Sterile nitrogen flush',
      accent: '#39FF14',
    },
    {
      num: '03',
      icon: Truck,
      title: '48H Doorstep Dispatch',
      description:
        'Heavy-duty corrugated cartons dispatched with road tracking directly to your esports house, nightlife venue, gym, or pop-up warehouse.',
      highlight: 'Low 300-can MOQ tier',
      accent: '#BD00FF',
    },
  ];

  const handleStepCta = () => {
    trackEvent('hero_cta_click', { cta: 'how_it_works_share_logo' });
    const el = document.getElementById('hero-lead-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-lead-form-name');
      if (input) input.focus();
    } else if (onStartEnquiry) {
      onStartEnquiry();
    }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF] mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
            <span className="uppercase tracking-wider">3-STEP EXECUTION PROTOCOL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne uppercase">
            How Custom Squad Canning Works
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            From concept mockup to ice-cold cans at your venue in under 48-72 hours.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-cyber rounded-3xl p-7 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Glow aura */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: step.accent }}
                />

                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-space font-black text-3xl text-white tracking-tight">
                      {step.num}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl bg-[#070A10] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ borderColor: `${step.accent}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.accent }} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black font-syne uppercase text-white tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-space">
                  <span className="font-bold" style={{ color: step.accent }}>
                    {step.highlight}
                  </span>
                  <span className="text-slate-500">Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Trigger */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleStepCta}
            className="py-3 px-6 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] font-black text-xs uppercase tracking-wider glow-cyan-sm transition-all inline-flex items-center gap-2 cursor-pointer font-space active:scale-95"
          >
            <span>Start Your Custom Drop</span>
            <ArrowRight className="w-4 h-4 text-[#05070B]" />
          </button>
        </div>

      </div>
    </section>
  );
};
