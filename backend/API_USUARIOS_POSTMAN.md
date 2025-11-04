# API Workable - Documentación de Endpoints de Usuarios

## Configuración Base
- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **Puerto por defecto**: 8080

---

## 1. AUTENTICACIÓN

### 1.1 Registro de Aspirante
**POST** `/auth/registro-aspirante`

**Body**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@email.com",
  "clave": "Password123!",
  "telefono": 3001234567,
  "municipio_id": 1,
  "genero_id": 1
}
```

---

### 1.2 Registro de Reclutador
**POST** `/auth/registro-reclutador`

**Body**:
```json
{
  "nombre": "Carlos",
  "apellido": "Ramírez",
  "correo": "carlos.ramirez@example.com",
  "clave": "password123",
  "telefono": 3001234567,
  "municipio_id": 1
}
```

---

### 1.3 Login
**POST** `/auth/login`

**Body**:
```json
{
  "correo": "carlos.ramirez@example.com",
  "contrasena": "password123"
}
```

**Nota**: Guarda el token para usarlo en endpoints protegidos. Inclúyelo en el header `Authorization: Bearer {token}`

---

## 2. GESTIÓN DE EMPRESAS

### 2.1 Crear Empresa
**POST** `/empresa`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "nitId": 900123456,
  "nombre": "Tech Solutions SAS",
  "descripcion": "Empresa líder en soluciones de software empresarial",
  "numeroTrabajadores": 150,
  "categoriaId": 1,
  "municipioId": 1
}
```

---

### 2.2 Obtener Todas las Empresas
**GET** `/empresa`

**Autenticación**: ❌ No requerida

---

### 2.3 Obtener Empresa por NIT
**GET** `/empresa/{nitId}`

**Autenticación**: ❌ No requerida

**Ejemplo**: `GET /empresa/900123456`

---

### 2.4 Actualizar Empresa
**PUT** `/empresa/{nitId}`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR propietario)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo**: `PUT /empresa/900123456`

**Body**:
```json
{
  "nitId": 900123456,
  "nombre": "Tech Solutions SAS - Actualizada",
  "descripcion": "Empresa líder en soluciones de software empresarial y consultoría",
  "numeroTrabajadores": 200,
  "categoriaId": 1,
  "municipioId": 1
}
```

---

### 2.5 Eliminar Empresa
**DELETE** `/empresa/{nitId}`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR propietario)

**Headers**:
```
Authorization: Bearer {token}
```

**Ejemplo**: `DELETE /empresa/900123456`

---

## 3. GESTIÓN DE OFERTAS

