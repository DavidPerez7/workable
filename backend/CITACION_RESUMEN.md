# 📧 SISTEMA DE CITACIONES PARA ENTREVISTAS - RESUMEN

## ✅ IMPLEMENTACIÓN COMPLETADA

### Lo que se logró implementar:

#### 1️⃣ **Modelo de Datos (Citacion.java)**
- Entidad JPA que almacena las citaciones
- Relaciones con Postulacion y Usuario (Reclutador)
- Estados: PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA
- Campos: fecha, hora, link de Meet, detalles, observaciones

#### 2️⃣ **Repositorio (CitacionRepo.java)**
- 8 métodos especializados para consultas
- Búsqueda por postulación, reclutador, aspirante, oferta, estado, fecha

#### 3️⃣ **Servicio de Email (EmailService.java)**
- Envía correos HTML profesionales
- Plantilla personalizada con:
  - Nombre del candidato
  - Posición
  - Fecha y hora
  - Link de Google Meet (clickeable)
  - Detalles adicionales
  - Diseño responsivo

#### 4️⃣ **Servicio de Citación (CitacionService.java)**
- Crear citaciones individuales
- Crear múltiples citaciones
- Enviar por correo
- Gestión completa de ciclo de vida
- Validación de permisos

#### 5️⃣ **Controlador REST (CitacionController.java)**
- 9 endpoints con seguridad @PreAuthorize
- CRUD completo
- Manejo robusto de errores

---

## 📊 ENDPOINTS DISPONIBLES

### Crear Citaciones
```
POST /api/citacion
POST /api/citacion/multiples
```

### Obtener Citaciones
```
GET /api/citacion/{id}
GET /api/citacion/reclutador/{reclutadorId}
GET /api/citacion/aspirante/{usuarioId}
GET /api/citacion/oferta/{ofertaId}
```

### Enviar Email
```
POST /api/citacion/{id}/enviar-correo
```

### Actualizar
```
PUT /api/citacion/{id}/estado
```

### Eliminar
```
DELETE /api/citacion/{id}
```

---

## 🔐 PERMISOS Y SEGURIDAD

| Acción | ADMIN | RECLUTADOR | ASPIRANTE | ADSO |
|--------|-------|-----------|-----------|------|
| Crear Citación | ✅ | ✅* | ❌ | ❌ |
| Enviar Correo | ✅ | ✅* | ❌ | ❌ |
| Ver Citaciones | ✅ | ✅* | ✅* | ❌ |
| Cambiar Estado | ✅ | ✅* | ❌ | ❌ |
| Eliminar | ✅ | ✅* | ❌ | ❌ |

*Solo sus propias citaciones

---

## 🌐 FLUJO DE USO

```
1. RECLUTADOR REVISA ASPIRANTES
   ↓
   GET /api/postulacion/oferta/{ofertaId}/aspirantes
   
2. SELECCIONA CANDIDATOS
   ↓
   POST /api/citacion/multiples (1,2,3)
   
3. SISTEMA ENVÍA CORREOS AUTOMÁTICAMENTE
   ↓
   ✉️ candidato1@email.com
   ✉️ candidato2@email.com
   ✉️ candidato3@email.com
   
4. ASPIRANTE RECIBE Y VE SU CITACIÓN
   ↓
   GET /api/citacion/aspirante/{usuarioId}
   
5. RECLUTADOR ACTUALIZA ESTADO
   ↓
   PUT /api/citacion/{id}/estado (ASISTIO/NO_ASISTIO)
```

---

## 📧 EJEMPLO DE CORREO ENVIADO

```
╔════════════════════════════════════════════════════╗
║          ¡CITACIÓN PARA ENTREVISTA!               ║
╚════════════════════════════════════════════════════╝

Hola Juan Pérez,

Tenemos el placer de invitarte a una entrevista para 
la posición de Desarrollador Java.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Fecha: 2025-12-15
🕐 Hora: 10:00
👤 Entrevistador: María García

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Conectarse a Google Meet:
https://meet.google.com/pys-jsbr-nmz

[BOTÓN: Ir a la Entrevista]

Si tienes preguntas, responde a este correo.

¡Esperamos verte pronto!
```

---

## 🛠️ CONFIGURACIÓN DE EMAIL

Para que funcione el envío de correos:

### Opción 1: Variables de Entorno
```bash
set MAIL_USERNAME=tu-email@gmail.com
set MAIL_PASSWORD=tu-contraseña-de-app
```

### Opción 2: application.properties
```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-contraseña-de-app
```

### Para Gmail:
1. Activar 2FA
2. Generar contraseña de aplicación (16 caracteres)
3. Usar esa contraseña en la configuración

---

## 📝 ESTADOS DE CITACIÓN

```
PENDIENTE
   ↓ (candidato confirma o reclutador actualiza)
CONFIRMADA
   ↓ (después de la entrevista)
ASISTIO / NO_ASISTIO / CANCELADA
   (estado final)
```

---

## ✨ CARACTERÍSTICAS

✅ Crear citaciones individuales o en lote
✅ Envío automático de correos HTML
✅ Gestión de estados
✅ Filtrado por reclutador, aspirante, oferta
✅ Validación de permisos
✅ Soft delete para historial
✅ Link de Google Meet incluido
✅ Detalles personalizables
✅ Observaciones y notas
✅ Historial de envíos

---

## 📂 ARCHIVOS CREADOS

```
src/main/java/.../
├── models/
│   └── Citacion.java ............ Entidad JPA
├── repository/
│   └── CitacionRepo.java ........ Consultas BD
├── service/
│   ├── EmailService.java ........ Envío de correos
│   └── CitacionService.java ..... Lógica de negocio
├── controller/
│   └── CitacionController.java .. REST API
└── dto/
    └── CitacionRequestDto.java .. DTOs

Documentation/
└── Citacion_API.md ............ Documentación completa

pom.xml .......................... spring-boot-starter-mail
application.properties ........... Configuración SMTP
```

---

## ✅ COMPILACIÓN

```
BUILD SUCCESS ✅
Total time: 5.8s
Archivos compilados: 74 archivos Java
```

---

## 🚀 PRÓXIMAS FUNCIONALIDADES (OPCIONAL)

- [ ] Confirmación de asistencia por email
- [ ] Recordatorio 1 hora antes
- [ ] Integración con Google Calendar
- [ ] Notificaciones push
- [ ] Reporte de asistencia
- [ ] Reprogramación de citaciones

---

## 📞 SOPORTE

Para más detalles, ver:
- `Documentation/Citacion_API.md` - API completa
- `CITACION_IMPLEMENTACION.md` - Detalles técnicos

---

**Estado:** ✅ LISTO PARA USAR
**Compilación:** ✅ EXITOSA
**Permisos:** ✅ CONFIGURADOS
**Emails:** ⚙️ REQUIERE CONFIGURACIÓN SMTP
