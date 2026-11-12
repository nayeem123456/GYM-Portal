package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Batch(
    val batchId: String = "",
    val batchName: String = "",
    val batchInTime: String = "",
    val batchOutTime: String = "",
    val gymOwnerId: String = ""
)
