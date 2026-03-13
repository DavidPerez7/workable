# Documentación de APIs en Bruno con Copilot

Este documento centraliza las mejores prácticas y lecciones aprendidas durante la construcción de la colección de API en Bruno para el proyecto Workable.

## 1. Regla de Oro: Fidelidad al Código

**IMPORTANTE**: Todas las peticiones deben basarse **estrictamente** en la implementación actual del Backend.
- **Controllers**: Revisar las anotaciones `@RequestMapping`, `@PostMapping`, `@GetMapping`, etc., para confirmar rutas exactas y `@PathVariable`. **CRÍTICO**: Verificar la existencia de `@PreAuthorize` en los métodos del Controller y revisar el `SecurityConfig.java` para documentar correctamente los requisitos de seguridad (roles y permisos) de cada endpoint.
- **Modelos y DTOs**: Las estructuras JSON (`body`) deben coincidir exactamente con los campos definidos en las clases Java, respetando las validaciones `@NotNull`, `@NotBlank` y los tipos de datos. 
- **Planificación de Cambios Grandes (Checklist de Calidad)**: Cuando se realicen cambios estructurales grandes con ayuda de Copilot, se **debe** trabajar con Todo-Lists extensas (mínimo 8-18 pasos). 
    - **Proceso de Validación y Diálogo**: Antes de ejecutar cualquier acción, Copilot debe presentar el Todo-List en el chat como una propuesta de texto plano (no en la herramienta de todo-list aún). Esta propuesta debe incluir:
        1. **Pasos Técnicos**: Desglose claro de las acciones (Análisis de código, creación de archivos, validaciones).
        2. **Análisis para Discusión**: Una sección breve de "Puntos Críticos" o dudas sobre la implementación (ej. ¿PUT o PATCH?, ¿Relaciones 1:1?, ¿Roles de seguridad?).
        3. **Feedback del Usuario**: Copilot esperará la respuesta del usuario para ajustar detalles, agregar pasos olvidados u optimizar el orden.
    - **Ejecución**: Solo una vez que el usuario dé su aprobación final ("listo", "procede", etc.), Copilot generará formalmente el Todo-List con la herramienta `manage_todo_list` integrando todos los puntos acordados y comenzará las acciones.
- **Prohibición**: No se deben "suponer" o inventar campos. Si el código cambia, la documentación en Bruno debe actualizarse inmediatamente.

## 2. Referencias para Nuevos Módulos

Al documentar módulos nuevos o no implementados en Bruno, Copilot debe:
1. **Priorizar Módulos 100% Funcionales**: Basarse estrictamente en la estructura de los módulos que ya han sido probados y validados por el usuario. Estos sirven como referencia absoluta para el formato de cabeceras (`info:`), bloques de red (`http:`) y el manejo de variables.
2. **Seguir Estándares Estructurales Validados**: Utilizar la estructura de autenticación manual (`auth: type: bearer`) que el usuario ya corrigió y aprobó en módulos previos. Aunque sirvan de guía estructural, se debe tener precaución y validar siempre contra el código real antes de darlas por definitivas.
3. **Validación con Código Real**: La fuente de verdad definitiva es siempre el código Java (Entidades, Controllers, `@PreAuthorize` y `SecurityConfig.java`). La documentación debe emanar de la lógica del backend para garantizar que los campos y permisos coincidan con la realidad del sistema.

## 3. Automatización de Autenticación (JWT)

Para capturar automáticamente el token de acceso después del login, se debe configurar un script en la petición de `Login`.

- **Ubicación**: Pestaña `Scripts` -> `Post Response` (en archivos `.yml` se mapea bajo `runtime.scripts`).
- **Configuración Correcta**:
  ```yaml
  runtime:
    scripts:
      - type: after-response
        code: |-
          if (res.status === 200 && res.body.token) {
            bru.setEnvVar("authToken", res.body.token);
          }
  ```
- **Nota**: Asegurarse de usar `type: after-response` para que el script se ejecute inmediatamente después de recibir la respuesta exitosa.

## 2. Organización de la Colección

- **Estructura de Carpetas**: Organizar por módulos numerados (ej. `1-Auth`, `2-Aspirante`, `3-Reclutador`).
- **Herencia de Auth**: Configurar la carpeta raíz o subcarpetas con `auth: inherit` y usar el esquema `Bearer` con la variable `{{authToken}}`.
- **Archivo `folder.yml`**: Utilizar este archivo en cada carpeta para definir el orden (`seq`) y configuraciones compartidas.

## 3. Construcción de Peticiones (Bodys y Parámetros)

Para garantizar que los ejemplos de las peticiones (`JSON body`) sean funcionales, Copilot debe:

1. **Revisar Modelos (Entities/DTOs)**: Verificar los campos obligatorios, tipos de datos y restricciones (`@NotNull`, `@NotBlank`).
2. **Revisar Controllers**: Confirmar las rutas (`@RequestMapping`), métodos HTTP y parámetros esperados (`@PathVariable`, `@RequestBody`).
3. **Generación de Datos de Prueba**: Crear cuerpos JSON con datos coherentes y realistas para facilitar las pruebas manuales.

## 4. Recomendaciones de Uso

- **Basarse Estrictamente en el Código**: Las peticiones deben construirse revisando directamente los `@RestController` (rutas y parámetros) y los @Entity/@DTO (campos y tipos). No se deben inventar campos; solo usar los definidos en el código.
- **Variables de Entorno**: Usar siempre `{{baseUrl}}` para la URL base y `{{authToken}}` para la seguridad.
- **Sincronización**: Al trabajar desde VS Code, se pueden editar los archivos `.yml` directamente y Bruno los recargará automáticamente.
- **Validación de Errores**: Si una petición falla, revisar los logs del Backend para ajustar el JSON enviado según las validaciones de Spring Boot.
