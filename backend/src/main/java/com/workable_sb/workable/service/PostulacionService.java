package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private UsuarioRepo usuarioRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	// ===== CREACIÓN =====
	public Postulacion crearPostulacion(Long usuarioId, Long ofertaId) {
		Usuario aspirante = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// Validar que la oferta existe
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar que la oferta está ABIERTA
		if (oferta.getEstado() != EstadoOferta.ABIERTA) {
			throw new IllegalStateException("Solo puedes postularte a ofertas abiertas");
		}

		// Validar que no exista ya una postulación
		if (postulacionRepo.findByUsuarioIdAndOfertaId(usuarioId, ofertaId).isPresent()) {
			throw new IllegalStateException("Ya te has postulado a esta oferta");
		}

		// Crear postulación
		Postulacion postulacion = new Postulacion();
		postulacion.setUsuario(aspirante);
		postulacion.setOferta(oferta);
		postulacion.setEstado(Estado.PENDIENTE);
		postulacion.setIsActive(true);

		return postulacionRepo.save(postulacion);
	}

	// ===== READ =====
	public Postulacion obtenerPorId(Long id, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(id)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada con id: " + id));

		// Validar permisos específicos (ownership o pertenencia a empresa)
		if (!puedeVerPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("No tienes permisos para ver esta postulación");
		}

		return postulacion;
	}

	public List<Postulacion> listarPorOferta(Long ofertaId, Long usuarioIdActual) {
		// Validar que la oferta existe
		Oferta oferta = ofertaRepo.findById(ofertaId)
			.orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

		// Validar permisos: ADMIN puede ver todo, RECLUTADOR solo de su empresa
		Usuario usuario = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuario.getRol() != Usuario.Rol.ADMIN) {
			// Validar que el reclutador pertenece a la empresa
			boolean perteneceAEmpresa = oferta.getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioIdActual));
			
			if (!perteneceAEmpresa) {
				throw new IllegalStateException("Solo reclutadores de esta empresa pueden ver las postulaciones");
			}
		}

		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> listarPorUsuario(Long usuarioId, Long usuarioIdActual) {
		// Validar permisos: ADMIN puede ver todo, otros solo sus propias postulaciones
		Usuario usuarioActual = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuarioActual.getRol() != Usuario.Rol.ADMIN && !usuarioId.equals(usuarioIdActual)) {
			throw new IllegalStateException("Solo puedes ver tus propias postulaciones");
		}

		return postulacionRepo.findByUsuarioId(usuarioId);
	}

	public List<Postulacion> listarPorOfertaYEstado(Long ofertaId, Estado estado, Long usuarioIdActual) {
		listarPorOferta(ofertaId, usuarioIdActual);
		return postulacionRepo.findByOfertaIdAndEstado(ofertaId, estado);
	}

	public List<Postulacion> listarPorUsuarioYEstado(Long usuarioId, Estado estado, Long usuarioIdActual) {
		listarPorUsuario(usuarioId, usuarioIdActual);
		return postulacionRepo.findByUsuarioIdAndEstado(usuarioId, estado);
	}

	public boolean yaSePostulo(Long usuarioId, Long ofertaId) {
		return postulacionRepo.findByUsuarioIdAndOfertaId(usuarioId, ofertaId).isPresent();
	}

	// ===== UPDATE =====
	public Postulacion cambiarEstado(Long postulacionId, Estado nuevoEstado, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		// Validar permisos específicos (pertenencia a empresa)
		if (!puedeModificarPostulacion(postulacion, usuarioIdActual)) {
			throw new IllegalStateException("Solo reclutadores de esta empresa pueden cambiar el estado");
		}

		postulacion.setEstado(nuevoEstado);
		return postulacionRepo.save(postulacion);
	}

	// ===== DELETE =====
	public void eliminarPostulacion(Long postulacionId, Long usuarioIdActual) {
		Postulacion postulacion = postulacionRepo.findById(postulacionId)
			.orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

		Usuario usuario = usuarioRepo.findById(usuarioIdActual)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (usuario.getRol() != Usuario.Rol.ADMIN && 
			!postulacion.getUsuario().getId().equals(usuarioIdActual)) {
			throw new IllegalStateException("Solo puedes eliminar tus propias postulaciones");
		}

		postulacionRepo.delete(postulacion);
	}
	private boolean puedeVerPostulacion(Postulacion postulacion, Long usuarioId) {
		Usuario usuario = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// ADMIN puede ver todo
		if (usuario.getRol() == Usuario.Rol.ADMIN) {
			return true;
		}

		// El aspirante puede ver sus propias postulaciones
		if (usuario.getRol() == Usuario.Rol.ASPIRANTE && 
			postulacion.getUsuario().getId().equals(usuarioId)) {
			return true;
		}

		// Reclutador de la empresa puede ver postulaciones de sus ofertas
		if (usuario.getRol() == Usuario.Rol.RECLUTADOR) {
			return postulacion.getOferta().getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioId));
		}

		return false;
	}

	private boolean puedeModificarPostulacion(Postulacion postulacion, Long usuarioId) {
		Usuario usuario = usuarioRepo.findById(usuarioId)
			.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		// ADMIN siempre puede
		if (usuario.getRol() == Usuario.Rol.ADMIN) {
			return true;
		}

		// Reclutador de la empresa puede modificar
		if (usuario.getRol() == Usuario.Rol.RECLUTADOR) {
			return postulacion.getOferta().getEmpresa().getReclutadores().stream()
				.anyMatch(r -> r.getId().equals(usuarioId));
		}

		return false;
	}
}
