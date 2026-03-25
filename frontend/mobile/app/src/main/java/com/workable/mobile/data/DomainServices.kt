package com.workable.mobile.data

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

// --- DTOs ---

data class OfertaSearchDto(
    val cargo: String? = null,
    val modalidad: String? = null,
    val ubicacion: String? = null,
    val salarioMin: Double? = null,
    val salarioMax: Double? = null,
)

// Simplified models using Maps for flexibility, or we could define data classes
// Using generic Map<String, Any?> for now to match AdminCrudService style and speed up dev
// But for specific logic like "Apply", we might need specific request bodies.
data class PostulacionRequest(
    val aspirante: IdRef,
    val oferta: IdRef,
    val estado: String = "PENDIENTE",
)

data class IdRef(val id: Long)

// --- SERVICES ---

interface OfertaService {
    @GET("api/oferta")
    suspend fun getAll(): List<Map<String, Any?>>

    @GET("api/oferta/{id}")
    suspend fun getById(@Path("id") id: Long): Map<String, Any?>

    @POST("api/oferta/search")
    suspend fun search(@Body criteria: OfertaSearchDto): List<Map<String, Any?>>
    
    @GET("api/oferta/empresa/{id}")
    suspend fun getByEmpresaId(@Path("id") id: Long): List<Map<String, Any?>>
}

interface PostulacionService {
    @POST("api/postulacion")
    suspend fun create(@Body postulacion: PostulacionRequest): Map<String, Any?>

    @GET("api/postulacion/aspirante/{id}")
    suspend fun getByAspiranteId(@Path("id") id: Long): List<Map<String, Any?>>

    @GET("api/postulacion/oferta/{id}")
    suspend fun getByOfertaId(@Path("id") id: Long): List<Map<String, Any?>>
}

interface HojaVidaService {
    @GET("api/hoja-vida/aspirante/{id}")
    suspend fun getByAspiranteId(@Path("id") id: Long): Map<String, Any?>

    @POST("api/hoja-vida")
    suspend fun create(@Body hojaVida: Map<String, Any?>): Map<String, Any?>

    @PUT("api/hoja-vida/{id}")
    suspend fun update(@Path("id") id: Long, @Body hojaVida: Map<String, Any?>): Map<String, Any?>
}

interface EmpresaService {
     @GET("api/empresa")
    suspend fun getAll(): List<Map<String, Any?>>

    @GET("api/empresa/{id}")
    suspend fun getById(@Path("id") id: Long): Map<String, Any?>
    
    @GET("api/empresa/usuario/{id}") // Assuming there's a way to get empresa by reclutador or user? 
    // Wait, Reclutador is linked to Empresa. 
    // Reclutador entity has "empresa" field.
    // So getting Reclutador info gives Empresa info.
    suspend fun getEmpresaByReclutadorDummy(): Map<String, Any?> // placeholder
}
