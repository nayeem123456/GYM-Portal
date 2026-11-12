package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.local.MemberDao
import com.mygym.app.data.local.entity.toDomain
import com.mygym.app.data.local.entity.toEntity
import com.mygym.app.data.model.Member
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await

class MemberRepository(
    private val firestore: FirebaseFirestore,
    private val memberDao: MemberDao
) {
    private fun membersCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("members")

    fun getMembers(gymOwnerId: String): Flow<List<Member>> = callbackFlow {
        val registration = membersCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val members = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Member::class.java)?.copy(memberId = doc.id)
                } ?: emptyList()
                trySend(members)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addMember(gymOwnerId: String, member: Member): Result<Unit> = runCatching {
        val docId = member.memberId.ifEmpty { membersCollection(gymOwnerId).document().id }
        val memberToSave = member.copy(memberId = docId, gymOwnerId = gymOwnerId)
        membersCollection(gymOwnerId).document(docId).set(memberToSave).await()
        memberDao.insertMember(memberToSave.toEntity())
    }

    suspend fun updateMember(gymOwnerId: String, member: Member): Result<Unit> = runCatching {
        membersCollection(gymOwnerId).document(member.memberId).set(member).await()
        memberDao.insertMember(member.toEntity())
    }

    suspend fun deleteMember(gymOwnerId: String, memberId: String): Result<Unit> = runCatching {
        membersCollection(gymOwnerId).document(memberId).delete().await()
        memberDao.deleteMemberById(memberId)
    }

    fun getMemberById(gymOwnerId: String, memberId: String): Flow<Member?> = flow {
        val doc = membersCollection(gymOwnerId).document(memberId).get().await()
        val member = doc.toObject(Member::class.java)?.copy(memberId = doc.id)
        if (member != null) {
            emit(member)
        } else {
            val local = memberDao.getMemberById(memberId)?.toDomain()
            emit(local)
        }
    }

    fun searchMembers(gymOwnerId: String, query: String): Flow<List<Member>> = callbackFlow {
        val registration = membersCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val members = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Member::class.java)?.copy(memberId = doc.id)
                }?.filter { member ->
                    member.name.contains(query, ignoreCase = true) ||
                        member.phone.contains(query, ignoreCase = true) ||
                        member.email.contains(query, ignoreCase = true)
                } ?: emptyList()
                trySend(members)
            }
        awaitClose { registration.remove() }
    }
}