### 3.1 Crear Oferta
**POST** `/oferta`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "titulo": "Desarrollador Full Stack",
  "descripcion": "Buscamos desarrollador con experiencia en Java y React",
  "ubicacion": "Bogotá D.C.",
  "fechaLimite": "2025-12-31",
  "salario": 4500000,
  "estado": "ABIERTA",
  "municipioId": 1,
  "modalidadId": 1,
  "tipoContratoId": 1
}
```

**Nota**: Los campos `empresaId` y `reclutadorId` se asignan automáticamente según el reclutador autenticado.

---

### 3.2 Obtener Todas las Ofertas
**GET** `/oferta`

**Autenticación**: ❌ No requerida

---

### 3.3 Obtener Oferta por ID
**GET** `/oferta/{id}`

**Autenticación**: ❌ No requerida

**Ejemplo**: `GET /oferta/1`

---

### 3.4 Actualizar Oferta
**PUT** `/oferta/{id}`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR creador)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo**: `PUT /oferta/1`

**Body**:
```json
{
  "titulo": "Desarrollador Full Stack Senior",
  "descripcion": "Buscamos desarrollador senior con experiencia en Java y React",
  "ubicacion": "Bogotá D.C.",
  "fechaLimite": "2026-01-31",
  "salario": 5500000,
  "estado": "ABIERTA",
  "municipioId": 1,
  "modalidadId": 1,
  "tipoContratoId": 1
}
```

---

### 3.5 Eliminar Oferta
**DELETE** `/oferta/{id}`

**Autenticación**: ✅ Requerida (Token de RECLUTADOR creador)

**Headers**:
```
Authorization: Bearer {token}
```

**Ejemplo**: `DELETE /oferta/1`

---

## 4. GESTIÓN DE USUARIOS (CRUD Completo)

### 4.1 Obtener Todos los Usuarios
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

### 4.2 Obtener Usuario por ID
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

### 4.3 Crear Usuario
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

### 4.4 Actualizar Usuario
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

### 4.5 Eliminar Usuario
**DELETE** `/usuarios/{id}`

Elimina un usuario del sistema.

**Ejemplo**: `DELETE /usuarios/1`

**Response 204 (No Content)**
(Sin contenido en el body)

---

## 5. USUARIOS ASPIRANTES (UsrAspirante)

### 5.1 Obtener Todos los Aspirantes
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

### 5.2 Obtener Aspirante por ID
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

### 5.3 Crear Aspirante
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

### 5.4 Actualizar Aspirante
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

### 5.5 Eliminar Aspirante
**DELETE** `/aspirantes/{id}`

**Ejemplo**: `DELETE /aspirantes/1`

**Response 204 (No Content)**

---

## 6. USUARIOS RECLUTADORES (UsrReclutador)

### 6.1 Obtener Todos los Reclutadores
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

### 6.2 Obtener Reclutador por ID
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

### 6.3 Crear Reclutador
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

### 6.4 Actualizar Reclutador
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

### 6.5 Eliminar Reclutador
**DELETE** `/reclutadores/{id}`

**Ejemplo**: `DELETE /reclutadores/2`

**Response 204 (No Content)**

---


## 7. CRUD DE MODALIDAD

### 7.1 Listar Modalidades
**GET** `/modalidad`

### 7.2 Obtener Modalidad por ID
**GET** `/modalidad/{id}`

### 7.3 Crear Modalidad
**POST** `/modalidad`
**Body:**
```json
{
  "nombre": "Remoto"
}
```

### 7.4 Actualizar Modalidad
**PUT** `/modalidad/{id}`
**Body:**
```json
{
  "nombre": "Híbrido"
}
```

### 7.5 Eliminar Modalidad
**DELETE** `/modalidad/{id}`

---

## 8. CRUD DE BENEFICIO

### 8.1 Listar Beneficios
**GET** `/beneficio`

### 8.2 Obtener Beneficio por ID
**GET** `/beneficio/{id}`

### 8.3 Crear Beneficio
**POST** `/beneficio`
**Body:**
```json
{
  "nombre": "Seguro médico"
}
```

### 8.4 Actualizar Beneficio
**PUT** `/beneficio/{id}`
**Body:**
```json
{
  "nombre": "Bonificación"
}
```

### 8.5 Eliminar Beneficio
**DELETE** `/beneficio/{id}`

---

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Operación exitosa sin contenido de retorno |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado o token inválido |
| 403 | Forbidden - No tienes permisos para realizar esta acción |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 9. NOTAS IMPORTANTES

1. **Autenticación JWT**: 
   - Algunos endpoints requieren autenticación mediante token JWT
   - Incluye el token en el header: `Authorization: Bearer {token}`
   - El token se obtiene al hacer login
   - Los endpoints públicos no requieren token

2. **Roles y Permisos**:
   - **ASPIRANTE**: Usuarios que buscan trabajo
   - **RECLUTADOR**: Usuarios que publican ofertas y gestionan empresas
   - **ADMIN**: Administradores del sistema
   - Cada endpoint tiene restricciones específicas de rol

3. **Empresas**:
   - Un reclutador solo puede tener UNA empresa asociada
   - Solo el reclutador propietario puede actualizar/eliminar su empresa
   - Los endpoints GET de empresas son públicos
   - La empresa se vincula automáticamente al crear con token de reclutador

4. **Ofertas**:
   - Se vinculan automáticamente a la empresa del reclutador autenticado
   - Solo el reclutador creador puede actualizar/eliminar su oferta
   - Los endpoints GET de ofertas son públicos
   - Estados posibles: "ABIERTA", "CERRADA", "PAUSADA"

5. **Contraseñas**: 
   - Las contraseñas se encriptan automáticamente con BCrypt
   - El campo se llama `contrasena` (sin tilde) en los endpoints de autenticación
   - Nunca se devuelve la contraseña en las respuestas

6. **Formato de datos**:
   - NIT: Número único de identificación tributaria de la empresa (ej: 900123456)
   - Teléfonos: formato string (ej: "3001234567")
   - Correos: formato válido de email
   - URLs: formato válido de URL con protocolo (https://)

---

## 10. EJEMPLOS COMPLETOS PARA POSTMAN

### Ejemplo 1: Flujo Completo de Reclutador con Empresa
```
1. POST /api/auth/registro-reclutador
   Body: { "nombre": "Carlos", "apellido": "Ramírez", "correo": "carlos@empresa.com", "contrasena": "Pass123!", "telefono": "3001234567" }

