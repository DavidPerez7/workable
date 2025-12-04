# TODO: Pasos Paso a Paso para Implementar CRUD en Postman

## 🎯 Objetivo
Documento guía para crear e implementar CRUDs completos en la colección Postman siguiendo los estándares ya establecidos en Habilidad y Municipio.

---

## 📋 Checklist General por Cada Entidad

### Paso 1: Crear Carpeta de la Entidad
- [ ] Crear nueva carpeta con nombre de la entidad (ej: "Usuario", "Empresa")
- [ ] Seguir estructura: `"name": "Entidad (pendiente)"` hasta que esté 100% funcional
- [ ] Cambiar a `"name": "Entidad (ok)"` cuando todos los endpoints funcionen

**Ejemplo estructura:**
```json
{
  "name": "Usuario (pendiente)",
  "item": [
    // aquí van los endpoints
  ]
}
```

---

### Paso 2: Definir Endpoints Necesarios
- [ ] **getAll** - Listar todos
- [ ] **getById** - Obtener por ID
- [ ] **getBy[Filtro]** - Búsquedas específicas (getByCorreo, getByNombre, etc)
- [ ] **create** - Crear nuevo registro
- [ ] **update** - Actualizar registro
- [ ] **delete** - Eliminar registro

**Nota:** Algunos endpoints pueden tener variantes según la entidad

---

### Paso 3: Para Cada Endpoint - Estructura Base

Copiar y adaptar esta estructura:

```json
{
  "name": "getAll (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [
        {
          "key": "token",
          "value": "{{Token_ADMIN}}",
          "type": "string"
        }
      ]
    },
    "method": "GET",
    "header": [],
    "url": {
      "raw": "{{BASE_URL}}/recurso",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso"]
    }
  },
  "response": []
}
```

---

### Paso 4: Configurar Authorization (CRÍTICO)
- [ ] **Tipo:** `bearer` (no Basic Auth)
- [ ] **Token:** Usar variable `{{Token_ADMIN}}`, `{{Token_ASPIRANTE}}`, `{{Token_RECLUTADOR}}`
- [ ] **Para endpoints públicos:** Dejar vacío (sin auth)

**Verificación:**
```json
"auth": {
  "type": "bearer",
  "bearer": [
    {
      "key": "token",
      "value": "{{Token_ADMIN}}",
      "type": "string"
    }
  ]
}
```

---

### Paso 5: Configurar URL
- [ ] Usar SIEMPRE `{{BASE_URL}}/recurso`
- [ ] NO hardcodear `http://localhost:8080/api/`
- [ ] Para getById: `{{BASE_URL}}/recurso/{id}`
- [ ] Para filtros: `{{BASE_URL}}/recurso/filtro/{valor}`

**Verificación:**
```json
"url": {
  "raw": "{{BASE_URL}}/usuarios",
  "host": ["{{BASE_URL}}"],
  "path": ["usuarios"]
}
```

**Con ID:**
```json
"url": {
  "raw": "{{BASE_URL}}/usuarios/1",
  "host": ["{{BASE_URL}}"],
  "path": ["usuarios", "1"]
}
```

---

### Paso 6: Configurar Body (POST/PUT)

#### Para POST (create):
```json
"body": {
  "mode": "raw",
  "raw": "{\n    \"nombre\":\"Ejemplo\",\n    \"correo\":\"ejemplo@email.com\",\n    \"municipio\": {\n        \"id\": 1\n    }\n}",
  "options": {
    "raw": {
      "language": "json"
    }
  }
}
```

#### Para PUT (update):
```json
"body": {
  "mode": "raw",
  "raw": "{\n    \"nombre\":\"Nombre Actualizado\",\n    \"correo\":\"nuevo@email.com\"\n}",
  "options": {
    "raw": {
      "language": "json"
    }
  }
}
```

**Validaciones:**
- [ ] JSON bien formado (sin caracteres especiales sin escapar)
- [ ] IDs referencian entidades existentes
- [ ] Campos según modelo de la entidad

---

### Paso 7: Nombrar Endpoints (Estandarización)

