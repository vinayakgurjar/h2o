import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import {
  Search,
  X,
  Users,
  Package,
  FileText,
  Building2,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const state = store.getState();
  const lower = query.toLowerCase();

  // Matched records
  const matchedLeads = state.leads.filter(
    (l) =>
      l.businessName.toLowerCase().includes(lower) ||
      l.contactName.toLowerCase().includes(lower) ||
      l.city.toLowerCase().includes(lower)
  );

  const matchedOrders = state.orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(lower) ||
      o.businessName.toLowerCase().includes(lower) ||
      o.trackingToken.toLowerCase().includes(lower)
  );

  const matchedQuotes = state.quotes.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(lower) ||
      q.businessName.toLowerCase().includes(lower)
  );

  const matchedCustomers = state.customers.filter(
    (c) =>
      c.businessName.toLowerCase().includes(lower) ||
      c.contactName.toLowerCase().includes(lower)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search input */}
        <div className="p-4 border-b border-[#E5DDD0] flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search leads, orders, quotes, or navigate tabs..."
            className="flex-1 text-sm text-[#1A1817] focus:outline-none placeholder:text-stone-400"
          />
          <kbd className="font-mono text-[10px] bg-stone-100 border border-stone-300 px-1.5 py-0.5 rounded text-stone-500">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs">
          {/* Quick Navigations */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
              Fast Navigation
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1">
              {[
                { label: 'Dashboard', tab: 'admin-dashboard' },
                { label: 'CRM Pipeline', tab: 'crm-leads' },
                { label: 'Orders', tab: 'orders' },
                { label: 'Quotation Engine', tab: 'quotes' },
                { label: 'Pricing Master', tab: 'pricing-master' },
                { label: 'Design Studio', tab: 'design-management' },
                { label: 'Cleanroom Plant', tab: 'production' },
                { label: 'Payments', tab: 'payments' },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white text-stone-700 text-left font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
                Orders ({matchedOrders.length})
              </span>
              <div className="space-y-1 mt-1">
                {matchedOrders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      onNavigateTab('orders');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#FAF7F2] flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-[#D92365]" />
                      <strong className="font-mono">{o.orderNumber}</strong>
                      <span>{o.businessName}</span>
                    </div>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {o.quantity} pcs • {o.orderStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
                CRM Leads ({matchedLeads.length})
              </span>
              <div className="space-y-1 mt-1">
                {matchedLeads.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onNavigateTab('crm-leads');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#FAF7F2] flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-500" />
                      <strong className="text-stone-900">{l.businessName}</strong>
                      <span className="text-stone-400">({l.contactName})</span>
                    </div>
                    <span className="text-[#D92365] font-mono font-bold text-[11px]">
                      ₹{l.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Quotes */}
          {matchedQuotes.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2">
                Quotations ({matchedQuotes.length})
              </span>
              <div className="space-y-1 mt-1">
                {matchedQuotes.slice(0, 3).map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      onNavigateTab('quotes');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#FAF7F2] flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <strong className="font-mono">{q.quoteNumber}</strong>
                      <span>{q.businessName}</span>
                    </div>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{q.totalAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
