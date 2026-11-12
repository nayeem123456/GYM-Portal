package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class GymService(
    val serviceId: String = "",
    val serviceName: String = "",
    val amount: String = ""
)
