**Especificación de requisitos de software**

**Proyecto:**   
**WORKABLE**

#  **CONTENIDO**

**[1	INTRODUCCIÓN	6](#heading=h.xk4rxs3f0izt)**

[**1.1	Propósito	6**](#heading=h.ego2yaoemhcm)

[**1.2	Alcance	6**](#heading=h.6hr9wzcmnjdl)

[**1.3	Personal involucrado	6**](#heading=h.59spcuht7gqm)

[**1.4	Definiciones, acrónimos y abreviaturas	6**](#heading=h.53xv7p94tnkp)

[**1.5	Resumen	6**](#heading=h.nuhnqxhp2lzx)

[**2	DESCRIPCIÓN GENERAL	7**](#heading=h.mk5cljlvdu3z)

[**2.1	Perspectiva del producto	7**](#heading=h.5jhqdvk635m0)

[**2.2	Funcionalidad del producto	7**](#heading=h.kf59zcabjvom)

[**2.3	Características de los usuarios	7**](#heading=h.8w21qzw1yu5j)

[**2.4	Restricciones	7**](#heading=h.h5ch3oya9rwu)

[**2.5	Suposiciones y dependencias	7**](#heading=h.d516ts63sm7b)

[**2.6	Evolución previsible del sistema	7**](#heading=h.y8zialrp8rez)

[**3	REQUISITOS ESPECÍFICOS	7**](#heading=h.6kw0294pdcpr)

[**3.1	Interfaces y comunicación	8**](#heading=h.8zg6mviw0vsu)

[**3.2	Requisitos funcionales	8**](#heading=h.f5pokss3hpwx)

[**3.3	Requisitos no funcionales	9**](#heading=h.ptosjaajdqmr)

# 

# **1\. INTRODUCCIÓN**

Esta Especificación de Requisitos de Software (SRS) define las capacidades técnicas y funcionales de Workable, una plataforma de intermediación laboral diseñada para conectar aspirantes con reclutadores. El sistema se basa en una arquitectura desacoplada con Spring Boot (Java) para el backend y React para el frontend, empleando MySQL gestionado mediante XAMPP y un despliegue final proyectado en AWS.

El alcance incluye la gestión de seguridad mediante JWT y Bcrypt, el ciclo de vida de ofertas laborales y un panel administrativo para la moderación de contenido y análisis de métricas. Este documento actúa como la guía técnica oficial para el equipo de desarrollo del proyecto, detallando los requerimientos funcionales y los estándares de rendimiento, seguridad y disponibilidad necesarios para la sustentación del proyecto.

# **1.1 PROPÓSITO**

El propósito fundamental de esta Especificación de Requisitos de Software (SRS) es definir de manera detallada y formal todas las funcionalidades, restricciones y atributos de calidad de la plataforma Workable. Este documento busca establecer una base de entendimiento común entre los desarrolladores y los instructores del SENA, asegurando que el producto final cumpla con los objetivos de intermediación laboral propuestos.

Específicamente, este documento pretende:

- Servir como guía técnica para la codificación del Backend en Spring Boot y el Frontend en React.  
- Definir los criterios de validación para las pruebas de seguridad, persistencia de datos en MySQL y despliegue en AWS.  
- Proporcionar una descripción clara de los alcances y limitaciones del sistema para la fase de sustentación final.  
- Facilitar la trazabilidad entre los requerimientos funcionales detectados y las funcionalidades implementadas en la nube.

Está dirigido al equipo de desarrollo encargado de la implementación y al comité evaluador del SENA, quienes utilizarán este documento para verificar que el software entregado responde satisfactoriamente a las necesidades de reclutamiento y gestión de talento planteadas.

# **1.2 ALCANCE**

El producto objeto de esta especificación se identifica con el nombre comercial "Workable", una plataforma web de intermediación laboral diseñada para centralizar y agilizar el contacto entre oferentes y demandantes de empleo.

En concordancia con la descripción general del sistema, el alcance de Workable comprende el desarrollo de una solución integral basada en una arquitectura desacoplada. Esto incluye la implementación de un Backend robusto en Spring Boot para la lógica de negocio y un Frontend en React para la interfaz de usuario. 

El sistema permitirá gestionar el ciclo completo de reclutamiento: desde el registro y autenticación segura de usuarios (Aspirantes, Reclutadores y Administradores) mediante JWT, hasta la publicación, búsqueda y postulación a vacantes laborales.

El entorno afectado por esta Especificación de Requerimientos de Software (SRS) se enmarca en el ecosistema de aplicaciones del SENA para el programa de Análisis y Desarrollo de Software. Los proyectos e infraestructuras influenciados incluyen:

- Entorno de Desarrollo Local: Configurado sobre el paquete XAMPP para la gestión de la base de datos MySQL.  
- Entorno de Despliegue en la Nube: Afecta la infraestructura de Amazon Web Services (AWS), donde se realizará el aprovisionamiento de servidores para la puesta en marcha de la aplicación.  
- Sistemas de Comunicación: Se prevé la afectación del protocolo SMTP para la integración de servicios de mensajería externa (notificaciones de correo electrónico).

Este documento delimita las funcionalidades que serán evaluadas en la fase de sustentación.

# **1.3 PERSONAL INVOLUCRADO**

| Nombre | Juan David Gómez Linares |
| :---: | :---: |
| Rol | Desarrollador Full Stack |
| Categoría profesional | Aprendiz ADSO |
| Responsabilidades | Diseño y desarrollo de componentes Frontend y Backend, gestión de la arquitectura de la API en Spring Boot y validación de requerimientos técnicos. |

| Nombre | Juan David Pérez Álvarez |
| :---: | :---: |
| Rol | Desarrollador Fullstack |
| Categoría profesional | Aprendiz ADSO |
| Responsabilidades | Diseño y desarrollo de componentes Frontend y Backend, gestión de la arquitectura de la API en Spring Boot y validación de requerimientos técnicos. |

| Nombre | Yerson Nicolás Zequea Loboa |
| :---: | :---: |
| Rol | Desarrollador Frontend |
| Categoría profesional | Aprendiz ADSO |
| Responsabilidades | Desarrollo de la interfaz de usuario en React, aseguramiento de la experiencia de usuario (UX) y apoyo en la redacción de requerimientos funcionales. |

# **1.4 DEFINICIONES, ACRÓNIMOS Y ABREVIATURAS**

En esta sección se definen los términos técnicos, siglas y conceptos clave necesarios para la correcta interpretación de la Especificación de Requisitos de Software del proyecto Workable: 

- API (Application Programming Interface): Interfaz de programación de aplicaciones que permite la comunicación entre el Frontend y el Backend.  
- AWS (Amazon Web Services): Plataforma de servicios en la nube donde se realizará el despliegue final del sistema.  
- Backend: Capa de acceso a datos y lógica de negocio del software; en este proyecto, desarrollada con Spring Boot.  
- Bcrypt: Función de hashing de contraseñas utilizada para almacenar de forma segura las credenciales de los usuarios en la base de datos.  
- CRUD (Create, Read, Update, Delete): Acrónimo de las funciones básicas de gestión de datos (Crear, Leer, Actualizar y Eliminar).  
- Frontend: Capa de interfaz de usuario con la que interactúan los aspirantes y reclutadores; desarrollada con React..  
- JWT (JSON Web Token): Estándar utilizado para la autenticación segura y el intercambio de información entre el cliente y el servidor.  
- MySQL: Sistema de gestión de bases de datos relacionales utilizado para la persistencia de la información de Workable.  
- REST (Representational State Transfer): Estilo de arquitectura de software utilizado para el intercambio de datos entre la aplicación web y el servidor.  
- SMTP (Simple Mail Transfer Protocol): Protocolo estándar para el envío de correos electrónicos (notificaciones y recuperación de cuenta).  
- SRS (Software Requirements Specification): Documento que detalla los requisitos funcionales y no funcionales del sistema.  
- XAMPP: Paquete de software libre que integra el servidor Apache y la base de datos MySQL para el entorno de desarrollo local.


# **1.5 RESUMEN**

Este documento constituye la base técnica y funcional para el desarrollo de la plataforma Workable, actuando como el estándar de referencia para asegurar que la implementación del software cumpla con los objetivos de intermediación laboral propuestos.

Su función principal es unificar los criterios de programación, diseño de interfaz y gestión de datos, proporcionando una hoja de ruta clara que abarca desde la descripción global del producto hasta la especificación técnica de los N requerimientos funcionales y los estándares de seguridad y despliegue necesarios para la entrega final al SENA.

# **2 DESCRIPCIÓN GENERAL**

Esta sección describe los factores generales que afectan a la plataforma Workable y su entorno operativo. Se define la perspectiva del producto como una solución web independiente, se resumen sus funciones principales, se identifican los perfiles de los usuarios que interactuaron con el sistema y se establecen las limitaciones técnicas y dependencias externas necesarias para su correcto funcionamiento. 

El propósito de este apartado es proporcionar un contexto comprensible de la solución antes de proceder con la especificación detallada de los requerimientos.

# **2.1 PERSPECTIVA DEL PRODUCTO**

Workable es un producto de software independiente y autónomo, desarrollado específicamente para satisfacer las necesidades de intermediación laboral identificadas en el marco del proyecto académico. 

No constituye un módulo de un sistema preexistente ni depende de aplicaciones externas para su funcionamiento principal, aunque se integra con servicios de terceros para funcionalidades específicas como el envío de notificaciones por correo electrónico y el almacenamiento en la nube. La plataforma está diseñada bajo una arquitectura de sistemas distribuidos (arquitectura desacoplada), donde el Frontend (React) y el Backend (Spring Boot) funcionan como entidades separadas que se comunican a través de una API REST. 

Esta estructura permite que el producto sea escalable y fácil de mantener. En términos de infraestructura, el sistema se apoya en el servidor de base de datos MySQL (vía XAMPP para desarrollo) y se proyecta para operar de manera global en un entorno de producción alojado en Amazon Web Services (AWS).

# **2.2 FUNCIONALIDAD DEL PRODUCTO**

La plataforma Workable está diseñada para centralizar el proceso de reclutamiento mediante una estructura de módulos interconectados. A continuación, se resumen las funcionalidades principales organizadas por áreas operativas:

- Gestión de Usuarios y Seguridad: El sistema permite el registro, inicio de sesión y recuperación de cuentas mediante mensaje a correo electrónico para 2 roles definidos (Aspirante, Reclutador). El rol de Administrador no dispone de registro público; un administrador inicial es pre-generado en la ejecución del backend y puede crear adicionales para el personal de TI que mantenga la plataforma. La seguridad se garantiza mediante la implementación de tokens JWT para todos los roles y el cifrado de contraseñas con Bcrypt.   
    
- Módulo de Aspirantes: Los usuarios pueden gestionar su perfil profesional, buscar vacantes mediante filtros avanzados (por ubicación o categoría) y realizar postulaciones a las ofertas de su interés.  
    
- Módulo de Reclutadores: Permite a las empresas o reclutadores la creación, edición y publicación de ofertas laborales. Incluye herramientas para visualizar las hojas de vida de los postulados y gestionar el estado de las vacantes.  
    
- Panel Administrativo (Dashboard): Proporciona herramientas de moderación para supervisar usuarios y ofertas, asegurando que el contenido de la plataforma cumpla con las políticas establecidas. Además, genera métricas y reportes sobre la actividad del sistema.   
    
- Sistema de Notificaciones: Implementación de un servicio de mensajería vía correo electrónico para confirmar acciones críticas como registros exitosos, postulaciones y procesos de recuperación de credenciales. Estas funcionalidades se han derivado de las minutas de análisis y el documento previo de Requisitos del Sistema (mencionado en la sección 1.5), los cuales sirven como base técnica para el desarrollo de los 17 requerimientos funcionales detallados en la sección 3 de este documento.

# **2.3 CARACTERISTICAS DE LOS USUARIOS**

A continuación, se describen los perfiles de usuario que interactuaron con la plataforma, detallando sus capacidades y el rol que desempeñan dentro del sistema:

| Tipo de usuario | Aspirante |
| :---: | :---: |
| Formación | Estudiantes, técnicos, tecnólogos o profesionales en búsqueda de empleo. |
| Habilidades | Conocimientos básicos en navegación web y uso de correo electrónico. |
| Actividades | Registro de perfil, carga de hoja de vida, búsqueda de vacantes mediante filtros y postulación a ofertas laborales. |

| Tipo de usuario | Reclutador |
| :---: | :---: |
| Formación | Profesionales en Recursos Humanos, psicólogos o líderes de área encargados de la selección de personal. |
| Habilidades | Competencias en gestión de plataformas administrativas, manejo de bases de datos de candidatos y herramientas de comunicación digital. |
| Actividades | Publicación y edición de ofertas laborales, revisión de perfiles de postulados, descarga de hojas de vida y gestión del estado de las vacantes. |

| Tipo de usuario | Administrador |
| :---: | :---: |
| Formación | Personal técnico o analistas de sistemas (equipo de desarrollo ADSO). |
| Habilidades | Conocimientos avanzados en gestión de plataformas web, bases de datos y moderación de contenido digital. |
| Actividades | Gestión y creación de nuevas cuentas administrativas, bloqueo de usuarios, moderación de ofertas publicadas y generación de reportes generales de actividad. |

# **2.4 RESTRICCIONES**

El diseño y desarrollo de la plataforma Workable están sujetos a las siguientes limitaciones técnicas y normativas que condicionan la arquitectura de la solución:

- Restricciones de Lenguaje y Framework: El desarrollo del Backend debe realizarse obligatoriamente en Java utilizando el framework Spring Boot, mientras que el Frontend debe implementarse mediante la librería React.js para garantizar una arquitectura desacoplada.  
    
- Restricciones de Gestión de Datos: Para el entorno de desarrollo, se restringe el uso de motores de base de datos externos en favor de MySQL gestionado exclusivamente a través del paquete XAMPP, simplificando la portabilidad entre los equipos de los desarrolladores.   
    
- Restricciones de Despliegue: Dado que el proyecto se encuentra en fase de entrega final, el sistema debe ser desplegado al 100% en la nube mediante los servicios de AWS (Amazon Web Services), asegurando que el acceso sea público para las pruebas de sustentación.   
    

- Normativas de Seguridad: Es obligatorio el uso del estándar JWT (JSON Web Token) para la gestión de sesiones y el algoritmo Bcrypt para el cifrado de contraseñas, prohibiendo el almacenamiento de credenciales en texto plano dentro de la base de datos MySQL.   
    
- Limitación Académica: Al tratarse de un proyecto formativo para el SENA, el sistema debe priorizar la funcionalidad core (los 17 RF establecidos) sobre integraciones complejas de terceros, como pasarelas de pago o APIs de redes sociales.

# **2.5 SUPOSICIONES Y DEPENDENCIAS**

El cumplimiento de los requisitos establecidos en este documento está sujeto a las siguientes suposiciones y dependencias externas. Cualquier cambio significativo en estos factores obligaría a una revisión de la arquitectura o de la planificación del proyecto:

- Disponibilidad de Infraestructura Cloud: Se asume que los servicios de AWS (Amazon Web Services) estarán disponibles y operativos durante la fase de despliegue y sustentación. Una caída prolongada del proveedor o cambios en sus políticas de uso gratuito afectarían la accesibilidad de la plataforma.

- Conectividad a Internet: Dado que Workable es una aplicación web 100% en la nube, se presupone que tanto los reclutadores como los aspirantes y administradores cuentan con una conexión a internet estable. El sistema no está diseñado para funcionar en modo offline.  
    
- Estabilidad del Entorno XAMPP: Para la fase de desarrollo y mantenimiento local, se asume la compatibilidad del motor MySQL incluido en XAMPP con las versiones de los controladores de persistencia utilizados en Spring Boot.  
    
- Servicios de Terceros para Mensajería: El envío de correos electrónicos depende de la disponibilidad de un servidor SMTP externo (como Gmail). Si estos servicios cambian sus protocolos de autenticación, la funcionalidad de recuperación de cuenta y notificaciones debería ser modificada.  
    
- Compatibilidad de Navegadores: Se asume que los usuarios finales utilizan navegadores modernos (Chrome, Firefox, Edge o Safari) con soporte para JavaScript y motores de renderizado actualizados, necesarios para la ejecución de la interfaz construida en React.  
    
- Integridad de las Herramientas de Desarrollo: El proyecto depende de la continuidad y soporte de las versiones específicas de Java (JDK) y Node.js utilizadas durante la construcción de los componentes del sistema.


# **2.6 SUPOSICIONES Y DEPENDENCIAS**

Se contempla que Workable pueda escalar en futuras fases mediante la implementación de:

- Integración de inteligencia artificial para el emparejamiento (matching) automático de perfiles y vacantes.   
    
- Módulo de entrevistas por video integradas y pruebas psicotécnicas en línea.


# **3 REQUISITOS ESPECÍFICOS**

Esta sección detalla de manera exhaustiva las capacidades técnicas y funcionales que el sistema Workable debe cumplir. Los requerimientos aquí descritos están diseñados para ser medibles, verificables y suficientes para guiar tanto el desarrollo en Spring Boot y React como la fase de pruebas y despliegue en AWS.

Cada requerimiento ha sido identificado con un código único (RF para Requisitos Funcionales y RNF para Requisitos No Funcionales) y categorizado según su prioridad para la entrega final del proyecto.

# **3.1 INTERFACES Y COMUNICACIÓN**

Este apartado describe los mecanismos de interacción entre el usuario y el sistema, así como el flujo de datos entre los componentes de software.

**Interfaces de Usuario (Entradas)**: La plataforma Workable gestiona la captura de datos mediante una arquitectura de formularios dinámicos en React, diseñados para validar la información en el cliente antes de ser procesada por el servidor:

- Campos de Selección Dinámica y Sincronizada (Dropdowns/Selects): El sistema implementa controles de selección que se alimentan en tiempo real mediante peticiones asíncronas a la base de datos MySQL. Esto permite que el usuario elija opciones normalizadas para campos como Género Biológico, Departamentos, Municipios y Categorías Laborales. Esta metodología actúa como una "entrada de respuesta", donde el sistema ofrece solo las opciones compatibles con la lógica de negocio, garantizando que los datos ingresados sean íntegros y coherentes con las entidades existentes en el Backend.  
    
- Gestión de Fechas mediante Controles de Calendario (Date Pickers): Para garantizar el formato de fecha estándar (ISO 8601\) requerido por Spring Boot, se integran selectores de fecha que permiten al usuario navegar visualmente por años y meses. Estos controles se utilizan para capturar datos sensibles como la fecha de nacimiento del aspirante, así como para definir los periodos de vigencia (apertura y cierre) de las ofertas publicadas por los reclutadores.  
    
- Selectores de Opción Múltiple y Estados (Checkboxes): La interfaz utiliza controles de tipo checkbox para la captura de preferencias y características específicas. Estos permiten a los reclutadores marcar múltiples atributos o requisitos de una oferta y a los aspirantes definir sus intereses profesionales. Estos datos se envían al servidor estructurados como arreglos (arrays) de valores para su posterior filtrado.  
    

- Campos de Texto y Entrada de Credenciales: Se implementan campos de entrada de texto con validaciones de longitud y formato. Los campos de contraseña cuentan con máscaras de seguridad para ocultar la información en pantalla, mientras que los campos de descripción (TextArea) permiten la entrada de texto extenso para detalles de la vacante o perfil profesional. Todos los datos de texto son saneados para evitar ataques de inyección de código.

**Interfaces de Salida (Resultados):** El sistema procesa y entrega información a través de múltiples canales, transformando los datos del Backend en recursos visuales y documentos funcionales:

- Generación de Documentos y Reportes: La plataforma integra una capa de servicios para la exportación de datos a formatos portátiles. Para los aspirantes, el sistema genera automáticamente su Hoja de Vida profesional en formato PDF basada en la información del perfil. Los Reclutadores tienen la capacidad de visualizar y descargar dichos archivos PDF, mientras que el Administrador dispone de una función exclusiva para la generación de reportes detallados de la actividad del sistema en formato PDF, consolidando datos de usuarios y métricas globales.  
    
- Centro de Notificaciones e Interacción: Se implementa un módulo de notificaciones internas similar al comportamiento de las redes sociales. El sistema emite alertas visuales dentro de la plataforma para informar a los aspirantes sobre cambios de estado en sus candidaturas (citaciones a entrevistas o rechazos). De igual forma, los reclutadores reciben avisos sobre el volumen de candidatos postulados a sus ofertas activas en tiempo real.  
    
- Alertas de Interfaz y Feedback: El sistema proporciona retroalimentación inmediata mediante componentes visuales (alerts/toasts) ante acciones críticas. Estas notificaciones confirman al usuario la ejecución exitosa de procesos como el registro de cuenta, la publicación de ofertas o la postulación efectiva a una vacante, mejorando la experiencia de usuario (UX).  
    
- Visualización Pública de Perfiles: La interfaz de salida incluye páginas de perfil detalladas donde se expone la información pública de candidatos y empresas. Estos perfiles son consultables por los actores del sistema (exceptuando los perfiles administrativos por seguridad), permitiendo una revisión estructurada de la trayectoria de los aspirantes y la reputación de los reclutadores.  
    
- Dashboards y Analítica Visual: Los paneles administrativos presentan la información mediante una capa de visualización de datos. El sistema realiza peticiones (GET) para obtener el conteo de entidades activas e inactivas (empresas, ofertas, usuarios) y las representa mediante gráficas estadísticas que facilitan la toma de decisiones y el monitoreo del ecosistema laboral de Workable.  
    
- Salidas Externas Automatizadas: El sistema se conecta con servidores de correo externo para el envío de comunicaciones mediante el protocolo SMTP, notificando a los usuarios sobre eventos de seguridad (recuperación de contraseña) y confirmaciones de registro de forma externa a la aplicación.

# **3.2 REQUISITOS NO FUNCIONALES**

| Identificación del requerimiento NO funcional: | RNF01 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | ACCESIBILIDAD WEB BÁSICA |
| Características: | La plataforma debe ser usable por personas con diversas necesidades, buscando cumplir los principios básicos de accesibilidad web. |
| Descripción del requerimiento: | Todas las funcionalidades deben ser accesibles mediante navegación por teclado (Tab, Enter). Los elementos interactivos deben tener un foco visual claro. Los formularios no deben tener límites de tiempo restrictivos. |

| Identificación del requerimiento NO funcional: | RNF02 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | SEGURIDAD Y PROTECCIÓN DE DATOS |
| Características: | Protege los datos de usuarios mediante cifrado de contraseñas, autenticación segura con tokens JWT y validación de entradas. |
| Descripción del requerimiento: | Las contraseñas se deben hashear con Bcrypt antes de almacenarse. La autenticación se maneja con tokens JWT que expiran en 24 horas. Se requiere validación de propiedad para editar recursos y confirmación obligatoria mediante contraseña o modales para acciones críticas. |

| Identificación del requerimiento NO funcional: | RNF03 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | RENDIMIENTO Y TIEMPOS DE RESPUESTA |
| Características: | Garantiza que la plataforma responda de manera ágil ante las peticiones de los diferentes roles de usuario. |
| Descripción del requerimiento: | El inicio de sesión y las actualizaciones de perfil deben responder en menos de 2 segundos. La búsqueda y el filtrado de ofertas deben procesarse en menos de 1 segundo. La carga del dashboard administrativo y sus estadísticas no debe superar los 3 segundos. |

| Identificación del requerimiento NO funcional: | RNF04 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | USABILIDAD Y FEEDBACK VISUAL |
| Características: | Asegura una experiencia de usuario (UX) fluida mediante mensajes claros y componentes interactivos. |
| Descripción del requerimiento: | El sistema debe proporcionar mensajes de éxito o error claros tras cada acción (ej: "Oferta actualizada exitosamente"). Se deben incluir modales de confirmación para evitar acciones accidentales y utilizar filtros combinables en tiempo real para mejorar la navegación. |

| Identificación del requerimiento NO funcional: | RNF05 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | CUMPLIMIENTO LEGAL (DERECHO AL OLVIDO) |
| Características: | Permite a los aspirantes ejercer su derecho a la protección de datos personales. |
| Descripción del requerimiento: | El sistema debe permitir la eliminación permanente de la cuenta de un aspirante, asegurando que todos sus datos personales sean removidos de la base de datos tras una confirmación de seguridad. |

| Identificación del requerimiento NO funcional: | RNF06 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | AUDITORÍA Y REGISTRO DE ACCIONES  |
| Características: | Permite el seguimiento de las acciones administrativas para mantener la integridad de la plataforma. |
| Descripción del requerimiento: | El sistema debe llevar un registro (log) de todas las acciones críticas realizadas por los administradores, tales como la suspensión de usuarios o la eliminación de ofertas, incluyendo notificaciones automáticas por correo a los afectados. |

| Identificación del requerimiento NO funcional: | RNF07 |
| :---: | ----- |
| Nombre del requerimiento NO funcional: | EXPORTACIÓN DE DATOS   |
| Características: | Facilita la obtención de información clave del sistema para análisis externos. |
| Descripción del requerimiento: | El administrador debe tener la capacidad de exportar las métricas y estadísticas visualizadas en el dashboard para su revisión o reporte fuera de la plataforma. |

# **3.3 REQUISITOS FUNCIONALES**

| Identificación del requerimiento: | RF01 |
| :---: | ----- |
| **Nombre del requerimiento:** | REGISTRO DE USUARIOS |
| **Características:** | Permite la creación de cuentas de usuario (Aspirate y Reclutador) diferenciadas, automatizando la activación inicial y preparando las credenciales de acceso inmediato mediante tokens de seguridad. |
| **Descripción del requerimiento:** | El sistema gestionará el registro mediante dos formularios independientes:  Aspirantes: Captura de nombre, apellido, correo (único), teléfono, fecha de nacimiento, municipio, género y contraseña (con validación de confirmación).  Reclutadores: Captura de datos personales y Razón Social. La relación con la empresa se crea con una FK nullable, permitiendo vinculación posterior.  Lógica de Finalización: Al completar el registro, el backend setea el estado como Activo y retorna un JWT ya configurado con el rol del usuario. El sistema almacena este token en el localStorage y redirige automáticamente al usuario hacia la interfaz de Inicio de Sesión para validar su entrada formal. Se incluye el envío de un correo de bienvenida (SMTP pendiente de implementar). |
| **Requerimientos NO funcionales:** | RNF-01 (ACCESIBILIDAD \- NAVEGACIÓN POR TECLADO) RNF-02 (SEGURIDAD \- VALIDACIÓN DE DATOS) RNF-04 (USABILIDAD \- MENSAJES CLAROS DE ERROR) |

| Identificación del requerimiento: | RF02 |
| :---: | ----- |
| **Nombre del requerimiento:** | INICIO DE SESIÓN |
| **Características:** | Permite el acceso seguro y centralizado a la plataforma mediante la validación de credenciales para todos los usuarios de la plataforma (Aspirante, Reclutador, Administrador), gestionando la persistencia de la sesión y el direccionamiento basado en roles. |
| **Descripción del requerimiento:** | El sistema implementa un login unificado para todos los perfiles de usuario:  Autenticación: El usuario ingresa correo y contraseña. El sistema valida los datos contra la base de datos (Bcrypt) y genera un token JWT que contiene el Rol del usuario.  Persistencia y Redirección: El token se almacena en el localStorage del navegador. El frontend lee el rol incrustado en el JWT para redirigir automáticamente al Dashboard correspondiente (/aspirante, /reclutador o /admin).  Flujo Post-Registro: El proceso de registro vincula automáticamente un token inicial para agilizar el primer acceso. Gestión de Errores: El sistema debe notificar si el "Usuario no ha sido encontrado" o si la "Contraseña es incorrecta" (Funcionalidad pendiente de refinamiento en Backend). Recuperación: Se incluye un enlace de "¿Olvidó su contraseña?" que debe enviar un correo único al usuario con un link de acceso exclusivo a un formulario de cambio de clave (Funcionalidad SMTP pendiente). |
| **Requerimientos NO funcionales:** | RNF-01 (ACCESIBILIDAD \- NAVEGACIÓN POR TECLADO) RNF-02 (SEGURIDAD \- VALIDACIÓN DE DATOS) RNF-04 (USABILIDAD \- MENSAJES CLAROS DE ERROR) |

| Identificación del requerimiento: | RF03 |
| :---: | ----- |
| **Nombre del requerimiento:** | ACTUALIZACIÓN DE PERFIL |
| **Características:** | Permite a los usuarios autenticados (Aspirante, Reclutador y Administrado) gestionar y modificar su información personal o institucional para mantener sus datos actualizados dentro de la plataforma. |
| **Descripción del requerimiento:** | El sistema habilitará formularios de edición con las siguientes condiciones:  Aspirantes y Reclutadores: Podrán modificar todos sus campos de perfil, incluyendo Nombre y Correo electrónico, sin restricciones de bloqueo visual. Administrador: Al ser una cuenta predefinida por el sistema (creada desde el despliegue del Backend), cuenta con permisos totales para modificar cualquier dato de su perfil de usuario.  Proceso de Guardado: Al finalizar los cambios, el usuario deberá pulsar un botón de Confirmar/Guardar (Funcionalidad de confirmación pendiente de programar). Tras la persistencia de datos, el sistema lanzará un Alert simple en el navegador; al ser aceptado por el usuario, la página se recargará automáticamente para reflejar la nueva información. |
| **Requerimientos NO funcionales:** | RNF-01 (ACCESIBILIDAD \- FORMULARIO SIN LÍMITE DE TIEMPO)  RNF-02 (SEGURIDAD \- VALIDACIÓN DE PROPIEDAD) RNF-04 (USABILIDAD \- ACTUALIZACIÓN INMEDIATA) |

| Identificación del requerimiento: | RF04 |
| :---: | ----- |
| **Nombre del requerimiento:** | ELIMINACIÓN PERMANENTE DE CUENTA |
| **Características:** | Permite a los usuarios (Aspirantes y Reclutadores) ejecutar la baja total de sus datos, asegurando la limpieza de registros y la integridad de la base de datos mediante procesos en cascada. |
| **Descripción del requerimiento:** | El sistema gestionará la eliminación definitiva bajo las siguientes reglas:  Validación Frontend: El usuario debe escribir la palabra exacta "ELIMINAR" en un modal de confirmación para habilitar el botón de acción, evitando borrados accidentales.  Impacto por Rol:  Aspirante: Se elimina su registro de la tabla usuarios y todas sus postulaciones vinculadas. Reclutador: Se advierte que su cuenta está vinculada a una Entidad Empresa y que su eliminación será visible para otros reclutadores de la misma organización. Pero NO se eliminan sus ofertas publicadas.  Exclusión de Administradores: Las cuentas con rol de Administrador (ID: 1 a N) no dispondrán de esta opción en su interfaz, ya que su gestión es externa al equipo de desarrollo.  Cierre de Sesión: Tras el borrado, el sistema destruye el JWT del localStorage y redirige a la Landing Page.  (Nota: Funcionalidad de borrado físico y validación de palabra clave pendiente de implementación en Backend/Frontend). |
| **Requerimientos NO funcionales:** | RNF-02 (SEGURIDAD \- CONFIRMACIÓN OBLIGATORIA)  RNF-04 (USABILIDAD \- ADVERTENCIA DE BORRADO)  RNF-05 (CUMPLIMIENTO LEGAL \- DERECHO AL OLVIDO) |

| Identificación del requerimiento: | RF05 |
| :---: | ----- |
| **Nombre del requerimiento:** | GESTIÓN DE ENTIDAD CORPORATIVA Y VINCULACIÓN |
| **Características:** | Centraliza la identidad jurídica de las organizaciones y gestiona de forma segura la vinculación de múltiples reclutadores a una misma empresa. |
| **Descripción del requerimiento:** | El sistema gestionará la entidad Empresa bajo la siguiente lógica estructural:  Creación y Token de Seguridad: Al registrarse un reclutador con estado inicial FK\_empresa \= null, puede crear una empresa ingresando un NIT nuevo. El sistema validará que sea un NIT colombiano válido y generará automáticamente un "Token/Código de Empresa" único que se le entregará a este primer reclutador (Validación de NIT y Token pendientes de programar). Vinculación Segura: Para que un nuevo reclutador se una a una empresa existente (ej. Coca-Cola), el sistema le exigirá ingresar tanto el NIT como el Token de Empresa.  Perfil Interno: La plataforma generará una vista de perfil de la empresa (no externa) que mostrará: Información general de la entidad, listado de ofertas activas y los nombres de los reclutadores vinculados a la misma. El backend expone la entidad Empresa con sus datos básicos; el frontend realiza consultas separadas (GET /ofertas?empresa_id={id} y GET /reclutadores?empresa_id={id}) para obtener ofertas y reclutadores relacionados. Reglas de Borrado Físico:  Si se elimina la Empresa, se ejecuta un borrado en cascada de todos sus reclutadores y ofertas. Si todos los reclutadores de una empresa eliminan sus cuentas (total de vinculados \= 0), el sistema ejecutará automáticamente la eliminación física de la Empresa para no dejar registros fantasma en la base de datos (Lógica de borrado en 0 pendiente de programar). Las empresas requerirán campos obligatorios como nombre, número de trabajadores, email, teléfono, NIT, categorías y municipio. |
| **Requerimientos NO funcionales:** | RNF-02 (SEGURIDAD \- CONFIRMACIÓN OBLIGATORIA)  RNF-04 (USABILIDAD \- ADVERTENCIA DE BORRADO)  RNF-05 (CUMPLIMIENTO LEGAL \- DERECHO AL OLVIDO) |

| Identificación del requerimiento: | RF06 |
| :---: | ----- |
| **Nombre del requerimiento:** | GESTIÓN DE OFERTAS LABORALES |
| **Características:** | Permite a las empresas administrar el ciclo de vida de sus vacantes, garantizando que la información sea veraz y cumpla con los estándares legales de remuneración. |
| **Descripción del requerimiento:** | El sistema proporcionará al reclutador las siguientes funcionalidades:  Crear: Registro obligatorio de Categoría y Municipio. Validación de Salario: Si es menor al SMLV vigente, el sistema obliga a marcar el checkbox "Salario a convenir" para proceder. Consultar (Read): Vista de tarjetas con buscador por título y filtros por antigüedad/postulados. Incluye contador de candidatos en tiempo real. Gestionar Estado (Update): El reclutador puede alternar entre estado "Activa" y "Pausada". La edición de contenido solo se habilita cuando la oferta está en pausa para proteger la integridad de los datos. Eliminar (Hard Delete): Borrado físico de la oferta. El sistema ejecutará una limpieza en cascada que elimina los registros de postulaciones vinculadas, pero mantiene intactos los perfiles de los aspirantes. Requiere confirmación mediante modal (Aceptar/Cancelar).  (Nota: Lógica de validación de salario y borrado en cascada pendiente de programar). |
| **Requerimientos NO funcionales:** | RNF-02 (SEGURIDAD \- VALIDACIÓN DE PERMISOS) RNF-03 (RENDIMIENTO \- FILTRADO EFICIENTE) RNF-04 (USABILIDAD \- MODALES DE CONFIRMACIÓN) |

| Identificación del requerimiento: | RF07 |
| :---: | ----- |
| **Nombre del requerimiento:** | GESTIÓN DE POSTULACIONES Y SEGUIMIENTO DE CANDIDATOS |
| **Características:** | Facilita el vínculo laboral entre aspirantes y empresas, permitiendo el seguimiento del proceso de selección y la consulta de perfiles profesionales. |
| **Descripción del requerimiento:** | El sistema gestionará el proceso de aplicación mediante las siguientes reglas:  Lado Aspirante: Registro de postulación en tabla intermedia (N:N). El frontend debe validar el estado de aplicación para bloquear el botón de postularse (visualizando "Ya te has postulado") si el registro ya existe en el backend. Lado Reclutador (Gestión): Acceso a la lista de aspirantes por oferta. Al dar clic en un candidato, el sistema usará el id\_aspirante para realizar un getById y redireccionar al perfil completo del usuario. Estados de Selección: El reclutador podrá actualizar el estado de la postulación entre: Pendiente, Entrevista o Rechazado (Pendiente cambiar lógica de Boolean a Clase/Enum en backend y automatizar detección de lectura en frontend). Consulta de HDV: El perfil del aspirante incluirá un modal para previsualizar la Hoja de Vida, con un botón funcional para descarga en formato PDF.  Notificaciones Internas: El cambio de estado generará una notificación en el panel del aspirante (Pendiente programar sistema de alertas internas).. |
| **Requerimientos NO funcionales:** | RNF-01 (ACCESIBILIDAD \- FORMULARIO SIN LÍMITE DE TIEMPO)  RNF-02 (SEGURIDAD \- VALIDACIÓN DE PROPIEDAD) RNF-04 (USABILIDAD \- ACTUALIZACIÓN INMEDIATA) |

| Identificación del requerimiento: | RF08 |
| :---: | ----- |
| **Nombre del requerimiento:** | BÚSQUEDA Y FILTRADO AVANZADO DE VACANTES |
| **Características:** | Proporciona a los aspirantes herramientas de exploración eficiente para localizar oportunidades laborales que se ajusten a su perfil y ubicación. |
| **Descripción del requerimiento:** | El sistema implementará un módulo de búsqueda con las siguientes capacidades: Buscador por Texto: Filtrado dinámico basado en coincidencias en el Título de la oferta. Filtros Parametrizados: Selección múltiple por Municipio y Categoría Laboral (datos obligatorios heredados del RF05). Lógica de Visualización: El sistema solo mostrará ofertas en estado "Activa" .  Persistencia de Búsqueda: El frontend mantendrá los filtros aplicados mediante el estado (useState) para que el aspirante pueda navegar entre ofertas sin perder sus criterios de búsqueda. |
| **Requerimientos NO funcionales:** | RNF-01 (ACCESIBILIDAD \-  FILTROS DE BÚSQUEDA)   RNF-03 (RENDIMIENTO \- BÚSQUEDA POR FILTRADO RAPIDA)   RNF-04 (USABILIDAD \- INDICADOR DE "SIN RESULTADOS") |

| Identificación del requerimiento: | RF09 |
| :---: | ----- |
| **Nombre del requerimiento:** | PANEL DE CONTROL (ADMINISTRADOR) |
| **Características:** | Centraliza la supervisión técnica de la plataforma, permitiendo el mantenimiento de la integridad de los datos y el control de acceso de todos los usuarios. |
| **Descripción del requerimiento:** | El sistema habilitará una interfaz de "Superusuario" para el rol ADMIN con las siguientes capacidades: CRUD Universal de Entidades: Permisos de nivel raíz para Crear, Leer, Actualizar y Eliminar (Borrado Físico) en la totalidad de las tablas del sistema (Usuarios, Empresas, Ofertas y Postulaciones). Control de Acceso (Status): El Admin podrá conmutar el campo isActive de cualquier cuenta registrada (Aspirantes, Reclutadores y Admins). Un estado Inactivo bloqueará inmediatamente la autenticación y validación del JWT en el Backend (Pendiente programar bloqueo preventivo). Gestión de Integridad: Capacidad de eliminar entidades Empresa bajo la modalidad de borrado físico en cascada, removiendo automáticamente reclutadores y ofertas asociadas para evitar huérfanos (Pendiente programar cascada). Seguridad del Root: Restricción de eliminación del Administrador ID: 1, garantizando un acceso maestro persistente. |
| **Requerimientos NO funcionales:** | RNF-02 (SEGURIDAD \- FILTRO DE AUTORIZACIÓN JWT)   RNF-03 (RENDIMIENTO \- CARGA DE TABLAS RÁPIDAMENTE)   |

