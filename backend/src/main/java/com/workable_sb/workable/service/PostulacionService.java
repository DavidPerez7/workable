package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.AspiranteRepo;

@Service
@Transactional
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private AspiranteRepo aspiranteRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	// ===== GET ALL (ADMIN) =====
	public List<Postulacion> getAll() {
		return postulacionRepo.findAll();
	}

	// ===== CREATE =====
	public Postulacion create(Postulacion postulacion) {
		if (postulacion.getAspirante() == null || postulacion.getAspirante().getId() == null) {
			throw new IllegalArgumentException("El ID del aspirante es obligatorio");
		}
		if (postulacion.getOferta() == null || postulacion.getOferta().getId() == null) {
			throw new IllegalArgumentException("El ID de la oferta es obligatorio");
		}

		Long aspiranteId = postulacion.getAspirante().getId();
		Long ofertaId = postulacion.getOferta().getId();

		// Validar que no exista ya una postulación
		if (postulacionRepo.findByAspiranteIdAndOfertaId(aspiranteId, ofertaId).isPresent()) {
			throw new IllegalStateException("Ya existe una postulación para este aspirante en esta oferta");
		}

		Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
			.orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar que la oferta está ABIERTA
		if (oferta.getEstado() != EstadoOferta.ABIERTA) {
			throw new IllegalStateException("Solo puedes postularte a ofertas abiertas");
		}

		// Crear postulación
		postulacion.setAspirante(aspirante);
		postulacion.setOferta(oferta);
		postulacion.setEstado(Estado.PENDIENTE);
		postulacion.setIsActive(true);

		return postulacionRepo.save(postulacion);
	}

	// ===== READ =====
	public Postulacion getById(Long id) {
		return postulacionRepo.findById(id)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));
	}

	public List<Postulacion> getByOfertaId(Long ofertaId) {
		ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> getByAspiranteId(Long aspiranteId) {
		return postulacionRepo.findByAspiranteId(aspiranteId);
	}

	// ===== UPDATE =====
	public Postulacion update(Long id, Postulacion postulacion) {
		Postulacion existing = getById(id);
		if (postulacion.getEstado() != null) {
			existing.setEstado(postulacion.getEstado());
		}
		return postulacionRepo.save(existing);
	}

	// ===== DELETE =====
	public void delete(Long id) {
		Postulacion postulacion = getById(id);
		postulacionRepo.delete(postulacion);
	}
}
