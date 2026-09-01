import React from 'react';
import {
  Gem,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Flame,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutView: React.FC = () => {
  const { setActiveTab, weeklyRound } = useApp();

  return (
    <div id="about-us-page" className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Gem className="w-4 h-4 text-cyan-400" />
          <span>Independent Community Rewards Platform</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          About DiamondDrop
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          DiamondDrop is a 100% free, community-powered engagement hub built for mobile battle royale fans. We celebrate gaming passion through daily trivia, streak challenges, and weekly diamond gift drops.
        </p>
      </div>

      {/* Mandatory Unaffiliated Community Notice */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold font-gaming text-lg uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Independent Platform Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          <strong>DiamondDrop</strong> is an independent community rewards website and is <strong>not affiliated with, sponsored by, endorsed by, or operated by Garena or Free Fire</strong>. All game trademarks, character names, and assets are the registered trademarks of their respective copyright holders. Diamonds are procured exclusively through authorized regional digital top-up gateways and gifted to verified community winners at zero cost.
        </p>
      </div>

      {/* Core Mission & Value Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-[#090d24]/90 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="font-gaming text-lg font-bold text-white tracking-wide">
            100% Free Participation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            No purchases, deposits, or credit cards are ever required. Users collect participation tickets entirely by engaging in free daily activities like 7-day check-ins and gaming trivia.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 bg-[#090d24]/90 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-gaming text-lg font-bold text-white tracking-wide">
            Zero-Password Security
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never request your Free Fire password, Google or Facebook account credentials, or OTP verification codes. All rewards are fulfilled directly using only your public player UID.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 bg-[#090d24]/90 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-gaming text-lg font-bold text-white tracking-wide">
            Manual Winner Verification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every weekly campaign reward is individually reviewed and manually fulfilled to prevent bot manipulation and ensure genuine community participants receive their diamonds.
          </p>
        </div>
      </div>

      {/* How DiamondDrop Works - 4 Steps */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#070a1e]/90 shadow-2xl space-y-6">
        <div>
          <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            How DiamondDrop Works
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            A simple, transparent process designed around free daily community participation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-gaming text-2xl font-black text-cyan-400">01</div>
            <h4 className="font-gaming text-sm font-bold text-white">Daily Check-in</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log in daily to claim +1 ticket and maintain your streak. Reaching Day 7 unlocks a +5 ticket milestone bonus.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-gaming text-2xl font-black text-purple-400">02</div>
            <h4 className="font-gaming text-sm font-bold text-white">Daily Trivia Quiz</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test your gaming tactics and general knowledge with 5 daily questions to earn +2 additional tickets every single day.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-gaming text-2xl font-black text-amber-400">03</div>
            <h4 className="font-gaming text-sm font-bold text-white">Weekly Campaign Draw</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Sunday, a transparent draw selects up to {weeklyRound.maxWinners} active eligible participants for that round's diamond prize pool.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-gaming text-2xl font-black text-emerald-400">04</div>
            <h4 className="font-gaming text-sm font-bold text-white">Direct Top-Up Delivery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Winners submit their Free Fire Player UID. Our team verifies the request and executes the diamond top-up via authorized channels.
            </p>
          </div>
        </div>
      </div>

      {/* Participation vs Guarantee Disclaimer */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-950/60 space-y-3">
        <h3 className="font-gaming text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Important Clarification on Tickets & Probability
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Tickets earned on DiamondDrop function solely as promotional giveaway entries for the active weekly campaign round. <strong>Tickets hold zero cash value and do not guarantee that any individual user will win a reward.</strong> Participation is strictly voluntary, free of charge, and intended for community entertainment.
        </p>
      </div>

      {/* Action Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20">
        <div>
          <h4 className="font-gaming text-base font-bold text-white">Ready to join the weekly draw?</h4>
          <p className="text-xs text-slate-400">Explore today's activities and start collecting your free tickets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('rules')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
          >
            Review Reward Rules
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-xs font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span>Start Daily Check-in</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
