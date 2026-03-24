package com.workable.mobile.ui.auth

import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.MunicipioDto
import com.workable.mobile.data.MunicipioRef
import com.workable.mobile.data.RegisterAspiranteRequest
import com.workable.mobile.data.RegisterReclutadorRequest
import com.workable.mobile.ui.components.WorkableHeroCard
import com.workable.mobile.ui.components.WorkablePageBackground
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSurfaceCard
import com.workable.mobile.ui.components.WorkableSelectablePill
import com.workable.mobile.ui.components.WorkableTextField
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var rolSeleccionado by remember { mutableStateOf("ASPIRANTE") }
    var nombre by remember { mutableStateOf("") }
    var apellido by remember { mutableStateOf("") }
    var correo by remember { mutableStateOf("") }
    var telefono by remember { mutableStateOf("") }
    var fechaNacimiento by remember { mutableStateOf("") }
    var genero by remember { mutableStateOf("MASCULINO") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var municipios by remember { mutableStateOf(listOf<MunicipioDto>()) }
    var municipioSeleccionado by remember { mutableStateOf<MunicipioDto?>(null) }
    var loading by remember { mutableStateOf(false) }
    var loadingMunicipios by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var municipiosExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        try {
            municipios = ApiClient.municipioService.getMunicipios()
        } catch (error: Exception) {
            errorMessage = error.message ?: "No se pudieron cargar los municipios"
        } finally {
            loadingMunicipios = false
        }
    }

    fun submit() {
        val municipio = municipioSeleccionado

        if (nombre.isBlank() || apellido.isBlank() || correo.isBlank() || telefono.isBlank() || fechaNacimiento.isBlank() || municipio == null) {
            errorMessage = "Completa los campos obligatorios"
            return
        }

        if (password.length < 8) {
            errorMessage = "La contraseña debe tener mínimo 8 caracteres"
            return
        }

        if (password != confirmPassword) {
            errorMessage = "Las contraseñas no coinciden"
            return
        }

        scope.launch {
            loading = true
            errorMessage = null

            try {
                val response = if (rolSeleccionado == "ASPIRANTE") {
                    ApiClient.authService.registerAspirante(
                        RegisterAspiranteRequest(
                            nombre = nombre.trim(),
                            apellido = apellido.trim(),
                            correo = correo.trim(),
                            telefono = telefono.trim(),
                            password = password,
                            fechaNacimiento = fechaNacimiento,
                            genero = genero,
                            municipio = MunicipioRef(municipio.id),
                        )
                    )
                } else {
                    ApiClient.authService.registerReclutador(
                        RegisterReclutadorRequest(
                            nombre = nombre.trim(),
                            apellido = apellido.trim(),
                            correo = correo.trim(),
                            telefono = telefono.trim(),
                            password = password,
                            fechaNacimiento = fechaNacimiento,
                            municipio = MunicipioRef(municipio.id),
                        )
                    )
                }

                if (response.isSuccessful) {
                    Toast.makeText(context, "Registro exitoso. Ahora inicia sesión.", Toast.LENGTH_LONG).show()
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = false }
                    }
                } else {
                    errorMessage = response.errorBody()?.string()?.takeIf { it.isNotBlank() } ?: "No se pudo registrar"
                }
            } catch (error: Exception) {
                errorMessage = error.message ?: "No se pudo registrar"
                Toast.makeText(context, errorMessage, Toast.LENGTH_LONG).show()
            } finally {
                loading = false
            }
        }
    }

    WorkablePageBackground {
        WorkableScrollableColumn(verticalSpacing = 10.dp) {
            WorkableHeroCard(
                title = "Regístrate en Workable",
                subtitle = "Elige tu rol arriba y completa el formulario con una experiencia más cercana a la web."
            ) {
                androidx.compose.foundation.layout.Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    WorkableSelectablePill(
                        text = "Aspirante",
                        selected = rolSeleccionado == "ASPIRANTE",
                        onClick = { rolSeleccionado = "ASPIRANTE" },
                        modifier = Modifier.weight(1f)
                    )
                    WorkableSelectablePill(
                        text = "Reclutador",
                        selected = rolSeleccionado == "RECLUTADOR",
                        onClick = { rolSeleccionado = "RECLUTADOR" },
                        modifier = Modifier.weight(1f),
                    )
                }
            }

            WorkableSurfaceCard(contentPadding = 16.dp) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    WorkableTextField(value = nombre, onValueChange = { nombre = it }, label = "Nombre")
                    WorkableTextField(value = apellido, onValueChange = { apellido = it }, label = "Apellido")
                    WorkableTextField(value = correo, onValueChange = { correo = it }, label = "Correo electrónico")
                    WorkableTextField(value = telefono, onValueChange = { telefono = it }, label = "Teléfono")
                    WorkableTextField(value = fechaNacimiento, onValueChange = { fechaNacimiento = it }, label = "Fecha de nacimiento (YYYY-MM-DD)")

                    if (rolSeleccionado == "ASPIRANTE") {
                        Text(text = "Género", style = MaterialTheme.typography.labelLarge, color = Color.Black)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                            listOf("MASCULINO", "FEMENINO", "OTRO").forEach { option ->
                                FilterChip(
                                    selected = genero == option,
                                    onClick = { genero = option },
                                    label = { Text(option.lowercase().replaceFirstChar { it.uppercase() }) },
                                    colors = androidx.compose.material3.FilterChipDefaults.filterChipColors(
                                        containerColor = androidx.compose.ui.graphics.Color.White,
                                        labelColor = Color.Black,
                                        selectedContainerColor = Color(0xFF1B337A),
                                        selectedLabelColor = androidx.compose.ui.graphics.Color.White,
                                    ),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    Text(text = "Municipio", style = MaterialTheme.typography.labelLarge, color = Color.Black)
                    Box(modifier = Modifier.fillMaxWidth()) {
                        WorkableTextField(
                            value = municipioSeleccionado?.nombre.orEmpty(),
                            onValueChange = {},
                            label = if (loadingMunicipios) "Cargando municipios..." else "Selecciona tu municipio",
                            readOnly = true,
                            enabled = !loadingMunicipios,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { municipiosExpanded = true },
                        )

                        DropdownMenu(
                            expanded = municipiosExpanded,
                            onDismissRequest = { municipiosExpanded = false }
                        ) {
                            municipios.forEach { municipio ->
                                DropdownMenuItem(
                                    text = { Text(municipio.nombre) },
                                    onClick = {
                                        municipioSeleccionado = municipio
                                        municipiosExpanded = false
                                    }
                                )
                            }
                        }
                    }

                    WorkableTextField(value = password, onValueChange = { password = it }, label = "Contraseña", visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation())
                    WorkableTextField(value = confirmPassword, onValueChange = { confirmPassword = it }, label = "Confirmar contraseña", visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation())

                    errorMessage?.let {
                        Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }

                    WorkablePrimaryButton(
                        text = if (loading) "Registrando..." else "Crear cuenta",
                        onClick = { submit() },
                        enabled = !loading && !loadingMunicipios
                    )

                    Text(
                        text = "Ya tengo cuenta",
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { navController.navigate("login") },
                        color = Color(0xFF1B337A),
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center,
                        textDecoration = TextDecoration.Underline,
                    )
                }
            }

            Spacer(modifier = Modifier.height(2.dp))
        }
    }
}
