package com.workable.mobile.ui.pages.admin

import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.workable.mobile.data.ApiClient
import com.workable.mobile.data.SessionManager
import com.workable.mobile.ui.components.WorkableHeroCard
import com.workable.mobile.ui.components.WorkableMetricCard
import com.workable.mobile.ui.components.WorkablePageBackground
import com.workable.mobile.ui.components.WorkablePill
import com.workable.mobile.ui.components.WorkablePrimaryButton
import com.workable.mobile.ui.components.WorkableScrollableColumn
import com.workable.mobile.ui.components.WorkableSecondaryButton
import com.workable.mobile.ui.components.WorkableSectionDivider
import com.workable.mobile.ui.components.WorkableSectionHeader
import com.workable.mobile.ui.components.WorkableSurfaceCard
import com.workable.mobile.ui.components.WorkableTextField
import kotlinx.coroutines.launch

private data class AdminModuleSpec(
    val title: String,
    val route: String,
    val subtitle: String,
)

private fun authHeader(context: Context): String? {
    val token = SessionManager.getToken(context)
    return token?.let { "Bearer $it" }
}

private fun prettyLabel(key: String): String {
    return key
        .replace(Regex("([A-Z])"), " $1")
        .replace("_", " ")
        .trim()
        .replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
}

private fun normalizeValue(value: Any?): String {
    return when (value) {
        null -> ""
        is Boolean -> if (value) "Sí" else "No"
        is Number -> if (value.toDouble() % 1.0 == 0.0) value.toLong().toString() else value.toString()
        is Map<*, *> -> {
            value["nombre"]?.toString()
                ?: value["titulo"]?.toString()
                ?: value["correo"]?.toString()
                ?: value["id"]?.toString()
                ?: value.toString()
        }
        is List<*> -> "${value.size} items"
        else -> value.toString()
    }
}

private fun stringifyItem(item: Map<String, Any?>): String {
    val keys = listOf("nombre", "apellido", "correo", "titulo", "estado", "telefono", "rol", "departamento")
    val preferred = keys.mapNotNull { key -> item[key]?.takeIf { it.toString().isNotBlank() } }.firstOrNull()
    if (preferred != null) return normalizeValue(preferred)

    val firstPrimitive = item.entries.firstOrNull { entry ->
        entry.value == null || entry.value is String || entry.value is Number || entry.value is Boolean
    }
    return firstPrimitive?.let { normalizeValue(it.value) } ?: "#${item["id"] ?: "sin-id"}"
}

private fun extractId(item: Map<String, Any?>): Long? {
    return when (val value = item["id"]) {
        is Number -> value.toLong()
        is String -> value.toLongOrNull()
        else -> null
    }
}

private fun deepCopyValue(value: Any?): Any? {
    return when (value) {
        null -> null
        is Map<*, *> -> value.entries.associate { (key, item) -> key.toString() to deepCopyValue(item) }.toMutableMap()
        is List<*> -> value.map { deepCopyValue(it) }.toMutableList()
        else -> value
    }
}

private fun getValueAtPath(source: Any?, path: List<Any>): Any? {
    var current = source
    for (segment in path) {
        current = when {
            current is Map<*, *> && segment is String -> current[segment]
            current is List<*> && segment is Int -> current.getOrNull(segment)
            else -> return null
        }
    }
    return current
}

