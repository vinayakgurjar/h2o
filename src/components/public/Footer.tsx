import React from 'react';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  ShieldCheck,
  Lock,
  Zap,
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const handlePhoneClick = () => {
    trackEvent('phone_click', { source: 'footer' });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { source: 'footer' });
  };

  return (
    <footer className="bg-[#05070B] border-t border-white/10 text-white pt-14 pb-24 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio-Engine (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-syne tracking-tight text-white">
                H2O
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] inline-block ml-0.5 animate-pulse" />
              <span className="text-[10px] font-space uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0C1019] border border-white/10 text-slate-400 ml-2">
                ENERGY FUEL V3.2
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-normal">
              Next-generation bio-adaptive energy fuel engineered for esports clans, music festivals, creators, and night culture. Zero sugar. 200mg green coffee caffeine. Pure neural velocity.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 font-space">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                <span>FSSAI Central Licence: {LEAD_CONFIG.fssaiNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
                <span>Anti-Doping Tested • 100% Recyclable Aluminium</span>
              </div>
            </div>
          </div>

          {/* Col 2: Direct Contact & Hotline (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-space">
              Direct Squad Hotline
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-300 font-space">
              <li>
                <a
                  href={`tel:${LEAD_CONFIG.phone}`}
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2 hover:text-[#00F0FF] transition-colors py-1 min-h-[36px]"
                >
                  <Phone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>{LEAD_CONFIG.formattedPhone}</span>
                </a>
              </li>

              <li>
                <a
                  href={LEAD_CONFIG.getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-2 hover:text-[#00F0FF] transition-colors py-1 min-h-[36px]"
                >
                  <MessageSquare className="w-4 h-4 text-[#39FF14] shrink-0" />
                  <span>WhatsApp: {LEAD_CONFIG.phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${LEAD_CONFIG.email}`}
                  className="flex items-center gap-2 hover:text-[#00F0FF] transition-colors py-1 min-h-[36px]"
                >
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{LEAD_CONFIG.email}</span>
                </a>
              </li>

              <li className="flex items-start gap-2 pt-1 text-slate-400 leading-snug">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{LEAD_CONFIG.facilityAddress}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Facility Map Embed (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-space">
              Factory & Dispatch Lab
            </h4>

            <div className="w-full h-36 rounded-2xl overflow-hidden border border-white/10 relative shadow-inner bg-[#070A10]">
              <iframe
                title="H2O Facility Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.55998246342!2d75.793739!3d22.753284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396302a690757c21%3A0x6291a134a9ef3878!2sSanwer%20Road%20Industrial%20Area%2C%20Indore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Access */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-space">
          <div>
            © {new Date().getFullYear()} H2O Energy Fuel. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#products" className="hover:text-white transition-colors">
              Bottles & Cans
            </a>
            <span aria-hidden="true">·</span>
            <a href="#customizer" className="hover:text-white transition-colors">
              3D Customizer
            </a>
            <span aria-hidden="true">·</span>
            <a href="#the-culture" className="hover:text-white transition-colors">
              Squad Drops
            </a>
            <span aria-hidden="true">·</span>
            <a href="#pricing" className="hover:text-white transition-colors">
              Wholesale Slabs
            </a>
            <span aria-hidden="true">·</span>

            {/* Discreet Admin Login Link */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-1"
                title="Staff Operating System"
              >
                <Lock className="w-3 h-3 text-[#00F0FF]" />
                <span>Internal OS</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
