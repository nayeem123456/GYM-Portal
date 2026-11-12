package com.mygym.app.ui.members

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.data.model.Member

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemberListScreen(
    onAddMember: () -> Unit,
    onMemberClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Active", "Expired", "Due")

    // Mock initial demo members list if repository is loading
    val sampleMembers = remember {
        listOf(
            Member(memberId = "1", name = "Alex Johnson", phone = "+1 555-0199", packageName = "Annual Gold", doj = "2026-01-15", edate = "2027-01-15", damount = "0", pamount = "500"),
            Member(memberId = "2", name = "Sarah Connor", phone = "+1 555-0142", packageName = "Monthly Pro", doj = "2026-10-01", edate = "2026-11-01", damount = "50", pamount = "50"),
            Member(memberId = "3", name = "Mike Tyson", phone = "+1 555-0188", packageName = "Quarterly Boxing", doj = "2026-08-15", edate = "2026-11-15", damount = "0", pamount = "300"),
            Member(memberId = "4", name = "Emma Watson", phone = "+1 555-0123", packageName = "Annual Gold", doj = "2026-02-10", edate = "2027-02-10", damount = "0", pamount = "500"),
            Member(memberId = "5", name = "David Beckham", phone = "+1 555-0177", packageName = "Monthly Standard", doj = "2026-09-05", edate = "2026-10-05", damount = "0", pamount = "60")
        )
    }

    val filteredMembers = sampleMembers.filter {
        (it.name.contains(searchQuery, ignoreCase = true) || it.phone.contains(searchQuery)) &&
        when (selectedFilter) {
            "Active" -> it.edate >= "2026-11-12"
            "Expired" -> it.edate < "2026-11-12"
            "Due" -> it.damount.toDoubleOrNull()?.let { d -> d > 0 } ?: false
            else -> true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Members (${filteredMembers.size})", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onAddMember) {
                        Icon(Icons.Default.PersonAdd, contentDescription = "Add Member")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddMember,
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Member", tint = MaterialTheme.colorScheme.onPrimary)
            }
        }
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search by name or phone...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                filters.forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Member list
            if (filteredMembers.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No members found.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filteredMembers, key = { it.memberId }) { member ->
                        MemberCard(member = member, onClick = { onMemberClick(member.memberId) })
                    }
                }
            }
        }
    }
}

@Composable
fun MemberCard(
    member: Member,
    onClick: () -> Unit
) {
    val isExpired = member.edate < "2026-11-12"
    val isDue = (member.damount.toDoubleOrNull() ?: 0.0) > 0.0

    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier
                .padding(14.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape),
                color = MaterialTheme.colorScheme.primaryContainer
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = member.name.take(1).uppercase(),
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = member.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = member.phone,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = member.packageName.ifEmpty { "No Package" },
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )
                    Text("•", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = "Exp: ${member.edate.ifEmpty { "N/A" }}",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (isExpired) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (isDue) {
                Surface(
                    color = MaterialTheme.colorScheme.errorContainer,
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        text = "Due $${member.damount}",
                        color = MaterialTheme.colorScheme.onErrorContainer,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}

