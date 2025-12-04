# 🗂️ CLASIFICAR CANDIDATOS POR ESTADO DEL PROCESO - Documentación Postman

## 🔗 Endpoints

Este conjunto de endpoints permite clasificar y visualizar candidatos agrupados por su estado en el proceso de selección.

### 1. Obtener Candidatos por Etapa Específica
**GET** `/oferta/{ofertaId}/candidatos/etapa`

### 2. Obtener Resumen de Candidatos por Todas las Etapas
**GET** `/oferta/{ofertaId}/candidatos/resumen-etapas`

### 3. Obtener Candidatos con Estadísticas de Progresión
**GET** `/oferta/{ofertaId}/candidatos/estadisticas-proceso`

---

## 📋 Descripción General

Estos endpoints permiten a los reclutadores visualizar el flujo completo de candidatos a través del proceso de selección, clasificados por etapas:
- **En Revisión** (PENDIENTE) - Candidatos esperando revisión inicial
- **Entrevista Programada** (ENTREVISTA_PROGRAMADA) - Candidatos con entrevista agendada
- **Aceptados** (ACEPTADO) - Candidatos aprobados y listos para contratación
- **Rechazados** (RECHAZADO) - Candidatos descartados del proceso

---

## 🔧 ENDPOINT 1: Obtener Candidatos por Etapa Específica

### URL
**GET** `/oferta/{ofertaId}/candidatos/etapa`

### Parámetros

#### Path Parameters (Requerido)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta | `1` |

#### Query Parameters (Requeridos)

| Parámetro | Tipo | Requerido | Descripción | Valores Válidos |
|-----------|------|:---------:|-------------|-----------------|
| `etapa` | Enum | ✅ | Etapa del proceso a filtrar | `PENDIENTE`, `ENTREVISTA_PROGRAMADA`, `ACEPTADO`, `RECHAZADO` |
| `usuarioIdActual` | Long | ✅ | ID del usuario reclutador | `5` |

### Request

#### URL Completa
```
http://localhost:8080/api/oferta/1/candidatos/etapa?etapa=PENDIENTE&usuarioIdActual=5
```

#### Headers
```
Content-Type: application/json
```

### Response

#### Success (200 OK)
```json
{
  "etapa": "PENDIENTE",
  "cantidad": 5,
  "candidatos": [
    {
      "id": 15,
      "usuario": {
        "id": 10,
        "nombre": "Juan Pérez",
        "apellido": "González",
        "correo": "juan@example.com",
        "telefono": "3001234567"
      },
      "oferta": {
        "id": 1,
        "titulo": "Desarrollador Backend Java"
      },
      "estado": "PENDIENTE",
      "fechaPostulacion": "2025-01-15T10:30:00Z",
      "diasEnEtapa": 5
    },
    {
      "id": 18,
      "usuario": {
        "id": 12,
        "nombre": "María Rodríguez",
        "apellido": "López",
        "correo": "maria@example.com",
        "telefono": "3009876543"
      },
      "oferta": {
        "id": 1,
        "titulo": "Desarrollador Backend Java"
      },
      "estado": "PENDIENTE",
      "fechaPostulacion": "2025-01-16T14:20:00Z",
      "diasEnEtapa": 4
    }
  ]
}
```

