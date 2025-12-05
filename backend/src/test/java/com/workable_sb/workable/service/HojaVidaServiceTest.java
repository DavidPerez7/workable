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

import com.workable_sb.workable.dto.HojaVidaCompletaDto;
import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para HojaVidaService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("HojaVidaService Tests")
class HojaVidaServiceTest {

    @Mock
    private HojaVidaRepo hojaVidaRepo;

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private EstudioRepo estudioRepo;

    @Mock
    private ExperienciaRepo experienciaRepo;

    @Mock
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    @InjectMocks
    private HojaVidaService hojaVidaService;

    private Usuario usuario;
    private HojaVida hojaVida;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setCorreo("juan@test.com");
        usuario.setRol(Rol.ASPIRANTE);
        usuario.setIsActive(true);

        hojaVida = new HojaVida();
        hojaVida.setId(1L);
        hojaVida.setTitulo("Desarrollador Full Stack");
        hojaVida.setResumenProfesional("Desarrollador con 5 años de experiencia");
        hojaVida.setUsuario(usuario);
        hojaVida.setIsActive(true);
        hojaVida.setEsPublica(false);
        hojaVida.setFechaCreacion(LocalDate.now());
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe crear hoja de vida exitosamente")
        void debeCrearHojaVida() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(hojaVidaRepo.save(any(HojaVida.class))).thenReturn(hojaVida);

            HojaVida resultado = hojaVidaService.crearHojaVida(hojaVida, 1L);

            assertNotNull(resultado);
            assertEquals("Desarrollador Full Stack", resultado.getTitulo());
            verify(hojaVidaRepo, times(1)).save(any(HojaVida.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si título es nulo")
        void debeLanzarExcepcionSiTituloNulo() {
            hojaVida.setTitulo(null);

            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalArgumentException.class, () -> {
                hojaVidaService.crearHojaVida(hojaVida, 1L);
            });
        }

        @Test
        @DisplayName("No debe permitir crear hoja de vida a no aspirantes")
        void noDebePermitirCrearANoAspirantes() {
            usuario.setRol(Rol.RECLUTADOR);

            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));

            assertThrows(IllegalArgumentException.class, () -> {
                hojaVidaService.crearHojaVida(hojaVida, 1L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener hoja de vida por ID")
        void debeObtenerHojaVidaPorId() {
            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));

            HojaVida resultado = hojaVidaService.obtenerPorId(1L);

            assertNotNull(resultado);
            assertEquals("Desarrollador Full Stack", resultado.getTitulo());
        }

        @Test
        @DisplayName("Debe obtener hoja de vida completa")
        void debeObtenerHojaVidaCompleta() {
            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(estudioRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList());
            when(experienciaRepo.findByUsuarioIdOrderByFechaInicioDesc(1L)).thenReturn(Arrays.asList());
            when(usuarioHabilidadRepo.findByUsuarioIdAndIsActive(1L, true)).thenReturn(Arrays.asList());

            HojaVidaCompletaDto resultado = hojaVidaService.obtenerHojaVidaCompleta(1L);

            assertNotNull(resultado);
            assertNotNull(resultado.getHojaVida());
            assertNotNull(resultado.getUsuario());
            assertEquals("Juan", resultado.getUsuario().getNombre());
        }

        @Test
        @DisplayName("Debe obtener hojas de vida por usuario")
        void debeObtenerHojasVidaPorUsuario() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(hojaVidaRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList(hojaVida));

            List<HojaVida> resultado = hojaVidaService.obtenerHojasVidaPorUsuario(1L);

            assertEquals(1, resultado.size());
        }

        @Test
        @DisplayName("Debe obtener hojas de vida públicas")
        void debeObtenerHojasVidaPublicas() {
            hojaVida.setEsPublica(true);
            when(hojaVidaRepo.findByEsPublicaAndIsActive(true, true)).thenReturn(Arrays.asList(hojaVida));

            List<HojaVida> resultado = hojaVidaService.obtenerHojasVidaPublicas();

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getEsPublica());
        }

        @Test
        @DisplayName("Debe buscar hojas de vida por título")
        void debeBuscarPorTitulo() {
            when(hojaVidaRepo.findByTituloContainingIgnoreCaseAndIsActive("Full Stack", true))
                    .thenReturn(Arrays.asList(hojaVida));

            List<HojaVida> resultado = hojaVidaService.buscarPorTitulo("Full Stack");

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getTitulo().contains("Full Stack"));
        }
    }

    @Nested
    @DisplayName("Tests de actualización")
    class UpdateTests {

        @Test
        @DisplayName("Debe actualizar hoja de vida como dueño")
        void debeActualizarHojaVidaComoDueno() {
            HojaVida actualizacion = new HojaVida();
            actualizacion.setTitulo("Senior Full Stack Developer");
            actualizacion.setResumenProfesional("Desarrollador senior con 7 años de experiencia");

            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(hojaVidaRepo.save(any(HojaVida.class))).thenReturn(hojaVida);

            HojaVida resultado = hojaVidaService.actualizarHojaVida(1L, actualizacion, 1L);

            assertNotNull(resultado);
            verify(hojaVidaRepo, times(1)).save(any(HojaVida.class));
        }

        @Test
        @DisplayName("Debe cambiar visibilidad de hoja de vida")
        void debeCambiarVisibilidad() {
            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(hojaVidaRepo.save(any(HojaVida.class))).thenReturn(hojaVida);

            HojaVida resultado = hojaVidaService.cambiarVisibilidad(1L, true, 1L);

            assertNotNull(resultado);
            verify(hojaVidaRepo, times(1)).save(any(HojaVida.class));
        }

        @Test
        @DisplayName("No debe permitir actualizar hoja de vida ajena")
        void noDebePermitirActualizarHojaVidaAjena() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(IllegalStateException.class, () -> {
                hojaVidaService.actualizarHojaVida(1L, hojaVida, 999L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar hoja de vida como dueño")
        void debeEliminarHojaVidaComoDueno() {
            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            doNothing().when(hojaVidaRepo).delete(any(HojaVida.class));

            assertDoesNotThrow(() -> {
                hojaVidaService.eliminarHojaVida(1L, 1L);
            });

            verify(hojaVidaRepo, times(1)).delete(any(HojaVida.class));
        }

        @Test
        @DisplayName("Debe desactivar hoja de vida")
        void debeDesactivarHojaVida() {
            when(hojaVidaRepo.findById(1L)).thenReturn(Optional.of(hojaVida));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(hojaVidaRepo.save(any(HojaVida.class))).thenReturn(hojaVida);

            assertDoesNotThrow(() -> {
                hojaVidaService.desactivarHojaVida(1L, 1L);
            });

            verify(hojaVidaRepo, times(1)).save(any(HojaVida.class));
        }
    }
}
