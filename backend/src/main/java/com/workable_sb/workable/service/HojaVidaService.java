package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.dto.HojaVidaCompletaDto;
import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class HojaVidaService {

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private EstudioRepo estudioRepo;

    @Autowired
    private ExperienciaRepo experienciaRepo;

    @Autowired
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    // ===== CREATE =====
    public HojaVida crearHojaVida(HojaVida hojaVida, Long usuarioId) {
        
        // Validar que el usuario existe y es aspirante
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (usuario.getRol() != Usuario.Rol.ASPIRANTE) {
            throw new IllegalArgumentException("Solo los aspirantes pueden crear hojas de vida");
        }

        // Validar campos obligatorios
        if (hojaVida.getTitulo() == null || hojaVida.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }

        hojaVida.setUsuario(usuario);
        
        return hojaVidaRepo.save(hojaVida);
    }

    // ===== READ =====
    public HojaVida obtenerPorId(Long id) {
        return hojaVidaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVidaCompletaDto obtenerHojaVidaCompleta(Long hojaVidaId) {
        HojaVida hojaVida = obtenerPorId(hojaVidaId);
        return construirHojaVidaCompleta(hojaVida);
    }

    public HojaVidaCompletaDto obtenerHojaVidaCompletaPorUsuario(Long usuarioId) {
        HojaVida hojaVida = hojaVidaRepo.findFirstByUsuarioIdAndIsActiveOrderByFechaCreacionDesc(usuarioId, true)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene hoja de vida activa"));
        return construirHojaVidaCompleta(hojaVida);
    }

    private HojaVidaCompletaDto construirHojaVidaCompleta(HojaVida hojaVida) {
        Long usuarioId = hojaVida.getUsuario().getId();
        
        // Obtener estudios
        List<Estudio> estudios = estudioRepo.findByUsuarioId(usuarioId);
        
        // Obtener experiencias
        List<Experiencia> experiencias = experienciaRepo.findByUsuarioIdOrderByFechaInicioDesc(usuarioId);
        
        // Obtener habilidades
        List<UsuarioHabilidad> habilidades = usuarioHabilidadRepo.findByUsuarioIdAndIsActive(usuarioId, true);
        
        // Crear DTO
        HojaVidaCompletaDto dto = new HojaVidaCompletaDto();
        dto.setHojaVida(hojaVida);
        dto.setUsuario(HojaVidaCompletaDto.UsuarioBasicoDto.fromUsuario(hojaVida.getUsuario()));
        dto.setEstudios(estudios);
        dto.setExperiencias(experiencias);
        dto.setHabilidades(habilidades);
        
        return dto;
    }

    public List<HojaVida> obtenerHojasVidaPorUsuario(Long usuarioId) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return hojaVidaRepo.findByUsuarioId(usuarioId);
    }

    public List<HojaVida> obtenerHojasVidaPublicas() {
        return hojaVidaRepo.findByEsPublicaAndIsActive(true, true);
    }

    public List<HojaVidaCompletaDto> obtenerHojasVidaPublicasCompletas() {
        List<HojaVida> hojasVida = obtenerHojasVidaPublicas();
        return hojasVida.stream()
                .map(this::construirHojaVidaCompleta)
                .toList();
    }

    public List<HojaVida> buscarPorTitulo(String titulo) {
        return hojaVidaRepo.findByTituloContainingIgnoreCaseAndIsActive(titulo, true);
    }

    // ===== UPDATE =====
    public HojaVida actualizarHojaVida(Long id, HojaVida hojaVidaActualizada, Long usuarioIdActual) {
        HojaVida existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarHojaVida(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden actualizar esta hoja de vida");
        }

        // Actualizar campos
        if (hojaVidaActualizada.getTitulo() != null) {
            existente.setTitulo(hojaVidaActualizada.getTitulo());
        }
        if (hojaVidaActualizada.getResumenProfesional() != null) {
            existente.setResumenProfesional(hojaVidaActualizada.getResumenProfesional());
        }
        if (hojaVidaActualizada.getObjetivoProfesional() != null) {
            existente.setObjetivoProfesional(hojaVidaActualizada.getObjetivoProfesional());
        }
        if (hojaVidaActualizada.getTelefonoAdicional() != null) {
            existente.setTelefonoAdicional(hojaVidaActualizada.getTelefonoAdicional());
        }
        if (hojaVidaActualizada.getLinkedin() != null) {
            existente.setLinkedin(hojaVidaActualizada.getLinkedin());
        }
        if (hojaVidaActualizada.getPortfolio() != null) {
            existente.setPortfolio(hojaVidaActualizada.getPortfolio());
        }
        if (hojaVidaActualizada.getGithub() != null) {
            existente.setGithub(hojaVidaActualizada.getGithub());
        }
        if (hojaVidaActualizada.getDisponibilidad() != null) {
            existente.setDisponibilidad(hojaVidaActualizada.getDisponibilidad());
        }
        if (hojaVidaActualizada.getSalarioEsperado() != null) {
            existente.setSalarioEsperado(hojaVidaActualizada.getSalarioEsperado());
        }
        if (hojaVidaActualizada.getNivelExperiencia() != null) {
            existente.setNivelExperiencia(hojaVidaActualizada.getNivelExperiencia());
        }
        if (hojaVidaActualizada.getIdiomas() != null) {
            existente.setIdiomas(hojaVidaActualizada.getIdiomas());
        }
        if (hojaVidaActualizada.getCertificaciones() != null) {
            existente.setCertificaciones(hojaVidaActualizada.getCertificaciones());
        }
        if (hojaVidaActualizada.getReferencias() != null) {
            existente.setReferencias(hojaVidaActualizada.getReferencias());
        }
        if (hojaVidaActualizada.getLogros() != null) {
            existente.setLogros(hojaVidaActualizada.getLogros());
        }
        if (hojaVidaActualizada.getUrlCvPdf() != null) {
            existente.setUrlCvPdf(hojaVidaActualizada.getUrlCvPdf());
        }
        if (hojaVidaActualizada.getEsPublica() != null) {
            existente.setEsPublica(hojaVidaActualizada.getEsPublica());
        }

        return hojaVidaRepo.save(existente);
    }

    public HojaVida cambiarVisibilidad(Long id, Boolean esPublica, Long usuarioIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño puede cambiar la visibilidad");
        }

        existente.setEsPublica(esPublica);
        return hojaVidaRepo.save(existente);
    }

    // ===== DELETE =====
    public void eliminarHojaVida(Long id, Long usuarioIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño, reclutador o administrador pueden eliminar esta hoja de vida");
        }

        hojaVidaRepo.delete(existente);
    }

    public void desactivarHojaVida(Long id, Long usuarioIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño puede desactivar esta hoja de vida");
        }

        existente.setIsActive(false);
        hojaVidaRepo.save(existente);
    }

    // ===== MÉTODOS AUXILIARES =====
    private boolean puedeModificarHojaVida(HojaVida hojaVida, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Es el dueño, es ADMIN, o es RECLUTADOR
        return hojaVida.getUsuario().getId().equals(usuarioId) || 
               usuario.getRol() == Usuario.Rol.ADMIN ||
               usuario.getRol() == Usuario.Rol.RECLUTADOR;
    }
}
