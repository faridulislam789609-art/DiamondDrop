import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { activeToast } = useApp();

  if (!activeToast) return null;

  return (
    <div
      id="app-toast-alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0e1430] border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 text-slate-100"
    >
      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-bold text-cyan-300">DiamondDrop Notification</p>
        <p className="text-slate-200 mt-0.5 leading-snug">{activeToast}</p>
      </div>
    </div>
  );
};
