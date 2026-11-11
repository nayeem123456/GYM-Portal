import React, { useState } from 'react';
import { BookOpen, PlusCircle, Filter, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { Exercise } from '../../types';

export const ExerciseListView: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(db.getExercises());
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exercise['category']>('Chest');
  const [equipment, setEquipment] = useState('');
  const [defaultSets, setDefaultSets] = useState(4);
  const [defaultReps, setDefaultReps] = useState(10);
  const [restSeconds, setRestSeconds] = useState(60);
  const [instructions, setInstructions] = useState('');

  const reload = () => setExercises(db.getExercises());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEx: Exercise = {
      exerciseId: `ex_${Date.now()}`,
      name: name.trim(),
      category,
      equipment: equipment.trim() || 'Bodyweight',
      defaultSets,
      defaultReps,
      restSeconds,
      instructions: instructions.trim()
    };

    db.saveExercise(newEx);
    setName('');
    setEquipment('');
    setInstructions('');
    setIsAddOpen(false);
    reload();
  };

  const filtered = selectedCat === 'ALL'
    ? exercises
    : exercises.filter(e => e.category === selectedCat);

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <span>Exercise Movement Library</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target muscle groups, required gym equipment, execution cues & rest timing
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Exercise</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setSelectedCat('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            selectedCat === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 font-bold shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Categories ({exercises.length})
        </button>
        {categories.map(c => {
          const count = exercises.filter(e => e.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCat === c
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ex => (
          <div
            key={ex.exerciseId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {ex.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {ex.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Equipment: <span className="font-semibold text-slate-700 dark:text-slate-300">{ex.equipment}</span>
              </p>
              {ex.instructions && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {ex.instructions}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-500 dark:text-slate-400">
              <span>{ex.defaultSets} Sets × {ex.defaultReps} Reps</span>
              <span>Rest: {ex.restSeconds}s</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Exercise Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" /> Add New Exercise
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Incline Dumbbell Curl"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Muscle Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Equipment
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={e => setEquipment(e.target.value)}
                    placeholder="Barbell / Machine"
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Sets</label>
                  <input
                    type="number"
                    value={defaultSets}
                    onChange={e => setDefaultSets(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Reps</label>
                  <input
                    type="number"
                    value={defaultReps}
                    onChange={e => setDefaultReps(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Rest (s)</label>
                  <input
                    type="number"
                    value={restSeconds}
                    onChange={e => setRestSeconds(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Form & Safety Instructions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Key cues for correct execution..."
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
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

