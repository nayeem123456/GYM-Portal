import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Search,
  PlusCircle,
  QrCode,
  Dumbbell,
  UserCheck,
  ShieldCheck,
  Menu,
  ChevronDown
} from 'lucide-react';
import { NotificationService, AlertNotification } from '../../services/NotificationService';
import { db } from '../../core/cache/db/GymCacheDatabase';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: 'admin' | 'member';
  setUserRole: (role: 'admin' | 'member') => void;
  onOpenAddMember: () => void;
  onOpenScanQR: () => void;
  onOpenMore: () => void;
  onSearchSelect?: (memberId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  setActiveView,
  userRole,
  setUserRole,
  onOpenAddMember,
  onOpenScanQR,
  onOpenMore
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const alerts: AlertNotification[] = NotificationService.getActiveAlerts();
  const settings = db.getSettings();
  const members = db.getMembers();

  const filteredMembers = searchQuery.trim()
    ? members.filter(
        m =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery) ||
          m.regCode.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 sm:px-6 h-14 sm:h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors pt-safe">
      {/* Brand & Left Info */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <div
          onClick={() => setActiveView(userRole === 'admin' ? 'dashboard' : 'member_home')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight truncate max-w-[130px] xs:max-w-[160px] sm:max-w-xs">
              {settings.gymName}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                v2.5.6
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                {userRole === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Desktop Search Bar */}
        <div className="relative hidden md:block max-w-xs lg:max-w-md w-full ml-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search member by name, phone..."
              className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/60 border border-transparent focus:border-emerald-500 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && filteredMembers.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Members ({filteredMembers.length})
              </div>
              {filteredMembers.map(m => (
                <div
                  key={m.memberId}
                  onClick={() => {
                    setActiveView('members');
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between border-t border-slate-100 dark:border-slate-700/40"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.phone} • {m.packageName}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">{m.regCode}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Quick Add Member button (Tablet & Desktop only) */}
        {userRole === 'admin' && (
          <button
            onClick={onOpenAddMember}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        )}

        {/* QR Scan Attendance button */}
        <button
          onClick={onOpenScanQR}
          className="p-2 sm:px-2.5 sm:py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          title="Scan QR for Check-in"
        >
          <QrCode className="w-4 h-4 text-emerald-500" />
          <span className="hidden md:inline">Scan QR</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Notifications & Alerts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-semibold">
                  {alerts.length} Active
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No pending alerts right now.
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div
                      key={alert.id}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"
                      onClick={() => {
                        if (alert.type.includes('payment') || alert.type.includes('expir')) {
                          setActiveView('members');
                        } else {
                          setActiveView('inquiries');
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            alert.severity === 'high'
                              ? 'bg-red-500'
                              : alert.severity === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {alert.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-3">
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Role Switcher Pill (Desktop) or Mobile Quick Switch */}
        <button
          onClick={() => {
            const next = userRole === 'admin' ? 'member' : 'admin';
            setUserRole(next);
            setActiveView(next === 'member' ? 'member_home' : 'dashboard');
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
          title={`Currently in ${userRole} mode. Tap to switch.`}
        >
          {userRole === 'admin' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
          )}
          <span className="text-[11px] capitalize">{userRole}</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMore}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
