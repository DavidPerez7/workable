
# 📋 GESTIONES

---

## 🟢 Autenticación (FUNCIONANDO ✅)

| Acción                    | Endpoint               | Método | Estado |
|---------------------------|------------------------|:------:|:------:|
| **Registro Aspirante**     | `/api/auth/register-aspirante` | POST | ✅ |
| **Registro Reclutador**    | `/api/auth/register-reclutador` | POST | ✅ |
| **Login**                  | `/api/auth/login` | POST | ✅ |

---

## 🟡 Entidades Independientes (ENDPOINTS LISTOS ✅)

| Entidad            | Create | Get all | Get by ID | Get by nombre | Update by ID | Desactivar | Delete by ID |
|--------------------|:------:|:-------:|:---------:|:-------------:|:------------:|:----------:|:------------:|
| **MUNICIPIO**      |   ✅   |   ✅    |    ✅     |     ✅        |     ✅       |     ⏳      |     ✅        |
| **HABILIDAD**      |   ✅   |   ✅    |    ✅     |     ✅        |     ✅       |     ✅      |     ✅        |
| **EMPRESA CATEGORÍA** | ✅ |   ✅    |    ✅     |     ✅        |     ✅       |     ✅      |     ✅        |

---

## 🟣 Enums (Ya definidos en modelos)

| Enum                | Ubicación         | Valores                                          |
|---------------------|-------------------|--------------------------------------------------|
| **Modalidad**       | Oferta.java       | PRESENCIAL, REMOTO, HIBRIDO                     |
| **TipoContrato**    | Oferta.java       | TIEMPO_COMPLETO, MEDIO_TIEMPO, TEMPORAL, etc.   |
| **Beneficio**       | Oferta.java       | SEGUROSALUD, SEGUROVIDA, BONOS, etc.            |
| **Departamento**    | Municipio.java    | BOGOTA_DC, ANTIOQUIA, VALLE_DEL_CAUCA, etc.     |
| **TipoHabilidad**   | Habilidad.java    | TECNICA, IDIOMA, BLANDA                         |
| **Rol**             | Usuario.java      | ASPIRANTE, RECLUTADOR, ADMINISTRADOR            |
| **Category**        | Empresa.java      | TECNOLOGIA, SALUD, FINANZAS, etc.               |

---

## 🔵 Gestiones Dependientes (POR IMPLEMENTAR)

| Entidad         | Create | Get all | Get by ID | Get by nombre | Update by ID | Desactivar | Delete by ID | Otros |
|-----------------|:------:|:-------:|:---------:|:-------------:|:------------:|:----------:|:------------:|:------|
| **USUARIO**     |  ✅    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by ID (dto estudio/experiencia) |
| **DATA ESTUDIO**|  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | *Desactivar: modificar filtros |
| **DATA EXPERIENCIA**|⏳  |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        |      |
| **EMPRESA**     |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        |      |
| **OFERTA**      |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by número de postulaciones, fecha publicación |
| **POSTULACIÓN** |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by fecha de postulación |
| **VALORACIÓN**  |  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by puntuación |
| **NOTIFICACIÓN**|  ⏳    |   ⏳    |    ⏳     |     ⏳        |     ⏳       |     ⏳      |     ⏳        | Get by fecha/categoría |

---

## � Gestión Etapa de Contratación (POR IMPLEMENTAR)

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
