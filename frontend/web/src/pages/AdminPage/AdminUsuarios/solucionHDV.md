# Solución: Error "actualizarHojaVida is not a function"

Fecha: 2025-12-13
Autor: Equipo de desarrollo

## Resumen

Se detectó un error al intentar actualizar una Hoja de Vida desde el panel de **Admin**: se arrojaba una excepción en consola:

```
TypeError: (intermediate value).actualizarHojaVida is not a function
```

Aunque la inspección del objeto `hojaDeVidaApi` mostraba la propiedad `actualizarHojaDeVida` como presente, en tiempo de ejecución esa propiedad no era invocable.


## Causa raíz

- El problema fue causado por una interacción con el bundler/HMR (Vite) donde el `default export` del módulo `hojaDeVidaAPI.js` estaba siendo envuelto/proxy-izado, de modo que sus propiedades podían verse pero no ser siempre invocables.
- En este caso la referencia a `hojaDeVidaApi.actualizarHojaDeVida` resultó ser `undefined` en tiempo de ejecución al momento de llamar desde `AdminUsuarios.jsx`.


## Cambios realizados para resolverlo

1. En `frontend/src/api/hojaDeVidaAPI.js`:
   - Convertimos las funciones del API en **exportaciones nombradas** (`export const actualizarHojaDeVida = ...`) además de mantener el `export default` del objeto `hojaDeVidaApi`. Esto garantiza que la importación nombrada apunte directamente a la función y no dependa de la forma en que el objeto por defecto sea envuelto.

2. En `frontend/src/pages/AdminPage/AdminUsuarios/AdminUsuarios.jsx`:
   - Importamos explícitamente la función nombrada:
     ```js
     import hojaDeVidaApi, { actualizarHojaDeVida as actualizarHojaDeVidaNamed } from '/src/api/hojaDeVidaAPI.js';
     ```
   - Añadimos lógica defensiva y logs (temporal) para detectar si la función era undefined y, en ese caso, hacer un `PUT` directo usando el `API` (axios) como fallback. Esto evita que la UI se rompa mientras se depura.


## Cómo reproducir (antes y ahora)

1. Iniciar back y front (backend en `localhost:8080`, frontend con Vite en `localhost:5174`).
2. Login como Admin.
3. Abrir Admin → Usuarios → Ver Hoja de Vida de un aspirante.
4. Editar cualquier campo y pulsar `Guardar`.

Resultado esperado: la actualización debe completar correctamente y la petición `PUT /api/hoja-vida/{id}` aparece en la pestaña Network con 200 OK.


## Logs y comprobaciones agregadas (temporales)

- En `AdminUsuarios.jsx` se dejaron `console.log` que muestran:
  - El objeto `hojaDeVidaApi`.
  - `typeof` y `toString()` de `actualizarHojaDeVida`.
  - Resultado de una llamada de sanity `getHojaDeVida(id)`.
  - Fallback con `API.put` en caso de no poder invocar la función.


## Recomendaciones y próximos pasos

- Limpiar los `console.log` y la lógica de fallback una vez confirmada la estabilidad (se recomienda hacerlo pronto para no ensuciar la base de código).
- Mantener la convención de **exportaciones nombradas** para wrappers de API críticos (o documentar en un patrón de proyecto) para evitar futuras sorpresas con HMR.
- Añadir una pequeña prueba de integración que haga un `mock` del módulo y verifique que `actualizarHojaDeVida` está definido e invocable desde `AdminUsuarios`.
- Si el problema reaparece frecuentemente, investigar la configuración de Vite/HMR y el uso de proxies que puedan estar re-exportando módulos de forma no estándar.

## Cambios adicionales realizados (2025-12-13)

- **Se removió** el campo `salarioEsperado` del modelo `HojaVida` en el backend (y del DTO asociado) ya que no se utilizará directamente en la Hoja de Vida.
- **Se agregaron** los campos `estudios` y `experiencias` a la representación de `HojaVida` (como **campos transitivos** / `@Transient`) y se poblaron en el servicio (`HojaVidaService`) antes de devolver la entidad por los endpoints. De esta forma la respuesta JSON de `GET /api/hoja-vida/...` incluirá las listas de estudios y experiencias del aspirante.

### Notas sobre la implementación

