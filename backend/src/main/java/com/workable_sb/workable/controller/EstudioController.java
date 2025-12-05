

package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.service.EstudioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Estudios - Formación académica del aspirante.
 * Roles permitidos:
 * - ASPIRANTE: Crear/editar/eliminar sus propios estudios
 * - RECLUTADOR: Solo lectura de estudios públicos
 * - ADMIN: Acceso completo
 */
@RestController
@RequestMapping("/api/estudio")
public class EstudioController {

    @Autowired
    private EstudioService estudioService;

    // ===== CREATE - Solo ASPIRANTE y ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> crearEstudio(@RequestBody Estudio estudio, @RequestParam Long usuarioIdActual) {
        try {
            Long usuarioId = estudio.getUsuario().getId();
            
            // Validar que el usuario solo puede crear estudios para sí mismo (a menos que sea ADMIN)
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes crear estudios para otro usuario"));
            }
            
            return ResponseEntity.ok(estudioService.crearEstudio(estudio, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear estudio: " + e.getMessage()));
        }
    }

    // ===== READ by id - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Estudio> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudioService.obtenerPorId(id));
    }

    // ===== READ por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorUsuario(usuarioId));
    }

    // ===== READ en curso por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/encurso")
    public ResponseEntity<List<Estudio>> obtenerEstudiosEnCurso(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosEnCurso(usuarioId));
    }

    // ===== READ por nivel educativo - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/nivel")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorNivel(@PathVariable Long usuarioId, @RequestParam Estudio.NivelEducativo nivel) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorNivel(usuarioId, nivel));
    }

    // ===== READ todos - ADMIN solamente =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Estudio>> listarTodos() {
        return ResponseEntity.ok(estudioService.listarTodos());
    }

    // ===== UPDATE - Solo ASPIRANTE sus propios estudios o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEstudio(@PathVariable Long id, @RequestBody Estudio estudio, @RequestParam Long usuarioIdActual) {
        try {
            Estudio estudioExistente = estudioService.obtenerPorId(id);
            
            // Validar ownership
            if (!estudioExistente.getUsuario().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes editar estudios de otro usuario"));
            }
            
            return ResponseEntity.ok(estudioService.actualizarEstudio(id, estudio, usuarioIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar estudio: " + e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propios estudios o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEstudio(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            Estudio estudio = estudioService.obtenerPorId(id);
            
            // Validar ownership
            if (!estudio.getUsuario().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar estudios de otro usuario"));
            }
            
            estudioService.eliminarEstudio(id, usuarioIdActual);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar estudio: " + e.getMessage()));
        }
    }
}