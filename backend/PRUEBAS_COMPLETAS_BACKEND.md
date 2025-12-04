# 📋 Documentación de Pruebas Completas del Backend

## Resumen

Este documento describe las **pruebas funcionales completas** del backend de Workable, incluyendo:
- **CRUD por entidad** (Usuarios, Empresas, Ofertas, Citaciones)
- **Control de acceso por roles** (ADMIN, RECLUTADOR, ASPIRANTE)
- **Envío de notificaciones** (WhatsApp + Alertas en app)
- **Flujo completo de citaciones**

---

## 📊 Control de Acceso por Roles

### ADMIN
- ✅ **CREATE**: Crear cualquier entidad
- ✅ **READ**: Ver todas las entidades
- ✅ **UPDATE**: Actualizar cualquier entidad
- ✅ **DELETE**: Eliminar cualquier entidad
- **Endpoints**: POST/GET/PUT/DELETE habilitados

### RECLUTADOR
- ✅ **CREATE**: Crear empresas, ofertas, citaciones
- ✅ **READ**: Ver empresas, ofertas, postulaciones, citaciones
- ✅ **UPDATE**: Actualizar propias empresas, ofertas, citaciones
- ❌ **DELETE**: No permitido (403 Forbidden)
- ✅ **Especial**: Enviar citaciones por WhatsApp

### ASPIRANTE
- ✅ **READ**: Solo lectura (ver ofertas, sus postulaciones, citaciones)
- ✅ **CREATE**: Postularse a ofertas
- ✅ **Especial**: Recibir notificaciones de citaciones
- ❌ **UPDATE/DELETE**: No permitido

---

## 🧪 Pruebas Incluidas

### 1. GESTIÓN DE USUARIOS

#### 1.1 ADMIN - Crear Usuario
```bash
POST /api/usuario
Authorization: Bearer {ADMIN_TOKEN}

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@test.com",
  "telefono": "573104625832",
  "password": "Pass123!",
  "rol": "ASPIRANTE",
  "fechaNacimiento": "1995-05-15",
  "municipioId": 1
}
```
**Esperado**: 200 OK, usuario creado

---

#### 1.2 RECLUTADOR - Crear Usuario
```bash
POST /api/usuario
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 200 OK (RECLUTADOR también puede crear usuarios)

---

#### 1.3 ADMIN - Listar Usuarios
```bash
GET /api/usuario
Authorization: Bearer {ADMIN_TOKEN}
```
**Esperado**: 200 OK, lista de usuarios

---

#### 1.4 ADMIN - Actualizar Usuario
```bash
PUT /api/usuario/{id}
Authorization: Bearer {ADMIN_TOKEN}

{
  "nombre": "JuanMod",
  "apellido": "PérezMod",
  "telefono": "573104625832"
}
```
**Esperado**: 200 OK, usuario actualizado

---

#### 1.5 ADMIN - Eliminar Usuario
```bash
DELETE /api/usuario/{id}
Authorization: Bearer {ADMIN_TOKEN}
```
**Esperado**: 200 OK

---

#### 1.6 RECLUTADOR - Intentar Eliminar (Debe Fallar)
```bash
DELETE /api/usuario/{id}
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 403 Forbidden - "No tienes permisos para eliminar"

---

### 2. GESTIÓN DE EMPRESAS

#### 2.1 ADMIN - Crear Empresa
```bash
POST /api/empresa
Authorization: Bearer {ADMIN_TOKEN}

{
  "nombre": "Tech Solutions",
  "nit": "900123456",
  "sector": "Tecnología",
  "telefono": "6012345678",
  "email": "info@tech.com"
}
```
**Esperado**: 200 OK, empresa creada

---

#### 2.2 RECLUTADOR - Crear Empresa
```bash
POST /api/empresa
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 200 OK (RECLUTADOR puede crear y ser propietario)

---

#### 2.3 RECLUTADOR - Intentar Eliminar (Debe Fallar)
```bash
DELETE /api/empresa/{id}
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 403 Forbidden - "No tienes permisos para eliminar"

---

#### 2.4 ADMIN - Eliminar Empresa
```bash
DELETE /api/empresa/{id}
Authorization: Bearer {ADMIN_TOKEN}
```
**Esperado**: 200 OK

---

### 3. GESTIÓN DE OFERTAS

