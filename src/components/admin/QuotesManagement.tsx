import React, { useState } from 'react';
import { Quote } from '../../types';
import { store } from '../../services/store';
import { showToast } from '../../utils/toast';
import {
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Eye,
  DollarSign,
  TrendingUp,
  X,
  Send,
} from 'lucide-react';

interface QuotesManagementProps {
  onOpenCreateQuote: () => void;
}

export const QuotesManagement: React.FC<QuotesManagementProps> = ({ onOpenCreateQuote }) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const quotes = store.getState().quotes;
  const currentUser = store.getState().currentUser;

  const filteredQuotes = quotes.filter((q) =>
    filterStatus === 'ALL' ? true : q.status === filterStatus
  );

  const handleConvertToOrder = (quoteId: string) => {
    try {
      const order = store.convertQuoteToOrder(quoteId);
      showToast(`Quote converted successfully! Order ${order.orderNumber} has been created and scheduled for production.`, 'success');
      setSelectedQuote(null);
    } catch (e: any) {
      showToast(e.message || 'Failed to convert quote', 'error');
    }
  };

  const handleUpdateStatus = (quoteId: string, status: any) => {
    store.updateQuoteStatus(quoteId, status);
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote({ ...selectedQuote, status });
    }
  };

  const canViewInternalMargins = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'ACCOUNTS'].includes(
    currentUser.role
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            B2B Quotation Engine & Proposals
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Generate itemized tax proposals, monitor customer margins, and convert signed quotes to cleanroom production orders.
          </p>
        </div>

        <button
          onClick={onOpenCreateQuote}
          className="px-3.5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E5DDD0] pb-2 text-xs">
        {['ALL', 'DRAFT', 'SENT', 'ACCEPTED', 'CONVERTED_TO_ORDER'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterStatus === st
                ? 'bg-[#1A1817] text-white'
                : 'text-stone-600 hover:bg-[#F4EFE6]'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Customer & Hotel</th>
                <th className="py-3 px-4">Items / Volume</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">GST (18%)</th>
                <th className="py-3 px-4">Grand Total</th>
                {canViewInternalMargins && <th className="py-3 px-4">Estimated Margin</th>}
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedQuote(quote)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#D92365]">
                    {quote.quoteNumber}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-stone-900 block font-semibold">
                      {quote.businessName}
                    </strong>
                    <span className="text-stone-400 text-[10px]">
                      {quote.customerName} • {quote.customerPhone}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {quote.items[0]?.quantity.toLocaleString()} × {quote.items[0]?.bottleSize}
                  </td>
                  <td className="py-3 px-4 font-mono">₹{quote.subtotal.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-stone-500">
                    ₹{quote.taxAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-mono text-[#1A1817]">
                    ₹{quote.totalAmount.toLocaleString()}
                  </td>
                  {canViewInternalMargins && (
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                        +{quote.profitMarginPct}% (₹{quote.estimatedProfit.toLocaleString()})
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        quote.status === 'CONVERTED_TO_ORDER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : quote.status === 'ACCEPTED'
                          ? 'bg-blue-100 text-blue-800'
                          : quote.status === 'SENT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {quote.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedQuote(quote)}
                      className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white text-stone-700 font-medium transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Document & Actions Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
              <div>
                <span className="font-mono text-xs font-bold text-[#D92365]">
                  {selectedQuote.quoteNumber}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1A1817]">
                  Commercial Quotation: {selectedQuote.businessName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Banner */}
              <div className="flex justify-between items-center bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DDD0]">
                <div>
                  <span className="text-stone-500 block text-[10px]">Quotation Status:</span>
                  <strong className="text-[#1A1817] text-sm">
                    {selectedQuote.status.replace(/_/g, ' ')}
                  </strong>
                </div>

                <div className="flex gap-2">
                  {selectedQuote.status !== 'CONVERTED_TO_ORDER' && (
                    <button
                      onClick={() => handleConvertToOrder(selectedQuote.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Convert to Production Order</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${selectedQuote.customerPhone.replace(
                      /[^0-9]/g,
                      ''
                    )}?text=Dear%20${encodeURIComponent(
                      selectedQuote.customerName
                    )},%20please%20find%20your%20custom%20water%20bottle%20quotation%20${
                      selectedQuote.quoteNumber
                    }.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE] hover:bg-white text-stone-800 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Client</span>
                  </a>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-[#E5DDD0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Item & Silhouette</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Amount (ex-GST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFE6]">
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4 font-medium text-stone-900">
                          {item.bottleSize} {item.bottleStyle}
                          <span className="block text-[10px] text-stone-400">
                            Custom Waterproof Label & Colored Cap
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{item.quantity.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono font-semibold">₹{item.unitPrice}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          ₹{item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD0] text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Subtotal:</span>
                    <span className="font-mono">₹{selectedQuote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">GST ({selectedQuote.taxRate}%):</span>
                    <span className="font-mono">₹{selectedQuote.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5DDD0] pt-2 text-sm font-bold text-[#1A1817]">
                    <span>Total Amount:</span>
                    <span className="font-mono">₹{selectedQuote.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Internal Profitability Block (Only for authorized roles) */}
              {canViewInternalMargins && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>Internal Financial Margin Analytics (Confidential)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-emerald-700 block text-[10px]">Total Production Cost:</span>
                      <strong className="font-mono">₹{selectedQuote.totalInternalCost.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block text-[10px]">Estimated Gross Profit:</span>
                      <strong className="font-mono text-emerald-800">
                        ₹{selectedQuote.estimatedProfit.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block text-[10px]">Profit Margin:</span>
                      <strong className="font-mono text-emerald-800">
                        {selectedQuote.profitMarginPct}%
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Delivery */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl text-stone-600 text-[11px] space-y-1">
                <strong>Commercial Terms & Conditions:</strong>
                <p>• {selectedQuote.paymentTerms}</p>
                <p>• {selectedQuote.deliveryTerms}</p>
                <p>• {selectedQuote.termsAndConditions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
