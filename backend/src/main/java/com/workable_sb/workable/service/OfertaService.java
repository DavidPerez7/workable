package com.workable_sb.workable.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.dto.OfertaSearchDTO;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.OfertaRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private OfertaRepo ofertaRepository;

    @Autowired
    private EmpresaRepository empresaRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    // CREATE
    public Oferta create(Oferta request) {
        if (request.getEmpresa() == null) {
            throw new RuntimeException("Empresa es obligatoria");
        }
        Long empresaId = request.getEmpresa().getId();
        if (empresaId == null) {
            throw new RuntimeException("ID de empresa es obligatorio");
        }

        Empresa empresa = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        request.setEmpresa(empresa);

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                request.setMunicipio(municipio);
            }
        }

        return ofertaRepository.save(request);
    }

    // READ
    public List<Oferta> getAll() {
        return ofertaRepository.findAll();
    }

    public Oferta getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
    }


    // BÚSQUEDA UNIFICADA CON FILTROS COMBINABLES
    public List<Oferta> buscarConFiltros(OfertaSearchDTO filtros) {
        Oferta.Modalidad modalidadEnum = null;
        Empresa.Category categoriaEnum = null;

        if (filtros.getMunicipioId() != null) {
            Long mId = filtros.getMunicipioId();
            if (mId != null) {
                municipioRepo.findById(mId)
                        .orElseThrow(() -> new IllegalArgumentException("Municipio no encontrado"));
            }
        }

        if (filtros.getModalidad() != null) {
            try {
                modalidadEnum = Oferta.Modalidad.valueOf(filtros.getModalidad().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Modalidad no válida: " + filtros.getModalidad());
            }
        }

        if (filtros.getCategoria() != null) {
            try {
                categoriaEnum = Empresa.Category.valueOf(filtros.getCategoria().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Categoría no válida: " + filtros.getCategoria());
            }
        }
        
        return ofertaRepository.buscarConFiltros(
                filtros.getNombre(),
                filtros.getMunicipioId(),
                filtros.getSalarioMin(),
                filtros.getSalarioMax(),
                filtros.getExperiencia(),
                modalidadEnum,
                categoriaEnum,
                filtros.getEmpresaId()
        );
    }

    public Oferta updateEstado(Long id, Oferta.EstadoOferta estado) {
        Oferta existing = getById(id);
        if (existing == null) {
            throw new RuntimeException("Oferta no encontrada");
        }
        existing.setEstado(estado);
        return ofertaRepository.save(existing);
    }

    // UPDATE
    public Oferta update(Long id, Oferta request) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        Oferta existing = getById(id);
        if (existing == null) {
            throw new RuntimeException("Oferta no encontrada");
        }

        if (existing.getEstado() != Oferta.EstadoOferta.INACTIVA) {
            throw new RuntimeException("Solo se puede editar ofertas inactivas");
        }

        if (request.getTitulo() != null) existing.setTitulo(request.getTitulo());
        if (request.getDescripcion() != null) existing.setDescripcion(request.getDescripcion());
        if (request.getFechaLimite() != null) existing.setFechaLimite(request.getFechaLimite());
        if (request.getSalario() != null) existing.setSalario(request.getSalario());
        if (request.getNumeroVacantes() != null) existing.setNumeroVacantes(request.getNumeroVacantes());
        if (request.getNivelExperiencia() != null) existing.setNivelExperiencia(request.getNivelExperiencia());
        if (request.getModalidad() != null) existing.setModalidad(request.getModalidad());
        if (request.getTipoContrato() != null) existing.setTipoContrato(request.getTipoContrato());
        if (request.getRequisitos() != null) existing.setRequisitos(request.getRequisitos());

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                existing.setMunicipio(municipio);
            }
        }

        if (request.getEmpresa() != null) {
            Long empId = request.getEmpresa().getId();
            if (empId != null) {
                Empresa empresa = empresaRepo.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
                existing.setEmpresa(empresa);
            }
        }

        return ofertaRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (id == null) return;
        ofertaRepository.deleteById(id);
    }
}

