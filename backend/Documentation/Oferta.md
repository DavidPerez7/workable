# Documentación de Endpoints de Oferta

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/oferta
```

---

## 1. Crear una oferta

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
	"titulo": "Ingeniero de Sistemas Senior",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot",
	"salarioMinimo": 4000000,
	"salarioMaximo": 6000000,
	"estado": "ACTIVA",
	"fechaPublicacion": "2024-12-04",
	"fechaCierre": "2024-12-31",
	"numeroVacantes": 2,
	"empresa": {
		"id": 1
	},
	"modalidades": [
		{
			"id": 1
		},
		{
			"id": 2
		}
	],
	"tiposContrato": [
		{
			"id": 1
		}
	],
	"beneficios": [
		{
			"id": 1
		},
		{
			"id": 3
		}
	]
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"titulo": "Ingeniero de Sistemas Senior",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot",
	"salarioMinimo": 4000000,
	"salarioMaximo": 6000000,
	"estado": "ACTIVA",
	"fechaPublicacion": "2024-12-04",
	"fechaCierre": "2024-12-31",
	"numeroVacantes": 2,
	"numeroPostulaciones": 0,
	"activo": true,
	"empresa": {
		"id": 1,
		"nombre": "Acme Corporation"
	},
	"modalidades": [
		{
			"id": 1,
			"nombre": "Presencial"
		},
		{
			"id": 2,
			"nombre": "Remoto"
		}
	],
	"tiposContrato": [
		{
			"id": 1,
			"nombre": "Indefinido"
		}
	],
	"beneficios": [
		{
			"id": 1,
			"nombre": "Seguro de Salud"
		},
		{
			"id": 3,
			"nombre": "Bonificación"
		}
	]
}
```

---

## 2. Obtener todas las ofertas

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
		"titulo": "Ingeniero de Sistemas Senior",
		"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
		"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot",
		"salarioMinimo": 4000000,
		"salarioMaximo": 6000000,
		"estado": "ACTIVA",
		"fechaPublicacion": "2024-12-04",
		"fechaCierre": "2024-12-31",
		"numeroVacantes": 2,
		"numeroPostulaciones": 5,
		"activo": true,
		"empresa": {
			"id": 1,
			"nombre": "Acme Corporation"
		}
	},
	{
		"id": 2,
		"titulo": "Desarrollador Frontend",
		"descripcion": "Necesitamos un desarrollador frontend con React",
		"requisitos": "3+ años de experiencia en React",
		"salarioMinimo": 2500000,
		"salarioMaximo": 4000000,
		"estado": "ACTIVA",
		"fechaPublicacion": "2024-12-01",
		"fechaCierre": "2024-12-20",
		"numeroVacantes": 1,
		"numeroPostulaciones": 12,
		"activo": true,
		"empresa": {
			"id": 2,
			"nombre": "Tech Solutions S.A.S"
		}
	}
]
```

---

## 3. Obtener oferta por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la oferta a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"titulo": "Ingeniero de Sistemas Senior",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot",
	"salarioMinimo": 4000000,
	"salarioMaximo": 6000000,
	"estado": "ACTIVA",
	"fechaPublicacion": "2024-12-04",
	"fechaCierre": "2024-12-31",
	"numeroVacantes": 2,
	"numeroPostulaciones": 5,
	"activo": true,
	"empresa": {
		"id": 1,
		"nombre": "Acme Corporation"
	},
	"modalidades": [
		{
			"id": 1,
			"nombre": "Presencial"
		},
		{
			"id": 2,
			"nombre": "Remoto"
		}
	],
	"tiposContrato": [
		{
			"id": 1,
			"nombre": "Indefinido"
		}
	],
	"beneficios": [
		{
			"id": 1,
			"nombre": "Seguro de Salud"
		},
		{
			"id": 3,
			"nombre": "Bonificación"
		}
	]
}
```

---

## 4. Obtener oferta por nombre

**Endpoint:**
```
GET {BASE_URL}/nombre/{nombre}
```

**Parámetros de ruta:**
- `nombre` (string): Nombre/título de la oferta a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/nombre/Ingeniero de Sistemas Senior
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"titulo": "Ingeniero de Sistemas Senior",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot",
	"salarioMinimo": 4000000,
	"salarioMaximo": 6000000,
	"estado": "ACTIVA",
	"fechaPublicacion": "2024-12-04",
	"fechaCierre": "2024-12-31",
	"numeroVacantes": 2,
	"numeroPostulaciones": 5,
	"activo": true,
	"empresa": {
		"id": 1,
		"nombre": "Acme Corporation"
	}
}
```

---

## 5. Obtener ofertas por número de postulaciones

**Endpoint:**
```
GET {BASE_URL}/postulaciones/{numeroPostulaciones}
```

**Parámetros de ruta:**
- `numeroPostulaciones` (integer): Número mínimo de postulaciones

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/postulaciones/5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior",
		"numeroPostulaciones": 15,
		"estado": "ACTIVA"
	},
	{
		"id": 2,
		"titulo": "Desarrollador Frontend",
		"numeroPostulaciones": 12,
		"estado": "ACTIVA"
	}
]
```

---

## 6. Obtener ofertas por fecha de publicación

**Endpoint:**
```
GET {BASE_URL}/fecha/{fecha}
```

**Parámetros de ruta:**
- `fecha` (string): Fecha de publicación en formato YYYY-MM-DD

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/fecha/2024-12-04
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"titulo": "Ingeniero de Sistemas Senior",
		"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software",
		"fechaPublicacion": "2024-12-04",
		"estado": "ACTIVA"
	}
]
```

---

## 7. Actualizar oferta

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la oferta a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"titulo": "Ingeniero de Sistemas Senior - Actualizado",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software y cloud",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot, AWS",
	"salarioMinimo": 4500000,
	"salarioMaximo": 7000000,
	"numeroVacantes": 3,
	"estado": "ACTIVA"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"titulo": "Ingeniero de Sistemas Senior - Actualizado",
	"descripcion": "Buscamos un ingeniero de sistemas con experiencia en desarrollo de software y cloud",
	"requisitos": "5+ años de experiencia, conocimientos en Java, Spring Boot, AWS",
	"salarioMinimo": 4500000,
	"salarioMaximo": 7000000,
	"estado": "ACTIVA",
	"numeroVacantes": 3,
	"numeroPostulaciones": 5,
	"activo": true,
	"empresa": {
		"id": 1,
		"nombre": "Acme Corporation"
	}
}
```

---

## 8. Desactivar oferta

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID de la oferta a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/oferta/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"titulo": "Ingeniero de Sistemas Senior",
	"estado": "ACTIVA",
	"activo": false,
	"empresa": {
		"id": 1,
		"nombre": "Acme Corporation"
	}
}
```

---

## 9. Eliminar oferta

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la oferta a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/oferta/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Valores permitidos

### Estado de Oferta:
- `ACTIVA`
- `CERRADA`
- `PAUSADA`
- `CANCELADA`

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve la oferta o listado de ofertas.
- **201 Created:** Oferta creada correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Oferta no encontrada.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El campo `empresa` es requerido y debe contener el ID de una empresa válida.
- Los campos `modalidades`, `tiposContrato` y `beneficios` son opcionales.
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DD).
- Solo reclutadores pueden crear y gestionar ofertas.
- El salario máximo debe ser mayor o igual al salario mínimo.
- El número de vacantes debe ser mayor a 0.
- Solo el reclutador propietario puede actualizar o eliminar su oferta.

