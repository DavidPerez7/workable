# Actualización de AdminUsuarios - Conexión con Backend por Rol

## Cambios Realizados

### 1. **Actualización de APIs en Frontend**

#### `src/api/axiosConfig.js` (NUEVO)
- Configuración centralizada de Axios
- Interceptores para agregar token JWT automáticamente
- Manejo de errores de autenticación (401)

#### `src/api/administradorAPI.js`
- Actualizado para usar axiosConfig
- Métodos: `getAll()`, `get(id)`, `getActive()`, `create()`, `update()`, `delete()`, `updateLastAccess()`
- Todas las peticiones apuntan a `/api/administrador`

#### `src/api/reclutadoresApi.js`
- Actualizado para usar axiosConfig
- Métodos: `getAll()`, `get(id)`, `getPublic(id)`, `getMyProfile()`, `getByEmpresa()`, `getByCorreo()`, `create()`, `update()`, `updateAdmin()`, `delete()`
- Todas las peticiones apuntan a `/api/reclutador`

#### `src/api/aspirantesApi.js`
- Actualizado para usar axiosConfig
- Métodos: `getAll()`, `get(id)`, `getPublic(id)`, `getMyProfile()`, `getByCorreo()`, `getByNombre()`, `create()`, `createPublic()`, `update()`, `updateAdmin()`, `updatePublic()`, `updateMyProfile()`, `activate()`, `deactivate()`, `delete()`, `deletePublic()`
- Todas las peticiones apuntan a `/api/aspirante`

### 2. **Actualización del Componente AdminUsuarios**

#### `src/pages/AdminPage/AdminUsuarios/AdminUsuarios.jsx`
- **Importaciones actualizadas**: Usa las tres APIs (aspirantesApi, reclutadoresApi, administradorAPI)
- **Carga de datos**: Carga usuarios de los tres endpoints simultáneamente (con manejo de errores individual)
- **Filtro por rol**: Botones para filtrar por Aspirantes, Reclutadores y Administradores
- **Filtro por estado**: Mantiene los filtros de Activos/Inactivos
- **Búsqueda**: Busca en nombre, correo y documento
- **Funciones de gestión**:
  - `handleEditar()`: Carga datos del usuario según su rol
  - `handleGuardar()`: Actualiza usuario en el endpoint correcto según su rol
  - `handleActivar()`: Activa usuario según su rol
  - `handleDesactivar()`: Desactiva usuario según su rol
  - `handleEliminar()`: Elimina usuario según su rol
- **Modal**: Formulario para editar usuarios con campos: nombre, apellido, correo, teléfono, documento, tipo de documento y rol
- **Tabla**: Muestra todos los usuarios con sus datos y acciones (editar, activar/desactivar, eliminar)

### 3. **Actualización de Modelos en Backend**

#### `models/Aspirante.java`
- Agregados campos: `numeroDocumento`, `tipoDocumento`

#### `models/Reclutador.java`
- Agregados campos: `numeroDocumento`, `tipoDocumento`

#### `models/Administrador.java`
- Agregados campos: `numeroDocumento`, `tipoDocumento`

## Flujo de Funcionamiento

1. **Al cargar el componente**:
   - Se ejecuta `cargarUsuarios()` que trae aspirantes, reclutadores y administradores
   - Los datos se combinan y formatean en un array único `usuarios`

2. **Filtrado**:
   - Los botones de rol filtran entre aspirantes, reclutadores o administradores
   - Los botones de estado filtran entre activos o inactivos
   - La búsqueda filtra por nombre, correo o documento

3. **Al editar un usuario**:
   - Se identifica el rol del usuario
   - Se llama a la API específica del rol para obtener los datos actuales
   - El modal se abre con los datos pre-cargados
   - Al guardar, se llama a `updateAdmin()` de la API correspondiente

4. **Al activar/desactivar**:
   - Para aspirantes: Usa `activate()` o `deactivate()`
   - Para reclutadores y administradores: Actualiza el campo `isActive` directamente

5. **Al eliminar**:
   - Se llama al método `delete()` de la API correspondiente
   - Para reclutadores se envía también el ID como parámetro de query

## Endpoints Utilizados

### Aspirantes
- `GET /api/aspirante` - Obtener todos
- `GET /api/aspirante/{id}` - Obtener por ID
- `PUT /api/aspirante/{id}/admin` - Actualizar (ADMIN)
- `PUT /api/aspirante/{id}/activar` - Activar
- `PUT /api/aspirante/{id}/desactivar` - Desactivar
- `DELETE /api/aspirante/{id}` - Eliminar

### Reclutadores
- `GET /api/reclutador` - Obtener todos
- `GET /api/reclutador/{id}` - Obtener por ID
- `PUT /api/reclutador/admin/{id}` - Actualizar (ADMIN)
- `DELETE /api/reclutador/{id}` - Eliminar

### Administradores
- `GET /api/administrador` - Obtener todos
- `GET /api/administrador/{id}` - Obtener por ID
- `PUT /api/administrador/{id}` - Actualizar
- `DELETE /api/administrador/{id}` - Eliminar

## Características

✅ Consulta de usuarios por rol (Aspirantes, Reclutadores, Administradores)
✅ Filtro por rol directamente desde el botón
✅ Filtro por estado (Activo/Inactivo)
✅ Búsqueda por nombre, correo o documento
✅ Edición de usuarios con modal
✅ Activación/desactivación de usuarios
✅ Eliminación de usuarios
✅ Manejo de errores individual por rol
✅ Carga simultanea de datos desde tres endpoints
✅ Modelos actualizados con campos de documento
