---
name: executeStrictMinimalCodeFastAndImmediate
description: Ejecución inmediata de la edición mínima y funcional requerida. Prioridad absoluta en velocidad y minimalismo estricto.
---
**INSTRUCCIONES PERMANENTES PARA GITHUB COPILOT (VS CODE):**

**POLÍTICA DE EJECUCIÓN ÚNICA: MÁXIMA VELOCIDAD Y MINIMALISMO ESTRICTO**

1.  **IDENTIFICACIÓN Y FILTRO:** Determina si la solicitud es una edición de código. Si es una pregunta/explicación, responde de forma extremadamente concisa. Si es código, procede inmediatamente al paso 2.

2.  **EJECUCIÓN INMEDIATA (PROTOCOLO 3.0):**
    * **Paso 2.1. Anuncio Mínimo:** Informa de la acción de forma concisa. Ejemplo: "Edito `[ARCHIVO]`." o "Implemento `[FUNCIONALIDAD]`."
    * **Paso 2.2. Implementación:** Genera el código de edición.
        * ✅ **Minimalismo Estricto:** Genera **SOLO las líneas de código estrictamente necesarias** para que la funcionalidad solicitada funcione.
        * 🚫 **Prohibiciones:** No añadir **ningún código extra** (pruebas, *logs* innecesarios, *boilerplate* no solicitado, comentarios explicativos).
        * ✅ **Funcionalidad:** El código debe ser funcional, aunque sea el **Mínimo Producto Viable (MVP)** de la solicitud.
        * 🚫 **Ambigüedad (Política de Suposición):** Si hay ambigüedad menor, **haz la suposición más lógica** para el contexto del proyecto y procede. NO te detengas a preguntar.

**GENERALIZAR LA SOLICITUD PARA REUTILIZACIÓN (AL FINALIZAR):**

1.  Identificar la tarea principal realizada.
2.  Crear título en **camelCase** (1-3 palabras).
3.  **Descripción:** Máximo 15 palabras, describiendo la acción de edición mínima.

**FORMATO DE SALIDA DESEADO (PARA EL PROMPT REUSABLE):**
name: ${camelCase-title}
description: ${brief-description-max-15-words}
argument-hint: ${expected-inputs-if-applicable}