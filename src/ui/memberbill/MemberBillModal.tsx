import React, { useState } from 'react';
import { X, Printer, CheckCircle, Receipt, DollarSign } from 'lucide-react';
import { CachedMember } from '../../types';
import { db } from '../../core/cache/db/GymCacheDatabase';

interface MemberBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: CachedMember | null;
  onBillUpdated?: () => void;
}

export const MemberBillModal: React.FC<MemberBillModalProps> = ({
  isOpen,
  onClose,
  member,
  onBillUpdated
}) => {
  const settings = db.getSettings();
  const [clearAmount, setClearAmount] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !member) return null;

  const billNo = 10000 + Math.abs(member.memberId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 17) % 90000;
  const total = parseFloat(member.tamount) || 0;
  const paid = parseFloat(member.pamount) || 0;
  const due = parseFloat(member.damount) || 0;

  const handleClearDue = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToPay = parseFloat(clearAmount);
    if (!amountToPay || amountToPay <= 0) return;

    const newPaid = paid + amountToPay;
    const newDue = Math.max(0, due - amountToPay);

    const updated: CachedMember = {
      ...member,
      pamount: String(newPaid),
      damount: String(newDue),
      pdate: new Date().toISOString().split('T')[0]
    };

    db.saveMember(updated);
    setSuccessMsg(`Payment of ₹${amountToPay} recorded successfully!`);
    setClearAmount('');
    if (onBillUpdated) onBillUpdated();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Member Fee Bill & Invoice
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Invoice #{billNo} • {member.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 printable-area bg-white text-slate-900">
          {/* Gym Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">{settings.gymName}</h1>
              <p className="text-xs text-slate-500">{settings.tagline}</p>
              <p className="text-xs text-slate-600 mt-1">{settings.address}</p>
              <p className="text-xs text-slate-600">Phone: {settings.phone} | GSTIN: {settings.gstin}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 px-2 py-1 rounded bg-emerald-50 border border-emerald-200">
                Tax Invoice
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2">Inv #: INV-{billNo}</p>
              <p className="text-xs text-slate-500">Date: {member.pdate}</p>
            </div>
          </div>

          {/* Member Billed To */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-semibold">BILLED TO:</span>
              <p className="font-bold text-sm text-slate-900 mt-0.5">{member.name}</p>
              <p className="text-slate-600">Phone: {member.phone}</p>
              {member.email && <p className="text-slate-600">Email: {member.email}</p>}
              <p className="text-slate-600">{member.address}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">MEMBERSHIP DETAILS:</span>
              <p className="text-slate-700 mt-0.5"><span className="font-semibold">Reg Code:</span> {member.regCode}</p>
              <p className="text-slate-700"><span className="font-semibold">Plan:</span> {member.packageName}</p>
              <p className="text-slate-700"><span className="font-semibold">Validity:</span> {member.doj} to {member.edate}</p>
              <p className="text-slate-700"><span className="font-semibold">Payment Mode:</span> {member.paymentMode}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-left text-slate-500 font-bold uppercase">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-right">Tax Rate</th>
                <th className="py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3">
                  <p className="font-bold text-slate-800">{member.packageName}</p>
                  <p className="text-slate-400 text-[11px]">Full gym floor access & training privileges</p>
                </td>
                <td className="py-3 text-right">18% GST</td>
                <td className="py-3 text-right font-mono font-semibold">₹{total}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td colSpan={2} className="py-2 text-right font-bold text-slate-700">Total Invoice Amount:</td>
                <td className="py-2 text-right font-mono font-bold text-slate-900">₹{total}</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-1 text-right text-emerald-600 font-bold">Amount Paid:</td>
                <td className="py-1 text-right font-mono font-bold text-emerald-600">₹{paid}</td>
              </tr>
              <tr className="border-t border-slate-200 font-bold">
                <td colSpan={2} className="py-2 text-right text-amber-600">Balance Due:</td>
                <td className="py-2 text-right font-mono text-amber-600">₹{due}</td>
              </tr>
            </tfoot>
          </table>

          {/* Authorization Footer */}
          <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-[11px] text-slate-400">
            <div>
              <p>Thank you for partnering with {settings.gymName}!</p>
              <p>This is a computer-generated tax invoice.</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-300 mb-1" />
              <p className="font-semibold text-slate-700">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Action Panel for Due Settlement (No Print) */}
        {due > 0 && (
          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-3 no-print">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Record Due Settlement Payment</span>
            </div>
            <form onSubmit={handleClearDue} className="flex gap-2">
              <input
                type="number"
                max={due}
                value={clearAmount}
                onChange={e => setClearAmount(e.target.value)}
                placeholder={`Enter amount up to ₹${due}`}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                Record Payment
              </button>
            </form>
            {successMsg && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {successMsg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

