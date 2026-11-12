package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class AttendanceRecord(
    val memberId: String = "",
    val name: String = "",
    val imageUrl: String = "",
    val checkInTime: String = "",
    val checkOutTime: String = "",
    val isCheckIn: Boolean = false,
    val isCheckOut: Boolean = false
)
