import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  Gift,
  Users,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RulesView: React.FC = () => {
  const { setActiveTab, weeklyRound } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const coreRules = [
    {
      title: '100% Free Entry & No Purchase Necessary',
      description: 'Participation in DiamondDrop is completely free of charge. No payment, deposit, subscription, or real-money transaction is ever required to participate.',
      icon: <Gift className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Legitimate Ticket Earning Activities',
      description: 'Tickets can only be earned through legitimate website activities: Daily Check-in (+1 ticket), 7-Day Streak Bonus (+5 tickets), and Daily Gaming Trivia (+2 tickets).',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Tickets Increase Entries, No Guaranteed Win',
      description: 'Each ticket represents an entry in the weekly randomized draw. While more tickets increase your probability, winning is never guaranteed for any participant.',
      icon: <Award className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Weekly Campaign Cycles & Schedule',
      description: 'Each campaign round operates weekly from Monday 00:00 UTC through Sunday 23:59 UTC, at which point the selection draw is conducted.',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
    },
    {
      title: `Up to ${weeklyRound.maxWinners} Verified Winners Per Campaign`,
      description: `The number of winners is established per campaign (currently ${weeklyRound.maxWinners} winners for ${weeklyRound.title}). Each selected winner receives ${weeklyRound.prizeDiamonds} Free Fire Diamonds.`,
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Strict Single Account & Anti-Bot Policy',
      description: 'One individual person may operate only one account. Multiple-account abuse, bot scripts, or automated tools result in immediate disqualification and account ban.',
      icon: <Users className="w-5 h-5 text-rose-400" />,
    },
    {
      title: '1 Player UID per Account',
      description: 'Each DiamondDrop account may link to only one Free Fire Player UID. Transferring, spoofing, or submitting fake player IDs is strictly prohibited.',
      icon: <Lock className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Winner Verification & UID Validation',
      description: 'Winners must provide an active, valid Free Fire Player numerical UID, In-Game Name (IGN), and Regional Server matching authorized top-up gateways.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Right to Reject Fraudulent Entries',
      description: 'DiamondDrop reserves the right to audit and reject any duplicate, scripted, or fraudulent entries before or after the weekly selection.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    },
    {
      title: 'CRITICAL: Absolute Zero-Password Policy',
      description: 'DiamondDrop staff will NEVER ask for your game password, Google account, Facebook password, or SMS OTP. Top-ups require only your public numerical Player UID.',
      icon: <Lock className="w-5 h-5 text-rose-400" />,
    },
    {
      title: 'Advertising & Monetization Separation',
      description: 'Users are NEVER required to click advertisements or watch ads to qualify. Interacting with ads does not grant tickets or alter winning chances.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Independent Platform Notice',
      description: 'DiamondDrop is an independent rewards platform and is not affiliated with, sponsored by, endorsed by, or operated by Garena or Free Fire.',
      icon: <FileText className="w-5 h-5 text-slate-400" />,
    },
  ];

  const deliverySteps = [
    {
      step: '01',
      status: 'Pending',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      title: 'Request Submitted & Queued',
      description: 'Selected winner submits Player UID, IGN, and Region. The claim is queued for admin verification and eligibility audit.',
    },
    {
      step: '02',
      status: 'Approved',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      title: 'UID Verified & Processing',
      description: 'Admin staff verifies Player UID on regional game servers. Top-up order is initiated through authorized distribution gateways.',
    },
    {
      step: '03',
      status: 'Delivered',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      title: 'Diamonds Credited In-Game',
      description: 'The 100 Diamonds are credited directly to the player’s Free Fire in-game vault. Delivery confirmation and transaction ref recorded.',
    },
  ];

  const faqs = [
    {
      q: 'How do I earn tickets for the weekly draw?',
      a: 'You can earn tickets every day through free activities on DiamondDrop: 1) Daily Check-in grants +1 ticket daily, with an extra +5 bonus on Day 7 of your streak. 2) The Daily Trivia Quiz awards +2 tickets upon completing 5 tactical questions.',
    },
    {
      q: 'Does having more tickets guarantee that I will win?',
      a: 'No. Having more tickets gives you more entries in the randomized weekly draw, which mathematically increases your probability, but winning is never guaranteed for any participant.',
    },
    {
      q: 'When does the weekly campaign draw take place?',
      a: 'Draws take place every Sunday at 23:59 UTC at the conclusion of each weekly round. Selected winners are notified on their profile dashboard.',
    },
    {
      q: 'How do winners receive their Free Fire Diamonds?',
      a: 'Winners navigate to their dashboard to submit their Free Fire numerical Player UID, in-game name, and server region. Our staff then manually processes a direct top-up via authorized digital gateways.',
    },
    {
      q: 'Why does DiamondDrop never ask for passwords?',
      a: 'Because legitimate in-game diamond top-ups only require a public numerical Player UID. Anyone asking for your account login, password, or SMS OTP is a scammer. Always safeguard your login credentials!',
    },
    {
      q: 'Do advertisements affect my chances of winning?',
      a: 'No. DiamondDrop maintains strict separation between advertising and user rewards. You will never be required to click on advertisements to qualify, and ad interactions have zero impact on draw eligibility.',
    },
  ];

  return (
    <div id="reward-rules-page" className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Transparency, Integrity & Fair Play</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Official Reward Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Review the complete guidelines, campaign schedules, winner verification procedures, and delivery workflows for DiamondDrop.
        </p>
      </div>

      {/* Critical Security Alert */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-slate-900 border-2 border-rose-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-3 text-rose-300 font-bold font-gaming text-xl uppercase tracking-wide">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <span>Security Mandate: Never Share Passwords or OTPs</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          DiamondDrop administrators will <strong>NEVER</strong> contact you asking for your Free Fire account password, Google or Facebook passwords, or SMS verification codes (OTP). All legitimate reward distributions require only your public <strong>numerical Player UID</strong>.
        </p>
      </div>

      {/* Active Campaign Schedule Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Active Campaign Overview
            </div>
            <h2 className="font-gaming text-2xl font-bold text-white mt-1">
              {weeklyRound.title} ({weeklyRound.roundId})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active Round Cycle: <strong className="text-slate-200">{weeklyRound.startDate}</strong> to <strong className="text-slate-200">{weeklyRound.endDate} (Sunday 23:59 UTC)</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Prize Pool</div>
              <div className="font-gaming text-lg font-black text-cyan-300">
                {weeklyRound.prizeDiamonds} 💎
              </div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Max Winners</div>
              <div className="font-gaming text-lg font-black text-purple-300">
                {weeklyRound.maxWinners} Players
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Delivery Workflow: Pending -> Approved -> Delivered */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#070a1e]/90 shadow-2xl space-y-6">
        <div>
          <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-cyan-400" />
            Reward Request & Fulfillment Status Flow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How winners request and receive their Free Fire Diamond top-up from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliverySteps.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-gaming text-2xl font-black text-slate-600">
                  {step.step}
                </span>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold font-gaming ${step.color}`}>
                  {step.status}
                </span>
              </div>
              <h3 className="font-gaming text-base font-bold text-white">
                {step.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Rules Grid */}
      <div>
        <h2 className="font-gaming text-2xl font-bold text-white tracking-wide mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-400" />
          Complete Program Rules & Fair Play Standards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel border border-purple-500/20 flex items-start gap-4 hover:border-purple-500/40 transition-all"
            >
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {rule.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-gaming text-base font-bold text-white tracking-wide">
                  {idx + 1}. {rule.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div>
          <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick answers about tickets, draws, and reward distribution.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20">
        <div>
          <h4 className="font-gaming text-base font-bold text-white">Ready to earn your entries?</h4>
          <p className="text-xs text-slate-400">Complete your daily check-in and test your gaming tactics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('quiz')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
          >
            Play Daily Quiz
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-xs font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span>Daily Check-in</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
