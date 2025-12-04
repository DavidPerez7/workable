# 🔎 FILTRAR CANDIDATOS POR EXPERIENCIA Y EDUCACIÓN - Documentación Postman

## 🔗 Endpoint
**GET** `/oferta/{ofertaId}/candidatos/filtrar`

## 📋 Descripción
Obtiene una lista filtrada de candidatos postulados a una oferta basándose en criterios específicos como nivel educativo, años de experiencia, cargo, ubicación geográfica y habilidades. Permite búsquedas avanzadas para encontrar los candidatos que mejor se ajusten al perfil requerido.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta para filtrar candidatos | `1` |

### Query Parameters

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|:---------:|-------------|---------|
| `usuarioIdActual` | Long | ✅ | ID del usuario reclutador que hace la solicitud | `5` |
| `nivelEducativo` | String | ❌ | Nivel educativo mínimo requerido | `UNIVERSITARIO`, `TECNOLOGO`, `MAESTRIA` |
| `aniosExperienciaMinimo` | Integer | ❌ | Años de experiencia mínimos requeridos | `3`, `5`, `10` |
| `cargoExperiencia` | String | ❌ | Cargo o posición de experiencia a buscar | `Desarrollador`, `Contador`, `Gerente` |
| `municipio` | String | ❌ | Municipio o ciudad del candidato | `Medellín`, `Bogotá`, `Cali` |
| `habilidad` | String | ❌ | Habilidad específica que debe tener el candidato | `Java`, `React`, `SQL` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api/oferta/1/candidatos/filtrar?usuarioIdActual=5
```

### Ejemplos de URLs Completas

#### Filtrar por Nivel Educativo
```
http://localhost:8080/api/oferta/1/candidatos/filtrar?nivelEducativo=UNIVERSITARIO&usuarioIdActual=5
```

#### Filtrar por Experiencia Mínima
```
http://localhost:8080/api/oferta/1/candidatos/filtrar?aniosExperienciaMinimo=3&usuarioIdActual=5
```

#### Filtrar por Cargo
```
http://localhost:8080/api/oferta/1/candidatos/filtrar?cargoExperiencia=Desarrollador&usuarioIdActual=5
```

#### Filtrar Combinado
```
http://localhost:8080/api/oferta/1/candidatos/filtrar?nivelEducativo=UNIVERSITARIO&aniosExperienciaMinimo=3&cargoExperiencia=Desarrollador&habilidad=Java&usuarioIdActual=5
```

### Headers
```
Content-Type: application/json
```

### Body
Sin body requerido

---

## 📥 Response

### Success (200 OK) - Con Resultados
```json
[
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
      "titulo": "Desarrollador Backend Java",
      "empresa": {
        "id": 3,
        "nombre": "TechCorp"
      }
    },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-01-15T10:30:00Z"
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
      "titulo": "Desarrollador Backend Java",
      "empresa": {
        "id": 3,
        "nombre": "TechCorp"
      }
    },
    "estado": "PENDIENTE",
    "fechaPostulacion": "2025-01-16T14:20:00Z"
  }
]
```

### Success (200 OK) - Sin Resultados
```json
[]
```

### Error (400 Bad Request)
```json
{
  "error": "Parámetro inválido",
  "message": "El valor proporcionado para nivelEducativo no es válido",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

### Error (404 Not Found)
```json
{
  "error": "Oferta no encontrada",
  "message": "No existe oferta con ID 999",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

### Error (403 Forbidden)
```json
{
  "error": "No autorizado",
  "message": "No tienes permisos para ver los candidatos de esta oferta",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

---

## 🎯 Casos de Uso

### Caso 1: Buscar Desarrolladores Backend con Experiencia
Encontrar candidatos con formación universitaria y al menos 3 años de experiencia en desarrollo backend.

**URL:**
```
GET /oferta/1/candidatos/filtrar?nivelEducativo=UNIVERSITARIO&aniosExperienciaMinimo=3&cargoExperiencia=Desarrollador&usuarioIdActual=5
```

**Respuesta:** Lista de 5-10 candidatos que cumplen los criterios.

---

### Caso 2: Filtrar por Ubicación y Habilidades
Buscar candidatos en Medellín que tengan experiencia con Java.

**URL:**
```
GET /oferta/1/candidatos/filtrar?municipio=Medellín&habilidad=Java&usuarioIdActual=5
```

**Respuesta:** Candidatos ubicados en Medellín con habilidad en Java.

---

### Caso 3: Búsqueda Altamente Especializada
Encontrar profesionales con posgrado que tengan 5+ años de experiencia.

**URL:**
```
GET /oferta/1/candidatos/filtrar?nivelEducativo=MAESTRIA&aniosExperienciaMinimo=5&usuarioIdActual=5
```

**Respuesta:** Candidatos con máster y experiencia senior.

---

### Caso 4: Búsqueda Amplia sin Criterios
Obtener todos los candidatos de la oferta sin filtros específicos.

**URL:**
```
GET /oferta/1/candidatos/filtrar?usuarioIdActual=5
```

**Respuesta:** Todos los candidatos postulados a la oferta.

---

## 📊 Criterios de Filtrado Disponibles

### Niveles Educativos
```
PRIMARIA
BACHILLERATO
TECNICO
TECNOLOGO
UNIVERSITARIO
ESPECIALIZACION
MAESTRIA
DOCTORADO
```

### Años de Experiencia
- 0 años (sin experiencia)
- 1-2 años (junior)
- 3-5 años (mid-level)
- 6-10 años (senior)
- 10+ años (very senior)

---

## ⚙️ Pre-request Script (Postman)

```javascript
// Validar que el ID de usuario sea proporcionado
if (!pm.request.url.query.get('usuarioIdActual')) {
    throw new Error('Falta parámetro requerido: usuarioIdActual');
}

// Niveles educativos válidos
const nivelesValidos = [
    'PRIMARIA', 'BACHILLERATO', 'TECNICO', 'TECNOLOGO',
    'UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'
];

// Validar nivel educativo si se proporciona
const nivel = pm.request.url.query.get('nivelEducativo');
if (nivel && !nivelesValidos.includes(nivel)) {
    throw new Error(`Nivel educativo inválido: ${nivel}`);
}

// Validar años de experiencia
const anios = pm.request.url.query.get('aniosExperienciaMinimo');
if (anios && isNaN(parseInt(anios))) {
    throw new Error('aniosExperienciaMinimo debe ser un número');
}

// Mostrar criterios de búsqueda activos
console.log('=== CRITERIOS DE BÚSQUEDA ===');
console.log('Oferta ID:', pm.variables.get('ofertaId'));
console.log('Usuario ID:', pm.request.url.query.get('usuarioIdActual'));
if (nivel) console.log('Nivel Educativo:', nivel);
if (anios) console.log('Experiencia Mínima:', anios + ' años');
if (pm.request.url.query.get('cargoExperiencia')) console.log('Cargo:', pm.request.url.query.get('cargoExperiencia'));
if (pm.request.url.query.get('municipio')) console.log('Municipio:', pm.request.url.query.get('municipio'));
if (pm.request.url.query.get('habilidad')) console.log('Habilidad:', pm.request.url.query.get('habilidad'));
```

---

## 🧪 Test Script (Postman)

```javascript
pm.test('Status code es 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response es un array', function () {
    var jsonData = pm.response.json();
    pm.expect(Array.isArray(jsonData)).to.be.true;
});

pm.test('Cada candidato tiene propiedades requeridas', function () {
    var jsonData = pm.response.json();
    
    if (jsonData.length > 0) {
        jsonData.forEach((candidato, index) => {
            pm.expect(candidato).to.have.property('id');
            pm.expect(candidato).to.have.property('usuario');
            pm.expect(candidato).to.have.property('oferta');
            pm.expect(candidato).to.have.property('estado');
        });
    }
});

pm.test('Los candidatos pertenecen a la oferta correcta', function () {
    var jsonData = pm.response.json();
    var ofertaId = pm.variables.get('ofertaId') || pm.request.url.query.get('ofertaId');
    
    if (jsonData.length > 0) {
        jsonData.forEach((candidato) => {
            pm.expect(candidato.oferta.id).to.equal(parseInt(ofertaId));
        });
    }
});

pm.test('Los candidatos cumplen con los criterios de filtrado', function () {
    var jsonData = pm.response.json();
    
    // Validar nivel educativo si fue filtrado
    const nivelFiltro = pm.request.url.query.get('nivelEducativo');
    if (nivelFiltro && jsonData.length > 0) {
        jsonData.forEach((candidato) => {
            // Aquí se validaría que cada usuario tenga al menos un estudio con ese nivel
            pm.expect(candidato.usuario).to.have.property('id');
        });
    }
});

// Guardar información para requests siguientes
if (pm.response.json().length > 0) {
    pm.globals.set('primerCandidatoId', pm.response.json()[0].id);
    pm.globals.set('cantidadCandidatos', pm.response.json().length);
}
```

---

## 🔄 Ejemplos cURL

### Búsqueda Básica
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/filtrar?usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Con Nivel Educativo
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/filtrar?nivelEducativo=UNIVERSITARIO&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Con Experiencia Mínima
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/filtrar?aniosExperienciaMinimo=3&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Búsqueda Completa
```bash
curl -X GET "http://localhost:8080/api/oferta/1/candidatos/filtrar?nivelEducativo=UNIVERSITARIO&aniosExperienciaMinimo=3&cargoExperiencia=Desarrollador&habilidad=Java&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base de Filtrado
```javascript
async function filtrarCandidatosPorCriterios(ofertaId, criterios, usuarioIdActual) {
    try {
        // Construir query string con criterios
        const params = new URLSearchParams({
            usuarioIdActual: usuarioIdActual,
            ...criterios
        });

        const url = `http://localhost:8080/api/oferta/${ofertaId}/candidatos/filtrar?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al filtrar candidatos');
        }

        const candidatos = await response.json();
        console.log(`Se encontraron ${candidatos.length} candidatos`);
        return candidatos;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
```

### Componente React - Filtro Avanzado
```jsx
import React, { useState } from 'react';

function FiltrarCandidatos({ ofertaId, usuarioIdActual }) {
    const [criterios, setCriterios] = useState({
        nivelEducativo: '',
        aniosExperienciaMinimo: '',
        cargoExperiencia: '',
        municipio: '',
        habilidad: ''
    });

    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const nivelesEducativos = [
        'PRIMARIA', 'BACHILLERATO', 'TECNICO', 'TECNOLOGO',
        'UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'
    ];

    const handleCriterioChange = (e) => {
        const { name, value } = e.target;
        setCriterios(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFiltrar = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        try {
            // Filtrar criterios vacíos
            const criteriosFiltrados = Object.entries(criterios)
                .reduce((acc, [key, value]) => {
                    if (value !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {});

            const params = new URLSearchParams({
                usuarioIdActual: usuarioIdActual,
                ...criteriosFiltrados
            });

            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/filtrar?${params.toString()}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Error al filtrar candidatos');
            }

            const data = await response.json();
            setCandidatos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleLimpiar = () => {
        setCriterios({
            nivelEducativo: '',
            aniosExperienciaMinimo: '',
            cargoExperiencia: '',
            municipio: '',
            habilidad: ''
        });
        setCandidatos([]);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Filtrar Candidatos Avanzado</h2>

            {/* Formulario de Filtros */}
            <form onSubmit={handleFiltrar} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Educativo</label>
                    <select
                        name="nivelEducativo"
                        value={criterios.nivelEducativo}
                        onChange={handleCriterioChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Seleccionar --</option>
                        {nivelesEducativos.map(nivel => (
                            <option key={nivel} value={nivel}>{nivel}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia Mínima (años)</label>
                    <input
                        type="number"
                        name="aniosExperienciaMinimo"
                        value={criterios.aniosExperienciaMinimo}
                        onChange={handleCriterioChange}
                        min="0"
                        max="50"
                        placeholder="Ej: 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo de Experiencia</label>
                    <input
                        type="text"
                        name="cargoExperiencia"
                        value={criterios.cargoExperiencia}
                        onChange={handleCriterioChange}
                        placeholder="Ej: Desarrollador"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                    <input
                        type="text"
                        name="municipio"
                        value={criterios.municipio}
                        onChange={handleCriterioChange}
                        placeholder="Ej: Medellín"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Habilidad</label>
                    <input
                        type="text"
                        name="habilidad"
                        value={criterios.habilidad}
                        onChange={handleCriterioChange}
                        placeholder="Ej: Java"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2 items-end">
                    <button
                        type="submit"
                        disabled={cargando}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {cargando ? 'Buscando...' : 'Filtrar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Limpiar
                    </button>
                </div>
            </form>

            {/* Mensajes de Error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Resultados */}
            {cargando && (
                <div className="text-center text-gray-500">Buscando candidatos...</div>
            )}

            {!cargando && candidatos.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Se encontraron {candidatos.length} candidato{candidatos.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-4">
                        {candidatos.map(candidato => (
                            <div key={candidato.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-lg">
                                            {candidato.usuario.nombre} {candidato.usuario.apellido}
                                        </h4>
                                        <p className="text-gray-600">{candidato.usuario.correo}</p>
                                        <p className="text-gray-600">{candidato.usuario.telefono}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        candidato.estado === 'ACEPTADO' ? 'bg-green-100 text-green-800' :
                                        candidato.estado === 'RECHAZADO' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {candidato.estado}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Postulado: {new Date(candidato.fechaPostulacion).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!cargando && candidatos.length === 0 && (
                <div className="text-center text-gray-500">
                    {Object.values(criterios).some(v => v !== '') 
                        ? 'No se encontraron candidatos que coincidan con los criterios'
                        : 'Use los filtros para buscar candidatos'}
                </div>
            )}
        </div>
    );
}

export default FiltrarCandidatos;
```

### Hook Personalizado
```javascript
import { useState } from 'react';

function useFiltrarCandidatos() {
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const filtrar = async (ofertaId, criterios, usuarioIdActual) => {
        setCargando(true);
        setError(null);

        try {
            // Construir query string
            const params = new URLSearchParams({
                usuarioIdActual,
                ...Object.entries(criterios).reduce((acc, [key, value]) => {
                    if (value !== '') acc[key] = value;
                    return acc;
                }, {})
            });

            const response = await fetch(
                `http://localhost:8080/api/oferta/${ofertaId}/candidatos/filtrar?${params.toString()}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Error al filtrar candidatos');
            }

            const data = await response.json();
            setCandidatos(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    return { candidatos, cargando, error, filtrar };
}

export default useFiltrarCandidatos;
```

---

## 🔐 Validaciones & Seguridad

1. **Autorización**: Solo reclutadores pueden ver candidatos de sus ofertas
2. **Validación de Criterios**: Se valida que los parámetros sean válidos
3. **Filtrado en Backend**: Los criterios se validan en el servicio
4. **Auditoría**: Se registran búsquedas importantes

---

## 📝 Notas Importantes

- Al menos uno de los criterios opcionales puede ser proporcionado
- La búsqueda es case-insensitive para texto libre (cargo, municipio, habilidad)
- Se devuelven todos los candidatos si no se especifican criterios
- Los años de experiencia se calculan automáticamente desde las fechas
- La búsqueda se realiza en tiempo real sin paginación (considerar agregar más adelante)

---

## 🚀 Mejores Prácticas

1. **Búsquedas Combinadas**: Usar múltiples criterios para resultados más precisos
2. **Cacheo**: Considerar cachear resultados si los datos no cambian frecuentemente
3. **Paginación**: Agregar paginación para ofertas con muchos candidatos
4. **Exportar Resultados**: Implementar descarga de resultados en CSV o PDF
5. **Historial de Búsquedas**: Guardar búsquedas recientes para fácil acceso

---

## 📊 Estadísticas & Métricas

Este endpoint es fundamental para:
- Análisis de candidatos por perfil
- Generación de reportes de filtrado
- Optimización de criterios de selección
- Seguimiento de patrones de búsqueda
- Mejora de procesos de reclutamiento
