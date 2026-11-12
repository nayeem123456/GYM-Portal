package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Exercise(
    val id: String = "",
    val name: String = "",
    val workOutPlanId: String = "",
    val exercises: List<String> = emptyList()
)
