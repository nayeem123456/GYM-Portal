package com.mygym.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_members")
data class MemberEntity(
    @PrimaryKey val memberId: String,
    val name: String = "",
    val phone: String = "",
    val countryCode: String = "",
    val email: String = "",
    val gender: String = "",
    val dob: String = "",
    val doj: String = "",
    val edate: String = "",
    val address: String = "",
    val age: Int = 0,
    val photoUrl: String = "",
    val gymOwnerId: String = "",
    val packageId: String = "",
    val packageName: String = "",
    val trainerId: String = "",
    val trainerName: String = "",
    val batchId: String = "",
    val batchName: String = "",
    val paymentMode: String = "",
    val pamount: String = "",
    val tamount: String = "",
    val damount: String = "",
    val discount: String = "",
    val discountType: String = "",
    val tax: Double = 0.0,
    val isFrozen: Boolean = false,
    val isBlocked: Boolean = false,
    val regCode: String = "",
    val createdAt: Long = 0
)
