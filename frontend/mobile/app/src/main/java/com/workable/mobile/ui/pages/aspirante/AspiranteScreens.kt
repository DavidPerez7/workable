package com.workable.mobile.ui.pages.aspirante

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.layout.size
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.IdRef
import com.workable.mobile.data.OfertaSearchDto
import com.workable.mobile.data.PostulacionRequest
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.WorkableAppScaffold
import com.workable.mobile.ui.components.AppMenuItem
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSectionHeader
import com.workable.mobile.ui.components.WorkableSectionDivider
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSelectablePill
import com.workable.mobile.ui.components.WorkableTextField
import com.workable.mobile.ui.components.WorkableSurfaceCard
import kotlinx.coroutines.launch

private val aspiranteMenu = listOf(
    AppMenuItem("Ofertas", "aspirante/ofertas", Icons.Outlined.Search),
    AppMenuItem("Mis Postulaciones", "aspirante/postulaciones", Icons.Outlined.List),
    AppMenuItem("Hoja de Vida", "aspirante/hoja-vida", Icons.Outlined.AccountCircle),
)

private data class OfertaFilters(
    val cargo: String = "",
    val ubicacion: String = "",
    val modalidad: String = "",
    val salarioMin: String = "",
    val salarioMax: String = "",
)

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun AspiranteOfertasScreen(navController: NavController) {
    val context = LocalContext.current
    val screenScope = rememberCoroutineScope()
    var ofertas by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var municipios by remember { mutableStateOf<List<com.workable.mobile.data.MunicipioDto>>(emptyList()) }
    var postulacionesUsuario by remember { mutableStateOf<Set<Long>>(emptySet()) }
    var filters by remember { mutableStateOf(OfertaFilters()) }
    var municipioExpanded by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(true) }
    var searching by remember { mutableStateOf(false) }
    var notice by remember { mutableStateOf<String?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    fun cargarOfertas(appliedFilters: OfertaFilters = filters) {
        val criteria = OfertaSearchDto(
            cargo = appliedFilters.cargo.trim().ifBlank { null },
            modalidad = appliedFilters.modalidad.trim().ifBlank { null },
            ubicacion = appliedFilters.ubicacion.trim().ifBlank { null },
            salarioMin = appliedFilters.salarioMin.trim().toDoubleOrNull(),
            salarioMax = appliedFilters.salarioMax.trim().toDoubleOrNull(),
        )

        screenScope.launch {
            searching = true
            try {
                ofertas = ApiClient.ofertaService.search(criteria)
                notice = if (ofertas.isEmpty()) {
                    "No hay ofertas para los filtros seleccionados."
                } else {
                    "Se encontraron ${ofertas.size} ofertas."
                }
                error = null
            } catch (e: Exception) {
                error = "Error al cargar datos: ${e.message}"
            } finally {
                searching = false
                loading = false
            }
        }
    }

    fun limpiarFiltros() {
        filters = OfertaFilters()
        cargarOfertas(OfertaFilters())
    }

    LaunchedEffect(Unit) {
        try {
            municipios = ApiClient.municipioService.getMunicipios()
            val userId = SessionManager.getUserId(context)
            if (userId != -1L) {
                postulacionesUsuario = ApiClient.postulacionService
                    .getByAspiranteId(userId)
                    .mapNotNull { post ->
                        val oferta = post["oferta"] as? Map<String, Any?>
                        (oferta?.get("id") as? Number)?.toLong()
                    }
                    .toSet()
            }
            cargarOfertas()
        } catch (e: Exception) {
            error = "Error al cargar datos: ${e.message}"
        }
    }

    WorkableAppScaffold(
        navController = navController,
        title = "",
        role = SessionManager.getRole(context) ?: "ASPIRANTE",
        menuItems = aspiranteMenu,
        showFooter = true
    ) {
        WorkableScrollableColumn(verticalSpacing = 16.dp, contentPadding = 0.dp) {
            Column(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = "OFERTAS DISPONIBLES",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111111)
                )
                Text(
                    text = "Revisa el listado y abre el detalle completo de la oferta que te interese.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF6B7280)
                )
            }

            WorkableSurfaceCard(
                modifier = Modifier.padding(horizontal = 16.dp),
                contentPadding = 8.dp,
                verticalSpacing = 6.dp,
                elevation = 0.dp,
                borderWidth = 1.dp,
                borderColor = Color(0xFFD6DEE8),
                shape = RoundedCornerShape(0.dp)
            ) {
                Text(
                    text = "FILTROS DE OFERTAS",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111111)
                )

                WorkableTextField(
                    value = filters.cargo,
                    onValueChange = { filters = filters.copy(cargo = it) },
                    label = "Cargo o palabra clave",
                    placeholder = "Ej. desarrollador, auxiliar"
                )

                ExposedDropdownMenuBox(
                    expanded = municipioExpanded,
                    onExpandedChange = { municipioExpanded = !municipioExpanded }
                ) {
                    OutlinedTextField(
                        value = filters.ubicacion.ifBlank { "Selecciona un municipio" },
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Ubicación") },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = municipioExpanded) }
                    )
                    ExposedDropdownMenu(
                        expanded = municipioExpanded,
                        onDismissRequest = { municipioExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Todos los municipios") },
                            onClick = {
                                filters = filters.copy(ubicacion = "")
                                municipioExpanded = false
                            }
                        )
                        municipios.forEach { municipio ->
                            DropdownMenuItem(
                                text = { Text(municipio.nombre) },
                                onClick = {
                                    filters = filters.copy(ubicacion = municipio.nombre)
                                    municipioExpanded = false
                                }
                            )
                        }
                    }
                }

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Modalidad",
                        style = MaterialTheme.typography.labelLarge,
                        color = Color(0xFF111111)
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                        WorkableSelectablePill(
                            text = "Todas",
                            selected = filters.modalidad.isBlank(),
                            onClick = { filters = filters.copy(modalidad = "") }
                        )
                        WorkableSelectablePill(
                            text = "Presencial",
                            selected = filters.modalidad == "PRESENCIAL",
                            onClick = { filters = filters.copy(modalidad = "PRESENCIAL") }
                        )
                        WorkableSelectablePill(
                            text = "Remoto",
                            selected = filters.modalidad == "REMOTO",
                            onClick = { filters = filters.copy(modalidad = "REMOTO") }
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    WorkableTextField(
                        value = filters.salarioMin,
                        onValueChange = { filters = filters.copy(salarioMin = it) },
                        label = "Salario min",
                        placeholder = "0",
                        modifier = Modifier.weight(1f)
                    )
                    WorkableTextField(
                        value = filters.salarioMax,
                        onValueChange = { filters = filters.copy(salarioMax = it) },
                        label = "Salario max",
                        placeholder = "3000000",
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    WorkableSecondaryButton(
                        text = if (searching) "Buscando..." else "Buscar",
                        onClick = { cargarOfertas(filters) },
                        enabled = !searching,
                        modifier = Modifier.weight(1f)
                    )
                    WorkableSecondaryButton(
                        text = "Limpiar",
                        onClick = { limpiarFiltros() },
                        enabled = !searching,
                        modifier = Modifier.weight(1f)
                    )
                }

                notice?.let {
                    Text(
                        text = it,
                        color = Color(0xFF059669),
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFD1FAE5), RoundedCornerShape(8.dp))
                            .padding(10.dp)
                    )
                }

                error?.let {
                    Text(
                        text = it,
                        color = Color(0xFFDC2626),
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFEE2E2), RoundedCornerShape(8.dp))
                            .padding(10.dp)
                    )
                }
            }

            if (loading) {
                Text("Cargando ofertas...", modifier = Modifier.padding(16.dp))
            } else if (ofertas.isEmpty()) {
                Text("No hay ofertas disponibles.", modifier = Modifier.padding(16.dp))
            } else {
                ofertas.forEach { oferta ->
                    OfertaCard(
                        oferta = oferta,
                        navController = navController,
                        yaPostulado = ((oferta["id"] as? Number)?.toLong() ?: 0L) in postulacionesUsuario
                    )
                }
            }
        }
    }
}



