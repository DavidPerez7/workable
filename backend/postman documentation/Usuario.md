# Documentación Endpoints CRUD Usuario

## Base URL: `http://localhost:8080/api`

## CREATE usuario
- **Path:** baseUrl/usuario
- **Http Method:** POST
- **Body:** UsuarioDto
- **Roles (Authorization JWT Bearer):** ADMIN
- **Respuesta:** UsuarioDto

### Ejemplo petición (POST)
**Método:** POST
**URL:** baseUrl/usuario
**Headers:** Content-Type: application/json
**Body:**
```json
{
	"nombre": "Juan Perez",
	"correo": "juan.perez@email.com",
	"telefono": 3121234567,
	"clave": "password123",
	"rol": "ASPIRANTE",
	"fotoPerfilUrl": "https://img.com/foto.jpg",
	"municipio_id": 1
}
```

---

## UPDATE usuario
- **Path:** baseUrl/usuario/{id}
- **Http Method:** PUT
- **Body:** UsuarioDto
- **Roles (Authorization JWT Bearer):** ADMIN, USUARIO (propio)
- **Respuesta:** UsuarioDto

### Ejemplo petición (PUT)
**Método:** PUT
**URL:** baseUrl/usuario/5
**Headers:** Content-Type: application/json
**Body:**
```json
{
	"nombre": "Juan P. Actualizado",
	"correo": "juan.perez@email.com",
	"telefono": 3121234567,
	"clave": "nuevaClave456",
	"rol": "ASPIRANTE",
	"fotoPerfilUrl": "https://img.com/foto2.jpg",
	"municipio_id": 1,
	"estado": "INACTIVO"
}
```

---

## DELETE usuario
- **Path:** baseUrl/usuario/{id}
- **Http Method:** DELETE
- **Roles (Authorization JWT Bearer):** ADMIN, USUARIO (propio)
- **Respuesta:** 200 OK (mensaje de éxito)

### Ejemplo petición (DELETE)
**Método:** DELETE
**URL:** baseUrl/usuario/5

---

## GET usuario by ID
- **Path:** baseUrl/usuario/{id}
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN, USUARIO (propio)
- **Respuesta:** UsuarioReadDto

### Ejemplo petición (GET by ID)
**Método:** GET
**URL:** baseUrl/usuario/5

---

## GET all usuarios
- **Path:** baseUrl/usuario
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN
- **Respuesta:** List<UsuarioReadDto>

### Ejemplo petición (GET all)
**Método:** GET
**URL:** baseUrl/usuario

---

## GET usuario by nombre
- **Path:** baseUrl/usuario/buscar?nombre=Juan Perez
- **Http Method:** GET
- **Roles (Authorization JWT Bearer):** ADMIN
- **Respuesta:** UsuarioReadDto

### Ejemplo petición (GET by nombre)
**Método:** GET
**URL:** baseUrl/usuario/buscar?nombre=Juan Perez

---

**Notas:**
- Todos los endpoints requieren autenticación JWT.
- El campo `estado` puede ser actualizado a `INACTIVO` mediante el endpoint PUT para desactivar el usuario.
- Los roles permitidos pueden variar según la lógica de seguridad implementada.
## Usuario (CRUD)

### Obtener Todos los Usuarios
GET `/usuarios`

### Obtener Usuario por ID
GET `/usuarios/{id}`

### Crear Usuario
POST `/usuarios`

### Actualizar Usuario
PUT `/usuarios/{id}`

### Eliminar Usuario
DELETE `/usuarios/{id}`

(Ver detalles y ejemplos en el archivo original)
