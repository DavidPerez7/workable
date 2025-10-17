package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.InfoPersonalDto;
import com.workable_sb.workable.mapper.InfoPersonalMapper;
import com.workable_sb.workable.models.InfoPersonal;
import com.workable_sb.workable.repositories.InfoPersonalRepository;

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
    public InfoPersonalDto crearyupdate(InfoPersonalDto infoPersonalDto) {
        InfoPersonal infoPersonal = infoPersonalMapper.consult(infoPersonalDto);
        InfoPersonal guardar = infoPersonalRepository.save(infoPersonal);
        return infoPersonalMapper.consultDto(guardar);
    }

    @Override
    public InfoPersonalDto buscarporId(Integer infoPersonal_id) {
        return infoPersonalRepository.findById(infoPersonal_id)
        .map(infoPersonalMapper::consultDto)
        .orElseThrow(() -> new EntityNotFoundException("Empleado no encontrado"));
    }

    @Override
    public void eliminarPersonal(Integer infoPersonal_id) {
        infoPersonalRepository.deleteById(infoPersonal_id);
    }

    @Override
    public List<InfoPersonalDto> listPersonal() {
        return infoPersonalRepository.findAll()
        .stream()
        .map(infoPersonalMapper::consultDto)
        .collect(Collectors.toList());
    }
}
