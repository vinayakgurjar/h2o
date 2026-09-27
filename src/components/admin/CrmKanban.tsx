import React, { useState } from 'react';
import { Lead, LeadStage } from '../../types';
import { store } from '../../services/store';
import {
  Search,
  Filter,
  Columns,
  List,
  Plus,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  MessageCircle,
  X,
  UserCheck,
} from 'lucide-react';
import { Bottle3DCanvas } from '../3d/Bottle3DCanvas';
import { showToast } from '../../utils/toast';

interface CrmKanbanProps {
  onOpenNewLead: () => void;
  onOpenQuoteForLead: (lead: Lead) => void;
}

const ALL_STAGES: { key: LeadStage; title: string; color: string }[] = [
  { key: 'NEW_LEAD', title: 'New Inquiries', color: 'border-blue-400' },
  { key: 'CONTACTED', title: 'Contacted', color: 'border-indigo-400' },
  { key: 'INTERESTED', title: 'Interested', color: 'border-purple-400' },
  { key: 'SAMPLE_DESIGN', title: '3D Proofing', color: 'border-pink-400' },
  { key: 'QUOTATION', title: 'Quote Sent', color: 'border-amber-400' },
  { key: 'NEGOTIATION', title: 'Negotiation', color: 'border-orange-400' },
  { key: 'ORDER_CONFIRMED', title: 'Confirmed Order', color: 'border-emerald-500' },
  { key: 'PRODUCTION', title: 'In Production', color: 'border-cyan-500' },
  { key: 'DELIVERED', title: 'Delivered', color: 'border-stone-500' },
  { key: 'REPEAT_ORDER', title: 'Repeat Accounts', color: 'border-[#D92365]' },
];

