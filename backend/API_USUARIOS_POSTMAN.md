# API Workable - Documentación de Endpoints de Usuarios

## Configuración Base
- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **Puerto por defecto**: 8080

---

## 1. AUTENTICACIÓN

### 1.1 Registro de Usuario
**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Body (JSON)**:
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "clave": "Password123!",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/foto.jpg",
  "municipio_id": 1,
  "rol": "ASPIRANTE"
}
```

**Roles disponibles**: `ASPIRANTE`, `RECLUTADOR`, `ADMIN`

**Response 201 (Created)**:
```json
{
  "mensaje": "Usuario registrado exitosamente"
}
```

---

### 1.2 Login
**POST** `/auth/login`

Inicia sesión y obtiene un token JWT.

**Body (JSON)**:
```json
{
  "correo": "juan.perez@email.com",
  "clave": "Password123!"
}
```

**Response 200 (OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rol": "ASPIRANTE",
  "usuarioId": 1
}
```

---

## 2. GESTIÓN DE USUARIOS (CRUD Completo)

### 2.1 Obtener Todos los Usuarios
**GET** `/usuarios`

Lista todos los usuarios registrados (sin contraseña).

**Response 200 (OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "telefono": 3001234567,
    "fotoPerfilUrl": "https://example.com/foto.jpg",
    "municipio_id": 1,
    "municipio_nom": "BOGOTA D.C",
    "rol": "ASPIRANTE"
  }
]
```

---

### 2.2 Obtener Usuario por ID
**GET** `/usuarios/{id}`

Obtiene los datos de un usuario específico (sin contraseña).

**Ejemplo**: `GET /usuarios/1`

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/foto.jpg",
  "municipio_id": 1,
  "municipio_nom": "BOGOTA D.C",
  "rol": "ASPIRANTE"
}
```

---

### 2.3 Crear Usuario
**POST** `/usuarios`

Crea un nuevo usuario (incluye contraseña).

**Body (JSON)**:
```json
{
  "nombre": "María López",
  "correo": "maria.lopez@email.com",
  "clave": "SecurePass456!",
  "telefono": 3109876543,
  "fotoPerfilUrl": "https://example.com/maria.jpg",
  "municipio_id": 2,
  "rol": "RECLUTADOR"
}
```

**Response 201 (Created)**:
```json
{
  "id": 2,
  "nombre": "María López",
  "correo": "maria.lopez@email.com",
  "telefono": 3109876543,
  "fotoPerfilUrl": "https://example.com/maria.jpg",
  "municipio_id": 2,
  "municipio_nom": "MEDELLIN",
  "rol": "RECLUTADOR"
}
```

---

### 2.4 Actualizar Usuario
**PUT** `/usuarios/{id}`

Actualiza los datos de un usuario existente.

**Ejemplo**: `PUT /usuarios/1`

**Body (JSON)** - Campos opcionales:
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juanc.perez@email.com",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/nueva-foto.jpg",
  "municipio_id": 1,
  "clave": "NewPassword789!"
}
```

**Nota**: Si no se envía `clave`, la contraseña actual se mantiene.

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Juan Carlos Pérez",
  "correo": "juanc.perez@email.com",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/nueva-foto.jpg",
  "municipio_id": 1,
  "municipio_nom": "BOGOTA D.C",
  "rol": "ASPIRANTE"
}
```

---

### 2.5 Eliminar Usuario
**DELETE** `/usuarios/{id}`

Elimina un usuario del sistema.

**Ejemplo**: `DELETE /usuarios/1`

**Response 204 (No Content)**
(Sin contenido en el body)

---

## 3. USUARIOS ASPIRANTES (UsrAspirante)

### 3.1 Obtener Todos los Aspirantes
**GET** `/aspirantes`

Lista todos los usuarios tipo aspirante (sin contraseña).

