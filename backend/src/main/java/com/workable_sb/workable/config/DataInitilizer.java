package com.workable_sb.workable.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.EmpresaCategoriaRepo;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.repository.UsuarioRepo;
import java.time.LocalDate;

@Component
public class DataInitilizer implements CommandLineRunner {

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private EmpresaCategoriaRepo empresaCategoriaRepo;

    @Autowired
    private HabilidadRepo habilidadRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeMunicipios();
        initializeEmpresaCategorias();
        initializeHabilidades();
        initializeAdminUser();
    }

    private void initializeMunicipios() {
        if (municipioRepo.count() == 0) {
            System.out.println("📍 Inicializando 10 Municipios...");

            municipioRepo.save(new Municipio(1L, "Bogotá D.C", Municipio.Departamento.BOGOTA_DC));
            municipioRepo.save(new Municipio(2L, "Medellín", Municipio.Departamento.ANTIOQUIA));
            municipioRepo.save(new Municipio(3L, "Bello", Municipio.Departamento.ANTIOQUIA));
            municipioRepo.save(new Municipio(4L, "Itagüí", Municipio.Departamento.ANTIOQUIA));
            municipioRepo.save(new Municipio(5L, "Envigado", Municipio.Departamento.ANTIOQUIA));
            municipioRepo.save(new Municipio(6L, "Cali", Municipio.Departamento.VALLE_DEL_CAUCA));
            municipioRepo.save(new Municipio(7L, "Barranquilla", Municipio.Departamento.ATLANTICO));
            municipioRepo.save(new Municipio(8L, "Bucaramanga", Municipio.Departamento.SANTANDER));
            municipioRepo.save(new Municipio(9L, "Cartagena", Municipio.Departamento.BOLIVAR));
            municipioRepo.save(new Municipio(10L, "Pereira", Municipio.Departamento.RISARALDA));

            System.out.println("✅ 10 Municipios creados");
        }
    }

    private void initializeEmpresaCategorias() {
        if (empresaCategoriaRepo.count() == 0) {
            System.out.println("🏢 Inicializando 10 Categorías de Empresa...");

            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Tecnología", "Empresas del sector tecnológico", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Finanzas", "Empresas del sector financiero", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Salud", "Empresas del sector salud", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Educación", "Empresas del sector educativo", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Logística", "Empresas del sector logístico", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Retail", "Empresas del sector comercio", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Manufactura", "Empresas del sector manufactura", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Consultoría", "Empresas de consultoría empresarial", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Telecomunicaciones", "Empresas de telecomunicaciones", true));
            empresaCategoriaRepo.save(new EmpresaCategoria(null, "Energía", "Empresas del sector energético", true));

            System.out.println("✅ 10 Categorías de Empresa creadas");
        }
    }

    private void initializeHabilidades() {
        if (habilidadRepo.count() == 0) {
            System.out.println("🎯 Inicializando 10 Habilidades...");

            // Técnicas
            habilidadRepo.save(new Habilidad(null, "Java", Habilidad.TipoHabilidad.TECNICA, true));
            habilidadRepo.save(new Habilidad(null, "Python", Habilidad.TipoHabilidad.TECNICA, true));
            habilidadRepo.save(new Habilidad(null, "JavaScript", Habilidad.TipoHabilidad.TECNICA, true));
            habilidadRepo.save(new Habilidad(null, "React", Habilidad.TipoHabilidad.TECNICA, true));
            habilidadRepo.save(new Habilidad(null, "SQL", Habilidad.TipoHabilidad.TECNICA, true));

            // Idiomas
            habilidadRepo.save(new Habilidad(null, "Inglés", Habilidad.TipoHabilidad.IDIOMA, true));
            habilidadRepo.save(new Habilidad(null, "Español", Habilidad.TipoHabilidad.IDIOMA, true));

            // Blandas
            habilidadRepo.save(new Habilidad(null, "Liderazgo", Habilidad.TipoHabilidad.BLANDA, true));
            habilidadRepo.save(new Habilidad(null, "Comunicación", Habilidad.TipoHabilidad.BLANDA, true));
            habilidadRepo.save(new Habilidad(null, "Trabajo en Equipo", Habilidad.TipoHabilidad.BLANDA, true));

            System.out.println("✅ 10 Habilidades creadas");
        }
    }

    private void initializeAdminUser() {
        if (usuarioRepo.findByRol(Usuario.Rol.ADMIN).isEmpty()) {
            System.out.println("👤 Inicializando Usuario Administrador...");

            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("System");
            admin.setCorreo("admin@example.com");
            admin.setTelefono("3001234567");
            admin.setFechaNacimiento(LocalDate.of(1990, 1, 1));
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            admin.setIsActive(true);
            admin.setMunicipio(municipioRepo.findById(1L).orElse(null));

            usuarioRepo.save(admin);
            System.out.println("✅ Usuario Administrador creado");
            System.out.println("   📧 Email: admin@example.com");
            System.out.println("   🔐 Contraseña: admin123");
        }
    }
}
