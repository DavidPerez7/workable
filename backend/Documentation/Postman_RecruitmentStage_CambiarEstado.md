# 📊 CAMBIAR ESTADO DEL CANDIDATO - Documentación Postman

## 🔗 Endpoint
**PUT** `/oferta/{ofertaId}/candidatos/{postulacionId}/estado`

## 📋 Descripción
Actualiza el estado de una postulación específica en el proceso de selección. Permite cambiar el candidato de un estado a otro (PENDIENTE, ACEPTADA, RECHAZADA) dentro del pipeline de reclutamiento.

---

## 🔧 Parámetros

### Path Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `ofertaId` | Long | ID de la oferta | `1` |
| `postulacionId` | Long | ID de la postulación a actualizar | `15` |

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Valores Válidos |
|-----------|------|-------------|-----------------|
| `nuevoEstado` | Enum | Nuevo estado para el candidato | `PENDIENTE`, `ACEPTADA`, `RECHAZADA` |
| `usuarioIdActual` | Long | ID del usuario reclutador que hace la solicitud | `5` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api/oferta/1/candidatos/15/estado?nuevoEstado=ACEPTADA&usuarioIdActual=5
```

### Headers
```
Content-Type: application/json
Authorization: (si aplica)
```

### Body
Sin body requerido (los parámetros se envían por Query Parameters)

---

## 📥 Response

### Success (200 OK)
```json
{
  "id": 15,
  "usuario": {
    "id": 10,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "oferta": {
    "id": 1,
    "titulo": "Desarrollador Backend",
    "empresa": {
      "id": 3,
      "nombre": "TechCorp"
    }
  },
  "estado": "ACEPTADA",
  "fechaPostulacion": "2025-01-15T10:30:00Z",
  "ultimaActualizacion": "2025-01-20T14:45:00Z"
}
```

### Error (400 Bad Request)
```json
{
  "error": "Estado inválido",
  "message": "El estado proporcionado no es válido",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

### Error (404 Not Found)
```json
{
  "error": "Postulación no encontrada",
  "message": "No existe postulación con ID 999",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

### Error (403 Forbidden)
```json
{
  "error": "No autorizado",
  "message": "No tienes permisos para cambiar el estado de esta postulación",
  "timestamp": "2025-01-20T14:45:00Z"
}
```

---

## 🎯 Casos de Uso

### Caso 1: Aceptar un Candidato
Cambiar estado de PENDIENTE a ACEPTADA para un candidato que pasó la entrevista.

**Endpoint:**
```
PUT /oferta/1/candidatos/15/estado?nuevoEstado=ACEPTADA&usuarioIdActual=5
```

**Respuesta esperada:** Postulación con estado actualizado a ACEPTADA.

---

### Caso 2: Rechazar un Candidato
Cambiar estado a RECHAZADA después de revisar el perfil.

**Endpoint:**
```
PUT /oferta/1/candidatos/20/estado?nuevoEstado=RECHAZADA&usuarioIdActual=5
```

**Respuesta esperada:** Postulación con estado actualizado a RECHAZADA.

---

### Caso 3: Volver a PENDIENTE
Retornar un candidato a revisión después de cambio de decisión.

**Endpoint:**
```
PUT /oferta/1/candidatos/18/estado?nuevoEstado=PENDIENTE&usuarioIdActual=5
```

**Respuesta esperada:** Postulación con estado vuelto a PENDIENTE.

---

## 📊 Transiciones de Estados Válidas

| De | Hacia | Descripción |
|-------|------|-------------|
| PENDIENTE | ACEPTADA | Candidato aprobado |
| PENDIENTE | RECHAZADA | Candidato rechazado |
| PENDIENTE | PENDIENTE | Mantener en revisión |
| ACEPTADA | RECHAZADA | Cambiar decisión a rechazado |
| ACEPTADA | PENDIENTE | Volver a revisión |
| ACEPTADA | ACEPTADA | Confirmar aceptación |
| RECHAZADA | ACEPTADA | Reconsiderar candidato |
| RECHAZADA | PENDIENTE | Volver a revisión |
| RECHAZADA | RECHAZADA | Confirmar rechazo |

---

## ⚙️ Pre-request Script (Postman)

```javascript
// Validar que los parámetros requeridos existan
if (!pm.request.url.query.get('nuevoEstado')) {
    throw new Error('Falta parámetro: nuevoEstado');
}

if (!pm.request.url.query.get('usuarioIdActual')) {
    throw new Error('Falta parámetro: usuarioIdActual');
}

// Validar que el estado sea válido
const estadosValidos = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'];
const estado = pm.request.url.query.get('nuevoEstado');

if (!estadosValidos.includes(estado)) {
    throw new Error(`Estado inválido: ${estado}. Valores válidos: ${estadosValidos.join(', ')}`);
}

// Registrar información de la solicitud
console.log('Cambio de estado de postulación:');
console.log('Oferta ID:', pm.request.url.query.get('ofertaId'));
console.log('Postulación ID:', pm.request.url.query.get('postulacionId'));
console.log('Nuevo Estado:', estado);
console.log('Usuario ID:', pm.request.url.query.get('usuarioIdActual'));
```

---

## 🧪 Test Script (Postman)

```javascript
pm.test('Status code es 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response contiene un objeto Postulación', function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('estado');
});

pm.test('Estado actualizado correctamente', function () {
    var jsonData = pm.response.json();
    const estadoEsperado = pm.request.url.query.get('nuevoEstado');
    pm.expect(jsonData.estado).to.equal(estadoEsperado);
});

pm.test('Campos de auditoría presentes', function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('fechaPostulacion');
    pm.expect(jsonData).to.have.property('ultimaActualizacion');
});

