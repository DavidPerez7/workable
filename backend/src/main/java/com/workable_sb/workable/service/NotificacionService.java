package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.NotificacionRepo;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

@Service
@Transactional
public class NotificacionService {
    @Autowired
    private NotificacionRepo notificacionRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    // ===== CREATE =====
    public Notificacion create(Notificacion request) {
        // Validación: debe tener aspirante O reclutador, no ambos ni ninguno
        if ((request.getAspirante() == null && request.getReclutador() == null) || 
            (request.getAspirante() != null && request.getReclutador() != null)) {
            throw new IllegalStateException("Notificacion debe tener receptor Aspirante O Reclutador, no ambos ni ninguno");
        }

        // Si tiene aspirante, cargar la entidad completa
        if (request.getAspirante() != null && request.getAspirante().getId() != null) {
            Aspirante aspirante = aspiranteRepo.findById(request.getAspirante().getId())
                    .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
            request.setAspirante(aspirante);
        }

        // Si tiene reclutador, cargar la entidad completa
        if (request.getReclutador() != null && request.getReclutador().getId() != null) {
            Reclutador reclutador = reclutadorRepo.findById(request.getReclutador().getId())
                    .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
            request.setReclutador(reclutador);
        }

        return notificacionRepo.save(request);
    }

    // ===== READ =====
    public Notificacion getById(Long id) {
        return notificacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificacion no encontrada"));
    }

    public List<Notificacion> getAll() {
        return notificacionRepo.findAll();
    }

    public List<Notificacion> getByUsuario(Long usuarioId) {
        // Obtener notificaciones para aspirante
        List<Notificacion> aspiranteNotif = notificacionRepo.findByAspiranteId(usuarioId);
        // Obtener notificaciones para reclutador
        List<Notificacion> reclutadorNotif = notificacionRepo.findByReclutadorId(usuarioId);
        // Combinar ambas listas
        return Stream.concat(aspiranteNotif.stream(), reclutadorNotif.stream()).toList();
    }

    public List<Notificacion> getByUsuarioAndLeida(Long usuarioId, Boolean leida) {
        List<Notificacion> aspiranteNotif = notificacionRepo.findByAspiranteIdAndLeida(usuarioId, leida);
        List<Notificacion> reclutadorNotif = notificacionRepo.findByReclutadorIdAndLeida(usuarioId, leida);
        return Stream.concat(aspiranteNotif.stream(), reclutadorNotif.stream()).toList();
    }

    public List<Notificacion> getByUsuarioAndTipo(Long usuarioId, Notificacion.Tipo tipo) {
        List<Notificacion> aspiranteNotif = notificacionRepo.findByAspiranteIdAndTipo(usuarioId, tipo);
        List<Notificacion> reclutadorNotif = notificacionRepo.findByReclutadorIdAndTipo(usuarioId, tipo);
        return Stream.concat(aspiranteNotif.stream(), reclutadorNotif.stream()).toList();
    }

    public List<Notificacion> getActivasByUsuario(Long usuarioId) {
        List<Notificacion> notificaciones = getByUsuario(usuarioId);
        return notificaciones.stream()
                .filter(n -> n.getIsActive())
                .toList();
    }

    public Long contarNoLeidas(Long usuarioId) {
        long aspiranteNoLeidas = notificacionRepo.countByAspiranteIdAndLeida(usuarioId, false);
        long reclutadorNoLeidas = notificacionRepo.countByReclutadorIdAndLeida(usuarioId, false);
        return aspiranteNoLeidas + reclutadorNoLeidas;
    }

    // ===== UPDATE =====
    public Notificacion update(Long id, Notificacion request, Long usuarioIdActual) {
        Notificacion existente = getById(id);
        
        // Si usuarioIdActual es null, es ADMIN y no validamos ownership
        if (usuarioIdActual != null && !esOwner(id, usuarioIdActual)) {
            throw new IllegalStateException("No puedes editar una notificacion que no te pertenece");
        }

        existente.setTitulo(request.getTitulo());
        existente.setMensaje(request.getMensaje());
        existente.setUrl(request.getUrl());
        existente.setTipo(request.getTipo());
        return notificacionRepo.save(existente);
    }

