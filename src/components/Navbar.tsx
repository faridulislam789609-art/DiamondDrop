import React, { useState } from 'react';
import {
  Gem,
  Ticket,
  Flame,
  Bell,
  User,
  Shield,
  Menu,
  X,
  HelpCircle,
  Award,
  Calendar,
  Brain,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    isAuthenticated,
    authLoading,
    logout,
    setAuthModalOpen,
    notifications,
    setNotificationsModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Gem className="w-4 h-4" /> },
    { id: 'checkin', label: 'Daily Check-in', icon: <Calendar className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="w-4 h-4" /> },
    { id: 'tickets', label: 'My Tickets', icon: <Ticket className="w-4 h-4" /> },
    { id: 'rewards', label: 'Weekly Rewards', icon: <Award className="w-4 h-4" /> },
    { id: 'rules', label: 'Rules', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#05050C]/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-[#090d22] flex items-center justify-center">
                  <Gem className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-gaming text-2xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent">
                  DIAMOND<span className="text-cyan-400">DROP</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-purple-300/70 -mt-1">
                  Daily Free Fire Rewards
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-cyan-300 bg-purple-950/60 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Stats, Notifications, Profile/Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Stat: Weekly Tickets Badge (Desktop) */}
            {isAuthenticated && (
              <button
                id="quick-stat-tickets"
                onClick={() => handleNavClick('tickets')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold transition-all group"
                title="Your Weekly Tickets"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400">
                  <Ticket className="w-3 h-3" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Tickets</span>
                  <span className="text-cyan-300 font-bold font-gaming text-sm group-hover:text-white">
                    {user.weeklyTickets}
                  </span>
                </div>
              </button>
            )}

            {/* Quick Stat: Streak Badge (Desktop) */}
            {isAuthenticated && (
              <button
                id="quick-stat-streak"
                onClick={() => handleNavClick('checkin')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 text-xs font-semibold transition-all group"
                title="Your Daily Streak"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400">
                  <Flame className="w-3 h-3 animate-pulse" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Streak</span>
                  <span className="text-amber-300 font-bold font-gaming text-sm group-hover:text-white">
                    {user.currentStreak}d
                  </span>
                </div>
              </button>
            )}

            {/* Notification Bell */}
            <button
              id="nav-notification-btn"
              onClick={() => setNotificationsModalOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/50 text-slate-300 hover:text-white transition-all focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 ring-2 ring-[#070a18] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard shortcut / indicator */}
            {user.role === 'admin' && (
              <button
                id="nav-admin-shortcut"
                onClick={() => handleNavClick('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Profile / Auth Button & Dropdown */}
            <div className="relative">
              {authLoading ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/20 animate-pulse">
                  <div className="w-7 h-7 rounded-lg bg-purple-800/40" />
                  <div className="hidden sm:block w-16 h-3.5 rounded bg-purple-800/30" />
                </div>
              ) : isAuthenticated ? (
                <div className="relative">
                  <button
                    id="profile-dropdown-trigger"
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 text-slate-200 transition-all focus:outline-none"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-purple-400/40"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold leading-tight truncate max-w-[90px]">
                        {user.username}
                      </span>
                      <span className="text-[10px] text-purple-300/80 leading-tight">
                        {user.role === 'admin' ? '🛡️ Admin' : user.inGameName ? '🎮 Linked' : 'Profile'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      id="profile-dropdown-menu"
                      className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel bg-[#070714]/95 border border-purple-500/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2.5 mb-2 rounded-xl bg-purple-950/50 border border-purple-500/20">
                        <p className="text-xs font-semibold text-slate-200">{user.username}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-purple-300 font-mono">
                          <span>UID: {user.freeFireUid ? user.freeFireUid : 'Not linked'}</span>
                          <span className="text-amber-400 font-bold">{user.weeklyTickets} Tickets</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-purple-900/40 hover:text-white transition-all text-left"
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        <span>My Account & Game UID</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('tickets')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-purple-900/40 hover:text-white transition-all text-left"
                      >
                        <Ticket className="w-4 h-4 text-cyan-400" />
                        <span>Activity & Ticket Ledger</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-purple-900/40 hover:text-white transition-all text-left"
                        >
                          <Shield className="w-4 h-4 text-rose-400" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <div className="my-2 border-t border-slate-800" />

                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left"
                      >
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-sm font-bold tracking-wide shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-purple-500/20 bg-[#070714]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl">
          {/* Quick Stats on Mobile */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">
                  Tickets: <strong className="text-cyan-300 font-bold">{user.weeklyTickets}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">
                  Streak: <strong className="text-amber-300 font-bold">{user.currentStreak} Days</strong>
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-900/70 border border-purple-500/50 text-cyan-300 shadow-md'
                      : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin & Profile actions in mobile drawer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => handleNavClick('profile')}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-200 flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs font-semibold text-rose-200 flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
