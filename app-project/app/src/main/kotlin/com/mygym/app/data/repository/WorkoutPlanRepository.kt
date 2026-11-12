package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.DietPlanRef
import com.mygym.app.data.model.WorkoutPlan
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class WorkoutPlanRepository(
    private val firestore: FirebaseFirestore
) {
    private fun workoutCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("workout_plans")

    private fun dietCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("diet_plans")

    fun getWorkoutPlans(gymOwnerId: String): Flow<List<WorkoutPlan>> = callbackFlow {
        val registration = workoutCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val plans = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(WorkoutPlan::class.java)?.copy(workoutPlanId = doc.id)
                } ?: emptyList()
                trySend(plans)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addWorkoutPlan(gymOwnerId: String, plan: WorkoutPlan): Result<Unit> = runCatching {
        val docId = plan.workoutPlanId.ifEmpty { workoutCollection(gymOwnerId).document().id }
        workoutCollection(gymOwnerId).document(docId).set(plan.copy(workoutPlanId = docId)).await()
    }

    suspend fun deleteWorkoutPlan(gymOwnerId: String, planId: String): Result<Unit> = runCatching {
        workoutCollection(gymOwnerId).document(planId).delete().await()
    }

    fun getDietPlans(gymOwnerId: String): Flow<List<DietPlanRef>> = callbackFlow {
        val registration = dietCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val plans = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(DietPlanRef::class.java)?.copy(dietPlanId = doc.id)
                } ?: emptyList()
                trySend(plans)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addDietPlan(gymOwnerId: String, plan: DietPlanRef): Result<Unit> = runCatching {
        val docId = plan.dietPlanId.ifEmpty { dietCollection(gymOwnerId).document().id }
        dietCollection(gymOwnerId).document(docId).set(plan.copy(dietPlanId = docId)).await()
    }

    suspend fun deleteDietPlan(gymOwnerId: String, planId: String): Result<Unit> = runCatching {
        dietCollection(gymOwnerId).document(planId).delete().await()
    }
}
