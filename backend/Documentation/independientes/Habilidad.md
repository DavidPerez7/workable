# Habilidad - Endpoints

---

## Base URL

```
http://localhost:8080/api/habilidades
```

---

## Crear Habilidad
**Endpoint:**
```
POST /
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Java",
	"tipo": "TECNICA"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Java",
	"tipo": "TECNICA",
	"isActive": true
}
```

---

## Obtener todas las Habilidades
**Endpoint:**
```
GET /
```

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Java",
		"tipo": "TECNICA",
		"isActive": true
	},
	{
		"id": 2,
		"nombre": "Inglés",
		"tipo": "IDIOMA",
		"isActive": true
	}
]
```

---

## Obtener Habilidades Activas
**Endpoint:**
```
GET /activas
```

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Java",
		"tipo": "TECNICA",
		"isActive": true
	}
]
```

---

## Obtener Habilidad por ID
**Endpoint:**
```
GET /{id}
```

**Ejemplo:** `GET /1`

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Java",
	"tipo": "TECNICA",
	"isActive": true
}
```

---

## Buscar Habilidades por Nombre
**Endpoint:**
```
GET /nombre/{nombre}
```

**Ejemplo:** `GET /nombre/Java`

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Java",
		"tipo": "TECNICA",
		"isActive": true
	}
]
```

---

## Obtener Habilidades por Tipo
**Endpoint:**
```
GET /tipo/{tipo}
```

**Ejemplo:** `GET /tipo/TECNICA`

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Java",
		"tipo": "TECNICA",
		"isActive": true
	},
	{
		"id": 3,
		"nombre": "Python",
		"tipo": "TECNICA",
		"isActive": true
	}
]
```

---

## Actualizar Habilidad
**Endpoint:**
```
PUT /{id}
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Java 21",
	"tipo": "TECNICA"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Java 21",
	"tipo": "TECNICA",
	"isActive": true
}
```

---

## Desactivar Habilidad
**Endpoint:**
```
PUT /{id}/desactivar
```

**Ejemplo:** `PUT /1/desactivar`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Habilidad desactivada correctamente",
	"habilidad": {
		"id": 1,
		"nombre": "Java",
		"tipo": "TECNICA",
		"isActive": false
	}
}
```

---

## Eliminar Habilidad
**Endpoint:**
```
DELETE /{id}
```

**Ejemplo:** `DELETE /1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Habilidad eliminada correctamente"
}
```

---

## Respuestas de Error

| Código | Significado |
|--------|-------------|
| 404 | Habilidad no encontrada |
| 500 | Error del servidor |

---

## Tipos de Habilidad

```
TECNICA  - Habilidades técnicas (Java, Python, etc.)
IDIOMA   - Idiomas (Inglés, Francés, etc.)
BLANDA   - Habilidades blandas (Liderazgo, Comunicación, etc.)
```

---
