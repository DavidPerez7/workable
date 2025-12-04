# Documentación de Endpoints de Data Experiencia

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/experiencia
```

---

## 1. Crear un registro de experiencia

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
	"cargo": "Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 3000000,
	"salarioFinal": 4500000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20",
	"usuario": {
		"id": 1
	}
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"cargo": "Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 3000000,
	"salarioFinal": 4500000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 2. Obtener todos los registros de experiencia

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
		"cargo": "Ingeniero de Sistemas",
		"empresa": "Acme Corporation",
		"descripcion": "Desarrollo e implementación de soluciones de software",
		"sector": "Tecnología",
		"tipoContrato": "INDEFINIDO",
		"salarioInicial": 3000000,
		"salarioFinal": 4500000,
		"fechaInicio": "2020-03-15",
		"fechaFinalizacion": "2023-08-20",
		"usuario": {
			"id": 1,
			"nombre": "Juan Pérez"
		}
	},
	{
		"id": 2,
		"cargo": "Desarrollador Junior",
		"empresa": "Tech Solutions",
		"descripcion": "Desarrollo de aplicaciones web",
		"sector": "Tecnología",
		"tipoContrato": "FIJO",
		"salarioInicial": 2000000,
		"salarioFinal": 2500000,
		"fechaInicio": "2019-01-10",
		"fechaFinalizacion": "2020-02-28",
		"usuario": {
			"id": 1,
			"nombre": "Juan Pérez"
		}
	}
]
```

---

## 3. Obtener registro de experiencia por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de experiencia a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/experiencia/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"cargo": "Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 3000000,
	"salarioFinal": 4500000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 4. Actualizar registro de experiencia

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de experiencia a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"cargo": "Senior Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Líder técnico en desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 4500000,
	"salarioFinal": 6000000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"cargo": "Senior Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Líder técnico en desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 4500000,
	"salarioFinal": 6000000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 5. Desactivar registro de experiencia

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de experiencia a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/experiencia/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"cargo": "Ingeniero de Sistemas",
	"empresa": "Acme Corporation",
	"descripcion": "Desarrollo e implementación de soluciones de software",
	"sector": "Tecnología",
	"tipoContrato": "INDEFINIDO",
	"salarioInicial": 3000000,
	"salarioFinal": 4500000,
	"fechaInicio": "2020-03-15",
	"fechaFinalizacion": "2023-08-20",
	"activo": false,
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 6. Eliminar registro de experiencia

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de experiencia a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/experiencia/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Valores permitidos

### Tipo de Contrato:
- `INDEFINIDO`
- `FIJO`
- `PASANTIA`
- `CONTRATISTA`
- `FREELANCE`
- `TEMPORAL`

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve el registro o listado de registros.
- **201 Created:** Registro creado correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Registro no encontrado.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El campo `usuario` es requerido y debe contener el ID de un usuario válido.
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DD).
- El campo `fechaFinalizacion` puede ser null si el trabajo es actual.
- Los salarios deben ser números enteros positivos.
- Solo se pueden actualizar registros propios del usuario autenticado.
- El campo `descripcion` es opcional.

