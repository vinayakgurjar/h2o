import React, { useState } from 'react';
import { Customer } from '../../types';
import { store } from '../../services/store';
import { Building2, Plus, Phone, Mail, MapPin, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(store.getState().customers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Hospitality Client 360 & Account Directory
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Maintain corporate GSTIN credentials, recurring monthly delivery schedules, and customer lifetime value (LTV).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#FAF7F2] border border-[#E5DDD0] text-stone-700 px-3 py-1.5 rounded-xl font-mono font-bold">
            {customers.length} Verified Accounts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((cust) => (
          <div
            key={cust.id}
            onClick={() => setSelectedCustomer(cust)}
            className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs hover:border-[#D92365] transition-all cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-[#FAF7F2] text-stone-600 px-2 py-0.5 rounded font-medium border border-[#E5DDD0]">
                  {cust.businessType}
                </span>
                <span className="font-mono text-xs font-bold text-[#D92365]">
                  LTV: ₹{(cust.totalRevenue || 0).toLocaleString()}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1A1817]">{cust.businessName}</h3>
              <p className="text-xs text-stone-500">Contact: {cust.contactName}</p>

              <div className="pt-3 space-y-1.5 text-xs text-stone-600 border-t border-[#F4EFE6] mt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-mono">{cust.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-mono">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {cust.city}, {cust.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F4EFE6] flex justify-between items-center text-xs">
              <span className="text-stone-500 font-mono text-[11px]">
                GSTIN: {cust.gstin || 'B2C / Pending'}
              </span>
              <span className="font-bold text-[#D92365] text-[11px]">
                {cust.totalOrders || 0} Batches Ordered
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
