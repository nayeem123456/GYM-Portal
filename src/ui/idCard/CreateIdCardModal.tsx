import React, { useRef } from 'react';
import { X, Printer, Dumbbell, ShieldCheck } from 'lucide-react';
import { CachedMember } from '../../types';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { QRGenerator } from '../components/QRGenerator';

interface CreateIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: CachedMember | null;
}

export const CreateIdCardModal: React.FC<CreateIdCardModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  const settings = db.getSettings();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Membership ID Card Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official Gym Membership Badge for {member.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Badge</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="p-8 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950/40">
          <div
            ref={printRef}
            className="printable-area w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-500/30 relative overflow-hidden space-y-4"
          >
            {/* Top Gym Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight text-white uppercase">
                    {settings.gymName}
                  </h3>
                  <p className="text-[9px] text-emerald-400 font-medium">Official Access Pass</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Member Identity & Avatar */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md border-2 border-white/20 flex-shrink-0">
                {member.name.charAt(0)}
              </div>
              <div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {member.regCode}
                </span>
                <h4 className="font-extrabold text-sm text-white mt-1 leading-tight">{member.name}</h4>
                <p className="text-[11px] text-slate-300">{member.trainingType} Athlete</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/5 p-3 rounded-2xl border border-white/5">
              <div>
                <span className="text-slate-400 block">Package:</span>
                <span className="font-bold text-white truncate block">{member.packageName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Batch Timing:</span>
                <span className="font-bold text-white truncate block">{member.batchName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Joined:</span>
                <span className="font-bold text-white">{member.doj}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Valid Until:</span>
                <span className="font-bold text-emerald-400">{member.edate}</span>
              </div>
            </div>

            {/* Bottom QR Code for Check-in */}
            <div className="flex flex-col items-center justify-center pt-1">
              <QRGenerator value={member.regCode} size={110} />
              <p className="text-[9px] text-slate-400 mt-2 text-center">
                Scan for attendance at turnstiles / front desk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

