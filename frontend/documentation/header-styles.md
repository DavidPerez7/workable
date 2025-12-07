# Documentación de Estilos - Header Component

## Descripción General
El componente `Header` implementa un header moderno y responsivo para la aplicación Workable. Incluye logo, navegación, menú móvil y botones de autenticación. El diseño sigue un estilo tech moderno con gradientes azules y elementos interactivos.

## Paleta de Colores
- **Primario Azul Oscuro**: `#1e6ff1` a `#1d4ed8` (gradiente principal del header)
- **Azul Secundario**: `#3b82f6` (botones, hover, focus)
- **Azul Claro**: `#ebf3ff` (texto hover)
- **Ámbar**: `#f59e0b` (acento en gradientes de enlaces)
- **Verde**: `#10b981` (mencionado en comentarios, no usado en header)
- **Gris Claro**: `#e2e8f0` (borde inferior)
- **Blanco**: `#ffffff` (texto principal)
- **Fondo Móvil**: `#f8fafc` (fondo del menú desplegable)
- **Sombra**: `rgba(15, 23, 42, 0.04)` (sombra del header)
- **Transparente**: `rgba(255, 255, 255, 0.1)` (elemento decorativo)

## Tipografía
- **Familia**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Peso**: 
  - Normal: 400 (por defecto)
  - Semibold: 600 (enlaces, botones)
- **Tamaño**:
  - Base: `1rem` (16px) para enlaces y botones
  - Móvil: `0.95rem` (15.2px) para botones y enlaces en pantallas pequeñas
  - Icono menú: `1.5rem` (24px)

## Layout y Dimensiones
### Header Container
- **Display**: `flex`
- **Alineación**: `center` (vertical), `space-between` (horizontal)
- **Padding**: `1rem 2rem` (16px 32px)
- **Posición**: `sticky` en top con `z-index: 1000`
- **Altura efectiva**: Aproximadamente 80px (logo 50px + padding)
- **Sombra**: `0 2px 8px rgba(15, 23, 42, 0.04)`

### Logo
- **Altura**: `50px` (móvil: `40px`)
- **Ancho**: `auto` (mantiene proporción)
- **Object-fit**: `contain`

### Navegación
- **Gap entre enlaces**: `2rem` (32px) desktop, `1.5rem` (24px) tablet
- **Padding enlaces**: `0.5rem 1rem` (8px 16px)
- **Border-radius**: `8px`

### Botones
- **Padding**: `0.75rem 1.5rem` (12px 24px) desktop, `1rem` (16px) móvil
- **Border-radius**: `10px`
- **Border**: `2px solid #3b82f6` (solo login)

### Menú Móvil
- **Fondo**: `#f8fafc`
- **Border-radius**: `12px`
- **Padding**: `1rem 0`
- **Gap**: `0.5rem` entre elementos

## Efectos Visuales
### Gradientes
- **Header principal**: `linear-gradient(135deg, #1e6ff1 0%, #1d4ed8 100%)`
- **Botones**: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`
- **Enlaces activos**: `linear-gradient(90deg, #3b82f6 0%, #f59e0b 100%)` (línea inferior)

### Transiciones
- **Duración**: `0.3s ease`
- **Propiedades**: `all` (transform, color, background, etc.)
- **Hover scale**: `scale(1.05)` para botones, `scale(1.02)` para logo
- **Active scale**: `scale(0.98)` para botones

### Sombras
- **Header**: `0 2px 8px rgba(15, 23, 42, 0.04)`
- **Botones hover**: `0 6px 16px rgba(59, 130, 246, 0.3)`
- **Botones signup**: `0 4px 12px rgba(59, 130, 246, 0.3)`

### Animaciones
- **Slide down**: `slideDown` keyframe (0.3s ease-in-out)
  - From: `opacity: 0, translateY(-10px)`
  - To: `opacity: 1, translateY(0)`

## Diseño Responsivo
### Breakpoints
- **Tablet (≤968px)**: Reduce padding y gap de navegación
- **Móvil (≤768px)**: 
  - Flex-wrap, muestra botón menú
  - Navegación oculta por defecto, se muestra con `.show`
  - Menú usuario en columna
- **Pequeño (≤480px)**: Reduce tamaños de fuente y logo

### Estados
- **Hover**: Cambia colores, agrega transform y sombra
- **Active**: Reduce scale ligeramente
- **Focus-visible**: Outline azul de 3px
- **Show**: Para menú móvil, agrega display flex y animación

## Elementos Decorativos
- **Pseudo-elemento ::before**: Círculo blanco semitransparente en esquina superior derecha (solo desktop)
  - Posición: `top: -230px, margin-left: 940px`
  - Tamaño: `300px x 300px`
  - Background: `rgba(255, 255, 255, 0.1)`

## Soporte Adicional
- **Dark mode**: Detecta `prefers-color-scheme: dark`
  - Cambia background a `#0f172a`
  - Ajusta colores de texto y fondos
- **Accesibilidad**: Focus outlines en todos los elementos interactivos

## Cómo Replicar en Otras Páginas
1. **Importar CSS**: Copia las reglas relevantes o importa el archivo
2. **Clases base**: Usa `.header-container` como base para headers similares
3. **Colores**: Define variables CSS para la paleta si no existen
4. **Responsivo**: Incluye los media queries para consistencia
5. **Interacciones**: Copia las transiciones y hover effects para uniformidad

## Notas de Implementación
- El header usa `position: sticky` para mantenerse fijo
- Los enlaces usan `NavLink` de React Router con clases `active`
- El menú móvil se controla con estado React (`menuOpen`)
- Compatible con sistemas operativos que soportan las fuentes listadas