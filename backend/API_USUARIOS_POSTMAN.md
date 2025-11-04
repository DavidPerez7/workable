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

---

## 13. CRUD DE TIPO DE CONTRATO

### 13.1 Listar Tipos de Contrato
**GET** `/tipo-contrato`

**Autenticación**: ❌ No requerida

**Response 200 (OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Tiempo Completo",
    "estado": "ACTIVO"
  },
  {
    "id": 2,
    "nombre": "Medio Tiempo",
    "estado": "ACTIVO"
  }
]
```

---

### 13.2 Obtener Tipo de Contrato por ID
**GET** `/tipo-contrato/{id}`

**Autenticación**: ❌ No requerida

**Ejemplo**: `GET /tipo-contrato/1`

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Tiempo Completo",
  "estado": "ACTIVO"
}
```

**Response 404 (Not Found)**:
```json
{
  "timestamp": "2025-11-04T14:30:00",
  "status": 404,
  "error": "Not Found"
}
```

---

### 13.3 Crear Tipo de Contrato
**POST** `/tipo-contrato`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (con estado explícito)**:
```json
{
  "nombre": "Tiempo Completo",
  "estado": "ACTIVO"
}
```

**Body (sin estado - usará ACTIVO por defecto)**:
```json
{
  "nombre": "Medio Tiempo"
}
```

**Body (crear inactivo)**:
```json
{
  "nombre": "Por Horas",
  "estado": "INACTIVO"
}
```

**Response 201 (Created)**:
```json
{
  "id": 1,
  "nombre": "Tiempo Completo",
  "estado": "ACTIVO"
}
```

**Response 400 (Bad Request)** - Validación fallida:
```json
{
  "timestamp": "2025-11-04T14:30:00",
  "status": 400,
  "errors": {
    "nombre": "El nombre es obligatorio"
  }
}
```

---

### 13.4 Actualizar Tipo de Contrato
**PUT** `/tipo-contrato/{id}`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo**: `PUT /tipo-contrato/1`

**Body (actualizar nombre)**:
```json
{
  "nombre": "Tiempo Completo - 40 horas"
}
```

**Body (actualizar nombre y estado)**:
```json
{
  "nombre": "Medio Tiempo Actualizado",
  "estado": "INACTIVO"
}
```

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Tiempo Completo - 40 horas",
  "estado": "ACTIVO"
}
```

**Response 404 (Not Found)**:
Si el ID no existe.

---

### 13.5 Eliminar Tipo de Contrato
**DELETE** `/tipo-contrato/{id}`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
```

**Ejemplo**: `DELETE /tipo-contrato/1`

**Response 204 (No Content)**
(Sin contenido en el body - operación exitosa)

**Response 404 (Not Found)**:
Si el ID no existe.

---

### 13.6 Actualizar Estado de Tipo de Contrato (Activar/Desactivar)
**PATCH** `/tipo-contrato/{id}/estado`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `estado` (requerido): Valores permitidos: `ACTIVO` o `INACTIVO` (no distingue mayúsculas/minúsculas)

**Ejemplos**:
- Desactivar: `PATCH /tipo-contrato/1/estado?estado=INACTIVO`
- Activar: `PATCH /tipo-contrato/1/estado?estado=ACTIVO`

**Response 200 (OK)**:
```json
{
  "id": 1,
  "nombre": "Tiempo Completo",
  "estado": "INACTIVO"
}
```

**Response 400 (Bad Request)**:
Si el valor del estado no es válido (diferente a ACTIVO o INACTIVO).

**Response 404 (Not Found)**:
Si el ID no existe.

---

## 14. EJEMPLOS COMPLETOS PARA POSTMAN - TIPO DE CONTRATO

### Ejemplo 1: Flujo Completo CRUD Tipo de Contrato
```
1. POST /api/auth/login
   Body: { "correo": "admin@workable.com", "contrasena": "admin123" }
   Guardar el token recibido

2. POST /api/tipo-contrato (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { "nombre": "Tiempo Completo", "estado": "ACTIVO" }

3. GET /api/tipo-contrato
   Ver todos los tipos de contrato creados

4. GET /api/tipo-contrato/1
   Ver un tipo de contrato específico

5. PUT /api/tipo-contrato/1 (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { "nombre": "Tiempo Completo - Actualizado", "estado": "ACTIVO" }

6. PATCH /api/tipo-contrato/1/estado?estado=INACTIVO (Con token en header)
   Header: Authorization: Bearer {token}
   Desactivar el tipo de contrato

7. DELETE /api/tipo-contrato/1 (Con token en header)
   Header: Authorization: Bearer {token}
   Eliminar el tipo de contrato
```

