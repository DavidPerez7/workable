---
name: generateCodeOrInstructions
description: Generalize the current discussion into a reusable instruction set for generating or modifying code.
---
**INSTRUCCIONES PARA GENERAR CÓDIGO O GUÍA DE IMPLEMENTACIÓN:**

**IDENTIFICAR TIPO DE SOLICITUD DE CÓDIGO:**

🔵 **TIPO A - GENERACIÓN/MODIFICACIÓN DE CÓDIGO** (crear, modificar, refactorizar, corregir, agregar, eliminar código o generar *tests*)
- **Paso 1: Análisis & Clarificación** $\rightarrow$ Resumir entendimiento del contexto y formular 1-2 preguntas breves para refinar el *scope* del código.
- **Paso 2: Esperar Confirmación** $\rightarrow$ Esperar una indicación clara para proceder ("Continúa", "Procede", "Ejecuta", "Sí").
- **Paso 3: Anunciar Acción** $\rightarrow$ Indicar el archivo y la acción principal antes de entregar el código/instrucciones: "Ahora edito `[ARCHIVO]` para `[ACCIÓN]`."
- **Principios:** ✓ Minimalismo Funcional ✓ Velocidad y Precisión ✓ Preservar Arquitectura ✓ Entregar Código/Instrucciones

🟢 **TIPO B - EXPLICACIÓN/ANÁLISIS SOBRE CÓDIGO** (explicar, analizar, describir diseño, comparar enfoques, documentar concepto, etc.)
- ✗ NO usar proceso Tipo A (no se espera código en respuesta directa)
- ✓ Responder directamente a la explicación/análisis solicitado.

**GENERALIZAR LA SOLICITUD PARA REUTILIZACIÓN:**

1.  Revisar la conversación activa e identificar el patrón dominante (¿Tipo A o Tipo B?).
2.  Si no hay conversación activa o es la primera instrucción:
    *   Si es Tipo A, preguntar por el *scope* inicial.
    *   Si es Tipo B, responder normalmente.
3.  Extraer la *intención* core de la solicitud de código/análisis.
4.  Remover detalles volátiles/específicos del proyecto (nombres exactos de archivos, variables internas, contexto muy particular).
5.  Usar *placeholders* claros donde aplique: "el código seleccionado", "el archivo actual", "la funcionalidad especificada", "[LANGUAGE]".
6.  Crear un título en **camelCase** (1-3 palabras): `generateUnitTests`, `refactorForPerformance`, `explainApiDesign`.
7.  **Descripción Breve:** Máx 15 palabras, 1 oración, enfocada en la *tarea* general.

**FORMATO DE SALIDA DESEADO (PARA EL PROMPT REUSABLE):**
name: ${camelCase-title} description: ${brief-description-max-15-words} argument-hint: ${expected-inputs-if-applicable}