package com.workable.mobile.data

import retrofit2.http.GET

interface MunicipioService {
    @GET("api/municipio")
    suspend fun getMunicipios(): List<MunicipioDto>
}
