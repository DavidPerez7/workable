package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.EstudioDto;
import com.workable_sb.workable.mapper.DatoEstudioMapper;
import com.workable_sb.workable.models.DataEstudio;
import com.workable_sb.workable.repository.DatoEstudioRepository;

@Service
public class DatoEstudioServiceImple implements DatoEstudioService {

    private final DatoEstudioRepository datoEstudioRepository;
    private final DatoEstudioMapper datoEstudioMapper;

    public DatoEstudioServiceImple(DatoEstudioRepository datoEstudioRepository, DatoEstudioMapper datoEstudioMapper) {
        this.datoEstudioRepository = datoEstudioRepository;
        this.datoEstudioMapper = datoEstudioMapper;
    }

    @Override
    public EstudioDto crearyupdate(EstudioDto datoEstudioDto) {
        DataEstudio datoEstudio = datoEstudioMapper.consult(datoEstudioDto);
        DataEstudio guardar = datoEstudioRepository.save(datoEstudio);
        return datoEstudioMapper.consultDto(guardar);
    }

    @Override
    public EstudioDto buscarPorId(Integer Est_id) {
        return datoEstudioRepository.findById(Est_id)
                .map(datoEstudioMapper::consultDto)
                .orElseThrow(() -> new RuntimeException("Dato de estudio no encontrado con id: " + Est_id));
    }

    @Override
    public List<EstudioDto> listarTodos() {
        return datoEstudioRepository.findAll()
                .stream()
                .map(datoEstudioMapper::consultDto)
                .toList();
    }

    @Override
    public void eliminar(Integer Est_id) {
        datoEstudioRepository.deleteById(Est_id);
    }
}
