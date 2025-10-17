package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;
import com.workable_sb.workable.models.Categoria;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repositories.CategoriaRepository;
import com.workable_sb.workable.repositories.MunicipioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class EmpresaMapperImple implements EmpresaMapper{
  private final MunicipioRepository municipioRepository;
  private final CategoriaRepository categoriaRepository;

  public EmpresaMapperImple(MunicipioRepository municipioRepository, CategoriaRepository categoriaRepository) {
    this.municipioRepository = municipioRepository;
    this.categoriaRepository = categoriaRepository;
  }

  @Override
  public Empresa consultEntity(EmpresaDto empresaDto) {
    Empresa empresa = new Empresa();

    empresa.setNombre(empresaDto.getNom());
    empresa.setUbicacion(empresaDto.getUbi());
    empresa.setDescripcion(empresaDto.getDesc());
    empresa.setNumeroTrabajadores(empresaDto.getNumTrab());
    empresa.setCorreoCorporativo(empresaDto.getCorreoCorp());
    
    Municipio municipio = municipioRepository.findById(empresaDto.getMunici_id()).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
    empresa.setMunicipio(municipio);

    Categoria categoria = categoriaRepository.findById(empresaDto.getCat_id()).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
    empresa.setCategoria(categoria);

    return empresa;
  }

  @Override
  public EmpresaReadDto consultReadDto(Empresa empresa) {
    return new EmpresaReadDto(
      empresa.getNitId(),
      empresa.getNombre(),
      empresa.getUbicacion(),
      empresa.getDescripcion(),
      empresa.getNumeroTrabajadores(),
      empresa.getCorreoCorporativo(),
      empresa.getPuntuacion(),
      empresa.getFechaCreacion(),
      empresa.getCategoria().getCategoria_id(),
      empresa.getCategoria().getNombre(),
      empresa.getMunicipio().getMunicipio_id(),
      empresa.getMunicipio().getNombre()
      );
  }
}
