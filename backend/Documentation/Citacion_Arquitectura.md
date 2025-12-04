# ARQUITECTURA DEL SISTEMA DE CITACIONES

## 1. DIAGRAMA DE FLUJO

```
┌─────────────────────────────────────────────────────────────┐
│                   RECLUTADOR                                │
│  (María - ID: 5, Rol: RECLUTADOR)                          │
└─────────────────────────────────────────────────────────────┘
                            │
                    GET /aspirantes
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                VE POSTULACIONES                             │
│  - Juan Pérez (ID: 3)                                       │
│  - Carlos López (ID: 4)                                     │
│  - Ana Martínez (ID: 6)                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                  POST /citacion/multiples
            (crea 3 citaciones con mismo link)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               SISTEMA DE CITACIONES                         │
│  CitacionService.enviarCitacionesMultiples()               │
│                                                              │
│  for (postulacion : lista) {                                │
│    → Crea Citacion                                          │
│    → Guarda en BD                                           │
│    → EmailService.enviarCorreoCitacion()                    │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Juan Pérez   │   │ Carlos López │   │ Ana Martínez │
│ juan@mail.com│   │carlos@mail.com   │ana@mail.com  │
└──────────────┘   └──────────────┘   └──────────────┘
     ✉️ Email           ✉️ Email          ✉️ Email
   Citación         Citación          Citación
   (HTML)            (HTML)            (HTML)
        │                   │                   │
        ↓                   ↓                   ↓
   Buzón Gmail        Buzón Gmail         Buzón Gmail
```

---

## 2. MODELO DE DATOS

### Entidad: Citacion

```sql
CREATE TABLE citacion (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    postulacion_id BIGINT NOT NULL,
    reclutador_id BIGINT NOT NULL,
    fecha_citacion DATE NOT NULL,
    hora VARCHAR(5) NOT NULL,
    link_meet VARCHAR(1000) NOT NULL,
    detalles_citacion VARCHAR(1000),
    estado ENUM('PENDIENTE','CONFIRMADA','ASISTIO','NO_ASISTIO','CANCELADA') NOT NULL,
    fecha_envio DATETIME NOT NULL,
    correo_enviado BOOLEAN NOT NULL,
    observaciones VARCHAR(500),
    fecha_creacion DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL,
    FOREIGN KEY (postulacion_id) REFERENCES postulacion(id) ON DELETE CASCADE,
    FOREIGN KEY (reclutador_id) REFERENCES usuario(id) ON DELETE SET NULL
);
```

### Relaciones

```
Citacion
├── postulacion_id → Postulacion (ManyToOne)
│   └── usuario_id → Usuario (Aspirante)
│   └── oferta_id → Oferta (Vacante)
│       └── empresa_id → Empresa
└── reclutador_id → Usuario (Reclutador)
```

---

## 3. CAPAS DE ARQUITECTURA

```
┌─────────────────────────────────────┐
│     REST CONTROLLER LAYER           │
│   (CitacionController)              │
│  - @PreAuthorize                    │
│  - @PostMapping, @GetMapping, etc   │
│  - Validación de entrada            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      SERVICE LAYER                  │
│  (CitacionService, EmailService)    │
│  - Lógica de negocio                │
│  - Validación de permisos           │
│  - Envío de correos                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    REPOSITORY LAYER                 │
│   (CitacionRepo)                    │
│  - Queries especializadas           │
│  - findBy* methods                  │
│  - Count methods                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      DATA ACCESS LAYER              │
│   (JpaRepository → Hibernate)       │
│  - SQL Generation                   │
│  - Connection Management            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       DATABASE (MySQL)              │
│   - Tabla citacion                  │
│   - Persistencia de datos           │
└─────────────────────────────────────┘
```

---

## 4. FLUJO DE CREACIÓN DE CITACIÓN MÚLTIPLE

