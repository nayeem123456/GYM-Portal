package com.mygym.app.ui.insights

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.ui.expense.CategoryRow
import com.mygym.app.ui.home.MetricCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GymInsightsScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gym Insights & Trends") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                MetricCard(
                    title = "Total Collections",
                    value = "$11,200",
                    icon = Icons.Default.TrendingUp,
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Pending Due",
                    value = "$850",
                    icon = Icons.Default.MoneyOff,
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.weight(1f)
                )
            }

            Text("Popular Packages Distribution", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    CategoryRow("Annual Gold VIP", "58 Members (41%)", 0.41f)
                    CategoryRow("Monthly Standard", "42 Members (30%)", 0.30f)
                    CategoryRow("Quarterly Pro", "28 Members (20%)", 0.20f)
                    CategoryRow("Half-Yearly Elite", "14 Members (9%)", 0.09f)
                }
            }

            Text("Attendance Peak Timings", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    CategoryRow("06:00 AM - 07:30 AM", "48 Check-ins", 0.85f)
                    CategoryRow("05:30 PM - 07:00 PM", "56 Check-ins", 1.0f)
                    CategoryRow("08:00 PM - 09:30 PM", "24 Check-ins", 0.42f)
                    CategoryRow("11:00 AM - 12:30 PM", "14 Check-ins", 0.25f)
                }
            }
        }
    }
}

