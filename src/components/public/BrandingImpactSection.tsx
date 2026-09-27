import React from 'react';
import { Eye, Clock, Instagram, QrCode, Shield, Sparkles } from 'lucide-react';

export const BrandingImpactSection: React.FC = () => {
  const METRICS = [
    {
      stat: '45+ MIN',
      title: 'Continuous Table Dwell Time',
      desc: 'Unlike menus that get tucked away after ordering, your custom bottle stays on the table throughout the entire meal.',
      accent: '#BD00FF',
    },
    {
      stat: '100%',
      title: 'Instagram Flat-Lay Organic Recall',
      desc: 'When guests photograph their food or latte art, your branded bottle sits in the frame for every story and post.',
      accent: '#00F0FF',
    },
    {
      stat: '500ML & 1L',
      title: 'Collectible Architect Profiles',
      desc: 'Ergonomic virgin PET silhouettes that feel substantial, cold, and premium to hold.',
      accent: '#39FF14',
    },
    {
      stat: 'YOUR LOGO',
      title: '2400 DPI Waterproof Print',
      desc: 'High-definition synthetic BOPP wrap that never peels, wrinkles, or degrades inside chilled ice buckets.',
      accent: '#FF007F',
    },
    {
      stat: 'YOUR QR',
      title: 'Instant Digital Menu & Review Link',
      desc: 'Convert thirsty guests into repeat followers, Google reviews, or digital loyalty members with a scan.',
      accent: '#F5D77F',
    },
    {
      stat: 'YOUR STORY',
      title: 'Elevates Overall Venue Perception',
      desc: 'Guests notice the small details. Custom packaging signals uncompromised hospitality craftsmanship.',
      accent: '#BD00FF',
    },
  ];

  return (
    <section id="impact" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 cyber-grid relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#BD00FF]/10 via-[#00F0FF]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0B0E23] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#BD00FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#BD00FF]" />
            <span className="uppercase tracking-wider">HOSPITALITY ROI</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-syne uppercase">
            ONE BOTTLE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD00FF] via-white to-[#00F0FF]">
              MULTIPLE TOUCHPOINTS.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Why pay for digital ads when your dining tables already command undivided customer attention for 45+ minutes?
          </p>
        </div>

        {/* 6 Oversized Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METRICS.map((item, idx) => (
            <div
              key={idx}
              className="glass-cyber rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle top edge glow indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                style={{ backgroundColor: item.accent }}
              />

              <div>
                <div
                  className="text-4xl sm:text-5xl font-black font-syne uppercase tracking-tight text-white mb-3"
                  style={{ textShadow: `0 0 25px ${item.accent}40` }}
                >
                  {item.stat}
                </div>

                <h3 className="text-base font-bold font-space text-white uppercase tracking-wide mb-3">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-space">
                <span className="text-slate-400 font-medium">Verified Hospitality Metric</span>
                <span className="font-bold" style={{ color: item.accent }}>
                  0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
