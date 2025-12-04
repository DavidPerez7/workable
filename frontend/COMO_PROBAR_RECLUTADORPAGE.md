# ✅ Guía: Verificar Conexión de ReclutadorPage.jsx con Backend

---

## 📌 Resumen de la Conexión

```
ReclutadorPage.jsx
    ↓
Importa: getAllOfertas() de ofertasAPI.js
    ↓
ofertasAPI.js hace:
    GET http://localhost:8080/api/oferta
    ↓
Backend retorna: Array de ofertas
    ↓
ReclutadorPage.jsx muestra las ofertas en pantalla
```

---

## 🧪 Método 1: Prueba en el Navegador (RECOMENDADO)

### Paso 1: Asegúrate de que el backend esté corriendo

```bash
# En una terminal, verifica que Spring Boot esté en el puerto 8080
# Deberías ver: Tomcat started on port(s): 8080
```

### Paso 2: Abre el frontend

```bash
# En otra terminal en la carpeta frontend
npm run dev

# Resultado esperado:
# VITE v6.3.5  ready in 123 ms
# ➜  Local:   http://localhost:3000
```

### Paso 3: Navega a ReclutadorPage

1. Abre `http://localhost:3000` en tu navegador
2. Inicia sesión como reclutador
3. Ve a la página `/Reclutador`
4. Deberías ver: **Lista de ofertas cargadas**

### Paso 4: Abre DevTools para verificar

1. Presiona `F12` (Developer Tools)
2. Ve a la pestaña **Network**
3. Recarga la página (F5)
4. Busca la petición `oferta`
5. Verifica:
   - ✅ **URL**: `http://localhost:8080/api/oferta`
   - ✅ **Método**: `GET`
   - ✅ **Status**: `200 OK`
   - ✅ **Response**: Array de ofertas `[{...}, {...}]`

---

## 🔍 Método 2: Verificar con Console

### Paso 1: Abre DevTools (F12)

### Paso 2: Ve a la pestaña **Console**

### Paso 3: Ejecuta este código:

```javascript
// Ver las ofertas cargadas
console.log("Ofertas:", document.querySelector('[class*="oferta"]'));

// O verifica directamente llamando a la API
fetch('http://localhost:8080/api/oferta')
  .then(res => res.json())
  .then(data => console.log('Respuesta:', data))
  .catch(err => console.error('Error:', err));
```

### Paso 4: Resultado esperado

```javascript
Respuesta: [
  {
    id: 1,
    titulo: "Desarrollador Backend Java",
    descripcion: "Se busca desarrollador con 5+ años",
    empresa: {...},
    ...
  },
  {
    id: 2,
    titulo: "Frontend React Senior",
    ...
  }
]
```

---

## 🧪 Método 3: Prueba con Postman

### Paso 1: Abre Postman

### Paso 2: Crea una petición GET

```
Método: GET
URL: http://localhost:8080/api/oferta
Headers: Content-Type: application/json
```

### Paso 3: Haz clic en **Send**

### Paso 4: Verifica la respuesta

- ✅ **Status**: `200 OK`
- ✅ **Body**: Array de ofertas
- ✅ **Time**: < 500ms (rápido)

---

## 🛠️ Solucionar Problemas

### ❌ Problema: "Error al obtener ofertas"

**Causa posible 1**: Backend no está corriendo

**Solución**:
```bash
# En la carpeta backend
mvn spring-boot:run

# O si usas IDE: Run → Run 'WorkableApplication'
```

**Verificar**:
- Abre `http://localhost:8080` en el navegador
- Deberías ver una página de error de Spring Boot (eso significa que está corriendo)

---

### ❌ Problema: "No se pudo conectar con el servidor"

**Causa posible**: CORS no está configurado

**Verificar en DevTools (F12)**:
1. Network → Ver la petición GET
2. Busca en Headers: `Access-Control-Allow-Origin`
3. Si NO está → El backend necesita CORS

**Solución en Backend**:

En `WorkableApplication.java` o en una clase `@Configuration`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

### ❌ Problema: "Ofertas undefined" o lista vacía

**Causa posible 1**: No hay ofertas en la base de datos

