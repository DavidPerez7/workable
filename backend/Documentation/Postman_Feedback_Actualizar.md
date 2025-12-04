# ✏️ ACTUALIZAR FEEDBACK - Documentación Postman

## 🔗 Endpoint
**PUT** `/feedback/{id}`

## 📋 Descripción
Actualiza un feedback/valoración existente. Permite modificar calificación, comentario, recomendación y otros campos del feedback.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID del feedback a actualizar | `1` |

### Body Parameters (Al menos uno requerido)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `calificacion` | Integer | Nueva calificación (1-5) | `5` |
| `comentario` | String | Nuevo comentario | `Mejor experiencia` |
| `recomendacion` | Boolean | Nueva recomendación | `true` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
PUT http://localhost:8080/api/feedback/1
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "calificacion": 5,
  "comentario": "Excelente experiencia laboral, muy recomendable",
  "recomendacion": true
}
```

---

## 📥 Response

### Success Response (200 OK)

```json
{
  "id": 1,
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 5,
  "comentario": "Excelente experiencia laboral, muy recomendable",
  "recomendacion": true,
  "fechaCreacion": "2025-12-04T10:30:00",
  "fechaActualizacion": "2025-12-04T11:00:00",
  "activo": true
}
```

### Error Response (404 Not Found)

```json
{
  "error": "Feedback no encontrado",
  "mensaje": "No se encontró un feedback con el ID 999",
  "timestamp": "2025-12-04T11:00:00",
  "status": 404
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Validación fallida",
  "mensaje": "La calificación debe estar entre 1 y 5",
  "timestamp": "2025-12-04T11:00:00",
  "status": 400
}
```

---

## 📊 Casos de Uso

### Caso 1: Actualizar Calificación y Comentario
```
Request:
PUT http://localhost:8080/api/feedback/1
Body:
{
  "calificacion": 5,
  "comentario": "Experiencia increíble, mejoró mi calidad de vida",
  "recomendacion": true
}

Response: 200 OK
{
  "id": 1,
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 5,
  "comentario": "Experiencia increíble, mejoró mi calidad de vida",
  "recomendacion": true,
  "fechaCreacion": "2025-12-04T10:30:00",
  "fechaActualizacion": "2025-12-04T11:00:00",
  "activo": true
}
```

### Caso 2: Solo Actualizar Recomendación
```
Request:
PUT http://localhost:8080/api/feedback/2
Body:
{
  "recomendacion": false
}

Response: 200 OK
{
  "id": 2,
  "usuarioId": 2,
  "empresaId": 3,
  "ofertaId": null,
  "calificacion": 3,
  "comentario": "Buena experiencia, podrían mejorar",
  "recomendacion": false,
  "fechaCreacion": "2025-12-04T10:35:00",
  "fechaActualizacion": "2025-12-04T11:05:00",
  "activo": true
}
```

### Caso 3: Feedback no Encontrado
```
Request:
PUT http://localhost:8080/api/feedback/999
Body:
{
  "calificacion": 4,
  "comentario": "Actualizado"
}

Response: 404 Not Found
{
  "error": "Feedback no encontrado",
  "mensaje": "No se encontró un feedback con el ID 999",
  "status": 404
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
{{baseUrl}}/feedback/{{feedbackId}}
```

O directamente:
```
http://localhost:8080/api/feedback/1
```

### Path Variables (Tab: Params - Path)
```
Key: id
Value: 1
```

### Headers (Tab: Headers)
```
Content-Type: application/json
```

### Body (Tab: raw - JSON)
```json
{
  "calificacion": 5,
  "comentario": "Excelente experiencia",
  "recomendacion": true
}
```

### Pre-request Script (Opcional)
```javascript
// Validar que el feedback ID existe
const feedbackId = pm.variables.get("feedbackId");

if (!feedbackId) {
  pm.test("ID de feedback requerido", function() {
    pm.expect(feedbackId).to.exist;
  });
}
```

### Tests (Opcional)
```javascript
pm.test("Status code es 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Calificación actualizada", function() {
  const requestData = JSON.parse(pm.request.body.raw);
  const responseData = pm.response.json();
  
  if (requestData.calificacion) {
    pm.expect(responseData.calificacion).to.equal(requestData.calificacion);
  }
});

pm.test("Comentario actualizado", function() {
  const requestData = JSON.parse(pm.request.body.raw);
  const responseData = pm.response.json();
  
  if (requestData.comentario) {
    pm.expect(responseData.comentario).to.equal(requestData.comentario);
  }
});

pm.test("Fecha de actualización se modificó", function() {
  const responseData = pm.response.json();
  pm.expect(responseData).to.have.property('fechaActualizacion');
});

pm.test("Fecha de creación se mantiene", function() {
  const responseData = pm.response.json();
  pm.expect(responseData).to.have.property('fechaCreacion');
});
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Feedback actualizado |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Feedback no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- El `id` es **obligatorio** en la URL
- Al menos un campo debe ser actualizado
- `calificacion` debe estar entre **1 y 5** si se actualiza
- `comentario` no puede estar vacío si se actualiza
- La fecha de creación **no cambia**
- La fecha de actualización se actualiza automáticamente
- Solo se actualizan los campos proporcionados en el body
- Otros campos se mantienen sin cambios

---

## 🔄 Ejemplo cURL

### Actualizar Calificación
```bash
curl -X PUT "http://localhost:8080/api/feedback/1" \
  -H "Content-Type: application/json" \
  -d '{
    "calificacion": 5,
    "comentario": "Excelente experiencia"
  }'
```

### Actualizar Solo Recomendación
```bash
curl -X PUT "http://localhost:8080/api/feedback/1" \
  -H "Content-Type: application/json" \
  -d '{
    "recomendacion": true
  }'
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function actualizarFeedback(feedbackId, actualizaciones) {
  try {
    const response = await fetch(
      `/api/feedback/${feedbackId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actualizaciones)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || 'Error al actualizar feedback');
    }

    const feedbackActualizado = await response.json();
    return feedbackActualizado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Uso en Componente React
