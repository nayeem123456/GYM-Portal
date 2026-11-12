package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.Batch
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class BatchRepository(
    private val firestore: FirebaseFirestore
) {
    private fun batchesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("batches")

    fun getBatches(gymOwnerId: String): Flow<List<Batch>> = callbackFlow {
        val registration = batchesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val batches = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Batch::class.java)?.copy(batchId = doc.id)
                } ?: emptyList()
                trySend(batches)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addBatch(gymOwnerId: String, batch: Batch): Result<Unit> = runCatching {
        batchesCollection(gymOwnerId).document(batch.batchId).set(batch).await()
    }

    suspend fun updateBatch(gymOwnerId: String, batch: Batch): Result<Unit> = runCatching {
        batchesCollection(gymOwnerId).document(batch.batchId).set(batch).await()
    }

    suspend fun deleteBatch(gymOwnerId: String, batchId: String): Result<Unit> = runCatching {
        batchesCollection(gymOwnerId).document(batchId).delete().await()
    }
}
