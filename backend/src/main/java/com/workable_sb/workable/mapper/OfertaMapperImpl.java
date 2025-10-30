package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.OfertaDto;
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
        
        // Si tiene ID, es actualización
        if (ofertaDto.getId() != null) {
            oferta.setId(ofertaDto.getId());
        }

        oferta.setTitulo(ofertaDto.getTitulo());
        oferta.setDescripcion(ofertaDto.getDescripcion());
        oferta.setUbicacion(ofertaDto.getUbicacion());
        oferta.setFechaPublicacion(ofertaDto.getFechaPublicacion());
        oferta.setFechaLimite(ofertaDto.getFechaLimite());
        oferta.setSalario(ofertaDto.getSalario());
        
        if (ofertaDto.getEstado() != null) {
            oferta.setEstado(ofertaDto.getEstado());
        }
        
        if (ofertaDto.getMunicipioId() != null) {
            Municipio municipio = municipioRepository.findById(ofertaDto.getMunicipioId())
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            oferta.setMunicipio(municipio);
        }

        if (ofertaDto.getModalidadId() != null) {
            Modalidad modalidad = modalidadRepository.findById(ofertaDto.getModalidadId())
                .orElseThrow(() -> new EntityNotFoundException("Modalidad no encontrada"));
            oferta.setModalidad(modalidad);
        }

        if (ofertaDto.getTipoContratoId() != null) {
            TipoContrato tipoContrato = tipoContratoRepository.findById(ofertaDto.getTipoContratoId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de contrato no encontrado"));
            oferta.setTipoContrato(tipoContrato);
        }

        if (ofertaDto.getEmpresaId() != null) {
            Empresa empresa = empresaRepository.findById(ofertaDto.getEmpresaId())
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
            oferta.setEmpresa(empresa);
        }
        
        if (ofertaDto.getReclutadorId() != null) {
            UsrReclutador reclutador = reclutadorRepository.findById(ofertaDto.getReclutadorId())
                .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
            oferta.setReclutador(reclutador);
        }

        return oferta;
    }

    @Override
    public OfertaDto toDto(Oferta entity) {
        OfertaDto dto = new OfertaDto();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setUbicacion(entity.getUbicacion());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setFechaLimite(entity.getFechaLimite());
        dto.setSalario(entity.getSalario());
        dto.setEstado(entity.getEstado());

        if (entity.getModalidad() != null) {
            dto.setModalidadId(entity.getModalidad().getId());
            dto.setModalidadNombre(entity.getModalidad().getNombre());
        }

        if (entity.getTipoContrato() != null) {
            dto.setTipoContratoId(entity.getTipoContrato().getId());
            dto.setTipoContratoNombre(entity.getTipoContrato().getNombre());
        }

        if (entity.getEmpresa() != null) {
            dto.setEmpresaId(entity.getEmpresa().getNitId());
            dto.setEmpresaNombre(entity.getEmpresa().getNombre());
        }
        
        if (entity.getReclutador() != null) {
            dto.setReclutadorId(entity.getReclutador().getId());
            dto.setReclutadorNombre(entity.getReclutador().getNombre());
        }
        
        if (entity.getMunicipio() != null) {
            dto.setMunicipioId(entity.getMunicipio().getId());
        }

        return dto;
    }
}
