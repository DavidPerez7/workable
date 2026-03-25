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
import androidx.compose.foundation.clickable
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.IdRef
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
import com.workable.mobile.ui.components.WorkableTextField
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
    var municipios by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var notice by remember { mutableStateOf<String?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    // Filtros
    var searchText by remember { mutableStateOf("") }
    var municipio by remember { mutableStateOf("") }
    var modalidad by remember { mutableStateOf("") }
    var experiencia by remember { mutableStateOf("") }
    var salarioMin by remember { mutableStateOf("") }
    var salarioMax by remember { mutableStateOf("") }
    var showFilters by remember { mutableStateOf(false) }
    var municipioExpanded by remember { mutableStateOf(false) }
    var modalidadExpanded by remember { mutableStateOf(false) }
    var experienciaExpanded by remember { mutableStateOf(false) }

    val modalidadOptions = remember(ofertas) {
        listOf("") + ofertas.mapNotNull { it["modalidad"] as? String }.map { it.trim() }.filter { it.isNotBlank() }.distinct().sorted()
    }
    val experienciaOptions = remember(ofertas) {
        listOf("") + ofertas.mapNotNull { it["experiencia"] as? String }.map { it.trim() }.filter { it.isNotBlank() }.distinct().sorted()
    }

    val filteredOfertas = remember(ofertas, searchText, municipio, modalidad, experiencia, salarioMin, salarioMax) {
        ofertas.filter { oferta ->
            val titulo = (oferta["cargo"] as? String ?: "").lowercase()
            val descripcion = (oferta["descripcion"] as? String ?: "").lowercase()
            val empresa = (oferta["empresa"] as? Map<String, Any?>)?.get("nombre") as? String ?: ""
            val matchesSearch = searchText.isEmpty() ||
                titulo.contains(searchText.lowercase()) ||
                descripcion.contains(searchText.lowercase()) ||
                empresa.lowercase().contains(searchText.lowercase())

            val matchesMunicipio = municipio.isEmpty() ||
                (oferta["municipio"] as? Map<String, Any?>)?.get("nombre") == municipio

            val matchesModalidad = modalidad.isEmpty() ||
                (oferta["modalidad"] as? String) == modalidad

            val matchesExperiencia = experiencia.isEmpty() ||
                (oferta["experiencia"] as? String) == experiencia

            val salMin = (oferta["salarioMin"] as? Number)?.toLong() ?: 0L
            val salMax = (oferta["salarioMax"] as? Number)?.toLong() ?: 0L
            val filterSalMin = salarioMin.toLongOrNull() ?: 0L
            val filterSalMax = salarioMax.toLongOrNull() ?: Long.MAX_VALUE
            val matchesSalario = salMin >= filterSalMin && salMax <= filterSalMax

            matchesSearch && matchesMunicipio && matchesModalidad && matchesExperiencia && matchesSalario
        }
    }

    LaunchedEffect(Unit) {
        try {
            ofertas = ApiClient.ofertaService.getAll()
            municipios = ApiClient.municipioService.getMunicipios().map { mapOf("id" to it.id, "nombre" to it.nombre) }
        } catch (e: Exception) {
            error = "Error al cargar datos: ${e.message}"
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
            WorkableSurfaceCard(contentPadding = 18.dp) {
                WorkableSectionHeader("FILTRAR OFERTAS", subtitle = "")
                WorkableSecondaryButton(
                    text = if (showFilters) "Ocultar filtros" else "Mostrar filtros",
                    onClick = { showFilters = !showFilters },
                    modifier = Modifier.fillMaxWidth()
                )

                AnimatedVisibility(
                    visible = showFilters,
                    enter = expandVertically(),
                    exit = shrinkVertically()
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        WorkableTextField(
                            value = searchText,
                            onValueChange = { searchText = it },
                            label = "Buscar ofertas...",
                            placeholder = "Cargo, empresa, descripción..."
                        )

                        DropdownFilterField(
                            label = "Municipio",
                            value = municipio,
                            placeholder = if (municipios.isEmpty()) "Cargando municipios..." else "Selecciona un municipio",
                            options = listOf("") + municipios.mapNotNull { it["nombre"] as? String }.filter { it.isNotBlank() }.distinct().sorted(),
                            expanded = municipioExpanded,
                            onExpandedChange = { municipioExpanded = it },
                            onSelected = { municipio = it }
                        )

                        DropdownFilterField(
                            label = "Modalidad",
                            value = modalidad,
                            placeholder = if (modalidadOptions.size <= 1) "Sin opciones" else "Selecciona una modalidad",
                            options = modalidadOptions,
                            expanded = modalidadExpanded,
                            onExpandedChange = { modalidadExpanded = it },
                            onSelected = { modalidad = it }
                        )

                        DropdownFilterField(
                            label = "Experiencia",
                            value = experiencia,
                            placeholder = if (experienciaOptions.size <= 1) "Sin opciones" else "Selecciona experiencia",
                            options = experienciaOptions,
                            expanded = experienciaExpanded,
                            onExpandedChange = { experienciaExpanded = it },
                            onSelected = { experiencia = it }
                        )

                        WorkableTextField(
                            value = salarioMin,
                            onValueChange = { salarioMin = it },
                            label = "Salario mínimo",
                            placeholder = "Ej: 1000000",
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )

                        WorkableTextField(
                            value = salarioMax,
                            onValueChange = { salarioMax = it },
                            label = "Salario máximo",
                            placeholder = "Ej: 5000000",
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )

                        WorkablePrimaryButton(
                            text = "Buscar",
                            onClick = {
                                notice = "Filtros aplicados. ${filteredOfertas.size} ofertas encontradas."
                                error = null
                            },
                        )
                    }
                }
            }

            WorkableSurfaceCard(contentPadding = 18.dp) {
                WorkableSectionHeader("OFERTAS DISPONIBLES", subtitle = "")

                Text(
                    text = "Ajusta los filtros para reducir resultados y encontrar la oferta ideal.",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray
                )

                notice?.let {
                    Text(
                        text = it,
                        color = Color(0xFF059669),
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFD1FAE5), RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    )
                }

                error?.let {
                    Text(
                        text = it,
                        color = Color(0xFFDC2626),
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFFEE2E2), RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    )
                }

                if (loading) {
                    Text("Cargando ofertas...", modifier = Modifier.padding(16.dp))
                } else if (filteredOfertas.isEmpty()) {
                    Text("No hay ofertas disponibles con los filtros aplicados.", modifier = Modifier.padding(16.dp))
                } else {
                    filteredOfertas.forEach { oferta ->
                        OfertaCard(oferta = oferta, navController = navController)
                    }
                }
            }
        }
    }
}

