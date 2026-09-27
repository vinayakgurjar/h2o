import React, { useState } from 'react';
import { PricingRule } from '../../types';
import { store } from '../../services/store';
import { DollarSign, Save, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PricingMasterView: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(
    store.getState().pricingRules
  );
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    store.updatePricingRule(editingRule);
    setPricingRules([...store.getState().pricingRules]);
    setEditingRule(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <h2 className="font-serif font-bold text-xl text-[#1A1817]">
          Pricing & Manufacturing Cost Master
        </h2>
        <p className="text-xs text-[#7A6E5E]">
          Configure production cost baselines, preform raw materials, label printing, carton packaging, and target profit margins.
          All changes immediately reflect across the public 3D customizer and B2B quote calculations.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pricing rules saved and updated live across the operating system!</span>
        </div>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingRules.map((rule) => {
          const unitInternalCost =
            rule.baseBottleCost +
            rule.labelCost +
            rule.printingCost +
            rule.packagingCost +
            rule.designCost +
            rule.deliveryCostPerUnit;
          const unitMargin = unitInternalCost * (rule.targetMarginPct / 100);
          const unitSellingPrice = parseFloat((unitInternalCost + unitMargin).toFixed(2));

          return (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold bg-[#FAF7F2] text-[#D92365] px-2 py-0.5 rounded border border-[#E5DDD0]">
                      {rule.bottleSize}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1A1817] mt-1">
                      {rule.bottleStyle}
                    </h3>
                  </div>

                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white text-stone-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Costing</span>
                  </button>
                </div>

                {/* Costs Breakdown */}
                <div className="space-y-1.5 text-xs py-2 border-y border-[#F4EFE6]">
                  <div className="flex justify-between text-stone-600">
                    <span>Base Preform & IS 14543 Water:</span>
                    <strong className="text-stone-900 font-mono">
                      ₹{rule.baseBottleCost.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Waterproof Synthetic Label:</span>
                    <strong className="text-stone-900 font-mono">
                      ₹{rule.labelCost.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Cylindrical Print & Foil Engraving:</span>
                    <strong className="text-stone-900 font-mono">
                      ₹{rule.printingCost.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Double-Corrugated Carton:</span>
                    <strong className="text-stone-900 font-mono">
                      ₹{rule.packagingCost.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Average Freight / Unit:</span>
                    <strong className="text-stone-900 font-mono">
                      ₹{rule.deliveryCostPerUnit.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Minimum Order Quantity (MOQ):</span>
                    <strong className="text-[#D92365] font-mono">{rule.moq} units</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Result Pill */}
              <div className="pt-2 flex items-center justify-between bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DDD0]">
                <div>
                  <span className="text-[10px] text-stone-400 block">Raw Cost / Unit:</span>
                  <span className="font-mono font-bold text-stone-700">
                    ₹{unitInternalCost.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Target Margin:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    +{rule.targetMarginPct}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Base Selling Rate:</span>
                  <span className="font-mono font-bold text-base text-[#D92365]">
                    ₹{unitSellingPrice} / pc
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#1A1817]">
                Edit Costing: {editingRule.bottleSize} {editingRule.bottleStyle}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Base Preform & Water (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.baseBottleCost}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        baseBottleCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Synthetic Label Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.labelCost}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        labelCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Printing & Foil (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.printingCost}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        printingCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Carton Packaging (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.packagingCost}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        packagingCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Freight / Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.deliveryCostPerUnit}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        deliveryCostPerUnit: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Target Margin %
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editingRule.targetMarginPct}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        targetMarginPct: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Minimum Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={editingRule.moq}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        moq: parseInt(e.target.value) || 300,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    GST Tax %
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editingRule.taxPct}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        taxPct: parseFloat(e.target.value) || 18,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E5DDD0]">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 rounded-lg border border-[#D8CEBE] hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold"
                >
                  Save Costing Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
