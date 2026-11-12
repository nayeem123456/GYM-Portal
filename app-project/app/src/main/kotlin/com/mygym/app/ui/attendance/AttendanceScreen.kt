package com.mygym.app.ui.attendance

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.AttendanceRecord

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AttendanceScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedDate by remember { mutableStateOf("2026-11-12 (Today)") }
    var searchQuery by remember { mutableStateOf("") }

    var records by remember {
        mutableStateOf(
            listOf(
                AttendanceRecord("1", "Alex Johnson", "", "06:15 AM", "07:30 AM", isCheckIn = true, isCheckOut = true),
                AttendanceRecord("2", "Sarah Connor", "", "06:30 AM", "", isCheckIn = true, isCheckOut = false),
                AttendanceRecord("3", "Mike Tyson", "", "07:00 AM", "08:15 AM", isCheckIn = true, isCheckOut = true),
                AttendanceRecord("4", "Emma Watson", "", "07:10 AM", "", isCheckIn = true, isCheckOut = false)
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Daily Attendance") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { /* Scan QR */ }) {
                        Icon(Icons.Default.QrCodeScanner, contentDescription = "Scan QR")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Header stats
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Checked-In", fontSize = 12.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        Text("${records.count { it.isCheckIn }}", fontWeight = FontWeight.Bold, fontSize = 24.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Checked-Out", fontSize = 12.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        Text("${records.count { it.isCheckOut }}", fontWeight = FontWeight.Bold, fontSize = 24.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Currently Active", fontSize = 12.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        Text("${records.count { it.isCheckIn && !it.isCheckOut }}", fontWeight = FontWeight.Bold, fontSize = 24.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                }
            }

            // Search
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search attendee...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp)
            )

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(records.filter { it.name.contains(searchQuery, ignoreCase = true) }, key = { it.memberId }) { item ->
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Text("In: ${item.checkInTime}", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                                    if (item.isCheckOut) {
                                        Text("Out: ${item.checkOutTime}", fontSize = 12.sp, color = MaterialTheme.colorScheme.secondary)
                                    }
                                }
                            }

                            if (!item.isCheckOut) {
                                Button(
                                    onClick = {
                                        records = records.map {
                                            if (it.memberId == item.memberId) it.copy(isCheckOut = true, checkOutTime = "08:30 AM") else it
                                        }
                                    },
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                ) {
                                    Text("Check Out", fontSize = 12.sp)
                                }
                            } else {
                                Text("Completed", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        }
    }
}

