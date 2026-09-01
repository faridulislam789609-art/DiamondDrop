import React from 'react';
import { Gem, Sparkles, Trophy, Flame, Shield, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroVisual: React.FC = () => {
  const { weeklyRound } = useApp();

  return (
    <div id="hero-gaming-visual" className="relative flex items-center justify-center p-4 lg:p-8">
      {/* Background ambient glowing spheres */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-600/20 blur-3xl -top-10 -right-10 pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl -bottom-10 -left-10 pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-amber-500/15 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Main Glassmorphic Gaming Loot Crate / Diamond Showcase Container */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-purple-500/30 shadow-2xl shadow-purple-950/50 backdrop-blur-xl overflow-hidden group">
        {/* Top badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            Weekly Grand Drop
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>{weeklyRound.maxWinners} Winners This Week</span>
          </div>
        </div>

        {/* Central 3D-styled Diamond & Chest Graphics */}
        <div className="relative py-8 flex flex-col items-center justify-center">
          {/* Outer rotating neon ring */}
          <div className="absolute w-44 h-44 rounded-full border border-dashed border-cyan-500/40 animate-spin" style={{ animationDuration: '18s' }} />
          <div className="absolute w-52 h-52 rounded-full border border-dashed border-purple-500/30 animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }} />

          {/* Central Glowing Diamond Core */}
          <div className="relative z-10 flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-900 p-0.5 shadow-xl shadow-cyan-500/20 border border-cyan-400/40 group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-2xl bg-[#0b0e24]/90 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent" />
              <Gem className="w-14 h-14 text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-bounce" style={{ animationDuration: '3s' }} />
              
              {/* Shimmer light bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>

          {/* Floating ticket / stat tags */}
          <div className="absolute -left-2 top-8 z-20 bg-slate-900/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>100 Diamonds Pool</span>
          </div>

          <div className="absolute -right-2 bottom-8 z-20 bg-slate-900/90 border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Free Entry</span>
          </div>
        </div>

        {/* Bottom card banner */}
        <div className="mt-2 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Safe In-Game Delivery</span>
          </div>
          <span className="text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            No Passwords Required
          </span>
        </div>
      </div>
    </div>
  );
};
