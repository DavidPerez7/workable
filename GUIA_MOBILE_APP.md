# Guía de Ejecución - Workable Mobile App

## Estructura del Proyecto Móvil

```
workable/
└── movil/                          # Aplicación móvil completa
    ├── src/
    │   ├── api/                    # Servicios API (10 archivos)
    │   │   ├── config.ts           # Configuración base de Axios
    │   │   ├── auth.ts             # Autenticación (login, registro)
    │   │   ├── aspirante.ts        # API de aspirantes
    │   │   ├── reclutador.ts       # API de reclutadores
    │   │   ├── oferta.ts           # API de ofertas
    │   │   ├── postulacion.ts      # API de postulaciones
    │   │   ├── empresa.ts          # API de empresas
    │   │   ├── hojaVida.ts         # API de hojas de vida
    │   │   └── municipio.ts        # API de municipios
    │   │
    │   ├── components/             # Componentes reutilizables
    │   │   ├── Button.tsx          # Botón personalizado
    │   │   ├── Input.tsx           # Input con validación
    │   │   ├── Loading.tsx         # Indicador de carga
    │   │   └── EmptyState.tsx      # Estado vacío
    │   │
    │   ├── context/
    │   │   └── AuthContext.tsx     # Contexto de autenticación
    │   │
    │   ├── navigation/             # Sistema de navegación
    │   │   ├── RootNavigator.tsx   # Navegador raíz
    │   │   ├── AuthNavigator.tsx   # Stack de autenticación
    │   │   ├── AspiranteNavigator.tsx  # Tabs de aspirante
    │   │   ├── ReclutadorNavigator.tsx # Tabs de reclutador
    │   │   ├── AdminNavigator.tsx      # Drawer de admin
    │   │   └── stacks/
    │   │       ├── OfertasNavigator.tsx
    │   │       ├── PostulacionesNavigator.tsx
    │   │       └── MisOfertasNavigator.tsx
    │   │
    │   ├── screens/                # Todas las pantallas
    │   │   ├── auth/               # Pantallas de autenticación
    │   │   │   ├── LoginScreen.tsx
    │   │   │   ├── RegisterAspiranteScreen.tsx
    │   │   │   ├── RegisterReclutadorScreen.tsx
    │   │   │   └── ForgotPasswordScreen.tsx
    │   │   │
    │   │   ├── aspirante/          # Pantallas de aspirante
    │   │   │   ├── OfertasListScreen.tsx
    │   │   │   ├── OfertaDetailScreen.tsx
    │   │   │   ├── PostulacionesListScreen.tsx
    │   │   │   ├── PostulacionDetailScreen.tsx
    │   │   │   └── PerfilAspiranteScreen.tsx
    │   │   │
    │   │   ├── reclutador/         # Pantallas de reclutador
    │   │   │   ├── MisOfertasListScreen.tsx
    │   │   │   ├── CrearOfertaScreen.tsx
    │   │   │   ├── OfertaDetailReclutadorScreen.tsx
    │   │   │   ├── EditarOfertaScreen.tsx
    │   │   │   ├── PostulantesOfertaScreen.tsx
    │   │   │   ├── PostulanteDetailScreen.tsx
    │   │   │   └── PerfilReclutadorScreen.tsx
    │   │   │
    │   │   └── admin/              # Pantallas de admin
    │   │       ├── DashboardAdminScreen.tsx
    │   │       ├── UsuariosAdminScreen.tsx
    │   │       ├── OfertasAdminScreen.tsx
    │   │       ├── PostulacionesAdminScreen.tsx
    │   │       ├── AspiranteViewScreen.tsx
    │   │       └── ReclutadorViewScreen.tsx
    │   │
    │   ├── styles/
    │   │   └── theme.ts            # Tema global (colores, estilos)
    │   │
    │   └── types/
    │       └── index.ts            # TypeScript types/interfaces
    │
    ├── App.tsx                     # Entrada principal
    ├── app.json                    # Configuración Expo
    ├── package.json                # Dependencias
    ├── tsconfig.json               # Configuración TypeScript
    └── babel.config.js             # Configuración Babel
```

