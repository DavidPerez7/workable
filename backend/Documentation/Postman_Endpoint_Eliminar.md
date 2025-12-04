# 🗑️ ELIMINAR POSTULACIÓN - Documentación Postman

## 🔗 Endpoint
**DELETE** `/postulacion/{id}`

## 📋 Descripción
Elimina una postulación del sistema mediante soft delete (marca como eliminada sin borrar el registro físico de la base de datos). Solo el propietario de la postulación o un administrador puede eliminarla.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID de la postulación a eliminar | `1` |

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioIdActual` | Long | ID del usuario que realiza la acción (para validar permisos) | `1` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
DELETE http://localhost:8080/api/postulacion/1?usuarioIdActual=1
```

### Headers
```
Content-Type: application/json
```

### Body
No requiere body (los parámetros van en Query y Path)

---

## 📥 Response

### Success Response (204 No Content)

Sin cuerpo de respuesta. Solo confirma la eliminación.

```
HTTP 204 No Content
```

---

## 📊 Casos de Uso

### Caso 1: Eliminar Postulación Exitosamente
```
Request:
DELETE http://localhost:8080/api/postulacion/1?usuarioIdActual=1

Response: 204 No Content
(Sin cuerpo de respuesta)
```

### Caso 2: Intentar Eliminar Postulación sin Permisos
```
Request:
DELETE http://localhost:8080/api/postulacion/5?usuarioIdActual=999

Response: 403 Forbidden
{
  "mensaje": "No tienes permisos para eliminar esta postulación",
  "timestamp": "2025-12-04T10:35:00"
}
```

### Caso 3: Postulación no Encontrada
```
Request:
DELETE http://localhost:8080/api/postulacion/999?usuarioIdActual=1

Response: 404 Not Found
{
  "mensaje": "Postulación no encontrada",
  "timestamp": "2025-12-04T10:36:00"
}
```

---

## ⚙️ Configuración en Postman

### Método
```
DELETE
```

### URL
```
{{baseUrl}}/postulacion/{{postulacionId}}
```

O directamente:
```
http://localhost:8080/api/postulacion/1
```

### Path Variables (Tab: Params - Path)
```
Key: id
Value: 1
```

### Query Parameters (Tab: Params - Query)
```
Key: usuarioIdActual
Value: 1
```

### Headers
```
Content-Type: application/json
```

### Body
```
No aplica - No se envía body
```

### Pre-request Script (Opcional)
```javascript
// Validar que la postulación existe antes de eliminar
const postulacionId = pm.variables.get("postulacionId");
const usuarioId = pm.variables.get("usuarioId");

if (!postulacionId || !usuarioId) {
  pm.test("Variables requeridas", function() {
    pm.expect(postulacionId).to.exist;
    pm.expect(usuarioId).to.exist;
  });
}
```

### Tests (Opcional)
```javascript
pm.test("Status code es 204", function() {
  pm.response.to.have.status(204);
});

pm.test("Response no tiene body", function() {
  pm.expect(pm.response.text()).to.be.empty;
});

pm.test("Headers contienen información", function() {
  pm.response.to.have.header("Content-Type");
});
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `204` | No Content - Eliminación exitosa |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No tiene permisos para eliminar |
| `404` | Not Found - Postulación no encontrada |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- Ambos parámetros son **obligatorios**
- Este es un **soft delete**: el registro no se borra físicamente, solo se marca como eliminado
- Solo el propietario o un administrador pueden eliminar
- El `usuarioIdActual` se valida para verificar permisos
- Después de eliminar, la postulación no aparecerá en listados
- El cambio se registra en auditoría del sistema

---

## 🔄 Ejemplo cURL

```bash
curl -X DELETE "http://localhost:8080/api/postulacion/1?usuarioIdActual=1" \
  -H "Content-Type: application/json"
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function eliminarPostulacion(postulacionId, usuarioId) {
  try {
    const response = await fetch(
      `/api/postulacion/${postulacionId}?usuarioIdActual=${usuarioId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 204) {
      console.log("Postulación eliminada exitosamente");
      return true;
    } else if (response.status === 403) {
      console.error("No tienes permisos para eliminar esta postulación");
      throw new Error('Permiso denegado');
    } else if (response.status === 404) {
      console.error("Postulación no encontrada");
      throw new Error('Postulación no existe');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar postulación:', error);
    throw error;
  }
}

// Uso:
async function handleDeletePostulacion() {
  try {
    await eliminarPostulacion(postulacionId, usuarioActual);
    // Actualizar UI
    setPostulaciones(postulaciones.filter(p => p.id !== postulacionId));
  } catch (error) {
    // Mostrar error al usuario
    alert('No se pudo eliminar la postulación');
  }
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario tiene permisos (es propietario o administrador)
- Valida que la postulación exista
- Realiza soft delete (marca como eliminada, no borra físicamente)
- Registra la acción en auditoría
- Puede generar notificación al usuario sobre la eliminación

---

## 💾 Comportamiento después de la Eliminación

- La postulación **no aparecerá** en listados normales
- Se mantiene en la base de datos con flag de eliminación
- Es **recuperable** mediante operaciones administrativas
- Los filtros la excluyen automáticamente

---

## ⚡ Confirmación de Eliminación (Recomendado en UI)

Antes de llamar a este endpoint, se recomienda mostrar una confirmación al usuario:

```javascript
if (window.confirm("¿Estás seguro de que deseas eliminar esta postulación? Esta acción no se puede deshacer.")) {
  await eliminarPostulacion(postulacionId, usuarioId);
}
```
