package com.mygym.app

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.MoreHoriz
import androidx.compose.material.icons.outlined.People
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation3.runtime.NavKey
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.mygym.app.ui.auth.ForgotPasswordScreen
import com.mygym.app.ui.auth.LoginScreen
import com.mygym.app.ui.auth.SignupScreen
import com.mygym.app.ui.home.HomeScreen
import com.mygym.app.ui.members.AddMemberScreen
import com.mygym.app.ui.members.EditMemberScreen
import com.mygym.app.ui.members.MemberDetailsScreen
import com.mygym.app.ui.members.MemberListScreen
import com.mygym.app.ui.members.RenewPackageScreen
import com.mygym.app.ui.more.MoreScreen
import com.mygym.app.ui.packages.AddPackageScreen
import com.mygym.app.ui.packages.PackageListScreen
import com.mygym.app.ui.services.AddServiceScreen
import com.mygym.app.ui.services.ServiceListScreen
import com.mygym.app.ui.trainers.AddTrainerScreen
import com.mygym.app.ui.trainers.TrainerListScreen
import com.mygym.app.ui.trainers.TrainerDetailsScreen
import com.mygym.app.ui.batches.AddBatchScreen
import com.mygym.app.ui.batches.BatchListScreen
import com.mygym.app.ui.attendance.AttendanceScreen
import com.mygym.app.ui.inquiry.AddInquiryScreen
import com.mygym.app.ui.inquiry.InquiryListScreen
import com.mygym.app.ui.expense.AddExpenseScreen
import com.mygym.app.ui.expense.ExpenseDashboardScreen
import com.mygym.app.ui.expense.ExpenseListScreen
import com.mygym.app.ui.settings.SettingsScreen
import com.mygym.app.ui.insights.GymInsightsScreen
import com.mygym.app.ui.billing.MemberBillScreen
import com.mygym.app.ui.measurement.MemberMeasurementScreen
import com.mygym.app.ui.measurement.AddMeasurementScreen
import com.mygym.app.ui.workout.WorkoutPlanListScreen
import com.mygym.app.ui.diet.DietPlanListScreen

data class BottomNavItem(
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val key: NavKey
)

val bottomNavItems = listOf(
    BottomNavItem("Home", Icons.Filled.Home, Icons.Outlined.Home, Home),
    BottomNavItem("Members", Icons.Filled.People, Icons.Outlined.People, Members),
    BottomNavItem("More", Icons.Filled.MoreHoriz, Icons.Outlined.MoreHoriz, More),
)

