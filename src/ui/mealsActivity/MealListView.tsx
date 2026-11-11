import React, { useState } from 'react';
import { UtensilsCrossed, PlusCircle, Flame, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { Meal } from '../../types';

export const MealListView: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(db.getMeals());
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Meal['timeOfDay']>('Breakfast');
  const [calories, setCalories] = useState(400);
  const [proteinGrams, setProteinGrams] = useState(30);
  const [carbsGrams, setCarbsGrams] = useState(40);
  const [fatsGrams, setFatsGrams] = useState(10);
  const [ingredients, setIngredients] = useState('');

  const reload = () => setMeals(db.getMeals());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMeal: Meal = {
      mealId: `meal_${Date.now()}`,
      name: name.trim(),
      timeOfDay,
      calories,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      ingredients: ingredients.trim()
    };

    db.saveMeal(newMeal);
    setName('');
    setIngredients('');
    setIsAddOpen(false);
    reload();
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-emerald-500" />
            <span>Nutrition & Meal Items</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calorie profiles, macronutrient density and ingredients directory
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Meal Item</span>
        </button>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map(m => (
          <div
            key={m.mealId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{m.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {m.timeOfDay}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Ingredients: {m.ingredients}
              </p>
            </div>

            {/* Macros Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> {m.calories} kcal
                </span>
                <span className="text-slate-400 text-[11px]">Macro Split</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold font-mono">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  P: {m.proteinGrams}g
                </div>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  C: {m.carbsGrams}g
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  F: {m.fatsGrams}g
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-500" /> Add Nutrition Meal
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Meal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Scrambled Eggs & Avocado Toast"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Timing Slot
                  </label>
                  <select
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Mid-Morning">Mid-Morning</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Evening Snack">Evening Snack</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Post-Workout">Post-Workout</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={proteinGrams}
                    onChange={e => setProteinGrams(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbsGrams}
                    onChange={e => setCarbsGrams(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={fatsGrams}
                    onChange={e => setFatsGrams(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ingredients Description
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  placeholder="e.g. 3 whole eggs, 1 slice sourdough, 1/2 avocado, salt & pepper"
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
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