✅ **CORRECTO:**
- `getAll (pendiente)` → `getAll (ok)`
- `getById (pendiente)` → `getById (ok)`
- `getByCorreo (pendiente)` → `getByCorreo (ok)`
- `create (pendiente)` → `create (ok)`
- `update (pendiente)` → `update (ok)`
- `delete (pendiente)` → `delete (ok)`

❌ **INCORRECTO:**
- ~~"Listar todos los usuarios"~~
- ~~"Obtener usuario por ID"~~
- ~~"Crear Usuario Nuevo"~~

---

### Paso 8: Probar en Servidor

Para cada endpoint:

1. [ ] Asegurarse que el servidor esté corriendo: `mvn spring-boot:run`
2. [ ] Hacer login primero (Login Admin, Aspirante o Reclutador)
3. [ ] Copiar el token retornado a la variable `{{Token_XXX}}`
4. [ ] Ejecutar endpoint con "Send"
5. [ ] Validar respuesta:
   - ✅ Status 200/201 = Éxito
   - ⚠️ Status 400 = Error en request
   - 🔴 Status 401 = Problema con token/auth
   - 🔴 Status 403 = Permiso denegado
   - 🔴 Status 404 = Recurso no encontrado
   - 🔴 Status 500 = Error del servidor

---

### Paso 9: Marcar como (ok)

Solo cuando:
- [ ] El endpoint retorna 200/201/204
- [ ] La respuesta contiene datos válidos
- [ ] Auth funciona correctamente
- [ ] Se probó con datos reales del servidor
- [ ] URL y body están correctos

**Cambiar nombre:**
- De: `"name": "getAll (pendiente)"`
- A: `"name": "getAll (ok)"`

---

### Paso 10: Actualizar Carpeta Principal

Cuando TODOS los endpoints de una entidad estén (ok):

```json
{
  "name": "Usuario (ok)",
  "item": [
    // todos con (ok)
  ]
}
```

---

## 🔄 Workflow Completo por Entidad

### Ejemplo: Implementar CRUD de Usuario

#### 1. Crear carpeta
```
"Usuario (pendiente)"
```

#### 2. Agregar 6 endpoints
```
├── getAll (pendiente)
├── getById (pendiente)
├── getByCorreo (pendiente)
├── create (pendiente)
├── update (pendiente)
└── delete (pendiente)
```

#### 3. Configurar cada uno
- Authorization: Bearer + Token_ADMIN
- URL: `{{BASE_URL}}/usuarios/...`
- Body (POST/PUT): Datos válidos
- Headers: Content-Type: application/json

#### 4. Probar todos
- Ejecutar getAll → copiar IDs válidos
- Ejecutar getById con ID copiado
- Ejecutar create con datos nuevos
- Verificar update
- Probar delete

#### 5. Cambiar nombres a (ok)
- Renombrar cada `(pendiente)` a `(ok)`
- Renombrar carpeta a `"Usuario (ok)"`

---

## 📝 Template JSON para Copiar-Pegar

### GET Simple
```json
{
  "name": "getAll (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [{"key": "token", "value": "{{Token_ADMIN}}", "type": "string"}]
    },
    "method": "GET",
    "header": [],
    "url": {
      "raw": "{{BASE_URL}}/recurso",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso"]
    }
  },
  "response": []
}
```

### GET con ID
```json
{
  "name": "getById (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [{"key": "token", "value": "{{Token_ADMIN}}", "type": "string"}]
    },
    "method": "GET",
    "header": [],
    "url": {
      "raw": "{{BASE_URL}}/recurso/1",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso", "1"]
    }
  },
  "response": []
}
```

### POST (Create)
```json
{
  "name": "create (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [{"key": "token", "value": "{{Token_ADMIN}}", "type": "string"}]
    },
    "method": "POST",
    "header": [{"key": "Content-Type", "value": "application/json"}],
    "body": {
      "mode": "raw",
      "raw": "{\n    \"campo1\":\"valor1\",\n    \"campo2\":\"valor2\"\n}",
      "options": {"raw": {"language": "json"}}
    },
    "url": {
      "raw": "{{BASE_URL}}/recurso",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso"]
    }
  },
  "response": []
}
```

