package com.workable_sb.workable.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.workable_sb.workable.models.*;
import com.workable_sb.workable.repository.*;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private MunicipioRepo municipioRepo;
    @Autowired private HabilidadRepo habilidadRepo;
    @Autowired private AspiranteRepo aspiranteRepo;
    @Autowired private ReclutadorRepo reclutadorRepo;
    @Autowired private AdministradorRepo administradorRepo;
    @Autowired private EmpresaRepository empresaRepo;
    @Autowired private EstudioRepo estudioRepo;
    @Autowired private ExperienciaRepo experienciaRepo;
    @Autowired private OfertaRepo ofertaRepo;
    @Autowired private PostulacionRepo postulacionRepo;
    @Autowired private FeedbackRepo feedbackRepo;
    @Autowired private NotificacionRepo notificacionRepo;
    @Autowired private UsuarioHabilidadRepo usuarioHabilidadRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Siempre asegurar que el usuario ADMIN exista y tenga la contraseña conocida
        ensureAdminUser();

        // Inicializar datos de prueba solo si la base de datos está vacía
        if (municipioRepo.count() == 0) {
            initializeMunicipios();
            initializeHabilidades();
            initializeUsuarios();
            initializeEmpresas();
            initializeEstudios();
            initializeExperiencias();
            initializeOfertas();
            initializePostulaciones();
            initializeUsuarioHabilidades();
            initializeFeedbacks();
            initializeNotificaciones();
            System.out.println("Base de datos inicializada con 10 registros por tabla");
        } else {
            System.out.println("Base de datos ya contiene datos. Solo se verifico usuario ADMIN.");
        }
    }

    private void ensureAdminUser() {
        Municipio municipio = municipioRepo.findAll().stream().findFirst().orElse(null);
        var admin = administradorRepo.findByCorreo("admin@example.com");

        if (admin.isEmpty()) {
            Administrador nuevo = new Administrador();
            nuevo.setNombre("Admin");
            nuevo.setApellido("Sistema");
            nuevo.setCorreo("admin@example.com");
            nuevo.setPassword(passwordEncoder.encode("admin123"));
            nuevo.setTelefono("3001111111");
            nuevo.setFechaNacimiento(LocalDate.of(1990, 1, 1));
            nuevo.setMunicipio(municipio);
            nuevo.setIsActive(true);
            administradorRepo.save(nuevo);
            System.out.println("Usuario ADMINISTRADOR creado: admin@example.com / admin123");
        } else {
            Administrador existente = admin.get();
            existente.setPassword(passwordEncoder.encode("admin123"));
            existente.setIsActive(true);
            existente.setMunicipio(municipio);
            administradorRepo.save(existente);
            System.out.println("Usuario ADMINISTRADOR verificado/actualizado: admin@example.com / admin123");
        }
    }

    private void initializeMunicipios() {
        // Municipios reales de Colombia con IDs reales
        Object[][] municipiosData = {
            {1L, "Bogotá", Municipio.Departamento.BOGOTA_DC},
            {2L, "Medellín", Municipio.Departamento.ANTIOQUIA},
            {3L, "Cali", Municipio.Departamento.VALLE_DEL_CAUCA},
            {4L, "Barranquilla", Municipio.Departamento.ATLANTICO},
            {5L, "Cartagena", Municipio.Departamento.BOLIVAR},
            {6L, "Cúcuta", Municipio.Departamento.NORTE_DE_SANTANDER},
            {7L, "Bucaramanga", Municipio.Departamento.SANTANDER},
            {8L, "Pereira", Municipio.Departamento.RISARALDA},
            {9L, "Santa Marta", Municipio.Departamento.MAGDALENA},
            {10L, "Ibagué", Municipio.Departamento.TOLIMA},
            {11L, "Pasto", Municipio.Departamento.NARINO},
            {12L, "Manizales", Municipio.Departamento.CALDAS},
            {13L, "Neiva", Municipio.Departamento.HUILA},
            {14L, "Popayán", Municipio.Departamento.CAUCA},
            {15L, "Armenia", Municipio.Departamento.QUINDIO},
            {16L, "Villavicencio", Municipio.Departamento.META},
            {17L, "Sincelejo", Municipio.Departamento.SUCRE},
            {18L, "Valledupar", Municipio.Departamento.CESAR},
            {19L, "Montería", Municipio.Departamento.CORDOBA},
            {20L, "Tunja", Municipio.Departamento.BOYACA}
        };

        for (Object[] data : municipiosData) {
            Municipio municipio = new Municipio();
            municipio.setId((Long) data[0]);
            municipio.setNombre((String) data[1]);
            municipio.setDepartamento((Municipio.Departamento) data[2]);
            municipioRepo.save(municipio);
        }
    }

    private void initializeHabilidades() {
        String[] habilidades = {"Java", "Python", "JavaScript", "SQL", "Spring Boot", 
                                "React", "Docker", "AWS", "Git", "REST API"};
        for (int i = 0; i < habilidades.length; i++) {
            Habilidad habilidad = new Habilidad();
            habilidad.setNombre(habilidades[i]);
            habilidad.setTipo(Habilidad.TipoHabilidad.values()[i % Habilidad.TipoHabilidad.values().length]);
            habilidadRepo.save(habilidad);
        }
    }

    private void initializeUsuarios() {
        // 4 ASPIRANTES con nombres reales
        String[][] aspirantesData = {
            {"Juan", "Pérez", "juan.perez@example.com", "Bogotá"},
            {"María", "García", "maria.garcia@example.com", "Medellín"},
            {"Carlos", "Rodríguez", "carlos.rodriguez@example.com", "Cali"},
            {"Ana", "Martínez", "ana.martinez@example.com", "Barranquilla"}
        };

        for (int i = 0; i < aspirantesData.length; i++) {
            Aspirante aspirante = new Aspirante();
            aspirante.setNombre(aspirantesData[i][0]);
            aspirante.setApellido(aspirantesData[i][1]);
            aspirante.setCorreo(aspirantesData[i][2]);
            aspirante.setPassword(passwordEncoder.encode("pass123"));
            aspirante.setTelefono("300111111" + (i + 1));
            aspirante.setFechaNacimiento(LocalDate.of(1995 + i, 1 + i, 15));
            aspirante.setMunicipio(municipioRepo.findByNombre(aspirantesData[i][3]).orElse(null));
            aspirante.setIsActive(true);
            aspiranteRepo.save(aspirante);
        }

        // 5 RECLUTADORES con nombres reales
        String[][] reclutadoresData = {
            {"Luis", "Fernández", "luis.fernandez@example.com", "Bogotá"},
            {"Carmen", "López", "carmen.lopez@example.com", "Medellín"},
            {"Miguel", "González", "miguel.gonzalez@example.com", "Cali"},
            {"Isabel", "Hernández", "isabel.hernandez@example.com", "Cartagena"},
            {"David", "Jiménez", "david.jimenez@example.com", "Bucaramanga"}
        };

        for (int i = 0; i < reclutadoresData.length; i++) {
            Reclutador reclutador = new Reclutador();
            reclutador.setNombre(reclutadoresData[i][0]);
            reclutador.setApellido(reclutadoresData[i][1]);
            reclutador.setCorreo(reclutadoresData[i][2]);
            reclutador.setPassword(passwordEncoder.encode("pass123"));
            reclutador.setTelefono("300222222" + (i + 1));
            reclutador.setFechaNacimiento(LocalDate.of(1988 + i, 3 + i, 20));
            reclutador.setMunicipio(municipioRepo.findByNombre(reclutadoresData[i][3]).orElse(null));
            reclutador.setIsActive(true);
            reclutadorRepo.save(reclutador);
        }
    }

    private void initializeEmpresas() {
        // 10 EMPRESAS con nombres reales de Colombia
        String[][] empresasData = {
            {"Bancolombia", "Banco líder en Colombia", "Bogotá", "860002964", "contacto@bancolombia.com.co", "6013078000"},
            {"Ecopetrol", "Empresa petrolera estatal", "Bogotá", "899999063", "contacto@ecopetrol.com.co", "6012345678"},
            {"Grupo Aval", "Holding financiero", "Bogotá", "860034313", "contacto@grupoaval.com", "6012345679"},
            {"Cementos Argos", "Empresa cementera", "Medellín", "890900286", "contacto@argos.com.co", "6042345678"},
            {"Postobón", "Empresa de bebidas", "Medellín", "890900608", "contacto@postobon.com.co", "6042345679"},
            {"Alpina", "Productos lácteos y alimentos", "Bogotá", "860002738", "contacto@alpina.com.co", "6012345680"},
            {"Colombina", "Dulces y chocolates", "Cali", "890900251", "contacto@colombina.com", "6022345678"},
            {"ISA", "Infraestructura energética", "Medellín", "890900738", "contacto@isa.com.co", "6042345680"},
            {"Nutresa", "Alimentos procesados", "Medellín", "890900840", "contacto@nutresa.com.co", "6042345681"},
            {"Éxito", "Cadena de supermercados", "Medellín", "890900608", "contacto@exito.com", "6042345682"}
        };

        for (int i = 0; i < empresasData.length; i++) {
            Empresa empresa = new Empresa();
            empresa.setNombre(empresasData[i][0]);
            empresa.setNit(empresasData[i][3]);
            empresa.setDescripcion(empresasData[i][1]);
            empresa.setNumeroTrabajadores(1000 + (i * 500)); // Números realistas de empleados
            empresa.setEmailContacto(empresasData[i][4]);
            empresa.setTelefonoContacto(empresasData[i][5]);
            empresa.setMunicipio(municipioRepo.findByNombre(empresasData[i][2]).orElse(null));
            empresa.setIsActive(true);
            empresaRepo.save(empresa);
        }
    }

    private void initializeEstudios() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);
        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                Estudio estudio = new Estudio();
                estudio.setTitulo("Estudio " + i);
                estudio.setInstitucion("Institución " + i);
                estudio.setFechaInicio(LocalDate.of(2015, 1, 1));
                estudio.setFechaFin(LocalDate.of(2020, 12, 31));
                estudio.setEnCurso(false);
                estudio.setNivelEducativo(Estudio.NivelEducativo.UNIVERSITARIO);
                estudio.setEstadoEstudio(Estudio.EstadoEstudio.ACTIVO);
                estudio.setAspirante(aspirante);
                estudioRepo.save(estudio);
            }
        }
    }

    private void initializeExperiencias() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);
        if (aspirante != null) {
            String[][] experienciasData = {
                {"Desarrollador Java", "Tech Solutions S.A.", "Desarrollo de aplicaciones web con Spring Boot"},
                {"Analista de Sistemas", "DataCorp Ltda.", "Análisis y diseño de sistemas empresariales"},
                {"Programador Full Stack", "WebDev Company", "Desarrollo frontend con React y backend con Node.js"},
                {"Ingeniero de Software", "SoftTech SAS", "Mantenimiento y evolución de sistemas legacy"},
                {"Consultor TI", "IT Consulting Group", "Implementación de soluciones tecnológicas"}
            };

            for (int i = 0; i < experienciasData.length; i++) {
                Experiencia experiencia = new Experiencia();
                experiencia.setCargo(experienciasData[i][0]);
                experiencia.setEmpresa(experienciasData[i][1]);
                experiencia.setDescripcion(experienciasData[i][2]);
                experiencia.setFechaInicio(LocalDate.of(2018 + i, 1, 1));
                experiencia.setFechaFin(i < 4 ? LocalDate.of(2022 + i, 12, 31) : null); // Una experiencia actual
                experiencia.setAspirante(aspirante);
                experienciaRepo.save(experiencia);
            }
        }
    }

    private void initializeOfertas() {
        // Crear ofertas para diferentes empresas de manera más clara
        String[] titulos = {
            "Desarrollador Backend Java",
            "Analista de Datos",
            "Desarrollador Frontend React",
            "Ingeniero DevOps",
            "Arquitecto de Software",
            "Tester QA Automation",
            "Product Manager",
            "Analista de Seguridad",
            "Desarrollador Mobile",
            "Scrum Master"
        };

        String[] descripciones = {
            "Desarrollo de microservicios con Spring Boot y bases de datos relacionales",
            "Análisis de datos empresariales con Python y SQL",
            "Desarrollo de interfaces de usuario modernas con React y TypeScript",
            "Implementación de pipelines CI/CD y gestión de infraestructura cloud",
            "Diseño de arquitecturas escalables y microservicios",
            "Automatización de pruebas con Selenium y desarrollo de frameworks de testing",
            "Gestión de productos digitales y coordinación con equipos de desarrollo",
            "Evaluación y mejora de la seguridad de sistemas informáticos",
            "Desarrollo de aplicaciones móviles nativas iOS y Android",
            "Facilitación de ceremonias ágiles y coaching de equipos"
        };

        Long[] empresaIds = {1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L};
        Long[] salarios = {4500000L, 3800000L, 4200000L, 5500000L, 6500000L, 3500000L, 4800000L, 5200000L, 4600000L, 4300000L};
        Integer[] numeroVacantes = {2, 1, 3, 1, 1, 2, 1, 1, 2, 1};
        Oferta.NivelExperiencia[] niveles = {
            Oferta.NivelExperiencia.BASICO,
            Oferta.NivelExperiencia.INTERMEDIO,
            Oferta.NivelExperiencia.BASICO,
            Oferta.NivelExperiencia.AVANZADO,
            Oferta.NivelExperiencia.EXPERTO,
            Oferta.NivelExperiencia.BASICO,
            Oferta.NivelExperiencia.INTERMEDIO,
            Oferta.NivelExperiencia.INTERMEDIO,
            Oferta.NivelExperiencia.BASICO,
            Oferta.NivelExperiencia.INTERMEDIO
        };
        Oferta.Modalidad[] modalidades = {
            Oferta.Modalidad.PRESENCIAL,
            Oferta.Modalidad.HIBRIDO,
            Oferta.Modalidad.REMOTO,
            Oferta.Modalidad.PRESENCIAL,
            Oferta.Modalidad.HIBRIDO,
            Oferta.Modalidad.PRESENCIAL,
            Oferta.Modalidad.HIBRIDO,
            Oferta.Modalidad.PRESENCIAL,
            Oferta.Modalidad.REMOTO,
            Oferta.Modalidad.HIBRIDO
        };
        Oferta.TipoContrato[] tiposContrato = {
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO,
            Oferta.TipoContrato.TIEMPO_COMPLETO
        };

        for (int i = 0; i < titulos.length; i++) {
            Empresa empresa = empresaRepo.findById(empresaIds[i]).orElse(null);
            if (empresa != null) {
                Oferta oferta = new Oferta();
                oferta.setTitulo(titulos[i]);
                oferta.setDescripcion(descripciones[i]);
                oferta.setFechaPublicacion(LocalDate.now().minusDays(i + 1));
                oferta.setFechaLimite(LocalDate.now().plusDays(30 - i));
                oferta.setSalario(salarios[i]);
                oferta.setNumeroVacantes(numeroVacantes[i]);
                oferta.setNivelExperiencia(niveles[i]);
                oferta.setModalidad(modalidades[i]);
                oferta.setTipoContrato(tiposContrato[i]);
                oferta.setEmpresa(empresa);
                ofertaRepo.save(oferta);
            }
        }
    }

    private void initializePostulaciones() {
        // Crear postulaciones con aspirantes reales
        String[] aspirantesCorreos = {"juan.perez@example.com", "maria.garcia@example.com", "carlos.rodriguez@example.com", "ana.martinez@example.com"};

        for (int i = 0; i < 10; i++) {
            Aspirante aspirante = aspiranteRepo.findByCorreo(aspirantesCorreos[i % aspirantesCorreos.length]).orElse(null);
            Oferta oferta = ofertaRepo.findById((long) (1 + i % 10)).orElse(null);

            if (aspirante != null && oferta != null) {
                Postulacion postulacion = new Postulacion();
                postulacion.setEstado(Postulacion.Estado.values()[i % Postulacion.Estado.values().length]);
                postulacion.setAspirante(aspirante);
                postulacion.setOferta(oferta);
                postulacionRepo.save(postulacion);
            }
        }
    }

    private void initializeUsuarioHabilidades() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);
        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                UsuarioHabilidad usuarioHabilidad = new UsuarioHabilidad();
                Habilidad habilidad = habilidadRepo.findById((long) i).orElse(null);
                if (habilidad != null) {
                    usuarioHabilidad.setAspirante(aspirante);
                    usuarioHabilidad.setHabilidad(habilidad);
                    usuarioHabilidad.setNivel(UsuarioHabilidad.NivelDominio.values()[i % UsuarioHabilidad.NivelDominio.values().length]);
                    usuarioHabilidadRepo.save(usuarioHabilidad);
                }
            }
        }
    }

    private void initializeFeedbacks() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);
        Empresa empresa = empresaRepo.findById(1L).orElse(null);

        if (aspirante != null && empresa != null) {
            for (int i = 1; i <= 10; i++) {
                Feedback feedback = new Feedback();
                feedback.setTitulo("Feedback " + i);
                feedback.setDescripcion("Descripción del feedback " + i);
                feedback.setPuntuacion((float) (i % 5 + 1));
                feedback.setAspirante(aspirante);
                feedback.setEmpresa(empresa);
                feedbackRepo.save(feedback);
            }
        }
    }

    private void initializeNotificaciones() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);

        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                Notificacion notificacion = new Notificacion();
                notificacion.setTipo(Notificacion.Tipo.values()[i % Notificacion.Tipo.values().length]);
                notificacion.setTitulo("Notificación " + i);
                notificacion.setMensaje("Descripción de la notificación " + i);
                notificacion.setFechaCreacion(LocalDate.now().minusDays(i));
                notificacion.setAspirante(aspirante);
                notificacionRepo.save(notificacion);
            }
        }
    }
}
