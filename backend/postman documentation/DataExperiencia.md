# Documentación Endpoints CRUD DataExperiencia

## Base URL: `http://localhost:8080/api`

## CREATE dataexperiencia
- **Path:** `baseUrl/dataexperiencia`
- **Http Method:** POST
- **Body:** DataExperienciaCreateDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (POST)
**Método:** POST
**URL:** `baseUrl/dataexperiencia`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "cargo": "Desarrollador Backend",
  "empresa": "TechColombia SAS",
  "descripcion": "Desarrollo de microservicios en Java",
  "expYears": 3.5,
  "fechaInicio": "2022-01-01",
  "fechaFin": null,
  "trabajoActual": true,
  "ubicacion": "Bogotá",
  "estado": "ACTIVO"
}
```

---

## UPDATE dataexperiencia
- **Path:** `baseUrl/dataexperiencia/{id}`
- **Http Method:** PUT
- **Body:** DataExperienciaUpdateDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** `baseUrl/dataexperiencia/1`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "cargo": "Analista QA",
  "empresa": "AgroTech Soluciones",
  "descripcion": "Pruebas automatizadas de software",
  "expYears": 2.0,
  "fechaInicio": "2023-01-01",
  "fechaFin": "2024-01-01",
  "trabajoActual": false,
  "ubicacion": "Medellín",
  "estado": "INACTIVO"
}
```

---

## DELETE dataexperiencia
- **Path:** `baseUrl/dataexperiencia/{id}`
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** 204 No Content

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** `baseUrl/dataexperiencia/1`
**Headers:** `Authorization: Bearer {token}`

---

## GET dataexperiencia by ID
- **Path:** `baseUrl/dataexperiencia/{id}`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (GET by ID)
**Método:** GET
**URL:** `baseUrl/dataexperiencia/1`
**Headers:** `Authorization: Bearer {token}`

---

## GET all dataexperiencia
- **Path:** `baseUrl/dataexperiencia`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** List<DataExperienciaReadDto>

### Ejemplo petición (GET all)
**Método:** GET
**URL:** `baseUrl/dataexperiencia`
**Headers:** `Authorization: Bearer {token}`

---

## PATCH estado dataexperiencia (Activar/Inactivar)
- **Path:** `baseUrl/dataexperiencia/{id}/estado`
- **Http Method:** PATCH
- **Body:** `{ "estado": "ACTIVO" | "INACTIVO" }`
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (PATCH estado)
**Método:** PATCH
**URL:** `baseUrl/dataexperiencia/1/estado`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "estado": "INACTIVO"
}
```

---

**Notas:**
- Todos los endpoints requieren autenticación JWT Bearer.
- Los roles permitidos para crear, actualizar, eliminar y cambiar estado son ADMIN y ASPIRANTE.
- El campo `estado` solo acepta los valores `ACTIVO` o `INACTIVO`.
