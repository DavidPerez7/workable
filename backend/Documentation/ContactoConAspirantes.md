# Documentación de Endpoints de Contacto con Aspirantes

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/oferta
```

---

## 1. Enviar mensaje a un aspirante

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/contacto
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
	"asunto": "Resultado de tu entrevista",
	"mensaje": "Felicidades, has sido seleccionado para la siguiente etapa del proceso de selección.",
	"tipo": "EMAIL"
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
		}
	},
	"reclutador": {
		"id": 5,
		"nombre": "Carlos López",
		"correo": "carlos@techcorp.com"
	},
	"asunto": "Resultado de tu entrevista",
	"mensaje": "Felicidades, has sido seleccionado para la siguiente etapa del proceso de selección.",
	"tipo": "EMAIL",
	"fechaEnvio": "2025-02-15T10:45:00",
	"estado": "ENVIADO"
}
```

---

## 2. Obtener todos los mensajes de una postulación

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/contactos
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
GET http://localhost:8080/api/oferta/1/candidatos/15/contactos?usuarioIdActual=5
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
		"reclutador": {
			"id": 5,
			"nombre": "Carlos López",
			"correo": "carlos@techcorp.com"
		},
		"asunto": "Resultado de tu entrevista",
		"mensaje": "Felicidades, has sido seleccionado para la siguiente etapa del proceso de selección.",
		"tipo": "EMAIL",
		"fechaEnvio": "2025-02-15T10:45:00",
		"estado": "ENVIADO"
	},
	{
		"id": 2,
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
		"reclutador": {
			"id": 5,
			"nombre": "Carlos López",
			"correo": "carlos@techcorp.com"
		},
		"asunto": "Invitación a entrevista técnica",
		"mensaje": "Te invitamos a participar en una entrevista técnica el próximo lunes a las 10:00 AM.",
		"tipo": "EMAIL",
		"fechaEnvio": "2025-02-10T14:20:00",
		"estado": "ENVIADO"
	}
]
```

---

## 3. Obtener contacto por ID

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/contactos/{contactoId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `contactoId` (Long): ID del contacto

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/contactos/1?usuarioIdActual=5
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
			"telefono": "3001234567"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java",
			"empresa": {
				"id": 3,
				"nombre": "TechCorp"
			}
		},
		"estado": "ENTREVISTA_PROGRAMADA"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Carlos López",
		"apellido": "Martínez",
		"correo": "carlos@techcorp.com"
	},
	"asunto": "Resultado de tu entrevista",
	"mensaje": "Felicidades, has sido seleccionado para la siguiente etapa del proceso de selección.",
	"tipo": "EMAIL",
	"fechaEnvio": "2025-02-15T10:45:00",
	"estado": "ENVIADO",
	"leido": true,
	"fechaLectura": "2025-02-15T11:30:00"
}
```

---

## 4. Obtener contactos por tipo

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/contactos/tipo
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `tipo` (String): Tipo de contacto (EMAIL, SMS, LLAMADA, NOTIFICACION_APP)
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/contactos/tipo?tipo=EMAIL&usuarioIdActual=5
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
		"asunto": "Resultado de tu entrevista",
		"mensaje": "Felicidades, has sido seleccionado.",
		"tipo": "EMAIL",
		"fechaEnvio": "2025-02-15T10:45:00",
		"estado": "ENVIADO"
	}
]
```

---

## 5. Obtener contactos por estado

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/contactos/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `estado` (String): Estado del contacto (PENDIENTE, ENVIADO, FALLIDO, NO_ENTREGADO)
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/contactos/estado?estado=ENVIADO&usuarioIdActual=5
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
				"nombre": "Juan Pérez"
			}
		},
		"asunto": "Resultado de tu entrevista",
		"tipo": "EMAIL",
		"estado": "ENVIADO",
		"fechaEnvio": "2025-02-15T10:45:00"
	}
]
```

---

## 6. Enviar mensaje por SMS

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/contacto/sms
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

**Ejemplo de petición JSON:**
```json
{
	"mensaje": "Hola Juan, te confirmamos tu entrevista mañana a las 10:00 AM. Enlace: https://meet.google.com/abc"
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 2,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"telefono": "3001234567"
		},
		"oferta": {
			"id": 1,
			"titulo": "Desarrollador Backend Java"
		}
	},
	"mensaje": "Hola Juan, te confirmamos tu entrevista mañana a las 10:00 AM.",
	"tipo": "SMS",
	"fechaEnvio": "2025-02-15T10:50:00",
	"estado": "ENVIADO"
}
```

---

## 7. Enviar llamada telefónica registrada

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/contacto/llamada
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

**Ejemplo de petición JSON:**
```json
{
	"asunto": "Confirmación de entrevista",
	"mensaje": "Llamada de confirmación de entrevista",
	"duracion": 120
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 3,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez",
			"telefono": "3001234567"
		}
	},
	"asunto": "Confirmación de entrevista",
	"mensaje": "Llamada de confirmación de entrevista",
	"tipo": "LLAMADA",
	"duracion": 120,
	"fechaEnvio": "2025-02-15T11:00:00",
	"estado": "ENVIADO"
}
```

---

