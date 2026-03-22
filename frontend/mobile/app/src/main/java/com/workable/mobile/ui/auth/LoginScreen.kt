package com.workable.mobile.ui.auth

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.LoginRequest
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.WorkableHeroCard
import com.workable.mobile.ui.components.WorkablePageBackground
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSurfaceCard
import com.workable.mobile.ui.components.WorkableTextField
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var correo by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun login() {
        scope.launch {
            loading = true
            errorMessage = null

            try {
                val response = ApiClient.authService.login(LoginRequest(correo.trim(), password))
                SessionManager.saveLogin(context, response)

                val role = response.rol?.uppercase() ?: "ASPIRANTE"
                navController.navigate("dashboard/$role") {
                    popUpTo("login") { inclusive = true }
                }
            } catch (error: Exception) {
                errorMessage = error.message ?: "No se pudo iniciar sesión"
                Toast.makeText(context, errorMessage, Toast.LENGTH_LONG).show()
            } finally {
                loading = false
            }
        }
    }

    WorkablePageBackground {
        WorkableScrollableColumn(verticalSpacing = 16.dp) {
            WorkableHeroCard(
                title = "Iniciar sesión",
                subtitle = "Entra con tu correo y contraseña para acceder a tu panel según tu rol."
            ) {
                androidx.compose.foundation.layout.Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    WorkablePill(
                        text = "Acceso seguro",
                        modifier = Modifier.weight(1f)
                    )
                    WorkablePill(
                        text = "Mobile",
                        modifier = Modifier.weight(1f),
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }

            WorkableSurfaceCard {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    WorkableTextField(
                        value = correo,
                        onValueChange = { correo = it },
                        label = "Correo electrónico",
                    )

                    WorkableTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = "Contraseña",
                        visualTransformation = PasswordVisualTransformation(),
                    )

                    errorMessage?.let {
                        Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }

                    WorkablePrimaryButton(
                        text = if (loading) "Ingresando..." else "Entrar",
                        onClick = { login() },
                        enabled = !loading && correo.isNotBlank() && password.isNotBlank()
                    )

                    WorkableSecondaryButton(
                        text = "Ir a registro",
                        onClick = { navController.navigate("register") }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