#### Error (400 Bad Request)
```json
{
  "error": "Parámetro inválido",
  "message": "La etapa INVALID_STAGE no es válida",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

---

## 🔧 ENDPOINT 2: Obtener Resumen de Candidatos por Todas las Etapas

### URL
**GET** `/oferta/{ofertaId}/candidatos/resumen-etapas`

### Parámetros

#### Path Parameters (Requerido)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta | `1` |

#### Query Parameters (Requeridos)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `usuarioIdActual` | Long | ✅ | ID del usuario reclutador |

### Request

#### URL Completa
```
http://localhost:8080/api/oferta/1/candidatos/resumen-etapas?usuarioIdActual=5
```

### Response

#### Success (200 OK)
```json
{
  "ofertaId": 1,
  "ofertaTitulo": "Desarrollador Backend Java",
  "totalCandidatos": 25,
  "etapas": [
    {
      "etapa": "PENDIENTE",
      "nombre": "En Revisión",
      "cantidad": 8,
      "porcentaje": 32,
      "color": "#FFC107"
    },
    {
      "etapa": "ENTREVISTA_PROGRAMADA",
      "nombre": "Entrevista Programada",
      "cantidad": 5,
      "porcentaje": 20,
      "color": "#2196F3"
    },
    {
      "etapa": "ACEPTADO",
      "nombre": "Aceptados",
      "cantidad": 10,
      "porcentaje": 40,
      "color": "#4CAF50"
    },
    {
      "etapa": "RECHAZADO",
      "nombre": "Rechazados",
      "cantidad": 2,
      "porcentaje": 8,
      "color": "#F44336"
    }
  ],
  "resumenConversion": {
    "tasaConversion": "40%",
    "candidatosEnProceso": 13,
    "candidatosFinalizados": 12
  }
}
```

---

## 🔧 ENDPOINT 3: Obtener Candidatos con Estadísticas de Progresión

### URL
**GET** `/oferta/{ofertaId}/candidatos/estadisticas-proceso`

### Parámetros

#### Path Parameters (Requerido)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta | `1` |

#### Query Parameters (Requeridos)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `usuarioIdActual` | Long | ✅ | ID del usuario reclutador |

### Response

#### Success (200 OK)
```json
{
  "ofertaId": 1,
  "ofertaTitulo": "Desarrollador Backend Java",
  "estadisticas": {
    "totalPostulaciones": 25,
    "tasaAceptacion": "40%",
    "tasaRechazo": "8%",
    "enProceso": "52%",
    "tiempoPromedio": {
      "enRevision": 5,
      "enEntrevista": 3,
      "total": 8
    }
  },
  "canaloDatos": [
    {
      "etapa": 1,
      "nombre": "Revisión Inicial",
      "candidatos": 25,
      "tasaProgresion": "52%"
    },
    {
      "etapa": 2,
      "nombre": "Entrevista",
      "candidatos": 13,
      "tasaProgresion": "77%"
    },
    {
      "etapa": 3,
      "nombre": "Selección",
      "candidatos": 10,
      "tasaProgresion": "100%"
    }
  ]
}
```

---

## 📊 Etapas del Proceso

| Etapa | Estado | Descripción | Duración Típica |
|-------|--------|-------------|-----------------|
| 1️⃣ | PENDIENTE | Candidato en revisión inicial | 3-7 días |
| 2️⃣ | ENTREVISTA_PROGRAMADA | Entrevista agendada | 1-5 días |
| 3️⃣ | ACEPTADO | Candidato aprobado | Final |
| ❌ | RECHAZADO | Candidato descartado | Final |

---

## 🎯 Casos de Uso

### Caso 1: Ver Candidatos en Revisión
Obtener todos los candidatos que aún no han sido revisados.

**URL:**
```
GET /oferta/1/candidatos/etapa?etapa=PENDIENTE&usuarioIdActual=5
```

**Respuesta:** Lista de 8 candidatos esperando revisión.

---

### Caso 2: Dashboard de Progresión
Ver el resumen completo del flujo de candidatos en Kanban.

**URL:**
```
GET /oferta/1/candidatos/resumen-etapas?usuarioIdActual=5
```

**Respuesta:** Estadísticas completas con cantidad de candidatos por etapa.

---

### Caso 3: Análisis de Tasa de Conversión
Ver estadísticas y métricas de progresión a través del pipeline.

**URL:**
```
GET /oferta/1/candidatos/estadisticas-proceso?usuarioIdActual=5
```

**Respuesta:** Estadísticas detalladas de conversión y tiempos promedio.

---

## ⚙️ Pre-request Script (Postman)

```javascript
// Validar usuario
if (!pm.request.url.query.get('usuarioIdActual')) {
    throw new Error('Falta parámetro requerido: usuarioIdActual');
}

// Validar etapa si es requerida
const etapa = pm.request.url.query.get('etapa');
if (etapa) {
    const etapasValidas = ['PENDIENTE', 'ENTREVISTA_PROGRAMADA', 'ACEPTADO', 'RECHAZADO'];
    if (!etapasValidas.includes(etapa)) {
        throw new Error(`Etapa inválida: ${etapa}`);
    }
    console.log('Filtrando por etapa:', etapa);
}

