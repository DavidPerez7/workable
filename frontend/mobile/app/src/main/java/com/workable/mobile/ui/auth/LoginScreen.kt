package com.workable.mobile.ui.auth

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

import androidx.compose.ui.graphics.Color

@Composable
fun LoginScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showText by remember { mutableStateOf(false) }
    var textColor by remember { mutableStateOf(Color(0xFF6200EE)) } // Color primary
    var contador by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Bienvenido a Workable",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Iniciar sesion",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )

        Text(
            text = "Email",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.primary
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(onClick = { navController.navigate("register")}) {
            Text("Registrarse")
        }

        Button(onClick = { navController.navigate("aspirante") }) {
            Text("Entrar Aspirante")
        }

        if (showText) {
            Text("Hola, $email, tu contraseña es $password")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = {
            email = ""
            password = ""
        }, enabled = email.isNotEmpty() && password.isNotEmpty()) {
            Text("Limpiar")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = { textColor = Color(0xFF03DAC6) }) { // Color secondary
            Text("Cambiar color")
        }

        Text(
            text = "sunga",
            color = textColor
        )

        Button(onClick = { contador++ }) {
            Text("Contar")
        }

        Text(
            text = "Contador: $contador",
            color = textColor
        )
    }
}