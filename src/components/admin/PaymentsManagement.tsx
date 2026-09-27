import React, { useState } from 'react';
import { PaymentRecord } from '../../types';
import { store } from '../../services/store';
import { showToast } from '../../utils/toast';
import { CreditCard, DollarSign, Plus, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

export const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>(store.getState().payments);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // New payment form
  const orders = store.getState().orders;
  const [orderId, setOrderId] = useState(orders[0]?.id || '');
  const [amount, setAmount] = useState(15000);
  const [method, setMethod] = useState<'BANK_TRANSFER_NEFT' | 'UPI' | 'CREDIT_CARD' | 'CHEQUE'>('BANK_TRANSFER_NEFT');
  const [reference, setReference] = useState('');
  const [paymentType, setPaymentType] = useState<'ADVANCE_DEPOSIT' | 'BALANCE_PAYMENT' | 'FULL_PAYMENT'>('ADVANCE_DEPOSIT');

  const totalCollected = payments.reduce((s, p) => s + (p.status === 'CONFIRMED' ? p.amount : 0), 0);
  const totalBilled = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);

  const handleLogPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || amount <= 0) return;

    const refCode = reference || `REF-${Date.now()}`;
    store.recordPayment(orderId, amount, method, refCode);

    const targetOrder = orders.find((o) => o.id === orderId);
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      orderNumber: targetOrder?.orderNumber || 'ORD-2026-NEW',
      customerName: targetOrder?.businessName || 'Hospitality Client',
      amount,
      paymentMethod: method,
      paymentType,
      transactionReference: refCode,
      status: 'CONFIRMED',
      notes: 'Recorded via operator ledger portal',
    };

    setPayments([newRecord, ...payments]);
    setLogModalOpen(false);
    showToast('Payment successfully logged and reconciled with order balance!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Payments, Advances & Receivables Ledger
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Track 50% advance production deposits and final dispatch collections with bank reconciliation.
          </p>
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Bank / UPI Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
          <span className="text-xs text-stone-500 block">Total Invoiced Sales:</span>
          <div className="text-2xl font-serif font-bold text-[#1A1817] mt-1">
            ₹{totalBilled.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
          <span className="text-xs text-stone-500 block">Total Cash Collected:</span>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
          <span className="text-xs text-stone-500 block">Outstanding Balance Due:</span>
          <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
            ₹{totalOutstanding.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer & Hotel</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#D92365]">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-700">{p.orderNumber}</td>
                  <td className="py-3 px-4 font-semibold text-[#1A1817]">{p.customerName}</td>
                  <td className="py-3 px-4 font-mono text-stone-600">
                    {p.paymentType ? p.paymentType.replace(/_/g, ' ') : 'PAYMENT'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="block font-semibold text-stone-800">{p.paymentMethod}</span>
                    <span className="font-mono text-[10px] text-stone-400">
                      {p.transactionReference}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#1A1817]">Record Payment Receipt</h3>
              <button
                onClick={() => setLogModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Order</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.businessName} (₹{o.totalAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                >
                  <option value="ADVANCE_DEPOSIT">50% Advance Deposit (Production Start)</option>
                  <option value="BALANCE_PAYMENT">50% Balance (Pre-Dispatch)</option>
                  <option value="FULL_PAYMENT">100% Full Payment Upfront</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                >
                  <option value="BANK_TRANSFER_NEFT">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI">UPI (Business QR / VPA)</option>
                  <option value="CREDIT_CARD">Corporate Card</option>
                  <option value="CHEQUE">Cheque Clearance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Bank UTR / Transaction Reference #
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC00029381283"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5DDD0]">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8CEBE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
