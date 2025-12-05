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

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.TipoHabilidad;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para UsuarioHabilidadService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioHabilidadService Tests")
class UsuarioHabilidadServiceTest {

    @Mock
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private HabilidadRepo habilidadRepo;

    @InjectMocks
    private UsuarioHabilidadService usuarioHabilidadService;

    private Usuario usuario;
    private Habilidad habilidad;
    private UsuarioHabilidad usuarioHabilidad;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setCorreo("juan@test.com");
        usuario.setRol(Rol.ASPIRANTE);
        usuario.setIsActive(true);

        habilidad = new Habilidad();
        habilidad.setId(1L);
        habilidad.setNombre("Java");
        habilidad.setTipo(TipoHabilidad.TECNICA);
        habilidad.setIsActive(true);

        usuarioHabilidad = new UsuarioHabilidad();
        usuarioHabilidad.setId(1L);
        usuarioHabilidad.setUsuario(usuario);
        usuarioHabilidad.setHabilidad(habilidad);
        usuarioHabilidad.setNivel(NivelDominio.AVANZADO);
        usuarioHabilidad.setFechaAdquisicion(LocalDate.of(2020, 1, 1));
        usuarioHabilidad.setIsActive(true);
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe agregar habilidad exitosamente")
        void debeAgregarHabilidad() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(habilidadRepo.findById(1L)).thenReturn(Optional.of(habilidad));
            when(usuarioHabilidadRepo.existsByUsuarioIdAndHabilidadId(1L, 1L)).thenReturn(false);
            when(usuarioHabilidadRepo.save(any(UsuarioHabilidad.class))).thenReturn(usuarioHabilidad);

            UsuarioHabilidad resultado = usuarioHabilidadService.agregarHabilidad(
                1L, 1L, NivelDominio.AVANZADO, 1L
            );

            assertNotNull(resultado);
            assertEquals("Java", resultado.getHabilidad().getNombre());
            assertEquals(NivelDominio.AVANZADO, resultado.getNivel());
            verify(usuarioHabilidadRepo, times(1)).save(any(UsuarioHabilidad.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si habilidad ya existe para usuario")
        void debeLanzarExcepcionSiHabilidadYaExiste() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(habilidadRepo.findById(1L)).thenReturn(Optional.of(habilidad));
            when(usuarioHabilidadRepo.existsByUsuarioIdAndHabilidadId(1L, 1L)).thenReturn(true);

            assertThrows(IllegalArgumentException.class, () -> {
                usuarioHabilidadService.agregarHabilidad(1L, 1L, NivelDominio.AVANZADO, 1L);
            });
        }

        @Test
        @DisplayName("No debe permitir agregar habilidad a otro usuario")
        void noDebePermitirAgregarHabilidadAOtroUsuario() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(RuntimeException.class, () -> {
                usuarioHabilidadService.agregarHabilidad(1L, 1L, NivelDominio.AVANZADO, 999L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener habilidad por ID")
        void debeObtenerHabilidadPorId() {
            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));

            UsuarioHabilidad resultado = usuarioHabilidadService.obtenerPorId(1L);

            assertNotNull(resultado);
            assertEquals("Java", resultado.getHabilidad().getNombre());
        }

        @Test
        @DisplayName("Debe listar habilidades por usuario")
        void debeListarHabilidadesPorUsuario() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(usuarioHabilidadRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList(usuarioHabilidad));

            List<UsuarioHabilidad> resultado = usuarioHabilidadService.listarPorUsuario(1L);

            assertEquals(1, resultado.size());
            assertEquals("Java", resultado.get(0).getHabilidad().getNombre());
        }

        @Test
        @DisplayName("Debe listar habilidades por nivel")
        void debeListarHabilidadesPorNivel() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(usuarioHabilidadRepo.findByUsuarioIdAndNivel(1L, NivelDominio.AVANZADO))
                    .thenReturn(Arrays.asList(usuarioHabilidad));

            List<UsuarioHabilidad> resultado = usuarioHabilidadService.listarPorUsuarioYNivel(
                1L, NivelDominio.AVANZADO
            );

            assertEquals(1, resultado.size());
            assertEquals(NivelDominio.AVANZADO, resultado.get(0).getNivel());
        }
    }

    @Nested
    @DisplayName("Tests de actualización")
    class UpdateTests {

        @Test
        @DisplayName("Debe actualizar nivel de habilidad")
        void debeActualizarNivel() {
            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(usuarioHabilidadRepo.save(any(UsuarioHabilidad.class))).thenReturn(usuarioHabilidad);

            UsuarioHabilidad resultado = usuarioHabilidadService.actualizarNivel(
                1L, NivelDominio.EXPERTO, 1L
            );

            assertNotNull(resultado);
            verify(usuarioHabilidadRepo, times(1)).save(any(UsuarioHabilidad.class));
        }

        @Test
        @DisplayName("Debe actualizar fecha de adquisición")
        void debeActualizarFechaAdquisicion() {
            LocalDate nuevaFecha = LocalDate.of(2019, 6, 15);
            
            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(usuarioHabilidadRepo.save(any(UsuarioHabilidad.class))).thenReturn(usuarioHabilidad);

            UsuarioHabilidad resultado = usuarioHabilidadService.actualizarFechaAdquisicion(
                1L, nuevaFecha, 1L
            );

            assertNotNull(resultado);
            verify(usuarioHabilidadRepo, times(1)).save(any(UsuarioHabilidad.class));
        }

        @Test
        @DisplayName("No debe permitir fecha futura")
        void noDebePermitirFechaFutura() {
            LocalDate fechaFutura = LocalDate.now().plusYears(1);
            
            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalArgumentException.class, () -> {
                usuarioHabilidadService.actualizarFechaAdquisicion(1L, fechaFutura, 1L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar habilidad como dueño")
        void debeEliminarHabilidadComoDueno() {
            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            doNothing().when(usuarioHabilidadRepo).delete(any(UsuarioHabilidad.class));

            assertDoesNotThrow(() -> {
                usuarioHabilidadService.eliminarHabilidad(1L, 1L);
            });

            verify(usuarioHabilidadRepo, times(1)).delete(any(UsuarioHabilidad.class));
        }

        @Test
        @DisplayName("Debe permitir eliminar como ADMIN")
        void debePermitirEliminarComoAdmin() {
            Usuario admin = new Usuario();
            admin.setId(99L);
            admin.setRol(Rol.ADMIN);

            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(99L)).thenReturn(Optional.of(admin));
            doNothing().when(usuarioHabilidadRepo).delete(any(UsuarioHabilidad.class));

            assertDoesNotThrow(() -> {
                usuarioHabilidadService.eliminarHabilidad(1L, 99L);
            });
        }

        @Test
        @DisplayName("No debe permitir eliminar habilidad ajena")
        void noDebePermitirEliminarHabilidadAjena() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(usuarioHabilidadRepo.findById(1L)).thenReturn(Optional.of(usuarioHabilidad));
            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(RuntimeException.class, () -> {
                usuarioHabilidadService.eliminarHabilidad(1L, 999L);
            });
        }
    }
}
