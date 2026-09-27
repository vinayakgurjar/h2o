import React, { useState } from 'react';
import { trackEvent } from '../../utils/analytics';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface PricingProps {
  onSelectSlab?: (slab: string) => void;
}

export const PricingTransparencySection: React.FC<PricingProps> = ({ onSelectSlab }) => {
  const [selectedFormat, setSelectedFormat] = useState<'330ml' | '500ml'>('330ml');

  const slabs = [
    {
      id: 'slab-300-1000',
      volume: '300 – 1,000 Cans',
      tag: 'Creator / Squad Drop',
      popular: false,
      moq: '300 Cans',
      rates: {
        '330ml': '₹65 – ₹72',
        '500ml': '₹85 – ₹92',
      },
      mrp: '₹135 MRP',
      turnaround: '48–72 Hours',
      features: [
        'Choice of any 6 Bio-Formulas',
        '100% Recyclable Aluminium Can',
        'Custom Clan / Brand Laser Wrap',
        'Doorstep Express Cargo Freight',
      ],
    },
    {
      id: 'slab-1000-3000',
      volume: '1,000 – 3,000 Cans',
      tag: 'Most Popular for Clubs & LANs',
      popular: true,
      moq: '1,000 Cans',
      rates: {
        '330ml': '₹52 – ₹59',
        '500ml': '₹72 – ₹78',
      },
      mrp: '₹135 MRP (~60% Margin)',
      turnaround: '48 Hours Express',
      features: [
        'Full Co-Branded Holographic / Matte Foil',
        'Split Across 2 Flavor Profiles',
        'Priority Cleanroom Batch Reservation',
        'Dedicated Squad Account Director',
        'Complimentary POS Bar Display Stands',
      ],
    },
    {
      id: 'slab-3000-10000',
      volume: '3,000 – 10,000 Cans',
      tag: 'Festival & Gym Franchises',
      popular: false,
      moq: '3,000 Cans',
      rates: {
        '330ml': '₹44 – ₹49',
        '500ml': '₹62 – ₹68',
      },
      mrp: '₹135 MRP (~68% Margin)',
      turnaround: 'Scheduled Rolling Delivery',
      features: [
        'Custom Flavors & Color Additives',
        'Split Across All 6 Flavors',
        'Palletized shrink-wrapped dispatch',
        'Co-Marketing Sponsorship Package',
      ],
    },
    {
      id: 'slab-10000-plus',
      volume: '10,000+ Cans',
      tag: 'National Distributors',
      popular: false,
      moq: '10,000 Cans',
      rates: {
        '330ml': '₹36 – ₹41',
        '500ml': '₹52 – ₹57',
      },
      mrp: 'Maximum Wholesale Tier',
      turnaround: 'Contract Cleanroom Run',
      features: [
        'Direct Container Load Logistics',
        'Exclusive Territory Protection',
        'Custom Nootropic Formulations',
        'B2B Credit & Escrow Terms',
      ],
    },
  ];

  const handleSlabSelect = (volume: string) => {
    trackEvent('pricing_slab_select', { slab: volume, format: selectedFormat });
    const el = document.getElementById('hero-lead-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-lead-form-name');
      if (input) input.focus();
    } else if (onSelectSlab) {
      onSelectSlab(volume);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF]">
            <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
            <span className="uppercase tracking-wider">WHOLESALE SLAB TRANSPARENCY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-syne uppercase">
            Direct Factory Can Pricing. <br />
            <span className="text-slate-400">Zero Hidden Markup.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hiding prices is the biggest barrier in beverage procurement. Here are our exact per-can factory tiers based on monthly commitment.
          </p>

          {/* Size Format Selector */}
          <div className="inline-flex p-1 bg-[#0C1019] rounded-xl border border-white/10 mt-2">
            <button
              type="button"
              onClick={() => setSelectedFormat('330ml')}
              className={`px-5 py-2 rounded-lg text-xs font-bold font-space transition-all cursor-pointer ${
                selectedFormat === '330ml'
                  ? 'bg-[#00F0FF] text-[#05070B] glow-cyan-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              330ml Sleek Can (Standard)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('500ml')}
              className={`px-5 py-2 rounded-lg text-xs font-bold font-space transition-all cursor-pointer ${
                selectedFormat === '500ml'
                  ? 'bg-[#00F0FF] text-[#05070B] glow-cyan-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              500ml Heavy Can (Heavy Fuel)
            </button>
          </div>
        </div>

        {/* 4 Pricing Slabs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slabs.map((slab) => (
            <div
              key={slab.id}
              className={`glass-cyber rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                slab.popular
                  ? 'border-[#00F0FF]/50 glow-cyan ring-1 ring-[#00F0FF]/30 -translate-y-1'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {slab.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00F0FF] text-[#05070B] font-black text-[10px] font-space tracking-wider uppercase shadow-md">
                  Most Popular Drop Tier
                </div>
              )}

              <div>
                <div className="text-xs font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {slab.tag}
                </div>

                <h3 className="text-xl font-black font-syne uppercase text-white tracking-tight mb-4">
                  {slab.volume}
                </h3>

                {/* Per Can Price */}
                <div className="py-4 border-y border-white/10 mb-5">
                  <div className="text-3xl font-black text-white font-space tracking-tight tabular-nums">
                    {slab.rates[selectedFormat]}
                  </div>
                  <div className="text-xs text-slate-400 font-space mt-1">
                    per {selectedFormat} can • <span className="text-[#00F0FF] font-semibold">{slab.mrp}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {slab.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSlabSelect(slab.volume)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-space flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] active:scale-95 ${
                    slab.popular
                      ? 'bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] glow-cyan-sm'
                      : 'bg-[#0C1019] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white'
                  }`}
                >
                  <span>Lock This Slab Rate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
