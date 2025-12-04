# 📝 ACTUALIZAR NOTIFICACIÓN - Documentación Postman

## 🔗 Endpoint
**PUT** `/notificacion/{id}`

## 📋 Descripción
Actualiza los datos de una notificación existente. Permite modificar título, descripción, tipo, estado de lectura y si está activa.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID de la notificación a actualizar | `1` |

### Request Body (Requerido)

```json
{
  "titulo": "Oferta Actualizada",
  "descripcion": "La oferta ha sido actualizada con nuevos requisitos",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Campos del Body:**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `titulo` | String | Título de la notificación | `Oferta Actualizada` |
| `descripcion` | String | Descripción detallada | `La oferta ha sido actualizada...` |
| `tipo` | String | Tipo de notificación | `NUEVA_OFERTA` |
| `leida` | Boolean | Si ha sido leída | `false` |
| `activa` | Boolean | Si está activa | `true` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
PUT http://localhost:8080/api/notificacion/1
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "titulo": "Oferta Actualizada",
  "descripcion": "La oferta ha sido actualizada con nuevos requisitos",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

---

## 📥 Response

### Success Response (200 OK)

```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Oferta Actualizada",
  "descripcion": "La oferta ha sido actualizada con nuevos requisitos",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

## 📊 Casos de Uso

### Caso 1: Actualizar Descripción de Notificación
```
Request:
PUT http://localhost:8080/api/notificacion/1

Body:
{
  "titulo": "Oferta de Desarrollador Senior",
  "descripcion": "Actualizado: Se requiere experiencia en AWS",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}

Response: 200 OK
{
  "id": 1,
  "usuarioDestino": {"id": 1, "nombre": "Juan Pérez"},
  "titulo": "Oferta de Desarrollador Senior",
  "descripcion": "Actualizado: Se requiere experiencia en AWS",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

### Caso 2: Cambiar Tipo de Notificación
```
Request:
PUT http://localhost:8080/api/notificacion/2

Body:
{
  "titulo": "Tu Postulación",
  "descripcion": "Tu postulación fue rechazada",
  "tipo": "CAMBIO_ESTADO",
  "leida": false,
  "activa": true
}

Response: 200 OK
{
  "id": 2,
  "usuarioDestino": {"id": 2, "nombre": "María García"},
  "titulo": "Tu Postulación",
  "descripcion": "Tu postulación fue rechazada",
  "tipo": "CAMBIO_ESTADO",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-03T14:20:00"
}
```

### Caso 3: Desactivar Notificación
```
Request:
PUT http://localhost:8080/api/notificacion/3

Body:
{
  "titulo": "Recordatorio",
  "descripcion": "Recordatorio antiguo",
  "tipo": "RECORDATORIO",
  "leida": true,
  "activa": false
}

Response: 200 OK
{
  "id": 3,
  "usuarioDestino": {"id": 1, "nombre": "Juan Pérez"},
  "titulo": "Recordatorio",
  "descripcion": "Recordatorio antiguo",
  "tipo": "RECORDATORIO",
  "leida": true,
  "activa": false,
  "fechaCreacion": "2025-12-02T09:15:00"
}
```

---

## ⚙️ Configuración en Postman

### Método
```
PUT
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

### Headers (Tab: Headers)
```
Content-Type: application/json
```

### Body (Tab: raw - JSON)
```json
{
  "titulo": "Oferta Actualizada",
  "descripcion": "La oferta ha sido actualizada con nuevos requisitos",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

---

## 🎯 Tipos de Notificación Válidos

| Tipo | Descripción |
|------|------------|
| `NUEVA_OFERTA` | Notificación sobre nueva oferta |
| `CAMBIO_ESTADO` | Cambio en estado de postulación |
| `MENSAJE` | Mensaje de usuario |
| `RECORDATORIO` | Recordatorio del sistema |
| `SISTEMA` | Notificación del sistema |

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Notificación actualizada exitosamente |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Permiso denegado |
| `404` | Not Found - Notificación no encontrada |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `id` es **obligatorio**
- El body con los datos de actualización es **obligatorio**
- Todos los campos del body deben estar presentes
- El tipo de notificación debe ser uno de los valores válidos
- La fecha de creación NO se modifica
- Solo administradores pueden actualizar notificaciones de otros usuarios

---

## 🔄 Ejemplo cURL

```bash
curl -X PUT "http://localhost:8080/api/notificacion/1" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Oferta Actualizada",
    "descripcion": "La oferta ha sido actualizada con nuevos requisitos",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true
  }'
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function actualizarNotificacion(notificacionId, datosActualizados) {
  try {
    const response = await fetch(
      `/api/notificacion/${notificacionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      }
    );
    
    if (response.ok) {
      const notificacionActualizada = await response.json();
      console.log("Notificación actualizada:", notificacionActualizada);
      return notificacionActualizada;
    } else if (response.status === 404) {
      throw new Error('Notificación no encontrada');
    } else if (response.status === 403) {
      throw new Error('No tienes permisos para actualizar esta notificación');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    throw error;
  }
}

// Uso:
const datosActualizados = {
  titulo: "Oferta Actualizada",
  descripcion: "La oferta ha sido actualizada con nuevos requisitos",
  tipo: "NUEVA_OFERTA",
  leida: false,
  activa: true
};

await actualizarNotificacion(1, datosActualizados);
```

---

## 🔐 Validaciones del Backend

- Verifica que la notificación exista
- Valida permisos del usuario
- Valida que el tipo sea uno de los valores permitidos
- Confirma que todos los campos obligatorios estén presentes
- Mantiene la fecha de creación original
- Registra el cambio en auditoría
- Retorna la notificación actualizada

---

## 💡 Casos de Uso Comunes

1. **Corregir Información**
   - Corregir errores en el título o descripción
   - Actualizar información desactualizada

2. **Cambiar Estado**
   - Marcar como leída desde el backend
   - Desactivar notificaciones antiguas

3. **Cambiar Tipo**
   - Reclasificar una notificación
   - Cambiar categoría de notificación

4. **Administración**
   - Admin actualiza notificaciones del sistema
   - Bulk updates para notificaciones relacionadas
