package com.mygym.app.ui.diet

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.DietPlanRef

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DietPlanListScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val diets = remember {
        listOf(
            DietPlanRef("1", "High Protein Muscle Gain (3000 kcal)"),
            DietPlanRef("2", "Keto Lean Cut (1800 kcal)"),
            DietPlanRef("3", "Balanced Vegetarian Maintenance"),
            DietPlanRef("4", "Low Carb Fat Loss Routine")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nutrition & Diet Plans") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { /* Add diet plan */ }) {
                Icon(Icons.Default.Add, contentDescription = "Add Diet Plan")
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
            items(diets, key = { it.dietPlanId }) { diet ->
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Restaurant,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            diet.dietPlanName,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