console.log('=== BÚSQUEDA DE CANDIDATOS ===');
console.log('Oferta ID:', pm.request.url.query.get('ofertaId'));
console.log('Usuario ID:', pm.request.url.query.get('usuarioIdActual'));
if (etapa) console.log('Etapa:', etapa);
```

---

## 🧪 Test Script (Postman)

```javascript
pm.test('Status code es 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response es un objeto válido', function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('object');
});

pm.test('Respuesta contiene etapa o resumen', function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('etapa').or.have.property('etapas');
});

pm.test('Candidatos tienen estructura válida', function () {
    var jsonData = pm.response.json();
    if (jsonData.candidatos && jsonData.candidatos.length > 0) {
        jsonData.candidatos.forEach((candidato) => {
            pm.expect(candidato).to.have.property('id');
            pm.expect(candidato).to.have.property('usuario');
            pm.expect(candidato).to.have.property('estado');
        });
    }
});

pm.test('Cantidad de candidatos coincide con el array', function () {
    var jsonData = pm.response.json();
    if (jsonData.cantidad !== undefined) {
        pm.expect(jsonData.candidatos.length).to.equal(jsonData.cantidad);
    }
});
```

---

## 🔄 Ejemplos cURL

### Obtener Candidatos en Revisión
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/etapa?etapa=PENDIENTE&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Obtener Candidatos en Entrevista
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/etapa?etapa=ENTREVISTA_PROGRAMADA&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Obtener Resumen de Todas las Etapas
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/resumen-etapas?usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Componente - Board de Kanban
```jsx
import React, { useState, useEffect } from 'react';

