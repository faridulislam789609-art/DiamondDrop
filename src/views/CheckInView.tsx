import React, { useState } from 'react';
import {
  Calendar,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Ticket,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckInView: React.FC = () => {
  const { user, canCheckInToday, claimDailyCheckIn, setActiveTab } = useApp();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimFeedback, setClaimFeedback] = useState<{ show: boolean; msg: string; tickets: number }>({
    show: false,
    msg: '',
    tickets: 0,
  });

  // Calculate current streak day (1-7 index within the loop)
  const currentStreakDayIndex = (user.currentStreak % 7) || (user.currentStreak > 0 && user.currentStreak % 7 === 0 ? 7 : 0);

  const days = [
    { day: 1, reward: 1, isBonus: false, label: 'Day 1' },
    { day: 2, reward: 1, isBonus: false, label: 'Day 2' },
    { day: 3, reward: 1, isBonus: false, label: 'Day 3' },
    { day: 4, reward: 1, isBonus: false, label: 'Day 4' },
    { day: 5, reward: 1, isBonus: false, label: 'Day 5' },
    { day: 6, reward: 1, isBonus: false, label: 'Day 6' },
    { day: 7, reward: 5, isBonus: true, label: 'Day 7 Grand Bonus' },
  ];

  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      const res = await claimDailyCheckIn();
      if (res.success) {
        setClaimFeedback({
          show: true,
          msg: res.message,
          tickets: res.ticketsEarned,
        });
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div id="daily-checkin-page" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Daily Loyalty Calendar</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Daily Check-in & Streak
        </h1>
        <p className="text-sm text-slate-300">
          Visit every 24 hours to collect <strong className="text-cyan-300">1 ticket</strong>. Reach Day 7 to unlock the massive <strong className="text-amber-300">+5 tickets grand bonus</strong>!
        </p>
      </div>

      {/* Streak Dashboard Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Current Streak</div>
            <div className="font-gaming text-2xl font-black text-white">
              {user.currentStreak} <span className="text-amber-400 text-lg">Days</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Weekly Tickets</div>
            <div className="font-gaming text-2xl font-black text-cyan-300">
              {user.weeklyTickets} <span className="text-slate-400 text-sm font-sans font-normal">in Round #48</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Day 7 Bonus In</div>
            <div className="font-gaming text-2xl font-black text-purple-300">
              {Math.max(0, 7 - (user.currentStreak % 7 === 0 && user.currentStreak > 0 ? 7 : user.currentStreak % 7))} <span className="text-slate-400 text-sm font-sans font-normal">Day(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-[#0e1333]/90 to-[#0a0e24]/95 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-gaming text-2xl font-bold text-white tracking-wide">
              7-Day Streak Road
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your streak unbroken to maximize your weekly entry count.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resets every 24h at 00:00 UTC</span>
          </div>
        </div>

        {/* 7 Day Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {days.map((item) => {
            // Determine state: completed, current/today, locked
            // If already claimed today, completed is up to currentStreakDayIndex
            // If not claimed today, completed is up to (currentStreakDayIndex), and next is today
            const effectiveStreak = user.currentStreak % 7;
            const isCompleted = canCheckInToday
              ? item.day <= effectiveStreak
              : item.day <= (effectiveStreak === 0 && user.currentStreak > 0 ? 7 : effectiveStreak);

            const isToday = canCheckInToday
              ? item.day === (effectiveStreak + 1 > 7 ? 1 : effectiveStreak + 1)
              : false;

            const isLocked = !isCompleted && !isToday;

            return (
              <div
                key={item.day}
                id={`checkin-day-${item.day}`}
                className={`relative rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all ${
                  item.isBonus ? 'sm:col-span-2 lg:col-span-1' : ''
                } ${
                  isCompleted
                    ? 'bg-emerald-950/30 border border-emerald-500/40 text-slate-300 shadow-sm'
                    : isToday
                    ? 'bg-gradient-to-b from-purple-900/80 to-cyan-950/80 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 scale-105 z-10'
                    : 'bg-slate-900/50 border border-slate-800/80 text-slate-500'
                }`}
              >
                {/* Day Header */}
                <div className="w-full flex items-center justify-between text-[11px] font-bold mb-2">
                  <span className={isToday ? 'text-cyan-300' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}>
                    Day {item.day}
                  </span>
                  {item.isBonus && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-black">
                      BONUS
                    </span>
                  )}
                </div>

                {/* Center Icon & Status Visual */}
                <div className="my-3">
                  {isCompleted ? (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : isToday ? (
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse">
                      <Gift className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Reward Amount */}
                <div className="mt-1">
                  <div
                    className={`font-gaming text-lg font-black ${
                      item.isBonus
                        ? 'text-amber-300'
                        : isToday
                        ? 'text-cyan-300'
                        : isCompleted
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }`}
                  >
                    +{item.reward} {item.reward > 1 ? 'Tickets' : 'Ticket'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {isCompleted ? 'Claimed' : isToday ? 'Ready!' : 'Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Duplicate Protected: Max 1 check-in per calendar day.</span>
          </div>

          <div className="w-full sm:w-auto">
            {canCheckInToday ? (
              <button
                id="claim-today-ticket-btn"
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-base font-black tracking-wider shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isClaiming ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin text-cyan-200" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5 text-cyan-200" />
                    <span>Claim Today's Ticket</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="claimed-today-btn"
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-900/90 border border-emerald-500/30 px-7 py-3.5 rounded-xl text-sm font-bold font-gaming text-emerald-300 cursor-not-allowed opacity-90"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Claimed Today</span>
              </button>
            )}
          </div>
        </div>

        {/* Claim Success Feedback Card */}
        {claimFeedback.show && (
          <div
            id="claim-success-feedback"
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{claimFeedback.msg}</p>
                <p className="text-xs text-emerald-300">
                  Your weekly tickets count has been updated to <strong>{user.weeklyTickets}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-gaming text-xs font-bold shrink-0 transition-colors"
            >
              Play Daily Quiz (+2)
            </button>
          </div>
        )}
      </div>

      {/* Rules & Information Box */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-gaming">
            <Flame className="w-4 h-4 text-amber-400" />
            Streak Protection Rules
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Missing a day will reset your streak counter back to Day 1. Always visit daily to make sure you grab the Day 7 grand bonus of +5 tickets.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-gaming">
            <Ticket className="w-4 h-4 text-cyan-400" />
            Weekly Round Eligibility
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All tickets claimed from your daily check-in automatically enter Round #48 for the 100 Diamonds prize drop this Sunday.
          </p>
        </div>
      </div>
    </div>
  );
};
