import React from 'react';
import { store } from '../../services/store';
import { History, Shield, Clock } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const auditLogs = store.getState().auditLogs;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex justify-between items-center">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            System Audit Trail & Security Ledger
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Immutable timestamped record of user actions, stage transitions, price changes, and payments.
          </p>
        </div>

        <span className="text-xs bg-[#FAF7F2] font-mono px-3 py-1.5 rounded-lg border border-[#E5DDD0] text-stone-700 font-bold">
          {auditLogs.length} Events Logged
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs">
        <div className="divide-y divide-[#F4EFE6]">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[11px] bg-[#FAF7F2] text-[#D92365] px-2 py-0.5 rounded border border-[#E5DDD0]">
                    {log.action}
                  </span>
                  <strong className="text-stone-900 font-medium">{log.entityType}</strong>
                  <span className="font-mono text-stone-400 text-[10px]">#{log.entityId}</span>
                </div>
                <p className="text-stone-600 text-[11px]">{log.details}</p>
                <span className="text-stone-400 text-[10px] block">By: {log.performedBy}</span>
              </div>

              <span className="font-mono text-stone-400 text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
