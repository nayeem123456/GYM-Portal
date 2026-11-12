package com.mygym.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.mygym.app.data.model.Expense
import com.mygym.app.data.model.ExpenseCategory
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class ExpenseRepository(
    private val firestore: FirebaseFirestore
) {
    private fun expensesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("expenses")

    private fun categoriesCollection(gymOwnerId: String) =
        firestore.collection("gymowners").document(gymOwnerId).collection("expenseCategories")

    fun getExpenses(gymOwnerId: String): Flow<List<Expense>> = callbackFlow {
        val registration = expensesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val expenses = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Expense::class.java)?.copy(id = doc.id)
                } ?: emptyList()
                trySend(expenses)
            }
        awaitClose { registration.remove() }
    }

    fun getCategories(gymOwnerId: String): Flow<List<ExpenseCategory>> = callbackFlow {
        val registration = categoriesCollection(gymOwnerId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val categories = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(ExpenseCategory::class.java)?.copy(id = doc.id)
                } ?: emptyList()
                trySend(categories)
            }
        awaitClose { registration.remove() }
    }

    suspend fun addExpense(gymOwnerId: String, expense: Expense): Result<Unit> = runCatching {
        val docId = expense.id.ifEmpty { expensesCollection(gymOwnerId).document().id }
        expensesCollection(gymOwnerId).document(docId).set(expense.copy(id = docId)).await()
    }

    suspend fun updateExpense(gymOwnerId: String, expense: Expense): Result<Unit> = runCatching {
        expensesCollection(gymOwnerId).document(expense.id).set(expense).await()
    }

    suspend fun deleteExpense(gymOwnerId: String, expenseId: String): Result<Unit> = runCatching {
        expensesCollection(gymOwnerId).document(expenseId).delete().await()
    }

    suspend fun addCategory(gymOwnerId: String, category: ExpenseCategory): Result<Unit> = runCatching {
        val docId = category.id.ifEmpty { categoriesCollection(gymOwnerId).document().id }
        categoriesCollection(gymOwnerId).document(docId).set(category.copy(id = docId)).await()
    }
}
