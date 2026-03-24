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

### Conclusión Estado de implementación
- backend 100% según RF
- api 100%
- frontend web ~66% (aspirante y admin funcional)
- mobile 10% (registro y login funcional)