package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.local.PackageDao
import com.mygym.app.data.local.entity.toEntity
import com.mygym.app.data.model.GymPackage
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class PackageRepository(
    private val firestore: FirebaseFirestore,
    private val packageDao: PackageDao
) {
    private fun packagesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("packages")

    fun getPackages(gymOwnerId: String): Flow<List<GymPackage>> = callbackFlow {
        val registration = packagesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val packages = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(GymPackage::class.java)?.copy(packageId = doc.id)
                } ?: emptyList()
                trySend(packages)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addPackage(gymOwnerId: String, pkg: GymPackage): Result<Unit> = runCatching {
        val docId = pkg.packageId.ifEmpty { packagesCollection(gymOwnerId).document().id }
        val toSave = pkg.copy(packageId = docId)
        packagesCollection(gymOwnerId).document(docId).set(toSave).await()
        packageDao.insertPackage(toSave.toEntity(gymOwnerId))
    }

    suspend fun updatePackage(gymOwnerId: String, pkg: GymPackage): Result<Unit> = runCatching {
        packagesCollection(gymOwnerId).document(pkg.packageId).set(pkg).await()
        packageDao.insertPackage(pkg.toEntity(gymOwnerId))
    }

    suspend fun deletePackage(gymOwnerId: String, packageId: String): Result<Unit> = runCatching {
        packagesCollection(gymOwnerId).document(packageId).delete().await()
        packageDao.deletePackageById(packageId)
    }
}