private fun setValueAtPath(source: Any?, path: List<Any>, newValue: Any?): Any? {
    val copy = deepCopyValue(source)
    if (copy == null) return null
    if (path.isEmpty()) return deepCopyValue(newValue)

    var current: Any? = copy
    for (index in 0 until path.lastIndex) {
        val segment = path[index]
        val nextSegment = path[index + 1]
        current = when {
            current is MutableMap<*, *> && segment is String -> {
                val map = current as MutableMap<String, Any?>
                val nextValue = map[segment]
                if (nextValue == null) {
                    val created: Any? = if (nextSegment is Int) mutableListOf<Any?>() else mutableMapOf<String, Any?>()
                    map[segment] = created
                    created
                } else {
                    nextValue
                }
            }
            current is MutableList<*> && segment is Int -> {
                val list = current as MutableList<Any?>
                while (list.size <= segment) list.add(null)
                var nextValue = list[segment]
                if (nextValue == null) {
                    nextValue = if (nextSegment is Int) mutableListOf<Any?>() else mutableMapOf<String, Any?>()
                    list[segment] = nextValue
                }
                nextValue
            }
            else -> return copy
        }
    }

    when {
        current is MutableMap<*, *> && path.last() is String -> {
            (current as MutableMap<String, Any?>)[path.last() as String] = deepCopyValue(newValue)
        }
        current is MutableList<*> && path.last() is Int -> {
            val list = current as MutableList<Any?>
            val index = path.last() as Int
            while (list.size <= index) list.add(null)
            list[index] = deepCopyValue(newValue)
        }
    }

    return copy
}

private fun deleteValueAtPath(source: Any?, path: List<Any>): Any? {
    val copy = deepCopyValue(source)
    if (copy == null || path.isEmpty()) return copy

    var current: Any? = copy
    for (index in 0 until path.lastIndex) {
        val segment = path[index]
        current = when {
            current is MutableMap<*, *> && segment is String -> (current as MutableMap<String, Any?>)[segment]
            current is MutableList<*> && segment is Int -> (current as MutableList<Any?>).getOrNull(segment)
            else -> return copy
        }
    }

    when {
        current is MutableMap<*, *> && path.last() is String -> {
            (current as MutableMap<String, Any?>).remove(path.last() as String)
        }
        current is MutableList<*> && path.last() is Int -> {
            val list = current as MutableList<Any?>
            val index = path.last() as Int
            if (index in list.indices) {
                list.removeAt(index)
            }
        }
    }

    return copy
}

private fun mergeTemplate(template: Any?, current: Any?): Any? {
    return when (template) {
        is Map<*, *> -> {
            val templateMap = template as Map<String, Any?>
            val currentMap = current as? Map<String, Any?>
            templateMap.mapValues { (key, templateValue) ->
                mergeTemplate(templateValue, currentMap?.get(key))
            }.toMutableMap()
        }
        is List<*> -> {
            val templateList = template
            val currentList = current as? List<*>
            val sourceList = if (!currentList.isNullOrEmpty()) currentList else templateList
            val templateItem = templateList.firstOrNull()
            sourceList.map { item ->
                mergeTemplate(templateItem ?: item, item)
            }.toMutableList()
        }
        else -> current ?: template
    }
}

private fun coerceToTemplate(template: Any?, current: Any?): Any? {
    return when (template) {
        is Map<*, *> -> {
            val templateMap = template as Map<String, Any?>
            val currentMap = current as? Map<String, Any?>
            templateMap.mapValues { (key, templateValue) ->
                coerceToTemplate(templateValue, currentMap?.get(key))
            }.toMutableMap()
        }
        is List<*> -> {
            val templateList = template
            val currentList = current as? List<*>
            val currentItems = currentList ?: emptyList<Any?>()
            val templateItem = templateList.firstOrNull()
            currentItems.map { item ->
                coerceToTemplate(templateItem ?: item, item)
            }.toMutableList()
        }
        is Number -> {
            when (current) {
                is Number -> if (template is Double || template is Float) current.toDouble() else current.toLong()
                is String -> {
                    if (template is Double || template is Float) current.toDoubleOrNull() ?: template
                    else current.toLongOrNull() ?: template
                }
                else -> template
            }
        }
        is Boolean -> when (current) {
            is Boolean -> current
            is String -> current.equals("true", ignoreCase = true) || current == "1" || current.equals("si", ignoreCase = true)
            else -> template
        }
        else -> if (current == null || current == "") template else current
    }
}

