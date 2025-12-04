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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FeedbackService {
    @Autowired
    private FeedbackRepo feedbackRepo;
    @Autowired
    private EmpresaRepository empresaRepository;
    @Autowired
    private OfertaRepo ofertaRepo;
    @Autowired
    private UsuarioRepo usuarioRepo;

    // ===== CREATE =====
    public Feedback create(Feedback request) {
        Usuario usuario = usuarioRepo.findById(request.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        request.setUsuario(usuario);

        if (request.getEmpresa() != null) {
            Empresa empresa = empresaRepository.findById(request.getEmpresa().getId())
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
            request.setEmpresa(empresa);
        }
        if (request.getOferta() != null) {
            Oferta oferta = ofertaRepo.findById(request.getOferta().getId())
                    .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
            request.setOferta(oferta);
        }
        Feedback saved = feedbackRepo.save(request);
        actualizarPuntuacionEntidad(saved);
        return saved;
    }

    // ===== READ =====
    public Feedback getById(Long id) {
        return feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback no encontrado"));
    }

    public List<Feedback> getByEmpresa(Long empresaId) {
        return feedbackRepo.findByEmpresaIdAndIsActiveTrue(empresaId);
    }

    public List<Feedback> getByOferta(Long ofertaId) {
        return feedbackRepo.findByOfertaIdAndIsActiveTrue(ofertaId);
    }

    public List<Feedback> getByUsuario(Long usuarioId) {
        return feedbackRepo.findByUsuarioIdAndIsActiveTrue(usuarioId);
    }

    public Feedback getByUsuarioAndEmpresa(Long usuarioId, Long empresaId) {
        return feedbackRepo.findByUsuarioIdAndEmpresaIdAndIsActiveTrue(usuarioId, empresaId)
                .orElse(null);
    }

    // ===== UPDATE =====
    public Feedback update(Long id, Feedback request) {
        Feedback existente = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback no encontrado"));
        existente.setTitulo(request.getTitulo());
        existente.setDescripcion(request.getDescripcion());
        existente.setPuntuacion(request.getPuntuacion());
        Feedback saved = feedbackRepo.save(existente);
        actualizarPuntuacionEntidad(saved);
        return saved;
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Feedback existente = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback no encontrado"));
        feedbackRepo.delete(existente);
        actualizarPuntuacionEntidad(existente);
    }

    // ===== HELPER PARA @PreAuthorize =====
    public boolean esOwner(Long feedbackId, Long usuarioId) {
        return feedbackRepo.findById(feedbackId)
                .map(f -> f.getUsuario().getId().equals(usuarioId))
                .orElse(false);
    }

    // ===== LÓGICA DE NEGOCIO =====
    private void actualizarPuntuacionEntidad(Feedback feedback) {
        if (feedback.getEmpresa() != null) {
            Long empresaId = feedback.getEmpresa().getId();
            List<Feedback> feedbacks = feedbackRepo.findByEmpresaIdAndIsActiveTrue(empresaId);
            double promedio = feedbacks.stream()
                    .mapToDouble(f -> f.getPuntuacion() != null ? f.getPuntuacion() : 0.0)
                    .average().orElse(0.0);
            Empresa empresa = feedback.getEmpresa();
            empresa.setPuntuacion((float) promedio);
            empresaRepository.save(empresa);
        }
        if (feedback.getOferta() != null) {
            Long ofertaId = feedback.getOferta().getId();
            List<Feedback> feedbacks = feedbackRepo.findByOfertaIdAndIsActiveTrue(ofertaId);
            double promedio = feedbacks.stream()
                    .mapToDouble(f -> f.getPuntuacion() != null ? f.getPuntuacion() : 0.0)
                    .average().orElse(0.0);
            Oferta oferta = ofertaRepo.findById(ofertaId)
                    .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
            oferta.setPuntuacion((float) promedio);
            ofertaRepo.save(oferta);
        }
    }
}
