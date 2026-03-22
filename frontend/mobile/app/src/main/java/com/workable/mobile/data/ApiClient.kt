package com.workable.mobile.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    private const val BASE_URL = "http://10.0.2.2:8080/"

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val authService: AuthService by lazy {
        retrofit.create(AuthService::class.java)
    }

    val municipioService: MunicipioService by lazy {
        retrofit.create(MunicipioService::class.java)
    }

    val adminCrudService: AdminCrudService by lazy {
        retrofit.create(AdminCrudService::class.java)
    }
}
