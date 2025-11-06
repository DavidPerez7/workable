# API Empresa Categoría - Documentación Postman

Base URL: `http://localhost:8080/api/empresa-categoria`

---

## 1. Listar todas las Categorías
**GET** `/api/empresa-categoria`

### Descripción
Obtiene todas las categorías de empresas registradas en el sistema.

### Request
- **Method:** GET
- **URL:** `{{base_url}}/api/empresa-categoria`
- **Headers:** Ninguno requerido

### Response Success (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "TECNOLOGIA",
    "imagenUrl": "",
    "descripcion": "Empresas dedicadas a desarrollo de software y servicios TI",
    "estado": true
  },
  {
    "id": 2,
    "nombre": "SALUD",
    "imagenUrl": "",
    "descripcion": "Instituciones de atención médica y servicios de salud",
    "estado": true
  }
]
```

---

## 2. Obtener Categoría por ID
**GET** `/api/empresa-categoria/{id}`

### Descripción
Obtiene una categoría específica por su ID.

### Request
- **Method:** GET
- **URL:** `{{base_url}}/api/empresa-categoria/1`
- **Path Variables:**
  - `id` (Integer): ID de la categoría

### Response Success (200 OK)
```json
{
  "id": 1,
  "nombre": "TECNOLOGIA",
  "imagenUrl": "",
  "descripcion": "Empresas dedicadas a desarrollo de software y servicios TI",
  "estado": true
}
```

### Response Error (404 Not Found)
```json
{
  "timestamp": "2025-11-06T15:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Categoría no encontrada con id: 99",
  "path": "/api/empresa-categoria/99"
}
```

---

## 3. Crear Categoría
**POST** `/api/empresa-categoria`

### Descripción
Crea una nueva categoría de empresa.

### Request
- **Method:** POST
- **URL:** `{{base_url}}/api/empresa-categoria`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "MANUFACTURA",
  "imagenUrl": "https://example.com/img/manufactura.png",
  "descripcion": "Empresas dedicadas a la producción y manufactura de bienes",
  "estado": "ACTIVO"
}
```

### Validaciones
- `nombre`: Requerido, no vacío, máximo 100 caracteres
- `imagenUrl`: Opcional, máximo 500 caracteres
- `descripcion`: Opcional, máximo 500 caracteres
- `estado`: Opcional (por defecto ACTIVO), valores: ACTIVO/INACTIVO

### Response Success (201 Created)
```json
{
  "id": 9,
  "nombre": "MANUFACTURA",
  "imagenUrl": "https://example.com/img/manufactura.png",
  "descripcion": "Empresas dedicadas a la producción y manufactura de bienes",
  "estado": true
}
```

### Response Error (400 Bad Request)
```json
{
  "timestamp": "2025-11-06T15:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "nombre",
      "message": "El nombre no puede estar vacío"
    }
  ]
}
```

---

## 4. Actualizar Categoría
**PUT** `/api/empresa-categoria/{id}`

### Descripción
Actualiza una categoría existente.

### Request
- **Method:** PUT
- **URL:** `{{base_url}}/api/empresa-categoria/9`
- **Headers:** 
  - `Content-Type: application/json`
- **Path Variables:**
  - `id` (Integer): ID de la categoría a actualizar
- **Body (raw JSON):**
```json
{
  "nombre": "MANUFACTURA AVANZADA",
  "imagenUrl": "https://example.com/img/manufactura-avanzada.png",
  "descripcion": "Empresas dedicadas a la producción avanzada y manufactura de bienes tecnológicos",
  "estado": "ACTIVO"
}
```

### Validaciones
- `nombre`: Requerido, no vacío, máximo 100 caracteres
- `imagenUrl`: Opcional, máximo 500 caracteres
- `descripcion`: Opcional, máximo 500 caracteres
- `estado`: Opcional, valores: ACTIVO/INACTIVO

### Response Success (200 OK)
```json
{
  "id": 9,
  "nombre": "MANUFACTURA AVANZADA",
  "imagenUrl": "https://example.com/img/manufactura-avanzada.png",
  "descripcion": "Empresas dedicadas a la producción avanzada y manufactura de bienes tecnológicos",
  "estado": true
}
```

### Response Error (404 Not Found)
```json
{
  "timestamp": "2025-11-06T15:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Categoría no encontrada con id: 99",
  "path": "/api/empresa-categoria/99"
}
```

---

## 5. Cambiar Estado de Categoría
**PATCH** `/api/empresa-categoria/{id}/estado`

### Descripción
Cambia el estado de una categoría (ACTIVO/INACTIVO) sin modificar otros campos.

### Request
- **Method:** PATCH
- **URL:** `{{base_url}}/api/empresa-categoria/9/estado?estado=INACTIVO`
- **Path Variables:**
  - `id` (Integer): ID de la categoría
- **Query Parameters:**
  - `estado` (String): Nuevo estado (ACTIVO o INACTIVO)

### Response Success (200 OK)
```json
{
  "id": 9,
  "nombre": "MANUFACTURA AVANZADA",
  "imagenUrl": "https://example.com/img/manufactura-avanzada.png",
  "descripcion": "Empresas dedicadas a la producción avanzada y manufactura de bienes tecnológicos",
  "estado": false
}
```

### Response Error (404 Not Found)
```json
{
  "timestamp": "2025-11-06T15:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Categoría no encontrada con id: 99",
  "path": "/api/empresa-categoria/99/estado"
}
```

---

## 6. Eliminar Categoría
**DELETE** `/api/empresa-categoria/{id}`

### Descripción
Elimina una categoría del sistema (eliminación física).

### Request
- **Method:** DELETE
- **URL:** `{{base_url}}/api/empresa-categoria/9`
- **Path Variables:**
  - `id` (Integer): ID de la categoría a eliminar

### Response Success (204 No Content)
Sin cuerpo de respuesta.

### Response Error (404 Not Found)
```json
{
  "timestamp": "2025-11-06T15:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Categoría no encontrada con id: 99",
  "path": "/api/empresa-categoria/99"
}
```

---

## Notas Importantes

### Estados
- `ACTIVO`: La categoría está disponible y visible en el sistema
- `INACTIVO`: La categoría está deshabilitada pero no eliminada
- En los DTOs de respuesta, el estado se devuelve como Boolean:
  - `true` = ACTIVO
  - `false` = INACTIVO

### Variables de Entorno en Postman
Crea las siguientes variables en tu colección:
- `base_url`: `http://localhost:8080`

### Categorías Predefinidas en la BD
1. TECNOLOGIA
2. SALUD
3. EDUCACION
4. FINANZAS
5. COMERCIO
6. ALIMENTICIOS
7. CONSTRUCCION
8. TRANSPORTE

### Buenas Prácticas
- Usa el endpoint `PATCH /estado` para cambios de estado en lugar de `PUT` completo
- Verifica que no haya empresas asociadas antes de eliminar una categoría
- Los campos se trimean automáticamente para evitar espacios innecesarios
- Las validaciones se aplican en el servidor con Bean Validation
