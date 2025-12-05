# 🧪 GUÍA DE PRUEBAS - Validar Correcciones de Roles

## 📍 BASE URL
```
http://localhost:8080
```

---

## 🔑 OBTENER TOKENS DE PRUEBA

### 1. Registrar ASPIRANTE
```bash
curl -X POST http://localhost:8080/api/auth/register-aspirante \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@test.com",
    "password": "password123",
    "fechaNacimiento": "1990-01-01"
  }'

# Respuesta guardará: token_aspirante, usuario_id = 1
```

### 2. Registrar RECLUTADOR
```bash
curl -X POST http://localhost:8080/api/auth/register-reclutador \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "apellido": "Gómez",
    "correo": "carlos@test.com",
    "password": "password123",
    "fechaNacimiento": "1990-01-01"
  }'

# Respuesta guardará: token_reclutador, usuario_id = 2
```

### 3. Login ADMIN (debe existir)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@workable.com",
    "password": "admin123"
  }'

# Respuesta guardará: token_admin
```

---

## ✅ PRUEBA 1: ASPIRANTE no puede crear estudio para otro

### ❌ DEBE FALLAR (Antes de corrección SÍ funcionaba)
```bash
# ASPIRANTE 1 intenta crear estudio para ASPIRANTE 2
curl -X POST http://localhost:8080/api/estudio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "titulo": "Ingeniería en Sistemas",
    "fechaInicio": "2020-01-01",
    "institucion": "Universidad Nacional",
    "descripcion": "Carrera profesional"
  }' \
  -G \
  --data-urlencode "usuarioId=2" \
  --data-urlencode "usuarioIdActual=1"

# RESULTADO ESPERADO: 403 Forbidden
# {"error": "No puedes crear estudios para otro usuario"}
```

### ✅ DEBE FUNCIONAR
```bash
# ASPIRANTE 1 crea estudio PARA ÉL MISMO
curl -X POST http://localhost:8080/api/estudio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "titulo": "Ingeniería en Sistemas",
    "fechaInicio": "2020-01-01",
    "institucion": "Universidad Nacional"
  }' \
  -G \
  --data-urlencode "usuarioId=1" \
  --data-urlencode "usuarioIdActual=1"

# RESULTADO ESPERADO: 200 OK
# {"id": 1, "titulo": "Ingeniería en Sistemas", ...}
```

---

## ✅ PRUEBA 2: RECLUTADOR NO puede crear estudio

### ❌ DEBE FALLAR
```bash
# RECLUTADOR intenta crear estudio
curl -X POST http://localhost:8080/api/estudio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_reclutador" \
  -d '{
    "titulo": "Ingeniería",
    "fechaInicio": "2020-01-01",
    "institucion": "Universidad"
  }' \
  -G \
  --data-urlencode "usuarioId=2" \
  --data-urlencode "usuarioIdActual=2"

# RESULTADO ESPERADO: 403 Forbidden
# "Access Denied"
```

---

## ✅ PRUEBA 3: ASPIRANTE no puede crear hoja de vida para otro

### ❌ DEBE FALLAR
```bash
# ASPIRANTE 1 intenta crear hoja de vida para ASPIRANTE 2
curl -X POST http://localhost:8080/api/hoja-vida \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "titulo": "Developer Senior",
    "resumenProfesional": "Experiencia en desarrollo"
  }' \
  -G \
  --data-urlencode "usuarioId=2" \
  --data-urlencode "usuarioIdActual=1"

# RESULTADO ESPERADO: 403 Forbidden
# {"error": "No puedes crear hoja de vida para otro usuario"}
```

### ✅ DEBE FUNCIONAR
```bash
# ASPIRANTE 1 crea hoja de vida PARA ÉL MISMO
curl -X POST http://localhost:8080/api/hoja-vida \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "titulo": "Developer Senior",
    "resumenProfesional": "Experiencia en desarrollo"
  }' \
  -G \
  --data-urlencode "usuarioId=1" \
  --data-urlencode "usuarioIdActual=1"

# RESULTADO ESPERADO: 200 OK
```

---

## ✅ PRUEBA 4: ASPIRANTE puede ver empresas públicas (SIN autenticación)

### ✅ DEBE FUNCIONAR
```bash
# Ver empresas públicas SIN token
curl -X GET http://localhost:8080/api/empresa/publicas \
  -H "Content-Type: application/json"

# RESULTADO ESPERADO: 200 OK
# [{"id": 1, "nombre": "Google", "isActive": true}, ...]
```

---

## ✅ PRUEBA 5: ASPIRANTE no puede editar feedback de otro

### Primero: Crear feedback como ASPIRANTE 1
```bash
curl -X POST http://localhost:8080/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "usuario": {"id": 1},
    "empresa": {"id": 1},
    "calificacion": 5,
    "comentario": "Excelente empresa"
  }' \
  -G \
  --data-urlencode "usuarioIdActual=1"

# Guardará: feedback_id = 1
```

### ❌ ASPIRANTE 2 intenta editar
```bash
curl -X PUT http://localhost:8080/api/feedback/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_2" \
  -d '{
    "usuario": {"id": 1},
    "empresa": {"id": 1},
    "calificacion": 1,
    "comentario": "Mala empresa"
  }' \
  -G \
  --data-urlencode "usuarioIdActual=2"

