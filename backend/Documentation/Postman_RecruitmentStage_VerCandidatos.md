# 👥 VER CANDIDATOS POSTULADOS A OFERTA - Documentación Postman

## 🔗 Endpoint
**GET** `/oferta/{ofertaId}/candidatos`

## 📋 Descripción
Obtiene la lista completa de candidatos que se han postulado a una oferta específica. Muestra todos los aspirantes interesados con sus datos de postulación y estado actual en el proceso de selección.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta para obtener sus candidatos | `1` |

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioIdActual` | Long | ID del usuario reclutador que hace la solicitud | `5` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos?usuarioIdActual=5
```

### Headers
```
Content-Type: application/json
```

### Query Parameters
```
usuarioIdActual=5
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
    "usuarioId": 10,
    "usuario": {
      "id": 10,
      "nombre": "Juan García",
      "email": "juan.garcia@email.com",
      "telefono": "+57 312 5555555",
      "rol": "ASPIRANTE"
    },
    "ofertaId": 1,
    "oferta": {
      "id": 1,
      "titulo": "Desarrollador Senior",
      "empresa": {
        "id": 3,
        "nombre": "Tech Solutions",
        "ciudad": "Bogotá"
      }
    },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00",
    "activo": true
  },
  {
    "id": 2,
    "usuarioId": 11,
    "usuario": {
      "id": 11,
      "nombre": "María López",
      "email": "maria.lopez@email.com",
      "telefono": "+57 312 6666666",
      "rol": "ASPIRANTE"
    },
    "ofertaId": 1,
    "oferta": {
      "id": 1,
      "titulo": "Desarrollador Senior",
      "empresa": {
        "id": 3,
        "nombre": "Tech Solutions",
        "ciudad": "Bogotá"
      }
    },
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:15:00",
    "activo": true
  },
  {
    "id": 3,
    "usuarioId": 12,
    "usuario": {
      "id": 12,
      "nombre": "Carlos Rodríguez",
      "email": "carlos.rodriguez@email.com",
      "telefono": "+57 312 7777777",
      "rol": "ASPIRANTE"
    },
    "ofertaId": 1,
    "oferta": {
      "id": 1,
      "titulo": "Desarrollador Senior",
      "empresa": {
        "id": 3,
        "nombre": "Tech Solutions",
        "ciudad": "Bogotá"
      }
    },
    "estado": "RECHAZADA",
    "fechaPostulacion": "2025-12-02T09:45:00",
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

### Caso 1: Obtener Todos los Candidatos de una Oferta
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos?usuarioIdActual=5

Response: 200 OK
[
  {
    "id": 1,
    "usuarioId": 10,
    "usuario": {
      "id": 10,
      "nombre": "Juan García",
      "email": "juan.garcia@email.com",
      "telefono": "+57 312 5555555"
    },
    "ofertaId": 1,
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00"
  },
  {
    "id": 2,
    "usuarioId": 11,
    "usuario": {
      "id": 11,
      "nombre": "María López",
      "email": "maria.lopez@email.com",
      "telefono": "+57 312 6666666"
    },
    "ofertaId": 1,
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:15:00"
  }
]
```

### Caso 2: Oferta sin Candidatos
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/999/candidatos?usuarioIdActual=5

Response: 200 OK
[]
```

### Caso 3: Falta Parámetro Requerido
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos

Response: 400 Bad Request
{
  "error": "Parámetro requerido",
  "mensaje": "usuarioIdActual es obligatorio",
  "status": 400
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
{{baseUrl}}/recruitment-stage/oferta/{{ofertaId}}/candidatos
```

O directamente:
```
http://localhost:8080/api/recruitment-stage/oferta/1/candidatos
```

### Params (Tab: Params)

| Key | Value |
|-----|-------|
| `usuarioIdActual` | `5` |

### Headers (Tab: Headers)
```
Content-Type: application/json
```

### Body
```
Sin body
```

