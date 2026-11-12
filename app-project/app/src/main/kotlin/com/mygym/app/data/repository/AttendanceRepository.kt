package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.AttendanceRecord
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class AttendanceRepository(
    private val firestore: FirebaseFirestore
) {
    private fun attendanceCollection(gymOwnerId: String, date: String) =
        firestore.collection("gymowners")
            .document(gymOwnerId)
            .collection("attendance")
            .document(date)
            .collection("records")

    fun getAttendance(gymOwnerId: String, date: String): Flow<List<AttendanceRecord>> = callbackFlow {
        val registration = attendanceCollection(gymOwnerId, date)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val records = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(AttendanceRecord::class.java)?.copy(memberId = doc.id)
                } ?: emptyList()
                trySend(records)
            }
        awaitClose { registration.remove() }
    }

    suspend fun markAttendance(gymOwnerId: String, date: String, record: AttendanceRecord): Result<Unit> = runCatching {
        attendanceCollection(gymOwnerId, date).document(record.memberId).set(record).await()
    }
}
