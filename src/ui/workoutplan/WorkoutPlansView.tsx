import React, { useState } from 'react';
import { Dumbbell, PlusCircle, BookOpen, Layers, Check, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { WorkoutPlan, Exercise } from '../../types';

export const WorkoutPlansView: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>(db.getWorkoutPlans());
  const [exercises] = useState<Exercise[]>(db.getExercises());
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(plans[0] || null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New plan form state
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const reload = () => {
    const list = db.getWorkoutPlans();
    setPlans(list);
    if (!selectedPlan && list.length > 0) setSelectedPlan(list[0]);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlan: WorkoutPlan = {
      planId: `wp_${Date.now()}`,
      title: title.trim(),
      level,
      daysPerWeek,
      exercises: exercises.slice(0, 4).map(ex => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.name,
        day: 'Day 1 (Full Body)',
        sets: ex.defaultSets,
        reps: `${ex.defaultReps}`,
        rest: `${ex.restSeconds}s`
      })),
      assignedMemberIds: []
    };

    db.saveWorkoutPlan(newPlan);
    setTitle('');
    setIsAddOpen(false);
    reload();
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Dumbbell className="w-6 h-6 text-emerald-500" />
            <span>Workout Plans & Routines</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Design targeted hypertrophy, strength and conditioning splits for members
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Workout Plan</span>
        </button>
      </div>

      {/* Plans Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans List Column */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Available Routines ({plans.length})
          </span>
          {plans.map(p => {
            const isSelected = selectedPlan?.planId === p.planId;
            return (
              <div
                key={p.planId}
                onClick={() => setSelectedPlan(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.level === 'Advanced'
                        ? 'bg-red-100 dark:bg-red-950 text-red-600'
                        : p.level === 'Intermediate'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                    }`}
                  >
                    {p.level}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{p.daysPerWeek} Days/Week</span>
                  <span>•</span>
                  <span>{p.exercises.length} Exercises</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Exercise Breakdown */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedPlan.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedPlan.level} Split • {selectedPlan.daysPerWeek} training days per week
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                  {selectedPlan.exercises.length} Exercises Included
                </span>
              </div>

              {/* Exercises Table */}
              <div className="space-y-3">
                {selectedPlan.exercises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        {item.day}
                      </span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.exerciseName}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-right font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Sets</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.sets} Sets</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Reps</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.reps}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Rest</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.rest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select or create a workout plan to view exercise breakdown.
            </div>
          )}
        </div>
      </div>

      {/* New Workout Plan Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-500" /> Create Workout Plan
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Routine Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 5-Day Push Pull Legs"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Days / Week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={daysPerWeek}
                    onChange={e => setDaysPerWeek(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                  Create Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

