# 🔎 FILTRAR CANDIDATOS POR ESTADO - Documentación Postman

## 🔗 Endpoint
**GET** `/oferta/{ofertaId}/candidatos/estado`

## 📋 Descripción
Obtiene candidatos de una oferta filtrados por estado específico. Permite ver solo los candidatos en revisión, entrevista, contratados o rechazados según sea necesario.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta | `1` |

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Valores |
|-----------|------|-------------|---------|
| `estado` | Enum | Estado para filtrar | `PENDIENTE`, `ACEPTADA`, `RECHAZADA` |
| `usuarioIdActual` | Long | ID del usuario reclutador | `5` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado?estado=PENDIENTE&usuarioIdActual=5
```

### Headers
```
Content-Type: application/json
```

### Query Parameters
```
estado=PENDIENTE
usuarioIdActual=5
```

### Body
Sin body

---

## 📥 Response

### Success Response (200 OK) - Filtro: PENDIENTE

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
        "nombre": "Tech Solutions"
      }
    },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00",
    "activo": true
  },
  {
    "id": 4,
    "usuarioId": 13,
    "usuario": {
      "id": 13,
      "nombre": "Ana Martínez",
      "email": "ana.martinez@email.com",
      "telefono": "+57 312 8888888",
      "rol": "ASPIRANTE"
    },
    "ofertaId": 1,
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T14:20:00",
    "activo": true
  }
]
```

### Success Response (200 OK) - Filtro: ACEPTADA

```json
[
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
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:15:00",
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

### Caso 1: Ver Candidatos Pendientes de Revisión
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado?estado=PENDIENTE&usuarioIdActual=5

Response: 200 OK
[
  {
    "id": 1,
    "usuarioId": 10,
    "usuario": { "nombre": "Juan García", "email": "juan.garcia@email.com" },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T10:30:00"
  },
  {
    "id": 4,
    "usuarioId": 13,
    "usuario": { "nombre": "Ana Martínez", "email": "ana.martinez@email.com" },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-12-04T14:20:00"
  }
]
```

### Caso 2: Ver Candidatos Aceptados
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado?estado=ACEPTADA&usuarioIdActual=5

Response: 200 OK
[
  {
    "id": 2,
    "usuarioId": 11,
    "usuario": { "nombre": "María López", "email": "maria.lopez@email.com" },
    "estado": "ACEPTADA",
    "fechaPostulacion": "2025-12-03T14:15:00"
  }
]
```

### Caso 3: Ver Candidatos Rechazados
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado?estado=RECHAZADA&usuarioIdActual=5

Response: 200 OK
[
  {
    "id": 3,
    "usuarioId": 12,
    "usuario": { "nombre": "Carlos Rodríguez", "email": "carlos.rodriguez@email.com" },
    "estado": "RECHAZADA",
    "fechaPostulacion": "2025-12-02T09:45:00"
  }
]
```

### Caso 4: Estado sin Candidatos
```
Request:
GET http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado?estado=RECHAZADA&usuarioIdActual=5

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
{{baseUrl}}/recruitment-stage/oferta/{{ofertaId}}/candidatos/estado
```

O directamente:
```
http://localhost:8080/api/recruitment-stage/oferta/1/candidatos/estado
```

### Params (Tab: Params)

| Key | Value |
|-----|-------|
| `estado` | `PENDIENTE` |
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
// Validar parámetros
const ofertaId = pm.variables.get("ofertaId");
const estado = pm.variables.get("estado") || "PENDIENTE";
const usuarioIdActual = pm.variables.get("usuarioIdActual");

console.log(`Filtrando candidatos por estado: ${estado}`);
console.log(`Oferta: ${ofertaId}`);
console.log(`Reclutador: ${usuarioIdActual}`);
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

pm.test("Todos los candidatos tienen el estado especificado", function() {
  const estado = pm.request.url.query.get("estado");
  const candidatos = pm.response.json();
  
  candidatos.forEach(candidato => {
    pm.expect(candidato.estado).to.equal(estado);
  });
});

pm.test("Candidatos tienen datos completos", function() {
  const candidatos = pm.response.json();
  candidatos.forEach(candidato => {
    pm.expect(candidato).to.have.property('usuarioId');
    pm.expect(candidato).to.have.property('usuario');
    pm.expect(candidato.usuario).to.have.property('nombre');
    pm.expect(candidato.usuario).to.have.property('email');
  });
});

// Contar candidatos por estado
const cantidad = pm.response.json().length;
const estado = pm.request.url.query.get("estado");
pm.environment.set(`candidatos_${estado}`, cantidad);
```

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|----------|
| `200` | OK - Candidatos filtrados obtenidos |
| `400` | Bad Request - Parámetro inválido |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Oferta no existe |
| `500` | Internal Server Error - Error del servidor |

---

⚠️ Notas Importantes

- `ofertaId` es **obligatorio** en la URL
- `estado` es **obligatorio** como query parameter
- `usuarioIdActual` es **obligatorio** como query parameter
- Estados válidos: `PENDIENTE`, `ACEPTADA`, `RECHAZADA`
- Retorna array vacío si no hay candidatos en ese estado
- Solo muestra candidatos activos
- Se puede usar en combinación con paginación
- Útil para reportes y análisis

---

## 🔄 Ejemplo cURL

### Obtener Candidatos Pendientes
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/estado?estado=PENDIENTE&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Obtener Candidatos Aceptados
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/estado?estado=ACEPTADA&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function obtenerCandidatosPorEstado(ofertaId, estado, usuarioIdActual) {
  try {
    const queryParams = new URLSearchParams({
      estado: estado,
      usuarioIdActual: usuarioIdActual
    });

    const response = await fetch(
      `/api/recruitment-stage/oferta/${ofertaId}/candidatos/estado?${queryParams}`,
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

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

### Uso en Componente React
```javascript
import { useState, useEffect } from 'react';

