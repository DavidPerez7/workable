# DIAGNÓSTICO APP MÓVIL - ESTADO ACTUAL

## ✅ LO QUE FUNCIONA

### Autenticación
- [x] Registro (aspirante, reclutador)
- [x] Login con JWT
- [x] Logout
- [x] Persistencia de sesión con SecureStore
- [x] Manejo de roles

### ASPIRANTE
- [x] Ver ofertas laborales
- [x] Filtrar ofertas por texto
- [x] Ver detalle de oferta
- [x] Ver perfil básico (nombre, correo)
- [x] Editar datos personales básicos (nombre, apellido, teléfono, dirección)
- [x] Ver estado de postulaciones

### RECLUTADOR
- [x] Ver datos personales
- [x] Ver empresa asociada
- [x] Dashboard básico
- [x] Ver mis ofertas
- [x] Crear oferta
- [x] Editar oferta
- [x] Ver postulantes en cada oferta
- [x] Ver detalle de postulante

### ADMINISTRADOR
- [x] Dashboard con acceso
- [x] Logout

---

## ❌ LO QUE FALTA (CRÍTICO)

### ASPIRANTE - HOJA DE VIDA (CRUD COMPLETO)
**Estado:** INCOMPLETO - Falta pantalla de edición

El PerfilAspiranteScreen solo muestra datos básicos. Debe tener:
- [ ] **Sección de Estudios:**
  - Crear estudio (institución, título, nivel, fecha inicio, fecha fin, en curso)
  - Listar estudios propios
  - Editar estudio
  - Eliminar estudio

- [ ] **Sección de Experiencia Laboral:**
  - Crear experiencia (puesto, empresa, descripción, fecha inicio, fecha fin)
  - Listar experiencias propias
  - Editar experiencia
  - Eliminar experiencia

- [ ] **Sección de Habilidades:**
  - Crear habilidad
  - Listar habilidades propias
  - Editar habilidad
  - Eliminar habilidad

- [ ] **Sección "Acerca de mí":**
  - Editar descripción/bio personal

**Backend Endpoints Disponibles:**
```
GET    /api/estudio/aspirante                    - Mis estudios
POST   /api/estudio                              - Crear estudio
PUT    /api/estudio/{id}                         - Editar estudio
DELETE /api/estudio/{id}                         - Eliminar estudio

GET    /api/experiencia/aspirante                - Mis experiencias
POST   /api/experiencia                          - Crear experiencia
PUT    /api/experiencia/{id}                     - Editar experiencia
DELETE /api/experiencia/{id}                     - Eliminar experiencia

GET    /api/habilidad/aspirante/{id}             - Mis habilidades
POST   /api/habilidad                            - Crear habilidad
PUT    /api/habilidad/{id}                       - Editar habilidad
DELETE /api/habilidad/{id}                       - Eliminar habilidad
```

### ASPIRANTE - POSTULACIONES
**Estado:** Parcial - Falta ver detalle de estado

- [ ] Ver estado actual de cada postulación
- [ ] Ver comentarios/feedback del reclutador (si aplica)
- [ ] Desistir de postulación (si es posible según backend)

### ASPIRANTE - POSTULARSE A OFERTAS
**Estado:** FALTA - No hay botón/funcionalidad de postular

- [ ] Botón "Postularme" en detalle de oferta
- [ ] Confirmar postulación
- [ ] Mostrar que ya está postulado en oferta

### RECLUTADOR - CRUD COMPLETO DE OFERTAS
**Estado:** Parcial - Falta eliminar oferta

- [ ] Eliminar oferta
- [ ] Cambiar estado de oferta (ABIERTA, CERRADA, etc.)
- [ ] Ver estadísticas (cuántos postulantes totales)

### RECLUTADOR - GESTIÓN DE POSTULACIONES
**Estado:** INCOMPLETO - Falta cambiar estado

- [ ] Cambiar estado de postulación (PENDIENTE → ACEPTADO/RECHAZADO)
- [ ] Agregar comentarios/feedback
- [ ] Ver historial de cambios

### RECLUTADOR - EDITAR PERFIL
**Estado:** FALTA

- [ ] Editar datos personales (nombre, apellido, cargo, teléfono)
- [ ] Editar datos de empresa (nombre, descripción, dirección)
- [ ] Cambiar foto de perfil

---

## 🔴 ADMINISTRADOR - GESTIONES (CRÍTICO)

**Estado:** CASI VACÍO - Solo tiene dashboard

### Gestión de Aspirantes
- [ ] Ver lista de todos los aspirantes
- [ ] Ver detalle de aspirante (perfil completo con estudios, experiencias, habilidades)
- [ ] Crear aspirante manualmente
- [ ] Editar aspirante
- [ ] Eliminar aspirante
- [ ] Filtros: por nombre, correo, fecha registro, estado

