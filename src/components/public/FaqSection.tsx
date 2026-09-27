import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, Zap } from 'lucide-react';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for custom cans?',
      a: `Our standard squad drop MOQ is just ${LEAD_CONFIG.moqBottles} cans. For tournaments, events, or multi-venue chains ordering 1,000+ cans, we offer scheduled rolling deliveries so you don't overwhelm your on-site cold storage.`,
    },
    {
      q: 'How fast can our custom cans be produced and delivered?',
      a: `For standard flavor drops, delivery takes ${LEAD_CONFIG.deliveryTurnaround} via express road freight. For custom co-branded cans with your own clan artwork and sponsor logos, production takes 3 to 5 business days after digital 3D proof sign-off.`,
    },
    {
      q: 'Can we mix different flavors in a single wholesale order?',
      a: 'Yes! On orders of 1,000 cans and above, you can split your batch across any of our 6 bio-formulas (e.g. Cyber Blueprint, Acid Overload, Void Drive, Solar Inferno, Neon Tokyo, Ghost Zero) at no extra setup charge.',
    },
    {
      q: 'What is the caffeine source and why is there no crash?',
      a: 'We use 200mg of 100% natural caffeine extracted from green coffee beans, paired with 100mg of L-Theanine in a 2:1 neural ratio. L-Theanine smooths out the vascular spike, preventing jittery crosshairs and eliminating the sudden 90-minute sugar collapse typical of grocery energy drinks.',
    },
    {
      q: 'What artwork format should I provide for clan / event logos?',
      a: 'We accept vector files (AI, EPS, SVG, PDF) or high-res transparent PNGs (at least 300 DPI). Our in-house design crew will composite your insignia onto the 3D can chassis and send a 3D proof within 2 hours.',
    },
    {
      q: 'Are H2O energy cans certified safe and compliant?',
      a: `Yes. All H2O formulas are manufactured under central FSSAI license ${LEAD_CONFIG.fssaiNumber}, formulated with zero banned performance substances, and packaged in 100% infinitely recyclable aluminium sleek cans.`,
    },
  ];

  const toggleAccordion = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    if (isOpening) {
      trackEvent('faq_expand', { question: faqs[index].q });
    }
  };

  return (
    <section id="faq" className="py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF] mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
            <span className="uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne uppercase">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Clear facts regarding batch sizes, formulas, artwork proofing, and freight delivery.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-cyber rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-syne font-bold uppercase text-sm sm:text-base text-white tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#070A10] border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF]' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center p-6 rounded-2xl glass-cyber border border-white/10">
          <p className="text-xs text-slate-300">
            Have a custom flavor specification, festival sponsorship inquiry, or distributor partnership?
          </p>
          <a
            href={LEAD_CONFIG.getWhatsAppUrl('Hi H2O team, I have a specific question about squad supply.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-[#00F0FF] hover:underline font-space"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Directly with H2O Crew on WhatsApp →</span>
          </a>
        </div>

      </div>
    </section>
  );
};
