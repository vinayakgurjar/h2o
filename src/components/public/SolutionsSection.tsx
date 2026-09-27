import React from 'react';
import { Gamepad2, Disc3, Shirt, Flame, Cpu, Users, ArrowUpRight } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  const SQUADS = [
    {
      icon: Gamepad2,
      title: 'Esports & Gaming Clans',
      subtitle: 'Zero Jitter • 120 FPS Reflex Matrix',
      description:
        'Engineered for 8-hour tournament grinds and clutch competitive matches. Citicoline accelerates synaptic acetylcholine transmission while L-Theanine prevents the jittery crosshair shake of cheap sugary drinks.',
      accent: '#00F0FF',
      moq: '500 Cans Clan Drop',
      popularFormat: '330ml Cyber Blueprint',
      tag: 'Ranked Fuel',
    },
    {
      icon: Disc3,
      title: 'Nightlife, Raves & Music Festivals',
      subtitle: '4 AM Sunrise Fuel • Clean Hydration',
      description:
        'High-voltage stamina for warehouse raves, festival stages, and VIP clubs. Rapid osmotic electrolytes prevent dehydration while 200mg green coffee caffeine powers dancefloors without next-day hangover blues.',
      accent: '#BD00FF',
      moq: '1,000 Cans Stage Bar',
      popularFormat: '330ml Void Drive',
      tag: 'Stage Grade',
    },
    {
      icon: Shirt,
      title: 'Streetwear & Creator Drops',
      subtitle: 'Co-Branded Limited Cans • Hype Pop-Ups',
      description:
        'Elevate fashion pop-up lines, merch lookbooks, and creator collabs. We laser-imprint your clothing label or creator insignia with metallic foil and matte obsidian finishes that fans collect like art.',
      accent: '#FF007F',
      moq: '300 Cans Limited Drop',
      popularFormat: '330ml Matte Obsidian',
      tag: 'Limited Capsule',
    },
    {
      icon: Flame,
      title: 'Extreme Sports & Drift Motorsports',
      subtitle: 'Adrenaline Shock • Heart-Rate Surge',
      description:
        'Built for downhill skaters, BMX athletes, drift tracks, and combat sports athletes. Beta-alanine and potassium citrates fuel explosive power and instant muscle glycogen availability.',
      accent: '#FF5E00',
      moq: '500 Cans Paddock Supply',
      popularFormat: '500ml Solar Inferno',
      tag: 'Adrenaline Matrix',
    },
    {
      icon: Cpu,
      title: 'Hackathons & AI Sprints',
      subtitle: 'Cognitive Flow State • Sustained Attention',
      description:
        'Fuel for 48-hour hackathon marathons, deep model training sprints, and nocturnal engineering sessions. Keeps neuro-receptors firing at peak cognitive bandwidth without the steep 3 PM crash.',
      accent: '#39FF14',
      moq: '250 Cans Sprint Pack',
      popularFormat: '330ml Acid Overload',
      tag: 'Neural Plasticity',
    },
    {
      icon: Users,
      title: 'Gym Chains & Crossfit Boxes',
      subtitle: 'Pre-Workout Drive • Clean Energy Stocking',
      description:
        'Wholesale stock for forward-thinking fitness clubs and boutique studios. 100% natural caffeine, 0 sugar, zero synthetic food colorants, and third-party certified banned-substance-free.',
      accent: '#E2E8F0',
      moq: '1,000 Cans Franchise Retail',
      popularFormat: '330ml Ghost Zero & Inferno',
      tag: 'Tested Clean',
    },
  ];

  return (
    <section id="the-culture" className="py-20 bg-[#05070B] border-b border-white/10 text-[#CBD5E1] cyber-grid-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF]">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="uppercase tracking-wider">CULTURE & SQUAD PROTOCOLS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-syne uppercase">
            Built For The Subcultures <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#BD00FF]">
              That Never Sleep.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Conventional energy drinks are stuck in 2005 with sugar spikes and artificial syrupy garbage. H2O is designed for the modern Gen-Z subcultures pushing human velocity.
          </p>
        </div>

        {/* 6 Culture Squad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SQUADS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-cyber rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Glow aura */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: item.accent }}
                />

                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl bg-[#070A10] border border-white/10 flex items-center justify-center transition-all group-hover:scale-105"
                      style={{ borderColor: `${item.accent}40` }}
                    >
                      <Icon className="w-6 h-6 transition-colors" style={{ color: item.accent }} />
                    </div>

                    <div className="text-xs font-space text-slate-400">
                      <span style={{ color: item.accent }} className="font-bold">{item.tag}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black font-syne uppercase text-white tracking-tight mb-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-xs font-space text-slate-400 mb-3" style={{ color: `${item.accent}cc` }}>
                    {item.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-space">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Drop Spec</span>
                    <span className="font-bold text-white">{item.popularFormat}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('hero-lead-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded-lg bg-[#070A10] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                    title={`Request ${item.title} Squad Drop`}
                    aria-label={`Request ${item.title} Squad Drop`}
                  >
                    <ArrowUpRight className="w-4 h-4" style={{ color: item.accent }} />
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
