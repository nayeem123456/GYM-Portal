package com.mygym.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.mygym.app.data.local.entity.MemberPackageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MemberPackageDao {

    @Query("SELECT * FROM cached_member_package_plans WHERE memberId = :memberId")
    fun getMemberPackages(memberId: String): Flow<List<MemberPackageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMemberPackages(plans: List<MemberPackageEntity>)
}
