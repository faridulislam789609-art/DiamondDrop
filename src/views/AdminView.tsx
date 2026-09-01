import React, { useState } from 'react';
import {
  Shield,
  Users,
  Activity,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  RotateCcw,
  Sparkles,
  Eye,
  Check,
  X,
  Send,
  Lock,
  Calendar,
  Layers,
  Crown,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiamondRequest, RewardRequestStatus } from '../types';

export const AdminView: React.FC = () => {
  const {
    user,
    diamondRequests,
    updateRequestStatus,
    weeklyRound,
    updateWeeklyRoundConfig,
    selectWeeklyWinners,
    startNewWeeklyRound,
    eligibleUsers,
    adminStats,
    setActiveTab,
  } = useApp();

  // Selected request for detail modal
  const [selectedRequest, setSelectedRequest] = useState<DiamondRequest | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [txnRefInput, setTxnRefInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Weekly Settings Edit State
  const [prizeInput, setPrizeInput] = useState(weeklyRound.prizeDiamonds);
  const [maxWinnersInput, setMaxWinnersInput] = useState(weeklyRound.maxWinners || 2);
  const [roundStatus, setRoundStatus] = useState(weeklyRound.status);
  const [startDate, setStartDate] = useState(weeklyRound.startDate);
  const [endDate, setEndDate] = useState(weeklyRound.endDate);

  // Sync inputs when weeklyRound updates from Firestore
  React.useEffect(() => {
    setPrizeInput(weeklyRound.prizeDiamonds);
    setMaxWinnersInput(weeklyRound.maxWinners || 2);
    setRoundStatus(weeklyRound.status);
    setStartDate(weeklyRound.startDate);
    setEndDate(weeklyRound.endDate);
  }, [weeklyRound]);

  // Winner draw loading & state
  const [isDrawingWinners, setIsDrawingWinners] = useState(false);
  const [isStartingNewRound, setIsStartingNewRound] = useState(false);
  const [showConfirmNewRound, setShowConfirmNewRound] = useState(false);

  // Access check: only role === 'admin'
  if (user.role !== 'admin') {
    return (
      <div id="admin-access-denied" className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-950/40">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider">
            Access Denied
          </span>
          <h1 className="font-gaming text-3xl font-black text-white tracking-wide">
            Admin Authorization Required
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The DiamondDrop Command Center is restricted to verified administrators. Your current account does not have admin permissions.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-left space-y-1">
          <p className="font-semibold text-slate-300">Security Notice:</p>
          <p>
            Admin roles are strictly assigned in Cloud Firestore via document attribute <code className="text-cyan-300">users/&#123;uid&#125;.role == "admin"</code>. Regular users cannot elevate their own permissions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWeeklyRoundConfig({
      prizeDiamonds: Number(prizeInput),
      maxWinners: Number(maxWinnersInput),
      startDate,
      endDate,
      status: roundStatus,
    });
  };

  const handleOpenDetail = (req: DiamondRequest) => {
    setSelectedRequest(req);
    setAdminNoteInput(req.adminNote || '');
    setTxnRefInput(req.transactionRef || '');
  };

  const handleAction = async (reqId: string, status: RewardRequestStatus) => {
    setIsUpdatingStatus(true);
    const defaultTxn =
      status === 'Delivered'
        ? txnRefInput || `TXN-FF-${Math.floor(10000000 + Math.random() * 90000000)}`
        : txnRefInput;

    await updateRequestStatus(reqId, status, adminNoteInput, defaultTxn);
    setIsUpdatingStatus(false);
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest(null);
    }
  };

  const handleDrawWinners = async () => {
    setIsDrawingWinners(true);
    await selectWeeklyWinners();
    setIsDrawingWinners(false);
  };

  const handleConfirmStartNewRound = async () => {
    setIsStartingNewRound(true);
    await startNewWeeklyRound();
    setIsStartingNewRound(false);
    setShowConfirmNewRound(false);
  };

  return (
    <div id="admin-panel-page" className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Admin Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-purple-950/80 border border-rose-500/30 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider">
                Restricted Admin Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">User: {user.username}</span>
            </div>
            <h1 className="font-gaming text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
              DiamondDrop Administrator Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cloud Firestore Live
          </span>
        </div>
      </div>

      {/* 1. Admin Dashboard Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Stat 1: Total Users */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-[#090d24]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-gaming text-2xl font-black text-white mt-2">
            {adminStats.totalUsers.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Firestore Registered</div>
        </div>

        {/* Stat 2: Active Users */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-[#090d24]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Users</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-gaming text-2xl font-black text-purple-300 mt-2">
            {adminStats.activeUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Check-ins & Quizzes</div>
        </div>

        {/* Stat 3: Eligible Users */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-[#090d24]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Eligible Users</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-gaming text-2xl font-black text-amber-300 mt-2">
            {adminStats.eligibleUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tickets &gt; 0 in Round</div>
        </div>

        {/* Stat 4: Pending Requests */}
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-[#131024]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-300 uppercase">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-gaming text-2xl font-black text-amber-400 mt-2">
            {adminStats.pendingRequests}
          </div>
          <div className="text-[10px] text-amber-300/80 mt-0.5">Awaiting fulfillment</div>
        </div>

        {/* Stat 5: Delivered Rewards */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-[#081820]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-gaming text-2xl font-black text-emerald-300 mt-2">
            {adminStats.deliveredRewards}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Direct top-ups sent</div>
        </div>
      </div>

      {/* 2. Current Round Draw & Winner Controls */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-[#101438] to-[#080b1e] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Round Draw Controls
            </div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {weeklyRound.title} ({weeklyRound.roundId})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Status: <span className="font-bold text-cyan-300 uppercase">{weeklyRound.status}</span> • Prize: <span className="text-amber-400 font-bold">{weeklyRound.prizeDiamonds} 💎</span> • Winners: <span className="text-purple-300 font-bold">{weeklyRound.winnersCount} / {weeklyRound.maxWinners} Selected</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDrawWinners}
              disabled={isDrawingWinners || weeklyRound.status === 'completed' || weeklyRound.winnersCount >= weeklyRound.maxWinners}
              className={`px-5 py-2.5 rounded-xl font-gaming text-xs font-bold tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                weeklyRound.status === 'completed' || weeklyRound.winnersCount >= weeklyRound.maxWinners
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
              }`}
            >
              {isDrawingWinners ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>
                {weeklyRound.status === 'completed' || weeklyRound.winnersCount >= weeklyRound.maxWinners
                  ? 'Winners Already Drawn'
                  : `Select Weekly Winners (Random ${weeklyRound.maxWinners})`}
              </span>
            </button>

            <button
              onClick={() => setShowConfirmNewRound(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 font-gaming text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Round</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Starting New Round */}
        {showConfirmNewRound && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-2xl glass-panel bg-[#0b0f26] border border-purple-500/40 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-gaming text-lg font-bold text-white">
                  Confirm Start New Weekly Round?
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will create a new round in Firestore (<code className="text-cyan-300">weeklyRounds/round_X</code>) and reset all users' <code className="text-cyan-300">weeklyTickets</code> to 0 for the new week.
              </p>
              <p className="text-[11px] text-slate-400">
                Users' total lifetime tickets and check-in streaks will NOT be affected.
              </p>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowConfirmNewRound(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStartNewRound}
                  disabled={isStartingNewRound}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-xs font-bold shadow-lg"
                >
                  {isStartingNewRound ? 'Starting...' : 'Confirm & Reset Weekly'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Eligible Users Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Eligible Participants This Round ({eligibleUsers.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Users with <code className="text-cyan-300">weeklyTickets &gt; 0</code> in Firestore
            </span>
          </div>

          <div className="overflow-x-auto max-h-60 rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-gaming uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3">Masked Email</th>
                  <th className="py-2.5 px-3">Saved Free Fire UID</th>
                  <th className="py-2.5 px-3 text-right">Round Tickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {eligibleUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No users have earned weekly tickets yet in this round.
                    </td>
                  </tr>
                ) : (
                  eligibleUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-purple-950/20">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{u.displayName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{u.maskedEmail}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-300">
                        {u.freeFireUid || 'Not linked'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-gaming font-bold text-amber-400">
                        {u.weeklyTickets} Tickets
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Admin Request Table */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Reward Requests Queue (Firestore)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review submitted winner UIDs, approve requests, and log official delivery transaction IDs.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            Rule: Admin does NOT manually alter ticket balances.
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-gaming text-sm uppercase tracking-wider">
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Player UID</th>
                <th className="py-3 px-3">In-Game Name</th>
                <th className="py-3 px-3">Reward</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {diamondRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No reward requests in queue.
                  </td>
                </tr>
              ) : (
                diamondRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-300">
                      {req.requestId}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-200">{req.username}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">{req.freeFireUid}</td>
                    <td className="py-3.5 px-3 text-slate-200">{req.inGameName}</td>
                    <td className="py-3.5 px-3 font-gaming text-sm font-bold text-cyan-300">
                      {req.rewardAmount} 💎
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                          req.status.toLowerCase() === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : req.status.toLowerCase() === 'approved'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : req.status.toLowerCase() === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {req.status.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleAction(req.id, 'Approved')}
                          disabled={isUpdatingStatus}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      {req.status.toLowerCase() !== 'delivered' && (
                        <button
                          onClick={() => handleAction(req.id, 'Delivered')}
                          disabled={isUpdatingStatus}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {req.status.toLowerCase() !== 'rejected' && req.status.toLowerCase() !== 'delivered' && (
                        <button
                          onClick={() => handleAction(req.id, 'Rejected')}
                          disabled={isUpdatingStatus}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Weekly Reward Settings UI */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Weekly Campaign Settings in Firestore
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure campaign prize pools, dates, and status directly in <code className="text-cyan-300">weeklyRounds/{weeklyRound.roundId}</code>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Weekly Prize Amount (Diamonds)
            </label>
            <input
              type="number"
              value={prizeInput}
              onChange={(e) => setPrizeInput(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-cyan-300 font-bold font-gaming text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Maximum Winners
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={maxWinnersInput}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setMaxWinnersInput(isNaN(val) ? 1 : Math.max(1, Math.min(10, val)));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-cyan-300 font-bold font-gaming text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Week Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Week End Date (Draw Day)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Round Status
            </label>
            <select
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
            >
              <option value="open">Open (Accepting Entries)</option>
              <option value="closed">Closed (Awaiting Draw)</option>
              <option value="completed">Completed (Winners Selected)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg transition-all"
            >
              Save Campaign Settings
            </button>
          </div>
        </form>
      </div>

      {/* 5. Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-[#0b0f26]/95 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-300">{selectedRequest.requestId}</span>
                <span className="text-xs text-slate-400">({selectedRequest.submittedAt})</span>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">User</span>
                <span className="text-slate-200 font-semibold">{selectedRequest.username}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Player UID</span>
                <span className="text-cyan-300 font-mono font-bold">{selectedRequest.freeFireUid}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">In-Game Name</span>
                <span className="text-slate-200 font-semibold">{selectedRequest.inGameName}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Region</span>
                <span className="text-slate-200">{selectedRequest.region}</span>
              </div>
            </div>

            {/* Note & Transaction Ref inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Transaction Reference / Gateway Top-up ID
                </label>
                <input
                  type="text"
                  value={txnRefInput}
                  onChange={(e) => setTxnRefInput(e.target.value)}
                  placeholder="e.g. TXN-FF-99482103"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Admin Audit Remarks
                </label>
                <textarea
                  rows={2}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Notes about UID verification or fulfillment..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                disabled={isUpdatingStatus}
                className="px-3.5 py-2 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-900"
              >
                Reject Request
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(selectedRequest.id, 'Approved')}
                  disabled={isUpdatingStatus}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(selectedRequest.id, 'Delivered')}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-gaming text-xs font-bold shadow-lg"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
