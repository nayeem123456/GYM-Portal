package com.mygym.app.data.local.entity

import com.mygym.app.data.model.GymPackage
import com.mygym.app.data.model.Member

fun Member.toEntity(): MemberEntity = MemberEntity(
    memberId = memberId,
    name = name,
    phone = phone,
    countryCode = countryCode,
    email = email,
    gender = gender,
    dob = dob,
    doj = doj,
    edate = edate,
    address = address,
    age = age,
    photoUrl = photoUrl,
    gymOwnerId = gymOwnerId,
    packageId = packageId,
    packageName = packageName,
    trainerId = trainerId,
    trainerName = trainerName,
    batchId = batchId,
    batchName = batchName,
    paymentMode = paymentMode,
    pamount = pamount,
    tamount = tamount,
    damount = damount,
    discount = discount,
    discountType = discountType,
    tax = tax,
    isFrozen = isFrozen,
    isBlocked = isBlocked,
    regCode = regCode,
    createdAt = createdAt
)

fun MemberEntity.toDomain(): Member = Member(
    memberId = memberId,
    name = name,
    phone = phone,
    countryCode = countryCode,
    email = email,
    gender = gender,
    dob = dob,
    doj = doj,
    edate = edate,
    address = address,
    age = age,
    photoUrl = photoUrl,
    gymOwnerId = gymOwnerId,
    packageId = packageId,
    packageName = packageName,
    trainerId = trainerId,
    trainerName = trainerName,
    batchId = batchId,
    batchName = batchName,
    paymentMode = paymentMode,
    pamount = pamount,
    tamount = tamount,
    damount = damount,
    discount = discount,
    discountType = discountType,
    tax = tax,
    isFrozen = isFrozen,
    isBlocked = isBlocked,
    regCode = regCode,
    createdAt = createdAt
)

fun GymPackage.toEntity(gymOwnerId: String = ""): PackageEntity = PackageEntity(
    packageId = packageId,
    packageName = packageName,
    amount = amount,
    duration = duration,
    gymOwnerId = gymOwnerId
)

fun PackageEntity.toDomain(): GymPackage = GymPackage(
    packageId = packageId,
    packageName = packageName,
    amount = amount,
    duration = duration
)

