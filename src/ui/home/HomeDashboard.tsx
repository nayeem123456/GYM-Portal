import React from 'react';
import {
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  QrCode,
  CreditCard,
  Receipt,
  MessageCircle,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { WhatsAppService } from '../../services/WhatsAppService';

interface HomeDashboardProps {
  setActiveView: (view: string) => void;
  onOpenAddMember: () => void;
  onOpenScanQR: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveView,
  onOpenAddMember,
  onOpenScanQR
}) => {
  const members = db.getMembers();
  const expenses = db.getExpenses();
  const settings = db.getSettings();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = db.getAttendance(todayStr);

  // Calculations
  const activeMembers = members.filter(m => m.isBlocked === 0 && new Date(m.edate) >= new Date());
  const expiredMembers = members.filter(m => new Date(m.edate) < new Date());
  const totalRevenue = members.reduce((sum, m) => sum + (parseFloat(m.pamount) || 0), 0);
  const totalDues = members.reduce((sum, m) => sum + (parseFloat(m.damount) || 0), 0);

  // Members with dues
  const membersWithDues = members.filter(m => parseFloat(m.damount) > 0);

  // Members expiring in next 5 days
  const expiringSoon = members.filter(m => {
    const diffDays = Math.ceil((new Date(m.edate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return m.isBlocked === 0 && diffDays >= 0 && diffDays <= 5;
  });

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
            {settings.branches?.[0]?.location ? `${settings.branches[0].location} Branch` : 'Main Branch'}
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
            {settings.gymName}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            {todayAttendance.length} members checked in today • {activeMembers.length} active memberships
          </p>
        </div>

        {/* Quick Action Grid inside / below Banner */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-2.5 p-3 bg-white text-slate-900 hover:bg-emerald-50 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-extrabold leading-tight">Add Member</p>
              <p className="text-[10px] text-slate-500 font-normal">New signup</p>
            </div>
          </button>

          <button
            onClick={onOpenScanQR}
            className="flex items-center gap-2.5 p-3 bg-white/15 hover:bg-white/25 text-white rounded-2xl text-xs font-bold backdrop-blur-md transition-all active:scale-95 border border-white/20"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-extrabold leading-tight">Scan QR</p>
              <p className="text-[10px] text-emerald-200 font-normal">Check-in</p>
            </div>
          </button>

          <button
            onClick={() => setActiveView('idcard')}
            className="flex items-center gap-2.5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold backdrop-blur-md transition-all active:scale-95 border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-extrabold leading-tight">ID Cards</p>
              <p className="text-[10px] text-emerald-200 font-normal">Print badge</p>
            </div>
          </button>

          <button
            onClick={() => setActiveView('expenses')}
            className="flex items-center gap-2.5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold backdrop-blur-md transition-all active:scale-95 border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-extrabold leading-tight">Log Expense</p>
              <p className="text-[10px] text-emerald-200 font-normal">Track bills</p>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Members */}
        <div
          onClick={() => setActiveView('members')}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Members
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeMembers.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {expiredMembers.length} expired • {members.length} total
          </p>
        </div>

        {/* Today's Check-ins */}
        <div
          onClick={() => setActiveView('attendance')}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Check-ins Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {todayAttendance.length}
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
            Turnstile live
          </p>
        </div>

        {/* Total Collected */}
        <div
          onClick={() => setActiveView('billing')}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Paid subscriptions
          </p>
        </div>

        {/* Pending Dues */}
        <div
          onClick={() => setActiveView('members')}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Dues
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            ₹{totalDues.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-500 font-bold mt-0.5">
            {membersWithDues.length} members with dues
          </p>
        </div>
      </div>

      {/* Actionable Sections: Expiring Soon & Pending Dues with 1-click WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expiring Soon */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Expiring Soon (Next 5 Days)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              {expiringSoon.length} Members
            </span>
          </div>

          {expiringSoon.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No memberships expiring within the next 5 days.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {expiringSoon.map(m => {
                const diffDays = Math.ceil((new Date(m.edate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const msg = WhatsAppService.formatMessage(
                  'Dear {{name}}, your {{package_name}} membership at {{gym_name}} will expire on {{expiry_date}}. Renew today to keep workout momentum!',
                  { name: m.name, package_name: m.packageName, gym_name: settings.gymName, expiry_date: m.edate }
                );
                const waUrl = WhatsAppService.createWhatsAppUrl(m.phone, msg);

                return (
                  <div
                    key={m.memberId}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border border-slate-100 dark:border-slate-700/50"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.packageName} • {diffDays}d left</p>
                    </div>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Remind</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Dues Collection */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Pending Balance Dues
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
              {membersWithDues.length} Defaulters
            </span>
          </div>

          {membersWithDues.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              All member fees are collected and up-to-date!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {membersWithDues.map(m => {
                const msg = WhatsAppService.formatMessage(
                  'Hi {{name}}, friendly reminder from {{gym_name}}. Your membership has a pending balance due of ₹{{amount}}. Please clear it at your earliest convenience.',
                  { name: m.name, gym_name: settings.gymName, amount: m.damount }
                );
                const waUrl = WhatsAppService.createWhatsAppUrl(m.phone, msg);

                return (
                  <div
                    key={m.memberId}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border border-slate-100 dark:border-slate-700/50"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        ₹{m.damount} Due • {m.phone}
                      </p>
                    </div>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
