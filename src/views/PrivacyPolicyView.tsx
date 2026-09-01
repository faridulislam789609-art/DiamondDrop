import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Trash2,
  AlertTriangle,
  Cookie,
  Mail,
  UserCheck,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Last Updated: September 2026 • Please read how DiamondDrop collects, handles, and protects your information.
        </p>
      </div>

      {/* Critical Zero Password Alert */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/70 via-purple-950/50 to-slate-900 border border-rose-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2.5 text-rose-300 font-bold font-gaming text-base uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Security Mandate: Never Share Passwords or OTPs</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          DiamondDrop will <strong>NEVER</strong> ask for your Free Fire account password, Google or social login passwords, or SMS one-time passwords (OTP). We only ever process public game Player UIDs for reward delivery.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Section 1: Overview */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-cyan-400" />
            1. Overview & Scope
          </h2>
          <p>
            DiamondDrop is an independent community rewards website operated for gaming enthusiasts. This Privacy Policy explains how information is collected, processed, and safeguarded when you access or use DiamondDrop. By creating an account or participating in website activities, you acknowledge the data practices described herein.
          </p>
        </div>

        {/* Section 2: Information We Collect */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-5 h-5 text-purple-400" />
            2. Information We Collect
          </h2>
          <p>
            To provide user authentication, track participation tickets, and deliver weekly giveaway rewards, DiamondDrop collects the following categories of data:
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h3 className="font-gaming text-sm font-bold text-cyan-300">
                A. Information Collected Through Google / Firebase Login:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li><strong>Display Name & Public Username:</strong> Provided by your Google/Firebase identity.</li>
                <li><strong>Email Address:</strong> Used for unique account identification and notification updates.</li>
                <li><strong>Profile Picture URL:</strong> Used strictly for your in-app avatar representation.</li>
                <li><strong>Firebase User ID (UID):</strong> A unique technical identifier assigned to your account.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h3 className="font-gaming text-sm font-bold text-purple-300">
                B. Free Fire Information Voluntarily Submitted by Users:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li><strong>Player UID:</strong> Your public Free Fire numerical player ID.</li>
                <li><strong>In-Game Name (IGN):</strong> Your public gaming handle for verification.</li>
                <li><strong>Regional Game Server:</strong> Selected game server region to ensure proper digital top-up fulfillment.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h3 className="font-gaming text-sm font-bold text-amber-300">
                C. Activity & Engagement Information:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Daily check-in logs, current streaks, and streak milestones.</li>
                <li>Daily quiz participation dates, scores, and recent question history (to prevent repetition).</li>
                <li>Earned ticket ledger history and weekly ticket totals.</li>
                <li>Reward redemption requests, fulfillment timestamps, and delivery statuses.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: How We Use Your Information */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            3. Why We Use This Information
          </h2>
          <p>We process the information collected strictly for legitimate platform purposes:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs sm:text-sm">
            <li>Authenticating your account and maintaining your personal profile session.</li>
            <li>Accurately tracking daily check-in streaks, quiz points, and weekly ticket balances.</li>
            <li>Conducting transparent, randomized weekly campaign draws among eligible ticket holders.</li>
            <li>Verifying winner details and manually executing digital diamond top-ups via regional gateways.</li>
            <li>Detecting and preventing automated bots, multi-account abuse, and fraudulent entries.</li>
            <li>Responding to user support tickets and account inquiries.</li>
          </ul>
        </div>

        {/* Section 4: Firebase and Third-Party Infrastructure */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            4. Firebase & Third-Party Cloud Services
          </h2>
          <p>
            DiamondDrop utilizes infrastructure provided by <strong>Google Firebase</strong> (including Firebase Authentication and Cloud Firestore). These industry-standard cloud services operate with high-grade transport encryption and access controls. Your data is stored securely in certified cloud regions and governed by Google Cloud's security standards.
          </p>
        </div>

        {/* Section 5: Cookies and Local Storage */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Cookie className="w-5 h-5 text-amber-400" />
            5. Cookies & Local Browser Storage
          </h2>
          <p>
            DiamondDrop uses modern browser local storage (<code>localStorage</code>) and standard session tokens to preserve your active session state, theme preferences, and daily quiz session state across page refreshes. These local mechanisms do not track you across unrelated external websites.
          </p>
        </div>

        {/* Section 6: Future Advertising Disclosure */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            6. Future Advertising Disclosure (Google AdSense & Partners)
          </h2>
          <p>
            To support free website operations and diamond prize pools, DiamondDrop may integrate third-party advertising services, such as <strong>Google AdSense</strong>. When active, these advertising partners may use cookies, web beacons, or similar tracking technologies to serve non-personalized or personalized advertisements based on your visits to this and other sites on the Internet, subject to your cookie consent choices and applicable privacy regulations.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Ad Separation Policy:</strong> You will never be required to click on advertisements or watch paid ads to earn tickets or win rewards. All user giveaway mechanics remain strictly separate from advertising interactions.
          </p>
        </div>

        {/* Section 7: Security & Data Retention */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-rose-400" />
            7. Security & Data Retention
          </h2>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, destruction, or alteration. All database communications are transmitted over secure HTTPS/TLS channels. We retain user profile and activity records only for as long as necessary to maintain active accounts and verify historical campaign distributions.
          </p>
        </div>

        {/* Section 8: Account & Data Deletion Requests */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Trash2 className="w-5 h-5 text-rose-400" />
            8. User Rights & Data Deletion Requests
          </h2>
          <p>
            You have the right to review, update, or request the permanent deletion of your account and all associated personal data at any time. To request account deletion:
          </p>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <p>
              Navigate to our <button onClick={() => setActiveTab('contact')} className="text-cyan-400 underline font-bold hover:text-cyan-300">Contact Us</button> page and select <strong>"Account / Data Deletion Request"</strong>, specifying your registered email or Firebase UID.
            </p>
            <p className="text-slate-400">
              Upon receipt of your request, our team will permanently erase your Firestore profile, linked Free Fire identifiers, and activity records within standard processing timeframes.
            </p>
          </div>
        </div>

        {/* Section 9: Children's Privacy Compliance */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            9. Children's Privacy Compliance
          </h2>
          <p>
            DiamondDrop is designed for a general gaming audience and does not knowingly solicit or collect personal information from children under the age of 13 (or under 16 in applicable jurisdictions) without parental consent. If we learn that personal data of a minor has been collected without verifiable consent, we will take immediate steps to delete the information.
          </p>
        </div>

        {/* Section 10: Policy Updates & Inquiries */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/90 space-y-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-purple-400" />
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect enhancements in our practices or regulatory changes. Any updates will be posted on this page with a revised "Last Updated" timestamp. We encourage you to review this policy periodically.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20">
        <div>
          <h4 className="font-gaming text-base font-bold text-white">Have questions about your data?</h4>
          <p className="text-xs text-slate-400">Submit an inquiry or request account deletion anytime.</p>
        </div>
        <button
          onClick={() => setActiveTab('contact')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-xs font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Privacy Support</span>
        </button>
      </div>
    </div>
  );
};
