# Sistema de Citaciones para Entrevistas

## Descripción General
El sistema de citaciones permite a los reclutadores enviar citaciones por correo a los candidatos que se han postulado para una vacante. Las citaciones incluyen:
- Fecha y hora de la entrevista
- Link de Google Meet para la entrevista virtual
- Detalles adicionales si es necesario
- Correo automático con toda la información formateada

## Endpoints

### 1. Crear una Citación Individual

**POST** `/api/citacion`

Crea una citación para un candidato específico.

**Parámetros:**
- `postulacionId` (Long) - ID de la postulación
- `reclutadorId` (Long) - ID del reclutador que cita
- `fechaCitacion` (LocalDate) - Fecha de la cita (formato: YYYY-MM-DD)
- `hora` (String) - Hora de la cita (formato: HH:MM)
- `linkMeet` (String) - Link de Google Meet
- `detalles` (String, opcional) - Detalles adicionales
- `usuarioIdActual` (Long) - ID del usuario autenticado

**Ejemplo:**
```
POST /api/citacion?postulacionId=1&reclutadorId=5&fechaCitacion=2025-12-15&hora=10:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&usuarioIdActual=5
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Citación creada exitosamente",
  "citacionId": 1,
  "estado": "PENDIENTE"
}
```

---

### 2. Crear Citaciones Múltiples

**POST** `/api/citacion/multiples`

Crea citaciones para múltiples candidatos con los mismos detalles.

**Parámetros:**
- `postulacionIds` (List<Long>) - IDs de postulaciones (ej: 1,2,3)
- `reclutadorId` (Long) - ID del reclutador
- `fechaCitacion` (LocalDate) - Fecha de la cita
- `hora` (String) - Hora de la cita
- `linkMeet` (String) - Link de Google Meet
- `detalles` (String, opcional) - Detalles adicionales
- `usuarioIdActual` (Long) - ID del usuario autenticado

**Ejemplo:**
```
POST /api/citacion/multiples?postulacionIds=1,2,3&reclutadorId=5&fechaCitacion=2025-12-15&hora=10:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&usuarioIdActual=5
```

**Respuesta exitosa (200):**
```json
{
  "citacionesCreadas": 3,
  "correosEnviados": [
    "candidato1@email.com",
    "candidato2@email.com",
    "candidato3@email.com"
  ],
  "errores": [],
  "total": 3,
  "exitosas": 3
}
```

---

### 3. Obtener una Citación

**GET** `/api/citacion/{citacionId}`

Obtiene los detalles de una citación específica.

**Parámetros:**
- `citacionId` (Path) - ID de la citación
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
GET /api/citacion/1?usuarioIdActual=5
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "postulacion": {
    "id": 1,
    "usuario": {
      "id": 3,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan@email.com"
    },
    "oferta": {
      "id": 2,
      "titulo": "Desarrollador Java"
    }
  },
  "reclutador": {
    "id": 5,
    "nombre": "María",
    "apellido": "García"
  },
  "fechaCitacion": "2025-12-15",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
  "estado": "PENDIENTE",
  "correoEnviado": false
}
```

---

### 4. Obtener Citaciones del Reclutador

**GET** `/api/citacion/reclutador/{reclutadorId}`

Obtiene todas las citaciones creadas por un reclutador.

**Parámetros:**
- `reclutadorId` (Path) - ID del reclutador
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
GET /api/citacion/reclutador/5?usuarioIdActual=5
```

**Respuesta:** Lista de citaciones

---

### 5. Obtener Citaciones del Aspirante

**GET** `/api/citacion/aspirante/{usuarioId}`

Obtiene todas las citaciones para un aspirante.

**Parámetros:**
- `usuarioId` (Path) - ID del aspirante
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
GET /api/citacion/aspirante/3?usuarioIdActual=3
```

**Respuesta:** Lista de citaciones del aspirante

---

### 6. Obtener Citaciones de una Oferta

**GET** `/api/citacion/oferta/{ofertaId}`

Obtiene todas las citaciones para una oferta específica.

**Parámetros:**
- `ofertaId` (Path) - ID de la oferta
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
GET /api/citacion/oferta/2?usuarioIdActual=5
```

