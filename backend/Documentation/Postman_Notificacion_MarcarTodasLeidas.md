# 📂 MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS - Documentación Postman

## 🔗 Endpoint
**PUT** `/notificacion/usuario/{usuarioId}/leidas`

## 📋 Descripción
Marca todas las notificaciones de un usuario específico con el estado especificado en el body. Útil para actualizar el estado de lectura de todas las notificaciones de un usuario.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioId` | Long | ID del usuario | `1` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
PUT http://localhost:8080/api/notificacion/usuario/1/leidas
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

**Alternativa: Marcar todas como NO leídas**
```json
{
  "leida": false
}
```

---

## 📥 Response

### Success Response (200 OK)

Retorna un objeto con el resumen de la operación.

```json
{
  "mensaje": "Todas las notificaciones actualizadas correctamente",
  "cantidad": 5,
  "usuarioId": 1,
  "estado": "leida: true",
  "timestamp": "2025-12-04T10:30:00"
}
```

O simplemente:

```json
{
  "success": true,
  "notificacionesActualizadas": 5
}
```

---

## 📊 Casos de Uso

### Caso 1: Marcar Todas como Leídas
```
Request:
PUT http://localhost:8080/api/notificacion/usuario/1/leidas
Body: { "leida": true }

Response: 200 OK
{
  "mensaje": "Todas las notificaciones actualizadas correctamente",
  "cantidad": 5,
  "usuarioId": 1,
  "estado": "leida: true",
  "timestamp": "2025-12-04T10:30:00"
}
```

### Caso 2: Marcar Todas como NO Leídas
```
Request:
PUT http://localhost:8080/api/notificacion/usuario/2/leidas
Body: { "leida": false }

Response: 200 OK
{
  "mensaje": "Todas las notificaciones actualizadas correctamente",
  "cantidad": 3,
  "usuarioId": 2,
  "estado": "leida: false",
  "timestamp": "2025-12-04T10:35:00"
}
```

### Caso 3: Usuario no Encontrado
```
Request:
PUT http://localhost:8080/api/notificacion/usuario/999/leidas
Body: { "leida": true }

