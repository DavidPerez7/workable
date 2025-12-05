package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.NotificacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class NotificacionService {
    @Autowired
    private NotificacionRepo notificacionRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    // ===== CREATE =====
    public Notificacion create(Notificacion request, Long usuarioDestinoId) {
        Usuario usuario = usuarioRepo.findById(usuarioDestinoId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        request.setUsuario(usuario);
        return notificacionRepo.save(request);
    }

    // ===== READ =====
    public Notificacion getById(Long id) {
        return notificacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificacion no encontrada"));
    }

    public List<Notificacion> getByUsuario(Long usuarioId) {
        return notificacionRepo.findByUsuarioId(usuarioId);
    }

    public List<Notificacion> getByUsuarioAndLeida(Long usuarioId, Boolean leida) {
        return notificacionRepo.findByUsuarioIdAndLeida(usuarioId, leida);
    }

    public List<Notificacion> getByUsuarioAndTipo(Long usuarioId, Notificacion.Tipo tipo) {
        return notificacionRepo.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

    public List<Notificacion> getByUsuarioOrderByFechaDesc(Long usuarioId) {
        return notificacionRepo.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    public List<Notificacion> getActivasByUsuario(Long usuarioId) {
        return notificacionRepo.findByUsuarioId(usuarioId).stream()
                .filter(n -> n.getIsActive())
                .toList();
    }

    public Long contarNoLeidas(Long usuarioId) {
        return notificacionRepo.countByUsuarioIdAndLeida(usuarioId, false);
    }

    // ===== UPDATE =====
    public Notificacion marcarComoLeida(Long id) {
        Notificacion notificacion = getById(id);
        notificacion.setLeida(true);
        return notificacionRepo.save(notificacion);
    }

    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> noLeidas = notificacionRepo.findByUsuarioIdAndLeida(usuarioId, false);
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
    public boolean esOwner(Long notificacionId, Long usuarioId) {
        return notificacionRepo.findById(notificacionId)
                .map(n -> n.getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    // ===== HELPER PARA ALERTAS DE CITACIÓN =====
    /**
     * Crea una notificación de alerta cuando se envía una citación al aspirante
     */
    public Notificacion crearAlertaCitacion(Long usuarioAspiranteId, String nombreOferta, 
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
        
        return create(notificacion, usuarioAspiranteId);
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
