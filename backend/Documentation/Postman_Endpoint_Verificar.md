# ✅ VERIFICAR POSTULACIÓN - Documentación Postman

## 🔗 Endpoint
**GET** `/postulacion/verificar`

## 📋 Descripción
Verifica si un usuario ya se ha postulado a una oferta específica. Retorna un valor booleano indicando si existe una postulación previa.

---

## 🔧 Parámetros

### Query Parameters (Requeridos)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `usuarioId` | Long | ID del usuario a verificar | `1` |
| `ofertaId` | Long | ID de la oferta a verificar | `5` |

---

## 📤 Request

### URL Base
```
http://localhost:8080/api
```

### Estructura Completa
```
GET http://localhost:8080/api/postulacion/verificar?usuarioId=1&ofertaId=5
```

### Headers
```
Content-Type: application/json
```

---

## 📥 Response

### Success Response (200 OK)

**Si el usuario YA está postulado:**
```json
true
```

**Si el usuario NO está postulado:**
```json
false
```

---

## 📊 Casos de Uso

### Caso 1: Usuario ya está postulado
```
Request:
GET http://localhost:8080/api/postulacion/verificar?usuarioId=1&ofertaId=5

Response: 200 OK
true
```

### Caso 2: Usuario no está postulado
```
Request:
GET http://localhost:8080/api/postulacion/verificar?usuarioId=2&ofertaId=5

Response: 200 OK
false
```

---

## ⚙️ Configuración en Postman

### Método
```
GET
```

### URL
```
{{baseUrl}}/postulacion/verificar
```

### Query Parameters (Tab: Params)
```
Key: usuarioId
Value: 1

Key: ofertaId
Value: 5
```

### Headers
```
Content-Type: application/json
```

---

## 🛠️ Uso Práctico

### Validar antes de crear postulación
Usar este endpoint para verificar que el usuario no se haya postulado ya a la oferta antes de permitir crear una nueva postulación.

### Flow sugerido:
1. Usuario selecciona una oferta
2. Sistema llama a `GET /api/postulacion/verificar?usuarioId=X&ofertaId=Y`
3. Si retorna `false` → Mostrar botón "Postularme"
4. Si retorna `true` → Mostrar mensaje "Ya estás postulado en esta oferta"

---

## 🔍 Códigos de Respuesta

| Código | Descripción |
|--------|------------|
| `200` | OK - Solicitud exitosa, retorna booleano |
| `400` | Bad Request - Parámetros inválidos |
| `500` | Internal Server Error - Error del servidor |

---

## ⚠️ Notas Importantes

- Ambos parámetros (`usuarioId` y `ofertaId`) son **obligatorios**
- Retorna `true` o `false`, no un objeto JSON
- Debe usarse antes de crear una postulación para evitar duplicados
- Los IDs deben ser números enteros positivos válidos

---

## 🔄 Ejemplo cURL

```bash
curl -X GET "http://localhost:8080/api/postulacion/verificar?usuarioId=1&ofertaId=5" \
  -H "Content-Type: application/json"
```

---

## 📝 Notas para el Desarrollador Frontend

```javascript
// Ejemplo en JavaScript/React
async function verificarPostulacion(usuarioId, ofertaId) {
  const response = await fetch(`/api/postulacion/verificar?usuarioId=${usuarioId}&ofertaId=${ofertaId}`);
  const yaPostulado = await response.json();
  
  if (yaPostulado) {
    console.log("El usuario ya está postulado");
  } else {
    console.log("El usuario puede postularse");
  }
  
  return yaPostulado;
}
```
