# ✅ CREAR NOTIFICACIÓN - Documentación Postman

## 🔗 Endpoint
**POST** `/notificacion`

## 📋 Descripción
Crea una nueva notificación para un usuario específico. La notificación se registra con título, descripción, tipo y estado inicial.

---

## 🔧 Parámetros

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioDestinoId` | Long | ID del usuario que recibirá la notificación | `1` |

### Request Body (Requerido)

```json
{
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

**Campos del Body:**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `titulo` | String | Título de la notificación | `Nueva Oferta` |
| `descripcion` | String | Descripción detallada | `Se ha publicado una nueva oferta...` |
| `tipo` | String | Tipo de notificación | `NUEVA_OFERTA` |
| `leida` | Boolean | Si ha sido leída | `false` |
| `activa` | Boolean | Si está activa | `true` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
POST http://localhost:8080/api/notificacion?usuarioDestinoId=1
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

---

## 📥 Response

### Success Response (200 OK)

```json
{
  "id": 1,
  "usuarioDestino": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

## 📊 Casos de Uso

### Caso 1: Crear Notificación de Nueva Oferta
```
Request:
POST http://localhost:8080/api/notificacion?usuarioDestinoId=1

Body:
{
  "titulo": "Nueva Oferta Disponible",
  "descripcion": "Desarrollador Java Senior en Tech Company",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}

Response: 200 OK
{
  "id": 1,
  "usuarioDestino": {"id": 1, "nombre": "Juan Pérez"},
  "titulo": "Nueva Oferta Disponible",
  "descripcion": "Desarrollador Java Senior en Tech Company",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

### Caso 2: Crear Notificación de Cambio de Estado
```
Request:
POST http://localhost:8080/api/notificacion?usuarioDestinoId=2

Body:
{
  "titulo": "Tu Postulación fue Aceptada",
  "descripcion": "¡Felicidades! Tu postulación para Desarrollador Java ha sido aceptada",
  "tipo": "CAMBIO_ESTADO",
  "leida": false,
  "activa": true
}

Response: 200 OK
{
  "id": 2,
  "usuarioDestino": {"id": 2, "nombre": "María García"},
  "titulo": "Tu Postulación fue Aceptada",
  "descripcion": "¡Felicidades! Tu postulación para Desarrollador Java ha sido aceptada",
  "tipo": "CAMBIO_ESTADO",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T11:00:00"
}
```

---

## ⚙️ Configuración en Postman

### Método
```
POST
```

### URL
```
{{baseUrl}}/notificacion
```

### Query Parameters (Tab: Params)
```
Key: usuarioDestinoId
Value: 1
```

### Headers (Tab: Headers)
```
Content-Type: application/json
```

### Body (Tab: raw - JSON)
```json
{
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": false,
  "activa": true
}
```

---

## 🎯 Tipos de Notificación Válidos

| Tipo | Descripción |
|------|------------|
| `NUEVA_OFERTA` | Notificación sobre nueva oferta |
| `CAMBIO_ESTADO` | Cambio en estado de postulación |
| `MENSAJE` | Mensaje de usuario |
| `RECORDATORIO` | Recordatorio del sistema |
| `SISTEMA` | Notificación del sistema |

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Notificación creada exitosamente |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Usuario destino no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `usuarioDestinoId` es **obligatorio**
- El body con los datos de la notificación es **obligatorio**
- Todos los campos del body son **obligatorios**
- El tipo de notificación debe ser uno de los valores válidos
- La fecha de creación se genera automáticamente en el servidor
- El `usuarioDestinoId` debe ser un número entero positivo válido

---

## 🔄 Ejemplo cURL

```bash
curl -X POST "http://localhost:8080/api/notificacion?usuarioDestinoId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nueva Oferta",
    "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
    "tipo": "NUEVA_OFERTA",
    "leida": false,
    "activa": true
  }'
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function crearNotificacion(usuarioDestinoId, datosNotificacion) {
  try {
    const response = await fetch(
      `/api/notificacion?usuarioDestinoId=${usuarioDestinoId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosNotificacion)
      }
    );
    
    if (response.ok) {
      const notificacionCreada = await response.json();
      console.log("Notificación creada:", notificacionCreada);
      return notificacionCreada;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
}

// Uso:
const notificacion = {
  titulo: "Nueva Oferta",
  descripcion: "Se ha publicado una nueva oferta que coincide con tu perfil",
  tipo: "NUEVA_OFERTA",
  leida: false,
  activa: true
};

await crearNotificacion(1, notificacion);
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario destino exista
- Valida que el tipo sea uno de los valores permitidos
- Confirma que todos los campos obligatorios estén presentes
- Genera automáticamente la fecha de creación
- Registra la notificación en la base de datos
