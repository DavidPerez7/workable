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

    entity.setDescripcion(valoracionDto.getDesc());
    entity.setPuntuacion(valoracionDto.getPuntu());


    Empresa empresa = empresaRepository.findById(valoracionDto.getEmpresa_id())
    .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
    entity.setEmpresa(empresa);

    Usuario usuario = usuarioRepository.findById(valoracionDto.getAspirante_id())
    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    entity.setUsuario(usuario);

    return entity;
  }

  @Override
  public ValoracionReadDto toDto(Valoracion entity){
    ValoracionReadDto dto = new ValoracionReadDto();
    dto.setId(entity.getId());
    dto.setDec(entity.getDescripcion());
    dto.setPuntu(entity.getPuntuacion());
    dto.setFechaVal(entity.getFecha_valoracion());
    
    if (entity.getEmpresa() != null) {
      dto.setEmpr_id(entity.getEmpresa().getNitId());
      dto.setEmprNomb(entity.getEmpresa().getNombre());
    }
    
    if (entity.getUsuario() != null) {
      dto.setAsp_id(entity.getUsuario().getId());
      dto.setAspNomb(entity.getUsuario().getNombre());
    }
    
    return dto;
  }
}
