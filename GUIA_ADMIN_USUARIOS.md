# Guía Rápida - AdminUsuarios Actualizado

## Cómo Funciona

### Carga de Usuarios
El componente carga automáticamente todos los usuarios de tres fuentes:
1. **Aspirantes** - desde `/api/aspirante`
2. **Reclutadores** - desde `/api/reclutador`  
3. **Administradores** - desde `/api/administrador`

Todos los usuarios se combinan en un único listado.

### Filtros Disponibles

#### 1. Filtro por Rol (Botones)
```
[Todos los Roles] [Aspirantes] [Reclutadores] [Administradores]
```
- Clic en cualquier botón filtra los usuarios por ese rol
- "Todos los Roles" muestra usuarios de todos los roles

#### 2. Filtro por Estado (Botones)
```
[Todos] [Activos] [Inactivos]
```
- Muestra solo usuarios con estado activo o inactivo
- Combinable con filtro de rol

#### 3. Búsqueda
- Escribe en el cuadro de búsqueda para filtrar por:
  - **Nombre** (nombre y apellido)
  - **Correo** (email)
  - **Documento** (número de documento)

### Acciones en la Tabla

#### Editar (Lápiz)
1. Clic en el icono de editar
2. Se carga el modal con los datos actuales
3. Puedes modificar:
   - Nombre
   - Apellido
   - Correo
   - Teléfono
   - Número de documento
   - Tipo de documento
4. Clic en "Actualizar" para guardar cambios

#### Activar/Desactivar (Check/X)
- Si está **Activo**: Aparece botón X para desactivar
- Si está **Inactivo**: Aparece botón Check para activar
- El cambio es inmediato

#### Eliminar (Basurero)
1. Clic en el botón de eliminar
2. Confirma en el diálogo
3. El usuario se elimina de la base de datos

### Estadísticas (Arriba)

Se muestran tres tarjetas con:
- **Total Usuarios**: Cantidad total de usuarios en el sistema
- **Activos**: Usuarios con estado activo
- **Inactivos**: Usuarios con estado inactivo

Las estadísticas se actualizan después de cualquier acción (editar, activar, desactivar, eliminar).

## Estructura de Datos Mostrada

Para cada usuario se muestra:
| Campo | Descripción |
|-------|-------------|
| Nombre | Nombre completo (nombre + apellido) |
| Correo | Email del usuario |
| Teléfono | Número de teléfono |
| Documento | Tipo y número de documento (Ej: CC 1234567) |
| Rol | ASPIRANTE, RECLUTADOR o ADMIN |
| Estado | Activo o Inactivo |
| Fecha Registro | Fecha en que se creó la cuenta |

## Errores Comunes

### "Error al cargar usuarios"
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Comprueba que todos los endpoints estén disponibles:
  - `GET /api/aspirante`
  - `GET /api/reclutador`
  - `GET /api/administrador`

### "Error al activar/desactivar usuario"
- Para aspirantes: Se usan endpoints específicos `/activar` y `/desactivar`
- Para reclutadores y admin: Se actualiza el campo `isActive`

### "Error al editar usuario"
- El modal carga datos frescos antes de abrir
- Si falla, recarga la página (F5) e intenta de nuevo

## Notas Técnicas

### APIs Utilizadas
El componente usa tres APIs diferentes:
```javascript
import aspirantesApi from '../../../api/aspirantesApi';
import reclutadoresApi from '../../../api/reclutadoresApi';
import administradorAPI from '../../../api/administradorAPI';
```

### Configuración de Axios
Todas las APIs usan `axiosConfig.js` que:
- Inyecta el token JWT automáticamente
- Maneja errores de autenticación (401)
- Configura base URL a `http://localhost:8080`

### Estado del Componente
```javascript
const [usuarios, setUsuarios] = useState([]); // Todos los usuarios combinados
const [filtroRol, setFiltroRol] = useState('todos'); // Filtro actual
const [filtroEstado, setFiltroEstado] = useState('todos'); // Estado actual
const [busqueda, setBusqueda] = useState(''); // Texto de búsqueda
const [loading, setLoading] = useState(false); // Cargando datos
const [error, setError] = useState(''); // Mensaje de error
```

### Campos de Documento Agregados
Se agregaron a los modelos del backend:
- `numeroDocumento` (String, 30 caracteres)
- `tipoDocumento` (String, 10 caracteres - CC, CE, NIT, PP)

En los modelos:
- `Aspirante.java`
- `Reclutador.java`
- `Administrador.java`