@Composable
fun MainNavigation() {
    val backStack = rememberNavBackStack(Login)
    var selectedTab by rememberSaveable { mutableStateOf(0) }

    val currentKey = backStack.lastOrNull()
    val showBottomNav = currentKey is Home || currentKey is Members || currentKey is More

    Scaffold(
        bottomBar = {
            AnimatedVisibility(
                visible = showBottomNav,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it })
            ) {
                NavigationBar {
                    bottomNavItems.forEachIndexed { index, item ->
                        NavigationBarItem(
                            selected = selectedTab == index,
                            onClick = {
                                selectedTab = index
                                while (backStack.size > 1) backStack.removeLastOrNull()
                                backStack.removeLastOrNull()
                                backStack.add(item.key)
                            },
                            icon = {
                                Icon(
                                    if (selectedTab == index) item.selectedIcon else item.unselectedIcon,
                                    contentDescription = item.label
                                )
                            },
                            label = { Text(item.label) }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavDisplay(
            backStack = backStack,
            onBack = { backStack.removeLastOrNull() },
            modifier = Modifier.padding(innerPadding),
            entryProvider = entryProvider {
                // Auth
                entry<Login> {
                    LoginScreen(
                        onLoginSuccess = {
                            backStack.clear()
                            backStack.add(Home)
                            selectedTab = 0
                        },
                        onNavigateToSignup = { backStack.add(Signup) },
                        onNavigateToForgotPassword = { backStack.add(ForgotPassword) }
                    )
                }
                entry<Signup> {
                    SignupScreen(
                        onSignupSuccess = {
                            backStack.clear()
                            backStack.add(Home)
                            selectedTab = 0
                        },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<ForgotPassword> {
                    ForgotPasswordScreen(
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }

                // Main Tabs
                entry<Home> {
                    HomeScreen(
                        onNavigateToMembers = { backStack.add(Members); selectedTab = 1 },
                        onNavigateToPackages = { backStack.add(PackageList) },
                        onNavigateToTrainers = { backStack.add(TrainerList) },
                        onNavigateToAttendance = { backStack.add(Attendance) },
                        onNavigateToBatches = { backStack.add(BatchList) },
                        onNavigateToInquiries = { backStack.add(InquiryList) },
                        onNavigateToExpenses = { backStack.add(ExpenseDashboard) },
                        onNavigateToInsights = { backStack.add(GymInsights) },
                        onNavigateToSettings = { backStack.add(Settings) }
                    )
                }
                entry<Members> {
                    MemberListScreen(
                        onAddMember = { backStack.add(AddMember) },
                        onMemberClick = { memberId -> backStack.add(MemberDetails(memberId)) }
                    )
                }
                entry<More> {
                    MoreScreen(
                        onNavigateToPackages = { backStack.add(PackageList) },
                        onNavigateToServices = { backStack.add(ServiceList) },
                        onNavigateToTrainers = { backStack.add(TrainerList) },
                        onNavigateToBatches = { backStack.add(BatchList) },
                        onNavigateToInquiries = { backStack.add(InquiryList) },
                        onNavigateToExpenses = { backStack.add(ExpenseDashboard) },
                        onNavigateToWorkoutPlans = { backStack.add(WorkoutPlanList) },
                        onNavigateToDietPlans = { backStack.add(DietPlanList) },
                        onNavigateToSettings = { backStack.add(Settings) },
                        onNavigateToInsights = { backStack.add(GymInsights) },
                        onLogout = {
                            backStack.clear()
                            backStack.add(Login)
                            selectedTab = 0
                        }
                    )
                }

                // Member flows
                entry<AddMember> {
                    AddMemberScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }
                entry<MemberDetails> { key ->
                    MemberDetailsScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() },
                        onEditMember = { backStack.add(EditMember(key.memberId)) },
                        onViewBill = { backStack.add(MemberBill(key.memberId)) },
                        onViewMeasurements = { backStack.add(MemberMeasurements(key.memberId)) },
                        onViewPackages = { backStack.add(PackageList) },
                        onAddPackage = { backStack.add(AddPackage) },
                        onRenewPackage = { backStack.add(RenewPackage(key.memberId)) }
                    )
                }
                entry<EditMember> { key ->
                    EditMemberScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<MemberBill> { key ->
                    MemberBillScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<MemberMeasurements> { key ->
                    MemberMeasurementScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() },
                        onAddMeasurement = { backStack.add(AddMeasurement(key.memberId)) }
                    )
                }
                entry<AddMeasurement> { key ->
                    AddMeasurementScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<RenewPackage> { key ->
                    RenewPackageScreen(
                        memberId = key.memberId,
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }

                // Packages
                entry<PackageList> {
                    PackageListScreen(
                        onAddPackage = { backStack.add(AddPackage) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddPackage> {
                    AddPackageScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Services
                entry<ServiceList> {
                    ServiceListScreen(
                        onAddService = { backStack.add(AddService) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddService> {
                    AddServiceScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Trainers
                entry<TrainerList> {
                    TrainerListScreen(
                        onAddTrainer = { backStack.add(AddTrainer) },
                        onTrainerClick = { trainerId -> backStack.add(TrainerDetails(trainerId)) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddTrainer> {
                    AddTrainerScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }
                entry<TrainerDetails> { key ->
                    TrainerDetailsScreen(
                        trainerId = key.trainerId,
                        onNavigateBack = { backStack.removeLastOrNull() },
                        onEditTrainer = { backStack.add(AddTrainer) }
                    )
                }

                // Batches
                entry<BatchList> {
                    BatchListScreen(
                        onAddBatch = { backStack.add(AddBatch) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddBatch> {
                    AddBatchScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Attendance
                entry<Attendance> {
                    AttendanceScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Inquiries
                entry<InquiryList> {
                    InquiryListScreen(
                        onAddInquiry = { backStack.add(AddInquiry) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddInquiry> {
                    AddInquiryScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Expenses
                entry<ExpenseDashboard> {
                    ExpenseDashboardScreen(
                        onNavigateToList = { backStack.add(ExpenseList) },
                        onAddExpense = { backStack.add(AddExpense) },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<ExpenseList> {
                    ExpenseListScreen(
                        onAddExpense = { backStack.add(AddExpense) },
                        onExpenseClick = { /* edit expense */ },
                        onNavigateBack = { backStack.removeLastOrNull() }
                    )
                }
                entry<AddExpense> {
                    AddExpenseScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Workout/Diet Plans
                entry<WorkoutPlanList> {
                    WorkoutPlanListScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }
                entry<DietPlanList> {
                    DietPlanListScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }

                // Settings & Insights
                entry<Settings> {
                    SettingsScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }
                entry<GymInsights> {
                    GymInsightsScreen(onNavigateBack = { backStack.removeLastOrNull() })
                }
            },
        )
    }
}
