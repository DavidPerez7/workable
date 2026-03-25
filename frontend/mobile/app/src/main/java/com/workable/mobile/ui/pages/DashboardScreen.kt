package com.workable.mobile.ui.pages

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.WorkableHeroCard
import com.workable.mobile.ui.components.WorkablePageBackground
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkableMetricCard
import com.workable.mobile.ui.components.WorkableSectionDivider
import com.workable.mobile.ui.components.WorkableSectionHeader
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableModuleCard
import com.workable.mobile.ui.components.WorkableSurfaceCard

private data class DashboardModule(
    val title: String,
    val description: String,
    val route: String? = null,
)

@Composable
fun DashboardScreen(navController: NavController, role: String) {
    val context = LocalContext.current
    val roleUpper = role.uppercase()
    val displayName = SessionManager.getDisplayName(context)

    val modules = remember(roleUpper) {
        when (roleUpper) {
            "ADMIN" -> listOf(
                DashboardModule("Aspirantes", "Gestiona usuarios aspirantes.", "admin/aspirantes"),
                DashboardModule("Administradores", "Controla accesos internos.", "admin/administradores"),
                DashboardModule("Reclutadores", "Supervisa reclutadores.", "admin/reclutadores"),
                DashboardModule("Empresas", "Administra empresas registradas.", "admin/empresas"),
                DashboardModule("Ofertas", "Modera vacantes publicadas.", "admin/ofertas"),
                DashboardModule("Postulaciones", "Consulta el flujo de postulaciones.", "admin/postulaciones"),
                DashboardModule("Hojas de vida", "Verifica hojas de vida.", "admin/hojas-de-vida"),
                DashboardModule("Municipios", "Mantiene catálogos base.", "admin/municipios"),
            )
            "RECLUTADOR" -> listOf(
                DashboardModule("Empresas", "Consulta o gestiona empresas.", "reclutador/empresa"),
                DashboardModule("Ofertas", "Publica o edita vacantes y revisa candidatos.", "reclutador/ofertas"),
            )
            else -> listOf(
                DashboardModule("Mi perfil", "Revisa tu información personal.", "aspirante/hoja-vida"),
                DashboardModule("Ofertas", "Explora vacantes activas.", "aspirante/ofertas"),
                DashboardModule("Mis postulaciones", "Sigue el estado de tus aplicaciones.", "aspirante/postulaciones"),
                DashboardModule("Hoja de vida", "Actualiza tu experiencia.", "aspirante/hoja-vida"),
            )
        }
    }

    WorkablePageBackground {
        WorkableScrollableColumn(verticalSpacing = 16.dp) {
            WorkableHeroCard(
                title = when (roleUpper) {
                    "ADMIN" -> "Panel administrativo"
                    "RECLUTADOR" -> "Panel de reclutador"
                    else -> "Panel de aspirante"
                },
                subtitle = "Bienvenido, $displayName. Aquí tienes accesos rápidos y módulos inspirados en la versión web."
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    WorkablePill(text = roleUpper, modifier = Modifier.weight(1f))
                    WorkablePill(
                        text = "Workable Mobile",
                        modifier = Modifier.weight(1f),
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    WorkableMetricCard(
                        value = modules.size.toString(),
                        label = "Módulos",
                        modifier = Modifier.weight(1f),
                    )
                    WorkableMetricCard(
                        value = if (roleUpper == "ADMIN") "8" else if (roleUpper == "RECLUTADOR") "4" else "4",
                        label = if (roleUpper == "ADMIN") "Áreas" else "Accesos",
                        modifier = Modifier.weight(1f),
                    )
                }
            }

            if (roleUpper == "ADMIN") {
                WorkableSurfaceCard(
                    modifier = Modifier,
                    contentPadding = 18.dp
                ) {
                    WorkableSectionHeader(
                        title = "Resumen rápido",
                        subtitle = "Aspirantes, empresas, ofertas, postulaciones y catálogos base en una sola vista."
                    )
                }
            }

            WorkableSectionHeader(
                title = "Módulos disponibles",
                subtitle = "Accesos rápidos organizados por rol, con la misma jerarquía de la web."
            )

            modules.forEach { module ->
                WorkableModuleCard(
                    title = module.title,
                    description = module.description,
                    primaryActionText = "Abrir",
                    secondaryActionText = "Ver más",
                    onPrimaryClick = {
                        module.route?.let { navController.navigate(it) }
                            ?: Toast.makeText(context, "Módulo en desarrollo", Toast.LENGTH_SHORT).show()
                    },
                    onSecondaryClick = {
                        module.route?.let { navController.navigate(it) }
                            ?: Toast.makeText(context, "Próximamente", Toast.LENGTH_SHORT).show()
                    },
                )
            }

            WorkableSectionDivider()

            Spacer(modifier = Modifier.height(4.dp))

            WorkableSecondaryButton(
                text = "Cerrar sesión",
                onClick = {
                    SessionManager.clear(context)
                    navController.navigate("register") {
                        popUpTo("register") { inclusive = true }
                    }
                }
            )
        }
    }
}

@Composable
fun AspiranteScreen(navController: NavController) {
    DashboardScreen(navController, "ASPIRANTE")
}
