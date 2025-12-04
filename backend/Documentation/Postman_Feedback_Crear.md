# 📝 CREAR FEEDBACK - Documentación Postman

## 🔗 Endpoint
**POST** `/feedback`

## 📋 Descripción
Crea un nuevo feedback/valoración de un usuario sobre una empresa o experiencia laboral. Permite registrar comentarios, calificaciones y recomendaciones.

---

## 🔧 Parámetros

### Body Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioId` | Long | ID del usuario que crea el feedback | `1` |
| `empresaId` | Long | ID de la empresa a valorar | `5` |
| `calificacion` | Integer | Calificación de 1 a 5 | `4` |
| `comentario` | String | Comentario o descripción del feedback | `Excelente experiencia laboral` |

### Body Parameters (Opcionales)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta relacionada (opcional) | `10` |
| `recomendacion` | Boolean | Si recomienda la empresa | `true` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
POST http://localhost:8080/api/feedback
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 4,
  "comentario": "Excelente experiencia laboral, ambiente muy agradable",
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
  "calificacion": 4,
  "comentario": "Excelente experiencia laboral, ambiente muy agradable",
  "recomendacion": true,
  "fechaCreacion": "2025-12-04T10:30:00",
  "activo": true
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Validación fallida",
  "mensaje": "La calificación debe estar entre 1 y 5",
  "timestamp": "2025-12-04T10:30:00",
  "status": 400
}
```

### Error Response (404 Not Found)

```json
{
  "error": "Recurso no encontrado",
  "mensaje": "Usuario o Empresa no encontrado",
  "timestamp": "2025-12-04T10:30:00",
  "status": 404
}
```

---

## 📊 Casos de Uso

### Caso 1: Crear Feedback Completo
```
Request:
POST http://localhost:8080/api/feedback
Body:
{
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 5,
  "comentario": "Experiencia increíble, equipo muy profesional",
  "recomendacion": true
}

Response: 200 OK
{
  "id": 1,
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 5,
  "comentario": "Experiencia increíble, equipo muy profesional",
  "recomendacion": true,
  "fechaCreacion": "2025-12-04T10:30:00",
  "activo": true
}
```

### Caso 2: Crear Feedback sin Oferta
```
Request:
POST http://localhost:8080/api/feedback
Body:
{
  "usuarioId": 2,
  "empresaId": 3,
  "calificacion": 3,
  "comentario": "Buena experiencia, podrían mejorar la comunicación",
  "recomendacion": false
}

Response: 200 OK
{
  "id": 2,
  "usuarioId": 2,
  "empresaId": 3,
  "ofertaId": null,
  "calificacion": 3,
  "comentario": "Buena experiencia, podrían mejorar la comunicación",
  "recomendacion": false,
  "fechaCreacion": "2025-12-04T10:35:00",
  "activo": true
}
```

### Caso 3: Calificación Inválida
```
Request:
POST http://localhost:8080/api/feedback
Body:
{
  "usuarioId": 1,
  "empresaId": 5,
  "calificacion": 10,
  "comentario": "Excelente",
  "recomendacion": true
}

Response: 400 Bad Request
{
  "error": "Validación fallida",
  "mensaje": "La calificación debe estar entre 1 y 5",
  "status": 400
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
{{baseUrl}}/feedback
```

O directamente:
```
http://localhost:8080/api/feedback
```

### Headers (Tab: Headers)
```
Content-Type: application/json
```

### Body (Tab: raw - JSON)
```json
{
  "usuarioId": 1,
  "empresaId": 5,
  "ofertaId": 10,
  "calificacion": 4,
  "comentario": "Excelente experiencia laboral",
  "recomendacion": true
}
```

### Pre-request Script (Opcional)
```javascript
// Asignar valores de ambiente si existen
const usuarioId = pm.environment.get("usuarioId") || 1;
const empresaId = pm.environment.get("empresaId") || 5;

console.log(`Creando feedback para usuario ${usuarioId} en empresa ${empresaId}`);
```

### Tests (Opcional)
```javascript
pm.test("Status code es 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Respuesta tiene ID", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('id');
  pm.expect(jsonData.id).to.be.a('number');
});

pm.test("Calificación es válida", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData.calificacion).to.be.within(1, 5);
});

pm.test("Contiene usuario e empresa", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('usuarioId');
  pm.expect(jsonData).to.have.property('empresaId');
  pm.expect(jsonData).to.have.property('comentario');
});

