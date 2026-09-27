import React from 'react';
import { Columns, Filter, Plus, Search } from 'lucide-react';

export const CrmKanbanSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header & View Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <div className="space-y-2">
          <div className="h-6 w-64 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-80 rounded-md skeleton-shimmer" />
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle Skeleton */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E5DDD0]">
            <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
            <div className="h-7 w-16 rounded-lg skeleton-shimmer" />
          </div>

          {/* New Lead Action Button Skeleton */}
          <div className="h-9 w-36 rounded-xl skeleton-shimmer" />
        </div>
      </div>

      {/* Search & Filter Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#E5DDD0] shadow-xs">
        <div className="flex-1 h-10 rounded-xl skeleton-shimmer" />
        <div className="h-10 w-44 rounded-xl skeleton-shimmer" />
      </div>

      {/* Pipeline Quick Metric Summary Strip Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-3.5 rounded-xl border border-[#E5DDD0] shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded-md skeleton-shimmer" />
              <div className="h-5 w-16 rounded-md skeleton-shimmer" />
            </div>
            <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Kanban Board Columns Horizontal Grid Skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {[
          { title: 'New Inquiries', color: 'border-blue-400' },
          { title: 'Contacted', color: 'border-indigo-400' },
          { title: '3D Proofing', color: 'border-pink-400' },
          { title: 'Quote Sent', color: 'border-amber-400' },
          { title: 'Confirmed Order', color: 'border-emerald-500' },
        ].map((col, idx) => (
          <div
            key={idx}
            className="w-80 flex-shrink-0 flex flex-col bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0] overflow-hidden"
          >
            {/* Column Header */}
            <div className={`p-4 bg-white border-b-2 ${col.color} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 rounded-md skeleton-shimmer" />
                <div className="h-4 w-6 rounded-full skeleton-shimmer" />
              </div>
              <div className="w-6 h-6 rounded-md skeleton-shimmer" />
            </div>

            {/* Column Cards Skeleton Stack */}
            <div className="p-3 space-y-3 flex-1">
              {[1, 2, 3].map((cardIdx) => (
                <div
                  key={cardIdx}
                  className="bg-white p-4 rounded-xl border border-[#E5DDD0] shadow-xs space-y-3"
                >
                  {/* Lead Business & Stage Tag */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 rounded-md skeleton-shimmer" />
                      <div className="h-3 w-24 rounded-md skeleton-shimmer" />
                    </div>
                    <div className="h-4 w-12 rounded-full skeleton-shimmer" />
                  </div>

                  {/* Contact Info lines */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-3 w-32 rounded-md skeleton-shimmer" />
                    <div className="h-3 w-28 rounded-md skeleton-shimmer" />
                  </div>

                  {/* Bottle Format Spec Pill & 3D Thumbnail Placeholder */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#F3EFEA]">
                    <div className="space-y-1">
                      <div className="h-3 w-24 rounded-md skeleton-shimmer" />
                      <div className="h-2.5 w-16 rounded-md skeleton-shimmer" />
                    </div>
                    <div className="w-10 h-10 rounded-md skeleton-shimmer" />
                  </div>

                  {/* Estimated Value & Actions Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F3EFEA]">
                    <div className="h-4 w-20 rounded-md skeleton-shimmer" />
                    <div className="h-6 w-24 rounded-lg skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