#### 3.1 RECLUTADOR - Crear Oferta
```bash
POST /api/oferta
Authorization: Bearer {RECLUTADOR_TOKEN}

{
  "titulo": "Desarrollador Java Senior",
  "descripcion": "Se requiere profesional con 5+ años de experiencia...",
  "salarioMin": 3000000,
  "salarioMax": 5000000,
  "experienciaRequerida": "5 años",
  "empresaId": 1
}
```
**Esperado**: 200 OK, oferta creada

---

#### 3.2 RECLUTADOR - Actualizar Oferta
```bash
PUT /api/oferta/{id}
Authorization: Bearer {RECLUTADOR_TOKEN}

{
  "titulo": "Desarrollador Java Senior - ACTUALIZADO",
  "salarioMin": 3500000,
  "salarioMax": 5500000
}
```
**Esperado**: 200 OK, oferta actualizada

---

#### 3.3 RECLUTADOR - Intentar Eliminar (Debe Fallar)
```bash
DELETE /api/oferta/{id}
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 403 Forbidden

---

#### 3.4 ADMIN - Eliminar Oferta
```bash
DELETE /api/oferta/{id}
Authorization: Bearer {ADMIN_TOKEN}
```
**Esperado**: 200 OK

---

### 4. GESTIÓN DE POSTULACIONES

#### 4.1 ASPIRANTE - Postularse
```bash
POST /api/postulacion
Authorization: Bearer {ASPIRANTE_TOKEN}

{
  "ofertaId": 1,
  "usuarioId": 1,
  "carta": "Estoy muy interesado en esta posición..."
}
```
**Esperado**: 200 OK, postulación creada

---

#### 4.2 RECLUTADOR - Cambiar Estado
```bash
PATCH /api/postulacion/{id}/estado
Authorization: Bearer {RECLUTADOR_TOKEN}

{
  "estado": "EN_REVISION"
}
```
**Esperado**: 200 OK, estado actualizado (PENDIENTE → EN_REVISION → SELECCIONADO → CONTRATADO)

---

### 5. GESTIÓN DE CITACIONES

#### 5.1 RECLUTADOR - Crear Citación
```bash
POST /api/citacion
Authorization: Bearer {RECLUTADOR_TOKEN}

{
  "postulacionId": 1,
  "reclutadorId": 2,
  "fechaCitacion": "2025-12-20",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/abc-defg-hij",
  "detalles": "Entrevista técnica con énfasis en arquitectura de microservicios",
  "usuarioIdActual": 2
}
```
**Esperado**: 200 OK, citación creada

---

#### 5.2 RECLUTADOR - Enviar por WhatsApp
```bash
POST /api/citacion/{citacionId}/enviar-whatsapp?usuarioIdActual=2
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Response**:
```json
{
  "mensaje": "Citación enviada por WhatsApp exitosamente",
  "citacionId": 1,
  "mensajeEnviado": true,
  "numeroDestino": "573104625832"
}
```
**Nota**: El usuario destinatario recibe:
1. **WhatsApp**: Mensaje con detalles de la citación y link de Meet
2. **Notificación en app**: Alerta de "Invitación a Entrevista"

---

#### 5.3 ASPIRANTE - Ver Citación
```bash
GET /api/citacion/{citacionId}?usuarioIdActual=1
Authorization: Bearer {ASPIRANTE_TOKEN}
```
**Esperado**: 200 OK (solo puede ver sus propias citaciones)

---

