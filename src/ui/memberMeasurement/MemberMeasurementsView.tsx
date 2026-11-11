import React, { useState } from 'react';
import { Activity, PlusCircle, User, TrendingDown, TrendingUp, Calendar, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { MemberMeasurement } from '../../types';

export const MemberMeasurementsView: React.FC = () => {
  const members = db.getMembers();
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.memberId || '');
  const [measurements, setMeasurements] = useState<MemberMeasurement[]>(db.getMeasurements(selectedMemberId));
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [weightKg, setWeightKg] = useState('78.5');
  const [heightCm, setHeightCm] = useState('178');
  const [chestInches, setChestInches] = useState('40');
  const [waistInches, setWaistInches] = useState('33');
  const [bicepsInches, setBicepsInches] = useState('15');
  const [bodyFatPercent, setBodyFatPercent] = useState('16.5');
  const [notes, setNotes] = useState('');

  const reload = (mId: string) => {
    setMeasurements(db.getMeasurements(mId));
  };

  const handleMemberChange = (mId: string) => {
    setSelectedMemberId(mId);
    reload(mId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100;
    const bmi = +(w / (h * h)).toFixed(1);

    const newRecord: MemberMeasurement = {
      id: `ms_${Date.now()}`,
      memberId: selectedMemberId,
      date: new Date().toISOString().split('T')[0],
      weightKg: w,
      heightCm: parseFloat(heightCm),
      bmi,
      chestInches: parseFloat(chestInches) || undefined,
      waistInches: parseFloat(waistInches) || undefined,
      bicepsInches: parseFloat(bicepsInches) || undefined,
      bodyFatPercent: parseFloat(bodyFatPercent) || undefined,
      notes: notes.trim()
    };

    db.saveMeasurement(newRecord);
    setIsAddOpen(false);
    setNotes('');
    reload(selectedMemberId);
  };

  const currentMember = members.find(m => m.memberId === selectedMemberId);

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span>Body Composition & Metric Tracking</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log weight, BMI, body fat percentage and muscular circumferences over time
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Measurements</span>
        </button>
      </div>

      {/* Member Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Member:</span>
          <select
            value={selectedMemberId}
            onChange={e => handleMemberChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          >
            {members.map(m => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} ({m.regCode})
              </option>
            ))}
          </select>
        </div>

        {currentMember && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            Goal: <span className="text-emerald-500 font-bold">{currentMember.trainingType}</span>
          </span>
        )}
      </div>

      {/* Measurements Timeline */}
      <div className="space-y-4">
        {measurements.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-300">
              No measurements recorded yet for {currentMember?.name}
            </p>
            <p>Click "Record New Measurements" above to log first baseline data.</p>
          </div>
        ) : (
          measurements.map((m, idx) => (
            <div
              key={m.id || idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Logged on {m.date}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                    BMI: {m.bmi} ({m.bmi < 18.5 ? 'Underweight' : m.bmi < 25 ? 'Normal' : 'Overweight'})
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white mt-1 block">
                    {m.weightKg} kg
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Height</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white mt-1 block">
                    {m.heightCm} cm
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Body Fat</span>
                  <span className="font-mono font-black text-lg text-emerald-500 mt-1 block">
                    {m.bodyFatPercent ? `${m.bodyFatPercent}%` : '-'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Chest</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white mt-1 block">
                    {m.chestInches ? `${m.chestInches}"` : '-'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Waist</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white mt-1 block">
                    {m.waistInches ? `${m.waistInches}"` : '-'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Biceps</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white mt-1 block">
                    {m.bicepsInches ? `${m.bicepsInches}"` : '-'}
                  </span>
                </div>
              </div>

              {m.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Trainer Notes:</span> {m.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Record Measurement Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Log Body Metrics
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Body Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatPercent}
                    onChange={e => setBodyFatPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Chest (inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={chestInches}
                    onChange={e => setChestInches(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Waist (inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={waistInches}
                    onChange={e => setWaistInches(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Biceps (inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bicepsInches}
                    onChange={e => setBicepsInches(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Progress Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Visible muscle definition on arms..."
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
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

