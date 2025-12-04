# Municipio - Endpoints

---

## Base URL

```
http://localhost:8080/api/municipios
```

---

## Crear Municipio
**Endpoint:**
```
POST /
```

**Ejemplo de petición JSON:**
```json
{
	"id": 1,
	"nombre": "Bogotá",
	"departamento": "BOGOTA_DC"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Bogotá",
	"departamento": "BOGOTA_DC"
}
```

---

## Obtener todos los Municipios
**Endpoint:**
```
GET /
```

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Bogotá",
		"departamento": "BOGOTA_DC"
	},
	{
		"id": 2,
		"nombre": "Medellín",
		"departamento": "ANTIOQUIA"
	}
]
```

---

## Obtener Municipio por ID
**Endpoint:**
```
GET /{id}
```

**Ejemplo:** `GET /1`

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Bogotá",
	"departamento": "BOGOTA_DC"
}
```

---

## Buscar Municipios por Nombre
**Endpoint:**
```
GET /nombre/{nombre}
```

**Ejemplo:** `GET /nombre/Bogot`

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 1,
		"nombre": "Bogotá",
		"departamento": "BOGOTA_DC"
	}
]
```

---

## Obtener Municipios por Departamento
**Endpoint:**
```
GET /departamento/{departamento}
```

**Ejemplo:** `GET /departamento/ANTIOQUIA`

**Respuesta exitosa (200 OK):**
```json
[
	{
		"id": 2,
		"nombre": "Medellín",
		"departamento": "ANTIOQUIA"
	},
	{
		"id": 3,
		"nombre": "Manizales",
		"departamento": "ANTIOQUIA"
	}
]
```

---

## Actualizar Municipio
**Endpoint:**
```
PUT /{id}
```

**Ejemplo de petición JSON:**
```json
{
	"nombre": "Bogotá D.C.",
	"departamento": "BOGOTA_DC"
}
```

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Bogotá D.C.",
	"departamento": "BOGOTA_DC"
}
```

---

## Eliminar Municipio
**Endpoint:**
```
DELETE /{id}
```

**Ejemplo:** `DELETE /1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Municipio eliminado correctamente"
}
```

---

## Respuestas de Error

| Código | Significado |
|--------|-------------|
| 404 | Municipio no encontrado |
| 500 | Error del servidor |

---

## Departamentos Disponibles

```
AMAZONAS, ANTIOQUIA, ARAUCA, ATLANTICO, BOLIVAR, BOYACA, CALDAS, 
CAQUETA, CASANARE, CAUCA, CESAR, CHOCO, CORDOBA, CUNDINAMARCA, 
GUAINIA, GUAVIARE, HUILA, LA_GUAJIRA, MAGDALENA, META, NARINO, 
NORTE_DE_SANTANDER, PUTUMAYO, QUINDIO, RISARALDA, SAN_ANDRES_Y_PROVIDENCIA, 
SANTANDER, SUCRE, TOLIMA, VALLE_DEL_CAUCA, VAUPES, VICHADA, BOGOTA_DC
```

---
