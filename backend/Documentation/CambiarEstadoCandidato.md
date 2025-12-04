# Documentación de Endpoints para Cambiar Estado del Candidato

---

## Base URL

Usa esta URL base para todos los ejemplos:

```
http://localhost:8080/api/oferta
```

---

## 1. Cambiar estado de candidato a PENDIENTE

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/estado
```
a
**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador que realiza la acción

**Ejemplo de petición JSON:**
```json
{
	"estado": "PENDIENTE"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 15,
	"usuario": {
		"id": 10,
		"nombre": "Juan Pérez",
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
	"fechaPostulacion": "2025-02-10T14:20:00",
	"fechaCambioEstado": "2025-02-16T10:30:00",
	"motivoRechazo": null
}
```

---

## 2. Cambiar estado de candidato a ENTREVISTA_PROGRAMADA

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"estado": "ENTREVISTA_PROGRAMADA"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 15,
	"usuario": {
		"id": 10,
		"nombre": "Juan Pérez",
		"correo": "juan@example.com"
	},
	"oferta": {
		"id": 1,
		"titulo": "Desarrollador Backend Java"
	},
	"estado": "ENTREVISTA_PROGRAMADA",
	"fechaPostulacion": "2025-02-10T14:20:00",
	"fechaCambioEstado": "2025-02-16T10:35:00",
	"notificacionEnviada": true
}
```

---

## 3. Cambiar estado de candidato a ACEPTADO

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"estado": "ACEPTADO"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 15,
	"usuario": {
		"id": 10,
		"nombre": "Juan Pérez",
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
	"estado": "ACEPTADO",
	"fechaPostulacion": "2025-02-10T14:20:00",
	"fechaCambioEstado": "2025-02-16T11:00:00",
	"fechaAceptacion": "2025-02-16T11:00:00",
	"notificacionEnviada": true
}
```

---

## 4. Cambiar estado de candidato a RECHAZADO

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"estado": "RECHAZADO",
	"motivo": "Experiencia insuficiente en el área específica"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 15,
	"usuario": {
		"id": 10,
		"nombre": "Juan Pérez",
		"correo": "juan@example.com"
	},
	"oferta": {
		"id": 1,
		"titulo": "Desarrollador Backend Java"
	},
	"estado": "RECHAZADO",
	"fechaPostulacion": "2025-02-10T14:20:00",
	"fechaCambioEstado": "2025-02-16T11:15:00",
	"motivoRechazo": "Experiencia insuficiente en el área específica",
	"notificacionEnviada": true
}
```

---

## 5. Obtener cambios de estado disponibles para una postulación

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/estados-disponibles
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/candidatos/15/estados-disponibles?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"postulacionId": 15,
	"estadoActual": "PENDIENTE",
	"estadosDisponibles": [
		"ENTREVISTA_PROGRAMADA",
		"RECHAZADO",
		"ACEPTADO"
	],
	"transicionesValidas": [
		{
			"desde": "PENDIENTE",
			"hacia": "ENTREVISTA_PROGRAMADA",
			"requiereEntrevista": true
		},
		{
			"desde": "PENDIENTE",
			"hacia": "RECHAZADO",
			"requiereMotivo": true
		},
		{
			"desde": "PENDIENTE",
			"hacia": "ACEPTADO",
			"requiereAprobacion": true
		}
	]
}
```

---

## 6. Obtener historial de cambios de estado

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/historial-estados
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/candidatos/15/historial-estados?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"postulacionId": 15,
	"candidato": {
		"id": 10,
		"nombre": "Juan Pérez",
		"correo": "juan@example.com"
	},
	"oferta": {
		"id": 1,
		"titulo": "Desarrollador Backend Java"
	},
	"totalCambios": 3,
	"historial": [
		{
			"secuencia": 1,
			"estadoAnterior": null,
			"estadoNuevo": "PENDIENTE",
			"reclutador": {
				"id": 5,
				"nombre": "Carlos López"
			},
			"fecha": "2025-02-10T14:20:00",
			"motivo": "Postulación inicial"
		},
		{
			"secuencia": 2,
			"estadoAnterior": "PENDIENTE",
			"estadoNuevo": "ENTREVISTA_PROGRAMADA",
			"reclutador": {
				"id": 5,
				"nombre": "Carlos López"
			},
			"fecha": "2025-02-12T09:45:00",
			"motivo": "CV revisado, cumple requisitos técnicos"
		},
		{
			"secuencia": 3,
			"estadoAnterior": "ENTREVISTA_PROGRAMADA",
			"estadoNuevo": "ACEPTADO",
			"reclutador": {
				"id": 5,
				"nombre": "Carlos López"
			},
			"fecha": "2025-02-16T11:00:00",
			"motivo": "Entrevista exitosa, excelente desempeño"
		}
	]
}
```

