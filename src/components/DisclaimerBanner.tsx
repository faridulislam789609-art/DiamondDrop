import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  return (
    <div
      id="disclaimer-banner"
      className={`bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-blue-950/70 border-b border-purple-500/20 text-slate-300 ${
        compact ? 'py-1.5 px-3 text-xs' : 'py-2.5 px-4 text-xs sm:text-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
          <p className="leading-snug">
            <strong className="text-amber-400 font-semibold uppercase tracking-wider text-[11px] mr-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Community Notice
            </strong>
            DiamondDrop is an independent fan community platform. We are <strong>NOT</strong> affiliated with, sponsored by, or endorsed by <strong>Garena</strong> or <strong>Free Fire</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
