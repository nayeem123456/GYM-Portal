import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  CheckCircle2,
  CreditCard,
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
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: 'admin' | 'member';
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userRole }) => {
  // Navigation for Admin / Gym Owner
  const adminSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'insights', label: 'Gym Insights', icon: TrendingUp }
      ]
    },
    {
      title: 'MEMBERSHIP',
      items: [
        { id: 'members', label: 'Members Directory', icon: Users },
        { id: 'attendance', label: 'Attendance & QR', icon: CheckCircle2 },
        { id: 'idcard', label: 'ID Card Studio', icon: CreditCard }
      ]
    },
    {
      title: 'GYM OPERATIONS',
      items: [
        { id: 'batches', label: 'Batch Timings', icon: Clock },
        { id: 'packages', label: 'Packages & Plans', icon: Layers },
        { id: 'services', label: 'Add-on Services', icon: Sparkles },
        { id: 'trainers', label: 'Trainers & Staff', icon: UserCog }
      ]
    },
    {
      title: 'FITNESS & DIET',
      items: [
        { id: 'workouts', label: 'Workout Plans', icon: Dumbbell },
        { id: 'exercises', label: 'Exercise Library', icon: BookOpen },
        { id: 'diets', label: 'Diet Plans', icon: Apple },
        { id: 'meals', label: 'Meals Library', icon: UtensilsCrossed },
        { id: 'measurements', label: 'Body Measurements', icon: Activity }
      ]
    },
    {
      title: 'FINANCE & BILLING',
      items: [
        { id: 'expenses', label: 'Expense Manager', icon: Receipt },
        { id: 'billing', label: 'Billing & Invoices', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'MARKETING & SETUP',
      items: [
        { id: 'inquiries', label: 'Leads & Inquiries', icon: UserPlus },
        { id: 'templates', label: 'WhatsApp Templates', icon: MessageSquare },
        { id: 'settings', label: 'Settings & Branches', icon: Settings }
      ]
    }
  ];

  // Navigation for Member Portal
  const memberSections: NavSection[] = [
    {
      title: 'MY MEMBERSHIP',
      items: [
        { id: 'member_home', label: 'Member Portal', icon: LayoutDashboard },
        { id: 'member_id', label: 'My Digital ID Card', icon: CreditCard },
        { id: 'member_attendance', label: 'My Attendance', icon: CheckCircle2 }
      ]
    },
    {
      title: 'MY FITNESS JOURNEY',
      items: [
        { id: 'member_workout', label: 'My Workout Routine', icon: Dumbbell },
        { id: 'member_diet', label: 'My Diet Schedule', icon: Apple },
        { id: 'member_progress', label: 'My Body Metrics', icon: Activity }
      ]
    }
  ];

  const sections = userRole === 'admin' ? adminSections : memberSections;

  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col h-[calc(100vh-65px)] sticky top-[65px] select-none transition-colors overflow-y-auto">
      <div className="p-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5 mt-1.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-emerald-500 dark:text-emerald-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