@Composable
private fun DropdownFilterField(
    label: String,
    value: String,
    placeholder: String,
    options: List<String>,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    onSelected: (String) -> Unit,
) {
    Box(modifier = Modifier.fillMaxWidth()) {
        WorkableTextField(
            value = value,
            onValueChange = {},
            label = label,
            placeholder = placeholder,
            readOnly = true,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .clickable { onExpandedChange(true) }
        )

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { onExpandedChange(false) }
        ) {
            options.forEach { option ->
                val text = if (option.isBlank()) "Todos" else option
                DropdownMenuItem(
                    text = { Text(text) },
                    onClick = {
                        onSelected(option)
                        onExpandedChange(false)
                    }
                )
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
    val titulo = oferta["cargo"] as? String ?: "Sin cargo"
    val descripcion = oferta["descripcion"] as? String ?: "Sin descripción"
    val salarioMin = normalizeMoney(oferta["salarioMin"])
    val salarioMax = normalizeMoney(oferta["salarioMax"])
    val empresaMap = oferta["empresa"] as? Map<String, Any?>
    val empresaNombre = empresaMap?.get("nombre") as? String ?: "Confidencial"
    val modalidad = (oferta["modalidad"] as? String) ?: "Remoto"
    val municipio = (oferta["municipio"] as? Map<String, Any?>)?.get("nombre") as? String ?: "Ubicación desconocida"
    val experiencia = (oferta["experiencia"] as? String) ?: "Sin especificar"

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
        // Por ahora, mostrar toast. En el futuro, navegar a pantalla de detalle
        Toast.makeText(context, "Detalle de oferta: $titulo", Toast.LENGTH_SHORT).show()
    }

    WorkableSurfaceCard(contentPadding = 18.dp) {
        // Header
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = titulo, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(text = empresaNombre, style = MaterialTheme.typography.titleSmall, color = Color.Gray)
            WorkablePill(text = modalidad, containerColor = Color(0xFFEFF6FF), contentColor = Color(0xFF1D4ED8))
        }

        // Footer
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom
        ) {
            // Salary
            Text(
                text = "$$salarioMin - $$salarioMax",
                style = MaterialTheme.typography.labelLarge,
                color = Color(0xFF059669),
                fontWeight = FontWeight.Bold
            )

            // Meta
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = municipio,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF64748B)
                )
                Text(
                    text = experiencia,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF64748B)
                )
            }

            // Actions
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                WorkableSecondaryButton(
                    text = "Detalle",
                    onClick = { verDetalle() }
                )
                WorkablePrimaryButton(
                    text = if (applying) "Enviando..." else "Postularme",
                    onClick = { postularse() },
                    enabled = !applying
                )
            }
        }
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

