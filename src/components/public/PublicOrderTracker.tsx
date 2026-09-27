import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight, Check, Zap } from 'lucide-react';
import { store } from '../../services/store';
import { Order, OrderStatus } from '../../types';
import { showToast } from '../../utils/toast';

interface PublicOrderTrackerProps {
  initialToken?: string;
  onNavigateToCustomizer?: () => void;
}

export const PublicOrderTracker: React.FC<PublicOrderTrackerProps> = ({
  initialToken = '',
  onNavigateToCustomizer,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialToken || 'ORD-2026-088');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    const orders = store.getState().orders;
    return (
      orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === (initialToken || 'ORD-2026-088').toLowerCase() ||
          o.trackingToken.toLowerCase() === (initialToken || 'ORD-2026-088').toLowerCase()
      ) || orders[0]
    );
  });

  const [approverName, setApproverName] = useState('');
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const orders = store.getState().orders;
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query ||
        o.trackingToken.toLowerCase() === query ||
        o.businessName.toLowerCase().includes(query)
    );

    if (found) {
      setCurrentOrder(found);
      setApprovalSuccess(false);
      showToast(`Order ${found.orderNumber} loaded!`, 'success');
    } else {
      showToast(
        `Order not found for "${searchQuery}". Please check your order reference number (e.g. ORD-2026-088 or ORD-2026-089).`,
        'error'
      );
    }
  };

  const handleApproveArtwork = () => {
    if (!currentOrder) return;
    if (!approverName.trim()) {
      showToast('Please enter your full name to record digital sign-off.', 'error');
      return;
    }

    store.approveArtwork(currentOrder.id, approverName);
    const updated = store.getState().orders.find((o) => o.id === currentOrder.id);
    if (updated) setCurrentOrder(updated);
    setApprovalSuccess(true);
    showToast('Vector label proof approved! Production status unlocked.', 'success');
  };

  // Status Step Mapper
  const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'ORDER_CONFIRMED',
      label: 'Squad Drop Reserved',
      desc: 'Batch slot allocated & raw can chassis queued',
    },
    {
      key: 'ARTWORK_APPROVED',
      label: 'Artwork Approved',
      desc: '3D vector can proofs signed off & laser plates prepared',
    },
    {
      key: 'IN_PRODUCTION',
      label: 'Active Bottling & Fill',
      desc: 'Cleanroom nitrogen dosing, filling & laser shrink printing',
    },
    {
      key: 'READY_TO_DISPATCH',
      label: 'Batch Tested & Boxed',
      desc: 'Pressure integrity audited & packed in heavy cartons',
    },
    {
      key: 'DISPATCHED',
      label: 'In Transit / Courier',
      desc: 'Dispatched via express road freight with live GPS',
    },
    {
      key: 'DELIVERED',
      label: 'Delivered',
      desc: 'Safely arrived at your arena / club / venue',
    },
  ];

  const getStepStatus = (stepKey: OrderStatus, order: Order) => {
    const sequence: OrderStatus[] = [
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
    ];

    const currentIndex = sequence.indexOf(order.orderStatus);
    const stepIndex = sequence.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div id="tracker" className="py-20 bg-[#05070B] border-b border-white/10 text-[#CBD5E1] cyber-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search Bar */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0C1019] border border-white/10 px-4 py-1.5 rounded-full text-xs font-space font-bold text-[#00F0FF]">
            <Truck className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>CAN DROP TRACKER & PROOF SIGN-OFF</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-syne uppercase">
            Track Your Squad Drop Batch
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Monitor real-time can production, verify laser vector artwork proofs, and inspect freight dispatch milestones.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto pt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Drop # (e.g. ORD-2026-088) or Token"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0C1019] border border-white/15 text-xs font-semibold text-white shadow-xs focus:outline-none focus:border-[#00F0FF] font-space"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] text-xs font-black uppercase tracking-wider transition-all shadow-md glow-cyan-sm active:scale-95 cursor-pointer font-space"
            >
              Lookup
            </button>
          </form>

          {/* Demo links */}
          <div className="flex justify-center items-center gap-2 text-[11px] text-slate-400 font-space pt-1">
            <span>Demo Drops:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ORD-2026-088');
                const o = store.getState().orders.find((x) => x.orderNumber === 'ORD-2026-088');
                if (o) setCurrentOrder(o);
              }}
              className="text-[#00F0FF] font-bold hover:underline cursor-pointer"
            >
              ORD-2026-088 (In Production)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ORD-2026-089');
                const o = store.getState().orders.find((x) => x.orderNumber === 'ORD-2026-089');
                if (o) setCurrentOrder(o);
              }}
              className="text-[#00F0FF] font-bold hover:underline cursor-pointer"
            >
              ORD-2026-089 (Artwork Sign-off)
            </button>
          </div>
        </div>

        {/* Order Details & Timeline Card */}
        {currentOrder && (
          <div className="glass-cyber rounded-3xl border border-white/10 shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
            
            {/* Top Summary Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-space">
                  <span className="font-bold bg-[#070A10] text-[#00F0FF] px-2.5 py-0.5 rounded border border-white/10">
                    {currentOrder.orderNumber}
                  </span>
                  <span className="text-slate-400">
                    Token: {currentOrder.trackingToken}
                  </span>
                </div>
                <h3 className="font-syne font-black uppercase text-2xl text-white">
                  {currentOrder.businessName}
                </h3>
                <span className="text-xs text-slate-400 font-space mt-1 block">
                  Delivery Destination: {currentOrder.city} • Required by: {currentOrder.requiredDate}
                </span>
              </div>

              <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs font-space">
                <span className="px-3 py-1 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] font-bold border border-[#00F0FF]/30 uppercase tracking-wider">
                  {currentOrder.orderStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-white font-bold">
                  {currentOrder.quantity.toLocaleString()} Cans × {currentOrder.bottleSize}
                </span>
              </div>
            </div>

            {/* Timeline Steps */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space mb-6">
                CAN PRODUCTION LIFECYCLE
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
                {STEPS.map((step, idx) => {
                  const status = getStepStatus(step.key, currentOrder);
                  return (
                    <div key={step.key} className="flex flex-col items-start space-y-2 relative">
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors font-space ${
                            status === 'completed'
                              ? 'bg-emerald-500 text-[#05070B]'
                              : status === 'current'
                              ? 'bg-[#00F0FF] text-[#05070B] ring-4 ring-[#00F0FF]/25'
                              : 'bg-[#070A10] border border-white/10 text-slate-400'
                          }`}
                        >
                          {status === 'completed' ? <Check className="w-4 h-4 text-[#05070B]" /> : idx + 1}
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div
                            className={`hidden md:block flex-1 h-0.5 rounded ${
                              status === 'completed' ? 'bg-emerald-500' : 'bg-white/10'
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <div
                          className={`text-xs font-bold uppercase font-space tracking-wide ${
                            status === 'current'
                              ? 'text-[#00F0FF]'
                              : status === 'completed'
                              ? 'text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Artwork Approval Digital Sign-off Module */}
            <div className="pt-6 border-t border-white/10">
              <div className="bg-[#070A10] rounded-2xl p-5 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h5 className="font-syne font-bold uppercase text-base text-white">
                      Digital Can Artwork Proof Sign-off
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify typography, color separation, and sponsor logos before laser plate printing.
                    </p>
                  </div>

                  <div className="text-xs font-space">
                    {currentOrder.artworkApproved ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Artwork Approved by {currentOrder.artworkApprovedBy || 'Client'}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Approval Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {!currentOrder.artworkApproved && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="text"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      placeholder="Enter Full Name for Digital Signature"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#0C1019] border border-white/15 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-space"
                    />
                    <button
                      type="button"
                      onClick={handleApproveArtwork}
                      className="px-6 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-space min-h-[44px]"
                    >
                      Sign & Approve Vector Proof
                    </button>
                  </div>
                )}

                {approvalSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                    ✓ Thank you! Digital sign-off logged. Your custom can batch is now released for immediate cleanroom printing and filling.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
