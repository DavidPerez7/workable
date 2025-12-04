# ⭐ VALORACIÓN (FEEDBACK) API - Documentación Postman

## 🔗 Base URL
```
http://localhost:8080/api
```

## Descripción General
API para gestionar valoraciones (feedback) de usuarios sobre empresas y ofertas. Permite crear, consultar, actualizar y eliminar valoraciones con puntuaciones y comentarios.

---

## Endpoints

### 1. Crear Valoración
**POST** `/api/feedback`

Crea una nueva valoración de un usuario sobre una empresa

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
  "comentario": "Excelente experiencia durante el proceso de selección"
}
```

**Example:**
```
POST http://localhost:8080/api/feedback
```

**Success Response (200):**
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
**GET** `/api/feedback/{id}`

Obtiene los detalles de una valoración específica

**Path Parameters:**
- `id` (Long, requerido): ID de la valoración

**Example:**
```
GET http://localhost:8080/api/feedback/1
```

**Success Response (200):**
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
**GET** `/api/feedback/empresa/{empresaId}`

Obtiene todas las valoraciones de una empresa

**Path Parameters:**
- `empresaId` (Long, requerido): ID de la empresa

**Example:**
```
GET http://localhost:8080/api/feedback/empresa/5
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
**GET** `/api/feedback/oferta/{ofertaId}`

Obtiene todas las valoraciones relacionadas con una oferta

**Path Parameters:**
- `ofertaId` (Long, requerido): ID de la oferta

**Example:**
```
GET http://localhost:8080/api/feedback/oferta/10
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
**GET** `/api/feedback/usuario/{usuarioId}`

Obtiene todas las valoraciones realizadas por un usuario

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario

**Example:**
```
GET http://localhost:8080/api/feedback/usuario/1
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
**GET** `/api/feedback/usuario/{usuarioId}/empresa/{empresaId}`

Obtiene la valoración específica de un usuario sobre una empresa

**Path Parameters:**
- `usuarioId` (Long, requerido): ID del usuario
- `empresaId` (Long, requerido): ID de la empresa

**Example:**
```
GET http://localhost:8080/api/feedback/usuario/1/empresa/5
```

**Success Response (200):**
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
**PUT** `/api/feedback/{id}`

Actualiza los datos de una valoración

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
  "comentario": "Excelente experiencia durante el proceso de selección. Muy recomendado."
}
```

**Example:**
```
PUT http://localhost:8080/api/feedback/1
```

**Success Response (200):**
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
**DELETE** `/api/feedback/{id}`

Elimina una valoración

**Path Parameters:**
- `id` (Long, requerido): ID de la valoración

**Example:**
```
DELETE http://localhost:8080/api/feedback/1
```

**Success Response (204):** Sin contenido

---

## Rango de Puntuación
- Rango: 0 a 5 (decimales permitidos)
- Ejemplo: 4.5, 3.0, 5.0

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

## Campos del Modelo Feedback
- `id` (Long): Identificador único
- `usuario` (Object): Usuario que realiza la valoración
- `empresa` (Object): Empresa valorada
- `oferta` (Object): Oferta asociada
- `puntuacion` (Double): Puntuación de 0 a 5
- `comentario` (String): Comentario de la valoración
- `fechaCreacion` (DateTime): Fecha de creación

## Consideraciones Importantes
- La puntuación debe estar entre 0 y 5
- El comentario es opcional pero recomendado
- Un usuario puede tener múltiples valoraciones sobre diferentes empresas
- Las fechas están en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)
