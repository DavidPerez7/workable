# Documentación de Endpoints de Usuario

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/usuario
```

---

## 1. Obtener todos los usuarios

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
		"nombre": "Juan Pérez",
		"correo": "juanperez@email.com",
		"telefono": "3001234567",
		"rol": "ASPIRANTE",
		"activo": true,
		"municipio": {
			"id": 1,
			"nombre": "Bogotá"
		}
	},
	{
		"id": 2,
		"nombre": "Ana Gómez",
		"correo": "anagomez@email.com",
		"telefono": "3109876543",
		"rol": "RECLUTADOR",
		"activo": true,
		"municipio": {
			"id": 2,
			"nombre": "Medellín"
		}
	}
]
```

---

## 2. Obtener usuario por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del usuario a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/usuario/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Juan Pérez",
	"correo": "juanperez@email.com",
	"telefono": "3001234567",
	"rol": "ASPIRANTE",
	"activo": true,
	"municipio": {
		"id": 1,
		"nombre": "Bogotá"
	}
}
```

---

## 3. Obtener usuario por correo

**Endpoint:**
```
GET {BASE_URL}/correo/{correo}
```

**Parámetros de ruta:**
- `correo` (string): Correo del usuario a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/usuario/correo/juanperez@email.com
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Juan Pérez",
	"correo": "juanperez@email.com",
	"telefono": "3001234567",
	"rol": "ASPIRANTE",
	"activo": true,
	"municipio": {
		"id": 1,
		"nombre": "Bogotá"
	}
}
```

---

## 4. Actualizar usuario

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del usuario a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Juan Carlos Pérez",
	"telefono": "3001234568",
	"municipio": {
		"id": 1
	}
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Juan Carlos Pérez",
	"correo": "juanperez@email.com",
	"telefono": "3001234568",
	"rol": "ASPIRANTE",
	"activo": true,
	"municipio": {
		"id": 1,
		"nombre": "Bogotá"
	}
}
```

---

## 5. Desactivar usuario

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID del usuario a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/usuario/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Juan Pérez",
	"correo": "juanperez@email.com",
	"telefono": "3001234567",
	"rol": "ASPIRANTE",
	"activo": false,
	"municipio": {
		"id": 1,
		"nombre": "Bogotá"
	}
}
```

---

## 6. Eliminar usuario

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del usuario a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/usuario/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Respuestas posibles

- **200 OK:** Operación exitosa. Devuelve el usuario o listado de usuarios.
- **204 No Content:** Operación exitosa. Devuelve vacío (generalmente en DELETE).
- **400 Bad Request:** Datos inválidos o incompletos.
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado para realizar la operación.
- **404 Not Found:** Usuario no encontrado.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El token debe incluirse en el header `Authorization: Bearer {token}`.
- El campo `correo` es único en el sistema.
- El rol del usuario se define durante el registro y no puede cambiarse.
- La contraseña no se devuelve en las respuestas.
- Solo se pueden actualizar ciertos campos del usuario.

