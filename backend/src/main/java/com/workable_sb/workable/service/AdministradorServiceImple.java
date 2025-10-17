package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.AdministradorDto;
import com.workable_sb.workable.mapper.AdministradorMapper;
import com.workable_sb.workable.models.Administrador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministradorServiceImple implements AdministradorService {
    @Autowired
    private AdministradorMapper administradorMapper;
    @Autowired
    private com.workable_sb.workable.repository.AdministradorRepository administradorRepository;

    @Override
    public AdministradorDto crearAdministrador(AdministradorDto administradorDto) {
        var administrador = administradorMapper.toEntity(administradorDto);
        var guardado = administradorRepository.save(administrador);
        return administradorMapper.toDto(guardado);
    }

    @Override
    public AdministradorDto obtenerAdministradorPorId(Integer id) {
        return administradorRepository.findById(id)
            .map(administradorMapper::toDto)
            .orElse(null);
    }

    @Override
    public List<AdministradorDto> listarAdministradores() {
        return administradorRepository.findAll().stream()
            .map(administradorMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public AdministradorDto actualizarAdministrador(Integer id, AdministradorDto administradorDto) {
        return administradorRepository.findById(id)
            .map(administrador -> {
                administrador.setNombre(administradorDto.getNombre());
                administrador.setCorreo(administradorDto.getCorreo());
                administrador.setRol(administradorDto.getRol());
                var actualizado = administradorRepository.save(administrador);
                return administradorMapper.toDto(actualizado);
            })
            .orElse(null);
    }

    @Override
    public void eliminarAdministrador(Integer id) {
        administradorRepository.deleteById(id);
    }
}
