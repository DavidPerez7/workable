package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.dto.OfertaReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Modalidad;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.TipoContrato;
import com.workable_sb.workable.repositories.EmpresaRepository;
import com.workable_sb.workable.repositories.ModalidadRepository;
import com.workable_sb.workable.repositories.TipoContratoRepository;

import jakarta.persistence.EntityNotFoundException;


@Component
public class OfertaMapperImple implements OfertaMapper{
  private final ModalidadRepository modalidadRepository;
  private final TipoContratoRepository tipoContratoRepository;
  private final EmpresaRepository empresaRepository;

  public OfertaMapperImple(ModalidadRepository modalidadRepository, TipoContratoRepository tipoContratoRepository,
  EmpresaRepository empresaRepository){
      this.modalidadRepository = modalidadRepository;
      this.tipoContratoRepository = tipoContratoRepository;
      this.empresaRepository = empresaRepository;
  }

  @Override
  public Oferta consult(OfertaDto ofertaDto){
      Oferta oferta = new Oferta();

      oferta.setTitulo(ofertaDto.getTitu());
      oferta.setDescripcion(ofertaDto.getDesc());
      oferta.setUbicacion(ofertaDto.getUbi());
      oferta.setFechaPublicacion(ofertaDto.getFechaPu());
      oferta.setFechaLimite(ofertaDto.getFechaLi());

      Modalidad modalidad = modalidadRepository.findById(ofertaDto.getModalidad_id())
      .orElseThrow(() -> new EntityNotFoundException("modalidad no encontrada"));
      oferta.setModalidad(modalidad);

      TipoContrato tipoContrato = tipoContratoRepository.findById(ofertaDto.getTipoContrato_id())
      .orElseThrow(() -> new EntityNotFoundException("tipo de contrato no encontrado"));
      oferta.setTipoContrato(tipoContrato);

      Empresa empresa = empresaRepository.findById(ofertaDto.getEmpresa_id())
      .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
      oferta.setEmpresa(empresa);

      return oferta;
  }

  @Override
  public OfertaReadDto consulReadDto(Oferta entity){
      return new OfertaReadDto(
          entity.getOferta_id(),
          entity.getTitulo(),
          entity.getDescripcion(),
          entity.getUbicacion(),
          entity.getFechaPublicacion(),
          entity.getFechaLimite(),
          entity.getModalidad().getModalidad_id(),
          entity.getModalidad().getNombre(),
          entity.getTipoContrato().getTipo_contrato_id(),
          entity.getTipoContrato().getNombre(),
          entity.getEmpresa().getNitId(),
          entity.getEmpresa().getNombre()
      );
  }
}
