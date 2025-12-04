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

    // DELETE - Elimina un municipio con validación de dependencias
    @Transactional
    public boolean delete(Long id) {
        if (!municipioRepo.existsById(id)) {
            return false;
        }
        
        try {
            // Validar y obtener conteos de dependencias
            long usuariosCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM usuario WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            long ofertasCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM oferta WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            long empresasCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM empresa WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            long estudiosCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM estudio WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            long experienciasCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM experiencia WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            long direccionesCount = (long) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM direccion WHERE municipio_id = ?1")
                .setParameter(1, id).getSingleResult();
            
            // Construir mensaje de error si hay dependencias
            StringBuilder errorMsg = new StringBuilder();
            if (usuariosCount > 0) errorMsg.append("Usuarios: ").append(usuariosCount).append(", ");
            if (ofertasCount > 0) errorMsg.append("Ofertas: ").append(ofertasCount).append(", ");
            if (empresasCount > 0) errorMsg.append("Empresas: ").append(empresasCount).append(", ");
            if (estudiosCount > 0) errorMsg.append("Estudios: ").append(estudiosCount).append(", ");
            if (experienciasCount > 0) errorMsg.append("Experiencias: ").append(experienciasCount).append(", ");
            if (direccionesCount > 0) errorMsg.append("Direcciones: ").append(direccionesCount).append(", ");
            
            if (errorMsg.length() > 0) {
                // Eliminar la última coma
                errorMsg.setLength(errorMsg.length() - 2);
                System.out.println("No se puede eliminar municipio: existen registros dependientes - " + errorMsg.toString());
                throw new IllegalStateException("No se puede eliminar municipio: existen registros dependientes - " + errorMsg.toString());
            }
            
            // Si no hay dependencias, eliminar el municipio
            municipioRepo.deleteById(id);
            return true;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            System.out.println("Error al eliminar municipio: " + e.getMessage());
            throw new RuntimeException("Error al eliminar municipio: " + e.getMessage(), e);
        }
    }
}
