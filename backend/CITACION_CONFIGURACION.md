# CONFIGURACIÓN FINAL - SISTEMA DE CITACIONES

## ✅ PASOS DE CONFIGURACIÓN

### 1. Agregar Dependencia Maven (COMPLETADO ✓)

**Archivo:** `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Estado:** ✅ Ya incluido en pom.xml

---

### 2. Configurar SMTP (EN APLICACIÓN.PROPERTIES)

**Archivo:** `src/main/resources/application.properties`

```properties
# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:tu-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:tu-contraseña-de-app}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

**Estado:** ✅ Ya configurado

---

### 3. Crear Variables de Entorno

#### Opción A: Windows PowerShell

```powershell
# Temporal (solo para esta sesión)
$env:MAIL_USERNAME = "tu-email@gmail.com"
$env:MAIL_PASSWORD = "tu-contraseña-app-16-caracteres"

# Verificar
Write-Host $env:MAIL_USERNAME
```

#### Opción B: Variables de Entorno Permanentes

1. **Abrir Variables de Entorno** (Windows)
   - Presiona: `Win + X` → Sistema
   - Configuración Avanzada del Sistema
   - Variables de Entorno

2. **Agregar nueva variable de usuario:**
   - Variable: `MAIL_USERNAME`
   - Valor: `tu-email@gmail.com`

3. **Agregar segunda variable:**
   - Variable: `MAIL_PASSWORD`
   - Valor: `tu-contraseña-app`

4. **Reiniciar aplicación** (para que lea variables)

#### Opción C: En application.properties (NO RECOMENDADO)

```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-contraseña-de-app
```

⚠️ **Riesgo:** Las credenciales quedarían en Git

---

### 4. Obtener Credenciales de Gmail

#### Paso 1: Activar 2FA (Autenticación de Dos Factores)

1. Ir a: https://myaccount.google.com
2. Seguridad en el menú izquierdo
3. Activar "Verificación en dos pasos"
4. Seleccionar método (SMS o Authenticator App)

#### Paso 2: Generar Contraseña de Aplicación

1. Ir a: https://myaccount.google.com/apppasswords
2. Seleccionar: Correo → Windows Computer (o tu plataforma)
3. Google generará una contraseña de 16 caracteres
4. **Copiar y guardar en tu gestor de contraseñas**

Ejemplo de contraseña generada:
```
zyxw vcba tsrq ponm
```
(Sin espacios: `zyxwvcbatsrqponm`)

---

### 5. Crear Base de Datos (Tabla Citacion)

**Spring Boot creará automáticamente con:**
```
spring.jpa.hibernate.ddl-auto=create
```

O si prefieres script SQL manual:

```sql
CREATE TABLE IF NOT EXISTS citacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT NOT NULL,
    reclutador_id BIGINT,
    fecha_citacion DATE NOT NULL,
    hora VARCHAR(5) NOT NULL,
    link_meet VARCHAR(1000) NOT NULL,
    detalles_citacion VARCHAR(1000),
    estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    fecha_envio DATETIME NOT NULL,
    correo_enviado BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones VARCHAR(500),
    fecha_creacion DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_citacion_postulacion 
        FOREIGN KEY (postulacion_id) 
        REFERENCES postulacion(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_citacion_reclutador 
        FOREIGN KEY (reclutador_id) 
        REFERENCES usuario(id) ON DELETE SET NULL,
    
    INDEX idx_postulacion (postulacion_id),
    INDEX idx_reclutador (reclutador_id),
    INDEX idx_fecha (fecha_citacion),
    INDEX idx_estado (estado)
);
```

---

### 6. Compilar el Proyecto

```bash
cd backend
mvn clean compile
```

**Resultado esperado:**
```
[INFO] BUILD SUCCESS
```

---

### 7. Iniciar la Aplicación

```bash
mvn spring-boot:run
```

**Verifica en logs:**
```
[INFO] Started Application in 12.345 seconds
[INFO] Starting MailSender configuration...
[INFO] JavaMailSender initialized
```

---

## 🧪 PRUEBAS

### Test 1: Crear Citación Individual

```bash
curl -X POST "http://localhost:8080/api/citacion?postulacionId=1&reclutadorId=5&fechaCitacion=2025-12-15&hora=10:00&linkMeet=https://meet.google.com/pys-jsbr-nmz&usuarioIdActual=5"
```

**Respuesta esperada (200):**
```json
{
  "mensaje": "Citación creada exitosamente",
  "citacionId": 1,
  "estado": "PENDIENTE"
}
```

