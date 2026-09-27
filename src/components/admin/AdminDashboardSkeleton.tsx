import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner & Quick Actions Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <div className="space-y-2">
          {/* Telemetry Indicator Pill */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="h-3 w-40 rounded-full skeleton-shimmer" />
          </div>
          {/* Title bar */}
          <div className="h-7 w-72 rounded-lg skeleton-shimmer" />
          {/* Subtitle bar */}
          <div className="h-3.5 w-96 rounded-md skeleton-shimmer" />
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-32 rounded-xl skeleton-shimmer" />
          <div className="h-9 w-36 rounded-xl skeleton-shimmer" />
        </div>
      </div>

      {/* KPI Metric Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-3"
          >
            {/* Top row: Label & Icon */}
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-28 rounded-md skeleton-shimmer" />
              <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
            </div>

            {/* Big Value Number */}
            <div className="h-8 w-32 rounded-lg skeleton-shimmer" />

            {/* Bottom Sub-metric / Status pill */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#F3EFEA]">
              <div className="h-3 w-36 rounded-md skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Stage Distribution Strip Skeleton */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-44 rounded-md skeleton-shimmer" />
          <div className="h-3 w-28 rounded-md skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] space-y-1.5"
            >
              <div className="h-2.5 w-16 rounded-md skeleton-shimmer" />
              <div className="h-5 w-8 rounded-md skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Orders & Production Pipeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-48 rounded-md skeleton-shimmer" />
                <div className="h-4 w-12 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-3 w-20 rounded-md skeleton-shimmer" />
            </div>

            {/* Order Card Skeletons */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="p-4 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Bottle/Artwork Thumbnail Skeleton */}
                    <div className="w-12 h-16 rounded-lg skeleton-shimmer flex-shrink-0" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-28 rounded-md skeleton-shimmer" />
                        <div className="h-4 w-20 rounded-full skeleton-shimmer" />
                      </div>
                      <div className="h-3 w-44 rounded-md skeleton-shimmer" />
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-24 rounded-md skeleton-shimmer" />
                        <div className="h-3 w-20 rounded-md skeleton-shimmer" />
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div className="h-5 w-24 rounded-md skeleton-shimmer" />
                    <div className="h-7 w-28 rounded-lg skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Urgent Action Required & Tasks (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full skeleton-shimmer" />
                <div className="h-5 w-36 rounded-md skeleton-shimmer" />
              </div>
              <div className="h-4 w-8 rounded-full skeleton-shimmer" />
            </div>

            {/* Task Item Skeletons */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="p-3.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-16 rounded-full skeleton-shimmer" />
                    <div className="h-3 w-20 rounded-md skeleton-shimmer" />
                  </div>
                  <div className="h-4 w-full rounded-md skeleton-shimmer" />
                  <div className="flex items-center justify-between pt-1">
                    <div className="h-3 w-28 rounded-md skeleton-shimmer" />
                    <div className="h-3 w-16 rounded-md skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facility Cleanroom & Compliance Footer Banner Skeleton */}
      <div className="bg-white p-4 rounded-xl border border-[#E5DDD0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          <div className="space-y-1">
            <div className="h-3.5 w-48 rounded-md skeleton-shimmer" />
            <div className="h-2.5 w-64 rounded-md skeleton-shimmer" />
          </div>
        </div>
        <div className="h-7 w-32 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
};
