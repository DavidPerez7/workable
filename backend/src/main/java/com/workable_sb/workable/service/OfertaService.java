package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Oferta.Modalidad;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private OfertaRepo ofertaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private ReclutadorRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private AdminValidationService adminValidationService;

    // ===== CREATE =====
    public Oferta crearOferta(Oferta oferta, Long empresaId, Long reclutadorId) {

        // Validar campos obligatorios
        if (oferta.getTitulo() == null || oferta.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        if (oferta.getDescripcion() == null || oferta.getDescripcion().isEmpty()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        if (oferta.getFechaLimite() == null) {
            throw new IllegalArgumentException("La fecha límite es obligatoria");
        }
        if (oferta.getSalario() == null) {
            throw new IllegalArgumentException("El salario es obligatorio");
        }
        if (oferta.getModalidad() == null) {
            throw new IllegalArgumentException("La modalidad es obligatoria");
        }
        if (oferta.getTipoContrato() == null) {
            throw new IllegalArgumentException("El tipo de contrato es obligatorio");
        }
        if (oferta.getNivelExperiencia() == null) {
            throw new IllegalArgumentException("El nivel de experiencia es obligatorio");
        }

        // Validar que la empresa existe
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        // Validar municipio
        if (oferta.getMunicipio() != null) {
            municipioRepo.findById(oferta.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        }

        // Asignar empresa
        oferta.setEmpresa(empresa);
        
        // Asignar fecha de publicación automática
        oferta.setFechaPublicacion(java.time.LocalDate.now());

        return ofertaRepository.save(oferta);
    }

    // ===== READ =====
    public Oferta obtenerPorId(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada con id: " + id));
    }

    public List<Oferta> listarTodas() {
        return ofertaRepository.findAll();
    }

    public List<Oferta> listarPorEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RuntimeException("Empresa no encontrada");
        }
        return ofertaRepository.findByEmpresaId(empresaId);
    }

    public List<Oferta> listarPorEstado(EstadoOferta estado) {
        return ofertaRepository.findByEstado(estado);
    }

    public List<Oferta> listarAbiertas() {
        return ofertaRepository.findByEstadoOrderByFechaPublicacionDesc(EstadoOferta.ABIERTA);
    }

    public List<Oferta> listarPorReclutador(Long reclutadorId) {
        // Obtener el reclutador
        com.workable_sb.workable.models.Reclutador reclutador = usuarioRepo.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        // Obtener la empresa del reclutador
        if (reclutador.getEmpresa() == null) {
            return List.of(); // Retornar lista vacía si el reclutador no tiene empresa
        }
        
        // Retornar las ofertas de la empresa del reclutador
        return ofertaRepository.findByEmpresaId(reclutador.getEmpresa().getId());
    }

    public List<Oferta> listarPorMunicipio(Long municipioId) {
        if (!municipioRepo.existsById(municipioId)) {
            throw new RuntimeException("Municipio no encontrado");
        }
        return ofertaRepository.findByMunicipioId(municipioId);
    }

    public List<Oferta> listarPorModalidad(Modalidad modalidad) {
        return ofertaRepository.findByModalidad(modalidad);
    }

    public List<Oferta> buscarPorTexto(String texto) {
        if (texto == null || texto.isEmpty()) {
            return listarTodas();
        }
        return ofertaRepository.buscarPorTexto(texto);
    }

    // ===== UPDATE =====
    public Oferta actualizarOferta(Long id, Oferta ofertaActualizada, Long usuarioIdActual) {
        Oferta existente = obtenerPorId(id);

        // Validar que el usuario puede modificar (reclutador de la empresa o ADMIN)
        if (!puedeModificarOferta(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el reclutador de la empresa o un administrador pueden actualizar esta oferta");
        }

        // Actualizar campos permitidos
        existente.setTitulo(ofertaActualizada.getTitulo());
        existente.setDescripcion(ofertaActualizada.getDescripcion());
        existente.setFechaLimite(ofertaActualizada.getFechaLimite());
        existente.setSalario(ofertaActualizada.getSalario());
        existente.setNumeroVacantes(ofertaActualizada.getNumeroVacantes());
        existente.setNivelExperiencia(ofertaActualizada.getNivelExperiencia());
        existente.setModalidad(ofertaActualizada.getModalidad());
        existente.setTipoContrato(ofertaActualizada.getTipoContrato());
        existente.setRequisitos(ofertaActualizada.getRequisitos());
        existente.setBeneficios(ofertaActualizada.getBeneficios());
        existente.setHabilidadesRequeridas(ofertaActualizada.getHabilidadesRequeridas());

        if (ofertaActualizada.getMunicipio() != null) {
            municipioRepo.findById(ofertaActualizada.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existente.setMunicipio(ofertaActualizada.getMunicipio());
        }

        return ofertaRepository.save(existente);
    }

    public Oferta cambiarEstado(Long id, EstadoOferta nuevoEstado, Long usuarioIdActual) {
        Oferta existente = obtenerPorId(id);

        // Validar que el usuario puede modificar
        if (!puedeModificarOferta(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el reclutador de la empresa o un administrador pueden cambiar el estado");
        }

        existente.setEstado(nuevoEstado);
        return ofertaRepository.save(existente);
    }

    // ===== DELETE =====
    public void eliminarOferta(Long id, Long usuarioIdActual) {
        Oferta existente = obtenerPorId(id);

        if (!puedeModificarOferta(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el reclutador de la empresa o un administrador pueden eliminar esta oferta");
        }

        // Validar que no hay postulaciones activas
        long postulacionesCount = (long) entityManager.createNativeQuery(
            "SELECT COUNT(*) FROM postulacion WHERE oferta_id = ?1")
            .setParameter(1, id).getSingleResult();
        
        if (postulacionesCount > 0) {
            throw new IllegalStateException("No se puede eliminar una oferta con " + postulacionesCount + " postulaciones. Primero debe rechazar o aceptar todas las postulaciones.");
        }

        ofertaRepository.delete(existente);
    }

    private boolean puedeModificarOferta(Oferta oferta, Long usuarioId) {
        // Si es ADMIN, permitir sin validar pertenencia
        if (adminValidationService.isAdmin()) {
            return true;
        }

        // Obtener el reclutador
        var reclutador = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        // Verificar que el reclutador pertenece a la misma empresa
        return reclutador.getEmpresa() != null && 
               reclutador.getEmpresa().getId().equals(oferta.getEmpresa().getId());
    }
}

