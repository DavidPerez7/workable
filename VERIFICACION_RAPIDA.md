# ⚡ Verificación Rápida (5 minutos)

## ✅ Paso 1: Verifica que los Cambios Están en Lugar

### Backend - application.properties
```bash
cd backend
# Abre: src/main/resources/application.properties
# Debe tener:
spring.jpa.hibernate.ddl-auto=update    ✅
spring.jpa.show-sql=false               ✅
```

### Frontend - APIs
```bash
cd movil
# Abre: src/api/hojaVida.ts
# Verifica línea 26-32 tenga:
export const getEstudiosByAspirante = async (): Promise<Estudio[]> => {
  const response = await api.get<Estudio[]>(`/estudio/aspirante`);
  return response.data;
};                                       ✅
```

### Frontend - HojaDeVida
```bash
# Abre: src/screens/aspirante/HojaDeVidaScreen.tsx
# Debe tener 900+ líneas
# Debe tener funciones: openEstudioModal, saveEstudio, deleteEstudioHandler
# Debe tener modales: showEstudioModal, showExperienciaModal, showHabilidadModal
                                         ✅
```

---

## ✅ Paso 2: Inicia Backend

```bash
cd backend
mvn clean spring-boot:run
```

**Espera hasta ver:**
```
Started WorkableApplication in X seconds
```

**Indicadores de OK:**
- ✅ Sin errores rojo
- ✅ Sin "Connection refused"
- ✅ Sin "Port 8080 already in use"

---

## ✅ Paso 3: Inicia App (Nueva Terminal)

```bash
cd movil
expo start --clear
```

**Espera hasta ver:**
```
Local:   exp://...
```

**Presiona:**
- `a` para Android
- `i` para iOS
- O escanea QR con Expo Go

---

## ✅ Paso 4: Login

1. Espera a que cargue la app
2. Ve pantalla de login
3. Ingresa correo y contraseña de aspirante existente
4. Presiona "Inicia Sesión"

**Resultado esperado:**
- ✅ Llega a OfertasListScreen
- ✅ Bottom nav con 4 tabs (Ofertas, Postulaciones, Hoja de Vida, Perfil)

---

## ✅ Paso 5: Test de HojaDeVida (30 segundos)

1. Tap en tab "Hoja de Vida"
2. Ver "Estudios (0)" con botón "+ Agregar Estudio"
3. Tap "+ Agregar Estudio"
4. **Modal debe abrir** con campos vacíos

**Si llega aquí sin errores = ASPIRANTE está OK ✅**

---

## ✅ Paso 6: Test CRUD Rápido (1 minuto)

### Crear
```
- Llenar: Institución, Título, Nivel
- Tap "Guardar"
- Resultado: Alert "Éxito - Estudio creado"
```

### Editar
```
- Tap en estudio para expandir
- Tap "Editar"
- Modal abre con datos
- Cambiar algo
- Tap "Guardar"
- Resultado: Alert "Éxito - Estudio actualizado"
```

### Eliminar
```
- Tap "Eliminar"
- Confirmar en alert
- Resultado: Alert "Éxito - Estudio eliminado"
```

---

## ✅ Paso 7: Test Ofertas (30 segundos)

1. Tap en tab "Ofertas"
2. Ver lista de ofertas (debe haber al menos 1)
3. Tap en una oferta
4. Se abre OfertaDetailScreen con detalles
5. Tap "Postularme"
6. Vuelve a lista
7. Tap en la misma oferta
8. Botón ahora dice "✓ Ya postulado"

**Si todo funciona = ASPIRANTE está OK ✅**

---

## ⚡ Resumen (Si Todo Funcionó)

```
Backend:         ✅ Corriendo
App:            ✅ Abierta
Login:          ✅ Funciona
HojaDeVida:     ✅ CRUD funcional
Ofertas:        ✅ Postular funciona
Validaciones:   ✅ OK

ASPIRANTE:      ✅✅✅ 100% FUNCIONAL
```

---

## ❌ Si Algo Falló

### "Cannot reach server"
```bash
# Backend no está corriendo
# Abre terminal y ejecuta:
cd backend && mvn clean spring-boot:run
```

### "Port 8080 already in use"
```bash
# Mata el proceso:
taskkill /F /IM java.exe
# Intenta de nuevo
```

### Modal no se abre / Error SQL
```bash
# Limpia caché y reinicia:
cd movil
expo start --clear
```

### Sigue fallando
```bash
# Revisa documentación:
- INICIO_FINAL.md
- TEST_ASPIRANTE_COMPLETO.md
- RESUMEN_SOLUCION_FINAL.md
```

---

## 🎯 Próximo Paso (Si Todo OK)

**Una vez verificado:**

1. Sigue el testing completo en [TEST_ASPIRANTE_COMPLETO.md](TEST_ASPIRANTE_COMPLETO.md)
2. Documenta cualquier issue
3. Cuando esté OK, continúa con RECLUTADOR

---

**Tiempo total:** 5 minutos ⏱️  
**Resultado esperado:** ASPIRANTE funcional ✅

---

¡Hecho! 🎉
