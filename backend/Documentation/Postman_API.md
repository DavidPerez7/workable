# 📋 Documentación Postman - APIs Workable

## 🔗 Base URL
```
http://localhost:8080/api
```

---

## 📮 POSTULACIÓN API
**Base Path:** `/api/postulacion`

### 1. Crear Postulación
**Endpoint:** `POST /api/postulacion`

**Descripción:** Crea una nueva postulación para una oferta

**Query Parameters:**
- `usuarioId` (Long, requerido): ID del usuario que se postula
- `ofertaId` (Long, requerido): ID de la oferta a la que se postula

**Ejemplo de Solicitud:**
```
POST http://localhost:8080/api/postulacion?usuarioId=1&ofertaId=5
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/postulacion/{id}`

**Descripción:** Obtiene los detalles de una postulación específica

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual (para validación de permisos)

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/1?usuarioIdActual=1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/postulacion/oferta/{ofertaId}`

**Descripción:** Obtiene todas las postulaciones de una oferta

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/oferta/5?usuarioIdActual=10
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/postulacion/usuario/{usuarioId}`

**Descripción:** Obtiene todas las postulaciones de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/usuario/1?usuarioIdActual=1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/postulacion/oferta/{ofertaId}/estado`

**Descripción:** Obtiene postulaciones de una oferta filtradas por estado

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Query Parameters:**
- `estado` (String, requerido): Estado de la postulación (PENDIENTE, ACEPTADA, RECHAZADA)
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/oferta/5/estado?estado=ACEPTADA&usuarioIdActual=10
```

**Respuesta Exitosa (200):**
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

**Estados Válidos:**
- `PENDIENTE`
- `ACEPTADA`
- `RECHAZADA`

---

### 6. Listar Postulaciones por Usuario y Estado
**Endpoint:** `GET /api/postulacion/usuario/{usuarioId}/estado`

**Descripción:** Obtiene postulaciones de un usuario filtradas por estado

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `estado` (String, requerido): Estado de la postulación
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/usuario/1/estado?estado=PENDIENTE&usuarioIdActual=1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/postulacion/verificar`

**Descripción:** Verifica si un usuario ya se ha postulado a una oferta

**Query Parameters:**
- `usuarioId` (Long, requerido): ID del usuario
- `ofertaId` (Long, requerido): ID de la oferta

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/postulacion/verificar?usuarioId=1&ofertaId=5
```

**Respuesta Exitosa (200):**
```json
true
```

---

### 8. Cambiar Estado de Postulación
**Endpoint:** `PUT /api/postulacion/{id}/estado`

**Descripción:** Cambia el estado de una postulación

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `nuevoEstado` (String, requerido): Nuevo estado (PENDIENTE, ACEPTADA, RECHAZADA)
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
PUT http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ACEPTADA&usuarioIdActual=10
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `DELETE /api/postulacion/{id}`

**Descripción:** Elimina una postulación (soft delete)

**Path Parameters:**
- `id` (Long, requerido): ID de la postulación

**Query Parameters:**
- `usuarioIdActual` (Long, requerido): ID del usuario actual

**Ejemplo de Solicitud:**
```
DELETE http://localhost:8080/api/postulacion/1?usuarioIdActual=1
```

**Respuesta Exitosa (204):** Sin contenido

---

## 🔔 NOTIFICACIÓN API
**Base Path:** `/api/notificacion`

### 1. Crear Notificación
**Endpoint:** `POST /api/notificacion`

**Descripción:** Crea una nueva notificación

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

**Ejemplo de Solicitud:**
```
POST http://localhost:8080/api/notificacion?usuarioDestinoId=1

Body:
{
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Respuesta Exitosa (200):**
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

**Tipos de Notificación:**
- `NUEVA_OFERTA`
- `CAMBIO_ESTADO`
- `MENSAJE`
- `RECORDATORIO`
- `SISTEMA`

---

### 2. Obtener Notificación por ID
**Endpoint:** `GET /api/notificacion/{id}`

**Descripción:** Obtiene los detalles de una notificación específica

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario/{usuarioId}`

**Descripción:** Obtiene todas las notificaciones de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario/1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario-leida/{usuarioId}`

**Descripción:** Obtiene notificaciones filtradas por estado de lectura

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `leida` (Boolean, requerido): true para notificaciones leídas, false para no leídas

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario-leida/1?leida=false
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario-tipo/{usuarioId}`

