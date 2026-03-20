## Plan: Simplificar Aspirante por Primitives

Reducir de forma real el JSX y CSS repetido del módulo aspirante creando solo las primitives que realmente bajen código y moviendo la lógica específica a cada página. La meta no es sumar capas, sino dejar una base pequeña de componentes comunes y usar elementos nativos cuando eso sea más corto y claro.

**Steps**
1. Auditar el módulo aspirante y clasificar la repetición por tipo. Identificar qué es layout compartido, qué es UI repetida y qué es lógica única. Marcar como candidatos de extracción los patrones de hero, tarjetas de acción, formularios, alertas, estados vacíos/carga, listados, badges, botones y bloques de detalle. También revisar qué parte de `Header` y `SidebarAspirante` debe quedarse común y qué parte es específica de búsqueda del aspirante. *Depende de la revisión previa ya realizada; es el mapa de trabajo para las siguientes fases.*
2. Crear solo las primitives que de verdad reduzcan JSX repetido en varias pantallas. Recomendación: `frontend/web/src/components/aspirante/` para separar de páginas. Los candidatos mínimos son `AspiranteCard`, `AspiranteSectionHeader`, `AspiranteFormField`, `AspiranteButton` y `AspiranteAlert`. Estados simples como loading, empty y badges deben preferir HTML nativo con clases compartidas si eso evita archivos y capas extra. *Depende del paso 1.*
3. Reducir los CSS por página a estructura base y tokens reutilizables. El objetivo es que cada archivo de estilos conserve solo variables, shell/layout, contenedores comunes y un set mínimo de utilidades compartidas; todo lo específico de una página debe salir de ahí. `AspirantePage.css` y los CSS de subpáginas deben dejar de repetir las mismas bases visuales. *Depende del paso 2 para evitar duplicar estilos nuevos.*
4. Migrar primero la página principal y el bloque de navegación del aspirante. Prioridad recomendada: `AspirantePage`, `SidebarAspirante` y la zona de acciones rápidas. Reemplazar el markup repetido por las primitives mínimas del paso 2 y dejar loading/empty/badges como markup simple si eso evita código extra. *Depende de los pasos 2 y 3.*
5. Migrar las páginas de perfil y edición. Prioridad: `MiPerfil`, `ActualizarPerfil` y `EliminarPerfil`. Reusar tarjetas, encabezados, campos, alertas, botones y confirmaciones compartidas. Si el formulario de edición y el borrado comparten estados o acciones, sacar helpers comunes para evitar duplicación. *Depende de los pasos 2 y 3.*
6. Migrar la hoja de vida y sus subbloques internos. Prioridad: `HojaDeVida`. Reusar primitives para secciones, listas, tarjetas, formularios, botones de eliminación, estados vacíos y mensajes de validación. Las secciones de estudios y experiencias deben compartir la misma base visual y dejar solo sus diferencias de contenido. *Depende de los pasos 2 a 5.*
7. Migrar el listado de postulaciones y sus estados. Prioridad: `MisPostulaciones`. Extraer solo badge de estado, tarjeta de postulación, bloque de citación y acciones; los estados vacíos/carga deben quedarse simples si una primitive no reduce realmente el código. *Depende de los pasos 2 a 5.*
8. Normalizar el CSS residual por página. Después de la migración, cada CSS de página debe quedar solo con excepciones reales: composición específica, media queries particulares, detalles visuales únicos o layouts muy propios. Si una clase ya quedó genérica, debe moverse fuera del archivo de página. *Depende de los pasos 4 a 7.*
9. Consolidar patrones de datos y transformación en helpers reutilizables. Donde haya normalización de fechas, armado de payloads, mapeo de estudios/experiencias, o lógica de confirmación/borrado, extraer funciones comunes para evitar duplicación entre `ActualizarPerfil`, `HojaDeVida` y `EliminarPerfil`. *Depende de los pasos 5 a 7.*
10. Validar funcionalidad y regresión visual. Ejecutar checks de sintaxis en cada archivo migrado, revisar el flujo de navegación del aspirante, verificar que `Header` y `SidebarAspirante` sigan funcionando y que las páginas críticas no pierdan campos, acciones ni estados importantes. *Depende de los pasos anteriores.*

