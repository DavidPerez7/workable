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
    // Estudio/Experiencia repos no gestionados por DataInitializer

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
            // Usar try-catch individual para cada eliminación para evitar que un error bloquee todo
            try { feedbackRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando feedback: " + e.getMessage()); }
            try { notificacionRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando notificaciones: " + e.getMessage()); }
            try { postulacionRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando postulaciones: " + e.getMessage()); }
            try { ofertaRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando ofertas: " + e.getMessage()); }
            // Estudios y experiencias gestionadas fuera del DataInitializer - no borrar aquí
            try { habilidadRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠ Error eliminando habilidades: " + e.getMessage()); }
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
        Municipio municipio = municipioRepo.findByNombre("Bogotá").orElse(municipioRepo.findAll().stream().findFirst().orElse(null));

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
    }

    private void recreateEmpresas() {
        try {
            Municipio municipioBogota = municipioRepo.findByNombre("Bogotá").orElse(null);

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
