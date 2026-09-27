import React, { useState } from 'react';
import { X, Play, CheckCircle2, ShieldCheck, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { LEAD_CONFIG } from '../../config/leadConfig';

interface VideoCommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: () => void;
}

export const VideoCommercialModal: React.FC<VideoCommercialModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#05070B] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0C1019]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
            <h3 className="text-xs font-black text-white font-syne uppercase tracking-wider">
              H2O Energy — Brand Manifesto & Cleanroom Canning Tour
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#070A10] hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close video modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display Container */}
        <div className="relative aspect-video bg-[#05070B] overflow-hidden group flex items-center justify-center">
          
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 cyber-grid-cyan opacity-40" />

          {/* Dynamic Laser & Ambient Rings */}
          <div className="absolute w-72 h-72 rounded-full bg-[#00F0FF]/15 blur-3xl animate-pulse" />
          <div className="absolute w-56 h-56 rounded-full bg-[#BD00FF]/15 blur-2xl" />

          {/* Central Play Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-2xl bg-[#00F0FF] text-[#05070B] flex items-center justify-center shadow-xl glow-cyan hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              aria-label="Play brand manifesto"
            >
              <Play className="w-7 h-7 ml-1 fill-[#05070B]" />
            </button>

            <div className="max-w-md">
              <span className="text-[11px] font-bold font-space uppercase tracking-widest text-[#00F0FF] block mb-1">
                CINEMATIC MANIFESTO (4K)
              </span>
              <h4 className="text-xl sm:text-2xl font-black font-syne uppercase text-white">
                “Overclock Your Reality” — The H2O Story
              </h4>
              <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed">
                Watch how we formulate 200mg green coffee caffeine, Cognizin® citicoline, and pure Himalayan electrolytes in an automated sterile nitrogen cleanroom.
              </p>
            </div>

            {isPlaying && (
              <div className="p-3 rounded-xl bg-[#070A10]/90 border border-emerald-500/40 text-emerald-300 text-xs font-space">
                ✓ Streaming 4K Master Video Feed • 60 FPS • Stereo Audio Synced
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-[#0C1019] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-space text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <span>FSSAI Cleanroom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#39FF14]" />
              <span>Zero Sugar Matrix</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQuoteModal();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#05070B] font-black text-xs uppercase tracking-wider font-space glow-cyan-sm transition-all cursor-pointer min-h-[44px]"
          >
            Request Squad Drop Quotation
          </button>
        </div>

      </div>
    </div>
  );
};
