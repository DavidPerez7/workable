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

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Estudio.NivelEducativo;
import com.workable_sb.workable.models.Estudio.EstadoEstudio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para EstudioService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("EstudioService Tests")
class EstudioServiceTest {

    @Mock
    private EstudioRepo estudioRepo;

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private MunicipioRepo municipioRepo;

    @InjectMocks
    private EstudioService estudioService;

    private Usuario usuario;
    private Estudio estudio;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setCorreo("juan@test.com");
        usuario.setRol(Rol.ASPIRANTE);
        usuario.setIsActive(true);

        estudio = new Estudio();
        estudio.setId(1L);
        estudio.setTitulo("Ingeniería de Sistemas");
        estudio.setInstitucion("Universidad Nacional");
        estudio.setFechaInicio(LocalDate.of(2015, 1, 15));
        estudio.setFechaFin(LocalDate.of(2020, 12, 15));
        estudio.setEnCurso(false);
        estudio.setNivelEducativo(NivelEducativo.UNIVERSITARIO);
        estudio.setEstadoEstudio(EstadoEstudio.ACTIVO);
        estudio.setUsuario(usuario);
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe crear estudio exitosamente")
        void debeCrearEstudio() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(estudioRepo.save(any(Estudio.class))).thenReturn(estudio);

            Estudio resultado = estudioService.crearEstudio(estudio, 1L);

            assertNotNull(resultado);
            assertEquals("Ingeniería de Sistemas", resultado.getTitulo());
            verify(estudioRepo, times(1)).save(any(Estudio.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si título es nulo")
        void debeLanzarExcepcionSiTituloNulo() {
            estudio.setTitulo(null);

            assertThrows(IllegalArgumentException.class, () -> {
                estudioService.crearEstudio(estudio, 1L);
            });
        }

        @Test
        @DisplayName("Debe lanzar excepción si institución es nula")
        void debeLanzarExcepcionSiInstitucionNula() {
            estudio.setInstitucion(null);

            assertThrows(IllegalArgumentException.class, () -> {
                estudioService.crearEstudio(estudio, 1L);
            });
        }

        @Test
        @DisplayName("Debe lanzar excepción si usuario no existe")
        void debeLanzarExcepcionSiUsuarioNoExiste() {
            when(usuarioRepo.findById(999L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> {
                estudioService.crearEstudio(estudio, 999L);
            });
        }

        @Test
        @DisplayName("Debe requerir fecha fin si no está en curso")
        void debeRequerirFechaFinSiNoEnCurso() {
            estudio.setEnCurso(false);
            estudio.setFechaFin(null);

            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalArgumentException.class, () -> {
                estudioService.crearEstudio(estudio, 1L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener estudio por ID")
        void debeObtenerEstudioPorId() {
            when(estudioRepo.findById(1L)).thenReturn(Optional.of(estudio));

            Estudio resultado = estudioService.obtenerPorId(1L);

            assertNotNull(resultado);
            assertEquals("Ingeniería de Sistemas", resultado.getTitulo());
        }

        @Test
        @DisplayName("Debe lanzar excepción si estudio no existe")
        void debeLanzarExcepcionSiEstudioNoExiste() {
            when(estudioRepo.findById(999L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> {
                estudioService.obtenerPorId(999L);
            });
        }

        @Test
        @DisplayName("Debe obtener estudios por usuario")
        void debeObtenerEstudiosPorUsuario() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(estudioRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList(estudio));

            List<Estudio> resultado = estudioService.obtenerEstudiosPorUsuario(1L);

            assertEquals(1, resultado.size());
            assertEquals("Ingeniería de Sistemas", resultado.get(0).getTitulo());
        }

        @Test
        @DisplayName("Debe obtener estudios en curso")
        void debeObtenerEstudiosEnCurso() {
            estudio.setEnCurso(true);
            estudio.setFechaFin(null);
            
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(estudioRepo.findByUsuarioIdAndEnCurso(1L, true)).thenReturn(Arrays.asList(estudio));

            List<Estudio> resultado = estudioService.obtenerEstudiosEnCurso(1L);

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getEnCurso());
        }

        @Test
        @DisplayName("Debe obtener estudios por nivel educativo")
        void debeObtenerEstudiosPorNivel() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(estudioRepo.findByUsuarioIdAndNivelEducativo(1L, NivelEducativo.UNIVERSITARIO))
                    .thenReturn(Arrays.asList(estudio));

            List<Estudio> resultado = estudioService.obtenerEstudiosPorNivel(1L, NivelEducativo.UNIVERSITARIO);

            assertEquals(1, resultado.size());
            assertEquals(NivelEducativo.UNIVERSITARIO, resultado.get(0).getNivelEducativo());
        }
    }

    @Nested
    @DisplayName("Tests de actualización")
    class UpdateTests {

        @Test
        @DisplayName("Debe actualizar estudio como dueño")
        void debeActualizarEstudioComoDueno() {
            Estudio actualizacion = new Estudio();
            actualizacion.setTitulo("Ingeniería de Software");
            actualizacion.setInstitucion("Universidad Nacional");
            actualizacion.setFechaInicio(LocalDate.of(2015, 1, 15));
            actualizacion.setFechaFin(LocalDate.of(2021, 12, 15));
            actualizacion.setEnCurso(false);
            actualizacion.setNivelEducativo(NivelEducativo.UNIVERSITARIO);

            when(estudioRepo.findById(1L)).thenReturn(Optional.of(estudio));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(estudioRepo.save(any(Estudio.class))).thenReturn(estudio);

            Estudio resultado = estudioService.actualizarEstudio(1L, actualizacion, 1L);

            assertNotNull(resultado);
            verify(estudioRepo, times(1)).save(any(Estudio.class));
        }

        @Test
        @DisplayName("No debe permitir actualizar estudio ajeno")
        void noDebePermitirActualizarEstudioAjeno() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(estudioRepo.findById(1L)).thenReturn(Optional.of(estudio));
            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(IllegalStateException.class, () -> {
                estudioService.actualizarEstudio(1L, estudio, 999L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar estudio como dueño")
        void debeEliminarEstudioComoDueno() {
            when(estudioRepo.findById(1L)).thenReturn(Optional.of(estudio));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            doNothing().when(estudioRepo).delete(any(Estudio.class));

            assertDoesNotThrow(() -> {
                estudioService.eliminarEstudio(1L, 1L);
            });

            verify(estudioRepo, times(1)).delete(any(Estudio.class));
        }

        @Test
        @DisplayName("Debe permitir eliminar estudio como ADMIN")
        void debePermitirEliminarEstudioComoAdmin() {
            Usuario admin = new Usuario();
            admin.setId(99L);
            admin.setRol(Rol.ADMIN);

            when(estudioRepo.findById(1L)).thenReturn(Optional.of(estudio));
            when(usuarioRepo.findById(99L)).thenReturn(Optional.of(admin));
            doNothing().when(estudioRepo).delete(any(Estudio.class));

            assertDoesNotThrow(() -> {
                estudioService.eliminarEstudio(1L, 99L);
            });
        }
    }
}
