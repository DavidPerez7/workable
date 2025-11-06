package com.workable_sb.workable.service.dato;

import java.util.Objects;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.dato.DataEstudioDto;
import com.workable_sb.workable.mapper.dato.DataEstudioMapper;
import com.workable_sb.workable.models.DataEstudio;
import com.workable_sb.workable.repository.DataEstudioRepository;

@Service
public class DatoEstudioServiceImple implements DatoEstudioService {

    private final DataEstudioRepository datoEstudioRepository;
    private final DataEstudioMapper datoEstudioMapper;

    public DatoEstudioServiceImple(DataEstudioRepository datoEstudioRepository, DataEstudioMapper datoEstudioMapper) {
        this.datoEstudioRepository = datoEstudioRepository;
        this.datoEstudioMapper = datoEstudioMapper;
    }

    @Override
    public DataEstudioDto crearyupdate(DataEstudioDto datoDataEstudioDto) {
        DataEstudio datoEstudio = datoEstudioMapper.toEntity(datoDataEstudioDto);
    datoEstudio = Objects.requireNonNull(datoEstudio, "No se pudo mapear la entidad DataEstudio");
    DataEstudio guardar = datoEstudioRepository.save(datoEstudio);
    guardar = Objects.requireNonNull(guardar, "No se pudo guardar la entidad DataEstudio");
        return datoEstudioMapper.toDto(guardar);
    }

    @Override
    public DataEstudioDto buscarPorId(Integer Est_id) {
    Integer safeId = Objects.requireNonNull(Est_id, "El id no puede ser nulo");
    return datoEstudioRepository.findById(safeId)
                .map(datoEstudioMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Dato de estudio no encontrado con id: " + Est_id));
    }

    @Override
    public List<DataEstudioDto> listarTodos() {
        return datoEstudioRepository.findAll()
                .stream()
                .map(datoEstudioMapper::toDto)
                .toList();
    }

    @Override
    public void eliminar(Integer Est_id) {
    Integer safeId = Objects.requireNonNull(Est_id, "El id no puede ser nulo");
    datoEstudioRepository.deleteById(safeId);
    }
}
