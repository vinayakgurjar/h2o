import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { store } from '../../services/store';
import { Boxes, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(store.getState().inventory);

  const handleRestock = (itemId: string, qty: number) => {
    store.restockInventory(itemId, qty);
    setItems([...store.getState().inventory]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Raw Materials, Preforms & Bottle Caps
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Track virgin food-grade PET preforms, metallic foil labels, custom colored caps, and cartons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const currentQty = item.availableQuantity ?? item.currentStock;
          const reorderLvl = item.minReorderLevel ?? item.reorderLevel;
          const isLowStock = currentQty <= reorderLvl;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs flex flex-col justify-between space-y-4 ${
                isLowStock ? 'border-amber-400' : 'border-[#E5DDD0]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-[#FAF7F2] font-mono px-2 py-0.5 rounded border border-[#E5DDD0]">
                    {item.category}
                  </span>
                  {isLowStock ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low Stock</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Healthy
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#1A1817]">{item.name || item.itemName}</h3>
                <span className="text-[11px] text-stone-400 font-mono">SKU: {item.sku}</span>

                <div className="mt-4 pt-3 border-t border-[#F4EFE6] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">In Stock:</span>
                    <strong className="font-mono text-stone-900 text-sm">
                      {currentQty.toLocaleString()} {item.unit}
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Reorder Level:</span>
                    <span className="font-mono">{reorderLvl.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleRestock(item.id, 5000)}
                  className="w-full py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white border border-[#E5DDD0] text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restock +5,000</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
