import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import {
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  ArrowRight,
  Sparkles,
  PhoneCall,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenQuickNewLead: () => void;
  onOpenQuickNewQuote: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenQuickNewLead,
  onOpenQuickNewQuote,
}) => {
  const [loading, setLoading] = useState(store.isFirestoreLoading());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLoading(store.isFirestoreLoading());
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    setRefreshing(true);
    await store.refreshFirestoreData();
    setRefreshing(false);
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  const state = store.getState();
  const leads = state.leads;
  const orders = state.orders;
  const quotes = state.quotes;
  const tasks = state.tasks;

  // Metric Computations
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const activeOrders = orders.filter(
    (o) => !['DELIVERED', 'CLOSED', 'CANCELLED'].includes(o.orderStatus)
  );
  const totalProducedUnits = orders.reduce((sum, o) => sum + o.quantity, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingReceivables = orders.reduce(
    (sum, o) => sum + (o.totalAmount - o.paidAmount),
    0
  );

  const overdueTasks = tasks.filter(
    (t) => t.status === 'TODO' && new Date(t.dueDate) < new Date()
  );

  const pendingArtworkOrders = orders.filter((o) => !o.artworkApproved);

  // Stage counts
  const stageCounts = leads.reduce((acc, lead) => {
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6E5E]">
              Facility & Operations Live
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#1A1817] mt-1">
            B2B Factory & Sales Overview
          </h1>
          <p className="text-xs text-[#7A6E5E]">
            {state.companySettings.companyName} • Plant Cleanroom Operating at Normal Capacity
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuickNewLead}
            className="px-3.5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            + New Lead Inquiry
          </button>
          <button
            onClick={onOpenQuickNewQuote}
            className="px-3.5 py-2 rounded-xl bg-[#1A1817] hover:bg-[#2B2826] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            + Create Quotation
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#7A6E5E]">
            <span>Active Lead Pipeline</span>
            <div className="p-2 rounded-lg bg-[#FAF7F2] text-[#D92365]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1817]">
            ₹{totalPipelineValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#7A6E5E]">
            <span>{leads.length} Active Hospitality Leads</span>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#7A6E5E]">
            <span>Active Batches In-Flight</span>
            <div className="p-2 rounded-lg bg-[#FAF7F2] text-emerald-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1817]">
            {activeOrders.length} Orders
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>{totalProducedUnits.toLocaleString()} total bottles in queue</span>
          </div>
        </div>

        {/* Card 3: Total Booked Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#7A6E5E]">
            <span>Total Booked Sales</span>
            <div className="p-2 rounded-lg bg-[#FAF7F2] text-[#9C824A]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1A1817]">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#7A6E5E]">
            <span>18% GST Compliant Invoices</span>
          </div>
        </div>

        {/* Card 4: Outstanding Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-[#7A6E5E]">
            <span>Outstanding Balance Due</span>
            <div className="p-2 rounded-lg bg-[#FAF7F2] text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-amber-700">
            ₹{pendingReceivables.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-800">
            <span>Payable prior to dispatch</span>
          </div>
        </div>
      </div>

      {/* Operations Urgent Attention Strip */}
      {(overdueTasks.length > 0 || pendingArtworkOrders.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-sm">Action Items Requiring Priority:</strong>
              <div className="flex flex-wrap gap-4 mt-1 text-amber-800">
                {overdueTasks.length > 0 && (
                  <span>
                    • <strong>{overdueTasks.length}</strong> follow-up tasks due today/overdue
                  </span>
                )}
                {pendingArtworkOrders.length > 0 && (
                  <span>
                    • <strong>{pendingArtworkOrders.length}</strong> batch orders awaiting customer artwork sign-off
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('tasks')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Review Tasks
          </button>
        </div>
      )}

      {/* CRM Funnel Overview + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10-Stage Pipeline Status */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1817]">
                CRM Pipeline Distribution
              </h3>
              <p className="text-xs text-[#7A6E5E]">
                Leads progressing across sales & manufacturing stages
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('crm-leads')}
              className="text-xs font-semibold text-[#D92365] hover:underline flex items-center gap-1"
            >
              <span>View Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stage Progress Bars */}
          <div className="space-y-2.5 pt-2">
            {[
              { key: 'NEW_LEAD', label: '1. New Inquiries', color: 'bg-blue-500' },
              { key: 'SAMPLE_DESIGN', label: '2. 3D Proofing', color: 'bg-purple-500' },
              { key: 'QUOTATION', label: '3. Quotation Sent', color: 'bg-amber-500' },
              { key: 'NEGOTIATION', label: '4. Negotiation', color: 'bg-orange-500' },
              { key: 'ORDER_CONFIRMED', label: '5. Confirmed Orders', color: 'bg-emerald-600' },
              { key: 'PRODUCTION', label: '6. In Cleanroom Production', color: 'bg-cyan-600' },
              { key: 'DELIVERED', label: '7. Delivered', color: 'bg-stone-600' },
              { key: 'REPEAT_ORDER', label: '8. Recurring Accounts', color: 'bg-[#D92365]' },
            ].map((stage) => {
              const count = stageCounts[stage.key] || 0;
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <div key={stage.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-700 font-medium">{stage.label}</span>
                    <span className="font-mono text-stone-500">{count} leads</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4EFE6] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: High-Priority Follow-ups & Recent Inquiries */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif font-bold text-lg text-[#1A1817]">
                Today's Follow-up Calls
              </h3>
              <span className="text-xs bg-[#FAF7F2] text-[#D92365] font-mono font-bold px-2 py-0.5 rounded border border-[#E5DDD0]">
                {tasks.length} Total
              </span>
            </div>

            <div className="divide-y divide-[#F4EFE6]">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-stone-900 block font-semibold">
                      {task.title}
                    </strong>
                    <span className="text-stone-500 block">
                      {task.customerName} • Assigned: {task.assignedTo}
                    </span>
                    <span className="text-stone-400 text-[10px] block">
                      Due: {task.dueDate} • Priority: {task.priority}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/918827275367?text=Hello,%20following%20up%20from%20MLUE%20regarding%20your%20custom%20branded%20water%20bottles.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-indigo-600 hover:text-white text-[#1A1817] border border-[#E5DDD0] transition-colors shrink-0"
                    title="Quick WhatsApp Call / Chat"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('tasks')}
            className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D8CEBE] text-xs font-semibold text-[#1A1817] transition-colors text-center"
          >
            Manage All Scheduled Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
