package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Direccion;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.DireccionRepo;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class DireccionService {
    @Autowired
    private DireccionRepo direccionRepo;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    // ===== READ =====
    public Direccion findById(Long id) {
        return direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));
    }

    public Direccion obtenerPorId(Long id) {
        return findById(id);
    }

    public List<Direccion> listarTodas() {
        return direccionRepo.findAll();
    }

    public List<Direccion> findAllByEmpresaId(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RuntimeException("Empresa no encontrada");
        }
        return direccionRepo.findAllByEmpresaId(empresaId);
    }

    public List<Direccion> findActiveByEmpresaId(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RuntimeException("Empresa no encontrada");
        }
        return direccionRepo.findAllByEmpresaId(empresaId).stream()
                .filter(d -> d.getIsActive())
                .toList();
    }

    public Direccion findByNombreAndEmpresaId(String nombre, Long empresaId) {
        return direccionRepo.findByNombreAndEmpresaId(nombre, empresaId)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));
    }

    // ===== CREATE =====
    public Direccion create(Direccion request, Long empresaId, Long usuarioActualId) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        if (!puedeModificarEmpresa(empresa, usuarioActualId)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden agregar direcciones");
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            request.setMunicipio(municipio);
        }

        request.setEmpresa(empresa);
        return direccionRepo.save(request);
    }

    public Direccion crear(Direccion direccion) {
        if (direccion.getEmpresa() == null || direccion.getEmpresa().getId() == null) {
            throw new RuntimeException("La empresa es obligatoria");
        }
        Empresa empresa = empresaRepository.findById(direccion.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        direccion.setEmpresa(empresa);
        
        if (direccion.getMunicipio() != null && direccion.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(direccion.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            direccion.setMunicipio(municipio);
        }
        
        return direccionRepo.save(direccion);
    }

    // ===== UPDATE =====
    public Direccion update(Long id, Direccion request, Long usuarioActualId) {
        Direccion existingDireccion = direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        if (!puedeModificarEmpresa(existingDireccion.getEmpresa(), usuarioActualId)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden actualizar direcciones");
        }

        existingDireccion.setNombre(request.getNombre());
        existingDireccion.setDireccion(request.getDireccion());
        existingDireccion.setTelefono(request.getTelefono());
        existingDireccion.setCorreo(request.getCorreo());
        existingDireccion.setIsPrincipal(request.getIsPrincipal());

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existingDireccion.setMunicipio(municipio);
        }

        return direccionRepo.save(existingDireccion);
    }

    public Direccion actualizar(Long id, Direccion direccion) {
        Direccion existente = direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        if (direccion.getNombre() != null) existente.setNombre(direccion.getNombre());
        if (direccion.getDireccion() != null) existente.setDireccion(direccion.getDireccion());
        if (direccion.getTelefono() != null) existente.setTelefono(direccion.getTelefono());
        if (direccion.getCorreo() != null) existente.setCorreo(direccion.getCorreo());
        if (direccion.getIsPrincipal() != null) existente.setIsPrincipal(direccion.getIsPrincipal());

        if (direccion.getMunicipio() != null && direccion.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(direccion.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existente.setMunicipio(municipio);
        }

        return direccionRepo.save(existente);
    }

    // ===== DELETE =====
    public void delete(Long id, Long usuarioActualId) {
        Direccion existingDireccion = direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        if (!puedeModificarEmpresa(existingDireccion.getEmpresa(), usuarioActualId)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden eliminar direcciones");
        }

        direccionRepo.delete(existingDireccion);
    }

    public void eliminar(Long id) {
        Direccion direccion = direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));
        direccionRepo.delete(direccion);
    }

    private boolean puedeModificarEmpresa(Empresa empresa, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() == Usuario.Rol.ADMIN) {
            return true;
        }

        if (empresa.getReclutadorOwner() != null &&
            empresa.getReclutadorOwner().getId().equals(usuarioId)) {
            return true;
        }

        return false;
    }
}
