import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Flame, Ticket, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { notificationsModalOpen, setNotificationsModalOpen, notifications, markAllNotificationsAsRead } = useApp();

  if (!notificationsModalOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'ticket':
        return <Ticket className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="notification-modal-container"
        className="relative w-full max-w-lg rounded-2xl glass-panel bg-[#0b0f26]/95 border border-purple-500/30 p-6 shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming text-xl font-bold text-white tracking-wide">
                Notifications
              </h3>
              <p className="text-xs text-slate-400">Updates, ticket claims & reward announcements</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-semibold text-slate-400">
            {notifications.filter((n) => !n.read).length} Unread Updates
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No notifications right now. Check back later!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-purple-950/30 border-purple-500/30 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
