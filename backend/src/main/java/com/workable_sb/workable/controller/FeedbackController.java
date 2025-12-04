
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Feedback;
import com.workable_sb.workable.service.FeedbackService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

	@Autowired
	private FeedbackService feedbackService;

	// - CREATE
	@PostMapping
	public ResponseEntity<Feedback> create(@RequestBody Feedback request) {
		return ResponseEntity.ok(feedbackService.create(request));
	}

	// - READ by id
	@GetMapping("/{id}")
	public ResponseEntity<Feedback> getById(@PathVariable Long id) {
		return ResponseEntity.ok(feedbackService.getById(id));
	}

	// - READ by empresa
	@GetMapping("/empresa/{empresaId}")
	public ResponseEntity<List<Feedback>> getByEmpresa(@PathVariable Long empresaId) {
		return ResponseEntity.ok(feedbackService.getByEmpresa(empresaId));
	}

	// - READ by oferta
	@GetMapping("/oferta/{ofertaId}")
	public ResponseEntity<List<Feedback>> getByOferta(@PathVariable Long ofertaId) {
		return ResponseEntity.ok(feedbackService.getByOferta(ofertaId));
	}

	// - READ by usuario
	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Feedback>> getByUsuario(@PathVariable Long usuarioId) {
		return ResponseEntity.ok(feedbackService.getByUsuario(usuarioId));
	}

	// - READ by usuario and empresa
	@GetMapping("/usuario/{usuarioId}/empresa/{empresaId}")
	public ResponseEntity<Feedback> getByUsuarioAndEmpresa(@PathVariable Long usuarioId, @PathVariable Long empresaId) {
		return ResponseEntity.ok(feedbackService.getByUsuarioAndEmpresa(usuarioId, empresaId));
	}

	// - UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<Feedback> update(@PathVariable Long id, @RequestBody Feedback request) {
		return ResponseEntity.ok(feedbackService.update(id, request));
	}

	// - DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		feedbackService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
