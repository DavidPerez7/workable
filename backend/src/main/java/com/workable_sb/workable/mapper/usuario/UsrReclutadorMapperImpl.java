package com.workable_sb.workable.mapper.usuario;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.usuario.UsrReclutadorDto;
import com.workable_sb.workable.dto.usuario.UsrReclutadorReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.UsrReclutador;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class UsrReclutadorMapperImpl implements UsrReclutadorMapper {
    
    private final MunicipioRepository municipioRepository;
    private final EmpresaRepository empresaRepository;

    public UsrReclutadorMapperImpl(
            MunicipioRepository municipioRepository,
            EmpresaRepository empresaRepository) {
        this.municipioRepository = municipioRepository;
        this.empresaRepository = empresaRepository;
    }

    @Override
    public UsrReclutador toEntity(UsrReclutadorDto dto) {
        if (dto == null) return null;
        
        UsrReclutador reclutador = new UsrReclutador();
        
        // Mapear campos de Usuario (padre)
        reclutador.setId(dto.getId());
        reclutador.setNombre(dto.getNombre());
        reclutador.setCorreo(dto.getCorreo());
        reclutador.setClave(dto.getClave());
        reclutador.setTelefono(dto.getTelefono());
        reclutador.setFotoPerfilUrl(dto.getFotoPerfilUrl());
        reclutador.setRol(Usuario.RolUsr.RECLUTADOR);  // Rol por defecto
        
        if (dto.getMunicipio_id() != null) {
            Integer municipioId = java.util.Objects.requireNonNull(dto.getMunicipio_id(), "El id de municipio no puede ser nulo");
            Municipio municipio = municipioRepository.findById(municipioId)
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            reclutador.setMunicipio(municipio);
        }
        
        if (dto.getEmpresa_nit_id() != null) {
            Long empresaNitId = java.util.Objects.requireNonNull(dto.getEmpresa_nit_id(), "El id de empresa no puede ser nulo");
            Empresa empresa = empresaRepository.findById(empresaNitId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
            reclutador.setEmpresa(empresa);
        }
        
        return reclutador;
    }

    @Override
    public UsrReclutadorDto toDto(UsrReclutador entity) {
        if (entity == null) return null;
        
        UsrReclutadorDto dto = new UsrReclutadorDto();
        
        // Mapear campos de Usuario (padre)
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCorreo(entity.getCorreo());
        dto.setClave(entity.getClave());  // Incluye clave para actualizaciones
        dto.setTelefono(entity.getTelefono());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipio_id(entity.getMunicipio().getId());
            dto.setMunicipio_nom(entity.getMunicipio().getNombre());
        }
        
        if (entity.getEmpresa() != null) {
            dto.setEmpresa_nit_id(entity.getEmpresa().getNitId());
            dto.setEmpresa_nom(entity.getEmpresa().getNombre());
        }
        
        return dto;
    }
    
    @Override
    public UsrReclutadorReadDto toReadDto(UsrReclutador entity) {
        if (entity == null) return null;
        
        UsrReclutadorReadDto dto = new UsrReclutadorReadDto();
        
        // Mapear campos de Usuario (padre) SIN clave
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCorreo(entity.getCorreo());
        dto.setTelefono(entity.getTelefono());
        dto.setFotoPerfilUrl(entity.getFotoPerfilUrl());
        // NO incluir clave por seguridad
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipioId(entity.getMunicipio().getId());
            dto.setMunicipioNombre(entity.getMunicipio().getNombre());
        }
        
        if (entity.getEmpresa() != null) {
            dto.setEmpresaId(entity.getEmpresa().getNitId());
            dto.setEmpresaNombre(entity.getEmpresa().getNombre());
        }
        
        return dto;
    }
}
