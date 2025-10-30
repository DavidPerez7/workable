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

    empresa.setNombre(empresaDto.getNombre());
    empresa.setDescripcion(empresaDto.getDescripcion());
    empresa.setNumeroTrabajadores(empresaDto.getNumeroTrabajadores());
    
    Municipio municipio = municipioRepository.findById(empresaDto.getMunicipioId()).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
    empresa.setMunicipio(municipio);

    EmpresaCategoria categoria = categoriaRepository.findById(empresaDto.getCategoriaId()).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
    empresa.setEmpresaCategoria(categoria);

    return empresa;
  }

  @Override
  public EmpresaReadDto toDto(Empresa empresa) {
    return new EmpresaReadDto(
      empresa.getNitId(),
      empresa.getNombre(),
      null, // ubicacion - no existe en el modelo
      empresa.getDescripcion(),
      empresa.getNumeroTrabajadores(),
      null, // correoCorporativo - no existe en el modelo
      empresa.getPuntuacion(),
      empresa.getFechaCreacion(),
      empresa.getEmpresaCategoria().getId(),
      empresa.getEmpresaCategoria().getNombre(),
      empresa.getMunicipio().getId(),
      empresa.getMunicipio().getNombre()
      );
  }
}