function RecruitmentBoard({ ofertaId, usuarioIdActual }) {
    const [resumen, setResumen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarResumen();
    }, [ofertaId]);

    const cargarResumen = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/resumen-etapas?usuarioIdActual=${usuarioIdActual}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );

            if (!response.ok) throw new Error('Error al cargar resumen');
            const data = await response.json();
            setResumen(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <div className="text-center p-4">Cargando...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-2">{resumen.ofertaTitulo}</h1>
            <p className="text-gray-600 mb-6">Total de candidatos: {resumen.totalCandidatos}</p>

            {/* Estadísticas Principales */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {resumen.etapas.map((etapa) => (
                    <div key={etapa.etapa} className="p-4 rounded-lg shadow" style={{ backgroundColor: etapa.color + '20' }}>
                        <p className="text-sm text-gray-600">{etapa.nombre}</p>
                        <p className="text-3xl font-bold" style={{ color: etapa.color }}>{etapa.cantidad}</p>
                        <p className="text-xs text-gray-500">{etapa.porcentaje}%</p>
                    </div>
                ))}
            </div>

            {/* Resumen de Conversión */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Resumen de Conversión</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-gray-600">Tasa de Conversión</p>
                        <p className="text-2xl font-bold text-green-600">{resumen.resumenConversion.tasaConversion}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">En Proceso</p>
                        <p className="text-2xl font-bold text-blue-600">{resumen.resumenConversion.candidatosEnProceso}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Finalizados</p>
                        <p className="text-2xl font-bold text-purple-600">{resumen.resumenConversion.candidatosFinalizados}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecruitmentBoard;
```

### Componente - Tabla de Candidatos por Etapa
```jsx
import React, { useState } from 'react';

function TablaEtapa({ ofertaId, etapa, usuarioIdActual }) {
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const cargarCandidatos = async () => {
        setCargando(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/etapa?etapa=${etapa}&usuarioIdActual=${usuarioIdActual}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );

            if (!response.ok) throw new Error('Error al cargar candidatos');
            const data = await response.json();
            setCandidatos(data.candidatos || []);
        } catch (err) {
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const getNombreEtapa = (etapa) => {
        const nombres = {
            'PENDIENTE': 'En Revisión',
            'ENTREVISTA_PROGRAMADA': 'Entrevista Programada',
            'ACEPTADO': 'Aceptados',
            'RECHAZADO': 'Rechazados'
        };
        return nombres[etapa] || etapa;
    };

    const getColorEtapa = (etapa) => {
        const colores = {
            'PENDIENTE': 'bg-yellow-50 border-l-4 border-yellow-400',
            'ENTREVISTA_PROGRAMADA': 'bg-blue-50 border-l-4 border-blue-400',
            'ACEPTADO': 'bg-green-50 border-l-4 border-green-400',
            'RECHAZADO': 'bg-red-50 border-l-4 border-red-400'
        };
        return colores[etapa];
    };

    React.useEffect(() => {
        cargarCandidatos();
    }, [etapa]);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{getNombreEtapa(etapa)}</h2>

            {cargando ? (
                <div className="text-center py-4">Cargando...</div>
            ) : candidatos.length > 0 ? (
                <div className="space-y-4">
                    {candidatos.map((candidato) => (
                        <div key={candidato.id} className={`p-4 rounded-lg ${getColorEtapa(etapa)}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {candidato.usuario.nombre} {candidato.usuario.apellido}
                                    </h3>
                                    <p className="text-gray-600">{candidato.usuario.correo}</p>
                                    <p className="text-sm text-gray-500">
                                        {candidato.diasEnEtapa} días en esta etapa
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(candidato.fechaPostulacion).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No hay candidatos en esta etapa
                </div>
            )}
        </div>
    );
}

export default TablaEtapa;
```

### Hook Personalizado
```javascript
import { useState } from 'react';

function useClasificacionCandidatos() {
    const [resumen, setResumen] = useState(null);
    const [candidatos, setCandidatos] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarResumen = async (ofertaId, usuarioIdActual) => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/resumen-etapas?usuarioIdActual=${usuarioIdActual}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            if (!response.ok) throw new Error('Error al cargar resumen');
            setResumen(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const cargarCandidatosPorEtapa = async (ofertaId, etapa, usuarioIdActual) => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/etapa?etapa=${etapa}&usuarioIdActual=${usuarioIdActual}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            if (!response.ok) throw new Error('Error al cargar candidatos');
            setCandidatos(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const cargarEstadisticas = async (ofertaId, usuarioIdActual) => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/estadisticas-proceso?usuarioIdActual=${usuarioIdActual}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            if (!response.ok) throw new Error('Error al cargar estadísticas');
            setEstadisticas(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return {
        resumen,
        candidatos,
        estadisticas,
        cargando,
        error,
        cargarResumen,
        cargarCandidatosPorEtapa,
        cargarEstadisticas
    };
}

export default useClasificacionCandidatos;
```

---

## 🔐 Validaciones & Seguridad

1. **Autorización**: Solo reclutadores de la empresa pueden ver candidatos
2. **Validación de Etapa**: Se validan los valores de estado
3. **Integridad de Datos**: Se verifica que la postulación pertenezca a la oferta
4. **Auditoría**: Se registran accesos a datos sensibles

---

## 📝 Notas Importantes

- Los candidatos se clasifican automáticamente según su estado
- Los tiempos se calculan en días desde la postulación o último cambio
- Las estadísticas se actualizan en tiempo real
- Se pueden crear reportes basados en estas etapas
- Útil para seguimiento visual del pipeline de contratación

---

## 🚀 Mejores Prácticas

1. **Dashboard Activo**: Usar Resumen de Etapas para visualización general
2. **Detalle de Etapas**: Acceder a candidatos específicos cuando sea necesario
3. **Análisis de Conversión**: Usar estadísticas para optimizar proceso
4. **Notificaciones**: Alertar sobre candidatos atrasados en etapas
5. **Reportes Periódicos**: Generar reportes de progresión

---

## 📊 Matriz de Transiciones

| De | Hacia | Acción |
|----|-------|--------|
| PENDIENTE | ENTREVISTA_PROGRAMADA | Agendar entrevista |
| PENDIENTE | ACEPTADO | Aceptar directo |
| PENDIENTE | RECHAZADO | Rechazar |
| ENTREVISTA_PROGRAMADA | ACEPTADO | Aceptar después de entrevista |
| ENTREVISTA_PROGRAMADA | RECHAZADO | Rechazar después de entrevista |
| ENTREVISTA_PROGRAMADA | PENDIENTE | Reagendar |
| ACEPTADO | RECHAZADO | Cambiar decisión |

---

## 💡 Métricas Clave

- **Tasa de Conversión**: (Aceptados / Total) × 100
- **Tasa de Rechazo**: (Rechazados / Total) × 100
- **En Proceso**: (PENDIENTE + ENTREVISTA_PROGRAMADA) / Total
- **Tiempo Promedio por Etapa**: Días promedio que un candidato pasa en cada etapa
- **Candidatos Finalizados**: ACEPTADO + RECHAZADO

