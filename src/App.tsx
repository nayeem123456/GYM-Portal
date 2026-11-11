import React, { useState, useEffect } from 'react';
import { Navbar } from './ui/components/Navbar';
import { Sidebar } from './ui/components/Sidebar';
import { BottomNav } from './ui/components/BottomNav';
import { MoreMenuModal } from './ui/components/MoreMenuModal';
import { HomeDashboard } from './ui/home/HomeDashboard';
import { GymInsightsView } from './feature/gyminsights/GymInsightsView';
import { MemberListView } from './ui/home/members/MemberListView';
import { AttendanceView } from './ui/attendance/AttendanceView';
import { BatchesView } from './ui/batchtimings/BatchesView';
import { PackagesView } from './ui/packages/PackagesView';
import { ServicesView } from './ui/services/ServicesView';
import { TrainersView } from './ui/addtrainer/TrainersView';
import { WorkoutPlansView } from './ui/workoutplan/WorkoutPlansView';
import { ExerciseListView } from './ui/exercise/ExerciseListView';
import { DietPlansView } from './ui/dietPlan/DietPlansView';
import { MealListView } from './ui/mealsActivity/MealListView';
import { MemberMeasurementsView } from './ui/memberMeasurement/MemberMeasurementsView';
import { ExpenseManagerView } from './feature/expensemanager/ExpenseManagerView';
import { InquiriesView } from './ui/inquiry/InquiriesView';
import { TemplatesView } from './ui/templateMessages/TemplatesView';
import { SettingsView } from './ui/settings/SettingsView';
import { MembersHomeView } from './member/MembersHomeView';

// Modals
import { AddMemberModal } from './ui/addmember/AddMemberModal';
import { QRScannerModal } from './ui/components/QRScannerModal';
import { CreateIdCardModal } from './ui/idCard/CreateIdCardModal';
import { MemberBillModal } from './ui/memberbill/MemberBillModal';