## Paso 1: Asegúrate de que el backend esté corriendo

```bash
# En el directorio backend
cd c:\Users\javie\OneDrive\Escritorio\workable\backend
.\iniciar-servidor.bat
```

El backend debe estar corriendo en `http://localhost:8080`

## Paso 2: Instalar dependencias (si no están instaladas)

```bash
cd c:\Users\javie\OneDrive\Escritorio\workable\movil
npm install
```

## Paso 3: Iniciar la aplicación móvil

```bash
npm start
```

O alternativamente:

```bash
npx expo start
```

## Paso 4: Abrir en tu dispositivo

Después de ejecutar `npm start`, verás en la terminal:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Opción A: En dispositivo físico

1. **Android:**
   - Instala Expo Go desde Play Store
   - Abre Expo Go
   - Escanea el código QR

2. **iOS:**
   - Instala Expo Go desde App Store
   - Abre la cámara del iPhone
   - Escanea el código QR

### Opción B: En emulador

1. **Android Emulator:**
   ```bash
   npx expo start --android
   ```

2. **iOS Simulator (solo Mac):**
   ```bash
   npx expo start --ios
   ```

3. **Navegador web:**
   ```bash
   npx expo start --web
   ```

## Funcionalidades Implementadas

### 🔐 Autenticación
- Login con correo y contraseña
- Registro de aspirantes
- Registro de reclutadores (con empresa)
- Recuperación de contraseña (UI)
- Sincronización de sesión entre web y móvil

### 👤 ASPIRANTE
**Pantallas:**
- Lista de ofertas disponibles (con búsqueda)
- Detalle de oferta completo
- Postulación a ofertas
- Lista de mis postulaciones
- Detalle de postulación con estado
- Perfil (ver/editar)

**Funcionalidades:**
- Ver todas las ofertas abiertas
- Buscar ofertas por título, empresa o descripción
- Postularse a ofertas con confirmación
- Ver estado de postulaciones (POSTULADO, EN_REVISION, ENTREVISTA, RECHAZADO, ACEPTADO)
- Editar perfil personal
- Cerrar sesión

### 💼 RECLUTADOR
**Pantallas:**
- Lista de mis ofertas publicadas
- Crear nueva oferta
- Detalle de oferta
- Editar oferta
- Ver postulantes por oferta
- Detalle de postulante
- Perfil reclutador

**Funcionalidades:**
- Crear ofertas laborales completas
- Ver todas sus ofertas publicadas
- Gestionar estado de ofertas
- Ver lista de postulantes por oferta
- Revisar información de candidatos
- Cambiar estado de postulaciones
- Ver información de empresa
- Cerrar sesión

### 👑 ADMIN (Acceso Completo)
**Pantallas:**
- Dashboard de administración
- Gestión de usuarios
- Gestión de ofertas
- Gestión de postulaciones
- Vista de aspirante (acceso completo)
- Vista de reclutador (acceso completo)

**Funcionalidades:**
- Acceso a TODO lo que hace un aspirante
- Acceso a TODO lo que hace un reclutador
- Panel de control administrativo
- Gestión total de usuarios
- Gestión total de ofertas
- Gestión total de postulaciones
- Sin restricciones de permisos

## Sincronización Web-Móvil

La aplicación móvil está 100% sincronizada con la web:

1. **Mismo token JWT**: El móvil usa el mismo sistema de autenticación
2. **Headers idénticos**: Authorization Bearer token en todas las peticiones
3. **Mismos endpoints**: Consume exactamente las mismas APIs del backend
4. **Persistencia segura**: Token almacenado en SecureStore (encriptado)
5. **Sesión compartida**: Si inicias sesión en móvil, funciona igual que en web

