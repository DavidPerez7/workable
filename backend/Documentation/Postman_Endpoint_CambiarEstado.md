# 🔄 CAMBIAR ESTADO POSTULACIÓN - Documentación Postman

## 🔗 Endpoint
**PUT** `/postulacion/{id}/estado`

## 📋 Descripción
Cambia el estado de una postulación existente. Solo los usuarios con permisos (como reclutadores o administradores) pueden cambiar el estado de postulaciones.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID de la postulación a actualizar | `1` |

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Valores Válidos | Ejemplo |
|-----------|------|-------------|-----------------|---------|
| `nuevoEstado` | String | Nuevo estado para la postulación | PENDIENTE, ACEPTADA, RECHAZADA | `ACEPTADA` |
| `usuarioIdActual` | Long | ID del usuario que realiza la acción (para validar permisos) | Número positivo | `10` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
PUT http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ACEPTADA&usuarioIdActual=10
```

### Headers
```
Content-Type: application/json
```

### Body
No requiere body (los parámetros van en Query y Path)

---

## 📥 Response

### Success Response (200 OK)

```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "oferta": {
    "id": 5,
    "titulo": "Desarrollador Java"
  },
  "estado": "ACEPTADA",
  "fechaPostulacion": "2025-12-04T10:30:00"
}
```

---

## 📊 Casos de Uso

### Caso 1: Aceptar Postulación
```
Request:
PUT http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ACEPTADA&usuarioIdActual=10

Response: 200 OK
{
  "id": 1,
  "usuario": {"id": 1, "nombre": "Juan Pérez"},
  "oferta": {"id": 5, "titulo": "Desarrollador Java"},
  "estado": "ACEPTADA",
  "fechaPostulacion": "2025-12-04T10:30:00"
}
```

### Caso 2: Rechazar Postulación
```
Request:
PUT http://localhost:8080/api/postulacion/2/estado?nuevoEstado=RECHAZADA&usuarioIdActual=10

Response: 200 OK
{
  "id": 2,
  "usuario": {"id": 2, "nombre": "María García"},
  "oferta": {"id": 5, "titulo": "Desarrollador Java"},
  "estado": "RECHAZADA",
  "fechaPostulacion": "2025-12-03T14:20:00"
}
```

### Caso 3: Volver a PENDIENTE
```
Request:
PUT http://localhost:8080/api/postulacion/1/estado?nuevoEstado=PENDIENTE&usuarioIdActual=10

Response: 200 OK
{
  "id": 1,
  "usuario": {"id": 1, "nombre": "Juan Pérez"},
  "oferta": {"id": 5, "titulo": "Desarrollador Java"},
  "estado": "PENDIENTE",
  "fechaPostulacion": "2025-12-04T10:30:00"
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
{{baseUrl}}/postulacion/{{postulacionId}}/estado
```

O directamente:
```
http://localhost:8080/api/postulacion/1/estado
```

### Path Variables (Tab: Params - Path)
```
Key: id
Value: 1
```

### Query Parameters (Tab: Params - Query)
```
Key: nuevoEstado
Value: ACEPTADA

Key: usuarioIdActual
Value: 10
```

### Headers
```
Content-Type: application/json
```

### Body
```
No aplica - No se envía body
```

---

## 🎯 Estados Válidos

| Estado | Descripción |
|--------|------------|
| `PENDIENTE` | Postulación en proceso de revisión |
| `ACEPTADA` | Postulación aprobada |
| `RECHAZADA` | Postulación rechazada |

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Estado actualizado exitosamente |
| `400` | Bad Request - Parámetros inválidos o estado no válido |
| `401` | Unauthorized - No autorizado |
| `403` | Forbidden - Permiso denegado |
| `404` | Not Found - Postulación no encontrada |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- Todos los parámetros son **obligatorios**
- Solo usuarios con permisos pueden cambiar estados (validado con `usuarioIdActual`)
- Los estados válidos son: `PENDIENTE`, `ACEPTADA`, `RECHAZADA`
- El `id` debe ser un número entero positivo válido
- El cambio de estado desencadena notificaciones al usuario
- La postulación debe existir antes de intentar cambiar su estado

---

## 🔄 Ejemplo cURL

```bash
curl -X PUT "http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ACEPTADA&usuarioIdActual=10" \
  -H "Content-Type: application/json"
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function cambiarEstadoPostulacion(postulacionId, nuevoEstado, usuarioId) {
  const response = await fetch(
    `/api/postulacion/${postulacionId}/estado?nuevoEstado=${nuevoEstado}&usuarioIdActual=${usuarioId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const postulacionActualizada = await response.json();
    console.log(`Postulación actualizada a: ${postulacionActualizada.estado}`);
    return postulacionActualizada;
  } else {
    console.error('Error al actualizar postulación');
    throw new Error('No se pudo actualizar la postulación');
  }
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario tenga permisos para cambiar el estado
- Valida que el estado sea uno de los valores permitidos
- Verifica que la postulación exista
- Crea una auditoría del cambio realizado
