# 📮 POSTULACIÓN API - Documentación Postman

## 🔗 Base URL
```
http://localhost:8080/api
```

## Descripción General
API para gestionar postulaciones de usuarios a ofertas de trabajo. Permite crear, consultar, actualizar y eliminar postulaciones, así como filtrar por diferentes criterios.

---

## Endpoints

### 1. Crear Postulación
**POST** `/api/postulacion`

Crea una nueva postulación para una oferta

**Query Parameters:**
- `usuarioId` (Long, requerido): ID del usuario que se postula
- `ofertaId` (Long, requerido): ID de la oferta a la que se postula

**Example:**
```
POST http://localhost:8080/api/postulacion?usuarioId=1&ofertaId=5
```

**Success Response (200):**
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
  "estado": "PENDIENTE",
  "fechaPostulacion": "2025-12-04T10:30:00"
}
```

---

### 2. Obtener Postulación por ID
**GET** `/api/postulacion/{id}`

Obtiene los detalles de una postulación específica

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual (validación de permisos)

**Example:**
```
GET http://localhost:8080/api/postulacion/1?usuarioIdActual=1
```

**Success Response (200):**
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
  "estado": "PENDIENTE",
  "fechaPostulacion": "2025-12-04T10:30:00"
}
```

---

### 3. Listar Postulaciones por Oferta
**GET** `/api/postulacion/oferta/{ofertaId}`

Obtiene todas las postulaciones de una oferta específica

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
GET http://localhost:8080/api/postulacion/oferta/5?usuarioIdActual=10
```

**Success Response (200):**
```json
[
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
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00"
  },
  {
    "id": 2,
    "usuario": {
      "id": 2,
      "nombre": "María García"
    },
    "oferta": {
      "id": 5,
      "titulo": "Desarrollador Java"
    },
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:20:00"
  }
]
```

---

### 4. Listar Postulaciones por Usuario
**GET** `/api/postulacion/usuario/{usuarioId}`

Obtiene todas las postulaciones de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
GET http://localhost:8080/api/postulacion/usuario/1?usuarioIdActual=1
```

**Success Response (200):**
```json
[
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
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00"
  }
]
```

---

### 5. Listar Postulaciones por Oferta y Estado
**GET** `/api/postulacion/oferta/{ofertaId}/estado`

Obtiene postulaciones de una oferta filtradas por estado

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Query Parameters:**
- `estado` (String, requerido): Estado de la postulación (PENDIENTE, ACEPTADA, RECHAZADA)
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
GET http://localhost:8080/api/postulacion/oferta/5/estado?estado=ACEPTADA&usuarioIdActual=10
```

**Success Response (200):**
```json
[
  {
    "id": 2,
    "usuario": {
      "id": 2,
      "nombre": "María García"
    },
    "oferta": {
      "id": 5,
      "titulo": "Desarrollador Java"
    },
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:20:00"
  }
]
```

---

### 6. Listar Postulaciones por Usuario y Estado
**GET** `/api/postulacion/usuario/{usuarioId}/estado`

Obtiene postulaciones de un usuario filtradas por estado

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `estado` (String, requerido): Estado de la postulación (PENDIENTE, ACEPTADA, RECHAZADA)
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
GET http://localhost:8080/api/postulacion/usuario/1/estado?estado=PENDIENTE&usuarioIdActual=1
```

**Success Response (200):**
```json
[
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
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00"
  }
]
```

---

### 7. Verificar si Usuario ya se Postuló
**GET** `/api/postulacion/verificar`

Verifica si un usuario ya se ha postulado a una oferta específica

**Query Parameters:**
- `usuarioId` (Long, requerido): ID del usuario
- `ofertaId` (Long, requerido): ID de la oferta

**Example:**
```
GET http://localhost:8080/api/postulacion/verificar?usuarioId=1&ofertaId=5
```

**Success Response (200):**
```json
true
```

---

### 8. Cambiar Estado de Postulación
**PUT** `/api/postulacion/{id}/estado`

Cambia el estado de una postulación

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `nuevoEstado` (String, requerido): Nuevo estado (PENDIENTE, ACEPTADA, RECHAZADA)
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
PUT http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ACEPTADA&usuarioIdActual=10
```

**Success Response (200):**
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

### 9. Eliminar Postulación
**DELETE** `/api/postulacion/{id}`

Elimina una postulación (soft delete)

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Example:**
```
DELETE http://localhost:8080/api/postulacion/1?usuarioIdActual=1
```

**Success Response (204):** Sin contenido

---

## Estados Válidos
- `PENDIENTE` - Postulación en proceso
- `ACEPTADA` - Postulación aceptada
- `RECHAZADA` - Postulación rechazada

## Códigos de Respuesta HTTP
| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 204 | No Content - Solicitud exitosa sin contenido |
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - No autorizado |
| 403 | Forbidden - Prohibido |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno |

## Consideraciones de Seguridad
- Todas las solicitudes requieren validación de permisos mediante `usuarioIdActual`
- Los IDs deben ser números enteros positivos
- Las fechas están en formato ISO 8601
