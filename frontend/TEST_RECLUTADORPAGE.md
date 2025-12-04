# 🚀 Script: Probar ReclutadorPage en 3 Pasos

---

## Opción 1: Prueba Automática (Recomendado)

### Paso 1: Ejecuta el backend

```bash
# Terminal 1 - En la carpeta backend
cd c:\Users\user\Desktop\workable\workable\backend
mvn spring-boot:run

# Espera a ver: 
# Tomcat started on port(s): 8080
```

### Paso 2: Ejecuta el frontend

```bash
# Terminal 2 - En la carpeta frontend
cd c:\Users\user\Desktop\workable\workable\frontend
npm run dev

# Espera a ver:
# Local: http://localhost:3000
```

### Paso 3: Abre en navegador y verifica

1. Abre: `http://localhost:3000`
2. Inicia sesión como reclutador
3. Ve a: `/Reclutador`
4. Presiona: **F12** (DevTools)
5. Ve a: **Network** tab
6. Recarga: **F5**
7. Busca: La petición `oferta`
8. Verifica:
   - Status: `200` ✅
   - URL: `http://localhost:8080/api/oferta` ✅
   - Response: `[{...}, {...}]` ✅

---

## Opción 2: Test Rápido en Console

En la pestaña **Console** (F12), ejecuta:

```javascript
// Verificar conexión con backend
const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/oferta');
    console.log("✅ Conexión exitosa");
    console.log("Status:", response.status);
    
    const data = await response.json();
    console.log("Ofertas:", data);
    console.log("Total:", data.length, "ofertas");
    
    return data.length > 0 ? "✅ FUNCIONA PERFECTAMENTE" : "⚠️ Sin ofertas en BD";
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return "❌ VERIFICAR BACKEND";
  }
};

testConnection().then(result => console.log(result));
```

**Resultado esperado**:
```
✅ Conexión exitosa
Status: 200
Ofertas: (2) [{…}, {…}]
Total: 2 ofertas
✅ FUNCIONA PERFECTAMENTE
```

---

## Opción 3: Prueba en Postman

### 1. Abre Postman
### 2. Crea petición GET
```
GET http://localhost:8080/api/oferta
```

### 3. Haz clic en Send

### 4. Verifica:
- Status: `200 OK` ✅
- Body: Array de ofertas ✅

---

## Problemas Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| **Error 404** | Backend no tiene el endpoint `/api/oferta` |
| **Error CORS** | Backend no permite peticiones desde http://localhost:3000 |
| **Connection refused** | Backend no está corriendo (puerto 8080) |
| **Timeout** | Backend está muy lento o no responde |
| **Array vacío []** | No hay ofertas en la BD |

---

## ✅ Criterios de Éxito

```
✅ ReclutadorPage carga sin errores en console
✅ Se ve en Network: GET /api/oferta con status 200
✅ Response es array con ofertas
✅ Las ofertas aparecen en pantalla
✅ No hay errores de CORS
✅ No hay errores de conexión
```

Si todos estos están ✅ → **¡ReclutadorPage está perfectamente conectada!** 🎉

---

## 📱 Resumen

```
Frontend (3000)  ←→  Backend (8080)
     ↓                    ↓
ReclutadorPage    →  GET /api/oferta
     ↓                    ↓
Muestra ofertas  ←  Array [{...}]
```

---

**¿Necesitas ayuda?** Verifica el archivo `COMO_PROBAR_RECLUTADORPAGE.md` para más detalles.

