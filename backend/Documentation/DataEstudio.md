# Documentación de Endpoints de Data Estudio

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/estudio
```

---

## 1. Crear un registro de estudio

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
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad Nacional de Colombia",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20",
	"usuario": {
		"id": 1
	}
}
```

**Ejemplo de respuesta exitosa (201 Created):**
```json
{
	"id": 1,
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad Nacional de Colombia",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 2. Obtener todos los registros de estudio

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
		"nivelEducativo": "LICENCIATURA",
		"institucion": "Universidad Nacional de Colombia",
		"carrera": "Ingeniería de Sistemas",
		"estado": "COMPLETADO",
		"fechaInicio": "2018-01-15",
		"fechaFinalizacion": "2022-12-20",
		"usuario": {
			"id": 1,
			"nombre": "Juan Pérez"
		}
	},
	{
		"id": 2,
		"nivelEducativo": "TECNICO",
		"institucion": "SENA",
		"carrera": "Programación",
		"estado": "EN_CURSO",
		"fechaInicio": "2023-06-01",
		"fechaFinalizacion": null,
		"usuario": {
			"id": 1,
			"nombre": "Juan Pérez"
		}
	}
]
```

---

## 3. Obtener registro de estudio por ID

**Endpoint:**
```
GET {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de estudio a obtener

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
GET http://localhost:8080/api/estudio/1
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad Nacional de Colombia",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 4. Actualizar registro de estudio

**Endpoint:**
```
PUT {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de estudio a actualizar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición JSON:**
```json
{
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad de los Andes",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad de los Andes",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20",
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 5. Desactivar registro de estudio

**Endpoint:**
```
PATCH {BASE_URL}/{id}/desactivar
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de estudio a desactivar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/estudio/1/desactivar
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 1,
	"nivelEducativo": "LICENCIATURA",
	"institucion": "Universidad Nacional de Colombia",
	"carrera": "Ingeniería de Sistemas",
	"estado": "COMPLETADO",
	"fechaInicio": "2018-01-15",
	"fechaFinalizacion": "2022-12-20",
	"activo": false,
	"usuario": {
		"id": 1,
		"nombre": "Juan Pérez"
	}
}
```

---

## 6. Eliminar registro de estudio

**Endpoint:**
```
DELETE {BASE_URL}/{id}
```

**Parámetros de ruta:**
- `id` (integer): ID del registro de estudio a eliminar

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo de petición:**
```
DELETE http://localhost:8080/api/estudio/1
```

**Ejemplo de respuesta exitosa (204 No Content):**
```
Sin contenido en la respuesta
```

---

## Valores permitidos

### Nivel Educativo:
- `PRIMARIA`
- `SECUNDARIA`
- `TECNICO`
- `TECNOLOGIA`
- `LICENCIATURA`
- `ESPECIALIZACION`
- `MAESTRIA`
- `DOCTORADO`

### Estado:
- `EN_CURSO`
- `COMPLETADO`
- `ABANDONADO`

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
- El campo `fechaFinalizacion` puede ser null si el estudio está en curso.
- Solo se pueden actualizar registros propios del usuario autenticado.