2. POST /api/auth/login
   Body: { "correo": "carlos@empresa.com", "contrasena": "Pass123!" }
   Guardar el token recibido

3. POST /api/empresa (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { "nitId": 900123456, "nombreEmpresa": "Mi Empresa SAS", ... }

4. PUT /api/empresa/900123456 (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { datos actualizados de la empresa }

5. DELETE /api/empresa/900123456 (Con token en header)
   Header: Authorization: Bearer {token}
```

### Ejemplo 2: Consultar Empresas (Sin autenticación)
```
1. GET /api/empresa - Ver todas las empresas
2. GET /api/empresa/900123456 - Ver empresa específica
```

### Ejemplo 3: Flujo de Aspirante
```
1. POST /api/auth/registro-aspirante
   Body: { "nombre": "Juan", "apellido": "Pérez", "correo": "juan@email.com", "contrasena": "Pass123!", "telefono": "3101234567" }

2. POST /api/auth/login
   Body: { "correo": "juan@email.com", "contrasena": "Pass123!" }
   Guardar el token recibido

3. Usar el token para endpoints protegidos de aspirante
```

---

## 11. TESTING EN POSTMAN

### Configuración de Variables de Entorno
Crea las siguientes variables en Postman para facilitar las pruebas:

- `baseUrl`: `http://localhost:8080/api`
- `token`: (Se guarda automáticamente después del login)
- `empresaNit`: (NIT de la empresa creada)

### Script para Guardar Token Automáticamente
En el endpoint de Login, añade este script en la pestaña "Tests":

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### Uso del Token en Headers
En los endpoints protegidos, usa:
```
Authorization: Bearer {{token}}
```

---

## 12. CÓDIGOS DE ERROR ESPECÍFICOS

### Empresa
- `"Este reclutador ya tiene una empresa asociada"` - El reclutador ya tiene una empresa
- `"Reclutador no encontrado"` - El correo del token no corresponde a un reclutador
- `"No tienes permisos para actualizar esta empresa"` - Intentas actualizar una empresa que no te pertenece
- `"No tienes permisos para eliminar esta empresa"` - Intentas eliminar una empresa que no te pertenece
- `"Empresa no encontrada"` - El NIT no existe en la base de datos

### Oferta
- `"Debes tener una empresa registrada para crear ofertas"` - El reclutador no tiene empresa
- `"Reclutador no encontrado"` - El correo del token no corresponde a un reclutador
- `"No tienes permisos para actualizar esta oferta"` - Intentas actualizar una oferta que no creaste
- `"No tienes permisos para eliminar esta oferta"` - Intentas eliminar una oferta que no creaste
- `"Oferta no encontrada"` - El ID no existe en la base de datos