### Gestión de Reclutadores
- [ ] Ver lista de reclutadores
- [ ] Ver reclutador + empresa asociada
- [ ] Crear reclutador manualmente
- [ ] Editar reclutador
- [ ] Eliminar reclutador
- [ ] Filtros: por nombre, empresa, fecha registro

### Gestión de Ofertas Laborales
- [ ] Ver lista de todas las ofertas
- [ ] Ver detalle de oferta
- [ ] Crear oferta
- [ ] Editar oferta
- [ ] Eliminar oferta
- [ ] Cambiar estado
- [ ] Filtros: por estado, reclutador, empresa, fecha creación

### Gestión de Postulaciones
- [ ] Ver todas las postulaciones
- [ ] Ver detalle de postulación (aspirante + oferta + estado)
- [ ] Cambiar estado de postulación
- [ ] Ver historial
- [ ] Filtros: por estado, aspirante, oferta, reclutador, fecha

---

## 📋 API HOOKS FALTANTES EN MOBILE

### Archivos a crear/completar:

**movil/src/api/estudios.ts** (si no existe)
- getEstudiosByAspirante
- createEstudio
- updateEstudio
- deleteEstudio
- getEstudiosByAspiranteForAdmin

**movil/src/api/experiencia.ts** (si no existe)
- getExperienciasByAspirante
- createExperiencia
- updateExperiencia
- deleteExperiencia

**movil/src/api/habilidad.ts** (si no existe)
- getHabilidadesByAspirante
- createHabilidad
- updateHabilidad
- deleteHabilidad

**movil/src/api/postulacion.ts** (si existe, completar)
- postularse a oferta
- cambiar estado de postulación
- ver postulaciones de reclutador

**movil/src/api/admin.ts** (si no existe)
- getAspirantesAdmin (con filtros)
- getAspirantePerfil (detalle completo)
- createAspiranteAdmin
- updateAspiranteAdmin
- deleteAspiranteAdmin
- getReclutadoresAdmin
- getReclutadorPerfil
- createReclutadorAdmin
- updateReclutadorAdmin
- deleteReclutadorAdmin
- getOfertasAdmin
- getPostulacionesAdmin
- updateEstadoPostulacion

---

## 🎯 COMPONENTES FALTANTES

**movil/src/screens/aspirante/**
- [ ] HojaDeVidaScreen.tsx (gestión completa de estudios, experiencias, habilidades)
- [ ] EstudiosListScreen.tsx
- [ ] CrearEstudioScreen.tsx
- [ ] EditarEstudioScreen.tsx
- [ ] ExperienciasListScreen.tsx
- [ ] CrearExperienciaScreen.tsx
- [ ] EditarExperienciaScreen.tsx
- [ ] HabilidadesListScreen.tsx
- [ ] CrearHabilidadScreen.tsx
- [ ] EditarHabilidadScreen.tsx
- [ ] PostulacionDetailScreen.tsx (ver estado detallado)

**movil/src/screens/reclutador/**
- [ ] PerfilReclutadorEditScreen.tsx

**movil/src/screens/admin/**
- [ ] AspirantesListAdminScreen.tsx
- [ ] AspiranteDetailAdminScreen.tsx
- [ ] CrearAspiranteAdminScreen.tsx
- [ ] EditarAspiranteAdminScreen.tsx
- [ ] ReclutadoresListAdminScreen.tsx
- [ ] ReclutadorDetailAdminScreen.tsx
- [ ] CrearReclutadorAdminScreen.tsx
- [ ] EditarReclutadorAdminScreen.tsx
- [ ] OfertasListAdminScreen.tsx
- [ ] PostulacionesListAdminScreen.tsx

---

## 📊 RESUMEN DE COMPLETITUD

| Módulo | Estado | % |
|--------|--------|---|
| **Autenticación** | ✅ Completo | 100% |
| **ASPIRANTE - Ofertas** | ✅ Parcial | 80% |
| **ASPIRANTE - Hoja de Vida** | ❌ Falta | 0% |
| **ASPIRANTE - Postulaciones** | ⚠️ Básico | 30% |
| **RECLUTADOR - Ofertas** | ✅ Parcial | 85% |
| **RECLUTADOR - Postulantes** | ⚠️ Básico | 50% |
| **RECLUTADOR - Perfil** | ⚠️ Ver solo | 40% |
| **ADMINISTRADOR** | ❌ Falta | 5% |

---

## 🔧 PLAN DE ACCIÓN RECOMENDADO

1. **Prioridad 1 (Crítico):** Completar ASPIRANTE - Hoja de Vida (sin esto no puede tener perfil completo)
2. **Prioridad 2 (Alto):** Agregar funcionalidad de postularse a ofertas
3. **Prioridad 3 (Alto):** Completar gestión de postulaciones (cambiar estado)
4. **Prioridad 4 (Medio):** Admin - Gestión de aspirantes
5. **Prioridad 5 (Medio):** Admin - Gestión de reclutadores
6. **Prioridad 6 (Bajo):** Admin - Gestión de ofertas y postulaciones

