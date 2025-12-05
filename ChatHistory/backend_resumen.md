# Resumen completo del Backend (basado en código)

Este documento resume, de forma detallada y basada en el código fuente actual, el funcionamiento del backend de la aplicación Workable.

**Ubicación principal del backend:** `backend/`

**Archivos clave referenciados:**
- `src/main/java/com/workable_sb/workable/controller/CitacionController.java`
- `src/main/java/com/workable_sb/workable/service/CitacionService.java`
- `src/main/java/com/workable_sb/workable/repository/CitacionRepo.java`
- `src/main/java/com/workable_sb/workable/service/EmailService.java`
- `src/main/java/com/workable_sb/workable/service/NotificacionService.java`
- `src/main/java/com/workable_sb/workable/security/SecurityConfig.java`
- Modelos: `src/main/java/com/workable_sb/workable/models/Citacion.java`, `Usuario.java`

---

**Resumen general:**

- El backend está organizado por capas clásicas: *controllers* (REST), *services* (lógica de negocio), *repositories* (JPA) y *models* (entidades JPA).
- Autenticación/Autorización: JWT + Spring Security. Las reglas de acceso principales están en `SecurityConfig` y además hay `@PreAuthorize` en controladores para comprobaciones por método.
- El módulo de citaciones (entrevistas) incluye creación (individual y masiva), envío (email), notificaciones internas y gestión de estados (PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA).

---

**Seguridad y roles (según código):**

- Roles definidos en código: `Usuario.Rol` = `ASPIRANTE`, `RECLUTADOR`, `ADMIN`, `ADSO` (archivo `Usuario.java`).
- `SecurityConfig` configura rutas públicas y permisos por HTTP method y path. Ejemplos relevantes:
  - Rutas públicas: `/api/auth/**`, `GET /api/oferta/**`, `GET /api/empresa/**`, `GET /api/municipio/**`, `GET /api/habilidades/**`.
  - Gestión de empresas/ofertas: `POST/PUT/DELETE /api/empresa` y `POST/PUT/DELETE /api/oferta` requieren `RECLUTADOR` o `ADMIN`.
  - Postulaciones: creación por `ASPIRANTE`, cambios por `RECLUTADOR`/`ADMIN` según endpoint.
  - Notificaciones requieren autenticación (`/api/notificacion/**`).
  - Citaciones: la configuración permite acceso en `SecurityConfig` a `/api/citacion/**` para `ADMIN`, `RECLUTADOR`, `ASPIRANTE`, pero métodos concretos también usan `@PreAuthorize` en `CitacionController`.

---

**Entidad Citacion (modelo) — `Citacion.java`:**

- Campos principales:
  - `id` (Long)
  - `postulacion` (ManyToOne -> `Postulacion`) — relación obligatoria
  - `reclutador` (ManyToOne -> `Usuario`) — puede ser null
  - `fechaCitacion` (LocalDate), `hora` (String), `linkMeet` (String)
  - `detallesCitacion` (String), `observaciones` (String)
  - `estado` (Enum: `PENDIENTE`, `CONFIRMADA`, `ASISTIO`, `NO_ASISTIO`, `CANCELADA`)
  - `fechaEnvio`, `fechaCreacion`, `mensajeEnviado` (boolean), `isActive` (soft delete)

- `@PrePersist` inicializa `fechaCreacion`, `isActive`, `estado` y `mensajeEnviado` si son nulos.

---

**Endpoints principales de Citacion (controlador):**

- `POST /api/citacion` — crear citación individual
  - Parámetros (query): `postulacionId`, `reclutadorId`, `fechaCitacion`, `hora`, `linkMeet`, `detalles` (opc), `usuarioIdActual`.
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`
  - Lógica: valida existencia de postulacion/reclutador, valida rol y ownership del usuario actual, crea la entidad y la guarda.

- `POST /api/citacion/multiples` — crear y notificar múltiples citaciones
  - Parámetros: `postulacionIds` (lista), `reclutadorId`, `fechaCitacion`, `hora`, `linkMeet`, `detalles`, `usuarioIdActual`.
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`
  - Lógica: itera postulación por postulación, crea citaciones, intenta enviar emails (si `EmailService` está presente), marca `mensajeEnviado` y crea notificaciones internas.

- `GET /api/citacion/{id}` — obtener una citación
  - `@PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")`
  - Validación en service: `ASPIRANTE` solo ver sus propias citaciones; `RECLUTADOR` solo sus citaciones; `ADMIN` todo.

- `GET /api/citacion/reclutador/{reclutadorId}` — list de reclutador
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`
  - Usa `CitacionRepo.findByReclutadorIdOrderByFechaCitacionDesc`

- `GET /api/citacion/aspirante/{usuarioId}` — list del aspirante
  - `@PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")`
  - Service valida ownership para `ASPIRANTE`.

- `GET /api/citacion/oferta/{ofertaId}` — list por oferta (solo RECLUTADOR/ADMIN)

