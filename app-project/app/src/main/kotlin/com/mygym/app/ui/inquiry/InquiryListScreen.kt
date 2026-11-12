package com.mygym.app.ui.inquiry

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.Inquiry

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InquiryListScreen(
    onAddInquiry: () -> Unit,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val inquiries = remember {
        listOf(
            Inquiry("1", "Robert Downey", "+1 555-0911", "+1", "robert@email.com", "Interested in Annual Gold plan with personal trainer.", "2026-11-10"),
            Inquiry("2", "Chris Evans", "+1 555-0922", "+1", "chris@email.com", "Asked about boxing batch timing in evenings.", "2026-11-11"),
            Inquiry("3", "Scarlett J", "+1 555-0933", "+1", "scarlett@email.com", "Looking for yoga & morning batch discounts.", "2026-11-12")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Client Inquiries / Leads") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddInquiry) {
                Icon(Icons.Default.Add, contentDescription = "Add Inquiry")
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
            items(inquiries, key = { it.id }) { item ->
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(item.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(item.inquiryDate, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(item.phoneNo, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                        }

                        if (item.comment.isNotEmpty()) {
                            Text(
                                text = item.comment,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

