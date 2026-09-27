import React from 'react';
import { Coffee, UtensilsCrossed, Hotel, PartyPopper, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

interface HospitalityShowcaseProps {
  onSelectSpace: (space: string) => void;
}

export const HospitalityShowcaseSection: React.FC<HospitalityShowcaseProps> = ({ onSelectSpace }) => {
  const SHOWCASE_CARDS = [
    {
      id: 'cafe',
      tag: 'CAFÉ & ROASTER',
      title: 'Artisan Espresso Bars',
      desc: 'Replaces cheap supermarket bottles on dark terrazzo and white Carrara marble tables. Matches your specialty roast branding.',
      recommended: '500ML Scandi Minimal or Bold',
      accent: '#BD00FF',
      icon: Coffee,
      vibe: 'Flat-Lay Social Friendly',
    },
    {
      id: 'restaurant',
      tag: 'FINE DINING & BISTRO',
      title: 'Contemporary Culinary Tables',
      desc: 'Pairs with plated gastronomy and bespoke stemware. Engineered to sit cold without condensation water pools on tablecloths.',
      recommended: '500ML Luxury Serif with Gold Foil',
      accent: '#00F0FF',
      icon: UtensilsCrossed,
      vibe: 'Refined Table Service',
    },
    {
      id: 'hotel',
      tag: 'BOUTIQUE RESORT & HOTEL',
      title: 'Guest Suites & Turndown',
      desc: 'Greets guests in executive rooms, presidential suites, and spa pavilions as an extension of luxury hospitality prestige.',
      recommended: '1L Executive Centerpiece',
      accent: '#F5D77F',
      icon: Hotel,
      vibe: 'VIP Bedside Turndown',
    },
    {
      id: 'event',
      tag: 'FESTIVAL & VIP BOOTH',
      title: 'Music Raves & Fashion Pop-ups',
      desc: 'High-voltage hydration for all-night music festivals, streetwear pop-ups, and celebrity wedding banquets.',
      recommended: '500ML Cyber Streetwear Series',
      accent: '#FF007F',
      icon: PartyPopper,
      vibe: '4 AM Sunrise Fuel',
    },
    {
      id: 'corporate',
      tag: 'BOARDROOM & TECH CONCLAVE',
      title: 'Executive Conference Hubs',
      desc: 'Commands focus during high-stakes board meetings, venture pitch days, and tech hackathons with cleanroom purity.',
      recommended: '1L Executive Suite Black Cap',
      accent: '#39FF14',
      icon: Briefcase,
      vibe: 'Institutional Authority',
    },
  ];

  return (
    <section id="showcase" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 cyber-grid relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#BD00FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#0B0E23] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#BD00FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#BD00FF]" />
              <span className="uppercase tracking-wider">HOSPITALITY SHOWCASE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-syne uppercase">
              BUILT FOR THE EXPERIENCE.
            </h2>

            <p className="text-base text-slate-300 font-normal leading-relaxed">
              Every card is engineered like a high-fashion advertising campaign. See how custom bottles look across diverse hospitality environments.
            </p>
          </div>

          <div className="text-xs font-space text-slate-400">
            <span>Scroll Horizontally or Select Space</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-white font-bold">5 Environments</span>
          </div>
        </div>

        {/* 5-Card Responsive Showcase Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SHOWCASE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="glass-cyber rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Accent line top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                  style={{ backgroundColor: card.accent }}
                />

                <div>
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl bg-[#070A10] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ borderColor: `${card.accent}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: card.accent }} />
                    </div>

                    <span className="text-[10px] font-space font-bold uppercase tracking-wider" style={{ color: card.accent }}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-syne uppercase text-white tracking-tight mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-space uppercase block">Recommended</span>
                    <span className="text-xs font-bold text-white font-space">{card.recommended}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSpace(card.title)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#070A10] hover:bg-[#151B3B] border border-white/10 hover:border-white/30 text-white font-bold text-xs font-space flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Customize For This</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: card.accent }} />
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
