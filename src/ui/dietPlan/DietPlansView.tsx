import React, { useState } from 'react';
import { Apple, PlusCircle, UtensilsCrossed, CheckCircle, Flame, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { DietPlan, Meal } from '../../types';

export const DietPlansView: React.FC = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(db.getDietPlans());
  const [meals] = useState<Meal[]>(db.getMeals());
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(dietPlans[0] || null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [targetGoal, setTargetGoal] = useState<DietPlan['targetGoal']>('Muscle Gain');
  const [totalCalories, setTotalCalories] = useState(2500);

  const reload = () => {
    const list = db.getDietPlans();
    setDietPlans(list);
    if (!selectedPlan && list.length > 0) setSelectedPlan(list[0]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDiet: DietPlan = {
      dietId: `diet_${Date.now()}`,
      title: title.trim(),
      targetGoal,
      totalCalories,
      meals: meals.slice(0, 4).map(m => ({
        mealId: m.mealId,
        mealName: m.name,
        timeOfDay: m.timeOfDay,
        portion: '1 Standard Serving'
      })),
      assignedMemberIds: []
    };

    db.saveDietPlan(newDiet);
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
            <Apple className="w-6 h-6 text-emerald-500" />
            <span>Nutrition & Diet Schedules</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calorie targets, macronutrient split (Protein/Carb/Fat) & structured daily meal timings
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Diet Plan</span>
        </button>
      </div>

      {/* Plans Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diet Plans List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Available Diet Blueprints ({dietPlans.length})
          </span>
          {dietPlans.map(d => {
            const isSelected = selectedPlan?.dietId === d.dietId;
            return (
              <div
                key={d.dietId}
                onClick={() => setSelectedPlan(d)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{d.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    {d.targetGoal}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono font-semibold text-amber-500">
                    <Flame className="w-3.5 h-3.5" /> {d.totalCalories} kcal
                  </span>
                  <span>•</span>
                  <span>{d.meals.length} Meals/day</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Details */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedPlan.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target: {selectedPlan.targetGoal} • Daily Calorie Goal: {selectedPlan.totalCalories} kcal
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" /> {selectedPlan.totalCalories} kcal
                </span>
              </div>

              {/* Meals Timeline */}
              <div className="space-y-3">
                {selectedPlan.meals.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {m.timeOfDay}
                      </span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {m.mealName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {m.portion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select or create a diet plan to view meals schedule.
            </div>
          )}
        </div>
      </div>

      {/* New Diet Plan Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-500" /> Create Diet Plan
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Plan Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Clean Cut 2000 kcal Plan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fitness Target
                  </label>
                  <select
                    value={targetGoal}
                    onChange={e => setTargetGoal(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Athletic Performance">Athletic Performance</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={totalCalories}
                    onChange={e => setTotalCalories(parseInt(e.target.value) || 2000)}
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
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

