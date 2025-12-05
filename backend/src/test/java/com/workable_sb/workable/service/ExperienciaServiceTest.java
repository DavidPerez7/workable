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

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Experiencia.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para ExperienciaService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ExperienciaService Tests")
class ExperienciaServiceTest {

    @Mock
    private ExperienciaRepo experienciaRepo;

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private MunicipioRepo municipioRepo;

    @InjectMocks
    private ExperienciaService experienciaService;

    private Usuario usuario;
    private Experiencia experiencia;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setCorreo("juan@test.com");
        usuario.setRol(Rol.ASPIRANTE);
        usuario.setIsActive(true);

        experiencia = new Experiencia();
        experiencia.setId(1L);
        experiencia.setCargo("Desarrollador Java");
        experiencia.setEmpresa("Tech Corp");
        experiencia.setDescripcion("Desarrollo de aplicaciones empresariales");
        experiencia.setFechaInicio(LocalDate.of(2020, 1, 15));
        experiencia.setFechaFin(LocalDate.of(2023, 6, 30));
        experiencia.setEstado(Estado.ACTIVO);
        experiencia.setUsuario(usuario);
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe crear experiencia exitosamente")
        void debeCrearExperiencia() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(experienciaRepo.save(any(Experiencia.class))).thenReturn(experiencia);

            Experiencia resultado = experienciaService.crearExperiencia(experiencia, 1L);

            assertNotNull(resultado);
            assertEquals("Desarrollador Java", resultado.getCargo());
            assertEquals("Tech Corp", resultado.getEmpresa());
            verify(experienciaRepo, times(1)).save(any(Experiencia.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si cargo es nulo")
        void debeLanzarExcepcionSiCargoNulo() {
            experiencia.setCargo(null);

            assertThrows(IllegalArgumentException.class, () -> {
                experienciaService.crearExperiencia(experiencia, 1L);
            });
        }

        @Test
        @DisplayName("Debe lanzar excepción si empresa es nula")
        void debeLanzarExcepcionSiEmpresaNula() {
            experiencia.setEmpresa(null);

            assertThrows(IllegalArgumentException.class, () -> {
                experienciaService.crearExperiencia(experiencia, 1L);
            });
        }

        @Test
        @DisplayName("Debe lanzar excepción si usuario no existe")
        void debeLanzarExcepcionSiUsuarioNoExiste() {
            when(usuarioRepo.findById(999L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> {
                experienciaService.crearExperiencia(experiencia, 999L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener experiencia por ID")
        void debeObtenerExperienciaPorId() {
            when(experienciaRepo.findById(1L)).thenReturn(Optional.of(experiencia));

            Experiencia resultado = experienciaService.obtenerPorId(1L);

            assertNotNull(resultado);
            assertEquals("Desarrollador Java", resultado.getCargo());
        }

        @Test
        @DisplayName("Debe obtener experiencias por usuario")
        void debeObtenerExperienciasPorUsuario() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(experienciaRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList(experiencia));

            List<Experiencia> resultado = experienciaService.obtenerExperienciasPorUsuario(1L);

            assertEquals(1, resultado.size());
            assertEquals("Tech Corp", resultado.get(0).getEmpresa());
        }

        @Test
        @DisplayName("Debe obtener experiencias activas")
        void debeObtenerExperienciasActivas() {
            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(experienciaRepo.findByUsuarioIdAndEstado(1L, Estado.ACTIVO))
                    .thenReturn(Arrays.asList(experiencia));

            List<Experiencia> resultado = experienciaService.obtenerExperienciasActivas(1L);

            assertEquals(1, resultado.size());
            assertEquals(Estado.ACTIVO, resultado.get(0).getEstado());
        }

        @Test
        @DisplayName("Debe obtener experiencias ordenadas por fecha")
        void debeObtenerExperienciasOrdenadasPorFecha() {
            Experiencia exp2 = new Experiencia();
            exp2.setId(2L);
            exp2.setCargo("Senior Developer");
            exp2.setEmpresa("Big Corp");
            exp2.setFechaInicio(LocalDate.of(2023, 7, 1));
            exp2.setUsuario(usuario);

            when(usuarioRepo.existsById(1L)).thenReturn(true);
            when(experienciaRepo.findByUsuarioIdOrderByFechaInicioDesc(1L))
                    .thenReturn(Arrays.asList(exp2, experiencia));

            List<Experiencia> resultado = experienciaService.obtenerExperienciasOrdenadasPorFecha(1L);

            assertEquals(2, resultado.size());
            assertEquals("Senior Developer", resultado.get(0).getCargo());
        }
    }

    @Nested
    @DisplayName("Tests de actualización")
    class UpdateTests {

        @Test
        @DisplayName("Debe actualizar experiencia como dueño")
        void debeActualizarExperienciaComoDueno() {
            Experiencia actualizacion = new Experiencia();
            actualizacion.setCargo("Senior Developer");
            actualizacion.setEmpresa("Tech Corp");
            actualizacion.setDescripcion("Liderazgo técnico");
            actualizacion.setFechaInicio(LocalDate.of(2020, 1, 15));
            actualizacion.setFechaFin(LocalDate.of(2024, 1, 15));

            when(experienciaRepo.findById(1L)).thenReturn(Optional.of(experiencia));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(experienciaRepo.save(any(Experiencia.class))).thenReturn(experiencia);

            Experiencia resultado = experienciaService.actualizarExperiencia(1L, actualizacion, 1L);

            assertNotNull(resultado);
            verify(experienciaRepo, times(1)).save(any(Experiencia.class));
        }

        @Test
        @DisplayName("Debe cambiar estado de experiencia")
        void debeCambiarEstadoExperiencia() {
            when(experienciaRepo.findById(1L)).thenReturn(Optional.of(experiencia));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            when(experienciaRepo.save(any(Experiencia.class))).thenReturn(experiencia);

            Experiencia resultado = experienciaService.cambiarEstado(1L, Estado.INACTIVO, 1L);

            assertNotNull(resultado);
            verify(experienciaRepo, times(1)).save(any(Experiencia.class));
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar experiencia como dueño")
        void debeEliminarExperienciaComoDueno() {
            when(experienciaRepo.findById(1L)).thenReturn(Optional.of(experiencia));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(usuario));
            doNothing().when(experienciaRepo).delete(any(Experiencia.class));

            assertDoesNotThrow(() -> {
                experienciaService.eliminarExperiencia(1L, 1L);
            });

            verify(experienciaRepo, times(1)).delete(any(Experiencia.class));
        }

        @Test
        @DisplayName("No debe permitir eliminar experiencia ajena")
        void noDebePermitirEliminarExperienciaAjena() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(experienciaRepo.findById(1L)).thenReturn(Optional.of(experiencia));
            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(IllegalStateException.class, () -> {
                experienciaService.eliminarExperiencia(1L, 999L);
            });
        }
    }
}
