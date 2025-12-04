# Empresa Categoría - Endpoints

---

## Base URL

```
http://localhost:8080/api/empresa-categorias
```

---

## Crear Empresa Categoría
**Endpoint:**
```
POST /
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Tecnología",
	"descripcion": "Empresas del sector tecnológico"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Tecnología",
	"descripcion": "Empresas del sector tecnológico",
	"isActive": true
}
```

---

## Obtener todas las Categorías
**Endpoint:**
```
GET /
```

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Tecnología",
		"descripcion": "Empresas del sector tecnológico",
		"isActive": true
	},
	{
		"id": 2,
		"nombre": "Finanzas",
		"descripcion": "Empresas del sector financiero",
		"isActive": true
	}
]
```

---

## Obtener Categorías Activas
**Endpoint:**
```
GET /activas
```

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Tecnología",
		"descripcion": "Empresas del sector tecnológico",
		"isActive": true
	}
]
```

---

## Obtener Categoría por ID
**Endpoint:**
```
GET /{id}
```

**Ejemplo:** `GET /1`

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Tecnología",
	"descripcion": "Empresas del sector tecnológico",
	"isActive": true
}
```

---

## Buscar Categorías por Nombre
**Endpoint:**
```
GET /nombre/{nombre}
```

**Ejemplo:** `GET /nombre/Tecnolog`

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Tecnología",
		"descripcion": "Empresas del sector tecnológico",
		"isActive": true
	}
]
```

---

## Actualizar Categoría
**Endpoint:**
```
PUT /{id}
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "TI",
	"descripcion": "Tecnología e Innovación"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "TI",
	"descripcion": "Tecnología e Innovación",
	"isActive": true
}
```

---

## Desactivar Categoría
**Endpoint:**
```
PUT /{id}/desactivar
```

**Ejemplo:** `PUT /1/desactivar`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Categoría desactivada correctamente",
	"categoria": {
		"id": 1,
		"nombre": "Tecnología",
		"descripcion": "Empresas del sector tecnológico",
		"isActive": false
	}
}
```

---

## Eliminar Categoría
**Endpoint:**
```
DELETE /{id}
```

**Ejemplo:** `DELETE /1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Categoría eliminada correctamente"
}
```

---

## Respuestas de Error

| Código | Significado |
|--------|-------------|
| 404 | Categoría no encontrada |
| 500 | Error del servidor |

---

## Categorías Sugeridas

```
Tecnología          - Desarrollo, Software, IT
Finanzas            - Bancos, Inversiones
Salud               - Hospitales, Clínicas
Educación           - Universidades, Institutos
Retail              - Comercio, Tiendas
Manufactura         - Producción, Fábricas
Consultoría         - Asesoramiento, Consultoría
Telecomunicaciones  - Comunicaciones, Internet
```

---
