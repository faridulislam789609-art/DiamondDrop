import React, { useState } from 'react';
import {
  Mail,
  HelpCircle,
  Award,
  Trash2,
  Briefcase,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Easily replaceable support email placeholder constant
export const SUPPORT_EMAIL_DISPLAY = 'Support contact coming soon';

export const ContactView: React.FC = () => {
  const { user, showToast } = useApp();

  const [category, setCategory] = useState<'general' | 'reward' | 'deletion' | 'business'>('general');
  const [name, setName] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [playerUid, setPlayerUid] = useState(user.freeFireUid || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please enter your message or inquiry details.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmittedTicketId(generatedId);
      setMessage('');
      showToast(`Inquiry recorded: ${generatedId}`);
    }, 800);
  };

  const contactCategories = [
    {
      id: 'general',
      title: 'General Support',
      icon: <HelpCircle className="w-5 h-5 text-cyan-400" />,
      desc: 'Questions about website features, tickets, daily check-in streaks, or trivia quiz questions.',
    },
    {
      id: 'reward',
      title: 'Reward Issues',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      desc: 'Inquiries regarding weekly winner selection, reward request status, or Free Fire UID verification.',
    },
    {
      id: 'deletion',
      title: 'Account / Data Deletion Requests',
      icon: <Trash2 className="w-5 h-5 text-rose-400" />,
      desc: 'Request the permanent erasure of your account, linked game details, and associated activity records.',
    },
    {
      id: 'business',
      title: 'Business & Advertising Inquiries',
      icon: <Briefcase className="w-5 h-5 text-purple-400" />,
      desc: 'Partnerships, sponsorship discussions, or advertising compliance and publisher queries.',
    },
  ];

  return (
    <div id="contact-us-page" className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Community Helpdesk & Inquiries</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have a question, need assistance with your reward status, or wish to submit a data deletion request? We are here to help.
        </p>
      </div>

      {/* Official Email / Communication Channel Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-br from-[#0a1128] via-[#090d22] to-[#060814] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Official Email Channel
            </div>
            <div className="text-xl sm:text-2xl font-bold font-gaming text-white flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-cyan-300" />
              <span>{SUPPORT_EMAIL_DISPLAY}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our direct support inbox is currently being configured for launch. In the meantime, you can submit inquiries directly via the form below.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs shrink-0 font-medium">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Response time: 24-48 business hours</span>
          </div>
        </div>
      </div>

      {/* 4 Inquiry Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setCategory(cat.id as any)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              category === cat.id
                ? 'bg-purple-950/60 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                : 'glass-panel border-purple-500/20 hover:border-purple-500/40 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-gaming text-base font-bold text-white tracking-wide">
                    {cat.title}
                  </h3>
                  {category === cat.id && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Form Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 bg-[#090d24]/95 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-gaming text-xl font-bold text-white">
              Send an Inquiry or Request
            </h2>
            <p className="text-xs text-slate-400">
              Selected Department: <strong className="text-cyan-300 uppercase font-mono">{category}</strong>
            </p>
          </div>
        </div>

        {submittedTicketId ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-gaming text-xl font-bold text-white">Inquiry Received Successfully</h3>
              <p className="text-xs text-slate-300">
                Your support reference number is <strong className="text-cyan-300 font-mono">{submittedTicketId}</strong>.
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Our community team has logged your submission. If you provided an email, our support desk will respond within 24–48 business hours.
            </p>
            <button
              onClick={() => setSubmittedTicketId(null)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Name / Handle</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FreeFirePro"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Inquiry Department
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="general">General Support</option>
                  <option value="reward">Reward Issues & Verification</option>
                  <option value="deletion">Account / Data Deletion Request</option>
                  <option value="business">Business & Advertising Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Free Fire Player UID <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={playerUid}
                  onChange={(e) => setPlayerUid(e.target.value)}
                  placeholder="e.g. 1958473821"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Message or Details <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'deletion'
                    ? 'Please explain that you wish to have your account and associated records permanently deleted.'
                    : category === 'reward'
                    ? 'Please describe your reward request ID, active weekly round, and your in-game details.'
                    : 'How can we assist you today?'
                }
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Zero Password Security Reminder */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Reminder:</strong> Do not include any passwords or OTP codes in your message. We never require passwords to process support requests.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-xs font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