function PanelEstados({ ofertaId, usuarioIdActual }) {
  const [candidatosPorEstado, setCandidatosPorEstado] = useState({
    PENDIENTE: [],
    ACEPTADA: [],
    RECHAZADA: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCandidatos();
  }, [ofertaId]);

  const cargarCandidatos = async () => {
    try {
      setCargando(true);
      
      const pendientes = await obtenerCandidatosPorEstado(ofertaId, 'PENDIENTE', usuarioIdActual);
      const aceptados = await obtenerCandidatosPorEstado(ofertaId, 'ACEPTADA', usuarioIdActual);
      const rechazados = await obtenerCandidatosPorEstado(ofertaId, 'RECHAZADA', usuarioIdActual);

      setCandidatosPorEstado({
        PENDIENTE: pendientes,
        ACEPTADA: aceptados,
        RECHAZADA: rechazados
      });
    } catch (error) {
      console.error('Error al cargar candidatos:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="panel-estados">
      <div className="columnas">
        <ColumnaPendientes 
          candidatos={candidatosPorEstado.PENDIENTE}
          onActualizar={cargarCandidatos}
        />
        <ColumnaAceptados 
          candidatos={candidatosPorEstado.ACEPTADA}
          onActualizar={cargarCandidatos}
        />
        <ColumnaRechazados 
          candidatos={candidatosPorEstado.RECHAZADA}
        />
      </div>
    </div>
  );
}

// Columna Pendientes (Kanban)
function ColumnaPendientes({ candidatos, onActualizar }) {
  return (
    <div className="columna pendientes">
      <h3>📋 Pendientes de Revisión ({candidatos.length})</h3>
      <div className="candidatos">
        {candidatos.map(candidato => (
          <div key={candidato.id} className="tarjeta-candidato">
            <h4>{candidato.usuario.nombre}</h4>
            <p>{candidato.usuario.email}</p>
            <button onClick={() => revisarCandidato(candidato.id)}>
              Revisar Perfil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Columna Aceptados
function ColumnaAceptados({ candidatos, onActualizar }) {
  return (
    <div className="columna aceptados">
      <h3>✅ Aceptados ({candidatos.length})</h3>
      <div className="candidatos">
        {candidatos.map(candidato => (
          <div key={candidato.id} className="tarjeta-candidato">
            <h4>{candidato.usuario.nombre}</h4>
            <p>{candidato.usuario.email}</p>
            <button onClick={() => contactarCandidato(candidato.usuario.email)}>
              Contactar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Columna Rechazados
function ColumnaRechazados({ candidatos }) {
  return (
    <div className="columna rechazados">
      <h3>❌ Rechazados ({candidatos.length})</h3>
      <div className="candidatos">
        {candidatos.map(candidato => (
          <div key={candidato.id} className="tarjeta-candidato rechazada">
            <h4>{candidato.usuario.nombre}</h4>
            <p className="fecha">
              {new Date(candidato.fechaPostulacion).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Tablero Kanban (Drag & Drop)
```javascript
function TableroKanban({ ofertaId, usuarioIdActual }) {
  const [estados, setEstados] = useState({ PENDIENTE: [], ACEPTADA: [], RECHAZADA: [] });
  
  const handleDragEnd = async (candidato, nuevoEstado) => {
    // Actualizar estado en backend (ver endpoint de cambiar estado)
    await cambiarEstadoCandidato(candidato.id, nuevoEstado, usuarioIdActual);
    // Recargar datos
    cargarCandidatos();
  };

  return (
    <div className="kanban-board">
      <div className="columna" onDrop={(e) => handleDragEnd(draggedItem, 'PENDIENTE')}>
        <h3>📋 Pendientes</h3>
      </div>
      <div className="columna" onDrop={(e) => handleDragEnd(draggedItem, 'ACEPTADA')}>
        <h3>✅ Aceptados</h3>
      </div>
      <div className="columna" onDrop={(e) => handleDragEnd(draggedItem, 'RECHAZADA')}>
        <h3>❌ Rechazados</h3>
      </div>
    </div>
  );
}
```

---

## 🔐 Validaciones del Backend

- Verifica que la oferta exista
- Valida que el estado sea válido
- Valida que el usuario sea reclutador
- Valida permisos de acceso
- Retorna solo candidatos activos
- Filtra por estado exacto
- Ordena por fecha de postulación

---

## ⚡ Recomendaciones de Uso

Se recomienda llamar a este endpoint cuando:
- El reclutador quiere ver candidatos en revisión
- Se necesita generar reportes por estado
- Se crea un tablero tipo Kanban
- Se requiere estadísticas de proceso
- Se busca hacer seguimiento de candidatos
- Se necesita contactar candidatos aceptados

### Patrones Comunes

```javascript
// Obtener resumen en paralelo
const cargarTodo = async (ofertaId, usuarioIdActual) => {
  const [pendientes, aceptados, rechazados] = await Promise.all([
    obtenerCandidatosPorEstado(ofertaId, 'PENDIENTE', usuarioIdActual),
    obtenerCandidatosPorEstado(ofertaId, 'ACEPTADA', usuarioIdActual),
    obtenerCandidatosPorEstado(ofertaId, 'RECHAZADA', usuarioIdActual)
  ]);
  
  return { pendientes, aceptados, rechazados };
};

// Calcular progreso
const calcularProgreso = (aceptados, total) => {
  return Math.round((aceptados / total) * 100);
};
```

---

**Última actualización:** Diciembre 2025
