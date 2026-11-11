import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  Dumbbell,
  Grid,
  CreditCard,
  Apple,
  Calendar,
  Activity
} from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: 'admin' | 'member';
  onOpenMore: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  userRole,
  onOpenMore
}) => {
  if (userRole === 'admin') {
    const isFitnessActive = ['workouts', 'exercises', 'diets', 'meals', 'measurements', 'batches', 'packages', 'services', 'trainers'].includes(activeView);
    const isMoreActive = ['expenses', 'billing', 'inquiries', 'templates', 'settings', 'insights', 'idcard'].includes(activeView);

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
        <div className="flex items-center justify-around h-16 px-1">
          {/* Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-emerald-500/10 scale-110' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* Members */}
          <button
            onClick={() => setActiveView('members')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'members'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'members' ? 'bg-emerald-500/10 scale-110' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Members</span>
          </button>

          {/* Attendance */}
          <button
            onClick={() => setActiveView('attendance')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'attendance'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'attendance' ? 'bg-emerald-500/10 scale-110' : ''}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Attendance</span>
          </button>

          {/* Fitness & Plans */}
          <button
            onClick={() => setActiveView('workouts')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isFitnessActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isFitnessActive ? 'bg-emerald-500/10 scale-110' : ''}`}>
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Fitness</span>
          </button>

          {/* More Drawer */}
          <button
            onClick={onOpenMore}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isMoreActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isMoreActive ? 'bg-emerald-500/10 scale-110' : ''}`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>
    );
  }

  // Member Portal Bottom Nav
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {/* Digital Pass / Home */}
        <button
          onClick={() => setActiveView('member_home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === 'member_home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'member_home' ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">My Pass</span>
        </button>

        {/* Workouts */}
        <button
          onClick={() => setActiveView('member_workout')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === 'member_workout'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'member_workout' ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Workouts</span>
        </button>

        {/* Diet */}
        <button
          onClick={() => setActiveView('member_diet')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === 'member_diet'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'member_diet' ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <Apple className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Diet</span>
        </button>

        {/* Attendance */}
        <button
          onClick={() => setActiveView('member_attendance')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === 'member_attendance'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'member_attendance' ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">History</span>
        </button>

        {/* Body Metrics / More */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === 'member_progress'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'member_progress' ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};

