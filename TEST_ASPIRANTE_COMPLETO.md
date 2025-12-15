# 🚀 Cómo Testear ASPIRANTE - Paso a Paso

## ⚡ Quick Start

### 1. Backend
```bash
# En terminal de backend
cd backend
mvn clean spring-boot:run
# Espera hasta ver "Started WorkableApplication"
```

### 2. Frontend (nueva terminal)
```bash
# En terminal de la app
cd movil
expo start --clear
# Presiona 'i' para iOS o 'a' para Android
# O escanea con Expo Go
```

### 3. Limpiar Datos (Opcional)
Si quieres empezar desde cero:
```bash
# En la app:
# Ir a Perfil → Logout
# Cierra la app completamente
# Abre de nuevo y login
```

---

## ✅ Test Checklist - ASPIRANTE

### A. Autenticación
- [ ] Abre la app
- [ ] Ve pantalla de login
- [ ] Ingresa email y contraseña de aspirante
- [ ] Presiona "Inicia Sesión"
- [ ] Llega a pantalla de Ofertas (OfertasListScreen)
- [ ] En bottom nav ves: Ofertas | Postulaciones | Hoja de Vida | Perfil

### B. Hoja de Vida - Estudios
- [ ] Tap en "Hoja de Vida" tab
- [ ] Ves tab "Estudios (0)"
- [ ] Mensaje "No tienes estudios registrados"
- [ ] Botón "+ Agregar Estudio"
- [ ] Tap en el botón → Se abre modal
- [ ] Llena:
  - Institución: "Universidad Nacional de Colombia"
  - Título: "Ingeniería de Sistemas"
  - Nivel: "LICENCIATURA"
  - Inicio: cualquier fecha (2018)
  - En Curso: OFF
  - Fin: 2022
  - Descripción: "Excelente universidad" (opcional)
- [ ] Tap "Guardar"
- [ ] Alert de "Éxito - Estudio creado"
- [ ] Estudio aparece en la lista
- [ ] Contador cambia a "Estudios (1)"

### C. Hoja de Vida - Editar Estudio
- [ ] Tap en el estudio → Se expande
- [ ] Ve detalles: Nivel, Inicio, Fin, Descripción
- [ ] Botones: "Editar" y "Eliminar"
- [ ] Tap "Editar"
- [ ] Modal abre con datos precargados
- [ ] Cambia el título a "Ingeniería en Sistemas"
- [ ] Tap "Guardar"
- [ ] Alert "Éxito - Estudio actualizado"
- [ ] Estudio se actualiza en la lista

### D. Hoja de Vida - Experiencias
- [ ] Tap en tab "Experiencias (0)"
- [ ] Mensaje "No tienes experiencias"
- [ ] Tap "+ Agregar Experiencia"
- [ ] Llena:
  - Puesto: "Desarrollador Junior"
  - Empresa: "TechCorp SAS"
  - Inicio: fecha 1 (2022)
  - Fin: fecha 2 (2023)
  - Descripción: "Desarrollé features en React"
- [ ] Tap "Guardar"
- [ ] Alert de éxito
- [ ] Experiencia aparece

### E. Hoja de Vida - Habilidades
- [ ] Tap en tab "Habilidades (0)"
- [ ] Mensaje "No tienes habilidades"
- [ ] Tap "+ Agregar Habilidad"
- [ ] Llena:
  - Habilidad: "JavaScript"
  - Nivel: "AVANZADO"
- [ ] Tap "Guardar"
- [ ] Habilidad aparece con badge de nivel

### F. Hoja de Vida - Eliminar
- [ ] Tap en estudio → Expande
- [ ] Tap "Eliminar"
- [ ] Alert "¿Eliminar este estudio?"
- [ ] Tap "Eliminar" (rojo)
- [ ] Alert "Éxito - Estudio eliminado"
- [ ] Desaparece de la lista

### G. Hoja de Vida - Pull to Refresh
- [ ] En cualquier tab, desliza hacia abajo
- [ ] Ves spinner
- [ ] Se recarga la lista

### H. Ofertas - Listar
- [ ] Tap en "Ofertas" tab
- [ ] Ves lista de ofertas con:
  - Título de oferta
  - Nombre empresa
  - Salario
- [ ] Scroll funciona

