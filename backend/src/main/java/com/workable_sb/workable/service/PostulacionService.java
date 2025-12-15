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
import com.workable_sb.workable.service.AdminValidationService;

@Service
@Transactional
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private AspiranteRepo aspiranteRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	@Autowired
	private AdminValidationService adminValidationService;

	// ===== LISTAR TODAS (ADMIN) =====
	public List<Postulacion> listarTodas() {
		return postulacionRepo.findAll();
	}

	// ===== CREACIÓN =====
	public Postulacion crearPostulacion(Long aspiranteId, Long ofertaId, Long usuarioIdActual) {
		if (aspiranteId == null) {
			throw new IllegalArgumentException("El ID del aspirante es obligatorio");
		}
		if (ofertaId == null) {
			throw new IllegalArgumentException("El ID de la oferta es obligatorio");
		}
		if (usuarioIdActual == null) {
			throw new IllegalArgumentException("El ID del usuario actual es obligatorio");
		}

		// Validar que no exista ya una postulación
		if (postulacionRepo.findByAspiranteIdAndOfertaId(aspiranteId, ofertaId).isPresent()) {
			throw new IllegalStateException("Ya existe una postulación para este aspirante en esta oferta");
		}

		if (!adminValidationService.isAdmin()) {
			Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
				.orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

			// Validar que el usuario actual sea el aspirante (solo puedes postularte por ti mismo)
			if (!aspiranteId.equals(usuarioIdActual)) {
				throw new IllegalStateException("Solo puedes postularte en nombre de ti mismo");
			}

			// Validar que la oferta existe
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
		} else {
			// Admin: skip validations
			Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
				.orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
			Oferta oferta = ofertaRepo.findById(ofertaId)
				.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

			Postulacion postulacion = new Postulacion();
			postulacion.setAspirante(aspirante);
			postulacion.setOferta(oferta);
			postulacion.setEstado(Estado.PENDIENTE);
			postulacion.setIsActive(true);

			return postulacionRepo.save(postulacion);
		}
	}

	// ===== READ =====
	public Postulacion obtenerPorId(Long id, Long aspiranteIdActual) {
		Postulacion postulacion = postulacionRepo.findById(id)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));

		// Validar permisos: aspirante solo puede ver sus propias postulaciones, admin ve todas
		if (!postulacion.getAspirante().getId().equals(aspiranteIdActual) && !adminValidationService.isAdmin()) {
			throw new IllegalStateException("No tienes permisos para ver esta postulación");
		}

		return postulacion;
	}

	public List<Postulacion> listarPorOferta(Long ofertaId, Long aspiranteIdActual) {
		// Validar que la oferta existe
		ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> listarPorAspirante(Long aspiranteId, Long usuarioIdActual) {
		// Validar que el usuario actual sea el aspirante (solo puedes ver tus propias postulaciones)
		if (!aspiranteId.equals(usuarioIdActual) && !adminValidationService.isAdmin()) {
			throw new IllegalStateException("No tienes permisos para ver las postulaciones de este aspirante");
		}

		return postulacionRepo.findByAspiranteId(aspiranteId);
	}

	public List<Postulacion> listarTodas() {
		return postulacionRepo.findAll();
	}

	// ===== UPDATE =====
	public Postulacion cambiarEstado(Postulacion postulacion) {
		return postulacionRepo.save(postulacion);
	}

	// ===== DELETE =====
	public void eliminarPostulacion(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		if (!postulacion.getAspirante().getId().equals(usuarioIdActual) && !adminValidationService.isAdmin()) {
			throw new IllegalStateException("Solo puedes eliminar tus propias postulaciones");
		}

		postulacionRepo.delete(postulacion);
	}
}
