import React, { useState } from 'react';
import { WhatsAppTemplate } from '../../types';
import { store } from '../../services/store';
import { MessageSquare, Send, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';

export const WhatsAppAutomation: React.FC = () => {
  const templates = store.getState().whatsappTemplates;
  const leads = store.getState().leads;
  const [selectedLead, setSelectedLead] = useState(leads[0] || null);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(templates[0]);
  const [copied, setCopied] = useState(false);

  const formatMessage = (body: string) => {
    if (!selectedLead) return body;
    return body
      .replace(/{{CustomerName}}/g, selectedLead.contactName)
      .replace(/{{BusinessName}}/g, selectedLead.businessName)
      .replace(/{{QuoteNumber}}/g, 'QTE-2026-104')
      .replace(/{{TotalAmount}}/g, (selectedLead.estimatedValue || 28500).toLocaleString())
      .replace(/{{OrderNumber}}/g, 'ORD-2026-088')
      .replace(/{{TrackingNumber}}/g, 'BLUEDART-882910')
      .replace(/{{CourierPartner}}/g, 'BlueDart Express')
      .replace(/{{TrackingLink}}/g, `${window.location.origin}/?tab=track&token=${selectedLead.id}`)
      .replace(/{{CustomizerLink}}/g, `${window.location.origin}/#3d-studio`);
  };

  const processedText = formatMessage(selectedTemplate.body);

  const handleCopy = () => {
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchWhatsApp = () => {
    if (!selectedLead) return;
    const phone = selectedLead.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(processedText)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            B2B WhatsApp Messaging & Quick Automation
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Pre-formatted customer notifications with dynamic variable merging and direct web chat integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Templates List */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Select Trigger Template
          </label>
          <div className="space-y-2">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-white border-[#D92365] shadow-xs'
                    : 'bg-white border-[#E5DDD0] hover:border-stone-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#1A1817]">{tmpl.name}</span>
                  <span className="text-[10px] bg-[#FAF7F2] px-2 py-0.5 rounded font-mono text-stone-600 border border-[#E5DDD0]">
                    {tmpl.trigger}
                  </span>
                </div>
                <p className="text-stone-500 text-xs line-clamp-2">{tmpl.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message Preview & Send */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-[#1A1817]">
              Message Personalization
            </h3>
            <span className="text-xs text-stone-500">Live Preview</span>
          </div>

          {/* Lead Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Recipient (Lead / Customer)
            </label>
            <select
              value={selectedLead?.id || ''}
              onChange={(e) => {
                const l = leads.find((x) => x.id === e.target.value);
                if (l) setSelectedLead(l);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CEBE] text-xs font-semibold"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName} ({l.contactName} - {l.phone})
                </option>
              ))}
            </select>
          </div>

          {/* WhatsApp Chat Bubble Mockup */}
          <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#D8CEBE] min-h-[220px] flex flex-col justify-end">
            <div className="max-w-md bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm text-xs text-stone-800 whitespace-pre-wrap leading-relaxed border border-[#E5DDD0]">
              {processedText}
              <div className="text-right text-[10px] text-stone-400 mt-2">Just now • ✓✓</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#D8CEBE] text-stone-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleLaunchWhatsApp}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
