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

	// ===== LISTAR TODAS (ADMIN) =====
	public List<Postulacion> listarTodas() {
		return postulacionRepo.findAll();
	}

	// ===== CREACIÓN =====
	public Postulacion crearPostulacion(Long aspiranteId, Long ofertaId) {
		if (aspiranteId == null) {
			throw new IllegalArgumentException("El ID del aspirante es obligatorio");
		}
		if (ofertaId == null) {
			throw new IllegalArgumentException("El ID de la oferta es obligatorio");
		}

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
		Postulacion postulacion = new Postulacion();
		postulacion.setAspirante(aspirante);
		postulacion.setOferta(oferta);
		postulacion.setEstado(Estado.PENDIENTE);
		postulacion.setIsActive(true);

		return postulacionRepo.save(postulacion);
	}

	// ===== READ =====
	public Postulacion obtenerPorId(Long id) {
		return postulacionRepo.findById(id)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));
	}

	public List<Postulacion> listarPorOferta(Long ofertaId) {
		ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> listarPorAspirante(Long aspiranteId) {
		return postulacionRepo.findByAspiranteId(aspiranteId);
	}

	// ===== UPDATE =====
	public Postulacion cambiarEstado(Postulacion postulacion) {
		return postulacionRepo.save(postulacion);
	}

	// ===== DELETE =====
	public void eliminarPostulacion(Long postulacionId) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));
		postulacionRepo.delete(postulacion);
	}
}
