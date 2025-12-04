# Guía general para crear un Service en Spring Boot

Un Service en Spring Boot es una clase que contiene la lógica de negocio de una entidad. Se encarga de interactuar con los repositorios (DAO) y aplicar reglas antes de devolver datos al controller.

## ¿Qué hace un Service?
- Orquesta la lógica de negocio de la aplicación.
- Valida datos y relaciones antes de guardar o actualizar.
- Llama a los métodos del repositorio para acceder a la base de datos.
- Lanza excepciones si ocurre un error de negocio (por ejemplo, duplicados, datos no encontrados).
- No debe contener lógica de presentación ni peticiones HTTP.

## Estructura básica de un Service

```java
@Service
public class NombreEntidadService {
    @Autowired
    private NombreEntidadRepo nombreEntidadRepo;

    // Métodos CRUD
    public NombreEntidad create(NombreEntidad request) {
        // Validaciones y lógica de negocio
        return nombreEntidadRepo.save(request);
    }

    public Optional<NombreEntidad> getById(Long id) {
        return nombreEntidadRepo.findById(id);
    }

    public List<NombreEntidad> getAll() {
        return nombreEntidadRepo.findAll();
    }

    public NombreEntidad update(Long id, NombreEntidad request) {
        NombreEntidad existente = nombreEntidadRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("No encontrado"));
        // Actualizar campos
        // ...
        return nombreEntidadRepo.save(existente);
    }

    public void delete(Long id) {
        NombreEntidad existente = nombreEntidadRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("No encontrado"));
        nombreEntidadRepo.delete(existente);
    }
}
```

## Detalles importantes

### 1. Inyección de dependencias
- Usa `@Autowired` para inyectar el repositorio.
- Puedes inyectar otros servicios si necesitas lógica compartida.

### 2. Validaciones de negocio
- Antes de guardar, verifica que no existan duplicados (por ejemplo, emails únicos).
- Valida relaciones: si una entidad depende de otra (por ejemplo, un usuario debe tener un municipio válido), busca la entidad relacionada y lanza excepción si no existe.
- Ejemplo:
```java
if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
    throw new RuntimeException("Correo ya registrado");
}
```

### 3. Manejo de Optional
- Los métodos de repositorio suelen retornar `Optional<T>`. Usa `orElseThrow` para lanzar excepción si no existe.
- Ejemplo:
```java
Usuario usuario = usuarioRepo.findById(id)
    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
```

### 4. Lógica de negocio adicional
- Puedes agregar métodos para lógica específica, como filtrar por estado, calcular promedios, etc.
- Ejemplo:
```java
public List<Entidad> getByEstado(Boolean activo) {
    return entidadRepo.findByActivo(activo);
}

public double calcularPromedioPuntuacion(Long entidadId) {
    List<Feedback> feedbacks = feedbackRepo.findByEntidadId(entidadId);
    return feedbacks.stream().mapToDouble(Feedback::getPuntuacion).average().orElse(0.0);
}
```

### 5. Actualización de entidades
- Al actualizar, busca la entidad existente, modifica solo los campos permitidos y guarda.
- No reemplaces la entidad completa para evitar perder datos.

### 6. Eliminación lógica
- Si tu modelo lo requiere, puedes hacer "eliminación lógica" (marcar como inactivo) en vez de borrar físicamente.
- Ejemplo:
```java
public void delete(Long id) {
    Entidad entidad = entidadRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("No encontrado"));
    entidad.setIsActive(false);
    entidadRepo.save(entidad);
}
```

## Resumen de pasos para crear un Service
1. Define los métodos CRUD básicos.
2. Inyecta el repositorio y otros servicios necesarios.
3. Realiza validaciones y lógica de negocio antes de guardar o actualizar.
4. Usa `Optional` y lanza excepciones claras si algo no se encuentra.
5. Agrega métodos adicionales según las necesidades de la entidad.
6. Mantén el service limpio y enfocado solo en la lógica de negocio.

---

Este patrón se repite para todas las entidades: Usuario, Empresa, Oferta, etc. Puedes ver ejemplos reales en la carpeta `/service` de tu proyecto.