package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class AppLanguage(
    val name: String = "",
    val languageCode: String = ""
)
