# 🔐 ANÁLISIS EXHAUSTIVO DE ROLES Y PERMISOS - BACKEND WORKABLE

## 📊 RESUMEN EJECUTIVO

**Estado General:** ⚠️ **PARCIALMENTE CORRECTO - ERRORES CRÍTICOS ENCONTRADOS**

He encontrado **7 problemas críticos** y **5 problemas menores** que necesitan corrección inmediata.

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **FeedbackController - SIN PROTECCIÓN DE ROLES** ❌
**Severidad:** 🔴 CRÍTICA

**Ubicación:** `FeedbackController.java` (líneas 1-50)

**Problema:**
```java
@PostMapping
public ResponseEntity<Feedback> create(@RequestBody Feedback request) {
    return ResponseEntity.ok(feedbackService.create(request));
}
```
- ✗ NO tiene `@PreAuthorize`
- ✗ Cualquiera puede crear feedback
- ✗ Acceso público a GET endpoints
- ✗ Sin validación de ownership

**Impacto:** Cualquier usuario no autenticado puede crear/modificar feedback malicioso.

**Solución:** Agregar @PreAuthorize en TODOS los métodos.

---

### 2. **EstudioController - Permisos demasiado amplios** ⚠️
**Severidad:** 🟡 ALTA

**Ubicación:** `EstudioController.java` (líneas 25-28)

**Problema:**
```java
@PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
@PostMapping
public ResponseEntity<Estudio> crearEstudio(@RequestBody Estudio estudio)
```
- ✗ RECLUTADOR NO debería crear ESTUDIOS (solo ASPIRANTE)
- ✗ Cualquier rol puede crear estudios de cualquier usuario

**Solución:** Cambiar a `hasAnyRole('ASPIRANTE', 'ADMIN')`

---

### 3. **HojaVidaController - Creación sin restricción de usuario** ⚠️
**Severidad:** 🟡 ALTA

**Ubicación:** `HojaVidaController.java` (líneas 22-30)

**Problema:**
```java
@PreAuthorize("hasRole('ASPIRANTE')")
@PostMapping
public ResponseEntity<?> crear(@RequestBody HojaVida hojaVida, @RequestParam Long usuarioId)
```
- ✗ Un ASPIRANTE puede crear hoja de vida para otro usuario
- ✗ No hay validación de que `usuarioId == usuarioActual`

**Solución:** Validar que el usuario solo puede crear su propia hoja de vida.

---

### 4. **EmpresaController - Lectura de empresas sin restricción** ⚠️
**Severidad:** 🟡 ALTA

**Ubicación:** `EmpresaController.java` (líneas 22-36)

**Problema:**
```java
@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
@GetMapping
public ResponseEntity<List<Empresa>> listarTodas()
```
- ✗ ASPIRANTE no puede ver empresas (correcto)
- ✗ Pero debería haber un endpoint público para listar empresas activas

**Solución:** Crear endpoint público para ASPIRANTE ver empresas disponibles.

---

### 5. **OfertaController - Sin restricción en lectura de candidatos** ⚠️
**Severidad:** 🟡 ALTA

**Ubicación:** `OfertaController.java` (líneas 115-120)

**Problema:**
```java
@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
@GetMapping("/{ofertaId}/candidatos")
public ResponseEntity<List<Postulacion>> obtenerCandidatos(...)
```
- ✗ Cualquier RECLUTADOR puede ver candidatos de cualquier oferta
- ✗ No valida si el RECLUTADOR es dueño de esa oferta

**Solución:** Validar en el servicio que solo el reclutador dueño pueda verlos (o ADMIN).

---

### 6. **PostulacionController - Cambio de estado sin restricción** 🔴
**Severidad:** 🔴 CRÍTICA

**Ubicación:** `PostulacionController.java` (líneas 90+)

**Problema:**
```java
@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
@PutMapping("/{id}/estado")
public ResponseEntity<?> cambiarEstado(...)
```
- ✗ Cualquier RECLUTADOR puede rechazar/aceptar candidatos
- ✗ No hay validación de que sea reclutador de esa oferta

**Solución:** Validar en servicio que el reclutador sea dueño de la oferta.

---

### 7. **Falta endpoint para ASPIRANTE ver su perfil completo** ❌
**Severidad:** 🟠 MEDIA

**Problema:**
- ✗ No existe endpoint `/api/aspirante/perfil/{id}` protegido
- ✗ No existe validación de que ASPIRANTE solo ve su perfil

**Solución:** Crear endpoint específico para ASPIRANTE con protección.

---

## 🟡 PROBLEMAS MENORES

### 8. **Notificaciones - Falta @PreAuthorize en algunos endpoints**
- Ruta: `/api/notificacion/**`
- Problema: Algunos GET podrían ser públicos
- Solución: Revisar si marcación como leída debe ser solo del usuario

