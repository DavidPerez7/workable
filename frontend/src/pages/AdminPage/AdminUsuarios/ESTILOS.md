# Documentación de Estilos Visuales – AdminUsuarios

**Archivo:** `AdminUsuarios.css`

---

## Paleta
- Primario: Azul (`#3B82F6`, `#1D4ED8`)
- Secundario: Gris (`#64748B`, `#A8B3C1`)
- Verde acento: `#10B981`
- Amarillo acento: `#F59E0B`
- Fondo: Blanco, degradados suaves

## Layout
- `.admin-layout`: Flex, columna, 100vh
- `.main-users-manage-UP`: Margen izquierdo (sidebar), padding amplio, fondo degradado
- `.container-users-manage-UP`: Card central, borde redondeado, sombra, padding generoso

## Header
- `.header-section-UP`: Flex, espacio entre título y botón, responsivo
- `.title-users-UP`: Grande, bold, color primario
- `.subtitle-users-UP`: Gris, tamaño medio

## Botón crear
- `.btn-create-UP`: Gradiente azul, blanco, bold, sombra, animación hover

## Estadísticas (Stats Cards)

- `.stats-section-UP`:
## Layout
 `.panel-layout`: Flex, columna, 100vh
 `.panel-main`: Margen izquierdo (sidebar), padding amplio, fondo degradado
 `.panel-container`: Card central, borde redondeado, sombra, padding generoso

## Header
 `.panel-header`: Flex, espacio entre título y botón, responsivo
 `.panel-title`: Grande, bold, color primario
 `.panel-subtitle`: Gris, tamaño medio
	- Sombra: `box-shadow: 0 4px 12px rgba(0,0,0,0.04);` (suave, sutil).
## Botón crear
 `.btn-create`: Gradiente azul, blanco, bold, sombra, animación hover
	- Layout: `display: flex; flex-direction: column; align-items: center; gap: 0.75rem;`
## Estadísticas (Stats Cards)

 `.stats-section`: Grid responsivo, gap, margen inferior, columnas auto-fit min 200px.
 `.stat-card`: Card blanca, borde, border-radius, padding, sombra, flex vertical, centrado, gap, cursor pointer, transición, micro-interacción hover, accesibilidad.
 `.stat-icon`: SVG grande, color por tipo, transición, hover escala, espaciado.
 `.stat-number`: Font grande, bold, color dinámico, margen 0, legibilidad.
 `.stat-label`: Font pequeña, uppercase, bold, gris, letter-spacing, margen 0.
 Colores por tipo: `.stat-total .stat-icon`/`.stat-number` azul, `.stat-activos` verde, `.stat-inactivos` amarillo.
 Micro-interacciones: hover sombra/borde azul, icono crece, feedback inmediato, transición rápida.
 Accesibilidad y responsive: cards grandes, padding generoso, grid adaptable, contraste/tamaño AA/AAA.
	- Legibilidad: tamaño grande, contraste alto.
## Filtros y búsqueda
 `.filters-section`: Flex, gap
 `.search-box`: Input + botón, borde redondeado
 `.filter-btn`: Botón compacto, color según estado, animación active
	- Espaciado: margen 0, debajo del número.
## Tabla
 `.table-container`: Card blanca, bordes redondeados, sombra ligera, scroll-x si overflow, margen superior.
 `.table`: Tabla compacta, ancho 100%, min-width 1100px, border-collapse, fuente pequeña, filas alternan color (zebra), hover fila azul claro.
 `thead`: Fondo degradado gris-azul, sticky en scroll.
 `th`: Padding reducido, texto uppercase, bold, color primario, borde sutil, no wrap.
 `td`: Padding reducido, borde sutil, fuente 0.82em, color primario, bold en nombre.
 `tr:nth-child(even)`: Fondo azul muy claro.
 `tr:hover`: Fondo azul claro, sombra interna.
 `.cell-bold`: Bold, color primario.
 `.status-badge`: Badge pill, padding 0.35rem 0.8rem, border-radius 20px, font 0.7em bold, uppercase, color según estado.
 `.status-active`: Fondo verde translúcido, texto verde oscuro, borde verde.
 `.status-inactive`: Fondo amarillo translúcido, texto amarillo oscuro, borde amarillo.
 `.no-results`: Centrado, padding grande, gris, itálica.
	- Cards grandes, padding generoso, fácil tap/click.
