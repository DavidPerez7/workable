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
public class ValoracionMapperImple implements ValoracionMapper {

  private final EmpresaRepository empresaRepository;
  private final UsuarioRepository usuarioRepository;

  public ValoracionMapperImple(EmpresaRepository empresaRepository, UsuarioRepository usuarioRepository){
    this.empresaRepository = empresaRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public Valoracion consult(ValoracionDto valoracionDto){
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
  public ValoracionReadDto consultReadDto(Valoracion entity){
    return new ValoracionReadDto(
    entity.getValoracion_id(),
    entity.getDescripcion(),
    entity.getPuntuacion(),
    entity.getFecha_valoracion(),
    entity.getEmpresa().getNitId(),
    entity.getEmpresa().getNombre(),
  entity.getUsuario().getId(),
  entity.getUsuario().getNombre()
    );
  }
}
