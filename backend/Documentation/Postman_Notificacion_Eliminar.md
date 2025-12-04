# 🗑️ ELIMINAR NOTIFICACIÓN - Documentación Postman

## 🔗 Endpoint
**DELETE** `/notificacion/{id}`

## 📋 Descripción
Elimina una notificación del sistema. Solo los administradores o el propietario de la notificación pueden eliminarla. La eliminación es física, removiendo completamente el registro.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID de la notificación a eliminar | `1` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
DELETE http://localhost:8080/api/notificacion/1
```

### Headers
```
Content-Type: application/json
```

### Body
No requiere body

---

## 📥 Response

### Success Response (204 No Content)

Sin cuerpo de respuesta. Solo confirma la eliminación.

```
HTTP 204 No Content
```

---

## 📊 Casos de Uso

### Caso 1: Eliminar Notificación Exitosamente
```
Request:
DELETE http://localhost:8080/api/notificacion/1

Response: 204 No Content
(Sin cuerpo de respuesta)
```

### Caso 2: Notificación no Encontrada
```
Request:
DELETE http://localhost:8080/api/notificacion/999

Response: 404 Not Found
{
  "mensaje": "Notificación no encontrada",
  "timestamp": "2025-12-04T10:35:00"
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
{{baseUrl}}/notificacion/{{notificacionId}}
```

O directamente:
```
http://localhost:8080/api/notificacion/1
```

### Path Variables (Tab: Params - Path)
```
Key: id
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
// Validar que la notificación ID existe
const notificacionId = pm.variables.get("notificacionId");

if (!notificacionId) {
  pm.test("ID de notificación requerido", function() {
    pm.expect(notificacionId).to.exist;
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
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `204` | No Content - Eliminación exitosa |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Permiso denegado |
| `404` | Not Found - Notificación no encontrada |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `id` es **obligatorio**
- La eliminación es **permanente** y no se puede deshacer
- Solo administradores pueden eliminar cualquier notificación
- Los usuarios solo pueden eliminar sus propias notificaciones
- El `id` debe ser un número entero positivo válido
- Esta es una eliminación física, no soft delete

---

## 🔄 Ejemplo cURL

```bash
curl -X DELETE "http://localhost:8080/api/notificacion/1" \
  -H "Content-Type: application/json"
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function eliminarNotificacion(notificacionId) {
  try {
    const response = await fetch(
      `/api/notificacion/${notificacionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 204) {
      console.log("Notificación eliminada exitosamente");
      return true;
    } else if (response.status === 404) {
      console.error("Notificación no encontrada");
      throw new Error('La notificación no existe');
    } else if (response.status === 403) {
      console.error("No tienes permisos para eliminar esta notificación");
      throw new Error('Permiso denegado');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    throw error;
  }
}

// Uso en componente React:
async function handleEliminarNotificacion(notificacionId) {
  // Mostrar confirmación
  if (window.confirm("¿Estás seguro de que deseas eliminar esta notificación? No se puede deshacer.")) {
    try {
      await eliminarNotificacion(notificacionId);
      // Actualizar UI
      setNotificaciones(notificaciones.filter(n => n.id !== notificacionId));
      alert('Notificación eliminada');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}
```

---

## 🔐 Validaciones del Backend

- Verifica que la notificación exista
- Valida permisos del usuario (solo owner o admin)
- Realiza eliminación física de la base de datos
- Registra la acción en auditoría
- Valida que el ID sea válido

---

## ⚡ Confirmación de Eliminación (Recomendado)

Antes de llamar a este endpoint, se recomienda mostrar una confirmación al usuario:

```javascript
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta notificación?</p>
        <p className="warning">Esta acción no se puede deshacer.</p>
        <div className="buttons">
          <button onClick={onCancel} className="btn-cancel">Cancelar</button>
          <button onClick={onConfirm} className="btn-delete">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
```

---

## 💡 Casos de Uso Comunes

1. **Eliminar Notificación Individual**
   - Usuario hace clic en el botón "Eliminar"
   - Mostrar confirmación
   - Llamar al endpoint
   - Actualizar lista de notificaciones

2. **Limpieza Automática**
   - Eliminar notificaciones antiguas (mayor a 30 días)
   - Ejecutado desde un job de mantenimiento
   - Llamar al endpoint para cada notificación

3. **Administración**
   - Admin elimina notificaciones incorrectas
   - Admin limpia notificaciones de spam
   - Registro en auditoría