### I. Ofertas - Detalle
- [ ] Tap en una oferta
- [ ] Se abre OfertaDetailScreen con:
  - Título
  - Descripción
  - Requisitos
  - Salario
  - Modalidad
  - Tipo contrato
  - Experiencia requerida
- [ ] Botón "Postularme" en la parte inferior

### J. Postulación - Primera Vez
- [ ] Tap "Postularme"
- [ ] Alert de confirmación
- [ ] Tap "Postularme" nuevamente
- [ ] Alert "Éxito - Postulación creada"
- [ ] Vuelve a OfertasListScreen

### K. Postulación - Validación Duplicado
- [ ] Tap en la misma oferta
- [ ] El botón ahora dice "✓ Ya postulado"
- [ ] Está deshabilitado (no se puede clickear)
- [ ] Intenta clickear - no hace nada

### L. Mis Postulaciones - Listar
- [ ] Tap en "Mis Postulaciones" tab
- [ ] Ves lista con postulaciones:
  - Nombre de oferta
  - Estado (PENDIENTE)
  - Fecha de postulación

### M. Mis Postulaciones - Detalle
- [ ] Tap en una postulación
- [ ] Se abre PostulacionDetailScreen
- [ ] Header con badge "PENDIENTE" (amarillo)
- [ ] Secciones:
  1. **Información de Postulación**
     - ID, Fecha, Estado
  2. **Detalles de la Oferta**
     - Descripción, Requisitos, Salario, etc.
  3. **Comentarios del Reclutador**
     - (Vacío si no hay comentarios)
  4. **Estado Info**
     - Información según el estado

### N. Perfil
- [ ] Tap en "Perfil" tab
- [ ] Ves datos personales:
  - Nombre y Apellido
  - Email
  - Teléfono
  - Dirección
  - Municipio
  - Documento
  - Género, Estado Civil, Nacimiento

### O. Logout
- [ ] En Perfil, scroll hacia abajo
- [ ] Botón "Cerrar Sesión"
- [ ] Tap → Logout
- [ ] Vuelve a pantalla de login

---

## 🎯 Resultado Esperado

Si todo funciona:
- ✅ Puedes crear/editar/eliminar estudios
- ✅ Puedes crear/editar/eliminar experiencias
- ✅ Puedes crear/editar/eliminar habilidades
- ✅ Puedes ver ofertas disponibles
- ✅ Puedes postularte a ofertas (sin duplicados)
- ✅ Puedes ver tus postulaciones
- ✅ Puedes ver detalles de postulación
- ✅ Puedes ver tu perfil
- ✅ Puedes logout

**= ASPIRANTE 100% FUNCIONAL ✅**

---

## ⚠️ Si Algo Falla

### "JDBC exception..." / "Unknown column"
✅ Ya fue arreglado. Si aparece de nuevo:
```bash
# Detén el backend
# En application.properties cambia:
spring.jpa.hibernate.ddl-auto=create-drop
# Inicia backend
# Espera 30 segundos
# Cambia de vuelta a:
spring.jpa.hibernate.ddl-auto=update
```

### "Network error" o "Cannot reach server"
- Backend no está corriendo
- IP incorrecta en `movil/src/api/config.ts`
- Firewall bloqueando puerto 8080

### "401 Unauthorized"
- Token expiró
- Logout y login de nuevo
- Limpia caché de expo: `expo start --clear`

### Modal no se abre
- Presiona 'r' en expo para recargar
- Limpia caché: `expo start --clear`
- Revisa console de errores

### Los datos no se guardan
- Verifica validaciones (campos vacíos)
- Revisa console para errores de red
- Asegúrate que todos los campos requeridos están llenos

---

## 📋 Notas Importantes

1. **Primera carga puede ser lenta** - Es normal, especialmente la primera vez
2. **Pull to refresh refresca datos del servidor** - Útil para sincronizar
3. **Botón pasa de "Postularme" a "✓ Ya postulado"** - Indicador visual
4. **Estados son color-coded:**
   - 🟡 PENDIENTE
   - 🟢 ACEPTADO
   - 🔴 RECHAZADO
5. **Todas las operaciones tienen confirmación** - Para evitar cambios accidentales

---

## 🎉 Una Vez Completado

Si todo funciona correctamente, ASPIRANTE está **100% LISTO**.

Próximo paso: **RECLUTADOR - Gestión de Postulaciones**

Ver: `GUIA_CONTINUACION_MOVIL.md` para próximas tareas.

---

**¡Buen testing! 🚀**
