import React, { useState } from 'react';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { MessageSquare, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onScrollToForm?: () => void;
  onScrollToCustomizer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToForm, onScrollToCustomizer }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '3D Bottle Lab', targetId: 'customizer' },
    { label: 'Pick Bottle', targetId: 'products' },
    { label: 'Before / After', targetId: 'comparison' },
    { label: 'Touchpoints', targetId: 'impact' },
    { label: 'Experiences', targetId: 'showcase' },
    { label: 'Wholesale', targetId: 'lead-generation-hub' },
  ];

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    trackEvent('hero_cta_click', { source: 'navbar_create_bottle' });
    if (onScrollToCustomizer) {
      onScrollToCustomizer();
    } else {
      const el = document.getElementById('customizer');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBulkClick = () => {
    setMobileMenuOpen(false);
    trackEvent('hero_cta_click', { source: 'navbar_bulk' });
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
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Zone 1: Single text element wordmark with futuristic presence */}
          <a
            href="#"
            className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black tracking-tighter text-white hover:text-[#BD00FF] transition-colors shrink-0 group"
          >
            <span className="font-syne font-black tracking-tight text-white group-hover:text-[#BD00FF] transition-colors">
              H2O
            </span>
            <span className="w-2 h-2 rounded-full bg-[#BD00FF] shadow-[0_0_8px_#BD00FF] inline-block ml-0.5 animate-pulse" />
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider uppercase text-slate-300 font-space">
            {navLinks.map((link) => (
              <button
                key={link.targetId}
                type="button"
                onClick={() => handleNavClick(link.targetId)}
                className="hover:text-[#00F0FF] transition-colors cursor-pointer py-1 relative group whitespace-nowrap"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#BD00FF] transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3 font-space">
            <a
              href={LEAD_CONFIG.getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { source: 'navbar' })}
              className="py-2.5 px-3.5 rounded-xl bg-[#0B0E23] hover:bg-[#151B3B] border border-white/10 hover:border-[#00F0FF]/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="whitespace-nowrap">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCtaClick}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#BD00FF] to-[#9333EA] hover:from-[#A855F7] hover:to-[#7E22CE] text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 glow-purple-sm transition-all cursor-pointer min-h-[44px] whitespace-nowrap active:scale-95"
            >
              <span>CREATE BOTTLE →</span>
            </button>
          </div>

          {/* Mobile Actions & Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleCtaClick}
              className="py-2 px-3 rounded-lg bg-[#BD00FF] text-white font-extrabold text-[11px] min-h-[44px] flex items-center tracking-wider uppercase font-space"
            >
              Create Bottle
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#0B0E23] border border-white/10 text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#BD00FF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/10 py-4 px-2 space-y-2 bg-[#050505]/95 backdrop-blur-2xl">
            {navLinks.map((link) => (
              <button
                key={link.targetId}
                type="button"
                onClick={() => handleNavClick(link.targetId)}
                className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase text-slate-300 hover:text-[#00F0FF] hover:bg-[#0B0E23] transition-colors min-h-[44px] flex items-center justify-between font-space"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ))}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2 font-space">
              <a
                href={LEAD_CONFIG.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  trackEvent('whatsapp_click', { source: 'navbar_mobile' });
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-[#0B0E23] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full py-2.5 px-3 rounded-lg bg-[#BD00FF] text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>CREATE YOUR BOTTLE →</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
