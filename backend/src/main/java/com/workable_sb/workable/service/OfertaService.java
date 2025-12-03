package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Oferta.Modalidad;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.OfertaRepository;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    // ===== CREACIÓN =====
    public Oferta crearOferta(Oferta oferta, Long empresaId, Long reclutadorId) {
        if (oferta == null) throw new IllegalArgumentException("Oferta no puede ser null");
        if (empresaId == null) throw new IllegalArgumentException("EmpresaId requerido");
        if (reclutadorId == null) throw new IllegalArgumentException("ReclutadorId requerido");

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

        // Validar que el reclutador existe y es RECLUTADOR
        Usuario reclutador = usuarioRepo.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));

        if (reclutador.getRol() != Usuario.Rol.RECLUTADOR && reclutador.getRol() != Usuario.Rol.ADMIN) {
            throw new IllegalArgumentException("Solo usuarios con rol RECLUTADOR o ADMIN pueden crear ofertas");
        }

        // Validar que el reclutador pertenece a la empresa (excepto ADMIN)
        if (reclutador.getRol() == Usuario.Rol.RECLUTADOR) {
            boolean perteneceAEmpresa = empresa.getReclutadores().stream()
                    .anyMatch(r -> r.getId().equals(reclutadorId));
            
            if (!perteneceAEmpresa) {
                throw new IllegalStateException("El reclutador no pertenece a la empresa");
            }
        }

        // Validar municipio
        if (oferta.getMunicipio() != null) {
            municipioRepo.findById(oferta.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        }

        // Asignar empresa y reclutador
        oferta.setEmpresa(empresa);
        oferta.setReclutador(reclutador);

        // Guardar (fechaPublicacion se establece en @PrePersist)
        return ofertaRepository.save(oferta);
    }

    // ===== CONSULTAS =====
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
        if (!usuarioRepo.existsById(reclutadorId)) {
            throw new RuntimeException("Reclutador no encontrado");
        }
        return ofertaRepository.findByReclutadorId(reclutadorId);
    }

    public List<Oferta> listarPorMunicipio(Integer municipioId) {
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

    // ===== ACTUALIZACIÓN (reclutador de la empresa o ADMIN) =====
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

        // Guardar (validaciones en @PreUpdate)
        return ofertaRepository.save(existente);
    }

    // ===== CAMBIAR ESTADO (reclutador de la empresa o ADMIN) =====
    public Oferta cambiarEstado(Long id, EstadoOferta nuevoEstado, Long usuarioIdActual) {
        Oferta existente = obtenerPorId(id);

        // Validar que el usuario puede modificar
        if (!puedeModificarOferta(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el reclutador de la empresa o un administrador pueden cambiar el estado");
        }

        existente.setEstado(nuevoEstado);
        return ofertaRepository.save(existente);
    }

    // ===== ELIMINACIÓN FÍSICA (solo ADMIN) =====
    public void eliminarOfertaFisica(Long id, String correoUsuarioActual) {
        // Validar que el usuario actual es ADMIN
        Usuario usuarioActual = usuarioRepo.findByCorreo(correoUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new IllegalStateException("Solo administradores pueden eliminar ofertas físicamente");
        }

        // Verificar que la oferta existe
        if (!ofertaRepository.existsById(id)) {
            throw new RuntimeException("Oferta no encontrada con id: " + id);
        }

        // Eliminación física
        ofertaRepository.deleteById(id);
    }

    // ===== MÉTODOS AUXILIARES =====
    /**
     * Verifica si un usuario puede modificar una oferta
     * (es reclutador de la empresa de la oferta o es ADMIN)
     */
    private boolean puedeModificarOferta(Oferta oferta, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Es ADMIN
        if (usuario.getRol() == Usuario.Rol.ADMIN) {
            return true;
        }
        
        // Es reclutador de la empresa
        if (usuario.getRol() == Usuario.Rol.RECLUTADOR) {
            return oferta.getEmpresa().getReclutadores().stream()
                    .anyMatch(r -> r.getId().equals(usuarioId));
        }
        
        return false;
    }
}