private fun getFieldOptions(fieldName: String, entityName: String): List<String>? {
    val normalizedEntity = entityName.lowercase()
    val optionsByField = mapOf(
        "genero" to listOf("MASCULINO", "FEMENINO", "OTRO"),
        "rol" to listOf("ADMIN", "RECLUTADOR", "ASPIRANTE"),
        "modalidad" to listOf("PRESENCIAL", "REMOTO", "HIBRIDO"),
        "nivelExperiencia" to listOf("SIN_EXPERIENCIA", "BASICO", "INTERMEDIO", "AVANZADO", "EXPERTO"),
        "tipoContrato" to listOf("TIEMPO_COMPLETO", "MEDIO_TIEMPO", "TEMPORAL", "PRESTACION_SERVICIOS", "PRACTICAS"),
        "nivelEducativo" to listOf("PRIMARIA", "BACHILLERATO", "TECNICO", "TECNOLOGO", "LICENCIATURA", "UNIVERSITARIO", "ESPECIALIZACION", "MAESTRIA", "DOCTORADO"),
        "estadoCitacion" to listOf("PENDIENTE", "CONFIRMADA", "CANCELADA"),
    )

    if (fieldName == "estado") {
        if (normalizedEntity.contains("oferta")) return listOf("ACTIVA", "INACTIVA", "FINALIZADA")
        if (normalizedEntity.contains("postul")) return listOf("PENDIENTE", "RECHAZADO", "ACEPTADO", "ENTREVISTA_PROGRAMADA")
    }

    return optionsByField[fieldName]
}

private fun shouldUseTextarea(fieldName: String): Boolean {
    return fieldName in setOf("descripcion", "requisitos", "resumenProfesional", "ubicacion")
}

@Composable
private fun FormValueField(
    fieldName: String,
    value: Any?,
    entityName: String,
    onValueChange: (Any?) -> Unit,
    modifier: Modifier = Modifier,
) {
    val options = getFieldOptions(fieldName, entityName)
    WorkableTextField(
        value = value?.toString().orEmpty(),
        onValueChange = onValueChange,
        label = prettyLabel(fieldName),
        modifier = modifier,
        singleLine = !shouldUseTextarea(fieldName),
        maxLines = if (shouldUseTextarea(fieldName)) 4 else 1,
        placeholder = when {
            options != null -> "Opciones: ${options.joinToString(", ")}"
            shouldUseTextarea(fieldName) -> "Escribe el valor"
            else -> null
        },
    )
}

@Composable
private fun RenderValueNode(
    fieldName: String,
    value: Any?,
    entityName: String,
    onValueChange: (Any?) -> Unit,
    modifier: Modifier = Modifier,
) {
    when (value) {
        is Map<*, *> -> {
            val currentMap = value as Map<String, Any?>
            WorkableSurfaceCard(modifier = modifier, contentPadding = 16.dp) {
                Text(
                    text = prettyLabel(fieldName),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                    text = "Relación u objeto anidado",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                currentMap.forEach { (key, childValue) ->
                    RenderValueNode(
                        fieldName = key,
                        value = childValue,
                        entityName = entityName,
                        onValueChange = { newChild ->
                            onValueChange(setValueAtPath(currentMap, listOf(key), newChild))
                        },
                        modifier = Modifier.padding(top = 10.dp),
                    )
                }
            }
        }
        is List<*> -> {
            val currentList = value as List<Any?>
            val sampleItem = currentList.firstOrNull()
            WorkableSurfaceCard(modifier = modifier, contentPadding = 16.dp) {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = prettyLabel(fieldName),
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                        )
                        Text(
                            text = "Lista editable",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    TextButton(onClick = {
                        val nextItem = deepCopyValue(sampleItem) ?: ""
                        onValueChange(currentList.toMutableList().apply { add(nextItem) })
                    }) {
                        Text("Agregar")
                    }
                }

                currentList.forEachIndexed { index, item ->
                    Spacer(modifier = Modifier.size(4.dp))
                    WorkableSurfaceCard(contentPadding = 14.dp) {
                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text(
                                text = "${prettyLabel(fieldName)} #${index + 1}",
                                style = MaterialTheme.typography.titleSmall,
                                color = MaterialTheme.colorScheme.onSurface,
                            )
                            TextButton(onClick = {
                                val nextList = currentList.toMutableList().apply { removeAt(index) }
                                onValueChange(nextList)
                            }) {
                                Text("Quitar")
                            }
                        }
                        RenderValueNode(
                            fieldName = fieldName,
                            value = item,
                            entityName = entityName,
                            onValueChange = { newItem ->
                                val nextList = currentList.toMutableList().apply { set(index, newItem) }
                                onValueChange(nextList)
                            },
                            modifier = Modifier.padding(top = 6.dp),
                        )
                    }
                }
            }
        }
        else -> {
            FormValueField(
                fieldName = fieldName,
                value = value,
                entityName = entityName,
                onValueChange = onValueChange,
                modifier = modifier,
            )
        }
    }
}