import { CachedMember, Inquiry } from './types';
import { db } from './core/cache/db/GymCacheDatabase';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'member'>('admin');

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isScanQROpen, setIsScanQROpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<CachedMember | null>(null);
  const [selectedMemberForIdCard, setSelectedMemberForIdCard] = useState<CachedMember | null>(null);
  const [selectedMemberForBill, setSelectedMemberForBill] = useState<CachedMember | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // When user switches role, navigate to appropriate view
  const handleRoleChange = (role: 'admin' | 'member') => {
    setUserRole(role);
    if (role === 'member') {
      setActiveView('member_home');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleConvertToMember = (inq: Inquiry) => {
    // Convert lead directly into pre-filled member
    const tempMember: CachedMember = {
      memberId: `mem_${Date.now()}`,
      gymOwnerId: 'owner_101',
      name: inq.name,
      phone: inq.phone,
      email: inq.email || '',
      address: '',
      dob: '1998-01-01',
      gender: 'Male',
      trainingType: 'Strength',
      packageId: 'pkg_1m',
      packageName: 'Monthly Standard',
      tamount: '2000',
      pamount: '2000',
      damount: '0',
      pdate: new Date().toISOString().split('T')[0],
      doj: new Date().toISOString().split('T')[0],
      edate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      discount: '0',
      batchId: 'b_morning_1',
      batchName: 'Early Bird Blast',
      trainerId: 't_1',
      trainerName: 'Alex Rivera',
      isBlocked: 0,
      regCode: `GYM-${Math.floor(1000 + Math.random() * 9000)}`,
      age: 26,
      paymentMode: 'UPI',
      cached_at: Date.now()
    };
    setSelectedMemberForEdit(tempMember);
    setIsAddMemberOpen(true);
  };

  // Render view router
  const renderMainContent = () => {
    if (userRole === 'member') {
      return <MembersHomeView />;
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <HomeDashboard
            setActiveView={setActiveView}
            onOpenAddMember={() => {
              setSelectedMemberForEdit(null);
              setIsAddMemberOpen(true);
            }}
            onOpenScanQR={() => setIsScanQROpen(true)}
          />
        );
      case 'insights':
        return <GymInsightsView />;
      case 'members':
        return (
          <MemberListView
            onOpenAddMember={() => {
              setSelectedMemberForEdit(null);
              setIsAddMemberOpen(true);
            }}
            onEditMember={m => {
              setSelectedMemberForEdit(m);
              setIsAddMemberOpen(true);
            }}
            onOpenIdCard={m => setSelectedMemberForIdCard(m)}
            onOpenBill={m => setSelectedMemberForBill(m)}
          />
        );
      case 'attendance':
        return <AttendanceView onOpenScanQR={() => setIsScanQROpen(true)} />;
      case 'idcard':
        // Default to first member if none selected
        return (
          <div className="p-3.5 sm:p-6 space-y-4 max-w-4xl mx-auto pb-nav">
            <div>
              <h1 className="text-lg sm:text-xl font-black">Membership ID Card Studio</h1>
              <p className="text-xs text-slate-400">Select a member to print their official pass badge.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {db.getMembers().map(m => (
                <div
                  key={m.memberId}
                  onClick={() => setSelectedMemberForIdCard(m)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{m.regCode}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">Print Pass →</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'batches':
        return <BatchesView />;
      case 'packages':
        return <PackagesView />;
      case 'services':
        return <ServicesView />;
      case 'trainers':
        return <TrainersView />;
      case 'workouts':
        return <WorkoutPlansView />;
      case 'exercises':
        return <ExerciseListView />;
      case 'diets':
        return <DietPlansView />;
      case 'meals':
        return <MealListView />;
      case 'measurements':
        return <MemberMeasurementsView />;
      case 'expenses':
        return <ExpenseManagerView />;
      case 'billing':
        return (
          <div className="p-3.5 sm:p-6 space-y-4 max-w-5xl mx-auto pb-nav">
            <div>
              <h1 className="text-lg sm:text-xl font-black">Member Billing & Invoices</h1>
              <p className="text-xs text-slate-400">Generate official tax invoices and collect dues.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {db.getMembers().map(m => (
                <div
                  key={m.memberId}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-xs text-slate-400">{m.packageName} • {m.paymentMode}</p>
                    <p className="text-xs font-bold mt-1">
                      Paid: <span className="text-emerald-500">₹{m.pamount}</span> | Due:{' '}
                      <span className={parseFloat(m.damount) > 0 ? 'text-amber-500' : 'text-slate-400'}>
                        ₹{m.damount}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMemberForBill(m)}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    View Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'inquiries':
        return <InquiriesView onConvertToMember={handleConvertToMember} />;
      case 'templates':
        return <TemplatesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <HomeDashboard
            setActiveView={setActiveView}
            onOpenAddMember={() => setIsAddMemberOpen(true)}
            onOpenScanQR={() => setIsScanQROpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Sticky Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        setUserRole={handleRoleChange}
        onOpenAddMember={() => {
          setSelectedMemberForEdit(null);
          setIsAddMemberOpen(true);
        }}
        onOpenScanQR={() => setIsScanQROpen(true)}
        onOpenMore={() => setIsMoreMenuOpen(true)}
        onSearchSelect={() => setActiveView('members')}
      />

      {/* Main Body with Sidebar + Dynamic View Container */}
      <div className="flex-1 flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={userRole}
        />

        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-65px)]">
          {renderMainContent()}
        </main>
      </div>

      {/* Mobile Native Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        onOpenMore={() => setIsMoreMenuOpen(true)}
      />

      {/* Mobile More / Features Drawer Sheet */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        setUserRole={handleRoleChange}
      />

      {/* Global Interactive Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          setSelectedMemberForEdit(null);
        }}
        onMemberSaved={() => {
          // Trigger reactivity
          setActiveView(activeView);
        }}
        initialMember={selectedMemberForEdit}
      />

      <QRScannerModal
        isOpen={isScanQROpen}
        onClose={() => setIsScanQROpen(false)}
        onAttendanceMarked={() => {
          // Trigger reactivity
        }}
      />

      <CreateIdCardModal
        isOpen={!!selectedMemberForIdCard}
        onClose={() => setSelectedMemberForIdCard(null)}
        member={selectedMemberForIdCard}
      />

      <MemberBillModal
        isOpen={!!selectedMemberForBill}
        onClose={() => setSelectedMemberForBill(null)}
        member={selectedMemberForBill}
      />
    </div>
  );
};

