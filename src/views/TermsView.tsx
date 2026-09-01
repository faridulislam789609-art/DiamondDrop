import React from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Gift,
  CheckCircle2,
  Lock,
  XCircle,
  HelpCircle,
  Award,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TermsView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div id="terms-conditions-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>User Agreement & Program Terms</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Last Updated: September 2026 • Please read these terms carefully before participating in DiamondDrop.
        </p>
      </div>

      {/* Prominent Platform Independence Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-slate-900 border border-amber-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold font-gaming text-base uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Unofficial Fan Community Notice</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          DiamondDrop is an independent community rewards website and is <strong>not affiliated with, sponsored by, endorsed by, or operated by Garena or Free Fire</strong>. All game trademarks, character names, and assets remain the property of their respective copyright holders.
        </p>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Term 1: 100% Free Entry & No Purchase Required */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-cyan-400" />
            1. 100% Free Participation — No Purchase Necessary
          </h2>
          <p>
            Participation in DiamondDrop is entirely free of charge. No monetary payment, deposit, subscription, or real-money transaction is ever required to create an account, earn tickets, or participate in weekly reward draws. Making a purchase of any kind does not exist on DiamondDrop and will not improve any participant's odds.
          </p>
        </div>

        {/* Term 2: Nature of Tickets */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            2. Promotional Nature of Tickets & No Winning Guarantee
          </h2>
          <p>
            Tickets earned through daily check-ins, streaks, and trivia quizzes function exclusively as promotional giveaway entries for active weekly campaign rounds.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs sm:text-sm pt-1">
            <li><strong>Zero Cash Value:</strong> Tickets have no cash or monetary value and cannot be redeemed, sold, traded, or exchanged for fiat currency or cash equivalents.</li>
            <li><strong>No Guarantee of Winning:</strong> Accumulating tickets increases an eligible user’s entry representation in the random weekly draw, but does <strong>NOT guarantee winning</strong> a reward for any participant.</li>
          </ul>
        </div>

        {/* Term 3: Accurate User Information */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            3. Accurate Information & Account Integrity
          </h2>
          <p>
            Users agree to provide accurate, truthful, and up-to-date information when creating an account and submitting redemption requests. You must ensure your Free Fire Player UID, in-game name, and regional server are accurate to facilitate reward fulfillment. DiamondDrop is not responsible for rewards failed or misdirected due to user-provided erroneous UIDs.
          </p>
        </div>

        {/* Term 4: Anti-Cheat & Multi-Account Policy */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-rose-400" />
            4. Anti-Abuse, Multi-Account & Automation Policy
          </h2>
          <p>
            Fair play is essential to maintaining community trust. The following practices are strictly prohibited:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs sm:text-sm pt-1">
            <li>Creating multiple accounts, smurf accounts, or disposable emails by a single individual.</li>
            <li>Utilizing automated bots, scripts, headless browsers, or macros to simulate check-ins or quiz completions.</li>
            <li>Attempting to manipulate, reverse-engineer, or tamper with the ticket or draw selection systems.</li>
          </ul>
          <p className="text-xs text-rose-300 pt-1">
            Violation of these rules will result in immediate disqualification, cancellation of tickets, and permanent account termination.
          </p>
        </div>

        {/* Term 5: Reward Availability & Campaign Adjustments */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-purple-400" />
            5. Campaign Adjustments & Prize Availability
          </h2>
          <p>
            DiamondDrop organizes weekly promotional campaigns on a recurring basis. The prize amount (e.g., 100 Diamonds per winner) and the maximum number of winners per round are established per active campaign and may be adjusted between rounds based on community resources and operational feasibility.
          </p>
        </div>

        {/* Term 6: Winner Requirements & Zero Password Rule */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-rose-400" />
            6. Winner Requirements & Absolute Zero-Password Policy
          </h2>
          <p>
            Selected winners must provide a valid Free Fire Player numerical UID to receive their diamond delivery.
          </p>
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 space-y-1">
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Critical Security Warning
            </div>
            <p>
              DiamondDrop will <strong>NEVER request your Free Fire account password, Google password, Facebook login, or SMS OTP</strong>. Any person or message claiming to represent DiamondDrop and requesting passwords is fraudulent.
            </p>
          </div>
        </div>

        {/* Term 7: Fraudulent Request Rejection */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-amber-400" />
            7. Right to Reject Fraudulent or Duplicate Requests
          </h2>
          <p>
            DiamondDrop reserves the explicit right to review, audit, verify, and reject any reward request or winner claim that is determined to involve fake information, duplicate submissions, bot automation, or any violation of these Terms.
          </p>
        </div>

        {/* Term 8: Advertising Separation Policy */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            8. Advertising & Monetization Separation
          </h2>
          <p>
            DiamondDrop may display advertisements to support website hosting and reward funding. However, in strict compliance with ethical standards and publisher guidelines:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs sm:text-sm pt-1">
            <li>Users are never forced or rewarded to click on advertisements.</li>
            <li>Interacting with advertisements does not grant extra tickets or alter giveaway selection chances.</li>
            <li>Giveaway activities and advertising displays remain completely decoupled.</li>
          </ul>
        </div>

        {/* Term 9: Service Availability & Disclaimer of Warranties */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-3">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            9. Service Availability & Limitation of Liability
          </h2>
          <p>
            DiamondDrop is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted or error-free platform uptime. To the maximum extent permitted by law, DiamondDrop shall not be liable for any indirect, incidental, or consequential damages resulting from website use.
          </p>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20">
        <div>
          <h4 className="font-gaming text-base font-bold text-white">Questions about our Terms?</h4>
          <p className="text-xs text-slate-400">Feel free to reach out to our team via the contact desk.</p>
        </div>
        <button
          onClick={() => setActiveTab('contact')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-xs font-bold tracking-wider shadow-lg active:scale-95"
        >
          Contact Support Desk
        </button>
      </div>
    </div>
  );
};