// Guardar ID para tests posteriores
if (pm.response.code === 200) {
  const feedbackId = pm.response.json().id;
  pm.environment.set("feedbackId", feedbackId);
}
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Feedback creado exitosamente |
| `400` | Bad Request - Datos inválidos o incompletos |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Usuario o Empresa no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- `usuarioId` es **obligatorio**
- `empresaId` es **obligatorio**
- `calificacion` es **obligatorio** y debe estar entre **1 y 5**
- `comentario` es **obligatorio**
- `ofertaId` es **opcional**
- `recomendacion` es **opcional** (por defecto false)
- La calificación debe ser un entero válido
- Se retorna el feedback creado con ID asignado
- La fecha de creación se asigna automáticamente

---

## 🔄 Ejemplo cURL

```bash
curl -X POST "http://localhost:8080/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 1,
    "empresaId": 5,
    "ofertaId": 10,
    "calificacion": 4,
    "comentario": "Excelente experiencia laboral",
    "recomendacion": true
  }'
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function crearFeedback(feedback) {
  try {
    const response = await fetch(
      `/api/feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || 'Error al crear feedback');
    }

    const feedbackCreado = await response.json();
    return feedbackCreado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Uso en Componente React
```javascript
// Estado
const [calificacion, setCalificacion] = useState(3);
const [comentario, setComentario] = useState('');
const [recomendacion, setRecomendacion] = useState(false);

// Función para enviar
async function handleSubmitFeedback() {
  try {
    const nuevoFeedback = {
      usuarioId: usuarioActual.id,
      empresaId: empresaId,
      ofertaId: ofertaId || null,
      calificacion: parseInt(calificacion),
      comentario: comentario,
      recomendacion: recomendacion
    };

    const resultado = await crearFeedback(nuevoFeedback);
    
    toast.success('Feedback creado exitosamente');
    
    // Limpiar formulario
    setCalificacion(3);
    setComentario('');
    setRecomendacion(false);
    
    // Actualizar lista de feedbacks
    setFeedbacks([...feedbacks, resultado]);
    
  } catch (error) {
    toast.error('No se pudo crear el feedback');
    console.error('Error:', error);
  }
}

// JSX del formulario
<form onSubmit={(e) => { e.preventDefault(); handleSubmitFeedback(); }}>
  <div>
    <label>Calificación:</label>
    <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
      <option value="1">1 - Pobre</option>
      <option value="2">2 - Aceptable</option>
      <option value="3">3 - Bueno</option>
      <option value="4">4 - Muy Bueno</option>
      <option value="5">5 - Excelente</option>
    </select>
  </div>

  <div>
    <label>Comentario:</label>
    <textarea 
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
      maxLength="500"
      required
    />
  </div>

  <div>
    <label>
      <input 
        type="checkbox"
        checked={recomendacion}
        onChange={(e) => setRecomendacion(e.target.checked)}
      />
      Recomendaría esta empresa
    </label>
  </div>

  <button type="submit">Enviar Feedback</button>
</form>
```

### Con Validación Avanzada
```javascript
async function crearFeedbackConValidacion(feedback) {
  // Validaciones
  if (!feedback.usuarioId || !feedback.empresaId) {
    throw new Error('Usuario e Empresa son requeridos');
  }

  if (feedback.calificacion < 1 || feedback.calificacion > 5) {
    throw new Error('Calificación debe estar entre 1 y 5');
  }

  if (!feedback.comentario || feedback.comentario.trim().length === 0) {
    throw new Error('El comentario no puede estar vacío');
  }

  if (feedback.comentario.length > 500) {
    throw new Error('El comentario no puede exceder 500 caracteres');
  }

  return await crearFeedback(feedback);
}
```

---

## 🔐 Validaciones del Backend

- Verifica que el usuario exista
- Verifica que la empresa exista
- Valida que la calificación esté entre 1 y 5
- Valida que el comentario no esté vacío
- Valida que el comentario tenga longitud válida
- Si se proporciona ofertaId, verifica que la oferta exista
- Crea el feedback con timestamp automático
- Retorna el feedback creado con ID asignado
- Marca el feedback como activo por defecto

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- El usuario completa una experiencia laboral
- Después de una entrevista o proceso de selección
- Cuando el usuario desea valorar una empresa
- Como parte de un formulario de evaluación
- Para recopilar feedback sobre la plataforma o empresas

### Validación en Frontend

```javascript
// Validar antes de enviar
function validarFeedback(feedback) {
  const errores = [];

  if (!feedback.usuarioId) errores.push("Usuario requerido");
  if (!feedback.empresaId) errores.push("Empresa requerida");
  if (feedback.calificacion < 1 || feedback.calificacion > 5) {
    errores.push("Calificación entre 1-5");
  }
  if (!feedback.comentario?.trim()) errores.push("Comentario requerido");
  if (feedback.comentario?.length > 500) errores.push("Comentario muy largo");

  return errores;
}

// Uso
const errores = validarFeedback(feedback);
if (errores.length > 0) {
  mostrarErrores(errores);
} else {
  crearFeedback(feedback);
}
```

---

**Última actualización:** Diciembre 2025