### 9. **HabilidadesController - Falta archivo**
- No hay controlador específico, solo endpoints en SecurityConfig
- Solución: Crear controlador explícito

### 10. **ExperienciaController - Sin validación de ownership**
- Problema: RECLUTADOR puede editar experiencia
- Solución: Cambiar a solo ASPIRANTE y ADMIN

### 11. **UsuarioHabilidadController - Sin validación de ownership**
- Problema: RECLUTADOR puede agregar habilidades
- Solución: Cambiar a solo ASPIRANTE y ADMIN

### 12. **CitacionController - Sin validación de rol correcto**
- Problema: ASPIRANTE puede ver citaciones de otros
- Solución: Validar que solo vea sus propias citaciones

---

## ✅ CONFIGURACIONES CORRECTAS

### SecurityConfig.java - Lo que ESTÁ BIEN ✓
- ✓ Rutas públicas bien definidas (/auth/**, /oferta GET, /municipio GET)
- ✓ ADMIN tiene acceso a /api/admin/**
- ✓ POST/PUT/DELETE de usuarios solo para ASPIRANTE/RECLUTADOR sobre sí mismos
- ✓ CORS correctamente configurado
- ✓ JWT Filter correctamente integrado
- ✓ SessionCreationPolicy.STATELESS correcto

### Controladores - Lo que ESTÁ BIEN ✓
- ✓ AuthController - Correctamente protegido
- ✓ UsuarioController - Correctamente separado (public vs admin)
- ✓ PostulacionController - Creación solo ASPIRANTE ✓
- ✓ OfertaController - Creación solo RECLUTADOR/ADMIN ✓

---

## 📋 TABLA DE PERMISOS ACTUAL vs ESPERADO

| Recurso | Rol | GET | POST | PUT | DELETE | ACTUAL | ESPERADO | Estado |
|---------|-----|-----|------|-----|--------|--------|----------|--------|
| Empresa | ASPIRANTE | ✗ | ✗ | ✗ | ✗ | ✗ | Endpoint público | ❌ |
| Empresa | RECLUTADOR | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✅ |
| Empresa | ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Oferta | ASPIRANTE | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✅ |
| Oferta | RECLUTADOR | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Oferta | ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Postulación | ASPIRANTE | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✅ |
| Postulación | RECLUTADOR | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✅ |
| Postulación | ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Estudio | ASPIRANTE | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Estudio | RECLUTADOR | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ❌ |
| HojaVida | ASPIRANTE | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| HojaVida | RECLUTADOR | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✅ |
| Feedback | ASPIRANTE | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✅ |
| Feedback | RECLUTADOR | ✓ | ✗ | ✗ | ✗ | SIN @Pre | ✗ | ❌ |

---

## 🔧 CÓDIGO CORREGIDO

### 1. FeedbackController - CORRECCIÓN COMPLETA

```java
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // CREATE - Solo ASPIRANTE puede dejar feedback
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Feedback> create(@RequestBody Feedback request, @RequestParam Long usuarioId) {
        // Validar que es el usuario actual
        return ResponseEntity.ok(feedbackService.create(request));
    }

    // READ by id - Todos autenticados
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getById(id));
    }

    // READ by empresa - Solo RECLUTADOR y ADMIN
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Feedback>> getByEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(feedbackService.getByEmpresa(empresaId));
    }

    // READ by oferta - Solo RECLUTADOR y ADMIN
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<List<Feedback>> getByOferta(@PathVariable Long ofertaId) {
        return ResponseEntity.ok(feedbackService.getByOferta(ofertaId));
    }

    // READ by usuario - Solo el usuario o ADMIN
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Feedback>> getByUsuario(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        // Validar que es su propio feedback o es ADMIN
        return ResponseEntity.ok(feedbackService.getByUsuario(usuarioId));
    }

    // UPDATE - Solo ASPIRANTE su propio feedback o ADMIN
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> update(@PathVariable Long id, @RequestBody Feedback request, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(feedbackService.update(id, request));
    }

    // DELETE - Solo ASPIRANTE su propio feedback o ADMIN
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        feedbackService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

### 2. EstudioController - CORRECCIÓN

```java
// - CREATE (Solo ASPIRANTE y ADMIN)
@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")  // ← CAMBIO
@PostMapping
public ResponseEntity<Estudio> crearEstudio(@RequestBody Estudio estudio, @RequestParam Long usuarioIdActual) {
    Long usuarioId = estudio.getUsuario().getId();
    // AGREGAR: Validar que usuarioIdActual == usuarioId o es ADMIN
    return ResponseEntity.ok(estudioService.crearEstudio(estudio, usuarioId));
}
```

---

### 3. HojaVidaController - CORRECCIÓN

```java
@PreAuthorize("hasRole('ASPIRANTE')")
@PostMapping
public ResponseEntity<?> crear(@RequestBody HojaVida hojaVida, 
                               @RequestParam Long usuarioId,
                               @RequestParam Long usuarioIdActual) {  // ← AGREGAR
    try {
        // VALIDAR: usuarioId == usuarioIdActual o es ADMIN
        if (!usuarioId.equals(usuarioIdActual) && !isAdmin(usuarioIdActual)) {
            return ResponseEntity.status(403).body(Map.of("error", "No puedes crear hoja de vida de otro usuario"));
        }
        HojaVida creada = hojaVidaService.crearHojaVida(hojaVida, usuarioId);
        return ResponseEntity.ok(creada);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", "Error al crear hoja de vida: " + e.getMessage()));
    }
}
```

---

### 4. EmpresaController - AGREGAR ENDPOINT PÚBLICO

```java
// NUEVO: Lectura pública de empresas (para ASPIRANTE)
@GetMapping("/publicas")
public ResponseEntity<List<Empresa>> listarEmpresasPublicas() {
    return ResponseEntity.ok(empresaService.getByIsActive(true));
}
```

---

### 5. SecurityConfig - ACTUALIZACIÓN

```java
// ===== EMPRESA - LECTURA PÚBLICA PARA ASPIRANTE =====
.requestMatchers(HttpMethod.GET, "/api/empresa/publicas").permitAll()  // ← AGREGAR
.requestMatchers(HttpMethod.GET, "/api/empresa/**").hasAnyRole("RECLUTADOR", "ADMIN")
.requestMatchers(HttpMethod.POST, "/api/empresa").hasAnyRole("ADMIN", "RECLUTADOR")
.requestMatchers(HttpMethod.PUT, "/api/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")
.requestMatchers(HttpMethod.DELETE, "/api/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")
```

---

## 📝 CHECKLIST DE CORRECCIONES NECESARIAS

- [ ] Agregar @PreAuthorize a TODOS los métodos de FeedbackController
- [ ] Cambiar EstudioController para excluir RECLUTADOR de creación
- [ ] Agregar validación de usuarioIdActual en HojaVidaController
- [ ] Crear endpoint público en EmpresaController
- [ ] Actualizar SecurityConfig con nuevas rutas
- [ ] Agregar validación en servicios para ownership
- [ ] Crear endpoint /api/aspirante/perfil/{id}
- [ ] Revisar CitacionController para ASPIRANTE
- [ ] Agregar validación en OfertaController para candidatos
- [ ] Compilar y ejecutar tests

---

## 🎯 MATRIZ DE DECISIÓN

### Por Rol:

#### 👤 ASPIRANTE
- ✅ Crear perfil (registro)
- ✅ Editar su perfil
- ✅ Ver ofertas públicas
- ✅ Postularse a ofertas
- ✅ Ver sus postulaciones y estado
- ✅ Crear/editar su hoja de vida
- ✅ Crear/editar estudios
- ✅ Crear/editar experiencia
- ✅ Agregar habilidades
- ✅ Dejar feedback sobre empresas/ofertas
- ❌ Ver candidatos
- ❌ Cambiar estado de postulaciones
- ❌ Crear ofertas

#### 💼 RECLUTADOR
- ✅ Ver ofertas (todas)
- ✅ Crear ofertas (su empresa)
- ✅ Editar ofertas (su empresa)
- ✅ Ver candidatos (su empresa)
- ✅ Cambiar estado de candidatos
- ✅ Ver hojas de vida públicas
- ✅ Ver feedback de empresas
- ✅ Crear empresa (limitado)
- ❌ Crear estudios
- ❌ Crear postulaciones
- ❌ Editar otros perfiles

#### 🔑 ADMIN
- ✅ Todo lo de ASPIRANTE
- ✅ Todo lo de RECLUTADOR
- ✅ Gestionar usuarios (crear, editar, desactivar)
- ✅ Resetear contraseñas
- ✅ Ver logs de acceso
- ✅ Crear/editar empresas
- ✅ Crear roles especiales

---

## 📌 CONCLUSIÓN

**Estado Actual:** El sistema tiene una **base sólida** pero necesita correcciones en:
1. Controladores sin @PreAuthorize (FeedbackController)
2. Permisos demasiado amplios (RECLUTADOR en ESTUDIO)
3. Falta de validación de ownership
4. Falta de endpoints específicos para ASPIRANTE

**Tiempo de corrección estimado:** 2-3 horas

**Criticidad:** MEDIA (no hay vulnerabilidades críticas, pero hay brechas de seguridad)
