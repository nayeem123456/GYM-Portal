package com.mygym.app.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mygym.app.ui.more.SectionHeader

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var addLogoOnBill by remember { mutableStateOf(true) }
    var addLogoOnIdCard by remember { mutableStateOf(true) }
    var allowDuplicateMobile by remember { mutableStateOf(false) }
    var useWhatsAppBusiness by remember { mutableStateOf(true) }
    var enableOtpLogin by remember { mutableStateOf(false) }
    var notificationsEnabled by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gym Settings") },
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
                .verticalScroll(rememberScrollState())
        ) {
            SectionHeader("INVOICES & ID CARDS")
            SettingSwitchRow("Add Gym Logo on Bill", "Show gym logo in exported receipts", addLogoOnBill) { addLogoOnBill = it }
            SettingSwitchRow("Add Logo on ID Card", "Include watermark logo on member cards", addLogoOnIdCard) { addLogoOnIdCard = it }

            SectionHeader("MEMBER RULES")
            SettingSwitchRow("Allow Duplicate Phone", "Permit family members to share mobile number", allowDuplicateMobile) { allowDuplicateMobile = it }
            SettingSwitchRow("WhatsApp Business Alerts", "Send payment reminders via WhatsApp", useWhatsAppBusiness) { useWhatsAppBusiness = it }

            SectionHeader("SECURITY & NOTIFICATIONS")
            SettingSwitchRow("OTP Authentication", "Verify member check-ins with SMS OTP", enableOtpLogin) { enableOtpLogin = it }
            SettingSwitchRow("Push Notifications", "Receive instant alerts on membership expiry", notificationsEnabled) { notificationsEnabled = it }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun SettingSwitchRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    ListItem(
        headlineContent = { Text(title, fontWeight = FontWeight.Medium) },
        supportingContent = { Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) },
        trailingContent = {
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    )
    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
}

