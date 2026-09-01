import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginWithMock, signInWithGoogle } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    loginWithMock(email || 'player@diamonddrop.io', username || (mode === 'register' ? 'New_Striker' : 'Pro_Gamer'));
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsGoogleSigningIn(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success && res.error && res.error !== 'Sign-in cancelled') {
        setAuthError(res.error);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md rounded-2xl glass-panel bg-[#0b0f26]/95 border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/30 mb-3">
            <div className="w-full h-full bg-[#070a1e] rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
          <h3 className="font-gaming text-2xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'Welcome Back, Survivor' : 'Join DiamondDrop'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Log in to track your tickets and enter weekly Free Fire drops.'
              : 'Create your account to earn tickets from daily activities.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold font-gaming rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-purple-900/80 text-cyan-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold font-gaming rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-purple-900/80 text-cyan-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Quick Google Login */}
        <button
          type="button"
          disabled={isGoogleSigningIn}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-75 disabled:cursor-not-allowed text-slate-900 text-xs font-bold shadow-md transition-all active:scale-[0.98] mb-4"
        >
          {isGoogleSigningIn ? (
            <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.15C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.27C.46 8.2.01 10.05.01 12c0 1.95.45 3.8 1.26 5.41l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.15c.95-2.84 3.6-4.94 6.72-4.94z"
              />
            </svg>
          )}
          <span>{isGoogleSigningIn ? 'Connecting with Google...' : 'Continue with Google'}</span>
        </button>

        {authError && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
            Or with Email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gamer Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Shadow_Sniper"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            {mode === 'login' ? 'LOG IN NOW' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Security & Authentication Info */}
        <div className="mt-5 p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            Secure Google & Firebase Authentication with real-time Firestore synchronization.
          </span>
        </div>
      </div>
    </div>
  );
};
