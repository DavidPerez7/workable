package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
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

	// CREATE
	public Postulacion create(Postulacion postulacion) {
		Long aspiranteId = postulacion.getAspirante().getId();
		Long ofertaId = postulacion.getOferta().getId();

		Aspirante aspirante = aspiranteRepo.findById(aspiranteId).orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

		Oferta oferta = ofertaRepo.findById(ofertaId).orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		if (oferta.getEstado() != EstadoOferta.ACTIVA) {
			throw new IllegalStateException("Solo puedes postularte a ofertas activas");
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
		return postulacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));
	}

	public List<Postulacion> getByOfertaId(Long ofertaId) {
		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> getByAspiranteId(Long aspiranteId) {
		return postulacionRepo.findByAspiranteId(aspiranteId);
	}

	// UPDATE
	public Postulacion update(Long id, Postulacion postulacion) {
		Postulacion existing = getById(id);
		if (postulacion.getEstado() != null) {
			existing.setEstado(postulacion.getEstado());
		}
		return postulacionRepo.save(existing);
	}

	// DELETE
	public void delete(Long id) {
		postulacionRepo.deleteById(id);
	}
}
