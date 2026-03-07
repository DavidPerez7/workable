package com.workable.mobile.ui.auth

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.navigation.NavController
import androidx.compose.material3.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun RegisterScreen(navController: NavController) {
    var rolSeleccionado by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(10.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Text(
            text = "Registrate en Workable",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Crea una cuenta para ingresar a la plataforma",
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Normal,
        )

        Spacer(modifier = Modifier.weight(1f))

        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) { 
            Button(onClick = { rolSeleccionado = "ASPIRANTE" }) {
            Text("Soy Aspirante")
            }

            Button(onClick = { rolSeleccionado = "RECLUTADOR" }) {
                Text("Soy Reclutador")
            }
        }

        Button(onClick = { navController.navigate("login") }) {
            Text("Ir a Login")
        }
    }
}