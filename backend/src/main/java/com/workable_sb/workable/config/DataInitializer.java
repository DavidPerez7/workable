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
    @Autowired private OfertaRepo ofertaRepo;
    @Autowired private PostulacionRepo postulacionRepo;
    @Autowired private HojaVidaRepo hojaVidaRepo;
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

            // Crear usuarios de prueba (solo el aspirante de prueba)
            System.out.println("▶ Creando usuarios de prueba...");
            recreateTestUsers();

            // NOTA: no crear aspirantes, ofertas, estudios o experiencias genéricos aquí — dejamos solo datos mínimos de prueba
            
            System.out.println("=== DATA INITIALIZER COMPLETADO ===");
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO en DataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void cleanupExistingData() {
        try {
            // Limpiar datos en orden inverso a las dependencias (entidades dependientes primero)
            try { postulacionRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando postulaciones: " + e.getMessage()); }
            try { ofertaRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando ofertas: " + e.getMessage()); }
            try { reclutadorRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando reclutadores: " + e.getMessage()); }
            try { aspiranteRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando aspirantes: " + e.getMessage()); }
            try { administradorRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando administradores: " + e.getMessage()); }
            try { empresaRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando empresas: " + e.getMessage()); }
            
            System.out.println("✓ Datos existentes limpiados");
        } catch (Exception e) {
            System.err.println("Error limpiando datos: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void recreateTestUsers() {
        // Obtener un municipio por defecto para los usuarios
        Municipio municipio = municipioRepo.findAll().stream().findFirst().orElse(null);

        // ===== CREAR ASPIRANTE =====
        Aspirante aspirante = new Aspirante();
        aspirante.setNombre("Aspirante");
        aspirante.setApellido("Prueba");
        aspirante.setCorreo("aspirante@example.com");
        aspirante.setPassword(passwordEncoder.encode("pass123"));
        aspirante.setTelefono("3105555555");
        aspirante.setUrlFotoPerfil("https://example.com/avatars/aspirante.png");
        aspirante.setFechaNacimiento(LocalDate.of(2000, 6, 15));
        aspirante.setMunicipio(municipio);
        aspirante.setGenero(Aspirante.Genero.MASCULINO);
        aspirante.setIsActive(true);
        aspirante.setDescripcion("Aspirante de prueba creado por DataInitializer para testing");
        aspirante.setUbicacion("Bogotá, Colombia");
        Map<Aspirante.HabilidadEnum, String> habilidades = new java.util.HashMap<>();
        habilidades.put(Aspirante.HabilidadEnum.JAVA, "INTERMEDIO");
        habilidades.put(Aspirante.HabilidadEnum.REACT, "BASICO");
        aspirante.setHabilidades(habilidades);
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
        admin.setUltimoAcceso(java.time.LocalDateTime.now());
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
        reclutador.setUrlFotoPerfil("https://example.com/avatars/reclutador.png");
        reclutador.setUrlBanner("https://example.com/banners/reclutador-banner.png");
        // Asignar empresa al reclutador de prueba (Bancolombia)
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        reclutador.setEmpresa(empresa);
        reclutadorRepo.save(reclutador);
        System.out.println("✓ Usuario RECLUTADOR recreado: reclutador@example.com / pass123");

        // ===== CREAR OFERTA DE PRUEBA =====
        try {
            Oferta oferta = new Oferta();
            oferta.setTitulo("Desarrollador Java - Prueba");
            oferta.setDescripcion("Oferta de prueba generada por DataInitializer");
            oferta.setFechaPublicacion(LocalDate.now());
            oferta.setFechaLimite(LocalDate.now().plusDays(30));
            oferta.setSalario(3500000L);
            oferta.setNumeroVacantes(2);
            oferta.setNivelExperiencia(Oferta.NivelExperiencia.INTERMEDIO);
            oferta.setEstado(Oferta.EstadoOferta.ABIERTA);
            oferta.setRequisitos("Java, Spring Boot, SQL");
            oferta.setMunicipio(municipio);
            oferta.setModalidad(Oferta.Modalidad.REMOTO);
            oferta.setTipoContrato(Oferta.TipoContrato.TIEMPO_COMPLETO);
            oferta.setEmpresa(empresa);
            // agregar un beneficio de ejemplo
            try {
                oferta.getBeneficios().add(Oferta.Beneficio.TELETRABAJO);
            } catch (Exception ignore) {}
            oferta.setPuntuacion(0.0f);
            ofertaRepo.save(oferta);
            System.out.println("✓ Oferta de prueba creada: " + oferta.getTitulo());

            // ===== CREAR POSTULACIÓN para aspirante id=1 (si existe) o para el aspirante recién creado =====
            try {
                Postulacion postulacion = new Postulacion();
                postulacion.setOferta(oferta);
                Aspirante postulante = aspiranteRepo.findById(1L).orElse(aspirante);
                postulacion.setAspirante(postulante);
                postulacion.setFechaCreacion(LocalDate.now());
                postulacion.setIsActive(true);
                postulacion.setEstado(Postulacion.Estado.ENTREVISTA_PROGRAMADA);
                
                // Agregar CitacionData embebida
                CitacionData citacion = new CitacionData();
                citacion.setFecha(LocalDate.now().plusDays(5));
                citacion.setHora("14:30");
                citacion.setLinkMeet("https://meet.google.com/abc-defg-hij");
                citacion.setEstadoCitacion(CitacionData.EstadoCitacion.PENDIENTE);
                postulacion.setCitacionData(citacion);
                
                postulacionRepo.save(postulacion);
                System.out.println("✓ Postulación creada para oferta '" + oferta.getTitulo() + "' con CitacionData embebida");
            } catch (Exception e) {
                System.out.println("⚠ Error creando postulacion de prueba: " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("⚠ Error creando oferta de prueba: " + e.getMessage());
        }

        // ===== CREAR HOJA DE VIDA CON ESTUDIOS Y EXPERIENCIAS EMBEBIDOS =====
        try {
            HojaVida hojaVida = new HojaVida();
            Aspirante aspiranteHoja = aspiranteRepo.findById(1L).orElse(aspirante);
            hojaVida.setAspirante(aspiranteHoja);
            hojaVida.setResumenProfesional("Profesional con experiencia en desarrollo de software con Java y tecnologías web modernas");
            hojaVida.setObjetivoProfesional("Desarrollador Senior en empresas de tecnología líderes");
            hojaVida.setContactoEmail("aspirante@example.com");
            hojaVida.setTelefono("3105555555");
            hojaVida.setIdiomas("Español (Nativo), Inglés (Intermedio)");
            hojaVida.setEsPublica(true);
            
            // Crear lista de estudios
            List<EstudioData> estudios = new java.util.ArrayList<>();
            EstudioData estudio1 = new EstudioData();
            estudio1.setTitulo("Ingeniería de Sistemas");
            estudio1.setInstitucion("Universidad Nacional de Colombia");
            estudio1.setNivelEducativo(EstudioData.NivelEducativo.UNIVERSITARIO);
            estudio1.setFechaInicio(LocalDate.of(2018, 1, 15));
            estudio1.setFechaFin(LocalDate.of(2022, 12, 10));
            estudio1.setEnCurso(false);
            estudio1.setModalidad(EstudioData.Modalidad.PRESENCIAL);
            estudio1.setDescripcion("Formación en ingeniería de software, bases de datos y desarrollo web");
            estudio1.setCertificadoUrl("https://example.com/certificados/ingenieria-sistemas.pdf");
            estudios.add(estudio1);
            
            EstudioData estudio2 = new EstudioData();
            estudio2.setTitulo("Especialización en Desarrollo Java");
            estudio2.setInstitucion("Instituto Tecnológico de Colombia");
            estudio2.setNivelEducativo(EstudioData.NivelEducativo.ESPECIALIZACION);
            estudio2.setFechaInicio(LocalDate.of(2023, 2, 1));
            estudio2.setFechaFin(null);
            estudio2.setEnCurso(true);
            estudio2.setModalidad(EstudioData.Modalidad.VIRTUAL);
            estudio2.setDescripcion("Especialización en Spring Boot, Microservicios y Arquitectura");
            estudio2.setCertificadoUrl(null);
            estudios.add(estudio2);
            
            hojaVida.setEstudios(estudios);
            
            // Crear lista de experiencias
            List<ExperienciaData> experiencias = new java.util.ArrayList<>();
            ExperienciaData exp1 = new ExperienciaData();
            exp1.setCargo("Desarrollador Java Junior");
            exp1.setEmpresa("Tech Solutions Colombia");
            exp1.setFechaInicio(LocalDate.of(2021, 6, 1));
            exp1.setFechaFin(LocalDate.of(2022, 12, 31));
            exp1.setMunicipio("Bogotá");
            exp1.setDescripcion("Desarrollo de aplicaciones backend con Spring Boot, implementación de APIs REST y bases de datos");
            exp1.setCertificadoUrl("https://example.com/certificados/tech-solutions.pdf");
            experiencias.add(exp1);
            
            ExperienciaData exp2 = new ExperienciaData();
            exp2.setCargo("Desarrollador Java Intermedio");
            exp2.setEmpresa("Innovate Systems");
            exp2.setFechaInicio(LocalDate.of(2023, 1, 15));
            exp2.setFechaFin(null);
            exp2.setMunicipio("Bogotá");
            exp2.setDescripcion("Desarrollo de microservicios, arquitectura de software, mentoring de juniors");
            exp2.setCertificadoUrl(null);
            experiencias.add(exp2);
            
            hojaVida.setExperiencias(experiencias);
            
            hojaVidaRepo.save(hojaVida);
            System.out.println("✓ HojaVida de prueba creada con " + estudios.size() + " estudios y " + experiencias.size() + " experiencias embebidas");
        } catch (Exception e) {
            System.out.println("⚠ Error creando hoja de vida de prueba: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void recreateEmpresas() {
        try {
            Municipio municipioBogota = municipioRepo.findAll().stream().filter(m -> m.getNombre() != null && m.getNombre().equals("Bogotá")).findFirst().orElse(null);

            // EMPRESA 1 - Bancolombia
            Empresa empresa1 = new Empresa();
            empresa1.setNombre("Bancolombia");
            empresa1.setDescripcion("Banco líder en Colombia");
            empresa1.setNit("860002964");
            empresa1.setEmailContacto("contacto@bancolombia.com.co");
            empresa1.setTelefonoContacto("6013078000");
            empresa1.setNumeroTrabajadores(5000);
            empresa1.setPuntuacion(4.5f);
            empresa1.setWebsite("www.bancolombia.com");
            empresa1.setLogoUrl("https://www.bancolombia.com/wcm/connect/www.bancolombia.com-1.0.0/hogar/imagenes/logo-bancolombia.png");
            empresa1.getRedesSociales().add("https://www.facebook.com/Bancolombia");
            empresa1.getRedesSociales().add("https://www.instagram.com/bancolombia");
            empresa1.getRedesSociales().add("https://www.twitter.com/Bancolombia");
            empresa1.getDirecciones().add("Carrera 48 # 26-85, Medellín, Colombia");
            empresa1.getDirecciones().add("Calle 72 # 7-83, Bogotá, Colombia");
            empresa1.setRazonSocial("Bancolombia S.A.");
            empresa1.setMunicipio(municipioBogota);
            empresa1.setIsActive(true);
            empresa1.getCategories().add(Empresa.Category.BANCA);
            empresa1.getCategories().add(Empresa.Category.FINANZAS);
            empresaRepo.save(empresa1);
            System.out.println("✓ Empresa 1 creada: Bancolombia");

            System.out.println("✓ Empresas recreadas: 1 empresa disponible");
        } catch (Exception e) {
            System.err.println("Error en recreateEmpresas: " + e.getMessage());
            e.printStackTrace();
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

    // createGenericUsersAndCompanies removed: no generic users/companies/offers created here
    // NO crear postulaciones genéricas aquí para evitar problemas con entidades desacopladas

    // recreateEducacionYExperiencia removed: estudios y experiencias no inicializados por DataInitializer

    // initializeOfertas removed: offers are not auto-initialized here anymore

    // Removed generic initialization methods: no generic aspirantes, reclutadores, empresas, ofertas, feedbacks,
    // notificaciones or habilidades are created by DataInitializer anymore. These responsibilities moved elsewhere.
}
