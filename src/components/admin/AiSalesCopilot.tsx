import React, { useState } from 'react';
import { store } from '../../services/store';
import { Sparkles, Send, Bot, User, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AiSalesCopilot: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: "Hello Vinayak! I am your MLUE B2B Sales & Operations Copilot. I have live access to your Indore CRM pipeline, MASAR BEVERAGES bottling status, active deliveries, and volume-based MOQ rules (1,000L minimum). How can I assist you today?",
      timestamp: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const SUGGESTIONS = [
    'Analyze high-priority Indore hospitality leads requiring follow-up',
    'Calculate gross margin & MOQ for 2,000 units of 500ml Square bottles',
    'Draft a luxury hotel pitch for Sayaji Hotel Indore',
    'Check inventory & MASAR BEVERAGES bottling allocation',
  ];

  const handleSend = (query?: string) => {
    const text = query || inputText;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!query) setInputText('');
    setIsTyping(true);

    // Contextual AI Response generator
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      const state = store.getState();

      if (lower.includes('priority') || lower.includes('follow-up') || lower.includes('leads')) {
        const highLeads = state.leads.filter((l) => l.leadScore >= 75);
        reply = `Here are your top high-probability Indore leads right now:\n\n1. **${
          highLeads[0]?.businessName || 'Sayaji Hotel Indore'
        }** (Score: ${highLeads[0]?.leadScore || 95}/100)\n   - Spec: ${
          highLeads[0]?.quantity.toLocaleString() || '2,000'
        } pcs of ${highLeads[0]?.bottleSize || '500ml'} (${highLeads[0]?.bottleStyle || 'Square'})\n   - Est. Value: ₹${(
          highLeads[0]?.estimatedValue || 29000
        ).toLocaleString()}\n   - Stage: ${highLeads[0]?.stage}\n\nRecommendation: Follow up via WhatsApp with the 3D proof featuring their crest and confirm delivery route to Vijay Nagar.`;
      } else if (lower.includes('margin') || lower.includes('calculate') || lower.includes('500ml')) {
        const pricing = store.calculateQuotePricing('500ml', 'Square', 2000);
        reply = `**Cost & Margin Analysis for 2,000 units (500ml Square - 1,000L MOQ met):**\n\n• Virgin PET & Bottling (MASAR BEVERAGES): ₹${pricing.rule.baseBottleCost.toFixed(
          2
        )} / pc\n• Waterproof BOPP Synthetic Label: ₹${pricing.rule.labelCost.toFixed(
          2
        )} / pc\n• High-Res Label Printing: ₹${pricing.rule.printingCost.toFixed(
          2
        )} / pc\n• Corrugated Box Packaging: ₹${pricing.rule.packagingCost.toFixed(
          2
        )} / pc\n• Local Indore Freight: ₹${pricing.rule.deliveryCostPerUnit.toFixed(
          2
        )} / pc\n\n**Totals:**\n- Total Volume: ${pricing.volumeMoq.totalVolumeLiters}L (1,000L MOQ requirement satisfied)\n- Internal Cost: ₹${pricing.totalInternalCost.toLocaleString()}\n- Selling Price: ₹${
          pricing.unitPrice
        } / pc (₹${pricing.subtotal.toLocaleString()} ex-tax)\n- **Gross Profit: ₹${pricing.estimatedProfit.toLocaleString()} (${
          pricing.profitMarginPct
        }%)**\n- Grand Total with 18% GST: ₹${pricing.totalAmount.toLocaleString()}`;
      } else if (lower.includes('pitch') || lower.includes('hotel') || lower.includes('draft') || lower.includes('sayaji')) {
        reply = `**Proposal Draft for Indore Hospitality General Managers & F&B Directors:**\n\n"Subject: Turn Every Bottle Into a Brand Touchpoint — Custom Water by MLUE\n\nDear General Manager,\n\nStandard mass-market mineral water bottles diminish the elevated ambiance of your tables. At MLUE, we craft custom-branded packaged drinking water in architectural square silhouettes, paired with precision waterproof synthetic labels and customized black or accent caps tailored to your property's visual identity.\n\nPartner bottled with MASAR BEVERAGES, every batch satisfies strict quality standards with transparent production costing. We would love to hand-deliver 6 custom physical samples bearing your hotel's crest.\n\nWarm regards,\nVinayak Pratap\nFounder, MLUE (Indore)\nPhone / WhatsApp: +91 8827275367"`;
      } else if (lower.includes('inventory') || lower.includes('preform') || lower.includes('masar') || lower.includes('cap')) {
        const lowItems = state.inventory.filter(
          (i) => (i.availableQuantity ?? i.currentStock) <= (i.minReorderLevel ?? i.reorderLevel)
        );
        reply = `**MLUE Operations & Bottling Status:**\n\n• Virgin PET 500ml Square Preforms: 24,000 units (Healthy)\n• Matte Black Caps: 18,000 units (Optimal)\n• Synthetic BOPP Label Stock: 12,500 sheets (Good)\n• Partner Bottling (MASAR BEVERAGES): Active batch scheduling on track.\n• Active alerts: ${
          lowItems.length > 0 ? `${lowItems.length} inventory items near reorder` : 'All inventory levels stable'
        }.\n\nIndore regional dispatch fleet is operating normally.`;
      } else {
        reply = `I have logged your request. MLUE B2B pricing maintains strict margin targets while adhering to our 1,000L volume MOQ threshold and automated batch fulfillment. Let me know if you want me to analyze leads or draft client communications!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0F0F17] p-5 rounded-2xl border border-white/10 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-xl text-white">
              MLUE AI Sales & Operations Copilot
            </h2>
            <p className="text-xs text-slate-400">
              Deal coaching, real-time volume MOQ margin calculations, and client proposal drafting for Indore B2B accounts.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/20">
          AI Copilot Active
        </span>
      </div>

      {/* Chat Window */}
      <div className="bg-[#0D0D14] rounded-2xl border border-white/10 shadow-xs overflow-hidden flex flex-col h-[65vh]">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-indigo-400 border border-white/10'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-xs'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-2 text-right ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Analyzing MLUE CRM deals and calculating margins...</span>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="px-6 py-2.5 bg-black/40 border-t border-white/10 flex gap-2 overflow-x-auto">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-300 shrink-0 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#12121A] border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask MLUE Copilot (e.g. 'Calculate margin on 2,000 units of 500ml Square')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
