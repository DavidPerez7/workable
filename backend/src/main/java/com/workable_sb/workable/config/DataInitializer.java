package com.workable_sb.workable.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.workable_sb.workable.models.*;
import com.workable_sb.workable.models.Embeddable.CitacionData;
import com.workable_sb.workable.models.Embeddable.EstudioData;
import com.workable_sb.workable.models.Embeddable.ExperienciaData;
import com.workable_sb.workable.repository.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

    // INICIALIZACIÓN PRINCIPAL
    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("🚀 INICIANDO DATA INITIALIZER 🚀");
            
            if (municipioRepo.count() == 0) {
                inicializarMunicipios();
                System.out.println("✅ BASE DE DATOS INICIALIZADA CON MUNICIPIOS");
            }

            System.out.println("🔄 LIMPIANDO DATOS EXISTENTES...");
            limpiarDatosExistentes();

            System.out.println("🏢 CREANDO EMPRESAS...");
            recrearEmpresas();

            System.out.println("👥 CREANDO USUARIOS DE PRUEBA...");
            recrearUsuarios();

            System.out.println("� CREANDO OFERTAS DE PRUEBA...");
            crearOfertasPrueba();

            System.out.println("📝 CREANDO POSTULACIONES DE PRUEBA...");
            crearPostulacionesPrueba();

            System.out.println("�📄 CREANDO HOJAS DE VIDA...");
            crearHojasDeVidaConDatos();
            
            System.out.println("🎉 DATA INITIALIZER COMPLETADO 🎉");
        } catch (Exception e) {
            System.err.println("❌ ERROR CRÍTICO EN DATA INITIALIZER: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // LIMPIEZA DE DATOS
    private void limpiarDatosExistentes() {
        try {
            try { postulacionRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO POSTULACIONES: " + e.getMessage()); }
            try { ofertaRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO OFERTAS: " + e.getMessage()); }
            try { reclutadorRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO RECLUTADORES: " + e.getMessage()); }
            try { aspiranteRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO ASPIRANTES: " + e.getMessage()); }
            try { administradorRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO ADMINISTRADORES: " + e.getMessage()); }
            try { empresaRepo.deleteAll(); } catch (Exception e) { System.out.println("⚠️ ERROR ELIMINANDO EMPRESAS: " + e.getMessage()); }
            
            System.out.println("🧹 DATOS EXISTENTES LIMPIADOS");
        } catch (Exception e) {
            System.err.println("❌ ERROR LIMPIANDO DATOS: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // CREACIÓN DE USUARIOS
    private void recrearUsuarios() {
        Municipio municipio = municipioRepo.findAll().stream().findFirst().orElse(null);

        Aspirante aspirante = new Aspirante();
        aspirante.setNombre("Aspirante");
        aspirante.setApellido("Prueba");
        aspirante.setCorreo("aspirante@example.com");
        aspirante.setPassword(passwordEncoder.encode("pass123"));
        aspirante.setTelefono("3105555555");
        aspirante.setUrlFotoPerfil("https://media.gettyimages.com/id/1434359719/es/foto/sonriente-hombre-de-negocios.jpg?s=2048x2048&w=gi&k=20&c=KHSSxqqSCYICEMvpBlXreEUpzvQ8qIqVr77Ja4kf1pQ=");
        aspirante.setFechaNacimiento(LocalDate.of(2000, 6, 15));
        aspirante.setMunicipio(municipio);
        aspirante.setGenero(Aspirante.Genero.MASCULINO);
        aspirante.setUbicacion("Bogotá, Colombia");
        aspiranteRepo.save(aspirante);
        System.out.println("✅ USUARIO ASPIRANTE CREADO: aspirante@example.com / pass123");

        Administrador admin = new Administrador();
        admin.setNombre("Sistema");
        admin.setApellido("Administrador");
        admin.setCorreo("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        administradorRepo.save(admin);
        System.out.println("✅ USUARIO ADMINISTRADOR CREADO: admin@example.com / admin123");

        Reclutador reclutador = new Reclutador();
        reclutador.setNombre("Reclutador");
        reclutador.setApellido("Prueba");
        reclutador.setCorreo("reclutador@example.com");
        reclutador.setPassword(passwordEncoder.encode("pass123"));
        reclutador.setTelefono("3105555556");
        reclutador.setFechaNacimiento(LocalDate.of(1990, 9, 20));
        reclutador.setMunicipio(municipio);
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        reclutador.setEmpresa(empresa);
        reclutadorRepo.save(reclutador);
        System.out.println("✅ USUARIO RECLUTADOR CREADO: reclutador@example.com / pass123");
    }

    // CREACIÓN DE OFERTAS
    private void crearOfertasPrueba() {
        Municipio municipio = municipioRepo.findAll().stream().findFirst().orElse(null);
        Empresa empresa = empresaRepo.findById(1L).orElse(null);

        Oferta oferta = new Oferta();
        oferta.setTitulo("Desarrollador Java - Prueba");
        oferta.setDescripcion("Oferta de prueba generada por DataInitializer");
        oferta.setFechaLimite(LocalDate.now().plusDays(30));
        oferta.setSalario(3500000L);
        oferta.setNumeroVacantes(2);
        oferta.setNivelExperiencia(Oferta.NivelExperiencia.INTERMEDIO);
        oferta.setEstado(Oferta.EstadoOferta.ACTIVA);
        oferta.setRequisitos("Java, Spring Boot, SQL");
        oferta.setMunicipio(municipio);
        oferta.setModalidad(Oferta.Modalidad.REMOTO);
        oferta.setTipoContrato(Oferta.TipoContrato.TIEMPO_COMPLETO);
        oferta.setEmpresa(empresa);
        oferta.setPuntuacion(0.0f);
        oferta.setRequisitos("Java, Spring Boot, SQL");
        ofertaRepo.save(oferta);
        System.out.println("✅ OFERTA DE PRUEBA CREADA: " + oferta.getTitulo());
    }

    // CREACIÓN DE POSTULACIONES
    private void crearPostulacionesPrueba() {
        Oferta oferta = ofertaRepo.findAll().stream().findFirst().orElse(null);
        if (oferta == null) {
            System.out.println("⚠️ NO HAY OFERTAS DISPONIBLES PARA CREAR POSTULACIONES");
            return;
        }

        Aspirante aspirante = aspiranteRepo.findByCorreo("aspirante@example.com").orElse(null);
        if (aspirante == null) {
            System.out.println("⚠️ NO HAY ASPIRANTE DISPONIBLE PARA CREAR POSTULACIONES");
            return;
        }

        Postulacion postulacion = new Postulacion();
        postulacion.setOferta(oferta);
        postulacion.setAspirante(aspirante);
        postulacion.setEstado(Postulacion.Estado.ENTREVISTA_PROGRAMADA);
        
        CitacionData citacion = new CitacionData();
        citacion.setFecha(LocalDate.now().plusDays(5));
        citacion.setHora(LocalTime.of(14, 30));
        citacion.setLinkMeet("https://meet.google.com/abc-defg-hij");
        citacion.setEstadoCitacion(CitacionData.EstadoCitacion.PENDIENTE);
        postulacion.setCitacion(citacion);
        
        postulacionRepo.save(postulacion);
        System.out.println("✅ POSTULACIÓN CREADA PARA OFERTA '" + oferta.getTitulo() + "' CON CITACIONDATA EMBEBIDA");
    }

    // CREACIÓN DE HOJAS DE VIDA
    private void crearHojasDeVidaConDatos() {
        Aspirante aspirante = aspiranteRepo.findByCorreo("aspirante@example.com")
            .orElseThrow(() -> new RuntimeException("Aspirante no encontrado para crear HojaDeVida"));
        
        HojaVida hojaVida = new HojaVida();
        hojaVida.setAspirante(aspirante);
        hojaVida.setResumenProfesional("Profesional con experiencia en desarrollo de software con Java y tecnologías web modernas");
        hojaVida.setCorreoElectronico("aspirante@example.com");
        hojaVida.setTelefono("3105555555");
        hojaVida.setRedSocial("https://linkedin.com/in/aspirante");
        
        List<EstudioData> estudios = new java.util.ArrayList<>();
        EstudioData estudio1 = new EstudioData();
        estudio1.setTitulo("Ingeniería de Sistemas");
        estudio1.setInstitucion("Universidad Nacional de Colombia");
        estudio1.setNivelEducativo(EstudioData.NivelEducativo.UNIVERSITARIO);
        estudio1.setFechaInicio(LocalDate.of(2018, 1, 15));
        estudio1.setFechaFin(LocalDate.of(2022, 12, 10));
        estudio1.setCertificadoUrl("https://example.com/certificados/ingenieria-sistemas.pdf");
        estudios.add(estudio1);
        
        hojaVida.setEstudios(estudios);
        
        List<ExperienciaData> experiencias = new java.util.ArrayList<>();
        ExperienciaData exp1 = new ExperienciaData();
        exp1.setCargo("Desarrollador Java Junior");
        exp1.setEmpresa("Tech Solutions Colombia");
        exp1.setFechaInicio(LocalDate.of(2021, 6, 1));
        exp1.setFechaFin(LocalDate.of(2022, 12, 31));
        exp1.setCertificadoUrl("https://example.com/certificados/tech-solutions.pdf");
        experiencias.add(exp1);
        
        hojaVida.setExperiencias(experiencias);
        
        hojaVidaRepo.save(hojaVida);
        System.out.println("✅ HOJAVIDA DE PRUEBA CREADA CON " + estudios.size() + " ESTUDIOS Y " + experiencias.size() + " EXPERIENCIAS EMBEBIDAS");
    }

    // CREACIÓN DE EMPRESAS
    private void recrearEmpresas() {
        Municipio municipioBogota = municipioRepo.findAll().stream().filter(m -> m.getNombre() != null && m.getNombre().equals("Bogotá")).findFirst().orElse(null);

        Empresa empresa1 = new Empresa();
        empresa1.setNombre("Bancolombia");
        empresa1.setDescripcion("Banco líder en Colombia");
        empresa1.setNit("860002964");
        empresa1.setEmail("contacto@bancolombia.com.co");
        empresa1.setTelefono("6013078000");
        empresa1.setNumeroTrabajadores(5000);
        empresa1.setPuntuacion(4.5f);
        empresa1.setLogoUrl("https://www.bancolombia.com/wcm/connect/www.bancolombia.com-1.0.0/hogar/imagenes/logo-bancolombia.png");
        empresa1.setMunicipio(municipioBogota);
        empresa1.getCategories().add(Empresa.Category.FINANZAS);
        empresa1.getCategories().add(Empresa.Category.TECNOLOGIA);
        empresaRepo.save(empresa1);
        System.out.println("✅ EMPRESA CREADA: BANCOLOMBIA");

        System.out.println("✅ EMPRESAS RECREADAS: 1 EMPRESA DISPONIBLE");
    }

    // INICIALIZACIÓN DE MUNICIPIOS
    private void inicializarMunicipios() {
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
}
