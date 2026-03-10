# GUÍA DE NOMBRES DE COMMIT

## Propósito
Documentar el formato y estilo de nombres de commit para mantener consistencia y claridad en el historial del proyecto.

## Formato General
```
<tipo>: <descripción corta> [(<detalles específicos>) para <contexto>]
```

### Componentes:
- **Tipo** (en inglés): `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, etc.
- **Descripción corta** (en español): Máximo 50 caracteres, describe la acción principal.
- **Detalles específicos** (opcional): Cambios clave entre paréntesis.
- **Contexto** (opcional): Justificación o impacto ("para optimizar...", "para alinear con RF...").

---

## Estilos Recomendados

### ESTILO 1: LARGO Y DESCRIPTIVO (Commits grandes/complejos)
**Uso**: Cambios significativos, refactorización, múltiples módulos.

**Formato**:
```
feat: <descripción principal> para <contexto> (<detalles específicos>)
```

**Ejemplo**:
```
feat: Refactorización de entidades JPA y actualización de RF para optimizar ciclo de reclutamiento (estados de ofertas/postulaciones, perfiles de aspirantes con estudios/experiencias)
```

**Características**:
- Describe impacto general + contexto + detalles.
- Ideal para commits con múltiples cambios relacionados.
- Máximo ~130 caracteres (puede exceder el estándar).

---

### ESTILO 2: COMPACTO (Commits pequeños/específicos)
**Uso**: Cambios puntuales, correcciones, pequeñas features.

**Formato**:
```
<tipo>: <descripción clara> [cambios clave]
```

**Ejemplo**:
```
feat: Refactorización de estados de ofertas y simplificación de embeddables [ACTIVA/INACTIVA/FINALIZADA, EstudioData, ExperienciaData]
```

**Características**:
- Directo y conciso (~80 caracteres máximo).
- Cambios clave entre corchetes.
- Enfoque específico.

---

## Convenciones por Tipo de Cambio

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad, refactorización mayor, adiciones RF | `feat: Refactorización de entidades...` |
| `fix` | Correcciones de bugs, ajustes de validaciones | `fix: Corrección de validación en municipio de Oferta` |
| `refactor` | Reorganización de código, simplificación | `refactor: Simplificación de campos en EstudioData` |
| `docs` | Actualización de RF, README, comentarios | `docs: Actualización de RF03 con info de estudios/experiencias` |
| `style` | Formato, espacios, ortografía (sin lógica) | `style: Ajuste de espacios en CitacionData` |
| `chore` | Tareas técnicas, dependencias | `chore: Actualización de dependencias de Lombok` |

---

## Checklist para Commits

Antes de hacer commit, verifica:
- ✅ Nombre alineado en español (descripción) + inglés (tipo).
- ✅ Describe qué cambió: modelo, RF, relaciones, validaciones.
- ✅ Incluye contexto: "para alinear con RF", "para optimizar", "para 7 días límite".
- ✅ Detalles específicos entre paréntesis o corchetes si cambios múltiples.
- ✅ Máximo ~130 caracteres (estilo largo) o ~80 (compacto).

---

## Ejemplos por Módulo

### Backend (Modelos/Entidades)
```
feat: Actualización de entidades JPA para alineación con RF (estados ACTIVA/INACTIVA/FINALIZADA en Oferta, validaciones en Municipio)
```

### RF (Documentación)
```
docs: Actualización de RF para eliminar notificaciones no implementadas y agregar info de estudios/experiencias
```

### Bug Fix
```
fix: Corrección de tipo de dato en CitacionData (String a LocalTime de hora)
```

### Simplificación (Tiempo limitado)
```
refactor: Simplificación de EstudioData y ExperienciaData para MVP de 7 días (eliminación de campos opcionales)
```

---

## Análisis de Preferencias de Usuario (Basado en Iteraciones de Commit)

### Contexto
Durante el desarrollo, se iteraron nombres de commit para un refactor masivo de servicios backend. El usuario prefirió versiones más detalladas y justificadas, priorizando claridad sobre brevedad.

### Comparación de Nombres Iterados
1. **Versión Inicial (Básica):**
   ```
   refactor: Simplificación de servicios backend para optimización y alineación RF (Empresa, Reclutador, Oferta, Postulacion, HojaVida, Municipio; @NotNull en Postulacion)
   ```
   - **Fortalezas:** Lista detalles específicos, incluye contexto.
   - **Debilidades:** Faltaba especificar "eliminando redundancias" y "delegación de validaciones".

2. **Versión Ajustada (Media):**
   ```
   refactor: Simplificación de servicios backend y delegación de validaciones a modelos/controllers (Empresa, Reclutador, Oferta, Postulacion, HojaVida, Municipio)
   ```
   - **Fortalezas:** Agrega "delegación de validaciones", más técnico.
   - **Debilidades:** Aún corto en descripción de cambios específicos.

3. **Versión Ganadora (Detallada):**
   ```
   refactor: Simplificación de servicios backend eliminando redundancias y delegación de validaciones a modelos/controllers para optimización y alineación RF (Empresa, Reclutador, Oferta, Postulacion, HojaVida, Municipio)
   ```
   - **Fortalezas:** Expande con "eliminando redundancias" (acción específica), contexto completo ("para optimización y alineación RF"), y lista de servicios.
   - **Debilidades:** Más largo (~140 caracteres), pero aceptable.

### Lecciones Aprendidas
- **Preferencia por Largo sobre Compacto:** Para cambios complejos, el usuario elige descripciones expansivas que expliquen "qué" (simplificación, delegación), "cómo" (eliminando redundancias), y "por qué" (optimización, RF, tiempo limitado).
- **Incluir Acción Específica:** Palabras como "eliminando", "delegación" hacen el commit autoexplicativo sin leer código.
- **Contexto Obligatorio:** Siempre justificar con "para [motivo]" (ej. alineación RF, optimización).
- **Detalles en Paréntesis:** Lista de módulos/afectados para precisión.
- **Iterar Basado en Feedback:** Empezar básico, refinar con más detalle técnico y justificación hasta satisfacción.

### Recomendación Actualizada
- Para commits grandes: Usar estilo LARGO con acción + contexto + detalles.
- Ejemplo Ideal: `refactor: [Acción específica] para [contexto] ([detalles afectados])`.

---

## Notas Finales
- Preferir estilo **LARGO** para cambios complejos/múltiples (refactorización, RF updates).
- Preferir estilo **COMPACTO** para cambios pequeños/puntuales.
- Siempre incluir **contexto de por qué** (alineación RF, optimización, time boxed, etc.).
- El historial de commits debe ser **autoexplicativo** sin necesidad de leer el código.
