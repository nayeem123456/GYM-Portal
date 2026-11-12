package com.mygym.app.ui.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class QuickAction(
    val title: String,
    val icon: ImageVector,
    val iconTint: Color,
    val onClick: () -> Unit
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToMembers: () -> Unit,
    onNavigateToPackages: () -> Unit,
    onNavigateToTrainers: () -> Unit,
    onNavigateToAttendance: () -> Unit,
    onNavigateToBatches: () -> Unit,
    onNavigateToInquiries: () -> Unit,
    onNavigateToExpenses: () -> Unit,
    onNavigateToInsights: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val quickActions = listOf(
        QuickAction("Members", Icons.Default.People, Color(0xFF1E88E5), onNavigateToMembers),
        QuickAction("Attendance", Icons.Default.QrCodeScanner, Color(0xFF43A047), onNavigateToAttendance),
        QuickAction("Packages", Icons.Default.CardMembership, Color(0xFFFB8C00), onNavigateToPackages),
        QuickAction("Trainers", Icons.Default.SportsHandball, Color(0xFF8E24AA), onNavigateToTrainers),
        QuickAction("Batches", Icons.Default.Schedule, Color(0xFF00ACC1), onNavigateToBatches),
        QuickAction("Inquiries", Icons.Default.ContactSupport, Color(0xFF3949AB), onNavigateToInquiries),
        QuickAction("Expenses", Icons.Default.AccountBalanceWallet, Color(0xFFE53935), onNavigateToExpenses),
        QuickAction("Insights", Icons.Default.Analytics, Color(0xFF00897B), onNavigateToInsights),
        QuickAction("Settings", Icons.Default.Settings, Color(0xFF546E7A), onNavigateToSettings)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("MyGym Dashboard", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Text("Welcome Back, Owner!", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            )
        }
    ) { padding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Metrics Banner
            item(span = { GridItemSpan(3) }) {
                Column {
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        MetricCard(
                            title = "Active Members",
                            value = "142",
                            icon = Icons.Default.CheckCircle,
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            modifier = Modifier.weight(1f)
                        )
                        MetricCard(
                            title = "Expiring Soon",
                            value = "8",
                            icon = Icons.Default.Warning,
                            containerColor = MaterialTheme.colorScheme.errorContainer,
                            contentColor = MaterialTheme.colorScheme.onErrorContainer,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        MetricCard(
                            title = "Today Checked-In",
                            value = "36",
                            icon = Icons.Default.FitnessCenter,
                            containerColor = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
                            modifier = Modifier.weight(1f)
                        )
                        MetricCard(
                            title = "New Inquiries",
                            value = "5",
                            icon = Icons.Default.PersonAdd,
                            containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                            contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                    Text(
                        text = "Quick Actions",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                }
            }

            // Quick Actions 3-column grid
            items(quickActions) { action ->
                ElevatedCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clickable { action.onClick() },
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = action.icon,
                            contentDescription = action.title,
                            tint = action.iconTint,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = action.title,
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.Medium,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            item(span = { GridItemSpan(3) }) {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    icon: ImageVector,
    containerColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = containerColor)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, fontSize = 12.sp, color = contentColor.copy(alpha = 0.8f))
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = contentColor)
            }
            Icon(imageVector = icon, contentDescription = null, tint = contentColor.copy(alpha = 0.7f), modifier = Modifier.size(28.dp))
        }
    }
}

