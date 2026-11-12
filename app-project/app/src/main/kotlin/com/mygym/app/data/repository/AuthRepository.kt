package com.mygym.app.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.GymOwner
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await

class AuthRepository(
    private val auth: FirebaseAuth,
    private val firestore: FirebaseFirestore
) {
    val currentUser: FirebaseUser? get() = auth.currentUser
    val isLoggedIn: Boolean get() = currentUser != null

    suspend fun login(email: String, password: String): Result<FirebaseUser> = runCatching {
        auth.signInWithEmailAndPassword(email, password).await().user!!
    }

    suspend fun signup(email: String, password: String): Result<FirebaseUser> = runCatching {
        auth.createUserWithEmailAndPassword(email, password).await().user!!
    }

    suspend fun resetPassword(email: String): Result<Unit> = runCatching {
        auth.sendPasswordResetEmail(email).await()
    }

    suspend fun saveGymOwner(owner: GymOwner): Result<Unit> = runCatching {
        firestore.collection("gymowners").document(owner.gymOwnerId).set(owner).await()
    }

    fun getGymOwner(ownerId: String): Flow<GymOwner?> = flow {
        val doc = firestore.collection("gymowners").document(ownerId).get().await()
        emit(doc.toObject(GymOwner::class.java))
    }

    fun logout() {
        auth.signOut()
    }
}
