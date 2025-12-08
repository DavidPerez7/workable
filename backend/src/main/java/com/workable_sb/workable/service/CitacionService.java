package com.workable_sb.workable.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Citacion;
import com.workable_sb.workable.models.Citacion.Estado;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.CitacionRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class CitacionService {
    
    @Autowired
    private CitacionRepo citacionRepo;
    
    @Autowired
    private PostulacionRepo postulacionRepo;
    
    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private NotificacionService notificacionService;
    
    @Autowired(required = false)
    private EmailService emailService;
    
    // ===== CREAR CITACIÓN =====
    public Citacion crearCitacion(Long postulacionId, Long reclutadorId, LocalDate fechaCitacion, 
                                  String hora, String linkMeet, String detalles, 
                                  Long usuarioIdActual) {
        // Validar que el postulación existe
        Postulacion postulacion = postulacionRepo.findById(postulacionId)
            .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));
        
        // Validar que el reclutador existe
        Usuario reclutador = usuarioRepo.findById(reclutadorId)
            .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        // Validar que el usuario actual es reclutador o admin
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (usuarioActual.getRol() != Usuario.Rol.RECLUTADOR && 
            usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new RuntimeException("No tienes permisos para crear citaciones");
        }
        
        // Si es reclutador, validar que sea el mismo
        if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR && 
            !usuarioActual.getId().equals(reclutadorId)) {
            throw new RuntimeException("No puedes crear citaciones para otros reclutadores");
        }
        
        // Crear citación
        Citacion citacion = new Citacion();
        citacion.setPostulacion(postulacion);
        citacion.setReclutador(reclutador);
        citacion.setFechaCitacion(fechaCitacion);
        citacion.setHora(hora);
        citacion.setLinkMeet(linkMeet);
        citacion.setDetallesCitacion(detalles);
        citacion.setEstado(Estado.PENDIENTE);
        citacion.setFechaEnvio(LocalDateTime.now());
        citacion.setMensajeEnviado(false);
        
        return citacionRepo.save(citacion);
    }
    
    // ===== ENVIAR CITACIÓN POR EMAIL =====
    public Map<String, Object> enviarCitacionPorEmail(Long citacionId, Long usuarioIdActual) {
        Citacion citacion = citacionRepo.findById(citacionId)
            .orElseThrow(() -> new RuntimeException("Citación no encontrada"));
        
        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Permitir si es ADMIN o si es el reclutador asignado
        boolean esAdmin = usuarioActual.getRol() == Usuario.Rol.ADMIN;
        boolean esReclutadorAsignado = citacion.getReclutador() != null && 
                                       usuarioActual.getId().equals(citacion.getReclutador().getId());
        
        if (!esAdmin && !esReclutadorAsignado) {
            throw new RuntimeException("No tienes permisos para enviar esta citación");
        }
        
        // Obtener datos del aspirante y oferta
        Postulacion postulacion = citacion.getPostulacion();
        Aspirante aspirante = postulacion.getAspirante();
        String nombreOferta = postulacion.getOferta().getTitulo();
        
        // Enviar por Email
        try {
            // Preparar nombre del reclutador
            String nombreReclutador = "Reclutador del Sistema";
            if (citacion.getReclutador() != null) {
                nombreReclutador = citacion.getReclutador().getNombre() + " " + citacion.getReclutador().getApellido();
            }
            
            // Enviar email si el servicio está disponible
            if (emailService != null) {
                emailService.enviarCitacionEmail(
                    aspirante.getCorreo(),
                    aspirante.getNombre() + " " + aspirante.getApellido(),
                    nombreOferta,
                    citacion.getFechaCitacion().toString(),
                    citacion.getHora(),
                    citacion.getLinkMeet(),
                    nombreReclutador,
                    citacion.getDetallesCitacion()
                );
            }
            
            // Actualizar estado
            citacion.setMensajeEnviado(true);
            citacion.setEstado(Estado.PENDIENTE);
            citacionRepo.save(citacion);
            
            // Crear alerta de notificación en la app
            notificacionService.crearAlertaCitacion(
                aspirante.getId(),
                nombreOferta,
                citacion.getFechaCitacion().toString(),
                citacion.getHora(),
                citacion.getId()
            );
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Citación enviada exitosamente");
            respuesta.put("citacionId", citacion.getId());
            respuesta.put("mensajeEnviado", true);
            respuesta.put("emailDestino", aspirante.getCorreo());
            
            return respuesta;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar citación: " + e.getMessage());
        }
    }
    
    // ===== ENVIAR CITACIÓN A MÚLTIPLES CANDIDATOS =====
    public Map<String, Object> enviarCitacionesMultiples(List<Long> postulacionIds, Long reclutadorId, 
                                                          LocalDate fechaCitacion, String hora, 
                                                          String linkMeet, String detalles, 
                                                          Long usuarioIdActual) {
        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (usuarioActual.getRol() != Usuario.Rol.RECLUTADOR && 
            usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new RuntimeException("No tienes permisos para crear citaciones");
        }
        
        if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR && 
            !usuarioActual.getId().equals(reclutadorId)) {
            throw new RuntimeException("No puedes crear citaciones para otros reclutadores");
        }
        
        List<Citacion> citacionesCreadas = new ArrayList<>();
        List<String> notificacionesEnviadas = new ArrayList<>();
        List<String> errores = new ArrayList<>();
        
        Usuario reclutador = usuarioRepo.findById(reclutadorId)
            .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        for (Long postulacionId : postulacionIds) {
            try {
                // Crear citación
                Postulacion postulacion = postulacionRepo.findById(postulacionId)
                    .orElseThrow(() -> new RuntimeException("Postulación " + postulacionId + " no encontrada"));
                
                Citacion citacion = new Citacion();
                citacion.setPostulacion(postulacion);
                citacion.setReclutador(reclutador);
                citacion.setFechaCitacion(fechaCitacion);
                citacion.setHora(hora);
                citacion.setLinkMeet(linkMeet);
                citacion.setDetallesCitacion(detalles);
                citacion.setEstado(Estado.PENDIENTE);
                citacion.setFechaEnvio(LocalDateTime.now());
                
                Citacion citacionGuardada = citacionRepo.save(citacion);
                citacionesCreadas.add(citacionGuardada);
                
                // Enviar por Email
                Aspirante aspirante = postulacion.getAspirante();
                String nombreOferta = postulacion.getOferta().getTitulo();
                
                if (emailService != null) {
                    emailService.enviarCitacionEmail(
                        aspirante.getCorreo(),
                        aspirante.getNombre() + " " + aspirante.getApellido(),
                        nombreOferta,
                        fechaCitacion.toString(),
                        hora,
                        linkMeet,
                        reclutador.getNombre() + " " + reclutador.getApellido(),
                        detalles
                    );
                }
                
                citacion.setMensajeEnviado(true);
                citacionRepo.save(citacion);
                notificacionesEnviadas.add(aspirante.getCorreo());
                
                // Crear alerta de notificación
                notificacionService.crearAlertaCitacion(
                    aspirante.getId(),
                    nombreOferta,
                    fechaCitacion.toString(),
                    hora,
                    citacionGuardada.getId()
                );
                
            } catch (Exception e) {
                errores.add("Error para postulación " + postulacionId + ": " + e.getMessage());
            }
        }
        
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("citacionesCreadas", citacionesCreadas.size());
        respuesta.put("notificacionesEnviadas", notificacionesEnviadas);
        respuesta.put("errores", errores);
        respuesta.put("total", postulacionIds.size());
        respuesta.put("exitosas", citacionesCreadas.size());
        
        return respuesta;
    }
    
    // ===== OBTENER CITACIONES =====
    public Citacion obtenerCitacion(Long citacionId, Long usuarioIdActual) {
        Citacion citacion = citacionRepo.findById(citacionId)
            .orElseThrow(() -> new RuntimeException("Citación no encontrada"));
        
        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Admin puede ver todo, aspirante solo sus citaciones, reclutador solo sus citaciones
        if (usuarioActual.getRol() == Usuario.Rol.ASPIRANTE) {
            if (!usuarioActual.getId().equals(citacion.getPostulacion().getAspirante().getId())) {
                throw new RuntimeException("No tienes permisos para ver esta citación");
            }
        } else if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR) {
            if (!usuarioActual.getId().equals(citacion.getReclutador().getId())) {
                throw new RuntimeException("No tienes permisos para ver esta citación");
            }
        }
        
        return citacion;
    }
    
    public List<Citacion> obtenerCitacionesDelReclutador(Long reclutadorId, Long usuarioIdActual) {
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Admin o el mismo reclutador
        if (usuarioActual.getRol() == Usuario.Rol.RECLUTADOR && 
            !usuarioActual.getId().equals(reclutadorId)) {
            throw new RuntimeException("No tienes permisos para ver citaciones de otros reclutadores");
        }
        
        return citacionRepo.findByReclutadorIdOrderByFechaCitacionDesc(reclutadorId);
    }
    
    public List<Citacion> obtenerCitacionesDelAspirante(Long usuarioId, Long usuarioIdActual) {
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // El aspirante solo puede ver sus propias citaciones
        if (usuarioActual.getRol() == Usuario.Rol.ASPIRANTE && 
            !usuarioActual.getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes permisos para ver citaciones de otros usuarios");
        }
        
        return citacionRepo.findByPostulacionUsuarioId(usuarioId);
    }
    
    public List<Citacion> obtenerCitacionesDeOferta(Long ofertaId, Long usuarioIdActual) {
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (usuarioActual.getRol() == Usuario.Rol.ASPIRANTE) {
            throw new RuntimeException("No tienes permisos para ver citaciones de ofertas");
        }
        
        return citacionRepo.findByPostulacionOfertaId(ofertaId);
    }
    
    // ===== CAMBIAR ESTADO =====
    public Citacion cambiarEstadoCitacion(Long citacionId, String nuevoEstado, Long usuarioIdActual) {
        Citacion citacion = citacionRepo.findById(citacionId)
            .orElseThrow(() -> new RuntimeException("Citación no encontrada"));
        
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Solo el reclutador o admin pueden cambiar estado
        if (!usuarioActual.getId().equals(citacion.getReclutador().getId()) && 
            usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new RuntimeException("No tienes permisos para cambiar el estado de esta citación");
        }
        
        try {
            Estado estado = Estado.valueOf(nuevoEstado);
            citacion.setEstado(estado);
            return citacionRepo.save(citacion);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado);
        }
    }
    
    // ===== ELIMINAR CITACIÓN =====
    public void eliminarCitacion(Long citacionId, Long usuarioIdActual) {
        Citacion citacion = citacionRepo.findById(citacionId)
            .orElseThrow(() -> new RuntimeException("Citación no encontrada"));
        
        Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Solo el reclutador o admin pueden eliminar
        if (!usuarioActual.getId().equals(citacion.getReclutador().getId()) && 
            usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new RuntimeException("No tienes permisos para eliminar esta citación");
        }
        
        citacion.setIsActive(false);
        citacionRepo.save(citacion);
    }
}
