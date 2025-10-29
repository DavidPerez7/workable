package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.dto.OfertaReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Modalidad;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.TipoContrato;
import com.workable_sb.workable.models.UsrReclutador;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.ModalidadRepository;
import com.workable_sb.workable.repository.MunicipioRepository;
import com.workable_sb.workable.repository.TipoContratoRepository;
import com.workable_sb.workable.repository.UsrReclutadorRepository;

import jakarta.persistence.EntityNotFoundException;


@Component
public class OfertaMapperImpl implements OfertaMapper {
    private final ModalidadRepository modalidadRepository;
    private final TipoContratoRepository tipoContratoRepository;
    private final EmpresaRepository empresaRepository;
    private final MunicipioRepository municipioRepository;
    private final UsrReclutadorRepository reclutadorRepository;

    public OfertaMapperImpl(
            ModalidadRepository modalidadRepository, 
            TipoContratoRepository tipoContratoRepository,
            EmpresaRepository empresaRepository,
            MunicipioRepository municipioRepository,
            UsrReclutadorRepository reclutadorRepository) {
        this.modalidadRepository = modalidadRepository;
        this.tipoContratoRepository = tipoContratoRepository;
        this.empresaRepository = empresaRepository;
        this.municipioRepository = municipioRepository;
        this.reclutadorRepository = reclutadorRepository;
    }

    @Override
    public Oferta toEntity(OfertaDto ofertaDto) {
        Oferta oferta = new Oferta();

        oferta.setTitulo(ofertaDto.getTitu());
        oferta.setDescripcion(ofertaDto.getDesc());
        oferta.setUbicacion(ofertaDto.getUbi());
        oferta.setFechaPublicacion(ofertaDto.getFechaPu());
        oferta.setFechaLimite(ofertaDto.getFechaLi());
        oferta.setSalario(ofertaDto.getSalario());
        
        if (ofertaDto.getEstado() != null) {
            oferta.setEstado(ofertaDto.getEstado());
        }
        
        if (ofertaDto.getMunicipio_id() != null) {
            Municipio municipio = municipioRepository.findById(ofertaDto.getMunicipio_id())
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            oferta.setMunicipio(municipio);
        }

        if (ofertaDto.getModalidad_id() != null) {
            Modalidad modalidad = modalidadRepository.findById(ofertaDto.getModalidad_id())
                .orElseThrow(() -> new EntityNotFoundException("Modalidad no encontrada"));
            oferta.setModalidad(modalidad);
        }

        if (ofertaDto.getTipoContrato_id() != null) {
            TipoContrato tipoContrato = tipoContratoRepository.findById(ofertaDto.getTipoContrato_id())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de contrato no encontrado"));
            oferta.setTipoContrato(tipoContrato);
        }

        if (ofertaDto.getEmpresa_id() != null) {
            Empresa empresa = empresaRepository.findById(ofertaDto.getEmpresa_id())
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
            oferta.setEmpresa(empresa);
        }
        
        if (ofertaDto.getReclutador_id() != null) {
            UsrReclutador reclutador = reclutadorRepository.findById(ofertaDto.getReclutador_id())
                .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
            oferta.setReclutador(reclutador);
        }

        return oferta;
    }

    @Override
    public OfertaReadDto toDto(Oferta entity) {
        OfertaReadDto dto = new OfertaReadDto();
        dto.setId(entity.getId());
        dto.setTitu(entity.getTitulo());
        dto.setDesc(entity.getDescripcion());
        dto.setUbi(entity.getUbicacion());
        dto.setFechaPub(entity.getFechaPublicacion());
        dto.setFechLim(entity.getFechaLimite());
        dto.setSalario(entity.getSalario());
        dto.setEstado(entity.getEstado());

        if (entity.getModalidad() != null) {
            dto.setModal_id(entity.getModalidad().getId());
            dto.setModalNomb(entity.getModalidad().getNombre());
        }

        if (entity.getTipoContrato() != null) {
            dto.setTipoCon_id(entity.getTipoContrato().getId());
            dto.setTipoConNomb(entity.getTipoContrato().getNombre());
        }

        if (entity.getEmpresa() != null) {
            dto.setEmp_id(entity.getEmpresa().getNitId());
            dto.setEmpNomb(entity.getEmpresa().getNombre());
        }
        
        if (entity.getReclutador() != null) {
            dto.setReclut_id(entity.getReclutador().getId());
            dto.setReclutNomb(entity.getReclutador().getNombre());
        }

        return dto;
    }
}
