# 🗑️ ELIMINAR FEEDBACK - Documentación Postman

## 🔗 Endpoint
**DELETE** `/feedback/{id}`

## 📋 Descripción
Elimina un feedback/valoración existente. Realiza eliminación física del registro (no soft delete).

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | Long | ID del feedback a eliminar | `1` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
DELETE http://localhost:8080/api/feedback/1
```

### Headers
```
Content-Type: application/json
```

### Body
Sin body

---

## 📥 Response

### Success Response (204 No Content)

Sin cuerpo de respuesta. Solo confirma que el feedback fue eliminado.

```
HTTP 204 No Content
```

---

## 📊 Casos de Uso

### Caso 1: Eliminar Feedback Exitosamente
```
Request:
DELETE http://localhost:8080/api/feedback/1

Response: 204 No Content
(Sin cuerpo de respuesta)
```

### Caso 2: Feedback no Encontrado
```
Request:
DELETE http://localhost:8080/api/feedback/999

Response: 404 Not Found
{
  "error": "Feedback no encontrado",
  "mensaje": "No se encontró un feedback con el ID 999",
  "timestamp": "2025-12-04T11:00:00",
  "status": 404
}
```

---

## ⚙️ Configuración en Postman

### Método
```
DELETE
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

### Headers
```
Content-Type: application/json
```

### Body
```
Sin body
```

### Pre-request Script (Opcional)
```javascript
// Confirmación antes de eliminar
const feedbackId = pm.variables.get("feedbackId");

if (!feedbackId) {
  pm.test("ID de feedback requerido", function() {
    pm.expect(feedbackId).to.exist;
  });
}

console.log(`Eliminando feedback con ID: ${feedbackId}`);
```

