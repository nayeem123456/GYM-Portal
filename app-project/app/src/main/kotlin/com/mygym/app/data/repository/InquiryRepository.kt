package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.Inquiry
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class InquiryRepository(
    private val firestore: FirebaseFirestore
) {
    private fun inquiriesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("inquiries")

    fun getInquiries(gymOwnerId: String): Flow<List<Inquiry>> = callbackFlow {
        val registration = inquiriesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val inquiries = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Inquiry::class.java)?.copy(id = doc.id)
                } ?: emptyList()
                trySend(inquiries)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addInquiry(gymOwnerId: String, inquiry: Inquiry): Result<Unit> = runCatching {
        val docId = inquiry.id.ifEmpty { inquiriesCollection(gymOwnerId).document().id }
        inquiriesCollection(gymOwnerId).document(docId).set(inquiry.copy(id = docId)).await()
    }

    suspend fun deleteInquiry(gymOwnerId: String, inquiryId: String): Result<Unit> = runCatching {
        inquiriesCollection(gymOwnerId).document(inquiryId).delete().await()
    }
}
