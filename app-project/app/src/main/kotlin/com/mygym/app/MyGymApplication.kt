package com.mygym.app

import android.app.Application
import com.mygym.app.di.AppContainer
import com.mygym.app.di.DefaultAppContainer

class MyGymApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(this)
    }
}