@Composable
private fun RenderFormFields(
    data: Map<String, Any?>,
    entityName: String,
    onDataChange: (Map<String, Any?>) -> Unit,
) {
    data.forEach { (fieldName, value) ->
        RenderValueNode(
            fieldName = fieldName,
            value = value,
            entityName = entityName,
            onValueChange = { newValue ->
                val nextData = setValueAtPath(data, listOf(fieldName), newValue) as? Map<String, Any?>
                if (nextData != null) {
                    onDataChange(nextData)
                }
            },
            modifier = Modifier.padding(bottom = 12.dp),
        )
    }
}

@Composable
private fun DetailTextBlock(title: String, value: Any?) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = prettyLabel(title),
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Text(
            text = normalizeValue(value),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

@Composable
private fun DetailNode(title: String, value: Any?) {
    when (value) {
        is Map<*, *> -> {
            val mapValue = value as Map<String, Any?>
            WorkableSurfaceCard(contentPadding = 16.dp) {
                Text(
                    text = prettyLabel(title),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                mapValue.forEach { (key, child) ->
                    DetailNode(key, child)
                }
            }
        }
        is List<*> -> {
            val listValue = value as List<Any?>
            WorkableSurfaceCard(contentPadding = 16.dp) {
                Text(
                    text = prettyLabel(title),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                listValue.forEachIndexed { index, child ->
                    DetailNode("${title} ${index + 1}", child)
                }
            }
        }
        else -> DetailTextBlock(title, value)
    }
}

@Composable
private fun AdminCrudScreen(
    title: String,
    subtitle: String,
    entityName: String,
    samplePayload: Map<String, Any?>,
    onBack: () -> Unit,
    loadAll: suspend (String?) -> List<Map<String, Any?>>,
    loadById: suspend (String?, Long) -> Map<String, Any?>,
    createItem: suspend (String?, Map<String, Any?>) -> Map<String, Any?>,
    updateItem: suspend (String?, Long, Map<String, Any?>) -> Map<String, Any?>,
    deleteItem: suspend (String?, Long) -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val auth = authHeader(context)

    var items by remember { mutableStateOf<List<Map<String, Any?>>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var query by remember { mutableStateOf("") }
    var editorOpen by remember { mutableStateOf(false) }
    var editorMode by remember { mutableStateOf("create") }
    var detailItem by remember { mutableStateOf<Map<String, Any?>?>(null) }
    var deleteTarget by remember { mutableStateOf<Map<String, Any?>?>(null) }
    var selectedId by remember { mutableStateOf<Long?>(null) }
    var formData by remember { mutableStateOf<Any?>(deepCopyValue(samplePayload)) }

    val filteredItems = remember(items, query) {
        val normalizedQuery = query.trim().lowercase()
        if (normalizedQuery.isBlank()) items
        else items.filter { item -> item.toString().lowercase().contains(normalizedQuery) }
    }

    val metrics = remember(items, filteredItems) {
        listOf(
            "Total" to items.size,
            "Visibles" to filteredItems.size,
            "Con ID" to items.count { it["id"] != null },
            "Con estado" to items.count { it["estado"] != null || it["isActive"] != null },
        )
    }

    fun reload() {
        scope.launch {
            loading = true
            error = null
            try {
                items = loadAll(auth)
            } catch (exception: Exception) {
                error = exception.message ?: "Error al cargar $entityName"
                items = emptyList()
            } finally {
                loading = false
            }
        }
    }

    fun openCreate() {
        editorMode = "create"
        selectedId = null
        detailItem = null
        formData = deepCopyValue(samplePayload)
        editorOpen = true
    }

    fun openEdit(item: Map<String, Any?>) {
        editorMode = "edit"
        detailItem = null
        selectedId = extractId(item)
        formData = mergeTemplate(samplePayload, item)
        editorOpen = true
    }

    fun saveItem() {
        scope.launch {
            val payloadSource = formData as? Map<String, Any?>
            if (payloadSource == null) {
                error = "Formulario inválido"
                return@launch
            }

            val payload = coerceToTemplate(samplePayload, payloadSource) as? Map<String, Any?>
            if (payload == null) {
                error = "No se pudo construir el payload"
                return@launch
            }

            try {
                loading = true
                error = null
                if (editorMode == "create") {
                    createItem(auth, payload)
                } else {
                    val id = selectedId
                    if (id == null) {
                        error = "No se encontró el ID del registro"
                        loading = false
                        return@launch
                    }
                    updateItem(auth, id, payload)
                }
                Toast.makeText(context, "$title guardado", Toast.LENGTH_SHORT).show()
                editorOpen = false
                reload()
            } catch (exception: Exception) {
                error = exception.message ?: "Error al guardar $entityName"
            } finally {
                loading = false
            }
        }
    }

    fun deleteSelected() {
        val target = deleteTarget ?: return
        val id = extractId(target) ?: return
        scope.launch {
            try {
                loading = true
                error = null
                deleteItem(auth, id)
                deleteTarget = null
                detailItem = null
                Toast.makeText(context, "$title eliminado", Toast.LENGTH_SHORT).show()
                reload()
            } catch (exception: Exception) {
                error = exception.message ?: "Error al eliminar $entityName"
            } finally {
                loading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        reload()
    }

    WorkablePageBackground {
        WorkableScrollableColumn(verticalSpacing = 12.dp) {
            WorkableHeroCard(
                title = title,
                subtitle = subtitle,
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    WorkableSecondaryButton(
                        text = "Volver",
                        onClick = onBack,
                        modifier = Modifier.weight(1f),
                    )
                    WorkablePrimaryButton(
                        text = "Nuevo",
                        onClick = { openCreate() },
                        modifier = Modifier.weight(1f),
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    metrics.forEach { (label, value) ->
                        WorkableMetricCard(
                            value = value.toString(),
                            label = label,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }

            WorkableSectionHeader(
                title = "Listado",
                subtitle = "Busca, crea, edita y elimina registros desde una sola pantalla.",
            )

            WorkableTextField(
                value = query,
                onValueChange = { query = it },
                label = "Buscar",
                placeholder = "Filtra por cualquier campo",
            )

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                WorkablePrimaryButton(
                    text = if (loading) "Cargando" else "Recargar",
                    onClick = { reload() },
                    modifier = Modifier.weight(1f),
                    enabled = !loading,
                )
                WorkableSecondaryButton(
                    text = "Limpiar",
                    onClick = { query = "" },
                    modifier = Modifier.weight(1f),
                    enabled = query.isNotBlank(),
                )
            }

            if (error != null) {
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = error.orEmpty(),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.error,
                    )
                }
            }

            if (editorOpen && formData is Map<*, *>) {
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = if (editorMode == "create") "Nuevo $entityName" else "Editar $entityName",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = "Formularios compactos, con la misma estructura funcional del admin web.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.size(4.dp))
                    RenderFormFields(
                        data = formData as Map<String, Any?>,
                        entityName = entityName,
                        onDataChange = { formData = it },
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                        WorkableSecondaryButton(
                            text = "Cancelar",
                            onClick = {
                                editorOpen = false
                                detailItem = null
                                formData = deepCopyValue(samplePayload)
                            },
                            modifier = Modifier.weight(1f),
                        )
                        WorkablePrimaryButton(
                            text = "Guardar",
                            onClick = { saveItem() },
                            modifier = Modifier.weight(1f),
                            enabled = !loading,
                        )
                    }
                }
            }

            if (detailItem != null) {
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = "Detalle",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = stringifyItem(detailItem!!),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    detailItem!!.forEach { (key, value) ->
                        DetailNode(key, value)
                    }
                    WorkableSecondaryButton(
                        text = "Cerrar detalle",
                        onClick = { detailItem = null },
                    )
                }
            }

            WorkableSectionDivider()

            if (loading && items.isEmpty()) {
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = "Cargando registros...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            filteredItems.forEach { item ->
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = stringifyItem(item),
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = item.toString(),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        WorkableSecondaryButton(
                            text = "Ver",
                            onClick = {
                                scope.launch {
                                    try {
                                        val id = extractId(item)
                                        detailItem = if (id != null) loadById(auth, id) else item
                                    } catch (_: Exception) {
                                        detailItem = item
                                    }
                                }
                            },
                            modifier = Modifier.weight(1f),
                        )
                        WorkableSecondaryButton(
                            text = "Editar",
                            onClick = { openEdit(item) },
                            modifier = Modifier.weight(1f),
                        )
                        WorkableSecondaryButton(
                            text = "Eliminar",
                            onClick = { deleteTarget = item },
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }

            if (!loading && filteredItems.isEmpty()) {
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = "No hay registros para mostrar.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }

    if (deleteTarget != null) {
        AlertDialog(
            onDismissRequest = { deleteTarget = null },
            confirmButton = {
                TextButton(onClick = { deleteSelected() }) {
                    Text("Eliminar")
                }
            },
            dismissButton = {
                TextButton(onClick = { deleteTarget = null }) {
                    Text("Cancelar")
                }
            },
            title = { Text("Eliminar registro") },
            text = { Text("Esta acción no se puede deshacer.") },
        )
    }
}

@Composable
fun AdminAspirantesScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Aspirantes",
        subtitle = "CRUD completo para aspirantes, con formularios compactos y relaciones JSON como en la web.",
        entityName = "aspirante",
        samplePayload = linkedMapOf(
            "nombre" to "",
            "apellido" to "",
            "correo" to "",
            "telefono" to "",
            "fechaNacimiento" to "1990-01-01",
            "genero" to "MASCULINO",
            "password" to "",
            "municipio" to linkedMapOf("id" to 1),
            "urlFotoPerfil" to "",
            "ubicacion" to "",
            "rol" to "ASPIRANTE",
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getAspirantes(it) },
        loadById = { auth, id -> service.getAspirante(auth, id) },
        createItem = { auth, payload -> service.createAspirante(auth, payload) },
        updateItem = { auth, id, payload -> service.updateAspirante(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteAspirante(auth, id) },
    )
}

@Composable
fun AdminAdministradoresScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Administradores",
        subtitle = "CRUD completo para administradores.",
        entityName = "administrador",
        samplePayload = linkedMapOf(
            "nombre" to "",
            "apellido" to "",
            "correo" to "",
            "telefono" to "",
            "fechaNacimiento" to "1990-01-01",
            "genero" to "MASCULINO",
            "password" to "",
            "municipio" to linkedMapOf("id" to 1),
            "urlFotoPerfil" to "",
            "ubicacion" to "",
            "rol" to "ADMIN",
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getAdministradores(it) },
        loadById = { auth, id -> service.getAdministrador(auth, id) },
        createItem = { auth, payload -> service.createAdministrador(auth, payload) },
        updateItem = { auth, id, payload -> service.updateAdministrador(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteAdministrador(auth, id) },
    )
}

@Composable
fun AdminReclutadoresScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Reclutadores",
        subtitle = "CRUD completo para reclutadores y su empresa asociada.",
        entityName = "reclutador",
        samplePayload = linkedMapOf(
            "nombre" to "",
            "apellido" to "",
            "correo" to "",
            "telefono" to "",
            "fechaNacimiento" to "1990-01-01",
            "genero" to "FEMENINO",
            "password" to "",
            "municipio" to linkedMapOf("id" to 1),
            "empresa" to linkedMapOf("id" to 1),
            "rol" to "RECLUTADOR",
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getReclutadores(it) },
        loadById = { auth, id -> service.getReclutador(auth, id) },
        createItem = { auth, payload -> service.createReclutador(auth, payload) },
        updateItem = { auth, id, payload -> service.updateReclutador(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteReclutador(auth, id) },
    )
}

@Composable
fun AdminEmpresasScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Empresas",
        subtitle = "CRUD completo para empresas con su catálogo de categorías.",
        entityName = "empresa",
        samplePayload = linkedMapOf(
            "nombre" to "",
            "descripcion" to "",
            "nit" to "",
            "emailContacto" to "",
            "telefonoContacto" to "",
            "numeroTrabajadores" to 1,
            "website" to "",
            "logoUrl" to "",
            "razonSocial" to "",
            "municipio" to linkedMapOf("id" to 1),
            "categories" to mutableListOf<String>(),
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getEmpresas(it) },
        loadById = { auth, id -> service.getEmpresa(auth, id) },
        createItem = { auth, payload -> service.createEmpresa(auth, payload) },
        updateItem = { auth, id, payload -> service.updateEmpresa(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteEmpresa(auth, id) },
    )
}

@Composable
fun AdminOfertasScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Ofertas",
        subtitle = "CRUD completo para ofertas laborales.",
        entityName = "oferta",
        samplePayload = linkedMapOf(
            "titulo" to "",
            "descripcion" to "",
            "requisitos" to "",
            "empresa" to linkedMapOf("id" to 1),
            "salario" to 0,
            "numeroVacantes" to 1,
            "modalidad" to "PRESENCIAL",
            "nivelExperiencia" to "SIN_EXPERIENCIA",
            "tipoContrato" to "TIEMPO_COMPLETO",
            "fechaPublicacion" to "2026-03-19",
            "fechaLimite" to "2026-04-18",
            "estado" to "ABIERTA",
            "municipio" to linkedMapOf("id" to 1),
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getOfertas(it) },
        loadById = { auth, id -> service.getOferta(auth, id) },
        createItem = { auth, payload -> service.createOferta(auth, payload) },
        updateItem = { auth, id, payload -> service.updateOferta(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteOferta(auth, id) },
    )
}

@Composable
fun AdminPostulacionesScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Postulaciones",
        subtitle = "CRUD completo para postulaciones entre aspirantes y ofertas.",
        entityName = "postulación",
        samplePayload = linkedMapOf(
            "aspirante" to linkedMapOf("id" to 1),
            "oferta" to linkedMapOf("id" to 1),
            "estado" to "PENDIENTE",
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getPostulaciones(it) },
        loadById = { auth, id -> service.getPostulacion(auth, id) },
        createItem = { auth, payload -> service.createPostulacion(auth, payload) },
        updateItem = { auth, id, payload -> service.updatePostulacion(auth, id, payload) },
        deleteItem = { auth, id -> service.deletePostulacion(auth, id) },
    )
}

@Composable
fun AdminHojasDeVidaScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Hojas de vida",
        subtitle = "CRUD completo para hojas de vida y sus listas de estudios y experiencias.",
        entityName = "hoja de vida",
        samplePayload = linkedMapOf(
            "resumenProfesional" to "",
            "redSocial" to "",
            "correoElectronico" to "",
            "telefono" to "",
            "aspirante" to linkedMapOf("id" to 1),
            "estudios" to mutableListOf(
                linkedMapOf(
                    "titulo" to "",
                    "institucion" to "",
                    "nivelEducativo" to "TECNICO",
                    "fechaInicio" to "2026-03-19",
                    "fechaFin" to "",
                    "certificadoUrl" to "",
                )
            ),
            "experiencias" to mutableListOf(
                linkedMapOf(
                    "cargo" to "",
                    "empresa" to "",
                    "fechaInicio" to "2026-03-19",
                    "fechaFin" to "",
                    "certificadoUrl" to "",
                )
            ),
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getHojasDeVida(it) },
        loadById = { auth, id -> service.getHojaDeVida(auth, id) },
        createItem = { auth, payload -> service.createHojaDeVida(auth, payload) },
        updateItem = { auth, id, payload -> service.updateHojaDeVida(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteHojaDeVida(auth, id) },
    )
}

