# Instrucciones para Crear Servicios

## Estructura Obligatoria de Servicios

Todos los servicios en la aplicación deben seguir esta estructura exacta, manteniendo la simplicidad a menos que se requieran validaciones adicionales por lógica de negocio.

### Métodos Obligatorios (Exactamente 5)

Cada servicio debe implementar **exactamente** estos 5 métodos, ni uno más ni uno menos:

1. **create** - Crear una nueva entidad
2. **getById** - Obtener una entidad por ID
3. **getAll** - Obtener todas las entidades
4. **update** - Actualizar una entidad existente
5. **delete** - Eliminar una entidad

### Parámetros y Retorno

- **Siempre usar las entidades de los modelos** que el usuario genera/envía. No usar `Map.of` u otras estructuras.
- Los métodos deben recibir y retornar las entidades del modelo directamente.
- Mantener la simplicidad: el servicio contiene la lógica de negocio básica.

### Validaciones y Lógica de Negocio

- El servicio debe ser simple por defecto.
- Agregar validaciones adicionales solo cuando sea necesario por lógica de negocio específica.
- **Nunca usar `Map.of`**; siempre trabajar con las entidades del modelo.

### Autenticación con JWT

Cuando el usuario indique la necesidad, implementar lógica de autenticación JWT en el servicio:

- **Verificar que el usuario que hace la request sea el mismo que va a editar**: Por ejemplo, un usuario solo puede editar su propio perfil.
- **Verificar que el usuario que hace la request sea admin**: Los admins pueden saltar todas las verificaciones y realizar cualquier acción.
- Usar `@AuthenticationPrincipal` o pasar el `usuarioId` actual para estas verificaciones.
- Implementar estas verificaciones en los métodos `update` y `delete` cuando aplique.

### Prioridad: Simplicidad

- Mantener el código del servicio lo más simple posible.
- Delegar operaciones de base de datos a los repositorios.
- Usar transacciones (`@Transactional`) cuando sea necesario.
- Manejar excepciones de manera consistente (IllegalArgumentException, IllegalStateException, etc.).

### Ejemplo de Estructura

```java
@Service
@Transactional
public class EntidadService {

    @Autowired
    private EntidadRepo entidadRepo;

    public Entidad create(Entidad entidad) {
        // Lógica simple de creación
        return entidadRepo.save(entidad);
    }

    public Entidad getById(Long id) {
        // Obtener por ID
        return entidadRepo.findById(id).orElseThrow(() -> new RuntimeException("Entidad no encontrada"));
    }

    public List<Entidad> getAll() {
        // Obtener todas
        return entidadRepo.findAll();
    }

    public Entidad update(Long id, Entidad entidad) {
        // Lógica de actualización, con posibles verificaciones JWT
        Entidad existente = getById(id);
        // Verificaciones de autenticación si aplica
        return entidadRepo.save(entidad);
    }

    public void delete(Long id) {
        // Lógica de eliminación, con posibles verificaciones JWT
        Entidad entidad = getById(id);
        // Verificaciones de autenticación si aplica
        entidadRepo.delete(entidad);
    }
}
```

### Notas Importantes

- Si se requiere lógica JWT, recibir el `usuarioId` actual como parámetro en los métodos que lo necesiten.
- Para verificaciones de admin, consultar el rol del usuario.
- Mantener la separación de responsabilidades: servicio para lógica de negocio, repositorio para acceso a datos.
