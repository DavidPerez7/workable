## Nivel Educativo (CRUD)

**1. Crear Nivel Educativo**
- POST `/api/nivel-educativo`
- Body:
```json
{
  "nombre": "Universitario"
}
```
- Respuesta: 201 Created + objeto creado

**2. Listar todos**
- GET `/api/nivel-educativo`
- Respuesta: 200 OK + array de objetos

**3. Obtener por ID**
- GET `/api/nivel-educativo/{id}`

**4. Actualizar**
- PUT `/api/nivel-educativo/{id}`
- Body:
```json
{
  "id": 1,
  "nombre": "Secundaria",
  "estado": "ACTIVO"
}
```

**5. Eliminar**
- DELETE `/api/nivel-educativo/{id}`

**6. Cambiar estado**
- PATCH `/api/nivel-educativo/{id}/estado?estado=INACTIVO`
