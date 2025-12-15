# 🧪 PLAN DE PRUEBAS - APLICACIÓN MÓVIL WORKABLE

## 📋 CHECKLIST DE VALIDACIÓN POST-CORRECCIÓN

### ✅ PRUEBAS CRÍTICAS (OBLIGATORIAS)

#### 🔐 Autenticación
- [ ] **Login ASPIRANTE** - Sesión persiste al recargar app
- [ ] **Login RECLUTADOR** - Sesión persiste al recargar app  
- [ ] **Login ADMIN** - Sesión persiste al recargar app
- [ ] **Logout** - Borra sesión correctamente y redirige a login
- [ ] **Token expirado** - Muestra mensaje y redirige a login (401)

---

### 👤 ASPIRANTE

#### Hoja de Vida
- [ ] **Ver hoja de vida** - Carga datos existentes
- [ ] **Crear estudio** - Modal se abre, campos visibles
- [ ] **Guardar estudio** - Datos se persisten correctamente
- [ ] **Editar estudio** - Modal precarga datos, cambios se guardan
- [ ] **Eliminar estudio** - Confirma y elimina correctamente
- [ ] **Estudio "en curso"** - Switch funciona, fecha fin se deshabilita
- [ ] **Crear experiencia** - Modal funcional, campos obligatorios validados
- [ ] **Guardar experiencia** - Datos se persisten
- [ ] **Editar experiencia** - Cambios se reflejan
- [ ] **Eliminar experiencia** - Elimina correctamente
- [ ] **Agregar habilidad** - Modal con lista de habilidades técnicas
- [ ] **Eliminar habilidad** - Confirma y elimina

#### Ofertas y Postulaciones
- [ ] **Buscar ofertas** - Lista carga correctamente
- [ ] **Ver detalle de oferta** - Muestra información completa
- [ ] **Postularse** - Crea postulación sin duplicados
- [ ] **Ver mis postulaciones** - Lista con estados y comentarios
- [ ] **Ver detalle de postulación** - Estado, fecha, comentarios del reclutador
- [ ] **Pull to refresh** - Actualiza datos en todas las pantallas

---

### 🏢 RECLUTADOR

#### Empresa (CRÍTICO - CORREGIDO)
- [ ] **Ver perfil** - ⚠️ **DEBE MOSTRAR DATOS DE LA EMPRESA**
- [ ] **Nombre empresa visible** - En perfil y ofertas creadas
- [ ] **NIT empresa** - Se muestra correctamente
- [ ] **Sector empresa** - Se muestra correctamente
- [ ] **Editar perfil personal** - Nombre, apellido, teléfono, cargo

#### Ofertas
- [ ] **Crear oferta** - Se asocia a su empresa automáticamente
- [ ] **Ver mis ofertas** - Lista completa
- [ ] **Editar oferta** - Cambios se guardan
- [ ] **Cambiar estado oferta** - ABIERTA/PAUSADA/CERRADA

#### Postulaciones Recibidas (CRÍTICO)
- [ ] **Ver postulantes** - Lista por oferta
- [ ] **Filtrar por estado** - 7 filtros (Todos, Postulado, En Revisión, etc.)
- [ ] **Ver perfil aspirante** - Datos completos visibles
- [ ] **Cambiar estado postulación** - POSTULADO → EN_REVISION → ENTREVISTA → ACEPTADO/RECHAZADO
- [ ] **Agregar comentarios** - Se guardan y son visibles para el aspirante
- [ ] **Badges de conteo** - Números correctos en filtros

---

### 🛡️ ADMINISTRADOR

#### Dashboard (CRÍTICO - CORREGIDO)
- [ ] **Cargar dashboard** - ⚠️ **NO debe mostrar error 500**
- [ ] **Estadísticas aspirantes** - Número correcto
- [ ] **Estadísticas reclutadores** - Número correcto
- [ ] **Estadísticas ofertas** - Total y abiertas
- [ ] **Estadísticas postulaciones** - Total y activas
- [ ] **Tarjetas clicables** - Navegan a gestión correspondiente