**Response 200 (OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "telefono": 3001234567,
    "fotoPerfilUrl": "https://example.com/foto.jpg",
    "municipio_id": 1,
    "municipio_nom": "BOGOTA D.C",
    "genero_id": 1,
    "genero_nom": "Masculino"
  }
]
```

---

### 3.2 Obtener Aspirante por ID
**GET** `/aspirantes/{id}`

Obtiene los datos de un aspirante específico (sin contraseña).

**Ejemplo**: `GET /aspirantes/1`

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/foto.jpg",
  "municipio_id": 1,
  "municipio_nom": "BOGOTA D.C",
  "genero_id": 1,
  "genero_nom": "Masculino"
}
```

---

### 3.3 Crear Aspirante
**POST** `/aspirantes`

Crea un nuevo usuario aspirante.

**Body (JSON)**:
```json
{
  "nombre": "Carlos Gómez",
  "correo": "carlos.gomez@email.com",
  "clave": "Pass123!",
  "telefono": 3201234567,
  "fotoPerfilUrl": "https://example.com/carlos.jpg",
  "municipio_id": 3,
  "genero_id": 1
}
```

**Response 201 (Created)**:
```json
{
  "id": 3,
  "nombre": "Carlos Gómez",
  "correo": "carlos.gomez@email.com",
  "telefono": 3201234567,
  "fotoPerfilUrl": "https://example.com/carlos.jpg",
  "municipio_id": 3,
  "municipio_nom": "BELLO",
  "genero_id": 1,
  "genero_nom": "Masculino"
}
```

---

### 3.4 Actualizar Aspirante
**PUT** `/aspirantes/{id}`

Actualiza los datos de un aspirante.

**Ejemplo**: `PUT /aspirantes/1`

**Body (JSON)**:
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/nueva-foto.jpg",
  "municipio_id": 1,
  "genero_id": 1
}
```

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Juan Carlos Pérez",
  "correo": "juan.perez@email.com",
  "telefono": 3001234567,
  "fotoPerfilUrl": "https://example.com/nueva-foto.jpg",
  "municipio_id": 1,
  "municipio_nom": "BOGOTA D.C",
  "genero_id": 1,
  "genero_nom": "Masculino"
}
```

---

### 3.5 Eliminar Aspirante
**DELETE** `/aspirantes/{id}`

**Ejemplo**: `DELETE /aspirantes/1`

**Response 204 (No Content)**

---

## 4. USUARIOS RECLUTADORES (UsrReclutador)

### 4.1 Obtener Todos los Reclutadores
**GET** `/reclutadores`

Lista todos los reclutadores (sin contraseña).

**Response 200 (OK)**:
```json
[
  {
    "id": 2,
    "nombre": "María López",
    "correo": "maria.lopez@email.com",
    "telefono": 3109876543,
    "fotoPerfilUrl": "https://example.com/maria.jpg",
    "municipio_id": 2,
    "municipio_nom": "MEDELLIN",
    "empresa_nit_id": 1,
    "empresa_nom": "TechColombia SAS"
  }
]
```

---

### 4.2 Obtener Reclutador por ID
**GET** `/reclutadores/{id}`

**Ejemplo**: `GET /reclutadores/2`

**Response 200 (OK)**:
```json
{
  "id": 2,
  "nombre": "María López",
  "correo": "maria.lopez@email.com",
  "telefono": 3109876543,
  "fotoPerfilUrl": "https://example.com/maria.jpg",
  "municipio_id": 2,
  "municipio_nom": "MEDELLIN",
  "empresa_nit_id": 1,
  "empresa_nom": "TechColombia SAS"
}
```

---

### 4.3 Crear Reclutador
**POST** `/reclutadores`

Crea un nuevo reclutador asociado a una empresa.

**Body (JSON)**:
```json
{
  "nombre": "Pedro Ramírez",
  "correo": "pedro.ramirez@techcolombia.com",
  "clave": "Recruiter123!",
  "telefono": 3159876543,
  "fotoPerfilUrl": "https://example.com/pedro.jpg",
  "municipio_id": 1,
  "empresa_nit_id": 1
}
```

