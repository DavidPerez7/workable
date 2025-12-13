# Workable Mobile App

Aplicación móvil profesional para el sistema de gestión de ofertas laborales Workable.

## Características

- 🔐 **Autenticación completa**: Login, registro de aspirantes y reclutadores
- 👤 **Tres roles de usuario**: Aspirante, Reclutador y Admin
- 📱 **Diseño responsive**: Interfaz optimizada para dispositivos móviles
- 🔄 **Sincronización**: Sesión sincronizada entre web y móvil
- 🎨 **UI moderna**: Diseño coherente con la aplicación web

## Roles y Funcionalidades

### Aspirante
- Ver ofertas disponibles
- Postularse a ofertas
- Ver estado de postulaciones
- Gestionar perfil

### Reclutador
- Crear y gestionar ofertas
- Ver postulantes por oferta
- Revisar información de candidatos
- Gestionar perfil y empresa

### Admin
- Acceso completo a funcionalidades de aspirante y reclutador
- Gestión de usuarios
- Gestión de ofertas y postulaciones
- Panel de administración

## Requisitos

- Node.js 18+
- npm o yarn
- Expo CLI
- Expo Go app (para probar en dispositivo físico)

## Instalación

1. Instalar dependencias:
```bash
cd movil
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

3. Escanear el código QR con Expo Go:
   - iOS: Usar la cámara del iPhone
   - Android: Abrir Expo Go y escanear

## Configuración del Backend

La app está configurada para conectarse a `http://localhost:8080/api`.

Para cambiar la URL del backend, editar:
```typescript
// src/api/config.ts
export const API_BASE_URL = 'TU_URL_AQUI';
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run android`: Abre en Android
- `npm run ios`: Abre en iOS
- `npm run web`: Abre en navegador web

## Estructura del Proyecto

```
movil/
├── src/
│   ├── api/          # Servicios API
│   ├── components/   # Componentes reutilizables
│   ├── context/      # Context API (Auth)
│   ├── navigation/   # Navegación
│   ├── screens/      # Pantallas por rol
│   ├── styles/       # Temas y estilos
│   └── types/        # TypeScript types
├── App.tsx           # Punto de entrada
├── app.json          # Configuración de Expo
└── package.json      # Dependencias
```

## Tecnologías

- React Native
- Expo SDK
- TypeScript
- React Navigation
- Axios
- Expo Secure Store

## Sincronización Web-Móvil

La sesión se sincroniza automáticamente:
- El token JWT se almacena en SecureStore
- Mismo formato de autenticación que la web
- Headers idénticos en las peticiones API

## Autor

Desarrollado para Workable - Sistema de Gestión de Ofertas Laborales
