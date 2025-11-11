# To-Do List para Automatizar Flujo Seguro en Computadores Públicos

Este checklist documenta el flujo recomendado para trabajar con Git y GitHub en computadores ajenos o públicos, asegurando que tus credenciales y configuraciones personales no queden expuestas. Puedes automatizar estos pasos con scripts y Copilot.

## Checklist de pasos

- [ ] **Eliminar credenciales de GitHub en el Administrador de Credenciales de Windows**
	- Automatizar por terminal:
		- `cmdkey /list | findstr /I github` para listar.
		- `cmdkey /delete:git:https://github.com` para eliminar.

- [ ] **Configurar usuario y correo de Git localmente**
	- `git config --local user.name "DavidPerez7"`
	- `git config --local user.email "juan_dperez51@soy.sena.edu.co"`

- [ ] **Agregar cambios al staging**
	- `git add .` o especificar archivos.

- [ ] **Hacer commit con mensaje en español**
	- Ejemplo: `git commit -m "corrección models usuario"`
	- El mensaje debe describir claramente el cambio realizado.

- [ ] **Hacer push al repositorio remoto**
	- `git push`
	- (Este paso requerirá autenticación manual por código de GitHub)

- [ ] **Eliminar configuración de usuario de Git**
	- `git config --local --unset user.name`
	- `git config --local --unset user.email`

- [ ] **Eliminar credenciales de GitHub nuevamente en el Administrador de Credenciales de Windows**
	- Repetir: `cmdkey /delete:git:https://github.com`

- [ ] **Cerrar sesión completamente en VS Code**
	- Cerrar sesión de tu cuenta y de GitHub Copilot:
		- `code --logout`
		- Desde la interfaz de VS Code: `Ctrl+Shift+P` → "Cerrar sesión de todas las cuentas"

---

> **Nota:** Puedes pedir a Copilot que automatice estos pasos con scripts de PowerShell o batch para mayor seguridad y rapidez.