```javascript
// Actualizar calificación
async function handleActualizarCalificacion(feedbackId, nuevaCalificacion) {
  try {
    const resultado = await actualizarFeedback(feedbackId, {
      calificacion: nuevaCalificacion
    });
    
    // Actualizar state
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? resultado : f
    ));
    
    toast.success('Feedback actualizado');
  } catch (error) {
    toast.error('Error al actualizar');
  }
}

// Actualizar comentario
async function handleActualizarComentario(feedbackId, nuevoComentario) {
  try {
    const resultado = await actualizarFeedback(feedbackId, {
      comentario: nuevoComentario
    });
    
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? resultado : f
    ));
    
    toast.success('Comentario actualizado');
  } catch (error) {
    toast.error('Error al actualizar');
  }
}

// Actualizar recomendación
async function handleToggleRecomendacion(feedbackId, feedbackActual) {
  try {
    const resultado = await actualizarFeedback(feedbackId, {
      recomendacion: !feedbackActual.recomendacion
    });
    
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? resultado : f
    ));
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Con Validación Completa
```javascript
async function actualizarFeedbackConValidacion(feedbackId, actualizaciones) {
  // Validaciones
  if (actualizaciones.calificacion) {
    if (actualizaciones.calificacion < 1 || actualizaciones.calificacion > 5) {
      throw new Error('Calificación debe estar entre 1 y 5');
    }
  }

  if (actualizaciones.comentario) {
    if (actualizaciones.comentario.trim().length === 0) {
      throw new Error('El comentario no puede estar vacío');
    }
    if (actualizaciones.comentario.length > 500) {
      throw new Error('El comentario no puede exceder 500 caracteres');
    }
  }

  if (typeof actualizaciones.recomendacion !== 'undefined' && 
      typeof actualizaciones.recomendacion !== 'boolean') {
    throw new Error('Recomendación debe ser true o false');
  }

  return await actualizarFeedback(feedbackId, actualizaciones);
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el feedback exista
- Si se proporciona calificacion, valida que esté entre 1 y 5
- Si se proporciona comentario, valida que no esté vacío
- Si se proporciona recomendacion, valida que sea booleano
- Actualiza solo los campos proporcionados
- Mantiene los IDs de usuario y empresa sin cambios
- Preserva la fecha de creación
- Actualiza automáticamente la fecha de actualización
- Retorna el feedback completo actualizado

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- El usuario desea editar su feedback existente
- Se necesita cambiar la calificación
- Se desea actualizar el comentario
- Se necesita cambiar la recomendación
- Como parte de una edición de perfil

### Patrones Comunes

```javascript
// Patrón: Actualización parcial
const actualizarSoloComentario = (feedbackId, nuevoComentario) => {
  return actualizarFeedback(feedbackId, { comentario: nuevoComentario });
};

// Patrón: Actualización múltiple
const actualizarMultiple = (feedbackId, cambios) => {
  return actualizarFeedback(feedbackId, cambios);
};

// Patrón: Toggle de recomendación
const toggleRecomendacion = (feedbackId, feedbackActual) => {
  return actualizarFeedback(feedbackId, {
    recomendacion: !feedbackActual.recomendacion
  });
};
```

---

**Última actualización:** Diciembre 2025
