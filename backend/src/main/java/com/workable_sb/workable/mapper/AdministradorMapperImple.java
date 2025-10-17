package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.AdministradorDto;
import com.workable_sb.workable.models.Administrador;

@Component
public class AdministradorMapperImple implements AdministradorMapper {
    @Override
    public AdministradorDto toDto(Administrador administrador) {
        if (administrador == null) return null;
        AdministradorDto dto = new AdministradorDto();
        dto.setAdministradorId(administrador.getAdministradorId());
        dto.setNombre(administrador.getNombre());
        dto.setCorreo(administrador.getCorreo());
        dto.setRol(administrador.getRol());
        return dto;
    }

    @Override
    public Administrador toEntity(AdministradorDto administradorDto) {
        if (administradorDto == null) return null;
        Administrador administrador = new Administrador();
        administrador.setAdministradorId(administradorDto.getAdministradorId());
        administrador.setNombre(administradorDto.getNombre());
        administrador.setCorreo(administradorDto.getCorreo());
        administrador.setRol(administradorDto.getRol());
        return administrador;
    }
}
