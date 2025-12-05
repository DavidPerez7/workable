package com.workable_sb.workable.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para UsuarioService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioService Tests")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private MunicipioRepo municipioRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private Municipio municipio;

    @BeforeEach
    void setUp() {
        municipio = new Municipio();
        municipio.setId(1L);
        municipio.setNombre("Bogotá");
        municipio.setDepartamento(Municipio.Departamento.BOGOTA_DC);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setCorreo("juan@test.com");
        usuario.setPassword("password123");
        usuario.setRol(Rol.ASPIRANTE);
        usuario.setFechaNacimiento(LocalDate.of(1990, 5, 15));
        usuario.setIsActive(true);
        usuario.setMunicipio(municipio);
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener todos los usuarios")
        void debeObtenerTodosLosUsuarios() {
            Usuario usuario2 = new Usuario();
            usuario2.setId(2L);
            usuario2.setNombre("María");
            usuario2.setCorreo("maria@test.com");

            when(usuarioRepo.findAll()).thenReturn(Arrays.asList(usuario, usuario2));

            List<Usuario> resultado = usuarioService.getAll();

            assertEquals(2, resultado.size());
            verify(usuarioRepo, times(1)).findAll();
        }

        @Test
        @DisplayName("Debe obtener usuario por ID")
        void debeObtenerUsuarioPorId() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            Optional<Usuario> resultado = usuarioService.getById(1L);

            assertTrue(resultado.isPresent());
            assertEquals("Juan", resultado.get().getNombre());
            verify(usuarioRepo, times(1)).findById(1L);
        }

        @Test
        @DisplayName("Debe obtener usuario por correo")
        void debeObtenerUsuarioPorCorreo() {
            when(usuarioRepo.findByCorreo("juan@test.com")).thenReturn(Optional.of(usuario));

            Optional<Usuario> resultado = usuarioService.getByCorreo("juan@test.com");

            assertTrue(resultado.isPresent());
            assertEquals("juan@test.com", resultado.get().getCorreo());
        }

        @Test
        @DisplayName("Debe obtener usuarios por rol")
        void debeObtenerUsuariosPorRol() {
            when(usuarioRepo.findByRol(Rol.ASPIRANTE)).thenReturn(Arrays.asList(usuario));

            List<Usuario> resultado = usuarioService.getByRol(Rol.ASPIRANTE);

            assertEquals(1, resultado.size());
            assertEquals(Rol.ASPIRANTE, resultado.get(0).getRol());
        }

        @Test
        @DisplayName("Debe obtener usuarios activos")
        void debeObtenerUsuariosActivos() {
            when(usuarioRepo.findByIsActive(true)).thenReturn(Arrays.asList(usuario));

            List<Usuario> resultado = usuarioService.getByIsActive(true);

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getIsActive());
        }
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe crear usuario público exitosamente")
        void debeCrearUsuarioPublico() {
            when(usuarioRepo.findByCorreo(anyString())).thenReturn(Optional.empty());
            when(municipioRepo.findById(1L)).thenReturn(Optional.of(municipio));
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(usuarioRepo.save(any(Usuario.class))).thenReturn(usuario);

            Usuario resultado = usuarioService.createPublic(usuario);

            assertNotNull(resultado);
            assertEquals("Juan", resultado.getNombre());
            verify(passwordEncoder, times(1)).encode(anyString());
            verify(usuarioRepo, times(1)).save(any(Usuario.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si correo ya existe")
        void debeLanzarExcepcionSiCorreoExiste() {
            when(usuarioRepo.findByCorreo("juan@test.com")).thenReturn(Optional.of(usuario));

            assertThrows(RuntimeException.class, () -> {
                usuarioService.createPublic(usuario);
            });
        }

        @Test
        @DisplayName("No debe permitir crear usuario ADMIN desde registro público")
        void noDebePermitirCrearAdmin() {
            usuario.setRol(Rol.ADMIN);
            when(usuarioRepo.findByCorreo(anyString())).thenReturn(Optional.empty());

            assertThrows(IllegalStateException.class, () -> {
                usuarioService.createPublic(usuario);
            });
        }
    }

    @Nested
    @DisplayName("Tests de actualización")
    class UpdateTests {

        @Test
        @DisplayName("Debe actualizar usuario público")
        void debeActualizarUsuarioPublico() {
            Usuario actualizacion = new Usuario();
            actualizacion.setNombre("Juan Carlos");
            actualizacion.setApellido("Pérez");
            actualizacion.setCorreo("juan@test.com");
            actualizacion.setTelefono("3001234567");
            actualizacion.setFechaNacimiento(LocalDate.of(1990, 5, 15));

            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(usuarioRepo.save(any(Usuario.class))).thenReturn(usuario);

            Usuario resultado = usuarioService.updatePublic(1L, actualizacion, 1L);

            assertEquals("Juan Carlos", resultado.getNombre());
            verify(usuarioRepo, times(1)).save(any(Usuario.class));
        }

        @Test
        @DisplayName("No debe permitir actualizar usuario ajeno")
        void noDebePermitirActualizarUsuarioAjeno() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalStateException.class, () -> {
                usuarioService.updatePublic(1L, usuario, 999L);
            });
        }

        @Test
        @DisplayName("No debe permitir modificar usuario ADMIN desde público")
        void noDebePermitirModificarAdmin() {
            usuario.setRol(Rol.ADMIN);
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalStateException.class, () -> {
                usuarioService.updatePublic(1L, usuario, 1L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar usuario propio")
        void debeEliminarUsuarioPropio() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            doNothing().when(usuarioRepo).delete(any(Usuario.class));

            assertDoesNotThrow(() -> {
                usuarioService.deletePublic(1L, 1L);
            });

            verify(usuarioRepo, times(1)).delete(any(Usuario.class));
        }

        @Test
        @DisplayName("No debe permitir eliminar usuario ajeno")
        void noDebePermitirEliminarUsuarioAjeno() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalStateException.class, () -> {
                usuarioService.deletePublic(1L, 999L);
            });
        }
    }
}
