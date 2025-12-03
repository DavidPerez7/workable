package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.NotificacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
public class NotificacionService {
    @Autowired
    private NotificacionRepo notificacionRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    //READ
    public Optional<Notificacion> getById(Long id) {
        return notificacionRepo.findById(id);
    }

    public Optional<Notificacion> getByTitulo(String titulo) {
        return notificacionRepo.findByTitulo(titulo);
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

    public Long getNoLeidas(Long usuarioId, Boolean leida) {
        return notificacionRepo.countByUsuarioIdAndLeida(usuarioId, leida);
    }

    public List<Notificacion> getActiveByUsuarioId(Long usuarioId, Boolean isActive) {
        return notificacionRepo.findByUsuarioIdAndIsActive(usuarioId, isActive);
    }

    public List<Notificacion> getByUsuarioOrderByFechaDesc(Long usuarioId) {
        return notificacionRepo.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    //CREATE
    public Notificacion create(Notificacion request) {

        Usuario usuario = usuarioRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("user not found"));
        request.setUsuario(usuario);
        return notificacionRepo.save(request);
    }

    //UPDATE
    public Notificacion update(Long id, Notificacion request) {
        Notificacion existingNotificacion  = notificacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Notificacion not found"));

        existingNotificacion.setTipo(request.getTipo());
        existingNotificacion.setTitulo(request.getTitulo());
        existingNotificacion.setMensaje(request.getMensaje());
        existingNotificacion.setUrl(request.getUrl());
        existingNotificacion.setLeida(request.getLeida());
        existingNotificacion.setIsActive(request.getIsActive());
        
        Usuario usuario = usuarioRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("user not found"));
        existingNotificacion.setUsuario(usuario);

        return notificacionRepo.save(existingNotificacion);
    }

    //DELETE
    public void delete(Long id) {
        Notificacion existingNotificacion  = notificacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Notificacion not found"));
        notificacionRepo.delete(existingNotificacion);
    }

}