#### Gestión de Usuarios
- [ ] **Ver aspirantes** - Lista completa
- [ ] **Ver reclutadores** - Lista completa
- [ ] **Filtrar por tipo** - Aspirantes/Reclutadores
- [ ] **Ver detalle usuario** - Modal con info completa
- [ ] **Eliminar usuario** - Confirma y elimina (⚠️ NO RECOMENDADO EN PRODUCCIÓN)

#### Gestión de Ofertas
- [ ] **Ver todas ofertas** - Lista completa
- [ ] **Filtrar por estado** - Todos/Abierta/Pausada/Cerrada
- [ ] **Ver detalle oferta** - Info completa + reclutador + empresa
- [ ] **Cambiar estado** - Modal funcional
- [ ] **Eliminar oferta** - Zona de peligro

#### Gestión de Postulaciones
- [ ] **Ver todas postulaciones** - ⚠️ **Carga sin error 500**
- [ ] **Filtrar por estado** - 6 filtros
- [ ] **Ver detalle postulación** - Aspirante + Oferta
- [ ] **Cambiar estado** - Picker funcional
- [ ] **Editar comentarios** - Input multilinea
- [ ] **Eliminar postulación** - Zona de peligro

---

## 🔍 PRUEBAS DE REGRESIÓN

### Backend
- [ ] **Endpoints públicos** - Registro, login sin token
- [ ] **Endpoints protegidos** - Requieren token (401 sin él)
- [ ] **Roles ASPIRANTE** - Solo accede a sus propios datos
- [ ] **Roles RECLUTADOR** - Solo gestiona sus ofertas
- [ ] **Roles ADMIN** - Acceso total

### Frontend
- [ ] **Navegación** - Todos los botones funcionan
- [ ] **Modales** - Abren, cierran, guardan correctamente
- [ ] **Validaciones** - Campos obligatorios marcados
- [ ] **Estados vacíos** - Mensajes informativos
- [ ] **Loading states** - Spinners mientras carga
- [ ] **Manejo de errores** - Alerts con mensajes claros

---

## 📊 CRITERIOS DE ACEPTACIÓN

### ✅ PASA SI:
- ✅ Login persiste al recargar app
- ✅ Empresa visible para reclutador
- ✅ Dashboard admin carga sin error 500
- ✅ Hoja de vida se puede crear/editar
- ✅ Postulaciones se gestionan correctamente
- ✅ Todos los CRUDs funcionan

### ❌ FALLA SI:
- ❌ Se cierra sesión automáticamente
- ❌ Reclutador no ve su empresa
- ❌ Error 500 en dashboard
- ❌ No se pueden guardar datos
- ❌ Botones no responden
- ❌ Modales no abren/cierran

---

## 🐛 REPORTE DE BUGS

**Si encuentras un bug, documenta:**

1. **Rol del usuario:** (ASPIRANTE/RECLUTADOR/ADMIN)
2. **Pantalla:** (Dashboard, Hoja de Vida, etc.)
3. **Acción realizada:** (Click en X, guardar formulario, etc.)
4. **Resultado esperado:** (Debería guardar...)
5. **Resultado obtenido:** (Muestra error...)
6. **Mensaje de error:** (Copia exacta del mensaje)
7. **Logs del backend:** (Si hay error 500)

---

## 📞 SOPORTE TÉCNICO

### Comandos útiles para debugging:

**Ver logs del backend:**
```bash
cd backend
./mvnw spring-boot:run | grep ERROR
```

**Ver logs de la app móvil:**
```bash
cd movil
npx expo start
# Presionar 'j' para abrir debugger
```

**Limpiar todo y empezar de nuevo:**
```bash
# Backend
cd backend
./mvnw clean install

# Móvil
cd movil
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

---

## ✅ VALIDACIÓN COMPLETA

**Fecha de prueba:** _______________  
**Probado por:** _______________  
**Estado final:** ❌ FALLA / ⚠️ PARCIAL / ✅ APROBADO

**Notas:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```
