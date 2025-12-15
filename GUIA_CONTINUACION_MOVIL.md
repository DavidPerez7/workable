# GUÍA DE CONTINUACIÓN - APP MÓVIL

**Última actualización:** Diciembre 14, 2024

---

## 🎯 ESTADO ACTUAL

**Módulo ASPIRANTE:** 90% Funcional ✅
- Autenticación completa
- Hoja de Vida con CRUD completo (Estudios, Experiencias, Habilidades)
- Ver ofertas laborales
- Postularse a ofertas (con validación)
- Ver postulaciones con estado visual mejorado

**Módulo RECLUTADOR:** 37% Funcional
- Autenticación con empresa asociada
- Ver datos personales y empresa
- CRUD de ofertas (menos eliminar)
- Ver postulantes básico

**Módulo ADMINISTRADOR:** 17% Funcional
- Dashboard básico
- Necesita implementación completa

---

## 🚀 PRÓXIMAS PRIORIDADES (En orden)

### 1. RECLUTADOR - Gestión de Postulaciones (30 minutos) 🔴 BLOQUEANTE

Crear: `movil/src/screens/reclutador/PostulacionesReclutadorScreen.tsx`

Funcionalidades:
```tsx
- Ver lista de postulantes por oferta
- Ver datos del aspirante (nombre, email, etc.)
- Cambiar estado: PENDIENTE → ACEPTADO/RECHAZADO
- Agregar comentarios/feedback
- Ver hoja de vida del aspirante (modal o navegación)
```

**APIs ya disponibles:**
```typescript
// En movil/src/api/postulacion.ts
getPostulacionesByOferta(ofertaId, usuarioIdActual) // GET
updatePostulacion(id, data) // PUT (para cambiar estado)
```

**Estructura sugerida:**
```
PostulacionesReclutadorScreen.tsx
├── Tab o Selector de Oferta
├── Lista de postulantes por oferta
│   ├── Expandible con detalles
│   ├── Botón "Ver Hoja de Vida" (modal)
│   ├── Selector de estado (dropdown)
│   └── Input para comentarios
├── Guardar cambios
└── Confirmación
```

---

### 2. ADMINISTRADOR - Gestión de Aspirantes (45 minutos)

Crear: `movil/src/screens/admin/AspirantesAdminScreen.tsx`

Funcionalidades:
```tsx
- Lista de todos los aspirantes
- Búsqueda por nombre/email
- Filtros: estado, fecha registro, etc.
- Ver perfil completo con hoja de vida
- Crear aspirante manualmente
- Editar aspirante
- Eliminar aspirante
- Pagination o infinite scroll
```

**Estructura:**
```
AspirantesAdminScreen.tsx
├── SearchBar
├── Filtros (estado, fecha, etc.)
├── Lista con FlatList
│   ├── Item clickeable → ModalDeDetalle
│   └── Acciones: Editar, Eliminar, Ver HV
├── Botón "+ Crear"
└── Modales (crear, editar, eliminar, ver)
```

---

### 3. ADMINISTRADOR - Gestión de Reclutadores (20 minutos)

Similar a aspirantes pero con empresa asociada.

```
ReclutadoresAdminScreen.tsx
├── Lista de reclutadores
├── Mostrar: nombre, empresa, email
├── CRUD completo
└── Ver empresa asociada
```

---

### 4. ADMINISTRADOR - Ofertas y Postulaciones (30 minutos)

```
OfertasAdminScreen.tsx
├── CRUD de ofertas
├── Ver postulantes por oferta
└── Cambiar estado de oferta

PostulacionesAdminScreen.tsx
├── Vista global de postulaciones
├── Filtros avanzados
└── Cambiar estado masivamente (opcional)
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### RECLUTADOR - Postulaciones

- [ ] Crear componente `PostulacionesReclutadorScreen.tsx`
- [ ] Importar APIs de postulación
- [ ] Tab o selector de oferta
- [ ] Cargar postulantes usando `getPostulacionesByOferta`
- [ ] Mostrar lista expandible
- [ ] Modal para ver datos del aspirante
- [ ] Modal para editar estado + comentarios
- [ ] Validaciones (estado puede cambiar solo a estados válidos)
- [ ] Feedback visual de cambios
- [ ] Agregar a `ReclutadorNavigator`

### ADMINISTRADOR - Aspirantes

- [ ] Crear `AspirantesAdminScreen.tsx`
- [ ] Crear `AspiranteDetailAdminModal.tsx`
- [ ] Crear `CrearEditarAspiranteModal.tsx`
- [ ] Implementar búsqueda
- [ ] Implementar filtros
- [ ] CRUD completo
- [ ] Mostrar hoja de vida (referencia a HojaDeVidaScreen)
- [ ] Agregar a `AdminNavigator` o `AdminDrawer`

### ADMINISTRADOR - Reclutadores

- [ ] Similar a aspirantes
- [ ] Mostrar empresa asociada
- [ ] Poder cambiar empresa

---

## 🛠 HERRAMIENTAS Y ARCHIVOS ÚTILES

### Componentes Reutilizables Disponibles

```typescript
// En movil/src/components/
Button.tsx           // Botón con múltiples variantes
Input.tsx            // Input de texto
DatePicker.tsx       // Selector de fecha (creado en esta sesión)
Picker.tsx           // Dropdown (creado en esta sesión)
Loading.tsx          // Spinner
EmptyState.tsx       // Estado vacío

