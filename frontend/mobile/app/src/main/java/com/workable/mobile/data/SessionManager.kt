package com.workable.mobile.data

import android.content.Context

object SessionManager {
    private const val PREFS_NAME = "workable_mobile_session"
    private const val KEY_TOKEN = "token"
    private const val KEY_USER_ID = "usuarioId"
    private const val KEY_ROLE = "rol"
    private const val KEY_NAME = "nombre"
    private const val KEY_LASTNAME = "apellido"
    private const val KEY_EMAIL = "correo"

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun saveLogin(context: Context, response: LoginResponse) {
        prefs(context).edit()
            .putString(KEY_TOKEN, response.token)
            .putLong(KEY_USER_ID, response.usuarioId ?: -1L)
            .putString(KEY_ROLE, response.rol)
            .putString(KEY_NAME, response.nombre)
            .putString(KEY_LASTNAME, response.apellido)
            .putString(KEY_EMAIL, response.correo)
            .apply()
    }

    fun getRole(context: Context): String? = prefs(context).getString(KEY_ROLE, null)

    fun getUserId(context: Context): Long = prefs(context).getLong(KEY_USER_ID, -1L)

    fun getToken(context: Context): String? = prefs(context).getString(KEY_TOKEN, null)

    fun getDisplayName(context: Context): String {
        val nombre = prefs(context).getString(KEY_NAME, null)
        val apellido = prefs(context).getString(KEY_LASTNAME, null)
        return listOfNotNull(nombre, apellido).joinToString(" ").ifBlank { "Usuario" }
    }

    fun clear(context: Context) {
        prefs(context).edit().clear().apply()
    }
}
