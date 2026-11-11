import React, { useState } from 'react';
import { CheckCircle2, QrCode, Calendar, Clock, UserCheck, Search, PlusCircle } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { AttendanceRecord } from '../../types';

interface AttendanceViewProps {
  onOpenScanQR: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onOpenScanQR }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(db.getAttendance(selectedDate));
  const [search, setSearch] = useState('');

  const reload = (date: string) => {
    setAttendance(db.getAttendance(date));
  };

  const filtered = attendance.filter(a =>
    a.memberName.toLowerCase().includes(search.toLowerCase()) ||
    a.regCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
            <span>Attendance Log</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Real-time biometric and QR check-ins
          </p>
        </div>

        <button
          onClick={onOpenScanQR}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* Date Switcher & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value);
              reload(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => {
              setSelectedDate(todayStr);
              reload(todayStr);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
          >
            Today
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search checked-in member..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Attendance Feed Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
          <span>Member Profile</span>
          <span>Check-in Timestamp</span>
          <span>Access Method & Status</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-bold text-slate-600 dark:text-slate-400">
                No attendance logs found for {selectedDate}
              </p>
              <p>Click "Launch QR Scanner" above to record a new check-in.</p>
            </div>
          ) : (
            filtered.map((rec, idx) => (
              <div
                key={rec.id || idx}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm">
                    {rec.memberName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{rec.memberName}</p>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{rec.regCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {rec.method.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    Present
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