### Pre-request Script (Opcional)
```javascript
// Validar que los parámetros necesarios existan
const ofertaId = pm.variables.get("ofertaId");
const usuarioIdActual = pm.variables.get("usuarioIdActual");

if (!ofertaId || !usuarioIdActual) {
  pm.test("Variables requeridas", function() {
    pm.expect(ofertaId).to.exist;
    pm.expect(usuarioIdActual).to.exist;
  });
}

console.log(`Obteniendo candidatos de oferta: ${ofertaId}`);
console.log(`Usuario reclutador: ${usuarioIdActual}`);
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

pm.test("Cada candidato tiene datos requeridos", function() {
  const candidatos = pm.response.json();
  candidatos.forEach(candidato => {
    pm.expect(candidato).to.have.property('id');
    pm.expect(candidato).to.have.property('usuarioId');
    pm.expect(candidato).to.have.property('usuario');
    pm.expect(candidato).to.have.property('estado');
    pm.expect(candidato).to.have.property('fechaPostulacion');
  });
});

pm.test("Usuario tiene información de contacto", function() {
  const candidatos = pm.response.json();
  candidatos.forEach(candidato => {
    pm.expect(candidato.usuario).to.have.property('nombre');
    pm.expect(candidato.usuario).to.have.property('email');
  });
});

pm.test("Estados son válidos", function() {
  const candidatos = pm.response.json();
  const estadosValidos = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'];
  candidatos.forEach(candidato => {
    pm.expect(estadosValidos).to.include(candidato.estado);
  });
});

// Guardar cantidad de candidatos
const cantidad = pm.response.json().length;
pm.environment.set("cantidadCandidatos", cantidad);
console.log(`Total de candidatos: ${cantidad}`);
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Candidatos obtenidos (array vacío si ninguno) |
| `400` | Bad Request - Parámetro faltante |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No es reclutador de esta oferta |
| `404` | Not Found - Oferta no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- `ofertaId` es **obligatorio** en la URL
- `usuarioIdActual` es **obligatorio** como query parameter
- Retorna un **array** de postulaciones
- Si no hay candidatos, retorna array vacío `[]`
- Solo muestra candidatos activos (no eliminados)
- Incluye información completa del usuario y oferta
- El usuario debe ser reclutador de la empresa que publicó la oferta
- Se puede usar para filtrar por estado después

---

## 🔄 Ejemplo cURL

```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos?usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function obtenerCandidatos(ofertaId, usuarioIdActual) {
  try {
    const queryParams = new URLSearchParams({
      usuarioIdActual: usuarioIdActual
    });

    const response = await fetch(
      `/api/recruitment-stage/oferta/${ofertaId}/candidatos?${queryParams}`,
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

    const candidatos = await response.json();
    return candidatos || [];
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return [];
  }
}
```

### Uso en Componente React
```javascript
import { useState, useEffect } from 'react';

function ListaCandidatos({ ofertaId, usuarioIdActual }) {
  const [candidatos, setCandidatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCandidatos();
  }, [ofertaId]);

  const cargarCandidatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerCandidatos(ofertaId, usuarioIdActual);
      setCandidatos(datos);
    } catch (err) {
      setError('No se pudieron cargar los candidatos');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="loading">Cargando candidatos...</div>;

  if (error) return <div className="error">{error}</div>;

  if (candidatos.length === 0) {
    return <div className="empty">No hay candidatos para esta oferta</div>;
  }

  return (
    <div className="candidatos-container">
      <h2>Candidatos Postulados ({candidatos.length})</h2>
      
      <div className="candidatos-list">
        {candidatos.map(candidato => (
          <CandidatoCard 
            key={candidato.id} 
            candidato={candidato}
            onActualizacion={cargarCandidatos}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para mostrar cada candidato
function CandidatoCard({ candidato, onActualizacion }) {
  const estadoColor = {
    'PENDIENTE': 'warning',
    'ACEPTADA': 'success',
    'RECHAZADA': 'danger'
  };

  return (
    <div className={`candidato-card estado-${estadoColor[candidato.estado]}`}>
      <div className="header">
        <h3>{candidato.usuario.nombre}</h3>
        <span className={`badge-estado ${estadoColor[candidato.estado]}`}>
          {candidato.estado}
        </span>
      </div>

      <div className="contacto">
        <p>📧 <a href={`mailto:${candidato.usuario.email}`}>{candidato.usuario.email}</a></p>
        {candidato.usuario.telefono && (
          <p>📞 <a href={`tel:${candidato.usuario.telefono}`}>{candidato.usuario.telefono}</a></p>
        )}
      </div>

      <div className="info">
        <p className="fecha">
          📅 Postulado: {new Date(candidato.fechaPostulacion).toLocaleDateString()}
        </p>
      </div>

      <div className="acciones">
        <button onClick={() => verDetalles(candidato.id)}>Ver Perfil</button>
        <button onClick={() => onActualizacion()}>Actualizar Estado</button>
      </div>
    </div>
  );
}
```

### Con Filtros por Estado
```javascript
function ListaCandidatosConFiltros({ ofertaId, usuarioIdActual }) {
  const [candidatos, setCandidatos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => {
    cargarCandidatos();
  }, [ofertaId]);

  const cargarCandidatos = async () => {
    const datos = await obtenerCandidatos(ofertaId, usuarioIdActual);
    setCandidatos(datos);
  };

  const candidatosFiltrados = filtroEstado === 'TODOS' 
    ? candidatos 
    : candidatos.filter(c => c.estado === filtroEstado);

  const resumen = {
    total: candidatos.length,
    pendientes: candidatos.filter(c => c.estado === 'PENDIENTE').length,
    aceptados: candidatos.filter(c => c.estado === 'ACEPTADA').length,
    rechazados: candidatos.filter(c => c.estado === 'RECHAZADA').length
  };

  return (
    <div className="container">
      <div className="resumen-stats">
        <div className="stat">
          <span className="numero">{resumen.total}</span>
          <span className="label">Total</span>
        </div>
        <div className="stat pendiente">
          <span className="numero">{resumen.pendientes}</span>
          <span className="label">Pendientes</span>
        </div>
        <div className="stat aceptado">
          <span className="numero">{resumen.aceptados}</span>
          <span className="label">Aceptados</span>
        </div>
        <div className="stat rechazado">
          <span className="numero">{resumen.rechazados}</span>
          <span className="label">Rechazados</span>
        </div>
      </div>

      <div className="filtros">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODOS">Todos los candidatos</option>
          <option value="PENDIENTE">⏳ Pendientes de revisión</option>
          <option value="ACEPTADA">✓ Aceptados</option>
          <option value="RECHAZADA">✗ Rechazados</option>
        </select>
        <span className="resultados">
          Mostrando {candidatosFiltrados.length} de {candidatos.length}
        </span>
      </div>

      <div className="candidatos-list">
        {candidatosFiltrados.length > 0 ? (
          candidatosFiltrados.map(candidato => (
            <CandidatoCard key={candidato.id} candidato={candidato} />
          ))
        ) : (
          <p className="empty">No hay candidatos en este estado</p>
        )}
      </div>
    </div>
  );
}
```

---

## 🔐 Validaciones del Backend

- Verifica que la oferta exista
- Valida que el usuario sea reclutador
- Valida permisos de acceso a la oferta
- Retorna solo postulaciones activas
- Incluye datos completos de usuario y oferta
- Ordena por fecha de postulación (más recientes primero)
- Filtra por estado si se proporciona parámetro

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- El reclutador accede al panel de selección
- Se necesita revisar candidatos de una oferta
- Se desea mostrar resumen de postulaciones
- Se filtran candidatos por estado
- Se busca un candidato específico
- Se genera reporte de candidatos

### Optimizaciones

```javascript
// Memorizar resultados
const candidatosMemo = useMemo(() => {
  return candidatos.filter(c => c.estado === filtroEstado);
}, [candidatos, filtroEstado]);

// Paginación
function usePaginacion(items, itemsPorPagina = 10) {
  const [paginaActual, setPaginaActual] = useState(1);
  
  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const itemsPagina = items.slice(indexPrimero, indexUltimo);
  
  return { itemsPagina, paginaActual, setPaginaActual, totalPaginas: Math.ceil(items.length / itemsPorPagina) };
}
```

---

**Última actualización:** Diciembre 2025