@Composable
fun AdminMunicipiosScreen(navController: NavController) {
    val service = remember { ApiClient.adminCrudService }
    AdminCrudScreen(
        title = "Municipios",
        subtitle = "CRUD completo para municipios.",
        entityName = "municipio",
        samplePayload = linkedMapOf(
            "id" to 1,
            "nombre" to "",
            "departamento" to "BOGOTA_DC",
        ),
        onBack = { navController.popBackStack() },
        loadAll = { service.getMunicipios(it) },
        loadById = { auth, id -> service.getMunicipio(auth, id) },
        createItem = { auth, payload -> service.createMunicipio(auth, payload) },
        updateItem = { auth, id, payload -> service.updateMunicipio(auth, id, payload) },
        deleteItem = { auth, id -> service.deleteMunicipio(auth, id) },
    )
}

@Composable
fun AdminHubScreen(navController: NavController) {
    val modules = remember {
        listOf(
            AdminModuleSpec("Aspirantes", "admin/aspirantes", "Usuarios aspirantes y su información base."),
            AdminModuleSpec("Administradores", "admin/administradores", "Accesos internos y cuentas administrativas."),
            AdminModuleSpec("Reclutadores", "admin/reclutadores", "Usuarios empresa con permisos de publicación."),
            AdminModuleSpec("Empresas", "admin/empresas", "Perfil corporativo, categorías y contacto."),
            AdminModuleSpec("Ofertas", "admin/ofertas", "Vacantes y estados de publicación."),
            AdminModuleSpec("Postulaciones", "admin/postulaciones", "Seguimiento del flujo de aplicación."),
            AdminModuleSpec("Hojas de vida", "admin/hojas-de-vida", "CVs completos con estudios y experiencia."),
            AdminModuleSpec("Municipios", "admin/municipios", "Catálogo base de ubicaciones."),
        )
    }

    WorkablePageBackground {
        WorkableScrollableColumn(verticalSpacing = 12.dp) {
            WorkableHeroCard(
                title = "Panel administrativo",
                subtitle = "Todas las pantallas CRUD del admin web, compactadas y adaptadas a móvil.",
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    WorkablePill(text = "ADMIN", modifier = Modifier.weight(1f))
                    WorkablePill(text = "Mobile", modifier = Modifier.weight(1f))
                }
            }

            WorkableSectionHeader(
                title = "Módulos",
                subtitle = "Abre cualquier CRUD desde aquí.",
            )

            modules.forEach { module ->
                WorkableSurfaceCard(contentPadding = 16.dp) {
                    Text(
                        text = module.title,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = module.subtitle,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    WorkablePrimaryButton(
                        text = "Abrir",
                        onClick = { navController.navigate(module.route) },
                    )
                }
            }

            WorkableSectionDivider()
        }
    }
}