# RESULTADO ESPERADO: 403 Forbidden
# {"error": "No puedes editar feedback de otro usuario"}
```

---

## ✅ PRUEBA 6: FEEDBACK - ASPIRANTE puede editar propio

### ✅ ASPIRANTE 1 edita SU PROPIO feedback
```bash
curl -X PUT http://localhost:8080/api/feedback/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_aspirante_1" \
  -d '{
    "usuario": {"id": 1},
    "empresa": {"id": 1},
    "calificacion": 4,
    "comentario": "Buena empresa"
  }' \
  -G \
  --data-urlencode "usuarioIdActual=1"

# RESULTADO ESPERADO: 200 OK
```

---

## ✅ PRUEBA 7: ADMIN puede hacer TODO

### ADMIN edita feedback de ASPIRANTE
```bash
curl -X PUT http://localhost:8080/api/feedback/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_admin" \
  -d '{
    "usuario": {"id": 1},
    "empresa": {"id": 1},
    "calificacion": 3,
    "comentario": "Moderada empresa"
  }' \
  -G \
  --data-urlencode "usuarioIdActual=999"  # ID de ADMIN

# RESULTADO ESPERADO: 200 OK
# (Sin validación de ownership para ADMIN)
```

---

## ✅ PRUEBA 8: RECLUTADOR NO puede crear feedback

### ❌ DEBE FALLAR
```bash
curl -X POST http://localhost:8080/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token_reclutador" \
  -d '{
    "usuario": {"id": 2},
    "empresa": {"id": 1},
    "calificacion": 5,
    "comentario": "Buena empresa"
  }' \
  -G \
  --data-urlencode "usuarioIdActual=2"

# RESULTADO ESPERADO: 403 Forbidden
# "Access Denied"
```

---

## 🔍 VERIFICACIÓN RÁPIDA

### Script bash para ejecutar todas las pruebas:
```bash
#!/bin/bash

echo "=== PRUEBA 1: ASPIRANTE no puede crear para otro ==="
curl -s -X POST http://localhost:8080/api/estudio \
  -H "Authorization: Bearer $token_aspirante_1" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","fechaInicio":"2020-01-01","institucion":"Uni"}' \
  -G --data-urlencode "usuarioId=2" --data-urlencode "usuarioIdActual=1" | jq .

echo "=== PRUEBA 2: ASPIRANTE PUEDE crear para sí mismo ==="
curl -s -X POST http://localhost:8080/api/estudio \
  -H "Authorization: Bearer $token_aspirante_1" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","fechaInicio":"2020-01-01","institucion":"Uni"}' \
  -G --data-urlencode "usuarioId=1" --data-urlencode "usuarioIdActual=1" | jq .

echo "=== PRUEBA 3: RECLUTADOR NO puede crear estudio ==="
curl -s -X POST http://localhost:8080/api/estudio \
  -H "Authorization: Bearer $token_reclutador" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","fechaInicio":"2020-01-01","institucion":"Uni"}' \
  -G --data-urlencode "usuarioId=2" --data-urlencode "usuarioIdActual=2" | jq .

echo "=== PRUEBA 4: Acceso público a empresas ==="
curl -s -X GET http://localhost:8080/api/empresa/publicas | jq . | head -20
```

---

## 📊 TABLA DE RESULTADOS ESPERADOS

| Prueba | Acción | Rol | Resultado | Estado |
|--------|--------|-----|-----------|--------|
| 1 | Crear estudio para otro | ASPIRANTE | 403 | ✅ |
| 2 | Crear estudio para sí | ASPIRANTE | 200 | ✅ |
| 3 | Crear estudio | RECLUTADOR | 403 | ✅ |
| 4 | Ver empresas | PÚBLICO | 200 | ✅ |
| 5 | Editar feedback ajeno | ASPIRANTE | 403 | ✅ |
| 6 | Editar feedback propio | ASPIRANTE | 200 | ✅ |
| 7 | Editar feedback ajeno | ADMIN | 200 | ✅ |
| 8 | Crear feedback | RECLUTADOR | 403 | ✅ |

---

## 🎯 CÓMO LEER RESPUESTAS

### Éxito (200 OK):
```json
{
  "id": 1,
  "titulo": "Ingeniería",
  "fechaInicio": "2020-01-01",
  "usuario": {...}
}
```

### Forbidden (403):
```json
{
  "error": "No puedes crear estudios para otro usuario"
}
```

### No autenticado (401):
```json
{
  "error": "Token inválido o expirado"
}
```

### Acceso denegado (403 - Sin rol):
```
"Access Denied"
```

---

## 📝 NOTAS

- Reemplaza `$token_aspirante_1` con el token real
- Los `usuarioId` deben ser IDs válidos de la BD
- Usa `jq` para formatear JSON: `| jq .`
- Para DELETE, agrega `-X DELETE`
- Todos los endpoints requieren `usuarioIdActual` después de correcciones

---

**¿Problemas?** Revisa el log del servidor:
```bash
tail -f /path/to/backend/logs.log
```