**Solución**:
1. Ve a Postman
2. Haz POST a `http://localhost:8080/api/oferta`
3. Crea algunas ofertas
4. Recarga la página

**Causa posible 2**: El endpoint no está implementado

**Verificar**:
1. En el backend, busca `OfertaController.java`
2. Verifica que exista: `@GetMapping("")` o `@GetMapping("/")`
3. Si no existe, implementa:

```java
@GetMapping("")
public ResponseEntity<List<Oferta>> getAllOfertas() {
    List<Oferta> ofertas = ofertaService.getAllOfertas();
    return ResponseEntity.ok(ofertas);
}
```

---

### ❌ Problema: "TypeError: ofertas is not iterable"

**Causa**: La respuesta del backend no es un array

**Verificar**:
1. En Postman, verifica la respuesta
2. Deberías ver: `[ {...}, {...} ]` (array)
3. Si ves: `{ ofertas: [...] }` (objeto), entonces en ReclutadorPage.jsx:

```javascript
// Cambiar:
const data = await getAllOfertas();
setOfertas(data);

// A:
const data = await getAllOfertas();
setOfertas(data.ofertas); // Si está envuelto en objeto
```

---

## ✅ Checklist de Verificación

- [ ] ¿Backend está corriendo en puerto 8080?
- [ ] ¿Frontend está corriendo en puerto 3000?
- [ ] ¿Iniciaste sesión como reclutador?
- [ ] ¿Ves la página `/Reclutador` sin errores?
- [ ] ¿En DevTools (F12) → Network, ves petición GET a `/api/oferta`?
- [ ] ¿El status de la petición es 200?
- [ ] ¿La respuesta es un array de ofertas?
- [ ] ¿Las ofertas se muestran en la pantalla?

Si todos están ✅, entonces **ReclutadorPage.jsx está correctamente conectada al backend** 🎉

---

## 📊 Flujo Completo de Ejecución

```
1. Usuario abre http://localhost:3000
   ↓
2. React carga ReclutadorPage.jsx
   ↓
3. useEffect() se ejecuta
   ↓
4. Llama: getAllOfertas()
   ↓
5. ofertasAPI.js hace: GET http://localhost:8080/api/oferta
   ↓
6. Backend OfertaController responde con array de ofertas
   ↓
7. ReclutadorPage.jsx recibe datos
   ↓
8. setOfertas(data) actualiza el estado
   ↓
9. Componente re-renderiza mostrando las ofertas
   ↓
10. Usuario ve la lista de ofertas en pantalla ✅
```

---

## 🔧 Si Necesitas Debuggear

### En ReclutadorPage.jsx, agrega logs:

```javascript
useEffect(() => {
  const fetchOfertas = async () => {
    try {
      console.log("Iniciando fetch de ofertas...");
      
      const data = await getAllOfertas();
      console.log("Ofertas recibidas:", data);
      
      setOfertas(data);
      console.log("Estado actualizado");
      
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);
    } finally {
      setLoading(false);
    }
  };
  fetchOfertas();
}, []);
```

### Luego abre Console (F12) y verás:

```
Iniciando fetch de ofertas...
Ofertas recibidas: [{id: 1, ...}, {id: 2, ...}]
Estado actualizado
```

Si ves esto → **¡Todo está funcionando perfecto!** ✅

---

## 📞 Última Verificación Rápida

### Abre tu navegador y ejecuta en Console (F12):

```javascript
// 1. Verificar que axios está disponible (si lo usas)
console.log("Axios:", typeof axios);

// 2. Hacer petición a la API
fetch('http://localhost:8080/api/oferta')
  .then(res => {
    console.log("Status:", res.status); // Deberías ver 200
    return res.json();
  })
  .then(data => {
    console.log("Ofertas:", data);
    console.log("Cantidad:", data.length); // Número de ofertas
  })
  .catch(err => console.error("Error:", err.message));
```

### Resultado esperado:

```
Status: 200
Ofertas: (2) [{…}, {…}]
Cantidad: 2
```

---

¡Listo! Ahora sabes cómo verificar que ReclutadorPage.jsx está conectada correctamente. 🚀

