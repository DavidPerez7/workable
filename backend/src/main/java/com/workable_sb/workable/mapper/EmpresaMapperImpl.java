package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;
import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.EmpresaCategoriaRepository;
import com.workable_sb.workable.repository.MunicipioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class EmpresaMapperImpl implements EmpresaMapper {
  private final MunicipioRepository municipioRepository;
  private final EmpresaCategoriaRepository categoriaRepository;

  public EmpresaMapperImpl(MunicipioRepository municipioRepository, EmpresaCategoriaRepository categoriaRepository) {
    this.municipioRepository = municipioRepository;
    this.categoriaRepository = categoriaRepository;
  }

  @Override
  public Empresa toEntity(EmpresaDto empresaDto) {
    Empresa empresa = new Empresa();

    empresa.setNombre(empresaDto.getNom());
    empresa.setDescripcion(empresaDto.getDesc());
    empresa.setNumeroTrabajadores(empresaDto.getNumTrab());
    
    Municipio municipio = municipioRepository.findById(empresaDto.getMunici_id()).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
    empresa.setMunicipio(municipio);

    EmpresaCategoria categoria = categoriaRepository.findById(empresaDto.getCat_id()).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
    empresa.setEmpresaCategoria(categoria);

    return empresa;
  }

  @Override
  public EmpresaReadDto toDto(Empresa empresa) {
    return new EmpresaReadDto(
      empresa.getNitId(),
      empresa.getNombre(),
      null, // ubi - no existe en el modelo
      empresa.getDescripcion(),
      empresa.getNumeroTrabajadores(),
      null, // correoCorp - no existe en el modelo
      empresa.getPuntuacion(),
      empresa.getFechaCreacion(),
      empresa.getEmpresaCategoria().getId(),
      empresa.getEmpresaCategoria().getNombre(),
      empresa.getMunicipio().getId(),
      empresa.getMunicipio().getNombre()
      );
  }
}
