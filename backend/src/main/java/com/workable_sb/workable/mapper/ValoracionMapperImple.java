package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Valoracion;
import com.workable_sb.workable.repositories.EmpresaRepository;
import com.workable_sb.workable.repositories.AspiranteRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class ValoracionMapperImple implements ValoracionMapper {

  private final EmpresaRepository empresaRepository;
  private final AspiranteRepository aspiranteRepository;

  public ValoracionMapperImple(EmpresaRepository empresaRepository, AspiranteRepository aspiranteRepository){
    this.empresaRepository = empresaRepository;
    this.aspiranteRepository = aspiranteRepository;
  }

  @Override
  public Valoracion consult(ValoracionDto valoracionDto){
    Valoracion entity = new Valoracion();

    entity.setDescripcion(valoracionDto.getDesc());
    entity.setPuntuacion(valoracionDto.getPuntu());


    Empresa empresa = empresaRepository.findById(valoracionDto.getEmpresa_id())
    .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
    entity.setEmpresa(empresa);

    Aspirante aspirante = aspiranteRepository.findById(valoracionDto.getAspirante_id())
    .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));
    entity.setAspirante(aspirante);

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
    entity.getAspirante().getAspiranteId(),
    entity.getAspirante().getNombre()
    );
  }
}
