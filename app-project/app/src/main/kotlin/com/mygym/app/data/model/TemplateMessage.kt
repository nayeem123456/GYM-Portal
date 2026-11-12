package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class TemplateMessage(
    val id: String = "",
    val title: String = "",
    val message: String = "",
    val isChecked: Boolean = false
)
