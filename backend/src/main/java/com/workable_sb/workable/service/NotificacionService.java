package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.repository.NotificacionRepo;
import com.workable_sb.workable.repository.AspiranteRepo;

@Service
@Transactional
public class NotificacionService {
    @Autowired
    private NotificacionRepo notificacionRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    // ===== CREATE =====
    public Notificacion create(Notificacion request, Long aspiranteDestinoId) {
        Aspirante aspirante = aspiranteRepo.findById(aspiranteDestinoId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        request.setAspirante(aspirante);
        return notificacionRepo.save(request);
    }

    // ===== READ =====
    public Notificacion getById(Long id) {
        return notificacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificacion no encontrada"));
    }

    public List<Notificacion> getByAspirante(Long aspiranteId) {
        return notificacionRepo.findByAspiranteId(aspiranteId);
    }

    public List<Notificacion> getByAspiranteAndLeida(Long aspiranteId, Boolean leida) {
        return notificacionRepo.findByAspiranteIdAndLeida(aspiranteId, leida);
    }

    public List<Notificacion> getByAspiranteAndTipo(Long aspiranteId, Notificacion.Tipo tipo) {
        return notificacionRepo.findByAspiranteIdAndTipo(aspiranteId, tipo);
    }

    public List<Notificacion> getByAspiranteOrderByFechaDesc(Long aspiranteId) {
        return notificacionRepo.findByAspiranteIdOrderByFechaCreacionDesc(aspiranteId);
    }

    public List<Notificacion> getActivasByAspirante(Long aspiranteId) {
        return notificacionRepo.findByAspiranteId(aspiranteId).stream()
                .filter(n -> n.getIsActive())
                .toList();
    }

    public Long contarNoLeidas(Long aspiranteId) {
        return notificacionRepo.countByAspiranteIdAndLeida(aspiranteId, false);
    }

    // ===== UPDATE =====
    public Notificacion marcarComoLeida(Long id) {
        Notificacion notificacion = getById(id);
        notificacion.setLeida(true);
        return notificacionRepo.save(notificacion);
    }

    public void marcarTodasComoLeidas(Long aspiranteId) {
        List<Notificacion> noLeidas = notificacionRepo.findByAspiranteIdAndLeida(aspiranteId, false);
        noLeidas.forEach(n -> n.setLeida(true));
        notificacionRepo.saveAll(noLeidas);
    }

    public Notificacion update(Long id, Notificacion request) {
        Notificacion existente = getById(id);
        existente.setTitulo(request.getTitulo());
        existente.setMensaje(request.getMensaje());
        existente.setUrl(request.getUrl());
        existente.setTipo(request.getTipo());
        return notificacionRepo.save(existente);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Notificacion existente = getById(id);
        notificacionRepo.delete(existente);
    }

    // ===== MÉTODO AUXILIAR PARA @PreAuthorize =====
    public boolean esOwner(Long notificacionId, Long aspiranteId) {
        return notificacionRepo.findById(notificacionId)
                .map(n -> n.getAspirante().getId().equals(aspiranteId))
                .orElse(false);
    }

    // ===== HELPER PARA ALERTAS DE CITACIÓN =====
    /**
     * Crea una notificación de alerta cuando se envía una citación al aspirante
     */
    public Notificacion crearAlertaCitacion(Long aspiranteId, String nombreOferta, 
                                            String fechaCitacion, String horaCitacion, 
                                            Long citacionId) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.ENTREVISTA);
        notificacion.setTitulo("🎯 Invitación a Entrevista - " + nombreOferta);
        notificacion.setMensaje(
            String.format("¡Felicidades! Fuiste seleccionado para una entrevista el %s a las %s. " +
                         "Revisa los detalles en tu perfil.", 
                         fechaCitacion, horaCitacion)
        );
        notificacion.setUrl("/citaciones/" + citacionId);
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        return create(notificacion, aspiranteId);
    }

    /**
     * Crea una notificación cuando se cancela o cambia una citación
     */
    public Notificacion crearAlertaCancelacion(Long usuarioAspiranteId, String nombreOferta, String razon) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.CAMBIO_ESTADO);
        notificacion.setTitulo("⚠️ Cambio en tu Entrevista - " + nombreOferta);
        notificacion.setMensaje(razon);
        notificacion.setUrl("/citaciones");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        return create(notificacion, usuarioAspiranteId);
    }

    /**
     * Crea una notificación para el reclutador cuando un aspirante responde a una citación
     */
    public Notificacion crearAlertaReclutador(Long usuarioReclutadorId, String nombreAspirante, 
                                              String nombreOferta, String accion) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.CAMBIO_ESTADO);
        notificacion.setTitulo("📬 " + accion + " de Entrevista - " + nombreAspirante);
        notificacion.setMensaje(
            String.format("%s ha %s la entrevista para la posición de %s", 
                         nombreAspirante, accion.toLowerCase(), nombreOferta)
        );
        notificacion.setUrl("/citaciones");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        return create(notificacion, usuarioReclutadorId);
    }
}
