package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class TrainerFeatureAccess(
    val dashboards: Boolean = false,
    val addMembers: Boolean = false,
    val deleteMembers: Boolean = false,
    val batches: Boolean = false,
    val collections: Boolean = false,
    val trainers: Boolean = false
)