#### 5.4 RECLUTADOR - Cambiar Estado
```bash
PUT /api/citacion/{id}/estado?estado=CONFIRMADA&usuarioIdActual=2
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Estados válidos**: PENDIENTE → CONFIRMADA → ASISTIO / NO_ASISTIO / CANCELADA

**Esperado**: 200 OK

---

#### 5.5 RECLUTADOR - Intentar Eliminar (Debe Fallar)
```bash
DELETE /api/citacion/{id}?usuarioIdActual=2
Authorization: Bearer {RECLUTADOR_TOKEN}
```
**Esperado**: 403 Forbidden

---

#### 5.6 ADMIN - Eliminar Citación
```bash
DELETE /api/citacion/{id}?usuarioIdActual=1
Authorization: Bearer {ADMIN_TOKEN}
```
**Esperado**: 200 OK

---

### 6. GESTIÓN DE NOTIFICACIONES

Las notificaciones se crean **automáticamente** cuando:
- ✉️ Se envía una citación al aspirante
- 📝 Cambia el estado de una postulación
- ⚠️ Se cancela o modifica una citación

#### 6.1 ASPIRANTE - Ver Notificaciones
```bash
GET /api/notificacion/usuario/{usuarioId}
Authorization: Bearer {ASPIRANTE_TOKEN}
```
**Response**:
```json
[
  {
    "id": 1,
    "tipo": "ENTREVISTA",
    "titulo": "🎯 Invitación a Entrevista - Desarrollador Java Senior",
    "mensaje": "¡Felicidades! Fuiste seleccionado para una entrevista el 2025-12-20 a las 10:00.",
    "url": "/citaciones/1",
    "leida": false,
    "fechaCreacion": "2025-12-04"
  }
]
```

---

#### 6.2 ASPIRANTE - Contar No Leídas
```bash
GET /api/notificacion/usuario/{usuarioId}/no-leidas
Authorization: Bearer {ASPIRANTE_TOKEN}
```
**Response**: `2` (cantidad de notificaciones no leídas)

---

#### 6.3 ASPIRANTE - Marcar como Leída
```bash
PATCH /api/notificacion/{id}/leida
Authorization: Bearer {ASPIRANTE_TOKEN}
```
**Esperado**: 200 OK, notificación marcada como leída

---

#### 6.4 ASPIRANTE - Marcar Todas como Leídas
```bash
PATCH /api/notificacion/usuario/{usuarioId}/leidas
Authorization: Bearer {ASPIRANTE_TOKEN}
```
**Esperado**: 204 No Content

---

## 🚀 Ejecutar Pruebas

### Opción 1: Script BAT

```bash
cd backend
test-funcionalidad-completa.bat
```

### Opción 2: Importar en Postman

1. Abre **Postman**
2. `File → Import → Upload Files`
3. Selecciona `Workable_API_Tests_Complete.postman_collection.json`
4. Reemplaza las variables de entorno:
   - `{{BASE_URL}}`: http://localhost:8080
   - `{{ADMIN_TOKEN}}`: Tu token JWT de ADMIN
   - `{{RECLUTADOR_TOKEN}}`: Tu token JWT de RECLUTADOR
   - `{{ASPIRANTE_TOKEN}}`: Tu token JWT de ASPIRANTE

### Opción 3: Manual con cURL

Todos los ejemplos incluyen comandos cURL listos para usar.

---

## 📌 Casos de Error Esperados

| Caso | Resultado Esperado |
|------|-------------------|
| RECLUTADOR intenta DELETE | 403 Forbidden |
| ASPIRANTE intenta POST | 403 Forbidden |
| Token inválido | 401 Unauthorized |
| Entidad no existe | 404 Not Found |
| Datos inválidos | 400 Bad Request |
| Sin permisos de propietario | 403 Forbidden |

---

## ✅ Checklist de Verificación

- [ ] ADMIN puede hacer CRUD en todas las entidades
- [ ] RECLUTADOR puede hacer CRU (sin DELETE)
- [ ] RECLUTADOR NO puede DELETE (recibe 403)
- [ ] Citación genera notificación automática
- [ ] WhatsApp recibe el mensaje con detalles
- [ ] Aspirante recibe alerta en app
- [ ] Estados de citación cambian correctamente
- [ ] Notificaciones se marcan como leídas
- [ ] Contador de no leídas es exacto

---

## 🔐 Variables de Entorno

```bash
BASE_URL=http://localhost:8080
ADMIN_TOKEN=eyJhbGciOiJIUzUxMiJ9... (obtener del login)
RECLUTADOR_TOKEN=eyJhbGciOiJIUzUxMiJ9... (obtener del login)
ASPIRANTE_TOKEN=eyJhbGciOiJIUzUxMiJ9... (obtener del login)
```

---

## 📞 Soporte WhatsApp

Para que funcione el envío por WhatsApp:

1. **Credenciales Meta**:
   - `WHATSAPP_PHONE_NUMBER_ID`: ID del número de teléfono
   - `WHATSAPP_ACCESS_TOKEN`: Token de acceso

2. **Formato de número**: `57XXXXXXXXXX` (con indicativo país)

3. **Verificar en logs**:
   ```
   [INFO] Mensaje de citación enviado por WhatsApp a: 573104625832
   ```

---

## 📄 Archivos Relacionados

- `test-funcionalidad-completa.bat`: Script de pruebas
- `Workable_API_Tests_Complete.postman_collection.json`: Colección Postman
- `CITACION_RESUMEN.md`: Documentación de citaciones
- `Citacion_API.md`: API reference de citaciones