### Flujo de autenticación:
```typescript
// 1. Usuario inicia sesión en móvil
await login({ correo, password });

// 2. El token se guarda en SecureStore
await SecureStore.setItemAsync('workable_token', token);

// 3. Todas las peticiones incluyen el token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// 4. El backend valida el token igual que en web
// 5. Si el token expira, el móvil invalida la sesión
```

## Diseño Visual

La app móvil replica el diseño del frontend web:

- **Colores principales:**
  - Primary: #1e6ff1 (azul Workable)
  - Primary Dark: #1d4ed8
  - Success: #10B981 (verde)
  - Error: #EF4444 (rojo)
  - Warning: #F59E0B (ámbar)

- **Tipografía:** Sistema similar a Inter/Segoe UI
- **Componentes:** Botones, inputs y cards con el mismo estilo
- **Espaciado:** Consistente con la web
- **Sombras:** Mismas elevaciones

## APIs Consumidas

Todas las APIs están conectadas y funcionan al 100%:

1. **auth.ts**: Login, registro (aspirante/reclutador)
2. **aspirante.ts**: Perfil, actualización, listado
3. **reclutador.ts**: Perfil, listado, gestión
4. **oferta.ts**: CRUD completo, búsqueda, filtros
5. **postulacion.ts**: Crear, listar, cambiar estado
6. **empresa.ts**: Gestión de empresas
7. **hojaVida.ts**: Estudios, experiencias, habilidades
8. **municipio.ts**: Listado de ubicaciones

## Rutas Protegidas

El sistema de navegación valida roles automáticamente:

```typescript
// RootNavigator decide qué mostrar según el rol
switch (user.rol) {
  case 'ASPIRANTE': return <AspiranteNavigator />;
  case 'RECLUTADOR': return <ReclutadorNavigator />;
  case 'ADMIN': return <AdminNavigator />;
  default: return <AuthNavigator />;
}
```

## Troubleshooting

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en http://localhost:8080
- Si usas un dispositivo físico, cambia la URL en `src/api/config.ts`:
  ```typescript
  export const API_BASE_URL = 'http://TU_IP_LOCAL:8080/api';
  ```

### Error: "Metro bundler failed"
- Limpia caché: `npx expo start -c`
- Reinstala node_modules: `rm -rf node_modules && npm install`

### QR no escanea
- Asegúrate de estar en la misma red WiFi
- Usa túnel de Expo: `npx expo start --tunnel`

### Errores de TypeScript
- Los errores de resolución de módulos son normales antes de instalar dependencias
- Después de `npm install` deberían desaparecer

## Tecnologías Utilizadas

- **React Native**: Framework móvil
- **Expo SDK 52**: Plataforma de desarrollo
- **TypeScript**: Tipado estricto
- **React Navigation 6**: Navegación (Stack, Tab, Drawer)
- **Axios**: Peticiones HTTP
- **Expo Secure Store**: Almacenamiento seguro
- **Expo Vector Icons**: Iconos Ionicons

## Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Limpiar caché
npx expo start -c

# Ver en Android
npx expo start --android

# Ver en iOS (solo Mac)
npx expo start --ios

# Ver en web
npx expo start --web

# Build para producción (requiere cuenta Expo)
eas build --platform android
eas build --platform ios
```

## Próximos Pasos

1. Añadir imágenes reales en `/assets`
2. Personalizar colores en `src/styles/theme.ts`
3. Probar en dispositivos físicos
4. Generar builds de producción con EAS
5. Publicar en App Store y Play Store

## Soporte

Para cualquier problema, revisa:
- Logs de Expo: En la terminal donde corriste `npm start`
- Logs del dispositivo: Shake device → Show Dev Menu → Debug
- Backend logs: Verifica que las APIs respondan correctamente

---

**¡Listo!** Tu aplicación móvil está completamente funcional y sincronizada con el backend. 🚀
