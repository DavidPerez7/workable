# EJEMPLOS DE USO - CITACIONES

## 1. Crear una Citación Individual

### Request
```
POST http://localhost:8080/api/citacion?postulacionId=1&reclutadorId=5&fechaCitacion=2025-12-15&hora=10:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&detalles=Entrevista técnica con énfasis en Spring Boot&usuarioIdActual=5
```

### Response (200 OK)
```json
{
  "mensaje": "Citación creada exitosamente",
  "citacionId": 1,
  "estado": "PENDIENTE"
}
```

---

## 2. Crear Múltiples Citaciones

### Request
```
POST http://localhost:8080/api/citacion/multiples?postulacionIds=1,2,3&reclutadorId=5&fechaCitacion=2025-12-15&hora=14:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&detalles=Ronda de entrevistas grupal&usuarioIdActual=5
```

### Response (200 OK)
```json
{
  "citacionesCreadas": 3,
  "correosEnviados": [
    "juan.perez@email.com",
    "maria.garcia@email.com",
    "carlos.lopez@email.com"
  ],
  "errores": [],
  "total": 3,
  "exitosas": 3
}
```

---

## 3. Obtener una Citación

### Request
```
GET http://localhost:8080/api/citacion/1?usuarioIdActual=5
```

### Response (200 OK)
```json
{
  "id": 1,
  "postulacion": {
    "id": 1,
    "usuario": {
      "id": 3,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan.perez@email.com",
      "telefono": "3105551234",
      "municipio": {
        "id": 1,
        "nombre": "Bogotá"
      }
    },
    "oferta": {
      "id": 2,
      "titulo": "Desarrollador Java Senior",
      "descripcion": "Buscamos desarrollador con experiencia en Spring Boot",
      "salarioMinimo": 3500000,
      "salarioMaximo": 5000000
    },
    "estado": "PENDIENTE",
    "fechaCreacion": "2025-12-01T10:30:00",
    "fechaActualizacion": "2025-12-01T10:30:00"
  },
  "reclutador": {
    "id": 5,
    "nombre": "María",
    "apellido": "García",
    "correo": "maria.garcia@empresa.com",
    "rol": "RECLUTADOR"
  },
  "fechaCitacion": "2025-12-15",
  "hora": "10:00",
  "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
  "detallesCitacion": "Entrevista técnica con énfasis en Spring Boot",
  "estado": "PENDIENTE",
  "correoEnviado": false,
  "fechaEnvio": "2025-12-04T14:25:00",
  "fechaCreacion": "2025-12-04T14:25:00",
  "isActive": true
}
```

---

## 4. Obtener Citaciones del Reclutador

### Request
```
GET http://localhost:8080/api/citacion/reclutador/5?usuarioIdActual=5
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "postulacion": {
      "id": 1,
      "usuario": {
        "id": 3,
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan.perez@email.com"
      },
      "oferta": {
        "id": 2,
        "titulo": "Desarrollador Java Senior"
      }
    },
    "reclutador": {
      "id": 5,
      "nombre": "María",
      "apellido": "García"
    },
    "fechaCitacion": "2025-12-15",
    "hora": "10:00",
    "estado": "PENDIENTE",
    "correoEnviado": false
  },
  {
    "id": 2,
    "postulacion": {
      "id": 2,
      "usuario": {
        "id": 4,
        "nombre": "Carlos",
        "apellido": "López",
        "correo": "carlos.lopez@email.com"
      },
      "oferta": {
        "id": 2,
        "titulo": "Desarrollador Java Senior"
      }
    },
    "reclutador": {
      "id": 5,
      "nombre": "María",
      "apellido": "García"
    },
    "fechaCitacion": "2025-12-15",
    "hora": "14:00",
    "estado": "CONFIRMADA",
    "correoEnviado": true
  }
]
```

---

## 5. Obtener Citaciones del Aspirante

### Request
```
GET http://localhost:8080/api/citacion/aspirante/3?usuarioIdActual=3
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "postulacion": {
      "id": 1,
      "oferta": {
        "id": 2,
        "titulo": "Desarrollador Java Senior",
        "empresa": {
          "id": 1,
          "nombre": "Tech Solutions Ltd"
        }
      }
    },
    "reclutador": {
      "id": 5,
      "nombre": "María",
      "apellido": "García"
    },
    "fechaCitacion": "2025-12-15",
    "hora": "10:00",
    "linkMeet": "https://meet.google.com/pys-jsbr-nmz",
    "estado": "PENDIENTE",
    "fechaEnvio": "2025-12-04T14:25:00"
  }
]
```

---

