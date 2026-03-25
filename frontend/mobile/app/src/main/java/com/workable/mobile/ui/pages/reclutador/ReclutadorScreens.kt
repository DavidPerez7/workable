package com.workable.mobile.ui.pages.reclutador

import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.List
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
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
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.AppMenuItem
import com.workable.mobile.ui.components.WorkableAppScaffold
import com.workable.mobile.ui.components.WorkableHeroCard
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSurfaceCard
import kotlinx.coroutines.launch

private val reclutadorMenu = listOf(
    AppMenuItem("Mi Empresa", "reclutador/empresa", Icons.Outlined.Info),
    AppMenuItem("Ofertas Publicadas", "reclutador/ofertas", Icons.Outlined.List),
)

@Composable
fun ReclutadorEmpresaScreen(navController: NavController) {
    val context = LocalContext.current
    var empresa by remember { mutableStateOf<Map<String, Any?>?>(null) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val empresaId = SessionManager.getEmpresaId(context)
            if (empresaId != -1L) {
                empresa = ApiClient.adminCrudService.getEmpresa(id = empresaId)
            }
        } catch (e: Exception) {
            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        } finally {
            loading = false
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Mi Empresa",
        role = "RECLUTADOR",
        menuItems = reclutadorMenu
    ) {
        WorkableScrollableColumn {
            if (loading) {
                Text("Cargando...", modifier = Modifier.padding(16.dp))
            } else if (empresa == null) {
                WorkableSurfaceCard {
                    Text("No tienes una empresa asociada.")
                }
            } else {
                WorkableSurfaceCard {
                    Text(text = "Información Corporativa", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    FieldRow("Nombre:", empresa?.get("nombre") as? String)
                    FieldRow("NIT:", empresa?.get("nit") as? String)
                    FieldRow("Dirección:", empresa?.get("direccion") as? String)
                    FieldRow("Teléfono:", empresa?.get("telefono") as? String)
                    FieldRow("Correo:", empresa?.get("correo") as? String)
                }
            }
        }
    }
}

@Composable
private fun FieldRow(label: String, value: String?) {
    Row(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(0.3f))
        Text(text = value ?: "-", style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(0.7f))
    }
}

@Composable
fun ReclutadorOfertasScreen(navController: NavController) {
    val context = LocalContext.current
    var ofertas by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val empresaId = SessionManager.getEmpresaId(context)
            if (empresaId != -1L) {
                ofertas = ApiClient.ofertaService.getByEmpresaId(empresaId)
            }
        } catch (e: Exception) {
            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        } finally {
            loading = false
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Mis Vacantes",
        role = "RECLUTADOR",
        menuItems = reclutadorMenu
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            WorkableScrollableColumn(modifier = Modifier.weight(1f)) {
                if (loading) {
                    Text("Cargando...", modifier = Modifier.padding(16.dp))
                } else if (ofertas.isEmpty()) {
                    Text("No has publicado ofertas.", modifier = Modifier.padding(16.dp))
                } else {
                    ofertas.forEach { oferta ->
                        ReclutadorOfertaCard(oferta, navController)
                    }
                }
            }
        }
    }
}

@Composable
fun ReclutadorOfertaCard(oferta: Map<String, Any?>, navController: NavController) {
    val id = (oferta["id"] as? Number)?.toLong() ?: 0L
    val titulo = oferta["cargo"] as? String ?: "Sin título"
    val estado = oferta["estado"] as? String ?: "ACTIVA"
    
    WorkableSurfaceCard(modifier = Modifier.clickable { 
        navController.navigate("reclutador/oferta/$id/postulaciones")
    }) {
         Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = titulo, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(text = "ID Ref: #$id", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
            WorkablePill(
                text = estado,
                containerColor = if (estado == "ACTIVA") Color(0xFFDCFCE7) else Color(0xFFF3F4F6),
                contentColor = if (estado == "ACTIVA") Color(0xFF166534) else Color.Black
            )
        }
        Text("Toca para ver postulaciones ->", style = MaterialTheme.typography.labelSmall, color = Color.Blue)
    }
}

@Composable
fun ReclutadorPostulacionesOfertaScreen(navController: NavController, ofertaId: Long) {
    val context = LocalContext.current
    var postulaciones by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(ofertaId) {
        try {
            postulaciones = ApiClient.postulacionService.getByOfertaId(ofertaId)
        } catch (e: Exception) {
            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        } finally {
            loading = false
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Candidatos - Oferta #$ofertaId",
        role = "RECLUTADOR",
        menuItems = reclutadorMenu
    ) {
        WorkableScrollableColumn {
             if (loading) {
                Text("Cargando...", modifier = Modifier.padding(16.dp))
            } else if (postulaciones.isEmpty()) {
                Text("No hay postulaciones aún.", modifier = Modifier.padding(16.dp))
            } else {
                postulaciones.forEach { post ->
                   ReclutadorPostulacionCard(post)
                }
            }
        }
    }
}

@Composable
fun ReclutadorPostulacionCard(post: Map<String, Any?>) {
    val estado = post["estado"] as? String ?: "PENDIENTE"
    val aspirante = post["aspirante"] as? Map<String, Any?>
    val nombre = "${aspirante?.get("nombre")} ${aspirante?.get("apellido")}"
    val correo = aspirante?.get("correo") as? String ?: ""
    val fecha = post["fechaCreacion"] as? String ?: ""

    WorkableSurfaceCard {
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = nombre, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text(text = correo, style = MaterialTheme.typography.bodyMedium)
                if (fecha.isNotEmpty()) Text(text = "Fecha: $fecha", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
            WorkablePill(
                text = estado,
                containerColor = Color(0xFFEFF6FF),
                contentColor = Color(0xFF1D4ED8)
            )
        }
    }
}