### PUT (Update)
```json
{
  "name": "update (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [{"key": "token", "value": "{{Token_ADMIN}}", "type": "string"}]
    },
    "method": "PUT",
    "header": [{"key": "Content-Type", "value": "application/json"}],
    "body": {
      "mode": "raw",
      "raw": "{\n    \"campo1\":\"valor_actualizado\"\n}",
      "options": {"raw": {"language": "json"}}
    },
    "url": {
      "raw": "{{BASE_URL}}/recurso/1",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso", "1"]
    }
  },
  "response": []
}
```

### DELETE
```json
{
  "name": "delete (pendiente)",
  "request": {
    "auth": {
      "type": "bearer",
      "bearer": [{"key": "token", "value": "{{Token_ADMIN}}", "type": "string"}]
    },
    "method": "DELETE",
    "header": [],
    "url": {
      "raw": "{{BASE_URL}}/recurso/1",
      "host": ["{{BASE_URL}}"],
      "path": ["recurso", "1"]
    }
  },
  "response": []
}
```

---

## ⚠️ Errores Comunes a Evitar

❌ **NO Hacer:**
1. URLs hardcodeadas: `"raw": "http://localhost:8080/api/usuarios"`
2. Auth tipo Basic en vez de Bearer
3. Tokens directamente en vez de variables
4. Nombres largos: `"Obtener todos los usuarios por departamento"`
5. JSON mal formado en body: `{"nombre": "test}` (falta cierre)
6. Mezclar Content-Type o no incluirlo en POST/PUT
7. Rutas con espacios: `path": ["usuarios activos"]`

✅ **SÍ Hacer:**
1. URLs con variables: `{{BASE_URL}}/usuarios`
2. Auth tipo Bearer con variable
3. Nombres cortos estándar: `getAll (ok)`
4. JSON bien formado y escaped
5. Incluir headers en POST/PUT
6. Rutas limpias: `path": ["usuarios"]`

---

## 📊 Checklist de Validación Final

Antes de marcar como (ok):

- [ ] Authorization Bearer configurada
- [ ] Token variable usada (no hardcodeado)
- [ ] URL con {{BASE_URL}}
- [ ] Nombre simplificado (getAll, getById, etc)
- [ ] Marcado con (ok) en nombre
- [ ] Body válido para POST/PUT
- [ ] Headers incluyen Content-Type (si aplica)
- [ ] Probado en servidor corriendo
- [ ] Respuesta 200/201/204
- [ ] Datos retornados válidos

---

## 🔐 Variables de Tokens Necesarias

Mantener actualizadas en Postman:

```json
{
  "key": "Token_ADMIN",
  "value": "eyJhbGciOiJIUzI1NiJ9..."
},
{
  "key": "Token_ASPIRANTE",
  "value": "eyJhbGciOiJIUzI1NiJ9..."
},
{
  "key": "Token_RECLUTADOR",
  "value": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Cómo actualizar:**
1. Ejecutar endpoint de Login correspondiente
2. Copiar token de la respuesta
3. Pegar en variable `{{Token_XXX}}`

---

## 📌 Referencia: Entidades Ya Completadas

✅ **Auth (6/6 endpoints - ok)**
✅ **Habilidad (9/9 endpoints - ok)**
✅ **Municipio (7/7 endpoints - ok)** + @OnDelete(SET_NULL)

---

## 🚀 Próximas Entidades a Implementar

Orden recomendado:
1. Usuario (CRÍTICA - base del sistema)
2. Empresa (CRÍTICA - relaciones)
3. Oferta (CRÍTICA - vacantes)
4. Postulación (CRÍTICA - aplicaciones)
5. Estudio (Importante - educación)
6. Experiencia (Importante - CV)
7. Dirección (Complementaria - ubic. empresa)

---

**Última actualización:** 2025-12-04
**Creador:** Copilot
**Propósito:** Guía paso a paso para implementar CRUDs en Postman JSON