## 6. Enviar Citación por Correo

### Request
```
POST http://localhost:8080/api/citacion/1/enviar-correo?usuarioIdActual=5
```

### Response (200 OK)
```json
{
  "mensaje": "Correo de citación enviado exitosamente",
  "citacionId": 1,
  "correoEnviado": "juan.perez@email.com"
}
```

---

## 7. Cambiar Estado de Citación

### Request
```
PUT http://localhost:8080/api/citacion/1/estado?estado=CONFIRMADA&usuarioIdActual=5
```

### Estados válidos:
- `PENDIENTE`
- `CONFIRMADA`
- `ASISTIO`
- `NO_ASISTIO`
- `CANCELADA`

### Response (200 OK)
```json
{
  "mensaje": "Estado actualizado exitosamente",
  "nuevoEstado": "CONFIRMADA"
}
```

---

## 8. Obtener Citaciones de una Oferta

### Request
```
GET http://localhost:8080/api/citacion/oferta/2?usuarioIdActual=5
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "postulacion": {
      "usuario": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan.perez@email.com"
      }
    },
    "reclutador": {
      "nombre": "María",
      "apellido": "García"
    },
    "fechaCitacion": "2025-12-15",
    "hora": "10:00",
    "estado": "PENDIENTE"
  },
  {
    "id": 2,
    "postulacion": {
      "usuario": {
        "nombre": "Carlos",
        "apellido": "López",
        "correo": "carlos.lopez@email.com"
      }
    },
    "reclutador": {
      "nombre": "María",
      "apellido": "García"
    },
    "fechaCitacion": "2025-12-15",
    "hora": "14:00",
    "estado": "CONFIRMADA"
  }
]
```

---

## 9. Eliminar Citación

### Request
```
DELETE http://localhost:8080/api/citacion/1?usuarioIdActual=5
```

### Response (200 OK)
```json
{
  "mensaje": "Citación eliminada exitosamente"
}
```

---

## ERRORES COMUNES

### 403 Forbidden - Sin permisos
```json
{
  "error": "No tienes permisos para crear citaciones"
}
```
**Solución:** Usar usuario RECLUTADOR o ADMIN

### 404 Not Found - Postulación no existe
```json
{
  "error": "Postulación no encontrada"
}
```
**Solución:** Verificar que el postulacionId existe

### 400 Bad Request - Estado inválido
```json
{
  "error": "Estado inválido: INVALIDO"
}
```
**Solución:** Usar uno de los estados válidos

### 500 Internal Server Error - Problemas con email
```json
{
  "error": "Error al enviar correo: SMTP not configured"
}
```
**Solución:** Configurar MAIL_USERNAME y MAIL_PASSWORD

---

## SCRIPT DE PRUEBA COMPLETO

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"
RECLUTADOR_ID=5
USUARIO_ACTUAL=5

# 1. Crear citación
echo "1. Creando citación..."
curl -X POST "$BASE_URL/citacion?postulacionId=1&reclutadorId=$RECLUTADOR_ID&fechaCitacion=2025-12-15&hora=10:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&usuarioIdActual=$USUARIO_ACTUAL"

# 2. Obtener citación
echo -e "\n2. Obteniendo citación..."
curl -X GET "$BASE_URL/citacion/1?usuarioIdActual=$USUARIO_ACTUAL"

# 3. Enviar correo
echo -e "\n3. Enviando correo..."
curl -X POST "$BASE_URL/citacion/1/enviar-correo?usuarioIdActual=$USUARIO_ACTUAL"

# 4. Cambiar estado
echo -e "\n4. Cambiando estado..."
curl -X PUT "$BASE_URL/citacion/1/estado?estado=CONFIRMADA&usuarioIdActual=$USUARIO_ACTUAL"

# 5. Listar citaciones del reclutador
echo -e "\n5. Listando citaciones..."
curl -X GET "$BASE_URL/citacion/reclutador/$RECLUTADOR_ID?usuarioIdActual=$USUARIO_ACTUAL"
```

---

## DATOS DE PRUEBA

### Usuario Reclutador (para crear citaciones)
- ID: 5
- Nombre: María
- Rol: RECLUTADOR
- Email: maria.garcia@empresa.com

### Usuario Aspirante (para recibir citación)
- ID: 3
- Nombre: Juan
- Rol: ASPIRANTE
- Email: juan.perez@email.com

### Oferta (para la postulación)
- ID: 2
- Título: Desarrollador Java Senior

### Postulación (para la citación)
- ID: 1
- Usuario: Juan (ID: 3)
- Oferta: Desarrollador Java Senior (ID: 2)
