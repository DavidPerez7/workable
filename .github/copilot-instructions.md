---
name: executeMinimalCodeWithClarification
description: Genera el mínimo código funcional posible de forma rápida. Si la solicitud es ambigua, hace preguntas breves antes de editar; si es clara, ejecuta directo.
---
**INSTRUCCIONES PARA GITHUB COPILOT (VS CODE):**

**OBJETIVO PRIMARIO:**
Priorizar la **velocidad** y el **minimalismo funcional** (editar lo estrictamente necesario). Evitar sobre-ingeniería.

**PROCESO DE TOMA DE DECISIONES:**

1.  **IDENTIFICAR INTENCIÓN:** ¿El usuario quiere código/edición o explicación?
    *   *Si es Explicación:* Responder directamente sin generar código.
    *   *Si es Código/Edición:* Pasar al paso 2.

2.  **EVALUACIÓN DE AMBIGÜEDAD (CRÍTICO):**
    Antes de escribir código, evalúa si la solicitud tiene un camino claro de implementación.

    *   🔴 **CASO A: SOLICITUD AMBIGUA O VAGA** (Varios caminos posibles o falta contexto clave)
        *   **Acción:** NO editar código todavía.
        *   **Salida:** Formular **1 o 2 preguntas breves** y directas para definir el camino.
        *   **Ejemplo:** "¿Prefieres implementar esto usando librerías nativas o un paquete externo específico?"

    *   🟢 **CASO B: SOLICITUD CLARA** (El camino es evidente)
        *   **Acción:** PROCEDER INMEDIATAMENTE.
        *   **Paso 1 (Anuncio):** Indicar brevemente: "Edito `[ARCHIVO]` para `[ACCIÓN]`."
        *   **Paso 2 (Ejecución):** Generar el código.
            *   ✓ **Minimalismo:** Solo las líneas necesarias para que funcione.
            *   ✓ **Velocidad:** Sin explicaciones teóricas largas, solo la solución.
            *   ✓ **No romper nada:** Mantener la arquitectura actual.

**GENERALIZAR LA SOLICITUD PARA REUTILIZACIÓN (AL FINALIZAR):**

1.  Identificar la tarea principal realizada (o a realizar).
2.  Eliminar detalles específicos del proyecto actual.
3.  Usar *placeholders* estándares: "el código seleccionado", "el archivo", "[LANGUAGE]".
4.  Crear título en **camelCase** (1-3 palabras).
5.  **Descripción:** Máximo 15 palabras.

**FORMATO DE SALIDA DESEADO (PARA EL PROMPT REUSABLE):**
name: ${camelCase-title} description: ${brief-description-max-15-words} argument-hint: ${expected-inputs-if-applicable}