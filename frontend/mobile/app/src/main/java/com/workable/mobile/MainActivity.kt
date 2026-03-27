package com.workable.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.auth.LoginScreen
import com.workable.mobile.ui.auth.RegisterScreen
import com.workable.mobile.ui.pages.admin.AdminAdministradoresScreen
import com.workable.mobile.ui.pages.admin.AdminAspirantesScreen
import com.workable.mobile.ui.pages.admin.AdminEmpresasScreen
import com.workable.mobile.ui.pages.admin.AdminHojasDeVidaScreen
import com.workable.mobile.ui.pages.admin.AdminHubScreen
import com.workable.mobile.ui.pages.admin.AdminMunicipiosScreen
import com.workable.mobile.ui.pages.admin.AdminOfertasScreen
import com.workable.mobile.ui.pages.admin.AdminPostulacionesScreen
import com.workable.mobile.ui.pages.admin.AdminReclutadoresScreen
import com.workable.mobile.ui.pages.DashboardScreen
import com.workable.mobile.ui.theme.WorkableTheme

import com.workable.mobile.ui.pages.aspirante.AspiranteHojaVidaScreen
import com.workable.mobile.ui.pages.aspirante.AspiranteOfertasScreen
import com.workable.mobile.ui.pages.aspirante.AspiranteOfertaCompletaScreen
import com.workable.mobile.ui.pages.aspirante.AspirantePostulacionesScreen

import com.workable.mobile.ui.pages.reclutador.ReclutadorEmpresaScreen
import com.workable.mobile.ui.pages.reclutador.ReclutadorOfertasScreen
import com.workable.mobile.ui.pages.reclutador.ReclutadorPostulacionesOfertaScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        ApiClient.setToken(SessionManager.getToken(this))

        val startDestination = when (SessionManager.getRole(this)) {
            "ADMIN" -> "dashboard/ADMIN"
            "RECLUTADOR" -> "dashboard/RECLUTADOR"
            "ASPIRANTE" -> "dashboard/ASPIRANTE"
            else -> "register"
        }

        setContent {
            WorkableTheme {
                val navController = rememberNavController()

                Surface(
                    modifier = androidx.compose.ui.Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    NavHost(navController = navController, startDestination = startDestination) {
                        composable("register") { RegisterScreen(navController) }
                        composable("login") { LoginScreen(navController) }
                        composable("dashboard/{role}") { backStackEntry ->
                            val role = backStackEntry.arguments?.getString("role") ?: "ASPIRANTE"
                            if (role == "ASPIRANTE") {
                                AspiranteOfertasScreen(navController)
                            } else {
                                DashboardScreen(navController, role)
                            }
                        }
                        composable("aspirante") { DashboardScreen(navController, "ASPIRANTE") }
                        composable("aspirante/ofertas") { AspiranteOfertasScreen(navController) }
                        composable("aspirante/oferta/{id}") { backStackEntry ->
                            val id = backStackEntry.arguments?.getString("id")?.toLongOrNull() ?: 0L
                            AspiranteOfertaCompletaScreen(navController = navController, ofertaId = id)
                        }
                        composable("aspirante/postulaciones") { AspirantePostulacionesScreen(navController) }
                        composable("aspirante/hoja-vida") { AspiranteHojaVidaScreen(navController) }

                        composable("reclutador/empresa") { ReclutadorEmpresaScreen(navController) }
                        composable("reclutador/ofertas") { ReclutadorOfertasScreen(navController) }
                        composable("reclutador/oferta/{id}/postulaciones") { backStackEntry ->
                            val id = backStackEntry.arguments?.getString("id")?.toLongOrNull() ?: 0L
                            ReclutadorPostulacionesOfertaScreen(navController, id)
                        }

                        composable("admin") { DashboardScreen(navController, "ADMIN") }
                        composable("reclutador") { DashboardScreen(navController, "RECLUTADOR") }
                        composable("admin/home") { AdminHubScreen(navController) }
                        composable("admin/aspirantes") { AdminAspirantesScreen(navController) }
                        composable("admin/administradores") { AdminAdministradoresScreen(navController) }
                        composable("admin/reclutadores") { AdminReclutadoresScreen(navController) }
                        composable("admin/empresas") { AdminEmpresasScreen(navController) }
                        composable("admin/ofertas") { AdminOfertasScreen(navController) }
                        composable("admin/postulaciones") { AdminPostulacionesScreen(navController) }
                        composable("admin/hojas-de-vida") { AdminHojasDeVidaScreen(navController) }
                        composable("admin/municipios") { AdminMunicipiosScreen(navController) }
                    }
                }
            }
        }
    }
}
