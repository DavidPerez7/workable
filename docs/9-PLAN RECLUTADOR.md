## Plan: Simplificar Reclutador por Primitives

Reducir de forma real el JSX y CSS repetido del módulo reclutador creando primitives reutilizables y moviendo la lógica específica a cada página. La meta no es “un CSS único”, sino una base pequeña y componentes comunes que permitan que cada página conserve solo su contenido y reglas excepcionales.

**Steps**
1. Auditar el módulo reclutador y clasificar la repetición por tipo. Identificar qué es layout compartido, qué es UI repetida y qué es lógica única. Marcar como candidatos de extracción los patrones de tarjeta, encabezado, formularios, alertas, estados vacíos/carga y grupos de acciones. *Depende de la revisión previa ya realizada; es el mapa de trabajo para las siguientes fases.*
2. Crear primitives de UI de reclutador en una carpeta compartida. Recomendación: `frontend/web/src/pages/ReclutadorPage/components/` o `frontend/web/src/components/reclutador/` para separar de páginas. Los candidatos mínimos son `ReclutadorCard`, `ReclutadorSectionHeader`, `ReclutadorFormField`, `ReclutadorButton`, `ReclutadorAlert`, `ReclutadorEmptyState`, `ReclutadorLoadingState` y `ReclutadorActionRow`. *Depende del paso 1.*
3. Reducir `ReclutadorGlobal.css` a solo estructura base y tokens. Debe contener únicamente variables, shell/layout, contenedores comunes y un set mínimo de utilidades compartidas; todo lo demás que sea específico de una página debe salir de ahí. *Depende del paso 2 para evitar duplicar estilos nuevos.*
4. Migrar primero las páginas más repetidas en formulario y acciones. Prioridad recomendada: `ConfigPage`, `RegistrarEmpresa`, `PublicacionPage`, `EditarOfertaLaboral`. Reemplazar el markup repetido por los primitives del paso 2. *Depende de los pasos 2 y 3.*
5. Migrar las páginas de detalle y listado. Prioridad: `EnterprisePage`, `GestigOferts`, `OfertaCompletaPage`, `ReclutadorProfile`, `ProfileEditPage`, `InfoRecPage`. Reusar tarjetas, encabezados, estados y botones compartidos. *Depende de los pasos 2 y 3.*
6. Normalizar el CSS residual por página. Después de la migración, cada CSS de página debe quedar solo con excepciones reales: composición específica, media queries particulares, detalles visuales únicos o layouts muy propios. Si una clase ya quedó genérica, debe moverse fuera del archivo de página. *Depende de los pasos 4 y 5.*
7. Eliminar duplicación heredada y archivos de respaldo. Revisar `ReclutadorPage-old.jsx`, `ReclutadorPage-backup.jsx`, `ReclutadorPage-refactor.jsx`, `ReclutadorPage-charts.jsx`, `ReclutadorPage-old.css` y otros artefactos legacy para decidir si se archivan, se vacían o se dejan solo como histórico, sin seguir participando en rutas activas. *Depende de los pasos 4 a 6 para no romper referencias activas.*
8. Ajustar componentes genéricos existentes o reemplazarlos si no sirven como primitives reales. `Buttons.jsx` y `OfertaCard.jsx` deben evaluarse críticamente: si no cubren el patrón deseado, se rehacen o se dejan de usar. La decisión debe priorizar simplicidad y reutilización real, no solo reusar por reusar. *Depende del paso 1 y de la migración inicial de primitives.*
9. Consolidar patrones de datos repetidos en páginas de CRUD. Donde haya formularios muy parecidos entre empresa y oferta, extraer helpers de transformación y defaults para evitar duplicar normalización de payloads, validaciones básicas y mapeos de estado. *Depende de los pasos 2 a 5.*
10. Validar funcionalidad y regresión visual. Ejecutar checks de sintaxis en cada archivo migrado, revisar el flujo de navegación del reclutador, verificar que header/sidebar sigan funcionando y que las páginas críticas no pierdan campos ni acciones. *Depende de los pasos anteriores.*

