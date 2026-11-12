package com.mygym.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_packages")
data class PackageEntity(
    @PrimaryKey val packageId: String,
    val packageName: String = "",
    val amount: String = "",
    val duration: String = "",
    val gymOwnerId: String = ""
)
