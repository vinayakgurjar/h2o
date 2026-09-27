import React, { useState } from 'react';
import { ProductionJob } from '../../types';
import { store } from '../../services/store';
import { Factory, CheckCircle2, AlertTriangle, Play, Pause, RefreshCw, Layers } from 'lucide-react';

export const ProductionManagement: React.FC = () => {
  const [jobs, setJobs] = useState<ProductionJob[]>(store.getState().productionJobs);
  const [editingJob, setEditingJob] = useState<ProductionJob | null>(null);

  const handleUpdateProgress = (jobId: string, deltaProduced: number, deltaRejected: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    store.updateProductionJobProgress(jobId, job.producedQuantity + deltaProduced);
    setJobs([...store.getState().productionJobs]);
  };

  const handleStatusChange = (jobId: string, status: any) => {
    store.updateProductionJobStatus(jobId, status);
    setJobs([...store.getState().productionJobs]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6E5E]">
              Plant 1 Cleanroom • Live Automation Line
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817] mt-1">
            Cleanroom Bottling & Batch Production
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Monitor blow-molding, multi-stage water filtration, UV sterilization, shrink-labeling, and quality testing.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs bg-[#FAF7F2] border border-[#E5DDD0] text-stone-700 px-3 py-1.5 rounded-xl font-mono font-bold">
            {jobs.length} Active Cleanroom Batches
          </span>
        </div>
      </div>

      {/* Production Jobs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const targetQty = job.targetQuantity || job.orderedQuantity || 1;
          const progressPct = Math.min(
            100,
            Math.round((job.producedQuantity / targetQty) * 100)
          );
          const jobStatus = job.status || (job.stage === 'READY' ? 'COMPLETED' : 'RUNNING');

          return (
            <div
              key={job.id}
              className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold bg-[#FAF7F2] text-[#D92365] px-2 py-0.5 rounded border border-[#E5DDD0]">
                      {job.jobId || job.orderNumber}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1A1817] mt-1">
                      {job.customerName || job.businessName}
                    </h3>
                    <span className="text-xs text-stone-500">
                      Line: <strong>{job.line || job.supplierOrPlant}</strong> • Size: <strong>{job.bottleSize}</strong>
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      jobStatus === 'RUNNING'
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : jobStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {jobStatus}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">Produced vs Target</span>
                    <strong className="font-mono text-stone-900">
                      {job.producedQuantity.toLocaleString()} / {targetQty.toLocaleString()}{' '}
                      pcs ({progressPct}%)
                    </strong>
                  </div>

                  <div className="w-full h-3 bg-[#F4EFE6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Rejected / Quality Defect Count */}
                <div className="flex justify-between items-center text-xs pt-3 text-stone-500 border-t border-[#F4EFE6] mt-3">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Optical QC Rejections:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-700">
                    {job.rejectedQuantity} units
                  </span>
                </div>
              </div>

              {/* Action Controls for Plant Operator */}
              <div className="pt-3 border-t border-[#E5DDD0] flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleUpdateProgress(job.id, 250, 2)}
                    className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#D92365] hover:text-white border border-[#E5DDD0] text-stone-700 font-semibold text-xs transition-colors"
                  >
                    +250 Units Passed
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(job.id, 0, 5)}
                    className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-amber-100 text-amber-800 border border-[#E5DDD0] font-semibold text-xs transition-colors"
                  >
                    +5 Rejected
                  </button>
                </div>

                <div className="flex gap-1">
                  {jobStatus !== 'RUNNING' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'RUNNING')}
                      className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="Start Line"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {jobStatus === 'RUNNING' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'PAUSED')}
                      className="p-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                      title="Pause Line"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {jobStatus !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'COMPLETED')}
                      className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      title="Mark Complete"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
