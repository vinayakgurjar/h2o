import React, { useState } from 'react';
import { DeliveryRecord } from '../../types';
import { store } from '../../services/store';
import { Truck, CheckCircle2, Clock, MapPin, ExternalLink, Plus } from 'lucide-react';

export const DeliveriesManagement: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(
    store.getState().deliveries
  );
  const [newDispatchOpen, setNewDispatchOpen] = useState(false);

  const handleStatusChange = (id: string, status: any) => {
    store.updateDeliveryStatus(id, status);
    setDeliveries([...store.getState().deliveries]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Dispatch, Cargo & Last-Mile Logistics
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Track multi-corrugated carton shipments, transport waybills, and proof-of-delivery receipts for hotels and venues.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5DDD0] text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Dispatch ID</th>
                <th className="py-3 px-4">Hotel / Venue</th>
                <th className="py-3 px-4">Courier & Waybill</th>
                <th className="py-3 px-4">Boxes & Units</th>
                <th className="py-3 px-4">Dispatch Date</th>
                <th className="py-3 px-4">Est. Arrival</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#D92365]">
                    {del.deliveryNumber || del.deliveryId}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-stone-900 block font-semibold">
                      {del.customerName}
                    </strong>
                    <span className="text-stone-400 text-[10px]">{del.destinationCity}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-800 block">
                      {del.courierPartner}
                    </span>
                    <span className="font-mono text-[11px] text-stone-500">
                      {del.trackingNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {del.cartonCount ? `${del.cartonCount} cartons • ` : ''}
                    {(del.bottlesCount ?? 1000).toLocaleString()} pcs
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600">
                    {del.dispatchDate ? new Date(del.dispatchDate).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600">
                    {del.estimatedArrival || del.estimatedDelivery ? new Date(del.estimatedArrival || del.estimatedDelivery || '').toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        del.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : del.status === 'IN_TRANSIT'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {del.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {del.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleStatusChange(del.id, 'DELIVERED')}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-semibold text-[11px] transition-colors"
                      >
                        Confirm Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