### Tests (Opcional)
```javascript
pm.test("Status code es 204", function() {
  pm.response.to.have.status(204);
});

pm.test("Response no tiene body", function() {
  pm.expect(pm.response.text()).to.be.empty;
});

pm.test("Solicitud fue DELETE", function() {
  pm.expect(pm.request.method).to.equal("DELETE");
});

// Limpiar variable después de eliminar
pm.environment.unset("feedbackId");
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `204` | No Content - Feedback eliminado |
| `400` | Bad Request - ID inválido |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Feedback no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- El `id` es **obligatorio**
- Esta operación **elimina permanentemente** el feedback
- **No se puede deshacer** la eliminación
- Solo el propietario o un administrador pueden eliminar
- El `id` debe ser un número entero positivo válido
- No retorna cuerpo de respuesta (204 No Content)
- Se recomienda pedir confirmación al usuario antes de eliminar

---

## 🔄 Ejemplo cURL

```bash
curl -X DELETE "http://localhost:8080/api/feedback/1" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function eliminarFeedback(feedbackId) {
  try {
    const response = await fetch(
      `/api/feedback/${feedbackId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 204) {
      console.log("Feedback eliminado exitosamente");
      return true;
    } else if (response.status === 404) {
      throw new Error('Feedback no encontrado');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    throw error;
  }
}
```

### Uso en Componente React
```javascript
// Función con confirmación
async function handleEliminarFeedback(feedbackId) {
  // Pedir confirmación
  if (!window.confirm('¿Está seguro de que desea eliminar este feedback? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    await eliminarFeedback(feedbackId);
    
    // Actualizar UI
    setFeedbacks(feedbacks.filter(f => f.id !== feedbackId));
    
    toast.success('Feedback eliminado');
  } catch (error) {
    toast.error('No se pudo eliminar el feedback');
    console.error('Error:', error);
  }
}

// Botón en JSX
<button 
  onClick={() => handleEliminarFeedback(feedback.id)}
  className="btn-danger"
>
  Eliminar
</button>
```

### Con Confirmación Modal
```javascript
function FeedbackItem({ feedback, onEliminar }) {
  const [confirmando, setConfirmando] = useState(false);

  const handleConfirmar = async () => {
    try {
      await eliminarFeedback(feedback.id);
      setConfirmando(false);
      onEliminar(feedback.id);
      toast.success('Feedback eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (confirmando) {
    return (
      <div className="confirmacion-modal">
        <p>¿Eliminar este feedback definitivamente?</p>
        <button onClick={handleConfirmar}>Sí, eliminar</button>
        <button onClick={() => setConfirmando(false)}>Cancelar</button>
      </div>
    );
  }

  return (
    <div className="feedback-item">
      <div className="feedback-content">
        <p className="calificacion">⭐ {feedback.calificacion}/5</p>
        <p className="comentario">{feedback.comentario}</p>
        <p className="recomendacion">
          {feedback.recomendacion ? '✓ Recomendable' : '✗ No recomendable'}
        </p>
      </div>
      <button 
        onClick={() => setConfirmando(true)}
        className="btn-delete"
      >
        Eliminar
      </button>
    </div>
  );
}
```

### Con Manejo de Errores Avanzado
```javascript
async function eliminarFeedbackSeguro(feedbackId, usuarioActual) {
  try {
    // Pre-validaciones
    if (!feedbackId) {
      throw new Error('ID de feedback inválido');
    }

    // Obtener el feedback para verificar permisos
    const feedbackResponse = await fetch(`/api/feedback/${feedbackId}`);
    const feedback = await feedbackResponse.json();

    // Verificar permisos (solo propietario o admin)
    if (feedback.usuarioId !== usuarioActual.id && usuarioActual.rol !== 'ADMIN') {
      throw new Error('No tiene permisos para eliminar este feedback');
    }

    // Proceder con eliminación
    const response = await fetch(
      `/api/feedback/${feedbackId}`,
      { method: 'DELETE' }
    );

    if (response.status === 204) {
      return { success: true, mensaje: 'Feedback eliminado' };
    } else if (response.status === 404) {
      throw new Error('Feedback no encontrado');
    } else {
      throw new Error('Error al eliminar');
    }

  } catch (error) {
    console.error('Error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el feedback exista
- Valida permisos del usuario (propietario o admin)
- Realiza eliminación física (no soft delete)
- Valida el ID del feedback
- Registra la operación en auditoría
- No retorna cuerpo de respuesta
- Retorna 204 No Content si tiene éxito

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- El usuario desea eliminar su propio feedback
- Un administrador elimina feedback inapropiado
- Se necesita limpiar feedbacks duplicados
- El usuario se arrepiente de su feedback
- Como parte de una limpieza de datos

### Mejores Prácticas

```javascript
// ✅ BIEN: Pedir confirmación
async function borrarConConfirmacion(feedbackId) {
  if (confirm('¿Eliminar definitivamente?')) {
    await eliminarFeedback(feedbackId);
  }
}

// ✅ BIEN: Mostrar modal
const mostrarModalConfirmacion = (feedbackId, onConfirmar) => {
  abrirModal({
    titulo: '¿Eliminar Feedback?',
    mensaje: 'Esta acción es irreversible',
    botones: [
      { texto: 'Cancelar', onClick: cerrarModal },
      { texto: 'Eliminar', onClick: () => onConfirmar(feedbackId) }
    ]
  });
};

// ✅ BIEN: Mostrar toast
await eliminarFeedback(feedbackId);
toast.success('Feedback eliminado correctamente');

// ❌ MAL: Eliminar sin confirmación
// await eliminarFeedback(feedbackId);

// ❌ MAL: Sin manejar errores
// fetch(`/api/feedback/${id}`, { method: 'DELETE' });
```

---

## 📋 Checklist de Implementación

- [ ] Pedir confirmación antes de eliminar
- [ ] Mostrar mensaje de éxito/error
- [ ] Actualizar lista de feedback después de eliminar
- [ ] Manejar errores de red
- [ ] Validar permisos en frontend
- [ ] Registrar eliminación en logs
- [ ] Implementar undo/recuperación si es posible

---

**Última actualización:** Diciembre 2025
