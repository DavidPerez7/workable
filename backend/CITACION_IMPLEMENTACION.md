# Sistema de Citaciones para Entrevistas - Implementación Completada

## Resumen de Cambios

Se implementó un sistema completo para que los reclutadores puedan enviar citaciones de entrevista a los candidatos con detalles de fecha, hora y link de Google Meet.

## Archivos Creados

### 1. **Modelo - Citacion.java**
```
Ubicación: src/main/java/.../models/Citacion.java
Responsabilidad: Entidad JPA que representa una citación
Campos principales:
  - postulacion (ManyToOne) - Referencia a la postulación
  - reclutador (ManyToOne) - Quién cita
  - fechaCitacion (LocalDate) - Día de la entrevista
  - hora (String) - Hora de la entrevista
  - linkMeet (String) - Link de Google Meet
  - estado (Enum) - PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA
  - correoEnviado (Boolean) - Si el correo fue enviado
```

### 2. **Repositorio - CitacionRepo.java**
```
Ubicación: src/main/java/.../repository/CitacionRepo.java
Métodos especializados:
  - findByPostulacionId() - Citaciones de una postulación
  - findByReclutadorIdOrderByFechaCitacionDesc() - Citaciones por reclutador
  - findByPostulacionUsuarioId() - Citaciones de un aspirante
  - findByPostulacionOfertaId() - Citaciones de una oferta
  - findByEstado() - Filtrar por estado
```

### 3. **Servicio de Email - EmailService.java**
```
Ubicación: src/main/java/.../service/EmailService.java
Responsabilidad: Enviar correos HTML formateados
Métodos:
  - enviarCorreoCitacion() - Envía correo a un candidato
  - enviarCorreoCitacionMultiple() - Envía a varios candidatos
  - construirHtmlCitacion() - Genera el HTML del correo
```

### 4. **Servicio de Citación - CitacionService.java**
```
Ubicación: src/main/java/.../service/CitacionService.java
Métodos principales:
  - crearCitacion() - Crear citación individual
  - enviarCitacionPorCorreo() - Enviar correo
  - enviarCitacionesMultiples() - Crear y enviar múltiples
  - obtenerCitacion() - Consultar una citación
  - obtenerCitacionesDelReclutador() - Listar del reclutador
  - obtenerCitacionesDelAspirante() - Listar del aspirante
  - cambiarEstadoCitacion() - Actualizar estado
  - eliminarCitacion() - Soft delete
```

### 5. **Controlador - CitacionController.java**
```
Ubicación: src/main/java/.../controller/CitacionController.java
Endpoints:
  POST   /api/citacion                          - Crear citación
  POST   /api/citacion/multiples                - Crear múltiples
  GET    /api/citacion/{id}                     - Obtener por ID
  GET    /api/citacion/reclutador/{id}          - Listar del reclutador
  GET    /api/citacion/aspirante/{id}           - Listar del aspirante
  GET    /api/citacion/oferta/{id}              - Listar de una oferta
  POST   /api/citacion/{id}/enviar-correo       - Enviar por mail
  PUT    /api/citacion/{id}/estado              - Cambiar estado
  DELETE /api/citacion/{id}                     - Eliminar
```

### 6. **DTO - CitacionRequestDto.java**
```
Ubicación: src/main/java/.../dto/CitacionRequestDto.java
DTOs:
  - CitacionRequestDto: Para crear una citación
  - CitacionesMultiplesRequestDto: Para múltiples citaciones
```

### 7. **Documentación - Citacion_API.md**
```
Ubicación: backend/Documentation/Citacion_API.md
Contiene:
  - Descripción general
  - Ejemplos de todos los endpoints
  - Modelos de respuesta
  - Configuración de email
  - Flujo recomendado de uso
```

## Cambios a Archivos Existentes

### 1. **pom.xml**
```xml
Agregado:
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 2. **application.properties**
```properties
Agregado:
# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:tu-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:tu-contraseña-de-app}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

## Características Principales

### ✅ Creación de Citaciones
- Crear citación individual para un candidato
- Crear múltiples citaciones con mismo link y hora
- Validar permisos (solo reclutador/admin)

