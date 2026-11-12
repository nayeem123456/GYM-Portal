package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseCategory(
    val id: String = "",
    val name: String = "",
    val isPredefined: Boolean = false,
    val createdAtEpochMillis: Long = 0L
)
