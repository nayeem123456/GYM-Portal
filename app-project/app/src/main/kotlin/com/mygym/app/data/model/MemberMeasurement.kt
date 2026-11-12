package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MemberMeasurement(
    val date: String = "",
    val weight: String = "",
    val height: String = "",
    val chest: String = "",
    val biceps: String = "",
    val waist: String = "",
    val thighs: String = ""
)