- `POST /api/citacion/{id}/enviar-whatsapp` — alias que en código llama al envío por email
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`
  - Implementación actual: `enviarCitacionPorWhatsApp` delega a `enviarCitacionPorEmail`.

- `PUT /api/citacion/{id}/estado` — cambiar estado
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`
  - Solo el reclutador dueño o admin puede cambiar estado.

- `DELETE /api/citacion/{id}` — soft delete (`isActive=false`)
  - `@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")`

---

**Lógica de negocio (CitacionService): puntos clave**

- Validaciones de ownership y rol: antes de crear/enviar/consultar/cambiar estado/eliminar se comprueba que `usuarioIdActual` corresponde a un usuario existente y que tiene el rol adecuado (RECLUTADOR o ADMIN para crear/enviar; aspirante sólo lee las suyas).
- Al crear una citación se inicializan `fechaEnvio`, `estado = PENDIENTE` y `mensajeEnviado = false`.
- Envío de notificaciones:
  - `enviarCitacionPorEmail(...)` prepara datos y llama a `EmailService.enviarCitacionEmail` si `JavaMailSender` está presente.
  - Después de enviar, marca `mensajeEnviado = true`, guarda la citación y crea una notificación en la app con `NotificacionService.crearAlertaCitacion(...)`.
  - El método legado `enviarCitacionPorWhatsApp` actualmente apunta al envío por email (compatibilidad).
- En las operaciones masivas, el servicio captura errores por cada postulación y devuelve resumen con `citacionesCreadas`, `notificacionesEnviadas` y `errores`.

---

**Repositorios relevantes (ej. `CitacionRepo`) — métodos expuestos**

- `findByPostulacionId(Long)`
- `findByReclutadorId(Long)`
- `findByReclutadorIdOrderByFechaCitacionDesc(Long)`
- `findByPostulacionOfertaId(Long)`
- `findByEstado(Estado)`
- `findByPostulacionUsuarioId(Long)`
- `findByPostulacionIdAndEstadoNot(Long, Estado)`

Estos métodos son usados por el servicio para consultas filtradas y listas ordenadas.

---

**Email y notificaciones (implementación actual):**

- `EmailService` encapsula envío de correos mediante `JavaMailSender`. Si `mailSender` no está configurado el servicio solo loguea y no lanza fallo irreparable (permite pruebas sin SMTP).
- Plantillas HTML listas en código para: citación, notificación, bienvenida, confirmación de postulación y cambio de estado.
- `NotificacionService` gestiona la creación de notificaciones internas y cuenta/no-leído, y tiene helpers para crear alertas específicas de citación / cancelación.

---

**Comportamiento de errores y respuestas HTTP**

- Los controladores capturan `RuntimeException` y devuelven `403` para problemas de permisos / validaciones y `500` para errores no esperados.
- Para validaciones de existencia (postulación, reclutador, usuario) el servicio lanza `RuntimeException("... no encontrada")` y el controlador lo mapea a respuesta con error.

---

**Notas de integración y configuración**

- Variables necesarias para email (si se desea enviar correos reales):
  - `spring.mail.host`, `spring.mail.port`, `spring.mail.username`, `spring.mail.password` (ver `application.properties`)
- Para llamadas desde frontend o Postman incluir `Authorization: Bearer {token}` después de login (`/api/auth/login`).
- Para la mayoría de endpoints se pasa `usuarioIdActual` como query param para que los servicios verifiquen ownership (patrón usado ampliamente en el código).

---

**Dónde revisar para cambios o debugging rápido:**

- Reglas de seguridad globales: `src/main/java/com/workable_sb/workable/security/SecurityConfig.java`
- Flujo de citaciones: `CitacionController.java` → `CitacionService.java` → `CitacionRepo.java` + `EmailService.java` + `NotificacionService.java`
- Modelos relacionados (para columnas/constraints): `models/Citacion.java`, `models/Postulacion.java`, `models/Usuario.java`.

---

**Cómo ejecutar localmente (rápido):**

1. Exportar variables de entorno de mail si se quiere enviar correos reales:

```
set MAIL_USERNAME=tu-email@gmail.com
set MAIL_PASSWORD=tu-app-password
```

2. Desde la carpeta `backend` ejecutar:

```
mvn clean package
mvn spring-boot:run
```

3. Probar endpoints con Postman o curl. Para endpoints protegidos obtén token con `POST /api/auth/login`.

---

Si quieres, puedo:
- Generar ejemplos concretos de curl para cada endpoint de citación según el código.
- Añadir una sección de pruebas rápidas con Postman export (basado en los controladores).
- Revisar controladores adicionales (Feedback, Estudio, HojaVida) para agregar observaciones de seguridad específicas.

Archivo creado: `ChatHistory/backend_resumen.md` (basado en código). Si quieres que lo adapte más (más o menos detalle), dime qué priorizar.
