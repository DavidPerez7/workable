# Documentación de Endpoints de Empresa

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/empresa
```

---

## 1. Crear una empresa

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
	"nombre": "Acme Corporation",
	"nit": "123456789-0",
	"telefono": "6015551234",
	"correo": "contacto@acme.com",
	"descripcion": "Empresa líder en soluciones tecnológicas",
	"sitioWeb": "https://www.acme.com",
	"numeroEmpleados": 250,
	"sector": "Tecnología",
	"direccion": {
		"id": 1
	},
	"reclutador": {
		"id": 5
	}
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"nombre": "Acme Corporation",
	"nit": "123456789-0",
	"telefono": "6015551234",
	"correo": "contacto@acme.com",
	"descripcion": "Empresa líder en soluciones tecnológicas",
	"sitioWeb": "https://www.acme.com",
	"numeroEmpleados": 250,
	"sector": "Tecnología",
	"activo": true,
	"direccion": {
		"id": 1,
		"calle": "Calle 100 No 15A-50",
		"ciudad": "Bogotá"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Ana Gómez"
	}
}
```

---

## 2. Obtener todas las empresas

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
		"nombre": "Acme Corporation",
		"nit": "123456789-0",
		"telefono": "6015551234",
		"correo": "contacto@acme.com",
		"descripcion": "Empresa líder en soluciones tecnológicas",
		"sitioWeb": "https://www.acme.com",
		"numeroEmpleados": 250,
		"sector": "Tecnología",
		"activo": true,
		"direccion": {
			"id": 1,
			"calle": "Calle 100 No 15A-50",
			"ciudad": "Bogotá"
		},
		"reclutador": {
			"id": 5,
			"nombre": "Ana Gómez"
		}
	},
	{
		"id": 2,
		"nombre": "Tech Solutions S.A.S",
		"nit": "987654321-0",
		"telefono": "6015559876",
		"correo": "info@techsolutions.com",
		"descripcion": "Soluciones de software empresarial",
		"sitioWeb": "https://www.techsolutions.com",
		"numeroEmpleados": 150,
		"sector": "Desarrollo de Software",
		"activo": true,
		"direccion": {
			"id": 2,
			"calle": "Carrera 50 No 80-90",
			"ciudad": "Medellín"
		},
		"reclutador": {
			"id": 6,
			"nombre": "Carlos López"
		}
	}
]
```

---

## 3. Obtener empresa por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la empresa a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/empresa/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Acme Corporation",
	"nit": "123456789-0",
	"telefono": "6015551234",
	"correo": "contacto@acme.com",
	"descripcion": "Empresa líder en soluciones tecnológicas",
	"sitioWeb": "https://www.acme.com",
	"numeroEmpleados": 250,
	"sector": "Tecnología",
	"activo": true,
	"direccion": {
		"id": 1,
		"calle": "Calle 100 No 15A-50",
		"ciudad": "Bogotá"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Ana Gómez"
	}
}
```

---

## 4. Obtener empresa por nombre

**Endpoint:**
```
GET {BASE_URL}/nombre/{nombre}
```

**Parámetros de ruta:**
- `nombre` (string): Nombre de la empresa a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/empresa/nombre/Acme Corporation
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Acme Corporation",
	"nit": "123456789-0",
	"telefono": "6015551234",
	"correo": "contacto@acme.com",
	"descripcion": "Empresa líder en soluciones tecnológicas",
	"sitioWeb": "https://www.acme.com",
	"numeroEmpleados": 250,
	"sector": "Tecnología",
	"activo": true,
	"direccion": {
		"id": 1,
		"calle": "Calle 100 No 15A-50",
		"ciudad": "Bogotá"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Ana Gómez"
	}
}
```

---

## 5. Actualizar empresa

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la empresa a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Acme Corporation Latam",
	"telefono": "6015551235",
	"correo": "contacto@acmelatam.com",
	"descripcion": "Empresa líder en soluciones tecnológicas para Latinoamérica",
	"sitioWeb": "https://www.acmelatam.com",
	"numeroEmpleados": 350,
	"sector": "Tecnología"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Acme Corporation Latam",
	"nit": "123456789-0",
	"telefono": "6015551235",
	"correo": "contacto@acmelatam.com",
	"descripcion": "Empresa líder en soluciones tecnológicas para Latinoamérica",
	"sitioWeb": "https://www.acmelatam.com",
	"numeroEmpleados": 350,
	"sector": "Tecnología",
	"activo": true,
	"direccion": {
		"id": 1,
		"calle": "Calle 100 No 15A-50",
		"ciudad": "Bogotá"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Ana Gómez"
	}
}
```

---

## 6. Desactivar empresa

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID de la empresa a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/empresa/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Acme Corporation",
	"nit": "123456789-0",
	"telefono": "6015551234",
	"correo": "contacto@acme.com",
	"descripcion": "Empresa líder en soluciones tecnológicas",
	"sitioWeb": "https://www.acme.com",
	"numeroEmpleados": 250,
	"sector": "Tecnología",
	"activo": false,
	"direccion": {
		"id": 1,
		"calle": "Calle 100 No 15A-50",
		"ciudad": "Bogotá"
	},
	"reclutador": {
		"id": 5,
		"nombre": "Ana Gómez"
	}
}
```

---

## 7. Eliminar empresa

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID de la empresa a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/empresa/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve la empresa o listado de empresas.
- **201 Created:** Empresa creada correctamente.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Empresa no encontrada.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El campo `nit` debe ser único en el sistema.
- El campo `reclutador` es requerido y debe contener el ID de un usuario con rol RECLUTADOR válido.
- El campo `direccion` es requerido y debe contener el ID de una dirección válida.
- Solo reclutadores pueden crear y gestionar empresas.
- Solo el reclutador propietario puede actualizar o eliminar su empresa.

