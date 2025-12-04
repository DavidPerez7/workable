package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.TipoHabilidad;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.service.HabilidadService;

@RestController
@RequestMapping("/api/habilidades")
public class HabilidadController {

    @Autowired
    private HabilidadService habilidadService;

    @Autowired
    private HabilidadRepo habilidadRepo;

    // CREATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Habilidad habilidad) {
        try {
            habilidad.setIsActive(true);
            Habilidad habilidadCreada = habilidadRepo.save(habilidad);
            return ResponseEntity.ok(habilidadCreada);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear habilidad: " + e.getMessage()));
        }
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Habilidad> habilidades = habilidadRepo.findAll();
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidades: " + e.getMessage()));
        }
    }

    // GET ALL ACTIVAS
    @GetMapping("/activas")
    public ResponseEntity<?> getAllActivas() {
        try {
            List<Habilidad> habilidades = habilidadRepo.findByIsActive(true);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidades activas: " + e.getMessage()));
        }
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Habilidad habilidad = habilidadService.obtenerPorId(id);
            return ResponseEntity.ok(habilidad);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidad: " + e.getMessage()));
        }
    }

    // GET BY NOMBRE
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> getByNombre(@PathVariable String nombre) {
        try {
            List<Habilidad> habilidades = habilidadService.buscarPorNombreParcial(nombre);
            if (!habilidades.isEmpty()) {
                return ResponseEntity.ok(habilidades);
            }
            return ResponseEntity.status(404).body(Map.of("error", "No se encontraron habilidades con ese nombre"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al buscar habilidades: " + e.getMessage()));
        }
    }

    // GET BY TIPO
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<?> getByTipo(@PathVariable TipoHabilidad tipo) {
        try {
            List<Habilidad> habilidades = habilidadService.listarPorTipo(tipo);
            if (!habilidades.isEmpty()) {
                return ResponseEntity.ok(habilidades);
            }
            return ResponseEntity.status(404).body(Map.of("error", "No se encontraron habilidades de ese tipo"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidades: " + e.getMessage()));
        }
    }

    // UPDATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Habilidad habilidad) {
        try {
            Habilidad habilidadActualizada = habilidadRepo.findById(id).orElse(null);
            if (habilidadActualizada == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Habilidad no encontrada"));
            }
            if (habilidad.getNombre() != null) {
                habilidadActualizada.setNombre(habilidad.getNombre());
            }
            if (habilidad.getTipo() != null) {
                habilidadActualizada.setTipo(habilidad.getTipo());
            }
            return ResponseEntity.ok(habilidadRepo.save(habilidadActualizada));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar habilidad: " + e.getMessage()));
        }
    }

    // DESACTIVAR - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            Habilidad habilidad = habilidadRepo.findById(id).orElse(null);
            if (habilidad == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Habilidad no encontrada"));
            }
            habilidad.setIsActive(false);
            return ResponseEntity.ok(Map.of("message", "Habilidad desactivada correctamente", "habilidad", habilidadRepo.save(habilidad)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al desactivar habilidad: " + e.getMessage()));
        }
    }

    // ACTIVAR - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Long id) {
        try {
            Habilidad habilidad = habilidadRepo.findById(id).orElse(null);
            if (habilidad == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Habilidad no encontrada"));
            }
            habilidad.setIsActive(true);
            return ResponseEntity.ok(Map.of("message", "Habilidad activada correctamente", "habilidad", habilidadRepo.save(habilidad)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al activar habilidad: " + e.getMessage()));
        }
    }

    // DELETE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            habilidadService.eliminarHabilidad(id);
            return ResponseEntity.ok(Map.of("message", "Habilidad eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar habilidad: " + e.getMessage()));
        }
    }
}

