# Endpoints para Ver Aspirantes - Reclutador

Los reclutadores pueden ver todos los aspirantes que se postularon para sus vacantes, revisando toda la información registrada de ellos.

## 1. Ver Todos los Aspirantes de una Vacante

**Endpoint:** `GET /api/postulacion/oferta/{ofertaId}/aspirantes`

**Rol Requerido:** RECLUTADOR o ADMIN

**Parámetros:**
- `ofertaId` (path param): ID de la oferta/vacante
- `usuarioIdActual` (query param): ID del usuario autenticado (reclutador)

**Response - 200 OK:**
```json
[
  {
    "postulacionId": 1,
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04",
    "usuarioId": 10,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "telefono": "3105551234",
    "municipio": "Medellín",
    "estudios": 2,
    "experiencias": 3,
    "habilidades": 5
  },
  {
    "postulacionId": 2,
    "estado": "ENTREVISTA_PROGRAMADA",
    "fechaPostulacion": "2025-12-02",
    "usuarioId": 11,
    "nombre": "María",
    "apellido": "García",
    "correo": "maria@example.com",
    "telefono": "3105555678",
    "municipio": "Bogotá",
    "estudios": 1,
    "experiencias": 4,
    "habilidades": 6
  }
]
```

**Ejemplo CURL:**
```bash
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes?usuarioIdActual=3" \
  -H "Authorization: Bearer <token>"
```

---

## 2. Ver Aspirantes Filtrados por Estado

**Endpoint:** `GET /api/postulacion/oferta/{ofertaId}/aspirantes/filtro`

**Rol Requerido:** RECLUTADOR o ADMIN

**Parámetros:**
- `ofertaId` (path param): ID de la oferta
- `estado` (query param): Estado de la postulación (opcional)
  - Valores posibles: `PENDIENTE`, `ENTREVISTA_PROGRAMADA`, `ACEPTADO`, `RECHAZADO`
- `usuarioIdActual` (query param): ID del usuario autenticado

**Response - 200 OK:**
```json
[
  {
    "postulacionId": 1,
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04",
    "usuarioId": 10,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "telefono": "3105551234",
    "municipio": "Medellín",
    "estudios": 2,
    "experiencias": 3,
    "habilidades": 5
  }
]
```

**Ejemplo CURL:**
```bash
# Ver solo aspirantes en estado PENDIENTE
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes/filtro?estado=PENDIENTE&usuarioIdActual=3" \
  -H "Authorization: Bearer <token>"

# Ver aspirantes en entrevista
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes/filtro?estado=ENTREVISTA_PROGRAMADA&usuarioIdActual=3" \
  -H "Authorization: Bearer <token>"
```

---

## 3. Ver Perfil Completo del Aspirante

**Endpoint:** `GET /api/postulacion/{postulacionId}/aspirante-detalle`

**Rol Requerido:** RECLUTADOR o ADMIN

**Parámetros:**
- `postulacionId` (path param): ID de la postulación
- `usuarioIdActual` (query param): ID del usuario autenticado

