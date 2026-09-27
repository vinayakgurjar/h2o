import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { store } from '../../services/store';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export const OrdersManagement: React.FC = () => {
  const orders = store.getState().orders;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [copiedToken, setCopiedToken] = useState(false);

  const filteredOrders = orders.filter((o) =>
    filterStatus === 'ALL' ? true : o.orderStatus === filterStatus
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    store.updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const copyTrackingLink = (token: string) => {
    const url = `${window.location.origin}/?tab=track&token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const ALL_ORDER_STATUSES: OrderStatus[] = [
    'ORDER_CONFIRMED',
    'DESIGN_PENDING',
    'DESIGN_IN_PROGRESS',
    'ARTWORK_SENT',
    'ARTWORK_APPROVED',
    'PRODUCTION_QUEUED',
    'IN_PRODUCTION',
    'QUALITY_CHECK',
    'READY_TO_DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'CLOSED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Production Orders & Batch Fulfillment
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Monitor orders from advance payment confirmation to cleanroom bottling, quality assurance, and dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#FAF7F2] border border-[#E5DDD0] text-stone-700 px-3 py-1.5 rounded-xl font-mono font-bold">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E5DDD0] pb-2 text-xs overflow-x-auto">
        {['ALL', 'IN_PRODUCTION', 'ARTWORK_APPROVED', 'DISPATCHED', 'DELIVERED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterStatus === st
                ? 'bg-[#1A1817] text-white'
                : 'text-stone-600 hover:bg-[#F4EFE6]'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer & Hotel</th>
                <th className="py-3 px-4">Batch Spec</th>
                <th className="py-3 px-4">Required By</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Artwork Sign-off</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(ord)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#D92365]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-stone-900 block font-semibold">
                      {ord.businessName}
                    </strong>
                    <span className="text-stone-400 text-[10px]">{ord.city}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {ord.quantity.toLocaleString()} × {ord.bottleSize}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-700">{ord.requiredDate}</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    ₹{ord.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentStatus === 'PARTIAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {ord.artworkApproved ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 font-medium text-[10px]">
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white text-stone-700 font-medium transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
              <div>
                <span className="font-mono text-xs font-bold text-[#D92365]">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1A1817]">
                  Order: {selectedOrder.businessName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Update Control */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DDD0] space-y-2">
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                  Advance Production Workflow State:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ORDER_STATUSES.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-2.5 py-1 rounded-lg font-medium text-[11px] border transition-all ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#1A1817] text-white border-[#1A1817] shadow-xs'
                          : 'bg-white border-[#D8CEBE] text-stone-700 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public Client Tracking Link */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-emerald-900 font-bold block">
                    Public Customer Tracking & Sign-off Token:
                  </span>
                  <span className="font-mono text-emerald-800 text-[11px]">
                    {selectedOrder.trackingToken}
                  </span>
                </div>

                <button
                  onClick={() => copyTrackingLink(selectedOrder.trackingToken)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Link Copied!' : 'Copy Client Link'}</span>
                </button>
              </div>

              {/* Specifications & Financials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#E5DDD0] space-y-2">
                  <h4 className="font-bold text-stone-900">Batch Specs</h4>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Bottle Size:</span>
                      <strong className="text-stone-900">{selectedOrder.bottleSize}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Bottle Style:</span>
                      <strong className="text-stone-900">{selectedOrder.bottleStyle}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <strong className="text-stone-900">
                        {selectedOrder.quantity.toLocaleString()} units
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Destination:</span>
                      <strong className="text-stone-900">{selectedOrder.city}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E5DDD0] space-y-2">
                  <h4 className="font-bold text-stone-900">Commercial Status</h4>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Total Invoice:</span>
                      <strong className="text-stone-900 font-mono">
                        ₹{selectedOrder.totalAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Collected:</span>
                      <strong className="text-emerald-700 font-mono">
                        ₹{selectedOrder.paidAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance Due:</span>
                      <strong className="text-amber-800 font-mono">
                        ₹{(selectedOrder.totalAmount - selectedOrder.paidAmount).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
