package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class AttendanceDay(
    val dateString: String = "",
    val attendanceList: List<AttendanceRecord> = emptyList()
)
