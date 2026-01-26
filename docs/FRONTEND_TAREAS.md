# 📝 CHECKLIST FRONTEND - INTEGRACIÓN PENDIENTE

## 🎯 3 FUNCIONALIDADES CRÍTICAS FALTANTES

---

## 1️⃣ GESTIÓN DE HOJA DE VIDA (Aspirante)
**Estado:** ❌ NO EXISTE  
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 4-6 horas

### ¿Qué falta?
```
✅ Backend tiene: POST/PUT /api/hoja-vida con estudios[] y experiencias[] embebidos
✅ API JS existe: hojaDeVidaAPI.js (crearHojaDeVida, actualizarHojaDeVida)
❌ FALTA: Interfaz UI para que aspirante cree/edite su CV
```

### Componentes necesarios

#### A) Pantalla principal MiPerfilCV.jsx
```javascript
// Debe mostrar:
- Datos personales (nombre, correo, teléfono, dirección, descripción)
- Botón "Editar Información"
- Sección "Estudios" con lista y botones agregar/editar/eliminar
- Sección "Experiencias" con lista y botones agregar/editar/eliminar
- Botón "Guardar CV" que hace PUT /api/hoja-vida/{id}

// Endpoints que usa:
GET    /api/hoja-vida/aspirante/{aspiranteId}  // Cargar CV
POST   /api/hoja-vida                           // Crear CV (primera vez)
PUT    /api/hoja-vida/{id}                      // Guardar cambios
```

#### B) Modal/Formulario AgregarEstudio.jsx
```javascript
// Campos que captura:
- titulo (texto) - "Ingeniero en Sistemas"
- institucion (texto) - "Universidad Nacional"
- nivelEducativo (select) - PREGRADO, POSTGRADO, DIPLOMATADO, TECNICO, TECNOLOGO, CERTIFICACION
- fechaInicio (date picker)
- fechaFin (date picker) - opcional
- enCurso (checkbox) - marcar si aún estudia
- modalidad (select) - PRESENCIAL, VIRTUAL, HIBRIDO
- descripcion (textarea) - opcional
- certificadoUrl (text/file) - opcional

// Validaciones:
- Campos requeridos: titulo, institucion, nivelEducativo, fechaInicio
- fechaFin >= fechaInicio (si está diligenciado)
- Si enCurso = true, no validar fechaFin
```

#### C) Modal/Formulario AgregarExperiencia.jsx
```javascript
// Campos que captura:
- cargo (texto) - "Backend Developer"
- empresa (texto) - "TechCorp"
- fechaInicio (date picker)
- fechaFin (date picker) - opcional
- municipio (select) - Cargar via GET /api/municipio
- descripcion (textarea) - opcional
- certificadoUrl (text/file) - opcional

// Validaciones:
- Campos requeridos: cargo, empresa, fechaInicio, municipio
- fechaFin >= fechaInicio (si está diligenciado)
```

### Flujo de usuario
```
1. Aspirante navega a "Mi Perfil" > "Mi Hoja de Vida"
2. Si no existe CV:
   - Mostrar botón "Crear CV"
   - Click abre formulario para editar información personal
   - Luego agregar estudios y experiencias
3. Si existe CV:
   - Mostrar CV actual
   - Botón editar en cada sección
   - Drag & drop para reordenar (opcional)
4. Botón "Guardar" guarda en backend con PUT /api/hoja-vida/{id}
```

---

## 2️⃣ CITACIONES EN POSTULACIONES (Reclutador + Aspirante)
**Estado:** ⚠️ PARCIALMENTE (POST existe, CITACIÓN no)  
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 3-5 horas

### ¿Qué falta?
```
✅ Backend tiene: CitacionData embebida en Postulacion (fecha, hora, linkMeet, detalles, estado)
✅ Endpoint PUT /api/postulacion/{id} acepta actualizar citación
❌ FALTA: UI para programar citación y ver estado
```

### Cambios necesarios

#### A) En ReclutadorPage - OfertaCompletaPage.jsx
**Cambios:**
```javascript
// ACTUAL:
<div>
  {postulaciones.map(p => <div>{p.aspirante.nombre}</div>)}
</div>

// NUEVO: Agregar tabla con estados y botón citación
<table>
  <tr>
    <td>{postulacion.aspirante.nombre}</td>
    <td>{postulacion.estado}</td>  // ← NUEVO: Mostrar estado
    <td>
      <button onClick={() => openCitacionModal(postulacion)}>
        📅 Programar Cita  // ← NUEVO
      </button>
    </td>
  </tr>
</table>

// NUEVO: Modal para programar cita
<CitacionModal 
  postulacion={postulacion}
  onSave={async (citacionData) => {
    await updatePostulacion(postulacion.id, {
      estado: 'EN_REVISION',
      citacion: citacionData
    })
  }}
/>
```

#### B) Nuevo componente: CitacionModal.jsx
```javascript
// Formulario que captura:
- fecha (date picker) - requerido
- hora (time picker) - requerido, formato HH:MM
- linkMeet (text) - opcional, validar URL
- detalles (textarea) - opcional
- estado (select) - PROGRAMADA, CONFIRMADA, CANCELADA (default PROGRAMADA)

// Validaciones:
- fecha >= hoy
- hora formato válido
- linkMeet URL válida si se proporciona

// Guardar:
PUT /api/postulacion/{id}
{
  "estado": "EN_REVISION",
  "citacion": {
    "fecha": "2026-02-15",
    "hora": "10:30",
    "linkMeet": "https://meet.google.com/xxx",
    "detalles": "Entrevista técnica con equipo",
    "estado": "PROGRAMADA"
  }
}
```

