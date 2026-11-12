package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MemberWorkoutPlan(
    val workoutPlanName: String = "",
    val exercisePlanMap: Map<String, List<Exercise>> = emptyMap()
)
