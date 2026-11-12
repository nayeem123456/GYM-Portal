package com.mygym.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MemberServicePlan(
    val memberServiceId: String = "",
    val memberId: String = "",
    val serviceId: String = "",
    val serviceName: String = "",
    val gymOwnerId: String = "",
    val pamount: String = "",
    val tamount: String = "",
    val pdate: String = ""
)
