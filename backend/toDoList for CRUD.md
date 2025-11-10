# toDoList CRUD para funcionalidades completas de entidad

## 1. Modelo (Entity)
- Clase con `@Entity` y `@Table(name = "nombre_tabla")`
- Campo id autogenerado: `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- Campos con anotaciones JPA (`@Column`, `nullable`, `length`, etc.)
- Enum para estado activar o desactivar: `ACTIVO`, `INACTIVO`
- Lombok: `@Data` + `@NoArgsConstructor`/`@AllArgsConstructor`

## 2. DTOs
- CreateDTO: campos requeridos para crear (sin ID para creacion por primera vez)
- ReadDTO: campos para mostrar (con ID)
- UpdateDTO (opcional): si la actualización difiere de la creación
- Validaciones: `@NotNull`, `@NotBlank`, `@Size`, etc.
- Carpeta: `dto/[entidad]/`

## 3. Mapper
- Interface: `EntidadMapper` con métodos `toEntity()` y `toDto()`
- Implementación: `EntidadMapperImpl implements EntidadMapper`
- `@Component` en la implementación
- Null safety en conversiones
- Carpeta: `mapper/[entidad]/`

## 4. Repository
- Interface extiende `JpaRepository<Entidad, IdType>`
- Métodos custom si se necesitan (ej: `findByNombre`, `findByEstado`)
- Carpeta: `repository/[entidad]/`

## 5. Service
- Interface: métodos CRUD estándar
  - `create(CreateDTO)`
  - `update(ID, CreateDTO/UpdateDTO)`
  - `delete(ID)`
  - `findById(ID)` → `ReadDTO`
  - `findAll()` → `List<ReadDTO>`
  - `changeEstado(ID, Estado)` (si aplica)
- Implementación: `EntidadServiceImpl implements EntidadService`
- `@Service` y `@RequiredArgsConstructor` (Lombok)
- Inyección por constructor (repository, mapper)
- Manejo de excepciones (`EntityNotFoundException`)
- Carpeta: `service/[entidad]/`

## 6. Controller
- `@RestController` y `@RequestMapping("/api/[entidad]")`
- Inyección por constructor del service
- Endpoints:
  - `GET /` → listar todos
  - `GET /{id}` → obtener por ID
  - `POST /` → crear (`@Valid @RequestBody`)
  - `PUT /{id}` → actualizar (aparte de ser campos de entidad tambien sirve para desactivar)
  - `DELETE /{id}` → eliminar
- `ResponseEntity<>` con códigos HTTP correctos (`200`, `201`, `204`, `404`, etc.)
- Carpeta: `controller/[entidad]/`

## 6.1. Seguridad (SecurityConfig)
- Agregar protecciones obligatorias en el SecurityConfig para los endpoints dependiendo el usuario que lo usará (roles y permisos correctos para cada acción CRUD).

## 7. SQL (data)
- Añadir los inserts en el DML ya creado en /backend/db/`workable_inserts.sql`(tener en cuenta el orden de insersion ej: si la insersion usuario depende de municipio id no la puedes colcar antes de los inserts de municipios)
- Datos iniciales con `estado = 'ACTIVO'` (si aplica)


## 8. Documentación Postman

- Crear un archivo `.md` en la carpeta `documentation/` con el nombre de la entidad, por ejemplo: `Entidad.md`.
- Estructura de la documentación (igual a `Oferta.md`):
  - Título principal: `# Documentación Endpoints CRUD {Entidad}`
  - Base URL: `## Base URL: http://localhost:8080/api`

  - Para cada endpoint, usar el siguiente formato:
    - Título: `## CREATE {entidad}` (o UPDATE, DELETE, GET, PATCH, etc.)
    - Path: `- **Path:** baseUrl/{endpoint del controller de entidad}`
    - Http Method: `- **Http Method:** POST/PUT/DELETE/GET/PATCH`
    - Body: `- **Body:** {Entidad}CreateDTO` (si aplica)
    - Roles: `- **Roles (Authorization JWT Bearer):** ...`
    - Respuesta: `- **Respuesta:** {Entidad}ReadDTO` o lo que corresponda

    - Ejemplo de petición:
      - Subtítulo: `### Ejemplo petición (POST/PUT/DELETE/GET/PATCH)`
      - Método: `**Método:** POST`
      - URL: `**URL:** baseUrl/{entidad}`
      - Headers: `**Headers:** Content-Type: application/json` (si aplica)
      - Body: (bloque JSON con ejemplo)

    - Separar cada endpoint con `---` para claridad.

  - Al final, incluir una sección de notas si es necesario:
    - Roles permitidos para cada acción
    - Reglas de negocio relevantes

- Mantener la estructura, títulos y formato igual al ejemplo de `Oferta.md` para consistencia en toda la documentación.
