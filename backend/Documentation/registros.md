
# Documentación de Endpoints de Registro

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/auth
```

---

---

## Registro de Aspirante

**Endpoint:**
```
POST {BASE_URL}/register-aspirante
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Juan Pérez",
	"correo": "juanperez@email.com",
	"password": "mi_contraseña_segura",
	"rol": "ASPIRANTE",
	"telefono": "3001234567",
	"municipio": {
		"id": 1
	}
}
```


---

## Registro de Reclutador

**Endpoint:**
```
POST {BASE_URL}/register-reclutador
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Ana Gómez",
	"correo": "anagomez@email.com",
	"password": "otra_contraseña_segura",
	"rol": "RECLUTADOR",
	"telefono": "3109876543",
	"municipio": {
		"id": 2
	}
}
```


---

## Respuestas posibles

- **200 OK:** Usuario creado correctamente. Devuelve el usuario creado en formato JSON.
- **400 Bad Request:** El correo ya está registrado.
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- El campo `rol` debe ser "ASPIRANTE" o "RECLUTADOR" según el endpoint.
- El campo `municipio` debe contener el id de un municipio válido.
- La contraseña se almacena de forma segura (hasheada).
