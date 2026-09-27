import React, { useState } from 'react';
import { CompanySettings } from '../../types';
import { store } from '../../services/store';
import { saveCompanySettingsToFirestore } from '../../services/firebase';
import { showToast } from '../../utils/toast';
import { Settings, Save, Download, Upload, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>(store.getState().companySettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCompanySettings(settings);
    try {
      await saveCompanySettingsToFirestore(settings);
    } catch (err) {
      console.warn('Firestore sync warning:', err);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const json = store.exportStateJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mlue-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const ok = store.importStateJson(content);
      if (ok) {
        showToast('System data restored successfully from backup!', 'success');
        setSettings(store.getState().companySettings);
      } else {
        showToast('Failed to parse backup JSON. Invalid format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    store.resetToDemoData();
    setSettings(store.getState().companySettings);
    showToast('System restored to clean factory demo data.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <h2 className="font-serif font-bold text-xl text-[#1A1817]">
          Company Profile & Operating Database Settings
        </h2>
        <p className="text-xs text-[#7A6E5E]">
          Maintain registered GSTIN numbers, statutory FSSAI and BIS licences, and database backups.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      {/* Company Details Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4 text-xs">
        <h3 className="font-serif font-bold text-base text-[#1A1817]">
          Statutory Legal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Company Legal Name</label>
            <input
              type="text"
              required
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Brand Name</label>
            <input
              type="text"
              required
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">GSTIN (15 Digits)</label>
            <input
              type="text"
              required
              value={settings.gstin}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE] font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">PAN Number</label>
            <input
              type="text"
              required
              value={settings.pan}
              onChange={(e) => setSettings({ ...settings, pan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE] font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">FSSAI Licence Number</label>
            <input
              type="text"
              required
              value={settings.fssaiLicence}
              onChange={(e) => setSettings({ ...settings, fssaiLicence: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE] font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">BIS ISI Licence Standard</label>
            <input
              type="text"
              required
              value={settings.bisLicence}
              onChange={(e) => setSettings({ ...settings, bisLicence: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE] font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-stone-700 mb-1">Plant & Bottling Facility Address</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Support Phone</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Official Email</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Disaster Recovery */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4 text-xs">
        <h3 className="font-serif font-bold text-base text-[#1A1817]">
          Data Export & Disaster Recovery
        </h3>
        <p className="text-stone-500">
          Export the entire operating system state (leads, quotes, orders, design proofs, inventory, and logs) as a portable JSON snapshot.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-[#1A1817] hover:bg-[#2B2826] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Snapshot (.JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D8CEBE] text-stone-800 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Snapshot (.JSON)</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs flex items-center gap-1.5 border border-red-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
