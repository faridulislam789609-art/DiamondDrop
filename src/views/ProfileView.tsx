import React, { useState, useEffect } from 'react';
import {
  User,
  Ticket,
  Flame,
  Award,
  Sparkles,
  Shield,
  LogOut,
  Save,
  Gamepad2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Key,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    updateUserProfile,
    logout,
    setActiveTab,
    diamondRequests,
    setAuthModalOpen,
    signInWithGoogle,
    showToast,
  } = useApp();

  const [username, setUsername] = useState(user.username);
  const [ffUid, setFfUid] = useState(user.freeFireUid);
  const [inGameName, setInGameName] = useState(user.inGameName);
  const [region, setRegion] = useState(user.region || 'India & South Asia');
  const [copiedUid, setCopiedUid] = useState(false);

  useEffect(() => {
    setUsername(user.username);
    setFfUid(user.freeFireUid || '');
    setInGameName(user.inGameName || '');
    setRegion(user.region || 'India & South Asia');
  }, [user.username, user.freeFireUid, user.inGameName, user.region, user.id]);

  const handleCopyUid = (uidText: string) => {
    if (!uidText) return;
    navigator.clipboard.writeText(uidText);
    setCopiedUid(true);
    showToast('Firebase UID copied to clipboard');
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      username,
      freeFireUid: ffUid,
      inGameName,
      region,
    });
  };

  // Find user's own diamond requests
  const userRequests = diamondRequests.filter((r) => r.userId === user.id || r.freeFireUid === user.freeFireUid);

  if (!isAuthenticated) {
    return (
      <div id="profile-page-logged-out" className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-xl">
          <User className="w-8 h-8 text-cyan-300" />
        </div>
        <div className="space-y-2">
          <h2 className="font-gaming text-3xl font-bold text-white">Player Profile</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Sign in with your Google account to manage your profile, view your Firebase UID, and link your Free Fire game account.
          </p>
        </div>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-sm font-bold tracking-wide shadow-lg shadow-purple-600/30 transition-all active:scale-95 inline-flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span>Continue with Google / Login</span>
        </button>
      </div>
    );
  }

  return (
    <div id="profile-page" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <User className="w-4 h-4 text-purple-400" />
          <span>Player Identity & Ledger</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
          My Gamer Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Manage your Free Fire in-game credentials and view your reward status.
        </p>
      </div>

      {/* Main Profile Summary Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-[#0d122f]/95 to-[#080b1e]/98 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-purple-600 text-white shadow-md">
                <Gamepad2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white">
                  {user.username}
                </h2>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
              
              {/* Firebase UID Info Tag */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-200 font-mono text-[11px]">
                  <Key className="w-3 h-3 text-cyan-400" />
                  <span>Firebase UID: <strong className="text-cyan-300">{user.firebaseUid || user.id}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleCopyUid(user.firebaseUid || user.id)}
                    className="ml-1 p-0.5 hover:text-white transition-colors"
                    title="Copy Firebase UID"
                  >
                    {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                  Game UID: {user.freeFireUid || 'Not configured'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-medium">
                  IGN: {user.inGameName || 'Not linked'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Tickets
            </span>
            <div className="font-gaming text-2xl font-black text-white mt-1">
              {user.totalTickets}
            </div>
            <div className="text-[10px] text-slate-400">All-time collected</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              Weekly Tickets
            </span>
            <div className="font-gaming text-2xl font-black text-cyan-300 mt-1">
              {user.weeklyTickets}
            </div>
            <div className="text-[10px] text-slate-400">Active in Round #48</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="font-gaming text-2xl font-black text-amber-300 mt-1">
              {user.currentStreak} Days
            </div>
            <div className="text-[10px] text-slate-400">Best: {user.longestStreak} days</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Member Since
            </span>
            <div className="font-gaming text-lg font-bold text-purple-200 mt-1">
              {user.createdAt}
            </div>
            <div className="text-[10px] text-emerald-400">Verified Survivor</div>
          </div>
        </div>
      </div>

      {/* In-Game Credential Edit Form */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-6">
        <div>
          <h3 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            Link Free Fire Game Details
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Your in-game UID is only used to deposit diamonds directly if selected in the weekly draw.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Account Display Name
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Free Fire Player UID (e.g. 1958204321)
            </label>
            <input
              type="text"
              required
              value={ffUid}
              onChange={(e) => setFfUid(e.target.value)}
              placeholder="Enter your 9-10 digit Player UID"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              In-Game Name (IGN)
            </label>
            <input
              type="text"
              required
              value={inGameName}
              onChange={(e) => setInGameName(e.target.value)}
              placeholder="e.g. ⚡SHADOW_HUNTER⚡"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Game Server Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none"
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

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Game Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* User's Reward & Redemption History */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 shadow-2xl space-y-4">
        <h3 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          My Reward Claims & Requests
        </h3>

        {userRequests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <p>No diamond reward claims submitted yet.</p>
            <p className="text-slate-500 text-[11px]">
              When you are drawn as a weekly winner, your claim records and transaction IDs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{req.requestId}</span>
                    <span className="text-slate-400">({req.submittedAt})</span>
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    Player UID: <strong className="text-white font-mono">{req.freeFireUid}</strong> • IGN: {req.inGameName}
                  </div>
                  {req.transactionRef && (
                    <div className="text-[11px] text-emerald-400 font-mono mt-1">
                      Txn Ref: {req.transactionRef}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-gaming text-lg font-bold text-cyan-300">
                    {req.rewardAmount} Diamonds 💎
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : req.status === 'Approved'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

