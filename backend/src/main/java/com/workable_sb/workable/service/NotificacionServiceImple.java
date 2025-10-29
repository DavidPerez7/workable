package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.NotificacionDto;
import com.workable_sb.workable.mapper.NotificacionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionServiceImple implements NotificacionService {
    @Autowired
    private NotificacionMapper notificacionMapper;
    @Autowired
    private com.workable_sb.workable.repository.NotificacionRepository notificacionRepository;

    @Override
    public NotificacionDto crearNotificacion(NotificacionDto notificacionDto) {
        var notificacion = notificacionMapper.toEntity(notificacionDto);
        var guardada = notificacionRepository.save(notificacion);
        return notificacionMapper.toDto(guardada);
    }

    @Override
    public NotificacionDto obtenerNotificacionPorId(Integer id) {
        return notificacionRepository.findById(id)
            .map(notificacionMapper::toDto)
            .orElse(null);
    }

    @Override
    public List<NotificacionDto> listarNotificacionesPorUsuario(Integer usuarioId) {
        return notificacionRepository.findByUsuarioId(usuarioId).stream()
            .map(notificacionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public NotificacionDto marcarComoLeida(Integer id) {
        return notificacionRepository.findById(id)
            .map(notificacion -> {
                notificacion.setLeida(true);
                var actualizada = notificacionRepository.save(notificacion);
                return notificacionMapper.toDto(actualizada);
            })
            .orElse(null);
    }

    @Override
    public void eliminarNotificacion(Integer id) {
        notificacionRepository.deleteById(id);
    }
}
