# MyGym Portal — Gym Management System

A modern, full-featured native Android gym and fitness club management application built with **Kotlin**, **Jetpack Compose (Material 3)**, and **Room Database**, designed to run on all mobile devices from Android 7.0 (API 24) to Android 16 (API 36).

---

## 📱 Prebuilt APK

The compiled release/debug APK is available directly in this repository:
- **File**: `MyGym-v1.0.apk`
- **Package**: `com.mygym.app`
- **Min SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 16 (API 36)

---

## 🚀 Key Features

### 👥 Member Management
- Member list with real-time search & status filtering (**Active**, **Expired**, **Payment Due**).
- Full member registration (photo, gender, DOB, joining date, expiry date, address, contact).
- Member profile view with direct shortcuts to **Renew**, **Invoice**, and **Body Measurements**.
- Freeze and block membership capabilities.

### 🏢 Dashboard & Gym Insights
- Key KPI cards: Active members, expiring soon, today checked-in, new inquiries.
- Analytics charts: Popular package distribution, peak attendance time slots, and financial health.

### 📦 Packages & Services
- Membership package configuration with custom duration (days/months) and pricing.
- Additional services management (personal trainer sessions, lockers, steam/sauna).

### 🏋️ Trainers & Permissions
- Trainer profile management with specialty, salary, and contact details.
- Granular permission toggles (manage members, record attendance, access financials).

### ⏰ Batches & Attendance
- Custom batch timing configuration (Morning, Afternoon, Evening, Ladies-only).
- Daily attendance tracking with check-in/check-out timestamps and live active attendee counters.

### 💰 Expense Manager
- Comprehensive operational expense tracking with category breakdown (Rent, Salaries, Utilities, Maintenance).
- Estimated net profit metrics and full expense ledger.

### 📋 Inquiries / Leads
- Prospect tracking with status notes and contact information for follow-ups.

### 🥗 Workout & Nutrition Plans
- Structured workout routines (PPL, 5-Day Split, Weight Loss, Strength).
- Nutrition and meal plan management.

### 🧾 Invoicing & ID Cards
- Itemized tax invoices with discounts, admission fees, and grand total.
- Ready for printing or sharing via WhatsApp / Email.

---

## 🛠️ Tech Stack & Architecture

- **Language**: Kotlin 2.2+
- **UI Toolkit**: Jetpack Compose with Material Design 3
- **Navigation**: Jetpack Navigation 3
- **Local Storage**: Room Database with Coroutines Flow
- **Cloud Backend**: Firebase (Auth, Firestore, Cloud Messaging)
- **Design Pattern**: MVVM + Clean Architecture with `AppContainer` Dependency Injection

---