Response: 404 Not Found
{
  "mensaje": "Usuario no encontrado",
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
{{baseUrl}}/notificacion/usuario/{{usuarioId}}/leidas
```

O directamente:
```
http://localhost:8080/api/notificacion/usuario/1/leidas
```

### Path Variables (Tab: Params - Path)
```
Key: usuarioId
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
// Validar que el usuario ID existe
const usuarioId = pm.variables.get("usuarioId");

if (!usuarioId) {
  pm.test("ID de usuario requerido", function() {
    pm.expect(usuarioId).to.exist;
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

pm.test("Response contiene información de la operación", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('success');
  pm.expect(jsonData).to.have.property('notificacionesActualizadas');
});

pm.test("Se actualizaron las notificaciones", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData.notificacionesActualizadas).to.be.greaterThanOrEqual(0);
});
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Notificaciones actualizadas |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Usuario no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `usuarioId` es **obligatorio**
- El body con `leida` es **obligatorio**
- `leida` debe ser un booleano (`true` o `false`)
- Actualiza **TODAS** las notificaciones del usuario al estado especificado
- Solo el propietario o un administrador pueden hacer esta operación
- El `usuarioId` debe ser un número entero positivo válido
- Este endpoint es idempotente: llamarlo múltiples veces tiene el mismo efecto
- Retorna la cantidad de notificaciones actualizadas

---

## 🔄 Ejemplo cURL

### Marcar todas como Leídas
```bash
curl -X PUT "http://localhost:8080/api/notificacion/usuario/1/leidas" \
  -H "Content-Type: application/json" \
  -d '{"leida": true}'
```

### Marcar todas como NO Leídas
```bash
curl -X PUT "http://localhost:8080/api/notificacion/usuario/1/leidas" \
  -H "Content-Type: application/json" \
  -d '{"leida": false}'
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function marcarTodasComoLeidas(usuarioId, leida = true) {
  try {
    const response = await fetch(
      `/api/notificacion/usuario/${usuarioId}/leidas`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leida })
      }
    );
    
    if (response.status === 200) {
      const resultado = await response.json();
      console.log(`${resultado.notificacionesActualizadas} notificaciones actualizadas`);
      return resultado;
    } else if (response.status === 404) {
      throw new Error('Usuario no encontrado');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al actualizar notificaciones:', error);
    throw error;
  }
}

// Uso - Marcar todas como leídas:
async function handleMarcarTodosComoLeidos() {
  try {
    const resultado = await marcarTodasComoLeidas(usuarioId, true);
    // Actualizar UI
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
    setNoLeidasCount(0);
    toast.success(`${resultado.notificacionesActualizadas} notificaciones marcadas como leídas`);
  } catch (error) {
    toast.error('No se pudieron marcar todas como leídas');
  }
}

// Uso - Marcar todas como NO leídas:
async function handleMarcarTodosComoNoLeidos() {
  try {
    const resultado = await marcarTodasComoLeidas(usuarioId, false);
    // Actualizar UI
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: false })));
    setNoLeidasCount(resultado.notificacionesActualizadas);
    toast.success(`${resultado.notificacionesActualizadas} notificaciones marcadas como no leídas`);
  } catch (error) {
    toast.error('No se pudieron actualizar las notificaciones');
  }
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario exista
- Valida que el body contenga el campo `leida`
- Valida que `leida` sea un booleano
- Valida permisos (solo owner o admin)
- Actualiza TODAS las notificaciones al estado especificado
- Mantiene las notificaciones activas
- Registra los cambios en auditoría
- Retorna resumen con cantidad de notificaciones actualizadas

---

## 💡 Casos de Uso Comunes

1. **Limpiar Notificaciones** → `leida: true`
   - Usuario hace clic en "Marcar todas como leídas"
   - Útil cuando hay muchas notificaciones acumuladas

2. **Restaurar Notificaciones** → `leida: false`
   - Marcar todas como pendientes de leer
   - Útil para revisión posterior

3. **Actualización de Interfaz**
   - Mostrar botón para marcar todas
   - Actualizar el badge de notificaciones
   - Actualizar lista de notificaciones

4. **Sincronización**
   - Marcar todas al cambiar de dispositivo
   - Sincronizar estado entre pestañas
   - Limpiar antes de cerrar sesión

---

## ⚡ Recomendaciones de UX

1. **Confirmación Visual**
   - Mostrar un toast/mensaje después de la acción
   - Actualizar el contador de notificaciones
   - Cambiar el estado visual de las notificaciones

2. **Ubicación del Botón**
   - Colocar en la parte superior del panel de notificaciones
   - Visible pero no intrusivo
   - Junto a otros controles de notificaciones

3. **Comportamiento**
   - Deshabilitar el botón si no hay notificaciones no leídas
   - Mostrar confirmación (opcional)
   - Feedback inmediato al usuario

```javascript
// Ejemplo de implementación con confirmación
async function handleMarcarTodosComoLeidos() {
  if (noLeidasCount === 0) {
    toast.info('No hay notificaciones sin leer');
    return;
  }

  if (confirm(`¿Marcar ${noLeidasCount} notificaciones como leídas?`)) {
    try {
      const resultado = await marcarTodasComoLeidas(usuarioId, true);
      setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
      setNoLeidasCount(0);
      showToast(`${resultado.notificacionesActualizadas} notificaciones marcadas como leídas`);
    } catch (error) {
      showError('No se pudieron actualizar las notificaciones');
    }
  }
}

// Ejemplo con múltiples opciones
function NotificacionPanel({ usuarioId, noLeidasCount }) {
  return (
    <div className="notificacion-controls">
      <button 
        onClick={() => marcarTodasComoLeidas(usuarioId, true)}
        disabled={noLeidasCount === 0}
      >
        Marcar todas como leídas
      </button>
      <button 
        onClick={() => marcarTodasComoLeidas(usuarioId, false)}
      >
        Marcar todas como NO leídas
      </button>
    </div>
  );
}
```
