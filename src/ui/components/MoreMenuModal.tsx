import React from 'react';
import {
  X,
  Clock,
  Layers,
  Sparkles,
  UserCog,
  Dumbbell,
  BookOpen,
  Apple,
  UtensilsCrossed,
  Activity,
  Receipt,
  FileSpreadsheet,
  UserPlus,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Building2
} from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: 'admin' | 'member';
  setUserRole: (role: 'admin' | 'member') => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  userRole,
  setUserRole
}) => {
  if (!isOpen) return null;

  const settings = db.getSettings();

  const handleSelectView = (viewId: string) => {
    setActiveView(viewId);
    onClose();
  };

  const handleToggleRole = (newRole: 'admin' | 'member') => {
    setUserRole(newRole);
    if (newRole === 'member') {
      setActiveView('member_home');
    } else {
      setActiveView('dashboard');
    }
    onClose();
  };

  const adminMenuGroups = [
    {
      title: 'Operations & Membership',
      items: [
        { id: 'packages', label: 'Packages & Plans', desc: 'Membership pricing & durations', icon: Layers, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
        { id: 'batches', label: 'Batch Timings', desc: 'Morning & evening member slots', icon: Clock, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
        { id: 'services', label: 'Add-on Services', desc: 'Personal training, sauna, lockers', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
        { id: 'trainers', label: 'Trainers & Staff', desc: 'Coaches and staff payroll', icon: UserCog, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' }
      ]
    },
    {
      title: 'Fitness & Health Programs',
      items: [
        { id: 'workouts', label: 'Workout Plans', desc: 'Custom workout splits & routines', icon: Dumbbell, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
        { id: 'exercises', label: 'Exercise Library', desc: 'Movement catalog with muscle targets', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50' },
        { id: 'diets', label: 'Diet Plans', desc: 'Nutrition schedules & meal plans', icon: Apple, color: 'text-green-500 bg-green-50 dark:bg-green-950/50' },
        { id: 'meals', label: 'Meals Library', desc: 'Macro breakdown (protein, carbs, fat)', icon: UtensilsCrossed, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50' },
        { id: 'measurements', label: 'Body Measurements', desc: 'Weight, BMI, chest, waist metrics', icon: Activity, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50' }
      ]
    },
    {
      title: 'Finance & Invoicing',
      items: [
        { id: 'expenses', label: 'Expense Manager', desc: 'Rent, equipment, electricity bills', icon: Receipt, color: 'text-red-500 bg-red-50 dark:bg-red-950/50' },
        { id: 'billing', label: 'Tax Billing & Receipts', desc: 'Official GST tax receipts and dues', icon: FileSpreadsheet, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' }
      ]
    },
    {
      title: 'Marketing, Leads & Tools',
      items: [
        { id: 'inquiries', label: 'Leads & Inquiries', desc: 'Follow-ups and 1-click conversion', icon: UserPlus, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
        { id: 'templates', label: 'WhatsApp Automation', desc: 'Custom reminder and fee templates', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
        { id: 'idcard', label: 'ID Card Studio', desc: 'Printable membership ID badges', icon: CreditCard, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50' },
        { id: 'insights', label: 'Gym Insights & Revenue', desc: 'Growth analytics and projections', icon: TrendingUp, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/50' },
        { id: 'settings', label: 'Settings & Branches', desc: 'Gym profile, taxes, multi-branch', icon: Settings, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' }
      ]
    }
  ];

  const memberMenuGroups = [
    {
      title: 'My Fitness Hub',
      items: [
        { id: 'member_home', label: 'Digital Membership Pass', desc: 'QR code & active package details', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
        { id: 'member_workout', label: 'My Workout Routine', desc: 'Assigned exercises, reps & sets', icon: Dumbbell, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
        { id: 'member_diet', label: 'My Diet Schedule', desc: 'Daily calories and assigned meals', icon: Apple, color: 'text-green-500 bg-green-50 dark:bg-green-950/50' },
        { id: 'member_attendance', label: 'Attendance History', desc: 'Check-in timestamps & monthly streak', icon: Clock, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
        { id: 'member_progress', label: 'Body Metrics & Progress', desc: 'Track weight, chest, waist transformation', icon: Activity, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50' }
      ]
    }
  ];

  const groups = userRole === 'admin' ? adminMenuGroups : memberMenuGroups;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop touch to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200 pb-safe">
        {/* Handle bar & Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Gym Features & Menu
              </h2>
              <p className="text-[11px] text-slate-400">{settings.gymName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Switch Active Role:</div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => handleToggleRole('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                userRole === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin / Owner</span>
            </button>
            <button
              onClick={() => handleToggleRole('member')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                userRole === 'member'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-500" />
              <span>Member Portal</span>
            </button>
          </div>
        </div>

        {/* Categorized Menu List */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isCurrent = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectView(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

