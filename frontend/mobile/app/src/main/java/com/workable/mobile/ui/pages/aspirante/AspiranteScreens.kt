package com.workable.mobile.ui.pages.aspirante

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Search
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.IdRef
import com.workable.mobile.data.PostulacionRequest
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.AppMenuItem
import com.workable.mobile.ui.components.WorkableAppScaffold
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSurfaceCard
import kotlinx.coroutines.launch

private val aspiranteMenu = listOf(
    AppMenuItem("Ofertas", "aspirante/ofertas", Icons.Outlined.Search),
    AppMenuItem("Mis Postulaciones", "aspirante/postulaciones", Icons.Outlined.List),
    AppMenuItem("Hoja de Vida", "aspirante/hoja-vida", Icons.Outlined.AccountCircle),
)

@Composable
fun AspiranteOfertasScreen(navController: NavController) {
    val context = LocalContext.current
    var ofertas by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            ofertas = ApiClient.ofertaService.getAll()
        } catch (e: Exception) {
            Toast.makeText(context, "Error al cargar ofertas: ${e.message}", Toast.LENGTH_LONG).show()
        } finally {
            loading = false
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Ofertas Disponibles",
        role = SessionManager.getRole(context) ?: "ASPIRANTE",
        menuItems = aspiranteMenu
    ) {
        WorkableScrollableColumn(verticalSpacing = 16.dp) {
            if (loading) {
                Text("Cargando...", modifier = Modifier.padding(16.dp))
            } else if (ofertas.isEmpty()) {
                Text("No hay ofertas disponibles por momento.", modifier = Modifier.padding(16.dp))
            } else {
                ofertas.forEach { oferta ->
                    OfertaCard(oferta = oferta, navController = navController)
                }
            }
        }
    }
}

@Composable
fun OfertaCard(oferta: Map<String, Any?>, navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var applying by remember { mutableStateOf(false) }

    val id = (oferta["id"] as? Number)?.toLong() ?: 0L
    val titulo = oferta["cargo"] as? String ?: "Sin cargp"
    val descripcion = oferta["descripcion"] as? String ?: "Sin descripción"
    val salarioMin = normalizeMoney(oferta["salarioMin"])
    val salarioMax = normalizeMoney(oferta["salarioMax"])
    val empresaMap = oferta["empresa"] as? Map<String, Any?>
    val empresaNombre = empresaMap?.get("nombre") as? String ?: "Confidencial"
    val modalidad = (oferta["modalidad"] as? String) ?: "Remoto"
    val municipio = (oferta["municipio"] as? Map<String, Any?>)?.get("nombre") as? String ?: "Ubicación desconocida"

    fun postularse() {
        scope.launch {
            applying = true
            try {
                val userId = SessionManager.getUserId(context)
                if (userId == -1L) throw Exception("Sesión inválida")
                
                ApiClient.postulacionService.create(
                    PostulacionRequest(IdRef(userId), IdRef(id))
                )
                Toast.makeText(context, "¡Postulación exitosa!", Toast.LENGTH_LONG).show()
                navController.navigate("aspirante/postulaciones")
            } catch (e: Exception) {
                if (e.message?.contains("ya te has postulado", ignoreCase = true) == true) {
                    Toast.makeText(context, "Ya te postulaste anteriormente", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            } finally {
                applying = false
            }
        }
    }

    WorkableSurfaceCard(contentPadding = 18.dp) {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = titulo, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(text = empresaNombre, style = MaterialTheme.typography.titleSmall, color = Color.Gray)
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            WorkablePill(text = modalidad, containerColor = Color(0xFFEFF6FF), contentColor = Color(0xFF1D4ED8))
            WorkablePill(text = municipio, containerColor = Color(0xFFF1F5F9), contentColor = Color(0xFF475569))
        }

        Text(
            text = "$$salarioMin - $$salarioMax", 
            style = MaterialTheme.typography.labelLarge, 
            color = Color(0xFF059669),
            fontWeight = FontWeight.Bold
        )

        Text(
            text = descripcion, 
            maxLines = 3, 
            style = MaterialTheme.typography.bodyMedium,
            color = Color(0xFF334155)
        )

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            WorkablePrimaryButton(
                text = if (applying) "Enviando..." else "Postularme",
                onClick = { postularse() },
                enabled = !applying,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

private fun normalizeMoney(value: Any?): String {
    return when (value) {
        is Number -> "%,d".format(value.toLong()).replace(',', '.')
        else -> "0"
    }
}

@Composable
fun AspirantePostulacionesScreen(navController: NavController) {
    val context = LocalContext.current
    var postulaciones by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val userId = SessionManager.getUserId(context)
            postulaciones = ApiClient.postulacionService.getByAspiranteId(userId)
        } catch (e: Exception) {
            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_LONG).show()
        } finally {
            loading = false
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Mis Postulaciones",
        role = SessionManager.getRole(context) ?: "ASPIRANTE",
        menuItems = aspiranteMenu
    ) {
        WorkableScrollableColumn(verticalSpacing = 16.dp) {
            if (loading) {
                Text("Cargando...", modifier = Modifier.padding(16.dp))
            } else if (postulaciones.isEmpty()) {
                Text("No tienes postulaciones activas.", modifier = Modifier.padding(16.dp))
            } else {
                postulaciones.forEach { post ->
                   PostulacionCard(post)
                }
            }
        }
    }
}

@Composable
fun PostulacionCard(post: Map<String, Any?>) {
    val estado = post["estado"] as? String ?: "PENDIENTE"
    val oferta = post["oferta"] as? Map<String, Any?>
    val titulo = oferta?.get("cargo") as? String ?: "Oferta eliminada"
    val empresa = (oferta?.get("empresa") as? Map<String, Any?>)?.get("nombre") as? String ?: ""
    val fecha = post["fechaCreacion"] as? String ?: ""

    val (bgColor, textColor) = when(estado) {
        "ACEPTADO" -> Color(0xFFDCFCE7) to Color(0xFF166534)
        "RECHAZADO" -> Color(0xFFFEE2E2) to Color(0xFF991B1B)
        "ENTREVISTA_PROGRAMADA", "ENTREVISTA" -> Color(0xFFDBEAFE) to Color(0xFF1E40AF)
        else -> Color(0xFFFEF9C3) to Color(0xFF854D0E)
    }

    WorkableSurfaceCard(contentPadding = 16.dp) {
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = titulo, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text(text = empresa, style = MaterialTheme.typography.bodyMedium, color = Color.Gray)
                if (fecha.isNotEmpty()) {
                    Text(text = "Aplicado el $fecha", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                }
            }
            WorkablePill(
                text = estado.replace("_", " "),
                containerColor = bgColor,
                contentColor = textColor
            )
        }
    }
}

@Composable
fun AspiranteHojaVidaScreen(navController: NavController) {
    val context = LocalContext.current
    
    WorkableAppScaffold(
        navController = navController, 
        title = "Hoja de Vida",
        role = SessionManager.getRole(context) ?: "ASPIRANTE",
        menuItems = aspiranteMenu
    ) {
        WorkableScrollableColumn {
            WorkableSurfaceCard {
                Text("Gestiona tu perfil profesional desde la versión web para una mejor experiencia.", style = MaterialTheme.typography.bodyLarge)
                WorkableSecondaryButton(text = "Ir al inicio", onClick = { navController.navigate("aspirante/ofertas") })
            }
        }
    }
}

