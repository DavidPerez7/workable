package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaReadDTO;
import com.workable_sb.workable.models.*;
import com.workable_sb.workable.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OfertaMapperImpl implements OfertaMapper {
    private final OfertaModalidadRepository modalidadRepository;
    private final OfertaTipoContratoRepository tipoContratoRepository;
    private final EmpresaRepository empresaRepository;
    private final MunicipioRepository municipioRepository;
    private final UsrReclutadorRepository reclutadorRepository;
    private final OfertaBeneficioRepository beneficioRepository;

    @Override
    public Oferta toEntity(OfertaCreateDTO dto) {
        Objects.requireNonNull(dto, "El DTO no puede ser nulo");
        
        Oferta oferta = new Oferta();
        
        oferta.setTitulo(dto.getTitulo() != null ? dto.getTitulo().trim() : null);
        oferta.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
        oferta.setUbicacion(dto.getUbicacion() != null ? dto.getUbicacion().trim() : null);
        oferta.setFechaLimite(dto.getFechaLimite());
        oferta.setSalario(dto.getSalario());
        
        // Estado (por defecto ABIERTA)
        if (dto.getEstado() != null) {
            oferta.setEstado(dto.getEstado());
        } else {
            oferta.setEstado(Oferta.EstadoOferta.ABIERTA);
        }
        
        // Requisitos
        if (dto.getRequisitos() != null && !dto.getRequisitos().isEmpty()) {
            Set<String> requisitosLimpios = dto.getRequisitos().stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(r -> !r.isEmpty())
                .collect(Collectors.toSet());
            oferta.setRequisitos(requisitosLimpios);
        } else {
            oferta.setRequisitos(new HashSet<>());
        }
        
        // Municipio
        if (dto.getMunicipioId() != null) {
            Municipio municipio = municipioRepository.findById(dto.getMunicipioId())
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado con id: " + dto.getMunicipioId()));
            oferta.setMunicipio(municipio);
        }

        // Modalidad
        if (dto.getModalidadId() != null) {
            OfertaModalidad modalidad = modalidadRepository.findById(dto.getModalidadId())
                .orElseThrow(() -> new EntityNotFoundException("Modalidad no encontrada con id: " + dto.getModalidadId()));
            oferta.setModalidad(modalidad);
        }

        // Tipo de Contrato
        if (dto.getTipoContratoId() != null) {
            OfertaTipoContrato tipoContrato = tipoContratoRepository.findById(dto.getTipoContratoId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de contrato no encontrado con id: " + dto.getTipoContratoId()));
            oferta.setTipoContrato(tipoContrato);
        }

        // Empresa
        if (dto.getEmpresaId() != null) {
            Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con id: " + dto.getEmpresaId()));
            oferta.setEmpresa(empresa);
        }
        
        // Reclutador (opcional)
        if (dto.getReclutadorId() != null) {
            UsrReclutador reclutador = reclutadorRepository.findById(dto.getReclutadorId())
                .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado con id: " + dto.getReclutadorId()));
            oferta.setReclutador(reclutador);
        }
        
        // Beneficios
        if (dto.getBeneficiosIds() != null && !dto.getBeneficiosIds().isEmpty()) {
            Set<OfertaBeneficio> beneficios = dto.getBeneficiosIds().stream()
                .map(id -> beneficioRepository.findById(id.shortValue())
                    .orElseThrow(() -> new EntityNotFoundException("Beneficio no encontrado con id: " + id)))
                .collect(Collectors.toSet());
            oferta.setBeneficios(beneficios);
        } else {
            oferta.setBeneficios(new HashSet<>());
        }

        return oferta;
    }

    @Override
    public OfertaReadDTO toDto(Oferta entity) {
        Objects.requireNonNull(entity, "La entidad no puede ser nula");
        
        OfertaReadDTO dto = new OfertaReadDTO();
        
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setUbicacion(entity.getUbicacion());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setFechaLimite(entity.getFechaLimite());
        dto.setSalario(entity.getSalario());
        dto.setEstado(entity.getEstado() != null ? entity.getEstado().name() : null);
        dto.setRequisitos(entity.getRequisitos());

        // Municipio
        if (entity.getMunicipio() != null) {
            dto.setMunicipioId(entity.getMunicipio().getId());
            dto.setMunicipioNombre(entity.getMunicipio().getNombre());
        }

        // Modalidad
        if (entity.getModalidad() != null) {
            dto.setModalidadId(entity.getModalidad().getId());
            dto.setModalidadNombre(entity.getModalidad().getNombre());
        }

        // Tipo de Contrato
        if (entity.getTipoContrato() != null) {
            dto.setTipoContratoId(entity.getTipoContrato().getId());
            dto.setTipoContratoNombre(entity.getTipoContrato().getNombre());
        }

        // Empresa
        if (entity.getEmpresa() != null) {
            dto.setEmpresaId(entity.getEmpresa().getNitId());
            dto.setEmpresaNombre(entity.getEmpresa().getNombre());
        }
        
        // Reclutador
        if (entity.getReclutador() != null) {
            dto.setReclutadorId(entity.getReclutador().getId());
            dto.setReclutadorNombre(entity.getReclutador().getNombre());
        }
        
        // Beneficios
        if (entity.getBeneficios() != null && !entity.getBeneficios().isEmpty()) {
            Set<OfertaReadDTO.BeneficioSimpleDTO> beneficiosDTO = entity.getBeneficios().stream()
                .map(b -> new OfertaReadDTO.BeneficioSimpleDTO(
                    b.getBeneficio_id() != null ? b.getBeneficio_id().intValue() : null, 
                    b.getNombre()))
                .collect(Collectors.toSet());
            dto.setBeneficios(beneficiosDTO);
        } else {
            dto.setBeneficios(new HashSet<>());
        }

        return dto;
    }
}
