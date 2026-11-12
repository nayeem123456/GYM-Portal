package com.mygym.app.ui.batches

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.Batch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BatchListScreen(
    onAddBatch: () -> Unit,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val batches = remember {
        listOf(
            Batch("1", "Early Bird Morning", "06:00 AM", "07:30 AM", "owner1"),
            Batch("2", "Mid Morning General", "08:00 AM", "09:30 AM", "owner1"),
            Batch("3", "Ladies Exclusive Batch", "11:00 AM", "12:30 PM", "owner1"),
            Batch("4", "Evening Rush Power", "05:30 PM", "07:00 PM", "owner1"),
            Batch("5", "Late Night Pump", "08:00 PM", "09:30 PM", "owner1")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Batches & Timings") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddBatch) {
                Icon(Icons.Default.Add, contentDescription = "Add Batch")
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
            items(batches, key = { it.batchId }) { batch ->
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Schedule,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(batch.batchName, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(
                                "${batch.batchInTime} - ${batch.batchOutTime}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }
        }
    }
}

