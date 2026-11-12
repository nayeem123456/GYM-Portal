package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.Trainer
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class TrainerRepository(
    private val firestore: FirebaseFirestore
) {
    private fun trainersCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("trainers")

    fun getTrainers(gymOwnerId: String): Flow<List<Trainer>> = callbackFlow {
        val registration = trainersCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val trainers = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Trainer::class.java)?.copy(trainerId = doc.id)
                } ?: emptyList()
                trySend(trainers)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addTrainer(gymOwnerId: String, trainer: Trainer): Result<Unit> = runCatching {
        trainersCollection(gymOwnerId).document(trainer.trainerId).set(trainer).await()
    }

    suspend fun updateTrainer(gymOwnerId: String, trainer: Trainer): Result<Unit> = runCatching {
        trainersCollection(gymOwnerId).document(trainer.trainerId).set(trainer).await()
    }

    suspend fun deleteTrainer(gymOwnerId: String, trainerId: String): Result<Unit> = runCatching {
        trainersCollection(gymOwnerId).document(trainerId).delete().await()
    }
}
