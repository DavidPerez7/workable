package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;

@Service
@Transactional
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private AspiranteRepo aspiranteRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	// CREATE
	public Postulacion create(Postulacion postulacion) {
		if (postulacion.getAspirante() == null || postulacion.getOferta() == null) {
			throw new IllegalArgumentException("Aspirante y Oferta son obligatorios");
		}
		Long aspiranteId = postulacion.getAspirante().getId();
		Long ofertaId = postulacion.getOferta().getId();

		if (aspiranteId == null || ofertaId == null) {
			throw new IllegalArgumentException("IDs de Aspirante y Oferta son obligatorios");
		}

		Aspirante aspirante = aspiranteRepo.findById(aspiranteId).orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

		Oferta oferta = ofertaRepo.findById(ofertaId).orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		if (oferta.getEstado() != EstadoOferta.ACTIVA) {
			throw new IllegalStateException("Solo puedes postularte a ofertas activas");
		}

		// Verificar si ya existe postulación del aspirante a la oferta
		if (postulacionRepo.findByAspirante_IdAndOferta_Id(aspiranteId, ofertaId).isPresent()) {
			throw new IllegalStateException("Ya existe una postulación del aspirante a esta oferta");
		}

		postulacion.setAspirante(aspirante);
		postulacion.setOferta(oferta);

		return postulacionRepo.save(postulacion);
	}

	// READ
	public List<Postulacion> getAll() {
		return postulacionRepo.findAll();
	}

	public Postulacion getById(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("El ID no puede ser nulo");
		}
		return postulacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));
	}

	public List<Postulacion> getByOfertaId(Long ofertaId) {
		if (ofertaId == null) {
			throw new IllegalArgumentException("El ID de la oferta no puede ser nulo");
		}
		return postulacionRepo.findByOferta_Id(ofertaId);
	}

	public List<Postulacion> getByAspiranteId(Long aspiranteId) {
		if (aspiranteId == null) {
			throw new IllegalArgumentException("El ID del aspirante no puede ser nulo");
		}
		return postulacionRepo.findByAspirante_Id(aspiranteId);
	}

	// UPDATE
	public Postulacion update(Long id, Postulacion postulacion) {
		if (id == null) {
			throw new IllegalArgumentException("El ID no puede ser nulo");
		}
		Postulacion existing = getById(id);
		if (existing == null) {
			throw new RuntimeException("Postulación no encontrada");
		}
		if (postulacion.getEstado() != null) {
			existing.setEstado(postulacion.getEstado());
		}
		return postulacionRepo.save(existing);
	}

	// DELETE
	public void delete(Long id) {
		if (id == null) return;
		Postulacion existing = getById(id); // valida que exista
		if (existing != null) {
			postulacionRepo.delete(existing);
		}
	}
}
