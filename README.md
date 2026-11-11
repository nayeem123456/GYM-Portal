# 🏋️ IronPulse / MyGym - Modern Gym Management Suite (v2.5.6)

A next-generation, responsive **Gym Management Software** designed by reverse engineering the architectural components, Room database schemas, DTOs, and feature workflows of the original `MyGym.apk` (`in.studycafe.gymbook`).

Rebuilt from the ground up with **React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons**, an offline-first storage engine mimicking Room, and dynamic Dark/Light theme switching.

---

## 🚀 Quick Start (Run Locally)

From the project root (`d:\projects\GYM software`):

```bash
# 1. Start the interactive development server
npm run dev

# Or test the production build preview
npm run preview
```

Open your browser to: **`http://localhost:3000`** (or the port indicated in terminal).

---

## 🏛️ Code Architecture (Mirrors Original APK Structure)

| Original APK Package / Activity | New Software Component / View | Purpose & Features |
| :--- | :--- | :--- |
| `core/cache/db/GymCacheDatabase` | `src/core/cache/db/GymCacheDatabase.ts` | Local SQLite/Room simulation: `cached_members`, `cached_member_package_plans`, `cached_member_service_plans`, `cache_sync_metadata`, `expenses`, `batches`, `trainers`, `inquiries`, `workouts`, `diets`, `attendance`. |
| `feature/gyminsights/GymInsightsActivity` | `src/feature/gyminsights/GymInsightsView.tsx` | Revenue velocity, expense breakdown by category, package popularity, member growth KPIs, and net operating profit. |
| `feature/expensemanager/ExpenseManagerActivity` | `src/feature/expensemanager/ExpenseManagerView.tsx` | Operational expense logging, category filtering (Rent, Salaries, Equipment, Electricity), outflow analytics. |
| `ui/home/HomeActivity` | `src/ui/home/HomeDashboard.tsx` | Executive dashboard with summary cards, live attendance feed, expiring plan alerts, pending dues, batch capacity bars. |
| `ui/addmember/AddMemberActivity` | `src/ui/addmember/AddMemberModal.tsx` | Complete member onboarding: profile, contact, batch selection, package selection, coach assignment, fee dues calculation. |
| `ui/home/members/` | `src/ui/home/members/MemberListView.tsx` | Member directory: status filters (Active, Expiring Soon, Expired, Due Fees, Blocked), search, 1-click WhatsApp alerts. |
| `ui/home/members/idCard/CreateIdCardActivity` | `src/ui/idCard/CreateIdCardModal.tsx` | Print-ready membership ID badge with gym branding, member photo avatar, Reg Code, and scannable optical QR code. |
| `ui/memberbill/MemberBillActivity` | `src/ui/memberbill/MemberBillModal.tsx` | Formal printable GST Tax Invoice (#INV-XXXXX), line items, due fee clearance, cash/UPI receipt recording. |
| `ui/home/members/attendance/AttendanceActivity` & `ScanQrCodeActivity` | `src/ui/attendance/AttendanceView.tsx` & `QRScannerModal.tsx` | Live QR code scanning simulator, manual phone/code check-in, real-time presence log. |
| `ui/batchtimings/BatchesActivity` | `src/ui/batchtimings/BatchesView.tsx` | Morning & evening workout time slots, maximum floor capacity limits, trainer assignment. |
| `ui/packages/PackagesActivity` | `src/ui/packages/PackagesView.tsx` | Membership package configuration (1, 3, 6, 12 months), pricing, admission fee, tax percentage. |
| `ui/services/ServicesActivity` | `src/ui/services/ServicesView.tsx` | Add-on services: 1-on-1 Personal Training passes, Steam & Sauna passes, VIP locker rentals. |
| `ui/addtrainer/TrainersView.tsx` | `src/ui/addtrainer/TrainersView.tsx` | Staff roster: coaches, specializations (Crossfit, Hypertrophy, Cardio), experience, compensation. |
| `ui/workoutplan/WorkoutPlanActivity` | `src/ui/workoutplan/WorkoutPlansView.tsx` | Custom workout splits (e.g. Push-Pull-Legs, Full Body), days per week, exercise sets, reps, and rest timers. |
| `ui/exercise/ExerciseListActivity` | `src/ui/exercise/ExerciseListView.tsx` | Exercise library grouped by muscle categories (Chest, Back, Legs, Shoulders, Arms, Core, Cardio). |
| `ui/dietPlan/DietPlanActivity` | `src/ui/dietPlan/DietPlansView.tsx` | Nutrition diet blueprints (Weight Loss, Muscle Gain, Maintenance), total daily calories, meal schedules. |
| `ui/mealsActivity/MealListActivity` | `src/ui/mealsActivity/MealListView.tsx` | Food & meals library with macronutrient breakdown (Protein, Carbs, Fats, Calories). |
| `ui/memberMeasurement/MemberMeasurements` | `src/ui/memberMeasurement/MemberMeasurementsView.tsx` | Body composition logs: Weight (kg), Height (cm), BMI, Chest, Waist, Biceps, Body Fat %, progress notes. |
| `ui/inquiry/InquiryListActivity` & `NewInquiryActivity` | `src/ui/inquiry/InquiriesView.tsx` | Lead tracking, follow-up dates, 1-click WhatsApp follow-ups, and direct 1-click conversion to active member. |
| `ui/home/gym/templateMessages/TemplateMessagesActivity` | `src/ui/templateMessages/TemplatesView.tsx` | Dynamic messaging templates (`{{name}}`, `{{amount}}`, `{{gym_name}}`, `{{expiry_date}}`) with pre-filled WhatsApp links. |
| `ui/settings/SettingsActivity` & `AddBranchActivity` | `src/ui/settings/SettingsView.tsx` | Gym profile, GSTIN, multi-branch management, full JSON backup export & restore. |
| `member/MembersHomeActivity` | `src/member/MembersHomeView.tsx` | Dedicated Member Portal view: digital membership card with live QR code, assigned workout split, diet meals, attendance history. |

---

## 🌟 Key Highlights & Modern UI Features

1. **Dual Portal System**:
   * **Admin / Gym Owner Portal**: Complete control over finances, members, trainers, leads, and operational configuration.
   * **Member Portal**: Clean personal view for athletes to check their digital QR badge, daily workout routine, diet meals, and attendance.
2. **Dynamic Dark / Light Mode**:
   * High-contrast dark mode designed for fitness consoles (Deep slate `#0b0f17` with neon emerald `#10b981` accents).
   * Crisp, clean minimalist light theme with soft cards and clear typography.
3. **One-Click WhatsApp Integration**:
   * Pre-formatted WhatsApp links for payment due reminders, renewal alerts, birthday wishes, and inquiry follow-ups.
4. **Print-Ready ID Badges & Tax Invoices**:
   * Browser-native print formatting (`window.print()`) for member cards with QR codes and official invoices.
5. **Data Portability**:
   * Full database backup download (JSON) and one-click restore.