@Composable
fun OfertaCard(oferta: Map<String, Any?>, navController: NavController, yaPostulado: Boolean) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var applying by remember { mutableStateOf(false) }

    val id = (oferta["id"] as? Number)?.toLong() ?: 0L
    val titulo = oferta["titulo"] as? String ?: "Sin título"
    val salario = normalizeMoney(oferta["salario"])
    val modalidad = (oferta["modalidad"] as? String) ?: "Remoto"
    val municipio = (oferta["municipio"] as? Map<String, Any?>)?.get("nombre") as? String ?: "Ubicación desconocida"
    val empresa = (oferta["empresa"] as? Map<String, Any?>)?.get("nombre") as? String ?: "Empresa"
    val experiencia = oferta["nivelExperiencia"] as? String ?: "Sin experiencia"

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

    fun verDetalle() {
        navController.navigate("aspirante/oferta/$id")
    }

    WorkableSurfaceCard(
        contentPadding = 8.dp,
        verticalSpacing = 3.dp,
        elevation = 0.dp,
        borderWidth = 1.dp,
        borderColor = Color(0xFFD6DEE8),
        shape = RoundedCornerShape(0.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = titulo,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = Color.Black,
                modifier = Modifier.weight(1f)
            )
            WorkablePill(text = modalidad, containerColor = Color(0xFFF1F5F9), contentColor = Color(0xFF475569))
        }

        CompanyChip(text = empresa)

        WorkableSectionDivider()

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OfferInfoChip(
                text = "${'$'} $salario",
                icon = Icons.Filled.List,
                containerColor = Color(0xFFDCFCE7),
                contentColor = Color(0xFF166534),
                modifier = Modifier.weight(1f)
            )
            OfferInfoChip(
                text = municipio,
                icon = Icons.Outlined.Search,
                containerColor = Color(0xFFF8FAFC),
                contentColor = Color(0xFF475569),
                modifier = Modifier.weight(1f)
            )
            OfferInfoChip(
                text = experiencia,
                icon = Icons.Outlined.List,
                containerColor = Color(0xFFF8FAFC),
                contentColor = Color(0xFF475569),
                modifier = Modifier.weight(1f)
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            WorkableSecondaryButton(
                text = "Detalle",
                onClick = { verDetalle() },
                modifier = Modifier.weight(1f)
            )
            WorkableBlueButton(
                text = if (yaPostulado) "Ya postulado" else if (applying) "Enviando..." else "Postularme",
                onClick = { postularse() },
                enabled = !yaPostulado && !applying,
                containerColor = if (yaPostulado) Color(0xFF1D4ED8).copy(alpha = 0.42f) else Color(0xFF1D4ED8),
                contentColor = Color.White,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun OfferInfoChip(
    text: String,
    icon: ImageVector,
    containerColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .background(containerColor, RoundedCornerShape(999.dp))
            .padding(horizontal = 8.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(5.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = contentColor, modifier = Modifier.size(14.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = contentColor,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1
        )
    }
}

@Composable
fun CompanyChip(text: String) {
    Row(
        modifier = Modifier
            .background(Color(0xFFF8FAFC), RoundedCornerShape(999.dp))
            .border(1.dp, Color(0xFFD8E0EA), RoundedCornerShape(999.dp))
            .padding(horizontal = 9.dp, vertical = 5.dp),
        horizontalArrangement = Arrangement.spacedBy(0.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = Color(0xFF475569),
            fontWeight = FontWeight.SemiBold,
            maxLines = 1
        )
    }
}

@Composable
fun WorkableBlueButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    containerColor: Color = androidx.compose.ui.graphics.Color(0xFF1D4ED8),
    contentColor: Color = Color.White,
) {
    androidx.compose.material3.Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor,
            disabledContainerColor = containerColor,
            disabledContentColor = contentColor,
        ),
    ) {
        if (icon != null) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(8.dp))
        }
        Text(text)
    }
}

    fun normalizeMoney(value: Any?): String {
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
    val scope = rememberCoroutineScope()
    val role = SessionManager.getRole(context) ?: "ASPIRANTE"
    val userId = SessionManager.getUserId(context)
    val displayName = SessionManager.getDisplayName(context)
    var loading by remember { mutableStateOf(true) }
    var saving by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    var notice by remember { mutableStateOf("") }
    var hoja by remember { mutableStateOf<HojaVidaDraft?>(null) }
    var nuevoEstudio by remember { mutableStateOf(emptyStudyDraft()) }
    var nuevaExperiencia by remember { mutableStateOf(emptyExperienceDraft()) }

    LaunchedEffect(Unit) {
        try {
            loading = true
            error = ""
            val data = if (userId != -1L) {
                ApiClient.hojaVidaService.getByAspiranteId(userId)
            } else {
                null
            }
            hoja = normalizeHojaVida(data, userId, displayName)
        } catch (e: Exception) {
            hoja = HojaVidaDraft(
                aspiranteId = userId,
                nombreCompleto = displayName,
            )
            notice = "No hay hoja de vida registrada. Completa los datos y guarda."
        } finally {
            loading = false
        }
    }

    fun persistir(nextHoja: HojaVidaDraft, mensaje: String) {
        scope.launch {
            try {
                saving = true
                error = ""
                val response = if (nextHoja.id == null) {
                    ApiClient.hojaVidaService.create(serializeHojaVida(nextHoja))
                } else {
                    ApiClient.hojaVidaService.update(nextHoja.id, serializeHojaVida(nextHoja))
                }
                hoja = normalizeHojaVida(response, nextHoja.aspiranteId, nextHoja.nombreCompleto) ?: nextHoja
                notice = mensaje
            } catch (e: Exception) {
                error = e.message ?: "No se pudo guardar la hoja de vida"
            } finally {
                saving = false
            }
        }
    }

    fun actualizarGeneral(campo: String, valor: String) {
        hoja = hoja?.copy(
            resumenProfesional = if (campo == "resumenProfesional") valor else hoja?.resumenProfesional.orEmpty(),
            telefono = if (campo == "telefono") valor else hoja?.telefono.orEmpty(),
            correoElectronico = if (campo == "correoElectronico") valor else hoja?.correoElectronico.orEmpty(),
            redSocial = if (campo == "redSocial") valor else hoja?.redSocial.orEmpty(),
        )
    }

    fun guardarGeneral() {
        hoja?.let { persistir(it, "Datos generales guardados.") }
    }

    fun agregarEstudio() {
        val actual = hoja ?: HojaVidaDraft(aspiranteId = userId, nombreCompleto = displayName)
        if (nuevoEstudio.titulo.isBlank() || nuevoEstudio.institucion.isBlank() || nuevoEstudio.fechaInicio.isBlank()) {
            notice = "Completa título, institución y fecha de inicio."
            return
        }
        val next = actual.copy(estudios = actual.estudios + nuevoEstudio)
        hoja = next
        persistir(next, "Estudio agregado correctamente.")
        nuevoEstudio = emptyStudyDraft()
    }

    fun eliminarEstudio(index: Int) {
        val actual = hoja ?: return
        val next = actual.copy(estudios = actual.estudios.filterIndexed { current, _ -> current != index })
        hoja = next
        persistir(next, "Estudio eliminado.")
    }

    fun agregarExperiencia() {
        val actual = hoja ?: HojaVidaDraft(aspiranteId = userId, nombreCompleto = displayName)
        if (nuevaExperiencia.cargo.isBlank() || nuevaExperiencia.empresa.isBlank() || nuevaExperiencia.fechaInicio.isBlank()) {
            notice = "Completa cargo, empresa y fecha de inicio."
            return
        }
        val next = actual.copy(experiencias = actual.experiencias + nuevaExperiencia)
        hoja = next
        persistir(next, "Experiencia agregada correctamente.")
        nuevaExperiencia = emptyExperienceDraft()
    }

    fun eliminarExperiencia(index: Int) {
        val actual = hoja ?: return
        val next = actual.copy(experiencias = actual.experiencias.filterIndexed { current, _ -> current != index })
        hoja = next
        persistir(next, "Experiencia eliminada.")
    }

    WorkableAppScaffold(
        navController = navController,
        title = "Hoja de Vida",
        role = role,
        menuItems = aspiranteMenu
    ) {
        WorkableScrollableColumn(verticalSpacing = 14.dp) {
            if (loading) {
                Text("Cargando hoja de vida...", modifier = Modifier.padding(16.dp))
                return@WorkableScrollableColumn
            }

            WorkableSurfaceCard(contentPadding = 18.dp) {
                Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.weight(1f)) {
                        WorkablePill(text = "MI PERFIL", containerColor = Color(0xFFE0F2FE), contentColor = Color(0xFF075985))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = displayName.ifBlank { "Aspirante" }, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                        Text(text = "Mantén tu hoja de vida igual que en la versión web.", style = MaterialTheme.typography.bodyMedium, color = Color(0xFF475467))
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    WorkableSecondaryButton(text = "Ir a ofertas", onClick = { navController.navigate("aspirante/ofertas") }, modifier = Modifier.weight(1f))
                    WorkablePrimaryButton(text = if (saving) "Guardando..." else "Guardar cambios", onClick = { guardarGeneral() }, enabled = !saving, modifier = Modifier.weight(1f))
                }
            }

            if (error.isNotBlank()) {
                Text(text = error, color = Color(0xFFB42318), fontWeight = FontWeight.SemiBold)
            }
            if (notice.isNotBlank()) {
                Text(text = notice, color = Color(0xFF067647), fontWeight = FontWeight.SemiBold)
            }

            WorkableSurfaceCard(contentPadding = 18.dp) {
                WorkableSectionHeader(title = "Contacto y resumen", subtitle = "Información general de tu perfil profesional.")
                WorkableSectionDivider()
                WorkableTextField(
                    value = hoja?.resumenProfesional.orEmpty(),
                    onValueChange = { actualizarGeneral("resumenProfesional", it) },
                    label = "Resumen profesional",
                    singleLine = false,
                    maxLines = 4,
                )
                WorkableTextField(
                    value = hoja?.telefono.orEmpty(),
                    onValueChange = { actualizarGeneral("telefono", it) },
                    label = "Teléfono",
                )
                WorkableTextField(
                    value = hoja?.correoElectronico.orEmpty(),
                    onValueChange = { actualizarGeneral("correoElectronico", it) },
                    label = "Correo electrónico",
                )
                WorkableTextField(
                    value = hoja?.redSocial.orEmpty(),
                    onValueChange = { actualizarGeneral("redSocial", it) },
                    label = "Red social / LinkedIn",
                )
            }

            WorkableSurfaceCard(contentPadding = 18.dp) {
                WorkableSectionHeader(title = "Experiencia", subtitle = "Agrega tus experiencias laborales como en la web.")
                WorkableSectionDivider()
                WorkableTextField(value = nuevaExperiencia.cargo, onValueChange = { nuevaExperiencia = nuevaExperiencia.copy(cargo = it) }, label = "Cargo")
                WorkableTextField(value = nuevaExperiencia.empresa, onValueChange = { nuevaExperiencia = nuevaExperiencia.copy(empresa = it) }, label = "Empresa")
                WorkableTextField(value = nuevaExperiencia.fechaInicio, onValueChange = { nuevaExperiencia = nuevaExperiencia.copy(fechaInicio = it) }, label = "Fecha inicio (YYYY-MM-DD)")
                WorkableTextField(value = nuevaExperiencia.fechaFin, onValueChange = { nuevaExperiencia = nuevaExperiencia.copy(fechaFin = it) }, label = "Fecha fin (YYYY-MM-DD)")
                WorkableTextField(value = nuevaExperiencia.certificadoUrl, onValueChange = { nuevaExperiencia = nuevaExperiencia.copy(certificadoUrl = it) }, label = "URL certificado")
                WorkablePrimaryButton(text = "Agregar experiencia", onClick = { agregarExperiencia() }, modifier = Modifier.fillMaxWidth())

                Spacer(modifier = Modifier.height(4.dp))
                if ((hoja?.experiencias ?: emptyList()).isEmpty()) {
                    Text("No hay experiencias registradas.", color = Color.Gray)
                } else {
                    hoja?.experiencias.orEmpty().forEachIndexed { index, experiencia ->
                        WorkableSurfaceCard(contentPadding = 14.dp) {
                            Text(text = experiencia.cargo.ifBlank { "Sin cargo" }, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            Text(text = experiencia.empresa.ifBlank { "Empresa" }, color = Color.Gray)
                            Text(text = "${experiencia.fechaInicio.ifBlank { "Inicio" }} - ${experiencia.fechaFin.ifBlank { "Actualidad" }}", color = Color.Gray)
                            if (experiencia.certificadoUrl.isNotBlank()) {
                                Text(text = experiencia.certificadoUrl, color = Color(0xFF2563EB))
                            }
                            WorkableSecondaryButton(text = "Eliminar", onClick = { eliminarExperiencia(index) })
                        }
                    }
                }
            }

            WorkableSurfaceCard(contentPadding = 18.dp) {
                WorkableSectionHeader(title = "Formación", subtitle = "Registra estudios y certificados.")
                WorkableSectionDivider()
                WorkableTextField(value = nuevoEstudio.titulo, onValueChange = { nuevoEstudio = nuevoEstudio.copy(titulo = it) }, label = "Título")
                WorkableTextField(value = nuevoEstudio.institucion, onValueChange = { nuevoEstudio = nuevoEstudio.copy(institucion = it) }, label = "Institución")
                WorkableTextField(value = nuevoEstudio.nivelEducativo, onValueChange = { nuevoEstudio = nuevoEstudio.copy(nivelEducativo = it) }, label = "Nivel educativo")
                WorkableTextField(value = nuevoEstudio.fechaInicio, onValueChange = { nuevoEstudio = nuevoEstudio.copy(fechaInicio = it) }, label = "Fecha inicio (YYYY-MM-DD)")
                WorkableTextField(value = nuevoEstudio.fechaFin, onValueChange = { nuevoEstudio = nuevoEstudio.copy(fechaFin = it) }, label = "Fecha fin (YYYY-MM-DD)")
                WorkableTextField(value = nuevoEstudio.certificadoUrl, onValueChange = { nuevoEstudio = nuevoEstudio.copy(certificadoUrl = it) }, label = "URL certificado")
                WorkablePrimaryButton(text = "Agregar estudio", onClick = { agregarEstudio() }, modifier = Modifier.fillMaxWidth())

                Spacer(modifier = Modifier.height(4.dp))
                if ((hoja?.estudios ?: emptyList()).isEmpty()) {
                    Text("No hay estudios registrados.", color = Color.Gray)
                } else {
                    hoja?.estudios.orEmpty().forEachIndexed { index, estudio ->
                        WorkableSurfaceCard(contentPadding = 14.dp) {
                            Text(text = estudio.titulo.ifBlank { "Sin título" }, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            Text(text = estudio.institucion.ifBlank { "Institución" }, color = Color.Gray)
                            Text(text = "${estudio.fechaInicio.ifBlank { "Inicio" }} - ${estudio.fechaFin.ifBlank { "Actualidad" }}", color = Color.Gray)
                            if (estudio.certificadoUrl.isNotBlank()) {
                                Text(text = estudio.certificadoUrl, color = Color(0xFF2563EB))
                            }
                            WorkableSecondaryButton(text = "Eliminar", onClick = { eliminarEstudio(index) })
                        }
                    }
                }
            }
        }
    }
}

private data class StudyDraft(
    val titulo: String = "",
    val institucion: String = "",
    val nivelEducativo: String = "UNIVERSITARIO",
    val fechaInicio: String = "",
    val fechaFin: String = "",
    val certificadoUrl: String = "",
)

private data class ExperienceDraft(
    val cargo: String = "",
    val empresa: String = "",
    val fechaInicio: String = "",
    val fechaFin: String = "",
    val certificadoUrl: String = "",
)

private data class HojaVidaDraft(
    val id: Long? = null,
    val aspiranteId: Long,
    val nombreCompleto: String = "Aspirante",
    val resumenProfesional: String = "",
    val telefono: String = "",
    val correoElectronico: String = "",
    val redSocial: String = "",
    val estudios: List<StudyDraft> = emptyList(),
    val experiencias: List<ExperienceDraft> = emptyList(),
)

private fun emptyStudyDraft() = StudyDraft()

private fun emptyExperienceDraft() = ExperienceDraft()

private fun normalizeHojaVida(data: Map<String, Any?>?, aspiranteId: Long, nombreCompleto: String): HojaVidaDraft? {
    if (data == null) {
        return HojaVidaDraft(aspiranteId = aspiranteId, nombreCompleto = nombreCompleto)
    }

    val estudios = (data["estudios"] as? List<*>)?.mapNotNull { item ->
        val estudio = item as? Map<*, *> ?: return@mapNotNull null
        StudyDraft(
            titulo = estudio["titulo"] as? String ?: "",
            institucion = estudio["institucion"] as? String ?: "",
            nivelEducativo = estudio["nivelEducativo"] as? String ?: "UNIVERSITARIO",
            fechaInicio = estudio["fechaInicio"] as? String ?: "",
            fechaFin = estudio["fechaFin"] as? String ?: "",
            certificadoUrl = estudio["certificadoUrl"] as? String ?: "",
        )
    }.orEmpty()

    val experiencias = (data["experiencias"] as? List<*>)?.mapNotNull { item ->
        val experiencia = item as? Map<*, *> ?: return@mapNotNull null
        ExperienceDraft(
            cargo = experiencia["cargo"] as? String ?: "",
            empresa = experiencia["empresa"] as? String ?: "",
            fechaInicio = experiencia["fechaInicio"] as? String ?: "",
            fechaFin = experiencia["fechaFin"] as? String ?: "",
            certificadoUrl = experiencia["certificadoUrl"] as? String ?: "",
        )
    }.orEmpty()

    return HojaVidaDraft(
        id = (data["id"] as? Number)?.toLong(),
        aspiranteId = aspiranteId,
        nombreCompleto = nombreCompleto,
        resumenProfesional = data["resumenProfesional"] as? String
            ?: data["resumen"] as? String
            ?: "",
        telefono = data["telefono"] as? String ?: "",
        correoElectronico = data["correoElectronico"] as? String
            ?: data["contactoEmail"] as? String
            ?: "",
        redSocial = data["redSocial"] as? String
            ?: data["redSocial1"] as? String
            ?: "",
        estudios = estudios,
        experiencias = experiencias,
    )
}

private fun serializeHojaVida(hoja: HojaVidaDraft): Map<String, Any?> {
    val estudios = hoja.estudios.map {
        linkedMapOf(
            "titulo" to it.titulo,
            "institucion" to it.institucion,
            "nivelEducativo" to it.nivelEducativo,
            "fechaInicio" to it.fechaInicio,
            "fechaFin" to it.fechaFin,
            "certificadoUrl" to it.certificadoUrl,
        )
    }

    val experiencias = hoja.experiencias.map {
        linkedMapOf(
            "cargo" to it.cargo,
            "empresa" to it.empresa,
            "fechaInicio" to it.fechaInicio,
            "fechaFin" to it.fechaFin,
            "certificadoUrl" to it.certificadoUrl,
        )
    }

    return linkedMapOf(
        "aspirante" to linkedMapOf("id" to hoja.aspiranteId),
        "resumenProfesional" to hoja.resumenProfesional,
        "resumen" to hoja.resumenProfesional,
        "telefono" to hoja.telefono,
        "correoElectronico" to hoja.correoElectronico,
        "contactoEmail" to hoja.correoElectronico,
        "redSocial" to hoja.redSocial,
        "redSocial1" to hoja.redSocial,
        "estudios" to estudios,
        "experiencias" to experiencias,
    )
}

