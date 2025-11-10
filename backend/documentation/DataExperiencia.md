# Documentación Endpoints CRUD DataExperiencia

## Base URL: http://localhost:8080/api

## CREATE DataExperiencia
- **Path:** /dataexperiencia
- **Http Method:** POST
- **Body:** DataExperienciaCreateDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (POST)
**Método:** POST
**URL:** http://localhost:8080/api/dataexperiencia
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "nombreEmpresa": "TechColombia SAS",
  "cargo": "Desarrollador Backend",
  "expYears": 3
}
```

---

## GET ALL DataExperiencia
- **Path:** /dataexperiencia
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** List<DataExperienciaReadDto>

### Ejemplo petición (GET)
**Método:** GET
**URL:** http://localhost:8080/api/dataexperiencia
**Headers:** Authorization: Bearer {token}

---

## GET DataExperiencia by ID
- **Path:** /dataexperiencia/{id}
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (GET)
**Método:** GET
**URL:** http://localhost:8080/api/dataexperiencia/1
**Headers:** Authorization: Bearer {token}

---

## UPDATE DataExperiencia
- **Path:** /dataexperiencia/{id}
- **Http Method:** PUT
- **Body:** DataExperienciaUpdateDto
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** http://localhost:8080/api/dataexperiencia/1
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "nombreEmpresa": "AgroTech Soluciones",
  "cargo": "Analista QA",
  "expYears": 2,
  "estado": "ACTIVO"
}
```

---

## CHANGE ESTADO DataExperiencia
- **Path:** /dataexperiencia/{id}/estado?estado=INACTIVO
- **Http Method:** PATCH
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** DataExperienciaReadDto

### Ejemplo petición (PATCH)
**Método:** PATCH
**URL:** http://localhost:8080/api/dataexperiencia/1/estado?estado=INACTIVO
**Headers:** Authorization: Bearer {token}

---

## DELETE DataExperiencia
- **Path:** /dataexperiencia/{id}
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** ADMIN, ASPIRANTE
- **Respuesta:** 204 No Content

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** http://localhost:8080/api/dataexperiencia/1
**Headers:** Authorization: Bearer {token}

---

## Notas
- Roles permitidos: ADMIN, ASPIRANTE
- El campo estado puede ser ACTIVO o INACTIVO
- Se requiere autenticación JWT Bearer para todos los endpoints excepto los públicos
