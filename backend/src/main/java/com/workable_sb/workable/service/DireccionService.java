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

    // ===== DELETE =====
    public void delete(Long id, Long usuarioActualId) {
        Direccion existingDireccion = direccionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        if (!puedeModificarEmpresa(existingDireccion.getEmpresa(), usuarioActualId)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden eliminar direcciones");
        }

        existingDireccion.setIsActive(false);
        direccionRepo.save(existingDireccion);
    }

    public void deleteFisico(Long id) {
        if (!direccionRepo.existsById(id)) {
            throw new RuntimeException("Direccion no encontrada");
        }
        direccionRepo.deleteById(id);
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
