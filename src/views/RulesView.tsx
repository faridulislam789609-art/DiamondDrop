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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RulesView: React.FC = () => {
  const { setActiveTab, weeklyRound } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const officialRules = [
    {
      title: '100% Free Entry',
      description: 'Participation in DiamondDrop is completely free of charge. No payment, deposit, or subscription is ever required.',
      icon: <Gift className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'No Purchase Required',
      description: 'Tickets cannot be bought or sold for real currency. All tickets are earned exclusively through free daily activities.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Single Account Rule',
      description: 'Users must not create multiple accounts or utilize automated bots. Any bot activity results in permanent disqualification.',
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      title: '1 Player UID per Account',
      description: 'One Free Fire Player UID can only be linked to one DiamondDrop account. UID spoofing or transferring is strictly prohibited.',
      icon: <Lock className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Removal of Fake / Duplicate Entries',
      description: 'Our automated audits verify legitimate gameplay. Fake, scripted, or abusive entries will be removed before the draw.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    },
    {
      title: 'Weekly Winner Selection',
      description: 'Draws take place once every week (Sunday at 23:59 UTC). Each ticket acts as a single ticket entry in the random selection.',
      icon: <Award className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: `Maximum ${weeklyRound.maxWinners} Winners Per Week`,
      description: `To guarantee reliable manual fulfillment, up to ${weeklyRound.maxWinners} winners are drawn per active weekly round.`,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Manual Verification & Direct Delivery',
      description: 'Rewards are manually top-up credited to the winner’s UID via authorized regional distribution gateways.',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'CRITICAL: Absolute Zero-Password Policy',
      description: 'DiamondDrop will NEVER ask for your game password, Google account, Facebook login, or SMS OTP. Only player UID is needed.',
      icon: <Lock className="w-5 h-5 text-rose-400" />,
    },
    {
      title: 'Unofficial Fan Community Notice',
      description: 'DiamondDrop is an independent rewards platform and is not affiliated with, sponsored by, or endorsed by Garena or Free Fire.',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Campaign Prize Adjustments',
      description: 'The weekly diamond prize pool or number of winners may occasionally adjust based on community campaigns.',
      icon: <Gift className="w-5 h-5 text-cyan-400" />,
    },
  ];

  const faqs = [
    {
      q: 'How do I earn tickets?',
      a: 'You can earn 1 ticket every day by visiting the Daily Check-in page, plus an extra +5 bonus tickets on Day 7 of your streak. You can also play the Daily Trivia Quiz to earn +2 tickets daily.',
    },
    {
      q: 'Do more tickets guarantee that I will win?',
      a: 'No. More tickets increase your probability in the weekly draw, but winning is never guaranteed for any participant.',
    },
    {
      q: 'How will I receive the diamonds if I win?',
      a: 'If your account is selected, you will be notified on your profile. You submit your in-game Player UID and region. Our staff then delivers the 100 Diamonds directly to your account.',
    },
    {
      q: 'Why does DiamondDrop never ask for passwords?',
      a: 'Because in-game diamond top-ups only require a public player UID. Anyone asking for your account login or OTP is a scammer. Always protect your credentials!',
    },
  ];

  return (
    <div id="rules-page" className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Fair Play & Community Integrity</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Official Rules & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Please review the terms, security reminders, and fair-play standards of the DiamondDrop platform.
        </p>
      </div>

      {/* Critical Security Warning Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-slate-900 border-2 border-rose-500/40 shadow-xl shadow-rose-950/50 space-y-3">
        <div className="flex items-center gap-3 text-rose-300 font-bold font-gaming text-xl uppercase tracking-wide">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
          <span>Security Notice: Never Share Your Passwords or OTPs</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          DiamondDrop administrators will <strong>NEVER</strong> contact you asking for your Free Fire account password, Google or Facebook passwords, or SMS verification codes (OTP). All legitimate reward distributions only need your public <strong>Player UID</strong>.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {officialRules.map((rule, idx) => (
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
    </div>
  );
};