## 8. Actualizar mensaje

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/contactos/{contactoId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `contactoId` (Long): ID del contacto

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
	"asunto": "Actualización: Entrevista reprogramada",
	"mensaje": "Se ha reprogramado tu entrevista para el próximo miércoles a las 14:00."
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
			"nombre": "Juan Pérez"
		}
	},
	"asunto": "Actualización: Entrevista reprogramada",
	"mensaje": "Se ha reprogramado tu entrevista para el próximo miércoles a las 14:00.",
	"tipo": "EMAIL",
	"fechaEnvio": "2025-02-15T10:45:00",
	"fechaActualizacion": "2025-02-16T09:00:00",
	"estado": "ENVIADO"
}
```

---

## 9. Marcar como leído

**Endpoint:**
```
PATCH {BASE_URL}/{ofertaId}/contactos/{contactoId}/marcar-leido
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `contactoId` (Long): ID del contacto

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/oferta/1/contactos/1/marcar-leido?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez"
		}
	},
	"asunto": "Resultado de tu entrevista",
	"mensaje": "Felicidades, has sido seleccionado.",
	"tipo": "EMAIL",
	"estado": "ENVIADO",
	"leido": true,
	"fechaLectura": "2025-02-16T10:30:00"
}
```

---

## 10. Eliminar contacto

**Endpoint:**
```
DELETE {BASE_URL}/{ofertaId}/contactos/{contactoId}
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `contactoId` (Long): ID del contacto

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/oferta/1/contactos/1?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## 11. Obtener historial de comunicaciones de un candidato

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/comunicaciones
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
GET http://localhost:8080/api/oferta/1/candidatos/15/comunicaciones?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"postulacionId": 15,
	"candidato": {
		"id": 10,
		"nombre": "Juan Pérez",
		"correo": "juan@example.com",
		"telefono": "3001234567"
	},
	"totalComunicaciones": 3,
	"comunicaciones": [
		{
			"id": 2,
			"asunto": "Invitación a entrevista técnica",
			"mensaje": "Te invitamos a participar en una entrevista técnica el próximo lunes.",
			"tipo": "EMAIL",
			"fechaEnvio": "2025-02-10T14:20:00",
			"estado": "ENVIADO"
		},
		{
			"id": 1,
			"asunto": "Resultado de tu entrevista",
			"mensaje": "Felicidades, has sido seleccionado.",
			"tipo": "EMAIL",
			"fechaEnvio": "2025-02-15T10:45:00",
			"estado": "ENVIADO"
		},
		{
			"id": 3,
			"asunto": "Confirmación de entrevista",
			"mensaje": "Llamada de confirmación",
			"tipo": "LLAMADA",
			"fechaEnvio": "2025-02-15T11:00:00",
			"estado": "ENVIADO"
		}
	]
}
```

---

## 12. Enviar notificación por aplicación

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/contacto/notificacion
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

**Ejemplo de petición JSON:**
```json
{
	"titulo": "Actualización en tu proceso de selección",
	"mensaje": "Felicidades, haz avanzado a la siguiente etapa.",
	"tipo": "NOTIFICACION_APP"
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 4,
	"postulacion": {
		"id": 15,
		"usuario": {
			"id": 10,
			"nombre": "Juan Pérez"
		}
	},
	"titulo": "Actualización en tu proceso de selección",
	"mensaje": "Felicidades, haz avanzado a la siguiente etapa.",
	"tipo": "NOTIFICACION_APP",
	"fechaEnvio": "2025-02-16T09:15:00",
	"estado": "ENVIADO",
	"leido": false
}
```

---

## Valores permitidos

### Tipo de Contacto:
- `EMAIL` - Correo electrónico
- `SMS` - Mensaje de texto
- `LLAMADA` - Llamada telefónica
- `NOTIFICACION_APP` - Notificación en la aplicación

### Estado del Contacto:
- `PENDIENTE` - Contacto programado pero no enviado
- `ENVIADO` - Contacto enviado exitosamente
- `FALLIDO` - Error en el envío
- `NO_ENTREGADO` - No fue posible entregar

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve el registro o listado.
- **201 Created:** Mensaje enviado correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Contacto, postulación u oferta no encontrada.
- **409 Conflict:** Conflicto en el estado del recurso.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El parámetro `usuarioIdActual` es requerido en todos los endpoints como Query Parameter.
- Solo reclutadores de la empresa pueden enviar mensajes a candidatos.
- Los mensajes se quedan registrados en el historial del candidato.
- Se pueden enviar múltiples tipos de contacto a un mismo candidato.
- El sistema valida automáticamente números de teléfono y correos válidos.
- Cada comunicación queda registrada con fecha, hora y estado.
- Se pueden recuperar todos los mensajes enviados a un candidato.
- Los emails incluyen plantillas profesionales automáticamente.
- Los SMS tienen límite de caracteres (160 caracteres por defecto).

---

## Casos de Uso Comunes

### Enviar email de rechazo
```
POST /api/oferta/1/candidatos/15/contacto?usuarioIdActual=5
{
	"asunto": "Resultado del proceso de selección",
	"mensaje": "Agradecemos tu interés, sin embargo, continuaremos con otros candidatos.",
	"tipo": "EMAIL"
}
```

### Enviar SMS de confirmación
```
POST /api/oferta/1/candidatos/15/contacto/sms?usuarioIdActual=5
{
	"mensaje": "Confirmamos tu entrevista mañana a las 10:00. Link: https://meet.google.com/xyz"
}
```

### Enviar notificación en app
```
POST /api/oferta/1/candidatos/15/contacto/notificacion?usuarioIdActual=5
{
	"titulo": "¡Felicidades!",
	"mensaje": "Has avanzado a la siguiente ronda de entrevistas.",
	"tipo": "NOTIFICACION_APP"
}
```

### Ver historial de comunicaciones
```
GET /api/oferta/1/candidatos/15/comunicaciones?usuarioIdActual=5
```

### Hacer llamada de confirmación
```
POST /api/oferta/1/candidatos/15/contacto/llamada?usuarioIdActual=5
{
	"asunto": "Confirmación de entrevista",
	"mensaje": "Llamada de confirmación",
	"duracion": 120
}
```

