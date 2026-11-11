import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { CachedMember } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberSaved: () => void;
  initialMember?: CachedMember | null;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onMemberSaved,
  initialMember
}) => {
  const packages = db.getPackages();
  const batches = db.getBatches();
  const trainers = db.getTrainers();

  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState(initialMember?.name || '');
  const [phone, setPhone] = useState(initialMember?.phone || '');
  const [email, setEmail] = useState(initialMember?.email || '');
  const [address, setAddress] = useState(initialMember?.address || '');
  const [dob, setDob] = useState(initialMember?.dob || '1998-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialMember?.gender || 'Male');
  const [trainingType, setTrainingType] = useState(initialMember?.trainingType || 'Strength');
  const [packageId, setPackageId] = useState(initialMember?.packageId || (packages[0]?.packageId || ''));
  const [batchId, setBatchId] = useState(initialMember?.batchId || (batches[0]?.batchId || ''));
  const [trainerId, setTrainerId] = useState(initialMember?.trainerId || (trainers[0]?.trainerId || ''));
  const [pamount, setPamount] = useState(initialMember?.pamount || '');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>(initialMember?.paymentMode || 'UPI');
  const [doj, setDoj] = useState(initialMember?.doj || today);

  if (!isOpen) return null;

  const selectedPkg = packages.find(p => p.packageId === packageId) || packages[0];
  const selectedBatch = batches.find(b => b.batchId === batchId) || batches[0];
  const selectedTrainer = trainers.find(t => t.trainerId === trainerId) || trainers[0];

  const totalCalculated = selectedPkg ? selectedPkg.price + selectedPkg.admissionFee : 1500;
  const paidVal = parseFloat(pamount) || 0;
  const dueVal = Math.max(0, totalCalculated - paidVal);

  const calculateExpiryDate = (startDateStr: string, months: number): string => {
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const expiryDate = calculateExpiryDate(doj, selectedPkg?.durationMonths || 1);
    const regCode = initialMember?.regCode || `GYM-${Math.floor(1000 + Math.random() * 9000)}`;

    const memberToSave: CachedMember = {
      memberId: initialMember?.memberId || `mem_${Date.now()}`,
      gymOwnerId: 'owner_101',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      dob,
      gender,
      trainingType,
      packageId: selectedPkg.packageId,
      packageName: selectedPkg.name,
      tamount: String(totalCalculated),
      pamount: String(paidVal),
      damount: String(dueVal),
      pdate: today,
      doj,
      edate: expiryDate,
      discount: '0',
      batchId: selectedBatch.batchId,
      batchName: selectedBatch.name,
      trainerId: selectedTrainer.trainerId,
      trainerName: selectedTrainer.name,
      isBlocked: initialMember?.isBlocked || 0,
      regCode,
      age: Math.max(16, new Date().getFullYear() - new Date(dob).getFullYear()),
      paymentMode,
      cached_at: Date.now()
    };

    db.saveMember(memberToSave);
    onMemberSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto sm:my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {initialMember ? 'Edit Gym Member' : 'Register New Member'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Complete profile, allocate batch & package plan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Flat / House No, Street, City"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Package Selection */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Membership Package
              </label>
              <select
                value={packageId}
                onChange={e => {
                  setPackageId(e.target.value);
                  const p = packages.find(pkg => pkg.packageId === e.target.value);
                  if (p) setPamount(String(p.price + p.admissionFee));
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {packages.map(p => (
                  <option key={p.packageId} value={p.packageId}>
                    {p.name} ({p.durationMonths} Mo) - ₹{p.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Timing */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assigned Batch Slot
              </label>
              <select
                value={batchId}
                onChange={e => setBatchId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {batches.map(b => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.name} ({b.startTime} - {b.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Trainer Assignment */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Trainer / Coach
              </label>
              <select
                value={trainerId}
                onChange={e => setTrainerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {trainers.map(t => (
                  <option key={t.trainerId} value={t.trainerId}>
                    Coach {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Training Type */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Training Goal
              </label>
              <select
                value={trainingType}
                onChange={e => setTrainingType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Strength">Strength & Hypertrophy</option>
                <option value="Cardio">Cardio & Weight Loss</option>
                <option value="Personal">1-on-1 Personal Training</option>
                <option value="Crossfit">Crossfit & Functional</option>
                <option value="General">General Fitness</option>
              </select>
            </div>

            {/* Date of Joining */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Date of Joining (DOJ)
              </label>
              <input
                type="date"
                value={doj}
                onChange={e => setDoj(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Package Price + Admission:</span>
              <span className="font-bold">₹{totalCalculated}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Amount Paid Today (₹):
              </label>
              <input
                type="number"
                value={pamount}
                onChange={e => setPamount(e.target.value)}
                placeholder={String(totalCalculated)}
                className="w-36 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-right font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-2 font-semibold">
              <span className={dueVal > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}>
                Remaining Due Balance:
              </span>
              <span className={`font-bold ${dueVal > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`}>
                ₹{dueVal}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialMember ? 'Save Changes' : 'Confirm Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

