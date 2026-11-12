package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class WorkoutPlan(
    val workoutPlanId: String = "",
    val workoutPlanName: String = ""
)
