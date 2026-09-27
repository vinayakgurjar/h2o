import React from 'react';
import { Star, Quote, CheckCircle2, Shield, Zap } from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const partners = [
    { name: 'APEX Esports Org', category: 'Competitive Gaming' },
    { name: 'Tokyo 4AM Collective', category: 'Nightlife & Raves' },
    { name: 'KINETIC Skateparks', category: 'Action Sports' },
    { name: 'VOID Tactical Wear', category: 'Streetwear Label' },
    { name: 'Velocity Track Racing', category: 'Drift Motorsports' },
    { name: 'HackMatrix Arena', category: 'Tech Conclaves' },
  ];

  const testimonials = [
    {
      quote:
        'Switching our gaming squad from Monster to H2O Cyber Blueprint eliminated mid-match brain fog completely. Our aim stability in hour 6 of scrims is night and day — no hand tremors, just pure razor focus.',
      name: 'Vikram "Viper" Rathore',
      role: 'Team Captain & IGL',
      business: 'APEX Esports Org',
      order: 'Bi-Weekly 1,500 Cans (Cyber Blueprint)',
    },
    {
      quote:
        'We stocked 5,000 cans of Void Drive and Tokyo Neon for our 3-day underground music festival. The crowd loved the clean taste, and our bar revenue went up 40% because people drink them straight all night without a hangover.',
      name: 'Ananya Deshmukh',
      role: 'Festival Director',
      business: 'Neon Horizon Music Fest',
      order: 'Event Batch: 5,000 Cans (330ml)',
    },
    {
      quote:
        'We created custom laser-imprinted H2O cans for our new streetwear capsule release. The matte obsidian cans looked so sick people were buying them as art pieces and posting unboxing TikToks. Incredible quality.',
      name: 'Kabir Singhania',
      role: 'Creative Director & Founder',
      business: 'VOID Tactical Streetwear',
      order: 'Limited Drop: 800 Cans (Matte Obsidian)',
    },
  ];

  return (
    <section id="social-proof" className="py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF] mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
            <span className="uppercase tracking-wider">CULTURE REPUTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne uppercase">
            Validated by Pro Clans & Creators
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            See what esports captains, festival heads, and streetwear founders say about H2O.
          </p>
        </div>

        {/* Partner Logos Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="glass-cyber rounded-2xl p-4 text-center border border-white/10 flex flex-col justify-center items-center hover:border-[#00F0FF]/40 transition-colors"
            >
              <span className="text-xs font-black font-syne uppercase text-white truncate max-w-full">
                {partner.name}
              </span>
              <span className="text-[10px] text-[#00F0FF] font-space mt-0.5 truncate max-w-full">
                {partner.category}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-cyber rounded-3xl p-7 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#00F0FF]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#00F0FF]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="font-bold text-white font-space text-sm">
                  {t.name}
                </div>
                <div className="text-xs text-slate-400">
                  {t.role} • <span className="text-white">{t.business}</span>
                </div>
                <div className="text-[10px] font-space text-[#00F0FF] mt-1 font-semibold">
                  {t.order}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
