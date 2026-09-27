import React, { useState } from 'react';
import { ComplianceRecord } from '../../types';
import { store } from '../../services/store';
import { ShieldCheck, FileCheck, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export const ComplianceAdmin: React.FC = () => {
  const [records, setRecords] = useState<ComplianceRecord[]>(
    store.getState().complianceRecords
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [authority, setAuthority] = useState('');
  const [docNum, setDocNum] = useState('');
  const [expiry, setExpiry] = useState('2027-12-31');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !docNum) return;

    store.addComplianceRecord({
      title,
      issuingAuthority: authority || 'Bureau of Indian Standards',
      licenceOrDocNumber: docNum,
      expiryDate: expiry,
      status: 'VALID',
    });

    setRecords([...store.getState().complianceRecords]);
    setShowAddModal(false);
    setTitle('');
    setDocNum('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            FSSAI, BIS ISI & NABL Quality Accreditations
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Statutory certificates and periodic water test reports mandated under Bureau of Indian Standards IS 14543.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate Record</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="divide-y divide-[#F4EFE6]">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <strong className="text-sm font-serif font-bold text-stone-900">
                    {rec.title}
                  </strong>
                </div>
                <span className="font-mono text-stone-500 block">
                  Licence / File No: {rec.licenceOrDocNumber} • Issued by: {rec.issuingAuthority}
                </span>
                <span className="text-stone-400 text-[11px] block">
                  Valid Through: <strong>{rec.expiryDate}</strong>
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase w-fit">
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#1A1817]">
                Register Statutory Certificate
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Certificate / Audit Standard Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIS ISI IS 14543 Factory Renewal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Issuing Regulatory Body
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bureau of Indian Standards (BIS)"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Licence / Identification Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CM/L-8700192812"
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5DDD0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8CEBE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
