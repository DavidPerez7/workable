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

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
                            DashboardScreen(
                                navController = navController,
                                role = backStackEntry.arguments?.getString("role") ?: "ASPIRANTE",
                            )
                        }
                        composable("aspirante") { DashboardScreen(navController, "ASPIRANTE") }
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