**Descripción:** Obtiene notificaciones filtradas por tipo

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Query Parameters:**
- `tipo` (String, requerido): Tipo de notificación (NUEVA_OFERTA, CAMBIO_ESTADO, MENSAJE, RECORDATORIO, SISTEMA)

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario-tipo/1?tipo=CAMBIO_ESTADO
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario-fecha-desc/{usuarioId}`

**Descripción:** Obtiene todas las notificaciones ordenadas de más reciente a más antigua

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario-fecha-desc/1
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario/{usuarioId}/activas`

**Descripción:** Obtiene todas las notificaciones activas de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario/1/activas
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `GET /api/notificacion/usuario/{usuarioId}/no-leidas`

**Descripción:** Obtiene la cantidad de notificaciones no leídas de un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/notificacion/usuario/1/no-leidas
```

**Respuesta Exitosa (200):**
```json
5
```

---

### 9. Actualizar Notificación
**Endpoint:** `PUT /api/notificacion/{id}`

**Descripción:** Actualiza los datos de una notificación

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

**Ejemplo de Solicitud:**
```
PUT http://localhost:8080/api/notificacion/1

Body:
{
  "titulo": "Nueva Oferta Actualizada",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `PATCH /api/notificacion/{id}/leida`

**Descripción:** Marca una notificación como leída

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Ejemplo de Solicitud:**
```
PATCH http://localhost:8080/api/notificacion/1/leida
```

**Respuesta Exitosa (200):**
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
**Endpoint:** `PATCH /api/notificacion/usuario/{usuarioId}/leidas`

**Descripción:** Marca todas las notificaciones de un usuario como leídas

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
PATCH http://localhost:8080/api/notificacion/usuario/1/leidas
```

**Respuesta Exitosa (204):** Sin contenido

---

### 12. Eliminar Notificación
**Endpoint:** `DELETE /api/notificacion/{id}`

**Descripción:** Elimina una notificación

**Path Parameters:**
- `id` (Long, requerido): ID de la notificación

**Ejemplo de Solicitud:**
```
DELETE http://localhost:8080/api/notificacion/1
```

**Respuesta Exitosa (204):** Sin contenido

---

## ⭐ VALORACIÓN (FEEDBACK) API
**Base Path:** `/api/feedback`

### 1. Crear Valoración
**Endpoint:** `POST /api/feedback`

**Descripción:** Crea una nueva valoración de un usuario sobre una empresa

**Request Body:**
```json
{
  "usuario": {
    "id": 1
  },
  "empresa": {
    "id": 5
  },
  "oferta": {
    "id": 10
  },
  "puntuacion": 4.5,
  "comentario": "Excelente experiencia durante el proceso de selección",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

**Ejemplo de Solicitud:**
```
POST http://localhost:8080/api/feedback

Body:
{
  "usuario": {
    "id": 1
  },
  "empresa": {
    "id": 5
  },
  "oferta": {
    "id": 10
  },
  "puntuacion": 4.5,
  "comentario": "Excelente experiencia durante el proceso de selección",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "empresa": {
    "id": 5,
    "nombre": "Tech Company"
  },
  "oferta": {
    "id": 10,
    "titulo": "Desarrollador Java"
  },
  "puntuacion": 4.5,
  "comentario": "Excelente experiencia durante el proceso de selección",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 2. Obtener Valoración por ID
**Endpoint:** `GET /api/feedback/{id}`

**Descripción:** Obtiene los detalles de una valoración específica

**Path Parameters:**
- `id` (Long, requerido): ID de la valoración

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/feedback/1
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "empresa": {
    "id": 5,
    "nombre": "Tech Company"
  },
  "oferta": {
    "id": 10,
    "titulo": "Desarrollador Java"
  },
  "puntuacion": 4.5,
  "comentario": "Excelente experiencia durante el proceso de selección",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 3. Listar Valoraciones por Empresa
**Endpoint:** `GET /api/feedback/empresa/{empresaId}`

**Descripción:** Obtiene todas las valoraciones de una empresa

**Path Parameters:**
- `empresaId` (Long, requerido): ID de la empresa

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/feedback/empresa/5
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "empresa": {
      "id": 5,
      "nombre": "Tech Company"
    },
    "oferta": {
      "id": 10,
      "titulo": "Desarrollador Java"
    },
    "puntuacion": 4.5,
    "comentario": "Excelente experiencia durante el proceso de selección",
    "fechaCreacion": "2025-12-04T10:30:00"
  },
  {
    "id": 2,
    "usuario": {
      "id": 2,
      "nombre": "María García"
    },
    "empresa": {
      "id": 5,
      "nombre": "Tech Company"
    },
    "oferta": {
      "id": 10,
      "titulo": "Desarrollador Java"
    },
    "puntuacion": 4.0,
    "comentario": "Buen proceso de entrevista",
    "fechaCreacion": "2025-12-03T14:20:00"
  }
]
```

---

### 4. Listar Valoraciones por Oferta
**Endpoint:** `GET /api/feedback/oferta/{ofertaId}`

**Descripción:** Obtiene todas las valoraciones relacionadas con una oferta

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/feedback/oferta/10
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "empresa": {
      "id": 5,
      "nombre": "Tech Company"
    },
    "oferta": {
      "id": 10,
      "titulo": "Desarrollador Java"
    },
    "puntuacion": 4.5,
    "comentario": "Excelente experiencia durante el proceso de selección",
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 5. Listar Valoraciones por Usuario
**Endpoint:** `GET /api/feedback/usuario/{usuarioId}`

**Descripción:** Obtiene todas las valoraciones realizadas por un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/feedback/usuario/1
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "empresa": {
      "id": 5,
      "nombre": "Tech Company"
    },
    "oferta": {
      "id": 10,
      "titulo": "Desarrollador Java"
    },
    "puntuacion": 4.5,
    "comentario": "Excelente experiencia durante el proceso de selección",
    "fechaCreacion": "2025-12-04T10:30:00"
  }
]
```

---

### 6. Obtener Valoración por Usuario y Empresa
**Endpoint:** `GET /api/feedback/usuario/{usuarioId}/empresa/{empresaId}`

**Descripción:** Obtiene la valoración específica de un usuario sobre una empresa

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario
- `empresaId` (Long, requerido): ID de la empresa

**Ejemplo de Solicitud:**
```
GET http://localhost:8080/api/feedback/usuario/1/empresa/5
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "empresa": {
    "id": 5,
    "nombre": "Tech Company"
  },
  "oferta": {
    "id": 10,
    "titulo": "Desarrollador Java"
  },
  "puntuacion": 4.5,
  "comentario": "Excelente experiencia durante el proceso de selección",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 7. Actualizar Valoración
