package com.mygym.app.ui.trainers

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.SportsHandball
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.Trainer

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrainerListScreen(
    onAddTrainer: () -> Unit,
    onTrainerClick: (String) -> Unit,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val trainers = remember {
        listOf(
            Trainer("1", "Coach Mike", "+1 555-0811", "+1", "mike@mygym.com", "1990-05-12", "2024-01-01", "Fitness Coach", "", "2500", "owner1", null),
            Trainer("2", "Coach Sarah", "+1 555-0822", "+1", "sarah@mygym.com", "1993-08-20", "2024-03-15", "Yoga & Pilates", "", "2200", "owner1", null),
            Trainer("3", "Coach John", "+1 555-0833", "+1", "john@mygym.com", "1988-11-04", "2023-11-01", "Bodybuilding Specialist", "", "2800", "owner1", null)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gym Trainers") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddTrainer) {
                Icon(Icons.Default.Add, contentDescription = "Add Trainer")
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
            items(trainers, key = { it.trainerId }) { trainer ->
                ElevatedCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onTrainerClick(trainer.trainerId) }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape),
                            color = MaterialTheme.colorScheme.secondaryContainer
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    trainer.name.take(1),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 20.sp,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(trainer.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(trainer.address.ifEmpty { "Certified Trainer" }, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(trainer.phone, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }
            }
        }
    }
}