pm.test('ultimaActualizacion es más reciente que fechaPostulacion', function () {
    var jsonData = pm.response.json();
    var fecha1 = new Date(jsonData.fechaPostulacion).getTime();
    var fecha2 = new Date(jsonData.ultimaActualizacion).getTime();
    pm.expect(fecha2).to.be.greaterThanOrEqual(fecha1);
});

// Guardar el ID de postulación para siguientes requests
pm.globals.set('postulacionId', pm.response.json().id);
pm.globals.set('estadoActual', pm.response.json().estado);
```

---

## 🔄 Ejemplo cURL

### Aceptar Candidato
```bash
curl -X PUT "http://localhost:8080/api/oferta/1/candidatos/15/estado?nuevoEstado=ACEPTADA&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

### Rechazar Candidato
```bash
curl -X PUT "http://localhost:8080/api/oferta/1/candidatos/20/estado?nuevoEstado=RECHAZADA&usuarioIdActual=5" \
  -H "Content-Type: application/json"
```

---

## 💻 Ejemplo JavaScript/React

### Función Base
```javascript
async function cambiarEstadoPostulacion(ofertaId, postulacionId, nuevoEstado, usuarioIdActual) {
    try {
        const url = `http://localhost:8080/api/oferta/${ofertaId}/candidatos/${postulacionId}/estado?nuevoEstado=${nuevoEstado}&usuarioIdActual=${usuarioIdActual}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al cambiar estado');
        }

        const postulacion = await response.json();
        console.log('Estado actualizado:', postulacion);
        return postulacion;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
```

### Componente React - Selector de Estados
```jsx
import React, { useState } from 'react';

function CambiarEstadoPostulacion({ ofertaId, postulacionId, estadoActual, usuarioIdActual }) {
    const [estado, setEstado] = useState(estadoActual);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const estadosDisponibles = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'];

    const handleCambiarEstado = async (nuevoEstado) => {
        setCargando(true);
        setError(null);

        try {
            const url = `http://localhost:8080/api/oferta/${ofertaId}/candidatos/${postulacionId}/estado?nuevoEstado=${nuevoEstado}&usuarioIdActual=${usuarioIdActual}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cambiar estado');
            }

            const postulacion = await response.json();
            setEstado(postulacion.estado);
            console.log('Estado cambió a:', postulacion.estado);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const getEstadoColor = (est) => {
        switch (est) {
            case 'ACEPTADA':
                return 'bg-green-100 text-green-800';
            case 'RECHAZADA':
                return 'bg-red-100 text-red-800';
            case 'PENDIENTE':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Estado Actual</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(estado)}`}>
                    {estado}
                </span>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Cambiar Estado</h3>
                <div className="grid grid-cols-3 gap-2">
                    {estadosDisponibles.map((est) => (
                        <button
                            key={est}
                            onClick={() => handleCambiarEstado(est)}
                            disabled={cargando || est === estado}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                est === estado
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                            } ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {est}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {cargando && (
                <div className="text-center mt-4">
                    <p className="text-gray-500">Actualizando...</p>
                </div>
            )}
        </div>
    );
}

export default CambiarEstadoPostulacion;
```

### Hook Personalizado
```javascript
import { useState } from 'react';

function useCambiarEstadoPostulacion() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cambiarEstado = async (ofertaId, postulacionId, nuevoEstado, usuarioIdActual) => {
        setCargando(true);
        setError(null);

        try {
            const url = `http://localhost:8080/api/oferta/${ofertaId}/candidatos/${postulacionId}/estado?nuevoEstado=${nuevoEstado}&usuarioIdActual=${usuarioIdActual}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error al cambiar estado');
            }

            const postulacion = await response.json();
            return postulacion;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    return { cambiarEstado, cargando, error };
}

export default useCambiarEstadoPostulacion;
```

---

## 🔐 Validaciones & Seguridad

1. **Autorización**: El usuario debe ser reclutador de la empresa que publicó la oferta
2. **Validación de Estado**: Solo acepta valores válidos (PENDIENTE, ACEPTADA, RECHAZADA)
3. **Integridad**: Verifica que la postulación pertenezca a la oferta especificada
4. **Auditoría**: Registra fecha y hora del cambio de estado

---

## 📝 Notas Importantes

- El cambio de estado es permanente pero reversible (puede volver a cambiar)
- Se registra automáticamente la fecha de última actualización
- El usuario debe ser el reclutador de la empresa para hacer cambios
- Se pueden hacer múltiples cambios de estado en el mismo candidato
- Útil para seguimiento del pipeline de contratación

---

## 🚀 Mejores Prácticas

1. **Validar Estado Anterior**: Antes de cambiar, verifica el estado actual del candidato
2. **Notificaciones**: Considera notificar al aspirante cuando se rechaza su postulación
3. **Auditoría**: Mantén registro de quién cambió el estado y cuándo
4. **Lógica de Negocio**: Implementa reglas sobre qué cambios de estado son permitidos
5. **Transacciones**: Agrupa cambios de estado con otras operaciones relacionadas

---

## 📊 Estadísticas & Métricas

Este endpoint es fundamental para:
- Tracking del pipeline de selección
- Métricas de conversión de candidatos
- Reportes de reclutamiento
- Análisis de tiempos en cada estado