**Endpoint:** `PUT /api/feedback/{id}`

**Descripción:** Actualiza los datos de una valoración

**Path Parameters:**
- `id` (Long, requerido): ID de la valoración

**Request Body:**
```json
{
  "usuario": {
    "id": 1
  },
  "empresa": {
    "id": 5
  },
  "oferta": {
    "id": 10
  },
  "puntuacion": 5.0,
  "comentario": "Excelente experiencia durante el proceso de selección. Muy recomendado.",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

**Ejemplo de Solicitud:**
```
PUT http://localhost:8080/api/feedback/1

Body:
{
  "usuario": {
    "id": 1
  },
  "empresa": {
    "id": 5
  },
  "oferta": {
    "id": 10
  },
  "puntuacion": 5.0,
  "comentario": "Excelente experiencia durante el proceso de selección. Muy recomendado.",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "empresa": {
    "id": 5,
    "nombre": "Tech Company"
  },
  "oferta": {
    "id": 10,
    "titulo": "Desarrollador Java"
  },
  "puntuacion": 5.0,
  "comentario": "Excelente experiencia durante el proceso de selección. Muy recomendado.",
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

### 8. Eliminar Valoración
**Endpoint:** `DELETE /api/feedback/{id}`

**Descripción:** Elimina una valoración

**Path Parameters:**
- `id` (Long, requerido): ID de la valoración

**Ejemplo de Solicitud:**
```
DELETE http://localhost:8080/api/feedback/1
```

**Respuesta Exitosa (204):** Sin contenido

---

## 📝 Códigos de Respuesta HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 204 | No Content - Solicitud exitosa sin contenido de respuesta |
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - No autorizado |
| 403 | Forbidden - Prohibido |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

---

## 🔐 Consideraciones de Seguridad

- Todas las solicitudes requieren validación de permisos mediante `usuarioIdActual`
- Los IDs deben ser números enteros positivos
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)
- Se recomienda usar headers de autenticación adicionales en producción

---

## 📚 Notas Importantes

1. **Estados de Postulación**: PENDIENTE, ACEPTADA, RECHAZADA
2. **Tipos de Notificación**: NUEVA_OFERTA, CAMBIO_ESTADO, MENSAJE, RECORDATORIO, SISTEMA
3. **Puntuación de Feedback**: Rango de 0 a 5 (decimales permitidos)
4. **Soft Delete**: Las postulaciones y notificaciones se eliminan de forma lógica
5. **Validación de Usuarios**: Siempre incluir `usuarioIdActual` para validaciones de permisos

---

**Última actualización:** 4 de Diciembre de 2025
