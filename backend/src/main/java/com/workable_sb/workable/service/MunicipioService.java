package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
public class MunicipioService {

    @Autowired
    private MunicipioRepo municipioRepo;
    
    @Autowired
    private EntityManager entityManager;

    // CREATE
    public Municipio create(Municipio municipio) {
        return municipioRepo.save(municipio);
    }

    // READ ALL
    public List<Municipio> getAll() {
        return municipioRepo.findAll();
    }

    // READ BY ID
    public Optional<Municipio> getById(Long id) {
        return municipioRepo.findById(id);
    }

    // READ BY NOMBRE
    public List<Municipio> getByNombre(String nombre) {
        return municipioRepo.findByNombreContainingIgnoreCase(nombre);
    }

    // READ BY DEPARTAMENTO
    public List<Municipio> getByDepartamento(Municipio.Departamento departamento) {
        return municipioRepo.findByDepartamento(departamento);
    }

    // UPDATE
    public Municipio update(Long id, Municipio municipioActualizado) {
        Optional<Municipio> municipioExistente = municipioRepo.findById(id);
        if (municipioExistente.isPresent()) {
            Municipio municipio = municipioExistente.get();
            if (municipioActualizado.getNombre() != null) {
                municipio.setNombre(municipioActualizado.getNombre());
            }
            if (municipioActualizado.getDepartamento() != null) {
                municipio.setDepartamento(municipioActualizado.getDepartamento());
            }
            return municipioRepo.save(municipio);
        }
        return null;
    }

    // DELETE - Elimina un municipio y actualiza las referencias a NULL
    @Transactional
    public boolean delete(Long id) {
        if (municipioRepo.existsById(id)) {
            try {
                // Primero actualizar todas las referencias a este municipio a NULL
                entityManager.createNativeQuery("UPDATE usuario SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                entityManager.createNativeQuery("UPDATE oferta SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                entityManager.createNativeQuery("UPDATE empresa SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                entityManager.createNativeQuery("UPDATE estudio SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                entityManager.createNativeQuery("UPDATE experiencia SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                entityManager.createNativeQuery("UPDATE direccion SET municipio_id = NULL WHERE municipio_id = ?1")
                    .setParameter(1, id).executeUpdate();
                
                // Ahora eliminar el municipio
                municipioRepo.deleteById(id);
                return true;
            } catch (Exception e) {
                System.out.println("Error al eliminar municipio: " + e.getMessage());
                return false;
            }
        }
        return false;
    }
}
