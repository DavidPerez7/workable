package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Valoracion;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class ValoracionMapperImpl implements ValoracionMapper {

  private final EmpresaRepository empresaRepository;
  private final UsuarioRepository usuarioRepository;

  public ValoracionMapperImpl(EmpresaRepository empresaRepository, UsuarioRepository usuarioRepository) {
    this.empresaRepository = empresaRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public Valoracion toEntity(ValoracionDto valoracionDto){
    Valoracion entity = new Valoracion();

    entity.setDescripcion(valoracionDto.getDescripcion());
    entity.setPuntuacion(valoracionDto.getPuntuacion());


    Empresa empresa = empresaRepository.findById(valoracionDto.getEmpresaId())
    .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
    entity.setEmpresa(empresa);

    Usuario usuario = usuarioRepository.findById(valoracionDto.getUsuarioId())
    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    entity.setUsuario(usuario);

    return entity;
  }

  @Override
  public ValoracionReadDto toDto(Valoracion entity){
    ValoracionReadDto dto = new ValoracionReadDto();
    dto.setId(entity.getId());
    dto.setDescripcion(entity.getDescripcion());
    dto.setPuntuacion(entity.getPuntuacion());
    dto.setFechaValoracion(entity.getFecha_valoracion());
    
    if (entity.getEmpresa() != null) {
      dto.setEmpresaId(entity.getEmpresa().getNitId());
      dto.setEmpresaNombre(entity.getEmpresa().getNombre());
    }
    
    if (entity.getUsuario() != null) {
      dto.setUsuarioId(entity.getUsuario().getId());
      dto.setUsuarioNombre(entity.getUsuario().getNombre());
    }
    
    return dto;
  }
}
