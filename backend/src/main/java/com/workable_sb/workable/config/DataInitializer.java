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
    @Autowired private UsuarioRepo usuarioRepo;
    @Autowired private EmpresaRepository empresaRepo;
    @Autowired private EstudioRepo estudioRepo;
    @Autowired private ExperienciaRepo experienciaRepo;
    @Autowired private OfertaRepo ofertaRepo;
    @Autowired private PostulacionRepo postulacionRepo;
    @Autowired private DireccionRepo direccionRepo;
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
            initializeDirecciones();
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
        Usuario admin = usuarioRepo.findByCorreo("admin@example.com").orElse(null);

        if (admin == null) {
            Usuario nuevo = new Usuario();
            nuevo.setNombre("Admin");
            nuevo.setApellido("Sistema");
            nuevo.setCorreo("admin@example.com");
            nuevo.setPassword(passwordEncoder.encode("admin123"));
            nuevo.setTelefono("3001111111");
            nuevo.setFechaNacimiento(LocalDate.of(1990, 1, 1));
            nuevo.setRol(Usuario.Rol.ADMIN);
            nuevo.setMunicipio(municipio);
            nuevo.setIsActive(true);
            usuarioRepo.save(nuevo);
            System.out.println("Usuario ADMIN creado: admin@example.com / admin123");
        } else {
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            admin.setIsActive(true);
            admin.setMunicipio(municipio);
            usuarioRepo.save(admin);
            System.out.println("Usuario ADMIN verificado/actualizado: admin@example.com / admin123");
        }
    }

    private void initializeMunicipios() {
        for (int i = 1; i <= 10; i++) {
            Municipio municipio = new Municipio();
            municipio.setId((long) i);
            municipio.setNombre("Municipio " + i);
            municipio.setDepartamento(Municipio.Departamento.values()[i % Municipio.Departamento.values().length]);
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
        // 4 ASPIRANTES
        for (int i = 1; i <= 4; i++) {
            Usuario aspirante = new Usuario();
            aspirante.setNombre("Aspirante " + i);
            aspirante.setApellido("Apellido " + i);
            aspirante.setCorreo("aspirante" + i + "@example.com");
            aspirante.setPassword(passwordEncoder.encode("pass123"));
            aspirante.setTelefono("300111111" + i);
            aspirante.setFechaNacimiento(LocalDate.of(1995 + i, 1, 1));
            aspirante.setRol(Usuario.Rol.ASPIRANTE);
            aspirante.setMunicipio(municipioRepo.findById((long) (1 + i % 10)).orElse(null));
            aspirante.setIsActive(true);
            usuarioRepo.save(aspirante);
        }

        // 5 RECLUTADORES
        for (int i = 1; i <= 5; i++) {
            Usuario reclutador = new Usuario();
            reclutador.setNombre("Reclutador " + i);
            reclutador.setApellido("Apellido " + i);
            reclutador.setCorreo("reclutador" + i + "@example.com");
            reclutador.setPassword(passwordEncoder.encode("pass123"));
            reclutador.setTelefono("300222222" + i);
            reclutador.setFechaNacimiento(LocalDate.of(1988 + i, 1, 1));
            reclutador.setRol(Usuario.Rol.RECLUTADOR);
            reclutador.setMunicipio(municipioRepo.findById((long) (1 + i % 10)).orElse(null));
            reclutador.setIsActive(true);
            usuarioRepo.save(reclutador);
        }
    }

    private void initializeEmpresas() {
        for (int i = 1; i <= 10; i++) {
            Empresa empresa = new Empresa();
            empresa.setNombre("Empresa " + i);
            empresa.setNit("1234567890" + i);
            empresa.setDescripcion("Descripción de la empresa " + i);
            empresa.setNumeroTrabajadores(10 + i * 5);
            empresa.setEmailContacto("contacto" + i + "@empresa.com");
            empresa.setTelefonoContacto("300555555" + i);
            empresa.setIsActive(true);
            empresaRepo.save(empresa);
        }
    }

    private void initializeDirecciones() {
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        if (empresa != null) {
            for (int i = 1; i <= 10; i++) {
                Direccion direccion = new Direccion();
                direccion.setNombre("Oficina " + i);
                direccion.setDireccion("Calle " + i + " #" + (i * 10) + "-" + (i * 5));
                direccion.setTelefono("300666666" + i);
                direccion.setCorreo("oficina" + i + "@empresa.com");
                direccion.setIsPrincipal(i == 1);
                direccion.setEmpresa(empresa);
                direccionRepo.save(direccion);
            }
        }
    }

    private void initializeEstudios() {
        Usuario aspirante = usuarioRepo.findByCorreo("aspirante1@example.com").orElse(null);
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
                estudio.setUsuario(aspirante);
                estudioRepo.save(estudio);
            }
        }
    }

    private void initializeExperiencias() {
        Usuario aspirante = usuarioRepo.findByCorreo("aspirante1@example.com").orElse(null);
        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                Experiencia experiencia = new Experiencia();
                experiencia.setCargo("Cargo " + i);
                experiencia.setEmpresa("Empresa Trabajo " + i);
                experiencia.setDescripcion("Descripción de la experiencia " + i);
                experiencia.setFechaInicio(LocalDate.of(2015 + i, 1, 1));
                experiencia.setFechaFin(LocalDate.of(2020 + i, 12, 31));
                experiencia.setUsuario(aspirante);
                experienciaRepo.save(experiencia);
            }
        }
    }

    private void initializeOfertas() {
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        Usuario reclutador = usuarioRepo.findByCorreo("reclutador1@example.com").orElse(null);
        
        if (empresa != null && reclutador != null) {
            for (int i = 1; i <= 10; i++) {
                Oferta oferta = new Oferta();
                oferta.setTitulo("Oferta " + i);
                oferta.setDescripcion("Descripción detallada de la oferta " + i);
                oferta.setFechaPublicacion(LocalDate.now().minusDays(i));
                oferta.setFechaLimite(LocalDate.now().plusDays(30 - i));
                oferta.setSalario(2000000L + (i * 100000));
                oferta.setNumeroVacantes(1 + i % 5);
                oferta.setNivelExperiencia(Oferta.NivelExperiencia.values()[i % Oferta.NivelExperiencia.values().length]);
                oferta.setModalidad(Oferta.Modalidad.values()[i % Oferta.Modalidad.values().length]);
                oferta.setTipoContrato(Oferta.TipoContrato.values()[i % Oferta.TipoContrato.values().length]);
                oferta.setEmpresa(empresa);
                oferta.setReclutador(reclutador);
                ofertaRepo.save(oferta);
            }
        }
    }

    private void initializePostulaciones() {
        if (true) {
            for (int i = 1; i <= 10; i++) {
                Usuario aspirante = usuarioRepo.findByCorreo("aspirante" + (1 + i % 4) + "@example.com").orElse(null);
                Oferta oferta = ofertaRepo.findById((long) (1 + i % 10)).orElse(null);
                
                if (aspirante != null && oferta != null) {
                    Postulacion postulacion = new Postulacion();
                    postulacion.setEstado(Postulacion.Estado.values()[i % Postulacion.Estado.values().length]);
                    postulacion.setUsuario(aspirante);
                    postulacion.setOferta(oferta);
                    postulacionRepo.save(postulacion);
                }
            }
        }
    }

    private void initializeUsuarioHabilidades() {
        Usuario aspirante = usuarioRepo.findByCorreo("aspirante1@example.com").orElse(null);
        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                UsuarioHabilidad usuarioHabilidad = new UsuarioHabilidad();
                Habilidad habilidad = habilidadRepo.findById((long) i).orElse(null);
                if (habilidad != null) {
                    usuarioHabilidad.setUsuario(aspirante);
                    usuarioHabilidad.setHabilidad(habilidad);
                    usuarioHabilidad.setNivel(UsuarioHabilidad.NivelDominio.values()[i % UsuarioHabilidad.NivelDominio.values().length]);
                    usuarioHabilidadRepo.save(usuarioHabilidad);
                }
            }
        }
    }

    private void initializeFeedbacks() {
        Usuario aspirante = usuarioRepo.findByCorreo("aspirante1@example.com").orElse(null);
        Empresa empresa = empresaRepo.findById(1L).orElse(null);
        
        if (aspirante != null && empresa != null) {
            for (int i = 1; i <= 10; i++) {
                Feedback feedback = new Feedback();
                feedback.setTitulo("Feedback " + i);
                feedback.setDescripcion("Descripción del feedback " + i);
                feedback.setPuntuacion((float) (i % 5 + 1));
                feedback.setUsuario(aspirante);
                feedback.setEmpresa(empresa);
                feedbackRepo.save(feedback);
            }
        }
    }

    private void initializeNotificaciones() {
        Usuario aspirante = usuarioRepo.findByCorreo("aspirante1@example.com").orElse(null);
        
        if (aspirante != null) {
            for (int i = 1; i <= 10; i++) {
                Notificacion notificacion = new Notificacion();
                notificacion.setTipo(Notificacion.Tipo.values()[i % Notificacion.Tipo.values().length]);
                notificacion.setTitulo("Notificación " + i);
                notificacion.setMensaje("Descripción de la notificación " + i);
                notificacion.setFechaCreacion(LocalDate.now().minusDays(i));
                notificacion.setUsuario(aspirante);
                notificacionRepo.save(notificacion);
            }
        }
    }
}
