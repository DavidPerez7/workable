package com.workable_sb.workable.mapper.empresa;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.dto.empresa.EmpresaDto;
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
    
    // Asignar el NIT proporcionado por el usuario
    empresa.setNitId(empresaDto.getNitId());

    empresa.setNombre(empresaDto.getNombre());
    empresa.setDescripcion(empresaDto.getDescripcion());
    empresa.setNumeroTrabajadores(empresaDto.getNumeroTrabajadores());
    
    Integer municipioId = java.util.Objects.requireNonNull(empresaDto.getMunicipioId(), "El id de municipio no puede ser nulo");
    Municipio municipio = municipioRepository.findById(municipioId)
      .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
    empresa.setMunicipio(municipio);

    Integer categoriaId = java.util.Objects.requireNonNull(empresaDto.getCategoriaId(), "El id de categoría no puede ser nulo");
    EmpresaCategoria categoria = categoriaRepository.findById(categoriaId)
      .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
    empresa.setEmpresaCategoria(categoria);

    return empresa;
  }

  @Override
  public EmpresaDto toDto(Empresa empresa) {
    EmpresaDto dto = new EmpresaDto();
    dto.setNitId(empresa.getNitId());
    dto.setNombre(empresa.getNombre());
    dto.setDescripcion(empresa.getDescripcion());
    dto.setNumeroTrabajadores(empresa.getNumeroTrabajadores());
    dto.setPuntuacion(empresa.getPuntuacion());
  dto.setFechaUnion(empresa.getFechaUnion());
    dto.setCategoriaId(empresa.getEmpresaCategoria().getId());
    dto.setCategoriaNombre(empresa.getEmpresaCategoria().getNombre());
    dto.setMunicipioId(empresa.getMunicipio().getId());
    dto.setMunicipioNombre(empresa.getMunicipio().getNombre());
    return dto;
  }
}
