package com.mygym.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.mygym.app.data.local.entity.MemberEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MemberDao {

    @Query("SELECT * FROM cached_members WHERE gymOwnerId = :gymOwnerId ORDER BY name ASC")
    fun getMembers(gymOwnerId: String): Flow<List<MemberEntity>>

    @Query("SELECT * FROM cached_members WHERE memberId = :memberId")
    suspend fun getMemberById(memberId: String): MemberEntity?

    @Query("SELECT * FROM cached_members WHERE gymOwnerId = :gymOwnerId AND name LIKE '%' || :query || '%'")
    fun searchMembers(gymOwnerId: String, query: String): Flow<List<MemberEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMembers(members: List<MemberEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMember(member: MemberEntity)

    @Delete
    suspend fun deleteMember(member: MemberEntity)

    @Query("DELETE FROM cached_members WHERE memberId = :memberId")
    suspend fun deleteMemberById(memberId: String)

    @Query("DELETE FROM cached_members WHERE gymOwnerId = :gymOwnerId")
    suspend fun deleteAllMembers(gymOwnerId: String)

    @Query("SELECT COUNT(*) FROM cached_members WHERE gymOwnerId = :gymOwnerId")
    fun getMemberCount(gymOwnerId: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM cached_members WHERE gymOwnerId = :gymOwnerId AND isBlocked = 0 AND edate >= :today")
    fun getActiveMemberCount(gymOwnerId: String, today: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM cached_members WHERE gymOwnerId = :gymOwnerId AND edate < :today AND isBlocked = 0")
    fun getExpiredMemberCount(gymOwnerId: String, today: String): Flow<Int>
}
