package com.mygym.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_member_package_plans")
data class MemberPackageEntity(
    @PrimaryKey val memberPackageId: String,
    val memberId: String = "",
    val packageId: String = "",
    val packageName: String = "",
    val gymOwnerId: String = "",
    val pamount: String = "",
    val tamount: String = "",
    val damount: String = "",
    val discount: String = "",
    val discountType: String = "",
    val doj: String = "",
    val edate: String = "",
    val pdate: String = "",
    val paymentMode: String = "",
    val billNo: Int = 0,
    val admissionFee: Int = 0,
    val tax: Double = 0.0
)
