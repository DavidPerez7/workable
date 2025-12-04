# Documentación de Endpoints de Agendar Entrevistas

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/oferta
```

---

## 1. Agendar una entrevista para un candidato

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/agendar-entrevista
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación del candidato

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador que realiza la acción

**Ejemplo de petición JSON:**
```json
{
	"fechaEntrevista": "2025-02-15T10:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"enlace": "https://meet.google.com/abc-defg-hij",
	"notas": "Entrevista técnica inicial con el candidato. Preparar preguntas sobre Spring Boot y bases de datos."
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"correo": "juan@example.com"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java"
		},
		"estado": "ENTREVISTA_PROGRAMADA"
	},
	"fechaEntrevista": "2025-02-15T10:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"enlace": "https://meet.google.com/abc-defg-hij",
	"notas": "Entrevista técnica inicial con el candidato. Preparar preguntas sobre Spring Boot y bases de datos.",
	"estado": "PROGRAMADA",
	"fechaCreacion": "2025-01-20T14:45:00",
	"recordatorioEnviado": false
}
```

---

## 2. Obtener todas las entrevistas de una oferta

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/entrevistas
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/entrevistas?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"postulacion": {
			"id": 15,
			"usuario": {
				"id": 10,
				"nombre": "Juan Pérez",
				"correo": "juan@example.com",
				"telefono": "3001234567"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			},
			"estado": "ENTREVISTA_PROGRAMADA"
		},
		"fechaEntrevista": "2025-02-15T10:30:00",
		"tipoEntrevista": "VIDEOLLAMADA",
		"enlace": "https://meet.google.com/abc-defg-hij",
		"notas": "Entrevista técnica inicial",
		"estado": "PROGRAMADA",
		"fechaCreacion": "2025-01-20T14:45:00",
		"recordatorioEnviado": false
	},
	{
		"id": 2,
		"postulacion": {
			"id": 18,
			"usuario": {
				"id": 12,
				"nombre": "María Rodríguez",
				"correo": "maria@example.com",
				"telefono": "3009876543"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			},
			"estado": "ENTREVISTA_PROGRAMADA"
		},
		"fechaEntrevista": "2025-02-16T14:00:00",
		"tipoEntrevista": "PRESENCIAL",
		"enlace": null,
		"notas": "Entrevista presencial en oficina",
		"estado": "PROGRAMADA",
		"fechaCreacion": "2025-01-20T15:30:00",
		"recordatorioEnviado": false
	}
]
```

---

## 3. Obtener entrevista por ID

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/entrevistas/{entrevistaId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `entrevistaId` (Long): ID de la entrevista

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/entrevistas/1?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"apellido": "González",
			"correo": "juan@example.com",
			"telefono": "3001234567",
			"urlFotoPerfil": "https://ejemplo.com/foto.jpg"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java",
			"empresa": {
				"id": 3,
				"nombre": "TechCorp"
			}
		},
		"estado": "ENTREVISTA_PROGRAMADA",
		"fechaPostulacion": "2025-01-15T10:30:00"
	},
	"fechaEntrevista": "2025-02-15T10:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"enlace": "https://meet.google.com/abc-defg-hij",
	"notas": "Entrevista técnica inicial con el candidato",
	"estado": "PROGRAMADA",
	"fechaCreacion": "2025-01-20T14:45:00",
	"recordatorioEnviado": false
}
```

---

## 4. Actualizar entrevista

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/entrevistas/{entrevistaId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `entrevistaId` (Long): ID de la entrevista

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"fechaEntrevista": "2025-02-16T11:00:00",
	"tipoEntrevista": "PRESENCIAL",
	"enlace": null,
	"notas": "Entrevista presencial en oficina. Sala de reuniones 3."
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"correo": "juan@example.com"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java"
		},
		"estado": "ENTREVISTA_PROGRAMADA"
	},
	"fechaEntrevista": "2025-02-16T11:00:00",
	"tipoEntrevista": "PRESENCIAL",
	"enlace": null,
	"notas": "Entrevista presencial en oficina. Sala de reuniones 3.",
	"estado": "PROGRAMADA",
	"fechaCreacion": "2025-01-20T14:45:00",
	"recordatorioEnviado": false
}
```

---

## 5. Obtener entrevistas por estado

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/entrevistas/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `estado` (String): Estado de la entrevista (PROGRAMADA, REALIZADA, CANCELADA, REPROGRAMADA)
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/entrevistas/estado?estado=PROGRAMADA&usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"postulacion": {
			"id": 15,
			"usuario": {
				"id": 10,
				"nombre": "Juan Pérez",
				"correo": "juan@example.com"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			},
			"estado": "ENTREVISTA_PROGRAMADA"
		},
		"fechaEntrevista": "2025-02-15T10:30:00",
		"tipoEntrevista": "VIDEOLLAMADA",
		"estado": "PROGRAMADA"
	}
]
```

---

## 6. Obtener entrevistas por rango de fechas

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/entrevistas/fechas
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `fechaInicio` (String): Fecha inicio en formato YYYY-MM-DD
- `fechaFin` (String): Fecha fin en formato YYYY-MM-DD
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/entrevistas/fechas?fechaInicio=2025-02-01&fechaFin=2025-02-28&usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"postulacion": {
			"id": 15,
			"usuario": {
				"id": 10,
				"nombre": "Juan Pérez",
				"correo": "juan@example.com"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			}
		},
		"fechaEntrevista": "2025-02-15T10:30:00",
		"tipoEntrevista": "VIDEOLLAMADA",
		"estado": "PROGRAMADA"
	},
	{
		"id": 2,
		"postulacion": {
			"id": 18,
			"usuario": {
				"id": 12,
				"nombre": "María Rodríguez",
				"correo": "maria@example.com"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			}
		},
		"fechaEntrevista": "2025-02-16T14:00:00",
		"tipoEntrevista": "PRESENCIAL",
		"estado": "PROGRAMADA"
	}
]
```

