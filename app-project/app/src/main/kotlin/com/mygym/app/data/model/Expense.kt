package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Expense(
    val id: String = "",
    val amount: Double = 0.0,
    val categoryId: String = "",
    val categoryName: String = "",
    val dateEpochMillis: Long = 0L,
    val createdAtEpochMillis: Long = 0L,
    val updatedAtEpochMillis: Long = 0L,
    val description: String = "",
    val paymentMethod: String = "",
    val isRecurring: Boolean = false,
    val recurrenceEnabled: Boolean = false,
    val recurrenceFrequency: String = "",
    val nextOccurrenceDateEpochMillis: Long? = null
)
