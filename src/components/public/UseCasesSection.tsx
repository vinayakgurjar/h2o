import React from 'react';
import { trackEvent } from '../../utils/analytics';
import { ArrowRight, Gamepad2, Disc3, Shirt, Flame, Cpu } from 'lucide-react';

interface UseCasesProps {
  onSelectUseCase?: (useCase: string) => void;
}

export const UseCasesSection: React.FC<UseCasesProps> = ({ onSelectUseCase }) => {
  const useCases = [
    {
      id: 'esports-arenas',
      title: 'Esports LANs & Arenas',
      icon: Gamepad2,
      oneLiner: 'Custom cans with clan watermarks that keep your pro roster locked in at 120 FPS with zero mouse jitter.',
      accent: '#00F0FF',
      recommendedSize: '330ml Cyber Blueprint',
    },
    {
      id: 'nightlife-lounges',
      title: 'Nightlife & Festival Stages',
      icon: Disc3,
      oneLiner: 'VIP table service and mainstage crew fuel that powers 4 AM raves without the alcohol lethargy.',
      accent: '#BD00FF',
      recommendedSize: '330ml Void Drive',
    },
    {
      id: 'streetwear-drops',
      title: 'Streetwear & Creator Drops',
      icon: Shirt,
      oneLiner: 'Co-branded collector cans for clothing line launches and influencer unboxings that fans hold onto forever.',
      accent: '#FF007F',
      recommendedSize: '330ml Matte Obsidian',
    },
    {
      id: 'extreme-sports',
      title: 'Skate Parks & Drift Tracks',
      icon: Flame,
      oneLiner: 'Explosive thermogenic adrenaline fuel engineered for high-impact action sports and track paddocks.',
      accent: '#FF5E00',
      recommendedSize: '500ml Heavy Solar Inferno',
    },
    {
      id: 'tech-hackathons',
      title: 'Hackathons & Startup Conclaves',
      icon: Cpu,
      oneLiner: 'Clean cognitive bandwidth for 36-hour code sprints and neural network training without 3 PM crash.',
      accent: '#39FF14',
      recommendedSize: '330ml Acid Overload',
    },
  ];

  const handleUseCaseClick = (title: string) => {
    trackEvent('use_case_view', { useCase: title });
    const el = document.getElementById('hero-lead-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-lead-form-name');
      if (input) input.focus();
    } else if (onSelectUseCase) {
      onSelectUseCase(title);
    }
  };

  return (
    <section id="use-cases" className="py-16 sm:py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-space font-bold uppercase tracking-wider text-[#00F0FF] mb-2">
            PROVEN IN THE FIELD
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne uppercase">
            Where H2O Commands Attention
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Engineered to replace generic grocery energy drinks with high-recall cultural impact.
          </p>
        </div>

        {/* 5 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.id}
                className="glass-cyber rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Styled Icon & Accent Indicator */}
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#070A10] border border-white/10 flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ borderColor: `${uc.accent}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: uc.accent }} />
                  </div>

                  <h3 className="text-lg font-black font-syne uppercase text-white tracking-tight mb-2">
                    {uc.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                    {uc.oneLiner}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-[10px] font-space text-slate-400">
                    <span className="block text-slate-500 uppercase">Recommended Can</span>
                    <span className="font-bold text-white">{uc.recommendedSize}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUseCaseClick(uc.title)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#070A10] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white font-bold text-xs font-space flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                  >
                    <span>Supply Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: uc.accent }} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
