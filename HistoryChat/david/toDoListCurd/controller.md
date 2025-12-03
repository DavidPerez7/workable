
# ToDoList: Cómo crear un Controller en Spring Boot (Ejemplo tipo NotificacionController)

## NOTA OBLIGATORIA PRINCIPAL
- **NO asumas que el controller está bien si ya tiene código dentro del archivo.**
- **Cuando el usuario adjunte esta documentación, DEBES hacer el controller desde 0.**
- **SIEMPRE lee el archivo del Service ANTES de escribir cualquier código del controller.**

---

## 1. (OBLIGATORIO - PASO MÁS IMPORTANTE) Revisar el Service de la entidad

### ANTES DE ESCRIBIR CUALQUIER CÓDIGO:
1. **USA LA HERRAMIENTA read_file** para leer el archivo del Service completo.
2. **HAZ UNA LISTA ESCRITA** de TODOS los métodos públicos del Service.
3. **CUENTA cuántos métodos públicos tiene** el Service (ejemplo: "El service tiene 8 métodos públicos").
4. **PLANEA cada endpoint** antes de codificar:
   - Nombre del método del service → Ruta del endpoint
   - Parámetros del método → @PathVariable, @RequestParam, @RequestBody
   - Tipo de retorno → ResponseEntity<TipoRetorno>

### REGLA DE ORO:
- **Si el Service tiene 5 métodos públicos, el Controller DEBE tener 5 endpoints.**
- **Si el Service tiene 10 métodos públicos, el Controller DEBE tener 10 endpoints.**
- **NUNCA hagas menos endpoints que métodos públicos tiene el Service.**

### Ejemplo de lista antes de codificar:
```
Métodos del PostulacionService (8 métodos):
1. crearPostulacion(Long usuarioId, Long ofertaId) → POST /api/postulacion
2. obtenerPorId(Long id, Long usuarioIdActual) → GET /api/postulacion/{id}
3. listarPorOferta(Long ofertaId, Long usuarioIdActual) → GET /api/postulacion/oferta/{ofertaId}
4. listarPorUsuario(Long usuarioId, Long usuarioIdActual) → GET /api/postulacion/usuario/{usuarioId}
5. listarPorOfertaYEstado(...) → GET /api/postulacion/oferta/{ofertaId}/estado
6. listarPorUsuarioYEstado(...) → GET /api/postulacion/usuario/{usuarioId}/estado
7. yaSePostulo(Long usuarioId, Long ofertaId) → GET /api/postulacion/verificar
8. cambiarEstado(...) → PUT /api/postulacion/{id}/estado
9. eliminarPostulacion(...) → DELETE /api/postulacion/{id}
10. eliminarPostulacionFisica(...) → DELETE /api/postulacion/{id}/fisico
```

### ERRORES A EVITAR:
- ❌ NO asumas nombres de métodos genéricos como `create`, `getById`, `getAll`, `update`, `delete`.
- ❌ NO uses DTOs si el Service usa entidades directamente.
- ❌ NO hagas solo endpoints CRUD básicos si el Service tiene más métodos.
- ✅ USA los nombres EXACTOS de los métodos del Service.
- ✅ USA los tipos de parámetros EXACTOS del Service.

## 2. Crea la clase Controller
- Usa la anotación `@RestController`.
- Define la ruta base con `@RequestMapping("/api/entidad")` (cambia "entidad" por el nombre real, ej: "notificacion").

## 3. Inyecta el Service correspondiente
- Usa `@Autowired` para inyectar el Service de la entidad.
```java
@Autowired
private NotificacionService notificacionService;
```

## 4. Implementa los endpoints CRUD y personalizados 

### CREATE
```java
// CREATE
@PostMapping
public ResponseEntity<Notificacion> create(@Valid @RequestBody Notificacion request) {
  return ResponseEntity.ok(notificacionService.create(request));
}
```

### READ por id
```java
// READ
@GetMapping("/{id}")
public ResponseEntity<Optional<Notificacion>> getById(@PathVariable Long id) {
  return ResponseEntity.ok(notificacionService.getById(id));
}
```

### READ por campo específico
```java
@GetMapping("/titulo/{titulo}")
public ResponseEntity<Optional<Notificacion>> getByTitulo(@PathVariable String titulo) {
  return ResponseEntity.ok(notificacionService.getByTitulo(titulo));
}
```

### READ por usuario
```java
@GetMapping("/usuario/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioId(@PathVariable Long usuarioId) {
  return ResponseEntity.ok(notificacionService.getByUsuario(usuarioId));
}
```

### READ por usuario y leída
```java
@GetMapping("/usuario-leida/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) {
  return ResponseEntity.ok(notificacionService.getByUsuarioAndLeida(usuarioId, leida));
}
```

### READ por usuario y tipo
```java
@GetMapping("/usuario-tipo/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioTipo(@PathVariable Long usuarioId, @RequestParam Notificacion.Tipo tipo) {
  return ResponseEntity.ok(notificacionService.getByUsuarioAndTipo(usuarioId, tipo));
}
```

### READ por usuario ordenado por fecha desc
```java
@GetMapping("/usuario-fecha-desc/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioOrderByFechaDesc(@PathVariable Long usuarioId) {
  return ResponseEntity.ok(notificacionService.getByUsuarioOrderByFechaDesc(usuarioId));
}
```

### UPDATE
```java
// UPDATE
@PutMapping("/{id}")
public ResponseEntity<Notificacion> update(@PathVariable Long id, @Valid @RequestBody Notificacion request) {
  return ResponseEntity.ok(notificacionService.update(id, request));
}
```

### DELETE
```java
// DELETE
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
  notificacionService.delete(id);
  return ResponseEntity.noContent().build();
}
```

## 5. Reglas para comentarios en el Controller
- Solo se permite un comentario de documentación arriba de cada endpoint, indicando el tipo de operación (CREATE, READ, UPDATE, DELETE).
- No se permiten comentarios dentro de la lógica interna de los métodos.

## 6. Prueba el Controller
- Usa Postman, Swagger UI o tests automáticos para verificar que los endpoints funcionan correctamente.
- Prueba casos de éxito y de error (por ejemplo, id inexistente, validaciones fallidas).

---

**Resumen:**
1. Revisa el Service y define los endpoints necesarios.
2. Crea el Controller con la ruta base y anota cada endpoint como en el ejemplo.
3. Inyecta el Service.
4. Implementa los endpoints CRUD y personalizados siguiendo la estructura y comentarios del ejemplo.
5. Prueba todo.

Este flujo sirve para cualquier entidad: Usuario, Empresa, Oferta, etc. Repite el patrón y adapta según la lógica de tu Service y los endpoints que necesites.