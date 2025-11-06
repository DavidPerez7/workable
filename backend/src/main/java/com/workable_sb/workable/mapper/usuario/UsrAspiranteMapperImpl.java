package com.workable_sb.workable.mapper.usuario;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.usuario.UsrAspiranteDto;
import com.workable_sb.workable.dto.usuario.UsrAspiranteReadDto;
// Genero ahora se representa con un enum dentro de UsrAspirante
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.UsrAspirante;
import com.workable_sb.workable.repository.MunicipioRepository;
import jakarta.persistence.EntityNotFoundException;

@Component
public class UsrAspiranteMapperImpl implements UsrAspiranteMapper {

    private final MunicipioRepository municipioRepository;

    public UsrAspiranteMapperImpl(MunicipioRepository municipioRepository) {
        this.municipioRepository = municipioRepository;
    }

    @Override
    public UsrAspirante toEntity(UsrAspiranteDto dto) {
        UsrAspirante aspirante = new UsrAspirante();
        
        // Mapear campos de Usuario
        aspirante.setId(dto.getId());
        aspirante.setNombre(dto.getNombre());
        aspirante.setCorreo(dto.getCorreo());
        aspirante.setClave(dto.getClave());
        aspirante.setTelefono(dto.getTelefono());
        aspirante.setFotoPerfilUrl(dto.getFotoPerfilUrl());
        aspirante.setRol(Usuario.RolUsr.ASPIRANTE);  // Rol por defecto
        
        // Mapear campos específicos de UsrAspirante
        aspirante.setApellido(dto.getApellido());
        aspirante.setResumenProfesional(dto.getResumenProfesional());
        aspirante.setFechaNacimiento(dto.getFechaNacimiento());

        if (dto.getMunicipio_id() != null) {
            Integer municipioId = java.util.Objects.requireNonNull(dto.getMunicipio_id(), "El id de municipio no puede ser nulo");
            Municipio municipio = municipioRepository.findById(municipioId)
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            aspirante.setMunicipio(municipio);
        }

        // Mapear genero desde el nombre del enum (dto.getGenero_nom()) hacia el enum anidado
        if (dto.getGenero_nom() != null) {
            try {
                // Usamos el enum anidado definido en UsrAspirante
                UsrAspirante.GeneroUsr generoEnum = UsrAspirante.GeneroUsr.valueOf(dto.getGenero_nom().toUpperCase());
                aspirante.setGenero(generoEnum);
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Género no válido: " + dto.getGenero_nom());
            }
        }

        return aspirante;
    }

    @Override
    public UsrAspiranteDto toDto(UsrAspirante entity) {
        UsrAspiranteDto dto = new UsrAspiranteDto();

        // Mapear campos de Usuario
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCorreo(entity.getCorreo());
        dto.setClave(entity.getClave());  // Incluye clave para actualizaciones
        dto.setTelefono(entity.getTelefono());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        
        // Mapear campos específicos de UsrAspirante
        dto.setApellido(entity.getApellido());
        dto.setResumenProfesional(entity.getResumenProfesional());
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipio_id(entity.getMunicipio().getId());
            dto.setMunicipio_nom(entity.getMunicipio().getNombre());
        }
        // Si genero es un enum, solo lo asignamos directamente como String
        if (entity.getGenero() != null) {
            dto.setGenero_nom(entity.getGenero().toString());
            dto.setGenero_id(null);
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
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        // NO incluye clave por seguridad
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipioId(entity.getMunicipio().getId());
            dto.setMunicipioNombre(entity.getMunicipio().getNombre());
        }
        
        if (entity.getGenero() != null) {
            dto.setGeneroNombre(entity.getGenero().toString());
            dto.setGeneroId(null);
        }
        
        return dto;
    }
}
