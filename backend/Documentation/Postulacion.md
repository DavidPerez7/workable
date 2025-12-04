# Documentación de Endpoints de Postulación

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/postulacion
```

---

## 1. Crear una postulación

**Endpoint:**
```
POST {BASE_URL}/
```

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot.",
	"estado": "ENVIADO",
	"fechaPostulacion": "2024-12-04",
	"aspirante": {
		"id": 1
	},
	"oferta": {
		"id": 1
	}
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot.",
	"estado": "ENVIADO",
	"fechaPostulacion": "2024-12-04",
	"activo": true,
	"aspirante": {
		"id": 1,
		"nombre": "Juan Pérez",
		"correo": "juanperez@email.com"
	},
	"oferta": {
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior",
		"empresa": {
			"id": 1,
			"nombre": "Acme Corporation"
		}
	}
}
```

---

## 2. Obtener todas las postulaciones

**Endpoint:**
```
GET {BASE_URL}/
```

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot.",
		"estado": "ENVIADO",
		"fechaPostulacion": "2024-12-04",
		"activo": true,
		"aspirante": {
			"id": 1,
			"nombre": "Juan Pérez"
		},
		"oferta": {
			"id": 1,
			"titulo": "Ingeniero de Sistemas Senior"
		}
	},
	{
		"id": 2,
		"mensajeMotivacion": "Soy desarrollador con experiencia en React y tengo mucho entusiasmo por esta oportunidad.",
		"estado": "EN_REVISION",
		"fechaPostulacion": "2024-12-03",
		"activo": true,
		"aspirante": {
			"id": 2,
			"nombre": "María García"
		},
		"oferta": {
			"id": 2,
			"titulo": "Desarrollador Frontend"
		}
	}
]
```

---

## 3. Obtener postulación por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la postulación a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/postulacion/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot.",
	"estado": "ENVIADO",
	"fechaPostulacion": "2024-12-04",
	"activo": true,
	"aspirante": {
		"id": 1,
		"nombre": "Juan Pérez",
		"correo": "juanperez@email.com",
		"telefono": "3001234567"
	},
	"oferta": {
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior",
		"empresa": {
			"id": 1,
			"nombre": "Acme Corporation"
		}
	}
}
```

---

## 4. Obtener postulaciones por fecha

**Endpoint:**
```
GET {BASE_URL}/fecha/{fecha}
```

**Parámetros de ruta:**
- `fecha` (string): Fecha de postulación en formato YYYY-MM-DD

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/postulacion/fecha/2024-12-04
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"mensajeMotivacion": "Estoy muy interesado en esta posición...",
		"estado": "ENVIADO",
		"fechaPostulacion": "2024-12-04",
		"aspirante": {
			"id": 1,
			"nombre": "Juan Pérez"
		},
		"oferta": {
			"id": 1,
			"titulo": "Ingeniero de Sistemas Senior"
		}
	}
]
```

---

## 5. Obtener postulaciones por estado

**Endpoint:**
```
GET {BASE_URL}/estado/{estado}
```

**Parámetros de ruta:**
- `estado` (string): Estado de la postulación (ENVIADO, EN_REVISION, ACEPTADO, RECHAZADO, CANCELADO)

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/postulacion/estado/ENVIADO
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"mensajeMotivacion": "Estoy muy interesado en esta posición...",
		"estado": "ENVIADO",
		"fechaPostulacion": "2024-12-04",
		"aspirante": {
			"id": 1,
			"nombre": "Juan Pérez"
		},
		"oferta": {
			"id": 1,
			"titulo": "Ingeniero de Sistemas Senior"
		}
	}
]
```

---

## 6. Actualizar postulación

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la postulación a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot y AWS.",
	"estado": "EN_REVISION"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"mensajeMotivacion": "Estoy muy interesado en esta posición. Tengo 6 años de experiencia en desarrollo con Spring Boot y AWS.",
	"estado": "EN_REVISION",
	"fechaPostulacion": "2024-12-04",
	"activo": true,
	"aspirante": {
		"id": 1,
		"nombre": "Juan Pérez"
	},
	"oferta": {
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior"
	}
}
```

---

## 7. Cambiar estado de postulación

**Endpoint:**
```
PATCH {BASE_URL}/{id}/estado
```

**Parámetros de ruta:**
- `id` (integer): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"estado": "ACEPTADO"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"estado": "ACEPTADO",
	"fechaPostulacion": "2024-12-04",
	"aspirante": {
		"id": 1,
		"nombre": "Juan Pérez"
	},
	"oferta": {
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior"
	}
}
```

---

## 8. Desactivar postulación

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID de la postulación a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/postulacion/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"estado": "ENVIADO",
	"fechaPostulacion": "2024-12-04",
	"activo": false,
	"aspirante": {
		"id": 1,
		"nombre": "Juan Pérez"
	},
	"oferta": {
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior"
	}
}
```

---

## 9. Eliminar postulación

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la postulación a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/postulacion/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Valores permitidos

### Estado de Postulación:
- `ENVIADO`
- `EN_REVISION`
- `ACEPTADO`
- `RECHAZADO`
- `CANCELADO`
- `ENTREVISTA_PROGRAMADA`
- `SEGUNDA_RONDA`

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve la postulación o listado de postulaciones.
- **201 Created:** Postulación creada correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Postulación no encontrada.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El campo `aspirante` es requerido y debe contener el ID de un usuario con rol ASPIRANTE válido.
- El campo `oferta` es requerido y debe contener el ID de una oferta válida.
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DD).
- El campo `mensajeMotivacion` es opcional.
- Un aspirante solo puede postularse una vez por oferta.
- Solo aspirantes pueden crear postulaciones.
- Solo reclutadores pueden cambiar el estado de las postulaciones.
- Las transiciones de estado deben ser válidas según el flujo del proceso de selección.

