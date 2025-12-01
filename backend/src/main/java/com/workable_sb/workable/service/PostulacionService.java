package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
public class PostulacionService {
	@Autowired
	private PostulacionRepo postulacionRepo;

	@Autowired
	private UsuarioRepo usuarioRepo;

	@Autowired
	private OfertaRepo ofertaRepo;

	//READ
	public Optional<Postulacion> getById(Long id) {
		return postulacionRepo.findById(id);
	}
	public List<Postulacion> getByOferta(Long ofertaId) {
		return postulacionRepo.findByOfertaId(ofertaId);
	}

	public List<Postulacion> getByUsuario(Long usuarioId) {
		return postulacionRepo.findByUsuarioId(usuarioId);
	}

	public List<Postulacion> getByOfertaAndEstado(Long ofertaId, Estado estado) {
		return postulacionRepo.findByOfertaIdAndEstado(ofertaId, estado);
	}

	public List<Postulacion> getByUsuarioAndEstado(Long usuarioId, Estado estado) {
		return postulacionRepo.findByUsuarioIdAndEstado(usuarioId, estado);
	}

	public Optional<Postulacion> getByUsuarioAndOferta(Long usuarioId, Long ofertaId) {
		return  postulacionRepo.findByUsuarioIdAndOfertaId(usuarioId, ofertaId);
	}

	//CREATE
	public Postulacion create(Postulacion request) {
		Usuario usuario = usuarioRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("Usuario not found"));
		request.setUsuario(usuario);

		Oferta oferta = ofertaRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("Oferta not found"));
		request.setOferta(oferta);

		return postulacionRepo.save(request);
	}

	//UPDATE
	public Postulacion update(Long id, Postulacion request) {
		Postulacion existingPostulacion = postulacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Postulacion not found"));

		existingPostulacion.setIsActive(request.getIsActive());
		existingPostulacion.setEstado(request.getEstado());
		
		Oferta oferta = ofertaRepo.findById(request.getOferta().getId()).orElseThrow(() -> new RuntimeException("oferta not found"));
		existingPostulacion.setOferta(oferta);

		Usuario usuario = usuarioRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("Usuario not found"));
		existingPostulacion.setUsuario(usuario);

		return postulacionRepo.save(existingPostulacion);
	}

	//DELETE
	public void delete(Long id) {
		Postulacion existingPostulacion = postulacionRepo.findById(id).orElseThrow(() -> new RuntimeException("Postulacion not found"));
		postulacionRepo.delete(existingPostulacion);
	}
}
