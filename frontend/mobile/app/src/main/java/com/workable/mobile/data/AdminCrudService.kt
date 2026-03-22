package com.workable.mobile.data

import okhttp3.ResponseBody
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import retrofit2.http.POST
import retrofit2.http.PUT

interface AdminCrudService {
    @GET("api/aspirante")
    suspend fun getAspirantes(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/aspirante/public/{id}")
    suspend fun getAspirante(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/aspirante")
    suspend fun createAspirante(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/aspirante/{id}")
    suspend fun updateAspirante(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/aspirante/{id}")
    suspend fun deleteAspirante(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/administrador")
    suspend fun getAdministradores(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/administrador/{id}")
    suspend fun getAdministrador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/administrador")
    suspend fun createAdministrador(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/administrador/{id}")
    suspend fun updateAdministrador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/administrador/{id}")
    suspend fun deleteAdministrador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/reclutador")
    suspend fun getReclutadores(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/reclutador/{id}")
    suspend fun getReclutador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/reclutador")
    suspend fun createReclutador(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/reclutador/{id}")
    suspend fun updateReclutador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/reclutador/{id}")
    suspend fun deleteReclutador(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/empresa")
    suspend fun getEmpresas(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/empresa/{id}")
    suspend fun getEmpresa(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/empresa")
    suspend fun createEmpresa(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/empresa/{id}")
    suspend fun updateEmpresa(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/empresa/{id}")
    suspend fun deleteEmpresa(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/oferta")
    suspend fun getOfertas(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/oferta/{id}")
    suspend fun getOferta(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/oferta")
    suspend fun createOferta(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/oferta/{id}")
    suspend fun updateOferta(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/oferta/{id}")
    suspend fun deleteOferta(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/postulacion")
    suspend fun getPostulaciones(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/postulacion/{id}")
    suspend fun getPostulacion(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/postulacion")
    suspend fun createPostulacion(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/postulacion/{id}")
    suspend fun updatePostulacion(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/postulacion/{id}")
    suspend fun deletePostulacion(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/hoja-vida")
    suspend fun getHojasDeVida(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/hoja-vida/{id}")
    suspend fun getHojaDeVida(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/hoja-vida")
    suspend fun createHojaDeVida(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/hoja-vida/{id}")
    suspend fun updateHojaDeVida(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/hoja-vida/{id}")
    suspend fun deleteHojaDeVida(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody

    @GET("api/municipio")
    suspend fun getMunicipios(@Header("Authorization") authorization: String? = null): List<Map<String, Any?>>

    @GET("api/municipio/{id}")
    suspend fun getMunicipio(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): Map<String, Any?>

    @POST("api/municipio")
    suspend fun createMunicipio(
        @Header("Authorization") authorization: String? = null,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @PUT("api/municipio/{id}")
    suspend fun updateMunicipio(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
        @Body payload: Map<String, Any?>,
    ): Map<String, Any?>

    @DELETE("api/municipio/{id}")
    suspend fun deleteMunicipio(
        @Header("Authorization") authorization: String? = null,
        @Path("id") id: Long,
    ): ResponseBody
}
