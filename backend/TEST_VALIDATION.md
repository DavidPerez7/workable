# Prueba de Validación - UsrAspiranteDto

## Endpoint de Prueba
**POST** `http://localhost:8080/api/usuarios/aspirantes`

## Headers
```
Content-Type: application/json
```

## Caso 1: Sin fecha de nacimiento (debe fallar)
```json
{
    "nombre": "Juan",
    "correo": "juan@test.com",
    "clave": "password123",
    "apellido": "Pérez",
    "municipio_id": 1,
    "genero_id": 1
}
```

**Respuesta esperada:** HTTP 400 Bad Request
```json
{
    "fechaNacimiento": "La fecha de nacimiento es obligatoria"
}
```

## Caso 2: Con fecha de nacimiento (debe funcionar)
```json
{
    "nombre": "Juan",
    "correo": "juan@test.com",
    "clave": "password123",
    "apellido": "Pérez",
    "fechaNacimiento": "1990-05-15",
    "municipio_id": 1,
    "genero_id": 1
}
```

**Respuesta esperada:** HTTP 200 OK con los datos del aspirante creado

## Notas
- La validación `@NotNull` en `fechaNacimiento` debe funcionar ahora que se agregó `spring-boot-starter-validation`
- El `GlobalExceptionHandler` capturará las excepciones de validación y las formateará
- Si aún no funciona, verificar:
  1. Que la aplicación se haya reiniciado después de agregar la dependencia
  2. Que no haya bloques try/catch en el controller que capturen las excepciones
  3. Que el `@Valid` esté presente en el parámetro del controller
