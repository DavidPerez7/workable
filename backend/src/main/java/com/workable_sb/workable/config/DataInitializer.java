package com.workable_sb.workable.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.workable_sb.workable.models.*;
import com.workable_sb.workable.repository.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private MunicipioRepo municipioRepo;
    @Autowired private AspiranteRepo aspiranteRepo;
    @Autowired private ReclutadorRepo reclutadorRepo;
    @Autowired private AdministradorRepo administradorRepo;
    @Autowired private EmpresaRepository empresaRepo;
    @Autowired private EstudioRepo estudioRepo;
    @Autowired private ExperienciaRepo experienciaRepo;
    @Autowired private HabilidadRepo habilidadRepo;
    @Autowired private OfertaRepo ofertaRepo;
    @Autowired private PostulacionRepo postulacionRepo;
    @Autowired private FeedbackRepo feedbackRepo;
    @Autowired private NotificacionRepo notificacionRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("=== INICIANDO DATA INITIALIZER ===");
            
            // Inicializar municipios solo si la base de datos está vacía
            if (municipioRepo.count() == 0) {
                initializeMunicipios();
                System.out.println("✓ Base de datos inicializada con municipios");
            }

            // Siempre limpiar datos existentes y recrear datos de prueba
            System.out.println("▶ Limpiando datos existentes...");
            cleanupExistingData();

            // Crear empresas básicas
            System.out.println("▶ Creando empresas...");
            recreateEmpresas();

            // Crear usuarios de prueba
            System.out.println("▶ Creando usuarios de prueba...");
            recreateTestUsers();
            System.out.println("▶ Creando aspirantes...");
            createGenericAspirantes();
            System.out.println("▶ Creando ofertas...");
            createGenericOfertas();
            
            System.out.println("=== DATA INITIALIZER COMPLETADO ===");
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO en DataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void cleanupExistingData() {
        try {
            // Limpiar datos en orden inverso a las dependencias
            feedbackRepo.deleteAll();
            notificacionRepo.deleteAll();
            postulacionRepo.deleteAll();
            ofertaRepo.deleteAll();
            estudioRepo.deleteAll();
            experienciaRepo.deleteAll();
            habilidadRepo.deleteAll();
            reclutadorRepo.deleteAll();
            aspiranteRepo.deleteAll();
            administradorRepo.deleteAll();
            empresaRepo.deleteAll();
            
            System.out.println("✓ Datos existentes limpiados");
        } catch (Exception e) {
            System.err.println("Error limpiando datos: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void recreateTestUsers() {
        // Obtener un municipio por defecto para los usuarios
        Municipio municipio = municipioRepo.findByNombre("Bogotá").orElse(municipioRepo.findAll().stream().findFirst().orElse(null));

        // ===== CREAR ASPIRANTE =====
        Aspirante aspirante = new Aspirante();
        aspirante.setNombre("Aspirante");
        aspirante.setApellido("Prueba");
        aspirante.setCorreo("aspirante@example.com");
        aspirante.setPassword(passwordEncoder.encode("pass123"));
        aspirante.setTelefono("3105555555");
        aspirante.setFechaNacimiento(LocalDate.of(2000, 6, 15));
        aspirante.setMunicipio(municipio);
        aspirante.setGenero(Aspirante.Genero.MASCULINO);
        aspirante.setIsActive(true);
        aspiranteRepo.save(aspirante);
        System.out.println("✓ Usuario ASPIRANTE recreado: aspirante@example.com / pass123");

        // ===== CREAR ADMINISTRADOR =====
        try {
            administradorRepo.deleteById(administradorRepo.findByCorreo("admin@example.com").orElse(new Administrador()).getId());
        } catch (Exception e) {
            // Ignorar si no existe
        }

        Administrador admin = new Administrador();
        admin.setNombre("Sistema");
        admin.setApellido("Administrador");
        admin.setCorreo("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setTelefono("3001111111");
        admin.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        admin.setMunicipio(municipio);
        admin.setIsActive(true);
        administradorRepo.save(admin);
        System.out.println("✓ Usuario ADMINISTRADOR recreado: admin@example.com / admin123");

        // ===== CREAR RECLUTADOR =====
        try {
            reclutadorRepo.deleteById(reclutadorRepo.findByCorreo("reclutador@example.com").orElse(new Reclutador()).getId());
        } catch (Exception e) {
            // Ignorar si no existe
        }

        Reclutador reclutador = new Reclutador();
        reclutador.setNombre("Reclutador");
        reclutador.setApellido("Prueba");
        reclutador.setCorreo("reclutador@example.com");
        reclutador.setPassword(passwordEncoder.encode("pass123"));
        reclutador.setTelefono("3105555556");
        reclutador.setFechaNacimiento(LocalDate.of(1990, 9, 20));
        reclutador.setMunicipio(municipio);
        reclutador.setIsActive(true);
        // Asignar empresa al reclutador de prueba (Bancolombia)
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        reclutador.setEmpresa(empresa);
        reclutadorRepo.save(reclutador);
        System.out.println("✓ Usuario RECLUTADOR recreado: reclutador@example.com / pass123");
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
            {"Éxito", "Cadena de supermercados", "Medellín", "890900609", "contacto@exito.com", "6042345682"}
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

    private void recreateEmpresas() {
        try {
            Municipio municipioBogota = municipioRepo.findByNombre("Bogotá").orElse(null);
            Municipio municipioMedellin = municipioRepo.findByNombre("Medellín").orElse(null);
            Municipio municipioCali = municipioRepo.findByNombre("Cali").orElse(null);

            // EMPRESA 1 - Bancolombia
            Empresa empresa1 = new Empresa();
            empresa1.setNombre("Bancolombia");
            empresa1.setDescripcion("Banco líder en Colombia");
            empresa1.setNit("860002964");
            empresa1.setEmailContacto("contacto@bancolombia.com.co");
            empresa1.setTelefonoContacto("6013078000");
            empresa1.setNumeroTrabajadores(5000);
            empresa1.setWebsite("www.bancolombia.com");
            empresa1.setMunicipio(municipioBogota);
            empresa1.setIsActive(true);
            empresaRepo.save(empresa1);
            System.out.println("✓ Empresa 1 creada: Bancolombia");

            // EMPRESA 2 - Ecopetrol
            Empresa empresa2 = new Empresa();
            empresa2.setNombre("Ecopetrol");
            empresa2.setDescripcion("Empresa petrolera estatal");
            empresa2.setNit("899999063");
            empresa2.setEmailContacto("contacto@ecopetrol.com.co");
            empresa2.setTelefonoContacto("6012345678");
            empresa2.setNumeroTrabajadores(3500);
            empresa2.setWebsite("www.ecopetrol.com.co");
            empresa2.setMunicipio(municipioBogota);
            empresa2.setIsActive(true);
            empresaRepo.save(empresa2);
            System.out.println("✓ Empresa 2 creada: Ecopetrol");

            // EMPRESA 3 - Grupo Aval
            Empresa empresa3 = new Empresa();
            empresa3.setNombre("Grupo Aval");
            empresa3.setDescripcion("Holding financiero");
            empresa3.setNit("860034313");
            empresa3.setEmailContacto("contacto@grupoaval.com");
            empresa3.setTelefonoContacto("6012345679");
            empresa3.setNumeroTrabajadores(2000);
            empresa3.setWebsite("www.grupoaval.com");
            empresa3.setMunicipio(municipioBogota);
            empresa3.setIsActive(true);
            empresaRepo.save(empresa3);
            System.out.println("✓ Empresa 3 creada: Grupo Aval");

            System.out.println("✓ Empresas recreadas: 3 empresas disponibles");
        } catch (Exception e) {
            System.err.println("Error en recreateEmpresas: " + e.getMessage());
            e.printStackTrace();
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

    private void recreateOfertas() {
        // Eliminar postulaciones primero (tienen FK a ofertas)
        postulacionRepo.deleteAll();
        ofertaRepo.deleteAll();

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
        System.out.println("✓ Ofertas recreadas: 10 ofertas disponibles");
    }

    private void createGenericUsersAndCompanies() {
        // NO eliminar aquí - se eliminarán al final después de usar los datos

        // CREAR 10 aspirantes genéricos adicionales
        String[] nombresAspirantes = {"Carlos", "María", "Juan", "Ana", "Luis", "Laura", "Pablo", "Sofia", "Diego", "Valentina"};
        String[] apellidosAspirantes = {"García", "Rodríguez", "Martínez", "López", "González", "Fernández", "Pérez", "Sánchez", "Torres", "Rivera"};
        Aspirante.Genero[] generos = {Aspirante.Genero.MASCULINO, Aspirante.Genero.FEMENINO, Aspirante.Genero.MASCULINO, 
                                       Aspirante.Genero.FEMENINO, Aspirante.Genero.MASCULINO, Aspirante.Genero.FEMENINO,
                                       Aspirante.Genero.MASCULINO, Aspirante.Genero.FEMENINO, Aspirante.Genero.MASCULINO, Aspirante.Genero.FEMENINO};

        for (int i = 0; i < 10; i++) {
            Aspirante aspirante = new Aspirante();
            aspirante.setNombre(nombresAspirantes[i]);
            aspirante.setApellido(apellidosAspirantes[i]);
            // Correo genérico con nombre y apellido
            String emailBase = (nombresAspirantes[i].toLowerCase() + "." + apellidosAspirantes[i].toLowerCase())
                .replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
            aspirante.setCorreo(emailBase + ".aspirante@example.com");
            aspirante.setPassword(passwordEncoder.encode("pass123"));
            aspirante.setTelefono("310" + (5000000 + i * 100000));
            aspirante.setFechaNacimiento(LocalDate.of(1995 + (i % 10), (i % 12) + 1, (i % 28) + 1));
            aspirante.setMunicipio(municipioRepo.findByNombre("Bogotá").orElse(null));
            aspirante.setGenero(generos[i]);
            aspirante.setIsActive(true);
            aspiranteRepo.save(aspirante);
        }
        System.out.println("✓ 10 Aspirantes genéricos creados");

        // CREAR 10 reclutadores genéricos adicionales
        String[] nombresReclutadores = {"Roberto", "Patricia", "Fernando", "Gloria", "Manuel", "Isabel", "Ricardo", "Mariana", "Andrés", "Camila"};
        String[] apellidosReclutadores = {"Salazar", "Díaz", "Castro", "Vargas", "Moreno", "Mendoza", "Herrera", "Cabrera", "Guerrero", "Navarro"};

        for (int i = 0; i < 10; i++) {
            Reclutador reclutador = new Reclutador();
            reclutador.setNombre(nombresReclutadores[i]);
            reclutador.setApellido(apellidosReclutadores[i]);
            // Correo genérico con nombre y apellido
            String emailBase = (nombresReclutadores[i].toLowerCase() + "." + apellidosReclutadores[i].toLowerCase())
                .replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
            reclutador.setCorreo(emailBase + ".reclutador@example.com");
            reclutador.setPassword(passwordEncoder.encode("pass123"));
            reclutador.setTelefono("311" + (5000000 + i * 100000));
            reclutador.setFechaNacimiento(LocalDate.of(1990 + (i % 10), (i % 12) + 1, (i % 28) + 1));
            reclutador.setMunicipio(municipioRepo.findByNombre("Medellín").orElse(null));
            reclutador.setIsActive(true);
            // Asignar empresa a cada reclutador (rotando entre las 10 empresas principales)
            Empresa empresa = empresaRepo.findById((long) (i % 10) + 1).orElse(null);
            reclutador.setEmpresa(empresa);
            reclutadorRepo.save(reclutador);
        }
        System.out.println("✓ 10 Reclutadores genéricos creados");

        // CREAR 10 empresas genéricas adicionales
        String[] nombresEmpresas = {"TechSolutions", "DataInnovate", "CloudWorks", "DevPro", "FinTech Global",
                                     "CreativeHub", "GreenEnergy", "HealthTech", "LogisticNet", "SecureData"};
        String[] descripciones = {"Soluciones tecnológicas avanzadas", "Análisis de datos e inteligencia artificial",
                                   "Servicios en la nube escalables", "Desarrollo de software profesional", "Finanzas digitales",
                                   "Agencia creativa especializada", "Energías renovables", "Tecnología sanitaria", 
                                   "Logística e importación", "Ciberseguridad"};

        for (int i = 0; i < 10; i++) {
            Empresa empresa = new Empresa();
            empresa.setNombre(nombresEmpresas[i]);
            empresa.setNit("900" + (100000 + i * 1000) + "001");
            empresa.setDescripcion(descripciones[i]);
            empresa.setNumeroTrabajadores(50 + (i * 100));
            empresa.setEmailContacto(nombresEmpresas[i].toLowerCase() + "@example.com");
            empresa.setTelefonoContacto("601" + (2000000 + i * 100000));
            empresa.setMunicipio(municipioRepo.findAll().get(i % 20));
            empresa.setIsActive(true);
            empresaRepo.save(empresa);
        }
        System.out.println("✓ 10 Empresas genéricas creadas");

        // CREAR 10 ofertas adicionales para las nuevas empresas
        String[] titulosOfertas = {"Desarrollador Full Stack", "Especialista en IA", "Ingeniero de Datos",
                                    "Líder Técnico", "Especialista en Nube", "Investigador en Machine Learning",
                                    "Desarrollador Python", "Experto en Ciberseguridad", "Gestor de Proyectos", "Consultor Senior"};

        long empresaCount = empresaRepo.count();
        for (int i = 0; i < 10; i++) {
            Empresa empresa = empresaRepo.findById(empresaCount - 9 + i).orElse(null);
            if (empresa != null) {
                Oferta oferta = new Oferta();
                oferta.setTitulo(titulosOfertas[i]);
                oferta.setDescripcion("Posición desafiante en " + empresa.getNombre());
                oferta.setFechaPublicacion(LocalDate.now().minusDays(5 + i));
                oferta.setFechaLimite(LocalDate.now().plusDays(25 - i));
                oferta.setSalario(3500000L + (i * 300000L));
                oferta.setNumeroVacantes(1 + (i % 3));
                oferta.setNivelExperiencia(Oferta.NivelExperiencia.values()[i % 4]);
                oferta.setModalidad(Oferta.Modalidad.values()[i % 3]);
                oferta.setTipoContrato(Oferta.TipoContrato.TIEMPO_COMPLETO);
                oferta.setEmpresa(empresa);
                ofertaRepo.save(oferta);
            }
        }
        System.out.println("✓ 10 Ofertas genéricas adicionales creadas");

        // NO crear postulaciones genéricas aquí para evitar problemas con entidades desacopladas
        // Las postulaciones se crearán en recreateEducacionYExperiencia() después de limpiar datos relacionados
    }

    private void recreateEducacionYExperiencia() {
        // Obtener ID del aspirante genérico PRIMERO (antes de los deleteAll)
        Aspirante aspiranteTemp = aspiranteRepo.findByCorreo("carlos.garcia.aspirante@example.com").orElse(null);
        Long aspiranteId = aspiranteTemp != null ? aspiranteTemp.getId() : null;

        // Eliminar todos los datos relacionados con educación y experiencia
        feedbackRepo.deleteAll();
        notificacionRepo.deleteAll();
        experienciaRepo.deleteAll();
        estudioRepo.deleteAll();

        // Obtener el aspirante de nuevo DESPUÉS de haber limpiado (ahora está en sesión fresca)
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId).orElse(null);
        
        if (aspirante != null) {
            // CREAR 10 ESTUDIOS
            String[] titulos = {"Ingeniería en Sistemas", "Licenciatura en Informática", "Certificación AWS",
                               "Diplomado en IA", "Especialización en Ciberseguridad", "Maestría en Ciencias de Datos",
                               "Certificación Google Cloud", "Bootcamp Full Stack", "Diplomado en DevOps", "Curso de Python Avanzado"};
            String[] instituciones = {"Universidad Nacional", "Universidad de los Andes", "AWS Academy", "Tech Institute",
                                     "Cybersecurity Academy", "Data Science University", "Google Cloud Academy", "Code Academy",
                                     "DevOps Institute", "Python Academy"};

            for (int i = 0; i < 10; i++) {
                Estudio estudio = new Estudio();
                estudio.setTitulo(titulos[i]);
                estudio.setInstitucion(instituciones[i]);
                estudio.setFechaInicio(LocalDate.of(2015 + (i / 2), (i % 12) + 1, (i % 28) + 1));
                estudio.setFechaFin(LocalDate.of(2020 + (i / 2), (i % 12) + 1, (i % 28) + 1));
                estudio.setEnCurso(i == 9);
                estudio.setNivelEducativo(Estudio.NivelEducativo.values()[i % Estudio.NivelEducativo.values().length]);
                estudio.setEstadoEstudio(Estudio.EstadoEstudio.ACTIVO);
                estudio.setAspirante(aspirante);
                estudioRepo.save(estudio);
            }
            System.out.println("✓ 10 Estudios creados");

            // CREAR 10 EXPERIENCIAS
            String[] cargos = {"Desarrollador Junior", "Desarrollador Senior", "Ingeniero de Software", "Tech Lead",
                              "Arquitecto de Soluciones", "DevOps Engineer", "Data Scientist", "Full Stack Developer",
                              "QA Engineer", "Consultor Técnico"};
            String[] empresas = {"StartUp XYZ", "Big Tech Corp", "Fintech Solutions", "Cloud Services Inc",
                               "DataAnalytics Ltd", "WebDev Agency", "Mobile First Inc", "Security Systems", "AI Research Lab", "Global Solutions"};
            String[] descripciones = {"Desarrollo de APIs REST con Spring Boot", "Implementación de microservicios",
                                     "Diseño de arquitecturas escalables", "Liderazgo técnico del equipo", "Asesoría en soluciones cloud",
                                     "Configuración de pipelines CI/CD", "Análisis predictivo con Machine Learning", "Desarrollo full stack MERN",
                                     "Testing automatizado y calidad", "Consultoría en transformación digital"};

            for (int i = 0; i < 10; i++) {
                Experiencia experiencia = new Experiencia();
                experiencia.setCargo(cargos[i]);
                experiencia.setEmpresa(empresas[i]);
                experiencia.setDescripcion(descripciones[i]);
                experiencia.setFechaInicio(LocalDate.of(2018 + (i / 3), (i % 12) + 1, 1));
                experiencia.setFechaFin(i == 9 ? null : LocalDate.of(2022 + (i / 3), (i % 12) + 1, 1));
                experiencia.setAspirante(aspirante);
                experienciaRepo.save(experiencia);
            }
            System.out.println("✓ 10 Experiencias creadas");

            System.out.println("✓ 10 Experiencias creadas");

            // AGREGAR HABILIDADES DIRECTAMENTE AL ASPIRANTE
            Map<Aspirante.HabilidadEnum, String> habilidades = new java.util.HashMap<>();
            Aspirante.HabilidadEnum[] skillArray = Aspirante.HabilidadEnum.values();
            for (int i = 0; i < 5; i++) {
                Aspirante.HabilidadEnum habilidad = skillArray[i % skillArray.length];
                String nivel = Aspirante.NivelDominio.values()[i % Aspirante.NivelDominio.values().length].name();
                habilidades.put(habilidad, nivel);
            }
            aspirante.setHabilidades(habilidades);
            aspiranteRepo.save(aspirante);
            System.out.println("✓ Habilidades agregadas al aspirante");

            // CREAR 10 FEEDBACKS
            Empresa empresa = empresaRepo.findAll().stream()
                .skip(10) // Saltar las 10 empresas de prueba
                .findFirst()
                .orElse(empresaRepo.findAll().stream().findFirst().orElse(null));
            
            if (empresa != null) {
                String[] titulosFeedback = {"Buen desempeño", "Comunicación efectiva", "Problemas solucionados",
                                           "Colaboración en equipo", "Iniciativa demostrada", "Puntualidad excelente",
                                           "Calidad de trabajo", "Mejora continua", "Liderazgo destacado", "Adaptabilidad"};

                for (int i = 0; i < 10; i++) {
                    Feedback feedback = new Feedback();
                    feedback.setTitulo(titulosFeedback[i]);
                    feedback.setDescripcion("Evaluación " + (i + 1) + " sobre desempeño en proyectos");
                    feedback.setPuntuacion((float) (3.0 + (i * 0.2)));
                    feedback.setAspirante(aspirante);
                    feedback.setEmpresa(empresa);
                    feedbackRepo.save(feedback);
                }
                System.out.println("✓ 10 Feedbacks creados");
            }

            // CREAR 10 NOTIFICACIONES
            String[] tiposNotificacion = {"Nueva Oferta", "Entrevista Programada", "Respuesta de Aplicación",
                                         "Mensaje de Empresa", "Actualización de Perfil", "Recordatorio de Oferta",
                                         "Postulación Exitosa", "Invitación a Evento", "Cambio de Estado", "Noticia Importante"};

            for (int i = 0; i < 10; i++) {
                Notificacion notificacion = new Notificacion();
                notificacion.setTipo(Notificacion.Tipo.values()[i % Notificacion.Tipo.values().length]);
                notificacion.setTitulo(tiposNotificacion[i]);
                notificacion.setMensaje("Descripción de la notificación " + (i + 1));
                notificacion.setFechaCreacion(LocalDate.now().minusDays(i));
                notificacion.setAspirante(aspirante);
                notificacionRepo.save(notificacion);
            }
            System.out.println("✓ 10 Notificaciones creadas");
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

    private void initializeUsuarioHabilidades() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("juan.perez@example.com").orElse(null);
        if (aspirante != null) {
            Map<Aspirante.HabilidadEnum, String> habilidades = new java.util.HashMap<>();
            Aspirante.HabilidadEnum[] skillArray = Aspirante.HabilidadEnum.values();
            for (int i = 0; i < 5; i++) {
                Aspirante.HabilidadEnum habilidad = skillArray[i % skillArray.length];
                String nivel = Aspirante.NivelDominio.values()[i % Aspirante.NivelDominio.values().length].name();
                habilidades.put(habilidad, nivel);
            }
            aspirante.setHabilidades(habilidades);
            aspiranteRepo.save(aspirante);
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

    private void cleanupOldGenericUsers() {
        System.out.println("Limpiando usuarios genéricos antiguos...");
        
        try {
            // Eliminamos todos los aspirantes "generic" creados en ejecuciones anteriores
            List<Aspirante> allAspirantes = aspiranteRepo.findAll();
            int deletedAspirantesCount = 0;
            
            for (Aspirante aspirante : allAspirantes) {
                if (aspirante.getCorreo() != null && 
                    (aspirante.getCorreo().startsWith("generic") || 
                     aspirante.getCorreo().startsWith("aspirante_"))) {
                    
                    aspiranteRepo.deleteById(aspirante.getId());
                    deletedAspirantesCount++;
                }
            }
            
            // Eliminamos todos los reclutadores "generic" creados en ejecuciones anteriores
            List<Reclutador> allReclutadores = reclutadorRepo.findAll();
            int deletedReclutadoresCount = 0;
            
            for (Reclutador reclutador : allReclutadores) {
                if (reclutador.getCorreo() != null && 
                    (reclutador.getCorreo().startsWith("generic") || 
                     reclutador.getCorreo().startsWith("reclutador_"))) {
                    
                    reclutadorRepo.deleteById(reclutador.getId());
                    deletedReclutadoresCount++;
                }
            }
            
            System.out.println("✓ Limpieza completada. Eliminados " + deletedAspirantesCount + 
                             " aspirantes y " + deletedReclutadoresCount + " reclutadores genéricos");
        } catch (Exception e) {
            System.out.println("⚠ Error durante la limpieza de usuarios genéricos: " + e.getMessage());
            // No lanzamos la excepción para que el startup continúe
        }
    }

    private void createGenericAspirantes() {
        // Obtener un municipio por defecto
        Municipio municipio = municipioRepo.findByNombre("Bogotá").orElse(municipioRepo.findAll().stream().findFirst().orElse(null));

        // Crear 3 aspirantes genéricos adicionales
        Object[][] aspirantesData = {
            {"Carlos", "García", "carlos.garcia@example.com", "3105555556", Aspirante.Genero.MASCULINO},
            {"María", "Rodríguez", "maria.rodriguez@example.com", "3105555557", Aspirante.Genero.FEMENINO},
            {"Juan", "Martínez", "juan.martinez@example.com", "3105555558", Aspirante.Genero.MASCULINO}
        };

        for (int i = 0; i < aspirantesData.length; i++) {
            // Verificar si ya existe
            if (aspiranteRepo.findByCorreo((String)aspirantesData[i][2]).isPresent()) {
                continue; // Saltar si ya existe
            }

            Aspirante aspirante = new Aspirante();
            aspirante.setNombre((String)aspirantesData[i][0]);
            aspirante.setApellido((String)aspirantesData[i][1]);
            aspirante.setCorreo((String)aspirantesData[i][2]);
            aspirante.setPassword(passwordEncoder.encode("pass123"));
            aspirante.setTelefono((String)aspirantesData[i][3]);
            aspirante.setFechaNacimiento(LocalDate.of(1995 + i, 6, 15));
            aspirante.setMunicipio(municipio);
            aspirante.setGenero((Aspirante.Genero) aspirantesData[i][4]);
            aspirante.setIsActive(true);
            aspiranteRepo.save(aspirante);
        }
        System.out.println("✓ 3 Aspirantes genéricos adicionales creados");
    }

    private void createGenericOfertas() {
        // Crear 2 ofertas simples
        Empresa empresa1 = empresaRepo.findById(1L).orElse(null);
        Empresa empresa2 = empresaRepo.findById(2L).orElse(null);

        if (empresa1 != null) {
            Oferta oferta1 = new Oferta();
            oferta1.setTitulo("Desarrollador Java");
            oferta1.setDescripcion("Desarrollo de aplicaciones web con Spring Boot");
            oferta1.setFechaPublicacion(LocalDate.now());
            oferta1.setFechaLimite(LocalDate.now().plusDays(30));
            oferta1.setSalario(4000000L);
            oferta1.setNumeroVacantes(1);
            oferta1.setNivelExperiencia(Oferta.NivelExperiencia.INTERMEDIO);
            oferta1.setModalidad(Oferta.Modalidad.PRESENCIAL);
            oferta1.setTipoContrato(Oferta.TipoContrato.TIEMPO_COMPLETO);
            oferta1.setEmpresa(empresa1);
            oferta1.setEstado(Oferta.EstadoOferta.ABIERTA);
            ofertaRepo.save(oferta1);
        }

        if (empresa2 != null) {
            Oferta oferta2 = new Oferta();
            oferta2.setTitulo("Analista de Sistemas");
            oferta2.setDescripcion("Análisis y diseño de sistemas empresariales");
            oferta2.setFechaPublicacion(LocalDate.now());
            oferta2.setFechaLimite(LocalDate.now().plusDays(30));
            oferta2.setSalario(3500000L);
            oferta2.setNumeroVacantes(1);
            oferta2.setNivelExperiencia(Oferta.NivelExperiencia.BASICO);
            oferta2.setModalidad(Oferta.Modalidad.REMOTO);
            oferta2.setTipoContrato(Oferta.TipoContrato.TIEMPO_COMPLETO);
            oferta2.setEmpresa(empresa2);
            oferta2.setEstado(Oferta.EstadoOferta.ABIERTA);
            ofertaRepo.save(oferta2);
        }

        System.out.println("✓ 2 Ofertas simples creadas");
    }
}
