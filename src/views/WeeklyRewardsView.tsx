import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Clock,
  Ticket,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  Lock,
  ArrowRight,
  Flame,
  Crown,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiamondRequest, RewardRequestStatus } from '../types';

export const WeeklyRewardsView: React.FC = () => {
  const {
    weeklyRound,
    user,
    winnerClaim,
    previousWinners,
    diamondRequests,
    submitDiamondRequest,
    getRequestById,
    setActiveTab,
    isAuthenticated,
    setAuthModalOpen,
  } = useApp();

  // Winner Request Form State
  const [ffUid, setFfUid] = useState(user.freeFireUid || '');
  const [inGameName, setInGameName] = useState(user.inGameName || '');
  const [region, setRegion] = useState(user.region || 'India & South Asia');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);

  // Status Search State
  const [searchIdInput, setSearchIdInput] = useState('');
  const [searchedRequestResult, setSearchedRequestResult] = useState<DiamondRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const isEligible = user.weeklyTickets > 0;
  const isWinner = user.isWinnerThisWeek || !!winnerClaim;
  const hasSubmitted = !!winnerClaim?.hasSubmittedRequest || (!!winnerClaim?.rewardStatus && winnerClaim.rewardStatus !== 'awaiting_request');

  const maskUid = (id?: string) => {
    if (!id) return '••••••';
    if (id.length <= 4) return id;
    const start = id.slice(0, 3);
    const end = id.slice(-3);
    return `${start}****${end}`;
  };

  // Find user's own diamond requests from the global requests list
  const userRewardRequests = diamondRequests.filter(
    (r) => r.userId === user.id || (user.firebaseUid && r.userId === user.firebaseUid) || (user.freeFireUid && r.freeFireUid === user.freeFireUid)
  );

  const handleWinnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ffUid.trim() || !inGameName.trim()) return;

    setIsSubmitting(true);
    const res = await submitDiamondRequest({
      freeFireUid: ffUid.trim(),
      inGameName: inGameName.trim(),
      region,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSubmissionSuccess(res.message);
      setSearchIdInput(res.requestId);
      setIsClaimFormOpen(false);
    }
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;

    const result = getRequestById(searchIdInput.trim());
    setSearchedRequestResult(result || null);
    setHasSearched(true);
  };

  const scrollToClaim = () => {
    setIsClaimFormOpen(true);
    const el = document.getElementById('diamond-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusBadge = (status: RewardRequestStatus | string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Approved (In Delivery Queue)
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="weekly-rewards-page" className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Weekly Diamond Drop Campaign</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Weekly Rewards & Winner Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Discover active weekly prize pools, verified past winner records, and submit or track reward delivery.
        </p>
      </div>

      {/* Prominent Winner Alert Banner if current user is a winner */}
      {isWinner && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-cyan-500/20 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                Weekly Winner Selected
              </span>
              <h2 className="font-gaming text-2xl sm:text-3xl font-black text-white mt-1">
                🎉 Congratulations! You are a weekly winner.
              </h2>
              <p className="text-xs text-amber-200 mt-0.5">
                You won <strong>{weeklyRound.prizeDiamonds} Free Fire Diamonds</strong> in {weeklyRound.title}!
              </p>
            </div>
          </div>

          <button
            onClick={scrollToClaim}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-gaming text-sm font-black tracking-wide shadow-lg shadow-amber-400/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Gift className="w-4 h-4" />
            <span>Claim Diamond Reward</span>
          </button>
        </div>
      )}

      {/* 2. Current Weekly Reward Showcase Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-[#0d1336]/90 via-[#0a0e28]/95 to-[#060919] shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-gaming uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Current Active Campaign</span>
            </div>
            <h2 className="font-gaming text-3xl sm:text-4xl font-black text-white">
              {weeklyRound.title}
            </h2>
            <p className="text-xs text-slate-400">
              Round Period: <strong className="text-slate-300">{weeklyRound.startDate}</strong> to{' '}
              <strong className="text-slate-300">{weeklyRound.endDate} (Sunday 23:59 UTC)</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/30">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Prize per Winner</div>
              <div className="font-gaming text-3xl font-black text-cyan-300">
                {weeklyRound.prizeDiamonds} 💎
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Winners</div>
              <div className="font-gaming text-3xl font-black text-amber-400">
                {weeklyRound.maxWinners} Players
              </div>
            </div>
          </div>
        </div>

        {/* User's Entry Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Your Round Tickets</span>
            <div className="font-gaming text-2xl font-black text-cyan-300">
              {user.weeklyTickets} <span className="text-xs font-sans text-slate-400">Tickets</span>
            </div>
            <p className="text-[11px] text-slate-400">Earned through check-in & trivia</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Eligibility Status</span>
            <div className="font-gaming text-2xl font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{isEligible ? 'Entered in Draw' : 'Not Eligible'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isEligible ? 'Active participant in selection' : 'Claim 1 ticket to enter'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Round Progress</span>
            <div className="font-gaming text-2xl font-black text-amber-400">
              {weeklyRound.winnersCount} / {weeklyRound.maxWinners} Selected
            </div>
            <p className="text-[11px] text-slate-400">
              Status: <span className="uppercase text-cyan-300 font-bold">{weeklyRound.status}</span>
            </p>
          </div>
        </div>

        {/* Clear Mandatory Explanation Banner */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white text-sm">
              Probability & Participation Guidelines:
            </p>
            <p className="text-slate-300 leading-relaxed font-medium">
              “More tickets improve your participation chances, but do not guarantee a reward.”
            </p>
            <p className="text-[11px] text-slate-400">
              Winner selection is conducted completely transparently. Every ticket acts as a single entry in Sunday's random draw.
            </p>
          </div>
        </div>
      </div>

      {/* 3. DIAMOND REQUEST SECTION (Winner Redemption Section) */}
      <div id="diamond-request-section" className="rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-b from-[#131024]/90 to-[#090b1e]/95 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Winner Redemption Desk
            </div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Diamond Reward Request Portal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure claim desk for verified weekly draw winners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {isWinner ? '👑 Winner Verified' : '🔒 Draw Locked for Non-Winners'}
            </span>
          </div>
        </div>

        {/* Conditional Rendering Based on Winner Status */}
        {isWinner ? (
          <div className="space-y-6">
            {hasSubmitted ? (
              /* State A: Winner Has Submitted Request -> Show Request Status, Hide Form */
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900/90 border border-cyan-500/40 space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-gaming text-lg font-bold text-white">
                        Reward request submitted successfully.
                      </h3>
                      <p className="text-xs text-cyan-200">
                        Your claim is on file in Cloud Firestore. No further submission is required for this round.
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(winnerClaim?.rewardStatus || 'pending')}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Request ID</span>
                    <span className="font-mono text-cyan-300 font-bold text-sm">
                      {winnerClaim?.requestId || 'Processing...'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Campaign Round</span>
                    <span className="text-slate-200 font-medium">
                      {winnerClaim?.roundTitle || weeklyRound.title}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Player UID</span>
                    <span className="font-mono text-white font-bold">
                      {maskUid(winnerClaim?.freeFireUid || user.freeFireUid)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Prize Amount</span>
                    <span className="text-amber-300 font-bold font-gaming text-sm">
                      {winnerClaim?.prizeDiamonds || weeklyRound.prizeDiamonds} 💎
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Our admin team will fulfill your diamond drop directly to your Free Fire ID. You can check updates anytime in the status tracker below.
                  </span>
                </div>
              </div>
            ) : !isClaimFormOpen ? (
              /* State B: Winner Has NOT Submitted Request & Form Closed -> Show Winner Card */
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-900/30 to-amber-500/10 border-2 border-amber-400/50 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                      <Crown className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        Verified Winner
                      </span>
                      <h3 className="font-gaming text-2xl sm:text-3xl font-black text-white">
                        Congratulations! You are a Weekly Winner
                      </h3>
                      <p className="text-xs text-amber-200">
                        You have been officially drawn as a winner for this campaign. Complete your claim to receive your diamonds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Prize Amount</span>
                    <span className="font-gaming text-xl font-black text-amber-300">
                      {winnerClaim?.prizeDiamonds || weeklyRound.prizeDiamonds} Diamonds 💎
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Round ID</span>
                    <span className="text-cyan-300 font-bold font-mono text-sm">
                      {winnerClaim?.roundId || weeklyRound.roundId}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Winner Status</span>
                    <span className="text-emerald-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Awaiting Claim
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => setIsClaimFormOpen(true)}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-gaming text-sm font-black tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Claim Diamond Reward</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State C: Winner Has Clicked "Claim Diamond Reward" -> Show Request Form */
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-white">
                        Enter Your Free Fire Details for Prize Dispatch
                      </p>
                      <p className="text-xs text-amber-300">
                        Campaign: {winnerClaim?.roundTitle || weeklyRound.title} ({winnerClaim?.roundId || weeklyRound.roundId})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsClaimFormOpen(false)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleWinnerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Free Fire Player UID (e.g. 9-10 digits) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="e.g. 8764091234"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      In-Game Name (IGN) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inGameName}
                      onChange={(e) => setInGameName(e.target.value)}
                      placeholder="e.g. 🔥ROHIT_PRO_FF🔥"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Server / Region <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                    >
                      <option value="India & South Asia">India & South Asia</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Brazil">Brazil</option>
                      <option value="MENA / Middle East">MENA / Middle East</option>
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Reward Amount (Fixed by Campaign Document)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${winnerClaim?.prizeDiamonds || weeklyRound.prizeDiamonds} Diamonds 💎`}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-bold outline-none cursor-not-allowed font-gaming text-sm"
                    />
                  </div>

                  {/* Strict Security Reminder Banner */}
                  <div className="md:col-span-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Security Guarantee:</strong> We will never ask for your Free Fire password, OTP, or recovery codes. We only require your public numeric Player UID.
                    </span>
                  </div>

                  <div className="md:col-span-2 pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-gaming text-sm font-black tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Reward Request'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsClaimFormOpen(false)}
                      className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submissionSuccess && (
              <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-xs space-y-1 animate-in fade-in duration-200">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Reward request submitted successfully.
                </div>
                <p>{submissionSuccess}</p>
              </div>
            )}
          </div>
        ) : (
          /* State D: Normal / Non-Winner State Info -> Hide Form, Show Locked Notice */
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-gaming text-xl font-bold text-slate-200">
                You have not been selected as a winner for this round.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The diamond claim form is exclusively active for verified weekly draw winners. Collect tickets daily through check-ins and quizzes to qualify for this Sunday's draw!
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('checkin')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-gaming text-xs font-bold transition-all"
              >
                Claim Today's Ticket (+1)
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-xs font-bold transition-all"
              >
                Play Daily Quiz (+2)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MY REWARD STATUS SECTION */}
      <div id="my-reward-status-section" className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090e29]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              My Reward Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live tracking ledger for your personal weekly winner claims and diamond top-ups.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Account: <strong className="text-white">{user.username}</strong></span>
          </div>
        </div>

        {/* User claims listing */}
        {winnerClaim && winnerClaim.hasSubmittedRequest ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Claim Request ID</span>
                <div className="font-mono text-base font-bold text-cyan-300">
                  {winnerClaim.requestId || 'DD-PENDING'}
                </div>
              </div>
              <div>{getStatusBadge(winnerClaim.rewardStatus || 'pending')}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Round</span>
                <span className="font-bold text-slate-200">
                  {winnerClaim.roundTitle || weeklyRound.title}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Prize</span>
                <span className="text-amber-300 font-bold font-gaming text-sm">
                  {winnerClaim.prizeDiamonds || weeklyRound.prizeDiamonds} 💎
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Request ID</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {winnerClaim.requestId || 'Processing'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Free Fire UID</span>
                <span className="font-mono text-white font-bold">
                  {maskUid(winnerClaim.freeFireUid || user.freeFireUid)}
                </span>
              </div>
            </div>
          </div>
        ) : userRewardRequests.length > 0 ? (
          <div className="space-y-3">
            {userRewardRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Round</span>
                    <span className="font-bold text-slate-200">
                      {req.roundId || weeklyRound.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Prize</span>
                    <span className="text-amber-300 font-bold font-gaming">
                      {req.rewardAmount} 💎
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Request ID</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {req.requestId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Free Fire UID</span>
                    <span className="font-mono text-white font-bold">
                      {maskUid(req.freeFireUid)}
                    </span>
                  </div>
                </div>

                <div className="sm:pl-4">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <p className="text-slate-300 font-medium">No reward claims on file yet for your account.</p>
            <p className="text-slate-500 text-[11px]">
              When you are drawn as a winner for any weekly campaign, your claim status and request ID will appear here.
            </p>
          </div>
        )}
      </div>

      {/* 5. CHECK REQUEST STATUS TRACKER */}
      <div id="check-request-status-section" className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#080c20]/90 shadow-2xl space-y-6">
        <div>
          <h3 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Check Request Status
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter your Request ID (e.g., <code className="text-cyan-300">DD-84920</code> or <code className="text-cyan-300">DD-89311</code>) to track your delivery progress in Firestore.
          </p>
        </div>

        {/* Search input bar */}
        <form onSubmit={handleSearchStatus} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchIdInput}
              onChange={(e) => setSearchIdInput(e.target.value)}
              placeholder="Enter Request ID or Free Fire UID..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 outline-none uppercase font-mono tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg transition-all"
          >
            Track Status
          </button>
        </form>

        {/* Search Result Card */}
        {hasSearched && (
          <div className="mt-4">
            {searchedRequestResult ? (
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Request ID</span>
                    <div className="font-mono text-base font-bold text-cyan-300">
                      {searchedRequestResult.requestId}
                    </div>
                  </div>
                  <div>{getStatusBadge(searchedRequestResult.status)}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Player UID</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {searchedRequestResult.freeFireUid}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">In-Game Name</span>
                    <span className="text-slate-200 font-bold">
                      {searchedRequestResult.inGameName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Reward</span>
                    <span className="text-cyan-300 font-bold font-gaming text-sm">
                      {searchedRequestResult.rewardAmount} Diamonds 💎
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Server</span>
                    <span className="text-slate-200">{searchedRequestResult.region}</span>
                  </div>
                </div>

                {searchedRequestResult.adminNote && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-300 mr-2">Audit Log:</span>
                    {searchedRequestResult.adminNote}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-center">
                No reward request found matching "<span className="text-white">{searchIdInput}</span>". Please double-check your ID.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. PREVIOUS WINNERS SECTION (Masked UID Table) */}
      <div id="previous-winners-section" className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              Previous Verified Winners
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Player UIDs are partially masked for privacy and security.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Public Ledger of Completed Drops</span>
          </div>
        </div>

        {/* Winners Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-gaming text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Winner Name</th>
                <th className="py-3 px-4">Masked UID</th>
                <th className="py-3 px-4">Campaign Round</th>
                <th className="py-3 px-4">Prize</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {previousWinners.map((winner) => (
                <tr key={winner.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-gaming text-xs font-bold">
                        FF
                      </div>
                      <span>{winner.maskedName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold">
                    {winner.maskedUid}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {winner.roundTitle} <span className="text-[10px] text-slate-500">({winner.date})</span>
                  </td>
                  <td className="py-3.5 px-4 font-gaming text-base font-extrabold text-cyan-300">
                    +{winner.prizeAmount} 💎
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        winner.status.toLowerCase() === 'delivered'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : winner.status.toLowerCase() === 'approved'
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {winner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
