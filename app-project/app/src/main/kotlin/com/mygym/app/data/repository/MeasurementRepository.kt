package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.MemberMeasurement
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class MeasurementRepository(
    private val firestore: FirebaseFirestore
) {
    private fun measurementsCollection(gymOwnerId: String, memberId: String) =
        firestore.collection("gymowners")
            .document(gymOwnerId)
            .collection("members")
            .document(memberId)
            .collection("measurements")

    fun getMeasurements(gymOwnerId: String, memberId: String): Flow<List<MemberMeasurement>> = callbackFlow {
        val registration = measurementsCollection(gymOwnerId, memberId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val measurements = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(MemberMeasurement::class.java)
                } ?: emptyList()
                trySend(measurements)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addMeasurement(gymOwnerId: String, memberId: String, measurement: MemberMeasurement): Result<Unit> = runCatching {
        measurementsCollection(gymOwnerId, memberId).document(measurement.date).set(measurement).await()
    }
}
