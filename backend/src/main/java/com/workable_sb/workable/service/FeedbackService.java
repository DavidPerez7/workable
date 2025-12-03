package com.workable_sb.workable.service;

import com.workable_sb.workable.models.Feedback;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.FeedbackRepo;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.OfertaRepo;
import com.workable_sb.workable.repository.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepo feedbackRepo;
    @Autowired
    private EmpresaRepository empresaRepository;
    @Autowired
    private OfertaRepo ofertaRepo;
    @Autowired
    private UsuarioRepo usuarioRepo;

    // CREATE
    public Feedback create(Feedback request) {
        // Validar usuario
        Usuario usuario = usuarioRepo.findById(request.getUsuario().getId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        request.setUsuario(usuario);

        // Validar empresa/oferta (solo una puede estar presente)
        if (request.getEmpresa() != null) {
            Empresa empresa = empresaRepository.findById(request.getEmpresa().getId()).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
            request.setEmpresa(empresa);
        }
        if (request.getOferta() != null) {
            Oferta oferta = ofertaRepo.findById(request.getOferta().getId()).orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
            request.setOferta(oferta);
        }
        Feedback saved = feedbackRepo.save(request);
        actualizarPuntuacionEntidad(saved);
        return saved;
    }

    // READ
    public Optional<Feedback> getById(Long id) {
        return feedbackRepo.findById(id);
    }

    public List<Feedback> getByEmpresa(Long empresaId) {
        return feedbackRepo.findByEmpresaId(empresaId);
    }

    public List<Feedback> getByUsuario(Long usuarioId) {
        return feedbackRepo.findByUsuarioId(usuarioId);
    }

    public Optional<Feedback> getByUsuarioAndEmpresa(Long usuarioId, Long empresaId) {
        return feedbackRepo.findByUsuarioIdAndEmpresaId(usuarioId, empresaId);
    }

    // UPDATE
    public Feedback update(Long id, Feedback request) {
        Feedback existente = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback no encontrado"));
        existente.setTitulo(request.getTitulo());
        existente.setDescripcion(request.getDescripcion());
        existente.setPuntuacion(request.getPuntuacion());
        existente.setIsActive(request.getIsActive());
        Feedback saved = feedbackRepo.save(existente);
        actualizarPuntuacionEntidad(saved);
        return saved;
    }

    // DELETE
    public void delete(Long id) {
        Feedback existente = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback no encontrado"));
        feedbackRepo.delete(existente);
        actualizarPuntuacionEntidad(existente);
    }

    // Lógica adicional: calcular promedio de puntuación
    private void actualizarPuntuacionEntidad(Feedback feedback) {
        if (feedback.getEmpresa() != null) {
            Long empresaId = feedback.getEmpresa().getId();
            List<Feedback> feedbacks = feedbackRepo.findByEmpresaId(empresaId);
            double promedio = feedbacks.stream()
                    .filter(f -> f.getIsActive() == null || f.getIsActive())
                    .mapToDouble(f -> f.getPuntuacion() != null ? f.getPuntuacion() : 0.0)
                    .average().orElse(0.0);
            Empresa empresa = feedback.getEmpresa();
            empresa.setPuntuacion((float) promedio);
            empresaRepository.save(empresa);
        }
        if (feedback.getOferta() != null) {
            Long ofertaId = feedback.getOferta().getId();
            List<Feedback> feedbacks = feedbackRepo.findByOfertaId(ofertaId);
            double promedio = feedbacks.stream()
                    .filter(f -> f.getIsActive() == null || f.getIsActive())
                    .mapToDouble(f -> f.getPuntuacion() != null ? f.getPuntuacion() : 0.0)
                    .average().orElse(0.0);
            Oferta oferta = new Oferta();
            oferta = ofertaRepo.findById(feedback.getOferta().getId()).orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
            oferta.setPuntuacion((float) promedio);
            ofertaRepo.save(oferta);
        }
    }
}
