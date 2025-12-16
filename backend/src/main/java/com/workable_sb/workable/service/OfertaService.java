package com.workable_sb.workable.service;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
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

    @Autowired
    private PostulacionRepo postulacionRepo;

    // ===== CREATE =====
    public Oferta create(Oferta ofertaRequest) {
        // Validar campos obligatorios
        if (ofertaRequest.getTitulo() == null || ofertaRequest.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        
        if (ofertaRequest.getDescripcion() == null || ofertaRequest.getDescripcion().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        
        if (ofertaRequest.getRequisitos() == null || ofertaRequest.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String req = ofertaRequest.getRequisitos().trim();
        if (req.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }
        
        if (ofertaRequest.getSalario() == null) {
            throw new IllegalArgumentException("El salario es obligatorio");
        }

        if (ofertaRequest.getNivelExperiencia() == null) {
            throw new IllegalArgumentException("El nivel de experiencia es obligatorio");
        }
        
        if (ofertaRequest.getModalidad() == null) {
            throw new IllegalArgumentException("La modalidad es obligatoria");
        }
        
        if (ofertaRequest.getTipoContrato() == null) {
            throw new IllegalArgumentException("El tipo de contrato es obligatorio");
        }

        // Validar fecha límite
        if (ofertaRequest.getFechaLimite() == null) {
            throw new IllegalArgumentException("La fecha límite es obligatoria");
        }
        
        java.time.LocalDate hoy = java.time.LocalDate.now();
        if (ofertaRequest.getFechaLimite().isBefore(hoy)) {
            throw new IllegalArgumentException("La fecha límite debe ser posterior a hoy");
        }

        // Validar empresa
        if (ofertaRequest.getEmpresa() == null || ofertaRequest.getEmpresa().getId() == null) {
            throw new IllegalArgumentException("La empresa es obligatoria");
        }

        Oferta oferta = new Oferta();
        oferta.setTitulo(ofertaRequest.getTitulo().trim());
        oferta.setDescripcion(ofertaRequest.getDescripcion().trim());
        oferta.setFechaLimite(ofertaRequest.getFechaLimite());
        oferta.setFechaPublicacion(hoy);  
        oferta.setSalario(ofertaRequest.getSalario());
        oferta.setNumeroVacantes(ofertaRequest.getNumeroVacantes() != null ? ofertaRequest.getNumeroVacantes() : 1);
        oferta.setNivelExperiencia(ofertaRequest.getNivelExperiencia());
        oferta.setRequisitos(req);
        oferta.setModalidad(ofertaRequest.getModalidad());
        oferta.setTipoContrato(ofertaRequest.getTipoContrato());
        oferta.setEstado(ofertaRequest.getEstado() != null ? ofertaRequest.getEstado() : Oferta.EstadoOferta.ABIERTA);
        oferta.setIsActive(true);
        
        // Asignar municipio si existe
        if (ofertaRequest.getMunicipio() != null && ofertaRequest.getMunicipio().getId() != null) {
            oferta.setMunicipio(municipioRepo.findById(ofertaRequest.getMunicipio().getId())
                .orElseThrow(() -> new IllegalArgumentException("Municipio no encontrado")));
        }
        
        // Asignar empresa (obligatoria)
        oferta.setEmpresa(empresaRepo.findById(ofertaRequest.getEmpresa().getId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada")));
        
        // Asignar beneficios si existen
        if (ofertaRequest.getBeneficios() != null && !ofertaRequest.getBeneficios().isEmpty()) {
            oferta.setBeneficios(ofertaRequest.getBeneficios());
        }
        
        return ofertaRepository.save(oferta);
    }

    // ===== READ =====
    public List<Oferta> getAll() {
        return ofertaRepository.findAll();
    }

    public Oferta getById(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada con id: " + id));
    }

    // ===== FILTROS / BÚSQUEDA =====
    public List<Oferta> getByNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        return ofertaRepository.findByTituloContainingIgnoreCase(nombre);
    }

    public List<Oferta> getBySalarioRange(BigDecimal salarioMinimo, BigDecimal salarioMaximo) {
        if (salarioMinimo == null || salarioMaximo == null) {
            throw new IllegalArgumentException("Los rangos de salario son requeridos");
        }
        if (salarioMinimo.compareTo(salarioMaximo) > 0) {
            throw new IllegalArgumentException("El salario mínimo no puede ser mayor al máximo");
        }
        return ofertaRepository.findBySalarioRange(salarioMinimo, salarioMaximo);
    }

    public List<Oferta> getByUbicacion(Long municipioId) {
        if (municipioId == null) {
            throw new IllegalArgumentException("El ID del municipio es requerido");
        }
        // Validar que el municipio existe
        municipioRepo.findById(municipioId)
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        return ofertaRepository.findByMunicipioId(municipioId);
    }

    public List<Oferta> getByNivelExperiencia(String nivelExperiencia) {
        if (nivelExperiencia == null || nivelExperiencia.trim().isEmpty()) {
            throw new IllegalArgumentException("El nivel de experiencia no puede estar vacío");
        }
        return ofertaRepository.findByNivelExperiencia(nivelExperiencia);
    }

    public List<Oferta> getByModalidad(String modalidad) {
        if (modalidad == null || modalidad.trim().isEmpty()) {
            throw new IllegalArgumentException("La modalidad no puede estar vacía");
        }
        try {
            Oferta.Modalidad mod = Oferta.Modalidad.valueOf(modalidad.toUpperCase());
            return ofertaRepository.findByModalidad(mod);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Modalidad inválida: " + modalidad);
        }
    }

    public List<Oferta> getByEmpresa(Long empresaId) {
        if (empresaId == null) {
            throw new IllegalArgumentException("El ID de empresa es requerido");
        }
        return ofertaRepository.findByEmpresaId(empresaId);
    }

    public List<Oferta> buscarPorTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            throw new IllegalArgumentException("El texto de búsqueda no puede estar vacío");
        }
        return ofertaRepository.buscarPorTexto(texto);
    }

    // ===== UPDATE =====
    public Oferta update(Long id, Oferta ofertaActualizada) {
        Oferta existing = getById(id);
        
        if (ofertaActualizada.getRequisitos() == null || ofertaActualizada.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String reqUpd = ofertaActualizada.getRequisitos().trim();
        if (reqUpd.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }

        existing.setTitulo(ofertaActualizada.getTitulo());
        existing.setDescripcion(ofertaActualizada.getDescripcion());
        existing.setFechaLimite(ofertaActualizada.getFechaLimite());
        existing.setSalario(ofertaActualizada.getSalario());
        existing.setNumeroVacantes(ofertaActualizada.getNumeroVacantes());
        existing.setNivelExperiencia(ofertaActualizada.getNivelExperiencia());
        existing.setModalidad(ofertaActualizada.getModalidad());
        existing.setTipoContrato(ofertaActualizada.getTipoContrato());
        existing.setRequisitos(reqUpd);
        existing.setBeneficios(ofertaActualizada.getBeneficios());
        
        if (ofertaActualizada.getMunicipio() != null) {
            existing.setMunicipio(ofertaActualizada.getMunicipio());
        }
        if (ofertaActualizada.getEmpresa() != null) {
            existing.setEmpresa(ofertaActualizada.getEmpresa());
        }
        if (ofertaActualizada.getIsActive() != null) {
            existing.setIsActive(ofertaActualizada.getIsActive());
            existing.setEstado(ofertaActualizada.getIsActive() ? Oferta.EstadoOferta.ABIERTA : Oferta.EstadoOferta.CERRADA);
        }
        
        return ofertaRepository.save(existing);
    }

    // ===== UPDATE ESTADO =====
    public Oferta updateEstado(Long id, Oferta.EstadoOferta estado) {
        Oferta existing = getById(id);
        existing.setEstado(estado);
        
        // También actualizar el flag isActive basado en el estado
        existing.setIsActive(estado != Oferta.EstadoOferta.CERRADA);
        
        return ofertaRepository.save(existing);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Oferta existing = getById(id);
        try {
            var postulaciones = postulacionRepo.findByOfertaId(id);
            if (postulaciones != null && !postulaciones.isEmpty()) {
                postulacionRepo.deleteAll(postulaciones);
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudieron eliminar las postulaciones asociadas: " + e.getMessage(), e);
        }
        ofertaRepository.delete(existing);
    }
}

