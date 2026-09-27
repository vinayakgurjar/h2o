import React, { useState } from 'react';
import { BottleSize, BottleStyle, Lead } from '../../types';
import { store } from '../../services/store';
import { showToast } from '../../utils/toast';
import { X, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface QuickNewQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLead?: Lead | null;
}

export const QuickNewQuoteModal: React.FC<QuickNewQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedLead,
}) => {
  const leads = store.getState().leads;
  const [selectedLeadId, setSelectedLeadId] = useState<string>(preselectedLead?.id || '');
  const [bottleSize, setBottleSize] = useState<BottleSize>(
    preselectedLead?.bottleSize || '500ml'
  );
  const [bottleStyle, setBottleStyle] = useState<BottleStyle>(
    preselectedLead?.bottleStyle || 'Heritage Square Ribbed'
  );
  const [quantity, setQuantity] = useState<number>(preselectedLead?.quantity || 2000);
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const lead = leads.find((l) => l.id === selectedLeadId) || preselectedLead || leads[0];
  const pricing = store.calculateQuotePricing(bottleSize, bottleStyle, quantity);

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    const quote = store.createQuote({
      leadId: lead.id,
      customerName: lead.contactName,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      businessName: lead.businessName,
      items: [
        {
          id: `qi-${Date.now()}`,
          bottleSize,
          bottleStyle,
          labelType: 'Waterproof Synthetic Metallic',
          quantity,
          unitBaseCost: pricing.rule.baseBottleCost,
          unitLabelCost: pricing.rule.labelCost,
          unitPrintingCost: pricing.rule.printingCost,
          unitPackagingCost: pricing.rule.packagingCost,
          unitTransportCost: pricing.rule.deliveryCostPerUnit,
          unitDesignCost: pricing.rule.designCost,
          unitMargin: pricing.unitMargin,
          unitPrice: pricing.unitPrice,
          totalPrice: pricing.subtotal,
        },
      ],
      subtotal: pricing.subtotal,
      discountAmount: customDiscount,
      taxRate: pricing.taxRate,
      taxAmount: pricing.taxAmount,
      shippingCost: 0,
      totalAmount: pricing.totalAmount - customDiscount,
      totalInternalCost: pricing.totalInternalCost,
      estimatedProfit: pricing.estimatedProfit - customDiscount,
      profitMarginPct: pricing.profitMarginPct,
      status: 'SENT',
      notes: 'Generated via Quick Quotation builder',
    });

    showToast(`Quotation ${quote.quoteNumber} created and saved in the ledger!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden">
        <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D92365]" />
            <h3 className="font-serif font-bold text-lg text-[#1A1817]">
              Draft Formal Commercial Quotation
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateQuote} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Target CRM Lead / Client</label>
            <select
              value={selectedLeadId}
              onChange={(e) => {
                setSelectedLeadId(e.target.value);
                const l = leads.find((x) => x.id === e.target.value);
                if (l) {
                  setBottleSize(l.bottleSize);
                  setBottleStyle(l.bottleStyle);
                  setQuantity(l.quantity);
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName} ({l.contactName} - {l.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Bottle Size</label>
              <select
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              >
                <option value="250ml">250ml</option>
                <option value="500ml">500ml</option>
                <option value="750ml">750ml</option>
                <option value="1000ml">1000ml</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Silhouette</label>
              <select
                value={bottleStyle}
                onChange={(e) => setBottleStyle(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              >
                <option value="Heritage Square Ribbed">Heritage Square Ribbed</option>
                <option value="Sleek Nordic Cylinder">Sleek Nordic Cylinder</option>
                <option value="Classic Round">Classic Round</option>
                <option value="Hexagonal Luxe">Hexagonal Luxe</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Batch Units</label>
              <input
                type="number"
                min="300"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 500)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>
          </div>

          {/* Formula calculation card */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Unit Selling Price:</span>
              <strong className="text-[#D92365] font-mono text-sm">
                ₹{pricing.unitPrice} / bottle
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal (ex-GST):</span>
              <span className="font-mono">₹{pricing.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">GST (18%):</span>
              <span className="font-mono">₹{pricing.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#E5DDD0] pt-1.5 font-bold text-[#1A1817]">
              <span>Final Total (incl. Tax):</span>
              <span className="font-mono text-base">₹{pricing.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5DDD0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#D8CEBE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold flex items-center gap-1.5"
            >
              <span>Issue Official Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