**Response - 200 OK:**
```json
{
  "postulacionId": 1,
  "estado": "PENDIENTE",
  "fechaPostulacion": "2025-12-04",
  "aspirante": {
    "usuarioId": 10,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "telefono": "3105551234",
    "fechaNacimiento": "1995-06-15",
    "municipio": "Medellín",
    "fechaRegistro": "2025-11-20",
    "urlFotoPerfil": "https://example.com/foto.jpg"
  },
  "estudios": [
    {
      "id": 1,
      "institucion": "Universidad Nacional",
      "programa": "Ingeniería de Sistemas",
      "nivelEducativo": "PREGRADO",
      "areaEstudio": "Ingeniería",
      "fechaInicio": "2018-01-15",
      "fechaFinalizacion": "2022-12-10",
      "enCurso": false
    },
    {
      "id": 2,
      "institucion": "Tecnológico",
      "programa": "Java Full Stack",
      "nivelEducativo": "CURSO_ESPECIALIZADO",
      "areaEstudio": "Programación",
      "fechaInicio": "2023-01-10",
      "fechaFinalizacion": null,
      "enCurso": true
    }
  ],
  "experiencias": [
    {
      "id": 1,
      "empresa": "Tech Company",
      "cargo": "Junior Developer",
      "descripcion": "Desarrollo de aplicaciones web",
      "estado": "COMPLETADA",
      "fechaInicio": "2022-06-01",
      "fechaFin": "2024-03-31"
    },
    {
      "id": 2,
      "empresa": "Startup XYZ",
      "cargo": "Full Stack Developer",
      "descripcion": "Desarrollo de plataforma SaaS",
      "estado": "ACTIVA",
      "fechaInicio": "2024-04-01",
      "fechaFin": null
    }
  ],
  "habilidades": [
    {
      "id": 1,
      "habilidad": "Java",
      "nivel": "AVANZADO",
      "porcentajeCompletitud": 85
    },
    {
      "id": 2,
      "habilidad": "Spring Boot",
      "nivel": "INTERMEDIO",
      "porcentajeCompletitud": 70
    },
    {
      "id": 3,
      "habilidad": "React",
      "nivel": "BÁSICO",
      "porcentajeCompletitud": 50
    }
  ]
}
```

**Ejemplo CURL:**
```bash
curl -X GET "http://localhost:8080/api/postulacion/1/aspirante-detalle?usuarioIdActual=3" \
  -H "Authorization: Bearer <token>"
```

---

## Respuestas de Error

### 403 Forbidden - Sin Permisos
```json
{
  "error": "No tienes permisos para ver los aspirantes"
}
```
O
```json
{
  "error": "No tienes permisos para ver los aspirantes de esta oferta"
}
```

### 404 Not Found
```json
{
  "error": "Postulación no encontrada"
}
```
O
```json
{
  "error": "Oferta no encontrada"
}
```

### 400 Bad Request - Estado Inválido
```json
{
  "error": "Estado inválido: ESTADO_INEXISTENTE"
}
```

---

## Casos de Uso

### Caso 1: Reclutador Revisa Aspirantes Pendientes
```bash
# 1. Ver todos los aspirantes en estado PENDIENTE
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes/filtro?estado=PENDIENTE&usuarioIdActual=3"

# 2. Ver detalle completo del mejor candidato
curl -X GET "http://localhost:8080/api/postulacion/1/aspirante-detalle?usuarioIdActual=3"

# 3. Cambiar su estado a ENTREVISTA_PROGRAMADA
curl -X PUT "http://localhost:8080/api/postulacion/1/estado?nuevoEstado=ENTREVISTA_PROGRAMADA&usuarioIdActual=3"
```

### Caso 2: Filtrar Aspirantes Aceptados
```bash
# Ver todos los aspirantes aceptados para una vacante
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes/filtro?estado=ACEPTADO&usuarioIdActual=3"
```

### Caso 3: Ver Información Completa para Toma de Decisión
```bash
# 1. Listar todos los aspirantes
curl -X GET "http://localhost:8080/api/postulacion/oferta/5/aspirantes?usuarioIdActual=3"

# 2. Para cada aspirante que interese, ver su perfil completo
curl -X GET "http://localhost:8080/api/postulacion/2/aspirante-detalle?usuarioIdActual=3"

# Revisar:
# - Educación: Institución, programa, nivel educativo
# - Experiencia: Empresas donde trabajó, cargos, descripción de actividades
# - Habilidades: Competencias técnicas y nivel de dominio
# - Información de contacto: Para entrevistas
```

---

## Observaciones

- **Solo RECLUTADOR y ADMIN** pueden ver los aspirantes
- El reclutador solo puede ver aspirantes de **sus propias vacantes** (ofertaId verificado)
- La información incluye:
  - Datos básicos del aspirante
  - Historial educativo completo
  - Experiencia laboral completa
  - Habilidades y nivel de dominio
- Los aspirantes se ordenan por fecha de postulación (más recientes primero)
- Se puede filtrar por estado para agilizar la búsqueda
