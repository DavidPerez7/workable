package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import com.workable_sb.workable.models.Genero;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.UsrAspirante;
import com.workable_sb.workable.repository.GeneroRepository;
import com.workable_sb.workable.repository.MunicipioRepository;

@Component
public class UsrAspiranteMapperImpl implements UsrAspiranteMapper {

    private final MunicipioRepository municipioRepository;
    private final GeneroRepository generoRepository;

    public UsrAspiranteMapperImpl(GeneroRepository generoRepository, MunicipioRepository municipioRepository) {
        this.generoRepository = generoRepository;
        this.municipioRepository = municipioRepository;
    }

    @Override
    public UsrAspirante toEntity(UsrAspiranteDto dto) {
        UsrAspirante aspirante = new UsrAspirante();
        
        // Mapear campos de Usuario (padre)
        aspirante.setId(dto.getId());
        aspirante.setNombre(dto.getNombre());
        aspirante.setCorreo(dto.getCorreo());
        aspirante.setClave(dto.getClave());
        aspirante.setTelefono(dto.getTelefono());
        aspirante.setFotoPerfilUrl(dto.getFotoPerfilUrl());
        aspirante.setRol("ASPIRANTE");  // Rol por defecto
        
        // Mapear campos específicos de UsrAspirante
        aspirante.setApellido(dto.getApellido());
        aspirante.setResumenProfesional(dto.getResumenProfesional());
        aspirante.setFechaNacimiento(dto.getFechNac());

        if (dto.getMunicipio_id() != null) {
            Municipio municipio = municipioRepository.findById(dto.getMunicipio_id())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            aspirante.setMunicipio(municipio);
        }

        if (dto.getGenero_id() != null) {
            Genero genero = generoRepository.findById(dto.getGenero_id())
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));
            aspirante.setGenero(genero);
        }

        return aspirante;
    }

    @Override
    public UsrAspiranteDto toDto(UsrAspirante entity) {
        UsrAspiranteDto dto = new UsrAspiranteDto();
        
        // Mapear campos de Usuario (padre)
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCorreo(entity.getCorreo());
        dto.setClave(entity.getClave());  // Incluye clave para actualizaciones
        dto.setTelefono(entity.getTelefono());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        
        // Mapear campos específicos de UsrAspirante
        dto.setApellido(entity.getApellido());
        dto.setResumenProfesional(entity.getResumenProfesional());
        dto.setFechNac(entity.getFechaNacimiento());
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipio_id(entity.getMunicipio().getId());
            dto.setMunicipio_nom(entity.getMunicipio().getNombre());
        }
        
        if (entity.getGenero() != null) {
            dto.setGenero_id(entity.getGenero().getGenero_id());
            dto.setGenero_nom(entity.getGenero().getNombre());
        }
        
        return dto;
    }
    
    @Override
    public UsrAspiranteReadDto toReadDto(UsrAspirante entity) {
        if (entity == null) return null;
        
        UsrAspiranteReadDto dto = new UsrAspiranteReadDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setCorreo(entity.getCorreo());
        dto.setResumenProfesional(entity.getResumenProfesional());
        dto.setTelefono(entity.getTelefono());
        dto.setFechNac(entity.getFechaNacimiento());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        // NO incluye clave por seguridad
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipio_id(entity.getMunicipio().getId());
            dto.setMunicipio_nom(entity.getMunicipio().getNombre());
        }
        
        if (entity.getGenero() != null) {
            dto.setGenero_id(entity.getGenero().getGenero_id());
            dto.setGenero_nom(entity.getGenero().getNombre());
        }
        
        return dto;
    }
}
