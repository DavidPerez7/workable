# Documentación Endpoints CRUD DataEstudio

## Base URL: `http://localhost:8080/api`

## CREATE dataestudio
- **Path:** baseUrl/dataestudio
- **Http Method:** POST
- **Body:** DataEstudioDto
- **Roles (Authorization JWT Bearer):** ASPIRANTE, ADMIN
- **Respuesta:** DataEstudioDto

### Ejemplo petición (POST)
**Método:** POST
**URL:** baseUrl/dataestudio
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "nombre": "Ingeniería de Sistemas",
  "fechaInicio": "2020-01-15",
  "fechaFin": "2024-11-01",
  "enCurso": false,
  "institucion": "Universidad Nacional",
  "certificado": "https://certificados.unal.edu/123",
  "nivelEducativoId": 4,
  "aspiranteId": 1,
  "estado": "ACTIVO"
}
```

---

## UPDATE dataestudio
- **Path:** baseUrl/dataestudio/{id}
- **Http Method:** PUT
- **Body:** DataEstudioDto
- **Roles (Authorization JWT Bearer):** ASPIRANTE, ADMIN
- **Respuesta:** DataEstudioDto

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** baseUrl/dataestudio/1
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "nombre": "Ingeniería de Sistemas",
  "fechaInicio": "2020-01-15",
  "fechaFin": "2024-11-01",
  "enCurso": false,
  "institucion": "Universidad Nacional",
  "certificado": "https://certificados.unal.edu/123",
  "nivelEducativoId": 4,
  "aspiranteId": 1,
  "estado": "INACTIVO"
}
```

---

## DELETE dataestudio
- **Path:** baseUrl/dataestudio/{id}
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** ASPIRANTE, ADMIN
- **Respuesta:** 204 No Content

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** baseUrl/dataestudio/1

---

## GET dataestudio by ID
- **Path:** baseUrl/dataestudio/{id}
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ASPIRANTE, ADMIN
- **Respuesta:** DataEstudioDto

### Ejemplo petición (GET by ID)
**Método:** GET
**URL:** baseUrl/dataestudio/1

---

## GET all dataestudio
- **Path:** baseUrl/dataestudio
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ASPIRANTE, ADMIN
- **Respuesta:** List<DataEstudioDto>

### Ejemplo petición (GET all)
**Método:** GET
**URL:** baseUrl/dataestudio

---

**Notas:**
- Todos los endpoints requieren autenticación JWT.
- El campo `estado` puede ser actualizado a `INACTIVO` mediante el endpoint PUT para desactivar el registro.
- Los roles permitidos pueden variar según la lógica de seguridad implementada.
