package com.workable_sb.workable.service.notificacion;

import java.util.Objects;

import com.workable_sb.workable.dto.notificacion.NotificacionDto;
import com.workable_sb.workable.mapper.notificacion.NotificacionMapper;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionServiceImple implements NotificacionService {
    private final NotificacionMapper notificacionMapper;
    private final com.workable_sb.workable.repository.NotificacionRepository notificacionRepository;

    public NotificacionServiceImple(NotificacionMapper notificacionMapper, com.workable_sb.workable.repository.NotificacionRepository notificacionRepository) {
        this.notificacionMapper = notificacionMapper;
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public NotificacionDto crearNotificacion(NotificacionDto notificacionDto) {
        var notificacion = notificacionMapper.toEntity(notificacionDto);
    notificacion = Objects.requireNonNull(notificacion, "No se pudo mapear la entidad Notificacion");
    var guardada = notificacionRepository.save(notificacion);
    guardada = Objects.requireNonNull(guardada, "No se pudo guardar la entidad Notificacion");
        return notificacionMapper.toDto(guardada);
    }

    @Override
    public NotificacionDto obtenerNotificacionPorId(Integer id) {
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return notificacionRepository.findById(safeId)
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
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return notificacionRepository.findById(safeId)
            .map(notificacion -> {
                notificacion.setLeida(true);
                var actualizada = notificacionRepository.save(notificacion);
                return notificacionMapper.toDto(actualizada);
            })
            .orElse(null);
    }

    @Override
    public void eliminarNotificacion(Integer id) {
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    notificacionRepository.deleteById(safeId);
    }
}
