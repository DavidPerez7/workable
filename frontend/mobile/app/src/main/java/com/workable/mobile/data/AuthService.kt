package com.workable.mobile.data

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AuthService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("api/auth/register-aspirante")
    suspend fun registerAspirante(@Body request: RegisterAspiranteRequest): Response<ResponseBody>

    @POST("api/auth/register-reclutador")
    suspend fun registerReclutador(@Body request: RegisterReclutadorRequest): Response<ResponseBody>

    @GET("api/auth/me")
    suspend fun getCurrentUser(): ResponseBody
}
