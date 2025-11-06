## Empresa Categoria (CRUD)

### 1. Crear Empresa Categoria
- POST `/api/empresa-categoria`
- Body:
```json
{
  "nombre": "Tecnología",
  "imagenUrl": "https://example.com/tecnologia.png",
  "descripcion": "Empresas del sector tecnológico"
}
```
- Respuesta: 201 Created + objeto creado

### 2. Listar todas
- GET `/api/empresa-categoria`
- Respuesta: 200 OK + array de objetos

### 3. Obtener por ID
- GET `/api/empresa-categoria/{id}`

### 4. Actualizar
- PUT `/api/empresa-categoria/{id}`
- Body:
```json
{
  "id": 1,
  "nombre": "Salud",
  "imagenUrl": "https://example.com/salud.png",
  "descripcion": "Empresas del sector salud"
}
```

### 5. Eliminar
- DELETE `/api/empresa-categoria/{id}`