    public Notificacion marcarComoLeida(Long id, Long usuarioIdActual) {
        Notificacion notificacion = getById(id);
        
        // Validar que el usuario es el propietario
        if (!esOwner(id, usuarioIdActual)) {
            throw new IllegalStateException("No puedes marcar como leída una notificacion que no te pertenece");
        }

        notificacion.setLeida(true);
        return notificacionRepo.save(notificacion);
    }

    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> noLeidas = getByUsuarioAndLeida(usuarioId, false);
        noLeidas.forEach(n -> n.setLeida(true));
        notificacionRepo.saveAll(noLeidas);
    }

    // ===== DELETE =====
    public void delete(Long id, Long usuarioIdActual) {
        Notificacion existente = getById(id);
        
        // Si usuarioIdActual es null, es ADMIN y no validamos ownership
        if (usuarioIdActual != null && !esOwner(id, usuarioIdActual)) {
            throw new IllegalStateException("No puedes eliminar una notificacion que no te pertenece");
        }

        notificacionRepo.delete(existente);
    }

    // ===== MÉTODO AUXILIAR =====
    public boolean esOwner(Long notificacionId, Long usuarioId) {
        return notificacionRepo.findById(notificacionId)
                .map(n -> {
                    if (n.getAspirante() != null) {
                        return n.getAspirante().getId().equals(usuarioId);
                    }
                    if (n.getReclutador() != null) {
                        return n.getReclutador().getId().equals(usuarioId);
                    }
                    return false;
                })
                .orElse(false);
    }

    // ===== HELPER PARA CREAR NOTIFICACIONES DE SISTEMA =====
    /**
     * Notificación para aspirante: Postulacion a oferta
     */
    public Notificacion crearNotifPostulacion(Long aspiranteId, String nombreOferta) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.POSTULACION);
        notificacion.setTitulo("✅ Postulación Realizada");
        notificacion.setMensaje("Te has postulado exitosamente a " + nombreOferta);
        notificacion.setUrl("/mis-postulaciones");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        Aspirante aspirante = new Aspirante();
        aspirante.setId(aspiranteId);
        notificacion.setAspirante(aspirante);
        
        return create(notificacion);
    }

    /**
     * Notificación para reclutador: Nuevas postulaciones
     */
    public Notificacion crearNotifNuevaPostulacion(Long reclutadorId, String nombreAspirante, String nombreOferta) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.POSTULACION);
        notificacion.setTitulo("📥 Nueva Postulación");
        notificacion.setMensaje(nombreAspirante + " se postuló a " + nombreOferta);
        notificacion.setUrl("/postulaciones");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        Reclutador reclutador = new Reclutador();
        reclutador.setId(reclutadorId);
        notificacion.setReclutador(reclutador);
        
        return create(notificacion);
    }

    /**
     * Notificación para aspirante: Cambio de estado en postulacion
     */
    public Notificacion crearNotifCambioEstado(Long aspiranteId, String nombreOferta, String nuevoEstado) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.CAMBIO_ESTADO);
        notificacion.setTitulo("📊 Tu postulación a " + nombreOferta);
        notificacion.setMensaje("Tu postulación pasó al estado: " + nuevoEstado);
        notificacion.setUrl("/mis-postulaciones");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        Aspirante aspirante = new Aspirante();
        aspirante.setId(aspiranteId);
        notificacion.setAspirante(aspirante);
        
        return create(notificacion);
    }

    /**
     * Notificación para aspirante: Invitación a entrevista
     */
    public Notificacion crearNotifEntrevista(Long aspiranteId, String nombreOferta, String fecha, String hora) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.ENTREVISTA);
        notificacion.setTitulo("🎯 ¡Entrevista agendada!");
        notificacion.setMensaje("Tu entrevista para " + nombreOferta + " está agendada para el " + fecha + " a las " + hora);
        notificacion.setUrl("/mis-entrevistas");
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        Aspirante aspirante = new Aspirante();
        aspirante.setId(aspiranteId);
        notificacion.setAspirante(aspirante);
        
        return create(notificacion);
    }

    // ===== MÉTODOS AUXILIARES PARA CITACIÓN =====
    /**
     * Crea una notificación para aspirante cuando se agenda una citación
     */
    public Notificacion crearAlertaCitacion(Long aspiranteId, String nombreOferta, 
                                            String fechaCitacion, String horaCitacion, 
                                            Long citacionId) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(Notificacion.Tipo.ENTREVISTA);
        notificacion.setTitulo("🎯 ¡Entrevista agendada! - " + nombreOferta);
        notificacion.setMensaje("Tu entrevista está agendada para el " + fechaCitacion + " a las " + horaCitacion);
        notificacion.setUrl("/mis-entrevistas/" + citacionId);
        notificacion.setLeida(false);
        notificacion.setIsActive(true);
        
        Aspirante aspirante = new Aspirante();
        aspirante.setId(aspiranteId);
        notificacion.setAspirante(aspirante);
        
        return create(notificacion);
    }
}