### ✅ Envío de Correos
- HTML formateado profesional
- Nombre del candidato personalizado
- Información de la posición
- Fecha, hora y entrevistador
- Link clickeable de Google Meet
- Detalles adicionales opcionales

### ✅ Gestión de Citaciones
- Ver citaciones por reclutador
- Ver citaciones del aspirante
- Listar citaciones de una oferta
- Cambiar estado (PENDIENTE → CONFIRMADA → ASISTIO/NO_ASISTIO/CANCELADA)
- Eliminar citaciones

### ✅ Seguridad
- @PreAuthorize en todos los endpoints
- Validación de permisos a nivel de servicio
- Soft delete para no perder historial
- Solo reclutador/admin pueden crear citaciones

### ✅ Permisos
| Rol | Crear | Enviar | Ver | Cambiar Estado | Eliminar |
|-----|-------|--------|-----|----------------|----------|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ |
| RECLUTADOR | ✅* | ✅* | ✅* | ✅* | ✅* |
| ASPIRANTE | ❌ | ❌ | ✅ | ❌ | ❌ |
| ADSO | ❌ | ❌ | ❌ | ❌ | ❌ |

*Solo sus propias citaciones

## Flujo de Uso

1. **Reclutador ve aspirantes de una oferta**
   ```
   GET /api/postulacion/oferta/{ofertaId}/aspirantes?usuarioIdActual=5
   ```

2. **Selecciona candidatos y crea citaciones**
   ```
   POST /api/citacion/multiples
   Body: {postulacionIds: [1,2,3], reclutadorId: 5, ...}
   ```

3. **Se envían correos automáticamente** ✉️

4. **Reclutador ve estado de citaciones**
   ```
   GET /api/citacion/reclutador/5?usuarioIdActual=5
   ```

5. **Actualiza estado después de entrevista**
   ```
   PUT /api/citacion/1/estado?estado=ASISTIO&usuarioIdActual=5
   ```

6. **Aspirante ve sus citaciones**
   ```
   GET /api/citacion/aspirante/3?usuarioIdActual=3
   ```

## Configuración de Email (Importante)

Para usar Gmail:
1. Activar 2FA en tu cuenta Google
2. Generar [contraseña de aplicación](https://support.google.com/accounts/answer/185833)
3. Agregar variables de entorno:
   ```
   MAIL_USERNAME=tu-email@gmail.com
   MAIL_PASSWORD=tu-contraseña-de-app-16-caracteres
   ```

## Estados de Citación

```
PENDIENTE (inicial)
    ↓
CONFIRMADA (candidato confirma)
    ↓
ASISTIO / NO_ASISTIO / CANCELADA (final)
```

## Ejemplo de Correo Enviado

```
De: tu-email@gmail.com
Para: candidato@email.com
Asunto: Citación para Entrevista - Desarrollador Java

---

¡Citación para Entrevista!

Hola Juan Pérez,

Tenemos el placer de invitarte a una entrevista para la 
posición de Desarrollador Java.

📅 Fecha de la entrevista: 2025-12-15
🕐 Hora: 10:00
👤 Entrevistador: María García

Te invitamos a conectarte a través de:
https://meet.google.com/pys-jsbr-nmz

[Botón: Ir a la Entrevista]

Si no puedes asistir o tienes preguntas, responde a este correo.

¡Esperamos verte pronto!

---
```

## Validaciones Implementadas

✅ Validar que la postulación existe
✅ Validar que el reclutador existe
✅ Validar permisos del usuario (solo reclutador/admin crean)
✅ Validar que reclutador no cita fuera de su empresa (en progreso)
✅ Validar estados válidos de citación
✅ Validar que aspirante es propietario de su postulación
✅ Soft delete para mantener historial

## Compilación

```bash
mvn compile
# BUILD SUCCESS ✅
```

## Próximos Pasos (Opcional)

- [ ] Notificaciones push cuando se envía citación
- [ ] Confirmación de asistencia del aspirante vía correo
- [ ] Recordatorio automático 1 hora antes
- [ ] Integración real con Google Meet API
- [ ] Reporte de asistencia
- [ ] Historial de citaciones canceladas/reprogramadas
