package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Trainer(
    val trainerId: String = "",
    val name: String = "",
    val phone: String = "",
    val countryCode: String = "",
    val email: String = "",
    val dob: String = "",
    val doj: String = "",
    val address: String = "",
    val photoUrl: String = "",
    val salary: String = "",
    val gymOwnerId: String = "",
    val featureAccess: TrainerFeatureAccess? = null
)