export const CrmKanban: React.FC<CrmKanbanProps> = ({
  onOpenNewLead,
  onOpenQuoteForLead,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const leads = store.getState().leads;

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery);

    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleStageMove = (leadId: string, newStage: LeadStage) => {
    store.updateLeadStage(leadId, newStage);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: newStage });
    }
  };

  const handleConvertToCustomer = (lead: Lead) => {
    store.convertLeadToCustomer(lead.id);
    showToast(`Successfully created official customer account for ${lead.businessName}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Hospitality Leads & Sales Pipeline
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Track customer relationships from initial 3D studio mockup to recurring monthly deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E5DDD0]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#1A1817] shadow-xs'
                  : 'text-[#7A6E5E] hover:text-[#1A1817]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#1A1817] shadow-xs'
                  : 'text-[#7A6E5E] hover:text-[#1A1817]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenNewLead}
            className="px-3.5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-[#E5DDD0]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter leads by hotel/café name, city, phone..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5DDD0] text-xs focus:outline-none focus:border-[#D92365]"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5DDD0] text-xs font-medium focus:outline-none"
        >
          <option value="ALL">All Stages ({leads.length})</option>
          {ALL_STAGES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* View 1: 10-Stage Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1700px]">
            {ALL_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
              const stageValue = stageLeads.reduce(
                (sum, l) => sum + (l.estimatedValue || 0),
                0
              );

              return (
                <div
                  key={stage.key}
                  className="w-72 shrink-0 bg-[#F4EFE6]/60 rounded-2xl p-3 border border-[#E5DDD0] flex flex-col max-h-[75vh]"
                >
                  {/* Stage Header */}
                  <div className={`pb-2 mb-2 border-b-2 ${stage.color} flex justify-between items-start`}>
                    <div>
                      <h3 className="font-bold text-xs text-[#1A1817] uppercase tracking-wider">
                        {stage.title}
                      </h3>
                      <span className="text-[10px] text-[#7A6E5E]">
                        ₹{stageValue.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-white text-stone-700 px-2 py-0.5 rounded-full border border-[#E5DDD0]">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white p-3 rounded-xl border border-[#E5DDD0] shadow-xs hover:shadow-md hover:border-[#D92365] transition-all cursor-pointer space-y-2 group"
                      >
                        {/* Card Header: Score & Business Type */}
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-semibold bg-[#FAF7F2] text-stone-600 px-2 py-0.5 rounded">
                            {lead.businessType}
                          </span>
                          <span
                            className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                              lead.leadScore >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : lead.leadScore >= 60
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                            title="Automated Lead Quality Score"
                          >
                            Score: {lead.leadScore}
                          </span>
                        </div>

                        {/* Title & Contact */}
                        <div>
                          <h4 className="font-bold text-xs text-[#1A1817] group-hover:text-[#D92365] transition-colors line-clamp-1">
                            {lead.businessName}
                          </h4>
                          <span className="text-[11px] text-[#7A6E5E] block">
                            {lead.contactName} • {lead.city}
                          </span>
                        </div>

                        {/* Spec Details */}
                        <div className="flex justify-between items-center text-[11px] font-mono pt-1 border-t border-[#F4EFE6] text-stone-600">
                          <span>
                            {lead.quantity.toLocaleString()} × {lead.bottleSize}
                          </span>
                          <strong className="text-[#1A1817]">
                            ₹{lead.estimatedValue.toLocaleString()}
                          </strong>
                        </div>

                        {/* Assignee & Next Follow-up */}
                        <div className="flex justify-between items-center text-[10px] text-[#7A6E5E] pt-1">
                          <span className="truncate max-w-[120px]">
                            Rep: {lead.assignedTo || 'Unassigned'}
                          </span>
                          {lead.nextFollowUpAt && (
                            <span className="text-amber-700 font-medium">
                              Due: {lead.nextFollowUpAt.split('T')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="py-8 text-center text-stone-400 text-xs italic">
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: High Density Data Table */
        <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Hotel / Venue</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Bottle Spec</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Est. Value</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE6]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3 px-4 font-semibold text-[#1A1817]">
                      {lead.businessName}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {lead.city} • {lead.businessType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {lead.contactName}
                      <span className="block text-[10px] text-stone-400">{lead.phone}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {lead.bottleSize}
                      <span className="block text-[10px] text-stone-400">{lead.bottleStyle}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{lead.quantity.toLocaleString()} pcs</td>
                    <td className="py-3 px-4 font-bold font-mono text-[#D92365]">
                      ₹{lead.estimatedValue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lead.leadScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lead.leadScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-[10px]">
                        {lead.stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{lead.assignedTo || '—'}</td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded hover:bg-[#F4EFE6] text-stone-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail & 360 Workspace Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E5DDD0] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-[#FAF7F2] text-[#D92365] px-2 py-0.5 rounded border border-[#E5DDD0]">
                    {selectedLead.id}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Score: {selectedLead.leadScore}/100
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#1A1817] mt-1">
                  {selectedLead.businessName}
                </h3>
                <p className="text-xs text-[#7A6E5E]">
                  {selectedLead.businessType} • {selectedLead.city} • Lead Source: {selectedLead.source}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F4EFE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Action Toolbar */}
              <div className="flex flex-wrap gap-2.5 pb-4 border-b border-[#E5DDD0]">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedLead.contactName
                  )},%20this%20is%20Vinayak%20Pratap%20from%20MLUE.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Contact</span>
                </a>

                <button
                  onClick={() => {
                    const lead = selectedLead;
                    setSelectedLead(null);
                    onOpenQuoteForLead(lead);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1A1817] hover:bg-[#2B2826] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Draft Formal Quotation</span>
                </button>

                <button
                  onClick={() => handleConvertToCustomer(selectedLead)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D8CEBE] hover:bg-[#FAF7F2] text-xs font-semibold text-[#1A1817] flex items-center gap-1.5 shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Convert to Customer Record</span>
                </button>
              </div>

              {/* Stage Stepper Dropdown */}
              <div className="p-4 rounded-xl bg-white border border-[#E5DDD0] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1817]">
                  Move Lead Across 10 CRM Pipeline Stages:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ALL_STAGES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleStageMove(selectedLead.id, s.key)}
                      className={`p-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                        selectedLead.stage === s.key
                          ? 'bg-[#1A1817] text-white border-[#1A1817] shadow-xs'
                          : 'bg-[#FAF7F2] text-stone-700 border-[#E5DDD0] hover:bg-white'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Info & 3D Spec Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact & Commercials */}
                <div className="bg-white p-5 rounded-xl border border-[#E5DDD0] space-y-3 text-xs">
                  <h4 className="font-serif font-bold text-base text-[#1A1817]">
                    Contact & Batch Specs
                  </h4>

                  <div className="divide-y divide-[#F4EFE6] space-y-2">
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Contact Person:</span>
                      <strong className="text-stone-900">{selectedLead.contactName}</strong>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Phone:</span>
                      <span className="font-mono">{selectedLead.phone}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Email:</span>
                      <span className="font-mono">{selectedLead.email}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Order Quantity:</span>
                      <strong className="text-stone-900">
                        {selectedLead.quantity.toLocaleString()} units
                      </strong>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Bottle Model:</span>
                      <strong className="text-[#D92365]">
                        {selectedLead.bottleSize} • {selectedLead.bottleStyle}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Estimated Pipeline Value:</span>
                      <strong className="text-stone-900 font-mono text-sm">
                        ₹{selectedLead.estimatedValue.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">Assigned Sales Executive:</span>
                      <span className="font-medium text-stone-800">
                        {selectedLead.assignedTo || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  {selectedLead.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-[#FAF7F2] text-stone-700 text-xs border border-[#E5DDD0]">
                      <strong className="block text-[11px] uppercase text-stone-500 mb-1">
                        Inquiry Notes:
                      </strong>
                      <p>{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* 3D Bottle Specification Preview */}
                <div className="bg-white p-5 rounded-xl border border-[#E5DDD0] flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#1A1817] mb-2">
                      Configured 3D Design Spec
                    </h4>
                    <p className="text-xs text-[#7A6E5E] mb-3">
                      Brand: <strong>{selectedLead.customization?.brandName || selectedLead.businessName}</strong>
                    </p>
                  </div>

                  <div className="h-64 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] overflow-hidden relative">
                    <Bottle3DCanvas
                      customization={
                        selectedLead.customization || {
                          bottleSize: selectedLead.bottleSize,
                          bottleStyle: selectedLead.bottleStyle,
                          capColor: '#111118',
                          labelColor: '#181824',
                          labelStyle: 'MLUE Indigo Signature',
                          brandName: selectedLead.businessName,
                          tagline: 'Custom Packaged Drinking Water',
                          finish: 'Gloss',
                        }
                      }
                      interactive={true}
                      className="w-full h-full"
                    />
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
