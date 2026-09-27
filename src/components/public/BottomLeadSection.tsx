import React from 'react';
import { LeadEnquiryForm } from './LeadEnquiryForm';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { MessageSquare, PhoneCall, ShieldCheck, Zap } from 'lucide-react';

export const BottomLeadSection: React.FC = () => {
  const handlePhoneClick = () => {
    trackEvent('phone_click', { cta: 'bottom_section_phone' });
  };

  return (
    <section id="bottom-lead-section" className="py-20 bg-[#05070B] border-b border-white/10 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Direct Action & Squad Desk */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs text-[#00F0FF] font-space font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
              <span>FREE 3D CUSTOM CAN PROOF WITHIN 2 HOURS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] font-syne uppercase">
              Ready to Drop H2O <br />
              <span className="text-slate-400">At Your Next Event?</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Send us your estimated squad volume today. We will calculate your exact volume tier discount, format your logo mockup onto our 3D can silhouette, and dispatch tasting samples directly to you.
            </p>

            {/* Quick Touchpoints */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={LEAD_CONFIG.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { cta: 'bottom_section_whatsapp' })}
                className="py-3.5 px-5 rounded-xl bg-[#0C1019] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] font-space"
              >
                <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                <span>WhatsApp Hotline: {LEAD_CONFIG.phone}</span>
              </a>

              <a
                href={`tel:${LEAD_CONFIG.phone}`}
                onClick={handlePhoneClick}
                className="py-3.5 px-5 rounded-xl bg-[#0C1019] hover:bg-[#131926] border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] font-space"
              >
                <PhoneCall className="w-4 h-4 text-[#39FF14]" />
                <span>Call Director: {LEAD_CONFIG.formattedPhone}</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 font-space">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>Direct factory wholesale • B2B GST tax invoice • FSSAI certified lab</span>
            </div>
          </div>

          {/* Right Column: Fast Enquiry Form (Compact) */}
          <div className="lg:col-span-6">
            <LeadEnquiryForm
              id="bottom-lead-form"
              variant="compact"
              title="Fast Squad Drop Inquiry"
              subtitle="Lock in priority batch dates and free 3D design rendering."
            />
          </div>

        </div>
      </div>
    </section>
  );
};
