package com.workable.mobile.data

data class LoginRequest(
    val correo: String,
    val password: String,
)

data class LoginResponse(
    val token: String? = null,
    val rol: String? = null,
    val usuarioId: Long? = null,
    val nombre: String? = null,
    val apellido: String? = null,
    val correo: String? = null,
    val empresa: Map<String, Any?>? = null,
)

data class MunicipioRef(
    val id: Long,
)

data class MunicipioDto(
    val id: Long,
    val nombre: String,
)

data class RegisterAspiranteRequest(
    val nombre: String,
    val apellido: String,
    val correo: String,
    val telefono: String,
    val password: String,
    val fechaNacimiento: String,
    val genero: String,
    val rol: String = "ASPIRANTE",
    val municipio: MunicipioRef,
)

data class RegisterReclutadorRequest(
    val nombre: String,
    val apellido: String,
    val correo: String,
    val telefono: String,
    val password: String,
    val fechaNacimiento: String,
    val rol: String = "RECLUTADOR",
    val municipio: MunicipioRef,
)
