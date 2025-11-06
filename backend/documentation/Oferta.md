# Documentación Endpoints CRUD Oferta

## Base URL: `http://localhost:8080/api`

## CREATE oferta
- **Path:** `baseUrl/oferta`
- **Http Method:** POST
- **Body:** OfertaCreateDTO
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN
- **Respuesta:** OfertaReadDTO

### Ejemplo petición (POST)
**Método:** POST
**URL:** `baseUrl/oferta`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "titulo": "Desarrollador Java",
  "descripcion": "Desarrollo de aplicaciones backend",
  "ubicacion": "Bogotá",
  "fechaLimite": "2025-12-31",
  "salario": 5000000,
  "estado": "ABIERTA",
  "requisitos": ["Spring Boot", "SQL"],
  "municipioId": 4,
  "modalidadId": 2,
  "tipoContratoId": 3,
  "empresaId": 1,
  "reclutadorId": 5,
  "beneficiosIds": [1,2]
}
```

---



## UPDATE oferta
- **Path:** `baseUrl/oferta/{id}`
- **Http Method:** PUT
- **Body:** OfertaCreateDTO
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN
- **Respuesta:** OfertaReadDTO

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** `baseUrl/oferta/10`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "titulo": "Desarrollador Java Senior",
  "descripcion": "Desarrollo avanzado de aplicaciones backend",
  "ubicacion": "Medellín",
  "fechaLimite": "2026-01-31",
  "salario": 7000000,
  "estado": "INACTIVA",
  "requisitos": ["Spring Boot", "Microservicios"],
  "municipioId": 4,
  "modalidadId": 2,
  "tipoContratoId": 3,
  "empresaId": 1,
  "reclutadorId": 5,
  "beneficiosIds": [1,2]
}
```

---



## DELETE oferta
- **Path:** `baseUrl/oferta/{id}`
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN
- **Respuesta:** 204 No Content

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** `baseUrl/oferta/10`

---



## GET oferta by ID
- **Path:** `baseUrl/oferta/{id}`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN, ASPIRANTE
- **Respuesta:** OfertaReadDTO

### Ejemplo petición (GET by ID)
**Método:** GET
**URL:** `baseUrl/oferta/10`

---



## GET all ofertas
- **Path:** `baseUrl/oferta`
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN, ASPIRANTE
- **Respuesta:** List<OfertaReadDTO>

### Ejemplo petición (GET all)
**Método:** GET
**URL:** `baseUrl/oferta`

---



## PATCH estado oferta (Activar/Inactivar)
- **Path:** `baseUrl/oferta/{id}/estado`
- **Http Method:** PATCH
- **Body:** `{ "estado": "ABIERTA" | "INACTIVA" | "CERRADA" }`
- **Roles (Authorization JWT Bearer):** RECLUTADOR, ADMIN
- **Respuesta:** OfertaReadDTO

### Ejemplo petición (PATCH estado)
**Método:** PATCH
**URL:** `baseUrl/oferta/10/estado`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "estado": "INACTIVA"
}
```

---

**Notas:**
- Todos los endpoints requieren autenticación.
- Los roles permitidos para crear, actualizar, eliminar y cambiar estado son RECLUTADOR y ADMIN.
- El endpoint de cambio de estado permite activar/inactivar/cerrar la oferta actualizando el campo `estado`.
