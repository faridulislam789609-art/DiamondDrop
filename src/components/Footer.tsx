import React from 'react';
import { Gem, ShieldCheck, Lock, Heart, Award, HelpCircle, FileText, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, weeklyRound } = useApp();

  return (
    <footer id="app-footer" className="mt-16 bg-[#05050C] border-t border-purple-500/20 text-slate-400">
      {/* Top Value Assurance Grid */}
      <div className="border-b border-purple-950/40 bg-purple-950/15 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-sm">100% Free & Transparent</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                No purchases or deposits are ever required. Collect tickets entirely through daily trivia and check-ins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-sm">Zero Password Policy</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                We never ask for your game password, Google password, Facebook login, or OTPs. All rewards are sent via player UID.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-sm">{weeklyRound.maxWinners} Verified Weekly Winners</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fair selection conducted every Sunday. Selected winners submit player UID for manual direct top-up delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-[6px] bg-[#090d22] flex items-center justify-center">
                  <Gem className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="font-gaming text-xl font-bold tracking-wider text-white">
                DIAMOND<span className="text-cyan-400">DROP</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The fair, community-driven rewards hub for mobile battle royale fans. Visit daily, build your streak, and earn free weekly diamond drops.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Round #48 Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-slate-200 font-bold font-gaming text-sm tracking-wider uppercase mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('checkin')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Daily 7-Day Check-in
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Daily Gaming Trivia Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  My Tickets & History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Weekly Rewards & Previous Winners
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Legal */}
          <div>
            <h4 className="text-slate-200 font-bold font-gaming text-sm tracking-wider uppercase mb-3">
              Guidelines & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Gem className="w-3.5 h-3.5 text-cyan-400" />
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('rules')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Reward Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('terms')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Contact */}
          <div>
            <h4 className="text-slate-200 font-bold font-gaming text-sm tracking-wider uppercase mb-3">
              Support & Inquiries
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Have questions about your tickets, winner verification, data deletion, or business inquiries?
            </p>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full flex items-center gap-2 text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 hover:text-white transition-all text-left group"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate text-xs">Support contact coming soon</span>
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Open Contact & Helpdesk Form</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prominent Mandatory Legal Disclaimer Box */}
        <div className="mt-10 p-4 rounded-2xl bg-[#0a0c1a] border border-purple-500/20 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            Official Platform Disclaimer
          </div>
          <p className="leading-relaxed">
            DiamondDrop is an independent rewards platform and is not affiliated with, sponsored by, endorsed by, or operated by Garena or Free Fire.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DiamondDrop. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-300 transition-colors">
              About Us
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('terms')} className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('rules')} className="hover:text-slate-300 transition-colors">
              Reward Rules
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('contact')} className="hover:text-slate-300 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
