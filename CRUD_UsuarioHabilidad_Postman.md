# CRUD UsuarioHabilidad - Postman (Con HabilidadEnum)

## Valores válidos para `habilidad` (HabilidadEnum):
```
JAVA
PYTHON
JAVASCRIPT
REACT
SPRING_BOOT
SQL
DOCKER
AWS
GIT
LIDERAZGO
COMUNICACION
TRABAJO_EQUIPO
RESOLUCION_PROBLEMAS
SCRUM
ANALISIS_DATOS
EXCEL_AVANZADO
MARKETING_DIGITAL
NEGOCIACION
PENSAMIENTO_CRITICO
```

## Valores válidos para `nivel` (NivelDominio):
```
BASICO
INTERMEDIO
AVANZADO
EXPERTO
```

---

## **CREAR HABILIDAD (ASPIRANTE y ADMIN)**
**Method:** `POST`  
**URL:** `http://localhost:8080/api/usuario-habilidad`  
**Autenticación:** Bearer Token (ASPIRANTE o ADMIN)

```json
{
  "habilidad": "JAVA",
  "nivel": "AVANZADO",
  "aspirante": {
    "id": 1
  },
  "fechaAdquisicion": "2020-01-15"
}
```

---

## **OBTENER HABILIDADES DE UN ASPIRANTE (Todos autenticados)**
**Method:** `GET`  
**URL:** `http://localhost:8080/api/usuario-habilidad/usuario/{aspiranteId}`  
**Autenticación:** Bearer Token

**Ejemplo:**
```
GET http://localhost:8080/api/usuario-habilidad/usuario/1
```

---

## **OBTENER HABILIDAD POR ID (Todos autenticados)**
**Method:** `GET`  
**URL:** `http://localhost:8080/api/usuario-habilidad/{id}`  
**Autenticación:** Bearer Token

**Ejemplo:**
```
GET http://localhost:8080/api/usuario-habilidad/5
```

---

## **ACTUALIZAR HABILIDAD (ASPIRANTE sus propias o ADMIN)**
**Method:** `PUT`  
**URL:** `http://localhost:8080/api/usuario-habilidad/{id}`  
**Autenticación:** Bearer Token (ASPIRANTE o ADMIN)

```json
{
  "habilidad": "JAVA",
  "nivel": "EXPERTO",
  "aspirante": {
    "id": 1
  },
  "fechaAdquisicion": "2018-06-20"
}
```

---

## **ELIMINAR HABILIDAD (ASPIRANTE sus propias o ADMIN)**
**Method:** `DELETE`  
**URL:** `http://localhost:8080/api/usuario-habilidad/{id}`  
**Autenticación:** Bearer Token (ASPIRANTE o ADMIN)

```json
// Sin body
```

---

## **RESUMEN QUICK - USUARIOHABILIDAD**

| Operación | Método | URL | Autenticación |
|-----------|--------|-----|-----------------|
| CREATE | POST | `/api/usuario-habilidad` | ✅ ASPIRANTE, ADMIN |
| READ por aspirante | GET | `/api/usuario-habilidad/usuario/{id}` | ✅ ASPIRANTE, RECLUTADOR, ADMIN |
| READ por ID | GET | `/api/usuario-habilidad/{id}` | ✅ ASPIRANTE, RECLUTADOR, ADMIN |
| UPDATE | PUT | `/api/usuario-habilidad/{id}` | ✅ ASPIRANTE (propio), ADMIN |
| DELETE | DELETE | `/api/usuario-habilidad/{id}` | ✅ ASPIRANTE (propio), ADMIN |

---

## **NOTAS IMPORTANTES:**

1. **Valores de `habilidad`:** Deben ser exactamente como están en el enum (mayúsculas con guion bajo)
2. **Valores de `nivel`:** BASICO, INTERMEDIO, AVANZADO, EXPERTO
3. **ASPIRANTE:** Solo puede crear/actualizar/eliminar sus propias habilidades
4. **ADMIN:** Puede crear/actualizar/eliminar habilidades de cualquier aspirante
5. **RECLUTADOR:** Solo puede READ (no tiene CREATE/UPDATE/DELETE)
6. **Duplicate check:** No se puede agregar la misma habilidad dos veces al mismo aspirante

---

## **EJEMPLO COMPLETO - Flujo como ASPIRANTE:**

### 1. Crear habilidad (Con token de aspirante ID=1)
```
POST /api/usuario-habilidad
{
  "habilidad": "SPRING_BOOT",
  "nivel": "INTERMEDIO",
  "aspirante": { "id": 1 }
}
```

### 2. Ver mis habilidades
```
GET /api/usuario-habilidad/usuario/1
```

### 3. Actualizar una habilidad (ID de la habilidad creada)
```
PUT /api/usuario-habilidad/1
{
  "habilidad": "SPRING_BOOT",
  "nivel": "AVANZADO",
  "aspirante": { "id": 1 }
}
```

### 4. Eliminar una habilidad
```
DELETE /api/usuario-habilidad/1
```