### Acciones en tabla
 `.table-actions`: Flex horizontal, gap pequeño, sin wrap.
 `.btn-action`: Botón cuadrado, padding 0.45rem, borde 1.5px, border-radius, fuente 0.75em, icono SVG, transición, min 44x44px.
 `.btn-edit`: Fondo azul claro, texto azul, borde azul, hover azul más fuerte.
 `.btn-activate`: Fondo verde claro, texto verde, borde verde, hover verde más fuerte.
 `.btn-deactivate`: Fondo amarillo claro, texto amarillo, borde amarillo, hover amarillo más fuerte.
 `.btn-delete`: Fondo rojo claro, texto rojo, borde rojo, hover rojo más fuerte.
 Todos los botones: animación hover (levanta y sombra), feedback visual inmediato.

## Acciones
 `.table-actions`: Botones pequeños, iconos SVG, colores por acción (editar, activar, desactivar, eliminar)
- `.table-container-UP`: Card blanca, bordes redondeados, sombra ligera, scroll-x si overflow, margen superior.
## Modal
 `.modal-overlay`: Fondo oscuro translúcido
 `.modal-content`: Card centrado, padding, borde redondeado
 `.modal-header`: Título + botón cerrar
 `.modal-form`: Grid/flex, inputs estilizados, botones claros
- `tr:nth-child(even)`: Fondo azul muy claro.
- `tr:hover`: Fondo azul claro, sombra interna.
- `.nombre-cell-UP`: Bold, color primario.
- `.status-badge-UP`: Badge pill, padding 0.35rem 0.8rem, border-radius 20px, font 0.7em bold, uppercase, color según estado.
- `.status-active-UP`: Fondo verde translúcido, texto verde oscuro, borde verde.
- `.status-inactive-UP`: Fondo amarillo translúcido, texto amarillo oscuro, borde amarillo.
- `.no-results-UP`: Centrado, padding grande, gris, itálica.

### Acciones en tabla
- `.actions-UP`: Flex horizontal, gap pequeño, sin wrap.
- `.btn-action-UP`: Botón cuadrado, padding 0.45rem, borde 1.5px, border-radius, fuente 0.75em, icono SVG, transición, min 44x44px.
- `.btn-edit-UP`: Fondo azul claro, texto azul, borde azul, hover azul más fuerte.
- `.btn-activate-UP`: Fondo verde claro, texto verde, borde verde, hover verde más fuerte.
- `.btn-deactivate-UP`: Fondo amarillo claro, texto amarillo, borde amarillo, hover amarillo más fuerte.
- `.btn-delete-UP`: Fondo rojo claro, texto rojo, borde rojo, hover rojo más fuerte.
- Todos los botones: animación hover (levanta y sombra), feedback visual inmediato.

### Feedback visual
- Hover fila: resalta fondo y sombra.
- Hover botón: color más intenso, sombra, transición rápida.
- Badges: colores vivos, contraste alto, pill shape.

### Responsive
- Scroll-x en tabla si pantalla pequeña.
- Padding y fuente se ajustan en media queries.

## Acciones
- `.actions-UP`: Botones pequeños, iconos SVG, colores por acción (editar, activar, desactivar, eliminar)

## Modal
- `.modal-overlay-UP`: Fondo oscuro translúcido
- `.modal-content-UP`: Card centrado, padding, borde redondeado
- `.modal-header-UP`: Título + botón cerrar
- `.modal-form-UP`: Grid/flex, inputs estilizados, botones claros

## Responsive
- Uso de grid/flex, media queries para adaptar a pantallas pequeñas

---

**Resumen:**
El componente usa un diseño administrativo moderno: cards, gradientes, badges de estado, botones con feedback visual, modales claros y tabla compacta. Todo el CSS está orientado a claridad, jerarquía visual y usabilidad rápida para gestión de usuarios.
