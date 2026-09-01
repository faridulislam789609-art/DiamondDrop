import React, { useState } from 'react';
import {
  Ticket,
  Flame,
  Award,
  Sparkles,
  Calendar,
  Brain,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TicketsView: React.FC = () => {
  const { user, weeklyRound, activityHistory, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isEligible = user.weeklyTickets > 0;

  const filteredActivities = activityHistory.filter((item) => {
    const matchesFilter = filterType === 'all' || item.activity.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="my-tickets-page" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Ticket className="w-4 h-4 text-cyan-400" />
          <span>Ticket Ledger & Entry Ledger</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
          My Tickets & Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Track all your earned entries for <strong className="text-cyan-300">Round #{weeklyRound.roundId}</strong> and view full activity logs.
        </p>
      </div>

      {/* Primary Metrics 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Lifetime Tickets */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Lifetime Tickets
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-gaming text-3xl font-black text-white">
              {user.totalTickets}
            </div>
            <div className="text-[11px] text-purple-300 mt-0.5">All-time collected</div>
          </div>
        </div>

        {/* Metric 2: Weekly Active Tickets */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-b from-[#0d1433] to-[#080d24] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">
              This Week's Entries
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-gaming text-3xl font-black text-cyan-300">
              {user.weeklyTickets}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active in {weeklyRound.roundId}</div>
          </div>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              Current Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-gaming text-3xl font-black text-amber-300">
              {user.currentStreak} Days
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Longest: {user.longestStreak} days</div>
          </div>
        </div>

        {/* Metric 4: Eligibility Status */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-b from-[#091b26] to-[#06101a] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Weekly Eligibility
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-gaming text-xl font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{isEligible ? 'Eligible' : 'Needs 1 Ticket'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isEligible ? 'Entered in 2-winner draw' : 'Complete check-in to enter'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner to Earn More */}
      <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-gaming text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Want to boost your weekly odds?
          </h3>
          <p className="text-xs text-slate-300">
            Check-in daily (+1 ticket) and complete the Free Fire trivia quiz (+2 tickets).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-gaming text-xs font-bold transition-all shadow-md"
          >
            Daily Check-in
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-xs font-bold transition-all shadow-md"
          >
            Play Quiz
          </button>
        </div>
      </div>

      {/* Activity History Table Container */}
      <div className="rounded-3xl glass-panel border border-purple-500/20 bg-[#090d24]/90 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-gaming text-2xl font-bold text-white tracking-wide">
              Activity History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified record of all tickets collected through activities.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Filter Pills */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="all">All Activities</option>
              <option value="check-in">Check-in</option>
              <option value="quiz">Quiz</option>
              <option value="bonus">Streak Bonus</option>
            </select>
          </div>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-gaming text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Activity Name</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No matching activity logs found.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{act.date}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        {act.activity === 'Daily Check-in' && (
                          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Calendar className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {act.activity === 'Daily Quiz' && (
                          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                            <Brain className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {act.activity.includes('Bonus') && (
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span>{act.activity}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {act.description || 'Verified free reward'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-gaming text-sm font-black">
                        +{act.tickets} 🎟️
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
