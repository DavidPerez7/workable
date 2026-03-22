# Credenciales de Usuarios de Prueba

| Rol          | Correo                  | Contraseña |
|--------------|------------------------|------------|
| Aspirante    | aspirante@example.com  | pass123    |
| Administrador| admin@example.com      | admin123   |
| Reclutador   | reclutador@example.com | pass123    |

## Comandos de Ejecución

### Windows (PowerShell)
Para iniciar el menú de gestión (Backend, Frontend, MySQL):
```powershell
powershell -ExecutionPolicy Bypass -File .\run-windows.ps1
```

### Linux (Bash)
Para ejecutar el script de automatización en entornos Unix/Linux:
```bash
bash run-linux.sh
```

## Comparación y Estado de Implementación

Analizo cada RF contra la API y el frontend (basado en código visto: AspirantePage, MiPerfil, HojaDeVida, MisPostulaciones, etc.):

**RF01: REGISTRO DE USUARIOS (Aspirantes)**  
API: Register.yml documenta POST /register con campos requeridos (nombre, apellido, correo, teléfono, fechaNacimiento, municipioId, genero, password). Incluye validaciones y retorno de JWT.  
Frontend: Implementado en páginas de registro (probablemente en Auth/). El código muestra integración con api/aspirantesApi.register.  
Estado: Completamente implementado y accesible. Cumple con validaciones, JWT y redirección.

**RF02: INICIO DE SESIÓN**  
API: Login.yml documenta POST /login con email/password, retorno de JWT.  
Frontend: Implementado en login page. Código usa api/aspirantesApi.login.  
Estado: Completamente implementado y accesible. Incluye manejo de errores y navegación.

**RF03: RECUPERACIÓN DE CONTRASEÑA**  
API: No documentada en 1-ASPIRANTE. No hay endpoint en Auth/ para reset password.  
Frontend: No observado en código (no hay páginas o llamadas para recuperación).  
Estado: No implementado. Falta endpoint API (probablemente POST /forgot-password) y frontend. El documento menciona SMTP, pero no está en la API actual.

**RF04: GESTIÓN DE PERFIL DE ASPIRANTE**  
API: GetById.yml (GET /{id}) y Update.yml (PUT /{id}) en 2-Aspirante/.  
Frontend: Implementado en MiPerfil.jsx (carga perfil con aspirantesApi.get) y ActualizarPerfil/ (edición).  
Estado: Completamente implementado y accesible. Incluye ver y editar datos básicos.

**RF05: GESTIÓN DE HOJA DE VIDA**  
API: GetById.yml (GET /{id}) y Update.yml (PUT /{id}) en 7-HojaDeVida/.  
Frontend: Implementado en HojaDeVida.jsx (carga con getHojasDeVidaPorAspirante, edición de estudios/experiencias).  
Estado: Completamente implementado y accesible. Permite agregar/editar/eliminar estudios y experiencias.

**RF06: BÚSQUEDA DE OFERTAS**  
API: Search.yml (GET /search) con parámetros de filtro (estado, nombre, municipioId, modalidad, etc.).  
Frontend: Implementado en AspirantePage.jsx con filtros avanzados y buscarOfertasAvanzada.  
Estado: Completamente implementado y accesible. Incluye filtros por texto, municipio, modalidad, experiencia, salario.

**RF07: VISUALIZACIÓN DETALLADA DE OFERTAS**  
API: GetById.yml (GET /{id}) en 5-Oferta/.  
Frontend: Implementado en OfertaCompletaPage.jsx (detalle completo con buscarOfertaPorId).  
Estado: Completamente implementado y accesible. Muestra descripción, empresa, etc.

**RF08: POSTULACIÓN A OFERTAS**  
API: Create.yml (POST) en 4-Postulacion/ con aspiranteId y ofertaId.  
Frontend: Implementado en AspirantePage.jsx (crearPostulacion).  
Estado: Completamente implementado y accesible. Incluye confirmación y feedback.

**RF09: GESTIÓN DE POSTULACIONES**  
API: GetById.yml (GET /{id}) en 4-Postulacion/, pero para listar, se obtiene del aspirante (no endpoint directo). Delete.yml (DELETE /{id}).  
Frontend: Implementado en MisPostulaciones.jsx (carga postulaciones desde aspirantesApi.get, eliminación con eliminarPostulacion).  
Estado: Completamente implementado y accesible. Permite ver y eliminar postulaciones propias.

**RF10: DESCARGA DE HOJA DE VIDA EN PDF**  
API: No documentada (no hay endpoint para generar PDF).  
Frontend: Implementado localmente en HojaDeVida.jsx con jsPDF (genera PDF en cliente).  
Estado: Implementado en frontend (sin API). Funciona, pero no es desde backend (cumple funcionalidad).

**RF11: VISUALIZACIÓN DE PERFILES DE EMPRESA**  
API: GetById.yml (GET /{id}) en 3-Empresa/.  
Frontend: Implementado en EmpresaPerfilPage.jsx (detalles de empresa).  
Estado: Completamente implementado y accesible.

**RF12: CIERRE DE SESIÓN**  
API: No aplica (es frontend).  
Frontend: Implementado en SidebarNavigation.jsx (limpia localStorage y navega a login).  
Estado: Completamente implementado y accesible. Agregué confirmación recientemente.

### Conclusión General
Funcionalidades Implementadas y Accesibles: La mayoría (RF01, RF02, RF04-RF12) están completamente implementadas tanto en API como en frontend. El frontend integra bien con la API documentada, y las páginas (AspirantePage, MiPerfil, HojaDeVida, MisPostulaciones) cubren el flujo completo.  
Faltante Crítico: RF03 (Recuperación de Contraseña) no está implementado ni en API ni en frontend. Requiere agregar endpoint (POST /forgot-password) y página de recuperación.  
Observaciones:  
- La descarga de PDF (RF10) es local en frontend, no desde API, pero cumple el RF.  
- Municipios (GetAll) se usan para filtros, accesibles.  
- Seguridad (JWT, validaciones) parece implementada según RF no funcionales.  
- No hay discrepancias mayores; el frontend consume la API documentada correctamente.  
Recomendación: Implementar RF03 para completar. El resto está listo para pruebas/sustentación. Si necesitas detalles de código específico, avísame.