```
REQUEST: POST /api/citacion/multiples
├── postulacionIds: [1, 2, 3]
├── reclutadorId: 5
├── fechaCitacion: 2025-12-15
├── hora: 10:00
├── linkMeet: https://meet.google.com/...
└── usuarioIdActual: 5

    │
    ↓ CitacionController.crearCitacionesMultiples()
    
    ├─ Validar que usuarioIdActual es RECLUTADOR/ADMIN
    └─ Llamar CitacionService.enviarCitacionesMultiples()

    │
    ↓ CitacionService.enviarCitacionesMultiples()
    
    ├─ Validar permisos del reclutador
    ├─ Para cada postulacionId:
    │  ├─ Obtener Postulacion
    │  ├─ Crear objeto Citacion
    │  ├─ Guardar en citacionRepo
    │  ├─ Obtener datos aspirante
    │  ├─ Llamar EmailService.enviarCorreoCitacion()
    │  ├─ Actualizar correoEnviado = true
    │  └─ Agregar a lista correosEnviados
    └─ Retornar {citacionesCreadas, correosEnviados, errores}

    │
    ↓ EmailService.enviarCorreoCitacion()
    
    ├─ Crear MimeMessage
    ├─ Construir HTML con plantilla
    ├─ Establecer from, to, subject
    ├─ mailSender.send(mensaje)
    └─ Log: Correo enviado a aspirante@email.com

    │
    ↓ RESPONSE 200 OK
    
    {
      "citacionesCreadas": 3,
      "correosEnviados": ["email1@", "email2@", "email3@"],
      "errores": [],
      "total": 3,
      "exitosas": 3
    }
```

---

## 5. VALIDACIONES DE SEGURIDAD

### A. Nivel Controlador (@PreAuthorize)
```java
@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
```
- Solo RECLUTADOR y ADMIN pueden acceder
- ASPIRANTE y ADSO rechazados

### B. Nivel Servicio
```java
// Validar que el usuario actual es reclutador/admin
if (usuarioActual.getRol() != Usuario.Rol.RECLUTADOR && 
    usuarioActual.getRol() != Usuario.Rol.ADMIN) {
    throw new RuntimeException("No tienes permisos");
}

// Si es reclutador, validar que sea el mismo
if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR && 
    !usuarioActual.getId().equals(reclutadorId)) {
    throw new RuntimeException("No puedes crear para otros");
}
```

### C. Validación de Datos
```java
// Validar existencia
if (postulacion == null) throw new RuntimeException("No encontrada");
if (reclutador == null) throw new RuntimeException("No existe");

// Validar estados
try {
    Estado estado = Estado.valueOf(nuevoEstado);
} catch (IllegalArgumentException) {
    throw new RuntimeException("Estado inválido");
}
```

---

## 6. MANEJO DE ERRORES

### Estructura de Respuesta de Error
```json
{
  "error": "Descripción del error"
}
```

### Códigos de Estado HTTP

| Código | Situación | Ejemplo |
|--------|-----------|---------|
| 200 | Éxito | Citación creada |
| 400 | Bad Request | Parámetros inválidos |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Postulación no existe |
| 500 | Error Interno | Fallo SMTP |

### Ejemplos

```java
// 200 - OK
return ResponseEntity.ok(citacion);

// 400 - Bad Request
return ResponseEntity.badRequest()
    .body(Map.of("error", "Estado inválido"));

// 403 - Forbidden
return ResponseEntity.status(403)
    .body(Map.of("error", "No tienes permisos"));

// 404 - Not Found
return ResponseEntity.status(404)
    .body(Map.of("error", "Citación no encontrada"));

// 500 - Internal Server Error
return ResponseEntity.status(500)
    .body(Map.of("error", "Error al enviar correo"));
```

---

## 7. CONFIGURACIÓN DE EMAIL

### SMTP Configuration
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

### Autenticación Gmail
1. Activar 2FA en cuenta Google
2. Generar contraseña de aplicación (16 caracteres)
3. Guardar en variables de entorno

---

## 8. TRANSACCIONES Y CONSISTENCIA

```java
@Service
@Transactional  // ← Importante: todas las operaciones en BD
public class CitacionService {
    
    @Transactional
    public Map<String, Object> enviarCitacionesMultiples(...) {
        // Si algo falla, TODO se revierte (rollback)
        
        for (Long postulacionId : postulacionIds) {
            try {
                // 1. Crear citación
                Citacion citacion = new Citacion();
                citacion.setPostulacion(postulacion);
                // ... más configuración ...
                citacionRepo.save(citacion); // ← BD transaccional
                
                // 2. Enviar correo
                emailService.enviarCorreoCitacion(...); // ← Fuera de transacción
                
                // 3. Actualizar estado
                citacion.setCorreoEnviado(true);
                citacionRepo.save(citacion); // ← BD transaccional
                
            } catch (Exception e) {
                errores.add(...); // ← Continuar con siguientes
            }
        }
        
        return respuesta;
    }
}
```

