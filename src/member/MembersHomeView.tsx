import React, { useState } from 'react';
import {
  CreditCard,
  Dumbbell,
  Apple,
  Activity,
  Calendar,
  ShieldCheck,
  Clock,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  User,
  Sparkles
} from 'lucide-react';
import { db } from '../core/cache/db/GymCacheDatabase';
import { QRGenerator } from '../ui/components/QRGenerator';

export const MembersHomeView: React.FC = () => {
  const members = db.getMembers();
  // Default to first member as the active logged-in member
  const [activeMemberId, setActiveMemberId] = useState(members[0]?.memberId || '');
  const [activeTab, setActiveTab] = useState<'pass' | 'workout' | 'diet' | 'attendance' | 'metrics'>('pass');

  const member = members.find(m => m.memberId === activeMemberId) || members[0];
  const workouts = db.getWorkoutPlans();
  const diets = db.getDietPlans();
  const measurements = db.getMeasurements(member?.memberId);
  const attendance = db.getAttendance().filter(a => a.memberId === member?.memberId);
  const settings = db.getSettings();

  if (!member) {
    return (
      <div className="p-8 text-center text-slate-500">
        No registered members found. Please switch to Admin view to register members.
      </div>
    );
  }

  const assignedWorkout = workouts.find(w => w.assignedMemberIds.includes(member.memberId)) || workouts[0];
  const assignedDiet = diets.find(d => d.assignedMemberIds.includes(member.memberId)) || diets[0];

  const today = new Date();
  const expDate = new Date(member.edate);
  const daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-nav">
      {/* Member Profile Header Card */}
      <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md flex-shrink-0">
              {member.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold border border-white/20">
                  {member.regCode}
                </span>
                <span className="text-[11px] text-emerald-200 font-semibold">
                  {daysLeft >= 0 ? `${daysLeft} days left` : 'Expired'}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black mt-0.5 truncate">{member.name}</h1>
              <p className="text-xs text-emerald-100 truncate">
                {member.packageName} • Coach: {member.trainerName}
              </p>
            </div>
          </div>

          {/* Member Profile Switcher (Demo selector) */}
          <div className="self-end sm:self-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-[10px] text-emerald-200 uppercase font-bold">Profile:</span>
            <select
              value={activeMemberId}
              onChange={e => setActiveMemberId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {members.map(m => (
                <option key={m.memberId} value={m.memberId} className="bg-slate-900 text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Status</span>
            <span className="text-xs font-black text-white">
              {daysLeft >= 0 ? 'Active Pass' : 'Expired'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Check-ins</span>
            <span className="text-xs font-black text-white">{attendance.length} Sessions</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Training</span>
            <span className="text-xs font-black text-white">{member.trainingType}</span>
          </div>
        </div>
      </div>

      {/* Segmented Control / Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl overflow-x-auto text-xs font-bold">
        {[
          { id: 'pass', label: 'My Pass', icon: CreditCard },
          { id: 'workout', label: 'Workout', icon: Dumbbell },
          { id: 'diet', label: 'Diet', icon: Apple },
          { id: 'attendance', label: 'History', icon: Calendar },
          { id: 'metrics', label: 'Metrics', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isSel
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Digital Membership Pass */}
      {activeTab === 'pass' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-emerald-500/30 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Turnstile Entrance Pass</span>
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                {settings.gymName}
              </span>
            </div>

            <div className="py-6 flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <QRGenerator value={member.regCode} size={150} />
              </div>
              <p className="text-base font-mono font-black text-white mt-3 tracking-wider">{member.regCode}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Present this QR code to the turnstile scanner or front desk reception
              </p>
            </div>

            <div className="w-full bg-white/5 p-4 rounded-2xl text-xs space-y-2 text-slate-300 border border-white/5">
              <div className="flex justify-between">
                <span className="text-slate-400">Package</span>
                <span className="font-bold text-white">{member.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Slot</span>
                <span className="font-bold text-white">{member.batchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valid Until</span>
                <span className="font-bold text-emerald-400">{member.edate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status</span>
                <span className={`font-bold ${parseFloat(member.damount) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {parseFloat(member.damount) > 0 ? `₹${member.damount} Due` : 'Fully Paid'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assigned Workout Routine */}
      {activeTab === 'workout' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                  {assignedWorkout.level} Routine
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                  {assignedWorkout.title}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                {assignedWorkout.daysPerWeek} Days/Wk
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Level: {assignedWorkout.level} • {assignedWorkout.daysPerWeek} training days per week
            </p>

            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Workout Exercise Routine ({assignedWorkout.exercises.length} Exercises)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {assignedWorkout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{ex.exerciseName}</p>
                        <p className="text-[11px] text-slate-400">Rest: {ex.rest} between sets</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {ex.sets} Sets × {ex.reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Assigned Diet Schedule */}
      {activeTab === 'diet' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                  Target Calorie Nutrition Plan
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                  {assignedDiet.title}
                </h3>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                {assignedDiet.totalCalories} kcal
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target Goal: {assignedDiet.targetGoal} • Daily total {assignedDiet.totalCalories} kcal
            </p>

            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Daily Scheduled Meals ({assignedDiet.meals.length} Meals)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {assignedDiet.meals.map((mItem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{mItem.mealName}</p>
                        <p className="text-[11px] text-slate-400">{mItem.timeOfDay}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {mItem.portion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Attendance History */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Check-in History & Streaks
                </h3>
                <p className="text-xs text-slate-400">Total recorded gym sessions</p>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                {attendance.length} Sessions
              </span>
            </div>

            {attendance.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No attendance recorded yet for this member.
              </div>
            ) : (
              <div className="space-y-2">
                {attendance.map(att => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{att.date}</p>
                        <p className="text-[11px] text-slate-400">Checked in at {att.time}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Body Metrics & Progress */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Body Metrics & Physical Measurements
              </h3>
              <p className="text-xs text-slate-400">Historical fitness measurements recorded by coach</p>
            </div>

            {measurements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No measurement logs found for this member.
              </div>
            ) : (
              <div className="space-y-3">
                {measurements.map(m => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Logged Date: {m.date}
                      </span>
                      {m.bmi && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                          BMI: {m.bmi}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/40">
                        <span className="text-[10px] text-slate-400 block">Weight</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{m.weightKg} kg</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/40">
                        <span className="text-[10px] text-slate-400 block">Height</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{m.heightCm} cm</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/40">
                        <span className="text-[10px] text-slate-400 block">Chest</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{m.chestInches || '—'} in</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/40">
                        <span className="text-[10px] text-slate-400 block">Waist</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{m.waistInches || '—'} in</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
