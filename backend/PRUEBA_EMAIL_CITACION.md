# Prueba de Envío de Correo de Citación

## Información de Configuración Actualizada

✅ **Correo de Envío:** daviidap07@gmail.com
✅ **Correo de Recepción:** juan14gomezl@gmail.com
✅ **Contraseña:** su1525..
✅ **Servidor:** SMTP Gmail (smtp.gmail.com:587)
✅ **Estado:** Aplicación ejecutándose en localhost:8080

---

## Paso 1: Obtener un Token JWT

Primero, necesitas autenticarte para obtener un token JWT.

**Endpoint:** POST `http://localhost:8080/api/auth/login`

**Body:**
```json
{
  "correo": "reclutador@empresa.com",
  "password": "password123"
}
```

**Respuesta Esperada:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Autenticación exitosa"
}
```

---

## Paso 2: Crear una Citación y Enviar Correo

**Endpoint:** POST `http://localhost:8080/api/citacion`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "postulacionId": 1,
  "reclutadorId": 1,
  "fechaCitacion": "2025-12-15",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
  "detallesCitacion": "Entrevista técnica con énfasis en Spring Boot"
}
```

**Respuesta Esperada:**
```json
{
  "id": 1,
  "postulacion": { ... },
  "reclutador": { ... },
  "fechaCitacion": "2025-12-15",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
  "estado": "PENDIENTE",
  "correoEnviado": false
}
```

---

## Paso 3: Enviar Correo de Citación

**Endpoint:** POST `http://localhost:8080/api/citacion/{id}/enviar-correo`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Esperada:**
```json
{
  "message": "Correo enviado exitosamente",
  "id": 1,
  "destinatario": "juan14gomezl@gmail.com"
}
```

---

## Paso 4: Verificar Estado de la Citación

**Endpoint:** GET `http://localhost:8080/api/citacion/{id}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Esperada:**
```json
{
  "id": 1,
  "postulacion": { ... },
  "reclutador": { ... },
  "fechaCitacion": "2025-12-15",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
  "estado": "PENDIENTE",
  "correoEnviado": true,
  "fechaEnvio": "2025-12-04T17:10:00",
  "observaciones": null
}
```

---

## Prueba Rápida con cURL

### 1. Autenticarse
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "reclutador@empresa.com",
    "password": "password123"
  }'
```

### 2. Crear Citación
```bash
curl -X POST http://localhost:8080/api/citacion \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postulacionId": 1,
    "reclutadorId": 1,
    "fechaCitacion": "2025-12-15",
    "hora": "10:00",
    "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
    "detallesCitacion": "Entrevista técnica"
  }'
```

### 3. Enviar Correo
```bash
curl -X POST http://localhost:8080/api/citacion/1/enviar-correo \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Información de Correo

📧 **Remitente:** daviidap07@gmail.com
📧 **Destinatario:** juan14gomezl@gmail.com

El correo será enviado en formato HTML con:
- Nombre del candidato
- Posición/Oferta
- Fecha y hora de la citación
- Link de Google Meet (clickeable)
- Nombre del entrevistador
- Detalles adicionales
- Logo/Branding de la empresa

---

## Posibles Errores y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Authentication failed` | Contraseña incorrecta | Verificar que la contraseña sea `su1525..` |
| `Connection refused` | SMTP no disponible | Verificar conexión a internet |
| `Invalid JWT` | Token expirado | Obtener nuevo token |
| `Postulación no encontrada` | ID de postulación inválido | Verificar que la postulación existe |
| `Usuario no autenticado` | Token faltante | Incluir encabezado `Authorization` |

---

## Logs de Aplicación

La aplicación está registrando todos los intentos de envío de correo. Para ver los logs:

```
tail -f target/workable-0.0.1-SNAPSHOT.jar logs
```

O en la consola donde se ejecutó el JAR.

---

## Nota Importante

Asegúrate de que:
1. ✅ Gmail tiene "Acceso para aplicaciones menos seguras" habilitado
2. ✅ O tienes configurada una contraseña de aplicación (App Password)
3. ✅ Firewall permite conexiones SMTP en puerto 587
4. ✅ La aplicación está corriendo en `localhost:8080`

---

**Última actualización:** 2025-12-04
**Estado:** Pruebas en progreso
