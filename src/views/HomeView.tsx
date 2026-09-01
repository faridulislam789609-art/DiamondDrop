import React, { useState, useEffect } from 'react';
import {
  Gem,
  Ticket,
  Calendar,
  Brain,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Gift,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroVisual } from '../components/HeroVisual';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    user,
    weeklyRound,
    canCheckInToday,
    canPlayQuizToday,
    claimDailyCheckIn,
    previousWinners,
  } = useApp();

  // Dynamic countdown timer calculation for Sunday midnight reset
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 5,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      // Target next Sunday 23:59:59 UTC
      const nextSunday = new Date(now);
      const dayOfWeek = now.getDay();
      const distanceToSunday = (7 - dayOfWeek) % 7 || 7;
      nextSunday.setDate(now.getDate() + distanceToSunday);
      nextSunday.setHours(23, 59, 59, 999);

      const diff = Math.max(0, nextSunday.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO SECTION */}
      <section id="home-hero-section" className="relative pt-6 sm:pt-10 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{weeklyRound.title} LIVE • {weeklyRound.maxWinners} Winners This Week</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-wide">
              Get a Chance to Win{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
                Free Fire Diamonds
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Complete daily activities, collect tickets and enter our weekly reward. 100% free with no deposit, no account password sharing, and verified manual delivery.
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => {
                  if (canCheckInToday) {
                    setActiveTab('checkin');
                  } else {
                    setActiveTab('quiz');
                  }
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-base font-bold tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
              >
                <Ticket className="w-5 h-5 text-cyan-200" />
                <span>Start Earning Tickets</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => setActiveTab('rewards')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-500/60 text-slate-200 font-gaming text-base font-bold tracking-wider transition-all flex items-center gap-2"
              >
                <Award className="w-5 h-5 text-amber-400" />
                <span>View Weekly Rewards</span>
              </button>
            </div>

            {/* Quick stats mini ribbon */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Password Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>3,400+ Active Players</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>96+ Diamonds Packs Delivered</span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration Container */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2. WEEKLY REWARD STATUS CARD */}
      <section id="weekly-reward-status-card-section">
        <div className="relative rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-r from-[#0d122d]/90 via-[#10173b]/90 to-[#0d1430]/90 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-40 bg-purple-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-32 bg-cyan-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Header info */}
            <div className="md:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                This Week Reward
              </div>
              <h2 className="font-gaming text-3xl font-black text-white tracking-wide">
                {weeklyRound.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {weeklyRound.maxWinners} Winners This Week are randomly drawn among all eligible ticket holders.
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="md:col-span-4 grid grid-cols-2 gap-3">
              {/* Prize per winner */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/20">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Prize per Winner
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-gaming text-2xl font-extrabold text-cyan-300">
                    {weeklyRound.prizeDiamonds}
                  </span>
                  <span className="text-xs text-cyan-400 font-semibold">Diamonds</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{weeklyRound.maxWinners} Winners This Week</div>
              </div>

              {/* Delivery Status */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/20">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Current Status
                </div>
                <div className="mt-1 font-gaming text-xl font-bold text-amber-300">
                  {weeklyRound.deliveredCount} / {weeklyRound.maxWinners} Delivered
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Round Active
                </div>
              </div>

              {/* Live Countdown */}
              <div className="col-span-2 p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Resets in:</span>
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-cyan-300 tracking-wider">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center">
              <button
                id="view-winners-btn"
                onClick={() => setActiveTab('rewards')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-gaming text-sm font-black tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>View Winners</span>
              </button>
              <span className="text-[11px] text-slate-400 mt-2 text-center md:text-right">
                Your entries: <strong className="text-cyan-400">{user.weeklyTickets} Tickets</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DAILY ACTIVITIES SECTION (4 Cards) */}
      <section id="daily-activities-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Daily Activities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Complete these tasks every 24 hours to claim entries into this Sunday's reward pool.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Daily Check-in */}
          <div
            id="activity-card-checkin"
            className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-purple-500/20 glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold">
                  +1 Ticket
                </span>
              </div>

              <h3 className="font-gaming text-xl font-bold text-white">Daily Check-in</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Visit every day and collect 1 ticket.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  if (canCheckInToday) {
                    claimDailyCheckIn();
                  } else {
                    setActiveTab('checkin');
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-gaming text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                  canCheckInToday
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25 active:scale-95'
                    : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {canCheckInToday ? (
                  <>
                    <span>Check-in Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Claimed Today</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Daily Quiz */}
          <div
            id="activity-card-quiz"
            className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-purple-500/20 glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold">
                  +2 Tickets
                </span>
              </div>

              <h3 className="font-gaming text-xl font-bold text-white">Daily Quiz</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Answer today's quiz and earn 2 tickets.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`w-full py-2.5 px-4 rounded-xl font-gaming text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                  canPlayQuizToday
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 active:scale-95'
                    : 'bg-slate-800 text-purple-300 border border-purple-500/30'
                }`}
              >
                {canPlayQuizToday ? (
                  <>
                    <span>Play Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed (Replay)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: My Tickets */}
          <div
            id="activity-card-tickets"
            className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-purple-500/20 glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Ticket className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold font-gaming">
                  {user.weeklyTickets} Active
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="font-gaming text-xl font-bold text-white">My Tickets</h3>
                <span className="font-gaming text-xl font-extrabold text-amber-400">
                  {user.totalTickets} Total
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Check your weekly ticket balance and recent activity log.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveTab('tickets')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-gaming text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: 7 Day Streak */}
          <div
            id="activity-card-streak"
            className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-purple-500/20 glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-bold">
                  +5 Day 7 Bonus
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="font-gaming text-xl font-bold text-white">7 Day Streak</h3>
                <span className="font-gaming text-xl font-extrabold text-amber-400">
                  {user.currentStreak} Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Complete 7 days for a bonus.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveTab('checkin')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/30 hover:border-red-400 text-red-300 font-gaming text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>View Streak</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS GUIDE */}
      <section id="how-it-works-section" className="rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/20 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
            How DiamondDrop Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Three simple transparent steps. 100% free participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-gaming text-lg font-bold flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Visit & Complete Tasks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check in daily (+1 ticket) and complete our quick 5-question gaming trivia (+2 tickets).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-gaming text-lg font-bold flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Stack Your Weekly Tickets</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your tickets automatically qualify you for Sunday's 2-winner reward draw. More tickets enhance participation chances.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-gaming text-lg font-bold flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Direct In-Game Top-Up</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drawn winners submit their in-game Player UID. 100 Diamonds are credited directly to their Free Fire ID.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RECENT WINNERS TICKER */}
      <section id="recent-winners-preview" className="rounded-2xl glass-panel p-6 border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-gaming text-lg font-bold text-white tracking-wide">
              Recent Verified Winners
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {previousWinners.slice(0, 3).map((winner) => (
            <div
              key={winner.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 font-gaming">
                  FF
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{winner.maskedName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">UID: {winner.maskedUid}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-cyan-300 font-gaming">
                  +{winner.prizeAmount} 💎
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {winner.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
