package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Feedback;
import com.workable_sb.workable.service.FeedbackService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
	@Autowired
	private FeedbackService feedbackService;

	// CREATE
	@PostMapping
	public ResponseEntity<Feedback> crear(@Valid @RequestBody Feedback feedback) {
		return ResponseEntity.ok(feedbackService.create(feedback));
	}

	// READ
	@GetMapping("/{id}")
	public ResponseEntity<Feedback> listarId(@PathVariable Long id) {
		return ResponseEntity.ok(feedbackService.getById(id));
	}

	@GetMapping
	public ResponseEntity<List<Feedback>> listarTodo() {
		return ResponseEntity.ok(feedbackService.getAll());
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<Feedback> actualizar(@PathVariable Long id, @Valid @RequestBody Feedback feedback) {
		return ResponseEntity.ok(feedbackService.update(id, feedback));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		feedbackService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
