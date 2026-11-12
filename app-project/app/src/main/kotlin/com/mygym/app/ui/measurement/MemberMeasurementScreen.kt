package com.mygym.app.ui.measurement

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.MemberMeasurement

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemberMeasurementScreen(
    memberId: String,
    onNavigateBack: () -> Unit,
    onAddMeasurement: () -> Unit,
    modifier: Modifier = Modifier
) {
    val measurements = remember {
        listOf(
            MemberMeasurement("2026-11-01", "78 kg", "178 cm", "40 in", "15 in", "32 in", "22 in"),
            MemberMeasurement("2026-10-01", "81 kg", "178 cm", "39 in", "14.5 in", "34 in", "23 in"),
            MemberMeasurement("2026-09-01", "84 kg", "178 cm", "38 in", "14 in", "35 in", "23.5 in")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Body Measurements") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddMeasurement) {
                Icon(Icons.Default.Add, contentDescription = "Record Measurements")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(measurements) { m ->
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Date: ${m.date}", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text("Weight: ${m.weight}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        }
                        HorizontalDivider()
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            MeasureStat("Height", m.height)
                            MeasureStat("Chest", m.chest)
                            MeasureStat("Biceps", m.biceps)
                            MeasureStat("Waist", m.waist)
                            MeasureStat("Thighs", m.thighs)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MeasureStat(label: String, value: String) {
    Column {
        Text(label, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}

