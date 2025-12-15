# Instrucciones para Crear Controladores

## Estructura Obligatoria de Controladores

Todos los controladores en la aplicación deben seguir esta estructura exacta, sin excepciones. Esto asegura consistencia, simplicidad y mantenibilidad.

### Métodos Obligatorios (Exactamente 5)

Cada controlador debe implementar **exactamente** estos 5 métodos, ni uno más ni uno menos:

1. **create** - Crear una nueva entidad
2. **getAll** - Obtener todas las entidades
3. **getById** - Obtener una entidad por ID
4. **update** - Actualizar una entidad existente
5. **delete** - Eliminar una entidad

### Parámetros de los Métodos

- **Siempre recibir el modelo de la entidad directamente** como parámetro en los métodos que lo requieran (create, update).
- No usar DTOs adicionales a menos que sea estrictamente necesario para casos complejos.
- Mantener la simplicidad: el controlador delega la lógica de negocio al servicio correspondiente.

### Prioridad: Simplicidad

- El controlador debe ser lo más simple posible.
- No incluir lógica de negocio en el controlador; delegar al servicio.
- Usar validaciones básicas solo si es necesario, pero preferir validaciones en el servicio o modelo.
- Mantener el código limpio y legible.

### Ejemplo de Estructura

```java
@RestController
@RequestMapping("/api/entidad")
public class EntidadController {

    @Autowired
    private EntidadService entidadService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Entidad entidad) {
        // Lógica simple de creación
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        // Obtener todas las entidades
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        // Obtener por ID
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Entidad entidad) {
        // Actualizar entidad
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Eliminar entidad
    }
}
```

### Notas Importantes

- Si se requiere autenticación, usar `@AuthenticationPrincipal` para obtener el usuario actual.
- Manejar errores de manera consistente (IllegalStateException, RuntimeException, etc.).
- Usar ResponseEntity para respuestas HTTP apropiadas.
- No agregar endpoints adicionales sin aprobación explícita.