### Test 2: Enviar Correo

```bash
curl -X POST "http://localhost:8080/api/citacion/1/enviar-correo?usuarioIdActual=5"
```

**Respuesta esperada (200):**
```json
{
  "mensaje": "Correo de citación enviado exitosamente",
  "citacionId": 1,
  "correoEnviado": "candidato@email.com"
}
```

### Test 3: Ver Citaciones

```bash
curl -X GET "http://localhost:8080/api/citacion/reclutador/5?usuarioIdActual=5"
```

**Respuesta esperada (200):** Lista de citaciones

---

## 📋 CHECKLIST DE CONFIGURACIÓN

```
SETUP INICIAL
☐ Dependencia en pom.xml
☐ Configuración SMTP en application.properties
☐ Variables de entorno (MAIL_USERNAME, MAIL_PASSWORD)
☐ Credenciales de Gmail configuradas
☐ Tabla citacion creada en BD

VALIDACIÓN
☐ mvn clean compile → BUILD SUCCESS
☐ Logs muestran "JavaMailSender initialized"
☐ Tabla citacion existe en BD

FUNCIONALIDAD
☐ POST /api/citacion → Crear exitosa
☐ POST /api/citacion/{id}/enviar-correo → Email enviado
☐ GET /api/citacion/{id} → Retorna datos correcto
☐ PUT /api/citacion/{id}/estado → Actualiza estado
☐ DELETE /api/citacion/{id} → Soft delete funcionando

SEGURIDAD
☐ Solo RECLUTADOR/ADMIN pueden crear
☐ ASPIRANTE solo ve sus propias citaciones
☐ Validación de permisos en todos los endpoints
```

---

## 🔧 TROUBLESHOOTING

### Error: "No suitable HttpMessageConverter found for response type"

**Causa:** La aplicación no puede enviar email

**Solución:**
```bash
# 1. Verificar credenciales
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD

# 2. Reiniciar PowerShell

# 3. Reiniciar aplicación
```

---

### Error: "Connection timed out"

**Causa:** Puerto SMTP bloqueado

**Solución:**
```properties
# Cambiar puerto en application.properties
spring.mail.port=465  # en lugar de 587
spring.mail.properties.mail.smtp.socketFactory.port=465
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
```

---

### Error: "Authentication failed"

**Causa:** Contraseña incorrecta o 2FA no habilitado

**Solución:**
1. Verificar 2FA está activado
2. Regenerar contraseña de aplicación
3. Copiar exactamente (sin espacios)
4. Reiniciar aplicación

---

### Error: "Recipient address rejected"

**Causa:** Correo del aspirante inválido

**Solución:**
```java
// Validar en CandidatoDetalleDto
if (!aspirante.getCorreo().contains("@")) {
    throw new RuntimeException("Email inválido");
}
```

---

### Log: "Correo de citación enviado a: candidato@email.com" ✓

**Éxito:** El correo fue enviado exitosamente

---

## 📊 ESTADÍSTICAS DE COMPILACIÓN

```
Archivos Java: 74 total
  ├── Nuevos: 5
  │   ├── Citacion.java
  │   ├── CitacionRepo.java
  │   ├── EmailService.java
  │   ├── CitacionService.java
  │   └── CitacionController.java
  │
  └── Modificados: 2
      ├── pom.xml
      └── application.properties

Líneas de código añadidas: ~1200
Endpoints nuevos: 9
Estados de compilación: ✅ SUCCESS
```

---

## 🚀 PRÓXIMO PASO

Una vez configurado, prueba el flujo completo:

```bash
# 1. Ver aspirantes de una oferta
GET /api/postulacion/oferta/2/aspirantes

# 2. Crear citaciones para múltiples
POST /api/citacion/multiples

# 3. Verificar que los correos se enviaron
GET /api/citacion/reclutador/5

# 4. El aspirante ve sus citaciones
GET /api/citacion/aspirante/3
```

---

## 📞 REFERENCIAS

- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **Spring Mail Documentation:** https://spring.io/guides/gs/sending-email/
- **JavaMail API:** https://javaee.github.io/javamail/

---

## ✅ ESTADO FINAL

```
✓ Código implementado y compilado
✓ Seguridad configurada
✓ Database schema preparado
✓ Email service listo
✓ Documentación completa

ESTADO: 🟢 LISTO PARA USAR
(Solo requiere configuración de credenciales SMTP)
```
