
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Feedback;
import com.workable_sb.workable.service.FeedbackService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Feedback - Reseñas y calificaciones de aspirantes sobre empresas/ofertas.
 * Roles permitidos:
 * - ASPIRANTE: Crear feedback sobre empresas donde postuló, ver su propio feedback
 * - RECLUTADOR: Ver feedback de sus empresas/ofertas
 * - ADMIN: Acceso completo
 */
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

	@Autowired
	private FeedbackService feedbackService;

	// ===== CREATE - Solo ASPIRANTE y ADMIN =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
	@PostMapping
	public ResponseEntity<Feedback> create(@RequestBody Feedback request, @RequestParam Long usuarioIdActual) {
		try {
			// Validar que es el usuario actual
			if (!request.getAspirante().getId().equals(usuarioIdActual)) {
				return ResponseEntity.status(403).body(null);
			}
			return ResponseEntity.ok(feedbackService.create(request));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	// ===== READ by id - Todos autenticados =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<Feedback> getById(@PathVariable Long id) {
		return ResponseEntity.ok(feedbackService.getById(id));
	}

	// ===== READ by empresa - Solo RECLUTADOR y ADMIN =====
	@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
	@GetMapping("/empresa/{empresaId}")
	public ResponseEntity<List<Feedback>> getByEmpresa(@PathVariable Long empresaId) {
		return ResponseEntity.ok(feedbackService.getByEmpresa(empresaId));
	}

	// ===== READ by oferta - Solo RECLUTADOR y ADMIN =====
	@PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
	@GetMapping("/oferta/{ofertaId}")
	public ResponseEntity<List<Feedback>> getByOferta(@PathVariable Long ofertaId) {
		return ResponseEntity.ok(feedbackService.getByOferta(ofertaId));
	}

	// ===== READ by usuario - Solo el usuario o ADMIN =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<?> getByAspirante(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
		try {
			// Si es ASPIRANTE, solo puede ver su propio feedback
			if (!usuarioId.equals(usuarioIdActual)) {
				return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos para ver feedback de otro usuario"));
			}
			return ResponseEntity.ok(feedbackService.getByAspirante(usuarioId));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
		}
	}

	// ===== READ by usuario and empresa - Solo el usuario o ADMIN =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
	@GetMapping("/usuario/{usuarioId}/empresa/{empresaId}")
	public ResponseEntity<?> getByAspiranteAndEmpresa(@PathVariable Long usuarioId, @PathVariable Long empresaId, @RequestParam Long usuarioIdActual) {
		try {
			if (!usuarioId.equals(usuarioIdActual)) {
				return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
			}
			return ResponseEntity.ok(feedbackService.getByAspiranteAndEmpresa(usuarioId, empresaId));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
		}
	}

	// ===== UPDATE - Solo ASPIRANTE su propio feedback o ADMIN =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Feedback request, @RequestParam Long usuarioIdActual) {
		try {
			Feedback feedback = feedbackService.getById(id);
			if (!feedback.getAspirante().getId().equals(usuarioIdActual)) {
				return ResponseEntity.status(403).body(Map.of("error", "No puedes editar feedback de otro usuario"));
			}
			return ResponseEntity.ok(feedbackService.update(id, request));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
		}
	}

	// ===== DELETE - Solo ASPIRANTE su propio feedback o ADMIN =====
	@PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
		try {
			Feedback feedback = feedbackService.getById(id);
			if (!feedback.getAspirante().getId().equals(usuarioIdActual)) {
				return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar feedback de otro usuario"));
			}
			feedbackService.delete(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
		}
	}
}
