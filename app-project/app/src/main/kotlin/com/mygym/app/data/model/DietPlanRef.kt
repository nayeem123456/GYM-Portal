package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class DietPlanRef(
    val dietPlanId: String = "",
    val dietPlanName: String = ""
)
