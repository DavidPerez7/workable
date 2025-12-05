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

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

/**
 * Pruebas unitarias para PostulacionService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PostulacionService Tests")
class PostulacionServiceTest {

    @Mock
    private PostulacionRepo postulacionRepo;

    @Mock
    private UsuarioRepo usuarioRepo;

    @Mock
    private OfertaRepo ofertaRepo;

    @InjectMocks
    private PostulacionService postulacionService;

    private Usuario aspirante;
    private Usuario reclutador;
    private Empresa empresa;
    private Oferta oferta;
    private Postulacion postulacion;

    @BeforeEach
    void setUp() {
        aspirante = new Usuario();
        aspirante.setId(1L);
        aspirante.setNombre("Juan");
        aspirante.setApellido("Pérez");
        aspirante.setCorreo("juan@test.com");
        aspirante.setRol(Rol.ASPIRANTE);
        aspirante.setIsActive(true);

        reclutador = new Usuario();
        reclutador.setId(2L);
        reclutador.setNombre("María");
        reclutador.setCorreo("maria@empresa.com");
        reclutador.setRol(Rol.RECLUTADOR);

        empresa = new Empresa();
        empresa.setId(1L);
        empresa.setNombre("Tech Corp");
        empresa.getReclutadores().add(reclutador);

        oferta = new Oferta();
        oferta.setId(1L);
        oferta.setTitulo("Desarrollador Java");
        oferta.setDescripcion("Buscamos desarrollador Java");
        oferta.setEstado(EstadoOferta.ABIERTA);
        oferta.setEmpresa(empresa);
        oferta.setFechaLimite(LocalDate.now().plusDays(30));

        postulacion = new Postulacion();
        postulacion.setId(1L);
        postulacion.setUsuario(aspirante);
        postulacion.setOferta(oferta);
        postulacion.setEstado(Estado.PENDIENTE);
        postulacion.setIsActive(true);
        postulacion.setFechaCreacion(LocalDate.now());
    }

    @Nested
    @DisplayName("Tests de creación")
    class CreateTests {

        @Test
        @DisplayName("Debe crear postulación exitosamente")
        void debeCrearPostulacion() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(aspirante));
            when(ofertaRepo.findById(1L)).thenReturn(Optional.of(oferta));
            when(postulacionRepo.findByUsuarioIdAndOfertaId(1L, 1L)).thenReturn(Optional.empty());
            when(postulacionRepo.save(any(Postulacion.class))).thenReturn(postulacion);

            Postulacion resultado = postulacionService.crearPostulacion(1L, 1L);

            assertNotNull(resultado);
            assertEquals(Estado.PENDIENTE, resultado.getEstado());
            verify(postulacionRepo, times(1)).save(any(Postulacion.class));
        }

        @Test
        @DisplayName("Debe lanzar excepción si ya existe postulación")
        void debeLanzarExcepcionSiYaExistePostulacion() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(aspirante));
            when(ofertaRepo.findById(1L)).thenReturn(Optional.of(oferta));
            when(postulacionRepo.findByUsuarioIdAndOfertaId(1L, 1L)).thenReturn(Optional.of(postulacion));

            assertThrows(IllegalStateException.class, () -> {
                postulacionService.crearPostulacion(1L, 1L);
            });
        }

        @Test
        @DisplayName("Debe lanzar excepción si oferta no está abierta")
        void debeLanzarExcepcionSiOfertaCerrada() {
            oferta.setEstado(EstadoOferta.CERRADA);
            
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(aspirante));
            when(ofertaRepo.findById(1L)).thenReturn(Optional.of(oferta));

            assertThrows(IllegalStateException.class, () -> {
                postulacionService.crearPostulacion(1L, 1L);
            });
        }
    }

    @Nested
    @DisplayName("Tests de lectura")
    class ReadTests {

        @Test
        @DisplayName("Debe obtener postulaciones por usuario")
        void debeObtenerPostulacionesPorUsuario() {
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(aspirante));
            when(postulacionRepo.findByUsuarioId(1L)).thenReturn(Arrays.asList(postulacion));

            List<Postulacion> resultado = postulacionService.listarPorUsuario(1L, 1L);

            assertEquals(1, resultado.size());
            assertEquals("Desarrollador Java", resultado.get(0).getOferta().getTitulo());
        }

        @Test
        @DisplayName("Debe verificar si ya se postuló")
        void debeVerificarSiYaSePostulo() {
            when(postulacionRepo.findByUsuarioIdAndOfertaId(1L, 1L)).thenReturn(Optional.of(postulacion));

            boolean resultado = postulacionService.yaSePostulo(1L, 1L);

            assertTrue(resultado);
        }

        @Test
        @DisplayName("Debe verificar que no se ha postulado")
        void debeVerificarQueNoSeHaPostulado() {
            when(postulacionRepo.findByUsuarioIdAndOfertaId(1L, 2L)).thenReturn(Optional.empty());

            boolean resultado = postulacionService.yaSePostulo(1L, 2L);

            assertFalse(resultado);
        }
    }

    @Nested
    @DisplayName("Tests de eliminación")
    class DeleteTests {

        @Test
        @DisplayName("Debe eliminar postulación como dueño")
        void debeEliminarPostulacionComoDueno() {
            when(postulacionRepo.findById(1L)).thenReturn(Optional.of(postulacion));
            when(usuarioRepo.findById(1L)).thenReturn(Optional.of(aspirante));
            doNothing().when(postulacionRepo).delete(any(Postulacion.class));

            assertDoesNotThrow(() -> {
                postulacionService.eliminarPostulacion(1L, 1L);
            });

            verify(postulacionRepo, times(1)).delete(any(Postulacion.class));
        }

        @Test
        @DisplayName("No debe permitir eliminar postulación ajena")
        void noDebePermitirEliminarPostulacionAjena() {
            Usuario otroUsuario = new Usuario();
            otroUsuario.setId(999L);
            otroUsuario.setRol(Rol.ASPIRANTE);

            when(postulacionRepo.findById(1L)).thenReturn(Optional.of(postulacion));
            when(usuarioRepo.findById(999L)).thenReturn(Optional.of(otroUsuario));

            assertThrows(IllegalStateException.class, () -> {
                postulacionService.eliminarPostulacion(1L, 999L);
            });
        }

        @Test
        @DisplayName("Debe permitir eliminar como ADMIN")
        void debePermitirEliminarComoAdmin() {
            Usuario admin = new Usuario();
            admin.setId(99L);
            admin.setRol(Rol.ADMIN);

            when(postulacionRepo.findById(1L)).thenReturn(Optional.of(postulacion));
            when(usuarioRepo.findById(99L)).thenReturn(Optional.of(admin));
            doNothing().when(postulacionRepo).delete(any(Postulacion.class));

            assertDoesNotThrow(() -> {
                postulacionService.eliminarPostulacion(1L, 99L);
            });
        }
    }
}
