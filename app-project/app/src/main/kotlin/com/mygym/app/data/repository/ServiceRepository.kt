package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.GymService
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class ServiceRepository(
    private val firestore: FirebaseFirestore
) {
    private fun servicesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("services")

    fun getServices(gymOwnerId: String): Flow<List<GymService>> = callbackFlow {
        val registration = servicesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val services = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(GymService::class.java)?.copy(serviceId = doc.id)
                } ?: emptyList()
                trySend(services)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addService(gymOwnerId: String, service: GymService): Result<Unit> = runCatching {
        val docId = service.serviceId.ifEmpty { servicesCollection(gymOwnerId).document().id }
        servicesCollection(gymOwnerId).document(docId).set(service.copy(serviceId = docId)).await()
    }

    suspend fun deleteService(gymOwnerId: String, serviceId: String): Result<Unit> = runCatching {
        servicesCollection(gymOwnerId).document(serviceId).delete().await()
    }
}
