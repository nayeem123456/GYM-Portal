package com.mygym.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.mygym.app.data.local.entity.PackageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PackageDao {

    @Query("SELECT * FROM cached_packages WHERE gymOwnerId = :gymOwnerId")
    fun getPackages(gymOwnerId: String): Flow<List<PackageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPackages(packages: List<PackageEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPackage(pkg: PackageEntity)

    @Delete
    suspend fun deletePackage(pkg: PackageEntity)

    @Query("DELETE FROM cached_packages WHERE packageId = :packageId")
    suspend fun deletePackageById(packageId: String)
}