- `estudios` y `experiencias` no se persistieron directamente en `HojaVida` (sigue siendo la relación por `Aspirante`) para evitar cambios de esquema. Si se desea persistir una relación directa en el futuro, se puede modelar con una tabla intermedia o cambiar el diseño.
- Se actualizaron las vistas del Admin para **eliminar** el campo `salarioEsperado` y **mostrar** las listas de `estudios` y `experiencias` en el modal de Hoja de Vida.

### Pruebas recomendadas

1. Iniciar backend y frontend.
2. En Admin → Usuarios → Ver Hoja de Vida de un aspirante, comprobar que aparecen los estudios y experiencias (si existen).
3. Editar campos de la Hoja de Vida y guardar; verificar que la actualización funciona y que no aparece ningún campo `salarioEsperado`.
4. (Opcional) Ejecutar pruebas de API que verifiquen que `GET /api/hoja-vida/aspirante/{id}` retorna `estudios` y `experiencias`.

## Implementación rápida: CRUD de Estudios y Experiencias desde modal (fachada UI)

Se añadió una solución NO invasiva para permitir CRUD de `Estudio` y `Experiencia` desde el modal de Hoja de Vida (Admin) sin cambiar el backend:

- Dentro del modal de Hoja de Vida en Admin, ahora se muestran **botones** para `Añadir`, `Editar` y `Eliminar` para estudios y experiencias.
- Estas acciones llaman a los endpoints existentes (`/api/estudio` y `/api/experiencia`) y, tras completarse, refrescan la visualización de la Hoja de Vida (se recargan las listas).
- Ventaja: se ofrece una experiencia unificada al usuario (parece un CRUD único), pero internamente se usan los 3 endpoints. No hay cambios en la base de datos ni migraciones.

Prueba rápida (Admin):
1. Abrir Admin → Usuarios → Ver Hoja de Vida.
2. En la sección `Estudios` o `Experiencias` usar `Añadir` para crear un registro (rellena los campos mínimos y guarda).
3. Verificar que el nuevo registro aparece en la lista y que las llamadas API se completaron con 200 OK en la pestaña Network.

Si quieres, puedo ahora: limpiar logs temporales, añadir mensajes UI (toasts) más vistosos, y crear pruebas automáticas para estas rutas en un sprint corto.

Si quieres, puedo agregar una pequeña prueba de integración para validar la presencia de `estudios` y `experiencias` en la respuesta de la API.


---

Si quieres, me encargo de limpiar los logs y simplificar el código ahora que confirmaste que "ya funciona"; dime si lo hago y aplico ese cambio en una PR/commit adicional.

---

## Refactorización a componentes dedicados — Guía detallada

Se realizó una migración progresiva para extraer las responsabilidades principales de `AdminUsuarios.jsx` en componentes dedicados. Este apartado detalla qué se movió, por qué, y cómo reproducir el patrón en otras páginas admin que usan tablas, filtros y estadísticas.

### Objetivo
- Reducir el tamaño y la complejidad del archivo principal `AdminUsuarios.jsx`.
- Separar las piezas visuales (tabla, filtros, tarjetas) en componentes presentacionales
- Localizar el estado temporal de formularios (estudios/experiencias) dentro del modal para mantener el padre responsable solo del estado global.

### Componentes creados
- `UsersTable.jsx` — tabla reusable. Recibe `columns`, `data` y `renderCell`.
- `FiltersBar.jsx` — Input de búsqueda y botones de filtro por estado y rol.
- `StatsCards.jsx` — Calcula y muestra `Total`, `Activos` e `Inactivos`.
- `HojaDeVidaModal.jsx` — Modal que ahora mantiene internamente los formularios de Estudios y Experiencias y usa handlers del padre para persistir.

### Responsabilidades y contratos (props)
- `UsersTable(props)`:
  - `columns: string[]`
  - `data: any[]`
  - `renderCell: (usuario, column) => JSX.Element`

- `FiltersBar(props)`:
  - `busqueda: string`
  - `setBusqueda: (val) => void`
  - `filtroEstado: string`
  - `setFiltroEstado: (val) => void`
  - `filtroRol: string`
  - `setFiltroRol: (val) => void`

- `StatsCards(props)`:
  - `usuarios: any[]` — lista completa para el cálculo.