---

## 7. Cambiar estado en lote (Múltiples candidatos)

**Endpoint:**
```
PUT {BASE_URL}/{ofertaId}/candidatos/estado-lote
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"postulacionIds": [15, 16, 17],
	"nuevoEstado": "ENTREVISTA_PROGRAMADA"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"ofertaId": 1,
	"totalProcesados": 3,
	"exitosos": 3,
	"errores": 0,
	"nuevoEstado": "ENTREVISTA_PROGRAMADA",
	"resultados": [
		{
			"postulacionId": 15,
			"candidato": "Juan Pérez",
			"estadoAnterior": "PENDIENTE",
			"estadoNuevo": "ENTREVISTA_PROGRAMADA",
			"estado": "EXITOSO",
			"fecha": "2025-02-16T10:30:00"
		},
		{
			"postulacionId": 16,
			"candidato": "María García",
			"estadoAnterior": "PENDIENTE",
			"estadoNuevo": "ENTREVISTA_PROGRAMADA",
			"estado": "EXITOSO",
			"fecha": "2025-02-16T10:31:00"
		},
		{
			"postulacionId": 17,
			"candidato": "Carlos Rodríguez",
			"estadoAnterior": "PENDIENTE",
			"estadoNuevo": "ENTREVISTA_PROGRAMADA",
			"estado": "EXITOSO",
			"fecha": "2025-02-16T10:32:00"
		}
	]
}
```

---

## 8. Validar transición de estado

**Endpoint:**
```
POST {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/validar-estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición JSON:**
```json
{
	"estadoDestino": "ACEPTADO"
}
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"postulacionId": 15,
	"estadoActual": "ENTREVISTA_PROGRAMADA",
	"estadoDestino": "ACEPTADO",
	"esValida": true,
	"mensaje": "Transición válida",
	"requisitos": {
		"entrevistaRealizada": true,
		"evaluacionCompletada": true,
		"aprobacionGerente": true
	},
	"requierenAtencion": []
}
```

**Ejemplo de respuesta cuando no es válida (400 Bad Request):**
```json
{
	"postulacionId": 15,
	"estadoActual": "PENDIENTE",
	"estadoDestino": "ACEPTADO",
	"esValida": false,
	"mensaje": "No se puede ir directamente de PENDIENTE a ACEPTADO",
	"estadosValidosDesde": ["ENTREVISTA_PROGRAMADA"],
	"requierenAtencion": [
		"Debe programar una entrevista primero",
		"Debe completar la evaluación técnica"
	]
}
```

---

## 9. Revertir último cambio de estado

**Endpoint:**
```
PATCH {BASE_URL}/{ofertaId}/candidatos/{postulacionId}/revertir-estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta
- `postulacionId` (Long): ID de la postulación

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
PATCH http://localhost:8080/api/oferta/1/candidatos/15/revertir-estado?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"id": 15,
	"usuario": {
		"id": 10,
		"nombre": "Juan Pérez"
	},
	"oferta": {
		"id": 1,
		"titulo": "Desarrollador Backend Java"
	},
	"estadoAnterior": "ACEPTADO",
	"estadoNuevo": "ENTREVISTA_PROGRAMADA",
	"revertidoPor": {
		"id": 5,
		"nombre": "Carlos López"
	},
	"fecha": "2025-02-16T11:30:00",
	"mensaje": "Estado revertido exitosamente"
}
```

---

## 10. Obtener estadísticas de cambios de estado

**Endpoint:**
```
GET {BASE_URL}/{ofertaId}/estadisticas-cambios-estado
```

**Parámetros de ruta:**
- `ofertaId` (Long): ID de la oferta

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `usuarioIdActual` (Long): ID del usuario reclutador

**Ejemplo de petición:**
```
GET http://localhost:8080/api/oferta/1/estadisticas-cambios-estado?usuarioIdActual=5
```

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
	"ofertaId": 1,
	"nombreOferta": "Desarrollador Backend Java",
	"totalCambios": 47,
	"cambiosPorEstado": {
		"PENDIENTE": 12,
		"ENTREVISTA_PROGRAMADA": 18,
		"ACEPTADO": 15,
		"RECHAZADO": 2
	},
	"cambiosPorReclutador": {
		"Carlos López": 28,
		"María Rodríguez": 19
	},
	"transicionesFrecuentes": [
		{
			"desde": "PENDIENTE",
			"hacia": "ENTREVISTA_PROGRAMADA",
			"cantidad": 35
		},
		{
			"desde": "ENTREVISTA_PROGRAMADA",
			"hacia": "ACEPTADO",
			"cantidad": 14
		},
		{
			"desde": "ENTREVISTA_PROGRAMADA",
			"hacia": "RECHAZADO",
			"cantidad": 4
		}
	],
	"velocidadPromedio": {
		"PENDIENTE_A_ENTREVISTA": "2.5 días",
		"ENTREVISTA_A_ACEPTADO": "4 días",
		"TOTAL_PROCESO": "6.5 días"
	}
}
```

