# 🔔 NOTIFICACIÓN API - Documentación Postman

## 🔗 Base URL
```
http://localhost:8080/api
```

## Descripción General
API para gestionar notificaciones de usuarios. Permite crear, consultar, actualizar y eliminar notificaciones, así como filtrar por tipo, estado de lectura y otras propiedades.

---

## Endpoints

### 1. Crear Notificación
**POST** `/api/notificacion`

Crea una nueva notificación

**Query Parameters:**
- `usuarioDestinoId` (Long, requerido): ID del usuario que recibirá la notificación

**Request Body:**
```json
{
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Example:**
```
POST http://localhost:8080/api/notificacion?usuarioDestinoId=1
```

**Success Response (200):**
```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 2. Obtener Notificación por ID
**GET** `/api/notificacion/{id}`

Obtiene los detalles de una notificación específica

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Example:**
```
GET http://localhost:8080/api/notificacion/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 3. Listar Notificaciones por Usuario
**GET** `/api/notificacion/usuario/{usuarioId}`

Obtiene todas las notificaciones de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario/1
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Nueva Oferta",
    "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 4. Listar Notificaciones por Usuario y Estado de Lectura
**GET** `/api/notificacion/usuario-leida/{usuarioId}`

Obtiene notificaciones filtradas por estado de lectura

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `leida` (Boolean, requerido): true para leídas, false para no leídas

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario-leida/1?leida=false
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Nueva Oferta",
    "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 5. Listar Notificaciones por Usuario y Tipo
**GET** `/api/notificacion/usuario-tipo/{usuarioId}`

Obtiene notificaciones filtradas por tipo

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `tipo` (String, requerido): Tipo de notificación (NUEVA_OFERTA, CAMBIO_ESTADO, MENSAJE, RECORDATORIO, SISTEMA)

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario-tipo/1?tipo=CAMBIO_ESTADO
```

**Success Response (200):**
```json
[
  {
    "id": 2,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Cambio de Estado",
    "descripcion": "Tu postulación ha sido aceptada",
    "tipo": "CAMBIO_ESTADO",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T11:00:00"
  }
]
```

---

### 6. Listar Notificaciones Ordenadas por Fecha Descendente
**GET** `/api/notificacion/usuario-fecha-desc/{usuarioId}`

Obtiene todas las notificaciones ordenadas de más reciente a más antigua

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario-fecha-desc/1
```

**Success Response (200):**
```json
[
  {
    "id": 2,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Cambio de Estado",
    "descripcion": "Tu postulación ha sido aceptada",
    "tipo": "CAMBIO_ESTADO",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T11:00:00"
  },
  {
    "id": 1,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Nueva Oferta",
    "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 7. Listar Notificaciones Activas por Usuario
**GET** `/api/notificacion/usuario/{usuarioId}/activas`

Obtiene todas las notificaciones activas de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario/1/activas
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "usuarioDestino": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "titulo": "Nueva Oferta",
    "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true,
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 8. Contar Notificaciones No Leídas
**GET** `/api/notificacion/usuario/{usuarioId}/no-leidas`

Obtiene la cantidad de notificaciones no leídas de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
GET http://localhost:8080/api/notificacion/usuario/1/no-leidas
```

**Success Response (200):**
```json
5
```

---

### 9. Actualizar Notificación
**PUT** `/api/notificacion/{id}`

Actualiza los datos de una notificación

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Request Body:**
```json
{
  "titulo": "Nueva Oferta Actualizada",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Example:**
```
PUT http://localhost:8080/api/notificacion/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Nueva Oferta Actualizada",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 10. Marcar Notificación como Leída
**PATCH** `/api/notificacion/{id}/leida`

Marca una notificación como leída

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Example:**
```
PATCH http://localhost:8080/api/notificacion/1/leida
```

**Success Response (200):**
```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": true,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 11. Marcar Todas las Notificaciones como Leídas
**PATCH** `/api/notificacion/usuario/{usuarioId}/leidas`

Marca todas las notificaciones de un usuario como leídas

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
PATCH http://localhost:8080/api/notificacion/usuario/1/leidas
```

**Success Response (204):** Sin contenido

---

### 12. Eliminar Notificación
**DELETE** `/api/notificacion/{id}`

Elimina una notificación

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Example:**
```
DELETE http://localhost:8080/api/notificacion/1
```

**Success Response (204):** Sin contenido

---

## Tipos de Notificación Válidos
- `NUEVA_OFERTA` - Notificación sobre nueva oferta
- `CAMBIO_ESTADO` - Cambio en estado de postulación
- `MENSAJE` - Mensaje de usuario
- `RECORDATORIO` - Recordatorio del sistema
- `SISTEMA` - Notificación del sistema

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

## Campos del Modelo Notificación
- `id` (Long): Identificador único
- `usuarioDestino` (Object): Usuario que recibe la notificación
- `titulo` (String): Título de la notificación
- `descripcion` (String): Descripción del contenido
- `tipo` (Enum): Tipo de notificación
- `leida` (Boolean): Indica si ha sido leída
- `activa` (Boolean): Indica si está activa
- `fechaCreacion` (DateTime): Fecha de creación