**Relevant files**
- `frontend/web/src/pages/ReclutadorPage/ReclutadorLayout.jsx` — layout base ya centralizado; sirve como contenedor de las nuevas primitives.
- `frontend/web/src/pages/ReclutadorPage/ReclutadorGlobal.css` — debe convertirse en base mínima de shell y tokens.
- `frontend/web/src/pages/ReclutadorPage/ConfigPage/ConfigPage.jsx` — buen candidato para extraer alertas, cards y acciones.
- `frontend/web/src/pages/ReclutadorPage/RegistarEmpresa/RegistrarEmpresa.jsx` — concentra formulario repetido y categorías; ideal para `FormField`.
- `frontend/web/src/pages/ReclutadorPage/PublicacionPage/PublicacionPage.jsx` — formulario grande con estados y botones comunes.
- `frontend/web/src/pages/ReclutadorPage/PublicacionPage/EditarOfertaLaboral/EditarOfertaLaboral.jsx` — repite casi el mismo patrón de creación/edición.
- `frontend/web/src/pages/ReclutadorPage/EnterprisePage/EnterprisePage.jsx` — mezcla hero, card y listado; útil para cards, headers y list items.
- `frontend/web/src/pages/ReclutadorPage/GestigOfertsPage/GestigOferts.jsx` — listado con acciones; candidata para `ActionRow` y estados compartidos.
- `frontend/web/src/pages/ReclutadorPage/ReclutadorProfilePage/ReclutadorProfile.jsx` — reutiliza tarjetas y acciones.
- `frontend/web/src/pages/ReclutadorPage/ProfileEditPage/ProfileEditPage.jsx` — la más grande; debe beneficiarse de `FormField`, `Card` y estados comunes.
- `frontend/web/src/pages/ReclutadorPage/OfertaCompletaPage/OfertaCompletaPage.jsx` — detalle con loading/error/acción; útil para primitives de estado.
- `frontend/web/src/components/Buttons/Buttons.jsx` — componente existente que probablemente necesite rehacerse o retirarse.
- `frontend/web/src/components/OfertaCard/ofertaCard.jsx` — componente existente que puede servir para listado, pero hoy está demasiado específico.
- `frontend/web/src/components/SidebarReclutador/SidebarReclutador.jsx` — verificación final de navegación y botón de perfil.
- `frontend/web/src/components/HeaderReclutador/HeaderReclutador.jsx` — debe mantenerse minimalista tras la limpieza.

**Verification**
1. Corrobar que cada primitive nuevo tenga una sola responsabilidad y no vuelva a meter estilos específicos de una página.
2. Ejecutar validación de errores en todos los archivos migrados después de cada bloque de cambio.
3. Revisar que las páginas migradas sigan renderizando los mismos campos, botones y flujos principales.
4. Comparar el número de clases CSS por página antes y después para confirmar reducción real.
5. Confirmar que no queden importaciones de componentes legacy sin uso en las páginas activas.
6. Verificar que los archivos legacy no sigan siendo parte del flujo activo de rutas.

**Decisions**
- El objetivo no es unificar todo en un solo CSS enorme, sino construir primitives comunes y dejar la página con lo específico.
- Los archivos legacy del reclutador no deben seguir guiando el diseño del módulo activo.
- `CrudEntityPage` en admin sirve como referencia de abstracción, pero no se copiará tal cual; el reclutador necesita componentes más pequeños y visualmente simples.
- `Buttons.jsx` y `OfertaCard.jsx` no se consideran reutilización suficiente por sí solos; se evalúan como candidatos, no como solución final.

**Further Considerations**
1. Primera migración recomendada: `RegistrarEmpresa` y `PublicacionPage`, porque comparten la mayor cantidad de patrón de formulario.
2. Segunda migración recomendada: `ConfigPage` y `ProfileEditPage`, porque concentran acciones, alertas y campos repetidos.
3. Tercera migración recomendada: `EnterprisePage` y `GestigOferts`, porque permiten extraer tarjetas y estados de listados.
