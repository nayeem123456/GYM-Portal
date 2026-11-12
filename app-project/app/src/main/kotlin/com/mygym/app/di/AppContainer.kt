package com.mygym.app.di

import android.content.Context
import androidx.room.Room
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.mygym.app.data.local.GymDatabase
import com.mygym.app.data.local.MemberDao
import com.mygym.app.data.local.MemberPackageDao
import com.mygym.app.data.local.PackageDao
import com.mygym.app.data.repository.*

interface AppContainer {
    val database: GymDatabase
    val memberDao: MemberDao
    val packageDao: PackageDao
    val memberPackageDao: MemberPackageDao

    val firebaseAuth: FirebaseAuth
    val firestore: FirebaseFirestore
    val firebaseStorage: FirebaseStorage

    val authRepository: AuthRepository
    val memberRepository: MemberRepository
    val packageRepository: PackageRepository
    val trainerRepository: TrainerRepository
    val batchRepository: BatchRepository
    val attendanceRepository: AttendanceRepository
    val inquiryRepository: InquiryRepository
    val expenseRepository: ExpenseRepository
    val serviceRepository: ServiceRepository
    val workoutPlanRepository: WorkoutPlanRepository
    val measurementRepository: MeasurementRepository
}

class DefaultAppContainer(private val context: Context) : AppContainer {
    override val database: GymDatabase by lazy {
        Room.databaseBuilder(context, GymDatabase::class.java, "gym_cache.db")
            .fallbackToDestructiveMigration()
            .build()
    }

    override val memberDao: MemberDao by lazy { database.memberDao() }
    override val packageDao: PackageDao by lazy { database.packageDao() }
    override val memberPackageDao: MemberPackageDao by lazy { database.memberPackageDao() }

    override val firebaseAuth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }
    override val firestore: FirebaseFirestore by lazy { FirebaseFirestore.getInstance() }
    override val firebaseStorage: FirebaseStorage by lazy { FirebaseStorage.getInstance() }

    override val authRepository: AuthRepository by lazy {
        AuthRepository(firebaseAuth, firestore)
    }

    override val memberRepository: MemberRepository by lazy {
        MemberRepository(firestore, memberDao)
    }

    override val packageRepository: PackageRepository by lazy {
        PackageRepository(firestore, packageDao)
    }

    override val trainerRepository: TrainerRepository by lazy {
        TrainerRepository(firestore)
    }

    override val batchRepository: BatchRepository by lazy {
        BatchRepository(firestore)
    }

    override val attendanceRepository: AttendanceRepository by lazy {
        AttendanceRepository(firestore)
    }

    override val inquiryRepository: InquiryRepository by lazy {
        InquiryRepository(firestore)
    }

    override val expenseRepository: ExpenseRepository by lazy {
        ExpenseRepository(firestore)
    }

    override val serviceRepository: ServiceRepository by lazy {
        ServiceRepository(firestore)
    }

    override val workoutPlanRepository: WorkoutPlanRepository by lazy {
        WorkoutPlanRepository(firestore)
    }

    override val measurementRepository: MeasurementRepository by lazy {
        MeasurementRepository(firestore)
    }
}

