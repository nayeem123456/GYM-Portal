package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Reminder(
    val title: String = "",
    val description: String = "",
    val startDate: String = "",
    val startTime: String = "",
    val endDate: String = "",
    val endTime: String = "",
    val startYear: Int? = null,
    val startMonth: Int? = null,
    val startDay: Int? = null,
    val startHour: Int? = null,
    val startMin: Int? = null,
    val endYear: Int? = null,
    val endMonth: Int? = null,
    val endDay: Int? = null,
    val endHour: Int? = null,
    val endMin: Int? = null,
    val eventId: Long? = null
)
