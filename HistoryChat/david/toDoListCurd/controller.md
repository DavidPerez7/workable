# ToDoList: Cómo crear un Controller en Spring Boot

## Nota sobre comentarios en el Controller
- **Los únicos comentarios permitidos en los controllers deben ser similares a los del ejemplo de NotificacionController adjunto:**
  - Solo comentarios de documentación arriba de cada endpoint (método), con el nombre del metodo crud.
  - No se deben agregar comentarios dentro de la lógica interna de los métodos (por ejemplo, no comentar cada línea de código dentro del método).
  - Ejemplo correcto:
```java
// READ
@GetMapping("/usuario-leida/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) { ... }
```
  - Ejemplo incorrecto:
```java
@GetMapping("/usuario-leida/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) {
    // Se obtiene el usuario por id
    // Se filtran las notificaciones por leída
    ...
}
```
- Esto mantiene el código limpio y la documentación clara para cada endpoint.

## 1. Revisa el Service de la entidad
- Identifica los métodos CRUD y métodos adicionales disponibles en el Service.
- Anota qué endpoints necesitas (crear, leer, actualizar, eliminar, búsquedas personalizadas, etc).
- Ejemplo: Si el service tiene `getByUsuarioAndLeida`, planea un endpoint tipo `/usuario-leida/{usuarioId}`.

## 2. Define la ruta base del Controller
- Usa `@RestController` para indicar que es un controller REST.
- Usa `@RequestMapping("/api/entidad")` para definir la ruta base de la API.

## 3. Inyecta el Service correspondiente
- Usa `@Autowired` para inyectar el Service de la entidad.
- Ejemplo:
```java
@Autowired
private NotificacionService notificacionService;
```

## 4. Crea los endpoints básicos
- **POST** para crear: `@PostMapping` y recibe el objeto con `@RequestBody` y `@Valid`.
- **GET** para leer:
  - Por id: `@GetMapping("/{id}")` con `@PathVariable`.
  - Listar todos o por filtros: `@GetMapping` o `@GetMapping("/usuario/{usuarioId}")`.
  - Por campos específicos: `@GetMapping("/titulo/{titulo}")`.
- **PUT** para actualizar: `@PutMapping("/{id}")` con `@PathVariable` y `@RequestBody`.
- **DELETE** para eliminar: `@DeleteMapping("/{id}")` con `@PathVariable`.

## 5. Define los parámetros de entrada
- Usa `@RequestBody` para recibir objetos completos (crear/actualizar).
- Usa `@PathVariable` para parámetros en la URL (id, usuarioId, etc).
- Usa `@RequestParam` para filtros o parámetros opcionales (por ejemplo, `leida`, `tipo`).
- Ejemplo:
```java
@GetMapping("/usuario-leida/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) { ... }
```

## 6. Maneja las respuestas
- Usa `ResponseEntity` para controlar el código de respuesta y el cuerpo.
- Devuelve el objeto creado/actualizado o un mensaje de éxito.
- Para eliminaciones, devuelve `ResponseEntity.noContent().build()`.
- Ejemplo:
```java
return ResponseEntity.ok(notificacionService.create(request));
```

## 7. Valida la entrada
- Usa `@Valid` en los parámetros de entrada para activar validaciones de Bean Validation.
- Maneja excepciones con controladores globales si es necesario.

## 8. Agrega endpoints personalizados
- Si el Service tiene métodos adicionales (búsqueda por nombre, filtrado, etc), crea endpoints específicos para ellos.
- Ejemplo:
```java
@GetMapping("/usuario-tipo/{usuarioId}")
public ResponseEntity<List<Notificacion>> getByUsuarioTipo(@PathVariable Long usuarioId, @RequestParam Notificacion.Tipo tipo) { ... }
```

## 9. Documenta los endpoints
- Agrega comentarios o usa Swagger/OpenAPI para documentar cada endpoint.
- Ejemplo de comentario:
```java
// Obtiene notificaciones por usuario y estado de lectura
```

## 10. Prueba el Controller
- Usa Postman, Swagger UI o tests automáticos para verificar que los endpoints funcionan correctamente.
- Prueba casos de éxito y de error (por ejemplo, id inexistente, validaciones fallidas).

---

**Resumen:**
1. Revisa el Service y define los endpoints necesarios.
2. Crea el Controller con la ruta base.
3. Inyecta el Service.
4. Implementa los endpoints CRUD y personalizados.
5. Usa correctamente `@PathVariable`, `@RequestParam`, `@RequestBody` y `@Valid`.
6. Maneja las respuestas con `ResponseEntity`.
7. Valida y documenta.
8. Prueba todo.

Este flujo sirve para cualquier entidad: Usuario, Empresa, Oferta, etc. Repite el patrón y adapta según la lógica de tu Service y los endpoints que necesites.