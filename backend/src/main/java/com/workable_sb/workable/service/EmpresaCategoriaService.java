package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.repository.EmpresaCategoriaRepo;

@Service
public class EmpresaCategoriaService {

    @Autowired
    private EmpresaCategoriaRepo empresaCategoriaRepo;

    // CREATE
    public EmpresaCategoria create(EmpresaCategoria empresaCategoria) {
        return empresaCategoriaRepo.save(empresaCategoria);
    }

    // READ ALL
    public List<EmpresaCategoria> getAll() {
        return empresaCategoriaRepo.findAll();
    }

    // READ ALL ACTIVAS
    public List<EmpresaCategoria> getAllActivas() {
        return empresaCategoriaRepo.findByIsActive(true);
    }

    // READ BY ID
    public Optional<EmpresaCategoria> getById(Long id) {
        return empresaCategoriaRepo.findById(id);
    }

    // READ BY NOMBRE
    public List<EmpresaCategoria> getByNombre(String nombre) {
        return empresaCategoriaRepo.findByNombreContainingIgnoreCase(nombre);
    }

    // UPDATE
    public EmpresaCategoria update(Long id, EmpresaCategoria empresaCategoriaActualizada) {
        Optional<EmpresaCategoria> categoriaExistente = empresaCategoriaRepo.findById(id);
        if (categoriaExistente.isPresent()) {
            EmpresaCategoria categoria = categoriaExistente.get();
            if (empresaCategoriaActualizada.getNombre() != null) {
                categoria.setNombre(empresaCategoriaActualizada.getNombre());
            }
            if (empresaCategoriaActualizada.getDescripcion() != null) {
                categoria.setDescripcion(empresaCategoriaActualizada.getDescripcion());
            }
            return empresaCategoriaRepo.save(categoria);
        }
        return null;
    }

    // DESACTIVAR
    public EmpresaCategoria desactivar(Long id) {
        Optional<EmpresaCategoria> categoriaExistente = empresaCategoriaRepo.findById(id);
        if (categoriaExistente.isPresent()) {
            EmpresaCategoria categoria = categoriaExistente.get();
            categoria.setIsActive(false);
            return empresaCategoriaRepo.save(categoria);
        }
        return null;
    }

    // DELETE
    public boolean delete(Long id) {
        if (empresaCategoriaRepo.existsById(id)) {
            empresaCategoriaRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
