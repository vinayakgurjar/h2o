import React from 'react';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { Phone, MessageSquare, Zap } from 'lucide-react';

interface MobileStickyBarProps {
  onScrollToForm?: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onScrollToForm }) => {
  const handlePhoneClick = () => {
    trackEvent('phone_click', { source: 'mobile_sticky_bar' });
  };

  const handleQuoteClick = () => {
    trackEvent('hero_cta_click', { source: 'mobile_sticky_bar_quote' });
    const el = document.getElementById('hero-lead-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-lead-form-name');
      if (input) input.focus();
    } else if (onScrollToForm) {
      onScrollToForm();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#05070B]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        
        {/* Call Button */}
        <a
          href={`tel:${LEAD_CONFIG.phone}`}
          onClick={handlePhoneClick}
          className="flex-1 py-2 px-2 rounded-xl bg-[#0C1019] active:bg-[#131926] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer font-space"
        >
          <Phone className="w-4 h-4 text-[#39FF14]" />
          <span>Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={LEAD_CONFIG.getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { source: 'mobile_sticky_bar' })}
          className="flex-1 py-2 px-2 rounded-xl bg-[#0C1019] active:bg-[#131926] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer font-space"
        >
          <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
          <span>WhatsApp</span>
        </a>

        {/* Get Pricing Quote Button */}
        <button
          type="button"
          onClick={handleQuoteClick}
          className="flex-[1.5] py-2 px-3 rounded-xl bg-[#00F0FF] active:bg-[#38BDF8] text-[#05070B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 glow-cyan-sm min-h-[44px] cursor-pointer font-space"
        >
          <Zap className="w-3.5 h-3.5 fill-[#05070B]" />
          <span>Squad Supply</span>
        </button>

      </div>
    </div>
  );
};