#### C) Vista Aspirante - Ver Postulaciones actualizada
**En AspirantePage.jsx o nueva página "Mis Postulaciones":**
```javascript
// NUEVO: Mostrar postulaciones con estado y citación
{misPostulaciones.map(post => (
  <Card>
    <h3>{post.oferta.titulo}</h3>
    <p>Estado: <span className={`badge-${post.estado}`}>{post.estado}</span></p>
    
    {post.citacion && (
      <div className="citacion-info">
        <h4>📅 Citación Programada</h4>
        <p>Fecha: {post.citacion.fecha}</p>
        <p>Hora: {post.citacion.hora}</p>
        {post.citacion.linkMeet && (
          <a href={post.citacion.linkMeet} target="_blank">
            🔗 Unirse a Meet
          </a>
        )}
        <p>Detalles: {post.citacion.detalles}</p>
      </div>
    )}
  </Card>
))}
```

### Estados de Postulación
```
POSTULADO        → Candidato aplicó, sin revisar
EN_REVISION      → Reclutador está revisando
ENTREVISTA       → Citación programada/confirmada
ACEPTADO         → Candidato aceptado
RECHAZADO        → Candidato rechazado
```

---

## 3️⃣ DASHBOARD ADMIN MEJORADO
**Estado:** ⚠️ EXISTE pero INCOMPLETO  
**Prioridad:** 🟡 IMPORTANTE  
**Tiempo estimado:** 2-3 horas

### ¿Qué existe?
```
✅ AdminPage/AdminPage.jsx existe
✅ Subpáginas: AdminUsuarios, AdminOfertas, AdminPostulaciones
❌ FALTA: Información consolidada, estadísticas, vistas activas
```

### Cambios necesarios

#### A) Dashboard Principal mejorado
```javascript
// Debe mostrar:
- Tarjetas de estadísticas:
  * Total Aspirantes (GET /api/aspirante)
  * Total Reclutadores (GET /api/reclutador)
  * Total Ofertas (GET /api/oferta)
  * Total Postulaciones (GET /api/postulacion/all)
  * Ofertas Abiertas (filtrar estado = 'ABIERTA')
  * Postulaciones Activas (filtrar estado in ['POSTULADO', 'EN_REVISION', 'ENTREVISTA'])

- Gráficos:
  * Postulaciones por estado (pie chart)
  * Ofertas por empresa (bar chart)
  * Nuevos aspirantes por mes (line chart)

- Tabla de postulaciones recientes:
  * Aspirante | Oferta | Empresa | Estado | Fecha
```

#### B) Página de Postulaciones (AdminPostulaciones)
```javascript
// Tabla interactiva:
- Filtrar por estado (POSTULADO, EN_REVISION, etc)
- Filtrar por oferta
- Columnas:
  * Aspirante
  * Oferta
  * Empresa
  * Estado (con badge color)
  * Citación (si existe, mostrar fecha)
  * Acciones (ver detalle, cambiar estado)

// Funcionalidades:
- Click en postulación → Ver detalle completo
- Cambiar estado desde tabla → Validar cambio
- Enviar notificación a aspirante cuando cambia estado (v1.1)
```

#### C) Página de Ofertas (AdminOfertas)
```javascript
// Tabla:
- Filtrar por estado (ABIERTA, CERRADA)
- Columnas:
  * Título
  * Empresa
  * Vacantes
  * Salario
  * Estado
  * Postulaciones (cantidad)
  * Acciones

// Funcionalidades:
- Ver detalle de oferta
- Cambiar estado ABIERTA → CERRADA
- Ver todas las postulaciones de oferta
```

---

## 📋 RESUMEN DE CAMBIOS

| Componente | Ubicación | Cambio | Tipo |
|-----------|-----------|--------|------|
| HojaDeVidaManager | src/pages/AspirantePage/MiPerfil/ | CREAR | Nuevo |
| AgregarEstudio | src/components/ | CREAR | Modal |
| AgregarExperiencia | src/components/ | CREAR | Modal |
| OfertaCompletaPage | src/pages/ReclutadorPage/ | MODIFICAR | Agregar tabla + citación |
| CitacionModal | src/components/ | CREAR | Modal |
| AspirantePage | src/pages/ | MODIFICAR | Agregar vista de postulaciones |
| AdminPage | src/pages/AdminPage/ | MODIFICAR | Mejorar dashboard |
| AdminPostulaciones | src/pages/AdminPage/ | MODIFICAR | Agregar filtros/tabla |
| AdminOfertas | src/pages/AdminPage/ | MODIFICAR | Agregar filtros/tabla |

---

## 🔌 CONEXIONES API NECESARIAS

```javascript
// Hoja de Vida
✅ import { crearHojaDeVida, actualizarHojaDeVida, getHojasDeVidaPorAspirante } from '../../api/hojaDeVidaAPI'

// Postulaciones
✅ import { obtenerPostulacionesPorOferta, cambiarEstadoPostulacion, actualizarPostulacion } from '../../api/postulacionesAPI'

// Municipios (ya conectado)
✅ import { getMunicipios } from '../../api/municipioAPI'

// Admin endpoints
✅ GET /api/aspirante (getAllAspirantes)
✅ GET /api/reclutador (getAllReclutadores)
✅ GET /api/oferta (getAllOfertas)
✅ GET /api/postulacion/all (getAllPostulaciones) - ADMIN only
```

---

**Nota:** El backend está 100% listo. Solo necesita que frontend conecte los endpoints.

