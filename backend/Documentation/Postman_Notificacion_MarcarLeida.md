# 📖 MARCAR NOTIFICACIÓN COMO LEÍDA - Documentación Postman

## 🔗 Endpoint
**PUT** `/notificacion/{id}/leida`

## 📋 Descripción
Marca una notificación específica con el estado de lectura especificado en el body. Actualiza el campo `leida` de la notificación.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID de la notificación a actualizar | `1` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
PUT http://localhost:8080/api/notificacion/1/leida
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "leida": true
}
```

**Alternativa: Marcar como NO leída**
```json
{
  "leida": false
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
  "leida": true,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

---

## 📊 Casos de Uso

### Caso 1: Marcar Notificación como Leída Exitosamente
```
Request:
PUT http://localhost:8080/api/notificacion/1/leida
Body: { "leida": true }

Response: 200 OK
{
  "id": 1,
  "usuarioDestino": {"id": 1, "nombre": "Juan Pérez"},
  "titulo": "Nueva Oferta",
  "descripcion": "Se ha publicado una nueva oferta que coincide con tu perfil",
  "tipo": "NUEVA_OFERTA",
  "leida": true,
  "activa": true,
  "fechaCreacion": "2025-12-04T10:30:00"
}
```

### Caso 2: Marcar Notificación como NO Leída
```
Request:
PUT http://localhost:8080/api/notificacion/2/leida
Body: { "leida": false }

Response: 200 OK
{
  "id": 2,
  "usuarioDestino": {"id": 1, "nombre": "Juan Pérez"},
  "titulo": "Tu postulación fue rechazada",
  "tipo": "CAMBIO_ESTADO",
  "leida": false,
  "activa": true,
  "fechaCreacion": "2025-12-04T09:00:00"
}
```

### Caso 3: Notificación no Encontrada
```
Request:
PUT http://localhost:8080/api/notificacion/999/leida
Body: { "leida": true }

Response: 404 Not Found
{
  "mensaje": "Notificación no encontrada",
  "timestamp": "2025-12-04T10:35:00"
}
```

---

## ⚙️ Configuración en Postman

### Método
```
PUT
```

### URL
```
{{baseUrl}}/notificacion/{{notificacionId}}/leida
```

O directamente:
```
http://localhost:8080/api/notificacion/1/leida
```

### Path Variables (Tab: Params - Path)
```
Key: id
Value: 1
```

### Headers
```
Content-Type: application/json
```

### Body (Tab: raw - JSON)
```json
{
  "leida": true
}
```

### Pre-request Script (Opcional)
```javascript
// Validar que la notificación ID existe
const notificacionId = pm.variables.get("notificacionId");

if (!notificacionId) {
  pm.test("ID de notificación requerido", function() {
    pm.expect(notificacionId).to.exist;
  });
}
```

### Tests (Opcional)
```javascript
pm.test("Status code es 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Body es válido", function() {
  const jsonData = pm.request.body.raw ? JSON.parse(pm.request.body.raw) : null;
  pm.expect(jsonData).to.have.property('leida');
  pm.expect(jsonData.leida).to.be.a('boolean');
});

pm.test("Notificación tiene el estado especificado", function() {
  const requestData = JSON.parse(pm.request.body.raw);
  const responseData = pm.response.json();
  pm.expect(responseData.leida).to.equal(requestData.leida);
});

pm.test("Response contiene la información completa", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('id');
  pm.expect(jsonData).to.have.property('titulo');
  pm.expect(jsonData).to.have.property('usuarioDestino');
  pm.expect(jsonData).to.have.property('leida');
});
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Marcada como leída exitosamente |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Notificación no encontrada |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `id` es **obligatorio**
- El body con `leida` es **obligatorio**
- `leida` debe ser un booleano (`true` o `false`)
- Este endpoint actualiza el estado `leida` al valor especificado en el body
- Si la notificación ya tiene ese estado, se actualiza de todos modos
- El `id` debe ser un número entero positivo válido
- Se retorna la notificación actualizada con todos sus campos

---

## 🔄 Ejemplo cURL

```bash
curl -X PUT "http://localhost:8080/api/notificacion/1/leida" \
  -H "Content-Type: application/json" \
  -d '{"leida": true}'
```

### Marcar como NO Leída
```bash
curl -X PUT "http://localhost:8080/api/notificacion/1/leida" \
  -H "Content-Type: application/json" \
  -d '{"leida": false}'
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function marcarNotificacionComoLeida(notificacionId, leida = true) {
  try {
    const response = await fetch(
      `/api/notificacion/${notificacionId}/leida`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leida })
      }
    );
    
    if (response.ok) {
      const notificacionActualizada = await response.json();
      console.log("Notificación actualizada");
      return notificacionActualizada;
    } else if (response.status === 404) {
      console.error("Notificación no encontrada");
      throw new Error('La notificación no existe');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    throw error;
  }
}

// Uso - Marcar como leída:
async function handleClickNotificacion(notificacionId) {
  try {
    const notificacionActualizada = await marcarNotificacionComoLeida(notificacionId, true);
    // Actualizar UI con la notificación marcada como leída
    setNotificaciones(notificaciones.map(n => 
      n.id === notificacionId ? notificacionActualizada : n
    ));
  } catch (error) {
    alert('No se pudo marcar la notificación como leída');
  }
}

// Uso - Marcar como NO leída:
async function handleMarcarNoLeida(notificacionId) {
  try {
    const notificacionActualizada = await marcarNotificacionComoLeida(notificacionId, false);
    // Actualizar UI
    setNotificaciones(notificaciones.map(n => 
      n.id === notificacionId ? notificacionActualizada : n
    ));
  } catch (error) {
    alert('No se pudo actualizar la notificación');
  }
}

// Ejemplo de uso en JSX:
<button 
  onClick={() => handleClickNotificacion(notificacion.id)}
  className={notificacion.leida ? 'notification-read' : 'notification-unread'}
>
  {notificacion.titulo}
  {!notificacion.leida && <span className="badge">Nueva</span>}
</button>
```

---

## 🔐 Validaciones del Backend

- Verifica que la notificación exista
- Valida que el body contenga el campo `leida`
- Valida que `leida` sea un booleano
- Actualiza el campo `leida` al valor especificado
- Registra el cambio en auditoría
- Retorna la notificación actualizada
- No modifica otros campos de la notificación

---

## 💡 Casos de Uso Comunes

1. **Usuario hace clic en una notificación** → `leida: true`
   - Mostrar contenido de la notificación
   - Llamar a este endpoint
   - Actualizar el contador de no leídas

2. **Usuario marca como NO leída** → `leida: false`
   - Permitir desmarcar notificaciones
   - Útil para revisar después

3. **Actualizar indicador visual**
   - Cambiar icono según estado
   - Reducir badge de no leídas
   - Actualizar lista en tiempo real

---

## ⚡ Recomendación

Se recomienda llamar a este endpoint cuando:
- El usuario abre o hace clic en una notificación
- El usuario marca como no leída
- Automáticamente después de cierto tiempo mostrando la notificación
- Cuando el usuario navega a secciones relacionadas