### Ejemplo 2: Consultar Tipos de Contrato (Sin autenticación)
```
1. GET /api/tipo-contrato - Ver todos los tipos de contrato
2. GET /api/tipo-contrato/1 - Ver tipo de contrato específico por ID
```

### Ejemplo 3: Crear múltiples tipos de contrato
```
1. POST /api/tipo-contrato
   Body: { "nombre": "Tiempo Completo" }
   (Usará estado ACTIVO por defecto)

2. POST /api/tipo-contrato
   Body: { "nombre": "Medio Tiempo", "estado": "ACTIVO" }

3. POST /api/tipo-contrato
   Body: { "nombre": "Por Horas", "estado": "ACTIVO" }

4. POST /api/tipo-contrato
   Body: { "nombre": "Contrato de Obra", "estado": "ACTIVO" }

5. POST /api/tipo-contrato
   Body: { "nombre": "Freelance", "estado": "ACTIVO" }
```

---

## 15. CÓDIGOS DE ERROR ESPECÍFICOS - TIPO DE CONTRATO

### Tipo de Contrato
- `400 Bad Request` - El nombre es obligatorio o supera 100 caracteres
- `400 Bad Request` - El estado proporcionado no es válido (debe ser ACTIVO o INACTIVO)
- `401 Unauthorized` - No se proporcionó token de autenticación
- `403 Forbidden` - El token no corresponde a un usuario con rol ADMIN o RECLUTADOR
- `404 Not Found` - El tipo de contrato con el ID especificado no existe

---

## 16. CRUD DE BENEFICIO

### 16.1 Listar Beneficios
**GET** `/beneficio`

**Autenticación**: ❌ No requerida

**Response 200 (OK)**:
```json
[
  {
    "beneficio_id": 1,
    "nombre": "Seguro de Salud",
    "estado": "ACTIVO"
  },
  {
    "beneficio_id": 2,
    "nombre": "Bonos Anuales",
    "estado": "ACTIVO"
  }
]
```

---

### 16.2 Obtener Beneficio por ID
**GET** `/beneficio/{id}`

**Autenticación**: ❌ No requerida

**Ejemplo**: `GET /beneficio/1`

**Response 200 (OK)**:
```json
{
  "beneficio_id": 1,
  "nombre": "Seguro de Salud",
  "estado": "ACTIVO"
}
```

**Response 404 (Not Found)**:
```json
{
  "timestamp": "2025-11-04T14:30:00",
  "status": 404,
  "error": "Not Found"
}
```

---

### 16.3 Crear Beneficio
**POST** `/beneficio`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (con estado explícito)**:
```json
{
  "nombre": "Seguro de Salud",
  "estado": "ACTIVO"
}
```

**Body (sin estado - usará ACTIVO por defecto)**:
```json
{
  "nombre": "Bonos Anuales"
}
```

**Body (crear inactivo)**:
```json
{
  "nombre": "Gimnasio",
  "estado": "INACTIVO"
}
```

**Response 201 (Created)**:
```json
{
  "beneficio_id": 1,
  "nombre": "Seguro de Salud",
  "estado": "ACTIVO"
}
```

**Response 400 (Bad Request)** - Validación fallida:
```json
{
  "timestamp": "2025-11-04T14:30:00",
  "status": 400,
  "errors": {
    "nombre": "El nombre del beneficio es obligatorio"
  }
}
```

---

### 16.4 Actualizar Beneficio
**PUT** `/beneficio/{id}`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Ejemplo**: `PUT /beneficio/1`

**Body (actualizar nombre)**:
```json
{
  "nombre": "Seguro de Salud Completo"
}
```

**Body (actualizar nombre y estado)**:
```json
{
  "nombre": "Bonos Anuales Actualizado",
  "estado": "INACTIVO"
}
```

**Response 200 (OK)**:
```json
{
  "beneficio_id": 1,
  "nombre": "Seguro de Salud Completo",
  "estado": "ACTIVO"
}
```

**Response 404 (Not Found)**:
Si el ID no existe.

