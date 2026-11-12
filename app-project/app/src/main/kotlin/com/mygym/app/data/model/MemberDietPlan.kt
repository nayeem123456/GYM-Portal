package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MemberDietPlan(
    val dietPlanName: String = "",
    val mealPlanMap: Map<String, List<String>> = emptyMap()
)
