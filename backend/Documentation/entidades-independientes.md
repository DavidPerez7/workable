# Documentación de Endpoints - Entidades Independientes

---

## Base URL

```
http://localhost:8080/api
```

---

## Municipio

### Crear Municipio
**Endpoint:**
```
POST /municipios
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

### Obtener todos los Municipios
**Endpoint:**
```
GET /municipios
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

### Obtener Municipio por ID
**Endpoint:**
```
GET /municipios/{id}
```

**Ejemplo:** `GET /municipios/1`

**Respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nombre": "Bogotá",
	"departamento": "BOGOTA_DC"
}
```

---

### Buscar Municipios por Nombre
**Endpoint:**
```
GET /municipios/nombre/{nombre}
```

**Ejemplo:** `GET /municipios/nombre/Bogot`

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

### Obtener Municipios por Departamento
**Endpoint:**
```
GET /municipios/departamento/{departamento}
```

**Ejemplo:** `GET /municipios/departamento/ANTIOQUIA`

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

### Actualizar Municipio
**Endpoint:**
```
PUT /municipios/{id}
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

### Eliminar Municipio
**Endpoint:**
```
DELETE /municipios/{id}
```

**Ejemplo:** `DELETE /municipios/1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Municipio eliminado correctamente"
}
```

---

## Habilidad

### Crear Habilidad
**Endpoint:**
```
POST /habilidades
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

### Obtener todas las Habilidades
**Endpoint:**
```
GET /habilidades
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

### Obtener Habilidades Activas
**Endpoint:**
```
GET /habilidades/activas
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

### Obtener Habilidad por ID
**Endpoint:**
```
GET /habilidades/{id}
```

**Ejemplo:** `GET /habilidades/1`

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

### Buscar Habilidades por Nombre
**Endpoint:**
```
GET /habilidades/nombre/{nombre}
```

**Ejemplo:** `GET /habilidades/nombre/Java`

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

### Obtener Habilidades por Tipo
**Endpoint:**
```
GET /habilidades/tipo/{tipo}
```

**Ejemplo:** `GET /habilidades/tipo/TECNICA`

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

### Actualizar Habilidad
**Endpoint:**
```
PUT /habilidades/{id}
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

### Desactivar Habilidad
**Endpoint:**
```
PUT /habilidades/{id}/desactivar
```

**Ejemplo:** `PUT /habilidades/1/desactivar`

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

### Eliminar Habilidad
**Endpoint:**
```
DELETE /habilidades/{id}
```

**Ejemplo:** `DELETE /habilidades/1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Habilidad eliminada correctamente"
}
```

---

## Empresa Categoría

### Crear Empresa Categoría
**Endpoint:**
```
POST /empresa-categorias
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

### Obtener todas las Categorías
**Endpoint:**
```
GET /empresa-categorias
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

### Obtener Categorías Activas
**Endpoint:**
```
GET /empresa-categorias/activas
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

### Obtener Categoría por ID
**Endpoint:**
```
GET /empresa-categorias/{id}
```

**Ejemplo:** `GET /empresa-categorias/1`

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

### Buscar Categorías por Nombre
**Endpoint:**
```
GET /empresa-categorias/nombre/{nombre}
```

**Ejemplo:** `GET /empresa-categorias/nombre/Tecnolog`

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

### Actualizar Categoría
**Endpoint:**
```
PUT /empresa-categorias/{id}
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

### Desactivar Categoría
**Endpoint:**
```
PUT /empresa-categorias/{id}/desactivar
```

**Ejemplo:** `PUT /empresa-categorias/1/desactivar`

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

### Eliminar Categoría
**Endpoint:**
```
DELETE /empresa-categorias/{id}
```

**Ejemplo:** `DELETE /empresa-categorias/1`

**Respuesta exitosa (200 OK):**
```json
{
	"message": "Categoría eliminada correctamente"
}
```

---

## Códigos de Respuesta

- **200 OK:** Operación exitosa
- **404 Not Found:** Recurso no encontrado
- **500 Internal Server Error:** Error del servidor

---

## Notas

- Todos los campos son sensibles a mayúsculas y minúsculas según corresponda
- Los Municipios usan IDs predefinidos de la base de datos
- Las Habilidades pueden estar activas o inactivas
- Las Categorías pueden ser desactivadas sin ser eliminadas