---

## 9. CASCADA EN RELACIONES

### Eliminación de Postulación
```java
// CitacionRepo
@OnDelete(action = OnDeleteAction.CASCADE)
private Postulacion postulacion;
// → Si se elimina postulación, se elimina citación

@OnDelete(action = OnDeleteAction.SET_NULL)
private Usuario reclutador;
// → Si se elimina reclutador, reclutador_id = NULL
```

---

## 10. PERFORMANCE Y OPTIMIZACIÓN

### Query Optimization
```java
// ✅ Bien: Especificada por orden
List<Citacion> findByReclutadorIdOrderByFechaCitacionDesc(Long id);

// ❌ Menos eficiente: Obtiene todas y luego ordena
List<Citacion> findByReclutadorId(Long id);
```

### Lazy Loading vs Eager Loading
```java
@ManyToOne(fetch = FetchType.EAGER)  // ← Carga junto con Citacion
private Postulacion postulacion;

@ManyToOne(fetch = FetchType.LAZY)   // ← Se carga solo si se accede
private Usuario reclutador;
```

---

## 11. SEGURIDAD DE DATOS

### Campos Sensibles
```java
// ❌ NO se expone password
public class Usuario {
    private String password; // @JsonIgnore en DTO
}

// ✅ DTO limpio sin datos sensibles
public class UsuarioBasicoDto {
    private Long id;
    private String nombre;
    private String email;
    // Sin password, sin tokens
}
```

### Soft Delete
```java
// No se elimina de BD
citacion.setIsActive(false);
citacionRepo.save(citacion);

// Se mantiene historial para auditoría
```

---

## 12. LOGGING

```java
@Slf4j
public class EmailService {
    
    public void enviarCorreoCitacion(...) {
        try {
            // ... envío ...
            log.info("Correo enviado a: " + destinatario);
        } catch (Exception e) {
            log.error("Error al enviar correo: " + e.getMessage());
            throw new RuntimeException(...);
        }
    }
}
```

---

## 13. TESTING (Futuro)

### Test Unitarios Necesarios
```java
@Test
public void testCrearCitacion_ValueLo_ExitidaExitosamente() {
    // Given
    Long postulacionId = 1L;
    Long reclutadorId = 5L;
    
    // When
    Citacion resultado = citacionService.crearCitacion(...);
    
    // Then
    assertEquals(Estado.PENDIENTE, resultado.getEstado());
    assertTrue(resultado.getIsActive());
}

@Test
public void testEnviarCitacion_SinPermisos_ThrowsException() {
    // Usuario ASPIRANTE intentando crear
    assertThrows(RuntimeException.class, 
        () -> citacionService.crearCitacion(...));
}
```

---

## 14. INTEGRACIÓN CON OTROS SISTEMAS

### Flujo Completo del Negocio
```
1. Aspirante se postula
   → POST /api/postulacion
   → Crea Postulacion (PENDIENTE)

2. Reclutador revisa aspirantes
   → GET /api/postulacion/oferta/{id}/aspirantes
   → Ve lista con educación, experiencia, habilidades

3. Reclutador cita candidatos
   → POST /api/citacion/multiples
   → Crea Citacion (PENDIENTE)
   → Envía Email

4. Aspirante recibe citación
   → GET /api/citacion/aspirante/{id}
   → Ve detalles de cita

5. Reclutador actualiza resultado
   → PUT /api/citacion/{id}/estado
   → Estado: ASISTIO / NO_ASISTIO
   → Posible: UPDATE /api/postulacion/{id}/estado
     Estado: ACEPTADO / RECHAZADO
```

---

## RESUMEN

✅ Arquitectura escalable en 3 capas
✅ Seguridad en múltiples niveles
✅ Transacciones ACID
✅ Manejo de errores robusto
✅ Integración con SMTP
✅ Soft delete para auditoría
✅ Logging completo
✅ Ready para testing
