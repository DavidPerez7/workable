# 👥 OBTENER FEEDBACK POR EMPRESA - Documentación Postman

## 🔗 Endpoint
**GET** `/feedback/empresa/{empresaId}`

## 📋 Descripción
Obtiene todos los feedbacks/valoraciones asociados a una empresa específica. Útil para ver la reputación y calificaciones de una empresa.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `empresaId` | Long | ID de la empresa | `5` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
GET http://localhost:8080/api/feedback/empresa/5
```

### Headers
```
Content-Type: application/json
```

### Body
Sin body

---

## 📥 Response

### Success Response (200 OK)

```json
[
  {
    "id": 1,
    "usuarioId": 1,
    "empresaId": 5,
    "ofertaId": 10,
    "calificacion": 5,
    "comentario": "Excelente experiencia laboral",
    "recomendacion": true,
    "fechaCreacion": "2025-12-04T10:30:00",
    "activo": true
  },
  {
    "id": 2,
    "usuarioId": 2,
    "empresaId": 5,
    "ofertaId": null,
    "calificacion": 4,
    "comentario": "Muy buena empresa, buen ambiente",
    "recomendacion": true,
    "fechaCreacion": "2025-12-04T09:15:00",
    "activo": true
  },
  {
    "id": 3,
    "usuarioId": 3,
    "empresaId": 5,
    "ofertaId": 12,
    "calificacion": 3,
    "comentario": "Buena pero con aspectos a mejorar",
    "recomendacion": false,
    "fechaCreacion": "2025-12-03T14:45:00",
    "activo": true
  }
]
```

### Empty Response (200 OK)

```json
[]
```

---

## 📊 Casos de Uso

### Caso 1: Obtener Feedbacks de una Empresa
```
Request:
GET http://localhost:8080/api/feedback/empresa/5

Response: 200 OK
[
  {
    "id": 1,
    "usuarioId": 1,
    "empresaId": 5,
    "calificacion": 5,
    "comentario": "Excelente experiencia",
    "recomendacion": true,
    "fechaCreacion": "2025-12-04T10:30:00"
  },
  {
    "id": 2,
    "usuarioId": 2,
    "empresaId": 5,
    "calificacion": 4,
    "comentario": "Muy bueno",
    "recomendacion": true,
    "fechaCreacion": "2025-12-04T09:15:00"
  }
]
```

### Caso 2: Empresa sin Feedbacks
```
Request:
GET http://localhost:8080/api/feedback/empresa/999

Response: 200 OK
[]
```

---

## ⚙️ Configuración en Postman

### Método
```
GET
```

### URL
```
{{baseUrl}}/feedback/empresa/{{empresaId}}
```

O directamente:
```
http://localhost:8080/api/feedback/empresa/5
```

### Path Variables (Tab: Params - Path)
```
Key: empresaId
Value: 5
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
// Validar que el empresa ID existe
const empresaId = pm.variables.get("empresaId");

if (!empresaId) {
  pm.test("ID de empresa requerido", function() {
    pm.expect(empresaId).to.exist;
  });
}

console.log(`Obteniendo feedbacks de empresa: ${empresaId}`);
```

### Tests (Opcional)
```javascript
pm.test("Status code es 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Response es un array", function() {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.be.an('array');
});

pm.test("Cada feedback tiene campos requeridos", function() {
  const feedbacks = pm.response.json();
  feedbacks.forEach(feedback => {
    pm.expect(feedback).to.have.property('id');
    pm.expect(feedback).to.have.property('calificacion');
    pm.expect(feedback).to.have.property('comentario');
  });
});

pm.test("Calificaciones son válidas", function() {
  const feedbacks = pm.response.json();
  feedbacks.forEach(feedback => {
    pm.expect(feedback.calificacion).to.be.within(1, 5);
  });
});

// Guardar feedbacks para tests posteriores
const feedbacks = pm.response.json();
if (feedbacks.length > 0) {
  pm.environment.set("feedbackId", feedbacks[0].id);
}
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Feedbacks obtenidos (array vacío si ninguno) |
| `400` | Bad Request - ID inválido |
| `401` | Unauthorized - No autenticado |
| `404` | Not Found - Empresa no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- El `empresaId` es **obligatorio**
- Retorna un **array** de feedbacks
- Si no hay feedbacks, retorna array vacío `[]`
- No retorna feedbacks eliminados (solo activos)
- El `empresaId` debe ser un número entero positivo válido
- La respuesta contiene **todos** los feedbacks de la empresa
- Se puede usar para calcular calificación promedio
- Útil para mostrar reputación de empresa

---

## 🔄 Ejemplo cURL

