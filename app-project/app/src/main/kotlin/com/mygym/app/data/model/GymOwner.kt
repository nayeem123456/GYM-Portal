package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class GymOwner(
    val gymOwnerId: String = "",
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val countryCode: String = "",
    val gymName: String = "",
    val gymAddress: String = "",
    val gymCity: String = "",
    val gymCountry: String = "",
    val photoUrl: String = "",
    val subscriptionPlanName: String = "",
    val subscriptionPurchaseDate: String = "",
    val subscriptionPurchased: Boolean = false,
    val isAccountActive: Boolean = false,
    val enableStaffAccess: Boolean = false,
    val staffBranchAccessEnabled: Boolean = false,
    val templateFeatureEnabled: Boolean = false,
    val notificationTurnedOff: Boolean = false,
    val fcmToken: String = "",
    val parentAccountId: String = "",
    val lastRegCode: String = "",
    val note: String = "",
    val expiryDate: String = "",
    val createdAt: String = "",
    val gymSettings: GymSettings? = null
)
