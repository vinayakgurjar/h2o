import React, { useState } from 'react';
import { Bottle3DCanvas } from '../3d/Bottle3DCanvas';
import { BottleCustomization, BottleSize, BottleStyle, BusinessType } from '../../types';
import { store } from '../../services/store';
import { addLeadToFirestore } from '../../services/firebase';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { showToast } from '../../utils/toast';
import {
  X,
  Sparkles,
  CheckCircle2,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Send,
  ExternalLink,
  MessageSquare,
  Zap,
} from 'lucide-react';

interface BottleCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: (tab?: string) => void;
}

export const BottleCustomizerModal: React.FC<BottleCustomizerModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAdmin,
}) => {
  const [customization, setCustomization] = useState<BottleCustomization>({
    bottleSize: '500ml',
    bottleStyle: 'Sleek Nordic Cylinder',
    capColor: '#00F0FF',
    labelColor: '#00F0FF',
    labelStyle: 'Custom Full-Wrap',
    brandName: 'H2O CLAN',
    tagline: 'BIO-ADAPTIVE NEURAL ENERGY',
    finish: 'Matte',
  });

  const [neonColor, setNeonColor] = useState('#00F0FF');
  const [flavorTitle, setFlavorTitle] = useState('CYBER BLUEPRINT');
  const [quantity, setQuantity] = useState<number>(1000);

  // Form Details
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Indore');
  const [businessType, setBusinessType] = useState<BusinessType>('Café');
  const [requiredDate, setRequiredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const NEON_PRESETS = [
    { name: 'Cyber Cyan', hex: '#00F0FF', flavor: 'CYBER BLUEPRINT' },
    { name: 'Toxic Lime', hex: '#39FF14', flavor: 'ACID OVERLOAD' },
    { name: 'Ultraviolet', hex: '#BD00FF', flavor: 'VOID DRIVE' },
    { name: 'Hot Pink', hex: '#FF007F', flavor: 'NEON TOKYO' },
    { name: 'Solar Orange', hex: '#FF5E00', flavor: 'SOLAR INFERNO' },
  ];

  const FINISH_OPTIONS = ['Matte', 'Gloss', 'Metallic Foil'] as const;

  // Approximate wholesale pricing
  const ratePerCan = quantity >= 3000 ? 46 : quantity >= 1000 ? 55 : 68;
  const totalAmount = ratePerCan * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone) {
      showToast('Please fill in business/venue name, contact name, and phone number.', 'error');
      return;
    }

    const newLead = store.createLead({
      businessName,
      contactName,
      phone,
      email: email || `${phone}@h2oenergy.com`,
      city: city || 'Indore',
      businessType,
      bottleSize: customization.bottleSize,
      bottleStyle: customization.bottleStyle,
      quantity,
      requiredDate,
      deliveryLocation: city,
      source: 'Website',
      customization,
      notes: `[3D Can Lab Drop] Flavor: ${flavorTitle}. Finish: ${customization.finish}. Rate: ₹${ratePerCan}/can. Notes: ${notes || 'None'}`,
    });

    addLeadToFirestore(newLead).catch((err: any) =>
      console.warn('Firestore lead sync warning:', err)
    );

    trackEvent('form_submit_success', { source: 'bottle_customizer_modal', quantity });
    setSubmittedLeadId(newLead.id);
  };

  const handleReset = () => {
    setSubmittedLeadId(null);
    setBusinessName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setCity('Indore');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#05070B] w-full max-w-5xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh] text-white">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0C1019] border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#070A10] border border-white/10 text-[#00F0FF] flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-[#00F0FF]" />
            </div>
            <div>
              <h2 className="font-syne font-black uppercase text-xl text-white tracking-tight">
                H2O 3D Can Lab & Clan Drop Studio
              </h2>
              <p className="text-xs text-slate-400 font-space font-medium">
                Configure real-time 3D aluminium can model, test neon shaders, and lock in squad batch wholesale pricing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {submittedLeadId ? (
            /* Success State */
            <div className="text-center py-12 px-4 max-w-lg mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="font-syne font-black uppercase text-2xl sm:text-3xl text-white tracking-tight">
                  Custom Can Drop Request Reserved!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Thank you, <strong className="text-white">{contactName}</strong>. Your custom specification for{' '}
                  <strong className="text-white">{businessName}</strong> ({quantity.toLocaleString()} Cans • ₹{ratePerCan}/can) is registered under ID{' '}
                  <span className="font-mono text-[#00F0FF] font-bold">{submittedLeadId}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-cyber border border-white/10 space-y-3">
                <p className="text-xs text-slate-300 font-space">
                  Want to confirm vector artwork directly with our packaging crew?
                </p>
                <a
                  href={LEAD_CONFIG.getLeadFollowupWhatsAppUrl(contactName, businessName, `${quantity} cans`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05070B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] font-space"
                >
                  <MessageSquare className="w-4 h-4 fill-[#05070B]" />
                  <span>Connect on WhatsApp Now</span>
                </a>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-space"
                >
                  ← Build Another Clan Can
                </button>
              </div>
            </div>
          ) : (
            /* Customization Workspace Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 3D Energy Can Studio Viewport (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="h-[360px] sm:h-[440px] rounded-2xl glass-cyber border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
                  <Bottle3DCanvas
                    customization={customization}
                    neonColor={neonColor}
                    flavorTitle={flavorTitle}
                    interactive={true}
                    autoRotateDefault={true}
                    className="w-full h-full"
                  />
                  
                  <div className="absolute top-3 left-3 bg-[#05070B]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-space text-slate-300">
                    REAL-TIME 3D SHADER
                  </div>
                </div>

                {/* Live Volume & Pricing Box */}
                <div className="glass-cyber rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="text-slate-400 uppercase">Estimated Batch Rate:</span>
                    <span className="font-bold text-[#00F0FF] text-sm">
                      ₹{ratePerCan} / Can <span className="text-xs text-slate-400 font-normal">(MRP ₹135)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-space pt-2 border-t border-white/10">
                    <span className="text-slate-400">Total Batch Estimated:</span>
                    <span className="font-black text-white text-base">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-tight">
                    * Includes 100% recyclable aluminium cans, nitrogen flush, high-definition laser wrap, and doorstep delivery across Indore.
                  </div>
                </div>
              </div>

              {/* Right Column: Customization Controls & Enquiry Submission (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Brand & Tagline Input */}
                <div className="glass-cyber rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-space flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>1. Clan Tag & Branding</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-space text-slate-400 mb-1">
                        Brand / Clan Mark (Can Imprint)
                      </label>
                      <input
                        type="text"
                        value={customization.brandName}
                        onChange={(e) =>
                          setCustomization({ ...customization, brandName: e.target.value.toUpperCase() })
                        }
                        maxLength={16}
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-bold text-white uppercase outline-none font-space"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-space text-slate-400 mb-1">
                        Subtext / Tagline
                      </label>
                      <input
                        type="text"
                        value={customization.tagline}
                        onChange={(e) =>
                          setCustomization({ ...customization, tagline: e.target.value })
                        }
                        maxLength={40}
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-medium text-white outline-none font-space"
                      />
                    </div>
                  </div>

                  {/* 2. Neon Accent & Formula Presets */}
                  <div>
                    <label className="block text-[11px] font-space text-slate-400 mb-2">
                      Bio-Formula & Neon Accent
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {NEON_PRESETS.map((p) => {
                        const isSelected = neonColor === p.hex;
                        return (
                          <button
                            key={p.hex}
                            type="button"
                            onClick={() => {
                              setNeonColor(p.hex);
                              setFlavorTitle(p.flavor);
                              setCustomization({
                                ...customization,
                                capColor: p.hex,
                                labelColor: p.hex,
                              });
                            }}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#131926] border-white/40 shadow-sm'
                                : 'bg-[#070A10] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: p.hex, boxShadow: `0 0 6px ${p.hex}` }}
                            />
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                              <div className="text-[9px] text-slate-400 truncate">{p.flavor}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Can Finish */}
                  <div>
                    <label className="block text-[11px] font-space text-slate-400 mb-1">
                      Can Chassis Finish
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FINISH_OPTIONS.map((fin) => (
                        <button
                          key={fin}
                          type="button"
                          onClick={() => setCustomization({ ...customization, finish: fin })}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold font-space transition-all cursor-pointer ${
                            customization.finish === fin
                              ? 'bg-[#131926] border-[#00F0FF] text-white'
                              : 'bg-[#070A10] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {fin}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Quantity Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-space mb-1">
                      <span className="text-slate-400">Squad Batch Volume:</span>
                      <span className="font-bold text-white text-sm">
                        {quantity.toLocaleString()} Cans
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={10000}
                      step={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-space mt-1">
                      <span>300 (MOQ)</span>
                      <span>1,000 (Popular)</span>
                      <span>3,000</span>
                      <span>10,000+</span>
                    </div>
                  </div>
                </div>

                {/* 2. Dispatch Logistics & Contact Submission */}
                <form onSubmit={handleSubmit} className="glass-cyber rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-space flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>2. Dispatch Details & Quotation Request</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Business / Clan Name *"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contact Person / Leader *"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="WhatsApp Mobile (10-digit) *"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Destination City (e.g. Indore) *"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Special instructions or target event date (optional)"
                      className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-medium text-white outline-none font-space"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] font-black text-xs uppercase tracking-wider glow-cyan-sm transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 active:scale-98 font-space"
                  >
                    <span>Submit Specification & Lock Batch</span>
                    <Send className="w-4 h-4 text-[#05070B]" />
                  </button>
                </form>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
