package com.mygym.app.ui.more

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MoreScreen(
    onNavigateToPackages: () -> Unit,
    onNavigateToServices: () -> Unit,
    onNavigateToTrainers: () -> Unit,
    onNavigateToBatches: () -> Unit,
    onNavigateToInquiries: () -> Unit,
    onNavigateToExpenses: () -> Unit,
    onNavigateToWorkoutPlans: () -> Unit,
    onNavigateToDietPlans: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToInsights: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("More Options", fontWeight = FontWeight.Bold) }
            )
        }
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
        ) {
            SectionHeader("MANAGEMENT")
            MoreMenuItem(Icons.Default.CardMembership, "Membership Packages", "Manage gym plans & pricing", onNavigateToPackages)
            MoreMenuItem(Icons.Default.RoomService, "Additional Services", "Locker, Steam bath, Personal Training", onNavigateToServices)
            MoreMenuItem(Icons.Default.SportsHandball, "Trainers & Staff", "Manage gym trainers and permissions", onNavigateToTrainers)
            MoreMenuItem(Icons.Default.Schedule, "Batches & Timings", "Morning & Evening batch schedules", onNavigateToBatches)
            MoreMenuItem(Icons.Default.ContactSupport, "Inquiries / Leads", "Prospective client follow-ups", onNavigateToInquiries)

            SectionHeader("FITNESS & HEALTH")
            MoreMenuItem(Icons.Default.FitnessCenter, "Workout Plans", "Custom exercise routines & schedules", onNavigateToWorkoutPlans)
            MoreMenuItem(Icons.Default.Restaurant, "Diet Plans", "Nutrition & meal plans for members", onNavigateToDietPlans)

            SectionHeader("FINANCE & INSIGHTS")
            MoreMenuItem(Icons.Default.AccountBalanceWallet, "Expense Manager", "Track gym operational expenses", onNavigateToExpenses)
            MoreMenuItem(Icons.Default.Analytics, "Gym Insights & Analytics", "Revenue, attendance & member trends", onNavigateToInsights)

            SectionHeader("SYSTEM")
            MoreMenuItem(Icons.Default.Settings, "Gym Settings", "Preferences, ID Card logo, WhatsApp", onNavigateToSettings)
            MoreMenuItem(Icons.Default.ExitToApp, "Log Out", "Sign out of your gym account", onLogout, isDestructive = true)

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun SectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 16.dp, top = 20.dp, bottom = 6.dp)
    )
}

@Composable
fun MoreMenuItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    isDestructive: Boolean = false
) {
    ListItem(
        headlineContent = {
            Text(
                text = title,
                fontWeight = FontWeight.Medium,
                color = if (isDestructive) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface
            )
        },
        supportingContent = {
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        leadingContent = {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isDestructive) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
            )
        },
        trailingContent = {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                contentDescription = null,
                modifier = Modifier.size(14.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
            )
        },
        modifier = Modifier.clickable { onClick() }
    )
    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
}