---

## 7. Cambiar estado de la entrevista

**Endpoint:**
```
PATCH {BASE_URL}/{ofertaId}/entrevistas/{entrevistaId}/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `entrevistaId` (Long): ID de la entrevista

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `nuevoEstado` (String): Nuevo estado (PROGRAMADA, REALIZADA, CANCELADA, REPROGRAMADA)
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/oferta/1/entrevistas/1/estado?nuevoEstado=REALIZADA&usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"correo": "juan@example.com"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java"
		},
		"estado": "ENTREVISTA_PROGRAMADA"
	},
	"fechaEntrevista": "2025-02-15T10:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"estado": "REALIZADA",
	"fechaCreacion": "2025-01-20T14:45:00",
	"fechaActualizacion": "2025-02-15T11:15:00"
}
```

---

## 8. Obtener entrevistas de un candidato

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/entrevistas
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/candidatos/15/entrevistas?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"postulacion": {
			"id": 15,
			"usuario": {
				"id": 10,
				"nombre": "Juan Pérez",
				"correo": "juan@example.com"
			},
			"oferta": {
				"id": 1,
				"titulo": "Desarrollador Backend Java"
			}
		},
		"fechaEntrevista": "2025-02-15T10:30:00",
		"tipoEntrevista": "VIDEOLLAMADA",
		"enlace": "https://meet.google.com/abc-defg-hij",
		"notas": "Entrevista técnica inicial",
		"estado": "PROGRAMADA",
		"fechaCreacion": "2025-01-20T14:45:00"
	}
]
```

---

## 9. Cancelar una entrevista

**Endpoint:**
```
DELETE {BASE_URL}/{ofertaId}/entrevistas/{entrevistaId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `entrevistaId` (Long): ID de la entrevista

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador
- `motivo` (String, opcional): Motivo de cancelación

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/oferta/1/entrevistas/1?usuarioIdActual=5&motivo=Candidato+no+disponible
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## 10. Enviar recordatorio de entrevista

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/entrevistas/{entrevistaId}/enviar-recordatorio
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `entrevistaId` (Long): ID de la entrevista

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
POST http://localhost:8080/api/oferta/1/entrevistas/1/enviar-recordatorio?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"correo": "juan@example.com"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java"
		}
	},
	"fechaEntrevista": "2025-02-15T10:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"estado": "PROGRAMADA",
	"recordatorioEnviado": true,
	"fechaRecordatorio": "2025-02-15T09:30:00"
}
```

---

## Valores permitidos

### Tipo de Entrevista:
- `PRESENCIAL` - Entrevista en la oficina
- `VIDEOLLAMADA` - Entrevista por video conferencia
- `TELEFONICA` - Entrevista telefónica
- `HIBRIDA` - Combinación de presencial y remoto

### Estado de Entrevista:
- `PROGRAMADA` - Entrevista agendada
- `REALIZADA` - Entrevista completada
- `CANCELADA` - Entrevista cancelada
- `REPROGRAMADA` - Entrevista reprogramada

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve el registro o listado de registros.
- **201 Created:** Entrevista agendada correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Entrevista o postulación no encontrada.
- **409 Conflict:** La postulación ya tiene una entrevista agendada para esa fecha.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El parámetro `usuarioIdActual` es requerido en todos los endpoints como Query Parameter.
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS) para entrevistas o (YYYY-MM-DD) para rangos.
- El campo `enlace` es requerido solo si el tipo de entrevista es VIDEOLLAMADA o HIBRIDA.
- No se pueden agendar entrevistas en fechas pasadas.
- Solo reclutadores de la empresa pueden agendar entrevistas para sus ofertas.
- Al agendar una entrevista, el estado de la postulación cambia automáticamente a ENTREVISTA_PROGRAMADA.
- Se puede obtener un historial completo de entrevistas de un candidato.
- Los cambios de estado se registran automáticamente con fecha y hora.

---

## Casos de Uso Comunes

### Agendar una entrevista presencial
```
POST /api/oferta/1/candidatos/15/agendar-entrevista?usuarioIdActual=5
{
	"fechaEntrevista": "2025-02-20T10:00:00",
	"tipoEntrevista": "PRESENCIAL",
	"notas": "Sala 3, piso 2"
}
```

### Agendar entrevista por video
```
POST /api/oferta/1/candidatos/15/agendar-entrevista?usuarioIdActual=5
{
	"fechaEntrevista": "2025-02-18T15:30:00",
	"tipoEntrevista": "VIDEOLLAMADA",
	"enlace": "https://meet.google.com/xyz-abc-123"
}
```

### Ver todas las entrevistas de una oferta
```
GET /api/oferta/1/entrevistas?usuarioIdActual=5
```

### Cambiar estado a realizada después de completar
```
PATCH /api/oferta/1/entrevistas/1/estado?nuevoEstado=REALIZADA&usuarioIdActual=5
```

