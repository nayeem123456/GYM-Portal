import React, { useState } from 'react';
import { UserPlus, PlusCircle, Phone, Calendar, ArrowRight, CheckCircle2, MessageCircle, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { Inquiry } from '../../types';
import { WhatsAppService } from '../../services/WhatsAppService';

interface InquiriesViewProps {
  onConvertToMember: (inq: Inquiry) => void;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({ onConvertToMember }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(db.getInquiries());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const settings = db.getSettings();

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('General Weight Loss & Cardio');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const reload = () => setInquiries(db.getInquiries());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newInq: Inquiry = {
      inquiryId: `inq_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      interest: interest.trim(),
      date: new Date().toISOString().split('T')[0],
      followUpDate,
      status: 'New',
      notes: notes.trim()
    };

    db.saveInquiry(newInq);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setIsAddOpen(false);
    reload();
  };

  const handleStatusChange = (inq: Inquiry, newStatus: Inquiry['status']) => {
    const updated = { ...inq, status: newStatus };
    db.saveInquiry(updated);
    reload();
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-emerald-500" />
            <span>Prospective Leads & Inquiries</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage gym walk-ins, digital inquiries, follow-up dates and membership conversions
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Lead Inquiry</span>
        </button>
      </div>

      {/* Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inquiries.map(inq => {
          const followUpMsg = `Hi ${inq.name}, thanks for visiting ${settings.gymName}! We have special membership packages available this week for your interest in "${inq.interest}". When would you like to drop by for a free trial session?`;
          const waUrl = WhatsAppService.createWhatsAppUrl(inq.phone, followUpMsg);

          return (
            <div
              key={inq.inquiryId}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{inq.name}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Interested in: {inq.interest}
                    </p>
                  </div>
                  <select
                    value={inq.status}
                    onChange={e => handleStatusChange(inq, e.target.value as any)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border focus:outline-none ${
                      inq.status === 'Converted'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-300'
                        : inq.status === 'Followed-Up'
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 border-blue-300'
                        : inq.status === 'Lost'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300'
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Followed-Up">Followed-Up</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inq.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Follow-up: <strong className="text-slate-700 dark:text-slate-200">{inq.followUpDate}</strong></span>
                  </p>
                  {inq.notes && (
                    <p className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                      {inq.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {inq.status !== 'Converted' && (
                  <button
                    onClick={() => onConvertToMember(inq)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 rounded-xl font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span>Convert to Member</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-500" /> New Prospect Inquiry
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vikram Batra"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765..."
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Fitness Interest
                </label>
                <input
                  type="text"
                  value={interest}
                  onChange={e => setInterest(e.target.value)}
                  placeholder="e.g. Strength Training & Bodybuilding"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Inquiry Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Inquired about evening batches..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

