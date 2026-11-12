package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class GymSettings(
    val addLogoOnBill: Boolean = false,
    val addLogoOnIdCard: Boolean = false,
    val allowDuplicateMobileNumber: Boolean = false,
    val isOtpEnabled: Boolean = false,
    val useWhatsAppBusiness: Boolean = false
)
