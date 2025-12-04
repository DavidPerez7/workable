# 🔢 CONTAR NOTIFICACIONES NO LEÍDAS - Documentación Postman

## 🔗 Endpoint
**GET** `/notificacion/usuario/{usuarioId}/no-leidas`

## 📋 Descripción
Obtiene la cantidad total de notificaciones no leídas de un usuario específico. Retorna un número entero que representa el total de notificaciones pendientes de lectura.

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
GET http://localhost:8080/api/notificacion/usuario/1/no-leidas
```

### Headers
```
Content-Type: application/json
```

---

## 📥 Response

### Success Response (200 OK)

Retorna un número entero que representa la cantidad de notificaciones no leídas:

```json
5
```

---

## 📊 Casos de Uso

### Caso 1: Usuario con Notificaciones No Leídas
```
Request:
GET http://localhost:8080/api/notificacion/usuario/1/no-leidas

Response: 200 OK
5
```

### Caso 2: Usuario sin Notificaciones No Leídas
```
Request:
GET http://localhost:8080/api/notificacion/usuario/2/no-leidas

Response: 200 OK
0
```

### Caso 3: Usuario no Encontrado
```
Request:
GET http://localhost:8080/api/notificacion/usuario/999/no-leidas

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
GET
```

### URL
```
{{baseUrl}}/notificacion/usuario/{{usuarioId}}/no-leidas
```

O directamente:
```
http://localhost:8080/api/notificacion/usuario/1/no-leidas
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

### Body
```
No aplica - No se envía body
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

pm.test("Respuesta es un número", function() {
  const count = pm.response.json();
  pm.expect(typeof count).to.equal('number');
  pm.expect(count).to.be.at.least(0);
});

pm.test("Guardar el conteo en variable", function() {
  const count = pm.response.json();
  pm.variables.set("notificacionesNoLeidas", count);
});
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Solicitud exitosa, retorna el número |
| `400` | Bad Request - Parámetros inválidos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Usuario no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- El `usuarioId` es **obligatorio**
- Retorna un número entero (Long) que no puede ser negativo
- Si no hay notificaciones no leídas, retorna `0`
- El `usuarioId` debe ser un número entero positivo válido
- Este endpoint es solo para lectura, no modifica datos

---

## 🔄 Ejemplo cURL

```bash
curl -X GET "http://localhost:8080/api/notificacion/usuario/1/no-leidas" \
  -H "Content-Type: application/json"
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function obtenerNotificacionesNoLeidas(usuarioId) {
  try {
    const response = await fetch(
      `/api/notificacion/usuario/${usuarioId}/no-leidas`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const count = await response.json();
      console.log(`Notificaciones no leídas: ${count}`);
      return count;
    } else if (response.status === 404) {
      console.error("Usuario no encontrado");
      throw new Error('El usuario no existe');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    throw error;
  }
}

// Uso en componente React:
import { useState, useEffect } from 'react';

function NotificacionBadge({ usuarioId }) {
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarNoLeidas() {
      try {
        const count = await obtenerNotificacionesNoLeidas(usuarioId);
        setNoLeidas(count);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarNoLeidas();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarNoLeidas, 30000);
    return () => clearInterval(interval);
  }, [usuarioId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="notification-badge">
      <i className="bell-icon"></i>
      {noLeidas > 0 && <span className="badge">{noLeidas}</span>}
    </div>
  );
}

export default NotificacionBadge;
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario exista
- Cuenta solo las notificaciones con `leida = false`
- Filtra solo notificaciones activas
- Retorna un valor numérico válido
- No modifica ningún dato

---

## 💡 Casos de Uso Comunes

1. **Mostrar Badge de Notificaciones**
   - Llamar a este endpoint al cargar la aplicación
   - Mostrar un badge con el número de notificaciones no leídas
   - Actualizar periódicamente el badge

2. **Verificar Notificaciones Pendientes**
   - Antes de mostrar la lista de notificaciones
   - Para determinar si mostrar un indicador visual
   - Para actualizar el título de la página

3. **Actualizaciones en Tiempo Real**
   - Llamar automáticamente cada 30-60 segundos
   - Usar WebSocket para actualizaciones en vivo
   - Combinar con polling para mejor experiencia

---

## ⚡ Recomendaciones de Implementación

1. **Caché de Resultados**
   - Guardar el resultado en estado local
   - Actualizar solo cuando es necesario

2. **Actualización Periódica**
   - Crear un intervalo de actualización
   - Usar un debounce para evitar demasiadas llamadas

3. **Manejo de Errores**
   - Mostrar valor por defecto si hay error
   - Registrar errores para debugging

4. **Optimización**
   - Llamar durante la inicialización
   - Actualizar cuando se marque como leída
   - Combinar con otros endpoints de notificaciones
