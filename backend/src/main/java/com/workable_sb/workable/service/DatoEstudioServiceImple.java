package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.DataEstudioDto;
import com.workable_sb.workable.mapper.DataEstudioMapper;
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
        DataEstudio guardar = datoEstudioRepository.save(datoEstudio);
        return datoEstudioMapper.toDto(guardar);
    }

    @Override
    public DataEstudioDto buscarPorId(Integer Est_id) {
        return datoEstudioRepository.findById(Est_id)
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
        datoEstudioRepository.deleteById(Est_id);
    }
}