**Response 201 (Created)**:
```json
{
  "id": 4,
  "nombre": "Pedro Ramírez",
  "correo": "pedro.ramirez@techcolombia.com",
  "telefono": 3159876543,
  "fotoPerfilUrl": "https://example.com/pedro.jpg",
  "municipio_id": 1,
  "municipio_nom": "BOGOTA D.C",
  "empresa_nit_id": 1,
  "empresa_nom": "TechColombia SAS"
}
```

---

### 4.4 Actualizar Reclutador
**PUT** `/reclutadores/{id}`

**Ejemplo**: `PUT /reclutadores/2`

**Body (JSON)**:
```json
{
  "nombre": "María Fernanda López",
  "telefono": 3109876543,
  "fotoPerfilUrl": "https://example.com/maria-new.jpg",
  "municipio_id": 2,
  "empresa_nit_id": 1
}
```

**Response 200 (OK)**:
```json
{
  "id": 2,
  "nombre": "María Fernanda López",
  "correo": "maria.lopez@email.com",
  "telefono": 3109876543,
  "fotoPerfilUrl": "https://example.com/maria-new.jpg",
  "municipio_id": 2,
  "municipio_nom": "MEDELLIN",
  "empresa_nit_id": 1,
  "empresa_nom": "TechColombia SAS"
}
```

---

### 4.5 Eliminar Reclutador
**DELETE** `/reclutadores/{id}`

**Ejemplo**: `DELETE /reclutadores/2`

**Response 204 (No Content)**

---

## 5. CÓDIGOS DE RESPUESTA HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Operación exitosa sin contenido de retorno |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 6. NOTAS IMPORTANTES

1. **Contraseñas**: 
   - Los endpoints GET (listar y obtener) NO devuelven la contraseña
   - Solo POST y PUT pueden recibir el campo `clave`
   - Las contraseñas se encriptan automáticamente con BCrypt

2. **IDs de Referencia**:
   - `municipio_id`: Debe existir en la tabla `municipio`
   - `genero_id`: Debe existir en la tabla `genero` (solo para aspirantes)
   - `empresa_nit_id`: Debe existir en la tabla `empresa` (solo para reclutadores)

3. **Roles**:
   - Usuario base: Cualquier rol (`ASPIRANTE`, `RECLUTADOR`, `ADMIN`)
   - UsrAspirante: Solo rol `ASPIRANTE`
   - UsrReclutador: Solo rol `RECLUTADOR`

4. **Formato de datos**:
   - Teléfonos: números de 10 dígitos (ej: 3001234567)
   - Correos: formato válido de email
   - URLs: formato válido de URL

---

## 7. EJEMPLOS COMPLETOS PARA POSTMAN

### Ejemplo 1: Registrar y Autenticar un Aspirante
```
1. POST /api/auth/register
   Body: { "nombre": "Test User", "correo": "test@email.com", "clave": "Test123!", "municipio_id": 1, "rol": "ASPIRANTE" }

2. POST /api/auth/login
   Body: { "correo": "test@email.com", "clave": "Test123!" }
   Guardar el token recibido
```

### Ejemplo 2: CRUD Completo de Aspirante
```
1. POST /api/aspirantes - Crear
2. GET /api/aspirantes - Listar todos
3. GET /api/aspirantes/1 - Obtener uno
4. PUT /api/aspirantes/1 - Actualizar
5. DELETE /api/aspirantes/1 - Eliminar
```

### Ejemplo 3: CRUD Completo de Reclutador
```
1. POST /api/reclutadores - Crear (requiere empresa_nit_id válido)
2. GET /api/reclutadores - Listar todos
3. GET /api/reclutadores/2 - Obtener uno
4. PUT /api/reclutadores/2 - Actualizar
5. DELETE /api/reclutadores/2 - Eliminar
```
