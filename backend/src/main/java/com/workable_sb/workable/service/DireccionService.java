package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Direccion;
import com.workable_sb.workable.repository.DireccionRepo;

@Service
public class DireccionService {
    @Autowired
    public DireccionRepo direccionRepo;

    // ===== READ =====
    public Direccion findById(Long id) {
        return direccionRepo.findById(id).orElse(null);
    }

    public List<Direccion> findAllByEmpresaId(Long empresaId) {
        return direccionRepo.findAllByEmpresaId(empresaId);
    }

    public Direccion findByNombreAndEmpresaId(String nombre, Long empresaId) {
        return direccionRepo.findByNombreAndEmpresaId(nombre, empresaId).orElse(null);
    }

    // ===== CREATE =====
    public Direccion create(Direccion request) {
        return direccionRepo.save(request);
    }

    // ===== UPDATE =====
    public Direccion update(Long id, Direccion request) {
        Direccion existingDireccion = direccionRepo.findById(id).orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        existingDireccion.setNombre(request.getNombre());
        existingDireccion.setDireccion(request.getDireccion());
        existingDireccion.setTelefono(request.getTelefono());
        existingDireccion.setCorreo(request.getCorreo());
        existingDireccion.setIsActive(request.getIsActive());
        existingDireccion.setIsPrincipal(request.getIsPrincipal());
        existingDireccion.setMunicipio(request.getMunicipio());

        return direccionRepo.save(existingDireccion);
    }

    // ===== DELETE =====
    public void Delete(Long id) {
        direccionRepo.deleteById(id);
    }
}
