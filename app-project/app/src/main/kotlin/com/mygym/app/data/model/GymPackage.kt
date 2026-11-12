package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class GymPackage(
    val packageId: String = "",
    val packageName: String = "",
    val amount: String = "",
    val duration: String = ""
)
