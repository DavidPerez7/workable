package com.workable.mobile.data

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "http://3.218.5.56:8080/"
    private var authToken: String? = null

    fun setToken(token: String?) {
        authToken = token
    }

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)

        OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor { chain ->
                val original = chain.request()
                val requestBuilder = original.newBuilder()
                authToken?.let {
                    requestBuilder.header("Authorization", "Bearer $it")
                }
                chain.proceed(requestBuilder.build())
            }
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
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

    val ofertaService: OfertaService by lazy {
        retrofit.create(OfertaService::class.java)
    }

    val postulacionService: PostulacionService by lazy {
        retrofit.create(PostulacionService::class.java)
    }

    val hojaVidaService: HojaVidaService by lazy {
        retrofit.create(HojaVidaService::class.java)
    }
}