---

## Valores permitidos

### Estados Permitidos:
- `PENDIENTE` - Postulación inicial, en revisión
- `ENTREVISTA_PROGRAMADA` - Se ha programado entrevista
- `ACEPTADO` - Candidato aceptado para la posición
- `RECHAZADO` - Candidato rechazado

### Motivos de Rechazo (Ejemplos):
- `Experiencia insuficiente`
- `Requisitos técnicos no cumplidos`
- `Resultado negativo en entrevista`
- `Disponibilidad incompatible`
- `Expectativa salarial fuera de presupuesto`
- `Candidato rechazó oferta`
- `Otro`

---

## Respuestas posibles

- **200 OK:** Estado actualizado exitosamente.
- **201 Created:** Cambio de estado registrado.
- **204 No Content:** Operación exitosa, devuelve vacío.
- **400 Bad Request:** 
  - Datos inválidos o incompletos
  - Transición de estado no válida
  - Motivo requerido para rechazo no proporcionado
- **401 Unauthorized:** Token no proporcionado o inválido.
- **403 Forbidden:** Usuario no autorizado (no es reclutador de la empresa).
- **404 Not Found:** Postulación, oferta u usuario no encontrado.
- **409 Conflict:** 
  - Postulación ya en ese estado
  - Cambios conflictivos simultáneos
- **500 Internal Server Error:** Error inesperado del sistema.

---

## Notas

- Todos los endpoints requieren autenticación mediante token JWT.
- El parámetro `usuarioIdActual` es requerido como Query Parameter.
- Solo reclutadores de la empresa pueden cambiar estados de candidatos.
- Cada cambio de estado queda registrado en el historial.
- Al cambiar a ACEPTADO, se envía notificación automáticamente al candidato.
- Al cambiar a RECHAZADO, se puede proporcionar un motivo (opcional pero recomendado).
- Las transiciones de estado siguen una máquina de estados definida:
  - PENDIENTE → ENTREVISTA_PROGRAMADA, RECHAZADO, ACEPTADO
  - ENTREVISTA_PROGRAMADA → ACEPTADO, RECHAZADO
  - ACEPTADO → (final, no se puede cambiar)
  - RECHAZADO → (final, pero se puede revertir excepcionalmente)
- El cambio en lote permite actualizar múltiples candidatos simultáneamente.
- Se pueden revertir cambios de estado accidentales usando el endpoint de revertir.
- Las estadísticas se calculan automáticamente basadas en los cambios registrados.
- No hay límite de cambios de estado por candidato.

---

## Casos de Uso Comunes

### Cambiar a entrevista programada
```
PUT /api/oferta/1/candidatos/15/estado?usuarioIdActual=5
{
	"estado": "ENTREVISTA_PROGRAMADA"
}
```

### Rechazar candidato con motivo
```
PUT /api/oferta/1/candidatos/15/estado?usuarioIdActual=5
{
	"estado": "RECHAZADO",
	"motivo": "Experiencia insuficiente en el área específica"
}
```

### Aceptar candidato
```
PUT /api/oferta/1/candidatos/15/estado?usuarioIdActual=5
{
	"estado": "ACEPTADO"
}
```

### Cambiar múltiples candidatos a entrevista
```
PUT /api/oferta/1/candidatos/estado-lote?usuarioIdActual=5
{
	"postulacionIds": [15, 16, 17, 18],
	"nuevoEstado": "ENTREVISTA_PROGRAMADA"
}
```

### Ver historial de cambios
```
GET /api/oferta/1/candidatos/15/historial-estados?usuarioIdActual=5
```

### Validar si se puede cambiar estado
```
POST /api/oferta/1/candidatos/15/validar-estado?usuarioIdActual=5
{
	"estadoDestino": "ACEPTADO"
}
```

### Revertir último cambio de estado
```
PATCH /api/oferta/1/candidatos/15/revertir-estado?usuarioIdActual=5
```

### Ver estadísticas de cambios
```
GET /api/oferta/1/estadisticas-cambios-estado?usuarioIdActual=5
```

