
# 📋 GESTIONES

---

## 🟢 Autenticación (FUNCIONANDO ✅)

| Acción                    | Endpoint               | Método | Estado |
|---------------------------|------------------------|:------:|:------:|
| **Registro Aspirante**     | `/api/auth/register-aspirante` | POST | ✅ |
| **Registro Reclutador**    | `/api/auth/register-reclutador` | POST | ✅ |
| **Login**                  | `/api/auth/login` | POST | ✅ |

---

## 🟡 Gestiones Independientes (POR IMPLEMENTAR)

| Entidad            | Create | Get all | Get by ID | Update by ID | Desactivar | Delete by ID |
|--------------------|:------:|:-------:|:---------:|:------------:|:----------:|:------------:|
| **MODALIDAD**      |   ⏳   |   ⏳    |    ⏳     |     ⏳       |     ⏳      |     ⏳        |
| **TIPO CONTRATO**  |   ⏳   |   ⏳    |    ⏳     |     ⏳       |     ⏳      |     ⏳        |
| **BENEFICIO**      |   ⏳   |   ⏳    |    ⏳     |     ⏳       |     ⏳      |     ⏳        |
| **EMPRESA CATEGORÍA** | ⏳ |   ⏳    |    ⏳     |     ⏳       |     ⏳      |     ⏳        |

---

## � Gestiones Dependientes (POR IMPLEMENTAR)

| Entidad         | Create | Get all | Get by ID | Get by nombre | Update by ID | Desactivar | Delete by ID | Otros |
|-----------------|:------:|:-------:|:---------:|:-------------:|:------------:|:----------:|:------------:|:------|
| **USUARIO**     |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by ID (dto estudio/experiencia) |
| **DATA ESTUDIO**|  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | *Desactivar: modificar filtros |
| **DATA EXPERIENCIA**|⏳  |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        |      |
| **EMPRESA**     |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        |      |
| **OFERTA**      |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by número de postulaciones, fecha publicación |
| **POSTULACIÓN** |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by fecha de postulación |
| **VALORACIÓN**  |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by puntuación |
| **NOTIFICACIÓN**|  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by fecha/categoría |

---

## 🟣 Gestión Etapa de Contratación (POR IMPLEMENTAR)

| Acción |
|--------|
| 👀 Ver candidatos postulados a una oferta |
| 🔎 Filtrar y buscar postulaciones por experiencia, educación, etc. |
| 🗂️ Clasificar candidatos por estado del proceso (en revisión, entrevista, contratado) |
| 🔄 Cambiar el estado del candidato |
| 📅 Agendar entrevistas |
| 📞 Comunicarse con el aspirante (contactos) |
| 🔔 Recibir notificaciones sobre el estado de la postulación |

---