**Relevant files**
- `frontend/web/src/pages/AspirantePage/AspirantePage.jsx` — página principal con búsqueda, filtros, listado y detalle de ofertas.
- `frontend/web/src/pages/AspirantePage/AspirantePage.css` — base visual principal del módulo aspirante; hoy concentra muchos patrones repetidos.
- `frontend/web/src/pages/AspirantePage/MiPerfil/MiPerfil.jsx` — perfil del aspirante con hero, tarjetas y acciones rápidas.
- `frontend/web/src/pages/AspirantePage/MiPerfil/MiPerfil.css` — estilos del perfil; buen candidato para extraer cards, badges y acciones.
- `frontend/web/src/pages/AspirantePage/MiPerfil/ActualizarPerfil/ActualizarPerfil.jsx` — formulario de edición con campos repetidos y estados de alerta.
- `frontend/web/src/pages/AspirantePage/MiPerfil/ActualizarPerfil/ActualizarPerfil.css` — estilos de formulario y botones compartibles.
- `frontend/web/src/pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida.jsx` — pantalla más grande y repetitiva; mezcla resumen, estudios y experiencias.
- `frontend/web/src/pages/AspirantePage/MiPerfil/HojaDeVida/HojaDeVida.css` — contiene muchas bases reutilizables para cards, formularios, listas y empty states.
- `frontend/web/src/pages/AspirantePage/MiPerfil/MisPostulaciones/MisPostulaciones.jsx` — listado de postulaciones con estados, citaciones y acciones.
- `frontend/web/src/pages/AspirantePage/MiPerfil/MisPostulaciones/MisPostulaciones.css` — estilos del listado y badges de estado.
- `frontend/web/src/pages/AspirantePage/MiPerfil/EliminarPerfil/EliminarPerfil.jsx` — flujo de borrado con confirmación y validaciones.
- `frontend/web/src/pages/AspirantePage/MiPerfil/EliminarPerfil/EliminarPerfil.css` — estilos del modal/card de eliminación.
- `frontend/web/src/components/SidebarAspirante/SidebarAspirante.jsx` — navegación lateral común del aspirante.
- `frontend/web/src/components/SidebarAspirante/SidebarAspirante.css` — estilos de la navegación lateral.
- `frontend/web/src/components/Header/Header.jsx` — header compartido; contiene la búsqueda específica de aspirante y debe mantenerse controlado.

**Verification**
1. Corroborar que cada primitive nuevo tenga una sola responsabilidad y no vuelva a meter estilos específicos de una página.
2. Ejecutar validación de errores en todos los archivos migrados después de cada bloque de cambio.
3. Revisar que las páginas migradas sigan renderizando los mismos campos, botones, alertas y flujos principales.
4. Comparar el número de clases CSS por página antes y después para confirmar reducción real.
5. Confirmar que no queden importaciones de componentes legacy sin uso en las páginas activas.
6. Verificar que `Header` y `SidebarAspirante` sigan funcionando sin romper la navegación ni la búsqueda del aspirante.

**Decisions**
- El objetivo no es unificar todo en un solo CSS enorme, sino construir solo las primitives que reduzcan líneas y dejar la página con lo específico.
- Si una abstraction agrega más archivos o imports que líneas ahorra, no se conserva.
- `Header` y `SidebarAspirante` se consideran base compartida, no componentes descartables, pero deben simplificarse si acumulan lógica duplicada.
- La búsqueda del aspirante dentro del header puede mantenerse como excepción funcional, pero el resto del layout debe quedar reusable.
- Los archivos legacy o variantes antiguas del aspirante no deben seguir guiando el diseño del módulo activo.
- La prioridad es simplicidad mantenible, no reutilización forzada.

**Further Considerations**
1. Primera migración recomendada: `ActualizarPerfil` y `MiPerfil`, porque comparten campos, cards, acciones y estados comunes.
2. Segunda migración recomendada: `HojaDeVida`, porque concentra el mayor volumen de JSX y CSS repetido.
3. Tercera migración recomendada: `MisPostulaciones` y `EliminarPerfil`, porque permiten extraer solo lo que realmente se repite sin inflar el árbol de componentes.
