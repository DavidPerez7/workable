package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.InfoAspiranteDto;
import com.workable_sb.workable.mapper.InfoPersonalMapper;
import com.workable_sb.workable.models.InfoAspirante;
import com.workable_sb.workable.repository.InfoPersonalRepository;
import com.workable_sb.workable.repository.InfoPersonalRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class InfoPersonalServiceImple implements InfoPersonalService {
    
    private final InfoPersonalRepository infoPersonalRepository;
    private final InfoPersonalMapper infoPersonalMapper;

    public InfoPersonalServiceImple(InfoPersonalRepository infoPersonalRepository, InfoPersonalMapper infoPersonalMapper) {
        this.infoPersonalRepository = infoPersonalRepository;
        this.infoPersonalMapper = infoPersonalMapper;
    }

    @Override
    public InfoAspiranteDto crearyupdate(InfoAspiranteDto infoPersonalDto) {
        InfoAspirante infoPersonal = infoPersonalMapper.consult(infoPersonalDto);
        InfoAspirante guardar = infoPersonalRepository.save(infoPersonal);
        return infoPersonalMapper.consultDto(guardar);
    }

    @Override
    public InfoAspiranteDto buscarporId(Integer infoPersonal_id) {
        return infoPersonalRepository.findById(infoPersonal_id)
        .map(infoPersonalMapper::consultDto)
        .orElseThrow(() -> new EntityNotFoundException("Empleado no encontrado"));
    }

    @Override
    public void eliminarPersonal(Integer infoPersonal_id) {
        infoPersonalRepository.deleteById(infoPersonal_id);
    }

    @Override
    public List<InfoAspiranteDto> listPersonal() {
        return infoPersonalRepository.findAll()
        .stream()
        .map(infoPersonalMapper::consultDto)
        .collect(Collectors.toList());
    }
}