---

### 7. Enviar Citación por Correo

**POST** `/api/citacion/{citacionId}/enviar-correo`

Envía la citación por correo al candidato.

**Parámetros:**
- `citacionId` (Path) - ID de la citación
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
POST /api/citacion/1/enviar-correo?usuarioIdActual=5
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Correo de citación enviado exitosamente",
  "citacionId": 1,
  "correoEnviado": "candidato@email.com"
}
```

---

### 8. Cambiar Estado de Citación

**PUT** `/api/citacion/{citacionId}/estado`

Cambia el estado de una citación.

**Estados disponibles:**
- `PENDIENTE` - Citación creada pero no confirmada
- `CONFIRMADA` - Candidato confirmó asistencia
- `ASISTIO` - El candidato asistió
- `NO_ASISTIO` - El candidato no asistió
- `CANCELADA` - La citación fue cancelada

**Parámetros:**
- `citacionId` (Path) - ID de la citación
- `estado` (Query) - Nuevo estado
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
PUT /api/citacion/1/estado?estado=CONFIRMADA&usuarioIdActual=5
```

**Respuesta:**
```json
{
  "mensaje": "Estado actualizado exitosamente",
  "nuevoEstado": "CONFIRMADA"
}
```

---

### 9. Eliminar Citación

**DELETE** `/api/citacion/{citacionId}`

Elimina (soft delete) una citación.

**Parámetros:**
- `citacionId` (Path) - ID de la citación
- `usuarioIdActual` (Query) - ID del usuario autenticado

**Ejemplo:**
```
DELETE /api/citacion/1?usuarioIdActual=5
```

---

## Plantilla de Correo

El correo de citación incluye:
- Saludo personalizado con el nombre del candidato
- Nombre de la posición
- Fecha y hora de la entrevista
- Nombre del entrevistador
- Link de Google Meet (clickeable)
- Detalles adicionales (si aplica)
- Instrucciones para responder

### Ejemplo de Correo

```
Asunto: Citación para Entrevista - Desarrollador Java

Hola Juan Pérez,

Tenemos el placer de invitarte a una entrevista para la posición de Desarrollador Java.

📅 Fecha de la entrevista: 2025-12-15
🕐 Hora: 10:00
👤 Entrevistador: María García

Te invitamos a conectarte a través del siguiente enlace de Google Meet:
https://meet.google.com/pys-jsbr-nmz

Si no puedes asistir o tienes preguntas, responde a este correo.

¡Esperamos verte pronto!
```

---

## Permisos

- **ADMIN**: Puede crear, ver, modificar y eliminar todas las citaciones
- **RECLUTADOR**: Puede crear citaciones para sus propias postulaciones, ver sus citaciones y las de sus candidatos
- **ASPIRANTE**: Solo puede ver sus propias citaciones
- **ADSO**: No tiene acceso a este sistema

---

## Configuración de Email

Para que el sistema de correos funcione, debes configurar las variables de entorno:

```
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-de-app
```

O modificar en `application.properties`:
```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-contraseña-de-app
```

**Nota:** Para Gmail, usa [contraseña de aplicación](https://support.google.com/accounts/answer/185833), no tu contraseña regular.

---

## Flujo de Uso Recomendado

1. **El reclutador revisa los aspirantes** de una oferta usando:
   ```
   GET /api/postulacion/oferta/{ofertaId}/aspirantes
   ```

2. **Selecciona candidatos** y crea citaciones:
   ```
   POST /api/citacion/multiples
   ```

3. **Verifica el estado de las citaciones**:
   ```
   GET /api/citacion/reclutador/{reclutadorId}
   ```

4. **Actualiza estado después de la entrevista**:
   ```
   PUT /api/citacion/{citacionId}/estado
   ```

5. **El aspirante recibe y ve sus citaciones**:
   ```
   GET /api/citacion/aspirante/{usuarioId}
   ```
