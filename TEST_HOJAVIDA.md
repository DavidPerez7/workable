# ✅ TEST - Hoja de Vida CRUD

## Pasos para Verificar que Todo Funciona

### Paso 1: Asegúrate que estés Autenticado
- [ ] Abre la app
- [ ] Inicia sesión con un aspirante
- [ ] Deberías ver 4 pestañas en la navegación inferior

### Paso 2: Entra a "Hoja de Vida" Tab
- [ ] Click en la pestaña "Hoja de Vida" (la tercera tab en el navegador)
- [ ] Deberías ver 3 pestañas: Estudios | Experiencias | Habilidades

### Paso 3: Crea un Estudio (En la tab "Estudios")
- [ ] Si está vacío, verás "No tienes estudios registrados"
- [ ] Click en "+ Agregar Estudio"
- [ ] Se abre un modal con formulario
- [ ] Llena:
  - Institución: "Universidad Nacional"
  - Título: "Ingeniería de Sistemas"
  - Nivel: "LICENCIATURA"
  - Fecha Inicio: cualquier fecha
  - En Curso: OFF (deseleccionado)
  - Fecha Fin: después de inicio
  - Descripción: "Opcional"
- [ ] Click en "Guardar"
- [ ] Deberías ver una alerta "Éxito - Estudio creado"
- [ ] El estudio aparece en la lista

### Paso 4: Expande el Estudio
- [ ] Click en el card del estudio
- [ ] Se expande mostrando detalles
- [ ] Ves 2 botones: "Editar" y "Eliminar"

### Paso 5: Edita el Estudio
- [ ] Click en "Editar"
- [ ] Se abre modal con datos precargados
- [ ] Cambia algo (ej: título)
- [ ] Click en "Guardar"
- [ ] Alerta de "Éxito - Estudio actualizado"
- [ ] Ves el cambio en la lista

### Paso 6: Crea Más Items (Experiencias)
- [ ] Click en tab "Experiencias"
- [ ] Click en "+ Agregar Experiencia"
- [ ] Llena:
  - Puesto: "Desarrollador Junior"
  - Empresa: "TechCorp"
  - Fecha Inicio: fecha1
  - Fecha Fin: fecha2
  - Descripción: "Opcional"
- [ ] Click en "Guardar"
- [ ] Deberías ver la experiencia en la lista

### Paso 7: Crea Habilidades
- [ ] Click en tab "Habilidades"
- [ ] Click en "+ Agregar Habilidad"
- [ ] Llena:
  - Habilidad: "JavaScript"
  - Nivel: "AVANZADO"
- [ ] Click en "Guardar"
- [ ] Ves la habilidad con un badge de nivel

### Paso 8: Elimina un Item
- [ ] Expande un estudio/experiencia
- [ ] Click en "Eliminar"
- [ ] Aparece confirmación: "¿Eliminar este estudio?"
- [ ] Click en "Eliminar" (rojo)
- [ ] Alerta de "Éxito - Eliminado"
- [ ] Item desaparece de la lista

### Paso 9: Prueba Refresh
- [ ] En cualquier tab, desliza hacia abajo (pull to refresh)
- [ ] Deberías ver spinner
- [ ] Datos se recargan

### Paso 10: Salir y Volver
- [ ] Navega a otra pantalla
- [ ] Vuelve a "Hoja de Vida"
- [ ] Todos los datos que creaste siguen ahí

---

## ⚠️ Si Algo No Funciona

### Error: "No se puede conectar al servidor"
- [ ] Verifica que el backend está corriendo
- [ ] Verifica la IP: `movil/src/api/config.ts` debe tener la IP correcta
- [ ] Por defecto: `http://192.168.20.8:8080/api`

### Error: "Network Error" o "401 Unauthorized"
- [ ] Token de autenticación expiró
- [ ] Cierra la app completamente
- [ ] Inicia nuevamente
- [ ] Inicia sesión de nuevo

### Error: "Internal Server Error"
- [ ] Esto NO debería pasar después del fix
- [ ] Si pasa, significa que las rutas API aún son incorrectas
- [ ] Revisa que `hojaVida.ts` tenga:
  - `api.get('/estudio/aspirante')` ← SIN parámetro
  - `api.get('/experiencia/aspirante')` ← SIN parámetro
  - `api.get('/habilidad/aspirante')` ← SIN parámetro

### El Modal No Se Abre
- [ ] Abre React Native DevTools
- [ ] Busca errores en console
- [ ] Verifica que los componentes están siendo importados correctamente

### Los Datos No Se Guardan
- [ ] Verifica que lleaste todos los campos requeridos
- [ ] Aparece alert de validación? Completa esos campos
- [ ] Revisa la consola de errores

---

## 📊 Checklist Final

Una vez que todo funciona:

- [ ] Puedo crear Estudios
- [ ] Puedo ver Estudios en expandibles
- [ ] Puedo editar Estudios
- [ ] Puedo eliminar Estudios
- [ ] Puedo crear Experiencias
- [ ] Puedo ver/editar/eliminar Experiencias
- [ ] Puedo crear Habilidades
- [ ] Puedo editar Habilidades
- [ ] Puedo eliminar Habilidades
- [ ] Los datos persisten después de cerrar y abrir
- [ ] Pull to refresh funciona
- [ ] No hay errores en la consola

---

**Si todo esto funciona, la Hoja de Vida está ✅ COMPLETAMENTE FUNCIONAL**
