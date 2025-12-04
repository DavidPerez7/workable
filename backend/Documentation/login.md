# Documentación de Endpoints de Login

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/auth
```

---

## Login de Usuario

**Endpoint:**
```
POST {BASE_URL}/login
```

**Ejemplo de petición JSON:**
```json
{
	"correo": "juanperez@email.com",
	"password": "mi_contraseña_segura"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"rol": "ASPIRANTE",
	"usuarioId": 1,
	"nombre": "Juan Pérez",
	"correo": "juanperez@email.com"
}
```

---

## Respuestas posibles

- **200 OK:** Login exitoso. Devuelve el token JWT, rol del usuario, ID, nombre y correo.
- **401 Unauthorized:** Usuario o contraseña incorrectos.
- **403 Forbidden:** Usuario inactivo.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- El campo `correo` debe ser el correo registrado del usuario.
- El campo `password` es la contraseña en texto plano (se valida contra la contraseña hasheada almacenada).
- El token JWT devuelto debe ser incluido en el header `Authorization: Bearer {token}` para acceder a endpoints protegidos.
- El token contiene información del correo y rol del usuario.

