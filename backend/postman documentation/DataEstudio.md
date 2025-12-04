
# Documentación Endpoints CRUD DataEstudio

## Base URL: `http://localhost:8080/api`

## CREATE dataestudio
- **Path:** `baseUrl/dataestudio`
- **Http Method:** POST
- **Body:** DataEstudioDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataEstudioReadDto

### Ejemplo petición (POST)
**Método:** POST
**URL:** `baseUrl/dataestudio`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "nombre": "Ingeniería de Sistemas",
  "fechaInicio": "2020-01-01",
  "fechaFin": "2024-01-01",
  "enCurso": false,
  "institucion": "Universidad Nacional",
  "certificadoUrl": "https://certificados.unal.edu/123.pdf",
  "nivelEducativoId": 2,
  "usuarioId": 5,
  "estado": "ACTIVO"
}
```

---

## UPDATE dataestudio
- **Path:** `baseUrl/dataestudio/{id}`
- **Http Method:** PUT
- **Body:** DataEstudioDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataEstudioReadDto

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** `baseUrl/dataestudio/10`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "nombre": "Ingeniería de Software",
  "fechaInicio": "2020-01-01",
  "fechaFin": "2024-01-01",
  "enCurso": false,
  "institucion": "Universidad Nacional",
  "certificadoUrl": "https://certificados.unal.edu/123.pdf",
  "nivelEducativoId": 2,
  "usuarioId": 5,
  "estado": "INACTIVO"
}
```

---

## DELETE dataestudio
- **Path:** `baseUrl/dataestudio/{id}`
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** 204 No Content

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** `baseUrl/dataestudio/10`

---

## GET dataestudio by ID
- **Path:** `baseUrl/dataestudio/{id}`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataEstudioReadDto

### Ejemplo petición (GET by ID)
**Método:** GET
**URL:** `baseUrl/dataestudio/10`

---

## GET all dataestudio
- **Path:** `baseUrl/dataestudio`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** List<DataEstudioReadDto>

### Ejemplo petición (GET all)
**Método:** GET
**URL:** `baseUrl/dataestudio`

---

**Notas:**
- Todos los endpoints requieren autenticación.
- Los roles permitidos para crear, actualizar y eliminar son ADMIN y ASPIRANTE.
- El campo `estado` puede ser `ACTIVO` o `INACTIVO`.
- El campo `usuarioId` debe existir y estar relacionado con el usuario autenticado si el rol es ASPIRANTE.
- El campo `nivelEducativoId` debe existir en la tabla correspondiente.
