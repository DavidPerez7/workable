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
import androidx.compose.foundation.border
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
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember

import androidx.compose.runtime.mutableStateListOf
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
import com.workable.mobile.ui.components.AspirantePageBackground

import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkableSelectablePill
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSectionHeader
import com.workable.mobile.ui.components.WorkableSectionDivider
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableTextField
import com.workable.mobile.ui.components.WorkableSurfaceCard
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers

private val aspiranteMenu = listOf(
    AppMenuItem("Ofertas", "aspirante/ofertas", Icons.Outlined.Search),
    AppMenuItem("Mis Postulaciones", "aspirante/postulaciones", Icons.Outlined.List),
    AppMenuItem("Hoja de Vida", "aspirante/hoja-vida", Icons.Outlined.AccountCircle),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AspirantePlainSurfaceCard(
    contentPadding: androidx.compose.ui.unit.Dp = 12.dp,
    content: @Composable () -> Unit,
) {
    androidx.compose.material3.Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            Color(0xFF6B7280)
        ),
        colors = androidx.compose.material3.CardDefaults.cardColors(containerColor = Color.White),
        elevation = androidx.compose.material3.CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        androidx.compose.foundation.layout.Column(
            modifier = Modifier.padding(contentPadding),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            content = { content() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AspirantePlainTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String? = null,
    modifier: Modifier = Modifier.fillMaxWidth(),
    singleLine: Boolean = true,
    maxLines: Int = if (singleLine) 1 else 4,
    readOnly: Boolean = false,
    enabled: Boolean = true,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
) {
    androidx.compose.material3.OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { if (label.isNotBlank()) Text(label, color = Color.Gray) },
        placeholder = placeholder?.let { { Text(it, color = Color.Gray) } },
        modifier = modifier,
        singleLine = singleLine,
        maxLines = maxLines,
        readOnly = readOnly,
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        keyboardOptions = keyboardOptions,
        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Color(0xFF6B7280),
            unfocusedBorderColor = Color(0xFF6B7280),
            focusedLabelColor = Color.Gray,
            unfocusedLabelColor = Color.Gray,
            cursorColor = com.workable.mobile.ui.theme.WorkablePrimary,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White,
            focusedTextColor = Color.Black,
            unfocusedTextColor = Color.Black,
            focusedPlaceholderColor = Color.Gray,
            unfocusedPlaceholderColor = Color.Gray,
        ),
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AspirantePlainSelectablePill(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val containerColor =
        if (selected) com.workable.mobile.ui.theme.WorkablePrimary else Color.White
    val contentColor = if (selected) Color.White else Color.Black

    androidx.compose.material3.Card(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(999.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            Color(0xFF6B7280)
        ),
        colors = androidx.compose.material3.CardDefaults.cardColors(containerColor = containerColor),
        elevation = androidx.compose.material3.CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 9.dp),
            color = contentColor,
            style = MaterialTheme.typography.labelLarge,
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AspirantePlainPrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    androidx.compose.material3.Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        elevation = androidx.compose.material3.ButtonDefaults.buttonElevation(
            defaultElevation = 0.dp,
            pressedElevation = 0.dp,
            disabledElevation = 0.dp,
        ),
        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
            containerColor = com.workable.mobile.ui.theme.WorkablePrimary,
            contentColor = Color.White,
        ),
    ) {
        Text(text)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AspirantePlainSecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    androidx.compose.material3.Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .border(
                1.dp,
                Color(0xFF6B7280),
                RoundedCornerShape(14.dp)
            ),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        elevation = androidx.compose.material3.ButtonDefaults.buttonElevation(
            defaultElevation = 0.dp,
            pressedElevation = 0.dp,
            disabledElevation = 0.dp,
        ),
        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
            containerColor = Color.White,
            contentColor = com.workable.mobile.ui.theme.WorkablePrimary,
        ),
    ) {
        Text(text)
    }
}

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
    var municipioNombre by remember { mutableStateOf("") }
    var municipioId by remember { mutableStateOf<Long?>(null) }
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

    val filteredOfertas = remember(ofertas, searchText, municipioNombre, municipioId, modalidad, experiencia, salarioMin, salarioMax) {
        ofertas.filter { oferta ->
            val titulo = (oferta["cargo"] as? String ?: "").lowercase()
            val descripcion = (oferta["descripcion"] as? String ?: "").lowercase()
            val empresa = (oferta["empresa"] as? Map<String, Any?>)?.get("nombre") as? String ?: ""
            val matchesSearch = searchText.isEmpty() ||
                titulo.contains(searchText.lowercase()) ||
                descripcion.contains(searchText.lowercase()) ||
                empresa.lowercase().contains(searchText.lowercase())

            val ofertaMunicipio = oferta["municipio"] as? Map<String, Any?>
            val ofertaMunicipioId = when (val v = ofertaMunicipio?.get("id")) {
                            is Number -> v.toLong()
                            is String -> v.toLongOrNull()
                            else -> null
                        }
                        val ofertaMunicipioNombre = ofertaMunicipio?.get("nombre") as? String
                        val matchesMunicipio = when {
                            municipioId != null -> ofertaMunicipioId == municipioId
                            municipioNombre.isBlank() -> true
                            else -> ofertaMunicipioNombre == municipioNombre
                        }

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
        AspirantePageBackground {
            WorkableScrollableColumn(verticalSpacing = 8.dp) {
                AspirantePlainSurfaceCard(contentPadding = 10.dp) {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "FILTROS DE OFERTAS",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                        Text(
                            text = "Revisa el listado y abre el detalle completo de la oferta que te interese.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color.Black
                        )
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        // Búsqueda
                        AspirantePlainTextField(
                            value = searchText,
                            onValueChange = { searchText = it },
                            label = "Nombre",
                            placeholder = "Nombre o palabra clave"
                        )

                        // Ubicación
                        DropdownFilterField(
                            label = "Ubicación",
                            value = municipioNombre,
                            placeholder = "Todos",
                            options = listOf("") + municipios.mapNotNull { it["nombre"] as? String }.filter { it.isNotBlank() },
                            expanded = municipioExpanded,
                            onExpandedChange = { municipioExpanded = it },
                            onSelected = { selected ->
                                municipioNombre = selected
                                municipioId = if (selected.isBlank()) {
                                    null
                                } else {
                                    val idAny = municipios.firstOrNull { (it["nombre"] as? String) == selected }?.get("id")
                                    when (idAny) {
                                        is Number -> idAny.toLong()
                                        is String -> idAny.toLongOrNull()
                                        else -> null
                                    }
                                }
                            }
                        )

                        // Modalidad (pills)
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text(
                                text = "Modalidad",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.Gray
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                AspirantePlainSelectablePill(
                                    text = "Todas",
                                    selected = modalidad.isBlank(),
                                    onClick = { modalidad = "" },
                                    modifier = Modifier.weight(1f)
                                )
                                AspirantePlainSelectablePill(
                                    text = "Presencial",
                                    selected = modalidad.equals("Presencial", ignoreCase = true),
                                    onClick = { modalidad = "Presencial" },
                                    modifier = Modifier.weight(1f)
                                )
                                AspirantePlainSelectablePill(
                                    text = "Remoto",
                                    selected = modalidad.equals("Remoto", ignoreCase = true),
                                    onClick = { modalidad = "Remoto" },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }

                        // Rango salarial
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            AspirantePlainTextField(
                                value = salarioMin,
                                onValueChange = { salarioMin = it },
                                label = "Rango Salarial",
                                placeholder = "Salario min",
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.weight(1f)
                            )
                            AspirantePlainTextField(
                                value = salarioMax,
                                onValueChange = { salarioMax = it },
                                label = "Salario max",
                                placeholder = "Salario max",
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.weight(1f)
                            )
                        }

                        // Botones
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            AspirantePlainPrimaryButton(
                                text = "Buscar",
                                onClick = {
                                    notice = "Filtros aplicados. ${filteredOfertas.size} ofertas encontradas."
                                    error = null
                                },
                                modifier = Modifier.weight(1f)
                            )
                            AspirantePlainSecondaryButton(
                                text = "Limpiar",
                                onClick = {
                                    searchText = ""
                                    municipioNombre = ""
                                    municipioId = null
                                    modalidad = ""
                                    experiencia = ""
                                    salarioMin = ""
                                    salarioMax = ""
                                    notice = null
                                    error = null
                                },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                AspirantePlainSurfaceCard(contentPadding = 10.dp) {
                    WorkableSectionHeader("OFERTAS DISPONIBLES", subtitle = "Revisa el listado y abre el detalle completo de la oferta que te interese.")

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
                        Text("Cargando ofertas...", modifier = Modifier.padding(12.dp))
                    } else if (filteredOfertas.isEmpty()) {
                        Text("No hay ofertas disponibles con los filtros aplicados.", modifier = Modifier.padding(12.dp))
                    } else {
                        filteredOfertas.forEach { oferta ->
                            OfertaCard(oferta = oferta, navController = navController)
                        }
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
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            fontWeight = FontWeight.SemiBold
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .border(
                    1.dp,
                    Color(0xFF6B7280),
                    RoundedCornerShape(14.dp)
                )
                .background(Color.White)
                .clickable { onExpandedChange(true) }
                .padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = if (value.isBlank()) placeholder else value,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (value.isBlank()) Color.Gray else Color.Black
                )
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = "▾",
                    color = Color(0xFF6B7280)
                )
            }

        }
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

    val municipios = remember { mutableStateListOf<com.workable.mobile.data.MunicipioDto>() }
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

    AspirantePlainSurfaceCard(contentPadding = 12.dp) {
        // Header
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = titulo, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(text = empresaNombre, style = MaterialTheme.typography.titleSmall, color = Color.Gray)
            WorkablePill(
                text = modalidad,
                containerColor = Color(0xFFEFF6FF),
                contentColor = Color(0xFF1D4ED8),
                modifier = Modifier
                    .border(1.dp, Color(0xFF6B7280), RoundedCornerShape(999.dp))
                    .clip(RoundedCornerShape(999.dp))
            )
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
                AspirantePlainSecondaryButton(
                    text = "Detalle",
                    onClick = { verDetalle() }
                )
                AspirantePlainPrimaryButton(
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
                modifier = Modifier
                    .border(1.dp, Color(0xFF6B7280), RoundedCornerShape(999.dp))
                    .clip(RoundedCornerShape(999.dp)),
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
