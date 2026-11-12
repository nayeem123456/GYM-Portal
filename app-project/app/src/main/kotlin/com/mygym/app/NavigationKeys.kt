package com.mygym.app

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

// Auth
@Serializable data object Login : NavKey
@Serializable data object Signup : NavKey
@Serializable data object ForgotPassword : NavKey

// Main tabs
@Serializable data object Home : NavKey
@Serializable data object Members : NavKey
@Serializable data object More : NavKey

// Member flows
@Serializable data object AddMember : NavKey
@Serializable data class EditMember(val memberId: String) : NavKey
@Serializable data class MemberDetails(val memberId: String) : NavKey
@Serializable data class MemberBill(val memberId: String) : NavKey
@Serializable data class MemberMeasurements(val memberId: String) : NavKey
@Serializable data class AddMeasurement(val memberId: String) : NavKey
@Serializable data class MemberWorkout(val memberId: String) : NavKey
@Serializable data class MemberDiet(val memberId: String) : NavKey
@Serializable data class MemberPackages(val memberId: String) : NavKey
@Serializable data class MemberServices(val memberId: String) : NavKey
@Serializable data class AddMemberPackage(val memberId: String) : NavKey
@Serializable data class AddMemberService(val memberId: String) : NavKey
@Serializable data class RenewPackage(val memberId: String) : NavKey

// Package/Service
@Serializable data object PackageList : NavKey
@Serializable data object AddPackage : NavKey
@Serializable data class EditPackage(val packageId: String) : NavKey
@Serializable data object ServiceList : NavKey
@Serializable data object AddService : NavKey
@Serializable data class EditService(val serviceId: String) : NavKey

// Trainers
@Serializable data object TrainerList : NavKey
@Serializable data object AddTrainer : NavKey
@Serializable data class EditTrainer(val trainerId: String) : NavKey
@Serializable data class TrainerDetails(val trainerId: String) : NavKey

// Batches
@Serializable data object BatchList : NavKey
@Serializable data object AddBatch : NavKey
@Serializable data class EditBatch(val batchId: String) : NavKey

// Attendance
@Serializable data object Attendance : NavKey

// Inquiries
@Serializable data object InquiryList : NavKey
@Serializable data object AddInquiry : NavKey

// Workout/Diet
@Serializable data object WorkoutPlanList : NavKey
@Serializable data object DietPlanList : NavKey
@Serializable data object ExerciseList : NavKey
@Serializable data object MealList : NavKey

// Expenses
@Serializable data object ExpenseDashboard : NavKey
@Serializable data object ExpenseList : NavKey
@Serializable data object AddExpense : NavKey
@Serializable data class EditExpense(val expenseId: String) : NavKey

// Settings & Profile
@Serializable data object Settings : NavKey
@Serializable data object EditGymOwner : NavKey
@Serializable data object GymInsights : NavKey
@Serializable data object OrderHistory : NavKey
@Serializable data object Users : NavKey
