package com.mygym.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.mygym.app.data.local.entity.MemberEntity
import com.mygym.app.data.local.entity.MemberPackageEntity
import com.mygym.app.data.local.entity.PackageEntity

@Database(
    entities = [
        MemberEntity::class,
        PackageEntity::class,
        MemberPackageEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class GymDatabase : RoomDatabase() {
    abstract fun memberDao(): MemberDao
    abstract fun packageDao(): PackageDao
    abstract fun memberPackageDao(): MemberPackageDao
}
