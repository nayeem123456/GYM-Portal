import React, { useState } from 'react';
import { QrCode, X, CheckCircle, AlertCircle, Search, User } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { AttendanceRecord } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttendanceMarked?: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onAttendanceMarked
}) => {
  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; memberName?: string } | null>(null);

  if (!isOpen) return null;

  const members = db.getMembers();

  const handleProcessCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const member = members.find(
      m => m.regCode.toUpperCase() === cleanCode || m.phone.includes(cleanCode) || m.memberId.toUpperCase() === cleanCode
    );

    if (!member) {
      setResult({
        success: false,
        message: `No active member found with identifier "${cleanCode}".`
      });
      return;
    }

    if (member.isBlocked === 1) {
      setResult({
        success: false,
        message: `Member ${member.name} (${member.regCode}) is currently BLOCKED by administration. Access denied.`
      });
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record: AttendanceRecord = {
      id: `att_${Date.now()}`,
      memberId: member.memberId,
      memberName: member.name,
      regCode: member.regCode,
      timestamp: now.toISOString(),
      date: today,
      time: timeStr,
      method: 'QR_SCAN',
      status: 'PRESENT'
    };

    const markRes = db.markAttendance(record);
    setResult({
      success: markRes.success,
      message: markRes.message,
      memberName: member.name
    });

    if (markRes.success && onAttendanceMarked) {
      onAttendanceMarked();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Member QR Check-In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan ID barcode or enter registration code
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setResult(null);
              setInputCode('');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Simulation View */}
        <div className="p-6 text-center space-y-4">
          <div className="relative mx-auto w-52 h-52 bg-slate-950 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/60 shadow-inner overflow-hidden">
            {/* Animated Scanning Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50" />
            <QrCode className="w-20 h-20 text-emerald-500/40" />
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Ready for Optical Scanner
            </p>
          </div>

          {/* Quick Registration Code Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block text-left">
              Or Manual Code / Phone Check-In:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleProcessCode(inputCode)}
                  placeholder="e.g. GYM-0101 or 98765..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => handleProcessCode(inputCode)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Quick Select Quick Chips */}
          <div className="text-left space-y-1.5 pt-2">
            <span className="text-[11px] font-semibold text-slate-400">Quick Test Members:</span>
            <div className="flex flex-wrap gap-1.5">
              {members.slice(0, 4).map(m => (
                <button
                  key={m.memberId}
                  onClick={() => {
                    setInputCode(m.regCode);
                    handleProcessCode(m.regCode);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 font-mono"
                >
                  <User className="w-3 h-3" />
                  {m.regCode} ({m.name.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Result Banner */}
          {result && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-left text-xs ${
                result.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{result.success ? 'Access Granted' : 'Check-In Issue'}</p>
                <p className="mt-0.5">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

