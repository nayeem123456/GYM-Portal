package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Inquiry(
    val id: String = "",
    val name: String = "",
    val phoneNo: String = "",
    val countryCode: String = "",
    val email: String = "",
    val comment: String = "",
    val inquiryDate: String = ""
)