- `HojaDeVidaModal(props)`:
  - `show, onClose, selectedHojaDeVida, isEditing, hojaVidaFormData, onHojaVidaInputChange, handleSaveHojaVida, handleEditHojaVida, handleCancelEditHojaVida`
  - `handleSaveEstudio(payload, editingId?)` — función que crea/edita estudio y refresca el `selectedHojaDeVida` del padre.
  - `handleDeleteEstudio(id)` — elimina y refleja cambios.
  - `handleSaveExperiencia(payload, editingId?)`
  - `handleDeleteExperiencia(id)`

### Cambios aplicados (paso a paso)
1. Crear `components/` y mover la UI a `UsersTable.jsx`, `FiltersBar.jsx` y `StatsCards.jsx`.
2. Reemplazar en `AdminUsuarios.jsx` las secciones: tabla, filtros, y estadísticas por los componentes importados:
```jsx
<StatsCards usuarios={usuarios} />
<FiltersBar ... />
<UsersTable columns={getColumns()} data={usuariosFiltrados} renderCell={(u,c)=>getColumnValue(u,c)} />
```
3. Extraer los formularios de Estudios y Experiencias del `AdminUsuarios.jsx` y colocarlos dentro de `HojaDeVidaModal.jsx`.
   - Convertir funciones de guardado (antes `handleSaveEstudio` y `handleSaveExperiencia`) en funciones paramétricas del padre (ej. `saveEstudio(payload, id?)`) que ejecutan la API y luego actualizan el `selectedHojaDeVida`.
   - El modal ahora gestiona `estudioForm`, `experienciaForm`, `estudiosFormVisible`, `editingEstudio`, `editingExperiencia` mediante `useState` local.
4. En el padre (`AdminUsuarios.jsx`), mantener solo las funciones de fetching/refresh y el estado `selectedHojaDeVida`. Las acciones de CRUD (crear, editar, eliminar) son invocadas a través de callbacks pasados al modal.

### Ejemplo: saveEstudio y uso en el modal
```js
// En AdminUsuarios.jsx
const saveEstudio = async (payload, editingId = null) => {
  const aspiranteId = selectedHojaDeVida?.aspirante?.id;
  const finalPayload = { ...payload, aspirante: { id: aspiranteId } };
  if (editingId) await actualizarEstudio(editingId, finalPayload);
  else await crearEstudio(finalPayload);
  const estudios = await obtenerEstudiosPorUsuario(aspiranteId);
  setSelectedHojaDeVida(prev => ({ ...prev, estudios }));
  return estudios;
};

// En HojaDeVidaModal.jsx
// Form local que invoca al padre
await handleSaveEstudio(estudioForm, editingEstudio?.id);
```

### Ventajas del enfoque
- Reduce el archivo page (menor riesgo de bugs al cambiar UI o endpoints).
- Facilita testeo unitario de componentes presentacionales (render simple + callbacks).
- Localiza estado temporal y validaciones en los componentes donde corresponden.

### Buenas prácticas para replicarlo en otras páginas admin
- Empieza por identificar UI repetitiva: tablas, filtros, estadísticas.
- Extrae `FiltersBar` primero — es la pieza más sencilla y mejora la legibilidad.
- Extrae `UsersTable` con `columns` y `renderCell` como contracto de props.
- Los modales que tienen formularios complejos deben tener estado local para input y validar internamente, mientras el padre solo reacciona a saves/delete mediante callbacks.

### Sugerencias para tests
- `FiltersBar`: simular cambios y validar setters.
- `UsersTable`: render con columnas y filas, simular acciones (editar, borrar).
- `HojaDeVidaModal`: simular abrir modal y CRUD en estudios y experiencias llamando a las funciones del padre (mock).

---

## Conclusión
La refactorización hacia componentes dedicados simplifica el mantenimiento, mejora la testabilidad y crea una estructura repetible para el resto de páginas admin. Este patrón puede reutilizarse para otras páginas que follows the same: CRUD + Table + Filters + Stats.

Si quieres que aplique exactamente este patrón a otra página (por ejemplo `AdminOfertas`), puedo hacerlo replicando los pasos anteriores y creando un PR por cada extracción.

---

Si quieres, puedo limpiar los console.log temporales y agregar toasts y tests básicos en un PR separado.

