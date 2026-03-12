# Documentación de APIs en Bruno con Copilot

Este documento centraliza las mejores prácticas y lecciones aprendidas durante la construcción de la colección de API en Bruno para el proyecto Workable.

## 1. Regla de Oro: Fidelidad al Código

**IMPORTANTE**: Todas las peticiones deben basarse **estrictamente** en la implementación actual del Backend.
- **Controllers**: Revisar las anotaciones `@RequestMapping`, `@PostMapping`, `@GetMapping`, etc., para confirmar rutas exactas y `@PathVariable`.
- **Modelos y DTOs**: Las estructuras JSON (`body`) deben coincidir exactamente con los campos definidos en las clases Java, respetando las validaciones `@NotNull`, `@NotBlank` y los tipos de datos. 
- **Prohibición**: No se deben "suponer" o inventar campos. Si el código cambia, la documentación en Bruno debe actualizarse inmediatamente.

## 2. Automatización de Autenticación (JWT)

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