```bash
curl -X GET "http://localhost:8080/api/feedback/empresa/5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function obtenerFeedbacksPorEmpresa(empresaId) {
  try {
    const response = await fetch(
      `/api/feedback/empresa/${empresaId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const feedbacks = await response.json();
    return feedbacks || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

### Uso en Componente React
```javascript
function PerfilEmpresa({ empresaId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {
    cargarFeedbacks();
  }, [empresaId]);

  const cargarFeedbacks = async () => {
    try {
      setCargando(true);
      const datos = await obtenerFeedbacksPorEmpresa(empresaId);
      setFeedbacks(datos);
      
      // Calcular promedio
      if (datos.length > 0) {
        const suma = datos.reduce((acc, f) => acc + f.calificacion, 0);
        setPromedio((suma / datos.length).toFixed(1));
      }
    } catch (error) {
      console.error('Error al cargar feedbacks:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="perfil-empresa">
      <h2>Valoraciones de la Empresa</h2>
      
      <div className="resumen">
        <div className="calificacion-promedio">
          <span className="numero">{promedio}</span>
          <span className="estrellas">{'⭐'.repeat(Math.round(promedio))}</span>
          <span className="cantidad">({feedbacks.length} valoraciones)</span>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <p>No hay valoraciones aún</p>
      ) : (
        <div className="feedbacks-list">
          {feedbacks.map(feedback => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para mostrar cada feedback
function FeedbackCard({ feedback }) {
  return (
    <div className="feedback-card">
      <div className="header">
        <div className="calificacion">
          {'⭐'.repeat(feedback.calificacion)}
        </div>
        <span className="fecha">
          {new Date(feedback.fechaCreacion).toLocaleDateString()}
        </span>
      </div>
      
      <p className="comentario">{feedback.comentario}</p>
      
      <div className="footer">
        {feedback.recomendacion && (
          <span className="badge recomendacion">✓ Recomendable</span>
        )}
        {!feedback.recomendacion && (
          <span className="badge no-recomendacion">✗ No recomendable</span>
        )}
      </div>
    </div>
  );
}
```

### Con Filtros y Búsqueda
```javascript
function FeedbacksConFiltros({ empresaId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtroCalificacion, setFiltroCalificacion] = useState(0);
  const [filtroRecomendacion, setFiltroRecomendacion] = useState(null);

  useEffect(() => {
    cargarFeedbacks();
  }, [empresaId]);

  const cargarFeedbacks = async () => {
    const datos = await obtenerFeedbacksPorEmpresa(empresaId);
    setFeedbacks(datos);
  };

  const feedbacksFiltrados = feedbacks.filter(f => {
    if (filtroCalificacion > 0 && f.calificacion !== filtroCalificacion) {
      return false;
    }
    if (filtroRecomendacion !== null && f.recomendacion !== filtroRecomendacion) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="filtros">
        <select 
          value={filtroCalificacion}
          onChange={(e) => setFiltroCalificacion(parseInt(e.target.value))}
        >
          <option value={0}>Todas las calificaciones</option>
          <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
          <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
          <option value={3}>⭐⭐⭐ (3 estrellas)</option>
          <option value={2}>⭐⭐ (2 estrellas)</option>
          <option value={1}>⭐ (1 estrella)</option>
        </select>

        <select 
          value={filtroRecomendacion === null ? 'todos' : filtroRecomendacion}
          onChange={(e) => {
            const valor = e.target.value;
            setFiltroRecomendacion(valor === 'todos' ? null : valor === 'true');
          }}
        >
          <option value="todos">Todas</option>
          <option value={true}>Solo recomendables</option>
          <option value={false}>Solo no recomendables</option>
        </select>
      </div>

      <div className="resultados">
        <p>{feedbacksFiltrados.length} de {feedbacks.length}</p>
        {feedbacksFiltrados.map(feedback => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔐 Validaciones del Backend

- Verifica que la empresa exista
- Valida el ID de empresa
- Retorna solo feedbacks activos
- Retorna array completo de feedbacks
- Si no hay feedbacks, retorna array vacío
- No retorna feedbacks eliminados
- Ordena por fecha de creación (más recientes primero)

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- Se visualiza el perfil de una empresa
- Se necesita calcular calificación promedio
- Se desea mostrar reputación de empresa
- Se filtran empresas por calidad
- Se muestra historial de valoraciones
- Se hace búsqueda de empresas confiables

### Cálculos Útiles

```javascript
// Calcular promedio
function calcularPromedioCalificacion(feedbacks) {
  if (feedbacks.length === 0) return 0;
  const suma = feedbacks.reduce((acc, f) => acc + f.calificacion, 0);
  return (suma / feedbacks.length).toFixed(1);
}

// Contar recomendaciones
function contarRecomendaciones(feedbacks) {
  return feedbacks.filter(f => f.recomendacion).length;
}

// Porcentaje de recomendación
function porcentajeRecomendacion(feedbacks) {
  if (feedbacks.length === 0) return 0;
  const recomendadas = contarRecomendaciones(feedbacks);
  return Math.round((recomendadas / feedbacks.length) * 100);
}

// Agrupar por calificación
function agruparPorCalificacion(feedbacks) {
  const grupos = {};
  for (let i = 1; i <= 5; i++) {
    grupos[i] = feedbacks.filter(f => f.calificacion === i).length;
  }
  return grupos;
}
```

---

**Última actualización:** Diciembre 2025