// En movil/src/api/
postulacion.ts       // APIs de postulación
aspirante.ts         // APIs de aspirante
reclutador.ts        // APIs de reclutador
oferta.ts            // APIs de oferta
hojaVida.ts          // APIs de hoja de vida
```

### Temas y Estilos

```typescript
// En movil/src/styles/theme.ts
colors       // Colores primarios, secundarios, etc.
spacing      // Espaciados (xs, sm, md, lg, xl, xxl)
fontSize     // Tamaños de fuente
fontWeight   // Pesos de fuente
shadows      // Sombras predefinidas
borderRadius // Radios de borde
globalStyles // Estilos globales
```

---

## 🔄 FLUJOS DE NAVEGACIÓN

### RECLUTADOR

```
ReclutadorNavigator (TabNavigator)
├── Dashboard
├── Mis Ofertas
│   ├── Lista de mis ofertas
│   └── Al clickear oferta → PostulacionesReclutadorScreen
├── Crear Oferta
└── Perfil
```

**Nueva pantalla:**
- `PostulacionesReclutadorScreen` - Mostrar postulantes por oferta

### ADMINISTRADOR

```
AdminNavigator (DrawerNavigator o TabNavigator)
├── Dashboard
├── Usuarios
│   ├── AspirantesAdminScreen (nueva)
│   ├── ReclutadoresAdminScreen (nueva)
│   └── Detalles (modal)
├── Ofertas (existente, mejorar)
├── Postulaciones (nueva)
└── Reportes (opcional)
```

---

## 🧪 TESTING LOCAL

Antes de hacer push:

```bash
# 1. Limpiar caché
expo start --clear

# 2. Probar en dispositivo/emulador
# Navegar por cada pantalla
# Probar CRUD completo
# Verificar que los datos se guardan

# 3. Verificar errores en console
# No debe haber red errors (usar IP correcta)
# No debe haber errores de tipos TypeScript
```

---

## 🐛 PROBLEMAS CONOCIDOS A RESOLVER

1. **Caché de AuthContext** - Necesita mejora para manejar cambios de datos después de actualizaciones
2. **Paginación** - Las listas grandes pueden ser lentas
3. **Validaciones** - Pueden mejorase en el lado del servidor
4. **Imágenes de perfil** - No implementado aún

---

## 📚 REFERENCIAS

### Backend Endpoints Disponibles

Ver carpeta `backend/pruebas-crud.ps1` para ver todos los endpoints.

Principales:
```
POST   /api/aspirante/public                  - Registro aspirante
POST   /api/postulacion                       - Crear postulación
PUT    /api/postulacion/{id}                  - Cambiar estado
GET    /api/postulacion/reclutador/{id}       - Ver postulantes
GET    /api/oferta                            - Todas las ofertas
GET    /api/oferta/{id}                       - Detalle oferta
```

### Documentación

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 TIPS

1. **Reutilizar componentes:** Los modales para CRUD están implementados en HojaDeVidaScreen.tsx - usar como referencia
2. **API consistency:** Todos los endpoints retornan el mismo formato, mantener consistencia
3. **Error handling:** Siempre usar Alert.alert() para errores
4. **Loading states:** Usar prop `loading` en Button y componente Loading
5. **Validaciones:** Validar en cliente antes de enviar al servidor

---

## 📞 CONTACTO

Si necesitas ayuda o tienes preguntas sobre la arquitectura, refer a:
- Diagrama en `DIAGNOSTICO_APP_MOVIL.md`
- Progreso en `PROGRESO_SESION_ACTUAL.md`
- Código existente como referencia

---

**¡Que disfrutes la implementación!** 🚀

