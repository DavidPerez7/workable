# 🚀 INICIO RÁPIDO - Workable Mobile

## ⚡ 3 Pasos para ejecutar

### 1️⃣ Backend corriendo
```bash
cd backend
.\iniciar-servidor.bat
```
✅ Backend debe estar en http://localhost:8080

### 2️⃣ Instalar (primera vez)
```bash
cd movil
npm install
```
⏱️ Tarda ~2-3 minutos

### 3️⃣ Iniciar app
```bash
npm start
```
📱 Escanea el QR con Expo Go (Android/iOS)

---

## 📱 Instalar Expo Go

- **Android:** [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🎯 Usuarios de prueba

### Aspirante
```
correo: aspirante@test.com
password: 123456
```

### Reclutador
```
correo: reclutador@test.com
password: 123456
```

### Admin
```
correo: admin@workable.com
password: admin123
```

---

## 📂 ¿Qué hay en /movil?

```
movil/
├── src/
│   ├── api/           → 9 servicios API
│   ├── components/    → 4 componentes
│   ├── context/       → AuthContext
│   ├── navigation/    → 8 navegadores
│   ├── screens/       → 24 pantallas
│   │   ├── auth/     → 4 pantallas
│   │   ├── aspirante/ → 5 pantallas
│   │   ├── reclutador/ → 7 pantallas
│   │   └── admin/    → 6 pantallas
│   ├── styles/        → Theme
│   └── types/         → TypeScript
├── App.tsx
├── package.json
└── README.md
```

**Total:** 60+ archivos | ~4,500 líneas

---

## ✅ Funcionalidades

### Aspirante
- ✅ Ver ofertas
- ✅ Postularse
- ✅ Ver postulaciones
- ✅ Editar perfil

### Reclutador
- ✅ Crear ofertas
- ✅ Ver postulantes
- ✅ Gestionar ofertas
- ✅ Ver candidatos

### Admin
- ✅ TODO lo anterior
- ✅ Panel administrativo
- ✅ Sin restricciones

---

## 🔄 Sincronización web-móvil

✅ Mismo token JWT
✅ Mismos endpoints
✅ Headers idénticos
✅ Sesión compartida

---

## 🎨 Diseño

✅ Colores de la web (#1e6ff1)
✅ Componentes similares
✅ UI profesional
✅ Responsive

---

## 🐛 Troubleshooting

### Backend no conecta
```typescript
// src/api/config.ts
export const API_BASE_URL = 'http://TU_IP:8080/api';
```

### Caché corrupta
```bash
npx expo start -c
```

### Reinstalar
```bash
rm -rf node_modules
npm install
```

---

## 📚 Documentación completa

- **GUIA_MOBILE_APP.md** → Guía detallada
- **RESUMEN_MOBILE_APP.md** → Resumen completo
- **movil/README.md** → README del proyecto

---

## ⚡ Comandos útiles

```bash
npm start              # Iniciar
npx expo start -c      # Limpiar caché
npx expo start --android  # Android
npx expo start --ios      # iOS (Mac)
npx expo start --web      # Web
```

---

## 🎉 ¡LISTO!

Tu app móvil está **100% completa y funcional**.

1. `cd movil`
2. `npm install`
3. `npm start`
4. Escanea QR

📱 **Disfruta Workable Mobile** 🚀