---

### 16.5 Eliminar Beneficio
**DELETE** `/beneficio/{id}`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
```

**Ejemplo**: `DELETE /beneficio/1`

**Response 204 (No Content)**
(Sin contenido en el body - operación exitosa)

**Response 404 (Not Found)**:
Si el ID no existe.

---

### 16.6 Actualizar Estado de Beneficio (Activar/Desactivar)
**PATCH** `/beneficio/{id}/estado`

**Autenticación**: ✅ Requerida (Token de ADMIN o RECLUTADOR)

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `estado` (requerido): Valores permitidos: `ACTIVO` o `INACTIVO` (no distingue mayúsculas/minúsculas)

**Ejemplos**:
- Desactivar: `PATCH /beneficio/1/estado?estado=INACTIVO`
- Activar: `PATCH /beneficio/1/estado?estado=ACTIVO`

**Response 200 (OK)**:
```json
{
  "beneficio_id": 1,
  "nombre": "Seguro de Salud",
  "estado": "INACTIVO"
}
```

**Response 400 (Bad Request)**:
Si el valor del estado no es válido (diferente a ACTIVO o INACTIVO).

**Response 404 (Not Found)**:
Si el ID no existe.

---

## 17. EJEMPLOS COMPLETOS PARA POSTMAN - BENEFICIO

### Ejemplo 1: Flujo Completo CRUD Beneficio
```
1. POST /api/auth/login
   Body: { "correo": "admin@workable.com", "contrasena": "admin123" }
   Guardar el token recibido

2. POST /api/beneficio (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { "nombre": "Seguro de Salud", "estado": "ACTIVO" }

3. GET /api/beneficio
   Ver todos los beneficios creados

4. GET /api/beneficio/1
   Ver un beneficio específico

5. PUT /api/beneficio/1 (Con token en header)
   Header: Authorization: Bearer {token}
   Body: { "nombre": "Seguro de Salud Completo - Actualizado", "estado": "ACTIVO" }

6. PATCH /api/beneficio/1/estado?estado=INACTIVO (Con token en header)
   Header: Authorization: Bearer {token}
   Desactivar el beneficio

7. DELETE /api/beneficio/1 (Con token en header)
   Header: Authorization: Bearer {token}
   Eliminar el beneficio
```

### Ejemplo 2: Consultar Beneficios (Sin autenticación)
```
1. GET /api/beneficio - Ver todos los beneficios
2. GET /api/beneficio/1 - Ver beneficio específico por ID
```

### Ejemplo 3: Crear múltiples beneficios
```
1. POST /api/beneficio
   Body: { "nombre": "Seguro de Salud" }
   (Usará estado ACTIVO por defecto)

2. POST /api/beneficio
   Body: { "nombre": "Seguro de Vida", "estado": "ACTIVO" }

3. POST /api/beneficio
   Body: { "nombre": "Bonos Anuales", "estado": "ACTIVO" }

4. POST /api/beneficio
   Body: { "nombre": "Días de Vacaciones Adicionales", "estado": "ACTIVO" }

5. POST /api/beneficio
   Body: { "nombre": "Subsidio de Transporte", "estado": "ACTIVO" }

6. POST /api/beneficio
   Body: { "nombre": "Plan de Pensiones", "estado": "ACTIVO" }

7. POST /api/beneficio
   Body: { "nombre": "Descuentos en Comercios", "estado": "ACTIVO" }

8. POST /api/beneficio
   Body: { "nombre": "Capacitaciones Pagadas", "estado": "ACTIVO" }

9. POST /api/beneficio
   Body: { "nombre": "Gimnasio Empresarial", "estado": "ACTIVO" }

10. POST /api/beneficio
    Body: { "nombre": "Trabajo Remoto", "estado": "ACTIVO" }
```

---

## 18. CÓDIGOS DE ERROR ESPECÍFICOS - BENEFICIO

### Beneficio
- `400 Bad Request` - El nombre del beneficio es obligatorio o supera 100 caracteres
- `400 Bad Request` - El estado proporcionado no es válido (debe ser ACTIVO o INACTIVO)
- `401 Unauthorized` - No se proporcionó token de autenticación
- `403 Forbidden` - El token no corresponde a un usuario con rol ADMIN o RECLUTADOR
- `404 Not Found` - El beneficio con el ID especificado no existe
