import React, { useState } from 'react';
import { BottleSize, BottleStyle, BusinessType } from '../../types';
import { store } from '../../services/store';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { showToast } from '../../utils/toast';
import { X, FileText, CheckCircle2, ArrowRight, Calculator, MessageSquare, Zap } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: (tab?: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAdmin,
}) => {
  const [format, setFormat] = useState<'330ml' | '500ml'>('330ml');
  const [flavor, setFlavor] = useState('Cyber Blueprint');
  const [quantity, setQuantity] = useState<number>(1000);

  // Contact details
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Indore');
  const [businessType, setBusinessType] = useState<BusinessType>('Café');
  const [notes, setNotes] = useState('');

  const [generatedQuoteId, setGeneratedQuoteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Rate calculation
  const unitPrice = quantity >= 3000 ? 46 : quantity >= 1000 ? 55 : 68;
  const subtotal = unitPrice * quantity;
  const taxRate = 18;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone) {
      showToast('Please fill in business name, contact name, and phone number.', 'error');
      return;
    }

    // 1. Create Lead
    const lead = store.createLead({
      businessName,
      contactName,
      phone,
      email: email || `${phone}@lead.com`,
      city: city || 'Indore',
      businessType,
      bottleSize: format === '330ml' ? '500ml' : '1000ml',
      bottleStyle: 'Sleek Nordic Cylinder',
      quantity,
      deliveryLocation: city,
      source: 'Website',
      notes: `[Instant Quote Modal] Format: ${format}. Flavor: ${flavor}. Unit Rate: ₹${unitPrice}. Total: ₹${totalAmount.toLocaleString()}`,
    });

    // 2. Create Formal Quote in store
    const quote = store.createQuote({
      leadId: lead.id,
      customerName: contactName,
      customerEmail: email || lead.email,
      customerPhone: phone,
      businessName,
      items: [
        {
          id: `qi-${Date.now()}`,
          bottleSize: format === '330ml' ? '500ml' : '1000ml',
          bottleStyle: 'Sleek Nordic Cylinder',
          labelType: 'Laser Foil Wrap',
          quantity,
          unitBaseCost: 28,
          unitLabelCost: 4,
          unitPrintingCost: 3,
          unitPackagingCost: 2,
          unitTransportCost: 2,
          unitDesignCost: 0,
          unitMargin: unitPrice - 39,
          unitPrice,
          totalPrice: subtotal,
        },
      ],
      subtotal,
      discountAmount: 0,
      taxRate,
      taxAmount,
      shippingCost: 0,
      totalAmount,
      totalInternalCost: 39 * quantity,
      estimatedProfit: (unitPrice - 39) * quantity,
      profitMarginPct: Math.round(((unitPrice - 39) / unitPrice) * 100),
      status: 'SENT',
      notes,
    });

    trackEvent('quote_generated', { quoteId: quote.quoteNumber, amount: totalAmount });
    setGeneratedQuoteId(quote.quoteNumber);
  };

  const handleReset = () => {
    setGeneratedQuoteId(null);
    setBusinessName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setCity('Indore');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#05070B] text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0C1019] border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#070A10] border border-white/10 text-[#00F0FF] flex items-center justify-center">
              <Zap className="w-5 h-5 fill-[#00F0FF]" />
            </div>
            <div>
              <h3 className="font-syne font-black uppercase text-lg text-white">
                Instant Squad Drop Quotation
              </h3>
              <p className="text-xs text-slate-400 font-space font-medium">
                Volume-tiered wholesale estimate • 48-Hour Factory Dispatch
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {generatedQuoteId ? (
            <div className="text-center py-8 px-4 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-syne font-black uppercase text-2xl text-white">
                  Quotation Confirmed
                </h4>
                <p className="font-mono text-sm font-bold text-[#00F0FF] mt-1">
                  DROP ID: {generatedQuoteId}
                </p>
                <p className="text-xs text-slate-300 mt-2">
                  Quotation proposal recorded for {businessName}. Our crew will connect to verify can artwork.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-cyber border border-white/10 text-left text-xs font-space space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Can Batch:</span>
                  <span className="font-bold text-white">
                    {quantity.toLocaleString()} × {format} ({flavor})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unit Price:</span>
                  <span className="font-bold text-[#00F0FF]">
                    ₹{unitPrice} / can (MRP ₹135)
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
                  <span className="text-slate-300">Estimated Total:</span>
                  <span className="text-white">₹{totalAmount.toLocaleString()} (Incl. GST)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/918827275367?text=Hi%20H2O%20team,%20I%20have%20received%20quotation%20${generatedQuoteId}%20for%20${encodeURIComponent(
                    businessName
                  )}.%20Please%20lock%20our%20squad%20batch.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05070B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-space transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-[#05070B]" />
                  <span>Send Quotation to H2O Team on WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-space text-slate-400 hover:text-white cursor-pointer"
                >
                  Calculate Another Batch
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Spec Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Can Chassis
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070A10] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00F0FF] font-space"
                  >
                    <option value="330ml">330ml Sleek Can</option>
                    <option value="500ml">500ml Heavy Can</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Formula Core
                  </label>
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070A10] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00F0FF] font-space"
                  >
                    <option value="Cyber Blueprint">Cyber Blueprint (Blueberry)</option>
                    <option value="Acid Overload">Acid Overload (Sour Lime)</option>
                    <option value="Void Drive">Void Drive (Dragonfruit)</option>
                    <option value="Solar Inferno">Solar Inferno (Blood Orange)</option>
                    <option value="Neon Tokyo">Neon Tokyo (Cherry Blossom)</option>
                    <option value="Ghost Zero">Ghost Zero (Glacier Ice)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Squad Batch Quantity
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="50000"
                    step="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(300, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-[#070A10] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00F0FF] font-space"
                  />
                </div>
              </div>

              {/* Live Quotation Summary Pill */}
              <div className="p-4 rounded-2xl glass-cyber border border-white/10 flex items-center justify-between text-xs font-space">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Unit Wholesale Rate</span>
                  <span className="text-base font-black text-[#00F0FF]">₹{unitPrice} / Can</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Total Estimate (Pre-tax)</span>
                  <span className="text-base font-black text-white">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-space">
                  Destination & Contact Credentials
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Organization / Clan Name *"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                  />

                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Lead / Name *"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile / WhatsApp (10 digits) *"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                  />

                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Delivery City (e.g. Indore) *"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] border border-white/10 focus:border-[#00F0FF] text-xs font-semibold text-white outline-none font-space"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] font-black text-xs uppercase tracking-wider glow-cyan-sm transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 active:scale-98 font-space"
              >
                <span>Generate Official Squad Quotation</span>
                <ArrowRight className="w-4 h-4 text-[#05070B]" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
